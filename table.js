/* Black Dragon II: the areas carried over from Black Dragon 01 and rebuilt against the research.
   Healing table, body programs, trance inductions, rites, the Forge, the Monad that revs, reset and volume.
   Loaded last; shares globals with index.html, bank.js and env.js. */

DR.push('heal','body','trance','rites','forge');
DR.slice(-5).forEach(d=>{const b=document.createElement('button');b.className='pill dclose';b.textContent='close';b.onclick=()=>{$('#'+d).hidden=true};$('#'+d).prepend(b)});
[['bHeal','heal'],['bBody','body'],['bTrance','trance'],['bRites','rites'],['bForge','forge']].forEach(([b,d])=>$('#'+b).onclick=e=>{e.stopPropagation();openDr(d)});
const tg=t=>`<span class="tag ${t}">${t}</span>`;

/* ================= HEALING TABLE: banks of held tones, each in one of five tone recipes ================= */
const RECIPES=[['pure','One sine wave. Nothing but the frequency.',[1]],['glass','Odd overtones only, hollow and clear.',[1,3,5,7,9]],['choir','Doubled overtones that beat like voices.',[1,2,2.003,3,4,4.004]],
  ['bowl','The overtones of a struck metal bowl.',[1,2.76,5.4,8.93]],['tetractys','Overtones at 1, 2, 3, 4, 6, 8, 9 and 12, the Pythagorean numbers.',[1,2,3,4,6,8,9,12]]];
let recipe=0;
const HBANKS=[
 {n:'solfeggio',tag:TR,note:'The best known healing set, drawn from a number pattern in the Book of Numbers. Every tone here is exact, and the Proof panel measures each one while it plays.',
  t:[[174,'foundation'],[285,'renew'],[396,'release'],[417,'change'],[528,'miracle'],[639,'connect'],[741,'awaken'],[852,'intuition'],[963,'crown'],[432,'verdi'],[111,'cell'],[136.1,'om']]},
 {n:'cosmic',tag:TR,note:'Each tone is a real orbit or rotation doubled, octave after octave, until it reaches the hearing range (Hans Cousto, 1978). The arithmetic is exact.',
  t:[[126.22,'sun'],[210.42,'moon'],[141.27,'mercury'],[221.23,'venus'],[194.18,'earth day'],[136.1,'earth year'],[144.72,'mars'],[183.58,'jupiter'],[147.85,'saturn'],[207.36,'uranus'],[211.44,'neptune'],[172.06,'platonic year']]},
 {n:'brainwave',tag:ST,beat:1,note:'These set the beat, not a tone: a carrier at 136.1 Hz with the two ears set apart by the number shown. Pooled trials found effects on attention, memory, pain and anxiety.',
  t:[[.5,'delta, deepest'],[1.5,'delta'],[3,'delta'],[4.5,'theta'],[6,'theta'],[7.83,'schumann'],[10,'alpha'],[12,'alpha'],[14,'smr'],[18,'beta'],[25,'beta'],[40,'gamma']]},
 {n:'chakra',tag:TR,note:'Seven solfeggio tones mapped to the seven centres of the body, with Om beneath. The sounds drawer holds the other mapping, a scale built on C at 256 Hz.',
  t:[[396,'root'],[417,'sacral'],[528,'solar plexus'],[639,'heart'],[741,'throat'],[852,'third eye'],[963,'crown'],[136.1,'om']]},
 {n:'body',tag:ST,note:'Low tones used on the body rather than the ear. 40 Hz sound drove matching brain rhythms in MIT trials and eased fibromyalgia in one study. The Otto forks are pressed to bone by bodyworkers. Nogier used his seven frequencies in ear acupuncture. Felt best through a subwoofer or good headphones.',
  t:[[40,'gamma, vibro'],[52,'vibro'],[68,'vibro'],[86,'vibro'],[32,'otto'],[64,'otto'],[128,'otto'],[73,'nogier f'],[146,'nogier g'],[292,'nogier a'],[584,'nogier b'],[1168,'nogier c']]}
];
let hbank=0;
const hid=hz=>'h:'+hz;
function healGen(hz){return (ctx,out,L)=>{const rs=RECIPES[recipe][2];rs.forEach((r,k)=>{if(hz*r>15000)return;const o=ctx.createOscillator(),g=gn(ctx,(k?.42/(k+1):1)*(k&&hz*r>900?Math.pow(900/(hz*r),.8):1));o.frequency.value=hz*r;o.connect(g).connect(out);o.start();L.src.push(o);
  if(recipe===3&&k)L.src.push(lfo(ctx,.25+k*.21,.5*g.gain.value,g.gain))})}}
HBANKS.forEach(b=>{if(!b.beat)b.t.forEach(([hz,nm])=>{const id=hid(hz);if(!BK[id])BK[id]={id,n:`${hz} Hz, ${nm}`,cat:'healing table',tag:b.tag,bus:'tone',hz,lvl:hz<60?.7:hz>1000?.2:.35,gen:healGen(hz),info:b.note}})});
function healToggle(hz){const b=HBANKS[hbank];
  if(b.beat){S.fc=136.1;S.beat=hz;S.mode=hz>=30?'isochronic':'binaural';paintDial();paintModes();applyBeat();say(`beat · ${hz} hz · ${b.t.find(x=>x[0]===hz)[1]} · carrier 136.1`);paintHeal();return}
  const id=hid(hz);setLayer(id,id in S.layers?null:.5);paintHeal()}
function paintHeal(){const b=HBANKS[hbank];$$('#heal .hb').forEach(x=>{const hz=+x.dataset.hz;x.classList.toggle('on',b.beat?Math.abs(S.beat-hz)<.005:hid(hz) in S.layers)});
  $$('#heal .bk').forEach((x,i)=>x.classList.toggle('on',i===hbank));$$('#heal .rc').forEach((x,i)=>x.classList.toggle('on',i===recipe))}
function buildHeal(){const b=HBANKS[hbank],el=$('#heal'),keep=el.querySelector('.dclose');
  el.innerHTML=`<h3>Healing table<span class="tag hTrad">tradition</span></h3>
  <div class="vg">${HBANKS.map((x,i)=>`<button class="vb bk" data-i="${i}">${x.n}</button>`).join('')}</div>
  <div class="hgrid">${b.t.map(([hz,nm])=>`<button class="hb" data-hz="${hz}"><b>${hz}</b><span>${nm}</span></button>`).join('')}</div>
  ${b.beat?'':`<h4>Tone recipe</h4><div class="vg">${RECIPES.map((r,i)=>`<button class="vb rc" data-i="${i}">${r[0]}</button>`).join('')}</div>`}
  <button class="vb" id="hClear" style="margin-top:14px">let go of every tone</button>`;
  el.prepend(keep);paintHeal()}
$('#heal').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.classList.contains('bk')){hbank=+t.dataset.i;buildHeal()}
  else if(t.classList.contains('rc')){recipe=+t.dataset.i;Object.keys(S.layers).filter(k=>k.startsWith('h:')).forEach(k=>{const v=S.layers[k];setLayer(k,null);setTimeout(()=>setLayer(k,v),560)});buildHeal();say('tone recipe · '+RECIPES[recipe][0])}
  else if(t.classList.contains('hb'))healToggle(+t.dataset.hz)
  else if(t.id==='hClear'){Object.keys(S.layers).filter(k=>k.startsWith('h:')).forEach(k=>setLayer(k,null));paintHeal()}});

/* ================= PROGRAM RUNNER: body programs and trance inductions ================= */
let RUN=null,plen=1;
const SNAPK=['fc','beat','mode','breath','veil','vision','trails','twist','mirrors','speed'];
const MIX={keys:.5,world:.5,tones:.5,monad:.5,rites:.5};
function showHud(on){$('#rhud').hidden=!on;$('#dial').classList.toggle('dimmed',on);if(!on)$('#kuji').innerHTML=''}
function hudSet(big,hint,cnt){$('#rBig').textContent=big||'';$('#rHint').textContent=hint||'';$('#rCnt').textContent=cnt||''}
function stopRun(quiet){if(!RUN)return;const r=RUN;RUN=null;clearInterval(r.tm);(r.timers||[]).forEach(clearTimeout);showHud(false);window.VMODE=null;
  (r.on||[]).forEach(id=>setLayer(id,null));Object.assign(S,r.snap);paintDial();paintModes();paintKnobs();applyAll();$('#bBreath').classList.toggle('on',S.breath);if(A.ctx)A.breathT0=A.ctx.currentTime;
  $$('.prun').forEach(b=>{b.classList.remove('on');b.textContent='begin'});if(!quiet)say(r.name+' · ended')}
$('#rStop').onclick=()=>stopRun();
function stageOn(r,st){
  (r.on||[]).forEach(id=>setLayer(id,null));r.on=[];const o=st[4]||{};
  S.fc=st[1];S.beat=Array.isArray(st[2])?st[2][0]:st[2];if(st[3])S.mode=st[3];S.breath=!!o.breath;if(o.dim!=null)S.veil=o.dim;if(o.vis!=null)S.vision=o.vis;if(o.twist!=null)S.twist=o.twist;if(o.speed!=null)S.speed=o.speed;
  window.VMODE=o.vm!=null?o.vm:null;if(A.ctx)A.breathT0=A.ctx.currentTime;
  (o.tones||[]).forEach(hz=>{const id=hid(hz);if(!BK[id])BK[id]={id,n:hz+' Hz',cat:'healing table',tag:TR,bus:'tone',hz,lvl:.35,gen:healGen(hz),info:''};if(!(id in S.layers)){setLayer(id,.45);r.on.push(id)}});
  Object.entries(o.layers||{}).forEach(([id,v])=>{if(BK[id]&&!(id in S.layers)){setLayer(id,v);r.on.push(id)}});
  paintDial();paintModes();paintKnobs();applyAll();$('#bBreath').classList.toggle('on',S.breath)}
function runProg(p,btn){
  if(!A.ctx)return;if(RUN){const same=RUN.name===p.n;stopRun(true);if(same)return}
  const tot=p.st.reduce((a,s)=>a+s[0],0),r=RUN={kind:'prog',name:p.n,snap:Object.fromEntries(SNAPK.map(k=>[k,S[k]])),on:[],si:-1,t0:performance.now(),timers:[]};
  if(btn){btn.classList.add('on');btn.textContent='stop'}showHud(true);DR.forEach(d=>$('#'+d).hidden=true);
  r.tm=setInterval(()=>{if(RUN!==r)return;const el=(performance.now()-r.t0)/60000/plen;let acc=0,si=p.st.length-1,into=0;for(let i=0;i<p.st.length;i++){if(el<acc+p.st[i][0]){si=i;into=(el-acc)/p.st[i][0];break}acc+=p.st[i][0]}
    if(el>=tot)return stopRun();const st=p.st[si],o=st[4]||{};if(si!==r.si){r.si=si;stageOn(r,st)}
    if(Array.isArray(st[2])){const b=+Math.exp(Math.log(st[2][0])+(Math.log(st[2][1])-Math.log(st[2][0]))*into).toFixed(2);if(Math.abs(b-S.beat)>=.01){S.beat=b;paintDial();applyBeat()}}
    const sc=o.script,line=sc?sc[Math.min(sc.length-1,Math.floor(into*sc.length))]:(o.text||''),left=Math.max(0,(tot-el)*plen*60);
    hudSet(line,`${p.n} · ${si+1} of ${p.st.length} · ${S.fc} hz, ${S.beat} hz ${S.mode}`,`${Math.floor(left/60)}:${String(Math.floor(left%60)).padStart(2,'0')} left`)},250);
  say(`${p.n} · ${Math.round(tot*plen)} minutes`)}

/* stage: [minutes, carrier, beat or [from,to], beat type, {tones, layers, breath, dim, vm, script or text}] */
const BODY=[
 {n:'Pain',tag:ST,why:'Hypnosis lowers pain in 85 controlled trials (effect size 0.54 to 0.76), most strongly with a direct suggestion that the pain is fading. Music lowers pain too (Cochrane, 12 trials). This is a hypnotic induction with that suggestion, on slow breath.',
  st:[[3,136.1,[10,7],'binaural',{breath:1,script:['Sit or lie back.\nLet the breath slow.','In with the ring.\nOut with the ring.','Let the shoulders drop.','Let the jaw go loose.']}],
      [6,136.1,[7,4.5],'binaural',{breath:1,tones:[174],script:['Find the place that hurts.','Give it a shape\nand a colour.','Watch the colour fade.','The shape grows smaller.','It is further away now.','Cool. Distant. Quiet.']}],
      [3,136.1,[4.5,8],'binaural',{breath:1,tones:[285],script:['Keep the quiet.','Take it with you.','Come back slowly.']}]]},
 {n:'Deep sleep',tag:ST,why:'Pink noise timed to slow brain waves deepened sleep and doubled next-day word recall (Ngo, 2013). This plays that sound with a delta beat, slow breath and a screen dimmed to deep red, the light that least holds back melatonin.',
  st:[[4,136.1,[6,3],'binaural',{breath:1,dim:.18,layers:{pink:.35},text:'Lie down.\nEyes closed.'}],[4,136.1,[3,1.5],'binaural',{dim:.08,layers:{pink:.45},text:'Sinking.'}],[4,111,[1.5,.8],'binaural',{dim:.03,layers:{pink:.5,bw1:.2},text:'Sleep.'}]]},
 {n:'Calm',tag:ST,why:'Breathing six times a minute is the best supported way to quiet the body: it makes the heart rhythm swing its widest. Alpha beat beneath, and a heartbeat at a resting sixty.',
  st:[[4,396,10,'binaural',{breath:1,layers:{heartbeat:.3},text:'Breathe with the ring.'}],[4,432,[10,8],'binaural',{breath:1,layers:{heartbeat:.3},text:'Longer out than in.'}],[4,528,[8,6],'binaural',{breath:1,text:'Nothing to do.'}]]},
 {n:'Focus',tag:ST,why:'Sound and light at 40 Hz drove matching brain rhythms in MIT trials. This plays a 40 Hz beat with a little white noise under it.',
  st:[[3,432,14,'isochronic',{text:'Settle on one task.'}],[3,528,18,'isochronic',{text:'Narrow.'}],[6,136.1,40,'isochronic',{tones:[40],layers:{white:.12},text:'Hold.'}]]},
 {n:'Vibro, 40 Hz',tag:ST,why:'Low-frequency sound felt through the body. Women with fibromyalgia reported large gains from 40 Hz sessions. Needs a subwoofer, a transducer cushion or strong headphones.',
  st:[[4,80,[10,6],'monaural',{tones:[40],breath:1,text:'Feel it in the chest.'}],[8,80,6,'monaural',{tones:[40,52],breath:1,text:'Let it move through.'}]]},
 {n:'Teeth',tag:TR,why:'The tones given for teeth and jaw, on the pain induction.',
  st:[[4,285,3,'binaural',{tones:[285],breath:1,text:'Unclench the jaw.'}],[4,528,6,'binaural',{tones:[528],breath:1,text:'Tongue off the roof\nof the mouth.'}],[4,174,2,'binaural',{tones:[174],breath:1,text:'Cool. Distant.'}]]},
 {n:'Pineal',tag:TR,why:'The tones tradition gives the gland the old books call the third eye. The screen goes near black.',
  st:[[4,136.1,6.3,'binaural',{tones:[936],dim:.1,vm:4,text:'Close your eyes.\nLet the room go dark.'}],[4,136.1,4,'binaural',{tones:[963],dim:.04,vm:4,text:'Attention between\nthe eyebrows.'}],[4,136.1,7.83,'binaural',{tones:[852],dim:.02,vm:4,text:'Stay in the dark.'}]]},
 {n:'Headache',tag:TR,why:'The tones given for the head. Tension eases with relaxation and slow breathing, which is what the alpha beat and breath ring are for.',
  st:[[4,174,10,'binaural',{tones:[174],breath:1,dim:.15,text:'Soften the forehead.'}],[4,285,8,'binaural',{tones:[285],breath:1,dim:.1,text:'Soften behind the eyes.'}],[4,432,6,'binaural',{tones:[432],breath:1,dim:.08,text:'Let the scalp loosen.'}]]},
 {n:'Cramps',tag:TR,why:'The tones given for cramps, over slow breath. Add heat.',
  st:[[4,174,2,'binaural',{tones:[174],breath:1,text:'Breathe low,\ninto the belly.'}],[4,285,5,'binaural',{tones:[285],breath:1,text:'Let it unknot.'}],[4,396,9,'binaural',{tones:[396],breath:1,text:'Warmth spreading.'}]]},
 {n:'Body aches',tag:TR,why:'The tones given for the aching body, on the pain induction above.',
  st:[[4,174,2,'binaural',{tones:[174],breath:1,text:'Heavy limbs.'}],[4,285,3,'binaural',{tones:[285],breath:1,text:'Each part lets go.'}],[4,528,6,'binaural',{tones:[528],breath:1,text:'Warm and loose.'}]]},
 {n:'Arthritis',tag:TR,why:'The tones given for the joints, held low and slow so they are felt as much as heard.',
  st:[[4,174,1.5,'binaural',{tones:[174],breath:1,text:'Rest the joints.'}],[4,285,4,'binaural',{tones:[285],breath:1,text:'Warmth in the hands.'}],[4,136.1,7.83,'binaural',{tones:[136.1],breath:1,text:'Easy.'}]]},
 {n:'Vision',tag:TR,why:'The tones given for the eyes. This dims the screen and asks you to close them.',
  st:[[4,528,10,'binaural',{tones:[528],dim:.1,text:'Close your eyes.'}],[4,639,12,'binaural',{tones:[639],dim:.06,text:'Let them rest back\nin the head.'}],[4,852,7,'binaural',{tones:[852],dim:.04,text:'Dark and soft.'}]]}
];
const TRANCE=[
 {n:'Fixation',tag:ST,why:'James Braid, 1843: fix the eyes on one bright point until the lids grow heavy. Eye fixation is part of nearly every induction since.',
  st:[[3,136.1,[10,8],'binaural',{vm:1,twist:.25,speed:.2,script:['Look at the centre\nof the glass.','Do not look away.','Let the edges blur.','The lids grow heavy.']}],[5,136.1,[8,5],'binaural',{vm:1,twist:.4,speed:.15,breath:1,script:['Heavier.','You could close them.','Let them close.','Deeper with each breath.']}],[2,136.1,[5,9],'binaural',{script:['Rising.','Eyes open.']}]]},
 {n:'Staircase',tag:ST,why:'The countdown deepener: ten steps down, the beat falling with you from alpha to low theta. Counting is the most used deepening method there is.',
  st:[[1,136.1,10,'binaural',{breath:1,text:'Ten steps down.'}],...[10,9,8,7,6,5,4,3,2,1].map((k,i)=>[.8,136.1,+(10-i*.65).toFixed(2),'binaural',{breath:1,text:String(k)}]),[3,136.1,3.5,'binaural',{breath:1,dim:.12,text:'The bottom.\nStay.'}],[1.5,136.1,[3.5,9],'binaural',{text:'Climb back.'}]]},
 {n:'Fractionation',tag:TR,why:'Brought up and dropped again, each drop goes deeper than the last. A stage hypnotist\'s tool since the 1940s.',
  st:[[2,136.1,[10,5],'binaural',{breath:1,text:'Down.'}],[.7,136.1,[5,11],'binaural',{text:'Up. Eyes open.'}],[2,136.1,[11,4.2],'binaural',{breath:1,text:'Down, deeper.'}],[.7,136.1,[4.2,11],'binaural',{text:'Up.'}],[2.5,136.1,[11,3.5],'binaural',{breath:1,dim:.1,text:'Down. Deeper still.'}],[.7,136.1,[3.5,11],'binaural',{text:'Up.'}],[3,136.1,[11,3],'binaural',{breath:1,dim:.06,text:'All the way down.'}],[1.4,136.1,[3,9],'binaural',{text:'Return.'}]]},
 {n:'The pass',tag:TR,why:'Mesmer, Paris, 1780s: slow passes of the hands down the body while the glass armonica played. A royal commission with Franklin and Lavoisier was sent to investigate him. Choose the glass armonica voice.',
  st:[[4,146.8,7.5,'monaural',{breath:1,vm:3,layers:{'e:breath:6':.3},script:['A hand passes\nfrom your crown downward.','Slowly. Again.','Something follows it down.','Again.']}],[6,146.8,[7.5,5],'monaural',{breath:1,vm:3,layers:{'e:breath:6':.3,fifth:.2},script:['Warmth where it passes.','Heavier each time.','Let the crisis come\nor let it not.','Stillness.']}]]},
 {n:'Ganzfeld',tag:ST,why:'A featureless field of light and steady noise. Most people begin to see things within minutes, and EEG shows an active, attentive state, not sleep (Wackermann, 2008). Keep your eyes open and soft.',
  st:[[12,136.1,10,'binaural',{vm:4,vis:1,layers:{pink:.45},script:['Eyes open.\nLook at nothing.','Let the field fill\nyour whole sight.','Whatever appears,\nlet it.','Do not chase it.']}]]},
 {n:'Gateway',tag:TR,why:'The Monroe Institute\'s first state, "mind awake, body asleep": a theta beat under pink noise with a resonant hum on the out-breath. A US Army report assessed the method in 1983 and was declassified in 2003.',
  st:[[3,100,[8,4],'binaural',{breath:1,layers:{pink:.3},script:['Put your worries\nin a box. Close it.','Hum on the out-breath.','Feel it in the skull.']}],[9,100,4,'binaural',{layers:{pink:.35},dim:.08,script:['Body asleep.','Mind awake.','Stay at the edge.','Drift, but do not fall.']}]]},
 {n:'Monotony',tag:ST,why:'One tone, one noise, nothing changing. Hebb\'s McGill experiments in the 1950s found that unchanging input raised suggestibility and brought on visions.',
  st:[[15,110,6,'monaural',{vm:4,vis:.4,speed:.05,layers:{brown:.4},script:['Nothing will change.','Wait.','Still nothing.','Notice what the mind\nmakes on its own.']}]]},
 {n:'Confusion',tag:TR,why:'Milton Erickson\'s method: overload the watching mind until it lets go. Here a tone rises forever while another falls, then everything stops.',
  st:[[4,136.1,[12,7],'binaural',{vm:2,twist:.5,speed:.7,layers:{shepard:.3,'e:underworld:14':.4},script:['Is it rising\nor falling?','Follow both.','You cannot.','Stop trying.']}],[6,136.1,[7,4],'binaural',{breath:1,dim:.1,vm:4,script:['Stillness.','There is nothing\nto follow now.','Rest in it.']}]]}
];
function buildProgs(id,title,intro,list){const el=$('#'+id),keep=el.querySelector('.dclose');
  el.innerHTML=`<h3>${title}${id==='body'?'<span class="tag hTrad">tradition</span>':''}</h3>${intro?`<p class="vh">${intro}</p>`:''}<div class="vg" style="margin:8px 0 4px">${[[.5,'short'],[1,'full'],[2,'long']].map(([m,l])=>`<button class="vb pl${m===plen?' on':''}" data-m="${m}">${l}</button>`).join('')}</div>`
    +list.map((p,i)=>{const t=p.st.reduce((a,s)=>a+s[0],0);
      /* the healing programs show only their name and the numbers they play: the beat in hertz, then any held tones */
      if(id==='body'){const bs=[...new Set(p.st.flatMap(s=>Array.isArray(s[2])?s[2]:[s[2]]))],ts=[...new Set(p.st.flatMap(s=>(s[4]&&s[4].tones)||[]))];
        return `<div class="prow"><div><b>${p.n}</b> <span class="vh">${bs.join(' → ')} Hz${ts.length?' · '+ts.join(', ')+' Hz':''} · ${Math.round(t*plen)} min</span></div><button class="vb prun" data-l="${id}" data-i="${i}">begin</button></div>`}
      return `<div class="prow"><div><b>${p.n}</b> <span class="vh">${Math.round(t*plen)} min</span><p>${tg(p.tag)}${p.why}</p></div><button class="vb prun" data-l="${id}" data-i="${i}">begin</button></div>`}).join('');
  el.prepend(keep)}
function buildAllProgs(){buildProgs('body','Body programs','',BODY);
  buildProgs('trance','Extasis','Hypnotic inductions built from how hypnotists actually work. The words appear in the glass; follow them. Headphones, a dark room, alone.',TRANCE)}
['body','trance'].forEach(id=>$('#'+id).addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.classList.contains('pl')){plen=+b.dataset.m;buildAllProgs()}else if(b.classList.contains('prun'))runProg((b.dataset.l==='body'?BODY:TRANCE)[+b.dataset.i],b)}));

/* ================= RITES, carried over from Black Dragon 01 ================= */
const V7=['I','Ē','O','U','E','A','Ō'],ABRA=['ABRACADABRA','ABRACADABR','ABRACADAB','ABRACADA','ABRACAD','ABRACA','ABRAC','ABRA','ABR','AB','A'],SATOR='SATOR\nAREPO\nTENET\nOPERA\nROTAS';
const VOWEL_F={A:[800,1150,2900],E:[400,1700,2600],'Ē':[550,1900,2500],I:[280,2250,2900],O:[450,800,2830],U:[325,700,2530],'Ō':[400,640,2400]};
const VSAY={I:'"ee"','Ē':'"ay"',O:'"o" as in "ought"',U:'"oo"',E:'"eh"',A:'"ah"','Ō':'a long "oh"'};
const RITUALS=[
 {name:'The Twenty-Two Vowels',src:'Gospel of the Egyptians · Nag Hammadi Codex III',line:'The seven vowels, each sung twenty-two times.',
  intent:'In the Gospel of the Egyptians, also called the Holy Book of the Great Invisible Spirit, the seven vowels are written out in full, each repeated twenty-two times, as a hymn to the powers above the archons. It is sung here as a rite of authority over hostile powers.',
  how:['Sit upright in the dark with your spine straight.','Sing each vowel on the tone you hear, one sound per pulse. Let the counter carry you; do not count yourself.','Feel each vowel in a different part of the body, rising from the belly to the crown.'],
  script:'I ×22   Ē ×22   O ×22   U ×22   E ×22   A ×22   Ō ×22',realm:4,vis:6,spiral:.3,beat:7.83,
  steps:[{t:'say',big:'Close the door.\nBreathe.',dur:8,hint:'Settle. The first vowel comes next.'},...V7.map((v,i)=>({t:'v',v,n:22,dur:.95,deg:i,hint:`Sing ${v}: ${VSAY[v]}. One sound per pulse.`})),{t:'say',big:'It is spoken.',dur:6,hint:'Sit in the silence.'}]},
 {name:'The Seven Heavens',src:'Greek Magical Papyri · PGM XIII, the Eighth Book of Moses',line:'One vowel to each direction and sphere.',
  intent:'The Eighth Book of Moses tells the operator to speak a vowel to each direction: east, north, west, south, the earth, the sky and the whole world. Ancient writers matched the seven vowels to the seven planetary spheres.',
  how:['Stand if you can. Turn to each direction as the screen tells you.','Hold each vowel for the whole tone, three times.','Keep your eyes on the centre of the screen between turns.'],
  script:'East: A   North: E   West: Ē   South: I   Earth: O   Sky: U   World: Ō',realm:3,vis:9,spiral:0,beat:10,
  steps:[['A','Face east. Right hand outstretched.'],['E','Face north.'],['Ē','Face west.'],['I','Face south.'],['O','Look down to the earth.'],['U','Look up to the sky.'],['Ō','Hand on your heart. Face the whole world.']].flatMap(([v,d],i)=>[{t:'say',big:d,dur:4,hint:'Turn now.'},{t:'v',v,n:3,dur:3.6,deg:i,hint:`Hold ${v}: ${VSAY[v]}.`}])},
 {name:'The Headless One',src:'Greek Magical Papyri · PGM V 96–172, the Stele of Jeu',line:'The ancient exorcism: every spirit made subject.',
  intent:'Written for driving out daimons, this rite calls on the Headless One who made heaven and earth, then commands that every spirit of the sky, the air, the earth, the underworld, the land and the water be made obedient. The Golden Dawn later adapted it as the Bornless Ritual.',
  how:['Speak the lines aloud with a low, steady voice.','When a name appears, intone it on the tone you hear.','The final command should be spoken as if it is already true.'],
  script:'I call you, the Headless One...\nIAŌ ×7   SABAŌTH ×3\nHear me, and make every spirit subject to me...',realm:7,vis:2,spiral:.5,beat:4,
  steps:[{t:'say',big:'I call you,\nthe Headless One,',dur:5,hint:'Speak aloud.'},{t:'say',big:'who created earth\nand heaven,',dur:5},{t:'say',big:'who created night\nand day,',dur:5},{t:'say',big:'who created light\nand darkness.',dur:6},
   {t:'word',w:'IAŌ',n:7,dur:3,deg:0,hint:'Intone the name: ee-ah-oh.'},{t:'word',w:'SABAŌTH',n:3,dur:3.6,deg:2,hint:'Intone: sa-ba-oath.'},
   {t:'say',big:'Hear me, and make\nevery spirit subject to me,',dur:7,hint:'With authority.'},{t:'say',big:'of the sky and of the air,\nupon the earth and under the earth,\non dry land and in the water,',dur:10},{t:'say',big:'that they may\nobey me.',dur:6},{t:'phat',big:'IAŌ',dur:3}]},
 {name:'The Mithras Liturgy',src:'Greek Magical Papyri · PGM IV 475–829',line:'Breathe in the rays and ascend in silence.',
  intent:'The only surviving ascent ritual of its kind from the ancient world. The initiate draws breath from the sun\'s rays to rise through the air, hisses and pops to pass the guardians, and calls on Silence as the symbol of the living, incorruptible god.',
  how:['Breathe in fully three times as the screen swells.','When told, make a long hiss, then a sharp popping sound with your lips.','Speak the call to Silence slowly.'],
  script:'Breathe ×3\nSilence! Silence! Silence!\nSymbol of the living, incorruptible god, guard me.\nSSSS ×2   P ×2',realm:3,vis:9,spiral:.2,beat:6,
  steps:[{t:'say',big:'Draw in breath\nfrom the rays.',dur:6,hint:'Three times, as much as you can.'},{t:'breath',n:3,dur:8,hint:'Breathe in. Rise.'},{t:'say',big:'Silence!\nSilence!\nSilence!',dur:6,hint:'Speak it.'},
   {t:'say',big:'Symbol of the living,\nincorruptible god.\nGuard me, Silence.',dur:9},{t:'hiss',n:2,dur:4,hint:'A long hiss.'},{t:'pop',n:2,dur:1.6,hint:'A sharp pop with the lips.'},{t:'say',big:'You are lifted.\nLook upward.',dur:9,hint:'Stay with the screen.'}]},
 {name:'Abracadabra',src:'Serenus Sammonicus · Liber Medicinalis, 3rd century',line:'The shrinking word that drives out sickness.',
  intent:'The earliest record of the word: a physician to Roman emperors wrote it as a triangle, one letter shorter on each line, and had it worn to drive out fever. As the word shrinks, the illness shrinks with it.',
  how:['Name, silently, what you want gone.','Chant each line on the tone. Each line loses a letter.','On the final A, let it go completely.'],
  script:ABRA.join('\n'),realm:6,vis:3,spiral:.2,beat:5,
  steps:[{t:'say',big:'Name what\nyou want gone.',dur:6,hint:'Silently.'},...ABRA.map((w,i)=>({t:'word',w,dur:Math.max(1.6,w.length*.42),deg:10-i,hint:i<10?'One letter falls away.':'Let it go.'})),{t:'say',big:'Gone.',dur:5}]},
 {name:'The Sator Square',src:'Pompeii, before AD 79',line:'The palindrome that reads the same four ways.',
  intent:'Scratched into a column at Pompeii and carved across Europe for centuries after, the square reads the same across, down, backward and upward. It was used as a protective charm against fire, fever and harm.',
  how:['Read the square once in silence.','Chant each word on its tone, forward, then backward.','Three rounds.'],
  script:SATOR,realm:0,vis:3,spiral:0,beat:8,
  steps:[{t:'say',big:SATOR,dur:8,hint:'Across, down, backward, up. The same.'},...[0,1,2].flatMap(()=>[...['SATOR','AREPO','TENET','OPERA','ROTAS'],...['ROTAS','OPERA','TENET','AREPO','SATOR']].map((w,i)=>({t:'word',w,dur:2.2,deg:i%5,hint:i<5?'Forward.':'Backward.'}))),{t:'say',big:SATOR,dur:7,hint:'Sealed.'}]},
 {name:'The First Key',src:'Enochian · John Dee and Edward Kelley, 1584',line:'The first call in the angelic tongue.',
  intent:'Received letter by letter through a scrying stone, the forty-eight Keys were Dee\'s calls to the angels in their own language. The First Key opens with God\'s claim of reign over all things.',
  how:['Speak each line in Enochian, slowly, as written.','The English meaning appears beneath it.','Let the tone carry the vowels.'],
  script:'Ol sonf vorsg, goho Iad balt,\nlansh calz vonpho;\nsobra z-ol ror i ta nazpsad,\ngraa ta malprg.',realm:5,vis:11,spiral:0,beat:12,
  steps:[['Ol sonf vorsg,','I reign over you,'],['goho Iad balt,','saith the God of Justice,'],['lansh calz vonpho;','in power exalted above the firmaments of wrath;'],['sobra z-ol ror i ta nazpsad,','in whose hands the sun is as a sword'],['graa ta malprg.','and the moon as a through-thrusting fire.']].map(([w,h],i)=>({t:'word',w,dur:6,deg:i,hint:h})).concat([{t:'say',big:'Zacar, ca, od zamran.',dur:7,hint:'Move, therefore, and show yourselves.'}])},
 {name:'Chöd: The Cut',src:'Tibetan Buddhism · Machig Labdrön, 11th century',line:'Offer everything to the demons, then cut.',
  intent:'In Chöd the practitioner offers their own body to demons and hungry spirits, cutting through fear and the grasping self. The syllable PHAT is the blade.',
  how:['Picture what you fear most in front of you.','On each PHAT, shout it sharply from the belly.','Between rounds, let go of whatever was cut.'],
  script:'PHAT ×7 · Let it be cut · PHAT ×7 · Let it be cut · PHAT ×7',realm:7,vis:7,spiral:.4,beat:3,
  steps:[{t:'say',big:'Offer everything\nyou cling to.',dur:8,hint:'Hold nothing back.'},...[0,1,2].flatMap(r=>[{t:'phat',n:7,dur:1.8,hint:'Shout it. Cut.'},{t:'say',big:'Let it be cut.',dur:5}]),{t:'say',big:'…',dur:8,hint:'Rest in what remains.'}]}
];
const KUJI=['RIN','PYŌ','TŌ','SHA','KAI','JIN','RETSU','ZAI','ZEN'];
const HIFUMI=[['HI FU MI YO I MU NA YA KO TO',10],['MO CHI RO RA NE SHI KI RU',8],['YU I TSU WA NU SO WO TA HA KU ME KA',12],['U O E NI SA RI HE TE',8],['NO MA SU A SE E HO RE KE',9]];
const PISTIS=['AEĒIOUŌ','IAŌ','AŌI','ŌIA','PSINŌTHER','THERNŌPS','NŌPSITHER','ZAGOURĒ','PAGOURĒ','NETHMOMAŌTH','NEPSIOMAŌTH','MARACHACHTHA','THŌBARRABAU','THARNACHACHAN','ZOROKOTHORA','IEOU','SABAŌTH'];
RITUALS.push(
 {name:'The Nine Cuts',src:'Kuji-in · Ge Hong\'s Baopuzi, 4th century; Shugendō',line:'Nine syllables, nine cuts: the grid that seals out harm.',
  intent:'Ge Hong wrote down nine characters to be spoken when entering the mountains, to keep away evil spirits and danger. Japanese mountain ascetics carried them into kuji-kiri: one syllable for each cut of the hand-sword, across and down in turn, until a grid of nine lines seals the space around you.',
  how:['Make the sword hand: index and middle fingers straight, the others folded under the thumb.','Speak each syllable sharply and cut the air the way the line is drawn: across, then down.','Three rounds. The grid is wiped and drawn again each time.'],
  script:'RIN · PYŌ · TŌ · SHA · KAI · JIN · RETSU · ZAI · ZEN',realm:5,vis:13,spiral:0,beat:10,
  steps:[{t:'say',big:'Make the\nsword hand.',dur:6,hint:'Two fingers straight. The rest folded.',clear:1},...[0,1,2].flatMap(r=>[{t:'say',big:r?'Again.':'Cut.',dur:2.5,clear:1},...KUJI.map((w,i)=>({t:'cut',w,ci:i,dur:2.4,deg:i,hint:i%2?'Cut down':'Cut across'}))]),{t:'phat',big:'RIN PYŌ TŌ\nSHA KAI JIN\nRETSU ZAI ZEN',dur:4},{t:'say',big:'Sealed.',dur:6,hint:'Leave the grid standing.'}]},
 {name:'The Immovable One',src:'Shingon Buddhism · the mantra of Fudō Myōō',line:'The wrathful protector who burns away every obstacle.',
  intent:'Fudō Myōō sits in a halo of flame holding a sword to cut through delusion and a rope to bind demons. His mantra is chanted in the goma fire rite while offerings burn. Its words honour the vajras and call on the violent, greatly wrathful one to destroy whatever stands in the way.',
  how:['Sit with your back straight. Picture a wall of fire in front of you.','Chant the short mantra seven times on the tone, then the long mantra three times.','Let the voice come from low in the belly, steady and hard.'],
  script:'Nōmaku sanmanda bazaradan kan ×7\nNōmaku sanmanda bazaradan senda makaroshada sowataya un tarata kanman ×3',realm:7,vis:14,spiral:.2,beat:4,
  steps:[{t:'say',big:'Fire before you.\nBreathe.',dur:7,hint:'See it burning.'},{t:'word',w:'NŌMAKU SANMANDA\nBAZARADAN KAN',n:7,dur:5.2,deg:0,hint:'no-ma-ku san-man-da ba-za-ra-dan kan'},
   {t:'word',w:'NŌMAKU SANMANDA BAZARADAN\nSENDA MAKAROSHADA\nSOWATAYA UN TARATA KANMAN',n:3,dur:11,deg:0,hint:'Long mantra. One vowel per tone.'},{t:'phat',big:'KAN',dur:3},{t:'say',big:'Nothing\nmoves you.',dur:8,hint:'Sit in the fire.'}]},
 {name:'The Hifumi Norito',src:'Shinto · the forty-seven sounds',line:'Every sound of the old tongue, spoken once, to turn misfortune.',
  intent:'A Shinto purification chant of forty-seven syllables, each sound of the old Japanese syllabary used once. Tradition says it was first sung to draw the sun goddess Amaterasu out of the cave where she hid, and it is said to turn misfortune into fortune. It closes by shaking the ten sacred treasures.',
  how:['Kneel or sit. Clap twice when the screen tells you.','Chant one syllable on each tone, evenly, like a slow drum.','Three times through, then the closing words.'],
  script:HIFUMI.map(h=>h[0].toLowerCase()).join('\n')+'\nfurube yura yura to furube',realm:1,vis:10,spiral:0,beat:8,
  steps:[{t:'clap',big:'Clap twice.',dur:4,hint:'Two sharp claps.'},...[0,1,2].flatMap(()=>HIFUMI.map(([w,n],i)=>({t:'word',w,dur:n*.62,deg:i,hint:'One syllable per tone.'}))),{t:'word',w:'FURUBE YURA YURA TO FURUBE',dur:6,deg:2,hint:'Shake the treasures.'},{t:'clap',big:'Clap twice.',dur:4},{t:'say',big:'Purified.',dur:6}]},
 {name:'The Saviour\'s Invocation',src:'Pistis Sophia · Askew Codex, 4th century',line:'The secret names called out over the Ocean.',
  intent:'In the Pistis Sophia, the risen Jesus gathers his disciples by the Ocean, turns to the four corners of the world and calls out a chain of vowels and secret names before he opens the mysteries. The book\'s heart is Sophia, Wisdom, who fell from the light and was lifted back up.',
  how:['Turn to each corner of the room as the screen tells you.','Intone IAŌ three times, then each name of the invocation on its tone.','Slowly. Let every name ring out.'],
  script:'IAŌ IAŌ IAŌ\n'+PISTIS.map(w=>w.toLowerCase()).join(' · '),realm:2,vis:8,spiral:.25,beat:6,
  steps:[{t:'say',big:'Turn to the\nfour corners.',dur:8,hint:'East, south, west, north.'},{t:'word',w:'IAŌ',n:3,dur:3.4,deg:0,hint:'ee-ah-oh'},...PISTIS.map((w,i)=>({t:'word',w,dur:Math.max(2.4,[...w].filter(c=>VOWEL_F[c]).length*.7),deg:i%7,hint:i?'':'The seven vowels.'})),{t:'say',big:'The light\ncomes down.',dur:9,hint:'Stay in the stillness.'}]});
