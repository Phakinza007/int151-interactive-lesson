import {units} from '../content/course.js';
import {createStore} from './store.js';
import {h} from './dom.js';
const store=createStore(),app=document.querySelector('#app');
const activities=units.flatMap(u=>u.activities.map(a=>({unit:u,activity:a})));
const completed=activities.filter(({unit,activity})=>store.isDone(unit.id,activity.id)).length;
const last=store.getLast();
const resume=activities.find(x=>x.unit.id===last?.unit&&x.activity.id===last.activity)||activities.find(x=>!store.isDone(x.unit.id,x.activity.id))||activities[0];
const href=(u,a)=>`lesson.html?u=${u.id}#${a.id}`;
app.replaceChildren(
 h('section',{class:'hub-intro'},h('div',{},h('p',{class:'course-label'},'INT151 · พื้นฐานการพัฒนา Frontend'),h('h1',{},'เขียนโค้ด แล้วเห็นหน้าเว็บเปลี่ยน'),h('p',{class:'intro-copy'},'เริ่มจาก JavaScript ไปถึง DOM, Events และ Storage อ่านทีละเรื่อง ลองเปลี่ยนโค้ด แล้วตรวจความเข้าใจด้วยแบบฝึก')),
 h('div',{class:'learning-summary'},h('span',{},`เรียนแล้ว ${completed} / ${activities.length} กิจกรรม`),h('progress',{max:activities.length,value:completed,'aria-label':'ความคืบหน้ารวม'}),h('span',{class:'muted'},'บันทึกโค้ดและความคืบหน้าใน browser นี้'))),
 h('section',{class:'resume-strip'},h('div',{},h('span',{class:'course-label'},'เตรียมควิซ · 14 ต.ค. 2569'),h('h2',{},'Client-side Storage: จุดที่ควรอ่านก่อนเข้าเรียน'),h('p',{},'Cookie และ Web Storage · สรุปจุดเน้น Code Choice หลายคำตอบ 12 ข้อ และแบบฝึกอ่าน Cookie · แนวฝึกจากบทเรียน ไม่ใช่ข้อสอบจริง')),h('a',{class:'button primary',href:'lesson.html?u=storage#quiz-14-oct'},'เปิดแนวควิซ →')),
 h('section',{class:'resume-strip'},h('div',{},h('span',{class:'muted'},last?'กลับมาเรียนต่อ':'เริ่มที่พื้นฐาน'),h('h2',{},resume.activity.title),h('p',{},`${resume.unit.week} · ${resume.unit.title}`)),h('a',{class:'button primary',href:href(resume.unit,resume.activity)},last?'เรียนต่อจากครั้งล่าสุด →':'เริ่มเรียน →')),
 h('div',{class:'section-heading'},h('h2',{},'เส้นทางเรียนของคุณ'),h('p',{class:'muted'},`${units.length} บท · ${activities.filter(x=>x.activity.type==='exercise').length} แบบฝึก · มี Live Preview สำหรับ DOM และ Events`)),
 h('ol',{class:'course-list'},units.map((unit,index)=>{
  const done=unit.activities.filter(a=>store.isDone(unit.id,a.id)).length;
  const exercises=unit.activities.filter(a=>a.type==='exercise');
  const passed=exercises.filter(a=>store.isDone(unit.id,a.id)).length;
  const next=unit.activities.find(a=>!store.isDone(unit.id,a.id))||unit.activities[0];
  return h('li',{},h('a',{class:'course-row',href:href(unit,next)},h('span',{class:'course-order','aria-hidden':'true'},String(index+1).padStart(2,'0')),
   h('div',{class:'course-info'},h('span',{class:'week'},unit.week),h('h3',{},unit.title),h('p',{},unit.goal)),
   h('div',{class:'course-state'},h('span',{},done===unit.activities.length?'เรียนครบแล้ว ✓':`${done}/${unit.activities.length} กิจกรรม`),h('progress',{max:unit.activities.length,value:done,'aria-label':`ความคืบหน้า ${unit.title}`}),h('span',{class:'muted'},`โจทย์ผ่าน ${passed}/${exercises.length}`)),h('span',{class:'course-arrow','aria-hidden':'true'},'→')));
 })),
 h('footer',{class:'course-footer'},h('p',{},'เนื้อหาจากโน้ตและ transcript คาบ INT151 ที่มีถึง Client-Side Storage · คำถามและข้อมูลตัวอย่างดัดแปลงเพื่อฝึก'),h('p',{class:'muted'},'โค้ดรันในพื้นที่ทดลองแยกจากหน้าเรียน · สำหรับฝึกและทบทวนด้วยตนเอง'))
);
