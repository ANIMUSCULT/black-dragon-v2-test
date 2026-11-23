/* Black Dragon II: the sound bank, presets, codex, volume and silence.
   Loaded after the main script and shares its globals (A, S, STATES, VOX, $, $$, clamp, at, peak). */

/* ---------- building blocks ---------- */
const NB={};
function mkNoise(ctx){
  const sr=ctx.sampleRate,n=sr*4,mk=f=>{const b=ctx.createBuffer(2,n,sr);for(let c=0;c<2;c++)f(b.getChannelData(c));return b};
  NB.pink=A.nbuf;
  NB.white=mk(d=>{for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*.3});
  NB.brown=mk(d=>{let y=0;for(let i=0;i<n;i++){y=(y+(Math.random()*2-1)*.02)/1.02;d[i]=y*3.2}});
  NB.violet=mk(d=>{let p=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;d[i]=(w-p)*.22;p=w}});
  NB.blue=mk(d=>{let b0=0,b1=0,b2=0,pp=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;b0=.99765*b0+w*.099046;b1=.963*b1+w*.2965164;b2=.57*b2+w*1.0526913;
    const pk=(b0+b1+b2+w*.1848)*.2;d[i]=(pk-pp)*1.3;pp=pk}});
}
const loopN=(ctx,buf)=>{const s=ctx.createBufferSource();s.buffer=buf;s.loop=true;s.start(0,Math.random()*3);return s};
const bq=(ctx,type,f,q)=>{const b=ctx.createBiquadFilter();b.type=type;b.frequency.value=f;if(q!=null)b.Q.value=q;return b};
const gn=(ctx,v)=>{const g=ctx.createGain();g.gain.value=v;return g};
const lfo=(ctx,rate,depth,param)=>{const o=ctx.createOscillator(),g=gn(ctx,depth);o.frequency.value=rate;o.connect(g).connect(param);o.start();return o};
function blip(ctx,out,t,f,q,dur,gain,pan){const s=ctx.createBufferSource(),b=bq(ctx,'bandpass',f,q),g=ctx.createGain(),p=ctx.createStereoPanner();s.buffer=NB.white;
  p.pan.value=pan==null?Math.random()*2-1:pan;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.002);g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  s.connect(b).connect(g).connect(p).connect(out);s.start(t,Math.random()*3,dur+.03)}
function ping(ctx,out,t,f0,f1,dur,gain,pan,att,wave){const o=ctx.createOscillator(),g=ctx.createGain(),p=ctx.createStereoPanner();if(wave)o.type=wave;o.frequency.setValueAtTime(f0,t);
  if(f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);p.pan.value=pan==null?Math.random()*2-1:pan;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+(att||dur*.15));g.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(g).connect(p).connect(out);o.start(t);o.stop(t+dur+.03)}
function Lyr(){this.src=[];this.tm=[]}
Lyr.prototype.every=function(ms,fn){this.tm.push(setInterval(()=>{if(A.ctx.state==='running')fn(A.ctx.currentTime)},ms))};
Lyr.prototype.stop=function(){this.tm.forEach(clearInterval);this.src.forEach(s=>{try{s.stop()}catch(_){}})};
const hBase=()=>{let b=S.fc;while(b<90)b*=2;while(b>260)b/=2;return b};

