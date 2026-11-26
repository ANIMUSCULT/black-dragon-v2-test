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
 {n:'chakra',tag:TR,note:'Seven solfeggio tones mapped to the seven centres of the body, with Om beneath.',
  t:[[396,'root'],[417,'sacral'],[528,'solar plexus'],[639,'heart'],[741,'throat'],[852,'third eye'],[963,'crown'],[136.1,'om']]},
 {n:'angel',tag:TR,note:'Repeating numbers read as messages. The tones are exact.',
  t:[[111,'111'],[222,'222'],[333,'333'],[444,'444'],[555,'555'],[666,'666'],[777,'777'],[888,'888'],[999,'999'],[1111,'1111']]},
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
  el.innerHTML=`<h3>Healing table</h3><p class="vh">Six banks of held tones. Press a tone to hold it; press again to let go. Hold as many as you like. Every held tone is measured in the Proof panel.</p>
  <div class="vg">${HBANKS.map((x,i)=>`<button class="vb bk" data-i="${i}">${x.n}</button>`).join('')}</div>
  <div class="note">${tg(b.tag)} ${b.note}</div>
  <div class="hgrid">${b.t.map(([hz,nm])=>`<button class="hb" data-hz="${hz}"><b>${hz}</b><span>${nm}</span></button>`).join('')}</div>
  ${b.beat?'':`<h4>Tone recipe</h4><div class="vg">${RECIPES.map((r,i)=>`<button class="vb rc" data-i="${i}" title="${r[1]}">${r[0]}</button>`).join('')}</div><p class="vh" id="rcNote" style="margin-top:8px">${RECIPES[recipe][1]}</p>`}
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
 {n:'Focus',tag:ST,why:'Sound and light at 40 Hz drove matching brain rhythms in MIT trials, and 40 Hz beats sped reaction times in adults with ADHD symptoms in a 2026 study. White noise helped in that study as well.',
  st:[[3,432,14,'isochronic',{text:'Settle on one task.'}],[3,528,18,'isochronic',{text:'Narrow.'}],[6,136.1,40,'isochronic',{tones:[40],layers:{white:.12},text:'Hold.'}]]},
 {n:'Vibro, 40 Hz',tag:ST,why:'Low-frequency sound felt through the body. Women with fibromyalgia reported large gains from 40 Hz sessions. Needs a subwoofer, a transducer cushion or strong headphones.',
  st:[[4,80,[10,6],'monaural',{tones:[40],breath:1,text:'Feel it in the chest.'}],[8,80,6,'monaural',{tones:[40,52],breath:1,text:'Let it move through.'}]]},
 {n:'Teeth',tag:TR,why:'The tones given for teeth and jaw, on a pain induction. Music and hypnosis ease dental pain and fear; dentists are now mending tooth roots with pulsed sound far above hearing.',
  st:[[4,285,3,'binaural',{tones:[285],breath:1,text:'Unclench the jaw.'}],[4,528,6,'binaural',{tones:[528],breath:1,text:'Tongue off the roof\nof the mouth.'}],[4,174,2,'binaural',{tones:[174],breath:1,text:'Cool. Distant.'}]]},
 {n:'Pineal',tag:TR,why:'The gland the old books call the third eye and the seat of the soul. It answers to darkness: it makes melatonin in the dark and stops in light, blue light most. So this plays the tones tradition gives the gland and takes the screen down to near black.',
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
  el.innerHTML=`<h3>${title}</h3><p class="vh">${intro}</p><div class="vg" style="margin:8px 0 4px">${[[.5,'short'],[1,'full'],[2,'long']].map(([m,l])=>`<button class="vb pl${m===plen?' on':''}" data-m="${m}">${l}</button>`).join('')}</div>`
    +list.map((p,i)=>{const t=p.st.reduce((a,s)=>a+s[0],0);return `<div class="prow"><div><b>${p.n}</b> <span class="vh">${Math.round(t*plen)} min</span><p>${tg(p.tag)}${p.why}</p></div><button class="vb prun" data-l="${id}" data-i="${i}">begin</button></div>`}).join('');
  el.prepend(keep)}
function buildAllProgs(){buildProgs('body','Body programs','Timed sessions that change the beat, hold tones, pace the breath and put words in the glass. Each tells you where it comes from.',BODY);
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
let tun=0;
{const d0=degFreq;degFreq=i=>{const sc=TUN[tun][1];if(!sc)return d0(i);const n=sc.length;let base=S.fc*2;while(base<150)base*=2;while(base>330)base/=2;return base*sc[((i%n)+n)%n]*Math.pow(2,Math.floor(i/n))}}
{const el=$('#vox'),box=document.createElement('div');box.innerHTML='<h4>tuning</h4><div class="vg" id="tunG">'+TUN.map((t,i)=>`<button class="vb tn${i?'':' on'}" data-i="${i}">${t[0]}</button>`).join('')+'</div>';
  el.querySelector('.vh').after(box);box.addEventListener('click',e=>{const b=e.target.closest('.tn');if(!b)return;e.stopPropagation();tun=+b.dataset.i;$$('.tn').forEach((x,i)=>x.classList.toggle('on',i===tun));say('tuning · '+TUN[tun][0])})}

/* ================= reset and volume ================= */
const DEF={...S,layers:{}};
function resetAll(){
  stopRun(true);revStop();if(possess)$('#bPossess').click();if(desc)stopDescent();if(silenced)silence(false);
  if(A.ctx){const t=A.ctx.currentTime;Object.keys(held).forEach(k=>{const h=held[k];h.g.gain.cancelScheduledValues(t);h.g.gain.setTargetAtTime(0,t,.05);h.os.forEach(o=>{try{o.stop(t+.4)}catch(_){}});delete held[k]});$$('.key.on').forEach(k=>k.classList.remove('on'))}
  if(ENV)setEnv(null);clearLayers();const vol=S.vol;Object.assign(S,DEF,{layers:{},vol});window.VMODE=null;FORGED=null;$('#seal').setAttribute('points','');$('#sealDot').setAttribute('opacity',0);
  setState(STATES.findIndex(x=>x.id==='hypnagogia'));setVoice(0);tun=0;$$('.tn').forEach((x,i)=>x.classList.toggle('on',!i));paintKnobs();applyAll();
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
  mk('bDice','dice','Throw the vision dials').onclick=()=>{const r=(a,b)=>+(a+Math.random()*(b-a)).toFixed(2);Object.assign(S,{vision:r(.3,1),trails:r(0,.8),twist:r(0,.6),mirrors:Math.random()<.5?0:r(.1,.9),warp:r(0,.6),hue:Math.random()<.5?0:r(0,1),split:r(.1,.8),speed:r(.15,.8),lens:r(.3,.75)});
    window.VMODE=Math.random()*6|0;paintKnobs();applyAll();say('dice · the vision is thrown')};
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
  b.title='Sand on a plate inside the centre dial. The tone you hear gathers the grains into its figure; a note kicks them into the air.';$('#bTone').before(b);
  bar.innerHTML='<span id="cymRead"></span><button id="cymShape" title="Change the plate"></button><span class="cymV"><button id="cymVp" title="Previous vision">‹</button><button id="cymVis" title="Change the vision"></button><button id="cymVn" title="Next vision">›</button></span><button id="cymTone" title="Change the tone recipe"></button><button id="cymBig" title="Lift the plate out of the dial, or set it back"></button><button id="cymKeep" title="Save this figure as an image">keep</button><button id="cymX" title="Close cymatics">close</button>';
  const rd=$('#cymRead'),bShape=$('#cymShape'),bVis=$('#cymVis'),bTone=$('#cymTone'),bBig=$('#cymBig');
  /* the grains are drawn as points */
  let P=null,U={},bufP=null;
  if(gl){const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
    P=gl.createProgram();
    gl.attachShader(P,sh(gl.VERTEX_SHADER,`attribute vec2 p;attribute float s;uniform float uSize,uT,uKick;uniform vec3 uTint;varying vec3 vC;