const MB=n=>{if(!A[n]){A[n]=A.ctx.createGain();A[n].gain.value=MIX[n==='monBus'?'monad':'rites']*2;const sh=A.ctx.createBiquadFilter();sh.type='highshelf';sh.frequency.value=4200;sh.gain.value=-4.5;A[n].connect(sh).connect(A.master)}return A[n]};
function kujiCut(i){const h=i%2===0,k=Math.floor(i/2),ln=document.createElementNS('http://www.w3.org/2000/svg','line'),sc=n=>(n-50)*2.2;
  if(h){const y=sc(30+k*10);ln.setAttribute('x1',sc(26));ln.setAttribute('x2',sc(74));ln.setAttribute('y1',y);ln.setAttribute('y2',y)}else{const x=sc(32+k*12);ln.setAttribute('x1',x);ln.setAttribute('x2',x);ln.setAttribute('y1',sc(24));ln.setAttribute('y2',sc(76))}
  $('#kuji').appendChild(ln)}
function chant(v,f,dur){const ctx=A.ctx,t=ctx.currentTime,out=ctx.createGain(),fm=VOWEL_F[v]||VOWEL_F.A,pre=ctx.createGain();while(f>260)f/=2;
  out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.5,t+Math.min(.3,dur*.2));out.gain.setValueAtTime(.5,t+dur*.75);out.gain.linearRampToValueAtTime(0,t+dur*.98);
  [-7,0,6].forEach(d=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=d;o.connect(pre);o.start(t);o.stop(t+dur)});
  const soft=bq(ctx,'lowpass',3000,.5);fm.forEach((ff,k)=>pre.connect(bq(ctx,'bandpass',ff,7)).connect(gn(ctx,[1,.5,.16][k]*2)).connect(soft));soft.connect(out);out.connect(MB('riteBus'))}
function riteStep(r,i){
  if(RUN!==r)return;const st=r.steps[i];if(!st)return stopRun();const n=st.n||1,ctx=A.ctx;let k=0;
  const one=()=>{if(RUN!==r)return;k++;const cnt=n>1?`${k} of ${n}`:'',hint=st.hint||'',t=ctx.currentTime;
    if(st.clear)$('#kuji').innerHTML='';
    if(st.t==='say')hudSet(st.big,hint,cnt);
    else if(st.t==='v'){hudSet(st.v,hint,cnt);chant(st.v,degFreq(st.deg||0),st.dur*.95);pluck=1}
    else if(st.t==='word'){hudSet(st.w,hint,cnt);const id='R'+i+'_'+k,d=((st.deg||0)%15+15)%15;noteOn(id,d,.8);r.timers.push(setTimeout(()=>noteOff(id,d),st.dur*820))}
    else if(st.t==='breath'){hudSet('Breathe in',hint,cnt);const s=ctx.createBufferSource(),f=bq(ctx,'bandpass',500,1),g=ctx.createGain();s.buffer=NB.pink;f.frequency.linearRampToValueAtTime(1500,t+st.dur*.5);f.frequency.linearRampToValueAtTime(400,t+st.dur);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.6,t+st.dur*.45);g.gain.linearRampToValueAtTime(0,t+st.dur);s.connect(f).connect(g).connect(MB('riteBus'));s.start(t,0,st.dur)}
    else if(st.t==='hiss'){hudSet('SSSS',hint,cnt);const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=NB.white;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.4,t+.5);g.gain.linearRampToValueAtTime(0,t+st.dur*.9);s.connect(bq(ctx,'highpass',2400)).connect(bq(ctx,'lowpass',6500)).connect(g).connect(MB('riteBus'));s.start(t,0,st.dur)}
    else if(st.t==='pop'){hudSet('P',hint,cnt);blip(ctx,MB('riteBus'),t,800,2,.06,2,0);pluck=1.4}
    else if(st.t==='phat'){hudSet(st.big||'PHAT',hint,cnt);blip(ctx,MB('riteBus'),t,1000,1.2,.16,2.4,0);ping(ctx,MB('riteBus'),t,110,45,.35,1,0,.004);pluck=1.8}
    else if(st.t==='cut'){if(st.ci===0)$('#kuji').innerHTML='';hudSet(st.w,hint,cnt);kujiCut(st.ci);blip(ctx,MB('riteBus'),t,1500,2.5,.12,1.6,0);const id='R'+i+'_'+k,d=((st.deg||0)%15+15)%15;noteOn(id,d,.9);r.timers.push(setTimeout(()=>noteOff(id,d),st.dur*700));pluck=1.5}
    else if(st.t==='clap'){hudSet(st.big||'Clap twice.',hint,cnt);[0,.32].forEach(d=>blip(ctx,MB('riteBus'),t+d,1050,1.2,.14,2.1,0));pluck=1.3}
    r.timers.push(setTimeout(k<n?one:()=>riteStep(r,i+1),st.dur*1000))};one()}
function runRite(rt,btn){
  if(!A.ctx)return;if(RUN){const same=RUN.name===rt.name;stopRun(true);if(same)return}
  const r=RUN={kind:'rite',name:rt.name,snap:Object.fromEntries(SNAPK.map(k=>[k,S[k]])),on:[],timers:[],steps:rt.steps};
  S.beat=clamp(rt.beat||6,.5,40);paintDial();applyBeat();if(btn){btn.classList.add('on');btn.textContent='stop'}showHud(true);DR.forEach(d=>$('#'+d).hidden=true);say(rt.name.toLowerCase());riteStep(r,0)}
function buildRites(){const el=$('#rites'),keep=el.querySelector('.dclose');
  el.innerHTML=`<h3>The ritual chamber</h3><p class="vh">Rites from the written record. Choose one, read how it is done, then begin. The instrument sounds the tones and puts the words in the glass.</p>`
    +RITUALS.map((r,i)=>`<div class="prow"><div><b>${r.name}</b><p><span class="tag tradition">tradition</span>${r.src}. ${r.line}</p><details><summary class="vh">how it is done</summary><p>${r.intent}</p><p>${r.how.map((h,k)=>`${k+1}. ${h}`).join('<br>')}</p><p style="white-space:pre-line;font-family:var(--serif);font-style:italic;font-size:16px">${r.script}</p></details></div><button class="vb prun" data-i="${i}">begin</button></div>`).join('');
  el.prepend(keep)}
$('#rites').addEventListener('click',e=>{const b=e.target.closest('.prun');if(b)runRite(RITUALS[+b.dataset.i],b)});

/* ================= THE FORGE: an intention made into a seal on a planet's square ================= */
let FORGED=null;
const dsum=v=>String(v).split('').reduce((a,c)=>a+ +c,0);
function forge(){
  const txt=$('#fIn').value.trim(),all=txt.toUpperCase().normalize('NFD').replace(/[^A-Z]/g,'');if(!all){say('write an intention first, in letters');return}
  const letters=[];for(const ch of all)if(!letters.includes(ch))letters.push(ch);const [pn,n]=KAMEA[MON.i],max=n*n;
  const nums=letters.map(c=>{let v=c.charCodeAt(0)-64;while(v>max)v=dsum(v);return v}),sum=[...all].reduce((s,c)=>s+c.charCodeAt(0)-64,0);let hz=sum;while(hz<110)hz*=2;while(hz>=440)hz/=2;
  const pt=v=>{const [r,c]=MON.path[v-1];return [((c+.5)/n-.5)*176,((r+.5)/n-.5)*176]};FORGED={nums,letters,sum,hz,pn,n,pts:nums.map(pt)};
  $('#seal').setAttribute('points',FORGED.pts.map(p=>p.join(',')).join(' '));$('#monadG').setAttribute('opacity',1);$('#sealDot').setAttribute('cx',FORGED.pts[0][0]);$('#sealDot').setAttribute('cy',FORGED.pts[0][1]);$('#sealDot').setAttribute('opacity',1);
  $('#fRead').innerHTML=`<b>Kept letters</b> ${letters.join(' ')}<br><b>Numbers</b> ${nums.join(' · ')}<br><b>Square of ${pn}</b> ${n} by ${n}, every line adding to ${n*(n*n+1)/2}<br><b>Sum of all letters</b> ${sum}, which folds to a tone of <b>${hz.toFixed(2)} Hz</b>`;
  say(`seal forged on the square of ${pn.toLowerCase()} · ${hz.toFixed(2)} hz`)}
function forgeSound(){if(!FORGED||!A.ctx)return say('forge a seal first');const F=FORGED,ctx=A.ctx;ping(ctx,A.vBus,ctx.currentTime,F.hz,F.hz,F.nums.length*.42+4,.2,0,.4);
  F.nums.forEach((v,j)=>setTimeout(()=>{const d=Math.round((v-1)/(F.n*F.n-1)*14),id='F'+j;noteOn(id,d,.8);setTimeout(()=>noteOff(id,d),700);$('#sealDot').setAttribute('cx',F.pts[j][0]);$('#sealDot').setAttribute('cy',F.pts[j][1])},j*420));say('the seal, sounded')}
function buildForge(){const el=$('#forge'),keep=el.querySelector('.dclose');
  el.innerHTML=`<h3>Fornax</h3><p class="vh">Write an intention. The furnace strikes out repeated letters (Austin Osman Spare's method), turns the rest into numbers, and traces them across the magic square of the planet you choose (Agrippa, 1533). The seal appears in the glass.</p>
  <input id="fIn" type="text" maxlength="80" placeholder="write your intention" aria-label="Intention">
  <h4>Planet</h4><div class="vg">${KAMEA.map(([nm,n],i)=>`<button class="vb fp${i===MON.i?' on':''}" data-i="${i}">${nm.toLowerCase()} ${n}×${n}</button>`).join('')}</div>
  <div class="vg" style="margin-top:14px"><button class="vb" id="fGo">forge</button><button class="vb" id="fSnd">sound it</button><button class="vb" id="fChg">charge it</button></div>
  <p id="fRead" class="note">${tg(TR)} The arithmetic is exact and shown here once you forge.</p>`;el.prepend(keep)}
$('#forge').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.classList.contains('fp')){setKamea(+b.dataset.i);$$('#forge .fp').forEach((x,i)=>x.classList.toggle('on',i===MON.i));if($('#fIn').value.trim())forge()}
  else if(b.id==='fGo')forge();else if(b.id==='fSnd')forgeSound();else if(b.id==='fChg'){if(!FORGED)return say('forge a seal first');$('#forge').hidden=true;revStart();setTimeout(revStop,9500)}});
$('#forge').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='fIn')forge()});

/* ================= THE MONAD: hold to rev through its five stages ================= */
const STAGES=['monad','dyad','triad','tetrad','decad'];let REV=null;
function revStart(){
  if(REV||!A.ctx||silenced)return;const ctx=A.ctx,t=ctx.currentTime,g=gn(ctx,0),base=hBase();g.gain.setTargetAtTime(.5,t,.3);g.connect(MB('monBus'));g.connect(A.verb);
  const nz=loopN(ctx,NB.pink),bp=bq(ctx,'bandpass',200,4);bp.frequency.setValueAtTime(200,t);bp.frequency.exponentialRampToValueAtTime(2600,t+9);nz.connect(bp).connect(gn(ctx,.22)).connect(g);
  const ris=ctx.createOscillator();ris.type='sawtooth';ris.frequency.setValueAtTime(base/2,t);ris.frequency.exponentialRampToValueAtTime(base*4,t+9);ris.connect(bq(ctx,'lowpass',1200)).connect(gn(ctx,.07)).connect(g);ris.start();
  REV={g,src:[nz,ris],st:-1,t0:performance.now(),base};$('#monad').classList.add('rev');REV.tm=setInterval(revTick,110);revTick()}
function revTick(){
  if(!REV)return;const el=(performance.now()-REV.t0)/1000,st=Math.min(4,Math.floor(el/1.8)),R=Math.min(1,el/9),ctx=A.ctx;window.REVV=R;pluck=Math.max(pluck,.35+R);
  if(st>REV.st){REV.st=st;const r=[1,2,3,4,8][st],o=ctx.createOscillator(),og=gn(ctx,0),b=REV.base;o.frequency.value=b*r;og.gain.setTargetAtTime(.24/(st+1),ctx.currentTime,.4);o.connect(og).connect(REV.g);o.start();REV.src.push(o);
    ping(ctx,A.vBus,ctx.currentTime,b*r*2,b*r*2,st===4?6:2.5,st===4?.22:.12,0,.004);if(st===4)[1,1.5,2,3,4].forEach((q,i)=>ping(ctx,A.vBus,ctx.currentTime+i*.06,b*q*2,b*q*2,5,.08,(i-2)*.35,.004));
    $('#monP').textContent=STAGES[st];say(`monad · ${STAGES[st]} · the number ${[1,2,3,4,10][st]}`)}
  $('#monN').textContent=Math.round(R*100)}
function revStop(){if(!REV)return;const r=REV;REV=null;clearInterval(r.tm);$('#monad').classList.remove('rev');r.g.gain.setTargetAtTime(0,A.ctx.currentTime,.9);setTimeout(()=>{r.src.forEach(s=>{try{s.stop()}catch(_){}});r.g.disconnect()},4500);
  const fade=setInterval(()=>{window.REVV=Math.max(0,(window.REVV||0)-.04);if(!window.REVV)clearInterval(fade)},60);const [nm,n]=KAMEA[MON.i];$('#monP').textContent=nm.toLowerCase();$('#monN').textContent=n*(n*n+1)/2}
monadStart=()=>{MON.held=true;revStart()};monadStop=()=>{MON.held=false;revStop()};

/* ================= tunings, as in Black Dragon 01 ================= */
const PHI=(1+Math.sqrt(5))/2,fold=x=>{while(x>=2)x/=2;while(x<1)x*=2;return x};
const TUN=[['by state',null],['pythagorean',[1,9/8,81/64,3/2,27/16]],['tetractys',[1,4/3,3/2]],['overtones',[1,9/8,5/4,11/8,3/2,13/8,7/4,15/8]],['siamese 7',[0,1,2,3,4,5,6].map(k=>Math.pow(2,k/7))],
  ['hirajoshi',[1,9/8,6/5,3/2,8/5]],['phi spiral',[0,1,2,3,4].map(k=>fold(Math.pow(PHI,k))).sort((a,b)=>a-b)],['timaeus',[1,9/8,81/64,4/3,3/2,27/16,243/128]],['miyako-bushi',[1,16/15,4/3,3/2,8/5]]];
/* the keys start on the pythagorean scale (owner, 2026-11-27) */
const DEFTUN=Math.max(0,TUN.findIndex(t=>t[0]==='pythagorean'));let tun=DEFTUN;
{const d0=degFreq;degFreq=i=>{const sc=TUN[tun][1];if(!sc)return d0(i);const n=sc.length;let base=S.fc*2;while(base<150)base*=2;while(base>330)base/=2;return base*sc[((i%n)+n)%n]*Math.pow(2,Math.floor(i/n))}}
/* the scale the keys play: chosen in step 4 of the instruments page */
function setTun(i){tun=clamp(i|0,0,TUN.length-1);const v=$('#vox');if(v&&v._sync)v._sync();say('scale · '+TUN[tun][0])}

/* ================= reset and volume ================= */
const DEF={...S,layers:{}};
function resetAll(){
  stopRun(true);revStop();if(possess)$('#bPossess').click();if(desc)stopDescent();if(silenced)silence(false);
  if(A.ctx){const t=A.ctx.currentTime;Object.keys(held).forEach(k=>{const h=held[k];h.g.gain.cancelScheduledValues(t);h.g.gain.setTargetAtTime(0,t,.05);h.os.forEach(o=>{try{o.stop(t+.4)}catch(_){}});delete held[k]});$$('.key.on').forEach(k=>k.classList.remove('on'))}
  if(ENV)setEnv(null);clearLayers();const vol=S.vol;Object.assign(S,DEF,{layers:{},vol});window.VMODE=null;FORGED=null;$('#seal').setAttribute('points','');$('#sealDot').setAttribute('opacity',0);
  setState(STATES.findIndex(x=>x.id==='hypnagogia'));tun=DEFTUN;kOct=0;kVel=1;if(window.CHORDS){CHORDS.mode=0;CHORDS.set('bass',false);CHORDS.set('spread',0);CHORDS.set('strum',0)}setVoice(window.DEFVOICE||0);$$('.tn').forEach((x,i)=>x.classList.toggle('on',!i));paintKnobs();applyAll();
  $('#bBreath').classList.toggle('on',S.breath);$('#bTide').classList.toggle('on',S.tide);$('#bPresets').textContent='presets';paintHeal();DR.forEach(d=>$('#'+d).hidden=true);say('reset · the board is back to its starting places')}
$('#bReset').onclick=resetAll;
const volIn=$('#vol');volIn.value=S.vol;volIn.addEventListener('input',()=>{S.vol=+volIn.value;if(knobEls.vol)knobEls.vol.style.setProperty('--v',S.vol);if(A.ctx&&!silenced)A.vol.gain.setTargetAtTime(S.vol,A.ctx.currentTime,.03);say('volume · '+Math.round(S.vol*100))});
{const f=paintKnobs;paintKnobs=()=>{f();volIn.value=S.vol}}
$('#knobs').addEventListener('pointermove',()=>{volIn.value=S.vol});
{const f=paintBank;paintBank=()=>{f();paintHeal()}}

/* ================= phones: no text selection or callout on the keys, and keep the screen awake ================= */
['touchstart','contextmenu','selectstart'].forEach(ev=>{['#keys','#monad','#stones','#pads','#tabs','#knobs'].forEach(q=>$(q).addEventListener(ev,e=>{if(ev!=='touchstart'||q==='#keys'||q==='#monad')e.preventDefault()},{passive:false}))});
let wake=null;const keepAwake=()=>{if(navigator.wakeLock&&!wake&&!document.hidden)navigator.wakeLock.request('screen').then(w=>{wake=w;w.addEventListener('release',()=>{wake=null})}).catch(()=>{})};
addEventListener('pointerdown',keepAwake);document.addEventListener('visibilitychange',keepAwake);

buildHeal();buildAllProgs();buildRites();buildForge();

/* header: the action buttons share a row with the sounding-now strip so the readout line has room */
{const row=document.createElement('div');row.id='row2';$('#live').before(row);row.append($('#live'));const acts=document.createElement('div');acts.className='acts';
  ['bFilm','bPossess','bDescent','bTide','bBreath','bRec','bSave','bLoad','fLoad','bHide'].forEach(id=>{const x=$('#'+id);if(x)acts.append(x)});row.append(acts)}

/* ================= THE MIXER: five faders with level lights, as in Black Dragon 01 ================= */
const MXB=[['keys','vBus',.5],['world','bankBus',1.3],['tones','toneBus',1],['monad','monBus',1],['rites','riteBus',1]],MXA={};
function applyMix(){if(!A.ctx)return;MXB.forEach(([k,b,base])=>{if(k==='monad'||k==='rites')MB(b);A[b].gain.setTargetAtTime(base*MIX[k]*2,A.ctx.currentTime,.04)})}
{const d=document.createElement('div');d.className='jelly drawer';d.id='mixer';d.hidden=true;$('#forge').after(d);DR.push('mixer');
  d.innerHTML='<button class="pill dclose">close</button><h3>Mixer</h3><p class="vh">Five faders. Keys are what you play; world is every stone and bank sound; tones are the beat and the healing table; then the Monad and the rites. The middle is the normal level.</p>'
    +MXB.map(([k])=>`<label class="mrow"><span>${k}</span><input type="range" min="0" max="1" step=".01" value="${MIX[k]}" data-k="${k}" aria-label="${k} level"><div class="meter"><i data-m="${k}"></i></div></label>`).join('')
    +'<button class="vb" id="mxReset" style="margin-top:12px">all faders to the middle</button>';
  d.querySelector('.dclose').onclick=()=>{d.hidden=true};
  d.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){MIX[k]=+e.target.value;applyMix();say(`${k} · ${Math.round(MIX[k]*200)}`)}});
  d.querySelector('#mxReset').onclick=()=>{MXB.forEach(([k])=>{MIX[k]=.5;d.querySelector(`input[data-k=${k}]`).value=.5});applyMix();say('mixer · all faders to the middle')};
  const b=document.createElement('button');b.className='pill';b.id='bMixer';b.textContent='mixer';$('.rside').insertBefore(b,$('#bPresets'));b.onclick=e=>{e.stopPropagation();openDr('mixer')};
  const buf=new Uint8Array(256);
  setInterval(()=>{if(d.hidden||!A.ctx)return;MXB.forEach(([k,bn])=>{if(!A[bn])return;if(!MXA[k]){MXA[k]=A.ctx.createAnalyser();MXA[k].fftSize=256;A[bn].connect(MXA[k])}
    MXA[k].getByteTimeDomainData(buf);let p=0;for(const v of buf)p=Math.max(p,Math.abs(v-128));d.querySelector(`i[data-m=${k}]`).style.width=Math.min(100,p/128*160)+'%'})},90)}

/* ================= sessions: one shape for files and for the three save slots ================= */
function snapshot(){return JSON.parse(JSON.stringify({...S,black_dragon:2,saved:new Date().toISOString(),state:STATES[S.state].id,voiceName:VOICES[S.voice],tun,recipe,mix:MIX}))}
function applySession(d){
  if(!d||d.black_dragon!==2)throw new Error('not a session');stopRun(true);
  for(const k of Object.keys(S))if(k in d&&typeof d[k]===typeof S[k])S[k]=d[k];if(!S.layers||typeof S.layers!=='object')S.layers={};
  if(d.voiceName&&VOICES.includes(d.voiceName))S.voice=VOICES.indexOf(d.voiceName);S.voice=clamp(S.voice|0,0,VOX.length-1);S.beat=clamp(S.beat,.5,40);
  if(d.mix)Object.keys(MIX).forEach(k=>{if(typeof d.mix[k]==='number')MIX[k]=d.mix[k]});if(Number.isInteger(d.tun)&&TUN[d.tun])tun=d.tun;if(Number.isInteger(d.recipe)&&RECIPES[d.recipe])recipe=d.recipe;
  const i=STATES.findIndex(s=>s.id===d.state);setState(i<0?0:i,true);paintKnobs();if(A.ctx)bankSync();else paintBank();setEnv(S.env||null,false);setVoice(S.voice);
  $('#bBreath').classList.toggle('on',S.breath);$('#bTide').classList.toggle('on',S.tide);$$('.tn').forEach((x,j)=>x.classList.toggle('on',j===tun));
  $$('#mixer input').forEach(x=>{x.value=MIX[x.dataset.k]});applyMix();buildHeal()}
$('#bSave').onclick=()=>save(new Blob([JSON.stringify(snapshot(),null,1)],{type:'application/json'}),'black-dragon-'+stamp()+'.dragon');
function readSession(f){f.text().then(t=>{applySession(JSON.parse(t));say('session loaded')}).catch(()=>say('that file is not a black dragon session. choose a .dragon file'))}
$('#fLoad').onchange=e=>{if(e.target.files[0])readSession(e.target.files[0]);e.target.value=''};
/* share the board by link: the whole board (state, beat, carrier, stone and its sounds, mix, voice, visualizer) packed
   and compressed into the address after the #. Nothing is sent anywhere; the link carries it all. */
{const b64=b=>{let t='';for(let i=0;i<b.length;i++)t+=String.fromCharCode(b[i]);return btoa(t).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')},
    unb64=t=>Uint8Array.from(atob(t.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)),
    pipe=async(bytes,T)=>new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(T)).arrayBuffer());
  const pack=async o=>{const raw=new TextEncoder().encode(JSON.stringify(o));return window.CompressionStream?'z'+b64(await pipe(raw,new CompressionStream('deflate-raw'))):'j'+b64(raw)};
  const unpack=async t=>{const raw=unb64(t.slice(1));return JSON.parse(new TextDecoder().decode(t[0]==='z'?await pipe(raw,new DecompressionStream('deflate-raw')):raw))};
  const btn=document.createElement('button');btn.className='pill';btn.id='bShare';btn.textContent='share link';
  btn.title='Copy a link that opens this exact board: state, beat, carrier, stone, mix, voice and visualizer';$('#bSave').after(btn);
  btn.onclick=async e=>{e.stopPropagation();const o=snapshot();delete o.saved;o.film=film;const url=location.href.split('#')[0]+'#b='+await pack(o);history.replaceState(null,'',url);
    try{await navigator.clipboard.writeText(url);say('link copied · it opens this board as it is now')}catch(_){say('the link is in the address bar · copy it from there')}};
  if(location.hash.startsWith('#b='))unpack(location.hash.slice(3)).then(d=>{applySession(d);if(Number.isInteger(d.film)&&FILMS[d.film])window.SHAREFILM=d.film;say('board opened from a link')}).catch(()=>say('that link could not be read'))}
let SLOTS=[null,null,null];try{const v=JSON.parse(localStorage.getItem('bd2-slots'));if(Array.isArray(v))SLOTS=[0,1,2].map(i=>v[i]||null)}catch(_){}
{const acts=$('.acts'),names=['I','II','III'];
  names.slice().reverse().forEach(nm=>{const i=names.indexOf(nm),b=document.createElement('button');b.className='pill slot';b.textContent=nm;b.title='Save slot '+nm+'. Press an empty slot to store the whole board; press a lit one to return to it; hold to store over it.';acts.insertBefore(b,acts.firstChild);
    let tm=null,held=false;const store=()=>{SLOTS[i]=snapshot();try{localStorage.setItem('bd2-slots',JSON.stringify(SLOTS))}catch(_){}paint();say('saved to slot '+nm)};
    b.addEventListener('pointerdown',()=>{held=false;tm=setTimeout(()=>{held=true;store()},650)});
    b.addEventListener('pointerup',()=>{clearTimeout(tm);if(held)return;if(SLOTS[i]){try{applySession(SLOTS[i]);say('slot '+nm+' recalled')}catch(_){say('slot '+nm+' could not be read')}}else store()});
    b.addEventListener('pointerleave',()=>clearTimeout(tm))});
  function paint(){[...acts.querySelectorAll('.slot')].forEach(b=>b.classList.toggle('on',!!SLOTS[names.indexOf(b.textContent)]))}paint()}

/* ================= journey lengths, dice and freeze ================= */
{const el=$('#trance'),box=document.createElement('div');box.innerHTML='<h4>Journey</h4><p class="vh">A slow glide from alert beta down to deep delta, as in Black Dragon 01.</p><div class="vg">'+[15,30,45].map(m=>`<button class="vb jr" data-m="${m}">${m} minutes</button>`).join('')+'<button class="vb" id="jrStop">stop the journey</button></div>';
  el.querySelector('.vh').after(box);box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();if(b.id==='jrStop'){stopDescent();say('journey stopped');return}
    stopRun(true);S.beat=18;paintDial();applyBeat();desc={t0:performance.now(),from:18,to:1.5,dur:+b.dataset.m*60e3};$('#bDescent').classList.add('on');el.hidden=true;say(`journey · ${b.dataset.m} minutes · beta to delta`)})}
{const kt=$('.ktabs'),mk=(id,txt,title)=>{const b=document.createElement('button');b.className='pill mini';b.id=id;b.textContent=txt;b.title=title;kt.append(b);return b};
  mk('bDice','dice','Throw the vision dials and the picture behind them').onclick=()=>{const r=(a,b)=>+(a+Math.random()*(b-a)).toFixed(2);
    /* the picture is thrown too, unless your own video is playing */
    if(!($('#bOwn')&&$('#bOwn').classList.contains('on'))&&FILMS.length>1){let n=film;while(n===film)n=Math.random()*FILMS.length|0;setFilm(n)}Object.assign(S,{vision:r(.3,1),trails:r(0,.8),twist:r(0,.6),mirrors:Math.random()<.5?0:r(.1,.9),warp:r(0,.6),hue:Math.random()<.5?0:r(0,1),split:r(.1,.8),speed:r(.15,.8),lens:r(.3,.75)});
    window.VMODE=Math.random()*6|0;paintKnobs();applyAll();say('dice · the vision and its picture are thrown')};
  const fz=mk('bFreeze','freeze','Hold the vision still');fz.onclick=()=>{window.FREEZE=!window.FREEZE;fz.classList.toggle('on',!!window.FREEZE);say(window.FREEZE?'freeze · the vision is held':'freeze off')}}

/* ================= the sand plate: cymatics in real grains, inside the centre dial =================
   Rebuilt from Black Dragon 01's great screen. In 1787 Ernst Chladni bowed sand-strewn plates: the sand leaps where the
   plate moves and comes to rest on the lines that stay still. Here every grain is its own body. The tone you hear (the key
   you just played, else the strongest tone on the measured channel) chooses the figure; loudness shakes the grains, a note
   kicks them into the air, silence lets them lie. Four plates, five tone recipes and fifteen visions, as on 01. */