/* ---------- generators ---------- */
const G={
  noise:(buf,flt)=>(ctx,out,L)=>{const s=loopN(ctx,NB[buf]);L.src.push(s);if(flt){const b=bq(ctx,flt[0],flt[1],flt[2]);s.connect(b).connect(out)}else s.connect(out)},
  rain:(ctx,out,L)=>{const s=loopN(ctx,NB.white),g=gn(ctx,.5);s.connect(bq(ctx,'highpass',900)).connect(bq(ctx,'lowpass',9000)).connect(g).connect(out);L.src.push(s,lfo(ctx,.07,.14,g.gain));
    L.every(90,t=>{for(let k=0;k<3;k++)if(Math.random()<.6)blip(ctx,out,t+Math.random()*.09,3000+Math.random()*6000,6,.004+Math.random()*.012,.5+Math.random())})},
  ocean:(ctx,out,L)=>{const a=loopN(ctx,NB.brown),ga=gn(ctx,.5),b=loopN(ctx,NB.pink),gb=gn(ctx,.12),sw=ctx.createOscillator(),sg=gn(ctx,.45),dl=ctx.createDelay(4),hg=gn(ctx,.11);
    sw.frequency.value=.085;sw.connect(sg).connect(ga.gain);dl.delayTime.value=2.6;sw.connect(dl).connect(hg).connect(gb.gain);sw.start();
    a.connect(bq(ctx,'lowpass',520,.5)).connect(ga).connect(out);b.connect(bq(ctx,'highpass',1800)).connect(gb).connect(out);L.src.push(a,b,sw)},
  stream:(ctx,out,L)=>{const s=loopN(ctx,NB.white),b1=bq(ctx,'bandpass',1400,3),b2=bq(ctx,'bandpass',2700,4),g=gn(ctx,.9);s.connect(b1).connect(g);s.connect(b2).connect(g);g.connect(out);
    L.src.push(s,lfo(ctx,5.3,500,b1.frequency),lfo(ctx,7.1,800,b2.frequency),lfo(ctx,.31,.3,g.gain))},
  wind:(ctx,out,L)=>{const s=loopN(ctx,NB.pink),b=bq(ctx,'bandpass',420,1.6),g=gn(ctx,1.4),w=bq(ctx,'bandpass',1100,12),wg=gn(ctx,.5);s.connect(b).connect(g).connect(out);s.connect(w).connect(wg).connect(out);
    L.src.push(s,lfo(ctx,.11,220,b.frequency),lfo(ctx,.07,.6,g.gain),lfo(ctx,.19,400,w.frequency),lfo(ctx,.05,.4,wg.gain))},
  fire:(ctx,out,L)=>{const s=loopN(ctx,NB.brown),g=gn(ctx,.55);s.connect(bq(ctx,'lowpass',240)).connect(g).connect(out);L.src.push(s,lfo(ctx,.6,.15,g.gain));
    L.every(60,t=>{if(Math.random()<.55)blip(ctx,out,t+Math.random()*.05,1200+Math.random()*4800,1.5,.003+Math.random()*.02,.3+Math.random()*1.3)})},
  thunder:(ctx,out,L)=>{let next=0;L.every(500,t=>{if(t<next)return;next=t+10+Math.random()*16;const s=ctx.createBufferSource(),f=bq(ctx,'lowpass',160,.6),g=ctx.createGain(),p=ctx.createStereoPanner();
    s.buffer=NB.brown;p.pan.value=Math.random()*1.4-.7;f.frequency.setValueAtTime(260,t);f.frequency.exponentialRampToValueAtTime(60,t+4);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(2.4,t+.06);g.gain.setTargetAtTime(1.1,t+.1,.3);g.gain.exponentialRampToValueAtTime(.001,t+6);
    s.connect(f).connect(g).connect(p).connect(out);s.start(t,Math.random()*2,6.2);blip(ctx,out,t,420,.6,.35,1.6,p.pan.value)})},
  earth:(ctx,out,L)=>{const s=loopN(ctx,NB.brown),o=ctx.createOscillator(),og=gn(ctx,.3);s.connect(bq(ctx,'lowpass',70)).connect(gn(ctx,1.5)).connect(out);o.frequency.value=32;o.connect(og).connect(out);o.start();L.src.push(s,o,lfo(ctx,.13,.15,og.gain))},
  crickets:(ctx,out,L)=>{const c=[[4100,.47,-.6],[4520,.61,.5],[4830,.53,.1]].map(([f,per,pan])=>({f,per,pan,next:0}));
    L.every(100,t=>c.forEach(k=>{if(t<k.next)return;k.next=t+k.per*(.9+Math.random()*.25);for(let j=0;j<3;j++)ping(ctx,out,t+.02+j*.022,k.f,k.f,.014,.12,k.pan,.003)}))},
  cicadas:(ctx,out,L)=>{const s=loopN(ctx,NB.white),g=gn(ctx,.5),sw=gn(ctx,.6),m=ctx.createOscillator(),mg=gn(ctx,.5);m.type='square';m.frequency.value=112;m.connect(mg).connect(g.gain);m.start();
    s.connect(bq(ctx,'bandpass',6200,9)).connect(g).connect(sw).connect(out);L.src.push(s,m,lfo(ctx,.05,.4,sw.gain))},
  birds:(ctx,out,L)=>{L.every(300,t=>{if(Math.random()>.33)return;const n=2+(Math.random()*4|0),pan=Math.random()*1.6-.8,f=2200+Math.random()*3000;
    for(let j=0;j<n;j++)ping(ctx,out,t+j*(.09+Math.random()*.05),f*(.85+Math.random()*.4),f*(.7+Math.random()*.9),.05+Math.random()*.09,.1,pan)})},
  heartbeat:(bpm)=>(ctx,out,L)=>{let next=0;L.every(80,t=>{if(t<next)return;next=Math.max(next,t)+60/bpm;ping(ctx,out,next,72,40,.14,1,0,.01);ping(ctx,out,next+.27,62,38,.12,.7,0,.01)})},
  purr:(ctx,out,L)=>{const o=ctx.createOscillator(),g=gn(ctx,.6);o.type='sawtooth';o.frequency.value=27;o.connect(bq(ctx,'lowpass',170,.8)).connect(g).connect(out);o.start();L.src.push(o,lfo(ctx,.42,.3,g.gain),lfo(ctx,.42,1.5,o.frequency))},
  womb:(ctx,out,L)=>{const s=loopN(ctx,NB.brown),g=gn(ctx,.7);s.connect(bq(ctx,'lowpass',300)).connect(g).connect(out);L.src.push(s,lfo(ctx,1.13,.35,g.gain));G.heartbeat(68)(ctx,out,L)},
  breath:(ctx,out,L)=>{const s=loopN(ctx,NB.pink),b=bq(ctx,'bandpass',700,.7),g=gn(ctx,.6);s.connect(b).connect(g).connect(out);L.src.push(s,lfo(ctx,.1,.55,g.gain),lfo(ctx,.1,250,b.frequency))},
  chimes:(ctx,out,L)=>{L.every(220,t=>{if(Math.random()>.14)return;const f=degFreq(5+(Math.random()*10|0))*2,pan=Math.random()*1.6-.8;ping(ctx,out,t,f,f,3,.11,pan,.004);ping(ctx,out,t,f*2.76,f*2.76,1.2,.04,pan,.004)})},
  bowls:(ctx,out,L)=>{let next=0;L.every(300,t=>{if(t<next)return;next=t+6+Math.random()*5;const f=hBase()*[1,1.5,2,.75][Math.random()*4|0],pan=Math.random()*1.2-.6;
    [[1,.3,10],[2.71,.14,6],[5.2,.07,3.5]].forEach(([r,l,d])=>{ping(ctx,out,t,f*r,f*r,d,l,pan,.006);ping(ctx,out,t,f*r+.7,f*r+.7,d,l*.8,pan,.006)})})},
  om:(ctx,out,L)=>{const mix=gn(ctx,.9);[-9,0,8].forEach(d=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=136.1;o.detune.value=d;o.connect(mix);o.start();L.src.push(o)});
    [[300,1],[870,.5],[2240,.2]].forEach(([f,l])=>mix.connect(bq(ctx,'bandpass',f,8)).connect(gn(ctx,l*2)).connect(out))},
  tone:(hz)=>(ctx,out,L)=>{const o=ctx.createOscillator();o.frequency.value=hz;o.connect(out);o.start();L.src.push(o)},
  chord:(ratios)=>(ctx,out,L)=>{const os=ratios.map((r,i)=>{const o=ctx.createOscillator(),g=gn(ctx,.9/ratios.length),p=ctx.createStereoPanner();p.pan.value=ratios.length>1?(i/(ratios.length-1)-.5)*1.1:0;
      o.frequency.value=hBase()*r;o.connect(g).connect(p).connect(out);o.start();L.src.push(o,lfo(ctx,.05+i*.023,.25/ratios.length,g.gain));return o});
    L.upd=()=>os.forEach((o,i)=>o.frequency.setTargetAtTime(hBase()*ratios[i],ctx.currentTime,.6));L.hz=()=>ratios.map(r=>hBase()*r)},
  drip:(ctx,out,L)=>{L.every(250,t=>{if(Math.random()<.3){const f=900+Math.random()*1300;ping(ctx,out,t+Math.random()*.2,f,f*1.7,.09,.5,null,.004)}})},
  underwater:(ctx,out,L)=>{const s=loopN(ctx,NB.brown),g=gn(ctx,.8);s.connect(bq(ctx,'lowpass',380,1.2)).connect(g).connect(out);L.src.push(s,lfo(ctx,.21,.25,g.gain));
    L.every(140,t=>{if(Math.random()<.4){const f=260+Math.random()*700;ping(ctx,out,t+Math.random()*.1,f,f*2.2,.05+Math.random()*.06,.22,null,.006)}})},
  frogs:(ctx,out,L)=>{const fr=[[118,2.3,-.5],[96,3.1,.6]].map(([f,per,pan])=>({f,per,pan,next:0}));
    L.every(120,t=>fr.forEach(k=>{if(t<k.next)return;k.next=t+k.per*(.8+Math.random()*.6);for(let j=0;j<6;j++)ping(ctx,out,t+.02+j*.034,k.f*8,k.f*7.4,.026,.16,k.pan,.004,'sawtooth')}))},
  owl:(ctx,out,L)=>{let next=0;L.every(400,t=>{if(t<next)return;next=t+9+Math.random()*8;const pan=Math.random()*1.4-.7,f=330+Math.random()*40;
    [[0,.28],[.5,.13],[.72,.34]].forEach(([d,len])=>ping(ctx,out,t+d,f,f*.93,len,.5,pan,len*.3))})},
  glide:(pts,every,gain,wave)=>(ctx,out,L)=>{let next=0;L.every(400,t=>{if(t<next)return;next=t+every[0]+Math.random()*every[1];const o=ctx.createOscillator(),g=ctx.createGain(),p=ctx.createStereoPanner(),k=.85+Math.random()*.3;
    o.type=wave||'sine';p.pan.value=Math.random()*1.4-.7;o.frequency.setValueAtTime(pts[0][1]*k,t);let tt=t;pts.slice(1).forEach(([d,f])=>{tt+=d;o.frequency.exponentialRampToValueAtTime(f*k,tt)});
    const dur=tt-t;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+dur*.25);g.gain.setValueAtTime(gain,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0005,t+dur+.6);
    o.connect(bq(ctx,'lowpass',2200)).connect(g).connect(p).connect(out);o.start(t);o.stop(t+dur+.7)})},
  bees:(ctx,out,L)=>{const g=gn(ctx,.25),f=bq(ctx,'lowpass',1100,1);[196,208,221].forEach((hz,i)=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=hz;o.connect(f);o.start();L.src.push(o,lfo(ctx,.3+i*.17,9,o.frequency))});
    f.connect(g).connect(out);L.src.push(lfo(ctx,27,.1,g.gain))},
  vinyl:(ctx,out,L)=>{const s=loopN(ctx,NB.brown);s.connect(bq(ctx,'lowpass',70)).connect(gn(ctx,.5)).connect(out);L.src.push(s);
    L.every(70,t=>{if(Math.random()<.5)blip(ctx,out,t+Math.random()*.07,2500+Math.random()*7000,3,.002+Math.random()*.004,.2+Math.random()*.9)})},
  clock:(ctx,out,L)=>{let next=0,n=0;L.every(80,t=>{if(t<next)return;next=Math.max(next,t)+1;blip(ctx,out,next,n++%2?1900:2600,9,.014,2.2,0)})},
  toll:(ctx,out,L)=>{let next=0;L.every(400,t=>{if(t<next)return;next=t+8+Math.random()*3;const f=hBase()*.5;
    [[.5,.5,9],[1,.9,7],[1.2,.5,5],[1.5,.3,4],[2,.5,3.5],[2.67,.18,2.4],[3,.14,2]].forEach(([r,l,d])=>ping(ctx,out,t,f*r,f*r,d,l*.5,0,.008))})},
  static:(ctx,out,L)=>{const s=loopN(ctx,NB.white),b=bq(ctx,'bandpass',2200,1.2),g=gn(ctx,.6);s.connect(b).connect(g).connect(out);L.src.push(s,lfo(ctx,.13,1200,b.frequency),lfo(ctx,.37,.25,g.gain));
    L.every(600,t=>{if(Math.random()<.2){const f=600+Math.random()*2400;ping(ctx,out,t,f,f*(.4+Math.random()*1.6),.5+Math.random(),.06,null,.05)}})},
  geiger:(ctx,out,L)=>{const t0=ctx.currentTime;L.every(50,t=>{const rate=.12+.1*Math.sin((t-t0)*.2);if(Math.random()<rate)blip(ctx,out,t+Math.random()*.05,3200,5,.006,1.6)})},
  pulse:(carrier,rate)=>(ctx,out,L)=>{const o=ctx.createOscillator(),g=gn(ctx,.5),m=ctx.createOscillator(),f=bq(ctx,'lowpass',rate*3),mg=gn(ctx,.5);o.frequency.value=carrier;m.type='square';m.frequency.value=rate;
    m.connect(f).connect(mg).connect(g.gain);o.connect(g).connect(out);o.start();m.start();L.src.push(o,m)},
  shepard:(ctx,out,L)=>{const N=7,os=[];for(let k=0;k<N;k++){const o=ctx.createOscillator(),g=gn(ctx,0);o.connect(g).connect(out);o.start();os.push({o,g});L.src.push(o)}
    const t0=ctx.currentTime;L.every(50,t=>{const ph=(t-t0)*.035;os.forEach(({o,g},k)=>{const pos=((k+ph)%N+N)%N;o.frequency.setTargetAtTime(32*Math.pow(2,pos),t,.03);g.gain.setTargetAtTime(.5*Math.exp(-Math.pow(pos-N/2,2)/2.4),t,.05)})})}
};

