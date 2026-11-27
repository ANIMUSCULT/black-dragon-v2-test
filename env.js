/* Black Dragon II: the ten stone environments, the pad grid, the big Monad button, the readout line,
   and the wider frequency library. Loaded after bank.js and shares its globals. */

/* ---------- primitives: every environment sound is a few of these ---------- */
function prim(ctx,out,L,s){
  const g0=s.g==null?.5:s.g;
  switch(s.k){
  case 'bed':{const src=loopN(ctx,NB[s.n||'pink']),f=bq(ctx,s.ft||'lowpass',s.f||800,s.q),g=gn(ctx,g0);src.connect(f).connect(g);let o=g;
    if(s.pan){const p=ctx.createStereoPanner();g.connect(p);o=p;L.src.push(lfo(ctx,s.pan,.9,p.pan))}o.connect(out);L.src.push(src);
    if(s.lfo)L.src.push(lfo(ctx,s.lfo[0],s.lfo[1]*g0,g.gain));if(s.sw)L.src.push(lfo(ctx,s.sw[0],s.sw[1],f.frequency));
    if(s.am){const m=ctx.createOscillator(),mg=gn(ctx,g0*.5);m.type='square';m.frequency.value=s.am;m.connect(mg).connect(g.gain);m.start();L.src.push(m)}break}
  case 'drone':{const list=s.r||s.f,n=list.length;list.forEach((v,i)=>{const o=ctx.createOscillator(),g=gn(ctx,g0/n),p=ctx.createStereoPanner();o.type=s.w||'sine';
    o.frequency.value=s.r?v*hBase():v;p.pan.value=n>1?(i/(n-1)-.5)*(s.wide==null?1:s.wide):0;let nd=o;if(s.lp){const f=bq(ctx,'lowpass',s.lp,s.lq);o.connect(f);nd=f}
    nd.connect(g).connect(p).connect(out);o.start();L.src.push(o);if(s.trem)L.src.push(lfo(ctx,s.trem[0]*(1+i*.07),s.trem[1]*g0/n,g.gain));
    if(s.vib)L.src.push(lfo(ctx,s.vib[0]*(1+i*.13),s.vib[1],o.frequency));if(s.r)(L.fol=L.fol||[]).push([o,v])});break}
  case 'ping':{const tk=s.tick||120;L.every(tk,t=>{if(Math.random()>s.rate*tk/1000)return;
    const f=s.deg?degFreq(s.deg[0]+(Math.random()*(s.deg[1]-s.deg[0]+1)|0))*(s.oct||1):s.f[0]+Math.random()*(s.f[1]-s.f[0]),pan=s.pan==null?Math.random()*1.6-.8:s.pan;
    ping(ctx,out,t+Math.random()*.05,f,f*(s.drop||1),s.d||.3,g0,pan,s.att,s.w);if(s.h)ping(ctx,out,t,f*s.h,f*s.h*(s.drop||1),(s.d||.3)*.45,g0*.35,pan,s.att)});break}
  case 'burst':{const tk=s.tick||70;L.every(tk,t=>{if(Math.random()>s.rate*tk/1000)return;for(let j=0;j<(s.n||1);j++)
    blip(ctx,out,t+Math.random()*.06+j*(s.gap||.03),s.f[0]+Math.random()*(s.f[1]-s.f[0]),s.q||3,s.d[0]+Math.random()*(s.d[1]-s.d[0]),g0*(.5+Math.random()),s.pan)});break}
  case 'glide':{let next=0;L.every(300,t=>{if(t<next)return;next=t+s.ev[0]+Math.random()*s.ev[1];for(let j=0;j<(s.n||1);j++){
    const f=s.f[0]+Math.random()*(s.f[1]-s.f[0]),d=s.d[0]+Math.random()*(s.d[1]-s.d[0]),tt=t+j*(s.gap||.6)*(.5+Math.random()),o=ctx.createOscillator(),g=ctx.createGain(),p=ctx.createStereoPanner(),to=s.to||[1];
    o.type=s.w||'sine';p.pan.value=Math.random()*1.4-.7;o.frequency.setValueAtTime(f,tt);to.forEach((m,i)=>o.frequency.exponentialRampToValueAtTime(f*m,tt+d*(i+1)/to.length));
    g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(g0,tt+d*.25);g.gain.setValueAtTime(g0,tt+d*.7);g.gain.exponentialRampToValueAtTime(.0005,tt+d+.5);let nd;
    if(s.form){nd=ctx.createGain();[[730,1],[1090,.5],[2440,.2]].forEach(([ff,l])=>o.connect(bq(ctx,'bandpass',ff*s.form,7)).connect(gn(ctx,l*3)).connect(nd))}else{nd=bq(ctx,'lowpass',s.lp||2400);o.connect(nd)}
    if(s.am){const m=ctx.createOscillator(),mg=gn(ctx,g0*.6);m.type='sawtooth';m.frequency.value=s.am;m.connect(mg).connect(g.gain);m.start(tt);m.stop(tt+d+.6)}
    nd.connect(g).connect(p).connect(out);o.start(tt);o.stop(tt+d+.6)}});break}
  case 'beat':{let next=0,bpm=s.bpm,dir=1;L.every(60,t=>{if(t<next-.12)return;if(next<t)next=t+.05;const per=60/bpm;
    (s.pat||[0]).forEach((off,i)=>ping(ctx,out,next+off*per,s.f*(i?.86:1),s.f*.55,s.d||.14,g0*(i?.7:1),0,.008));
    /* quickens to the top, then eases back down more quickly than it rose, and begins again */
    if(s.acc){bpm+=dir>0?s.acc[0]:-s.acc[0]*2.5;if(bpm>=s.acc[1])dir=-1;else if(bpm<=s.bpm){bpm=s.bpm;dir=1}}next+=per});break}
  case 'swell':{let next=0,side=1;L.every(100,t=>{if(t<next)return;const per=s.per[0]+Math.random()*(s.per[1]-s.per[0]);next=t+per;
    const d=per*(s.duty||.8),src=ctx.createBufferSource(),f=bq(ctx,s.ft||'bandpass',s.f[0],s.q||1),g=ctx.createGain(),p=ctx.createStereoPanner();src.buffer=NB[s.n||'pink'];
    f.frequency.setValueAtTime(s.f[0],t);f.frequency.linearRampToValueAtTime(s.f[1],t+d*.5);f.frequency.linearRampToValueAtTime(s.f[2]==null?s.f[0]:s.f[2],t+d);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(g0,t+d*(s.rise||.45));g.gain.linearRampToValueAtTime(0,t+d);side=-side;
    if(s.pan==='move'){p.pan.setValueAtTime(-.9*side,t);p.pan.linearRampToValueAtTime(.9*side,t+d)}else p.pan.value=s.pan==='alt'?side*.8:(s.pan||0);
    src.connect(f).connect(g).connect(p).connect(out);src.start(t,Math.random()*3,d+.05)});break}
  case 'pulse':{const gg=gn(ctx,g0);gg.connect(out);G.pulse(s.f,s.rate)(ctx,gg,L);break}
  /* the Dream of Black Dragon: Ascension: chords that play themselves on a just scale, moving every few seconds, a bass an
     octave under the root, and soft sparks of the scale above. Its tables come straight from Ascension's four spells. */
  case 'chords':{const T=s.t,n=T.length,dg=(d,m)=>s.root*T[((d%n)+n)%n]*Math.pow(2,Math.floor(d/n))*m;let ci=0,next=0,live=[];
    const voice=(f,g,t,w,pan)=>{const o=ctx.createOscillator(),o2=ctx.createOscillator(),lp=bq(ctx,'lowpass',Math.min(2200,f*4),.5),gg=ctx.createGain(),p=ctx.createStereoPanner();
      o.type=w;o2.type='sine';o.frequency.value=f;o2.frequency.value=f*1.0035;o.connect(lp);o2.connect(lp);lp.connect(gg).connect(p).connect(out);p.pan.value=pan;
      gg.gain.setValueAtTime(0,t);gg.gain.linearRampToValueAtTime(g,t+s.att);o.start(t);o2.start(t);
      if(s.vib){const v=ctx.createOscillator(),vg=gn(ctx,f*.004);v.frequency.value=4.6+Math.random();v.connect(vg);vg.connect(o.frequency);vg.connect(o2.frequency);v.start(t);return{gg,os:[o,o2,v]}}
      return{gg,os:[o,o2]}};
    const free=(v,t)=>{v.gg.gain.cancelScheduledValues(t);v.gg.gain.setValueAtTime(v.gg.gain.value,t);v.gg.gain.linearRampToValueAtTime(0,t+s.rel);v.os.forEach(o=>o.stop(t+s.rel+.1))};
    let eng=null,dead=false;if(s.fx&&typeof ASC!=='undefined')ASC.make(s.fx).then(nd=>{if(dead)return;eng=nd;const eg=gn(ctx,g0*(s.eg||1));nd.connect(eg).connect(out);L.src.push({stop(){try{nd.port.postMessage({t:'panic'});nd.disconnect()}catch(_){}}})}).catch(()=>{});
    L.src.push({stop(){dead=true;live.forEach(v=>v.os.forEach(o=>{try{o.stop()}catch(_){}}));if(window.DREAM&&window.DREAM.L===L)window.DREAM=null}});
    L.every(200,t=>{if(t<next)return;next=t+s.ev[0]+Math.random()*(s.ev[1]-s.ev[0]);live.forEach(v=>free(v,t));live=[];
      if(eng){const ch=s.ch[ci++%s.ch.length];window.DREAM={ch,all:s.ch,ci:(ci-1)%s.ch.length,dg,n,L};eng.port.postMessage({t:'offPrefix',pre:'d'});
        ch.forEach((d,i)=>eng.port.postMessage({t:'on',id:'d'+ci+'_'+i,f:dg(d,1),v:.8*(1-i*.08),p:s.patch||'pad'}));eng.port.postMessage({t:'on',id:'d'+ci+'_b',f:dg(ch[0],.5),v:.8,p:'bass'});return}
      const ch=s.ch[ci++%s.ch.length],k=ch.length+1;window.DREAM={ch,all:s.ch,ci:(ci-1)%s.ch.length,dg,n,L};
      ch.forEach((d,i)=>live.push(voice(dg(d,1),g0/k*(1-i*.08),t,s.w||'triangle',k>2?(i/(ch.length-1)-.5)*.9:0)));live.push(voice(dg(ch[0],.5),g0/k*1.1,t,'sine',0));
      if(s.spark){const m=Math.random()<.3?3:1,b0=7+(Math.random()*7|0);for(let j=0;j<m;j++){const f=dg(b0+j*2,2);ping(ctx,out,t+1.2+Math.random()*(next-t-3)+j*.18,f,f,3+Math.random()*3,g0*.07,Math.random()*1.6-.8,.4)}}});break}
  case 'v1':v1env(ctx,out,L,s.layers);break;
  case 'shep':{const N=7,os=[];for(let k=0;k<N;k++){const o=ctx.createOscillator(),g=gn(ctx,0);o.connect(g).connect(out);o.start();os.push({o,g});L.src.push(o)}
    const t0=ctx.currentTime;L.every(50,t=>{const ph=(t-t0)*.035*s.dir;os.forEach(({o,g},k)=>{const pos=((k+ph)%N+N)%N;o.frequency.setTargetAtTime(32*Math.pow(2,pos),t,.03);g.gain.setTargetAtTime(g0*Math.exp(-Math.pow(pos-N/2,2)/2.4),t,.05)})});break}
  }
}
const B=(n,f,g,o)=>({k:'bed',n,f,g,...o}),D=(f,g,o)=>({k:'drone',f,g,...o}),DRN=(r,g,o)=>({k:'drone',r,g,...o}),PI=(rate,f,d,g,o)=>({k:'ping',rate,f,d,g,...o}),
  BU=(rate,f,d,g,o)=>({k:'burst',rate,f,d,g,...o}),GL=(ev,f,to,d,g,o)=>({k:'glide',ev,f,to,d,g,...o}),HB=(bpm,g,o)=>({k:'beat',bpm,f:70,g,pat:[0,.28],...o}),
  SW=(per,f,g,o)=>({k:'swell',per,f,g,...o}),PU=(f,rate,g)=>({k:'pulse',f,rate,g}),CIC={k:'bed',n:'white',ft:'bandpass',f:6200,q:9,g:3,am:112,lfo:[.05,.4]};

