/* Black Dragon II: Luxuria's breath and tide. Loaded last; shares the globals of the other scripts.

   SPIRITUS  one breath clock for the whole board, and a breath that is really drawn in and let go.
             The ring on the dial, the swell of the body chord and the breath sound all follow the same clock.
             Six breaths a minute by default, four to seven by the slider.
   AESTUS    a tide of heat: three waves, each longer and higher than the last. Every wave builds slowly from the dark,
             holds on a chord that leans and will not settle, breaks once (a low tone and a high one arriving together),
             then lets go into slow breath. Level, brightness, harmony, breath and pulse all move together.

   Both live on the Luxuria stone, are off until pressed, and show in "sounding now".
   Nothing here goes near the tone channel, and nothing here changes Umbra or the parts Umbra is built from. */
{
const IN=.40,TURN=.02,EX=.50;                     /* shares of one breath: in, the turn, out; the rest is stillness */
const curve=f=>{const a=new Float32Array(48);for(let i=0;i<48;i++)a[i]=f(i/47);return a};
const hump=(rise,tail)=>curve(x=>x<rise?.5-.5*Math.cos(Math.PI*x/rise):tail+(1-tail)*(.5+.5*Math.cos(Math.PI*(x-rise)/(1-rise))));
const C_IN=hump(.62,.22),C_EX=hump(.24,0),C_UP=curve(x=>-Math.cos(Math.PI*x)),C_DN=curve(x=>Math.cos(Math.PI*x));
const smooth=(x,a,b)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};

/* ---------- the breath clock ---------- */
const BC={P0:10,P:10,cyc:[],subs:new Set(),iv:null,raf:0,body:null,bodyG:null,
  on(){return !!this.iv},
  shape(ph){return ph<IN?.5-.5*Math.cos(Math.PI*ph/IN):ph<IN+TURN?1:ph<IN+TURN+EX?.5+.5*Math.cos(Math.PI*(ph-IN-TURN)/EX):0},
  now(){const t=A.ctx.currentTime;for(let i=this.cyc.length-1;i>=0;i--){const c=this.cyc[i];if(t>=c.t0)return this.shape(Math.min(1,(t-c.t0)/c.P))}return 0},
  tick(){const ctx=A.ctx,t=ctx.currentTime;let c=this.cyc[this.cyc.length-1];
    if(c&&c.t0+c.P<t-1)c=null;                    /* the tab slept: start again from now */
    while(!c||c.t0+c.P<t+.7){c={t0:c?c.t0+c.P:t+.12,P:this.P};this.cyc.push(c);this.sched(c);this.subs.forEach(f=>f(c.t0,c.P))}
    while(this.cyc.length>4)this.cyc.shift()},
  /* the body chord swells with the breath, in place of its own free-running swell */
  sched(c){const o=this.body.offset;try{o.setValueCurveAtTime(C_UP,c.t0,IN*c.P);o.setValueCurveAtTime(C_DN,c.t0+(IN+TURN)*c.P,EX*c.P)}catch(_){}},
  start(){if(this.iv||!A.ctx)return;const ctx=A.ctx;
    if(!this.body){this.body=ctx.createConstantSource();this.body.offset.value=-1;this.bodyG=gn(ctx,0);this.body.connect(this.bodyG).connect(A.body.gain);this.body.start()}
    this.cyc=[];this.tick();this.iv=setInterval(()=>{if(A.ctx.state==='running')this.tick()},100);
    /* the ring on the dial reads its phase from breathT0, so the clock keeps that in step with the true breath */
    const loop=()=>{if(!this.iv)return;if(S.breath)A.breathT0=A.ctx.currentTime-Math.acos(1-2*this.now())/(2*Math.PI)*10;this.raf=requestAnimationFrame(loop)};loop();applyAll()},
  stop(){if(!this.iv)return;clearInterval(this.iv);this.iv=null;cancelAnimationFrame(this.raf);const t=A.ctx.currentTime,o=this.body.offset;
    o.cancelScheduledValues(t);o.setTargetAtTime(-1,t,.4);this.cyc=[];applyAll()},
  join(f){this.subs.add(f);this.start()},
  leave(f){this.subs.delete(f);if(!this.subs.size)this.stop()}};
{const a0=applyAll;applyAll=function(){a0.apply(this,arguments);if(!A.ctx||!BC.bodyG)return;const run=BC.on();
   if(run)at(A.brG.gain,0,.4);at(BC.bodyG.gain,run&&S.breath?S.body*.28:0,.4)}}

