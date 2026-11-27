// Black Dragon: Ascension - DSP core (AudioWorklet). ASCII only: this file is inlined as a data: URL.
// Morphing band-limited wavetable voices (unison, sub, breath, ZDF filter), FM bells, Monad drones,
// chorus, tempo echo, an 8-line FDN reverb with octave shimmer, drive, binaural bed and a safety limiter.
const SR = sampleRate, TAU = Math.PI * 2, TL = 2048, NMIP = 10;
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

// ---------- wavetables ----------
const SPECS = [
  k => (1 / k) * (k % 2 ? 1 : 0.55) * Math.exp(-k / 60),                                     // 0 warm
  null, null, null, null,                                                                       // 1-4 vowels A O U I
  k => (k % 2 ? 1 / (1 + 0.18 * k * k) : 0) + (k === 2 ? 0.25 : 0) + (k === 4 ? 0.12 : 0),        // 5 glass
  k => (k <= 3 ? 1 / k : 0) + (k === 5 ? 0.3 : 0) + (k === 8 ? 0.18 : 0) + (k === 12 ? 0.09 : 0)    // 6 bell-ish organ
];
const VOW = [[[800, 1, 140], [1150, .55, 130], [2900, .22, 220]], [[450, 1, 110], [800, .5, 110], [2830, .14, 220]],
  [[325, 1, 90], [700, .35, 110], [2530, .1, 220]], [[280, 1, 90], [2250, .5, 190], [2900, .32, 230]]];
VOW.forEach((fm, i) => { SPECS[i + 1] = k => { const f = k * 196; let a = 0; for (const [F, A, B] of fm) a += A * Math.exp(-Math.pow((f - F) / B, 2)); return (a + 0.02 / k) / Math.pow(k, 0.25) }; });
const NT = SPECS.length;
const SIN = new Float32Array(TL); for (let i = 0; i < TL; i++) SIN[i] = Math.sin(i / TL * TAU);
const TABLES = [];
for (let t = 0; t < NT; t++) {
  const mips = [];
  for (let m = 0; m < NMIP; m++) {
    const fHi = 27.5 * Math.pow(2, m + 1), maxH = clamp(Math.floor(SR * 0.45 / fHi), 1, 400), tb = new Float32Array(TL + 1);
    for (let k = 1; k <= maxH; k++) { const a = SPECS[t](k); if (Math.abs(a) < 1e-5) continue; for (let i = 0; i < TL; i++) tb[i] += a * SIN[(i * k) % TL]; }
    let pk = 0; for (let i = 0; i < TL; i++) pk = Math.max(pk, Math.abs(tb[i])); pk = pk || 1;
    for (let i = 0; i < TL; i++) tb[i] /= pk; tb[TL] = tb[0]; mips.push(tb);
  }
  TABLES.push(mips);
}
const mipFor = f => clamp(Math.floor(Math.log2(Math.max(f, 1) / 27.5)), 0, NMIP - 1);

// ---------- patches ----------
const PATCH = {
  lead: { uni: 5, det: .09, spr: .7, sub: .25, noise: .012, cut: 1400, res: .18, env: 5200, kt: .6, A: .015, D: .5, S: .72, R: 1.4, fA: .01, fD: .7, fS: .35, fR: 1.2, vib: .1, gain: .2, morphLfo: 0 },
  pad: { uni: 5, det: .16, spr: 1, sub: .35, noise: .02, cut: 520, res: .12, env: 1400, kt: .35, A: 3.6, D: 3, S: .9, R: 6.5, fA: 4, fD: 4, fS: .6, fR: 6, vib: .04, gain: .1, morphLfo: .05 },
  choir: { uni: 7, det: .12, spr: 1, sub: .1, noise: .05, cut: 2600, res: .08, env: 900, kt: .4, A: 2.4, D: 2, S: .85, R: 5, fA: 2, fD: 3, fS: .7, fR: 5, vib: .16, gain: .08, morphLfo: .11 },
  bass: { uni: 3, det: .05, spr: .4, sub: .7, noise: 0, cut: 260, res: .1, env: 500, kt: .2, A: 4, D: 3, S: .9, R: 7, fA: 4, fD: 3, fS: .7, fR: 6, vib: 0, gain: .14, morphLfo: 0 }
};

