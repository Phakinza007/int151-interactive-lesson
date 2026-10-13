import {units} from '../content/course.js';
import {createStore} from './store.js';
import {h,labels,doneLabels} from './dom.js';
import {createPanel} from './panel.js';
const unit=units.find(u=>u.id===new URLSearchParams(location.search).get('u'));
const app=document.querySelector('#app'),toc=document.querySelector('#toc'),toggle=document.querySelector('#toc-toggle');
const store=createStore();let panel=null;
toggle.addEventListener('click',()=>{const open=toc.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
if(!unit){app.replaceChildren(h('h1',{},'ไม่พบบทเรียนนี้'),h('a',{href:'index.html'},'กลับหน้ารวมบทเรียน'));}
else{
 document.title=`INT151 · ${unit.title}`;
 function currentId(){try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}}
 function update(){
  const done=unit.activities.filter(a=>store.isDone(unit.id,a.id)).length;
  document.querySelector('#lesson-progress').replaceChildren(h('span',{},`${done}/${unit.activities.length}`),h('progress',{max:unit.activities.length,value:done,'aria-label':'ความคืบหน้าของบทนี้'}));
  for(const a of unit.activities){const badge=toc.querySelector(`[data-status="${a.id}"]`);if(badge)badge.textContent=store.isDone(unit.id,a.id)?doneLabels[a.type]+' ✓':labels[a.type];}
  const state=document.querySelector('#activity-state');if(state)state.textContent=store.isDone(unit.id,currentId())?'✓ ทำกิจกรรมนี้แล้ว':'';
 }
 const select=h('select',{'aria-label':'เปลี่ยนบทเรียน',onchange:event=>{
  const next=units.find(u=>u.id===event.target.value);const a=next.activities.find(a=>!store.isDone(next.id,a.id))||next.activities[0];
  location.href=`lesson.html?u=${next.id}#${a.id}`;
 }},units.map(u=>h('option',{value:u.id,selected:u.id===unit.id},`${u.week} · ${u.title}`)));
 toc.append(h('label',{class:'unit-select'},h('span',{},'บทเรียน'),select),h('p',{class:'sidebar-goal'},unit.goal),h('nav',{'aria-label':'กิจกรรมในบทเรียน'},unit.activities.map((a,i)=>h('a',{href:`#${a.id}`,class:'toc-link','data-activity':a.id},h('span',{class:'toc-number'},i+1),h('span',{},a.title,h('small',{'data-status':a.id},labels[a.type]))))));
 function render(){
  panel?.destroy();panel=null;
  const activity=unit.activities.find(a=>a.id===currentId());
  if(!activity){const a=unit.activities.find(a=>!store.isDone(unit.id,a.id))||unit.activities[0];location.replace(`#${a.id}`);return;}
  store.setLast(unit.id,activity.id);
  const index=unit.activities.indexOf(activity);
  const mark=()=>{store.markDone(unit.id,activity.id);update();};
  const article=h('article',{id:activity.id,class:'activity'},h('div',{class:'activity-meta'},h('span',{class:`kind kind-${activity.type}`},labels[activity.type]),h('span',{class:'muted'},`กิจกรรม ${index+1} / ${unit.activities.length}`),h('span',{id:'activity-state',class:'activity-state'})),h('h1',{tabindex:'-1'},activity.title));
  if(activity.teacher)article.append(h('aside',{class:'teacher-note'},h('strong',{},'ประเด็นจากคาบเรียน'),h('p',{},activity.teacher),h('small',{},'สรุปใจความจากโน้ต / transcript')));
  article.append(h('div',{class:'prose',html:activity.body}));
  if(activity.prediction){
   const p=activity.prediction,feedback=h('p',{class:'prediction-feedback',role:'status'});
   article.append(h('fieldset',{class:'prediction'},h('legend',{},'ก่อนลอง · ทายผล'),h('p',{},p.question),h('div',{class:'prediction-options'},p.choices.map((choice,i)=>h('label',{},h('input',{type:'radio',name:'prediction',onchange:()=>{feedback.textContent=`${i===p.answer?'✓ ทายถูก':'ลองทบทวน · คำตอบคือ '+p.choices[p.answer]} — ${p.explanation}`;}}),choice))),feedback,h('small',{class:'muted'},'คำถามฝึกคิด ไม่รวมความคืบหน้าของกิจกรรม')));
  }
  if(activity.type==='concept')article.append(h('button',{class:'button primary read-button',onclick:mark},'อ่านแล้ว ✓'));
  else{panel=createPanel(activity,unit.id,store,mark);article.append(panel.element);}
  article.append(h('details',{class:'sources'},h('summary',{},'แหล่งเรียนและขอบเขตตัวอย่าง'),h('p',{},`หัวข้อนี้อ้างอิง: ${activity.source}`),h('ul',{},unit.sources.map(s=>h('li',{},s))),h('p',{},'ตัวอย่างและ test case ดัดแปลงเพื่อฝึก ไม่ใช่ข้อความอ้างตรงหรือข้อสอบจริง')));
  const previous=unit.activities[index-1],next=unit.activities[index+1];
  article.append(h('nav',{class:'activity-navigation','aria-label':'ก่อนหน้าและถัดไป'},h('a',{class:'button quiet',href:previous?`#${previous.id}`:'index.html'},previous?'← ก่อนหน้า':'← หน้ารวม'),next?h('a',{class:'button',href:`#${next.id}`},'กิจกรรมถัดไป →'):h('a',{class:'button primary',href:'index.html'},'กลับเลือกบทถัดไป →')));
  app.replaceChildren(h('p',{class:'breadcrumb'},`${unit.week} / ${unit.title}`),article);
  for(const link of toc.querySelectorAll('[data-activity]')){if(link.dataset.activity===activity.id)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');}
  update();toc.classList.remove('open');toggle.setAttribute('aria-expanded','false');
  article.querySelector('h1').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
 }
 window.addEventListener('hashchange',render);window.addEventListener('pagehide',()=>panel?.destroy());render();
}