void main(){gl_Position=vec4(p.x*.985,-p.y*.985,0.,1.);float h=fract(s*7.13);
  vec3 sand=mix(vec3(1.),vec3(.93,.95,1.),h)+uTint*0.;
  float br=.72+.28*fract(s*13.7);float tw=step(.955,s)*pow(.5+.5*sin(uT*(2.+h*7.)+h*80.),8.)*1.8;
  vC=sand*(br+tw+uKick*.35);gl_PointSize=uSize*(.75+.65*fract(s*5.3));}`));
    gl.attachShader(P,sh(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 vC;
void main(){vec2 q=gl_PointCoord-.5;float d=length(q),a=smoothstep(.5,.3,d);float lit=1.-.12*smoothstep(0.,.55,length(q+vec2(.13,.13)));gl_FragColor=vec4(vC*lit*a,a);}`));
    gl.linkProgram(P);gl.useProgram(P);
    const bs=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bs);gl.bufferData(gl.ARRAY_BUFFER,seed,gl.STATIC_DRAW);const ls=gl.getAttribLocation(P,'s');gl.enableVertexAttribArray(ls);gl.vertexAttribPointer(ls,1,gl.FLOAT,false,0,0);
    bufP=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bufP);gl.bufferData(gl.ARRAY_BUFFER,pos,gl.DYNAMIC_DRAW);const lp=gl.getAttribLocation(P,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
    ['uSize','uT','uKick','uTint'].forEach(n=>U[n]=gl.getUniformLocation(P,n));gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA)}
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
  const cymNote0=noteOn;noteOn=(id,i,vel=1)=>{cymNote0(id,i,vel);if(!on||!A.ctx)return;const V=VOX[S.voice]||VOX[0],f=degFreq(i)*Math.pow(2,V.oct||0);if(!(f>0))return;
    keyHz=f;keyT=performance.now();kick=Math.max(kick,.6+.4*Math.min(1,vel));setHz(f);label()};
  const label=()=>{bShape.textContent='plate · '+SHP[shape];bVis.textContent=VISN[vis];bTone.textContent='tone · '+TONES[tone];bBig.textContent=big?'set in dial':'lift out';
    rd.textContent=!A.ctx?'the sand wakes with the sound':!reading?'waiting for a tone':`${hz.toFixed(1)} Hz · figure ${reading.m},${reading.n} · ${reading.grp} · ${reading.name}`};
  let box={x:0,y:0,s:0,v:false};
  const place=()=>{let cx,cy,s,v=true;
    if(big){cx=innerWidth/2;if(MOBILE){const top=12,bot=bar.getBoundingClientRect().top-8||innerHeight;cy=(top+bot)/2;s=Math.min(innerWidth*.96,bot-top)}else{s=Math.min(innerWidth*.8,innerHeight-236);cy=62+s/2}}
    else{const d=$('#dial').getBoundingClientRect();v=d.width>40;cx=d.left+d.width/2;cy=d.top+d.height/2;s=d.width*.7;
      if(!MOBILE&&v){const side=d.top-$('.acts').getBoundingClientRect().bottom<50;bar.classList.toggle('side',side);const bw=bar.offsetWidth,bh=bar.offsetHeight;
        if(side){bar.style.left=(d.right+8)+'px';bar.style.top=Math.max(4,cy-bh/2)+'px'}else{bar.style.left=clamp(cx,bw/2+6,innerWidth-bw/2-6)+'px';bar.style.top=Math.max(4,d.top-bh-6)+'px'}}}
    if(MOBILE){const sb=big||$('.hud').dataset.tab==='proof';if(bar.hidden===sb)bar.hidden=!sb}
    if(v!==box.v){box.v=v;c.style.visibility=v?'visible':'hidden'}
    if(!v)return false;
    if(Math.abs(box.s-s)>1||Math.abs(box.x-cx)>1||Math.abs(box.y-cy)>1){box.x=cx;box.y=cy;box.s=s;const dp=Math.min(devicePixelRatio||1,2);
      c.style.width=c.style.height=s+'px';c.style.left=(cx-s/2)+'px';c.style.top=(cy-s/2)+'px';const px=Math.round(s*dp);if(c.width!==px)c.width=c.height=px}
    return true};
  const draw=now=>{if(!on)return;requestAnimationFrame(draw);tick(now)};
  const tick=now=>{if(!gl)return;const dt=Math.min(.05,(now-(draw.l||now))/1000);draw.l=now;if(!place())return;T+=dt;
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
    gl.uniform1f(U.uSize,Math.max(1.3,c.width/(MOBILE?210:250)));gl.uniform1f(U.uT,T);gl.uniform1f(U.uKick,Math.min(1,kick));gl.uniform3f(U.uTint,tint[0],tint[1],tint[2]);gl.drawArrays(gl.POINTS,0,N);
    if(keep){keep=false;const o=document.createElement('canvas');o.width=o.height=1080;const x=o.getContext('2d');x.fillStyle='#050406';x.fillRect(0,0,1080,1080);
      x.beginPath();x.arc(540,500,452,0,TAU);x.fillStyle='#0b090d';x.fill();x.drawImage(c,90,50,900,900);
      x.fillStyle='rgba(255,205,210,.92)';x.textAlign='center';x.font='600 44px "Grenze Gotisch"';x.fillText(reading?reading.name:'Black Dragon II',540,1010);
      x.font='17px "Texturina"';x.fillText(`${SHP[shape]} plate · ${VISN[vis]} · ${TONES[tone]} · ${hz.toFixed(1)} Hz`,540,1048);
      o.toBlob(bl=>{save(bl,'black-dragon-sand-'+(reading?reading.name.toLowerCase()+'-':'')+hz.toFixed(1)+'hz.png');say('figure kept · '+(reading?reading.name:'saved'))},'image/png')}};
  const seat=()=>{c.classList.toggle('big',big);bar.classList.toggle('big',big);if(big)document.body.append(c);else $('#dial').before(c);document.body.classList.toggle('cymOpen',on&&big&&MOBILE);
    if(big||MOBILE){bar.style.left='';bar.style.top='';bar.classList.remove('side')}box.s=0;box.v=null;label()};
  const set=v=>{on=v;c.hidden=bar.hidden=!v;b.classList.toggle('on',v);document.body.classList.toggle('cymIn',v);big=v&&MOBILE;seat();
    if(v){lastF=0;draw.l=0;kick=1;requestAnimationFrame(draw);say(gl?'cymatics · the tone you hear gathers the sand':'this device cannot draw the plate')}else say('cymatics off')};
  b.onclick=()=>set(!on);$('#cymX').onclick=()=>set(false);$('#tabs').addEventListener('click',()=>{if(on&&big&&MOBILE){big=false;seat()}});
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
  const place=()=>{const b=$('#dial').getBoundingClientRect();if(!b.width)return;en.style.left=(b.left+b.width/2)+'px';en.style.top=(b.top+b.height/2)+'px';en.style.width=en.style.height=(b.width*.7)+'px'};
  place();addEventListener('resize',place);setTimeout(place,400);setTimeout(place,1500);
  if(!A.ctx){$('#veil').play().catch(()=>{});const order=[1,2,3,0,5,2],t0=performance.now();window.VMODE=order[0];
    let lastSwap=performance.now();
    const demo=setInterval(()=>{if(A.ctx){clearInterval(demo);window.VMODE=null;window.REVV=0;hintVis();return}
      /* walk through the visualizers too: a new one every four seconds, once the current one is actually playing */
      const v=$('#veil');if(performance.now()-lastSwap>4000&&v.readyState>=2&&!document.hidden){lastSwap=performance.now();setFilm(film+1)}
      const t=(performance.now()-t0)/1000,ph=(t%7)/7;window.VMODE=order[Math.floor(t/7)%order.length];window.REVV=ph>.8?Math.max(0,1-Math.abs(ph-.9)/.1)*.75:.12+.1*Math.sin(t*.5)},60)}}