let TAP=null;const SL=new Float32Array(2048),SR=new Float32Array(2048);
function sigilTap(){if(TAP)return TAP;if(!A.ctx||!A.toneBus)return null;
  const sp=A.ctx.createChannelSplitter(2),l=A.ctx.createAnalyser(),r=A.ctx.createAnalyser();l.fftSize=r.fftSize=2048;A.toneBus.connect(sp);sp.connect(l,0);sp.connect(r,1);return TAP={l,r}}
{const c=$('#cym'),bar=$('#cymBar');
  const gl=c.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true});
  const SHP=['square','circle','hexagram','quasicrystal'],TONES=['pure','glass','choir','bowl','tetractys'],TH=[1,3,3,4,4],
    VISN=['plate','spiral','tunnel','kaleido','echo','hypnodisc','mandala','vortex','liquid','hyperspace','lotus','fractal','womb mandala','heptagram','kaen'],
    TM=[[0,1,2,3,4,5,6,7],[0,2,4,6,8,10,12,14],[0,1,1,2,3,3,4,5],[0,2,4,6,9,12,15,19],[0,1,2,3,5,7,8,11]],
    TN=[[0,1,2,3,4,5,6,7],[0,2,4,6,8,10,12,14],[0,0,1,1,2,2,3,3],[0,1,3,4,6,8,10,12],[0,1,1,2,3,4,4,6]],
    NAGA=['Ananta','Vasuki','Takshaka','Mucalinda','Virupaksha','Karkotaka','Shesha','Upananda','Nanda','Airavata','Padma','Mahapadma','Shankha','Kulika'];
  const PI=Math.PI,TAU=PI*2,N=MOBILE?9000:26000,G=MOBILE?128:160,E=1.3,SQ=.7071;
  let on=false,big=false,shape=1,tone=0,vis=0,mode=null,hz=0,keyHz=0,keyT=0,kick=0,reading=null,keep=false,lastF=0,tint=[1,.7,.33],lastTint=0,T=0,sharp=27,
    cBeat=0,cLvl=0,cRev=0,cZ=1,grid=null;
  const pos=new Float32Array(N*2),seed=new Float32Array(N);
  const scatter=i=>{if(shape===0&&vis===0){pos[i*2]=(Math.random()*2-1)*SQ;pos[i*2+1]=(Math.random()*2-1)*SQ}else{const r=Math.sqrt(Math.random()),a=Math.random()*TAU;pos[i*2]=r*Math.cos(a);pos[i*2+1]=r*Math.sin(a)}};
  for(let i=0;i<N;i++){seed[i]=Math.random();const r=Math.sqrt(Math.random()),a=Math.random()*TAU;pos[i*2]=r*Math.cos(a);pos[i*2+1]=r*Math.sin(a)}
  const b=document.createElement('button');b.className='pill';b.id='bScope';b.textContent='cymatics';
  b.title='Sand on a plate inside the Monad. The tone you hear gathers the grains into its figure; a note kicks them into the air.';$('#bTone').before(b);
  bar.innerHTML='<span id="cymRead"></span><button id="cymShape" title="Change the plate"></button><span class="cymV"><button id="cymVp" title="Previous vision">‹</button><button id="cymVis" title="Change the vision"></button><button id="cymVn" title="Next vision">›</button></span><button id="cymTone" title="Change the tone recipe"></button><button id="cymBig" title="Lift the plate out of the dial, or set it back"></button><button id="cymKeep" title="Save this figure as an image">keep</button><button id="cymX" title="Close cymatics">close</button>';
  const rd=$('#cymRead'),bShape=$('#cymShape'),bVis=$('#cymVis'),bTone=$('#cymTone'),bBig=$('#cymBig');
  /* three ways to watch the sound, as the pearl of Black Dragon 01 had: the sand, a ring of the spectrum, and the scribble
     the two ears draw against each other (left across, right up). The ring and the scribble read the whole mix. */
  const VIEWS=['sand','ring','scribble'],bView=document.createElement('button');bView.id='cymView';bView.title='Sand, the ring of the spectrum, or the scribble of the two ears';rd.after(bView);const bCol=document.createElement('button');bCol.id='cymCol';bCol.title='Colour the sand from the film that is playing, or keep it white';bView.after(bCol);
  let view=0,an2=null,lv2=new Float32Array(72),pk2=.05;const c2=document.createElement('canvas');c2.id='cym2';c2.hidden=true;const x2=c2.getContext('2d'),
    tl2=new Float32Array(2048),tr2=new Float32Array(2048),fd2=new Float32Array(1024);
  const ans2=()=>{if(an2||!A.ctx||!A.out)return an2;const sp=A.ctx.createChannelSplitter(2),l=A.ctx.createAnalyser(),r=A.ctx.createAnalyser();l.fftSize=r.fftSize=2048;l.smoothingTimeConstant=.7;A.out.connect(sp);sp.connect(l,0);sp.connect(r,1);return an2={l,r}};
  const draw2=dt=>{const W=c2.width;if(!W)return;const a=ans2(),tc=k=>`rgba(${Math.round(tint[0]*255)},${Math.round(tint[1]*255)},${Math.round(tint[2]*255)},${k})`;
    x2.setTransform(1,0,0,1,0,0);x2.save();x2.beginPath();x2.arc(W/2,W/2,W/2,0,TAU);x2.clip();
    if(view===1){x2.clearRect(0,0,W,W);x2.translate(W/2,W/2);if(a){a.l.getFloatFrequencyData(fd2)}const sr=A.ctx?A.ctx.sampleRate:48000,r1=W*.19;
      x2.beginPath();x2.arc(0,0,r1*.94,0,TAU);x2.strokeStyle=tc(.35);x2.lineWidth=W*.004;x2.stroke();x2.lineCap='round';x2.lineWidth=W*.013;x2.shadowColor=tc(.8);x2.shadowBlur=W*.02;
      for(let i=0;i<72;i++){const f=40*Math.pow(200,i/72),b=Math.min(1023,Math.round(f/(sr/2)*1024)),v=a?clamp((fd2[b]+96)/66,0,1):0;lv2[i]=Math.max(v,lv2[i]-dt*1.4);const u=lv2[i],an=i/72*TAU-PI/2,r2=r1+W*(.015+u*.27);
        x2.beginPath();x2.moveTo(Math.cos(an)*r1,Math.sin(an)*r1);x2.lineTo(Math.cos(an)*r2,Math.sin(an)*r2);x2.strokeStyle=u>.6?`rgba(255,240,236,${.55+u*.4})`:tc(.45+u*.55);x2.stroke()}}
    else{x2.globalCompositeOperation='destination-out';x2.fillStyle='rgba(0,0,0,.22)';x2.fillRect(0,0,W,W);x2.globalCompositeOperation='lighter';
      if(a){a.l.getFloatTimeDomainData(tl2);a.r.getFloatTimeDomainData(tr2);let m=0;for(let i=0;i<2048;i++)m=Math.max(m,Math.abs(tl2[i]),Math.abs(tr2[i]));pk2=Math.max(m,pk2*Math.exp(-dt*.8),.02);
        const g=W*.34/pk2;x2.translate(W/2,W/2);x2.rotate(-PI/4);x2.beginPath();for(let i=0;i<2048;i+=2){const x=tl2[i]*g,y=-tr2[i]*g;i?x2.lineTo(x,y):x2.moveTo(x,y)}
        x2.strokeStyle=tc(.85);x2.lineWidth=Math.max(1,W/260);x2.shadowColor=tc(.9);x2.shadowBlur=W*.015;x2.stroke()}}
    x2.restore()};
  const setView=v=>{view=v;c.style.opacity=view?0:1;c2.hidden=!on||!view;x2.setTransform(1,0,0,1,0,0);x2.clearRect(0,0,c2.width,c2.height);label();say('cymatics · '+['the sand','the ring of the spectrum','the scribble of the two ears'][view])};
  bView.onclick=()=>setView((view+1)%3);
  bCol.onclick=()=>{vm=vm?0:1;label();say(vm?'the sand takes the colours of the film':'the sand is white')};
  /* the grains are drawn as points */
  let P=null,U={},bufP=null,VT=null,vidT=0,vm=1,vmNow=0;
  /* the sand takes its colour from the picture that is playing: the screen is shrunk to a 32 by 32 map a few times a second
     and each grain wears the colour beneath it, the map turning and rippling slowly so the colour undulates */
  const vsC=document.createElement('canvas');vsC.width=vsC.height=32;const vsX=vsC.getContext('2d',{willReadFrequently:false});
  if(gl){const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
    P=gl.createProgram();
    gl.attachShader(P,sh(gl.VERTEX_SHADER,`attribute vec2 p;attribute float s;uniform float uSize,uT,uKick;uniform vec3 uTint;varying vec3 vC;varying vec2 vP;
void main(){gl_Position=vec4(p.x*.985,-p.y*.985,0.,1.);vP=p;float h=fract(s*7.13);
  vec3 sand=mix(vec3(1.),vec3(.93,.95,1.),h)+uTint*0.;
  float br=.72+.28*fract(s*13.7);float tw=step(.955,s)*pow(.5+.5*sin(uT*(2.+h*7.)+h*80.),8.)*1.8;
  vC=sand*(br+tw+uKick*.35);gl_PointSize=uSize*(.75+.65*fract(s*5.3));}`));
    gl.attachShader(P,sh(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 vC;varying vec2 vP;uniform sampler2D uVid;uniform float uVm,uTf;
void main(){vec2 q=gl_PointCoord-.5;float d=length(q),a=smoothstep(.5,.3,d);float lit=1.-.12*smoothstep(0.,.55,length(q+vec2(.13,.13)));
  float an=uTf*.05+.35*sin(uTf*.13+length(vP)*3.);vec2 w=mat2(cos(an),-sin(an),sin(an),cos(an))*vP*.82;w+=.07*vec2(sin(uTf*.31+vP.y*4.),cos(uTf*.27+vP.x*4.));
  vec3 f=texture2D(uVid,clamp(w*.5+.5,0.,1.)).rgb;float mc=max(max(f.r,f.g),f.b);vec3 hue=f/max(mc,.02);hue=mix(vec3(1.),hue,smoothstep(.04,.18,mc));vec3 col=mix(vec3(1.),hue,uVm);
  gl_FragColor=vec4(vC*col*lit*a,a);}`));
    gl.linkProgram(P);gl.useProgram(P);
    const bs=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bs);gl.bufferData(gl.ARRAY_BUFFER,seed,gl.STATIC_DRAW);const ls=gl.getAttribLocation(P,'s');gl.enableVertexAttribArray(ls);gl.vertexAttribPointer(ls,1,gl.FLOAT,false,0,0);
    bufP=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bufP);gl.bufferData(gl.ARRAY_BUFFER,pos,gl.DYNAMIC_DRAW);const lp=gl.getAttribLocation(P,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
    ['uSize','uT','uKick','uTint','uVid','uVm','uTf'].forEach(n=>U[n]=gl.getUniformLocation(P,n));
    VT=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,VT);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));
    [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA)}
  /* Bessel functions of the first kind, tabled once per order: the round plate's rings */
  const JT={},JDX=.04,JLEN=3600;
  const besT=n=>{if(JT[n])return JT[n];const a=new Float32Array(JLEN);for(let i=0;i<JLEN;i++){const x=i*JDX;let s=0;for(let k=0;k<48;k++){const t=(k+.5)*PI/48;s+=Math.cos(n*t-x*Math.sin(t))}a[i]=s/48}return JT[n]=a};
  const besJ=(tb,x)=>{const f=x/JDX,i=f|0;if(i>=JLEN-1)return 0;return tb[i]+(tb[i+1]-tb[i])*(f-i)};
  const qOf=n=>clamp(Math.round(n)+4,5,12);
  const plateCPU=(x,y,m,n)=>{if(shape===0){const u=x*.5+.5,v=y*.5+.5;return Math.cos(n*PI*u)*Math.cos(m*PI*v)-Math.cos(m*PI*u)*Math.cos(n*PI*v)}
    if(shape===1){const r=Math.hypot(x,y),xx=(m+.5*n+.25)*PI*.9*r;return besJ(besT(n),xx)*Math.cos(n*Math.atan2(y,x))*Math.max(1,Math.sqrt(xx*1.57))*1.25}
    if(shape===2){let s=0;for(let i=0;i<3;i++){const an=i*PI/3,dx=Math.cos(an),dy=Math.sin(an);s+=Math.cos(m*PI*(x*dx+y*dy))-Math.cos(n*PI*(-x*dy+y*dx)*.866)}return s/3}
    const Q=qOf(n);let s=0;for(let i=0;i<Q;i++){const an=i*PI/Q;s+=Math.cos(m*PI*.7*(x*Math.cos(an)+y*Math.sin(an)))}return s/(Q*.5)};
  /* the plate's motion, laid on a grid whenever the figure changes; the grains read it as they move */
  const build=()=>{if(!mode){grid=null;return}const [m,n]=mode,H=shape===1?Math.min(TH[tone],3):TH[tone];grid=grid||new Float32Array(G*G);let tot=0;const hs=[];
    for(let h=0;h<H;h++){let w=Math.pow(.6,h);if(tone===1)w/=1+h*.3;tot+=w;hs.push([m+TM[tone][h]*(shape===3?.5:1),n+(shape===1||shape===3?0:TN[tone][h]),w])}
    for(let j=0;j<G;j++){const y=(j/(G-1)*2-1)*E;for(let i=0;i<G;i++){const x=(i/(G-1)*2-1)*E;let s=0;for(let h=0;h<H;h++)s+=hs[h][2]*plateCPU(x,y,hs[h][0],hs[h][1]);grid[j*G+i]=s/tot}}
    sharp=30-21*Math.min(1,H/8)};
  const samp=(x,y)=>{let u=x/E*.5+.5,v=y/E*.5+.5;u-=Math.floor(u*.5)*2;if(u>1)u=2-u;v-=Math.floor(v*.5)*2;if(v>1)v=2-v;
    const fx=u*(G-1),fy=v*(G-1);let ix=fx|0,iy=fy|0;if(ix>G-2)ix=G-2;if(iy>G-2)iy=G-2;const ax=fx-ix,ay=fy-iy,k=iy*G+ix;
    const a=grid[k],b2=grid[k+1],c2=grid[k+G],d=grid[k+G+1];return a+(b2-a)*ax+(c2-a+(a-b2-c2+d)*ax)*ay};
  const HX=new Float32Array(7),HY=new Float32Array(7);let par=0;const fr=x=>x-Math.floor(x),md=(x,m)=>x-Math.floor(x/m)*m,SEG=6,SPD=.25;
  const segD=(px,py,ax,ay,bx,by)=>{const vx=bx-ax,vy=by-ay,wx=px-ax,wy=py-ay,h=clamp((wx*vx+wy*vy)/(vx*vx+vy*vy),0,1);return Math.hypot(wx-vx*h,wy-vy*h)};
  /* the field a grain feels at a place: 01's fifteen visions, each a way of folding the plate */
  const F=(x,y)=>{if(!grid)return 0;const t=T;let px=x*cZ,py=y*cZ;const sc=1/(1+.03*cBeat+cLvl*.03+cRev*.05*Math.sin(t*7));px*=sc;py*=sc;
    let r=Math.hypot(px,py),a=Math.atan2(py,px);
    if(cRev>.75){const sg=TAU/(6+Math.floor(cRev*6));let aa=md(a+t*.2,sg);aa=Math.abs(aa-sg*.5);const k=Math.min(1,(cRev-.75)*4);px+=(r*Math.cos(aa)-px)*k;py+=(r*Math.sin(aa)-py)*k;a=Math.atan2(py,px)}
    let qx=px,qy=py,f;
    switch(vis){
      case 1:a+=r*3.2-t*.4;qx=r*Math.cos(a);qy=r*Math.sin(a);break;
      case 2:case 6:case 9:{if(vis===6){const sg=TAU/SEG;a=md(a,sg);a=Math.abs(a-sg*.5)}
        const lx=a/PI*SEG*.5,ly=vis===9?.35/(r+.02)+t*SPD*2:Math.log(r+1e-4)*1.1-t*SPD;qx=fr(lx)*2-1;qy=fr(ly)*2-1;break}
      case 3:{const sg=TAU/SEG;a=md(a+t*.05,sg);a=Math.abs(a-sg*.5);const k=1+.25*Math.sin(t*.2);qx=r*Math.cos(a)*k;qy=r*Math.sin(a)*k;break}
      case 7:a+=1.2*Math.sin(t*.3)/(r+.35);r+=.05*Math.sin(r*18-t*3);qx=r*Math.cos(a);qy=r*Math.sin(a);break;
      case 8:for(let i=0;i<3;i++){const dx=.26*Math.sin(qy*2.7+t*.7+i),dy=.26*Math.cos(qx*2.3-t*.6+i*1.7);qx+=dx;qy+=dy}break;
      case 10:{const k=SEG*.5,rr=r*(1+.35*Math.cos(SEG*a+t*.3))*1.2;qx=rr*Math.cos(a*k*.5);qy=rr*Math.sin(a*k*.5);break}
      case 11:for(let i=0;i<4;i++){qx=Math.abs(qx)-.45;qy=Math.abs(qy)-.35;const an=t*.07*SPD+i*.6,cs=Math.cos(an),sn=Math.sin(an),nx=(cs*qx-sn*qy)*1.25;qy=(sn*qx+cs*qy)*1.25;qx=nx}break;
      case 12:{const d=Math.max(Math.abs(px),Math.abs(py));if(r<.42){const sg=PI/4;let aa=md(a+t*.03,sg);aa=Math.abs(aa-sg*.5);const rr=r*(1+.35*Math.cos(8*a))*2.2;qx=rr*Math.cos(aa);qy=rr*Math.sin(aa)}
        else{const side=Math.abs(px)>Math.abs(py)?py/d:px/d;qx=(fr(d*4-t*.05)*2-1)*1.1;qy=side*1.65}break}
      case 13:{const sg=TAU/7;let aa=md(a+t*.04,sg);aa=Math.abs(aa-sg*.5);qx=r*Math.cos(aa)*1.35;qy=r*Math.sin(aa)*1.35;break}
      case 14:{const fx=px*2.2,fy=py*2.2-t*(.6+SPD),n1=.5+.25*Math.sin(fx*1.7+1.3*Math.sin(fy*1.3+t*.2))+.25*Math.sin(fy*2.1+fx*.7);qx=px*1.15+(n1-.5)*.55;qy=py*1.15-n1*.45;break}}
    if(vis===4){const c1=Math.cos(t*.1)*1.618,s1=Math.sin(t*.1)*1.618,c2=Math.cos(-t*.13)*2.618,s2=Math.sin(-t*.13)*2.618;
      f=(samp(qx,qy)*.6+samp(c1*qx-s1*qy,s1*qx+c1*qy)*.3+samp(c2*qx-s2*qy,s2*qx+c2*qy)*.2)/1.1}
    else f=samp(qx,qy);
    if(vis===5){const v=3*a/TAU+2.4*Math.log(r+1e-3)-t*.5;f=f*.4+(Math.abs(fr(v)-.5)*2-.5)*.9}
    else if(vis===13){let hp=1;for(let i=0;i<7;i++){const j=(i+3)%7,d=segD(px,py,HX[i],HY[i],HX[j],HY[j]);if(d<hp)hp=d}
      hp=Math.min(hp,Math.abs(r-.86));f=Math.min(Math.abs(f),hp*7)}
    return f};
  /* the figure a pitch rings: m²+n² rises with frequency, as on 01's plate */
  const modeFor=f=>{const Tq=(f<60?f*16:f)/18;let best=[2,1],be=1e9;for(let m=1;m<=14;m++)for(let n=(shape===0?1:0);n<m;n++){const e=Math.abs(m*m+n*n-Tq)+m*.001;if(e<be){be=e;best=[m,n]}}return best};
  const read=(m,n)=>{let fold=1,mirror=false,grp;
    if(shape===1){fold=n===0?0:2*n;grp=n===0?'D∞':'D'+fold}else if(shape===3){const Q=qOf(n);fold=Q%2?2*Q:Q;grp='D'+fold}
    else{const samp2=[];for(let ri=1;ri<=5;ri++)for(let ai=0;ai<72;ai++)samp2.push([ri/6*.9,ai/72*TAU]);
      const fv=(r,a)=>plateCPU(r*Math.cos(a),r*Math.sin(a),m,n),base=samp2.map(([r,a])=>fv(r,a)),e0=base.reduce((s,v)=>s+v*v,0)||1;
      for(let k=12;k>=2;k--){let cc=0;samp2.forEach(([r,a],i)=>cc+=base[i]*fv(r,a+TAU/k));if(Math.abs(cc)/e0>.97){fold=k;break}}
      let mc2=0;samp2.forEach(([r,a],i)=>mc2+=base[i]*fv(r,-a));mirror=Math.abs(mc2)/e0>.97;grp=(mirror?'D':'C')+fold}
    return{m,n,grp,name:NAGA[(m*5+n*3+shape*7+tone*11)%NAGA.length]}};
  const setHz=f=>{hz=f;const nm=modeFor(f);if(!mode||nm[0]!==mode[0]||nm[1]!==mode[1]){mode=nm;build();reading=read(nm[0],nm[1]);kick=Math.max(kick,.55)}};
  const rebuild=()=>{if(hz){mode=modeFor(hz);build();reading=read(mode[0],mode[1])}kick=1;label()};
  /* the strongest tone on the tone channel, measured from the Proof analyser */
  const fb=new Float32Array(16384);
  const measure=()=>{if(!A.ctx||!A.anL)return 0;A.anL.getFloatFrequencyData(fb);const bw=A.ctx.sampleRate/A.anL.fftSize,a=Math.round(30/bw),z=Math.round(2000/bw);let k=a;
    for(let i=a;i<=z;i++)if(fb[i]>fb[k])k=i;if(fb[k]<-75)return 0;const y0=fb[k-1],y1=fb[k],y2=fb[k+1],d=(y0-y2)/(2*(y0-2*y1+y2)||1);return(k+clamp(d,-.5,.5))*bw};
  /* a key played takes the plate at once and holds it a few seconds; then the measured tone takes it back */
  /* every key leaves its own sigil: the figure its pitch rings on the plate, drawn faint in the Monad's glass, blooming and
     fading over about two seconds. Each figure is drawn once and kept (at most twenty), and the glass only animates while
     a sigil is fading, so it costs nothing at rest. */
  const sg=document.createElement('canvas');sg.id='kSig';$('#monad').prepend(sg);const sx2=sg.getContext('2d'),SIGC=new Map(),live=[];let sgRun=false;
  const sigImg=(m,n)=>{const k=shape+':'+m+':'+n;if(SIGC.has(k)){const im=SIGC.get(k);SIGC.delete(k);SIGC.set(k,im);return im}
    const R0=128,o=document.createElement('canvas');o.width=o.height=R0;const x=o.getContext('2d'),id=x.createImageData(R0,R0),v=new Float32Array(R0*R0);let mx=1e-6;
    for(let j=0;j<R0;j++)for(let i=0;i<R0;i++){const px=i/(R0-1)*2-1,py=j/(R0-1)*2-1,r=px*px+py*py;const f=r>1?0:plateCPU(px,py,m,n);v[j*R0+i]=f;if(r<=1)mx=Math.max(mx,Math.abs(f))}
    for(let j=0;j<R0;j++)for(let i=0;i<R0;i++){const px=i/(R0-1)*2-1,py=j/(R0-1)*2-1,r=Math.sqrt(px*px+py*py);if(r>.98)continue;const a=1-clamp(Math.abs(v[j*R0+i])/mx/.11,0,1),q=(j*R0+i)*4;
      id.data[q]=id.data[q+1]=id.data[q+2]=255;id.data[q+3]=Math.round(255*a*a*(1-Math.pow(r,6)))}
    x.putImageData(id,0,0);SIGC.set(k,o);if(SIGC.size>20)SIGC.delete(SIGC.keys().next().value);return o};
  const sgDraw=()=>{const now=performance.now();for(let i=live.length-1;i>=0;i--)if(now-live[i].t>2400)live.splice(i,1);
    const W=sg.width;sx2.setTransform(1,0,0,1,0,0);sx2.globalCompositeOperation='source-over';sx2.clearRect(0,0,W,W);
    if(!live.length){sgRun=false;return}requestAnimationFrame(sgDraw);
    live.forEach(o=>{const age=(now-o.t)/1000,a=Math.min(1,age/.08)*Math.exp(-age*1.6)*o.g;sx2.save();sx2.translate(W/2,W/2);sx2.rotate(o.r+age*.12);const sc=W*(.98+age*.05);sx2.globalAlpha=a;sx2.drawImage(o.im,-sc/2,-sc/2,sc,sc);sx2.restore()});
    sx2.globalAlpha=1;sx2.globalCompositeOperation='source-atop';const m=/#?([0-9a-f]{6})/i.exec(window.ENVCOL||getComputedStyle(document.documentElement).getPropertyValue('--b')||'');
    sx2.fillStyle=m?'#'+m[1]:'#f2455c';sx2.fillRect(0,0,W,W);sx2.fillStyle='rgba(255,255,255,.3)';sx2.fillRect(0,0,W,W);sx2.globalCompositeOperation='source-over'};
  const keySig=(id,i,vel)=>{if(window.KSIG===false)return;const V=VOX[S.voice]||VOX[0],f=(KEYHZ[id]||degFreq(i))*Math.pow(2,V.oct||0);if(!(f>0))return;
    const r=$('#monad').getBoundingClientRect();if(r.width<40)return;const px=Math.min(320,Math.round(r.width*.76*Math.min(devicePixelRatio||1,2)));if(sg.width!==px)sg.width=sg.height=px;
    const [m,n]=modeFor(f);live.push({im:sigImg(m,n),t:performance.now(),g:.32+.25*Math.min(1,vel),r:Math.random()*.4-.2});if(live.length>5)live.shift();if(!sgRun){sgRun=true;requestAnimationFrame(sgDraw)}};
  /* called once per key press from the last hook on the keys (end of this file), so every voice reaches it, Ascension's too */
  window.CYMKEY=(id,i,vel=1)=>{try{keySig(id,i,vel)}catch(_){}if(!on||!A.ctx)return;const V=VOX[S.voice]||VOX[0],f=degFreq(i)*Math.pow(2,V.oct||0);if(!(f>0))return;
    keyHz=f;keyT=performance.now();kick=Math.max(kick,.6+.4*Math.min(1,vel));setHz(f);label()};
  const label=()=>{bShape.textContent='plate · '+SHP[shape];bVis.textContent=VISN[vis];bTone.textContent='tone · '+TONES[tone];bBig.textContent=big?(MOBILE?'set in dial':'set in the Monad'):'lift out';bView.textContent='view · '+VIEWS[view];bCol.textContent=vm?'colour · film':'colour · white';
    rd.textContent=!A.ctx?'the sand wakes with the sound':!reading?'waiting for a tone':`${hz.toFixed(1)} Hz · figure ${reading.m},${reading.n} · ${reading.grp} · ${reading.name}`};
  let box={x:0,y:0,s:0,v:false};
  const place=()=>{let cx,cy,s,v=true;
    if(big&&bar.parentElement!==document.body){document.body.append(bar);bar.classList.remove('dock')}
    if(big){cx=innerWidth/2;if(MOBILE){const top=12,bot=bar.getBoundingClientRect().top-8||innerHeight;cy=(top+bot)/2;s=Math.min(innerWidth*.96,bot-top)}else{s=Math.min(innerWidth*.8,innerHeight-236);cy=62+s/2}}
    else if(!MOBILE){/* on a computer the plate is set inside the Monad, and its controls wait in the panel beside the Proof */
      const d=$('#monad').getBoundingClientRect();v=d.width>40;cx=d.left+d.width/2;cy=d.top+d.height/2;s=d.width*.82;const dk=$('#cymDock');
      if(dk&&bar.parentElement!==dk){dk.append(bar);bar.classList.add('dock');bar.style.left=bar.style.top=''}
      else if(!dk&&bar.parentElement!==document.body){document.body.append(bar);bar.classList.remove('dock')}
      if(!dk){const bw=bar.offsetWidth,bh=bar.offsetHeight;bar.style.left=clamp(cx,bw/2+6,innerWidth-bw/2-6)+'px';bar.style.top=Math.max(4,d.top-bh-6)+'px'}}
    else{const d=$('#dial').getBoundingClientRect();v=d.width>40;cx=d.left+d.width/2;cy=d.top+d.height/2;s=d.width*.7;
      if(!MOBILE&&v){const side=d.top-$('.acts').getBoundingClientRect().bottom<50;bar.classList.toggle('side',side);const bw=bar.offsetWidth,bh=bar.offsetHeight;
        if(side){bar.style.left=(d.right+8)+'px';bar.style.top=Math.max(4,cy-bh/2)+'px'}else{bar.style.left=clamp(cx,bw/2+6,innerWidth-bw/2-6)+'px';bar.style.top=Math.max(4,d.top-bh-6)+'px'}}}
    if(MOBILE){const sb=big||$('.hud').dataset.tab==='proof';if(bar.hidden===sb)bar.hidden=!sb}
    if(v!==box.v){box.v=v;c.style.visibility=c2.style.visibility=v?'visible':'hidden'}
    if(!v)return false;
    if(Math.abs(box.s-s)>1||Math.abs(box.x-cx)>1||Math.abs(box.y-cy)>1){box.x=cx;box.y=cy;box.s=s;const dp=Math.min(devicePixelRatio||1,2);
      c.style.width=c.style.height=s+'px';c.style.left=(cx-s/2)+'px';c.style.top=(cy-s/2)+'px';const px=Math.round(s*dp);if(c.width!==px)c.width=c.height=px;
      c2.style.width=c2.style.height=s+'px';c2.style.left=(cx-s/2)+'px';c2.style.top=(cy-s/2)+'px';if(c2.width!==px)c2.width=c2.height=px}
    return true};
  const draw=now=>{if(!on)return;requestAnimationFrame(draw);tick(now)};
  const tick=now=>{if(!gl)return;const dt=Math.min(.05,(now-(draw.l||now))/1000);draw.l=now;if(!place())return;T+=dt;
    if(view){if(now-lastTint>700){lastTint=now;const m=/#?([0-9a-f]{6})/i.exec(window.ENVCOL||getComputedStyle(document.documentElement).getPropertyValue('--b')||'');if(m){const v=parseInt(m[1],16);tint=[(v>>16)/255,(v>>8&255)/255,(v&255)/255]}}draw2(dt);return}
    if(now-lastF>120){lastF=now;if(keyHz&&now-keyT>3200)keyHz=0;if(!keyHz){const f=measure();if(f)setHz(f)}label()}
    if(now-lastTint>700){lastTint=now;const m=/#?([0-9a-f]{6})/i.exec(window.ENVCOL||getComputedStyle(document.documentElement).getPropertyValue('--b')||'');if(m){const v=parseInt(m[1],16);tint=[(v>>16)/255,(v>>8&255)/255,(v&255)/255]}}
    /* how hard the plate is shaking: silence leaves the sand lying, loudness makes it dance, the beat rocks it */
    const L=A.ctx?lvl:0,rev=window.REVV||0,beat=S.beat||0,wake=clamp((L-.004)/.04,0,1);kick*=Math.exp(-dt*5);
    cLvl=L;cRev=rev;cBeat=beat<20?Math.sin(TAU*beat*T):0;cZ=shape===0&&vis===0?1/SQ:1;
    const sq=shape===0&&vis===0,move=(wake*(.55+L*1.6)*(1+.45*cBeat*(beat<14?1:0))+kick*2.6+rev*1.2)*Math.min(2,dt*60),heat=sharp/(1+kick*5+rev*1.5+L*.6);
    if(vis===13)for(let i=0;i<7;i++){const a1=-PI*.5+i*TAU/7+T*.04;HX[i]=.82*Math.cos(a1);HY[i]=.82*Math.sin(a1)}
    const hv=vis===4||vis===8||vis===11||vis===13?2:1;par^=1;
    if(move>.002)for(let i=hv>1?par:0;i<N;i+=hv){const k=i*2,x=pos[k],y=pos[k+1],f0=Math.abs(F(x,y)),st=((.004+.06*(f0>1?1:f0))*move+kick*.012)*(hv>1?1.5:1),
        nx=x+(Math.random()*2-1)*st,ny=y+(Math.random()*2-1)*st;
      if(sq?(nx>SQ||nx<-SQ||ny>SQ||ny<-SQ):(nx*nx+ny*ny>1))continue;
      const f1=Math.abs(F(nx,ny));if(f1<=f0||Math.random()<Math.exp((f0-f1)*heat)){pos[k]=nx;pos[k+1]=ny}}
    gl.viewport(0,0,c.width,c.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(P);gl.bindBuffer(gl.ARRAY_BUFFER,bufP);gl.bufferSubData(gl.ARRAY_BUFFER,0,pos);
    gl.uniform1f(U.uSize,Math.max(1.3,c.width/(MOBILE?210:250)));gl.uniform1f(U.uT,T);gl.uniform1f(U.uKick,Math.min(1,kick));gl.uniform3f(U.uTint,tint[0],tint[1],tint[2]);
    if(now-vidT>140){vidT=now;/* the picture as it is on screen (the visualizer canvas, read in the same frame it was drawn), else the raw film */const fv=$('#field'),v=fv&&fv.width?fv:$('#veil');if(vm&&v&&(v===fv||(v.readyState>=2&&v.videoWidth))){try{vsX.drawImage(v,0,0,32,32);gl.bindTexture(gl.TEXTURE_2D,VT);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,vsC)}catch(_){}}}
    vmNow+=(vm-vmNow)*Math.min(1,dt*2.5);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,VT);gl.uniform1i(U.uVid,0);gl.uniform1f(U.uVm,vmNow*.92);gl.uniform1f(U.uTf,T%1000);gl.drawArrays(gl.POINTS,0,N);
    if(keep){keep=false;const o=document.createElement('canvas');o.width=o.height=1080;const x=o.getContext('2d');x.fillStyle='#050406';x.fillRect(0,0,1080,1080);
      x.beginPath();x.arc(540,500,452,0,TAU);x.fillStyle='#0b090d';x.fill();x.drawImage(c,90,50,900,900);
      x.fillStyle='rgba(255,205,210,.92)';x.textAlign='center';x.font='600 44px "Grenze Gotisch"';x.fillText(reading?reading.name:'Black Dragon II',540,1010);
      x.font='17px "Texturina"';x.fillText(`${SHP[shape]} plate · ${VISN[vis]} · ${TONES[tone]} · ${hz.toFixed(1)} Hz`,540,1048);
      o.toBlob(bl=>{save(bl,'black-dragon-sand-'+(reading?reading.name.toLowerCase()+'-':'')+hz.toFixed(1)+'hz.png');say('figure kept · '+(reading?reading.name:'saved'))},'image/png')}};
  const seat=()=>{c.classList.toggle('big',big);bar.classList.toggle('big',big);const inM=!big&&!MOBILE;c.classList.toggle('inMon',inM);c2.classList.toggle('inMon',inM);c2.classList.toggle('big',big);
    if(big)document.body.append(c);else if(inM)$('#monad').append(c);else $('#dial').before(c);c.after(c2);document.body.classList.toggle('cymOpen',on&&big&&MOBILE);
    if(big||MOBILE){bar.style.left='';bar.style.top='';bar.classList.remove('side')}box.s=0;box.v=null;label()};
  const set=v=>{on=v;c.hidden=bar.hidden=!v;c2.hidden=!v||!view;b.classList.toggle('on',v);document.body.classList.toggle('cymIn',v);big=v&&MOBILE;seat();
    if(v){lastF=0;draw.l=0;kick=1;requestAnimationFrame(draw);say(gl?'cymatics · the tone you hear gathers the sand':'this device cannot draw the plate')}else say('cymatics off')};
  b.onclick=()=>set(!on);$('#cymX').onclick=()=>set(false);$('#pads').addEventListener('click',e=>{if(e.target.closest('.cymGo')){e.stopPropagation();set(!on)}});$('#tabs').addEventListener('click',()=>{if(on&&big&&MOBILE){big=false;seat()}});
  bShape.onclick=()=>{shape=(shape+1)%4;if(shape===0&&vis===0)for(let i=0;i<N;i++){const x=pos[i*2],y=pos[i*2+1];if(x>SQ||x<-SQ||y>SQ||y<-SQ)scatter(i)}rebuild();say('plate · '+SHP[shape])};
  const stepVis=d=>{const was=shape===0&&vis===0;vis=(vis+d+VISN.length)%VISN.length;if(shape===0&&vis===0&&!was)for(let i=0;i<N;i++){const x=pos[i*2],y=pos[i*2+1];if(x>SQ||x<-SQ||y>SQ||y<-SQ)scatter(i)}kick=1;label();say('vision · '+VISN[vis])};
  bVis.onclick=$('#cymVn').onclick=()=>stepVis(1);$('#cymVp').onclick=()=>stepVis(-1);
  bTone.onclick=()=>{tone=(tone+1)%5;rebuild();say('tone · '+TONES[tone])};
  bBig.onclick=()=>{big=!big;seat();if(MOBILE&&!big){const p=$('#tabs [data-t=play]');if(p)p.click()}say(big?'the plate is lifted out':MOBILE?'the plate is set in the dial · its controls wait under proof':'the plate is set in the dial')};
  $('#cymKeep').onclick=()=>{if(!reading)return say('play a tone first, then keep its figure');keep=true};
  window.CYM={get on(){return on},set,tick,state:()=>({shape,tone,vis,mode,hz,kick,big,N})}}

/* ================= the small screen in Proof: spectrum, figure, seal ================= */
window.PEARL=0;
{const sp=$('#spec'),x=sp.getContext('2d'),names=['spectrum','figure','seal'],bl=new Float32Array(1024),br=new Float32Array(1024);sp.title='Press to change the view: spectrum, figure, seal';
  sp.addEventListener('click',()=>{window.PEARL=(window.PEARL+1)%3;say('proof screen · '+names[window.PEARL])});
  (function loop(){requestAnimationFrame(loop);if(!window.PEARL||!A.ctx)return;const W=sp.width,H=sp.height;x.clearRect(0,0,W,H);x.lineWidth=2;x.strokeStyle='#f2455c';x.beginPath();
    if(window.PEARL===1){const t=sigilTap();if(!t)return;t.l.getFloatTimeDomainData(SL);t.r.getFloatTimeDomainData(SR);const bl=SL.subarray(1024),br=SR.subarray(1024);let m=.02;for(let i=0;i<1024;i++)m=Math.max(m,Math.abs(bl[i]),Math.abs(br[i]));const k=H*.45/m;
      for(let i=0;i<1024;i++){const px=W/2+bl[i]*k,py=H/2-br[i]*k;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
    else if(FORGED){const k=H*.9/176;FORGED.pts.forEach((pt,i)=>{const px=W/2+pt[0]*k,py=H/2+pt[1]*k;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke()}
    else{x.fillStyle='rgba(255,255,255,.6)';x.font='20px "Chakra Petch"';x.textAlign='center';x.fillText('forge a seal to see it here',W/2,H/2+7)}})()}

/* ================= video: a vertical clip of the glass with the sound, for sharing ================= */
let VREC=null;
{const b=document.createElement('button');b.className='pill';b.id='bVid';b.textContent='record video';b.title='Record a vertical 9:16 clip with sound. Press again to stop and save.';$('#bRec').after(b);
  b.onclick=()=>{
    if(VREC){VREC.stop();return}if(!A.ctx||!window.MediaRecorder)return say('this browser cannot record video');
    const c=document.createElement('canvas');c.width=720;c.height=1280;const x=c.getContext('2d'),dest=A.ctx.createMediaStreamDestination();A.vol.connect(dest);
    const stream=c.captureStream(30);dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));
    const mime=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));if(!mime)return say('this browser cannot record video');
    const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:6e6}),chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    rec.onstop=()=>{window.afterFrame=null;try{A.vol.disconnect(dest)}catch(_){}VREC=null;b.classList.remove('on');b.textContent='record video';save(new Blob(chunks,{type:mime}),'black-dragon-'+stamp()+(mime.includes('mp4')?'.mp4':'.webm'));say('video saved')};
    window.afterFrame=()=>{const sw=Math.min(cv.width,cv.height*9/16),sh=sw*16/9,sx=(cv.width-sw)/2,sy=(cv.height-sh)/2;x.drawImage(cv,sx,sy,sw,sh,0,0,720,1280);
      x.fillStyle='rgba(255,255,255,.92)';x.textAlign='center';x.font='44px "Pirata One"';x.fillText('Black Dragon II',360,1150);x.font='20px "Michroma"';x.fillText(`${STATES[S.state].name.toLowerCase()} · ${S.beat} hz`,360,1196)};
    rec.start(1000);VREC=rec;b.classList.add('on');b.textContent='stop video';say('recording video · up to ten minutes');setTimeout(()=>{if(VREC===rec)rec.stop()},600000)}}

applyMix();document.addEventListener('pointerdown',()=>setTimeout(applyMix,400),{once:true});

/* ================= the intro: the live effect shows itself off until you step through the lens ================= */
{const en=$('#enter'),g=$('#gateVid');g.removeAttribute('src');try{g.load()}catch(_){}
  /* at the entrance the orb sits in the middle of the screen, the eye of the visual's portal; lifted only if the title would touch it */
  const place=()=>{const b=$('#dial').getBoundingClientRect();if(!b.width)return;let cx=b.left+b.width/2,cy=b.top+b.height/2;
    if(!A.ctx){const r=b.width*.35,m=$('.gate-in .mark').getBoundingClientRect();cx=innerWidth/2;cy=innerHeight/2;if(m.height&&m.top>innerHeight*.45)cy=Math.min(cy,m.top-r-18);cy=Math.max(cy,r+10);window.GATEBOX={left:cx-b.width/2,top:cy-b.height/2,width:b.width,height:b.height}}else window.GATEBOX=null;
    en.style.left=cx+'px';en.style.top=cy+'px';en.style.width=en.style.height=(b.width*.7)+'px'};
  place();addEventListener('resize',place);setTimeout(place,400);setTimeout(place,1500);
  if(!A.ctx){$('#veil').play().catch(()=>{});const order=[1,2,3,0,5,2],t0=performance.now();window.VMODE=order[0];
    let lastSwap=performance.now();
    const demo=setInterval(()=>{if(A.ctx){clearInterval(demo);window.GATEBOX=null;window.VMODE=null;window.REVV=0;hintVis();RS_GRACE=performance.now()+12000;/* the instrument opens on the serpent, its signature, whatever the walk was showing */const sf=window.SHAREFILM;if(sf!=null){window.SHAREFILM=null;setFilm(sf)}else if(film!==0&&!($('#bOwn')&&$('#bOwn').classList.contains('on')))setFilm(0);return}
      /* walk through the visualizers too: a new one every four seconds, once the current one is actually playing */
      const v=$('#veil');if(performance.now()-lastSwap>4000&&v.readyState>=2&&!document.hidden){lastSwap=performance.now();setFilm(film+1)}
      const t=(performance.now()-t0)/1000,ph=(t%7)/7;window.VMODE=order[Math.floor(t/7)%order.length];window.REVV=ph>.8?Math.max(0,1-Math.abs(ph-.9)/.1)*.75:.12+.1*Math.sin(t*.5)},60)}}

/* ================= silence: empty the board so the sound is built up from nothing ================= */
/* silence puts everything away: no stone, no sounds chosen anywhere, no tone, body, air or closeness, no tide; the
   keys still play. Pause only quiets the device; reset returns to how it sounds at start-up. */
function blankAll(){window.BLANKING=true;try{resetAll()}finally{window.BLANKING=false}if(ENV)setEnv(null);clearLayers();Object.assign(S,{tone:0,body:0,air:0,close:0,tide:false});paintKnobs();applyAll();$('#bTide').classList.toggle('on',false);if(typeof paintLive==='function')paintLive();
  say('silence · the board is empty. add a stone, a tone or a dial, or just play')}
$('#bBlank').onclick=blankAll;

/* a back step for the films, now that there are many */
{const b=document.createElement('button');b.className='pill';b.id='bFilmPrev';b.textContent='‹';b.title='Previous visualizer';b.setAttribute('aria-label','Previous visualizer');$('#bFilm').before(b);
  b.onclick=()=>{setFilm(film-1);$('#veil').play().catch(()=>{})};$('#bFilm').title='Next visualizer'}
/* your own video in the visualizer: played straight from the device, never sent anywhere, gone on refresh */
{const b=document.createElement('button'),inp=document.createElement('input'),v=$('#veil');let own=null;
  b.className='pill';b.id='bOwn';b.textContent='your video';b.title='Play a video from your device in the visualizer. It is not uploaded or saved; it is gone when you refresh.';
  inp.type='file';inp.accept='video/*';inp.hidden=true;document.body.appendChild(inp);$('#bFilm').after(b);
  b.onclick=()=>inp.click();
  inp.onchange=()=>{const f=inp.files&&inp.files[0];inp.value='';if(!f)return;
    if(!v.canPlayType(f.type||'video/mp4')&&f.type){say('this device cannot play that kind of video');return}
    if(own)URL.revokeObjectURL(own);own=URL.createObjectURL(f);clearTimeout(filmWatch);
    try{v.pause()}catch(_){}v.muted=true;v.loop=true;v.src=own;v.load();const q=v.play();if(q&&q.catch)q.catch(()=>{});
    $('#bFilm').textContent='visualizer · yours';b.classList.add('on')};
  const mine=()=>(v.currentSrc||v.src||'').startsWith('blob:');
  v.addEventListener('playing',()=>{if(mine())say('your video · this session only, not saved');else b.classList.remove('on')});
  v.addEventListener('error',()=>{if(mine()){say('that video would not play. try an mp4');b.classList.remove('on')}})}

/* on arrival the visualizer button glows until it is first used */
function hintVis(){const b=$('#bFilm'),p=$('#bFilmPrev'),m=$('#tabs [data-t=more]'),off=()=>{b.classList.remove('nudge');m.classList.remove('nudge');b.removeEventListener('click',off);p.removeEventListener('click',off)};
  b.classList.add('nudge');m.classList.add('nudge');b.addEventListener('click',off);p.addEventListener('click',off);setTimeout(()=>say('press visualizer to change the picture'),1400)}

/* ================= audio health readout: add ?diag to the address to see it ================= */
if(/[?&]diag\b/.test(location.search)){
  const box=document.createElement('div');box.id='diag';box.style.cssText='position:fixed;left:10px;bottom:10px;z-index:99999;background:rgba(0,0,0,.86);color:#9f9;font:11px/1.5 ui-monospace,Menlo,monospace;padding:10px 12px;border:1px solid #3a3;border-radius:6px;white-space:pre;pointer-events:none;max-width:92vw';
  box.textContent='audio health · enter the instrument to begin';document.body.appendChild(box);
  const src="class H extends AudioWorkletProcessor{constructor(){super();this.s={gap:0,late:0,clip:0,peak:0,calls:0};this.last=0;this.port.onmessage=()=>{this.port.postMessage(this.s);this.s={gap:0,late:0,clip:0,peak:0,calls:0}}}process(i){const n=Date.now(),s=this.s;if(this.last){const g=n-this.last;if(g>s.gap)s.gap=g;if(g>30)s.late++}this.last=n;s.calls++;for(let c=0;c<i[0].length;c++){const b=i[0][c];for(let k=0;k<b.length;k++){const a=Math.abs(b[k]);if(a>=.999)s.clip++;if(a>s.peak)s.peak=a}}return true}}registerProcessor('health',H)";
  const tot={late:0,clip:0,gap:0,sec:0};
  const wait=setInterval(()=>{if(!A.ctx)return;clearInterval(wait);const ctx=A.ctx;
    ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([src],{type:'text/javascript'}))).then(()=>{const h=new AudioWorkletNode(ctx,'health');A.vol.connect(h);
      h.port.onmessage=e=>{const s=e.data;tot.late+=s.late;tot.clip+=s.clip;tot.gap=Math.max(tot.gap,s.gap);tot.sec++;
        const ua=navigator.userAgent,br=/Edg\//.test(ua)?'Edge':/Firefox\//.test(ua)?'Firefox':/Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'other';
        box.style.color=tot.late||tot.clip?'#f46':'#9f9';box.style.borderColor=tot.late||tot.clip?'#b23':'#3a3';
        box.textContent=`audio health · ${br} · ${ctx.sampleRate} Hz · ${ctx.state}\nbuffer ${(ctx.baseLatency*1000||0).toFixed(1)} ms · output delay ${((ctx.outputLatency||0)*1000).toFixed(0)} ms\nlate deliveries  ${tot.late}   (longest gap ${tot.gap} ms)\nclipped samples  ${tot.clip}   peak now ${s.peak.toFixed(2)}\nsounds playing   ${Object.keys(act).length} world · ${Object.keys(held).length} keys\nrunning ${tot.sec} s`};
      setInterval(()=>h.port.postMessage(0),1000)}).catch(()=>{box.textContent='audio health · this browser would not start the probe'})},500)}

/* ================= UMBRA: the hidden heart of the Universe stone =================
   One button that builds a whole soundscape meant to feel like dark warmth and being held.
   Everything in it is slow, low, soft-edged and consonant, which is what tender music has in common.
   Built on the Venus tone (221.23 Hz, an orbit doubled until it can be heard) and its lower octave, 110.615 Hz. */
{const VEN=221.23,ROOT=VEN/2,UMB=[
   /* the ground: root, the octave below it, a fifth above. Two roots a tenth of a hertz apart swell once every ten seconds, the pace of a slow breath */
   D([ROOT/2,ROOT,ROOT+.1,ROOT*1.5],.62,{w:'triangle',lp:700,wide:.5}),
   /* the bloom: Venus, a pure third, a fifth and a ninth above it, each rising and fading on its own slow tide of 24 to 29 seconds */
   D([VEN,VEN*1.25,VEN*1.5,VEN*2.25],.34,{wide:1.4,trem:[.035,.95]}),
   /* the dark: low brown noise breathing with the ground */
   B('brown',170,.5,{lfo:[.1,.35]}),
   /* the heart: 54 beats a minute, a little slower than a heart at rest */
   HB(54,.3,{f:58,d:.22}),
   /* gravity: a soft tone that sinks one octave over ten seconds, now and then */
   GL([22,16],[VEN,VEN],[.5],[9,12],.07,{w:'sine',lp:800}),
   B('pink',900,.05,{ft:'bandpass',q:.7,lfo:[.05,.6]})],
  b={id:'umbra',n:'umbra',cat:'universe stone',tag:TR,verb:1,env:'universe',lvl:.85,
   info:'Umbra. The Venus tone and its lower octave, a breath every ten seconds, a heart at fifty-four. Dark warmth.',
   gen:(ctx,out,L)=>UMB.forEach(s=>prim(ctx,out,L,structuredClone(s)))};
 BANK.push(b);BK.umbra=b;
 const st=document.createElement('style');st.textContent=`
  .umbraBtn+.padg{height:auto!important}
  .umbraBtn{display:block;width:100%;margin:0 0 8px;padding:12px 10px;border-radius:10px;border:1px solid rgba(255,120,150,.45);cursor:pointer;position:relative;overflow:hidden;
    font-family:var(--serif,serif);font-style:italic;font-size:18px;line-height:1.1;letter-spacing:.14em;color:#ffe3ea;text-shadow:0 0 14px rgba(255,70,120,.8);
    background:radial-gradient(120% 160% at 50% 120%,rgba(255,60,110,.55),rgba(90,10,60,.55) 45%,rgba(8,4,14,.9) 80%);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.18),inset 0 -10px 24px rgba(0,0,0,.6),0 0 18px rgba(200,30,90,.25)}
  .umbraBtn::before{content:"";position:absolute;inset:-40%;background:radial-gradient(closest-side,rgba(255,90,140,.5),transparent 70%);animation:umbraPulse 10s ease-in-out infinite;pointer-events:none}
  .umbraBtn small{display:block;font:9px var(--tech,sans-serif);font-style:normal;letter-spacing:.24em;opacity:.7;margin-top:3px;text-transform:uppercase}
  .umbraBtn.on{border-color:#ff7fa6;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 0 34px rgba(255,60,120,.6)}
  .umbraBtn.on::before{animation-duration:1.11s}
  @keyframes umbraPulse{0%,100%{transform:scale(.6);opacity:.35}50%{transform:scale(1.15);opacity:.9}}
  @media (prefers-reduced-motion:reduce){.umbraBtn::before{animation:none}}`;document.head.appendChild(st);
 const umbIsOn=()=>'umbra' in S.layers;
 /* the Umbra journey: a love hypnosis in Umbra's own tone, about fourteen minutes, told in sound alone (the owner took the
    words off the screen, 2026-11-27): sinking in, drawing closer, a sensual rise and crest in the middle, an afterglow, and back.
    Umbra itself never changes; the beat glides, the Lust stone's sounds and the Monad's voice rise and fall around it.
    When the journey ends, Umbra keeps playing until it is released. */
 const UJ={on:false,t0:0,iv:null,ti:0,added:new Set(),word:-1,mon:false};
 const BEAT=[[0,1.4],[55,.9],[210,.9],[360,1.4],[540,2.6],[600,3.2],[780,.7],[830,.9]];
 /* [time, sound, level, seconds to fade]: level 0 lets the sound go */
 const CUES=[[210,'e:lust:1',.32,14],[215,'e:lust:3',.28,18],[360,'e:lust:0',.4,16],[372,'e:lust:8',.34,20],[420,'e:lust:7',.3,20],[460,'e:lust:9',.28,24],
   [596,'e:lust:9',0,10],[598,'e:lust:7',0,12],[600,'e:lust:8',0,14],[602,'e:lust:0',0,16],[606,'e:lust:11',.34,20],[640,'e:lust:1',0,24],
   [780,'e:lust:11',0,30],[790,'e:lust:3',0,30]];
 const lvlTo=(id,lv,secs)=>{if(!A.ctx)return;const L=act[id];if(lv>0){if(!L){setLayer(id,.001);UJ.added.add(id)}S.layers[id]=lv;const L2=act[id];/* the journey keeps the levels it was made with: the stone loudness trim is taken back out here */const st=(id!=='umbra'&&BK[id]&&BK[id].env&&typeof STONETRIM!=='undefined'&&STONETRIM[BK[id].env])||1;if(L2)L2.g.gain.setTargetAtTime(lv*lyrLvl(id)/st,A.ctx.currentTime,secs/3)}
   else if(L){L.g.gain.setTargetAtTime(0,A.ctx.currentTime,secs/4);setTimeout(()=>{if(UJ.added.has(id)){setLayer(id,null);UJ.added.delete(id)}},secs*1000)}};
 const beatAt=s=>{for(let i=1;i<BEAT.length;i++){const [t1,b1]=BEAT[i],[t0,b0]=BEAT[i-1];if(s<=t1){const f=(s-t0)/(t1-t0);return b0*Math.pow(b1/b0,f)}}return BEAT[BEAT.length-1][1]};
 const ujTick=()=>{if(!UJ.on)return;const s=(performance.now()-UJ.t0)/1000;
   S.beat=+beatAt(s).toFixed(3);if(typeof applyBeat==='function')applyBeat();paintDial();
   while(UJ.ti<CUES.length&&CUES[UJ.ti][0]<=s){const [,id,lv,sec]=CUES[UJ.ti++];lvlTo(id,lv,sec)}
   /* the crest: the Monad's voice climbs under everything for twenty seconds, then sinks */
   if(!UJ.mon&&s>=540&&s<560){UJ.mon=true;try{monadStart()}catch(_){}}
   if(UJ.mon&&s>=560){UJ.mon=false;try{monadStop()}catch(_){}}
   window.REVV=s>520&&s<600?Math.max(window.REVV||0,.35*Math.sin(Math.PI*(s-520)/80)):window.REVV;
   if(s>836){ujStop(true)}};
 const ujStart=()=>{ujStop(false);UJ.on=true;UJ.t0=performance.now();UJ.ti=0;UJ.word=-1;
   if(act.umbra){act.umbra.g.gain.setValueAtTime(.12*lyrLvl('umbra'),A.ctx.currentTime);act.umbra.g.gain.setTargetAtTime(.6*lyrLvl('umbra'),A.ctx.currentTime,14)}
   UJ.iv=setInterval(ujTick,250);ujTick();say('umbra · the journey begins')};
 const ujStop=done=>{if(!UJ.on&&!UJ.iv)return;UJ.on=false;clearInterval(UJ.iv);UJ.iv=null;if(UJ.mon){UJ.mon=false;try{monadStop()}catch(_){}}
   hudSet('','','');showHud(false);if(!done){UJ.added.forEach(id=>setLayer(id,null));UJ.added.clear()}else say('umbra · the journey is done')};
 $('#rStop').addEventListener('click',()=>{if(UJ.on)ujStop(false)});
 window.UMBRAJ=UJ;

 const umbraOn=()=>{
   if(!A.ctx)return;envPads('universe').forEach(k=>setLayer(k,null));
   setState(STATES.findIndex(x=>x.id==='desire'));
   Object.assign(S,{fc:+ROOT.toFixed(2),beat:.9,mode:'monaural',tone:.4,body:.45,air:0,close:0,space:.85,echo:.62,att:.72,rel:.8,tide:false,speed:.14,trails:.72,warp:.25,grain:.22,veil:.5,twist:0,mirrors:0});
   $('#bTide').classList.remove('on');tun=TUN.findIndex(t=>t[0]==='pythagorean');{const vx=$('#vox');if(vx&&vx._sync)vx._sync()}
   setVoice(VOICES.indexOf('opium choir'));window.ENVCOL='#b1123c';paintDial();paintModes();paintKnobs();applyAll();setLayer('umbra',.6);ujStart()};
 const umbraOff=()=>{ujStop(false);UJ.added.forEach(id=>setLayer(id,null));UJ.added.clear();setLayer('umbra',null);const e=ENVS.find(x=>x.id===ENV);window.ENVCOL=e?e.col:null;say('umbra · released')};
 const umbPaint=()=>{const u=$('#bUmbra');if(u)u.classList.toggle('on',umbIsOn())};
 const b0=buildPads;buildPads=()=>{b0();if(ENV!=='universe')return;const u=document.createElement('button');u.id='bUmbra';u.className='umbraBtn';u.title='Umbra: a love hypnosis journey of about fourteen minutes, in sound alone. Umbra stays when it ends. Press again to release it.';
    u.textContent='Umbra';u.onclick=()=>{umbIsOn()?umbraOff():umbraOn();umbPaint()};$('#pads h3').after(u);umbPaint()};
 const p0=paintPads;paintPads=()=>{p0();umbPaint()};
 const s0=setEnv;setEnv=(id,start)=>{s0(id,start);if(ENV!=='universe'&&umbIsOn())setLayer('umbra',null)};
 buildPads();paintPads()}

/* ================= the Keys bar: choose the keyboard's voice from directly over the keyboard, centred =================
   The voice button used to sit among the menus on the right and got lost. It now lives here with a step back and a step forward.
   Pressing the name still opens the full list. On phones the bar sits directly above the keys. */
{const bar=document.createElement('div'),v=$('#bVoice'),mk=(txt,title,step)=>{const b=document.createElement('button');b.className='pill kstep';b.textContent=txt;b.title=title;b.setAttribute('aria-label',title);
    b.onclick=e=>{e.stopPropagation();setVoice(S.voice+step)};return b};
 bar.id='keysBar';bar.append(mk('‹','Previous keyboard voice',-1),v,mk('›','Next keyboard voice',1));v.title='The voice the keyboard plays. Press to see all of them.';
 $('#keys').before(bar);
 const st=document.createElement('style');st.textContent=`
  #keysBar{display:flex;gap:4px;align-items:stretch}
  @media (min-width:1001px) and (pointer:fine){.deck>#keysBar{grid-column:3;grid-row:1;align-self:start;justify-self:center;z-index:2}.deck>#keys{grid-column:3;grid-row:1;align-self:end;height:104px}}
  #keysBar #bVoice{min-width:190px;max-width:240px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:5px 12px;min-height:26px;font-size:9px;border-color:rgba(245,96,114,.6)}
  #keysBar .kstep{padding:5px 11px;min-height:26px;font-size:13px;line-height:1}#keysBar .kstep::before{display:none!important}
  @media (max-width:1000px),(pointer:coarse){
   #keysBar{display:none;margin:0 0 6px;gap:6px}.hud[data-tab=play] #keysBar{display:flex}
   #keysBar #bVoice{flex:1;max-width:none;min-height:44px;font-size:11px}#keysBar .kstep{min-height:44px;min-width:52px;font-size:18px}}`;
 document.head.appendChild(st);setVoice(S.voice)}

/* ================= PHANTOMS: sounds the ear finishes for itself =================
   Three of them, each off until pressed and listed in "sounding now" while it runs.
   The descent and the circling breath go through the rites fader; the silence sings goes straight to the output
   because it hushes the rest of the board for its listening and brings it back after. None touches the tone channel. */
const PH={};
{const d=document.createElement('div');d.className='jelly drawer';d.id='phantom';d.hidden=true;$('#mixer').after(d);DR.push('phantom');
  const card=(k,h,p,btn)=>`<div class="phc" data-k="${k}"><h4>${h}</h4><p class="vh">${p}</p><button class="vb" data-k="${k}">${btn}</button> <span class="vh phs" data-s="${k}"></span></div>`;
  d.innerHTML='<button class="pill dclose">close</button><h3>Phantoms</h3><p class="vh">Sounds the ear finishes for itself. Headphones bring them closest. Each runs until you stop it.</p>'
    +card('zwicker','The silence sings','In 1964 Eberhard Zwicker played rushing noise with a band cut out of it. When the noise stopped, his listeners heard a faint pure tone inside the missing band for several seconds, a tone with no source: the Zwicker tone, an afterimage in the ear. Here: twenty seconds of soft noise with that band cut out, the board hushes, then silence. Listen into it.','begin')
    +card('shepard','The endless descent','Roger Shepard built a scale in 1964 that seems to fall forever, and Jean-Claude Risset made it glide. Nine voices an octave apart sink together; each fades in at the top and out at the bottom, so the fall never arrives.','sink')
    +card('minster','The nave of York Minster','Everything on the board rings in the nave of York Minster, the great Gothic cathedral of the north of England. The University of York recorded it from the centre of the nave, with the sound sent from beneath the tower twenty-four metres away; its echo takes nearly eight seconds to die. The measured tones stay dry in Proof. Impulse response: www.openairlib.net, Audiolab, University of York, Damian T. Murphy.','enter the nave')
    +card('orbit','The circling breath','A soft breath travels around your head, placed by the way the outer ear shapes sound arriving from each direction. On headphones it passes behind you and returns.','let it circle');
  d.querySelector('.dclose').onclick=()=>{d.hidden=true};
  const b=document.createElement('button');b.className='pill';b.id='bPhantom';b.textContent='phantoms';$('.rside').insertBefore(b,$('#bMixer'));b.onclick=e=>{e.stopPropagation();openDr('phantom')};
  const st=(k,txt)=>{const e=d.querySelector(`[data-s=${k}]`);if(e)e.textContent=txt||''};
  const paint=()=>{d.querySelectorAll('button.vb[data-k]').forEach(x=>{const k=x.dataset.k,on=!!PH[k];x.classList.toggle('on',on);x.textContent=on?(k==='minster'?'leave the nave':'stop'):{zwicker:'begin',shepard:'sink',orbit:'let it circle',minster:'enter the nave'}[k]})};
  const fadeStop=(k,secs=1)=>{const p=PH[k];if(!p)return;delete PH[k];p.timers&&p.timers.forEach(clearTimeout);p.iv&&clearInterval(p.iv);if(p.end)p.end();
    const ctx=A.ctx,t=ctx.currentTime;p.out.gain.cancelScheduledValues(t);p.out.gain.setValueAtTime(p.out.gain.value,t);p.out.gain.linearRampToValueAtTime(0,t+secs);
    setTimeout(()=>{p.src.forEach(s=>{try{s.stop()}catch(_){}});try{p.out.disconnect()}catch(_){}},secs*1000+120);st(k,'');paint()};
  /* the silence sings: pink noise, the band 2.5 to 3.55 kHz cut out by steep filters on either side, then silence */
  const zwicker=()=>{const ctx=A.ctx,t=ctx.currentTime,src=loopN(ctx,NB.pink),out=gn(ctx,0);
    src.connect(bq(ctx,'lowpass',2500,.7)).connect(bq(ctx,'lowpass',2500,.7)).connect(bq(ctx,'lowpass',2500,.7)).connect(out);
    src.connect(bq(ctx,'highpass',3550,.7)).connect(bq(ctx,'highpass',3550,.7)).connect(bq(ctx,'highpass',3550,.7)).connect(bq(ctx,'lowpass',5800,.6)).connect(gn(ctx,.55)).connect(out);
    out.connect(A.out);const LV=.4,H=20;out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(LV,t+2.5);out.gain.setValueAtTime(LV,t+H);out.gain.linearRampToValueAtTime(0,t+H+1.2);
    const trim=A.limTrim.gain,keep=trim.value;trim.setTargetAtTime(0,t,.6);
    const p={src:[src],out,timers:[],end:()=>{trim.cancelScheduledValues(A.ctx.currentTime);trim.setTargetAtTime(keep,A.ctx.currentTime,1.2)}};PH.zwicker=p;
    let n=H;p.iv=setInterval(()=>{n--;if(n>0)st('zwicker','noise · '+n);else if(n>-12)st('zwicker','silence · listen');else fadeStop('zwicker',.2)},1000);st('zwicker','noise · '+H)};
  /* the endless descent: nine voices an octave apart, each weighted by a bell curve around 220 Hz, gliding down one octave every 40 s */
  const shepard=()=>{const ctx=A.ctx,out=gn(ctx,0),N=9,F0=27.5,src=[],V=[];out.connect(MB('riteBus'));
    for(let i=0;i<N;i++){const g=gn(ctx,0),pn=ctx.createStereoPanner();pn.pan.value=i%2?.28:-.28;g.connect(pn).connect(out);
      const o1=ctx.createOscillator(),o2=ctx.createOscillator();o2.detune.value=4;[o1,o2].forEach(o=>{o.connect(g);o.start();src.push(o)});V.push({k:i,o1,o2,g})}
    const w=f=>{const z=Math.log2(f/220)/1.1;return Math.exp(-z*z/2)};let last=performance.now();
    const step=()=>{const now=performance.now(),dt=Math.min(.2,(now-last)/1000);last=now;const t=ctx.currentTime;
      V.forEach(v=>{v.k-=dt/40;let jump=false;if(v.k<0){v.k+=N;jump=true}const f=F0*Math.pow(2,v.k);
        if(jump){v.o1.frequency.setValueAtTime(f,t);v.o2.frequency.setValueAtTime(f,t)}else{v.o1.frequency.setTargetAtTime(f,t,.03);v.o2.frequency.setTargetAtTime(f,t,.03)}
        v.g.gain.setTargetAtTime(w(f)*.056,t,.06)})};
    step();out.gain.setTargetAtTime(1,ctx.currentTime,.8);PH.shepard={src,out,iv:setInterval(step,40)};st('shepard','sinking · one octave every forty seconds')};
  /* the circling breath: soft band of pink noise placed by the HRTF panner, one lap every 14 s, rising and falling a little */
  const orbit=()=>{const ctx=A.ctx,src=loopN(ctx,NB.pink),sw=gn(ctx,.6),pn=ctx.createPanner(),out=gn(ctx,0);
    pn.panningModel='HRTF';pn.distanceModel='inverse';pn.refDistance=1;pn.rolloffFactor=.6;
    src.connect(bq(ctx,'bandpass',650,.9)).connect(bq(ctx,'lowpass',2400,.6)).connect(sw).connect(pn).connect(out);out.connect(MB('riteBus'));
    const lf=ctx.createOscillator(),lg=gn(ctx,.35);lf.frequency.value=.09;lf.connect(lg).connect(sw.gain);lf.start();
    let a=0,last=performance.now();const pos=(x,y,z)=>{const t=ctx.currentTime;if(pn.positionX){pn.positionX.setTargetAtTime(x,t,.05);pn.positionY.setTargetAtTime(y,t,.05);pn.positionZ.setTargetAtTime(z,t,.05)}else pn.setPosition(x,y,z)};
    const step=()=>{const now=performance.now(),dt=Math.min(.2,(now-last)/1000);last=now;a+=dt*Math.PI*2/14;pos(Math.sin(a)*1.6,Math.sin(a*.5)*.35,-Math.cos(a)*1.6)};
    step();out.gain.setTargetAtTime(1.4,ctx.currentTime,.8);PH.orbit={src:[src,lf],out,iv:setInterval(step,40)};st('orbit','circling · one lap every fourteen seconds')};
  /* the nave of York Minster: a send from the whole board into the measured nave, returned before the ceiling */
  let IRB=null,IRP=null;const loadIR=()=>IRP||(IRP=audioFetch('audio/york-minster.wav').then(r=>r.arrayBuffer()).then(a=>A.ctx.decodeAudioData(a)).then(b=>IRB=b));
  const minster=()=>{const ctx=A.ctx,wet=gn(ctx,0),cv=ctx.createConvolver(),p={src:[],out:wet,end:()=>{try{A.master.disconnect(cv)}catch(_){}}};PH.minster=p;st('minster','opening the doors');
    loadIR().then(buf=>{if(PH.minster!==p)return;cv.buffer=buf;A.master.connect(cv);cv.connect(wet).connect(A.limTrim);wet.gain.setTargetAtTime(MINSTER_WET,ctx.currentTime,1.2);st('minster','the board rings in the nave')})
      .catch(()=>{if(PH.minster===p){delete PH.minster;paint()}st('minster','the nave would not open on this device')})};
  const MINSTER_WET=.15;
  const RUN={zwicker,shepard,orbit,minster},NAME={zwicker:'the silence sings',shepard:'endless descent',orbit:'circling breath',minster:'york minster'};
  d.addEventListener('click',e=>{const x=e.target.closest('button.vb[data-k]');if(!x)return;e.stopPropagation();const k=x.dataset.k;
    if(PH[k]){fadeStop(k);say(NAME[k]+' · off');return}if(!A.ctx)return say('enter first, then call the phantoms');RUN[k]();paint();say(NAME[k])});
  /* each running phantom shows in "sounding now" with its own off switch */
  /* silence and reset stop them too */
  const hushAll=()=>Object.keys(NAME).forEach(k=>{if(PH[k])fadeStop(k,.6)});const baseReset=resetAll;resetAll=function(){hushAll();return baseReset.apply(this,arguments)};
  const baseLive=liveList;liveList=function(){const L=baseLive();Object.keys(NAME).forEach(k=>{if(PH[k])L.push([NAME[k],()=>fadeStop(k)])});return L}}

/* ================= THE TRANSMUTATION DECK: the clip run through the machines of the image underground =================
   A separate deck over the glass. It reads the playing clip as it is and passes it through thirteen image machines,
   from the 1816 kaleidoscope's heirs to datamoshing. The vision dials steer every machine: effect and warp are each
   machine's own two handles; speed, twist, mirrors, colour, exposure, trails, split and grain work on all of them. */
{const c=$('#trans'),bar=$('#transBar'),nm=$('#transName'),v=$('#veil');
  const gl=c.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:false});
  /* name, what it is, what effect does, what warp does */
  const M=[['rutt-etra','The Rutt/Etra scan processor, 1972: the picture tube’s beam bent by brightness, so every scan line becomes a ridge of light.','ridge height','line count'],
    ['magnet','Nam June Paik and Shuya Abe, 1970: magnets on the picture tube bend the raster; a colorizer paints each grey a new hue.','pull of the magnet','ripple'],
    ['corridor','Video feedback, as Steina and Woody Vasulka worked it: the camera turned on its own monitor, each frame falling into the last.','depth of the fall','what light gets in'],
    ['droste','The Droste spiral after Escher’s Print Gallery, 1956: the picture curls into itself and repeats inward forever.','tightness of the coil','arms'],
    ['liquid light','The Joshua Light Show, Fillmore East, 1967: oil, water and dye pressed between clock glasses on an overhead projector.','oil colour','how far it flows'],
    ['datamosh','Takeshi Murata’s Monster Movie, 2005: compressed video with its key frames removed, so motion drags old pixels like wet paint.','drag','drift'],
    ['crystal','The multi-image prism: faceted glass screwed onto the lens, every facet holding its own bent copy of the scene.','bend of each facet','facet count'],
    ['solar','The Sabattier effect, 1862, the solarisation Man Ray and Lee Miller made famous in 1929: tones fold back on themselves and edges burn.','folds','colour'],
    ['lapis','James Whitney’s Lapis, 1966: a mandala turned on an analog computer built from an anti-aircraft gun director.','turn','reach'],
    ['backlit','The backlit animation of Tron, 1982: only the edges of things, burning as lines of light on black.','glow','how much picture stays'],
    ['pas de deux','Norman McLaren’s Pas de deux, 1968: each movement printed again and again, so a dancer trails her own ghosts.','ghosts','colour of the ghosts'],
    ['ink','Suminagashi, ink floated on water, Japan, twelfth century: the picture is dropped on a slow current and carried off in curls.','current','what is dropped in'],
    ['pixel sort','Kim Asendorf’s pixel sorting, 2010: bright runs of the image pulled into long falling streaks.','length','threshold'],
    ['blood','Liquid blood poured over the picture: thick, dark and glossy, catching the light as it runs down.','how much blood','how fast it runs'],
    ['mercury','Quicksilver: the picture seen in a pool of liquid metal that ripples and shines.','depth of the ripples','size of the ripples'],
    ['thermal','A thermal camera: the scene as heat, from black through red and orange to white-hot.','heat','shimmer']];
  const FEED=[2,5,10,11];
  let on=false,mode=0,P=null,CP=null,U={},tex=null,fb=[],cur=0,T=0,last=0,lvl=0,an=null;
  const b=document.createElement('button');b.className='pill';b.id='bTrans';b.textContent='transmute';b.title='Open the Transmutation deck: the clip through sixteen image machines, steered by the vision dials';($('#bOwn')||$('#bFilm')).after(b);
  bar.querySelector('.tmodes').innerHTML=M.map(([k],i)=>`<button data-i="${i}">${k}</button>`).join('');
  const VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS=`precision highp float;uniform sampler2D uV,uP;uniform vec2 uRes,uVR;uniform float uT,uL,uK,uW,uTw,uMi,uHue,uEx,uTr,uPk;uniform int uM;
#define PI 3.14159265
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 h2(vec2 p){return vec2(h1(p),h1(p+17.31));}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+1.),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*ns(p);p=p*2.03+7.1;a*=.5;}return s;}
vec2 cov(vec2 uv){float sa=uRes.x/uRes.y,va=uVR.x/max(uVR.y,1.);vec2 q=uv-.5;if(sa>va)q.y*=va/sa;else q.x*=sa/va;return vec2(q.x+.5,.5-q.y);}
vec3 vid(vec2 uv){return texture2D(uV,cov(uv)).rgb;}
vec3 vidW(vec2 uv){uv=abs(fract(uv*.5+.5)*2.-1.);return vid(uv);}
vec3 pal(float x){return .5+.5*cos(6.2831*(x+vec3(0.,.33,.67)));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float edge(vec2 uv,float w){vec2 px=w/uRes;float a=lum(vid(uv+vec2(px.x,0.))),b2=lum(vid(uv-vec2(px.x,0.))),c2=lum(vid(uv+vec2(0.,px.y))),d=lum(vid(uv-vec2(0.,px.y)));return length(vec2(a-b2,c2-d));}
void main(){vec2 fc0=gl_FragCoord.xy,uv0=fc0/uRes;float mn=min(uRes.x,uRes.y);vec2 p=(fc0-.5*uRes)/mn;float t=uT;vec3 col=vec3(0.);
  /* twist and mirrors fold the plane before any machine sees it */
  p=rot(uTw*3.2*(.55-length(p)))*p;
  if(uMi>.02){float n=2.+floor(uMi*10.),sg=PI/n,a=atan(p.y,p.x);a=abs(mod(a+t*.03,2.*sg)-sg);p=length(p)*vec2(cos(a),sin(a));}
  vec2 uv=p*mn/uRes+.5,fc=uv*uRes;float K=uK,W=uW,L=uL+uPk*.5;
  if(uM==0){float Ln=max(uRes.y/(55.+W*110.),3.),A=min(uRes.y*.1*(.25+K*1.7)*(1.+L*.6),Ln*40.);float y=fc.y,k0=floor((y-A*1.1)/Ln);vec3 tint=vec3(0.);
    for(int i=0;i<46;i++){float k=k0+float(i);float yb=k*Ln;if(yb>y+Ln)break;vec2 su=vec2(uv.x,yb/uRes.y);vec3 cc=vid(su);float hh=lum(cc);
      float yd=yb+hh*A;float d=abs(y-yd);float g=exp(-d*d/1.6)+.25*exp(-d*d/18.);tint+=g*mix(vec3(.55,1.,.85),cc*1.6+.15,.55);}
    col=tint*.85;col+=vec3(.02,.04,.05)*smoothstep(1.,0.,length(p));}
  else if(uM==1){vec2 q=p;float r=length(q-vec2(.18*sin(t*.21),.12*cos(t*.17)));float tw=(.1+K*.7+L*1.2)/(r+.35);q=rot(tw*.6*sin(t*.3))*q;
    q.x+=sin(q.y*7.+t*1.3)*(.008+W*.07+L*.07);q.y+=sin(q.x*5.-t*.9)*(.006+W*.04);vec2 su=q*mn/uRes+.5;float g=lum(vidW(su));
    col=pal(g*1.6+t*.03)*(.25+g*1.1);col*=.85+.15*sin(fc0.y*PI*.5);}
  else if(uM==2){vec2 q=rot(.004+uTw*.05+L*.02)*((uv0-.5)*(.992-K*.05-L*.02))+.5;vec3 pr=texture2D(uP,q).rgb;pr=mix(pr,pr.gbr,.035);
    vec3 cv=vid(uv);float key=smoothstep(.12+W*.4,.34+W*.4,lum(cv));col=max(cv*key,pr*(.9+uTr*.095));col=mix(col,cv,.04);}
  else if(uM==3){float r=max(length(p),1e-4),a=atan(p.y,p.x);float r1=.34-K*.26,r2=1.,sc=log(r2/r1),arms=1.+floor(W*3.99),an=atan(sc*arms/(2.*PI));vec2 lz=vec2(log(r),a);
    lz=rot(an)*lz*cos(an);lz.x=mod(lz.x-t*.18,sc)+log(r1);vec2 q=exp(lz.x)*vec2(cos(lz.y),sin(lz.y));col=vid(q*.5+.5);col*=.9+.1*cos(lz.y*6.);}
  else if(uM==4){vec2 q=p*1.4;float tt=t*.15;vec2 w=vec2(fbm(q+vec2(tt,-tt)),fbm(q+vec2(5.2-tt,1.3+tt)));
    vec2 w2=vec2(fbm(q+3.*w+vec2(1.7,9.2)+tt),fbm(q+3.*w+vec2(8.3,2.8)-tt));vec2 su=uv+(w2-.5)*(.06+W*.5)*(1.+L);
    vec3 cc=vidW(su);float f=fbm(q*2.+4.*w2);vec3 oil=pal(f*1.5+lum(cc)*.6+t*.02);col=mix(cc,cc*oil*2.3,.2+K*.75);col+=oil*pow(f,3.)*.3*K;}
  else if(uM==5){vec2 px=1./uRes;vec3 cc=vid(uv);vec2 g=vec2(lum(vid(uv+vec2(px.x*5.,0.)))-lum(vid(uv-vec2(px.x*5.,0.))),lum(vid(uv+vec2(0.,px.y*5.)))-lum(vid(uv-vec2(0.,px.y*5.))));
    vec2 flow=g*px*(10.+K*60.)*(1.+L*2.)+(vec2(ns(uv*5.+t*.2),ns(uv*5.-t*.2+7.))-.5)*px*(1.+W*16.);
    vec3 pr=texture2D(uP,uv0-flow).rgb;vec2 blk=floor(uv0*uRes/vec2(48.,48.));float fresh=step(.955+uTr*.04,h1(blk+floor(t*2.)));
    col=mix(pr,cc,max(fresh,.012+(1.-uTr)*.05));}
  else if(uM==6){vec2 q=p*(2.5+W*9.);vec2 i=floor(q),f=fract(q);float md=8.,md2=8.;vec2 mr=vec2(0.),mo=vec2(0.);
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 gg=vec2(float(x),float(y));vec2 o=h2(i+gg);o=.5+.4*sin(t*.4+6.2831*o);vec2 r=gg+o-f;float d=dot(r,r);if(d<md){md2=md;md=d;mr=r;mo=i+gg;}else if(d<md2)md2=d;}
    vec2 fa=h2(mo)-.5;float ang=(h1(mo+3.)-.5)*3.*K;vec2 su=uv+fa*(.03+K*.3)+rot(ang)*mr*.07;vec2 dsp=fa*(.006+K*.02);
    col=vec3(vidW(su+dsp).r,vidW(su).g,vidW(su-dsp).b);col*=.8+.45*h1(mo+9.);col+=vec3(1.)*smoothstep(.06,0.,sqrt(md2)-sqrt(md))*.18;}
  else if(uM==7){vec3 cc=vid(uv);float l=lum(cc),f=abs(fract(l*(1.+K*3.5)+t*.03)*2.-1.);col=mix(vec3(f),pal(f*.7+W+l*.3),.25+W*.75)*(.18+f*1.05);
    col=mix(col,col*cc*2.2,.35);col+=vec3(1.,.95,.9)*edge(uv,1.6)*(1.5+L*3.);}
  else if(uM==8){vec2 q=p*1.25;for(int i=0;i<5;i++){q=abs(q)-vec2(.3+W*.35+.06*sin(t*.11),.22+W*.2);q=rot(.35+K*1.5+t*.04)*q*1.17;}
    col=vidW(q*.5+.5)*1.15;col*=smoothstep(1.3,.2,length(p))*.6+.5;}
  else if(uM==9){vec3 cc=vid(uv);float e=edge(uv,1.4)+.6*edge(uv,3.5);float l=lum(cc);
    col=pal(l*.7+t*.04+.55)*smoothstep(.03,.22,e)*(1.2+K*4.+L*3.);col+=cc*(.02+W*.5);col=max(col,texture2D(uP,uv0).rgb*(.55+K*.3));}
  else if(uM==10){vec2 dr=vec2(cos(t*.3),sin(t*.23))*(.4+K*2.5)/uRes;vec3 pr=texture2D(uP,uv0+dr).rgb;pr=mix(pr,pr.gbr,.02+W*.14);
    vec3 cc=vid(uv);col=max(cc*(.5+.4*smoothstep(.15,.6,lum(cc))),pr*(.9+K*.05+uTr*.04));}
  else if(uM==11){vec2 q=p*2.;float e=.02,tt=t*.05;float n1=fbm(q+vec2(0.,e)+tt),n2=fbm(q-vec2(0.,e)+tt),n3=fbm(q+vec2(e,0.)+tt),n4=fbm(q-vec2(e,0.)+tt);
    vec2 curl=vec2(n1-n2,n4-n3)/(2.*e);vec3 pr=texture2D(uP,uv0-curl*(.0012+K*.007)*(1.+L*2.)).rgb;vec3 cc=vid(uv);
    float key=smoothstep(.25+W*.4,.6+W*.4,lum(cc));col=mix(pr*(.986+uTr*.012),cc,key*.16+.008);}
  else if(uM==13){vec2 q=p*(1.5+W*1.1);float tt=t*(.05+W*.14);vec2 fl=vec2(0.,tt*3.);
    vec2 w=vec2(fbm(q+vec2(0.,tt*2.)),fbm(q+vec2(4.3,1.7-tt*1.4)));float h=fbm(q*1.3+2.2*w+fl);float e=.012;
    float hx=fbm((q+vec2(e,0.))*1.3+2.2*w+fl)-h,hy=fbm((q+vec2(0.,e))*1.3+2.2*w+fl)-h;vec3 n=normalize(vec3(-hx/e*.2,-hy/e*.2,1.));
    vec3 cc=vid(uv+n.xy*(.02+K*.05));float l=lum(cc);float cover=smoothstep(.66-K*.6,.8-K*.45,h+l*.22+L*.15);
    vec3 bl=mix(vec3(.16,0.,.008),vec3(.6,.015,.04),pow(l,.8))*(.65+.7*h);vec3 Ld=normalize(vec3(-.4,.55,.8));
    float sp=pow(max(dot(reflect(-Ld,n),vec3(0.,0.,1.)),0.),56.);float rim=pow(1.-n.z,2.)*.7;
    vec3 liquid=bl+vec3(1.,.8,.8)*sp*1.4+vec3(.45,.01,.03)*rim;vec3 pr=texture2D(uP,uv0+vec2(0.,(.0006+W*.0035)*(1.+h))).rgb;
    col=mix(cc*.5,liquid,cover);col=mix(col,max(col,pr*vec3(.985,.86,.86)),cover*(.35+uTr*.5));}
  else if(uM==14){vec2 q=p*(2.+W*3.);float tt=t*.25;vec2 o=vec2(tt,-tt*.7);float h=fbm(q+o)*.6+.4*fbm(q*2.3-vec2(tt*.6,tt));float e=.01;
    float hx=(fbm(q+vec2(e,0.)+o)-fbm(q-vec2(e,0.)+o))/(2.*e),hy=(fbm(q+vec2(0.,e)+o)-fbm(q-vec2(0.,e)+o))/(2.*e);
    vec3 n=normalize(vec3(-hx*(.25+K*.9),-hy*(.25+K*.9),1.));vec3 r=reflect(vec3(0.,0.,-1.),n);vec3 env=vidW(uv+r.xy*(.15+K*.35)+L*.02);
    float l=lum(env);vec3 chrome=vec3(pow(l,1.4))*vec3(.92,.95,1.)*1.25;float sp=pow(max(dot(n,normalize(vec3(.3,.5,.8))),0.),60.);
    col=mix(chrome,env*1.1,.18)+sp*.9;col*=.75+.35*h;}
  else if(uM==15){vec3 cc=vid(uv);float l=lum(cc);float b=0.;vec2 px=3./uRes;
    for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++)b+=lum(vid(uv+vec2(float(i),float(j))*px));b/=25.;
    float x=clamp(mix(l,b,.5)*(1.+K*1.2)+L*.25+(fbm(p*3.+t*.1)-.5)*W*.35,0.,1.);
    vec3 iron=clamp(vec3(1.6*x-.1,2.*x*x-.2,pow(x,4.)*1.6+(x<.35?(.35-x)*1.6:0.)),0.,1.);col=iron*(.92+.08*sin(fc0.y*.6));}
  else{float th=.3+W*.45;vec3 cc=vid(uv);col=cc;float stp=(1.5+K*7.)/uRes.y;vec2 su=uv;vec3 s=cc;float run=0.;
    if(lum(cc)>th*.6){for(int i=0;i<30;i++){su.y+=stp;vec3 x=vid(su);if(lum(x)<th)break;s=x;run+=1.;}col=mix(cc,s*(1.+run*.012),.92);}}
  /* trails for the machines that do not already live on their own past */
  if(uM!=2&&uM!=5&&uM!=10&&uM!=11&&uM!=9&&uM!=13)col=max(col,texture2D(uP,uv0).rgb*uTr*.9);
  gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;
  /* the last glass: the split dial fringes colour toward the edges, the grain dial dusts it, the corners fall dark */
  const CF='precision mediump float;uniform sampler2D uP;uniform vec2 uRes;uniform float uSp,uGr,uT,uHue,uEx;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 d=(uv-.5)*(.001+uSp*.014);vec3 c=vec3(texture2D(uP,uv+d).r,texture2D(uP,uv).g,texture2D(uP,uv-d).b);vec2 p=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);if(uHue>.004){float a=uHue*6.2831;vec3 k=vec3(.57735);c=c*cos(a)+cross(k,c)*sin(a)+k*dot(k,c)*(1.-cos(a));}c*=.5+uEx*1.2;c*=smoothstep(1.3,.4,length(p*vec2(.9,1.1)));c+=(h(gl_FragCoord.xy+uT)-.5)*.09*uGr;gl_FragColor=vec4(c,1.);}';
  const prog=(fs)=>{const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.bindAttribLocation(pr,0,'p');gl.linkProgram(pr);return pr};
  const mkFB=(w,h)=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
    const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindFramebuffer(gl.FRAMEBUFFER,null);return{t,f,w,h}};
  if(gl){P=prog(FS);CP=prog(CF);const q=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,q);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    ['uV','uP','uRes','uVR','uT','uL','uM','uK','uW','uTw','uMi','uHue','uEx','uTr','uPk'].forEach(n=>U[n]=gl.getUniformLocation(P,n));U.cP=gl.getUniformLocation(CP,'uP');U.cR=gl.getUniformLocation(CP,'uRes');U.cS=gl.getUniformLocation(CP,'uSp');U.cG=gl.getUniformLocation(CP,'uGr');U.cT=gl.getUniformLocation(CP,'uT');U.cH=gl.getUniformLocation(CP,'uHue');U.cE=gl.getUniformLocation(CP,'uEx');
    tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]))}
  const size=()=>{const dp=Math.min(devicePixelRatio||1,MOBILE?1:1.5),w=Math.round(innerWidth*dp),h=Math.round(innerHeight*dp);if(c.width===w&&c.height===h&&fb.length)return;c.width=w;c.height=h;fb=[mkFB(w,h),mkFB(w,h)]};
  const lb=new Float32Array(1024);
  const level=()=>{if(!A.ctx)return 0;if(!an){an=A.ctx.createAnalyser();an.fftSize=1024;A.master.connect(an)}an.getFloatTimeDomainData(lb);let s=0;for(let i=0;i<1024;i+=2)s+=lb[i]*lb[i];return Math.min(1,Math.sqrt(s/512)*5)};
  const draw=now=>{if(!gl)return;size();const dt=Math.min(.1,(now-(last||now))/1000);last=now;if(!window.FREEZE)T+=dt*(.25+(S.speed||0)*2.2);lvl+=(level()-lvl)*.08;
    gl.bindTexture(gl.TEXTURE_2D,tex);if(v.readyState>=2){try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,v)}catch(_){}}
    const prev=fb[cur],next=fb[1-cur];gl.bindFramebuffer(gl.FRAMEBUFFER,next.f);gl.viewport(0,0,next.w,next.h);gl.useProgram(P);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(U.uV,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,prev.t);gl.uniform1i(U.uP,1);
    gl.uniform2f(U.uRes,next.w,next.h);gl.uniform2f(U.uVR,v.videoWidth||16,v.videoHeight||9);gl.uniform1f(U.uT,T);gl.uniform1f(U.uL,lvl);gl.uniform1i(U.uM,mode);
    gl.uniform1f(U.uK,S.vision);gl.uniform1f(U.uW,S.warp);gl.uniform1f(U.uTw,S.twist+(window.REVV||0)*.6);gl.uniform1f(U.uMi,S.mirrors);gl.uniform1f(U.uTr,S.trails);gl.uniform1f(U.uPk,Math.min(1,typeof pluck==='number'?pluck:0));
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,c.width,c.height);gl.useProgram(CP);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,next.t);gl.uniform1i(U.cP,0);gl.uniform2f(U.cR,c.width,c.height);
    gl.uniform1f(U.cS,S.split);gl.uniform1f(U.cG,S.grain);gl.uniform1f(U.cT,T);gl.uniform1f(U.cH,S.hue);gl.uniform1f(U.cE,S.veil);gl.drawArrays(gl.TRIANGLES,0,3);cur=1-cur};
  const frame=now=>{if(!on)return;requestAnimationFrame(frame);draw(now)};
  const label=i=>{nm.innerHTML='';const a=document.createElement('span');a.textContent=M[i][1];const d=document.createElement('em');d.textContent=`effect: ${M[i][2]} · warp: ${M[i][3]} · the other vision dials work on every machine`;nm.append(a,d)};
  const pick=i=>{mode=i;bar.querySelectorAll('.tmodes button').forEach((x,j)=>x.classList.toggle('on',j===i));label(i);fb.forEach(f=>{gl.bindFramebuffer(gl.FRAMEBUFFER,f.f);gl.clear(gl.COLOR_BUFFER_BIT)});gl.bindFramebuffer(gl.FRAMEBUFFER,null)};
  const set=x=>{if(x&&!gl)return say('this device cannot run the deck');on=x;c.hidden=bar.hidden=!x;b.classList.toggle('on',x);
    if(x){size();pick(mode);last=0;v.play&&v.play().catch(()=>{});requestAnimationFrame(frame);say('transmutation · '+M[mode][0]+' · turn the vision dials')}else say('transmutation deck closed')};
  b.onclick=e=>{e.stopPropagation();set(!on)};bar.querySelector('.tclose').onclick=()=>set(false);
  bar.querySelector('.tmodes').onclick=e=>{const x=e.target.closest('button');if(!x)return;pick(+x.dataset.i);say('transmutation · '+M[mode][0])};
  window.TRANS={set,pick,draw,get on(){return on},names:M.map(m=>m[0]),feed:FEED}}

/* ================= THE DREAMACHINE: flicker watched through closed eyes =================
   After Brion Gysin and Ian Sommerville's Dreamachine and the Ganzflicker studies. The whole screen swells and
   falls as a soft sine at an exact rate; a faint layer of the clip lies under it to seed what appears.
   A plain seizure notice comes first and must be accepted. Any tap or key ends it, and it ends itself on its timer. */
{const R=$('#dream'),cv=$('#dreamC'),x=cv.getContext('2d'),gate=$('#dreamGate'),v=$('#veil');
  /* no saturated red: red flicker is the kind most likely to provoke a seizure. Deep amber stands in for it */
  const COL={gold:[255,176,72],white:[255,246,232],amber:[255,128,44]};
  const D={hz:10,depth:.45,col:'gold',seed:true,noise:true,min:10,lock:false,mult:1,phase:0};let run=null,nz=null;
  /* the beat lock: the flicker can follow the beat tone itself, at ½, 1, 2, 3 or 4 times its rate, with a phase dial for
     where the flash falls. The beat is heard, not assumed: in binaural mode the two ears drift into and out of step, and
     that in-step moment is the peak; in monaural and isochronic modes the peak is the loudness swell. Both are measured
     on the tone channel and followed by a slow phase-locked loop, so a journey that glides the beat carries the light with it. */
  const MULTS=[.5,1,2,3,4],TB=new Float32Array(2048),TC=new Float32Array(2048),TRK={zr:0,zi:0,m:0,amp:0,n:0};
  const track=()=>{const t=sigilTap();if(!t||!A.ctx||!(S.beat>0))return;t.l.getFloatTimeDomainData(TB);t.r.getFloatTimeDomainData(TC);let sig;
    if(S.mode==='binaural'){let lr=0,ll=0,rr=0;for(let i=0;i<2048;i++){lr+=TB[i]*TC[i];ll+=TB[i]*TB[i];rr+=TC[i]*TC[i]}if(ll<1e-6||rr<1e-6)return;sig=lr/Math.sqrt(ll*rr)}
    else{let q=0;for(let i=0;i<2048;i++)q+=TB[i]*TB[i];if(q<1e-6)return;sig=Math.sqrt(q/2048)}
    TRK.m+=(sig-TRK.m)*(TRK.n++<30?.2:.004);const b=sig-TRK.m,tm=A.ctx.currentTime-1024/A.ctx.sampleRate,a=2*Math.PI*S.beat*tm,d=.993;
    TRK.zr=TRK.zr*d+b*Math.cos(a);TRK.zi=TRK.zi*d+b*Math.sin(a);TRK.amp=TRK.amp*d+Math.abs(b)};
  window.__dmTrack=TRK;
  /* the rate the light runs at: free, or the beat times the chosen multiple, never above 14 Hz */
  const rate=()=>{if(!D.lock)return{hz:D.hz,m:0};const f=S.beat||0;let m=D.mult;if(f*m>14){const ok=MULTS.filter(k=>f*k<=14);m=ok.length?ok[ok.length-1]:0}return{hz:f*m,m}};
  const b=document.createElement('button');b.className='pill';b.id='bDream';b.textContent='dreamachine';b.title='The Dreamachine: soft flicker for closed eyes, after Brion Gysin';$('#bTrans').after(b);
  /* the lock rows, added under the rate row */
  {const r0=gate.querySelector('#dmHz').closest('.dmRow'),box=document.createElement('div');
    box.innerHTML='<div class="dmRow"><span>follow</span><button id="dmFree">its own rate</button><button id="dmLock">the beat</button></div>'
      +'<div class="dmRow" id="dmMultRow"><span>times</span>'+MULTS.map(k=>`<button data-mult="${k}">${k===.5?'½':k}×</button>`).join('')+'</div>'
      +'<div class="dmRow" id="dmPhRow"><span>phase</span><input id="dmPhase" type="range" min="0" max="360" step="5" value="0" aria-label="flicker phase against the beat"><b style="min-width:64px"><i id="dmPhV">0</i>°</b></div>'
      +'<p class="vh" id="dmLockNote" style="margin:2px 0 6px"></p>';
    r0.after(...box.children)}
  const paint=()=>{const R0=rate(),f=S.beat||0;gate.querySelector('#dmHz').textContent=(D.lock?R0.hz:D.hz).toFixed(2);
    gate.querySelector('#dmFree').classList.toggle('on',!D.lock);gate.querySelector('#dmLock').classList.toggle('on',D.lock);
    gate.querySelectorAll('[data-mult]').forEach(e=>{e.classList.toggle('on',D.lock&&+e.dataset.mult===D.mult);e.disabled=f*+e.dataset.mult>14;e.style.opacity=e.disabled?.3:''});
    gate.querySelector('#dmMultRow').style.opacity=gate.querySelector('#dmPhRow').style.opacity=D.lock?1:.4;
    gate.querySelectorAll('[data-hz]').forEach(e=>e.disabled=D.lock);gate.querySelector('#dmPhV').textContent=D.phase;
    gate.querySelector('#dmLockNote').textContent=D.lock?(R0.m?`The beat is ${f.toFixed(2)} Hz, so the light runs at ${R0.hz.toFixed(2)} Hz. At 0° the flash meets the peak of the beat; at 180°, the hollow between.`:'Choose a beat tone first: the light has nothing to follow.'):'';gate.querySelector('#dmDepth').value=D.depth;
    gate.querySelectorAll('[data-col]').forEach(e=>e.classList.toggle('on',e.dataset.col===D.col));gate.querySelectorAll('[data-min]').forEach(e=>e.classList.toggle('on',+e.dataset.min===D.min));
    gate.querySelector('#dmSeed').classList.toggle('on',D.seed);gate.querySelector('#dmNoise').classList.toggle('on',D.noise)};
  const open=()=>{R.hidden=false;gate.hidden=false;cv.hidden=true;paint()};
  const sizeC=()=>{const dp=MOBILE?1:Math.min(devicePixelRatio||1,1.25);cv.width=Math.round(innerWidth*dp);cv.height=Math.round(innerHeight*dp)};
  /* brown noise in the ears, as in the 2024 Ganzflicker protocol; through the rites fader, off with its switch */
  const noiseOn=()=>{if(!A.ctx||nz)return;const s=loopN(A.ctx,NB.brown),g=gn(A.ctx,0);s.connect(bq(A.ctx,'lowpass',900,.5)).connect(g).connect(MB('riteBus'));g.gain.setTargetAtTime(.42,A.ctx.currentTime,2);nz={s,g}};
  const noiseOff=()=>{if(!nz)return;const n=nz;nz=null;n.g.gain.setTargetAtTime(0,A.ctx.currentTime,.8);setTimeout(()=>{try{n.s.stop()}catch(_){}},3500)};
  const stop=why=>{if(!run)return;run.end=performance.now();run.why=why;noiseOff()};
  const draw=now=>{if(!run)return;requestAnimationFrame(draw);const W=cv.width,H=cv.height,el=(now-run.t0)/1000,dur=D.min*60;
    let env=Math.min(1,el/6);if(run.end)env*=Math.max(0,1-(now-run.end)/2500);else if(el>dur-6)env*=Math.max(0,(dur-el)/6);
    if(el>=dur&&!run.end)stop('the time is done');if(run.end&&now-run.end>2600){const w=run.why;run=null;R.hidden=true;document.removeEventListener('keydown',key,true);say('dreamachine · '+w);return}
    x.fillStyle='#000';x.fillRect(0,0,W,H);
    if(D.seed&&v.readyState>=2&&v.videoWidth){const s=Math.max(W/v.videoWidth,H/v.videoHeight),w=v.videoWidth*s,h=v.videoHeight*s;x.globalAlpha=.16*env;x.drawImage(v,(W-w)/2,(H-h)/2,w,h);x.globalAlpha=1}
    /* the flicker: a sine, never a hard on/off, its phase taken from the clock so the rate stays exact */
    let ph;const R0=rate();
    if(D.lock&&R0.m&&A.ctx){track();const th=A.ctx.currentTime-(A.ctx.outputLatency||A.ctx.baseLatency||0),theta=Math.atan2(TRK.zi,TRK.zr);
      ph=Math.cos(R0.m*(2*Math.PI*S.beat*th-theta)-D.phase*Math.PI/180)}
    else ph=Math.sin(2*Math.PI*(D.lock?(R0.hz||D.hz):D.hz)*(now-run.t0)/1000);
    const lv=D.depth*env*(.5+.5*ph),c=COL[D.col];
    x.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${lv.toFixed(3)})`;x.fillRect(0,0,W,H)};
  const key=e=>{if(run&&!run.end){e.preventDefault();e.stopPropagation();stop('ended')}};
  const begin=()=>{gate.hidden=true;cv.hidden=false;sizeC();run={t0:performance.now(),end:0};Object.assign(TRK,{zr:0,zi:0,m:0,amp:0,n:0});if(D.noise)noiseOn();document.addEventListener('keydown',key,true);requestAnimationFrame(draw);
    const R0=rate();say(`dreamachine · ${(D.lock?R0.hz:D.hz).toFixed(2)} hz${D.lock&&R0.m?' · locked to the beat':''} · close your eyes`)};
  b.onclick=e=>{e.stopPropagation();open()};
  cv.addEventListener('pointerdown',()=>{if(run&&!run.end)stop('ended')});
  gate.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.col){D.col=t.dataset.col}else if(t.dataset.min){D.min=+t.dataset.min}else if(t.dataset.hz){D.hz=clamp(+(D.hz+ +t.dataset.hz).toFixed(2),4,14)}
    else if(t.dataset.mult){D.mult=+t.dataset.mult;D.lock=true}else if(t.id==='dmFree')D.lock=false;else if(t.id==='dmLock')D.lock=true;
    else if(t.id==='dmSeed')D.seed=!D.seed;else if(t.id==='dmNoise')D.noise=!D.noise;else if(t.id==='dmLeave'){R.hidden=true;return}else if(t.id==='dmEnter'){begin();return}paint()});
  gate.querySelector('#dmDepth').addEventListener('input',e=>{D.depth=+e.target.value});
  gate.querySelector('#dmPhase').addEventListener('input',e=>{D.phase=+e.target.value;paint()});
  addEventListener('resize',()=>{if(run)sizeC()})}