class Voice {
  constructor() { this.on = false; this.amp = 0; this.ph = new Float64Array(9); this.ic = new Float64Array(4); }
  start(id, f, vel, p, g, shape) {
    const P = PATCH[p] || PATCH.lead; this.P = P; this.id = id; this.f = f; this.vel = vel; this.gate = true; this.on = true; this.age = 0; this.g = g == null ? 1 : g;
    this.shape0 = shape; this.lfoPh = Math.random() * TAU; this.vibPh = Math.random() * TAU;
    if (this.amp < 1e-4) { for (let i = 0; i < 9; i++) this.ph[i] = Math.random(); this.ic.fill(0); this.fenv = 0; }
    this.stage = 0; this.fstage = 0;
    const n = P.uni; this.dets = []; this.pans = [];
    for (let u = 0; u < n; u++) { const x = n === 1 ? 0 : u / (n - 1) * 2 - 1; this.dets.push(Math.pow(2, x * P.det / 12)); this.pans.push(x * P.spr); }
  }
  release() { this.gate = false; this.stage = 3; this.fstage = 3; }
}
class Bell { constructor() { this.on = false } start(f, v, pan, dec, ratio) { this.on = true; this.f = f; this.v = v; this.pan = pan; this.dec = dec; this.r = ratio; this.t = 0; this.pc = 0; this.pm = 0; } }

// ---------- effects primitives ----------
class Line { constructor(n) { this.b = new Float32Array(n); this.n = n; this.w = 0 } push(x) { this.b[this.w] = x; this.w = (this.w + 1) % this.n } tap(d) { let r = this.w - d; while (r < 0) r += this.n; const i = Math.floor(r), f = r - i, a = this.b[i % this.n], b = this.b[(i + 1) % this.n]; return a + (b - a) * f } clear() { this.b.fill(0) } }
class AP { constructor(n, g) { this.l = new Line(n); this.d = n - 1; this.g = g } run(x) { const v = this.l.tap(this.d), y = -this.g * x + v; this.l.push(x + this.g * y); return y } }