const ASC_T={lucid:[1,9/8,5/4,45/32,3/2,5/3,15/8],timaeus:[1,9/8,81/64,4/3,3/2,27/16,243/128],overtones:[1,9/8,10/8,11/8,12/8,13/8,14/8,15/8],hirajoshi:[1,9/8,6/5,3/2,8/5],pythagorean:[1,9/8,81/64,3/2,27/16]};
const CH=(t,root,ch,ev,g,o)=>({k:'chords',t:ASC_T[t],root,ch,ev,g,att:2.6,rel:3.2,...o});
/* ---------- Black Dragon 01's layer engine, so the realms Ascension wrote in 01's vocabulary play as written ----------
   A port of 01's buildEnv, evPlay and dreamTick (v11). The scale is the state's own, the root is the stone's base tone. */
const V1VOW={A:[800,1150,2900],E:[400,1700,2600],'Ē':[550,1900,2500],I:[280,2250,2900],O:[450,800,2830],U:[325,700,2530],'Ō':[400,640,2400]};
function v1env(ctx,out,L,layers){const TAU=Math.PI*2,Rn=a=>Array.isArray(a)?a[0]+Math.random()*(a[1]-a[0]):a,root=()=>hBase(),scl=()=>STATES[S.state].scale,
  g_=v=>gn(ctx,v),filt=(t,f,q=1)=>bq(ctx,t,f,q),pan=v=>{const p=ctx.createStereoPanner();p.pan.value=clamp(v,-1,1);return p},lf=(r,d,p)=>{const o=lfo(ctx,r,d,p);L.src.push(o);return o},
  src=n=>{const s=loopN(ctx,NB[n]||NB.pink);L.src.push(s);return s},osc=(type,f)=>{const o=ctx.createOscillator();o.type=type||'sine';o.frequency.value=f;o.start();L.src.push(o);return o},
  degF=(deg,oct)=>{const sc=scl(),n=sc.length;return root()*oct*sc[((deg%n)+n)%n]*Math.pow(2,Math.floor(deg/n))},
  scaleF=oct=>{const sc=scl();return root()*sc[Math.random()*sc.length|0]*(Array.isArray(oct)?(Math.random()<.5?oct[0]:oct[1]):oct)},
  hrtf=(x,y,z)=>{const p=ctx.createPanner();p.panningModel=MOBILE?'equalpower':'HRTF';p.distanceModel='inverse';p.refDistance=1;p.rolloffFactor=.5;if(p.positionX){p.positionX.value=x;p.positionY.value=y;p.positionZ.value=z}else p.setPosition(x,y,z);return p},
  setPos=(p,x,y,z)=>{const t=ctx.currentTime;if(p.positionX){p.positionX.setTargetAtTime(x,t,.07);p.positionY.setTargetAtTime(y,t,.07);p.positionZ.setTargetAtTime(z,t,.07)}else p.setPosition(x,y,z)},
  ping1=(f,dur,vol,f2,type,p,delay)=>{const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=g_(0);o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur*.4);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(pan(p)).connect(out);o.start(t);o.stop(t+dur+.05)};
  const evPlay=(e,delay)=>{const t=ctx.currentTime+delay,p=Math.random()*1.6-.8;
    switch(e.k){
    case 'ping':{const f=e.scale?scaleF(e.scale):e.rel?root()*e.rel:Rn(e.f),d=Rn(e.d);ping1(f,d,e.g,e.drop?f*e.drop:0,e.w,p,delay);if(e.h)ping1(f*e.h,d*.6,e.g*.4,0,'sine',p,delay);break}
    case 'shimmer':{const oc=Array.isArray(e.oct)?e.oct[Math.random()*e.oct.length|0]:e.oct,f=degF(Math.random()*7|0,oc),d=Rn(e.d),ra=Math.random()*TAU,pn=hrtf(Math.cos(ra)*1.6,Math.random()*1.2-.3,Math.sin(ra)*1.6),g=g_(0);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(e.g,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);g.connect(pn).connect(out);
      [[1,1],[2.01,.3],[3.98,.08]].forEach(([r,a])=>{const o=ctx.createOscillator();o.frequency.value=f*r;o.connect(g_(a)).connect(g);o.start(t);o.stop(t+d+.1)});break}
    case 'music':{const sc=scl().length,n=4+(Math.random()*4|0);let deg=Math.random()*sc|0;const pp=Math.random()*1.2-.6;
      for(let j=0;j<n;j++){const tt=t+j*.42*(1+Math.random()*.15),f=degF(deg,4),g=g_(0),pn=pan(pp+j*.06);g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(e.g,tt+.004);g.gain.exponentialRampToValueAtTime(.0001,tt+2.4);g.connect(pn).connect(out);
        [[1,'triangle',1],[2,'sine',.25],[4.02,'sine',.12]].forEach(([r,ty,a])=>{const o=ctx.createOscillator();o.type=ty;o.frequency.value=f*r;o.connect(g_(a)).connect(g);o.start(tt);o.stop(tt+2.5)});
        deg+=[-2,-1,1,1,2,3][Math.random()*6|0];deg=clamp(deg,0,sc*2-1)}break}
    case 'whisper':{const vk=Object.keys(V1VOW),v1=V1VOW[vk[Math.random()*vk.length|0]],v2=V1VOW[vk[Math.random()*vk.length|0]],d=.7+Math.random()*1.1,ra=Math.random()*TAU,rr=.5+Math.random()*.5;
      const n=ctx.createBufferSource();n.buffer=NB.white;const g=g_(0),pn=hrtf(Math.cos(ra)*rr,Math.random()*.4-.1,Math.sin(ra)*rr);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(e.g,t+.25);g.gain.setValueAtTime(e.g,t+d*.6);g.gain.linearRampToValueAtTime(0,t+d);
      [0,1].forEach(j=>{const bp=filt('bandpass',v1[j],14);bp.frequency.setValueAtTime(v1[j],t);bp.frequency.linearRampToValueAtTime(v2[j],t+d);n.connect(bp).connect(g_(j?.6:1)).connect(g)});g.connect(pn).connect(out);n.start(t,Math.random()*3,d+.1);break}
    case 'glassh':{const f=degF(Math.random()*9|0,2),g=g_(0),pp=Math.random()*1.4-.7;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(e.g,t+.35);g.gain.exponentialRampToValueAtTime(.0001,t+5.5);g.connect(pan(pp)).connect(out);
      const vb=ctx.createOscillator();vb.frequency.value=5.5;const vg=g_(4);vb.connect(vg);vb.start(t);vb.stop(t+5.6);
      [[1,1],[2,.22],[3,.08]].forEach(([r,a])=>{const o=ctx.createOscillator();o.frequency.value=f*r;vg.connect(o.detune);o.connect(g_(a)).connect(g);o.start(t);o.stop(t+5.6)});break}
    case 'thump':ping1(e.f,e.d||.25,e.g,e.f*.7,'sine',0,delay);break;
    case 'burst':{const n=ctx.createBufferSource();n.buffer=NB[e.n||'white']||NB.white;const a=e.a||.002,d=Rn(e.d),g=g_(0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(e.g,t+a);g.gain.exponentialRampToValueAtTime(.0005,t+a+d);n.connect(filt('bandpass',Rn(e.f),e.q||1)).connect(g).connect(pan(p)).connect(out);n.start(t,Math.random()*3,a+d+.05);break}
    case 'chirp':{const f=Rn(e.f),n=Math.round(Rn(e.n||1)),sw=Rn(e.sw||1);for(let i=0;i<n;i++)ping1(f,e.d,e.g,f*sw,e.w,p,delay+i*e.d*1.4);break}
    case 'glide':{const o=ctx.createOscillator();o.type=e.w||'sine';const f=Rn(e.f),d=Rn(e.d),g=g_(0);o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*Rn(e.sw),t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(e.g,t+d*.3);g.gain.linearRampToValueAtTime(0,t+d);
      if(e.fm)o.connect(filt('bandpass',f*e.fm,4)).connect(g);else o.connect(g);g.connect(pan(p)).connect(out);o.start(t);o.stop(t+d+.1);break}
    case 'zap':{const o=ctx.createOscillator();o.type='sawtooth';const d=Rn(e.d),g=g_(0);for(let j=0;j<10;j++)o.frequency.setValueAtTime(Rn(e.f),t+j*d/10);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(e.g,t+.005);g.gain.setValueAtTime(e.g,t+d*.8);g.gain.linearRampToValueAtTime(0,t+d);o.connect(filt('highpass',600)).connect(g).connect(pan(p)).connect(out);o.start(t);o.stop(t+d+.05);break}}};
  const evs=[],chords=[],chordsP=[],orbits=[],shep=[];
  layers.forEach(Ly=>{switch(Ly.k){
    case 'bed':{const n=src(Ly.n),f=filt(Ly.ft||'lowpass',Ly.f,Ly.q||1),g=g_(Ly.g);n.connect(f).connect(g).connect(out);if(Ly.lfo)lf(Ly.lfo[0],Ly.lfo[1],g.gain);if(Ly.sw)lf(Ly.sw[0],Ly.sw[1],f.frequency);break}
    case 'drone':{const g=g_(Ly.g),fl=filt(Ly.ft||'lowpass',Ly.ff||4000,.7);fl.connect(g).connect(out);(Ly.rel?Ly.rel.map(r=>root()*r):Ly.f).forEach(x=>{const o=osc(Ly.w,x);if(Ly.vib)lf(Ly.vib[0],Ly.vib[1],o.detune);if(Ly.swf)lf(Ly.swf[0],Ly.swf[1],o.frequency);o.connect(fl)});if(Ly.am)lf(Ly.am[0],Ly.g*Ly.am[1],g.gain);break}
    case 'choir':{const sc=scl();Ly.deg.forEach((deg,i)=>{const o=osc('sawtooth',root()*Ly.oct*sc[deg%sc.length]);o.detune.value=(i-1)*6;Ly.fm.forEach((ff,j)=>o.connect(filt('bandpass',ff,9)).connect(g_([1,.5,.2][j]*Ly.g*4)).connect(pan((i-1)*.6)).connect(out));lf(5+i*.3,6,o.detune);chords.push({o,deg,oct:Ly.oct})});break}
    case 'pad':{const lp=filt('lowpass',Ly.cut,.6),g=g_(Ly.g);lp.connect(g).connect(out);const vs=[],vib=osc('sine',.17),vg=g_(6);vib.connect(vg);
      Ly.deg.forEach((deg,i)=>{const p=pan(Ly.deg.length>1?(i/(Ly.deg.length-1)*2-1)*.75:0);p.connect(lp);[-11,2,13].forEach((dt,j)=>{const o=osc(j===1?'triangle':'sawtooth',degF(deg,Ly.oct));o.detune.value=dt;vg.connect(o.detune);o.connect(g_(j===1?.55:.28)).connect(p);vs.push({o,deg})})});
      lf(.045+Math.random()*.03,Ly.cut*.35,lp.frequency);if(Ly.am)lf(Ly.am,Ly.g*.7,g.gain);chordsP.push({vs,oct:Ly.oct,drift:Ly.drift||20,next:ctx.currentTime+(Ly.drift||20)});break}
    case 'orbit':{const pn=hrtf(Ly.rad,0,0),g=g_(Ly.g);g.connect(pn).connect(out);
      if(Ly.src==='choir'){const f=degF(Ly.deg,Ly.oct),mix=g_(1);[0,7,-5].forEach(dt=>{const o=osc('sawtooth',f);o.detune.value=dt;lf(5+Math.random(),7,o.detune);o.connect(mix)});
        [[700,8,2.2],[1100,9,1.2],[2700,10,.5]].forEach(([ff,q,a],j)=>{const bp=filt('bandpass',ff,q);mix.connect(bp).connect(g_(a)).connect(g);if(!j)lf(.09,260,bp.frequency);if(j===1)lf(.07,320,bp.frequency)})}
      else if(Ly.src==='air'){const n=src('pink'),bp=filt('bandpass',Ly.f,3);n.connect(bp).connect(g);lf(.11,Ly.f*.3,bp.frequency)}
      else{const o=osc('sine',degF(Ly.deg||0,Ly.oct||4)),am=g_(.6);o.connect(am).connect(g);lf(4,.4,am.gain)}
      orbits.push({pn,a:Math.random()*TAU,rate:Ly.rate,rad:Ly.rad});break}
    case 'shepard':{const g=g_(Ly.g),n=8,ps=[];g.connect(out);
      for(let k=0;k<n;k++){const gk=g_(0),oL=osc('sine',100),oR=osc('sine',100);oL.connect(pan(-.8)).connect(gk);oR.connect(pan(.8)).connect(gk);gk.connect(g);ps.push({oL,oR,gk,last:-9})}
      shep.push({ps,ph:Math.random(),rate:Ly.rate,dir:Ly.dir||1,n});break}
    default:evs.push({...Ly,next:0})}});
  L.every(50,()=>{const t=ctx.currentTime;
    chordsP.forEach(c=>{if(t>=c.next){c.next=t+c.drift*(.7+Math.random()*.6);const sh=[0,3,4,5,-2,2,-3][Math.random()*7|0];c.vs.forEach(v=>v.o.frequency.setTargetAtTime(degF(v.deg+sh,c.oct),t,2.6))}});
    orbits.forEach(o=>{o.a+=o.rate*TAU*.05*(.35+.3*2.2);setPos(o.pn,Math.cos(o.a)*o.rad,Math.sin(o.a*.7)*.45,Math.sin(o.a)*o.rad)});
    shep.forEach(c=>{c.ph=(c.ph+c.rate*.05*c.dir+1)%1;const n=c.n,base=root()/8;c.ps.forEach((p,k)=>{const oc=(k+c.ph)%n,f=base*Math.pow(2,oc),amp=Math.exp(-Math.pow(oc-n/2,2)/(2*Math.pow(n/5,2)));
      if(Math.abs(oc-p.last)>1){p.oL.frequency.setValueAtTime(f,t);p.oR.frequency.setValueAtTime(f+(S.beat||0)*.5,t)}else{p.oL.frequency.setTargetAtTime(f,t,.06);p.oR.frequency.setTargetAtTime(f+(S.beat||0)*.5,t,.06)}
      p.last=oc;p.gk.gain.setTargetAtTime(amp*.45,t,.08)})});
    evs.forEach(e=>{if(e.k==='beat'){if(t>=e.next){e.next=Math.max(e.next,t-.05)+60/e.bpm;(e.pat||[0]).forEach(o=>evPlay({...e,k:e.bell?'ping':'thump'},o+.05))}}
      else{const ex=(e.rate||0)*.05;let n=Math.floor(ex)+(Math.random()<ex%1?1:0);while(n--)evPlay(e,Math.random()*.05)}});
    if(chords.length&&Math.random()<.008){const sc=scl(),sh=Math.random()*sc.length|0;chords.forEach(c=>{const d=c.deg+sh;c.o.frequency.setTargetAtTime(root()*c.oct*sc[d%sc.length]*Math.pow(2,Math.floor(d/sc.length)),t,2.2)})}})}