/* ================= LOOPS: the grooves made for Varanus Salvation =================
   Each track plays whole, as made, and repeats from the top; a short fade at either end keeps the wrap from clicking.
   One plays at a time; a new one crossfades in. Haze closes a soft filter, squeezes the drum hits and sends the
   groove into a dark echo, so the beat can be anything from present to far away. Off until chosen; never on the tone channel. */
{const LP=[['dreamscape','Dreamscape',154.093,0.1804,114.8,'m4a'],['aura-1','Aura I',167.795,0.1802,192.0,'m4a'],['aura-2','Aura II',154.901,0.1757,176.4,'m4a'],['dub-1','Dub I',171.429,0.1985,140.0,'m4a'],['dub-2','Dub II',170.175,0.1971,156.1,'m4a'],
    ['garden-1','Garden I',138.553,0.1917,163.3,'m4a'],['garden-2','Garden II',165.624,0.1839,183.9,'m4a'],['liquid-1','Liquid I',139.206,0.1815,208.7,'m4a'],['liquid-2','Liquid II',115.995,0.1847,214.1,'m4a'],['nebula-1','Nebula I',86.079,0.1789,139.4,'m4a'],
    ['nebula-2','Nebula II',157.506,0.1713,143.0,'m4a'],['pulse-1','Pulse I',116.346,0.1611,165.7,'m4a'],['pulse-2','Pulse II',136.776,0.1698,176.2,'m4a'],['temple','Temple',138.678,0.1768,196.5,'m4a'],['velvet-1','Velvet I',162.609,0.1998,166.0,'m4a'],['velvet-2','Velvet II',165.019,0.2027,155.9,'m4a']];
  /* both sets are mastered from the Suno WAVs to −14 LUFS with a −1 dBTP ceiling and a 25 Hz high-pass, AAC 256 kbps; the second set was made for Black Dragon itself */
  const LP2=[['crypt-1','Crypt I',132.004,0.1843,214.8,'m4a'],['crypt-2','Crypt II',130.59,0.1879,237.2,'m4a'],['syrup-1','Syrup I',130.991,0.1978,148.9,'m4a'],['syrup-2','Syrup II',149.795,0.1952,138.0,'m4a'],['noir-1','Noir I',93.453,0.1715,180.0,'m4a'],['noir-2','Noir II',163.788,0.1765,192.0,'m4a'],
    ['infernum-1','Infernum I',156.352,0.2053,149.2,'m4a'],['infernum-2','Infernum II',169.536,0.2004,116.8,'m4a'],['oni-1','Oni I',69.996,0.176,126.9,'m4a'],['oni-2','Oni II',93.784,0.174,124.1,'m4a'],['jade-1','Jade I',139.307,0.1966,197.2,'m4a'],['jade-2','Jade II',160.334,0.196,198.1,'m4a'],
    ['astra-1','Astra I',169.014,0.1829,105.3,'m4a'],['astra-2','Astra II',167.247,0.1844,133.6,'m4a'],['serpent-1','Serpent I',110.871,0.1832,39.0,'m4a'],['serpent-2','Serpent II',133.31,0.1611,50.6,'m4a'],['leather-1','Leather I',144.769,0.1662,182.2,'m4a'],['leather-2','Leather II',158.743,0.1989,137.3,'m4a'],['velocity-1','Velocity I',131.058,0.1811,125.0,'m4a'],['velocity-2','Velocity II',130.501,0.1752,106.5,'m4a']],LPA=LP.concat(LP2);
  const L={cur:null,name:'',bpm:0,haze:.4,level:.5,lock:false,g:null,buf:new Map(),busy:0};
  const d=document.createElement('div');d.className='jelly drawer';d.id='loops';d.hidden=true;$('#phantom').after(d);DR.push('loops');
  d.innerHTML='<button class="pill dclose">close</button><h3>Loops</h3><p class="vh">Each groove plays whole, as made, and round again from the top. One plays at a time; choosing another crossfades into it. Haze takes the beat from present to far away.</p>'
    +'<h4>Varanus Salvation</h4><div class="chips lpGrid">'+LP.map(([id,n,b])=>`<button class="chip" data-id="${id}" title="${Math.round(b)} beats a minute">${n}</button>`).join('')+'</div>'
    +'<h4>AnimusCult</h4><div class="chips lpGrid">'+LP2.map(([id,n,b])=>`<button class="chip" data-id="${id}" title="${Math.round(b)} beats a minute">${n}</button>`).join('')+'</div>'
    +'<label class="mrow"><span>haze</span><input type="range" min="0" max="1" step=".01" value=".4" data-c="haze" aria-label="haze"></label>'
    +'<label class="mrow"><span>level</span><input type="range" min="0" max="1" step=".01" value=".5" data-c="level" aria-label="loop level"></label>'
    +'<div class="vg" style="margin-top:10px"><button class="vb" id="lpLock" title="Set the beat tone to a whole number of pulses in each bar of the loop">lock the beat to the loop</button> <button class="vb" id="lpStop">stop the loop</button></div><p class="vh" id="lpSt"></p>';
  d.querySelector('.dclose').onclick=()=>{d.hidden=true};
  const b=document.createElement('button');b.className='pill';b.id='bLoops';b.textContent='loops';$('.rside').insertBefore(b,$('#bPhantom'));b.onclick=e=>{e.stopPropagation();openDr('loops')};
  const st=t=>{d.querySelector('#lpSt').textContent=t||''};
  /* the chain: each loop's own fade, then the haze (filter, squeeze, dark echo), then the level, then the board */
  const build=()=>{if(L.g)return L.g;const ctx=A.ctx,G={};G.in=gn(ctx,1);G.lp=bq(ctx,'lowpass',18000,.5);G.cmp=ctx.createDynamicsCompressor();G.cmp.attack.value=.003;G.cmp.release.value=.25;G.cmp.knee.value=6;
    G.dry=gn(ctx,1);G.send=gn(ctx,0);G.d1=ctx.createDelay(2);G.d2=ctx.createDelay(2);G.d1.delayTime.value=.37;G.d2.delayTime.value=.53;G.fb=gn(ctx,.32);G.dk=bq(ctx,'lowpass',1400,.5);G.wet=gn(ctx,1);G.bus=gn(ctx,0);
    G.in.connect(G.lp).connect(G.cmp).connect(G.dry).connect(G.bus);G.cmp.connect(G.send);G.send.connect(G.dk);G.dk.connect(G.d1);G.dk.connect(G.d2);G.d1.connect(G.fb);G.d2.connect(G.fb);G.fb.connect(G.dk);
    G.d1.connect(G.wet);G.d2.connect(G.wet);G.wet.connect(G.bus);G.bus.connect(A.master);return L.g=G};
  const applyHaze=()=>{if(!L.g)return;const G=L.g,t=A.ctx.currentTime,h=L.haze;G.lp.frequency.setTargetAtTime(18000*Math.pow(420/18000,Math.pow(h,.8)),t,.08);
    G.cmp.threshold.setTargetAtTime(-6-30*h,t,.08);G.cmp.ratio.setTargetAtTime(1+11*h,t,.08);G.dry.gain.setTargetAtTime(1-.15*h+.35*h*h,t,.08);G.send.gain.setTargetAtTime(h*.5,t,.08);G.wet.gain.setTargetAtTime(.3+.3*h,t,.08)};
  const applyLevel=()=>{if(!L.g||!L.cur)return;L.g.bus.gain.setTargetAtTime(L.level*2*(.072/L.cur.rms),A.ctx.currentTime,.1)};
  const load=id=>{if(L.buf.has(id))return Promise.resolve(L.buf.get(id));return audioFetch('audio/loops/'+id+'.'+((LPA.find(r=>r[0]===id)||[])[5]||'mp3')).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>A.ctx.decodeAudioData(a))
    .then(x=>{/* a 25 ms fade in and a quarter-second fade out, in memory only, so the wrap from the end to the top never clicks */
      for(let c=0;c<x.numberOfChannels;c++){const ch=x.getChannelData(c),fi=Math.round(x.sampleRate*.025),fo=Math.round(x.sampleRate*.25),n=ch.length;for(let i=0;i<fi&&i<n;i++)ch[i]*=i/fi;for(let i=0;i<fo&&i<n;i++)ch[n-1-i]*=i/fo}
      L.buf.set(id,x);while(L.buf.size>2){const k=[...L.buf.keys()].find(k=>k!==id&&(!L.cur||k!==L.cur.id));if(!k)break;L.buf.delete(k)}return x})};
  const fadeOut=(c,s)=>{if(!c)return;const t=A.ctx.currentTime;c.f.gain.cancelScheduledValues(t);c.f.gain.setValueAtTime(c.f.gain.value,t);c.f.gain.linearRampToValueAtTime(0,t+s);setTimeout(()=>{try{c.src.stop()}catch(_){}try{c.f.disconnect()}catch(_){}},s*1000+150)};
  const lockBeat=()=>{if(!L.lock||!L.cur)return;const base=L.cur.bpm/240,k=Math.max(1,Math.round(S.beat/base)),nb=+(base*k).toFixed(3);S.beat=nb;paintDial();applyBeat();st(`${L.cur.name} · the beat tone is ${nb} Hz, ${k} pulses to each bar`)};
  const paint=()=>{d.querySelectorAll('.lpGrid .chip').forEach(x=>x.classList.toggle('on',!!L.cur&&x.dataset.id===L.cur.id));d.querySelector('#lpLock').classList.toggle('on',L.lock)};
  const play=id=>{if(!A.ctx)return say('enter first, then choose a loop');const row=LPA.find(r=>r[0]===id),my=++L.busy;st('loading '+row[1]);
    load(id).then(buf=>{if(my!==L.busy)return;const G=build(),ctx=A.ctx,src=ctx.createBufferSource(),f=gn(ctx,0);src.buffer=buf;src.loop=true;src.connect(f).connect(G.in);
      const old=L.cur;L.cur={id,name:row[1],bpm:row[2],rms:row[3],src,f};src.start();f.gain.setValueAtTime(0,ctx.currentTime);f.gain.linearRampToValueAtTime(1,ctx.currentTime+(old?3:1.5));fadeOut(old,3);
      applyHaze();applyLevel();paint();st(`${row[1]} · ${Math.floor(row[4]/60)}:${String(Math.round(row[4]%60)).padStart(2,'0')} · ${Math.round(row[2])} beats a minute`);lockBeat();say('loop · '+row[1])})
    .catch(()=>{if(my===L.busy)st('that loop would not load on this device')})};
  const stop=()=>{L.busy++;fadeOut(L.cur,1.5);L.cur=null;paint();st('')};
  d.addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;e.stopPropagation();
    if(x.dataset.id){if(L.cur&&L.cur.id===x.dataset.id){stop();say('loop off')}else play(x.dataset.id)}
    else if(x.id==='lpStop'){stop();say('loop off')}else if(x.id==='lpLock'){L.lock=!L.lock;paint();if(L.lock)lockBeat();else if(L.cur)st(`${L.cur.name} · ${Math.round(L.cur.bpm)} beats a minute`);say(L.lock?'beat locked to the loop':'beat unlocked')}});
  d.addEventListener('input',e=>{const c=e.target.dataset.c;if(!c)return;L[c]=+e.target.value;if(c==='haze')applyHaze();else applyLevel();say(`${c} · ${Math.round(L[c]*100)}`)});
  const baseLive2=liveList;liveList=function(){const R=baseLive2();if(L.cur)R.push(['loop · '+L.cur.name,stop]);return R};
  const baseReset2=resetAll;resetAll=function(){if(L.cur)stop();return baseReset2.apply(this,arguments)};
  /* the reset button held the first resetAll; point it at the current one so loops and phantoms stop with it too */
  $('#bReset').onclick=()=>resetAll()}