/* ---------- the bank. tag: measured, studied or tradition ---------- */
const TR='tradition',ST='studied',ME='measured';
const SOLF=[[174,'the lowest of the set, said to ease pain'],[285,'said to mend tissue'],[396,'said to release fear and guilt'],[417,'said to clear the past and ease change'],[528,'called the love tone or repair tone'],
  [639,'said to open connection with others'],[741,'said to cleanse and free expression'],[852,'said to wake intuition'],[963,'called the crown tone']];
const PLAN=[['Sun',126.22],['Earth day',194.18],['Earth year',136.1],['Moon',210.42],['Mercury',141.27],['Venus',221.23],['Mars',144.72],['Jupiter',183.58],['Saturn',147.85]];
const CHAK=[['root',256],['sacral',288],['solar plexus',320],['heart',341.3],['throat',384],['third eye',426.7],['crown',480]];
const BANK=[
 /* coloured noise */
 {id:'white',n:'white noise',cat:'coloured noise',tag:ME,gen:G.noise('white'),info:'Equal energy at every frequency. The hiss of an untuned radio. Masks sudden sounds.'},
 {id:'pink',n:'pink noise',cat:'coloured noise',tag:ST,gen:G.noise('pink'),info:'Energy falls 3 dB with each octave, so every octave is equally loud. The noise used in the sleep and memory studies (Ngo, 2013).'},
 {id:'brown',n:'brown noise',cat:'coloured noise',tag:ME,gen:G.noise('brown'),info:'Energy falls 6 dB with each octave. Deep and soft, like a distant waterfall. Popular for sleep and focus; little direct research.'},
 {id:'blue',n:'blue noise',cat:'coloured noise',tag:ME,lvl:0.7,gen:G.noise('blue'),info:'Energy rises 3 dB with each octave. Bright and airy.'},
 {id:'violet',n:'violet noise',cat:'coloured noise',tag:ME,lvl:0.8,gen:G.noise('violet'),info:'Energy rises 6 dB with each octave. The thinnest, highest hiss. Sometimes used to mask ringing in the ears.'},
 {id:'green',n:'green noise',cat:'coloured noise',tag:ME,gen:G.noise('pink',['bandpass',500,.7]),lvl:1.6,info:'Noise gathered around 500 Hz, the middle of the hearing range. An informal name; it sounds like open country.'},
 /* elements */
 {id:'rain',n:'rain',cat:'elements',tag:ME,lvl:2,gen:G.rain,info:'Water. A steady fall with single drops landing around you.'},
 {id:'ocean',n:'ocean',cat:'elements',tag:ME,lvl:1.6,gen:G.ocean,info:'Water. A wave about every twelve seconds, close to a slow breath.'},
 {id:'stream',n:'stream',cat:'elements',tag:ME,lvl:2.5,gen:G.stream,info:'Water. A quick shallow run over stones.'},
 {id:'wind',n:'wind',cat:'elements',tag:ME,lvl:1.8,gen:G.wind,info:'Air. Gusts that rise and fall, with a thin whistle on top.'},
 {id:'fire',n:'fire',cat:'elements',tag:ME,gen:G.fire,info:'Fire. A low roar and dry crackle.'},
 {id:'thunder',n:'thunder',cat:'elements',tag:ME,lvl:1.2,gen:G.thunder,info:'Air and fire. A strike somewhere around you every ten to twenty-five seconds.'},
 {id:'earth',n:'earth',cat:'elements',tag:ME,lvl:0.35,gen:G.earth,info:'Earth. A rumble under 70 Hz with a 32 Hz tone inside it. Felt more than heard; needs headphones or a subwoofer.'},
 {id:'drip',n:'cave drip',cat:'elements',tag:ME,verb:1,lvl:0.8,gen:G.drip,info:'Water. Single drops falling in a stone space.'},
 {id:'underwater',n:'underwater',cat:'elements',tag:ME,gen:G.underwater,info:'Water. The muffled pressure of being below the surface, with rising bubbles.'},
 /* living things */
 {id:'crickets',n:'crickets',cat:'living things',tag:ME,gen:G.crickets,lvl:.7,info:'Three crickets, each chirping at its own pace between 4.1 and 4.8 kHz.'},
 {id:'cicadas',n:'cicadas',cat:'living things',tag:ME,lvl:8,gen:G.cicadas,info:'A wall of summer insects near 6 kHz that swells and fades.'},
 {id:'birds',n:'birds',cat:'living things',tag:ME,lvl:2,gen:G.birds,info:'Short phrases of birdsong from different directions.'},
 {id:'heartbeat',n:'heartbeat',cat:'living things',tag:ME,gen:G.heartbeat(60),info:'Sixty beats a minute, a resting heart. Music near a resting pulse slows breathing and heart rate.'},
 {id:'purr',n:'purr',cat:'living things',tag:TR,lvl:0.4,gen:G.purr,info:'A cat purrs near 25 to 50 Hz; this one sits at 27 Hz. The idea that purring helps bone and tissue heal is a hypothesis, not a finding.'},
 {id:'womb',n:'womb',cat:'living things',tag:ME,gen:G.womb,info:'A muffled rush of blood and a heartbeat at 68 a minute, as heard from inside.'},
 {id:'breath',n:'slow breath',cat:'living things',tag:ST,lvl:2,gen:G.breath,info:'In and out six times a minute. Breathing at this pace is the best supported way to calm the body. Breathe with it.'},
 {id:'chimes',n:'wind chimes',cat:'living things',tag:ME,lvl:1.6,gen:G.chimes,info:'Chimes struck at random, always in tune with the state.'},
 {id:'bowls',n:'bowl bath',cat:'living things',tag:TR,gen:G.bowls,verb:1,info:'Singing bowls struck every few seconds, tuned to the carrier. Small studies report lower tension after bowl sessions.'},
 {id:'om',n:'om',cat:'living things',tag:TR,gen:G.om,verb:1,lvl:.6,info:'A low chanted drone at 136.1 Hz, the pitch sitar and tanpura players tune Om to.'},
 {id:'frogs',n:'frogs',cat:'living things',tag:ME,lvl:0.35,gen:G.frogs,info:'Two frogs calling across a pond.'},
 {id:'owl',n:'owl',cat:'living things',tag:ME,verb:1,lvl:.9,gen:G.owl,info:'An owl calls every ten to fifteen seconds.'},
 {id:'wolf',n:'wolf',cat:'living things',tag:ME,verb:1,lvl:.7,gen:G.glide([[0,290],[.9,470],[1.6,455],[1.1,330]],[14,12],.35),info:'A long howl, far off, every so often.'},
 {id:'whale',n:'whale',cat:'living things',tag:ME,verb:1,lvl:.9,gen:G.glide([[0,120],[1.6,250],[1.4,170],[1.2,95]],[9,9],.5),info:'Slow sliding calls like a humpback, low in the hearing range.'},
 {id:'bees',n:'bees',cat:'living things',tag:ME,lvl:.6,gen:G.bees,info:'A hive: three drifting tones near 200 Hz with a fast flutter.'},
 /* the room */
 {id:'vinyl',n:'vinyl crackle',cat:'the room',tag:ME,lvl:.7,gen:G.vinyl,info:'Surface noise from a turning record.'},
 {id:'clock',n:'clock',cat:'the room',tag:ME,lvl:1,gen:G.clock,info:'One tick a second. A steady point for the eyes-closed mind to hold.'},
 {id:'toll',n:'bell toll',cat:'the room',tag:ME,verb:1,lvl:.8,gen:G.toll,info:'A church bell every eight to eleven seconds, with the minor third that gives bells their sorrow, tuned to the carrier.'},
 {id:'static',n:'radio static',cat:'the room',tag:ME,lvl:.6,gen:G.static,info:'The hiss between stations, with stray whistles drifting through.'},
 {id:'geiger',n:'geiger counter',cat:'the room',tag:ME,lvl:1,gen:G.geiger,info:'Random clicks whose rate slowly rises and falls.'},
 {id:'schumann',n:'7.83 pulse',cat:'the room',tag:TR,lvl:.6,gen:G.pulse(100,7.83),info:'A 100 Hz tone switched 7.83 times a second, the measured resonance of the space between ground and sky. That it tunes the mind is tradition.'},
 /* healing tones */
 ...SOLF.map(([hz,tx])=>({id:'t'+hz,n:hz+' Hz',cat:'solfeggio tones',tag:TR,bus:'tone',hz,gen:G.tone(hz),lvl:.35,info:`${hz} Hz, ${tx}. The solfeggio set was assembled in the 1970s; no study shows it heals. The tone is exact.`})),
 {id:'t432',n:'432 Hz',cat:'single tones',tag:ST,bus:'tone',hz:432,gen:G.tone(432),lvl:.35,info:'432 Hz. One small study found music tuned here lowered heart rate slightly more than 440 Hz. Not established.'},
 {id:'t111',n:'111 Hz',cat:'single tones',tag:TR,bus:'tone',hz:111,gen:G.tone(111),lvl:.45,info:'111 Hz, inside the range where ancient stone chambers ring. Brain claims for this pitch rest on one small study.'},
 {id:'t40',n:'40 Hz',cat:'single tones',tag:ST,bus:'tone',hz:40,gen:G.tone(40),lvl:.6,info:'40 Hz. Sound and light at this rate drove matching brain rhythms in MIT trials. Early science. Needs headphones.'},
 {id:'t19',n:'19 Hz',cat:'single tones',tag:ST,bus:'tone',hz:19,gen:G.tone(19),lvl:.8,info:'19 Hz, below hearing. Linked to unease and a sense of presence. Most speakers cannot produce it.'},
 ...PLAN.map(([nm,hz])=>({id:'p'+nm.replace(' ',''),n:nm+' '+hz,cat:'planetary tones',tag:TR,bus:'tone',hz,gen:G.tone(hz),lvl:.4,info:`${nm}, ${hz} Hz. The body's orbit or spin, doubled octave by octave until it can be heard (Cousto, 1978). The arithmetic is exact; the effect is tradition.`})),
 ...CHAK.map(([nm,hz],i)=>({id:'c'+(i+1),n:nm+' '+hz,cat:'chakra tones',tag:TR,bus:'tone',hz,gen:G.tone(hz),lvl:.35,info:`${hz} Hz, given to the ${nm} centre in the scale built on C at 256 Hz. A modern Western mapping, not an ancient one.`})),
 /* harmonies */
 {id:'fifth',n:'perfect fifth 2:3',cat:'harmonies',tag:ME,verb:1,lvl:0.65,gen:G.chord([1,1.5]),info:'Two tones in the ratio 2 to 3. The most stable interval after the octave; Pythagoras built his scale from it.'},
 {id:'fourth',n:'perfect fourth 3:4',cat:'harmonies',tag:ME,verb:1,lvl:0.6,gen:G.chord([1,4/3]),info:'Two tones in the ratio 3 to 4.'},
 {id:'major',n:'pure major 4:5:6',cat:'harmonies',tag:ME,verb:1,lvl:0.6,gen:G.chord([1,1.25,1.5]),info:'A major chord in exact whole-number ratios. Smoother than the same chord on a piano, which is tuned slightly off these.'},
 {id:'minor',n:'pure minor 10:12:15',cat:'harmonies',tag:ME,verb:1,lvl:0.6,gen:G.chord([1,1.2,1.5]),info:'A minor chord in exact ratios.'},
 {id:'seventh',n:'harmonic seventh 4:5:6:7',cat:'harmonies',tag:ME,verb:1,lvl:0.6,gen:G.chord([1,1.25,1.5,1.75]),info:'The fourth to seventh overtones together. The seventh sits lower than any piano key, which gives the chord its glow.'},
 {id:'tetractys',n:'tetractys 1:2:3:4',cat:'harmonies',tag:TR,verb:1,lvl:0.6,gen:G.chord([1,2,3,4]),info:'The Pythagorean tetractys: octave, fifth and fourth held in the first four numbers. The Pythagoreans swore oaths on it.'},
 {id:'overtones',n:'overtone ladder 1 to 8',cat:'harmonies',tag:ME,verb:1,lvl:0.65,gen:G.chord([1,2,3,4,5,6,7,8]),info:'The first eight overtones of one note, the series inside every voice and string.'},
 {id:'harmonia',n:'harmonia 6:8:9:12',cat:'harmonies',tag:TR,verb:1,lvl:0.7,gen:G.chord([1,4/3,1.5,2]),info:'The four numbers Greek writers called the harmonia: octave, fifth, fourth and the whole tone between them.'},
 {id:'octaves',n:'octaves 1:2:4',cat:'harmonies',tag:ME,verb:1,lvl:0.65,gen:G.chord([.5,1,2]),info:'One note in three registers.'},
 {id:'golden',n:'golden ratio',cat:'harmonies',tag:TR,verb:1,lvl:0.6,gen:G.chord([1,1.618034]),info:'Two tones 1.618 apart. Not a consonance: the golden ratio is the hardest number to fit to any simple ratio, so the pair never settles.'},
 {id:'tritone',n:'the tritone 5:7',cat:'harmonies',tag:TR,verb:1,lvl:0.55,gen:G.chord([1,1.4]),info:'The interval later nicknamed the devil in music. The story that the church banned it is a legend; it was simply hard to sing.'},
 {id:'shepard',n:'endless ascent',cat:'harmonies',tag:ST,verb:1,lvl:0.3,gen:G.shepard,info:'A Shepard tone: seven octaves fading in at the bottom and out at the top, so the pitch seems to rise forever without getting higher.'}
];
const BK=Object.fromEntries(BANK.map(b=>[b.id,b]));
const act={};
/* from measuring every world sound: these peaked far above the rest, or sat mostly in the piercing range */
const CALM={'e:underworld:8':.4,'e:gold:13':.4,thunder:.7,'e:blood:9':.7,'e:blood:14':.7,'e:blood:15':.7,womb:.75,'e:heat:10':.6,'e:animal:9':.6,'e:wet:8':.75,'e:underworld:2':.75,'e:nature:13':.65,'e:nature:6':.75,'e:heat:12':.75,'e:wet:2':.75,'e:wet:5':.8,'e:wet:1':.7,'e:freeze:15':.7,'e:freeze:12':.8};
const EASE=new Set(['e:nature:6','e:nature:13','e:heat:10','e:heat:12','e:heat:7','e:wet:1','e:wet:2','e:wet:5','e:wet:12','e:animal:9','e:animal:13','e:celestial:5','e:celestial:14','e:magnetism:10','e:lust:2','e:gold:14','cicadas']);
const lyrLvl=id=>(BK[id].lvl||1)*(CALM[id]||1);