/* ---------- the ten environments. Each stone holds sixteen sounds; sig are the three that start with it ---------- */
const ENVS=[
{id:'dream',n:'Dream',col:'#f6b9dc',line:'The soft country behind the eyes.',sig:[1,2,8],snd:[
 ['soft rain',[B('white',3500,.2,{ft:'bandpass',q:.4}),BU(18,[1500,6000],[.02,.03],.35,{q:6})]],['ocean',[B('brown',650,.5,{lfo:[.075,.5]}),B('pink',2200,.08,{ft:'bandpass',q:.6,lfo:[.075,.6]})]],
 ['bowls',[{k:'ping',rate:.28,deg:[0,7],d:9,g:.25,att:.01,h:2.76,tick:300}]],['star wind',[B('pink',700,.5,{ft:'bandpass',q:5,sw:[.04,420]}),B('pink',1100,.45,{ft:'bandpass',q:5,sw:[.061,660]})]],
 ['jungle',[{k:'ping',rate:6,f:[4000,5400],d:.014,g:.12,att:.003,tick:40},PI(.4,[200,240],.14,.25,{drop:.6,w:'triangle'})]],['naga cave',[B('brown',130,.6),D([41.2],.3),PI(.7,[900,2400],.35,.22,{drop:.55})]],
 ['crystal',[{k:'ping',rate:1.2,deg:[7,14],oct:2,d:3.5,g:.08,att:.003,h:2.01}]],['whales',[GL([4,4],[160,360],[1.6,.7],[2,4],.25,{w:'sawtooth',lp:900})]],
 ['dream choir',[D([220,220.7,330,440],.4,{w:'sawtooth',lp:1300,trem:[.1,.3]}),B('pink',730,.5,{ft:'bandpass',q:9})]],['pendulum',[HB(60,1,{f:620,pat:[0,.5],d:.06})]],['brown',[B('brown',900,.6)]],['green',[B('pink',500,1,{ft:'bandpass',q:.7})]],
 ['music box',[{k:'ping',rate:1.1,deg:[7,14],oct:2,d:1.8,g:.1,att:.002,h:4}]],['fog',[B('pink',400,.5,{lfo:[.04,.5]}),D([110,110.3],.15,{trem:[.05,.5]})]],
 ['night train',[HB(100,.2,{f:180,pat:[0,.12,.5,.62],d:.08}),D([46,46.3],.15,{trem:[1.66,.5],lp:200})]],['lullaby',[{k:'ping',rate:.7,deg:[5,12],d:3,g:.14,att:.02,w:'triangle'},DRN([1,1.5],.2,{trem:[.08,.4]})]]]},
{id:'nature',n:'Nature',col:'#7ed6a0',line:'The living world outside the door.',sig:[1,2,5],snd:[
 ['forest rain',[B('white',2500,.3,{ft:'bandpass',q:.5}),BU(20,[2000,7000],[.004,.014],.5,{q:6}),PI(.6,[700,1500],.1,.2,{drop:1.5})]],['birdsong',[{k:'ping',rate:3,f:[2200,5200],d:.09,g:.12,drop:1.35}]],
 ['creek',[B('white',1400,.8,{ft:'bandpass',q:3,sw:[5.3,500]}),B('white',2700,.7,{ft:'bandpass',q:4,sw:[7.1,800]})]],
 ['crickets',[{k:'ping',rate:6,f:[4100,4120],d:.014,g:.15,att:.003,tick:40},{k:'ping',rate:5,f:[4800,4830],d:.014,g:.12,att:.003,tick:40}]],
 ['frogs',[{k:'ping',rate:1.6,f:[800,950],d:.03,g:.25,w:'sawtooth',tick:60},{k:'ping',rate:1.1,f:[640,720],d:.035,g:.25,w:'sawtooth',tick:60}]],
 ['leaf wind',[B('pink',900,.5,{ft:'bandpass',q:1,sw:[.1,400],lfo:[.08,.6]}),BU(8,[4000,9000],[.003,.008],.2,{q:5})]],
 ['storm',[B('white',900,.7,{ft:'highpass'}),B('pink',420,.8,{ft:'bandpass',q:1.6,sw:[.11,220],lfo:[.07,.6]}),BU(.1,[60,140],[1.5,3],2,{q:.6,tick:500})]],
 ['bees',[D([196,208,221],.25,{w:'sawtooth',lp:1100,vib:[.3,9],trem:[27,.3]})]],['owl night',[GL([9,8],[330,370],[.93],[.3,.4],.5,{n:3,gap:.5}),{k:'ping',rate:5,f:[4100,4800],d:.014,g:.08,att:.003,tick:40}]],
 ['waterfall',[B('white',400,.8,{ft:'highpass'}),B('brown',500,.7)]],['woodpecker',[{k:'burst',rate:.25,tick:400,f:[900,1300],d:[.012,.016],g:1.6,q:4,n:9,gap:.055}]],
 ['earth hum',[D([32,64.2],.7,{trem:[.1,.3]}),B('brown',70,.8)]],['wolves',[GL([10,8],[280,340],[1.6,1.5,1.1],[3,4.5],.25,{n:2,gap:1.4})]],['cicadas',[CIC]],
 ['meadow',[D([196,208],.12,{w:'sawtooth',lp:1000,trem:[27,.3]}),{k:'ping',rate:1.6,f:[2400,5000],d:.08,g:.1,drop:1.3},B('pink',800,.25,{ft:'bandpass',q:1,lfo:[.07,.5]})]],
 ['fireside',[B('brown',240,.5,{lfo:[.6,.3]}),BU(9,[1200,6000],[.003,.02],.8,{q:1.5})]]]},
{id:'blood',n:'Blood',col:'#d8122f',line:'Pulse, iron and the red dark.',sig:[0,5,6],snd:[
 ['resting heart',[HB(56,.9)]],['quick heart',[HB(84,.8)]],['racing heart',[HB(118,.7)]],['two hearts',[HB(60,.8),HB(67,.6,{f:92})]],
 ['pulse in the ears',[SW([1,1],[90,260,90],.9,{n:'brown',ft:'lowpass',duty:.9})]],['vein hum',[D([55,55.6],.5,{trem:[1,.3]}),B('brown',140,.3)]],
 ['arterial rush',[B('brown',320,.6,{lfo:[1.1,.5]}),B('pink',1800,.06,{ft:'bandpass',q:.7,lfo:[1.1,.6]})]],['iron',[PI(.35,[70,180],5,.3,{h:2.76,att:.006}),PI(.2,[300,700],3,.1,{h:1.51,att:.004})]],
 ['thick drip',[PI(.5,[180,320],.16,.5,{drop:.55,att:.004})]],['womb',[B('brown',300,.6,{lfo:[1.13,.35]}),HB(68,.7)]],
 ['war drum',[{k:'beat',bpm:76,f:95,g:1,pat:[0,.5,.75],d:.3}]],['blood moon',[DRN([1,1.2,1.5],.5,{w:'triangle',trem:[.07,.4]})]],
 ['bleed',[GL([5,5],[260,420],[.5],[5,8],.2,{w:'triangle'})]],['red tide',[SW([7,10],[200,700,200],.8,{n:'brown',ft:'lowpass'}),B('brown',120,.3)]],
 ['faint',[D([6200],.04,{trem:[.2,.6]}),HB(48,.5),B('pink',400,.1)]],['sacrifice',[{k:'beat',bpm:54,f:60,g:1,pat:[0],d:.5},PI(.12,[110,110],8,.25,{h:2.4,att:.01}),B('brown',200,.2)]]]},
{id:'breath',n:'Breath',col:'#8fd4ff',line:'Air moving in and out of a body.',sig:[0,7,14],snd:[
 ['six breaths',[SW([10,10],[400,1100,400],.9,{duty:.95,rise:.42})]],['slow breathing',[SW([4.4,5],[300,700,300],.7,{duty:.85,rise:.4})]],['panting',[SW([.55,.7],[700,1600,700],.8,{duty:.8})]],
 ['close, left ear',[SW([3.6,4.4],[900,2400,900],.9,{pan:-.9,duty:.8})]],['close, right ear',[SW([3.3,4.1],[900,2400,900],.9,{pan:.9,duty:.8})]],
 ['sigh',[GL([6,6],[330,440],[.6],[1.4,2.2],.25,{w:'sawtooth',form:1}),SW([6,8],[1200,2200,600],.35,{duty:.3})]],
 ['whisper wind',[B('pink',1800,.5,{ft:'bandpass',q:1.2,sw:[.13,900],lfo:[.21,.5]})]],['the room breathes',[SW([5.5,6.5],[300,800,250],.35,{q:1.2,rise:.45})]],
 ['flute breath',[B('pink',440,1.6,{ft:'bandpass',q:18,lfo:[.12,.6]}),B('pink',660,1,{ft:'bandpass',q:18,lfo:[.09,.6]})]],['yawn',[GL([9,9],[500,640],[.45],[2.2,3],.22,{w:'sawtooth',form:1})]],
 ['ocean breath',[SW([8,9],[500,1500,500],.9,{q:2.2,duty:.95})]],['fire breath',[SW([.42,.46],[1400,2600,1400],.8,{duty:.5})]],
 ['choir breath',[B('pink',730,.9,{ft:'bandpass',q:7,lfo:[.1,.6]}),B('pink',1090,.5,{ft:'bandpass',q:7,lfo:[.1,.6]})]],['mouth',[BU(1.6,[1800,5200],[.004,.018],.9,{q:5})]],
 ['hum',[D([110,110.7,220],.5,{w:'triangle',lp:700,trem:[.1,.4]})]],['last breath',[SW([14,16],[900,1400,200],.9,{duty:.7,rise:.2}),B('brown',120,.2)]]]},
{id:'magnetism',n:'Magnetism',col:'#7c5cff',line:'Fields, current and the hum in the walls.',sig:[4,6,13],snd:[
 ['mains, 60 Hz',[D([60,120,180],.6),D([240,360],.08,{w:'sawtooth',lp:900})]],['mains, 50 Hz',[D([50,100,150],.6),D([200,300],.08,{w:'sawtooth',lp:800})]],
 ['tesla coil',[D([120,121.5],.3,{w:'sawtooth',lp:2600,trem:[60,.6]}),BU(6,[2000,7000],[.002,.01],.6)]],['dynamo',[GL([4,3],[80,120],[4,1],[3,5],.25,{w:'sawtooth',lp:1800})]],
 ['earth field, 7.83',[PU(100,7.83,.7)]],['compass',[{k:'burst',rate:1,tick:1000,f:[2400,2600],d:[.01,.012],g:1.4,q:9,pan:0}]],
 ['lodestone',[D([98,98.5],.6),D([196,196.3],.25)]],['iron filings',[BU(22,[4000,9000],[.002,.006],.5,{q:4})]],['induction',[PU(200,8,.5),D([50],.3)]],
 ['scanner',[{k:'beat',bpm:210,f:420,g:.5,pat:[0],d:.06},{k:'beat',bpm:52,f:180,g:.6,pat:[0,.25,.5],d:.2}]],
 ['aurora',[GL([2,3],[2000,5000],[1.4,.8],[2,4],.07,{}),B('violet',6000,.15,{ft:'highpass',lfo:[.1,.7]})]],['solenoid',[BU(2.2,[300,500],[.02,.03],1.2,{q:2}),D([60],.25)]],
 ['degauss',[GL([9,6],[900,1400],[.08],[1.2,1.8],.3,{w:'sawtooth',lp:3000}),BU(.12,[90,140],[.2,.3],1.5,{q:1,tick:500})]],
 ['field lines',[D([220,220.4,330,330.7],.5,{wide:1.6,trem:[.13,.6]})]],['wandering field',[D([440],.3,{vib:[.11,160]}),D([330],.2,{vib:[.07,90]})]],
 ['static cling',[PI(3,[300,900],.04,2,{att:.006})]]]},
{id:'heat',n:'Heat',col:'#ff6a1a',line:'Flame, steam and noon.',sig:[1,13,14],snd:[
 ['candle',[BU(1.4,[1800,5000],[.003,.012],.35),B('brown',300,.12)]],['campfire',[B('brown',240,.5,{lfo:[.6,.3]}),BU(9,[1200,6000],[.003,.02],.8,{q:1.5})]],
 ['hearth',[B('brown',140,.6,{lfo:[.1,.3]}),BU(1.5,[800,2500],[.01,.04],.25,{q:2})]],['bonfire',[B('brown',420,.9,{lfo:[.8,.3]}),B('pink',2500,.12,{ft:'bandpass',q:.6,lfo:[1.3,.5]}),BU(16,[1200,7000],[.003,.02],.9,{q:1.5})]],
 ['wildfire',[B('brown',700,1,{lfo:[.5,.3]}),B('pink',3000,.25,{ft:'bandpass',q:.5,lfo:[.9,.5]}),BU(26,[1000,8000],[.003,.03],1,{q:1.2})]],['embers',[BU(.9,[2500,7000],[.003,.01],.5),PI(.15,[3000,5000],.4,.03,{drop:.7})]],
 ['lava',[B('brown',90,1.2,{lfo:[.2,.3]}),PI(.8,[60,140],.18,.5,{drop:1.8,att:.01})]],['steam',[SW([2.5,6],[3000,6000,4000],.7,{n:'white',ft:'highpass',duty:.5,rise:.1})]],
 ['geyser',[SW([9,14],[800,3500,1500],1,{n:'white',duty:.45,rise:.15}),B('brown',120,.4)]],['desert wind',[B('pink',900,.6,{ft:'bandpass',q:1,sw:[.09,500],lfo:[.06,.6]}),BU(5,[5000,9000],[.002,.005],.2)]],
 ['heat haze',[B('pink',2800,.2,{ft:'bandpass',q:1.5,sw:[.11,800],lfo:[.07,.5]}),D([98,98.35],.15,{trem:[.33,.5],lp:600})]],['boiling',[PI(9,[200,700],.07,.3,{drop:2,att:.006}),B('white',2500,.1,{ft:'highpass'})]],
 ['sauna',[SW([7,12],[4000,7000,5000],.6,{n:'white',ft:'highpass',duty:.25,rise:.05}),PI(.35,[900,1800],.09,.3,{drop:1.6}),B('brown',160,.2)]],
 ['kiln',[D([73,73.4,146],.6,{w:'triangle',trem:[.3,.3]}),B('brown',500,.3)]],['the sun',[D([126.22,252.44],.5,{trem:[.11,.4]}),B('pink',5000,.06,{ft:'highpass',lfo:[.3,.7]})]],
 ['fever',[D([311,317,466],.3,{vib:[.17,7],trem:[.4,.5]}),HB(96,.4)]]]},
{id:'wet',n:'Wet',col:'#19c8cf',line:'Everything water does.',sig:[1,6,10],snd:[
 ['drizzle',[B('white',5000,.18,{ft:'highpass'}),BU(8,[4000,9000],[.003,.008],.4,{q:6})]],['rain',[B('white',1400,.45,{ft:'highpass',lfo:[.07,.2]}),BU(26,[3000,9000],[.004,.014],.6,{q:6})]],
 ['downpour',[B('white',700,.9,{ft:'highpass'}),B('brown',300,.4),BU(40,[2000,8000],[.004,.016],.7,{q:5})]],['rain on glass',[PI(7,[1800,4200],.05,.3,{drop:.8,att:.002}),B('white',3000,.12,{ft:'highpass'})]],
 ['sea cave',[SW([5,9],[160,420,140],1.6,{n:'brown',ft:'lowpass',q:.8,rise:.55}),PI(.22,[70,130],2.2,.3,{drop:.75,att:.03})]],['cistern drips',[PI(.9,[600,1200],.9,.11,{drop:.55,att:.012}),B('brown',240,.24,{lfo:[.05,.4]})]],
 ['lake',[SW([3.5,5],[300,900,300],.7,{n:'brown',ft:'lowpass',pan:'alt'}),PI(.4,[500,1100],.08,.2,{drop:1.5})]],['surf',[SW([8,12],[300,2600,500],1,{ft:'lowpass',rise:.3}),B('brown',200,.3)]],
 ['underwater',[B('brown',380,.8,{q:1.2,lfo:[.21,.25]}),PI(2.5,[260,900],.08,.25,{drop:2.2,att:.006})]],['bubbles',[PI(7,[300,1400],.06,.3,{drop:2.4,att:.005})]],
 ['slow drip',[PI(.45,[900,2200],.09,.6,{drop:1.7,att:.004})]],['bath',[SW([2.5,3.5],[200,600,200],.5,{n:'brown',ft:'lowpass',q:.8}),PI(.5,[900,1600],.25,.08,{drop:.6,att:.01})]],
 ['steam shower',[B('white',3500,.4,{ft:'highpass'}),PI(4,[1500,3500],.05,.25,{drop:.8})]],['slick',[BU(2.2,[900,2600],[.01,.03],.8,{q:6}),PI(1.4,[500,1200],.05,.2,{drop:1.9})]],
 ['swamp',[PI(1.6,[150,500],.1,.4,{drop:2}),B('brown',260,.3),{k:'ping',rate:1.2,f:[820,940],d:.03,g:.15,w:'sawtooth'}]],['oil',[PI(.7,[90,220],.22,.6,{drop:1.9,att:.02}),B('brown',120,.3)]]]},
{id:'universe',n:'Universe',col:'#4f6bff',line:'The sounds space would make if it could.',sig:[0,3,10],snd:[
 ['deep space',[D([36.7,55,55.3],.7,{trem:[.05,.5]}),B('brown',90,.4)]],['pulsar',[{k:'beat',bpm:84,f:880,g:.3,pat:[0],d:.05},{k:'burst',rate:1.4,tick:714,f:[3000,3200],d:[.01,.012],g:.6,q:9}]],
 ['radio jets',[GL([2,3],[200,600],[3,.5],[3,5],.08,{lp:1800}),B('pink',1500,.1,{ft:'bandpass',q:3,sw:[.5,700]})]],['solar wind',[B('pink',600,.7,{ft:'bandpass',q:.8,sw:[.05,350],lfo:[.08,.6]}),B('violet',7000,.1,{ft:'highpass',lfo:[.21,.8]})]],
 ['planet hum',[D([194.18,97.09],.5,{trem:[.1,.3]})]],['saturn rings',[PI(3,[2000,6000],1.6,.06,{h:1.5,att:.004}),D([147.85],.25)]],['black hole',[D([58.27,58.5,29.14],.9,{trem:[.03,.5]})]],
 ['background hiss',[B('white',3000,.25,{ft:'bandpass',q:.4}),B('pink',300,.15)]],['satellite',[{k:'beat',bpm:100,f:1400,g:.25,pat:[0,.5],d:.12}]],
 ['comet',[GL([7,7],[2500,4000],[.15],[3,5],.12,{}),B('violet',6000,.1,{ft:'highpass',lfo:[.14,.9]})]],['nebula',[DRN([3,3.02,4.49,6.03],.15,{trem:[.07,.6],vib:[.2,.6],lp:3000}),B('pink',1600,.06,{ft:'bandpass',q:6,sw:[.03,600]})]],
 ['star birth',[GL([5,5],[90,160],[6],[4,6],.2,{w:'triangle'}),BU(3,[3000,9000],[.003,.01],.3)]],['orbit',[B('pink',500,1.2,{ft:'bandpass',q:6,pan:.11}),D([110],.2)]],
 ['gravity wave',[GL([7,5],[34,48],[5],[2,3],1.5,{lp:300})]],['the spheres',[D([126.22,141.27,221.23,144.72,183.58,147.85],.5,{wide:1.6,trem:[.05,.5]})]],['the void',[D([27.5,27.55],.4,{trem:[.03,.5]}),B('pink',3200,.02,{ft:'bandpass',q:1.5,lfo:[.02,.9]})]]]},
{id:'lust',n:'Luxuria',col:'#ff2d73',line:'Heat under the skin.',sig:[0,1,2],snd:[["Breath on skin",[{"k":"v1","layers":[{"k":"whisper","rate":0.3,"g":0.12},{"k":"bed","n":"pink","ft":"bandpass","f":1100,"q":0.5,"g":0.09,"lfo":[0.21,0.08]}]}]],["Heartbeat close",[{"k":"v1","layers":[{"k":"beat","bpm":62,"f":52,"g":0.42,"pat":[0,0.28]},{"k":"bed","n":"brown","f":150,"g":0.14,"lfo":[0.1,0.06]}]}]],["Sighs",[{"k":"v1","layers":[{"k":"glide","rate":0.2,"f":[380,560],"sw":[0.55,0.8],"d":[1.4,2.6],"g":0.08},{"k":"bed","n":"pink","ft":"bandpass","f":1600,"q":0.4,"g":0.05,"lfo":[0.2,0.05]}]}]],["Velvet choir",[{"k":"v1","layers":[{"k":"choir","deg":[0,3,7],"oct":1,"fm":[650,1080,2650],"g":0.08},{"k":"pad","deg":[0,3],"oct":0.5,"g":0.03,"cut":600,"drift":26}]}]],["Moan",[{"k":"v1","layers":[{"k":"drone","f":[196,294],"w":"sawtooth","ff":640,"vib":[5,9],"am":[0.16,0.9],"g":0.03},{"k":"choir","deg":[0],"oct":0.5,"fm":[450,800,2830],"g":0.06}]}]],["Kiss",[{"k":"v1","layers":[{"k":"ping","rate":0.55,"f":[280,460],"d":0.14,"g":0.09,"drop":0.7},{"k":"whisper","rate":0.12,"g":0.07}]}]],["Touch",[{"k":"v1","layers":[{"k":"orbit","src":"air","f":3200,"rate":0.11,"rad":0.8,"g":0.07},{"k":"orbit","src":"air","f":1800,"rate":-0.07,"rad":1,"g":0.05}]}]],["Temptation",[{"k":"v1","layers":[{"k":"music","rate":0.1,"g":0.05},{"k":"drone","rel":[0.5,0.7071],"w":"triangle","ff":800,"g":0.03,"am":[0.07,0.5]}]}]],["Rising heat",[{"k":"v1","layers":[{"k":"shepard","g":0.05,"rate":0.022222222222222223,"dir":1},{"k":"pad","deg":[0,4],"oct":0.5,"g":0.03,"cut":700,"drift":30,"am":0.4}]}]],["Slow grind",[{"k":"v1","layers":[{"k":"beat","bpm":72,"f":46,"g":0.4,"pat":[0,0.62]},{"k":"glide","rate":0.3,"f":[70,120],"sw":[0.8,1.25],"d":[0.8,1.6],"fm":2,"w":"sawtooth","g":0.08}]}]],["Ecstasy",[{"k":"v1","layers":[{"k":"pad","deg":[0,4,7],"oct":2,"g":0.02,"cut":2600,"drift":14},{"k":"shimmer","rate":2,"oct":[4,8],"d":[1.5,3],"g":0.02},{"k":"beat","bpm":124,"f":58,"g":0.2,"pat":[0]}]}]],["Afterglow",[{"k":"v1","layers":[{"k":"pad","deg":[0,2,4,6],"oct":0.5,"g":0.04,"cut":800,"drift":30},{"k":"shimmer","rate":0.4,"oct":[2,4],"d":[4,8],"g":0.02},{"k":"bed","n":"pink","f":500,"g":0.04}]}]]]},
{id:'animal',n:'Animal attraction',col:'#e0a61e',line:'Fur, teeth and the call across the dark.',sig:[0,5,10],snd:[
 ['purr',[D([27,27.3],.9,{w:'sawtooth',lp:170,trem:[.42,.5]})]],['great cat',[D([20,20.2],1,{w:'sawtooth',lp:140,trem:[.3,.5]}),SW([3.4,4],[200,500,200],.4,{n:'brown',ft:'lowpass'})]],
 ['growl',[GL([5,4],[70,95],[.85],[1.5,2.5],.5,{w:'sawtooth',lp:900,am:31})]],['wolf',[GL([13,10],[290,330],[1.6,1.55,1.1],[3,4],.3,{})]],['the pack',[GL([8,6],[260,360],[1.6,1.5,1.1],[3,4.5],.25,{n:3,gap:1.2})]],
 ['wings',[SW([.5,.7],[300,900,300],1.2,{q:.8,pan:'alt'})]],['prey heart',[HB(150,.7)]],['stag',[GL([10,8],[140,180],[1.5,.8],[1.6,2.4],.4,{w:'sawtooth',form:.7,am:24})]],
 ['far hooves',[HB(52,.35,{f:58,pat:[0,.22,.5,.72],d:.2})]],['mating call',[GL([4,5],[180,320],[1.6,.7],[1.2,2],.5,{form:.9})]],
 ['in the grass',[BU(2.5,[600,1500],[.06,.2],3.2,{q:1.2,n:3,gap:.06})]],['courtship',[GL([2,3],[700,1100],[1.3,.9,1.2],[.7,1.1],.12,{lp:2600,n:2,gap:.5})]],
 ['whale',[GL([9,9],[110,130],[2.1,1.4,.8],[4,5],.5,{lp:900})]],['serpent',[SW([2.5,5],[5000,8000,6000],.6,{n:'white',ft:'highpass',duty:.7})]],
 ['rattle',[B('white',4500,.5,{ft:'bandpass',q:4,am:38,lfo:[.15,.9]})]],['the stalk',[BU(.25,[900,2400],[.01,.03],1,{q:3,tick:400}),SW([3.8,4.6],[500,1100,500],.25,{duty:.8}),B('pink',300,.08)]]]},
{id:'celestial',n:'Celestial',col:'#e6e0ff',line:'Light, height and voices far above.',sig:[1,7,10],snd:[
 ['choir',[B('pink',730,.6,{ft:'bandpass',q:9}),D([220,220.8,330,440],.35,{w:'sawtooth',lp:1400,trem:[.1,.3]})]],['high choir',[D([440,441,660,880],.3,{w:'triangle',trem:[.13,.4],vib:[5,2]})]],
 ['harp',[{k:'ping',rate:1.6,deg:[4,14],d:2.4,g:.25,att:.004,h:2}]],['crystal bowls',[{k:'ping',rate:.22,deg:[0,7],d:9,g:.3,att:.4,h:2.71,tick:300}]],
 ['glass bells',[{k:'ping',rate:.9,deg:[7,14],oct:2,d:3,g:.1,att:.003,h:2.76}]],['dawn light',[GL([3,4],[600,900],[1.5],[2.5,3.5],.08,{form:1.4}),B('pink',4000,.04,{ft:'highpass',lfo:[.08,.7]})]],
 ['starlight',[PI(.9,[0,0],3.2,.3,{deg:[7,14],att:.45,tick:300})]],['cathedral air',[B('pink',500,.4,{ft:'bandpass',q:.5,lfo:[.05,.4]}),B('brown',150,.2)]],
 ['organ',[DRN([.5,1,1.5,2,3],.6)]],['crown tone, 963',[D([963],.2),D([481.5],.2)]],['halo',[DRN([1,2,3,4,5,6,7,8],.6,{trem:[.09,.8]})]],
 ['dawn',[{k:'ping',rate:2.6,f:[2200,5200],d:.09,g:.12,drop:1.3},B('pink',3000,.05,{ft:'highpass'})]],['seraph',[{k:'shep',dir:1,g:.5}]],
 ['far bells',[{k:'ping',rate:.14,deg:[0,4],d:7,g:.25,att:.008,h:2.4,tick:300}]],['overtone halo',[DRN([4,5,6,8],.15,{trem:[.09,.6],lp:2400})]],
 ['ascension',[DRN([1,1.25,1.5,2,2.5,3],.5,{trem:[.06,.6]}),{k:'shep',dir:1,g:.2}]]]},
{id:'underworld',n:'Avernus',col:'#7a2be0',line:'Stone, water and what waits below.',sig:[0,1,6],snd:[
 ['cavern',[D([41.2,41.5,61.7],.8,{trem:[.04,.5]}),B('brown',130,.5)]],['deep drip',[PI(.4,[300,700],.2,.6,{drop:1.5,att:.004})]],
 ['the river',[B('brown',250,.3,{lfo:[.05,.4]}),BU(1.2,[150,400],[.08,.2],.2,{q:2})]],['chains',[BU(.5,[1800,4200],[.02,.06],1,{q:9,n:5,gap:.05,tick:300})]],
 ['low chant',[D([65.4,65.9,98.1],.6,{w:'sawtooth',lp:420,trem:[.1,.3]})]],['bone flute',[{k:'ping',rate:.3,deg:[0,6],d:3.5,g:.2,att:.5,w:'triangle',tick:300},B('pink',900,.15,{ft:'bandpass',q:6,lfo:[.2,.8]})]],
 ['tunnel wind',[B('pink',420,1,{ft:'bandpass',q:2.5,sw:[.08,260],lfo:[.06,.6]}),B('pink',1100,.3,{ft:'bandpass',q:12,sw:[.19,400],lfo:[.05,.8]})]],['bats',[{k:'ping',rate:5,f:[7000,11000],d:.02,g:.08,drop:.7,tick:50}]],
 ['the hound',[GL([6,5],[60,80],[.85],[2,3],.6,{w:'sawtooth',lp:800,am:27,n:3,gap:.3})]],['furnace',[B('brown',500,.9,{lfo:[.5,.3]}),D([49],.4,{w:'sawtooth',lp:200}),BU(8,[900,5000],[.004,.03],.5,{q:1.2})]],
 ['ghost tone, 19',[D([19],.9),D([76,95],.2)]],['the tritone',[DRN([1,1.4],.5,{trem:[.05,.3]})]],
 ['toll',[{k:'ping',rate:.11,f:[65,65],d:9,g:.5,att:.008,h:2.4,tick:300},{k:'ping',rate:.11,f:[78,78],d:6,g:.25,att:.008,tick:300}]],
 ['voices below',[GL([1.5,2.5],[120,220],[.85],[1.4,2.2],.8,{form:.8,n:3,gap:.4})]],['descent',[{k:'shep',dir:-1,g:.5}]],['quake',[B('brown',60,1.6,{lfo:[.11,.7]}),BU(.2,[40,90],[.3,.6],1.5,{q:1,tick:500})]]]},
{id:'gold',n:'Gold',col:'#f2c14e',line:'Coin, crown, honey and sun on metal.',sig:[0,1,2],snd:[["Molten gold",[{"k":"v1","layers":[{"k":"bed","n":"brown","f":420,"g":0.3,"lfo":[0.09,0.2]},{"k":"glide","rate":0.25,"f":[120,300],"sw":[0.5,1.4],"d":[2,4],"fm":2,"w":"sawtooth","g":0.12},{"k":"drone","rel":[0.5,0.75],"w":"triangle","ff":900,"g":0.03}]}]],["Coin rain",[{"k":"v1","layers":[{"k":"ping","rate":5,"f":[2800,6500],"d":0.18,"g":0.06,"h":2.76},{"k":"ping","rate":1.2,"f":[1800,3200],"d":0.5,"g":0.07,"drop":0.96,"w":"triangle"}]}]],["Sun bells",[{"k":"v1","layers":[{"k":"ping","rate":0.35,"scale":[2,4],"d":7,"g":0.12,"h":2},{"k":"ping","rate":0.12,"scale":[1,2],"d":12,"g":0.12,"h":2.76}]}]],["Temple gong",[{"k":"v1","layers":[{"k":"beat","bpm":9,"rel":0.5,"d":10,"g":0.3,"h":2.4,"bell":1,"pat":[0]},{"k":"bed","n":"brown","f":200,"g":0.12}]}]],["Sun drone",[{"k":"v1","layers":[{"k":"drone","f":[126.22,189.33,252.44],"g":0.035,"am":[0.06,0.4]},{"k":"drone","f":[504.88,757.32],"w":"triangle","vib":[0.2,6],"ff":2400,"g":0.012}]}]],["Honey",[{"k":"v1","layers":[{"k":"pad","deg":[0,2,4],"oct":0.5,"g":0.04,"cut":700,"drift":24},{"k":"bed","n":"pink","ft":"bandpass","f":300,"q":0.8,"g":0.08,"lfo":[0.05,0.05]}]}]],["Midas choir",[{"k":"v1","layers":[{"k":"choir","deg":[0,2,4],"oct":1,"fm":[700,1150,2800],"g":0.09},{"k":"pad","deg":[0,4],"oct":0.5,"g":0.02,"cut":600,"drift":30}]}]],["Gold dust",[{"k":"v1","layers":[{"k":"shimmer","rate":1.6,"oct":[8,16],"d":[1.5,3],"g":0.022},{"k":"bed","n":"white","ft":"highpass","f":8000,"g":0.012}]}]],["Forge",[{"k":"v1","layers":[{"k":"beat","bpm":54,"f":90,"g":0.35,"pat":[0,0.5]},{"k":"burst","rate":3,"f":[2500,6000],"q":4,"d":[0.02,0.06],"g":0.2},{"k":"bed","n":"brown","f":300,"g":0.3,"lfo":[0.4,0.12]}]}]],["Crown",[{"k":"v1","layers":[{"k":"orbit","src":"choir","deg":0,"oct":2,"rate":0.06,"rad":1.4,"g":0.04},{"k":"orbit","src":"choir","deg":4,"oct":2,"rate":-0.045,"rad":1.6,"g":0.03},{"k":"shimmer","rate":0.5,"oct":[4,8],"d":[4,7],"g":0.02}]}]],["Treasury",[{"k":"v1","layers":[{"k":"music","rate":0.12,"g":0.06},{"k":"ping","rate":0.6,"f":[3000,5200],"d":0.25,"g":0.04},{"k":"bed","n":"brown","f":500,"g":0.05}]}]],["Solar wind",[{"k":"v1","layers":[{"k":"bed","n":"pink","ft":"bandpass","f":900,"q":0.5,"g":0.16,"sw":[0.04,500],"lfo":[0.07,0.08]},{"k":"glide","rate":0.15,"f":[2000,5000],"sw":[0.3,0.6],"d":[1.5,3],"g":0.05},{"k":"drone","rel":[0.25],"g":0.05,"am":[0.05,0.5]}]}]]]},
{id:'freeze',n:'Freeze',col:'#bfe9ff',line:'Ice, snow and the stillness under them.',sig:[0,1,2],snd:[["Ice cracks",[{"k":"v1","layers":[{"k":"burst","rate":0.5,"f":[1200,5000],"q":8,"d":[0.02,0.12],"g":0.4},{"k":"chirp","rate":0.25,"f":[1800,4200],"n":[2,5],"d":0.03,"sw":[0.6,0.9],"w":"square","g":0.12},{"k":"bed","n":"brown","f":180,"g":0.15}]}]],["Snow hush",[{"k":"v1","layers":[{"k":"bed","n":"white","ft":"bandpass","f":5200,"q":0.3,"g":0.05,"lfo":[0.05,0.02]},{"k":"bed","n":"pink","f":700,"g":0.1,"lfo":[0.03,0.05]}]}]],["Frozen lake",[{"k":"v1","layers":[{"k":"glide","rate":0.18,"f":[90,240],"sw":[0.4,0.8],"d":[0.6,1.6],"g":0.3},{"k":"ping","rate":0.4,"f":[700,1800],"d":0.9,"g":0.09,"drop":0.5},{"k":"bed","n":"brown","f":120,"g":0.2}]}]],["Blizzard",[{"k":"v1","layers":[{"k":"bed","n":"white","ft":"bandpass","f":900,"q":0.9,"g":0.22,"sw":[0.13,600],"lfo":[0.09,0.12]},{"k":"bed","n":"pink","ft":"highpass","f":3500,"g":0.05,"lfo":[0.21,0.03]},{"k":"glide","rate":0.4,"f":[400,900],"sw":[0.7,1.5],"d":[1.5,3.5],"fm":2,"w":"sawtooth","g":0.06}]}]],["Icicles",[{"k":"v1","layers":[{"k":"ping","rate":1.4,"scale":[4,8],"d":1.6,"g":0.06,"h":3.98},{"k":"ping","rate":0.5,"f":[3500,7000],"d":0.5,"g":0.04,"drop":0.9}]}]],["Glacier",[{"k":"v1","layers":[{"k":"drone","rel":[0.25,0.2512],"g":0.07,"am":[0.04,0.4]},{"k":"glide","rate":0.08,"f":[50,110],"sw":[0.6,0.9],"d":[3,6],"g":0.25},{"k":"bed","n":"brown","f":90,"g":0.3,"lfo":[0.02,0.15]}]}]],["Aurora",[{"k":"v1","layers":[{"k":"pad","deg":[0,4,7],"oct":2,"g":0.018,"cut":2400,"drift":20},{"k":"shimmer","rate":0.7,"oct":[8,16],"d":[3,6],"g":0.018},{"k":"orbit","src":"air","f":5200,"rate":0.05,"rad":1.3,"g":0.05}]}]],["Diamond dust",[{"k":"v1","layers":[{"k":"shimmer","rate":2.2,"oct":[16,32],"d":[1,2],"g":0.012},{"k":"glassh","rate":0.3,"g":0.04}]}]],["Frost choir",[{"k":"v1","layers":[{"k":"choir","deg":[0,3,5],"oct":2,"fm":[400,1700,2600],"g":0.07},{"k":"bed","n":"white","ft":"highpass","f":6000,"g":0.012}]}]],["Ice chimes",[{"k":"v1","layers":[{"k":"ping","rate":0.9,"scale":[4,8],"d":3,"g":0.07,"h":2.76,"w":"triangle"},{"k":"bed","n":"pink","ft":"bandpass","f":1800,"q":0.6,"g":0.05,"sw":[0.08,700]}]}]],["Deep freeze",[{"k":"v1","layers":[{"k":"pad","deg":[0,4],"oct":0.25,"g":0.05,"cut":380,"drift":34,"am":0.5},{"k":"drone","rel":[0.125],"g":0.08},{"k":"beat","bpm":40,"f":46,"g":0.3,"pat":[0]}]}]],["Stillness",[{"k":"v1","layers":[{"k":"bed","n":"pink","f":400,"g":0.05},{"k":"ping","rate":0.08,"scale":[2,4],"d":14,"g":0.1,"h":2},{"k":"drone","rel":[1,1.002],"ff":2000,"g":0.012}]}]]]},
{id:'dragon',n:'Dragon',col:'#ff7a1e',line:'Fire, hoard and the wyrm beneath the mountain.',sig:[0,4,11],snd:[
 ['float',[CH('lucid',136.1,[[0,2,4,6],[1,3,5,7],[-2,2,4,7],[3,5,7,9],[0,4,6,9]],[10,15],.21,{eg:4,fx:{root:136.1,shape:1.3,bloom:.5,shimmer:.5,space:.72,echo:.18,drive:.2}})]],
 ['choir',[CH('overtones',128,[[0,4,7],[2,5,9],[0,3,7],[4,7,11]],[12,18],.18,{w:'sine',vib:1,att:3.4,patch:'choir',eg:5.2,fx:{root:128,shape:2.2,bloom:.62,shimmer:.78,space:.9,echo:.1,drive:.15}})]],
 ['rise',[CH('timaeus',144,[[0,2,4,7],[1,4,6,8],[2,4,7,9],[3,5,7,10]],[7,10],.22,{att:1.8,rel:2.4,eg:4,fx:{root:144,shape:5.2,bloom:.72,shimmer:.62,space:.66,echo:.38,drive:.3}})]],
 ['deep',[CH('hirajoshi',108,[[0,2,4],[-1,2,4],[0,3,5]],[18,26],.19,{w:'sine',att:4,rel:5,eg:4.5,fx:{root:108,shape:.4,bloom:.22,shimmer:.35,space:1,echo:.06,drive:.1}})]],
 /* the twelve Dragon soundscapes of Black Dragon: Ascension, written in this stone's own terms */
 ['dragon breath',[B('brown',240,.4,{lfo:[.11,.32]}),B('pink',520,.12,{ft:'bandpass',q:.5,lfo:[.11,.1]})]],
 ['cave drip',[PI(.5,[900,2200],.5,.14,{drop:.6}),B('brown',100,.32)]],
 ['heart of the beast',[HB(36,.5,{f:38,pat:[0,.2]}),DRN([.125],.07)]],
 ['night flight',[B('pink',700,.2,{ft:'bandpass',q:.5,sw:[.06,500],lfo:[.08,.1]}),B('brown',320,.3,{lfo:[.5,.3]})]],
 ['wingbeats',[GL([1.4,1.2],[70,150],[.6],[.7,1.2],.26,{lp:900}),B('pink',380,.22,{lfo:[.5,.22]})]],
 ['hoard',[PI(1.6,[2500,5500],.2,.08,{h:2.76,att:.01}),D([126.22,189.33],.075,{trem:[.05,.4]})]],
 ['embers',[BU(6,[1500,4500],[.01,.04],.12,{q:3}),B('brown',300,.25,{lfo:[.3,.1]})]],
 ['deep cavern',[DRN([.25,.2505],.08),B('brown',80,.3,{lfo:[.03,.1]}),PI(.1,[300,600],3,.05,{drop:.8})]],
 ['growl',[GL([5,6],[45,80],[.95],[2,4],.2,{w:'sawtooth',lp:600}),B('brown',160,.25,{lfo:[.09,.2]})]],
 ['purr',[D([27.5,55],.16,{w:'sawtooth',lp:220,trem:[24,.9]}),DRN([.25,.375],.07,{lp:300})]],
 ['dragon song',[DRN([.5,.75],.1,{w:'sawtooth',lp:900,vib:[5,2],trem:[.07,.3]}),DRN([.5],.04,{w:'triangle',lp:500,trem:[.05,.5]})]],
 ['fire',[B('white',1100,.6,{ft:'bandpass',q:.6,sw:[.2,700],lfo:[.3,.12]}),BU(4,[1200,3500],[.01,.05],.4,{q:3}),GL([4,4],[60,110],[1.5],[1.5,3],.4,{w:'sawtooth',lp:500})]]]},
{id:'magic',n:'Magic',col:'#b48cff',line:'Glints, wands and the air before a working.',sig:[0,1,2],snd:[["Fairy dust",[{"k":"v1","layers":[{"k":"shimmer","rate":3,"oct":[16,32],"d":[0.8,1.6],"g":0.012},{"k":"glassh","rate":0.5,"g":0.04}]}]],["Enchanted wood",[{"k":"v1","layers":[{"k":"chirp","rate":0.5,"f":[2200,4200],"n":[2,4],"d":0.06,"sw":[1.1,1.4],"w":"sine","g":0.05},{"k":"bed","n":"pink","ft":"bandpass","f":900,"q":0.5,"g":0.06,"lfo":[0.06,0.04]},{"k":"ping","rate":0.25,"scale":[2,4],"d":3,"g":0.06,"h":2}]}]],["Wand",[{"k":"v1","layers":[{"k":"glide","rate":0.3,"f":[1200,3200],"sw":[1.5,2.4],"d":[0.4,0.9],"g":0.045},{"k":"shimmer","rate":1,"oct":[8,16],"d":[1,2],"g":0.014}]}]],["Music box",[{"k":"v1","layers":[{"k":"music","rate":0.25,"g":0.07},{"k":"ping","rate":0.5,"scale":[4,8],"d":1.2,"g":0.04,"h":3}]}]],["Carousel",[{"k":"v1","layers":[{"k":"orbit","src":"tone","deg":0,"oct":4,"rate":0.14,"rad":1.2,"g":0.03},{"k":"orbit","src":"tone","deg":4,"oct":4,"rate":-0.1,"rad":1.4,"g":0.025},{"k":"orbit","src":"tone","deg":2,"oct":8,"rate":0.19,"rad":1,"g":0.012}]}]],["Spell choir",[{"k":"v1","layers":[{"k":"choir","deg":[0,4,7],"oct":2,"fm":[300,2300,3000],"g":0.06},{"k":"pad","deg":[0,4],"oct":1,"g":0.02,"cut":1400,"drift":18}]}]],["Floating",[{"k":"v1","layers":[{"k":"pad","deg":[0,2,4,6],"oct":1,"g":0.03,"cut":1800,"drift":16},{"k":"shepard","g":0.03,"rate":0.014285714285714285,"dir":1}]}]],["Crystal cave",[{"k":"v1","layers":[{"k":"ping","rate":0.8,"f":[2000,4800],"d":2,"g":0.05,"drop":1,"h":3.98},{"k":"bed","n":"brown","f":200,"g":0.08}]}]],["Moonpool",[{"k":"v1","layers":[{"k":"drone","rel":[1,1.5,2],"g":0.02,"am":[0.05,0.5]},{"k":"ping","rate":0.3,"f":[900,1800],"d":0.8,"g":0.06,"drop":0.6}]}]],["Wisps",[{"k":"v1","layers":[{"k":"orbit","src":"air","f":6000,"rate":0.09,"rad":1.5,"g":0.04},{"k":"glide","rate":0.2,"f":[1800,3000],"sw":[0.8,1.25],"d":[1.5,3],"g":0.025}]}]],["Portal",[{"k":"v1","layers":[{"k":"shepard","g":0.045,"rate":0.03333333333333333,"dir":1},{"k":"bed","n":"pink","ft":"bandpass","f":1200,"q":1,"g":0.08,"sw":[0.05,900]},{"k":"drone","rel":[0.5,0.75],"g":0.03}]}]],["Lullaby",[{"k":"v1","layers":[{"k":"music","rate":0.08,"g":0.06},{"k":"pad","deg":[0,4],"oct":0.5,"g":0.035,"cut":700,"drift":28},{"k":"glassh","rate":0.15,"g":0.03}]}]]]},
{id:'sand',n:'Sand',col:'#e2b46e',line:'Wind, grains and the deep drum of the desert.',sig:[0,1,2],snd:[["The Spice",[{"k":"v1","layers":[{"k":"drone","rel":[1,1.5],"w":"triangle","ff":1200,"g":0.03,"am":[0.07,0.35]},{"k":"shimmer","rate":0.6,"oct":[4,8],"d":[2,4],"g":0.015},{"k":"bed","n":"pink","ft":"bandpass","f":650,"q":0.6,"g":0.07,"lfo":[0.05,0.05]}]}]],["Sandworm",[{"k":"v1","layers":[{"k":"glide","rate":0.06,"f":[28,45],"sw":[0.5,0.7],"d":[6,10],"g":0.32},{"k":"bed","n":"brown","f":120,"g":0.25,"lfo":[0.04,0.15]}]}]],["Eyes of Ibad",[{"k":"v1","layers":[{"k":"pad","deg":[0,2,4],"oct":1,"g":0.035,"cut":1400,"drift":20},{"k":"ping","rate":0.15,"scale":[2,4],"d":9,"g":0.07,"h":2,"w":"triangle"}]}]],["Sietch",[{"k":"v1","layers":[{"k":"bed","n":"brown","f":200,"g":0.2,"lfo":[0.06,0.1]},{"k":"ping","rate":0.3,"f":[500,1100],"d":0.8,"g":0.06,"drop":0.7},{"k":"drone","rel":[0.5,0.502],"ff":400,"g":0.05}]}]],["Thumper",[{"k":"v1","layers":[{"k":"beat","bpm":52,"f":46,"g":0.38,"pat":[0,0.62]},{"k":"bed","n":"brown","f":90,"g":0.15}]}]],["The Voice",[{"k":"v1","layers":[{"k":"choir","deg":[0,4],"oct":0.5,"fm":[500,900,2400],"g":0.09},{"k":"whisper","rate":0.15,"g":0.06}]}]],["Other Memory",[{"k":"v1","layers":[{"k":"shepard","g":0.04,"rate":0.02,"dir":-1},{"k":"choir","deg":[0,2,4],"oct":1,"fm":[400,1100,2600],"g":0.05}]}]],["Water of Life",[{"k":"v1","layers":[{"k":"ping","rate":0.5,"f":[700,1600],"d":1.2,"g":0.06,"drop":0.5},{"k":"drone","rel":[2,3.01],"ff":1800,"g":0.012,"am":[0.1,0.5]},{"k":"bed","n":"pink","ft":"bandpass","f":900,"q":0.5,"g":0.05,"lfo":[0.07,0.04]}]}]],["Sayyadina",[{"k":"v1","layers":[{"k":"choir","deg":[0,3,5],"oct":2,"fm":[350,1700,2700],"g":0.06},{"k":"ping","rate":0.08,"scale":[1,2],"d":12,"g":0.09,"h":2.4}]}]],["Deep Desert",[{"k":"v1","layers":[{"k":"bed","n":"pink","ft":"bandpass","f":450,"q":0.5,"g":0.2,"sw":[0.05,300],"lfo":[0.06,0.1]},{"k":"bed","n":"brown","f":250,"g":0.2,"lfo":[0.03,0.12]},{"k":"orbit","src":"air","f":1200,"rate":0.05,"rad":1.4,"g":0.05}]}]],["Crysknife",[{"k":"v1","layers":[{"k":"ping","rate":0.2,"f":[400,900],"d":6,"g":0.07,"h":2.76,"w":"triangle"},{"k":"drone","rel":[0.25],"ff":300,"g":0.05,"am":[0.05,0.3]}]}]],["Coriolis",[{"k":"v1","layers":[{"k":"bed","n":"pink","ft":"bandpass","f":700,"q":0.4,"g":0.18,"sw":[0.12,500],"lfo":[0.11,0.12]},{"k":"glide","rate":0.1,"f":[60,120],"sw":[0.6,0.8],"d":[3,5],"g":0.2},{"k":"orbit","src":"air","f":1600,"rate":-0.12,"rad":1.2,"g":0.06}]}]]]}
];
/* real recordings on the pads where synthesis sounds least real; the synth version is the fallback */
const REAL={'e:animal:0':['purr',1],'e:animal:3':['wolf',0],'e:breath:1':['breath',1],'e:wet:1':['rain',1],'e:heat:1':['fire',1],'e:underworld:0':['cave',1],'e:celestial:0':['choir',1]};
const RLV={'e:animal:3':.4,'e:breath:1':.45,'e:celestial:0':1.4,'e:heat:1':3,'e:underworld:0':1.3,'e:wet:1':3};
const SB={};
function loadS(ctx,name){return SB[name]||(SB[name]=audioFetch('audio/'+name+'.mp3').then(r=>{if(!r.ok)throw new Error('missing');return r.arrayBuffer()}).then(b=>new Promise((ok,no)=>ctx.decodeAudioData(b,ok,no))))}
G.sample=(name,loop,fallback)=>(ctx,out,L)=>{let dead=false;L.src.push({stop(){dead=true}});
  loadS(ctx,name).then(buf=>{if(dead)return;const play=t=>{const s=ctx.createBufferSource();s.buffer=buf;if(loop){s.loop=true;s.loopStart=.04;s.loopEnd=buf.duration-.07}s.connect(out);s.start(t||0);L.src.push(s)};
    if(loop)play();else{let next=0;L.every(500,t=>{if(t<next)return;next=t+buf.duration+5+Math.random()*9;play(t)})}})
  .catch(()=>{delete SB[name];if(!dead)fallback(ctx,out,L)})};