/* ================= the dial's engine-turning: guilloché, thin-film rim, a ripple on the beat =================
   Watchmakers cut two rosettes over each other so the metal seems to move as it turns. Here the two rosettes turn
   against each other under the ticks, the rim carries an oil-film sheen that drifts round, and a ring leaves the
   lens on every pulse of the beat (every second or fourth pulse when the beat is fast, so it never flickers). */
{const d=$('#dial'),NS='http://www.w3.org/2000/svg',mk=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e};
  const defs=d.querySelector('defs');
  defs.insertAdjacentHTML('beforeend','<linearGradient id="gFilm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4eee6"/><stop offset=".2" stop-color="#cfc4e6"/><stop offset=".4" stop-color="#6d6377"/><stop offset=".6" stop-color="#bfd9d2"/><stop offset=".8" stop-color="#e6d6b8"/><stop offset="1" stop-color="#e3c3d3"/></linearGradient>'
    +'<radialGradient id="gHalo"><stop offset=".62" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".16"/><stop offset=".86" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>');
  const g=mk('g',{id:'dTrip','pointer-events':'none'});
  const rose=(id,n,rx,ry,op,sw)=>{const r=mk('g',{id,fill:'none',stroke:'url(#gFilm)','stroke-width':sw||.7,opacity:op});for(let i=0;i<n;i++)r.append(mk('ellipse',{rx,ry,transform:`rotate(${(i*180/n).toFixed(2)})`}));return r};
  /* the glass is left clear so the orb from the entrance shows: only a pearl line at its edge and the ripple */
  {const st=d.querySelectorAll('#gLens stop'),op=[.1,.03,.05,.34];st.forEach((s,i)=>s.setAttribute('stop-opacity',op[i]))}
  g.append(mk('circle',{id:'dFilmIn',r:141.5,fill:'none',stroke:'url(#gFilm)','stroke-width':1.2,opacity:.4}),
    mk('circle',{id:'dPulse',r:141,fill:'none',stroke:'#fff','stroke-width':2}));
  $('#ticks').before(g);
  const rimG=mk('g',{'pointer-events':'none'});rimG.append(mk('circle',{id:'dFilmOut',r:196,fill:'none',stroke:'url(#gFilm)','stroke-width':5,opacity:.28}));d.querySelector('circle').after(rimG);
  {const h=$('#handle').children;h[0].setAttribute('r',9);h[0].setAttribute('stroke','none');h[1].setAttribute('r',3.5)}
  const paintDial0=paintDial;const tempo=()=>{let p=1/Math.max(.1,S.beat||6);while(p<.45)p*=2;$('#dPulse').style.animationDuration=Math.min(8,p).toFixed(3)+'s'};
  paintDial=function(){const r=paintDial0.apply(this,arguments);tempo();return r};tempo();
  /* the sliders' glass tubes fill up to the bead */
  const fillR=()=>document.querySelectorAll('input[type=range]').forEach(e=>{const a=+e.min||0,b=+e.max||1,p=((+e.value-a)/((b-a)||1)*100).toFixed(1)+'%';if(e.style.getPropertyValue('--p')!==p)e.style.setProperty('--p',p)});
  addEventListener('input',e=>{if(e.target.type==='range')fillR()},true);setInterval(fillR,600);fillR()}

/* ================= THE VOWEL SPACE: the seven vowels of the rites as a place you can sing through =================
   A synthesized voice: a soft glottal pulse with breath, through four formant filters, the mouth shapes of the seven
   Greek vowels the rites use (I, Ē, E, A, O, Ō, U). The pad is laid out like a vowel chart, front vowels to the left,
   open vowels low. Press and drag to sing and glide; hold keeps it sounding. It sings on the carrier, so it stays in
   tune with the tones. When a rite sings a vowel the dot moves with it. Through the rites fader; never on the tone channel. */
{const VW={on:false,hold:false,oct:1,breath:.35,g:null,x:.5,y:.5,flash:0};
  const d=document.createElement('div');d.className='jelly drawer';d.id='vowels';d.hidden=true;$('#loops').after(d);DR.push('vowels');
  d.innerHTML='<button class="pill dclose">close</button><h3>Vowels</h3><p class="vh">The seven vowels of the rites as a place to sing through. In the Greek magical papyri and the Gnostic hymns the vowels themselves are the names of power, sung one to each heaven. Press and drag across the mouth; the voice glides from shape to shape on the carrier tone.</p>'
    +'<canvas id="vwPad" width="560" height="420" style="width:100%;max-width:420px;aspect-ratio:4/3;display:block;margin:8px auto;border-radius:12px;background:radial-gradient(120% 100% at 50% 0%,rgba(255,255,255,.06),rgba(0,0,0,.55));border:1px solid rgba(255,255,255,.14);touch-action:none;cursor:crosshair"></canvas>'
    +'<div class="vg" style="margin-top:6px"><button class="vb" id="vwHold">hold</button> <button class="vb" data-oct=".5">octave down</button> <button class="vb" data-oct="1">on the carrier</button> <button class="vb" data-oct="2">octave up</button></div>'
    +'<label class="mrow"><span>breath</span><input type="range" min="0" max="1" step=".01" value=".35" id="vwBreath" aria-label="breath"></label><p class="vh" id="vwSt"></p>';
  d.querySelector('.dclose').onclick=()=>{d.hidden=true};
  const b=document.createElement('button');b.className='pill';b.id='bVowels';b.textContent='vowels';$('.rside').insertBefore(b,$('#bLoops'));b.onclick=e=>{e.stopPropagation();openDr('vowels')};
  const pad=d.querySelector('#vwPad'),x=pad.getContext('2d'),st=t=>{d.querySelector('#vwSt').textContent=t||''};
  /* the chart: F2 across (front vowels left), F1 down (open vowels low), on log scales */
  const F2a=600,F2b=2400,F1a=250,F1b=850,lg=Math.log;
  const toXY=([f1,f2])=>[1-(lg(f2)-lg(F2a))/(lg(F2b)-lg(F2a)),(lg(f1)-lg(F1a))/(lg(F1b)-lg(F1a))];
  const toF=(px,py)=>[Math.exp(lg(F1a)+py*(lg(F1b)-lg(F1a))),Math.exp(lg(F2a)+(1-px)*(lg(F2b)-lg(F2a)))];
  const SAY={I:'ee','Ē':'ay',E:'eh',A:'ah',O:'aw','Ō':'oh',U:'oo'},V=Object.keys(VOWEL_F).map(k=>({k,f:VOWEL_F[k],p:toXY(VOWEL_F[k])}));
  const f3At=(px,py)=>{let s=0,w=0;V.forEach(v=>{const dd=Math.hypot(px-v.p[0],py-v.p[1])+.03,k=1/(dd*dd);s+=k*v.f[2];w+=k});return s/w};
  const near=(px,py)=>V.reduce((a,v)=>Math.hypot(px-v.p[0],py-v.p[1])<Math.hypot(px-a.p[0],py-a.p[1])?v:a);
  /* the voice */
  const build=()=>{if(VW.g)return VW.g;const ctx=A.ctx,G={};const n=40,re=new Float32Array(n+1),im=new Float32Array(n+1);for(let k=1;k<=n;k++)im[k]=Math.pow(k,-1.6);
    G.src=ctx.createOscillator();G.src.setPeriodicWave(ctx.createPeriodicWave(re,im));G.vib=ctx.createOscillator();G.vib.frequency.value=5.1;G.vibG=gn(ctx,14);G.vib.connect(G.vibG).connect(G.src.detune);
    G.flut=ctx.createOscillator();G.flut.frequency.value=3.4;G.flutG=gn(ctx,.1);G.amp=gn(ctx,1);G.flut.connect(G.flutG).connect(G.amp.gain);
    G.br=loopN(ctx,NB.pink);G.brHP=bq(ctx,'highpass',600,.5);G.brG=gn(ctx,VW.breath*.5);G.br.connect(G.brHP).connect(G.brG);
    G.mix=gn(ctx,1);G.src.connect(G.amp).connect(G.mix);G.brG.connect(G.mix);
    G.F=[[1,110],[.55,110],[.22,140],[.08,180]].map(([gg,bw],i)=>{const f=bq(ctx,'bandpass',[500,1500,2500,3300][i],[500,1500,2500,3300][i]/bw),g=gn(ctx,gg*3.2);G.mix.connect(f).connect(g);return{f,bw}});
    G.soft=bq(ctx,'lowpass',3600,.5);G.norm=gn(ctx,.3);G.meter=ctx.createAnalyser();G.meter.fftSize=2048;G.out=gn(ctx,0);G.F.forEach(o=>o.f.connect(G.soft));G.soft.connect(G.meter);G.soft.connect(G.norm).connect(G.out).connect(MB('riteBus'));
    /* a singer evens the vowels without thinking: close vowels put a formant right on a strong low harmonic and jump out. A slow level holds the voice near 0.055 RMS whatever the shape */
    const mb=new Float32Array(2048);setInterval(()=>{if(!(VW.on||VW.hold))return;G.meter.getFloatTimeDomainData(mb);let q=0;for(let i=0;i<2048;i++)q+=mb[i]*mb[i];const r=Math.sqrt(q/2048);if(r<1e-4)return;G.norm.gain.setTargetAtTime(clamp(.055/r,.05,6),A.ctx.currentTime,.18)},90);
    [G.src,G.vib,G.flut].forEach(o=>o.start());return VW.g=G};
  const pitch=()=>(S.fc||136.1)*VW.oct;
  const shape=(px,py,tc=.06)=>{const G=VW.g;if(!G)return;const t=A.ctx.currentTime,[f1,f2]=toF(px,py),f3=f3At(px,py),fs=[f1,f2,f3,3300];
    G.F.forEach((o,i)=>{o.f.frequency.setTargetAtTime(fs[i],t,tc);o.f.Q.setTargetAtTime(fs[i]/o.bw,t,tc)});G.src.frequency.setTargetAtTime(pitch(),t,.05)};
  const level=v=>{const G=VW.g;if(!G)return;const t=A.ctx.currentTime;G.out.gain.cancelScheduledValues(t);G.out.gain.setValueAtTime(G.out.gain.value,t);G.out.gain.linearRampToValueAtTime(v,t+(v?.25:.6))};
  const LV=1;
  const label=()=>{const v=near(VW.x,VW.y);st(VW.on||VW.hold?`singing ${v.k} (“${SAY[v.k]}”) on ${pitch().toFixed(1)} Hz${VW.oct===1?', the carrier':VW.oct<1?', an octave under the carrier':', an octave over the carrier'}`:`press and drag across the mouth · sings on ${pitch().toFixed(1)} Hz`)};
  const start=()=>{if(!A.ctx){say('enter first, then sing');return false}build();shape(VW.x,VW.y,.01);level(LV);VW.on=true;label();return true};
  const end=()=>{VW.on=false;if(!VW.hold)level(0);label()};
  /* drawing the pad: dark glass, a faint chart, the vowels where the mouth makes them, and the moving dot */
  const draw=()=>{const W=pad.width,H=pad.height,m=46;x.clearRect(0,0,W,H);x.strokeStyle='rgba(255,255,255,.07)';x.lineWidth=1;
    for(let i=1;i<4;i++){x.beginPath();x.moveTo(m+(W-2*m)*i/4,m*.6);x.lineTo(m+(W-2*m)*i/4,H-m*.6);x.stroke();x.beginPath();x.moveTo(m*.6,m+(H-2*m)*i/4);x.lineTo(W-m*.6,m+(H-2*m)*i/4);x.stroke()}
    const P=([px,py])=>[m+px*(W-2*m),m+py*(H-2*m)],near1=near(VW.x,VW.y);
    V.forEach(v=>{const [cx,cy]=P(v.p),on=(VW.on||VW.hold)&&v===near1;x.fillStyle=on?'rgba(255,198,205,1)':'rgba(236,228,214,.8)';x.textAlign='center';
      x.font=`600 ${on?58:48}px "Grenze Gotisch", serif`;x.fillText(v.k,cx,cy+14);x.font='22px "Texturina", serif';x.fillStyle='rgba(236,228,214,.55)';x.fillText(SAY[v.k],cx,cy+40)});
    x.font='18px "Texturina", serif';x.fillStyle='rgba(236,228,214,.4)';x.textAlign='left';x.fillText('front',m*.6,H-10);x.textAlign='right';x.fillText('back',W-m*.6,H-10);x.save();x.translate(14,H/2);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('close   ·   open',0,0);x.restore();
    const [dx,dy]=P([VW.x,VW.y]),live=VW.on||VW.hold,r=(live?13:9)+VW.flash*10;const gr=x.createRadialGradient(dx,dy,0,dx,dy,r*3);gr.addColorStop(0,live?'rgba(242,69,92,.55)':'rgba(255,255,255,.18)');gr.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=gr;x.beginPath();x.arc(dx,dy,r*3,0,7);x.fill();x.fillStyle=live?'#ffc6cd':'rgba(255,255,255,.55)';x.beginPath();x.arc(dx,dy,live?5:4,0,7);x.fill();VW.flash*=.9};
  (function loop(){requestAnimationFrame(loop);if(d.hidden)return;draw()})();
  const at=e=>{const r=pad.getBoundingClientRect(),m=46/pad.width;VW.x=clamp(((e.clientX-r.left)/r.width-m)/(1-2*m),0,1);VW.y=clamp(((e.clientY-r.top)/r.height-46/pad.height)/(1-2*46/pad.height),0,1);shape(VW.x,VW.y);label()};
  pad.addEventListener('pointerdown',e=>{pad.setPointerCapture(e.pointerId);at(e);start()});pad.addEventListener('pointermove',e=>{if(VW.on)at(e)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>pad.addEventListener(ev,()=>{if(VW.on)end()}));
  const paintB=()=>{d.querySelector('#vwHold').classList.toggle('on',VW.hold);d.querySelectorAll('[data-oct]').forEach(e=>e.classList.toggle('on',+e.dataset.oct===VW.oct))};paintB();label();
  d.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||t.classList.contains('dclose'))return;e.stopPropagation();
    if(t.id==='vwHold'){VW.hold=!VW.hold;if(VW.hold){if(!VW.on&&!start())VW.hold=false;VW.on=false}else if(!VW.on)level(0);say(VW.hold?'vowels · held':'vowels · released')}
    else if(t.dataset.oct){VW.oct=+t.dataset.oct;shape(VW.x,VW.y)}paintB();label()});
  d.querySelector('#vwBreath').addEventListener('input',e=>{VW.breath=+e.target.value;if(VW.g)VW.g.brG.gain.setTargetAtTime(VW.breath*.5,A.ctx.currentTime,.05)});
  /* the rites move the pad: each vowel a rite sings lands the dot on that vowel */
  const ch0=chant;chant=function(v,f,dur){const o=VOWEL_F[v];if(o){[VW.x,VW.y]=toXY(o);VW.flash=1;if(VW.hold)shape(VW.x,VW.y,.08);label()}return ch0.apply(this,arguments)};
  /* sounding now, and reset */
  const stopAll=()=>{VW.hold=false;VW.on=false;level(0);paintB();label()};
  const baseLive3=liveList;liveList=function(){const R=baseLive3();if(VW.hold||VW.on)R.push(['vowels',stopAll]);return R};
  const baseReset3=resetAll;resetAll=function(){stopAll();return baseReset3.apply(this,arguments)}}