/* ---------- Spiritus: the breath itself ---------- */
const SPIRITUS={id:'spiritus',n:'spiritus',cat:'luxuria stone',tag:ST,verb:1,env:'lust',lvl:1,
  info:'Spiritus. One breath, drawn in and let go, at the pace of the ring. In through a narrowing throat, out lower and longer, then stillness. Six a minute.',
  gen:(ctx,out,L)=>{
    const sI=loopN(ctx,NB.pink),sE=loopN(ctx,NB.pink),sC=loopN(ctx,NB.brown);L.src.push(sI,sE,sC);
    const fI=bq(ctx,'bandpass',500,1.5),gI=gn(ctx,0),pI=ctx.createStereoPanner();pI.pan.value=-.14;
    const fE=bq(ctx,'bandpass',1100,.85),lE=bq(ctx,'lowpass',1500,.6),gE=gn(ctx,0),pE=ctx.createStereoPanner();pE.pan.value=.14;
    const lC=bq(ctx,'lowpass',230,.6),gC=gn(ctx,0);
    sI.connect(fI).connect(bq(ctx,'lowpass',2100,.6)).connect(gI).connect(pI).connect(out);
    sE.connect(fE).connect(lE).connect(gE).connect(pE).connect(out);
    sC.connect(lC).connect(gC).connect(out);                                  /* the chest: a low warmth under the out-breath */
    const one=(t0,P)=>{const tin=IN*P,tex=EX*P,t1=t0+(IN+TURN)*P;try{
      fI.frequency.setValueAtTime(500,t0);fI.frequency.exponentialRampToValueAtTime(1450,t0+tin);
      gI.gain.setValueCurveAtTime(C_IN.map(v=>v*.5),t0,tin);
      fE.frequency.setValueAtTime(1100,t1);fE.frequency.exponentialRampToValueAtTime(400,t1+tex);
      gE.gain.setValueCurveAtTime(C_EX.map(v=>v*.82),t1,tex);
      gC.gain.setValueCurveAtTime(C_EX.map(v=>v*.5),t1,tex)}catch(_){}};
    BC.join(one);const stop=L.stop;L.stop=function(){BC.leave(one);stop.call(this)}}};
BANK.push(SPIRITUS);BK.spiritus=SPIRITUS;

/* ---------- Aestus: build, hold, break, release ---------- */
const AE={run:null,len:6};
const WAVES=[[.20,.62,.16],[.26,.80,.28],[.34,1,0]],SETTLE=.08;     /* share of the whole, height, the floor it falls back to */
/* where the tide stands at k (0 to 1 through the whole): intensity, the phase by name, and how far through the wave's release */
const tideAt=k=>{if(k<SETTLE)return{I:0,ph:'settling',w:-1,rel:0};let a=SETTLE,floor=0;
  for(let w=0;w<WAVES.length;w++){const [len,h,fl]=WAVES[w],x=(k-a)/len;
    if(x<1){if(x<.66)return{I:floor+(h-floor)*Math.pow(x/.66,1.7),ph:'rising',w,rel:0};
      if(x<.80)return{I:h,ph:'held',w,rel:0};
      const r=(x-.80)/.20;return{I:fl+(h-fl)*(.5+.5*Math.cos(Math.PI*Math.max(0,(r-.25)/.75))),ph:'released',w,rel:r,peak:true}}
    a+=len;floor=fl}
  return{I:0,ph:'afterglow',w:9,rel:1}};