/* ---------- layers on and off ---------- */
function bankInit(){
  const ctx=A.ctx;mkNoise(ctx);
  A.bankBus=ctx.createGain();A.bankBus.gain.value=1.3;A.bankBus.connect(A.master);
  A.bankVerb=ctx.createGain();A.bankVerb.gain.value=.3;A.bankVerb.connect(A.verb);
  A.tonePan=ctx.createStereoPanner();A.tonePan.connect(A.toneBus);
  Object.entries(S.layers).forEach(([id,v])=>startLayer(id,v));
}
function startLayer(id,level){
  const b=BK[id];if(!b||!A.ctx||act[id])return;const ctx=A.ctx,L=new Lyr();L.g=ctx.createGain();L.g.gain.value=0;
  /* measured tones and coloured noise pass untouched; every other world sound gets its top end eased */
  if(b.bus==='tone')L.g.connect(A.tonePan);
  else if(b.cat==='coloured noise'){L.g.connect(A.bankBus);if(b.verb)L.g.connect(A.bankVerb)}
  else{const sh=ctx.createBiquadFilter(),pk=ctx.createBiquadFilter(),hard=EASE.has(id);sh.type='highshelf';sh.frequency.value=hard?4200:5200;sh.gain.value=hard?-9:-3.5;
    pk.type='peaking';pk.frequency.value=3200;pk.Q.value=1;pk.gain.value=hard?-4:-2.5;L.g.connect(sh).connect(pk);pk.connect(A.bankBus);if(b.verb)pk.connect(A.bankVerb);L.tail=pk}
  try{b.gen(ctx,L.g,L)}catch(e){console.error('layer',id,e);return}
  L.g.gain.setTargetAtTime(level*lyrLvl(id),ctx.currentTime,.25);act[id]=L;
}
function setLayer(id,level){
  if(level==null){delete S.layers[id];const L=act[id];if(L){delete act[id];L.g.gain.setTargetAtTime(0,A.ctx.currentTime,.08);setTimeout(()=>{L.stop();L.g.disconnect();if(L.tail)L.tail.disconnect()},500)}}
  else{S.layers[id]=level;if(act[id])act[id].g.gain.setTargetAtTime(level*lyrLvl(id),A.ctx.currentTime,.08);else startLayer(id,level)}
  paintBank();
}
function clearLayers(){Object.keys(S.layers).forEach(id=>setLayer(id,null))}
function bankApply(){Object.values(act).forEach(L=>L.upd&&L.upd())}
function bankSync(){Object.keys(act).forEach(id=>{if(!(id in S.layers)){const L=act[id];delete act[id];L.stop();L.g.disconnect()}});
  Object.entries(S.layers).forEach(([id,v])=>{if(!BK[id]){delete S.layers[id];return}if(act[id])act[id].g.gain.setTargetAtTime(v*lyrLvl(id),A.ctx.currentTime,.1);else startLayer(id,v)});paintBank()}