/* loudness trims per environment sound, filled in from measurement */
const ELV={"e:blood:1":1.6,"e:blood:5":0.69,"e:blood:6":1.67,"e:blood:8":1.6,"e:blood:9":1.9,"e:blood:11":1.72,"e:blood:13":2.5,"e:blood:14":2.5,"e:blood:15":1.41,"e:breath:1":1.6,"e:breath:2":1.6,"e:breath:6":1.22,"e:breath:7":2.2,"e:breath:8":1.28,"e:breath:10":1.6,"e:breath:11":1.6,"e:breath:12":2.5,"e:breath:14":1.28,"e:breath:15":1.2,"e:magnetism:0":1.15,"e:magnetism:1":0.65,"e:magnetism:2":0.65,"e:magnetism:4":0.66,"e:magnetism:5":0.5,"e:magnetism:6":0.64,"e:magnetism:8":0.76,"e:magnetism:9":0.6,"e:magnetism:10":1.34,"e:magnetism:11":1.49,"e:magnetism:13":1.04,"e:magnetism:14":1.04,"e:magnetism:15":0.6,"e:heat:1":2.5,"e:heat:2":1.72,"e:heat:4":1.04,"e:heat:6":1.45,"e:heat:8":1.62,"e:heat:9":2.12,"e:heat:10":2.29,"e:heat:11":1.2,"e:heat:12":2.5,"e:heat:13":0.95,"e:heat:14":0.7,"e:heat:15":0.54,"e:wet:0":0.77,"e:wet:1":2.5,"e:wet:2":1.53,"e:wet:3":0.92,"e:wet:5":1.45,"e:wet:7":1.96,"e:wet:8":1.96,"e:wet:11":1.6,"e:wet:12":1.22,"e:wet:14":2.5,"e:wet:15":1.31,"e:universe:0":0.75,"e:universe:1":0.77,"e:universe:2":2.5,"e:universe:3":2.5,"e:universe:4":1.1,"e:universe:5":0.58,"e:universe:6":0.56,"e:universe:7":0.4,"e:universe:10":1.62,"e:universe:12":1.72,"e:universe:13":0.65,"e:universe:14":0.4,"e:universe:15":0.45,"e:lust:0":0.4,"e:lust:2":1.6,"e:lust:8":1.22,"e:lust:10":0.4,"e:lust:11":0.4,"e:lust:12":2.5,"e:lust:13":1.49,"e:lust:14":0.74,"e:animal:0":0.52,"e:animal:1":0.4,"e:animal:2":0.45,"e:animal:9":2.39,"e:animal:11":1.6,"e:animal:12":1.6,"e:animal:14":2.2,"e:animal:15":2.5,"e:celestial:0":2.5,"e:celestial:1":1.9,"e:celestial:4":1.6,"e:celestial:5":2.5,"e:celestial:7":2.5,"e:celestial:8":1.38,"e:celestial:9":0.86,"e:celestial:10":0.79,"e:celestial:11":0.72,"e:celestial:12":0.4,"e:celestial:13":0.4,"e:celestial:14":2.5,"e:celestial:15":0.85,"e:underworld:0":0.46,"e:underworld:1":0.69,"e:underworld:2":1.9,"e:underworld:4":1.34,"e:underworld:6":2.5,"e:underworld:8":1.6,"e:underworld:9":0.5,"e:underworld:10":0.41,"e:underworld:11":0.4,"e:underworld:14":0.4,"e:underworld:15":0.4,"e:gold:0":1.8,"e:gold:2":1.6,"e:gold:4":1.6,"e:gold:6":1.11,"e:gold:7":1.8,"e:gold:8":1.8,"e:gold:9":0.99,"e:gold:10":1.6,"e:gold:12":0.79,"e:gold:13":1.8,"e:gold:14":0.47,"e:gold:15":1.14,"e:freeze:0":1.08,"e:freeze:1":1.8,"e:freeze:3":1.51,"e:freeze:6":0.82,"e:freeze:8":1.8,"e:freeze:12":1.8,"e:freeze:14":1.6,"e:freeze:15":1.04,"e:dream:0":1.8,"e:dream:1":1.8,"e:dream:4":1.6,"e:dream:7":1.6,"e:dream:8":1.8,"e:dream:10":1.62,"e:dream:11":1.46,"e:dream:13":1.8,"e:dream:14":1.34,"e:dream:15":1.68,"e:nature:0":1.39,"e:nature:1":1.6,"e:nature:3":1.6,"e:nature:4":1.6,"e:nature:5":1.8,"e:nature:6":1.8,"e:nature:7":1.27,"e:nature:9":0.49,"e:nature:12":0.68,"e:nature:13":1.8,"e:nature:14":1.41,"e:nature:15":1.8};
/* Ascension's realms were levelled for Black Dragon 01's engine; measured here one at a time, each set near 0.04 */
Object.assign(ELV,{"e:lust:0": 6, "e:lust:1": 1.26, "e:lust:2": 1.79, "e:lust:3": 1.84, "e:lust:4": 1.72, "e:lust:5": 6, "e:lust:6": 6, "e:lust:7": 1.5, "e:lust:8": 1.83, "e:lust:9": 1.25, "e:lust:10": 6, "e:lust:11": 6, "e:gold:0": 0.45, "e:gold:1": 6, "e:gold:2": 1.03, "e:gold:3": 1.6, "e:gold:4": 0.6, "e:gold:5": 3.05, "e:gold:6": 1.35, "e:gold:7": 6, "e:gold:8": 0.62, "e:gold:9": 6, "e:gold:10": 4.82, "e:gold:11": 1.08, "e:freeze:0": 2.88, "e:freeze:1": 2.07, "e:freeze:2": 2.55, "e:freeze:3": 2.92, "e:freeze:4": 4.0, "e:freeze:5": 0.85, "e:freeze:6": 6, "e:freeze:7": 5.48, "e:freeze:8": 0.46, "e:freeze:9": 3.74, "e:freeze:10": 0.85, "e:freeze:11": 4.76, "e:magic:0": 4.94, "e:magic:1": 6, "e:magic:2": 6, "e:magic:3": 4.0, "e:magic:4": 4.82, "e:magic:5": 1.26, "e:magic:6": 2.84, "e:magic:7": 5.63, "e:magic:8": 1.63, "e:magic:9": 6, "e:magic:10": 1.52, "e:magic:11": 4.88, "e:sand:0": 1.61, "e:sand:1": 1.57, "e:sand:2": 3.81, "e:sand:3": 1.05, "e:sand:4": 1.54, "e:sand:5": 2.19, "e:sand:6": 1.75, "e:sand:7": 2.76, "e:sand:8": 1.49, "e:sand:9": 1.55, "e:sand:10": 1.27, "e:sand:11": 3.01});
ENVS.forEach(e=>e.snd.forEach(([n,specs],i)=>{const id=`e:${e.id}:${i}`,syn=(ctx,out,L)=>{specs.forEach(s=>prim(ctx,out,L,structuredClone(s)));if(L.fol)L.upd=()=>L.fol.forEach(([o,v])=>o.frequency.setTargetAtTime(hBase()*v,ctx.currentTime,.6))},rl=REAL[id],
  b={id,n,cat:e.n.toLowerCase()+' stone',tag:'',verb:rl?0:1,env:e.id,lvl:rl?(RLV[id]||1):(ELV[id]||1),
  info:rl?'A field recording.':'',
  gen:rl?G.sample(rl[0],rl[1],syn):syn};BANK.push(b);BK[id]=b}));

