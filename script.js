const $=s=>document.querySelector(s),K='moodboard-v1',v=$('#v'),w=$('#w'),s=$('#s');
let D,S,U=[],sel=null,els={},E={x0:0,y0:0,x1:1600,y1:1000};
const wrap=o=>o&&o.pages?o:o&&o.notes?{cur:'p0',pages:{p0:{name:'Page 1',parent:null,...o}}}:null;
const norm=o=>{o=wrap(o);if(!o)return null;const ks=Object.keys(o.pages);if(!ks.length)return null;if(!o.pages[o.cur])o.cur=ks[0];
ks.forEach(k=>{const p=o.pages[k];p.name=p.name||'Page';p.notes=p.notes||{};p.links=p.links||[];p.view=p.view||{x:60,y:60,k:1};p.parent=null});return o};
try{D=norm(JSON.parse(localStorage.getItem(K)))}catch(e){}
D=D||norm({notes:{},links:[]});S=D.pages[D.cur];
const save=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){warn()}};
const snap=()=>{U.push(JSON.stringify({n:S.notes,l:S.links}));if(U.length>15)U.shift()};
function applyView(){const{x,y,k}=S.view;w.style.transform=`translate(${x}px,${y}px) scale(${k})`}
function ext(){$('#ex').style.cssText=`left:${E.x0}px;top:${E.y0}px;width:${E.x1-E.x0}px;height:${E.y1-E.y0}px`}
function grow(id){const n=S.notes[id],h=els[id].offsetHeight,P=100;
E.x0=Math.min(E.x0,n.x-P);E.y0=Math.min(E.y0,n.y-P);E.x1=Math.max(E.x1,n.x+n.w+P);E.y1=Math.max(E.y1,n.y+h+P);ext()}
function clamp(){const V=S.view,k=V.k,W=innerWidth,H=innerHeight;
V.x=(E.x1-E.x0)*k<=W?-E.x0*k:Math.min(-E.x0*k,Math.max(W-E.x1*k,V.x));
V.y=(E.y1-E.y0)*k<=H?-E.y0*k:Math.min(-E.y0*k,Math.max(H-E.y1*k,V.y))}
function extInit(){E={x0:0,y0:0,x1:1600,y1:1000};for(const id in S.notes)grow(id);ext();clamp();applyView()}
function place(id){const n=S.notes[id],e=els[id],t=e.querySelector('textarea');
e.style.cssText=`left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h?n.h+'px':'auto'}`;
e.classList.toggle('fx',!!n.h);
e.querySelector('.dl').textContent=n.d?'detail ↗':'';
e.querySelector('.td').textContent=n.d?'detail −':'detail +';
t.style.height='';if(!n.h){t.style.height='auto';t.style.height=Math.max(40,t.scrollHeight)+'px'}}
function mk(id){const n=S.notes[id],e=document.createElement('div');e.className='n';e.dataset.id=id;
e.innerHTML='<div class="bar"><span class="dl"></span><span class="mn"></span></div><div class="menu"><span class="td"></span><span class="fit">fit</span><span class="del">del</span></div><div class="im"></div><textarea spellcheck="false"></textarea><i class="rz"></i><i class="lk"></i>';
const t=e.querySelector('textarea');t.value=n.t;
t.oninput=()=>{n.t=t.value;if(!n.h)place(id);draw();save()};
w.appendChild(e);els[id]=e;imgs(id);place(id)}
function draw(tmp){let h='';
S.links.forEach(([a,b],i)=>{const A=S.notes[a],B=S.notes[b];if(!A||!B||!els[a]||!els[b])return;
const p=`x1="${A.x+A.w/2}" y1="${A.y+els[a].offsetHeight/2}" x2="${B.x+B.w/2}" y2="${B.y+els[b].offsetHeight/2}"`;
h+=`<line ${p} class="${sel&&sel.l===i?'on':''}"/><line ${p} class="hl" data-i="${i}"/>`});
if(tmp)h+=`<line ${tmp} class="on"/>`;s.innerHTML=h}
function mark(){for(const id in els){const on=!!sel&&sel.n===id;els[id].classList.toggle('sel',on);if(!on)els[id].classList.remove('open')}draw()}
function build(){w.querySelectorAll('.n').forEach(e=>e.remove());els={};for(const id in S.notes)mk(id);extInit();draw();save()}
function rm(id){snap();delete S.notes[id];S.links=S.links.filter(l=>l[0]!==id&&l[1]!==id);els[id].remove();delete els[id];sel=null;mark();save()}
function undo(){const r=U.pop();if(!r)return;const o=JSON.parse(r);S.notes=o.n;S.links=o.l;sel=null;build()}
const wp=e=>({x:(e.clientX-S.view.x)/S.view.k,y:(e.clientY-S.view.y)/S.view.k});
function drag(ev,move,end){const sx=ev.clientX,sy=ev.clientY;
const m=e=>move(e.clientX-sx,e.clientY-sy,e),u=e=>{removeEventListener('pointermove',m);removeEventListener('pointerup',u);end&&end(e)};
addEventListener('pointermove',m);addEventListener('pointerup',u)}
v.addEventListener('pointerdown',ev=>{
const t=ev.target,card=t.closest&&t.closest('.n'),id=card&&card.dataset.id,k=()=>S.view.k;
if(t.classList.contains('hl')){sel={l:+t.dataset.i};mark();return}
if(!card){sel=null;mark();const o={...S.view};
drag(ev,(dx,dy)=>{S.view.x=o.x+dx;S.view.y=o.y+dy;clamp();applyView()},save);return}
if(!sel||sel.n!==id){sel={n:id};mark()}
const n=S.notes[id];
if(t.closest('.bar')&&!t.matches('span')){snap();const g=wp(ev),off={x:g.x-n.x,y:g.y-n.y};let P={clientX:ev.clientX,clientY:ev.clientY},run=true;
const mv=()=>{const p=wp(P);n.x=p.x-off.x;n.y=p.y-off.y;place(id);grow(id);draw()};
const step=()=>{if(!run)return;const M=48,sp=14;let dx=0,dy=0;
if(P.clientX<M)dx=sp;else if(P.clientX>innerWidth-M)dx=-sp;
if(P.clientY<M)dy=sp;else if(P.clientY>innerHeight-M)dy=-sp;
if(dx||dy){S.view.x+=dx;S.view.y+=dy;clamp();applyView();mv()}
requestAnimationFrame(step)};
requestAnimationFrame(step);
drag(ev,(dx,dy,e)=>{P={clientX:e.clientX,clientY:e.clientY};mv()},()=>{run=false;save()})}
else if(t.classList.contains('rz')){ev.preventDefault();snap();const W=card.offsetWidth,H=card.offsetHeight;
drag(ev,(dx,dy)=>{n.w=Math.max(120,W+dx/k());n.h=Math.max(60,H+dy/k());place(id);grow(id);draw()},save)}
else if(t.classList.contains('lk')){ev.preventDefault();const A={x:n.x+n.w/2,y:n.y+card.offsetHeight/2};
drag(ev,(dx,dy,e)=>{const p=wp(e);draw(`x1="${A.x}" y1="${A.y}" x2="${p.x}" y2="${p.y}"`)},e=>{
const T=document.elementFromPoint(e.clientX,e.clientY),c=T&&T.closest('.n'),b=c&&c.dataset.id;
if(b&&b!==id&&!S.links.some(l=>(l[0]===id&&l[1]===b)||(l[0]===b&&l[1]===id))){snap();S.links.push([id,b]);save()}
draw()})}
});
v.addEventListener('click',e=>{const t=e.target,c=t.closest('.n');if(!c)return;const id=c.dataset.id,n=S.notes[id];
if(t.classList.contains('dl'))location.hash='#/'+id;
else if(t.classList.contains('mn'))c.classList.toggle('open');
else if(t.classList.contains('td')){snap();n.d=!n.d;c.classList.remove('open');place(id);save()}
else if(t.classList.contains('fit')){snap();n.h=null;c.classList.remove('open');place(id);draw();save()}
else if(t.classList.contains('del'))rm(id);
else if(t.classList.contains('rx')){snap();n.i.splice(+t.dataset.k,1);imgs(id);place(id);grow(id);draw();save()}});
v.addEventListener('dblclick',e=>{if(e.target.closest('.n'))return;snap();const p=wp(e),id=Date.now().toString(36)+Math.random().toString(36).slice(2,5);
S.notes[id]={x:p.x-130,y:p.y-20,w:260,h:null,t:'',d:false};mk(id);grow(id);sel={n:id};mark();save();els[id].querySelector('textarea').focus()});
v.addEventListener('wheel',e=>{const t=e.target;
if(!e.ctrlKey&&!e.metaKey&&t.tagName==='TEXTAREA'&&t.scrollHeight>t.clientHeight)return;
e.preventDefault();const V=S.view;
if(e.ctrlKey||e.metaKey){const k=Math.min(3,Math.max(.1,V.k*Math.exp(-e.deltaY*.01))),r=k/V.k;V.x=e.clientX-(e.clientX-V.x)*r;V.y=e.clientY-(e.clientY-V.y)*r;V.k=k}
else{V.x-=e.deltaX;V.y-=e.deltaY}
clamp();applyView();save()},{passive:false});
const q=$('#q');
q.oninput=()=>{const x=q.value.toLowerCase();v.classList.toggle('dim',!!x);
for(const id in els)els[id].classList.toggle('m',!!x&&S.notes[id].t.toLowerCase().includes(x))};
addEventListener('keydown',e=>{const ed=/^(TEXTAREA|INPUT)$/.test(e.target.tagName);
if((e.ctrlKey||e.metaKey)&&e.key==='f'){e.preventDefault();q.style.display='block';q.focus();return}
if(e.key==='Escape'){if(location.hash)location.hash='';q.value='';q.oninput();q.style.display='none';$('#b').style.display='none';$('#x').style.display='none';sel=null;mark();document.activeElement.blur();return}
if(ed)return;
if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();undo()}
if((e.key==='Delete'||e.key==='Backspace')&&sel){
if(sel.n)rm(sel.n);else if(sel.l!=null){snap();S.links.splice(sel.l,1);sel=null;mark();save()}}});
function route(){const m=location.hash.match(/^#\/(.+)/),id=m&&m[1],d=$('#d');
if(id&&S.notes[id]){d.style.display='flex';setDi(S.notes[id]);const t=d.querySelector('textarea');t.value=S.notes[id].t;
t.oninput=()=>{S.notes[id].t=t.value;els[id].querySelector('textarea').value=t.value;place(id);draw();save()};t.focus()}
else d.style.display='none'}
$('#d>div').onclick=()=>{location.hash=''};
addEventListener('hashchange',route);
const bx=$('#b'),bt=bx.querySelector('textarea');
$('#bk').onclick=()=>{bt.value=JSON.stringify(D);xo.style.display='none';bx.style.display='block';bt.select()};
$('#cl').onclick=()=>{bx.style.display='none'};
$('#ld').onclick=()=>loadText(bt.value);
addEventListener('resize',()=>{clamp();applyView()});
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const kids=p=>Object.keys(D.pages).filter(i=>D.pages[i].parent===p);
function tree(){let h='<div class="th" title="double-click a name to rename"><span>pages</span><span class="np">+ page</span></div>';
const walk=(p,d)=>kids(p).forEach(id=>{h+=`<div class="tr${id===D.cur?' cur':''}" data-id="${id}" style="padding-left:${8+d*14}px"><span class="nm">${esc(D.pages[id].name)}</span><span class="dp">del</span></div>`;walk(id,d+1)});
walk(null,0);$('#t').innerHTML=h}
function go(id,f){if(!D.pages[id]||(id===D.cur&&!f))return;D.cur=id;S=D.pages[id];U=[];sel=null;q.value='';q.oninput();build();tree()}
function addPage(){const id='p'+Date.now().toString(36)+Math.random().toString(36).slice(2,4);
D.pages[id]={name:'Page '+(Object.keys(D.pages).length+1),parent:null,notes:{},links:[],view:{x:60,y:60,k:1}};go(id,1)}
function delPage(id){const all=[id],st=[id];while(st.length){const c=st.pop();kids(c).forEach(k=>{all.push(k);st.push(k)})}
if(all.length>=Object.keys(D.pages).length)return;
const par=D.pages[id].parent,wasCur=all.includes(D.cur);all.forEach(k=>delete D.pages[k]);
if(wasCur){D.cur=par&&D.pages[par]?par:Object.keys(D.pages)[0];S=D.pages[D.cur];U=[];sel=null;build()}else save();tree()}
const T=$('#t');
T.addEventListener('click',e=>{const t=e.target;if(t.classList.contains('np'))return addPage();
const r=t.closest('.tr');if(!r||t.tagName==='INPUT')return;const id=r.dataset.id;
if(t.classList.contains('dp')){if(t.dataset.s)delPage(id);else{t.dataset.s=1;t.textContent='sure?';setTimeout(tree,2000)}return}
go(id)});
T.addEventListener('dblclick',e=>{const nm=e.target.closest('.nm');if(!nm)return;const id=nm.parentNode.dataset.id,i=document.createElement('input');
i.value=D.pages[id].name;i.maxLength=40;nm.replaceWith(i);i.focus();i.select();
i.onblur=()=>{D.pages[id].name=i.value.trim()||D.pages[id].name;save();tree()};
i.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')i.blur();if(e.key==='Escape'){i.value=D.pages[id].name;i.blur()}}});
let xall=false;const xo=$('#x'),xt=xo.querySelector('textarea');
function pageText(id,d){const P=D.pages[id],ids=Object.keys(P.notes).sort((a,b)=>P.notes[a].y-P.notes[b].y||P.notes[a].x-P.notes[b].x),num={};ids.forEach((k,i)=>num[k]=i+1);
let o='#'.repeat(d+1)+' '+P.name+'\n\n';ids.forEach(k=>{o+='['+num[k]+'] '+P.notes[k].t.trim()+((P.notes[k].i||[]).length?' [+'+P.notes[k].i.length+' image(s)]':'')+'\n\n'});
const L=P.links.filter(l=>num[l[0]]&&num[l[1]]);if(L.length)o+='Connections: '+L.map(l=>num[l[0]]+' - '+num[l[1]]).join(', ')+'\n\n';return o}
function exportText(){if(!xall)return pageText(D.cur,0).trim()+'\n';let o='';
const walk=(p,d)=>kids(p).forEach(id=>{o+=pageText(id,d);walk(id,d+1)});walk(null,0);return o.trim()+'\n'}
const showX=()=>{xt.value=exportText();xt.select()};
$('#xp').onclick=()=>{bx.style.display='none';xo.style.display='block';showX()};
$('#xa').onclick=e=>{xall=!xall;e.target.textContent=xall?'all pages':'this page';showX()};
$('#xl').onclick=()=>{xo.style.display='none'};
$('#xc').onclick=async e=>{const b=e.target;xt.select();try{await navigator.clipboard.writeText(xt.value)}catch(x){document.execCommand('copy')}b.textContent='copied';setTimeout(()=>b.textContent='copy',1200)};
$('#xs').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([xt.value],{type:'text/plain'}));
a.download=(xall?'all-pages':D.pages[D.cur].name).replace(/[^\w-]+/g,'_')+'.txt';a.click()};
function warn(){const n=$('#wn');n.style.display='block';clearTimeout(warn.t);warn.t=setTimeout(()=>n.style.display='none',6000)}
const imgsHTML=(n,rmv)=>(n.i||[]).map((m,k)=>`<div class="ib"><img ${m.s?`src="${esc(m.s)}"`:`data-id="${esc(m.id)}"`} style="aspect-ratio:${+m.w}/${+m.h}">${rmv?`<span class="rx" data-k="${k}">×</span>`:''}</div>`).join('');
function imgs(id){const n=S.notes[id],c=els[id].querySelector('.im');c.innerHTML=imgsHTML(n,1);hydrate(c);c.style.display=n.i&&n.i.length?'block':'none'}
function shrink(f){return new Promise(r=>{const fr=new FileReader();fr.onerror=()=>r(null);
fr.onload=()=>{const im=new Image();im.onerror=()=>r(null);
im.onload=()=>{const k=Math.min(1,1000/Math.max(im.width,im.height)),w=Math.round(im.width*k),h=Math.round(im.height*k),c=document.createElement('canvas');
c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,w,h);g.drawImage(im,0,0,w,h);
if(DB)c.toBlob(b=>r(b?{b,w,h}:null),'image/jpeg',.78);else r({s:c.toDataURL('image/jpeg',.78),w,h})};
im.src=fr.result};fr.readAsDataURL(f)})}
function newNote(){snap();const id=Date.now().toString(36)+Math.random().toString(36).slice(2,5),V=S.view;
S.notes[id]={x:(innerWidth/2-V.x)/V.k-130,y:(innerHeight/2-V.y)/V.k-60,w:260,h:null,t:'',d:false,i:[]};mk(id);grow(id);sel={n:id};mark();return id}
async function addImgs(fs,id){const P=S;for(const f of fs){const o=await shrink(f),n=P.notes[id];if(!o||!n)continue;let m=o;
if(o.b){const k=mid();try{await idbPut(k,o.b);m={id:k,w:o.w,h:o.h}}catch(e){warn();continue}}
if(P===S)snap();(n.i=n.i||[]).push(m);
if(P===S){imgs(id);place(id);grow(id);draw()}
const h=location.hash.match(/^#\/(.+)/);if(h&&h[1]===id&&P===S)setDi(n);save()}}
addEventListener('paste',e=>{const fs=[...(e.clipboardData?e.clipboardData.files:[])].filter(f=>f.type.startsWith('image/'));
if(!fs.length||e.target.tagName==='INPUT')return;e.preventDefault();
const h=location.hash.match(/^#\/(.+)/),c=e.target.closest&&e.target.closest('.n');
let id=h&&S.notes[h[1]]?h[1]:c?c.dataset.id:sel&&sel.n;if(!id||!S.notes[id])id=newNote();addImgs(fs,id)});
let DB=null;const urls={};
const mid=()=>'m'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,6);
const b2u=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.onerror=()=>r(null);f.readAsDataURL(b)});
const d2b=u=>{const[h,b]=u.split(','),t=h.match(/:(.*?);/)[1],a=atob(b),n=new Uint8Array(a.length);for(let i=0;i<a.length;i++)n[i]=a.charCodeAt(i);return new Blob([n],{type:t})};
const idb=()=>new Promise(r=>{try{const q=indexedDB.open('moodboard-img',1);q.onupgradeneeded=()=>q.result.createObjectStore('img');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null);q.onblocked=()=>r(null)}catch(e){r(null)}});
const idbPut=(k,b)=>new Promise((r,j)=>{const t=DB.transaction('img','readwrite');t.objectStore('img').put(b,k);t.oncomplete=()=>r();t.onerror=()=>j(t.error);t.onabort=()=>j(t.error)});
const idbGet=k=>new Promise(r=>{try{const q=DB.transaction('img').objectStore('img').get(k);q.onsuccess=()=>r(q.result||null);q.onerror=()=>r(null)}catch(e){r(null)}});
async function url(k){if(urls[k])return urls[k];const b=await idbGet(k);if(!b)return null;return urls[k]=await b2u(b)}
function hydrate(root){root.querySelectorAll('img[data-id]').forEach(async im=>{const u=await url(im.dataset.id);if(u)im.src=u})}
function setDi(n){const c=$('#d .di');c.innerHTML=imgsHTML(n,0);hydrate(c)}
async function migrate(){if(!DB)return;let ch=0;for(const p of Object.values(D.pages))for(const n of Object.values(p.notes))for(const m of n.i||[])
if(m.s){try{const k=mid();await idbPut(k,d2b(m.s));m.id=k;delete m.s;ch=1}catch(e){}}if(ch)save()}
function gc(){if(!DB)return;const used=new Set();for(const p of Object.values(D.pages))for(const n of Object.values(p.notes))(n.i||[]).forEach(m=>m.id&&used.add(m.id));
try{const q=DB.transaction('img').objectStore('img').getAllKeys();q.onsuccess=()=>q.result.forEach(k=>{const t=parseInt(String(k).slice(1).split('_')[0],36);
if(!used.has(k)&&Date.now()-t>7*864e5){try{DB.transaction('img','readwrite').objectStore('img').delete(k)}catch(e){}}})}catch(e){}}
async function fullJSON(){const o=JSON.parse(JSON.stringify(D));for(const p of Object.values(o.pages))for(const n of Object.values(p.notes))for(const m of n.i||[])
if(m.id&&!m.s){const b=DB&&await idbGet(m.id);if(b)m.s=await b2u(b)}return JSON.stringify(o)}
async function loadText(t){try{const o=norm(JSON.parse(t));if(!o)throw 0;D=o;await migrate();S=D.pages[D.cur];U=[];sel=null;build();tree();bx.style.display='none'}
catch(e){bt.value='Could not load: paste the full backup text and try again.';bx.style.display='block'}}
$('#bs').onclick=async()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([await fullJSON()],{type:'application/json'}));a.download='moodboard-backup.json';a.click()};
$('#bf').onclick=()=>$('#bi').click();
$('#bi').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(f)loadText(await f.text())};
(async()=>{DB=await idb();try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
await migrate();gc();applyView();build();route();tree()})();