/* ---------- proof: every pure tone in the mix, set and measured ---------- */
function bankProof(){
  const el=$('#tonesOut');if(!el)return;const ids=Object.keys(S.layers).filter(id=>BK[id]&&BK[id].hz);
  if(!ids.length){if(el.innerHTML)el.innerHTML='';return}
  const hzPer=A.ctx.sampleRate/A.anL.fftSize;
  el.innerHTML='<dt>tones in the mix</dt>'+ids.slice(0,7).map(id=>{const hz=BK[id].hz,m=hz<hzPer*4?null:peak(A.bufL,hz,Math.min(2,hz*.04));
    return `<div><span>${hz.toFixed(2)} set</span><b>${m?m.toFixed(1)+' measured':'below the meter'}</b></div>`}).join('')+(ids.length>7?`<div><span>and ${ids.length-7} more</span></div>`:'');
}

/* ---------- silence and volume ---------- */
let silenced=false;
function silence(on){
  silenced=on==null?!silenced:on;const b=$('#bSilence');b.classList.toggle('on',silenced);b.textContent=silenced?'sound on':'pause';document.body.classList.toggle('muted',silenced);
  if(!A.ctx)return;const t=A.ctx.currentTime;A.vol.gain.cancelScheduledValues(t);
  if(silenced){A.vol.gain.setValueAtTime(0,t);if(possess)$('#bPossess').click();
    Object.keys(held).forEach(k=>{const h=held[k];h.g.gain.cancelScheduledValues(t);h.g.gain.setValueAtTime(0,t);h.os.forEach(o=>{try{o.stop(t)}catch(_){}});delete held[k]});
    $$('.key.on').forEach(k=>k.classList.remove('on'));setTimeout(()=>silenced&&A.ctx.suspend(),80)}
  else{A.ctx.resume();A.vol.gain.setValueAtTime(0,t);A.vol.gain.linearRampToValueAtTime(S.vol,t+.5)}
}