/* ================= silence: empty the board so the sound is built up from nothing ================= */
function blankAll(){resetAll();Object.assign(S,{tone:0,body:0,air:0,close:0,tide:false});paintKnobs();applyAll();$('#bTide').classList.toggle('on',false);if(typeof paintLive==='function')paintLive();
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
 const umbraOn=()=>{
   if(!A.ctx)return;envPads('universe').forEach(k=>setLayer(k,null));
   setState(STATES.findIndex(x=>x.id==='desire'));
   Object.assign(S,{fc:+ROOT.toFixed(2),beat:.9,mode:'monaural',tone:.4,body:.45,air:0,close:0,space:.85,echo:.62,att:.72,rel:.8,tide:false,speed:.14,trails:.72,warp:.25,grain:.22,veil:.5,twist:0,mirrors:0});
   $('#bTide').classList.remove('on');tun=TUN.findIndex(t=>t[0]==='pythagorean');$$('.tn').forEach((x,i)=>x.classList.toggle('on',i===tun));
   setVoice(VOICES.indexOf('opium choir'));window.ENVCOL='#b1123c';paintDial();paintModes();paintKnobs();applyAll();setLayer('umbra',.6);
   say('umbra · you are held')};
 const umbraOff=()=>{setLayer('umbra',null);const e=ENVS.find(x=>x.id===ENV);window.ENVCOL=e?e.col:null;say('umbra · released')};
 const umbPaint=()=>{const u=$('#bUmbra');if(u)u.classList.toggle('on',umbIsOn())};
 const b0=buildPads;buildPads=()=>{b0();if(ENV!=='universe')return;const u=document.createElement('button');u.id='bUmbra';u.className='umbraBtn';u.title='Umbra: one press builds the whole soundscape. Press again to release it.';
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
  let IRB=null,IRP=null;const loadIR=()=>IRP||(IRP=fetch('media/audio/york-minster.wav').then(r=>r.arrayBuffer()).then(a=>A.ctx.decodeAudioData(a)).then(b=>IRB=b));
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

/* ================= THE TRANSMUTATION DECK: the clips run through five machines of the video underground =================
   A separate deck over the glass. It reads the playing clip as it is and passes it through emulations of
   1970s image machines. The visualizer itself is untouched underneath. */
{const c=$('#trans'),bar=$('#transBar'),nm=$('#transName'),v=$('#veil');
  const gl=c.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:false});
  const M=[['rutt-etra','The Rutt/Etra scan processor, 1972: the picture tube’s beam bent by brightness, so every scan line becomes a ridge of light and the image a relief of glowing wire.'],
    ['magnet','Nam June Paik and Shuya Abe, 1970: magnets and coils on the picture tube, driven by sound, bend the raster; a colorizer paints each grey a new hue.'],
    ['corridor','Video feedback: the camera turned on its own monitor, as Steina and Woody Vasulka worked it. Each frame falls into the last, an endless corridor.'],
    ['stargate','Douglas Trumbull’s slit-scan for 2001, 1968: light through a moving slit smeared into walls rushing past. Here the slit is the clip.'],
    ['droste','The Droste spiral after Escher’s Print Gallery, 1956: the picture curls into itself and repeats inward forever.']];
  let on=false,mode=0,P=null,CP=null,U={},tex=null,fb=[],cur=0,t0=performance.now(),lvl=0,an=null;
  const b=document.createElement('button');b.className='pill';b.id='bTrans';b.textContent='transmute';b.title='Open the Transmutation deck: the clip through five machines of 1970s video';($('#bOwn')||$('#bFilm')).after(b);
  bar.querySelector('.tmodes').innerHTML=M.map(([k],i)=>`<button data-i="${i}">${k}</button>`).join('');
  const VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS=`precision highp float;uniform sampler2D uV,uP;uniform vec2 uRes,uVR;uniform float uT,uL;uniform int uM;
#define PI 3.14159265
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
vec2 cov(vec2 uv){float sa=uRes.x/uRes.y,va=uVR.x/max(uVR.y,1.);vec2 q=uv-.5;if(sa>va)q.y*=va/sa;else q.x*=sa/va;return vec2(q.x+.5,.5-q.y);}
vec3 vid(vec2 uv){return texture2D(uV,cov(uv)).rgb;}
vec3 vidW(vec2 uv){uv=abs(fract(uv*.5+.5)*2.-1.);return vid(uv);}
vec3 pal(float x){return .5+.5*cos(6.2831*(x+vec3(0.,.33,.67)));}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
void main(){vec2 fc=gl_FragCoord.xy,uv=fc/uRes;vec2 p=(fc-.5*uRes)/min(uRes.x,uRes.y);float t=uT;vec3 col=vec3(0.);
  if(uM==0){float L=max(uRes.y/90.,3.),A=uRes.y*.11*(1.+uL*.6);float y=fc.y,k0=floor((y-A*1.2)/L),acc=0.;vec3 tint=vec3(0.);
    for(int i=0;i<40;i++){float k=k0+float(i);float yb=k*L;if(yb>y+L)break;vec2 su=vec2(uv.x,yb/uRes.y);vec3 cc=vid(su);float h=lum(cc);
      float yd=yb+h*A;float d=abs(y-yd);float g=exp(-d*d/1.6)+.25*exp(-d*d/18.);acc+=g;tint+=g*mix(vec3(.55,1.,.85),cc*1.6+.15,.55);}
    col=tint*.85;col+=vec3(.02,.04,.05)*smoothstep(1.,0.,length(p));}
  else if(uM==1){vec2 q=p;float r=length(q-vec2(.18*sin(t*.21),.12*cos(t*.17)));float tw=(.35+uL*1.4)/(r+.35);q=rot(tw*.6*sin(t*.3))*q;
    q.x+=sin(q.y*7.+t*1.3)*(.025+uL*.08);q.y+=sin(q.x*5.-t*.9)*.02;vec2 su=q*min(uRes.x,uRes.y)/uRes+.5;float g=lum(vidW(su));
    col=pal(g*1.6+t*.03)*(.25+g*1.1);col*=.85+.15*sin(fc.y*PI*.5);}
  else if(uM==2){vec2 q=rot(.012+uL*.02)*((uv-.5)*(.965-uL*.02))+.5;vec3 pr=texture2D(uP,q).rgb;pr=mix(pr,pr.gbr,.035);
    vec3 cv=vid(uv);float key=smoothstep(.28,.5,lum(cv));col=max(cv*key,pr*.975);col=mix(col,cv,.04);}
  else if(uM==3){float ay=abs(p.y),ax=abs(p.x);bool wall=ax*.75>ay;float d=wall?ax:ay;float z=.18/max(d,.002);float u=(wall?p.y:p.x)*z;float w=z*.9+t*(1.6+uL*2.);
    vec3 s=vidW(vec2(fract(u*.22+.5),fract(w*.035)));vec3 hue=pal(w*.02+(wall?.33:0.));s=pow(s,vec3(.75));col=mix(s,s*hue*2.,.5)*(2.1+uL*1.5)*smoothstep(0.,.1,d)*min(1.,z*.05+.3);col+=hue*.05*smoothstep(.08,0.,d);}
  else{float r=max(length(p),1e-4),a=atan(p.y,p.x);float r1=.18,r2=1.,sc=log(r2/r1),an=atan(sc/(2.*PI));vec2 lz=vec2(log(r),a);
    lz=rot(an)*lz*cos(an);lz.x=mod(lz.x-t*.18,sc)+log(r1);vec2 q=exp(lz.x)*vec2(cos(lz.y),sin(lz.y));col=vid(q*.5+.5);col*=.9+.1*cos(lz.y*6.);}
  gl_FragColor=vec4(col,1.);}`;
  /* the glass of an old tube, laid over every machine: soft scan lines, a little colour fringe toward the edges, the corners falling dark */
  const CF='precision mediump float;uniform sampler2D uP;uniform vec2 uRes;void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 d=(uv-.5)*.004;vec3 c=vec3(texture2D(uP,uv+d).r,texture2D(uP,uv).g,texture2D(uP,uv-d).b);vec2 p=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);c*=.9+.1*sin(gl_FragCoord.y*2.07);c*=smoothstep(1.25,.35,length(p*vec2(.9,1.1)));gl_FragColor=vec4(c,1.);}';
  const prog=(fs)=>{const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.bindAttribLocation(pr,0,'p');gl.linkProgram(pr);return pr};
  const mkFB=(w,h)=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
    const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindFramebuffer(gl.FRAMEBUFFER,null);return{t,f,w,h}};
  if(gl){P=prog(FS);CP=prog(CF);const q=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,q);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    ['uV','uP','uRes','uVR','uT','uL','uM'].forEach(n=>U[n]=gl.getUniformLocation(P,n));U.cP=gl.getUniformLocation(CP,'uP');U.cR=gl.getUniformLocation(CP,'uRes');
    tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]))}
  const size=()=>{const dp=Math.min(devicePixelRatio||1,MOBILE?1:1.25),w=Math.round(innerWidth*dp),h=Math.round(innerHeight*dp);if(c.width===w&&c.height===h&&fb.length)return;c.width=w;c.height=h;fb=[mkFB(w,h),mkFB(w,h)]};
  const level=()=>{if(!A.ctx)return 0;if(!an){an=A.ctx.createAnalyser();an.fftSize=1024;A.master.connect(an)}const d=new Float32Array(1024);an.getFloatTimeDomainData(d);let s=0;for(let i=0;i<1024;i+=2)s+=d[i]*d[i];return Math.min(1,Math.sqrt(s/512)*5)};
  const frame=now=>{if(!on)return;requestAnimationFrame(frame);if(!gl)return;size();lvl+=(level()-lvl)*.08;
    gl.bindTexture(gl.TEXTURE_2D,tex);if(v.readyState>=2){try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,v)}catch(_){}}
    const prev=fb[cur],next=fb[1-cur];gl.bindFramebuffer(gl.FRAMEBUFFER,next.f);gl.viewport(0,0,next.w,next.h);gl.useProgram(P);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(U.uV,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,prev.t);gl.uniform1i(U.uP,1);
    gl.uniform2f(U.uRes,next.w,next.h);gl.uniform2f(U.uVR,v.videoWidth||16,v.videoHeight||9);gl.uniform1f(U.uT,(now-t0)/1000);gl.uniform1f(U.uL,lvl);gl.uniform1i(U.uM,mode);gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,c.width,c.height);gl.useProgram(CP);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,next.t);gl.uniform1i(U.cP,0);gl.uniform2f(U.cR,c.width,c.height);gl.drawArrays(gl.TRIANGLES,0,3);cur=1-cur};
  const pick=i=>{mode=i;bar.querySelectorAll('.tmodes button').forEach((x,j)=>x.classList.toggle('on',j===i));nm.textContent=M[i][1];fb.forEach(f=>{gl.bindFramebuffer(gl.FRAMEBUFFER,f.f);gl.clear(gl.COLOR_BUFFER_BIT)});gl.bindFramebuffer(gl.FRAMEBUFFER,null)};
  const set=x=>{if(x&&!gl)return say('this device cannot run the deck');on=x;c.hidden=bar.hidden=!x;b.classList.toggle('on',x);document.body.classList.toggle('transOpen',x&&MOBILE);
    if(x){size();pick(mode);v.play&&v.play().catch(()=>{});requestAnimationFrame(frame);say('transmutation · '+M[mode][0])}else say('transmutation deck closed')};
  b.onclick=e=>{e.stopPropagation();set(!on)};bar.querySelector('.tclose').onclick=()=>set(false);
  bar.querySelector('.tmodes').onclick=e=>{const x=e.target.closest('button');if(!x)return;pick(+x.dataset.i);say('transmutation · '+M[mode][0])};
  $('#tabs').addEventListener('click',()=>{if(on&&MOBILE)set(false)})}