/* ---------- a wider frequency library ---------- */
const addB=b=>{BANK.push(b);BK[b.id]=b};
[[.5,'delta'],[1,'delta'],[2,'delta'],[3,'delta'],[4,'theta'],[5,'theta'],[6,'theta'],[7,'theta'],[8,'alpha'],[10,'alpha'],[12,'alpha'],[14,'beta'],[18,'beta'],[20,'beta'],[30,'gamma'],[40,'gamma']]
  .forEach(([hz,band])=>addB({id:'bw'+hz,n:`${hz} Hz pulse`,cat:'brainwave pulses',tag:ST,lvl:.6,gen:G.pulse(hz<8?120:200,hz),info:`A tone switched on and off ${hz} times a second, in the ${band} band. A second pulse layered under the main beat.`}));
[[14.3,2],[20.8,3],[27.3,4],[33.8,5]].forEach(([hz,k])=>addB({id:'sr'+k,n:`Schumann ${hz}`,cat:'brainwave pulses',tag:TR,lvl:.6,gen:G.pulse(150,hz),info:`${hz} Hz, the ${['','','second','third','fourth','fifth'][k]} resonance of the space between ground and sky, as a pulse. The physics is measured.`}));
[['Uranus',207.36],['Neptune',211.44],['Pluto',140.25],['Platonic year',172.06],['Moon, sidereal',227.43],['Moon, culmination',187.61]]
  .forEach(([nm,hz])=>addB({id:'p'+nm.replace(/[ ,]/g,''),n:nm+' '+hz,cat:'planetary tones',tag:TR,bus:'tone',hz,gen:G.tone(hz),lvl:.4,info:`${nm}, ${hz} Hz. An orbital period doubled octave by octave until it can be heard (Cousto, 1978). The arithmetic is exact.`}));