const aeRoot=()=>{let r=S.fc;while(r<80)r*=2;while(r>160)r/=2;return r};
function aeStart(){
  if(!A.ctx||AE.run)return;const ctx=A.ctx,t=ctx.currentTime,r=aeRoot(),R={t0:t,T:AE.len*60,src:[],w:-1,ph:'',beat0:S.beat,lock:S.beat>=.85&&S.beat<=1.45,P0:BC.P0,next:0,tick:null};
  const out=gn(ctx,0),sh=bq(ctx,'highshelf',4200,.7);sh.gain.value=-5;out.connect(sh);sh.connect(A.bankBus);sh.connect(A.bankVerb);R.out=out;R.sh=sh;
  const lp=bq(ctx,'lowpass',320,.6),pad=gn(ctx,.25);lp.connect(pad).connect(out);R.lp=lp;R.pad=pad;
  /* the chord: root and fifth, a fourth that leans over the third, then a seventh and a ninth that arrive as the heat rises */
  const voice=(ratio,type,lvl,gate)=>{const g=gn(ctx,gate?0:lvl),os=[];(MOBILE?[0]:[-1,1]).forEach(sg=>{const o=ctx.createOscillator(),p=ctx.createStereoPanner();o.type=type;o.frequency.value=r*ratio;o.detune.value=sg*5;p.pan.value=sg*.55;
      o.connect(p).connect(g);o.start();os.push(o);R.src.push(o)});g.connect(lp);return{g,os,ratio,lvl}};
  R.v=[voice(1,'triangle',.5),voice(1.5,'triangle',.3),voice(8/3,'sawtooth',.13),voice(32/9,'triangle',.12,1),voice(4.5,'sine',.09,1)];R.sus=R.v[2];
  /* the break: a low tone under everything and a high breathy one over it, arriving together */
  const sub=ctx.createOscillator(),subG=gn(ctx,0);sub.frequency.value=r/2;sub.connect(subG).connect(out);sub.start();R.src.push(sub);R.sub=sub;R.subG=subG;
  const hi=ctx.createOscillator(),hi2=ctx.createOscillator(),hiG=gn(ctx,0),hn=loopN(ctx,NB.pink),hf=bq(ctx,'bandpass',r*6,5),hnG=gn(ctx,.5),vib=ctx.createOscillator(),vg=gn(ctx,0);
  hi.frequency.value=r*6;hi2.frequency.value=r*3;vib.frequency.value=4.7;vib.connect(vg);vg.connect(hi.frequency);const h2g=gn(ctx,.5);
  hi.connect(hiG);hi2.connect(h2g).connect(hiG);hn.connect(hf).connect(hnG).connect(hiG);hiG.connect(bq(ctx,'lowpass',2300,.6)).connect(out);
  [hi,hi2,vib].forEach(o=>{o.start();R.src.push(o)});R.src.push(hn);R.hi=hi;R.hi2=hi2;R.hf=hf;R.hiG=hiG;R.vg=vg;
  /* the pulse: soft low swells with no edge, 66 a minute at rest, toward 103.7 (the tempo of the Venus tone) at the top */
  const pg=gn(ctx,0);pg.connect(out);R.pg=pg;
  const beatOne=(tb,per,f)=>{const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=gn(ctx,0),g2=gn(ctx,.22),d=Math.min(.62,per*.8);o.frequency.value=f;o2.frequency.value=f*2;
    g.gain.setValueAtTime(0,tb);g.gain.setValueCurveAtTime(PULSE,tb,d);o.connect(g);o2.connect(g2).connect(g);g.connect(pg);o.start(tb);o2.start(tb);o.stop(tb+d+.05);o2.stop(tb+d+.05)};
  R.tempo=66;R.next=t+.3;
  R.tick=setInterval(()=>{if(ctx.state!=='running')return;const now=ctx.currentTime,k=(now-R.t0)/R.T;if(k>=1){aeStop(true);return}
    const s=tideAt(k),I=s.I,root=aeRoot(),fadeIn=Math.min(1,(now-R.t0)/8),tail=k>.94?(1-k)/.06:1;
    at(out.gain,AE_LVL*fadeIn*tail,.5);
    at(lp.frequency,320*Math.pow(2,2.7*I),.6);at(pad.gain,.25*Math.pow(10,6*I/20),.6);        /* opens from the dark, and rises six decibels */
    at(R.v[3].g.gain,R.v[3].lvl*smooth(I,.3,.56),.8);at(R.v[4].g.gain,R.v[4].lvl*smooth(I,.56,.86),.8);
    R.v.forEach(v=>{if(v!==R.sus)v.os.forEach(o=>at(o.frequency,root*v.ratio,.6))});at(sub.frequency,root/2,.6);at(R.hi.frequency,root*6,.6);at(R.hi2.frequency,root*3,.6);at(R.hf.frequency,root*6,.6);
    /* the lean: the fourth hangs over the third all through the rise and the hold, steps down as the wave breaks, then drifts back up */
    const lean=s.peak&&s.rel<.6?5/2:8/3;R.sus.os.forEach(o=>at(o.frequency,root*lean,s.peak&&s.rel<.6?.5:1.6));
    const br=s.peak?Math.sin(Math.PI*Math.min(1,s.rel*1.15)):0;at(subG.gain,.42*br,1.1);at(hiG.gain,.085*br,1.3);at(vg.gain,root*6*.004*br,2);
    /* breath quickens a little on the way up and slows as it lets go */
    BC.P=R.P0*(s.ph==='released'||s.ph==='afterglow'?1+.2*Math.sin(Math.PI*Math.min(1,s.rel)):1-.15*I);
    /* pulse */
    R.tempo=(R.lock?R.beat0*60:66)*(1+.571*I);at(pg.gain,.34*smooth(I,.06,.5)*(s.ph==='afterglow'?0:1),.8);
    if(R.lock){const b=+(R.tempo/60).toFixed(2);if(Math.abs(b-S.beat)>=.01){S.beat=b;paintDial();applyBeat()}}
    const per=60/R.tempo;if(R.next<now)R.next=now+.05;while(R.next<now+.25){beatOne(R.next,per,root);R.next+=per}
    if(s.ph!==R.ph||s.w!==R.w){if(s.ph==='released'){pluck=1.6;say('aestus · the wave breaks')}else if(s.ph!==R.ph)say('aestus · '+s.ph);R.ph=s.ph;R.w=s.w}
    aePaint()},100);
  AE.run=R;BC.join(R.hold=()=>{});if(!('spiritus' in S.layers)){setLayer('spiritus',.5);R.gaveBreath=true}
  if(!S.breath){S.breath=true;R.gaveRing=true;$('#bBreath').classList.add('on');applyAll()}
  aePaint();say('aestus · settling. '+AE.len+' minutes, three waves')}