/* ---------- presets ---------- */
const PRESETS=[
 ['Black water','sleep','abyss','crystal bowl',{ocean:.5,brown:.3}],
 ['Rain on stone','sleep','slumber','harp',{rain:.6,thunder:.3,pink:.2}],
 ['Womb','sleep','abyss','hum',{womb:.6,brown:.2}],
 ['Delta drift','sleep','abyss','glass pad',{pink:.3,breath:.3}],
 ['Night field','sleep','slumber','kalimba',{crickets:.4,wind:.3}],
 ['Purr','sleep','slumber','hum',{purr:.6,fire:.2}],
 ['Slow wave','sleep','slumber','crystal bowl',{pink:.6}],
 ['Hypnagogia','trance','hypnagogia','glass armonica',{}],
 ['Gateway tape','trance','gateway','analog pad',{pink:.35}],
 ['Drum journey','trance','journey','didgeridoo',{fire:.4,wind:.2}],
 ['Endless ascent','trance','hypnagogia','sirens',{shepard:.4}],
 ['Séance','trance','seance','glass armonica',{fire:.25,chimes:.2}],
 ['Mesmer','trance','seance','glass armonica',{fifth:.25,breath:.25}],
 ['Theta pool','trance','hypnagogia','glass pad',{ocean:.4,tetractys:.2}],
 ['528 bath','healing','solfeggio','crystal bowl',{t528:.4,bowls:.4}],
 ['Nine tones','healing','solfeggio','singing bowl',{t174:.2,t285:.2,t396:.2,t417:.2,t528:.25,t639:.2,t741:.15,t852:.15,t963:.12}],
 ['432 garden','healing','earth','harp',{t432:.35,birds:.3,stream:.3}],
 ['Chakra ladder','healing','stillness','crystal bowl',{c1:.3,c2:.25,c3:.25,c4:.25,c5:.2,c6:.2,c7:.2}],
 ['Earth tone','healing','earth','tanpura',{om:.4,pEarthyear:.3}],
 ['Moon tone','healing','hypnagogia','glass pad',{pMoon:.35,ocean:.3}],
 ['Sun tone','healing','stillness','cathedral organ',{pSun:.35,major:.2}],
 ['Bowl bath','healing','stillness','singing bowl',{bowls:.5,chimes:.2}],
 ['Heart','healing','stillness','hum',{heartbeat:.5,t639:.25,breath:.3}],
 ['Six breaths','healing','stillness','flute',{breath:.5,ocean:.3}],
 ['Stone chamber','ritual','chamber','monks',{earth:.4,t111:.3}],
 ['Black mass','ritual','dread','cathedral organ',{tritone:.35,thunder:.4}],
 ['Tetractys','ritual','stillness','cathedral organ',{tetractys:.4}],
 ['Fire rite','ritual','journey','throat singer',{fire:.6}],
 ['Vespers','ritual','chamber','choir',{fifth:.3,rain:.3}],
 ['Oracle','ritual','seance','whisper',{wind:.3,chimes:.2,golden:.25}],
 ['Harmony of the spheres','ritual','earth','glass pad',{pSun:.2,pMoon:.2,pVenus:.2,pMars:.2,pJupiter:.2,pSaturn:.2,harmonia:.2}],
 ['Gamma forty','focus','focus','electric piano',{t40:.3,pink:.2}],
 ['Clean room','focus','focus','hollow',{white:.2}],
 ['Study rain','focus','focus','kalimba',{rain:.45,brown:.2}],
 ['Morning','focus','stillness','flute',{birds:.45,stream:.35}],
 ['Storm','nature','stillness','cello',{rain:.6,thunder:.5,wind:.4}],
 ['Shore','nature','stillness','harp',{ocean:.7}],
 ['Forest dawn','nature','earth','flute',{birds:.5,wind:.25,stream:.3}],
 ['Summer night','nature','hypnagogia','kalimba',{crickets:.5,cicadas:.2,fire:.3}],
 ['Cave','nature','chamber','gong',{stream:.25,earth:.4}],
 ['Underworld','sleep','abyss','abyss choir',{underwater:.5,whale:.4}],
 ['Clockwork','sleep','slumber','music box',{clock:.35,vinyl:.3,brown:.2}],
 ['Pond at night','sleep','slumber','ocarina',{frogs:.4,crickets:.3,owl:.4}],
 ['Deep tide','sleep','abyss','bowed metal',{ocean:.6,earth:.3}],
 ['Kamea','trance','hypnagogia','vibraphone',{tetractys:.25}],
 ['Hive mind','trance','journey','bees',{bees:.4,wind:.2}],
 ['Number station','trance','gateway','fm glass',{static:.4,schumann:.3}],
 ['Whale road','trance','hypnagogia','conch',{whale:.5,ocean:.4}],
 ['Schumann field','healing','earth','bansuri',{schumann:.4,wind:.25,birds:.25}],
 ['174 ease','healing','stillness','felt piano',{t174:.35,breath:.3,rain:.25}],
 ['396 release','healing','stillness','dulcimer',{t396:.35,stream:.3}],
 ['639 heart','healing','stillness','boy choir',{t639:.3,heartbeat:.35}],
 ['852 sight','healing','hypnagogia','crotales',{t852:.25,chimes:.25}],
 ['963 crown','healing','solfeggio','glockenspiel',{t963:.2,overtones:.25}],
 ['Venus','healing','stillness','nylon guitar',{pVenus:.35,stream:.25}],
 ['Saturn','ritual','chamber','church bell',{pSaturn:.35,toll:.4,wind:.2}],
 ['Mars','ritual','journey','infernal brass',{pMars:.35,fire:.4}],
 ['Jupiter','ritual','stillness','cathedral organ',{pJupiter:.35,thunder:.3}],
 ['Mercury','ritual','focus','harpsichord',{pMercury:.3,static:.2}],
 ['Cloister','ritual','chamber','bass choir',{toll:.4,rain:.3,harmonia:.2}],
 ['Shofar','ritual','journey','shofar',{wind:.3,earth:.3}],
 ['Deep work','focus','focus','felt piano',{brown:.35,clock:.2}],
 ['Night study','focus','focus','vibraphone',{vinyl:.3,rain:.3}],
 ['Marsh','nature','earth','ney',{frogs:.4,wind:.25,owl:.3}],
 ['Wolf moon','nature','hypnagogia','oud',{wolf:.5,wind:.3,fire:.25}],
 ['Grotto','nature','chamber','santur',{drip:.5,underwater:.2}],
 ['Meadow','nature','earth','pan pipes',{bees:.25,birds:.4,wind:.2}],
 ['Fallout','dark','dread','supersaw',{geiger:.4,static:.3,earth:.3}],
 ['Banshee','dark','dread','banshee',{wind:.4,wolf:.3}],
 ['Catacomb','dark','chamber','bowed metal',{drip:.4,toll:.3,t111:.25}],
 ['Ghost tone','dark','dread','dark drone',{t19:.5,wind:.3}],
 ['Desire','dark','desire','cello',{heartbeat:.4,fire:.3,breath:.3}],
 ['Abyssal','dark','abyss','deep sub',{ocean:.5,earth:.4}],
 ['Diabolus','dark','dread','sitar',{tritone:.4}],
 ['Possession','dark','dread','throat singer',{cicadas:.2,thunder:.3,earth:.3}]
];
const PCATS=['sleep','trance','healing','ritual','focus','nature','dark'];PRESETS.sort((a,b)=>PCATS.indexOf(a[1])-PCATS.indexOf(b[1]));
function applyPreset(i){
  const [n,cat,st,vo,ly]=PRESETS[i];clearLayers();setState(STATES.findIndex(s=>s.id===st));setVoice(Math.max(0,VOICES.indexOf(vo)));
  Object.entries(ly).forEach(([id,v])=>setLayer(id,v));$$('.pb').forEach((b,j)=>b.classList.toggle('on',j===i));$('#bPresets').textContent='preset: '+n.toLowerCase();
}