[['A',292],['B',584],['C',1168],['D',2336],['E',4672],['F',73],['G',146]].forEach(([l,hz])=>addB({id:'ng'+l,n:`Nogier ${l} ${hz}`,cat:'bodywork tones',tag:TR,bus:'tone',hz,gen:G.tone(hz),lvl:hz>2000?.12:.35,
  info:`${hz} Hz, frequency ${l} of the set Paul Nogier used in ear acupuncture from the 1950s. A clinical tradition.`}));
[32,64,128].forEach(hz=>addB({id:'ot'+hz,n:`Otto ${hz}`,cat:'bodywork tones',tag:TR,bus:'tone',hz,gen:G.tone(hz),lvl:.6,info:`${hz} Hz, one of the weighted tuning forks bodyworkers press to bone and muscle. Felt as vibration more than heard.`}));

[['minor second 15:16',16/15],['major second 8:9',9/8],['minor third 5:6',6/5],['major third 4:5',5/4],['minor sixth 5:8',8/5],['major sixth 3:5',5/3],['harmonic seventh 4:7',7/4],['minor seventh 5:9',9/5],['major seventh 8:15',15/8],['octave 1:2',2]]
  .forEach(([nm,r],i)=>addB({id:'iv'+i,n:nm,cat:'pure intervals',tag:ME,verb:1,lvl:.6,gen:G.chord([1,r]),info:`Two tones in the exact ratio ${nm.split(' ').pop()}, built on the carrier. Whole-number ratios are what the ear hears as pure.`}));
