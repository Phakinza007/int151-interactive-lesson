import {codeQuestions} from './code-questions.js?v=20261014-code-first';
const option=(text,correct,explanation)=>({text,correct,explanation});
const q=(id,title,assumption,code,options)=>({id,title,assumption,code,options,prompt:'อ่านโค้ดก่อน แล้วเลือกทุกตัวเลือกที่ถูก อย่าเพิ่งเปิดตารางไล่ค่า'});
const guides={
 js:{activity:'variables',question:q('teach-condition','return จบที่เงื่อนไขใด?','รันแต่ละตัวเลือกแยกกัน',`function rate(amount) {
  if (amount >= 500) return 0.05;
  if (amount >= 1000) return 0.1;
  return 0;
}`, [option('rate(1200) === 0.05',true,'1200 เข้า >= 500 แล้ว return ทันที'),option('rate(1000) === 0.1',false,'1000 เข้าเงื่อนไขแรกก่อนเช่นกัน'),option('rate(499) === 0',true,'499 ไม่เข้าเงื่อนไขทั้งสอง จึง return 0'),option('rate(500) === 0',false,'500 เข้า >= 500 จึงได้ 0.05')]),steps:[['amount = 1200','1200 >= 500 → true','return 0.05 และออกจากฟังก์ชัน'],['บรรทัด >= 1000','ไม่ถูกรัน','แม้เงื่อนไขนี้จะจริง แต่ฟังก์ชันจบไปแล้ว'],['amount = 499','ทั้งสองเงื่อนไข false','return 0']],takeaway:'อย่าดูแค่ว่ามีเงื่อนไขถูกหรือไม่ ต้องไล่ลำดับและจุด return ด้วย',experiment:'loop',change:'ย้าย let total = 0 เข้าไปในลูป แล้วเทียบ output กับเวอร์ชันเดิม',predict:'ทายว่าค่าที่สะสมจะหายเมื่อเริ่มรอบใหม่หรือไม่'},
 values:{activity:'reference',question:q('teach-reference','คัดลอกตัวแปรหรือคัดลอก Object?','พิจารณาหลังรันโค้ดทั้งหมด',`const a = {score: 1};
const b = a;
const c = {...a};
b.score = 9;`,[option('a.score === 9',true,'a กับ b ชี้ object เดียวกัน'),option('c.score === 9',false,'c เป็น object ใหม่ที่คัดลอก score เมื่อยังเป็น 1'),option('a === b',true,'ทั้งสองอ้างอิง object เดียวกัน'),option('a === c',false,'object คนละตัว แม้เคยมี property เท่ากัน')]),steps:[['const b = a','a และ b → object เดียวกัน','ไม่ได้สร้าง object ใหม่'],['const c = {...a}','c → object ใหม่ {score:1}','คัดลอกค่าตอนสร้าง c'],['b.score = 9','object ที่ a/b ชี้เปลี่ยนเป็น {score:9}','c.score ยังเป็น 1']],takeaway:'แยกการกำหนดตัวแปรใหม่กับการแก้ property; const ไม่ได้ห้ามแก้ property',experiment:'copy-date',change:'เปรียบเทียบ const alias = original กับ new Date(original) ก่อนเรียก setDate',predict:'ทายว่าการแก้ alias จะทำให้ original เปลี่ยนด้วยหรือไม่'},
 dom:{activity:'web',question:q('teach-nodes','นับ Node หรือ Element?','Browser parse HTML ตาม string นี้ ไม่มีช่องว่างหรือ newline ที่ไม่ได้แสดง',`const box = document.createElement('div');
box.innerHTML = 'hello<span>A</span><!-- note -->';`,[option('box.childNodes.length === 3',true,'มี text node, span element และ comment node'),option('box.children.length === 1',true,'children นับเฉพาะ span element'),option('box.firstChild.nodeType === 1',false,'firstChild เป็น text node จึง nodeType 3'),option('box.firstElementChild.tagName === "SPAN"',true,'firstElementChild ข้าม text/comment')]),steps:[['hello','Text node · nodeType 3','อยู่ใน childNodes แต่ไม่อยู่ใน children'],['<span>A</span>','Element · nodeType 1','อยู่ทั้งสอง collection'],['<!-- note -->','Comment · nodeType 8','อยู่เฉพาะ childNodes']],takeaway:'โจทย์ DOM ต้องนับชนิด node จริง รวม text จากช่องว่างถ้ามี อย่านับจาก tag อย่างเดียว',experiment:'inspect',change:'เพิ่มข้อความหรือช่องว่างรอบ element แล้วเทียบ childNodes กับ children',predict:'เขียนจำนวนทั้งสองแบบก่อน Run แล้วชี้ว่า node ใดทำให้จำนวนต่างกัน'},
 manipulation:{activity:'create',question:q('teach-collections','Live Collection กับ Static NodeList','ul เป็น element ที่มีอยู่; รันแต่ละตัวเลือกอ่านค่าหลัง append แล้ว',`ul.innerHTML = '<li>A</li>';
const live = ul.children;
const fixed = ul.querySelectorAll('li');
const item = document.createElement('li');
item.textContent = 'B';
ul.append(item);`,[option('live.length === 2',true,'children เป็น live collection จึงเห็น B ที่เพิ่ม'),option('fixed.length === 2',false,'querySelectorAll ได้ snapshot ตอนมีแค่ A'),option('fixed.length === 1',true,'NodeList เดิมไม่อัปเดตตาม DOM'),option('ul.querySelectorAll("li").length === 2',true,'เรียก query ใหม่หลัง append จึงเห็นทั้ง A และ B')]),steps:[['ก่อน append','live.length = 1; fixed.length = 1','ทั้งคู่เห็น A'],['append B','DOM มี A, B','live เปลี่ยนตาม DOM'],['หลัง append','live.length = 2; fixed.length = 1','ต้อง query ใหม่จึงได้ NodeList ที่เห็น B']],takeaway:'ถามเสมอว่า collection สร้างเมื่อไร และเป็น live หรือ static ก่อนนับหลังเปลี่ยน DOM',experiment:'live',change:'เพิ่ม li อีกหนึ่งตัวหลัง querySelectorAll แล้ว query ใหม่อีกครั้ง',predict:'ทายจำนวนใน live, NodeList เดิม และ NodeList ใหม่ให้ครบสามค่า'},
 events:{activity:'listener',question:q('teach-listeners','ถอด Listener ต้องเป็นฟังก์ชันตัวเดิม','ปุ่ม btn มีอยู่จริง ไม่มี listener อื่น เริ่ม count = 0 และ click สองครั้งตามโค้ด',`let count = 0;
const inc = () => count++;
btn.addEventListener('click', inc);
btn.removeEventListener('click', () => count++);
btn.click();
btn.removeEventListener('click', inc);
btn.click();`,[option('// หลัง click แรก count === 1',true,'arrow ที่ส่งให้ remove เป็นคนละ function จึงยังไม่ถอด inc'),option('// หลัง click สอง count === 2',false,'ก่อน click สองถอด inc ตัวจริงแล้ว'),option('// หลัง click สอง count === 1',true,'click สองไม่เพิ่ม count'),option('// removeEventListener ครั้งแรกถอด inc สำเร็จ',false,'โค้ดเหมือนกันไม่ได้หมายถึง function reference เดียวกัน')]),steps:[['addEventListener','บันทึก reference inc','ยังไม่เรียก inc'],['remove ด้วย arrow ใหม่','ไม่ตรง reference เดิม','click แรกจึงทำให้ count = 1'],['remove ด้วย inc','ตรง reference เดิม','click สอง count ยังคง 1']],takeaway:'เวลาเห็น handler ให้แยก “ส่งฟังก์ชัน” กับ “เรียกฟังก์ชัน” และติดตาม reference ที่ใช้ถอด',experiment:'trace',change:'เปรียบเทียบ listener ที่ใส่ capture: true กับ listener ที่ใช้ค่าปกติ',predict:'เขียนลำดับ outer/inner ที่คาดก่อนคลิก แล้วเทียบกับ Console'},
 'event-object':{activity:'target',question:q('teach-target','ใครถูกคลิก ใครผูก Listener?','HTML คือ <button id="btn"><span id="label">Go</span></button> และผู้ใช้คลิกตรง span; ไม่มี listener อื่น',`btn.addEventListener('click', event => {
  console.log(event.target.id);
  console.log(event.currentTarget.id);
});`,[option('// log แรกคือ "label"',true,'target คือ element ต้นทางที่ถูกคลิก'),option('// log ที่สองคือ "btn"',true,'currentTarget คือปุ่มที่กำลังเรียก handler นี้'),option('// log ทั้งสองคือ "btn"',false,'คลิกตรง span target จึงไม่ใช่ปุ่ม'),option('// handler ไม่ทำงานเพราะคลิก span',false,'click bubble จาก span มาถึงปุ่มตามเงื่อนไขโจทย์')]),steps:[['คลิก span','target = span#label','ต้นทาง event'],['event มาถึงปุ่ม','currentTarget = button#btn','element ที่ผูก listener'],['handler log','label แล้ว btn','target ไม่เปลี่ยนเป็นปุ่มเพียงเพราะ bubble']],takeaway:'วาดลูกศรจากจุดคลิกไปยัง element ที่ผูก listener ก่อนตอบ target/currentTarget',experiment:'inspect',change:'คลิกข้อความใน span เทียบกับพื้นที่ปุ่มรอบ span',predict:'ทายว่า log ใดเปลี่ยน และ log ใดคงเดิม'},
 forms:{activity:'submit',question:q('teach-submit','preventDefault หยุดอะไร?','form มีอยู่จริงและ dispatch event ตามโค้ดนี้ ไม่มี listener อื่น',`const logs = [];
form.addEventListener('submit', event => {
  event.preventDefault();
  logs.push('after');
});
const event = new Event('submit', {cancelable:true});
const result = form.dispatchEvent(event);`,[option('logs[0] === "after"',true,'preventDefault ไม่ได้ return ออกจาก handler'),option('event.defaultPrevented === true',true,'event ยกเลิกได้ จึงตั้ง flag ว่า default ถูกยกเลิกแล้ว'),option('result === false',true,'dispatchEvent คืน false เมื่อ cancelable event ถูก preventDefault'),option('logs.length === 0',false,'บรรทัด logs.push ยังทำงาน')]),steps:[['preventDefault()','ยกเลิก default ของ event ที่ cancelable','ไม่ได้หยุด JavaScript'],['logs.push("after")','logs = ["after"]','ยังอยู่ใน handler เดิม'],['dispatchEvent คืนค่า','false','บอกว่าถูกยกเลิก ไม่ใช่เกิด exception']],takeaway:'แยก preventDefault, stopPropagation และ return ออกจากกัน; แต่ละอย่างมีผลคนละส่วน',experiment:'demo',change:'เพิ่ม console.log หลัง preventDefault แล้วเปรียบเทียบกับการใส่ return ก่อน log',predict:'ทายว่า log ยังออกหรือไม่ และ default action กับ handler เป็นคนละเรื่องอย่างไร'},
 storage:{activity:'choose',question:codeQuestions.find(q=>q.id==='strings'),steps:[['setItem("count", 3)','เก็บ "3" · string','Storage แปลงค่าเป็น string'],['getItem("count")','n = "3"','ไม่ได้เปลี่ยนกลับเป็น number'],['n + 1','"31"','string + number → ต่อข้อความ'],['Number(n) + 1','4','แปลงก่อนจึงบวกเลข']],takeaway:'ก่อนตอบผลลัพธ์ ให้เขียนทั้งค่าและชนิดข้อมูลทุกครั้ง โดยเฉพาะ string, null และ object',experiment:'roundtrip',change:'ลองส่ง object เข้า setItem โดยตรง แล้วเทียบกับ JSON.stringify',predict:'ทายข้อความที่เก็บและผลตอน JSON.parse ก่อนกด Run'},
};

