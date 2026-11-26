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

/* ================= the sigil scope: the tone channel as a phosphor beam over the glass =================
   Left ear moves the beam across, right ear moves it up. Exact ratios hold still; a binaural pair rolls at the beat.
   It only listens: its own splitter and two small analysers on the tone channel, made once the sound has started. */
let TAP=null;const SL=new Float32Array(2048),SR=new Float32Array(2048);
function sigilTap(){if(TAP)return TAP;if(!A.ctx||!A.toneBus)return null;
  const sp=A.ctx.createChannelSplitter(2),l=A.ctx.createAnalyser(),r=A.ctx.createAnalyser();l.fftSize=r.fftSize=2048;A.toneBus.connect(sp);sp.connect(l,0);sp.connect(r,1);return TAP={l,r}}
{const c=$('#sigil'),x=c.getContext('2d'),close=$('#sigilX'),dprMax=MOBILE?1.5:2;let on=false,g=0,dpr=1;
  const b=document.createElement('button');b.className='pill';b.id='bScope';b.textContent='sigil scope';
  b.title='Draw the tone channel large over the glass as a phosphor beam: left ear across, right ear up. Exact ratios hold still.';$('#bTone').before(b);
  const sigSize=()=>{dpr=Math.min(devicePixelRatio||1,dprMax);c.width=Math.round(innerWidth*dpr);c.height=Math.round(innerHeight*dpr)};
  addEventListener('resize',()=>{if(on)sigSize()});
  /* glow passes for each beam speed: slow parts of the trace burn brighter, as on a real tube */
  const PASS=[[18,'255,130,34',.05],[7,'255,168,72',.16],[1.8,'255,238,206',.9]],SPEED=[1,.6,.34,.16];
  const sigDot=(cx,cy)=>{x.fillStyle='rgba(255,170,80,.05)';x.beginPath();x.arc(cx,cy,9*dpr,0,7);x.fill();x.fillStyle='rgba(255,225,180,.35)';x.beginPath();x.arc(cx,cy,1.8*dpr,0,7);x.fill()};
  const sigFrame=()=>{if(!on)return;requestAnimationFrame(sigFrame);const W=c.width,H=c.height,cx=W/2;let cy=H/2,R=Math.min(W,H)*.36;
    /* on a phone, draw in the open glass between the open panel and the close mark */
    if(MOBILE){const pr=$('#proof').getBoundingClientRect(),top=pr.height?pr.bottom:0,bot=close.getBoundingClientRect().top||innerHeight;if(bot-top>120){cy=(top+bot)/2*dpr;R=Math.min(W/2,(bot-top)/2*dpr)*.86}}
    x.globalCompositeOperation='destination-out';x.fillStyle='rgba(0,0,0,.45)';x.fillRect(0,0,W,H);x.globalCompositeOperation='lighter';
    const t=sigilTap();if(!t)return sigDot(cx,cy);t.l.getFloatTimeDomainData(SL);t.r.getFloatTimeDomainData(SR);
    let m=0;for(let i=0;i<2048;i++){const a=Math.abs(SL[i]),q=Math.abs(SR[i]);if(a>m)m=a;if(q>m)m=q}
    if(m<.002){g=0;return sigDot(cx,cy)}
    const tg=1/m;g=g?g+(tg-g)*.04:tg;if(m*g>1.08)g=1.04/m;const k=g*R;
    const N0=1024,P=[new Path2D(),new Path2D(),new Path2D(),new Path2D()],s1=R*.004,s2=R*.016,s3=R*.05;let px=cx+SL[N0]*k,py=cy-SR[N0]*k;
    for(let i=N0+1;i<2048;i++){const nx=cx+SL[i]*k,ny=cy-SR[i]*k,d=Math.hypot(nx-px,ny-py),p=P[d<s1?0:d<s2?1:d<s3?2:3];p.moveTo(px,py);p.lineTo(nx,ny);px=nx;py=ny}
    x.lineCap='round';for(let j=0;j<4;j++)for(const [w,col,a] of PASS){x.lineWidth=w*dpr;x.strokeStyle=`rgba(${col},${a*SPEED[j]})`;x.stroke(P[j])}};
  const set=v=>{on=v;c.hidden=close.hidden=!v;b.classList.toggle('on',v);
    if(v){sigSize();x.clearRect(0,0,c.width,c.height);g=0;requestAnimationFrame(sigFrame);say(A.ctx?'sigil scope · the tones write themselves on the glass':'sigil scope · it wakes with the sound')}else say('sigil scope off')};
  b.onclick=()=>set(!on);close.onclick=()=>set(false)}

/* ================= the small screen in Proof: spectrum, figure, seal ================= */
window.PEARL=0;
{const sp=$('#spec'),x=sp.getContext('2d'),names=['spectrum','figure','seal'],bl=new Float32Array(1024),br=new Float32Array(1024);sp.title='Press to change the view: spectrum, figure, seal';
  sp.addEventListener('click',()=>{window.PEARL=(window.PEARL+1)%3;say('proof screen · '+names[window.PEARL])});
  (function loop(){requestAnimationFrame(loop);if(!window.PEARL||!A.ctx)return;const W=sp.width,H=sp.height;x.clearRect(0,0,W,H);x.lineWidth=2;x.strokeStyle='#ffb454';x.beginPath();
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
        box.style.color=tot.late||tot.clip?'#fb6':'#9f9';box.style.borderColor=tot.late||tot.clip?'#c63':'#3a3';
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
  .umbraBtn{display:block;width:100%;margin:0 0 8px;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,120,150,.45);cursor:pointer;position:relative;overflow:hidden;
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
    u.innerHTML='Umbra<small>dark warmth · held</small>';u.onclick=()=>{umbIsOn()?umbraOff():umbraOn();umbPaint()};$('#pads h3').after(u);umbPaint()};
 const p0=paintPads;paintPads=()=>{p0();umbPaint()};
 const s0=setEnv;setEnv=(id,start)=>{s0(id,start);if(ENV!=='universe'&&umbIsOn())setLayer('umbra',null)};
 buildPads();paintPads()}