class Ascension extends AudioWorkletProcessor {
  constructor() {
    super();
    this.V = Array.from({ length: 18 }, () => new Voice()); this.B = Array.from({ length: 14 }, () => new Bell());
    this.p = { shape: 1, bloom: .5, shimmer: .45, space: .7, echo: .2, drive: .25, rev: 0, hold: 0, root: 136.1, master: .8, bin: .03, beat: 6, carrier: 136.1, air: .02, bpm: 120, width: 1, mute: 0 };
    this.s = Object.assign({}, this.p); // smoothed copy
    const ms = x => Math.round(x * SR / 1000);
    this.chL = new Line(ms(60)); this.chR = new Line(ms(60)); this.chPh = 0;
    this.eL = new Line(Math.round(SR * 2.1)); this.eR = new Line(Math.round(SR * 2.1)); this.eLP = [0, 0];
    this.pre = new Line(ms(40));
    this.dif = [142, 107, 379, 277].map((n, i) => new AP(Math.round(n * SR / 29761), i < 2 ? .72 : .62));
    const FL = [37.1, 41.3, 47.9, 53.7, 59.3, 67.1, 73.9, 83.3];
    this.fdn = FL.map(m => ({ line: new Line(ms(m * 1.8) + 64), base: ms(m), lp: 0, ph: Math.random() * TAU, rate: .1 + Math.random() * .5 }));
    this.outs = new Float32Array(8); this.sh = new Line(4096); this.shPh = 0; this.shOut = 0; this.shHP = 0; this.shLP = 0;
    this.mon = [0, 0, 0, 0]; this.monPh = [0, 0, 0, 0, 0, 0, 0, 0]; this.rsN = 0; this.rsBP = [0, 0]; this.airLP = [0, 0, 0];
    this.binPh = [0, 0]; this.lim = 1; this.lvlAcc = 0; this.lvlN = 0; this.pk = 0;
    this.port.onmessage = e => this.msg(e.data);
  }
  msg(m) {
    switch (m.t) {
      case 'on': { let v = this.V.find(x => x.on && x.id === m.id); if (!v) v = this.V.find(x => !x.on) || this.V.filter(x => !x.gate).sort((a, b) => a.amp - b.amp)[0] || this.V.sort((a, b) => b.age - a.age)[0]; v.start(m.id, m.f, m.v == null ? .8 : m.v, m.p || 'lead', m.g, this.p.shape); break }
      case 'off': this.V.forEach(v => { if (v.on && v.id === m.id && v.gate) v.release() }); break;
      case 'offPrefix': this.V.forEach(v => { if (v.on && v.gate && String(v.id).startsWith(m.pre)) v.release() }); break;
      case 'glide': this.V.forEach(v => { if (v.on && v.id === m.id) v.f = m.f }); break;
      case 'bell': { const b = this.B.find(x => !x.on) || this.B.sort((a, c) => c.t - a.t)[0]; b.start(m.f, m.v || .3, m.pan || 0, m.dec || 4, m.r || 3.5); break }
      case 'set': if (m.k in this.p) this.p[m.k] = m.v; break;
      case 'setMany': Object.assign(this.p, m.v); break;
      case 'allOff': this.V.forEach(v => { if (v.on && v.gate) v.release() }); break;
      case 'panic': this.V.forEach(v => { v.on = false; v.amp = 0 }); this.B.forEach(b => b.on = false); [this.chL, this.chR, this.eL, this.eR, this.pre, this.sh].forEach(l => l.clear()); this.fdn.forEach(d => { d.line.clear(); d.lp = 0 }); this.dif.forEach(a => a.l.clear()); this.shOut = 0; break;
    }
  }
  process(_, outputs) {
    const out = outputs[0], L = out[0], R = out[1] || out[0], N = L.length, p = this.p, s = this.s;
    for (const k in p) s[k] += (p[k] - s[k]) * (k === 'root' || k === 'bpm' ? 1 : .08);
    const bloom = s.bloom, rev = s.rev, shapeG = s.shape;
    // per-block voice prep
    const act = [];
    for (const v of this.V) {
      if (!v.on) continue; v.age += N; const P = v.P;
      v.lfoPh += TAU * P.morphLfo * N / SR; const shp = clamp(shapeG + Math.sin(v.lfoPh) * (P.morphLfo ? 1.4 : 0), 0, NT - 1.001);
      v.t0 = Math.floor(shp); v.tf = shp - v.t0; const fmain = v.f; v.mip = mipFor(fmain * Math.pow(2, P.det / 12) * 1.2);
      v.vibPh += TAU * 5.1 * N / SR; const vibD = P.vib * Math.min(1, v.age / (SR * .6)); v.fm = Math.pow(2, Math.sin(v.vibPh) * vibD / 12);
      v.inc = v.dets.map(d => fmain * d * v.fm / SR); v.subInc = fmain * .5 * v.fm / SR;
      const coef = st => 1 - Math.exp(-1 / (Math.max(.002, st) * SR));
      v.cA = 1 / (Math.max(.002, P.A) * SR); v.cD = coef(P.D / 4); v.cR = coef(P.R / 6); v.fcA = 1 / (Math.max(.002, P.fA) * SR); v.fcD = coef(P.fD / 4); v.fcR = coef(P.fR / 6);
      v.cutBase = P.cut * (.35 + bloom * 1.9) * Math.pow(fmain / 261.6, P.kt) * (1 + rev * 2.5); v.envAmt = P.env * (.4 + bloom);
      act.push(v);
    }
    const nyq = SR * .45, monRoot = s.root * .5, beat = 60 / clamp(s.bpm, 30, 300);
    const dL = clamp(beat * .75 * SR, 10, this.eL.n - 4), dR = clamp(beat * SR, 10, this.eR.n - 4);
    const rt = 1.6 + s.space * s.space * 16 + rev * 6, size = .55 + s.space * .5;
    const gains = this.fdn.map(d => Math.pow(10, -3 * (d.base * size) / (rt * SR)));
    const damp = .25 + (1 - s.space) * .25, wet = .12 + s.space * .55 + rev * .1, shim = clamp(s.shimmer * .55 + rev * .25, 0, .72);
    const echoMix = s.echo * .6, drive = 1 + s.drive * 3 + rev * .8, master = s.master * (1 - s.mute);
    for (let i = 0; i < N; i++) {
      let sl = 0, sr = 0;
      for (const v of act) {
        const P = v.P;
        // amp env
        if (v.stage === 0) { v.amp += v.cA; if (v.amp >= 1) { v.amp = 1; v.stage = 1 } }
        else if (v.stage === 1) { v.amp += (P.S - v.amp) * v.cD }
        else if (v.stage === 3) { v.amp += (0 - v.amp) * v.cR; if (v.amp < 1e-4) { v.on = false; v.amp = 0; continue } }
        if (v.fstage === 0) { v.fenv += v.fcA; if (v.fenv >= 1) { v.fenv = 1; v.fstage = 1 } } else if (v.fstage === 1) v.fenv += (P.fS - v.fenv) * v.fcD; else v.fenv += (0 - v.fenv) * v.fcR;
        let ol = 0, or = 0; const ta = TABLES[v.t0][v.mip], tb = TABLES[Math.min(NT - 1, v.t0 + 1)][v.mip], tf = v.tf, n = v.inc.length;
        for (let u = 0; u < n; u++) {
          let ph = v.ph[u] + v.inc[u]; if (ph >= 1) ph -= 1; v.ph[u] = ph;
          const x = ph * TL, j = x | 0, fr = x - j, a = ta[j] + (ta[j + 1] - ta[j]) * fr, b = tb[j] + (tb[j + 1] - tb[j]) * fr, smp = a + (b - a) * tf;
          const pn = v.pans[u]; ol += smp * (1 - pn) * .5; or += smp * (1 + pn) * .5;
        }
        ol /= Math.sqrt(n); or /= Math.sqrt(n);
        let sp = v.ph[8] + v.subInc; if (sp >= 1) sp -= 1; v.ph[8] = sp; const sub = Math.sin(sp * TAU) * P.sub;
        const nz = (Math.random() * 2 - 1) * P.noise; ol += sub + nz; or += sub + nz;
        // ZDF SVF lowpass, coefficients every 16 samples
        if ((i & 15) === 0) { const fc = clamp(v.cutBase + v.envAmt * v.fenv, 30, nyq); const g = Math.tan(Math.PI * fc / SR), k = 2 - 2 * P.res; v.a1 = 1 / (1 + g * (g + k)); v.a2 = g * v.a1; v.a3 = g * v.a2; }
        const ic = v.ic;
        let v3 = ol - ic[1], v1 = v.a1 * ic[0] + v.a2 * v3, v2 = ic[1] + v.a2 * ic[0] + v.a3 * v3; ic[0] = 2 * v1 - ic[0]; ic[1] = 2 * v2 - ic[1]; const fl = v2;
        v3 = or - ic[3]; v1 = v.a1 * ic[2] + v.a2 * v3; v2 = ic[3] + v.a2 * ic[2] + v.a3 * v3; ic[2] = 2 * v1 - ic[2]; ic[3] = 2 * v2 - ic[3]; const fr2 = v2;
        const gA = v.amp * v.amp * P.gain * v.vel * v.g; sl += fl * gA; sr += fr2 * gA;
      }
      // FM bells
      for (const b of this.B) {
        if (!b.on) continue; b.t++; const tt = b.t / SR, env = Math.exp(-tt * 4.6 / b.dec) * Math.min(1, b.t / 40); if (env < 1e-4) { b.on = false; continue }
        b.pm += b.f * b.r / SR; if (b.pm >= 1) b.pm -= 1; b.pc += b.f / SR; if (b.pc >= 1) b.pc -= 1;
        const idx = 2.2 * Math.exp(-tt * 3 / b.dec) + .3, x = Math.sin(b.pc * TAU + idx * Math.sin(b.pm * TAU)) * env * b.v * .5;
        sl += x * (1 - b.pan) * .5; sr += x * (1 + b.pan) * .5;
      }
      // Monad: tetractys drones and riser
      if (rev > .002 || s.hold > .002) {
        for (let k = 0; k < 4; k++) {
          const tgt = clamp((rev - k * .22) / .25, 0, 1); this.mon[k] += (tgt - this.mon[k]) * .0004;
          let ph = this.monPh[k] + monRoot * (k + 1) / SR; if (ph >= 1) ph -= 1; this.monPh[k] = ph; let ph2 = this.monPh[k + 4] + monRoot * (k + 1) * 1.003 / SR; if (ph2 >= 1) ph2 -= 1; this.monPh[k + 4] = ph2;
          const x = (Math.sin(ph * TAU) + .35 * Math.sin(ph2 * TAU * 2)) * this.mon[k] * .05 / (1 + k * .3); sl += x * (k % 2 ? .7 : 1); sr += x * (k % 2 ? 1 : .7);
        }
        const fc = 180 * Math.pow(40, rev), g = Math.tan(Math.PI * Math.min(fc, nyq) / SR), q = 3;
        const nz = Math.random() * 2 - 1, bp = this.rsBP; const hp = (nz - (1 / q + g) * bp[0] - bp[1]) / (1 + g / q + g * g), bpo = g * hp + bp[0]; bp[0] = g * hp + bpo; const lpo = g * bpo + bp[1]; bp[1] = g * bpo + lpo;
        const rs = bpo * (s.hold * .045 + rev * .008); sl += rs; sr += rs;
      }
      // air
      if (s.air > .001) { const w = Math.random() * 2 - 1, a = this.airLP; a[0] = a[0] * .995 + w * .005 * 8; a[1] += (w - a[1]) * .08; const x = (a[1] - a[0] * .2) * s.air; sl += x; sr -= x * .6; }
      // chorus
      this.chPh += 1 / SR; const m1 = Math.sin(this.chPh * TAU * .31) * .5 + .5, m2 = Math.sin(this.chPh * TAU * .37 + 1.7) * .5 + .5;
      this.chL.push(sl); this.chR.push(sr); const cl = this.chL.tap(SR * (.014 + m1 * .008)), cr = this.chR.tap(SR * (.017 + m2 * .008)); sl = sl * .82 + cr * .35; sr = sr * .82 + cl * .35;
      // tempo echo (ping-pong)
      const eo = this.eL.tap(dL), er = this.eR.tap(dR); this.eLP[0] += (eo - this.eLP[0]) * .35; this.eLP[1] += (er - this.eLP[1]) * .35;
      this.eL.push((sl + sr) * .5 * echoMix + this.eLP[1] * .46); this.eR.push(this.eLP[0] * .46);
      const dryL = sl + this.eLP[0] * echoMix * 1.2, dryR = sr + this.eLP[1] * echoMix * 1.2;
      // reverb input with shimmer feedback
      this.pre.push((dryL + dryR) * .5 + this.shOut * shim);
      let x = this.pre.tap(Math.round(SR * .022)); for (const a of this.dif) x = a.run(x);
      const outs = this.outs; for (let k = 0; k < 8; k++) { const d = this.fdn[k]; d.ph += TAU * d.rate / SR; outs[k] = d.line.tap(d.base * size + 8 + Math.sin(d.ph) * 7) }
      let sum = 0; for (const o of outs) sum += o; sum *= .25;
      let wl = 0, wr = 0;
      for (let k = 0; k < 8; k++) { const d = this.fdn[k]; let y = outs[k] - sum; d.lp += (y - d.lp) * (1 - damp); d.line.push(x * (k % 2 ? .6 : -.6) + d.lp * gains[k]); if (k % 2) wr += outs[k] * (k & 2 ? -1 : 1); else wl += outs[k] * (k & 4 ? -1 : 1); }
      wl *= .35; wr *= .35;
      // octave shimmer: two-tap grain pitch shifter on the reverb
      this.sh.push((wl + wr) * .5); this.shPh += 1 / 2048; if (this.shPh >= 1) this.shPh -= 1;
      const W = 2048, d1 = (1 - this.shPh) * W + 4, d2 = (1 - ((this.shPh + .5) % 1)) * W + 4, w1 = Math.sin(this.shPh * Math.PI), w2 = Math.sin(((this.shPh + .5) % 1) * Math.PI);
      let so = this.sh.tap(d1) * w1 * w1 + this.sh.tap(d2) * w2 * w2; this.shHP += (so - this.shHP) * .02; so -= this.shHP; this.shLP += (so - this.shLP) * .45; this.shOut = this.shLP;
      let ol = dryL * (1 - wet * .35) + wl * wet * 1.6, or = dryR * (1 - wet * .35) + wr * wet * 1.6;
      const mid = (ol + or) * .5, side = (ol - or) * .5 * s.width; ol = mid + side; or = mid - side;
      ol = Math.tanh(ol * drive) / Math.tanh(drive) * 1.05; or = Math.tanh(or * drive) / Math.tanh(drive) * 1.05;
      // binaural bed (after FX, untouched)
      this.binPh[0] += s.carrier / SR; this.binPh[1] += (s.carrier + s.beat) / SR; if (this.binPh[0] >= 1) this.binPh[0] -= 1; if (this.binPh[1] >= 1) this.binPh[1] -= 1;
      ol += Math.sin(this.binPh[0] * TAU) * s.bin; or += Math.sin(this.binPh[1] * TAU) * s.bin;
      // limiter
      const pk = Math.max(Math.abs(ol), Math.abs(or)) * master, tg = pk > .89 ? .89 / pk : 1; this.lim = tg < this.lim ? tg : this.lim + (1 - this.lim) * .0004;
      ol *= master * this.lim; or *= master * this.lim; L[i] = ol; if (R !== L) R[i] = or;
      this.lvlAcc += ol * ol + or * or; this.lvlN += 2; this.pk = Math.max(this.pk, pk);
    }
    if (this.lvlN > SR / 30) { this.port.postMessage({ lvl: Math.sqrt(this.lvlAcc / this.lvlN), pk: this.pk, voices: act.length }); this.lvlAcc = 0; this.lvlN = 0; this.pk = 0; }
    return true;
  }
}
registerProcessor('ascension', Ascension);