export function withTeaching(unit){
 const guide=guides[unit.id];
 if(!guide)return unit;
 const extra=unit.id==='storage'?[
  {activity:'quiz-compare',question:codeQuestions.find(q=>q.id==='session'),steps:[['localStorage.setItem','local.mode = "dark"','พื้นที่ local ตาม origin'],['sessionStorage.setItem','session.mode = "light"','คนละพื้นที่กับ local'],['Reload แท็บเดิม','session.mode ยังเป็น "light"','ไม่ได้จบ page session']],takeaway:'แยกพื้นที่เก็บกับอายุข้อมูลก่อนอ่านโค้ด ชื่อ key เหมือนกันไม่ได้ทำให้ storage สองแบบแชร์ค่า',experiment:'roundtrip',change:'ตั้ง key เดียวกันใน localStorage และ sessionStorage ให้ค่าต่างกัน แล้ว log ทั้งสองฝั่ง',predict:'ทายว่าค่าฝั่ง local จะถูกเขียนทับด้วยฝั่ง session หรือไม่'},
  {activity:'quiz-cookie',question:codeQuestions.find(q=>q.id==='cookie-delete'),steps:[['mode=dark; Path=/','cookie เดิมมีชื่อ mode และ path /','ชื่ออย่างเดียวไม่พอระบุตัวที่จะลบ'],['mode=; Path=/','value ว่าง แต่ยังมี cookie','value ว่างไม่ใช่การหมดอายุ'],['Max-Age=0; Path=/','หมดอายุ cookie เดิม','path ตรงกันและอายุเป็น 0'],['Max-Age=0; Path=/admin','ไม่ลบตัวที่ Path=/','ขอบเขตคนละตัว']],takeaway:'เวลาตัดสินโค้ดลบ ให้ตรวจชื่อ ขอบเขต และวันหมดอายุครบสามจุด',experiment:'quiz-cookie-trace',change:'ในตัวอย่าง string เปลี่ยน mode เป็น modeExtra แล้วดูว่าการค้นหา mode= ยังเจอหรือไม่',predict:'ทายค่า entry และสังเกตว่าโค้ดต้องรับมือ undefined ก่อนเรียก substring; ตัวอย่างนี้ไม่จำลองการหมดอายุของ cookie'},
  {activity:'json',question:codeQuestions.find(q=>q.id==='objects'),steps:[['ส่ง object เข้า setItem ตรง ๆ','"[object Object]"','แปลงเป็น string แบบทั่วไป'],['JSON.stringify(prefs)','"{\"theme\":\"dark\"}"','string รูปแบบ JSON'],['JSON.parse(raw)','object {theme:"dark"}','จึงอ่าน property theme ได้']],takeaway:'ติดตามชนิดข้อมูลที่ทุกขอบ API: object → JSON string → object',experiment:'roundtrip',change:'เอา JSON.stringify ออกแล้ว Run เทียบกับเวอร์ชันเดิม',predict:'ทายว่า JSON.parse จะสำเร็จหรือ throw เพราะข้อความใด'},
 ]:[];
 const all=[guide,...extra];
 return {...unit,activities:unit.activities.map(a=>{
  const teaching=all.find(g=>g.activity===a.id);
  if(teaching)return {...a,teaching};
  const experiment=all.find(g=>g.experiment===a.id);
  return experiment?{...a,experimentGuide:{change:experiment.change,predict:experiment.predict}}:a;
 })};
}