/* ================= THE DREAMACHINE: flicker watched through closed eyes =================
   After Brion Gysin and Ian Sommerville's Dreamachine and the Ganzflicker studies. The whole screen swells and
   falls as a soft sine at an exact rate; a faint layer of the clip lies under it to seed what appears.
   A plain seizure notice comes first and must be accepted. Any tap or key ends it, and it ends itself on its timer. */
{const R=$('#dream'),cv=$('#dreamC'),x=cv.getContext('2d'),gate=$('#dreamGate'),v=$('#veil');
  /* no saturated red: red flicker is the kind most likely to provoke a seizure. Deep amber stands in for it */
  const COL={gold:[255,176,72],white:[255,246,232],amber:[255,128,44]};
  const D={hz:10,depth:.45,col:'gold',seed:true,noise:true,min:10};let run=null,nz=null;
  const b=document.createElement('button');b.className='pill';b.id='bDream';b.textContent='dreamachine';b.title='The Dreamachine: soft flicker for closed eyes, after Brion Gysin';$('#bTrans').after(b);
  const paint=()=>{gate.querySelector('#dmHz').textContent=D.hz.toFixed(2);gate.querySelector('#dmDepth').value=D.depth;
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
    const ph=Math.sin(2*Math.PI*D.hz*(now-run.t0)/1000),lv=D.depth*env*(.5+.5*ph),c=COL[D.col];
    x.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${lv.toFixed(3)})`;x.fillRect(0,0,W,H)};
  const key=e=>{if(run&&!run.end){e.preventDefault();e.stopPropagation();stop('ended')}};
  const begin=()=>{gate.hidden=true;cv.hidden=false;sizeC();run={t0:performance.now(),end:0};if(D.noise)noiseOn();document.addEventListener('keydown',key,true);requestAnimationFrame(draw);
    say(`dreamachine · ${D.hz.toFixed(2)} hz · close your eyes`)};
  b.onclick=e=>{e.stopPropagation();open()};
  cv.addEventListener('pointerdown',()=>{if(run&&!run.end)stop('ended')});
  gate.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.col){D.col=t.dataset.col}else if(t.dataset.min){D.min=+t.dataset.min}else if(t.dataset.hz){D.hz=clamp(+(D.hz+ +t.dataset.hz).toFixed(2),4,14)}
    else if(t.id==='dmSeed')D.seed=!D.seed;else if(t.id==='dmNoise')D.noise=!D.noise;else if(t.id==='dmLeave'){R.hidden=true;return}else if(t.id==='dmEnter'){begin();return}paint()});
  gate.querySelector('#dmDepth').addEventListener('input',e=>{D.depth=+e.target.value});
  addEventListener('resize',()=>{if(run)sizeC()})}

/* ================= LOOPS: the grooves made for Varanus Salvation =================
   Sixteen bars cut from the middle of each track at its measured tempo, crossfaded at the seam so they repeat without
   a join. One plays at a time; a new one crossfades in. Haze closes a soft filter, squeezes the drum hits and sends the
   groove into a dark echo, so the beat can be anything from present to far away. Off until chosen; never on the tone channel. */
{const LP=[['dreamscape','Dreamscape',154.093,.1659],['aura-1','Aura I',167.795,.1917],['aura-2','Aura II',154.901,.1617],['dub-1','Dub I',171.429,.1854],['dub-2','Dub II',170.175,.184],
    ['garden-1','Garden I',166.306,.1763],['garden-2','Garden II',165.624,.176],['liquid-1','Liquid I',139.206,.1735],['liquid-2','Liquid II',115.995,.1931],['nebula-1','Nebula I',86.079,.1679],
    ['nebula-2','Nebula II',157.506,.1563],['pulse-1','Pulse I',116.346,.1382],['pulse-2','Pulse II',136.776,.1429],['temple','Temple',138.678,.2027],['velvet-1','Velvet I',162.609,.1807],['velvet-2','Velvet II',165.019,.1983]];
  const L={cur:null,name:'',bpm:0,haze:.4,level:.5,lock:false,g:null,buf:new Map(),busy:0};
  const d=document.createElement('div');d.className='jelly drawer';d.id='loops';d.hidden=true;$('#phantom').after(d);DR.push('loops');
  d.innerHTML='<button class="pill dclose">close</button><h3>Loops</h3><p class="vh">Grooves made for Varanus Salvation, each cut to sixteen bars at its own tempo so it repeats without a join. One plays at a time; choosing another crossfades into it. Haze takes the beat from present to far away.</p>'
    +'<div class="chips lpGrid">'+LP.map(([id,n,b])=>`<button class="chip" data-id="${id}" title="${Math.round(b)} beats a minute">${n}</button>`).join('')+'</div>'
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
  const load=id=>{if(L.buf.has(id))return Promise.resolve(L.buf.get(id));return fetch('media/audio/loops/'+id+'.flac').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>A.ctx.decodeAudioData(a))
    .then(x=>{L.buf.set(id,x);while(L.buf.size>3){const k=[...L.buf.keys()].find(k=>k!==id&&(!L.cur||k!==L.cur.id));if(!k)break;L.buf.delete(k)}return x})};
  const fadeOut=(c,s)=>{if(!c)return;const t=A.ctx.currentTime;c.f.gain.cancelScheduledValues(t);c.f.gain.setValueAtTime(c.f.gain.value,t);c.f.gain.linearRampToValueAtTime(0,t+s);setTimeout(()=>{try{c.src.stop()}catch(_){}try{c.f.disconnect()}catch(_){}},s*1000+150)};
  const lockBeat=()=>{if(!L.lock||!L.cur)return;const base=L.cur.bpm/240,k=Math.max(1,Math.round(S.beat/base)),nb=+(base*k).toFixed(3);S.beat=nb;paintDial();applyBeat();st(`${L.cur.name} · the beat tone is ${nb} Hz, ${k} pulses to each bar`)};
  const paint=()=>{d.querySelectorAll('.lpGrid .chip').forEach(x=>x.classList.toggle('on',!!L.cur&&x.dataset.id===L.cur.id));d.querySelector('#lpLock').classList.toggle('on',L.lock)};
  const play=id=>{if(!A.ctx)return say('enter first, then choose a loop');const row=LP.find(r=>r[0]===id),my=++L.busy;st('loading '+row[1]);
    load(id).then(buf=>{if(my!==L.busy)return;const G=build(),ctx=A.ctx,src=ctx.createBufferSource(),f=gn(ctx,0);src.buffer=buf;src.loop=true;src.connect(f).connect(G.in);
      const old=L.cur;L.cur={id,name:row[1],bpm:row[2],rms:row[3],src,f};src.start();f.gain.setValueAtTime(0,ctx.currentTime);f.gain.linearRampToValueAtTime(1,ctx.currentTime+(old?3:1.5));fadeOut(old,3);
      applyHaze();applyLevel();paint();st(`${row[1]} · ${Math.round(row[2])} beats a minute · sixteen bars`);lockBeat();say('loop · '+row[1])})
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
  g.append(mk('circle',{r:163,fill:'url(#gHalo)'}),rose('dRoseC',12,133,50,.2,.8),rose('dRoseD',9,128,78,.12,.6),rose('dRoseA',16,166,141,.3),rose('dRoseB',20,164,143,.22),
    mk('circle',{id:'dFilmIn',r:141.5,fill:'none',stroke:'url(#gFilm)','stroke-width':1.6,opacity:.45}),
    mk('circle',{id:'dPulse',r:141,fill:'none',stroke:'#fff','stroke-width':2}));
  $('#ticks').before(g);
  const rimG=mk('g',{'pointer-events':'none'});rimG.append(mk('circle',{id:'dFilmOut',r:196,fill:'none',stroke:'url(#gFilm)','stroke-width':5,opacity:.28}));d.querySelector('circle').after(rimG);
  {const h=$('#handle').children;h[0].setAttribute('r',9);h[0].setAttribute('stroke','none');h[1].setAttribute('r',3.5)}
  const paintDial0=paintDial;const tempo=()=>{let p=1/Math.max(.1,S.beat||6);while(p<.45)p*=2;$('#dPulse').style.animationDuration=Math.min(8,p).toFixed(3)+'s'};
  paintDial=function(){const r=paintDial0.apply(this,arguments);tempo();return r};tempo()}