/* ---------- drawers ---------- */
const DR=['vox','bank','presets','codex'];
function openDr(id){DR.forEach(d=>{$('#'+d).hidden=d!==id||!$('#'+d).hidden})}
function group(items,catOf,html){let c='',h='';items.forEach((it,i)=>{if(catOf(it)!==c){if(c)h+='</div>';c=catOf(it);h+=`<h4>${c}</h4><div class="vg">`}h+=html(it,i)});return h+'</div>'}
function paintBank(){
  $$('.lb').forEach(b=>b.classList.toggle('on',b.dataset.id in S.layers));const ids=Object.keys(S.layers).filter(id=>BK[id]);
  $('#mix').innerHTML=ids.length?ids.map(id=>`<label><span>${BK[id].n}</span><input type="range" min="0" max="1" step=".01" value="${S.layers[id]}" data-id="${id}"><button data-off="${id}" aria-label="Remove ${BK[id].n}">×</button></label>`).join('')
    :'<p class="vh">Nothing in the mix. Choose sounds below; they layer under the keys.</p>';
  $('#bBank').textContent=ids.length?`sounds: ${ids.length} on`:'sounds';
}
function showInfo(id){const b=BK[id];$('#binfo').innerHTML=`<span class="tag ${b.tag}">${b.tag}</span> <b>${b.n}</b><br>${b.info}`}
function buildBank(){
  const el=$('#bank');el.innerHTML=`<p class="vh">${BANK.length} sounds. Any number can play at once.</p><div id="mix"></div><p id="binfo" class="binfo">Choose a sound to read what it is and how well it is supported.</p>`
    +group(BANK,b=>b.cat,b=>`<button class="vb lb" data-id="${b.id}">${b.n}</button>`)+'<button class="vb" id="bClear" style="margin-top:14px">clear the mix</button>';
  el.addEventListener('click',e=>{const b=e.target.closest('.lb'),off=e.target.dataset.off;if(off)return setLayer(off,null);if(e.target.id==='bClear')return clearLayers();
    if(b){const id=b.dataset.id;showInfo(id);setLayer(id,id in S.layers?null:.5)}});
  el.addEventListener('input',e=>{const id=e.target.dataset.id;if(id){S.layers[id]=+e.target.value;if(act[id])act[id].g.gain.setTargetAtTime(S.layers[id]*lyrLvl(id),A.ctx.currentTime,.05)}});
  el.addEventListener('pointerover',e=>{const b=e.target.closest('.lb');if(b)showInfo(b.dataset.id)});paintBank();
}
function buildPresets(){
  $('#presets').innerHTML=`<p class="vh">${PRESETS.length} presets. Each sets a state, a voice and a mix. Change anything after.</p>`+group(PRESETS.map((p,i)=>({p,i})),x=>x.p[1],x=>`<button class="vb pb" data-i="${x.i}">${x.p[0]}</button>`);
  $('#presets').onclick=e=>{const b=e.target.closest('.pb');if(b)applyPreset(+b.dataset.i)};
}
function buildCodex(){
  const tg=t=>`<span class="tag ${t}">${t}</span>`;
  $('#codex').innerHTML=`<h3>Codex</h3>
  <p>Every number on this instrument is exact and can be checked with any tuner or analyser. Every claim carries one of three marks.</p>
  <p>${tg(ME)} A physical fact about the sound.<br>${tg(ST)} Tested on people in published research. The note says how strong the result is.<br>${tg(TR)} An old or occult practice. Real history, not proven effect.</p>
  <h4>How the beat works</h4>
  <p><b>Binaural.</b> One tone in each ear, a few hertz apart. The beat is made inside the head, so it needs headphones. It only works with tones under about 1,000 Hz.</p>
  <p><b>Monaural.</b> Both tones in both ears. The beat is in the air and drives the brain harder in EEG studies.</p>
  <p><b>Isochronic.</b> One tone switched on and off at the beat rate. The sharpest pulse.</p>
  <h4>The five bands</h4>
  <p><b>Delta, 0.5 to 4 Hz.</b> Deep sleep.<br><b>Theta, 4 to 8 Hz.</b> Drowsy, dreamlike, the edge of sleep.<br><b>Alpha, 8 to 13 Hz.</b> Calm and awake, eyes soft.<br><b>Beta, 13 to 30 Hz.</b> Alert, thinking.<br><b>Gamma, 30 Hz and up.</b> Sharp focus.</p>
  <p>Of 14 brainwave studies, 5 found the brain follows a binaural beat and 8 did not. Effects on attention, memory, pain and anxiety are modest and come from small trials.</p>
  <h4>The Monad</h4>
  <p><span class="tag tradition">tradition</span> The lens holds a magic square: a grid of the numbers from 1 upward in which every row, column and diagonal adds to the same total. Renaissance magicians gave one to each of the seven planets, from Saturn at 3 by 3 (total 15) to the Moon at 9 by 9 (total 369). The Sun's is 6 by 6; its rows add to 111 and the whole square to 666.</p>
  <p>Tap the lens to change planet. Hold it and the instrument walks the square in counting order, 1, 2, 3 and on, turning each position into a note. The line it draws is the kind of path from which planetary seals were made. The squares here are true magic squares built by standard methods; the row totals are exact.</p>
  <h4>The states</h4>`+STATES.map(s=>`<p>${tg(s.tag)} <b>${s.name}</b>, ${s.beat} Hz on ${s.fc} Hz. ${s.note}</p>`).join('')
  +group(BANK,b=>b.cat,b=>`<p>${tg(b.tag)} <b>${b.n}</b>. ${b.info}</p>`).replace(/class="vg"/g,'')
  +`<h4>Volume</h4><p>Quiet works. Keep it at the level of a soft voice, and take the headphones off if your ears ring.</p>`;
}