/* descent is the same glide as Journey; its button shows only while a glide is running, as the countdown and the way to stop it */
{const bd=$('#bDescent');if(bd){const sync=()=>{bd.hidden=!desc};sync();setInterval(sync,500)}}

/* the room the space knob opens onto: stone hall, chamber, cave, or the measured nave of York Minster */
{const kt=$('.ktabs');if(kt){const ORD=['hall','chamber','cave','cathedral'],b=document.createElement('button');b.className='pill mini';b.id='bRoom';
  const label=()=>{b.textContent='room · '+((A.ROOMS&&A.ROOMS[S.room||'hall'])||{n:'stone hall'}).n};label();b.title='Choose the room the space dial opens onto';kt.append(b);
  b.onclick=()=>{const nx=ORD[(ORD.indexOf(S.room||'hall')+1)%ORD.length];S.room=nx;label();if(A.setRoom)A.setRoom(nx);say('room · '+((A.ROOMS&&A.ROOMS[nx])||{}).n+(S.space<.05?' · turn up space to hear it':''))};
  setInterval(()=>{if(A.room&&A.room.id!==(S.room||'hall')&&A.setRoom)A.setRoom(S.room||'hall');label()},2000)}}

/* ================= THE ASCENSION ENGINE: the same sound engine as Black Dragon: Ascension =================
   ascension.dsp.js is Ascension's own audio processor, copied in unchanged (the plugin's C++ core is a sample-for-sample
   port of it): 18 voices of band-limited morphing wavetables with unison, sub, breath and a ZDF filter, FM bells, chorus,
   a tempo echo, an eight-line reverb with octave shimmer, drive and a safety limiter. Its own binaural bed, air hiss and
   Monad drone are kept silent here: this instrument has its own beat engine, and nothing sounds until it is played.
   Seven key voices play through it; the Dragon stone's chord spells use one instance each. */
const ASC={url:'ascension.dsp.js?v=1127a',mod:null,quiet:{bin:0,air:0,rev:0,mute:0,master:.8,width:1}};
ASC.load=()=>ASC.mod||(ASC.mod=(A.ctx&&A.ctx.audioWorklet&&window.AudioWorkletNode)?A.ctx.audioWorklet.addModule(ASC.url):Promise.reject(new Error('no worklet')));
ASC.make=fx=>ASC.load().then(()=>{const n=new AudioWorkletNode(A.ctx,'ascension',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});n.port.postMessage({t:'setMany',v:Object.assign({},ASC.quiet,fx||{})});return n});
{const KTRIM=1.7;/* set by measurement: one note of each voice at about 0.055, as the other key voices */
  const ASCV=[['ascension lead','lead',0,1],['ascension vowel','lead',2.2,1.17],['ascension glass','lead',5,1],['ascension organ','lead',6,.95],['ascension pad','pad',1.3,1.28],['ascension choir','choir',2.2,2.2],['ascension bass','bass',.4,.43]];
  ASCV.forEach(([n,p,sh,tr])=>VOX.push({n,fam:'ascension',asc:p,sh,tr,oct:p==='bass'?-1:0}));
  /* the thirteen realm voices Ascension made, in this instrument's own recipe format (Ascension's SOUND-SYSTEM-FOR-V2, section 4) */
  VOX.push(
  { n: 'opal keys', fam: 'ascension realms', osc: [['sine', 1, -3, .6], ['sine', 1, 3, .6], ['sine', 2, 0, .12]], fm: [2, .3, 1.6], parts: [[4, .05, 1.2]], lp: [5, .6, 1.5, .6], trem: [2.2, .05], a: .015, d: 3.6, s: .25, peak: .4, r: 2.8, trim: 0.93 },
  { n: 'moss reed', fam: 'ascension realms', osc: [['triangle', 1, 0, .8], ['sine', 2, 0, .2]], noise: [[1, 4, .4, -.4]], parts: [[3.9, .12, .5]], lp: [4, .7, 2, .3], vib: [4.4, .004, .6], a: .04, peak: .4, r: 1.2, trim: 0.41 },
  { n: 'tide glass', fam: 'ascension realms', osc: [['triangle', 1, 0, .8], ['sine', 2, 4, .25]], uni: 2, spread: 7, lp: [3, .8, 2.2, 1.8], beat: .3, parts: [[2, .2, 4]], trem: [.3, .12], a: .5, peak: .4, r: 4, trim: 0.59 },
  { n: 'cloud flute', fam: 'ascension realms', oct: 1, osc: [['sine', 1, 0, .9], ['sine', 2, 0, .08]], noise: [[1, 2.5, .7, -.5], [2, 6, .2, -.5]], vib: [4.6, .004, .8], a: .2, peak: .34, r: 1.4, trim: 0.41 },
  { n: 'star pad', fam: 'ascension realms', oct: 1, osc: [['sine', 1, 0, .7], ['sine', 2, 6, .22], ['sine', 3.01, -6, .08]], uni: 3, spread: 11, trem: [.17, .12], a: 2.2, peak: .26, r: 5.5, trim: 0.9 },
  { n: 'arc lead', fam: 'ascension realms', osc: [['sawtooth', 1, 0, .7], ['square', 2, 0, .12]], uni: 3, spread: 10, fm: [1, .5, .8], lp: [5, 2, 2.5, .25], a: .02, d: 1.2, s: .5, peak: .34, r: .9, trim: 2.03 },
  { n: 'heart strings', fam: 'ascension realms', oct: -1, osc: [['sawtooth', 1, 0, .8], ['triangle', 2, 0, .2]], uni: 3, spread: 9, sub: .2, lp: [4, .8, .6, 1.4], vib: [5.2, .005, .7], a: .35, peak: .4, r: 1.8, trim: 0.82 },
  { n: 'ash organ', fam: 'ascension realms', oct: -1, osc: [['sine', 1, 0, .8], ['sine', 2, 0, .4], ['sine', 3, 0, .25], ['triangle', .5, 0, .5]], lp: [6, .6], trem: [5.4, .06], sub: .2, a: .08, peak: .36, r: 1.6, trim: 0.35 },
  { n: 'sun brass', fam: 'ascension realms', osc: [['sawtooth', 1, 0, .8], ['triangle', 1, 0, .4]], uni: 3, spread: 8, lp: [2.6, 1.2, 1.9, .5], vib: [5, .003, .9], a: .12, peak: .38, r: 1.4, trim: 0.5 },
  { n: 'frost bells', fam: 'ascension realms', oct: 1, parts: [[1, .9, 5], [2.76, .3, 3], [5.4, .1, 1.6], [8.93, .03, .7]], beat: .4, osc: [['sine', 1, 0, .2]], a: .006, d: 4, s: .05, peak: .32, r: 3.2, trim: 2.14 },
  { n: 'velvet sigh', fam: 'ascension realms', osc: [['sawtooth', 1, 0, .55], ['triangle', 1, 0, .5]], uni: 3, spread: 12, sub: .25, form: ['ah', 'oo', 4], noise: [[1, 6, .5, -.6]], lp: [5, .6], vib: [4.4, .005, 1.2], a: .7, peak: .5, r: 3.2, trim: 0.46 },
  { n: 'fairy glass', fam: 'ascension realms', oct: 1, osc: [['sine', 1, 0, .35], ['sine', 2, 5, .12]], parts: [[1, .8, 3.4], [3, .25, 2], [4.02, .14, 1.2], [6.8, .05, .6]], beat: .6, uni: 2, spread: 6, trem: [.5, .08], a: .006, d: 3, s: .2, peak: .32, r: 3, trim: 1.87 },
  { n: 'dragon throat', fam: 'ascension realms', oct: -2, osc: [['sawtooth', 1, 0, 1], ['sawtooth', 1.5, 0, .3]], uni: 2, spread: 10, sub: .4, form: ['oo', 'oh', 6], noise: [[.5, 3, .5, -.8]], lp: [8, 3, .5, 2.5], trem: [1.3, .1], a: .5, peak: .5, r: 2.6, trim: 0.35 });
  VOX.forEach(v=>{if(v.n==='whisper')v.trim=3.1});/* whisper sat too quiet: measured at one note, as Ascension also found */
  /* the owner prefers Ascension's sound: its two groups lead the list and the keyboard starts on Ascension's lead;
     every voice of this instrument stays, below them. Voices are chosen by name, so presets and saved sessions keep theirs. */
  {const cur=VOICES[S.voice],ORD=['ascension','ascension realms'].concat(FAMS);FAMS.unshift('ascension','ascension realms');
    VOX.sort((a,b)=>ORD.indexOf(a.fam)-ORD.indexOf(b.fam));VOICES.length=0;VOX.forEach(v=>VOICES.push(v.n));
    /* the keyboard starts on opal keys (owner, 2026-11-27) */window.DEFVOICE=Math.max(0,VOICES.indexOf('opal keys'));
    S.voice=S.voice===0?DEFVOICE:Math.max(0,VOICES.indexOf(cur));buildVox();setVoice(S.voice)}
  let keys=null,ready=null;const live={};
  const engine=()=>keys||(keys=ASC.make({space:S.space,echo:.18,shimmer:.45,root:S.fc,carrier:S.fc}).then(n=>{const g=gn(A.ctx,KTRIM*(typeof MIX==='object'&&MIX.keys!=null?MIX.keys*2:1));n.connect(g).connect(A.master);A.asc=n;A.ascOut=g;ready=n;return n}).catch(e=>{keys=null;throw e}));
  const on0=noteOn,off0=noteOff;
  noteOn=(id,i,vel=1)=>{const V=VOX[S.voice];if(!V||!V.asc)return on0(id,i,vel);if(!A.ctx||live[id])return;
    const f=(KEYHZ[id]||degFreq(i))*Math.pow(2,V.oct||0);live[id]=1;flash(i,true);pluck=1;
    const send=n=>{if(!live[id])return;n.port.postMessage({t:'setMany',v:{shape:V.sh,space:S.space,root:S.fc}});n.port.postMessage({t:'on',id:'k'+id,f,v:.85*vel*(V.tr||1),p:V.asc})};
    if(ready){send(ready);return}engine().then(send)
      .catch(()=>{delete live[id];flash(i,false);say('this device cannot run the Ascension engine')})};
  noteOff=(id,i)=>{if(!live[id])return off0(id,i);delete live[id];flash(i,false);if(A.asc)A.asc.port.postMessage({t:'off',id:'k'+id})};
  const mix0=applyMix;applyMix=function(){mix0.apply(this,arguments);if(A.ascOut&&typeof MIX==='object')A.ascOut.gain.setTargetAtTime(KTRIM*MIX.keys*2,A.ctx.currentTime,.04)};
  {const w=setInterval(()=>{if(!A.ctx)return;clearInterval(w);if(VOX[S.voice]&&VOX[S.voice].asc)engine().catch(()=>{})},400);
    const sv0=setVoice;setVoice=function(i){const r=sv0.apply(this,arguments);if(A.ctx&&VOX[S.voice]&&VOX[S.voice].asc)engine().catch(()=>{});return r}}
  window.ASCKEYS={engine,live}}

/* ================= ASCENSION'S VOICE FOR V2'S OWN INSTRUMENTS (pilot, 2026-11-27) =================
   A faithful copy of Black Dragon: Ascension's synth voice (morphing band-limited wavetables, among them its four sung
   vowels, unison spread across the ears, a sub octave, breath noise, a ZDF low-pass with its own envelope, vibrato and a
   slow morph), run in V2's own worklet so each V2 instrument can bring its own settings. Ascension's file stays untouched.
   It plays into V2's keys bus, so the instrument keeps V2's chorus, echo and room. The voices, strings, nectar, breath and reed,
   electric and dark families use it where it suits; each can be heard both ways with the engine switch on the instrument page. Whisper stays as it was. */
const ASCVW=`const SR=sampleRate,TAU=Math.PI*2,TL=2048,NMIP=10;const clamp=(x,a,b)=>x<a?a:x>b?b:x;
const SPECS=[k=>(1/k)*(k%2?1:.55)*Math.exp(-k/60),null,null,null,null,k=>(k%2?1/(1+.18*k*k):0)+(k===2?.25:0)+(k===4?.12:0),k=>(k<=3?1/k:0)+(k===5?.3:0)+(k===8?.18:0)+(k===12?.09:0)];
const VOW=[[[800,1,140],[1150,.55,130],[2900,.22,220]],[[450,1,110],[800,.5,110],[2830,.14,220]],[[325,1,90],[700,.35,110],[2530,.1,220]],[[280,1,90],[2250,.5,190],[2900,.32,230]]];
VOW.forEach((fm,i)=>{SPECS[i+1]=k=>{const f=k*196;let a=0;for(const [F,A,B] of fm)a+=A*Math.exp(-Math.pow((f-F)/B,2));return(a+.02/k)/Math.pow(k,.25)}});
const NT=SPECS.length,SIN=new Float32Array(TL);for(let i=0;i<TL;i++)SIN[i]=Math.sin(i/TL*TAU);const TABLES=[];
for(let t=0;t<NT;t++){const mips=[];for(let m=0;m<NMIP;m++){const fHi=27.5*Math.pow(2,m+1),maxH=clamp(Math.floor(SR*.45/fHi),1,400),tb=new Float32Array(TL+1);
  for(let k=1;k<=maxH;k++){const a=SPECS[t](k);if(Math.abs(a)<1e-5)continue;for(let i=0;i<TL;i++)tb[i]+=a*SIN[(i*k)%TL]}
  let pk=0;for(let i=0;i<TL;i++)pk=Math.max(pk,Math.abs(tb[i]));pk=pk||1;for(let i=0;i<TL;i++)tb[i]/=pk;tb[TL]=tb[0];mips.push(tb)}TABLES.push(mips)}
const mipFor=f=>clamp(Math.floor(Math.log2(Math.max(f,1)/27.5)),0,NMIP-1);
class Voice{constructor(){this.on=false;this.amp=0;this.ph=new Float64Array(9);this.ic=new Float64Array(4)}
  start(id,f,vel,P){this.P=P;this.id=id;this.f=f;this.vel=vel;this.gate=true;this.on=true;this.age=0;this.lfoPh=Math.random()*TAU;this.vibPh=Math.random()*TAU;
    if(this.amp<1e-4){for(let i=0;i<9;i++)this.ph[i]=Math.random();this.ic.fill(0);this.fenv=0}this.stage=0;this.fstage=0;const n=P.uni;this.dets=[];this.pans=[];
    for(let u=0;u<n;u++){const x=n===1?0:u/(n-1)*2-1;this.dets.push(Math.pow(2,x*P.det/12));this.pans.push(x*P.spr)}}
  release(){this.gate=false;this.stage=3;this.fstage=3}}
class AV extends AudioWorkletProcessor{constructor(o){super();const n=(o&&o.processorOptions&&o.processorOptions.voices)||12;this.V=Array.from({length:n},()=>new Voice());
  this.port.onmessage=e=>{const m=e.data;if(m.t==='on'){let v=this.V.find(x=>x.on&&x.id===m.id);if(!v)v=this.V.find(x=>!x.on)||this.V.filter(x=>!x.gate).sort((a,b)=>a.amp-b.amp)[0]||this.V.sort((a,b)=>b.age-a.age)[0];v.start(m.id,m.f,m.v,m.P)}
    else if(m.t==='off')this.V.forEach(v=>{if(v.on&&v.id===m.id&&v.gate)v.release()});else if(m.t==='allOff')this.V.forEach(v=>{if(v.on&&v.gate)v.release()});
    else if(m.t==='glide')this.V.forEach(v=>{if(v.on&&v.id===m.id)v.f=m.f})}}
  process(_,outs){const out=outs[0],L=out[0],R=out[1]||out[0],N=L.length,bloom=.5,act=[];
    for(const v of this.V){if(!v.on)continue;v.age+=N;const P=v.P;v.lfoPh+=TAU*P.morphLfo*N/SR;const shp=clamp(P.shape+Math.sin(v.lfoPh)*(P.morphLfo?1.4:0),0,NT-1.001);
      v.t0=Math.floor(shp);v.tf=shp-v.t0;const fm=v.f;v.mip=mipFor(fm*Math.pow(2,P.det/12)*1.2);v.vibPh+=TAU*5.1*N/SR;const vd=P.vib*Math.min(1,v.age/(SR*.6));v.fmv=Math.pow(2,Math.sin(v.vibPh)*vd/12);
      v.inc=v.dets.map(d=>fm*d*v.fmv/SR);v.subInc=fm*.5*v.fmv/SR;const coef=st=>1-Math.exp(-1/(Math.max(.002,st)*SR));
      v.cA=1/(Math.max(.002,P.A)*SR);v.cD=coef(P.D/4);v.cR=coef(P.R/6);v.fcA=1/(Math.max(.002,P.fA)*SR);v.fcD=coef(P.fD/4);v.fcR=coef(P.fR/6);
      v.cutBase=P.cut*(.35+bloom*1.9)*Math.pow(fm/261.6,P.kt);v.envAmt=P.env*(.4+bloom);act.push(v)}
    const nyq=SR*.45;
    for(let i=0;i<N;i++){let sl=0,sr=0;
      for(const v of act){const P=v.P;
        if(v.stage===0){v.amp+=v.cA;if(v.amp>=1){v.amp=1;v.stage=1}}else if(v.stage===1){v.amp+=(P.S-v.amp)*v.cD}else if(v.stage===3){v.amp+=(0-v.amp)*v.cR;if(v.amp<1e-4){v.on=false;v.amp=0;continue}}
        if(v.fstage===0){v.fenv+=v.fcA;if(v.fenv>=1){v.fenv=1;v.fstage=1}}else if(v.fstage===1)v.fenv+=(P.fS-v.fenv)*v.fcD;else v.fenv+=(0-v.fenv)*v.fcR;
        let ol=0,or=0;const ta=TABLES[v.t0][v.mip],tb=TABLES[Math.min(NT-1,v.t0+1)][v.mip],tf=v.tf,n=v.inc.length;
        for(let u=0;u<n;u++){let ph=v.ph[u]+v.inc[u];if(ph>=1)ph-=1;v.ph[u]=ph;const x=ph*TL,j=x|0,fr=x-j,a=ta[j]+(ta[j+1]-ta[j])*fr,b=tb[j]+(tb[j+1]-tb[j])*fr,smp=a+(b-a)*tf;const pn=v.pans[u];ol+=smp*(1-pn)*.5;or+=smp*(1+pn)*.5}
        ol/=Math.sqrt(n);or/=Math.sqrt(n);let sp=v.ph[8]+v.subInc;if(sp>=1)sp-=1;v.ph[8]=sp;const sub=Math.sin(sp*TAU)*P.sub,nz=(Math.random()*2-1)*P.noise;ol+=sub+nz;or+=sub+nz;
        if((i&15)===0){const fc=clamp(v.cutBase+v.envAmt*v.fenv,30,nyq),g=Math.tan(Math.PI*fc/SR),k=2-2*P.res;v.a1=1/(1+g*(g+k));v.a2=g*v.a1;v.a3=g*v.a2}
        const ic=v.ic;let v3=ol-ic[1],v1=v.a1*ic[0]+v.a2*v3,v2=ic[1]+v.a2*ic[0]+v.a3*v3;ic[0]=2*v1-ic[0];ic[1]=2*v2-ic[1];const fl=v2;
        v3=or-ic[3];v1=v.a1*ic[2]+v.a2*v3;v2=ic[3]+v.a2*ic[2]+v.a3*v3;ic[2]=2*v1-ic[2];ic[3]=2*v2-ic[3];const fr2=v2;
        const gA=v.amp*v.amp*P.gain*v.vel;sl+=fl*gA;sr+=fr2*gA}
      L[i]=sl;if(R!==L)R[i]=sr}return true}}
registerProcessor('bd-ascv',AV);`;
/* levels set by measurement (2026-11-27): one note, held voices at about 0.055 RMS on the keys bus, plucks matched to their
   originals (koto held so its attack peaks with the rest), all under 0.5% of energy above 3.5 kHz.
   Each pilot instrument in Ascension's terms: shape (0 warm, 1 to 4 the vowels A O U I, 5 glass, 6 bell organ), unison,
   detune and spread, sub, breath, filter cutoff, resonance, envelope and key tracking, the two envelopes, vibrato, morph */
const ASCP={
  'choir':{shape:2,morphLfo:.1,uni:5,det:.14,spr:1,sub:.18,noise:.02,cut:2600,res:.08,env:900,kt:.4,A:.7,D:2,S:.85,R:2.6,fA:.8,fD:3,fS:.7,fR:2.6,vib:.12,gain:0.579},
  'sirens':{shape:3,morphLfo:.08,uni:3,det:.1,spr:.9,sub:.05,noise:.03,cut:3000,res:.1,env:800,kt:.4,A:.9,D:2,S:.85,R:3,fA:1,fD:3,fS:.7,fR:3,vib:.12,gain:0.655},
  'monks':{shape:2.4,morphLfo:.05,uni:5,det:.1,spr:.8,sub:.25,noise:.015,cut:1400,res:.08,env:700,kt:.35,A:1.1,D:2,S:.88,R:3,fA:1.2,fD:3,fS:.7,fR:3,vib:.08,gain:0.561},
  'throat singer':{shape:4,morphLfo:.03,uni:2,det:.04,spr:.5,sub:.35,noise:.01,cut:900,res:.55,env:2400,kt:.3,A:.5,D:1.5,S:.8,R:2,fA:.6,fD:3,fS:.5,fR:2,vib:.03,gain:0.458},
  'hum':{shape:3,morphLfo:0,uni:2,det:.06,spr:.6,sub:.2,noise:.005,cut:700,res:.05,env:300,kt:.3,A:.5,D:1.5,S:.9,R:2,fA:.5,fD:2,fS:.8,fR:2,vib:.08,gain:0.573},
  'bass choir':{shape:2,morphLfo:.07,uni:6,det:.12,spr:1,sub:.3,noise:.015,cut:1600,res:.08,env:700,kt:.35,A:.9,D:2,S:.88,R:2.8,fA:1,fD:3,fS:.7,fR:2.8,vib:.1,gain:0.458},
  'boy choir':{shape:3,morphLfo:.09,uni:4,det:.1,spr:.9,sub:.05,noise:.02,cut:3200,res:.08,env:900,kt:.45,A:.6,D:2,S:.85,R:2.4,fA:.7,fD:3,fS:.7,fR:2.4,vib:.1,gain:0.655},
  'banshee':{shape:4,morphLfo:.25,uni:3,det:.2,spr:1,sub:.05,noise:.03,cut:3000,res:.12,env:1200,kt:.4,A:.5,D:1.5,S:.85,R:2.2,fA:.5,fD:2,fS:.7,fR:2.2,vib:.3,gain:0.573},
  'tanpura':{shape:0,morphLfo:.02,uni:3,det:.06,spr:.7,sub:.1,noise:.008,cut:1800,res:.25,env:3000,kt:.5,A:.01,D:3,S:.25,R:3,fA:.01,fD:1.8,fS:.3,fR:2,vib:0,gain:1.463},
  'bowed strings':{shape:0,morphLfo:.03,uni:7,det:.18,spr:1,sub:.1,noise:.01,cut:1100,res:.1,env:1200,kt:.5,A:.8,D:2,S:.9,R:2.4,fA:.9,fD:2,fS:.7,fR:2.4,vib:.1,gain:0.724},
  'cello':{shape:2,morphLfo:0,uni:3,det:.06,spr:.6,sub:.15,noise:.008,cut:900,res:.1,env:1400,kt:.45,A:.25,D:1,S:.85,R:1.2,fA:.3,fD:1.5,fS:.6,fR:1.2,vib:.14,gain:0.585},
  'harp':{shape:6,morphLfo:0,uni:2,det:.02,spr:.4,sub:.05,noise:.004,cut:2400,res:.1,env:3000,kt:.6,A:.004,D:1.4,S:0,R:1.2,fA:.002,fD:.6,fS:0,fR:1,vib:0,gain:5.45},
  'koto':{shape:0,morphLfo:0,uni:2,det:.03,spr:.4,sub:.05,noise:.02,cut:1800,res:.2,env:3500,kt:.6,A:.005,D:1,S:0,R:.9,fA:.003,fD:.3,fS:0,fR:.8,vib:0,gain:6.5},
  'sitar':{shape:5,morphLfo:.04,uni:2,det:.04,spr:.5,sub:.05,noise:.01,cut:1600,res:.45,env:4000,kt:.5,A:.006,D:2.4,S:.05,R:1.6,fA:.004,fD:1,fS:.1,fR:1.4,vib:0,gain:2.389}};
/* the roll-out (2026-11-27): 33 more instruments from the nectar, breath and reed, electric and dark families, each mapped
   from its own recipe (attack, release, filter, detune, sub, vibrato, octave) onto the Ascension waveform that suits it,
   levelled by measurement to about 0.055 per held note, all under 0.3% of energy above 3.5 kHz. Bells, FM, struck partials,
   plucked keys and pure-noise sounds stay on V2's own engine, where their character lives. */
Object.assign(ASCP,{"lotus pad":{"shape":3,"morphLfo":0.02,"uni":3,"det":0.13,"spr":1,"sub":0.2,"noise":0.006,"cut":432,"res":0.04,"env":483,"kt":0.8,"A":1.4,"D":2,"S":0.85,"R":4.5,"fA":1.54,"fD":10.4,"fS":0.6,"fR":4.5,"vib":0,"gain":0.723},"liquid glass":{"shape":5,"morphLfo":0.02,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.02,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.5,"D":2,"S":0.85,"R":4,"fA":0.55,"fD":2,"fS":0.6,"fR":4,"vib":0.068,"gain":0.439},"opium choir":{"shape":3,"morphLfo":0.06,"uni":4,"det":0.15,"spr":1,"sub":0.25,"noise":0.006,"cut":1177,"res":0.04,"env":300,"kt":0.8,"A":1.3,"D":2,"S":0.85,"R":4.2,"fA":1.43,"fD":2,"fS":0.6,"fR":4.2,"vib":0.068,"gain":0.565},"slow bloom":{"shape":0,"morphLfo":0,"uni":3,"det":0.18,"spr":1,"sub":0.3,"noise":0.006,"cut":235,"res":0.06,"env":753,"kt":0.8,"A":0.9,"D":2,"S":0.85,"R":4.5,"fA":0.99,"fD":12.8,"fS":0.6,"fR":4.5,"vib":0,"gain":0.42},"amber strings":{"shape":0,"morphLfo":0.02,"uni":4,"det":0.16,"spr":1,"sub":0.18,"noise":0.006,"cut":628,"res":0.04,"env":-201,"kt":0.8,"A":0.7,"D":2,"S":0.85,"R":3.4,"fA":0.77,"fD":6.4,"fS":0.6,"fR":3.4,"vib":0.051,"gain":0.893},"dream organ":{"shape":6,"morphLfo":0.02,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.14,"D":2,"S":0.85,"R":2.2,"fA":0.154,"fD":2,"fS":0.6,"fR":2.2,"vib":0.051,"gain":0.447},"flute":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.05,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.12,"D":2,"S":0.85,"R":0.7,"fA":0.132,"fD":2,"fS":0.6,"fR":0.7,"vib":0.085,"gain":0.668},"shakuhachi":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.07,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.2,"D":2,"S":0.85,"R":0.9,"fA":0.22,"fD":2,"fS":0.6,"fR":0.9,"vib":0.153,"gain":0.635},"duduk":{"shape":2,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.02,"cut":628,"res":0.06,"env":300,"kt":0.8,"A":0.18,"D":2,"S":0.85,"R":0.8,"fA":0.198,"fD":2,"fS":0.6,"fR":0.8,"vib":0.119,"gain":0.864},"bansuri":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.05,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.09,"D":2,"S":0.85,"R":0.6,"fA":0.099,"fD":2,"fS":0.6,"fR":0.6,"vib":0.136,"gain":0.669},"ney":{"shape":2,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.06,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.16,"D":2,"S":0.85,"R":0.8,"fA":0.176,"fD":2,"fS":0.6,"fR":0.8,"vib":0.119,"gain":0.665},"ocarina":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.02,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.05,"D":2,"S":0.85,"R":0.4,"fA":0.055,"fD":2,"fS":0.6,"fR":0.4,"vib":0,"gain":0.673},"pan pipes":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.05,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.03,"D":2,"S":0.85,"R":0.5,"fA":0.033,"fD":2,"fS":0.6,"fR":0.5,"vib":0,"gain":0.674},"didgeridoo":{"shape":3,"morphLfo":0.06,"uni":1,"det":0,"spr":0.5,"sub":0.3,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.3,"D":2,"S":0.85,"R":1.5,"fA":0.33,"fD":2,"fS":0.6,"fR":1.5,"vib":0,"gain":0.46},"conch":{"shape":2,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.02,"cut":589,"res":0.09,"env":-235,"kt":0.8,"A":0.5,"D":2,"S":0.85,"R":1.4,"fA":0.55,"fD":3.2,"fS":0.6,"fR":1.4,"vib":0.068,"gain":1.093},"shofar":{"shape":1,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.015,"cut":706,"res":0.11,"env":-283,"kt":0.8,"A":0.2,"D":2,"S":0.85,"R":0.7,"fA":0.22,"fD":2,"fS":0.6,"fR":0.7,"vib":0,"gain":1.572},"bagpipe":{"shape":4,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.45,"noise":0.006,"cut":981,"res":0.04,"env":300,"kt":0.8,"A":0.12,"D":2,"S":0.85,"R":0.5,"fA":0.132,"fD":2,"fS":0.6,"fR":0.5,"vib":0,"gain":0.398},"harmonium":{"shape":0,"morphLfo":0.02,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":1177,"res":0.04,"env":300,"kt":0.8,"A":0.2,"D":2,"S":0.85,"R":0.9,"fA":0.22,"fD":2,"fS":0.6,"fR":0.9,"vib":0,"gain":0.44},"cathedral organ":{"shape":6,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.08,"D":2,"S":0.85,"R":1.2,"fA":0.088,"fD":2,"fS":0.6,"fR":1.2,"vib":0,"gain":0.45},"theremin":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.2,"D":2,"S":0.85,"R":0.8,"fA":0.22,"fD":2,"fS":0.6,"fR":0.8,"vib":0.204,"gain":0.636},"analog pad":{"shape":0,"morphLfo":0,"uni":5,"det":0.22,"spr":1,"sub":0.25,"noise":0.006,"cut":687,"res":0.04,"env":-330,"kt":0.8,"A":1.1,"D":2,"S":0.85,"R":3,"fA":1.21,"fD":8,"fS":0.6,"fR":3,"vib":0,"gain":0.461},"glass pad":{"shape":5,"morphLfo":0.02,"uni":2,"det":0.09,"spr":0.5,"sub":0.05,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":1.6,"D":2,"S":0.85,"R":4,"fA":1.76,"fD":2,"fS":0.6,"fR":4,"vib":0,"gain":0.775},"hollow":{"shape":5,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":785,"res":0.04,"env":-251,"kt":0.8,"A":0.1,"D":2,"S":0.85,"R":1,"fA":0.11,"fD":3.2,"fS":0.6,"fR":1,"vib":0.068,"gain":0.545},"deep sub":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.06,"D":2,"S":0.85,"R":1,"fA":0.066,"fD":2,"fS":0.6,"fR":1,"vib":0,"gain":0.622},"dark drone":{"shape":0,"morphLfo":0,"uni":2,"det":0.12,"spr":0.5,"sub":0.05,"noise":0.006,"cut":491,"res":0.16,"env":-196,"kt":0.8,"A":1.8,"D":2,"S":0.85,"R":4,"fA":1.98,"fD":12,"fS":0.6,"fR":4,"vib":0,"gain":0.53},"ondes martenot":{"shape":3,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":1177,"res":0.04,"env":300,"kt":0.8,"A":0.15,"D":2,"S":0.85,"R":0.9,"fA":0.165,"fD":2,"fS":0.6,"fR":0.9,"vib":0.153,"gain":0.678},"tape strings":{"shape":0,"morphLfo":0.02,"uni":3,"det":0.18,"spr":1,"sub":0.05,"noise":0.006,"cut":785,"res":0.04,"env":300,"kt":0.8,"A":0.35,"D":2,"S":0.85,"R":1.4,"fA":0.385,"fD":2,"fS":0.6,"fR":1.4,"vib":0.051,"gain":1.127},"supersaw":{"shape":0,"morphLfo":0,"uni":7,"det":0.22,"spr":1,"sub":0.25,"noise":0.006,"cut":883,"res":0.04,"env":-283,"kt":0.8,"A":0.09,"D":2,"S":0.85,"R":1,"fA":0.099,"fD":3.2,"fS":0.6,"fR":1,"vib":0,"gain":0.415},"pulse lead":{"shape":5,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":824,"res":0.08,"env":461,"kt":0.8,"A":0.025,"D":2,"S":0.85,"R":0.5,"fA":0.028,"fD":1,"fS":0.6,"fR":0.5,"vib":0.085,"gain":0.508},"sub organ":{"shape":6,"morphLfo":0,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":0.04,"D":2,"S":0.85,"R":0.8,"fA":0.044,"fD":2,"fS":0.6,"fR":0.8,"vib":0,"gain":0.444},"infernal brass":{"shape":0,"morphLfo":0,"uni":4,"det":0.16,"spr":1,"sub":0.05,"noise":0.006,"cut":432,"res":0.09,"env":345,"kt":0.8,"A":0.25,"D":2,"S":0.85,"R":1.2,"fA":0.275,"fD":2.4,"fS":0.6,"fR":1.2,"vib":0,"gain":0.449},"bees":{"shape":0,"morphLfo":0.02,"uni":1,"det":0,"spr":0.5,"sub":0.05,"noise":0.006,"cut":687,"res":0.04,"env":300,"kt":0.8,"A":0.3,"D":2,"S":0.85,"R":1,"fA":0.33,"fD":2,"fS":0.6,"fR":1,"vib":0,"gain":0.848},"abyss choir":{"shape":2,"morphLfo":0.06,"uni":4,"det":0.12,"spr":1,"sub":0.3,"noise":0.006,"cut":2000,"res":0.06,"env":500,"kt":0.45,"A":1.4,"D":2,"S":0.85,"R":3.5,"fA":1.54,"fD":2,"fS":0.6,"fR":3.5,"vib":0,"gain":0.493}});
window.ASCP=ASCP;window.VENG='asc';
{let node=null,boot=null;const live={};const mount=()=>boot||(boot=A.ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([ASCVW],{type:'application/javascript'}))).then(()=>{
    node=new AudioWorkletNode(A.ctx,'bd-ascv',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{voices:MOBILE?6:12}});node.connect(A.vBus);return node}).catch(e=>{boot=null;throw e}));
  const uses=V=>V&&ASCP[V.n]&&window.VENG!=='v2';
  const on0=noteOn,off0=noteOff;
  noteOn=(id,i,vel=1)=>{const V=VOX[S.voice];if(!uses(V))return on0(id,i,vel);if(!A.ctx||live[id])return;
    const f=(KEYHZ[id]||degFreq(i))*Math.pow(2,V.oct||0),P=ASCP[V.n];live[id]=1;flash(i,true);
    const send=n=>{if(live[id])n.port.postMessage({t:'on',id,f,v:Math.min(1,vel)*(P.tr||1),P})};if(node)send(node);else mount().then(send).catch(()=>{delete live[id];flash(i,false)})};
  noteOff=(id,i)=>{if(!live[id])return off0(id,i);delete live[id];flash(i,false);if(node)node.port.postMessage({t:'off',id})};
  {const w=setInterval(()=>{if(!A.ctx||!A.vBus)return;clearInterval(w);if(uses(VOX[S.voice]))mount().catch(()=>{})},400);
    const sv0=setVoice;setVoice=function(i){const r=sv0.apply(this,arguments);if(A.ctx&&uses(VOX[S.voice]))mount().catch(()=>{});return r}}
  window.ASCV={mount,live,get node(){return node}}}