[['suspended 6:8:9',[1,4/3,1.5]],['diminished',[1,1.2,1.44]],['augmented',[1,1.25,1.5625]],['major seventh chord',[1,1.25,1.5,1.875]],['minor seventh chord',[1,1.2,1.5,1.8]],['ninth chord 4:5:6:7:9',[1,1.25,1.5,1.75,2.25]],
  ['Pythagorean triad 64:81:96',[1,81/64,1.5]],['undertones 1 to 6',[1,1/2,1/3,1/4,1/5,1/6].map(x=>x*4)],['fifths stacked',[1,1.5,2.25,3.375]],['fourths stacked',[1,4/3,16/9,64/27]]]
  .forEach(([nm,rs],i)=>addB({id:'ch'+i,n:nm,cat:'chords',tag:ME,verb:1,lvl:.6,gen:G.chord(rs),info:`${nm[0].toUpperCase()+nm.slice(1)}, in exact ratios built on the carrier.`}));
[['sub rumble',['lowpass',60],'brown',2],['low band',['bandpass',180,.7],'pink',1.6],['mid band',['bandpass',1000,.7],'pink',1.6],['high band',['bandpass',4000,.7],'white',1.2],['air band',['highpass',9000],'white',1]]
  .forEach(([nm,f,n,lvl],i)=>addB({id:'nb'+i,n:nm,cat:'coloured noise',tag:ME,lvl,gen:G.noise(n,f),info:`Noise kept to one part of the hearing range: ${nm}.`}));