const AE_LVL=.36;   /* measured: the whole tide at its height sits near the level of a few held keys, under the compressor's threshold */
const PULSE=curve(x=>Math.pow(Math.sin(Math.PI*x),1.6));
function aeStop(done){
  const R=AE.run;if(!R)return;AE.run=null;clearInterval(R.tick);const ctx=A.ctx,t=ctx.currentTime;R.out.gain.cancelScheduledValues(t);R.out.gain.setTargetAtTime(0,t,done?.3:.8);
  setTimeout(()=>{R.src.forEach(o=>{try{o.stop()}catch(_){}});try{R.out.disconnect();R.sh.disconnect()}catch(_){}},done?1600:4200);
  BC.P=BC.P0;BC.leave(R.hold);if(R.lock&&Math.abs(S.beat-R.beat0)>=.01){S.beat=R.beat0;paintDial();applyBeat()}
  if(R.gaveRing&&S.breath){S.breath=false;$('#bBreath').classList.remove('on');applyAll()}
  aePaint();say(done?'aestus · spent. the breath stays':'aestus · released')}

/* ---------- the two controls on the Luxuria stone ---------- */
const st=document.createElement('style');st.textContent=`
  .lxRow+.padg{height:auto!important}
  .lxRow{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0 0 8px}
  .lxBtn{display:block;width:100%;padding:6px 8px 5px;border-radius:10px;border:1px solid rgba(255,90,140,.4);cursor:pointer;position:relative;overflow:hidden;text-align:center;
    font-family:var(--serif,serif);font-size:17px;line-height:1.05;letter-spacing:.06em;color:#ffe3ea;text-shadow:0 0 12px rgba(255,60,120,.7);
    background:radial-gradient(120% 170% at 50% 125%,rgba(255,45,115,.42),rgba(90,10,50,.5) 48%,rgba(10,5,12,.9) 82%);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 -8px 20px rgba(0,0,0,.55)}
  .lxBtn small{display:block;font-family:inherit;font-size:9.5px;letter-spacing:.08em;opacity:.72;margin-top:3px;font-family:"Texturina",Georgia,serif;text-shadow:none}
  .lxBtn small b{font:inherit;font-family:var(--tech,serif)}
  .lxBtn.on{border-color:#ff7fa6;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 0 26px rgba(255,45,115,.5)}
  .lxBtn::before{content:"";position:absolute;inset:-45%;background:radial-gradient(closest-side,rgba(255,90,140,.4),transparent 70%);opacity:0;transform:scale(var(--br,.6));pointer-events:none}
  .lxBtn.on::before{opacity:.75}
  .lxSet{grid-column:1/-1;display:flex;gap:10px;align-items:center;font:10px "Texturina",Georgia,serif;color:#d8c9cf;letter-spacing:.04em}
  .lxSet label{display:flex;gap:6px;align-items:center;flex:1;min-width:0}.lxSet input[type=range]{flex:1;min-width:40px;accent-color:#ff2d73;height:22px}
  .lxSet b{font-family:var(--tech,serif);font-weight:400;min-width:1.6em;text-align:right}
  .lxSet .lxLen{display:flex;gap:3px}.lxSet .lxLen button{font:10px var(--tech,serif);padding:4px 7px;border-radius:6px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.35);color:#d8c9cf;cursor:pointer;min-height:24px}
  .lxSet .lxLen button.on{border-color:#ff7fa6;color:#fff;background:rgba(255,45,115,.28)}
  @media (max-width:1000px),(pointer:coarse){.lxBtn{padding:12px 8px}.lxSet{flex-wrap:wrap}.lxSet .lxLen button{min-height:36px;padding:6px 12px}.lxSet input[type=range]{height:34px}}`;