/* ================= CHORDS AND MAGIC CHORDS: the keyboard modes of Black Dragon: Ascension =================
   Notes plays one note a key. Chords builds a chord on each key from the scale (d, d+2, d+4). Magic makes every key play
   the chord the Dream is on at that moment (a chord spell in the Dragon stone), walking up through its inversions along
   the keyboard, so a key can never land outside it. With no Dream playing, each group of keys takes the next chord of
   the Float spell in the state's own scale. Ported from Ascension's Performer.h (chordDegs, chordOn). */
EASE.add('e:dragon:9');EASE.add('e:dragon:10');EASE.add('e:dragon:15');['e:lust:6','e:freeze:3','e:magic:2','e:freeze:1','e:gold:7'].forEach(id=>EASE.add(id));/* the brightest of Ascension's realms */
{let CM=0,paintM=()=>{};const CO={bass:false,spread:0,strum:0};const MODES=['one note','chords','magic'],FLOAT=[[0,2,4,6],[1,3,5,7],[-2,2,4,7],[3,5,7,9],[0,4,6,9]],timers={};
  const voxSync=()=>{const v=$('#vox');if(v&&v._sync)v._sync()};
  const bar=$('#keysBar');if(bar){const b=document.createElement('button');b.className='pill kmode';b.id='bChordM';b.title='One note, chords or magic: magic keeps every key in one sweet chord, so whatever you press fits';
    const paint=()=>{b.textContent=MODES[CM];b.classList.toggle('on',CM>0);$('#keys')&&$('#keys').classList.toggle('magic',CM===2)};paint();paintM=paint;
    b.onclick=()=>{CM=(CM+1)%3;paint();voxSync();say('keys · '+MODES[CM]+(CM===2?(window.DREAM?' · on the Dream\'s chord':' · always in key'):''))};bar.append(b)}
  const st=document.createElement('style');st.textContent='#keys.magic .key{box-shadow:inset 0 0 18px rgba(255,190,140,.22)}#keys.magic .key.on{box-shadow:inset 0 0 26px rgba(255,210,170,.6),0 0 26px rgba(255,255,255,.3)}';document.head.append(st);
  const isKey=id=>typeof id==='string'&&/^[kpm]/.test(id)&&!id.includes('~');
  /* the notes of one key: a list of [degree, exact Hz or 0, level] */
  const build=(id,d)=>{const L=scaleLen();
    if(CM===1)return[0,2,4].map(k=>[d+k,0,1]);
    const D=window.DREAM;if(!D)return sweet(d);const n=D.n,fold=ch=>[...new Set(ch.map(c=>((c%n)+n)%n))].sort((a,b)=>a-b);
    let pc=fold(D?D.ch:FLOAT[0]);const m=pc.length;if(!D){const grp=Math.floor(d/m);pc=fold(FLOAT[((grp%FLOAT.length)+FLOAT.length)%FLOAT.length])}
    const s0=((d%m)+m)%m,o=Math.floor(d/m),out=[];for(let k=0;k<Math.min(3,m);k++){const ix=s0+k;out.push(pc[ix%m]+(Math.floor(ix/m)+o)*n)}out.push(out[0]+n);
    return out.map((g,k)=>[g,D?D.dg(g,2):0,k===3?.55:1])};
  /* Magic with no Dream playing: every key plays the same sweet chord, pure just-intonation triads on the state's root, so
     any keys held together agree. Each key plays the inversion whose lowest note sits at or just under the key's own pitch,
     so the chord follows the keyboard's register. The chord moves on only when a new phrase starts (nothing held, a few
     seconds since the last change), along a ring where each chord shares a note or two with the next: I iii vi IV in a
     major mood, i III VI iv in a minor one, open fifths and fourths where the scale has no third. */
  const PROG={maj:[[1,5/4,3/2],[5/4,3/2,15/8],[1,5/4,5/3],[1,4/3,5/3]],min:[[1,6/5,3/2],[6/5,3/2,9/5],[1,6/5,8/5],[1,4/3,8/5]],
    open:[[1,3/2],[1,9/8,3/2],[1,4/3,3/2],[1,4/3,16/9]]};
  let MCI=-1,MCT=-1e9;const mood=()=>{const sc=STATES[S.state].scale,has=x=>sc.some(v=>Math.abs(v/x-1)<.004);return has(5/4)?'maj':has(6/5)?'min':'open'};
  const sweet=d=>{const P=PROG[mood()],ch=P[((MCI%P.length)+P.length)%P.length],f=degFreq(d);let base=S.fc*2;while(base<150)base*=2;while(base>330)base/=2;
    const tones=[];for(let o=-3;o<5;o++)ch.forEach(r=>tones.push(base*r*Math.pow(2,o)));tones.sort((x,y)=>x-y);
    let j=0;while(j+1<tones.length&&tones[j+1]<=f*1.03)j++;const out=[tones[j],tones[j+1],tones[j+2]];if(ch.length<3)out[2]=out[0]*2;
    return out.map(hz=>[d,hz,1]).concat([[d,out[0]*2,.55]])};
  const on0=noteOn,off0=noteOff;
  noteOn=(id,i,vel=1)=>{if(!CM||!isKey(id))return on0(id,i,vel);
    if(CM===2&&!window.DREAM){const now=performance.now();if(!Object.keys(timers).length&&now-MCT>3500){MCI++;MCT=now}}const L=scaleLen(),notes=build(id,i).map(x=>x.slice());
    /* key options, as in Ascension: spread opens the chord (every other note up an octave, wide lifts the third note too),
       bass adds the lowest note an octave down, strum rolls the notes in */
    const up=x=>{if(x[1])x[1]*=2;else x[0]+=L};if(CO.spread>0&&notes.length>2){up(notes[1]);if(CO.spread>1&&notes[2])up(notes[2])}
    if(CO.bass&&notes.length){const r=notes[0];notes.push(r[1]?[r[0],r[1]/2,.8]:[r[0]-L,0,.8])}
    const v=Math.min(1,vel/Math.sqrt(notes.length)*1.15),roll=CM===2?Math.max(12,CO.strum*70):CO.strum*70;
    (timers[id]||[]).forEach(clearTimeout);timers[id]=[];
    notes.forEach(([g,hz,lv],k)=>{const nid=id+'~'+k,go=()=>{if(hz)KEYHZ[nid]=hz;else delete KEYHZ[nid];on0(nid,g,v*lv)};if(k&&roll)timers[id].push(setTimeout(go,k*roll));else go()})};
  noteOff=(id,i)=>{if(!isKey(id)||(!CM&&!timers[id]))return off0(id,i);(timers[id]||[]).forEach(clearTimeout);delete timers[id];for(let k=0;k<5;k++){off0(id+'~'+k,i);delete KEYHZ[id+'~'+k]}off0(id,i)};
  window.CHORDS={get mode(){return CM},set mode(v){CM=v;paintM();voxSync()},opts:CO,set(k,v){if(k in CO){CO[k]=v;voxSync()}}}}

/* ================= THE MONAD'S VOICE, from Black Dragon: Ascension (MonadVoice.h, 2026-11-28) =================
   Held, the Monad climbs for ever; let go, it sinks. Six octave-spaced layers of detuned saws on the root and its fifth
   (no third), under a resonant low-pass that pumps like a slow wah, a steady sub felt in the chest, soft clipping, and a
   character for the stone underneath. It replaces the clean stage tones and stage bells, which Ascension removed as too
   sweet; the noise riser stays. A line-for-line port of the C++, run as its own audio processor. */
const MONW=`const TAU=6.283185307179586;
class M extends AudioWorkletProcessor{constructor(){super();this.SR=sampleRate;this.rev=0;this.root=136.1;this.realm=0;this.seed=0x9e3779b9;this.blip=Array.from({length:10},()=>({on:false}));
 this.cb=[0,0,0,0];this.bc=[.1,1,0,.1,1,0];this.next=0;this.dub=-1;this.dubAmp=0;this.tt=0;this.brPh=0;this.humPh=0;this.humGate=0;this.humF=100;
 this.lvl=0;this.pos=0;this.lfo=0;this.dir=1;this.lastRev=0;this.subPh=0;this.ph=new Float64Array(24);this.svf=[0,0,0,0];this.dcL=0;this.dcR=0;this.dcxL=0;this.dcxR=0;
 this.port.onmessage=e=>{const m=e.data;if(m.rev!=null)this.rev=m.rev;if(m.root)this.root=m.root;if(m.realm!=null)this.realm=m.realm}}
 rnd(){let s=this.seed;s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;this.seed=s;return (s&0xffffff)/16777216}
 rr(a,b){return a+(b-a)*this.rnd()}
 spawn(kind,f,secs,amp,slideTo=1,slideSecs=1,ratio=1,idx=0){for(const b of this.blip)if(!b.on){Object.assign(b,{on:true,kind,ph:0,mph:0,f,amp,dec:Math.exp(-1/(secs*this.SR)),fm:Math.pow(slideTo,1/(slideSecs*this.SR)),pan:this.rr(-.7,.7),ratio,idx});return}}
 beat(a){this.spawn(0,64,.1,a,.55,.12);this.blip[0].pan*=.1}
 bed(c1,q1,g1,c2,q2,g2){const S=this.SR;this.bc=[Math.tan(Math.PI*Math.min(c1,S*.4)/S),1/q1,g1,Math.tan(Math.PI*Math.min(c2,S*.4)/S),1/q2,g2]}
 character(n,rev,root){const dt=n/this.SR;this.tt+=dt;this.next-=dt;this.humGate=0;const busy=.5+rev*1.5,due=this.next<=0,tt=this.tt,R=this.realm;
  if(this.dub>=0){this.dub-=dt;if(this.dub<0)this.beat(this.dubAmp*.75)}
  this.brPh+=dt*((R===12?.16:.28)+(R===12?.14:.3)*rev);if(this.brPh>=1)this.brPh-=1;const br=Math.pow(.5-.5*Math.cos(this.brPh*TAU),1.5),inb=this.brPh<.5?1:0;
  switch(R){
   case 0:this.bed(900+500*Math.sin(tt*.8),3,.5,2400+900*Math.sin(tt*.45+1),5,.25);break;
   case 1:this.bed(3500,1.5,.1*(.6+.4*Math.sin(tt*9)),700,1,.12);if(due){this.spawn(0,this.rr(150,320),.05,.5,.93,.05);this.next=this.rr(.25,.9)/busy}break;
   case 2:this.bed(420,.8,.32,1500,1,.06);if(due){this.spawn(0,this.rr(250,700),.07,.45,2.2,.07);this.next=this.rr(.05,.35)/busy}break;
   case 3:this.bed(500+400*Math.sin(tt*1.3)+300*Math.sin(tt*.36),6,.6,1800,2,.15);break;
   case 4:{const w=3000*Math.pow(2,-((tt*.05)%1)*2);this.bed(w,20,.12,150,1,.2);if(due){this.spawn(2,90,.09,.5,1,1,7.1,3);this.next=.5/(1+rev*3)}}break;
   case 5:this.bed(5200,1,.06,120,2,.1);this.humGate=this.rnd()<.55+.3*rev?.22:0;if(due){this.spawn(1,this.rr(2500,6000),.012,.5);this.next=this.rr(.02,.25)/busy}break;
   case 6:this.bed(140,1,.35,600,1,.04);if(due){this.dubAmp=.9;this.beat(.9);this.dub=.22;this.next=60/(50+rev*70)}break;
   case 7:this.bed(90,1,.9,2200,8,.1*(.5+.5*Math.sin(tt*5.3)*Math.sin(tt*1.7)));if(due){this.spawn(2,root/2,2.5,.5,1,1,1.41,2.5);this.next=this.rr(2.5,5)/busy}break;
   case 8:this.bed(5000,1,.04,300,1,.1);if(due){this.spawn(2,this.rr(900,1900),.25,.25,1,1,2.76,1.5);this.next=this.rr(.15,.8)/busy}break;
   case 9:this.bed(6500,1,.15*(.6+.4*Math.sin(tt*.9)),900,4,.12);if(due){this.spawn(1,this.rr(1800,4200),.03,.6);if(this.rnd()<.4)this.spawn(0,this.rr(2500,3800),.5,.1);this.next=this.rr(.3,1.6)/busy}break;
   case 10:this.bed(inb>0?1100:700,2.5,1*br,2600,3,.3*br);if(due){this.dubAmp=.35;this.beat(.35);this.dub=.24;this.next=60/(58+rev*50)}break;
   case 11:{const iv=[1,1.414,1.5,2,2.828];this.bed(4200+1500*Math.sin(tt*5.6),9,.1,400,1,.05);if(due){this.spawn(0,root*8*iv[(this.rnd()*5|0)%5],.35,.16,.5,.4);this.next=this.rr(.08,.3)/busy}}break;
   case 13:{const g=.5+.5*Math.sin(tt*.23)*Math.sin(tt*.61+1.3);this.bed(1700+1300*g,1.4,.06+.22*g,340,.9,.2+.12*g);if(due){if(this.rnd()<.3)this.spawn(0,46,.14,.5,.55,.14);this.spawn(1,this.rr(3500,7500),.008,.12+.2*g);this.next=this.rr(.04,.3)/busy}}break;
   default:this.bed(inb>0?260:180,1.2,1.6*br,900,1,.25*br);if(due){this.spawn(1,this.rr(1500,4000),.015,.3);this.next=this.rr(.05,.4)/busy}}
  this.humF=root}
 static bp(s,i,x,g,k){const hp=(x-(k+g)*s[i]-s[i+1])/(1+k*g+g*g),b=g*hp+s[i];s[i]=g*hp+b;const lo=g*b+s[i+1];s[i+1]=g*b+lo;return b}
 static lp(s,i,x,g,k){const hp=(x-(2*k+g)*s[i]-s[i+1])/(1+2*k*g+g*g),b=g*hp+s[i];s[i]=g*hp+b;const lo=g*b+s[i+1];s[i+1]=g*b+lo;return lo}
 static blep(t,dt){if(t<dt){t/=dt;return t+t-t*t-1}if(t>1-dt){t=(t-1)/dt;return t*t+t+t+1}return 0}
 saw(k,f){const dt=f/this.SR;let p=this.ph[k]+dt;if(p>=1)p-=1;this.ph[k]=p;return 2*p-1-M.blep(p,dt)}
 charSample(){const nz=this.rnd()*2-1,bc=this.bc,b1=M.bp(this.cb,0,nz,bc[0],bc[1])*bc[2],b2=M.bp(this.cb,2,nz,bc[3],bc[4])*bc[5];let l=b1+.6*b2,r=.6*b1+b2;
  if(this.humGate>0){this.humPh+=this.humF/this.SR;if(this.humPh>=1)this.humPh-=1;const h=(2*this.humPh-1)*this.humGate;l+=h;r+=h}
  for(const b of this.blip)if(b.on){b.ph+=b.f/this.SR;if(b.ph>=1)b.ph-=1;b.f*=b.fm;b.amp*=b.dec;if(b.amp<1e-4){b.on=false;continue}let x;
   if(b.kind===0)x=Math.sin(b.ph*TAU);else if(b.kind===1)x=(this.rnd()*2-1)*.7+Math.sin(b.ph*TAU)*.5;else{b.mph+=b.f*b.ratio/this.SR;if(b.mph>=1)b.mph-=1;x=Math.sin(b.ph*TAU+b.idx*b.amp*2*Math.sin(b.mph*TAU))}
   x*=b.amp;l+=x*(1-b.pan)*.7;r+=x*(1+b.pan)*.7}return[l,r]}
 process(ins,outs){const o=outs[0],L=o[0],R=o[1]||o[0],n=L.length,SR=this.SR,rev=this.rev,root=this.root;
  const d=rev-this.lastRev;this.lastRev=rev;if(d>2e-5)this.dir=1;else if(d<-2e-5)this.dir=-1;if(rev<1e-4&&this.lvl<1e-4)return true;
  const base=Math.max(10,root/8);this.character(n,rev,root);const rate=this.dir*(.035+.12*rev),wahHz=1.4+2.2*rev,drive=1.6+2.4*rev,cL=1-Math.exp(-1/(.09*SR)),hpC=1-TAU*18/SR,s=this.svf;
  for(let i=0;i<n;i++){this.lvl+=(rev-this.lvl)*cL;this.pos+=rate/SR;if(this.pos>=1)this.pos-=1;else if(this.pos<0)this.pos+=1;this.lfo+=wahHz/SR;if(this.lfo>=1)this.lfo-=1;
   const w0=.5-.5*Math.cos(this.lfo*TAU),wah=w0*Math.sqrt(w0);let sl=0,sr=0;
   for(let k=0;k<6;k++){const x=(k+this.pos)/6,win=.5-.5*Math.cos(x*TAU),f=base*Math.pow(2,k+this.pos);if(f>SR*.2)continue;const g=win*win/(1+Math.pow(f/150,1.3));
    const a=this.saw(k*4,f),b=this.saw(k*4+1,f*1.0045),c=this.saw(k*4+2,f*1.498),e=this.saw(k*4+3,f*1.498*.9962);sl+=g*(a+.55*c+.3*b);sr+=g*(b+.55*e+.3*a)}
   const fc=Math.min(SR*.2,70*Math.pow(2,.4+wah*(2+1.6*rev))),gq=Math.tan(Math.PI*fc/SR),kq=1/(2.6+2.2*rev);sl=M.lp(s,0,sl,gq,kq);sr=M.lp(s,2,sr,gq,kq);
   this.subPh+=root/4/SR;if(this.subPh>=1)this.subPh-=1;const sub=(Math.sin(this.subPh*TAU)+.5*Math.sin(this.subPh*2*TAU))*(.55+.45*w0);
   const amp=this.lvl*Math.sqrt(this.lvl)*(.72+.28*w0),l=Math.tanh((sl*1.1+sub*.55)*drive)*amp*.2,r=Math.tanh((sr*1.1+sub*.55)*drive)*amp*.2;
   this.dcL=l-this.dcxL+hpC*this.dcL;this.dcxL=l;this.dcR=r-this.dcxR+hpC*this.dcR;this.dcxR=r;
   const [cl,cr]=this.charSample(),cg=this.lvl*Math.sqrt(this.lvl)*.46;L[i]=this.dcL+cl*cg;if(R!==L)R[i]=this.dcR+cr*cg}
  return true}}
registerProcessor('bd-monad',M);`;
{/* V2's stones mapped to Ascension's realms (0 Dream .. 13 Sand, Dragon = 12) */
  const RLM={dream:0,nature:1,wet:2,breath:3,celestial:4,universe:4,magnetism:5,blood:6,animal:6,underworld:7,gold:8,freeze:9,lust:10,heat:12,dragon:12,magic:11,sand:13,wyrm:7};
  let node=null,boot=null;const realm=()=>RLM[typeof ENV==='string'?ENV:(ENV&&ENV.id)]??0;
  const make=()=>boot||(boot=A.ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([MONW],{type:'application/javascript'}))).then(()=>{node=new AudioWorkletNode(A.ctx,'bd-monad',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});const g=gn(A.ctx,MONAD_TRIM);node.connect(g);g.connect(MB('monBus'));g.connect(A.verb);return node}));
  const MONAD_TRIM=.6;/* the full Monad sits at about 0.075 RMS, loud enough to be felt, under the ceiling */
  let iv=null;const drive=()=>{if(!node)return;const r=window.REVV||0;node.port.postMessage({rev:r,root:hBase(),realm:realm()});if(!r&&!REV){clearInterval(iv);iv=null}};
  const start0=revStart;revStart=function(){const was=!!REV;start0.apply(this,arguments);if(!REV||was||!A.ctx||!A.ctx.audioWorklet)return;
    make().then(()=>{drive();if(!iv)iv=setInterval(drive,50)}).catch(()=>{})};
  /* the stage tones and stage bells are no longer struck: the voice carries the rise */
  revTick=function(){if(!REV)return;const el=(performance.now()-REV.t0)/1000,st=Math.min(4,Math.floor(el/1.8)),R=Math.min(1,el/9);window.REVV=R;pluck=Math.max(pluck,.35+R);
    if(st>REV.st){REV.st=st;$('#monP').textContent=STAGES[st];say(`monad · ${STAGES[st]} · the number ${[1,2,3,4,10][st]}`)}$('#monN').textContent=Math.round(R*100)};
  window.MONADV={get node(){return node},realm}}

/* ================= GROOVES: rhythm played live by the synth, in the styles of the loops =================
   Dub, liquid, temple, velvet, aura and nebula, each a sixteen-step pattern for a soft kick (a rounded 12 ms front, never a
   slap), a sub bass on the state's own scale and carrier, hushed shakers, and chord stabs into a dub echo. By default the
   tempo follows the beat: the beat rate times sixty, folded into 70 to 150 beats a minute, so a groove breathes with the
   state. Each bar walks a four-bar progression and varies a little, so it never loops exactly. Off until chosen. */
{const GR=[
   ['dub','Dub',140,{kick:[0,10],sub:[[0,0],[6,0],[10,4],[14,3]],stab:[4,12],shk:[2,6,10,14],prog:[0,0,3,4]}],
   ['liquid','Liquid',116,{kick:[0,7,10],sub:[[0,0],[3,2],[6,4],[8,0],[11,2],[14,5]],stab:[6],shk:[1,3,5,7,9,11,13,15],pad:1,prog:[0,5,3,4]}],
   ['temple','Temple',92,{tom:[[0,1],[3,.6],[6,.8],[8,1],[11,.6],[14,.7]],sub:[[0,0],[8,0]],shk:[4,12],pad:1,prog:[0,0,3,0]}],
   ['velvet','Velvet',84,{kick:[0,9],sub:[[0,0],[8,4]],stab:[],shk:[4,12],pad:2,prog:[0,3,5,4]}],
   ['aura','Aura',120,{kick:[0,4,8,12],sub:[[2,0],[6,0],[10,4],[14,0]],stab:[7,15],shk:[2,6,10,14],prog:[0,4,5,3]}],
   ['nebula','Nebula',70,{kick:[0],sub:[[0,0],[10,4]],stab:[],shk:[8],pad:2,prog:[0,5,3,4]}]];
  const G={cur:null,bus:null,echo:null,lp:null,level:.5,follow:true,step:0,next:0,bar:0,iv:null};
  const ctxOK=()=>!!A.ctx;
  const build=()=>{if(G.bus)return;const ctx=A.ctx;G.bus=gn(ctx,0);G.lp=bq(ctx,'lowpass',9000,.5);const out=gn(ctx,1);G.bus.connect(G.lp).connect(out);out.connect(A.master);
    /* the dub echo: a dotted eighth, darkened each time round */
    G.eIn=gn(ctx,1);G.dl=ctx.createDelay(2);G.fb=gn(ctx,.42);const dk=bq(ctx,'lowpass',1500,.6),hp=bq(ctx,'highpass',180,.6);G.eIn.connect(G.dl);G.dl.connect(dk).connect(hp).connect(G.fb).connect(G.dl);hp.connect(gn(ctx,.8)).connect(G.lp);
    G.bus.connect(A.verb);G.out=out};
  const bpm=()=>{if(!G.follow||!G.cur)return G.cur?G.cur[2]:100;let b=(S.beat||1.5)*60;while(b<70)b*=2;while(b>150)b/=2;return b};
  const base=()=>{let b=hBase();while(b>130)b/=2;while(b<55)b*=2;return b};
  const deg=(d,oct)=>{const sc=STATES[S.state].scale,n=sc.length;return base()*oct*sc[((d%n)+n)%n]*Math.pow(2,Math.floor(d/n))};
  const env=(g,t,a,lv,d)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(lv,t+a);g.gain.setTargetAtTime(0,t+a,d)};
  /* kick: a deep body with a rounded knock above it, so laptop and phone speakers hear the beat; soft 6 ms front, never a slap */
  const kick=(t,lv)=>{const ctx=A.ctx,o=ctx.createOscillator(),o2=ctx.createOscillator(),g=gn(ctx,0),g2=gn(ctx,0),f=bq(ctx,'lowpass',700,.6);
    o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(52,t+.12);o2.type='triangle';o2.frequency.setValueAtTime(240,t);o2.frequency.exponentialRampToValueAtTime(120,t+.05);
    env(g,t,.006,.95*lv,.11);env(g2,t,.006,.28*lv,.035);o.connect(f);o2.connect(g2).connect(f);f.connect(g).connect(G.bus);o.start(t);o2.start(t);o.stop(t+.8);o2.stop(t+.3)};
  const tom=(t,lv,f0)=>{const ctx=A.ctx,o=ctx.createOscillator(),g=gn(ctx,0);o.type='triangle';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f0*.78,t+.3);env(g,t,.014,.55*lv,.16);o.connect(g).connect(G.bus);o.start(t);o.stop(t+1)};
  /* bass: the note itself plus a soft octave above it (what small speakers can actually play), plucked short so it pulses */
  const sub=(t,f,dur,lv)=>{const ctx=A.ctx,o=ctx.createOscillator(),o2=ctx.createOscillator(),g=gn(ctx,0),fl=bq(ctx,'lowpass',900,.7);o.type='triangle';o.frequency.value=f;o2.frequency.value=f*2;
    o.connect(fl);o2.connect(gn(ctx,.32)).connect(fl);fl.connect(g).connect(G.bus);fl.frequency.setValueAtTime(900,t);fl.frequency.exponentialRampToValueAtTime(420,t+dur);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.4*lv,t+.012);g.gain.setTargetAtTime(.22*lv,t+.03,.12);g.gain.setTargetAtTime(0,t+dur*.85,.05);o.start(t);o2.start(t);o.stop(t+dur+.4);o2.stop(t+dur+.4)};
  const shk=(t,lv)=>{const ctx=A.ctx,s=ctx.createBufferSource(),g=gn(ctx,0),f=bq(ctx,'bandpass',4800,.8),l=bq(ctx,'lowpass',6500,.5);s.buffer=NB.white;env(g,t,.008,.16*lv,.025);s.connect(f).connect(l).connect(g).connect(G.bus);s.start(t,Math.random()*2,.2)};
  const stab=(t,root,lv,spb)=>{const ctx=A.ctx,g=gn(ctx,0),f=bq(ctx,'lowpass',1100,.9);f.connect(g);g.connect(G.bus);g.connect(G.eIn);
    [0,2,4].forEach((k,i)=>{const fr=deg(root+k,4);['sawtooth','triangle'].forEach((w,j)=>{const o=ctx.createOscillator();o.type=w;o.frequency.value=fr;o.detune.value=(j?7:-7)+i*2;o.connect(gn(ctx,j?.5:.25)).connect(f);o.start(t);o.stop(t+spb*2)})});
    f.frequency.setValueAtTime(1900,t);f.frequency.exponentialRampToValueAtTime(650,t+spb*1.2);env(g,t,.012,.15*lv,spb*.45)};
  const pad=(t,root,dur,lv)=>{const ctx=A.ctx,g=gn(ctx,0),f=bq(ctx,'lowpass',700,.5);f.connect(g).connect(G.bus);
    [0,2,4,7].forEach(k=>{const fr=deg(root+k,2);[-6,6].forEach(dt=>{const o=ctx.createOscillator();o.type='triangle';o.frequency.value=fr;o.detune.value=dt;o.connect(f);o.start(t);o.stop(t+dur+2)})});
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.04*lv,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur+.6)};
  /* the scheduler: looks 120 ms ahead every 30 ms, so every hit lands on its sample */
  const tick=()=>{if(!G.cur||!A.ctx)return;const ctx=A.ctx,P=G.cur[3],spb=60/bpm(),s16=spb/4;G.dl.delayTime.setTargetAtTime(spb*.75,ctx.currentTime,.3);
    if(G.next<ctx.currentTime-.25){G.next=ctx.currentTime+.02}/* fell far behind: pick up on time, never a burst */
    const ahead=document.hidden?1.3:.12;
    while(G.next<ctx.currentTime+ahead){const st=G.step%16,t=Math.max(G.next,ctx.currentTime+.005),bar=Math.floor(G.step/16),root=P.prog[bar%P.prog.length],sw=st%2?s16*.08:0,tt=t+sw,lv=1;
      if(st===0&&P.pad&&bar%P.pad===0)pad(tt,root,spb*4*P.pad,lv);
      (P.kick||[]).forEach(k=>{if(k===st&&!(bar%4===3&&st>8&&Math.random()<.4))kick(tt,lv)});
      (P.tom||[]).forEach(([k,v])=>{if(k===st)tom(tt,v*(.85+Math.random()*.3),deg(root,2))});
      (P.sub||[]).forEach(([k,d],i)=>{if(k===st){const nx=(P.sub[i+1]||[16])[0];sub(tt,deg(root+d,1),Math.max(.12,Math.min((nx-k)*s16*.92,spb*.85)),lv)}});
      (P.shk||[]).forEach(k=>{if(k===st&&Math.random()>.08)shk(tt,lv*(st%4===2?1:.7))});
      if(bar%2===1&&P.shk&&P.shk.length&&st===15&&Math.random()<.5)shk(tt+s16*.5,.6);
      (P.stab||[]).forEach(k=>{if(k===st&&!(bar%4===2&&Math.random()<.3))stab(tt,root,lv,spb)});
      G.step++;G.next+=s16}};
  const setLevel=()=>{if(G.bus&&A.ctx)G.bus.gain.setTargetAtTime(G.cur?G.level*GTRIM:0,A.ctx.currentTime,.4)};
  const GTRIM=.5;/* set by measurement (2026-11-27, after the voices moved up where speakers can play them): a groove at the middle of its slider sits near 0.05 */
  const play=id=>{if(!ctxOK())return say('enter first, then choose a groove');build();const g=GR.find(x=>x[0]===id);if(!g)return;G.cur=g;G.step=0;G.next=A.ctx.currentTime+.1;
    if(!G.iv)G.iv=setInterval(tick,30);setLevel();paint();say('groove · '+g[1]+' · '+Math.round(bpm())+' beats a minute'+(G.follow?' · following the beat':''))};
  const stop=()=>{G.cur=null;setLevel();clearInterval(G.iv);G.iv=null;paint()};
  /* in the Loops drawer, under its own heading */
  const d=$('#loops');let box=null;
  const paint=()=>{if(!box)return;box.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',!!G.cur&&c.dataset.g===G.cur[0]));box.querySelector('.grF').classList.toggle('on',G.follow)};
  if(d){box=document.createElement('div');box.className='grooves';box.innerHTML='<h4>Grooves, from the synth</h4><p class="vh">Played live in the key and scale of the state. They follow the beat unless you set them free.</p>'
      +'<div class="chips">'+GR.map(([id,n])=>`<button class="chip" data-g="${id}">${n}</button>`).join('')+'</div>'
      +'<label class="mrow"><span>groove level</span><input type="range" min="0" max="1" step=".01" value=".5" aria-label="groove level"></label>'
      +'<div class="vg" style="margin-top:8px"><button class="vb grF on" title="Tempo from the beat rate, or each groove at its own tempo">follow the beat</button><button class="vb grX">stop the groove</button></div>';
    d.querySelector('.dclose').after(box);
    box.addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;e.stopPropagation();
      if(x.dataset.g){if(G.cur&&G.cur[0]===x.dataset.g){stop();say('groove off')}else play(x.dataset.g)}
      else if(x.classList.contains('grF')){G.follow=!G.follow;paint();if(G.cur)say('groove · '+Math.round(bpm())+' beats a minute')}
      else if(x.classList.contains('grX')){stop();say('groove off')}});
    box.querySelector('input').addEventListener('input',e=>{G.level=+e.target.value;setLevel()})}
  const bl=liveList;liveList=function(){const R=bl();if(G.cur)R.push(['groove · '+G.cur[1],stop]);return R};
  const br=resetAll;resetAll=function(){if(G.cur)stop();return br.apply(this,arguments)};
  $('#bReset').onclick=()=>resetAll();
  window.GROOVE={play,stop,G,names:GR.map(g=>g[0])}}

/* the Monad's glow breathes at the beat: one swell per beat, slowed by whole octaves until it is calm enough to watch */
{const setP=()=>{let p=1/Math.max(.2,S.beat||1);while(p<.9)p*=2;document.documentElement.style.setProperty('--beatP',p.toFixed(3)+'s')};const ab=applyBeat;applyBeat=function(){const r=ab.apply(this,arguments);setP();return r};setP()}

/* ================= THE FOUR GROUPS: Vision, Sound, Rituals, Session =================
   The thirty-odd buttons that were spread over the top row, the menu at the lower right and the dial tabs are gathered
   into four panels. Each button is moved, not copied, so it keeps every behaviour it had. The top row keeps only the
   visualizer, the four groups, and hide panels (so the way back is always in reach). */