/* ---------- presets for the stones ---------- */
[['Blood','blood','dread','infernal brass'],['Breath','breath','stillness','flute'],['Magnetism','magnetism','gateway','fm glass'],['Heat','heat','journey','oud'],['Wet','wet','stillness','harp'],
 ['Universe','universe','hypnagogia','glass pad'],['Luxuria','lust','desire','cello'],['Animal attraction','animal','journey','didgeridoo'],['Celestial','celestial','solfeggio','boy choir'],['Avernus','underworld','chamber','bass choir'],['Gold','gold','earth','vibraphone'],['Freeze','freeze','abyss','crystal bowl'],['Dream','dream','hypnagogia','glass pad'],['Nature','nature','earth','flute']]
 .forEach(([n,id,st,vo])=>{const e=ENVS.find(x=>x.id===id);PRESETS.push([n,'stones',st,vo,Object.fromEntries(e.sig.map(i=>[`e:${id}:${i}`,.5])),id]);
   PRESETS.push([n+', deep','stones',st,vo,Object.fromEntries([...e.sig,(e.sig[0]+3)%16,(e.sig[1]+5)%16].map(i=>[`e:${id}:${i}`,.45])),id])});
PCATS.unshift('stones');PRESETS.sort((a,b)=>PCATS.indexOf(a[1])-PCATS.indexOf(b[1]));

/* ---------- readout line ---------- */
function say(msg){const el=$('#lcd');if(!el)return;el.textContent=msg;el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}

/* ---------- environments and pads ---------- */
let ENV=null;
const envPads=id=>Object.keys(S.layers).filter(k=>k.startsWith('e:'+id+':'));
function paintPads(){
  $$('.stone').forEach(b=>{b.classList.toggle('on',b.dataset.id===ENV);b.classList.toggle('lit',envPads(b.dataset.id).length>0)});
  $$('.pad').forEach(b=>{const v=S.layers[b.dataset.id];b.classList.toggle('on',v!=null);b.style.setProperty('--lv',v==null?0:v)});
}
function buildPads(){
  const e=ENVS.find(x=>x.id===ENV),el=$('#pads');
  if(!e){el.innerHTML='<h3>Choose a stone</h3><p class="vh">Each stone opens sixteen sounds of its own. Press a stone below.</p>';return}
  el.innerHTML=`<h3>${e.n}</h3><p class="vh">${e.line} Press a pad to add it. Scroll on a pad to set its level.</p><div class="padg">`+e.snd.map(([n],i)=>`<button class="pad${REAL[`e:${e.id}:${i}`]?' rec':''}" data-id="e:${e.id}:${i}"><span>${n}</span></button>`).join('')+'</div>';
}
function setEnv(id,start){
  const e=ENVS.find(x=>x.id===id),prev=ENV;
  if(prev&&prev!==id)envPads(prev).forEach(k=>setLayer(k,null));
  if(!e||(prev===id&&start!==false)){if(prev)envPads(prev).forEach(k=>setLayer(k,null));ENV=null;S.env='';window.ENVCOL=null;document.documentElement.style.removeProperty('--env');buildPads();paintPads();say('stone put down');return}
  ENV=id;S.env=id;window.ENVCOL=e.col;document.documentElement.style.setProperty('--env',e.col);buildPads();
  if(start!==false&&!envPads(id).length)e.sig.forEach(i=>setLayer(`e:${id}:${i}`,.5));
  paintPads();say(`${e.n.toLowerCase()} · ${e.line.toLowerCase()}`);
}
$('#stones').innerHTML=ENVS.map(e=>`<button class="stone" data-id="${e.id}" style="--c:${e.col}"><i></i><span>${e.n}</span></button>`).join('');
$('#stones').onclick=e=>{const b=e.target.closest('.stone');if(b)setEnv(b.dataset.id)};
$('#pads').addEventListener('click',e=>{const b=e.target.closest('.pad');if(b){const id=b.dataset.id;setLayer(id,id in S.layers?null:.5)}});
$('#pads').addEventListener('wheel',e=>{const b=e.target.closest('.pad');if(!b)return;e.preventDefault();const id=b.dataset.id,v=clamp((S.layers[id]==null?.3:S.layers[id])+(e.deltaY<0?.06:-.06),.05,1);setLayer(id,v)},{passive:false});

/* ---------- make every control answer back ---------- */
{const f0=setVoice;setVoice=i=>{f0(i);say('keys · '+VOICES[S.voice])};
 const f1=setLayer;setLayer=(id,v)=>{f1(id,v);if(BK[id])say(v==null?BK[id].n+' · off':`${BK[id].n} · ${Math.round(v*100)}`)};
 const f2=paintBank;paintBank=()=>{f2();paintPads()};
 const f3=setState;setState=(i,k)=>{f3(i,k);const s=STATES[S.state];say(`${s.name.toLowerCase()} · ${s.beat} hz · ${s.sub}`)};
 const f4=applyPreset;applyPreset=i=>{const p=PRESETS[i];if(p[5])setEnv(p[5],false);else if(ENV)setEnv(null);f4(i);paintPads();say('preset · '+p[0].toLowerCase())};
 const f5=silence;silence=on=>{f5(on);say(silenced?'paused. press again, or the space bar, to carry on':'sound on')};
 const f6=setFilm;setFilm=i=>{f6(i);say(`loading visualizer ${film+1} of ${FILMS.length}`)};
 {const v=$('#veil');v.addEventListener('playing',()=>{if(A.ctx)say(`visualizer ${film+1} of ${FILMS.length}`)});v.addEventListener('error',()=>{if(v.getAttribute('src'))say(`visualizer ${film+1} did not load. press the button again`)})}
 const f7=setKamea;setKamea=i=>{f7(i);const [nm,n]=KAMEA[MON.i];$('#monP').textContent=nm.toLowerCase();$('#monN').textContent=n*(n*n+1)/2;
   say(`monad · ${nm.toLowerCase()} · ${n} by ${n} · every line adds to ${n*(n*n+1)/2}`);
   if(A.ctx&&!silenced)MON.sq[0].slice(0,5).forEach((v,j)=>{const d=Math.round((v-1)/(n*n-1)*14);setTimeout(()=>{noteOn('C'+j,d,.6);setTimeout(()=>noteOff('C'+j,d),500)},j*90)})}}
$('#bTide').addEventListener('click',()=>{say(S.tide?'tide on · a swell that builds and breaks, starting now':'tide off');if(S.tide&&A.ctx)tide()});
$('#bPossess').addEventListener('click',()=>say(possess?'possess on · the machine plays itself. touch a key to steer it':'possess off'));
$('#bDescent').addEventListener('click',()=>say(desc?'descent · fifteen minutes down to the bottom':'descent stopped'));
$('#bBreath').addEventListener('click',()=>say(S.breath?'breath on · follow the ring. six a minute':'breath off'));
$('#knobs').addEventListener('pointermove',e=>{if(!e.buttons)return;const k=e.target.closest('.knob');if(k){const i=[...$('#knobs').children].indexOf(k);say(`${KN[i][1]} · ${Math.round(S[KN[i][0]]*100)}`)}});
$('#modes').addEventListener('click',()=>say('beat · '+S.mode));

/* ---------- the big Monad button ---------- */
(function(){const b=$('#monad');let timer=null,down=0;
  b.addEventListener('pointerdown',e=>{b.setPointerCapture(e.pointerId);down=performance.now();b.classList.add('down');timer=setTimeout(()=>{if(!A.ctx)return;monadStart();say('monad · tracing the square. let go to stop')},260)});
  const up=()=>{if(!down)return;clearTimeout(timer);b.classList.remove('down');if(MON.held)monadStop();else if(performance.now()-down<260)setKamea(MON.i+1);down=0};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up)})();

/* ---------- boot ---------- */
{const order=[];BANK.forEach(b=>{if(!order.includes(b.cat))order.push(b.cat)});BANK.sort((a,b)=>order.indexOf(a.cat)-order.indexOf(b.cat))}
bankBoot();buildPads();paintPads();
(function chips(){const el=$('#bank'),row=document.createElement('div');row.className='chips';[...el.querySelectorAll('h4')].forEach(h=>{const c=document.createElement('button');c.className='chip';c.textContent=h.textContent;c.onclick=()=>h.scrollIntoView({block:'start',behavior:'smooth'});row.appendChild(c)});
  el.querySelector('.q').after(row)})();
say('greetings beloved');

/* ---------- sounding now: everything making sound, each with an off switch ---------- */
function liveList(){
  const s=STATES[S.state],L=[];
  if(S.tone>.01)L.push(['beat tone, '+S.beat+' hz',()=>{S.tone=0}]);
  if(S.tone>.01&&s.drum)L.push(['drum',()=>{S.tone=0}]);
  if(S.body>.01)L.push(['body chord',()=>{S.body=0}]);
  if(S.air>.01)L.push(['air',()=>{S.air=0}]);
  if(S.close>.01)L.push(['close whisper',()=>{S.close=0}]);
  if(S.tide)L.push(['tide',()=>$('#bTide').click()]);
  if(possess)L.push(['possess',()=>$('#bPossess').click()]);
  Object.keys(S.layers).forEach(id=>BK[id]&&L.push([BK[id].n,()=>setLayer(id,null)]));
  return L}
let liveKey='';
function paintLive(){const L=liveList(),key=L.map(x=>x[0]).join('|')+silenced;if(key===liveKey)return;liveKey=key;const el=$('#live');
  el.innerHTML='<b>'+(silenced?'silenced':'sounding now')+'</b>'+(L.length?'':'<span style="opacity:.6">nothing but the keys</span>');
  L.forEach(([n,off])=>{const b=document.createElement('button');b.className='lv';b.textContent=n;b.title='Turn off '+n;b.onclick=()=>{off();paintKnobs();applyAll();say(n+' · off')};el.appendChild(b)})}
setInterval(paintLive,400);paintLive();
$$('.ktabs .pill').forEach(b=>b.onclick=()=>{$('#knobs').dataset.b=b.dataset.b;$$('.ktabs .pill').forEach(x=>x.classList.toggle('on',x===b));say(b.textContent)});

/* ---------- phone tabs and close buttons on the menus ---------- */
$('.hud').dataset.tab='play';
$('#tabs').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;$('.hud').dataset.tab=b.dataset.t;$$('#tabs button').forEach(x=>x.classList.toggle('on',x===b));DR.forEach(d=>$('#'+d).hidden=true);$('.hud').scrollTop=0};
DR.forEach(d=>{const b=document.createElement('button');b.className='pill dclose';b.textContent='close';b.onclick=()=>{$('#'+d).hidden=true};$('#'+d).prepend(b)});