document.head.appendChild(st);
const spOn=()=>'spiritus' in S.layers,bpm=()=>Math.round(600/BC.P0)/10;
const mmss=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function aePaint(){const a=$('#bAestus'),s=$('#bSpiritus');if(!a||!s)return;const R=AE.run;
  s.classList.toggle('on',spOn());a.classList.toggle('on',!!R);
  a.querySelector('small').innerHTML=R?`${R.ph||'settling'} · <b>${mmss(Math.max(0,R.T-(A.ctx.currentTime-R.t0)))}</b>`:'the tide of heat';
  s.querySelector('small').innerHTML=spOn()?`<b>${(60/BC.P).toFixed(1)}</b> breaths a minute`:'one true breath'}
/* the two buttons glow with the breath */
setInterval(()=>{if(!A.ctx||!BC.on())return;const v=BC.now();document.querySelectorAll('.lxBtn.on').forEach(b=>b.style.setProperty('--br',.6+v*.55));if(!AE.run)aePaint()},120);
{const b0=buildPads;buildPads=()=>{b0();if(ENV!=='lust')return;const row=document.createElement('div');row.className='lxRow';
   row.innerHTML=`<button class="lxBtn" id="bSpiritus" title="Spiritus: one breath, drawn in and let go, that the whole board follows. Press again to stop it.">Spiritus<small></small></button>
    <button class="lxBtn" id="bAestus" title="Aestus: three waves that build, hold, break and let go. Press again to release it.">Aestus<small></small></button>
    <div class="lxSet"><label title="Breaths a minute">breath <input type="range" id="lxRate" min="4" max="7" step=".5" value="${bpm()}" aria-label="Breaths a minute"><b id="lxRateN">${bpm()}</b></label>
     <span class="lxLen" title="How long the tide runs, in minutes">${[3,6,12].map(m=>`<button data-m="${m}" class="${m===AE.len?'on':''}">${m}</button>`).join('')}</span></div>`;
   $('#pads h3').after(row);
   row.querySelector('#bSpiritus').onclick=()=>{if(!A.ctx)return say('enter first, then breathe');setLayer('spiritus',spOn()?null:.5);if(spOn())say('spiritus · in, and out. '+bpm()+' a minute');aePaint()};
   row.querySelector('#bAestus').onclick=()=>{if(!A.ctx)return say('enter first, then call the tide');AE.run?aeStop():aeStart()};
   row.querySelector('#lxRate').oninput=e=>{BC.P0=60/+e.target.value;if(AE.run)AE.run.P0=BC.P0;else BC.P=BC.P0;row.querySelector('#lxRateN').textContent=+e.target.value;say('breath · '+(+e.target.value)+' a minute');aePaint()};
   row.querySelector('.lxLen').onclick=e=>{const b=e.target.closest('button');if(!b)return;AE.len=+b.dataset.m;row.querySelectorAll('.lxLen button').forEach(x=>x.classList.toggle('on',x===b));
     say(AE.run?'aestus · the next tide will run '+AE.len+' minutes':'aestus · '+AE.len+' minutes')};
   aePaint()};
 const p0=paintPads;paintPads=()=>{p0();aePaint()};
 /* leaving the Luxuria stone lets both go, as the stone's own pads are let go */
 const s0=setEnv;setEnv=(id,start)=>{s0(id,start);if(ENV!=='lust'){if(AE.run)aeStop();if(spOn())setLayer('spiritus',null)}};
 const l0=liveList;liveList=function(){const L=l0();if(AE.run)L.push(['aestus',()=>aeStop()]);return L};
 const r0=resetAll;resetAll=function(){if(AE.run)aeStop();BC.P0=BC.P=10;return r0.apply(this,arguments)};
 buildPads();paintPads()}
window.__lux={BC,AE,tideAt,aeStart,aeStop};
}