/* one switch for the keys' synths, in the Sound group: new is Ascension's voice, old is each instrument's original */
{const b=document.createElement('button');b.className='pill';b.id='bSynth';const p=()=>{b.textContent='synths: '+(window.VENG==='v2'?'old':'new');b.classList.toggle('on',window.VENG!=='v2')};
  b.title="New: the keys play on Ascension's voice. Old: each instrument's original sound. Voices, strings, nectar, breath and reed, electric and the dark have both.";
  b.onclick=e=>{e.stopPropagation();window.VENG=window.VENG==='v2'?'asc':'v2';p();say('synths · '+(window.VENG==='v2'?'old':'new'))};p();$('.rside').appendChild(b)}
{const GROUPS=[
   ['Vision','gVision','The visualizer, the machines that transmute it, flicker and possession.',['bDream','bPossess']],
   ['Sound','gSound','What plays: presets, the sound library, the Dream spells, loops and grooves, phantoms, the room, the mixer, and new or old synths.',['bSynth','bPresets','bBank','bDreamSp','bLoops','bPhantom','bRoom','bMixer','bTide','bBreath']],
   ['Rituals','gRituals','The workings: healing tones, body and trance programs, rites, the vowels and the forge.',['bHeal','bBody','bTrance','bRites','bVowels','bForge']],
   ['Session','gSession','Keep what you made: three quick slots, save and load a session, share it by link, record sound or video, play your own video.',['@slots','bSave','bShare','bLoad','bRec','bVid','bOwn']]];
  const build=()=>{const acts=document.querySelector('.acts');if(!acts||document.getElementById('gVision'))return;
    const row=document.createElement('div');row.className='grpRow';
    GROUPS.forEach(([name,id,line,ids])=>{
      const d=document.createElement('div');d.className='jelly drawer grpDr';d.id=id;d.hidden=true;
      d.innerHTML=`<button class="pill dclose">close</button><h3>${name}</h3><p class="vh">${line}</p><div class="grpGrid"></div>`;document.body.appendChild(d);DR.push(id);
      d.querySelector('.dclose').onclick=()=>{d.hidden=true};const grid=d.querySelector('.grpGrid');
      ids.forEach(bid=>{if(bid==='@slots'){const s=[...document.querySelectorAll('.acts .slot')];if(s.length){const w=document.createElement('div');w.className='grpSlots';s.forEach(x=>w.appendChild(x));grid.appendChild(w)}return}
        const b=document.getElementById(bid);if(b)grid.appendChild(b)});
      const g=document.createElement('button');g.className='pill grpBtn';g.id='b'+id;g.textContent=name;g.title=line;g.onclick=e=>{e.stopPropagation();openDr(id);paint()};row.appendChild(g)});
    const film=document.getElementById('bFilm'),hide=document.getElementById('bHide');(film||acts.firstChild)&&acts.insertBefore(row,film?film.nextSibling:acts.firstChild);if(hide)acts.appendChild(hide);{const dice=document.getElementById('bDice');if(dice)acts.insertBefore(dice,row)}
    const rs=document.querySelector('.rside');if(rs&&!rs.querySelector('button'))rs.classList.add('emptied');
    const paint=()=>GROUPS.forEach(([,id])=>{const g=document.getElementById('b'+id),d=document.getElementById(id);if(g&&d)g.classList.toggle('on',!d.hidden)});
    document.addEventListener('click',()=>setTimeout(paint,0));paint()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else setTimeout(build,0)}
/* the last hook on the keys: one call per key press for the cymatics plate and the key sigils, whatever voice or mode */
{const kOn=noteOn;noteOn=(id,i,vel=1)=>{kOn(id,i,vel);if(window.CYMKEY&&typeof id==='string'&&!id.includes('~'))CYMKEY(id,i,vel)}}
/* the side panels can be put away: a slim tab in the gutter beside each one hides it completely, so the picture shows
   through. The tab, a click where the panel was, or reset brings it back. Computers only; phones already use tabs. */
{const side=[['L','#shellL','hideL','states'],['R','#shellR','hideR','proof and stones']],tabs={};
  const desk=()=>!MOBILE&&innerWidth>1000;
  const place=()=>{side.forEach(([k,sel])=>{const t=tabs[k],sh=$(sel);if(!t||!sh)return;const r=sh.getBoundingClientRect(),ok=desk()&&r.height>40;t.hidden=!ok;if(!ok)return;
    t.style.top=(r.top+r.height/2-22)+'px';t.style.left=(k==='L'?Math.max(2,r.left-15):Math.min(innerWidth-14,r.right+3))+'px'})};
  const set=(k,v)=>{const sd=side.find(x=>x[0]===k);document.body.classList.toggle(sd[2],v);tabs[k].textContent=(k==='L')===v?'›':'‹';
    tabs[k].title=(v?'Show the ':'Hide the ')+sd[3]+' panel';tabs[k].setAttribute('aria-pressed',v)};
  side.forEach(([k,sel,cls,name])=>{const t=document.createElement('button');t.className='sideTab';t.dataset.k=k;document.body.append(t);tabs[k]=t;set(k,false);
    t.onclick=e=>{e.stopPropagation();set(k,!document.body.classList.contains(cls));say(document.body.classList.contains(cls)?name+' put away · click the tab or the space to bring it back':name+' back')};
    const sh=$(sel);if(sh)sh.addEventListener('click',e=>{if(document.body.classList.contains(cls)){e.stopPropagation();e.preventDefault();set(k,false);say(name+' back')}},true)});
  $('#bReset')&&$('#bReset').addEventListener('click',()=>side.forEach(([k])=>set(k,false)));
  addEventListener('resize',place);if(window.ResizeObserver){const ro=new ResizeObserver(place);side.forEach(([,sel])=>{const sh=$(sel);if(sh)ro.observe(sh)})}
  setInterval(place,1500);setTimeout(place,300)}
/* the Monad's glass reacts: the inverted hue turns faster with loudness, saturation and brightness rise with the sound,
   and a small throb rides the beat. Thirty updates a second on one element; paused while the page is hidden. */
{const m=$('#monad'),calm=matchMedia('(prefers-reduced-motion: reduce)').matches;let h=0,last=0,sm=0;if(m){const sw=document.createElement('div');sw.className='monSwirl';m.prepend(sw)}
  const go=now=>{requestAnimationFrame(go);if(!m||document.hidden||now-last<33)return;const dt=Math.min(.1,(now-last)/1000);last=now;
    const L=typeof lvl==='number'?lvl:0;sm+=(Math.min(.08,L)-sm)*Math.min(1,dt*5);const bt=S.beat||0,ph=bt>0&&bt<16&&!calm?Math.sin(now/1000*Math.PI*2*bt):0;
    h=(h+dt*(calm?4:9+sm*1400))%360;m.style.setProperty('--mh',h.toFixed(1)+'deg');
    m.style.setProperty('--ms',(1.5+sm*8+ph*.15).toFixed(2));m.style.setProperty('--mb',(.3+sm*1.4+ph*.025).toFixed(3));m.style.setProperty('--mr',(-h*.9).toFixed(1)+'deg');m.style.setProperty('--mo',Math.min(.7,.38+sm*4).toFixed(3));m.style.setProperty('--mz',(1+ph*.035+sm*.6).toFixed(3))};
  requestAnimationFrame(go)}
/* ================= THE DREAM SPELLS, as Ascension's Dream page =================
   Ascension's four spells (the chords that play themselves, in the Dragon stone) gathered in one guided drawer:
   1 the spell, 2 its level and how restless it is, 3 the engine's own shape, bloom, shimmer and width, 4 whether the spell
   also sets the beat, the carrier and the keys' scale, as it does in Ascension. Ascension's automatic bells stay out. */
{const SP=[['float','Float',6,136.1,'by state','Floating chords that drift from one to the next. Theta, 6 Hz.',{shape:1.3,bloom:.5,shimmer:.5,width:1}],
    ['choir','Choir',7.83,128,'overtones','A choir breathing between vowels on the overtone series. Schumann, 7.83 Hz.',{shape:2.2,bloom:.62,shimmer:.78,width:1}],
    ['rise','Rise',10,144,'timaeus',"Glass tones on Plato's scale with a tempo echo. Alpha, 10 Hz.",{shape:5.2,bloom:.72,shimmer:.62,width:1}],
    ['deep','Deep',2,108,'hirajoshi','Dark, slow and wide. Delta, 2 Hz, the edge of sleep.',{shape:.4,bloom:.22,shimmer:.35,width:1}]];
  const DL=[['shape',0,6,'Shape','The tone of the chords: soft and round at the bottom, glassy and rich at the top.'],['bloom',0,1,'Bloom','How slowly each chord swells in.'],
    ['shimmer',0,1,'Shimmer','The octave shine above the chords.'],['width',0,2,'Width','How wide the chords spread across the two ears.']];
  window.DOVR={};let lvl0=.5,drift=.5,sets=true;const id=i=>'e:dragon:'+i,cur=()=>SP.findIndex((x,i)=>id(i) in S.layers);
  const send=()=>{(window.DENG||[]).forEach(nd=>{try{nd.port.postMessage({t:'setMany',v:DOVR})}catch(_){}})};
  const d=document.createElement('div');d.className='jelly drawer';d.id='dreamSp';d.hidden=true;$('#loops').after(d);DR.push('dreamSp');
  const b=document.createElement('button');b.className='pill';b.id='bDreamSp';b.textContent='dream spells';b.title="Ascension's four Dream spells: chords that play themselves";$('.rside').insertBefore(b,$('#bLoops'));
  b.onclick=e=>{e.stopPropagation();paint();openDr('dreamSp')};
  const cast=i=>{const was=cur();SP.forEach((x,j)=>{if(j!==i&&id(j) in S.layers)setLayer(id(j),null)});if(i<0){say('the Dream rests');paint();return}
    const sp=SP[i];window.DOVR={};send();if(was!==i)setLayer(id(i),lvl0);
    if(sets){S.beat=sp[2];S.fc=sp[3];const ti=TUN.findIndex(t=>t[0]===sp[4]);tun=ti<0?0:ti;paintDial();applyBeat();const vx=$('#vox');if(vx&&vx._sync)vx._sync()}
    say('dream · '+sp[1]+' · '+sp[2]+' Hz'+(sets?' · beat, carrier and scale set':''));paint()};
  const paint=()=>{const c=cur(),sp=SP[c<0?0:c],val=k=>k in DOVR?DOVR[k]:sp[6][k];
    d.innerHTML='<button class="pill dclose">close</button><h3>Dream spells</h3><p class="vh">The chords that play themselves, from Black Dragon: Ascension. Pick a spell, then shape it.</p>'
      +`<div class="kstep pick"><h5><i>1</i>Spell <em>${c<0?'resting':SP[c][1]}</em></h5><div class="vg">${SP.map((x,i)=>`<button class="vb dsp${i===c?' on':''}" data-s="${i}">${x[1]} · ${x[2]} Hz</button>`).join('')}<button class="vb dsp${c<0?' on':''}" data-s="-1">rest</button></div><p class="vh">${c<0?'No spell is playing. Pick one to start the Dream.':SP[c][5]}</p></div>`
      +`<div class="kstep type"><h5><i>2</i>Level and drift</h5><label class="mrow"><span>level</span><input type="range" min="0" max="1" step=".01" value="${lvl0}" data-k="lvl" aria-label="Dream level"></label>`
      +`<label class="mrow"><span>drift</span><input type="range" min="0" max="1" step=".01" value="${drift}" data-k="drift" aria-label="drift"></label><p class="vh">Drift is how restless the Dream is: to the left it holds each chord longer, to the right it moves on sooner.</p></div>`
      +`<div class="kstep play"><h5><i>3</i>Sound</h5>${DL.map(([k,a,z,n])=>`<label class="mrow"><span>${n.toLowerCase()}</span><input type="range" min="${a}" max="${z}" step=".01" value="${val(k)}" data-k="${k}" aria-label="${n}"></label>`).join('')}<p class="vh">${DL.map(x=>x[4]).join(' ')} Picking a spell puts these back to its own.</p></div>`
      +`<div class="kstep opts"><h5><i>4</i>Spell sets the board</h5><div class="vg"><button class="vb dset${sets?' on':''}" data-v="1">on</button><button class="vb dset${sets?'':' on'}" data-v="0">off</button></div><p class="vh">On: a spell also sets the beat, the carrier and the keys' scale, as in Ascension. Off: it only plays its chords over whatever you have.</p></div>`;
    d.querySelector('.dclose').onclick=()=>{d.hidden=true}};
  d.addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.classList.contains('dclose'))return;e.stopPropagation();
    if(x.dataset.s!=null)cast(+x.dataset.s);else if(x.dataset.v!=null){sets=x.dataset.v==='1';paint();say(sets?'spells set the beat, carrier and scale':'spells only play their chords')}});
  d.addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;const v=+e.target.value;
    if(k==='lvl'){lvl0=v;const c=cur();if(c>=0)setLayer(id(c),v)}else if(k==='drift'){drift=v;window.DDRIFT=Math.pow(2,(.5-v)*2)}else{DOVR[k]=v;send()}});
  const br=resetAll;resetAll=function(){window.DOVR={};window.DDRIFT=1;drift=.5;lvl0=.5;return br.apply(this,arguments)};
  window.DREAMSP={cast,SP,get cur(){return cur()}}}
/* the board opens on the Dragon stone, with opal keys on one note (owner, 2026-11-27); reset comes back here too.
   A shared link that brings its own board is left as it is. */
{const w=setInterval(()=>{if(!A.ctx)return;clearInterval(w);setTimeout(()=>{if(!ENV&&!location.hash.startsWith('#b='))setEnv('dragon')},600)},300);
  const br=resetAll;resetAll=function(){const r=br.apply(this,arguments);if(!window.BLANKING){setEnv('dragon');say('reset · the board is back to its starting places')}return r}}
/* menus close with a click anywhere outside them (the keys bar is left out, so the instruments can be stepped through
   with the instrument page open); vision dials let the picture show while they turn; the Sound group sits with the keys */
document.addEventListener('click',e=>{if(e.target.closest('.drawer,.sideTab,#gate,#keysBar,#pads'))return;DR.forEach(d=>{const el=document.getElementById(d);if(el&&!el.hidden)el.hidden=true})});
{const off=()=>document.body.classList.remove('peek');
  document.addEventListener('pointerdown',e=>{const k=e.target.closest('.knob');if(k&&k.dataset.b==='v')document.body.classList.add('peek')},true);
  addEventListener('pointerup',off);addEventListener('pointercancel',off);addEventListener('blur',off)}
setTimeout(()=>{const g=document.getElementById('bgSound'),kb=document.getElementById('keysBar');if(g&&kb){kb.appendChild(g);g.classList.add('kbSound');g.textContent='soundbar';const h=document.querySelector('#gSound h3');if(h)h.textContent='Soundbar'}},120);

/* ================= ONE LIGHT WARNING, AT THE DOOR =================
   The board flickers and floods the screen in several places (the Dreamachine, the flicker, the Ganzfeld), so the warning
   lives at the entrance, shown once on a first visit and remembered, rather than inside any one room. */
{const KEY='bd-light-ok',ok=()=>{try{return sessionStorage.getItem(KEY)==='1'}catch(_){return false}},gate=$('#gate'),go=gate&&gate.onclick;
  if(gate&&go){const w=document.createElement('div');w.id='lightGate';w.hidden=true;
    w.style.cssText='position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.92);display:grid;place-items:center;padding:20px';
    w.innerHTML='<div style="width:min(520px,94vw);padding:24px 26px;border-radius:12px;background:rgba(14,10,10,.96);border:1px solid rgba(242,69,92,.45);color:var(--bone)">'
      +'<h3 style="font-family:var(--serif);font-size:28px;font-weight:600;margin-bottom:12px">Before you enter</h3>'
      +'<p style="font-size:15px;line-height:1.55;margin-bottom:18px">Black Dragon flickers and pulses light, and some rooms fill the whole screen with it. If you or anyone in your family has epilepsy or has ever had a seizure, keep the light features off. Stop at once if you feel unwell.</p>'
      +'<div style="display:flex;gap:10px;flex-wrap:wrap"><button id="lgEnter" class="pill">I understand · enter</button><button id="lgLeave" class="pill">not now</button></div></div>';
    document.body.appendChild(w);
    gate.onclick=e=>{if(ok())return go.call(gate,e);w.hidden=false};
    w.querySelector('#lgEnter').onclick=e=>{e.stopPropagation();try{sessionStorage.setItem(KEY,'1')}catch(_){}w.hidden=true;go.call(gate,e)};
    w.querySelector('#lgLeave').onclick=e=>{e.stopPropagation();w.hidden=true}}}

/* ================= THE OWNER'S LAYOUT PIECES (2026-11-27, evening) =================
   1 sounding now sits at the bottom of the board, under the keys (computers; phones keep it in the mix tab);
   2 the Vision panel opens on every visualizer at once, to pick from, above its other buttons;
   3 each side panel has a small x that puts it away (the tab in the gutter or a click in its space brings it back);
   4 the Soundbar opens on the Dream spells and dials: Dream level, drift and the spell's sound, the room, and the five levels. */
{const desk=()=>matchMedia('(min-width:1001px) and (pointer:fine)').matches;
  const css=document.createElement('style');css.textContent=`
  .deck>#live{grid-column:3;grid-row:1;align-self:start;justify-self:center;margin-top:40px;z-index:2;flex-wrap:wrap;justify-content:center;gap:5px;max-width:100%;min-height:0}
  .deck>#live>b{font-family:var(--tech);font-size:8.5px;letter-spacing:.14em;opacity:.6;margin-right:4px}
  @media (min-width:1001px) and (pointer:fine){#monad{width:180px;height:180px;align-self:center;margin-top:0}#monad b{font-size:40px}}
  .sbTabs{display:flex;gap:6px;margin:10px 0 4px;flex-wrap:wrap}.sbTabs .vb{flex:1 1 90px}
  .sbPane[hidden]{display:none!important}
  #transBar{display:none!important}
  .vzStep{display:flex;gap:6px;margin:8px 0}.vzStep .vzNow{flex:1}
  .vzGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin:10px 0 6px}
  .vzGrid button{min-height:42px;padding:4px 8px;font-size:12px;line-height:1.2;text-transform:lowercase}
  .vzGrid button b{display:block;font-family:var(--tech);font-size:10px;opacity:.7}
  .pnX{position:absolute;top:6px;right:8px;z-index:4;width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(0,0,0,.45);color:#eee;font:14px/18px var(--body);cursor:pointer;opacity:.6;padding:0}
  .pnX:hover{opacity:1;border-color:rgba(245,96,114,.8)}
  .sbSec{margin-top:12px}.sbSec h4{margin:0 0 6px}
  .sbDials{display:flex;flex-wrap:wrap;gap:12px 10px;justify-content:flex-start;padding:4px 2px}
  .sbDials .knob{width:62px}`;document.head.appendChild(css);

  /* 1 */
  const moveLive=()=>{const l=document.getElementById('live'),dk=document.querySelector('.deck'),kb=document.getElementById('keysBar');if(!l||!dk)return;if(desk()){if(l.parentNode!==dk)(kb&&kb.parentNode===dk?kb.after(l):dk.appendChild(l))}else{const r=document.getElementById('row2');if(r&&l.parentNode!==r)r.prepend(l)}};
  setTimeout(moveLive,0);addEventListener('resize',moveLive);

  /* 2 */
  const nm=f=>f.replace(/^(gate|film)-?\d*-?/,'').replace(/-/g,' ')||f;
  /* the Vision page holds the transmute machines themselves: press one to run the picture through it, off to stop */
  const tmBuild=()=>{const g=document.getElementById('gVision');if(!g||!window.TRANS)return false;if(g.querySelector('.tmGrid'))return true;
    const h=document.createElement('h4');h.textContent='Transmute';const grid=document.createElement('div');grid.className='vzGrid tmGrid';
    grid.innerHTML=TRANS.names.map((n,i)=>`<button class="vb" data-m="${i}">${n}</button>`).join('')+'<button class="vb" data-m="-1">off</button>';
    /* the visualizer itself, stepped from here: ‹ visualizer N of 33 › */
    const vh=document.createElement('h4');vh.textContent='Visualizer';const vrow=document.createElement('div');vrow.className='vg vzStep';
    vrow.innerHTML='<button class="vb" data-v="-1">‹</button><button class="vb vzNow" data-v="0"></button><button class="vb" data-v="1">›</button>';
    const vpaint=()=>{vrow.querySelector('.vzNow').textContent=`visualizer ${film+1} of ${FILMS.length}`};
    vrow.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;e.stopPropagation();const d=+b.dataset.v||1;setFilm(film+d);vpaint();say(`visualizer ${film+1} of ${FILMS.length}`)});
    g.querySelector('.vh').after(vh,vrow,h,grid);vpaint();const h2=document.createElement('h4');h2.textContent='More';grid.after(h2);
    const bt=document.getElementById('bTrans');if(bt)bt.hidden=true;const fz=document.getElementById('bFreeze');if(fz)fz.hidden=true;
    new MutationObserver(()=>{if(!g.hidden)vpaint()}).observe(g,{attributes:true,attributeFilter:['hidden']});
    const paint=()=>grid.querySelectorAll('[data-m]').forEach(b=>{const m=+b.dataset.m;b.classList.toggle('on',m<0?!TRANS.on:TRANS.on&&b.classList.contains('cur'))});
    grid.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;e.stopPropagation();const m=+b.dataset.m;
      if(m<0){if(TRANS.on)TRANS.set(false)}else{TRANS.pick(m);if(!TRANS.on)TRANS.set(true);else say('transmutation · '+TRANS.names[m]);grid.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('cur',x===b))}paint()});
    new MutationObserver(()=>{if(!g.hidden)paint()}).observe(g,{attributes:true,attributeFilter:['hidden']});paint();return true};
  const w2=setInterval(()=>{if(tmBuild())clearInterval(w2)},250);

  /* 3 */
  setTimeout(()=>[['#shellL','L'],['#shellR','R']].forEach(([sel,k])=>{const sh=document.querySelector(sel);if(!sh||sh.querySelector('.pnX'))return;
    if(getComputedStyle(sh).position==='static')sh.style.position='relative';const x=document.createElement('button');x.className='pnX';x.textContent='×';x.title='Put this panel away';x.setAttribute('aria-label','Put this panel away');
    x.onclick=e=>{e.stopPropagation();const t=document.querySelector(`.sideTab[data-k=${k}]`);if(t)t.click()};sh.appendChild(x)}),400);

  /* 4 */
  const knob=(label,get,set,fmt)=>{const d=document.createElement('div');d.className='knob';d.tabIndex=0;d.setAttribute('role','slider');d.setAttribute('aria-label',label);
    d.innerHTML=`<i></i><span>${label}</span>`;const paint=()=>d.style.setProperty('--v',get());let y0=null,v0=0;
    const put=v=>{v=clamp(v,0,1);set(v);paint();say(label+' · '+(fmt?fmt(v):Math.round(v*100)))};
    d.addEventListener('pointerdown',e=>{e.stopPropagation();d.setPointerCapture(e.pointerId);y0=e.clientY;v0=get()});d.addEventListener('pointermove',e=>{if(y0!=null)put(v0+(y0-e.clientY)/160)});
    ['pointerup','pointercancel'].forEach(t=>d.addEventListener(t,()=>{y0=null}));
    d.addEventListener('keydown',e=>{const u=e.key==='ArrowUp'||e.key==='ArrowRight',dn=e.key==='ArrowDown'||e.key==='ArrowLeft';if(u||dn){e.preventDefault();put(get()+(u?.04:-.04))}});
    d._paint=paint;paint();return d};
  const sbBuild=()=>{const g=document.getElementById('gSound');if(!g||!window.DREAMSP)return false;if(g.querySelector('.sbDream'))return true;
    const SP=DREAMSP.SP,id=i=>'e:dragon:'+i,R={shape:[0,6],bloom:[0,1],shimmer:[0,1],width:[0,2]};let lvl=.5,drift=.5;
    const spv=k=>{const c=DREAMSP.cur,sp=SP[c<0?0:c];return k in DOVR?DOVR[k]:sp[6][k]};
    const send=()=>(window.DENG||[]).forEach(nd=>{try{nd.port.postMessage({t:'setMany',v:DOVR})}catch(_){}});
    const dream=document.createElement('section');dream.className='sbSec sbDream';
    dream.innerHTML='<h4>Dream</h4><div class="vg sbSpells">'+SP.map((x,i)=>`<button class="vb" data-s="${i}">${x[1]} · ${x[2]} Hz</button>`).join('')+'<button class="vb" data-s="-1">rest</button></div><div class="sbDials"></div>';
    const dd=dream.querySelector('.sbDials'),ks=[];
    ks.push(knob('level',()=>lvl,v=>{lvl=v;const c=DREAMSP.cur;if(c>=0)setLayer(id(c),Math.max(.02,v))}));
    ks.push(knob('drift',()=>drift,v=>{drift=v;window.DDRIFT=Math.pow(2,(.5-v)*2)}));
    Object.keys(R).forEach(k=>{const [a,z]=R[k];ks.push(knob(k,()=>(spv(k)-a)/(z-a),v=>{DOVR[k]=a+v*(z-a);send()}))});
    ks.forEach(k=>dd.appendChild(k));
    const room=document.createElement('section');room.className='sbSec';room.innerHTML='<h4>Room</h4><div class="sbDials"></div>';
    const rd=room.querySelector('.sbDials');[['space','space'],['echo','echo']].forEach(([k,l])=>{const kn=knob(l,()=>S[k],v=>{S[k]=v;applyAll();if(typeof paintKnobs==='function')paintKnobs()});ks.push(kn);rd.appendChild(kn)});
    const lv=document.createElement('section');lv.className='sbSec';lv.innerHTML='<h4>Levels</h4><div class="sbDials"></div>';
    const ld=lv.querySelector('.sbDials');MXB.forEach(([k])=>{const kn=knob(k,()=>MIX[k],v=>{MIX[k]=v;applyMix();const m=document.querySelector(`#mixer input[data-k=${k}]`);if(m)m.value=v},v=>Math.round(v*200));ks.push(kn);ld.appendChild(kn)});
    /* every sound: the whole library, with the mix of what is playing (each with its level) at its head, lives on this page */
    const lib=document.createElement('section');lib.className='sbSec sbLib';lib.innerHTML='<h4>Every sound</h4>';const bank=document.getElementById('bank');
    if(bank){const i=DR.indexOf('bank');if(i>=0)DR.splice(i,1);bank.classList.remove('drawer','jelly');bank.hidden=false;const x=bank.querySelector('.dclose');if(x)x.remove();lib.appendChild(bank);
      const bb=document.getElementById('bBank');if(bb){bb.onclick=e=>{e.stopPropagation();openDr('gSound');window.SBSHOW&&SBSHOW(1)}}}
    const more=document.createElement('h4');more.textContent='More';more.className='sbSec';
    const grid=g.querySelector('.grpGrid');grid.before(dream,room,lv,lib,more);
    /* one part at a time: Dream, every sound, the mix (room and levels), and the rest */
    const mix=document.createElement('div');mix.className='sbPane';room.before(mix);mix.append(room,lv);
    const rest=document.createElement('div');rest.className='sbPane';more.before(rest);rest.append(more,grid);more.remove();
    dream.classList.add('sbPane');lib.classList.add('sbPane');
    const panes=[['Dream',dream],['Every sound',lib],['Mix',mix],['More',rest]],tabs=document.createElement('div');tabs.className='sbTabs';
    tabs.innerHTML=panes.map(([n],i)=>`<button class="vb" data-p="${i}">${n}</button>`).join('');g.querySelector('.vh').textContent='The Dream spells, every sound, the mix and the rest, one at a time.';g.querySelector('.vh').after(tabs);
    let pi=0;const show=i=>{pi=i;panes.forEach(([,el],j)=>{el.hidden=j!==i});tabs.querySelectorAll('.vb').forEach((b,j)=>b.classList.toggle('on',j===i))};show(0);
    tabs.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;e.stopPropagation();show(+b.dataset.p);g.scrollTop=0});
    window.SBSHOW=show;
    const paintSp=()=>dream.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',+b.dataset.s===DREAMSP.cur));
    dream.querySelector('.sbSpells').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;e.stopPropagation();DREAMSP.cast(+b.dataset.s);setTimeout(()=>{paintSp();ks.forEach(k=>k._paint())},50)});
    new MutationObserver(()=>{if(!g.hidden){paintSp();ks.forEach(k=>k._paint())}}).observe(g,{attributes:true,attributeFilter:['hidden']});paintSp();return true};
  const w4=setInterval(()=>{if(sbBuild())clearInterval(w4)},250)}

/* cymatics in the Proof panel, beside the test tone, sharing its row (owner, 2026-11-27) */
setTimeout(()=>{const b=document.getElementById('bScope'),t=document.getElementById('bTone');if(!b||!t||t.parentNode.classList.contains('ptRow'))return;
  const row=document.createElement('div');row.className='ptRow';t.before(row);row.append(b,t);
  const c=document.createElement('style');c.textContent='.ptRow{display:flex;gap:8px;margin-top:8px}.ptRow>button{flex:1 1 0;margin:0!important;min-height:30px;display:block}';document.head.appendChild(c)},700);

/* the codex on the home screen, in the top row beside Session (owner, 2026-11-27) */
setTimeout(()=>{const c=document.getElementById('bCodex'),ses=document.getElementById('bgSession');if(c&&ses&&ses.nextSibling!==c){ses.after(c);c.classList.add('grpBtn')}},400);

/* ================= REALM KEYS: each stone brings its Ascension realm voice to the keys (owner, 2026-11-27) =================
   Ascension's map (SOUND-SYSTEM-FOR-V2 and its REALM_VOICE): Dream opal keys, Nature moss reed, Water tide glass, Air cloud flute,
   Cosmos star pad, Electric arc lead, Blood heart strings, Underworld ash organ, Gold sun brass, Freeze frost bells, Lust velvet
   sigh, Magic fairy glass, Dragon dragon throat, Sand duduk (V2 has no 'sand keys'). V2's own stones take their realm's voice.
   Only a press on a stone does it, so start-up, reset and presets keep their own keys. */
{const RKV={dream:'opal keys',nature:'moss reed',wet:'tide glass',breath:'cloud flute',universe:'star pad',celestial:'star pad',magnetism:'arc lead',
    blood:'heart strings',animal:'heart strings',underworld:'ash organ',wyrm:'ash organ',gold:'sun brass',freeze:'frost bells',lust:'velvet sigh',
    magic:'fairy glass',dragon:'dragon throat',heat:'dragon throat',sand:'duduk'};
  window.REALMKEYS={voice:id=>RKV[id]};
  $('#stones').addEventListener('click',e=>{const b=e.target.closest('.stone');if(!b)return;setTimeout(()=>{const id=b.dataset.id,v=RKV[id];
    if(ENV!==id||!v)return;const i=VOICES.indexOf(v);if(i>=0&&i!==S.voice){setVoice(i);say(`${ENVS.find(x=>x.id===id).n.toLowerCase()} · keys: ${v}`)}},0)})}

/* ================= PRESS AGAIN TO SILENCE (owner, 2026-11-27) =================
   A state pressed while it is the one playing goes quiet: its beat tone and body chord fade out and no state is lit, so with
   nothing chosen there is no drone. Pressing any state brings its drone back at the levels it had. A preset pressed again
   clears the sounds it chose. Stones and library sounds already turn off on a second press. */
{let prev=null;const lit=()=>[...document.querySelectorAll('.st')].some(b=>b.classList.contains('on'));
  document.querySelectorAll('.st').forEach((b,i)=>{const go=b.onclick;b.onclick=e=>{
    if(S.state===i&&lit()){prev={tone:S.tone,body:S.body};S.tone=0;S.body=0;document.querySelectorAll('.st').forEach(x=>x.classList.remove('on'));applyAll();paintKnobs();say(STATES[i].name.toLowerCase()+' · off');return}
    if(!lit()&&prev){S.tone=prev.tone;S.body=prev.body;prev=null;paintKnobs()}return go.call(b,e)}});
  const P=document.getElementById('presets');if(P)P.addEventListener('click',e=>{const b=e.target.closest('.pb');if(!b||!b.classList.contains('on'))return;
    e.stopImmediatePropagation();b.classList.remove('on');clearLayers();const bp=document.getElementById('bPresets');if(bp)bp.textContent='presets';say(b.textContent.toLowerCase()+' · off')},true)}

/* the Monad follows the colour setting (owner, 2026-11-27): with cymatics on and 'colour · white', the oil-slick film on
   the glass turns white too, instead of staying a yellow-heavy rainbow; 'colour · film' keeps its colours */
{const sync=()=>{const c=document.getElementById('cymCol'),on=document.body.classList.contains('cymIn');document.body.classList.toggle('monWhite',!!(c&&on&&/white/.test(c.textContent)))};
  const css=document.createElement('style');css.textContent='body.monWhite .monSwirl{filter:blur(2.5px) saturate(0) brightness(1.15)!important}';document.head.appendChild(css);
  const w=setInterval(()=>{const c=document.getElementById('cymCol');if(!c)return;clearInterval(w);new MutationObserver(sync).observe(c,{childList:true,characterData:true,subtree:true});
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});sync()},300)}

/* the stone's sounds sit in the bottom-right box beside the keys (owner, 2026-11-27), where the old lower-right menu was:
   always in view, no scrolling inside the right panel. Computers only; phones keep them in the stones tab. */
{const desk=()=>matchMedia('(min-width:1001px) and (pointer:fine)').matches;
  const css=document.createElement('style');css.textContent=`.deck>#pads{grid-column:4;grid-row:1;align-self:stretch;overflow-y:auto;overflow-x:hidden;max-height:100%;padding:8px 10px;border-radius:14px;
    background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 2px 10px rgba(0,0,0,.6)}
  .deck>#pads h3{margin:0 0 2px;font-size:18px}.deck>#pads .vh{font-size:11px;margin:0 0 6px}.deck>.rside.emptied{display:none!important}`;document.head.appendChild(css);
  const home=document.getElementById('pads')?.parentNode,next=document.getElementById('pads')?.nextSibling;
  const place=()=>{const p=document.getElementById('pads'),dk=document.querySelector('.deck');if(!p||!dk)return;if(desk()){if(p.parentNode!==dk)dk.appendChild(p)}else if(home&&p.parentNode!==home)home.insertBefore(p,next&&next.parentNode===home?next:null)};
  setTimeout(place,500);addEventListener('resize',place)}

/* ================= CYMATICS IN THE MONAD OR THE CENTRE DIAL; VISUALIZER BY THE VISION DIALS; LIVING STONES (owner, 2026-11-27) ================= */
{const desk=()=>matchMedia('(min-width:1001px) and (pointer:fine)').matches;
  const css=document.createElement('style');css.textContent=`
  .cymDialHost{position:absolute;border-radius:50%;overflow:hidden;z-index:3;pointer-events:none}
  .cymDialHost canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;left:0!important;top:0!important;background:radial-gradient(circle,rgba(0,0,0,.35),rgba(0,0,0,.55) 75%)}
  body.cymDial #bHz,body.cymDial #bandN,body.cymDial #bandD{opacity:.12;transition:opacity .6s}
  body.cymDial #monad>span,body.cymDial #monad>b,body.cymDial #monad>i{opacity:1!important}
  .ktabs .visRow{display:inline-flex;gap:4px;margin-left:8px;vertical-align:middle}
  #bFreeze{display:none!important}
  /* the stones: each gem cut in facets of its own colour, a light that crosses it now and then, and the chosen one lit
     from inside, brightening with the sound it is making */
  .stone{position:relative;overflow:hidden}
  .stone i{width:20px!important;height:20px!important;border-radius:3px!important;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);
    background:conic-gradient(from 25deg,color-mix(in srgb,var(--c) 55%,#fff),var(--c) 12%,color-mix(in srgb,var(--c) 45%,#000) 25%,var(--c) 37%,color-mix(in srgb,var(--c) 70%,#fff) 50%,color-mix(in srgb,var(--c) 35%,#000) 62%,var(--c) 75%,color-mix(in srgb,var(--c) 60%,#fff) 87%,var(--c))!important;
    opacity:.75!important;box-shadow:none!important;filter:saturate(1.1)}
  .stone::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.16) 50%,transparent 62%);transform:translateX(-120%);animation:stGlint 11s ease-in-out infinite}
  .stone:nth-child(3n)::after{animation-delay:-4s}.stone:nth-child(3n+1)::after{animation-delay:-7.5s}
  @keyframes stGlint{0%,78%{transform:translateX(-120%)}92%,100%{transform:translateX(120%)}}
  .stone.on i{opacity:1!important;filter:saturate(1.3) brightness(calc(1 + var(--lv,0) * 1.6));box-shadow:none!important}
  .stone.on{box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 3px 0 #000,0 0 calc(6px + var(--lv,0) * 26px) color-mix(in srgb,var(--c) 70%,transparent)!important}
  @media (prefers-reduced-motion:reduce){.stone::after{animation:none}}`;document.head.appendChild(css);

  /* 1 cymatics: a place button in the plate bar: in the Monad, in the centre dial, or off */
  let place='monad';const host=document.createElement('div');host.className='cymDialHost';host.hidden=true;
  const fit=()=>{const d=document.getElementById('dial'),core=document.getElementById('core');if(!d||!core)return;if(host.parentNode!==core)core.appendChild(host);
    if(getComputedStyle(core).position==='static')core.style.position='relative';const cr=core.getBoundingClientRect(),r=d.getBoundingClientRect(),s=r.width*.5;
    host.style.width=host.style.height=s+'px';host.style.left=(r.left-cr.left+r.width/2-s/2)+'px';host.style.top=(r.top-cr.top+r.height/2-s/2)+'px'};
  const apply=()=>{const c=document.getElementById('cym'),c2=document.getElementById('cym2'),m=document.getElementById('monad');if(!c||!m||!desk())return;
    const on=document.body.classList.contains('cymIn');const inDial=on&&place==='dial';document.body.classList.toggle('cymDial',inDial);host.hidden=!inDial;
    if(inDial){fit();if(c.parentNode!==host){host.appendChild(c);if(c2)host.appendChild(c2)}c.classList.remove('inMon');c2&&c2.classList.remove('inMon')}
    else if(on&&c.parentNode===host){m.append(c);if(c2)c.after(c2);c.classList.add('inMon');c2&&c2.classList.add('inMon')}};
  const btn=document.createElement('button');btn.id='cymPlace';btn.title='Where the plate sits: in the Monad, in the centre dial, or off';
  const paint=()=>{btn.textContent='place · '+(place==='dial'?'centre':'monad')};
  btn.onclick=e=>{e.stopPropagation();if(place==='monad'){place='dial';apply();say('cymatics · in the centre dial')}else{place='monad';const x=document.getElementById('cymX');apply();if(x)x.click()}paint()};
  const w=setInterval(()=>{const bar=document.getElementById('cymBar'),big=document.getElementById('cymBig');if(!bar)return;clearInterval(w);if(desk()){(big||bar.lastChild).before(btn);if(big)big.hidden=true}paint();
    new MutationObserver(apply).observe(document.body,{attributes:true,attributeFilter:['class']});addEventListener('resize',()=>{if(place==='dial')fit()})},300);

  /* 2 the visualizer stepper and the dice sit with the vision dials */
  setTimeout(()=>{if(!desk())return;const kt=document.querySelector('.ktabs'),pv=document.getElementById('bFilmPrev'),f=document.getElementById('bFilm'),dc=document.getElementById('bDice');if(!kt||!f)return;
    const row=document.createElement('span');row.className='visRow';[pv,f,dc].forEach(x=>{if(x)row.appendChild(x)});kt.appendChild(row)},600);

  /* 3 the chosen stone brightens with the level of the stone sounds (the world bus), thirty times a second */
  let an=null,buf=null;const tick=()=>{requestAnimationFrame(tick);if(document.hidden||!A.ctx||!A.bankBus)return;if(!an){an=A.ctx.createAnalyser();an.fftSize=512;A.bankBus.connect(an);buf=new Float32Array(512)}
    an.getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i+=2)s+=buf[i]*buf[i];const rms=Math.sqrt(s/(buf.length/2));const st=document.querySelector('.stone.on');if(st)st.style.setProperty('--lv',Math.min(1,rms*9).toFixed(3))};
  requestAnimationFrame(tick)}

/* ================= EACH STONE BRINGS ITS OWN VISUALIZER (owner, 2026-11-27) =================
   Pressing a stone plays its clip, as each realm brings a video in Ascension (REALM_FILM). The owner is making new clips
   (blood for the Blood stone and so on): to use one, put it in media/ as name.mp4, add the name to FILMS, and set it here.
   Only a press on a stone changes the picture, so start-up and reset keep theirs. */
{const STONEFILM={dream:'film-13-slowmoving-art-piece',nature:'film-31-behind-glowing-plants',wet:'film-26-underwater-gothic-cemetery',
    breath:'film-35-static-horror-clouds',universe:'film-39-beautiful-view-city',magnetism:'film-28-eye-cat-cat',blood:'gate-04-red-sky',
    underworld:'film-22-king-stays-shrouded',gold:'film-08-liminal',freeze:'film-37-women-braces-long',lust:'film-45-everything-inside-gel',
    magic:'film-20-white-unicorn-runs',dragon:'film-25-dragon-entering-water',sand:'gate-serpent',celestial:'film-41-slow-dreamy-mist',
    animal:'film-28-eye-cat-cat',heat:'gate-01-red-tide',wyrm:'film-23-shadow-king-waits'};
  window.STONEFILM=STONEFILM;
  $('#stones').addEventListener('click',e=>{const b=e.target.closest('.stone');if(!b)return;setTimeout(()=>{const id=b.dataset.id;if(ENV!==id)return;const own=document.getElementById('bOwn');if(own&&own.classList.contains('on'))return;
    const i=FILMS.indexOf(STONEFILM[id]);if(i>=0&&i!==film)setFilm(i)},0)})}

/* ================= TAKE IT WITH YOU, AND SAND YOU CAN DRAG (owner, 2026-11-27) =================
   Every tone on the healing table carries a small ↓: thirty seconds of that exact sine as a 24-bit WAV, the frequency in
   the file name (black-dragon-528.00Hz.wav), soft in and out, ready for anyone's own track. The beat bank has no ↓: a
   beat is not a tone on its own. And the cymatics plate can be dragged: from the middle to the rim, the carrier tone
   rises from 60 to 600 Hz on a smooth curve, and the sand gathers into the figure of each tone as you move. */
{const css=document.createElement('style');css.textContent=`.hb{position:relative}.hb .tkDl{position:absolute;top:3px;right:5px;font-size:12px;line-height:1;opacity:.55;padding:2px 3px;border-radius:4px;cursor:pointer}
  .hb .tkDl:hover{opacity:1;background:rgba(255,255,255,.12)}#cym.dragOn{cursor:crosshair}`;document.head.appendChild(css);
  const take=hz=>{const sr=48000,n=sr*30,L=new Float32Array(n),R=new Float32Array(n),w=2*Math.PI*hz/sr,fa=sr;
    for(let i=0;i<n;i++){const e=Math.min(1,i/fa,(n-1-i)/fa),v=Math.sin(w*i)*.5*e*e*(3-2*e);L[i]=v;R[i]=v}
    save(wav24(L,R,sr),`black-dragon-${(+hz).toFixed(2)}Hz.wav`);say(`take it with you · ${(+hz).toFixed(2)} Hz, 30 seconds`)};
  const deco=()=>{const b=HBANKS[hbank];if(b&&b.beat)return;document.querySelectorAll('#heal .hb').forEach(h=>{if(h.querySelector('.tkDl'))return;const d=document.createElement('span');
    d.className='tkDl';d.textContent='↓';d.setAttribute('role','button');d.title=`Take ${h.dataset.hz} Hz with you: a 30 second WAV of the exact tone`;d.dataset.dl=h.dataset.hz;h.appendChild(d)})};
  const bh0=buildHeal;buildHeal=function(){const r=bh0.apply(this,arguments);deco();return r};deco();
  document.getElementById('heal').addEventListener('click',e=>{const d=e.target.closest('.tkDl');if(!d)return;e.stopPropagation();e.preventDefault();take(+d.dataset.dl)},true);

  /* drag the sand */
  const hook=()=>{const c=document.getElementById('cym');if(!c||c._drag)return !!c;c._drag=1;c.classList.add('dragOn');c.style.pointerEvents='auto';c.style.touchAction='none';let on=false;
    const at=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,d=Math.min(1,Math.hypot(x,y)*2),f=60*Math.pow(10,d);
      const v=Math.log(f/40)/Math.log(15);if(knobEls&&knobEls.car)knobEls.car._set(v);else{S.fc=+f.toFixed(1);applyAll()}say(`the sand follows · ${S.fc.toFixed(1)} Hz`)};
    c.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();on=true;c.setPointerCapture(e.pointerId);at(e)},true);
    c.addEventListener('pointermove',e=>{if(on){e.stopPropagation();at(e)}},true);
    ['pointerup','pointercancel','lostpointercapture'].forEach(t=>c.addEventListener(t,e=>{if(on){on=false;e.stopPropagation()}},true));
    c.addEventListener('click',e=>e.stopPropagation(),true);return true};
  const w=setInterval(()=>{if(hook())clearInterval(w)},400)}