function addSearch(id){const el=$('#'+id),q=document.createElement('input');q.className='q';q.type='search';q.placeholder='search';q.setAttribute('aria-label','Search');el.prepend(q);
  q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();el.querySelectorAll('.vb').forEach(b=>{if(b.id!=='bClear')b.hidden=!!v&&!b.textContent.toLowerCase().includes(v)});
    el.querySelectorAll('h4').forEach(h=>{const g=h.nextElementSibling;if(g)h.hidden=![...g.querySelectorAll('.vb')].some(b=>!b.hidden)})})}

/* ---------- the Monad: planetary magic squares, traced as sound ---------- */
const KAMEA=[['Saturn',3],['Jupiter',4],['Mars',5],['Sun',6],['Venus',7],['Mercury',8],['Moon',9]];
function magic(n){const m=Array.from({length:n},()=>Array(n).fill(0));
  if(n%2){let r=0,c=n>>1;for(let k=1;k<=n*n;k++){m[r][c]=k;const r2=(r-1+n)%n,c2=(c+1)%n;if(m[r2][c2])r=(r+1)%n;else{r=r2;c=c2}}}
  else if(n%4===0){for(let r=0;r<n;r++)for(let c=0;c<n;c++){const v=r*n+c+1;m[r][c]=(r%4===c%4||(r%4)+(c%4)===3)?n*n+1-v:v}}
  else{const h=n/2,a=magic(h),k=(n-2)/4;for(let r=0;r<h;r++)for(let c=0;c<h;c++){m[r][c]=a[r][c];m[r+h][c+h]=a[r][c]+h*h;m[r][c+h]=a[r][c]+2*h*h;m[r+h][c]=a[r][c]+3*h*h}
    for(let r=0;r<h;r++){const cols=[];for(let c=0;c<k;c++)cols.push(r===(h>>1)?c+1:c);for(let c=n-k+1;c<n;c++)cols.push(c);cols.forEach(c=>{const t=m[r][c];m[r][c]=m[r+h][c];m[r+h][c]=t})}}
  return m}
const MON={i:0,sq:null,path:[],k:0,tm:null,down:0,held:false};
function setKamea(i){MON.i=(i+KAMEA.length)%KAMEA.length;const [nm,n]=KAMEA[MON.i];MON.sq=magic(n);MON.path=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)MON.path[MON.sq[r][c]-1]=[r,c];
  $('#monadT').textContent=`${nm.toLowerCase()} · ${n}×${n} · ${n*(n*n+1)/2}`;$('#seal').setAttribute('points','')}
function monadStep(){
  const n=KAMEA[MON.i][1],[r,c]=MON.path[MON.k%(n*n)],deg=Math.round((r+c)/(2*n-2)*14),id='M'+MON.k,step=clamp(2/S.beat,.2,.8);
  noteOn(id,deg,.75);setTimeout(()=>noteOff(id,deg),step*1500);
  const pts=[];for(let j=Math.max(0,(MON.k%(n*n))-n*n);j<=MON.k%(n*n);j++){const [rr,cc]=MON.path[j];pts.push(((cc+.5)/n-.5)*176+','+(((rr+.5)/n-.5)*176))}
  $('#seal').setAttribute('points',pts.join(' '));$('#sealDot').setAttribute('cx',((c+.5)/n-.5)*176);$('#sealDot').setAttribute('cy',((r+.5)/n-.5)*176);$('#sealDot').setAttribute('opacity',1);
  MON.k++;MON.tm=setTimeout(monadStep,step*1000)}
function monadStart(){if(MON.held||!A.ctx)return;MON.held=true;MON.k=0;$('#monadG').setAttribute('opacity',1);monadStep()}
function monadStop(){if(!MON.held)return;MON.held=false;clearTimeout(MON.tm);$('#sealDot').setAttribute('opacity',0);$('#monadG').setAttribute('opacity',.35)}
(function(){const d=$('#dial'),inLens=e=>{const b=d.getBoundingClientRect();return Math.hypot(e.clientX-b.left-b.width/2,e.clientY-b.top-b.height/2)<b.width*.32};let timer=null;
  d.addEventListener('pointerdown',e=>{if(!inLens(e))return;e.stopImmediatePropagation();MON.down=performance.now();timer=setTimeout(monadStart,260)},true);
  const up=()=>{if(!MON.down)return;clearTimeout(timer);if(MON.held)monadStop();else if(performance.now()-MON.down<260)setKamea(MON.i+1);MON.down=0};
  addEventListener('pointerup',up);addEventListener('pointercancel',up)})();

/* ---------- wire up ---------- */
function bankBoot(){
buildBank();buildPresets();buildCodex();['vox','bank','presets'].forEach(addSearch);setKamea(0);
$('#bSilence').onclick=()=>silence();
$('#bBank').onclick=e=>{e.stopPropagation();openDr('bank')};
$('#bPresets').onclick=e=>{e.stopPropagation();openDr('presets')};
$('#bCodex').onclick=e=>{e.stopPropagation();openDr('codex')};
$('#bVoice').onclick=e=>{e.stopPropagation();openDr('vox')};
addEventListener('pointerdown',e=>{if(e.target.classList.contains('hud')||e.target.closest('#core'))DR.forEach(d=>$('#'+d).hidden=true)});
addEventListener('keydown',e=>{if(e.key==='Escape')DR.forEach(d=>$('#'+d).hidden=true);if(e.code==='Space'&&!e.repeat&&A.ctx&&!/INPUT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();silence()}});
}
