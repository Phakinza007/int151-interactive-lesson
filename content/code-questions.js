const o=(text,correct,explanation)=>({text,correct,explanation});
const storage='รันแต่ละข้อแยกกัน Web Storage เริ่มว่าง API ใช้งานได้ และไม่มีโค้ดอื่นมาแก้ข้อมูล';
export const codeQuestions=[
 {id:'strings',title:'String หรือ Number?',assumption:storage,prompt:'ข้อใดระบุผลลัพธ์ได้ถูกต้อง? เลือกทุกข้อที่ถูก',code:`localStorage.setItem('count', 3);
const n = localStorage.getItem('count');`,options:[
 o(`console.log(n + 1); // "31"`,true,'getItem คืน string "3" จึงต่อข้อความกับ 1'),
 o(`console.log(n === 3); // true`,false,'=== ไม่แปลงชนิด string "3" ไม่เท่ากับ number 3'),
 o(`console.log(Number(n) + 1); // 4`,true,'Number แปลง "3" เป็นเลขก่อนบวก'),
 o(`console.log(typeof n); // "number"`,false,'ค่าที่อ่านจาก Web Storage เป็น string'),
 ]},
 {id:'objects',title:'เก็บ Object แบบใดอ่านกลับได้?',assumption:storage,prompt:'ให้ prefs เป็น object ด้านล่าง โค้ดตัวเลือกแต่ละชุดรันแยกกัน ชุดใดทำให้ result === "dark"?',code:`const prefs = {theme: 'dark'};`,options:[
 o(`localStorage.setItem('prefs', prefs);
const result = localStorage.getItem('prefs').theme;`,false,'object ถูกแปลงเป็น "[object Object]"; string นี้ไม่มี property theme จึงได้ undefined'),
 o(`localStorage.setItem('prefs', JSON.stringify(prefs));
const result = JSON.parse(localStorage.getItem('prefs')).theme;`,true,'stringify ตอนเก็บและ parse ตอนอ่านกลับเป็น object'),
 o(`localStorage.setItem('theme', prefs.theme);
const result = localStorage.getItem('theme');`,true,'เก็บ property ที่เป็น string โดยตรงได้ ไม่ต้อง JSON เมื่อเก็บแค่ theme'),
 o(`localStorage.setItem('prefs', prefs);
const result = JSON.parse(localStorage.getItem('prefs')).theme;`,false,'"[object Object]" ไม่ใช่ JSON ที่ถูกต้อง JSON.parse จึง throw'),
 ]},
 {id:'missing',title:'Key ที่ไม่มี กับ Fallback',assumption:storage,prompt:'โค้ดตัวเลือกแต่ละชุดรันแยกกัน ข้อใดระบุผลได้ถูกต้อง?',code:`const raw = localStorage.getItem('prefs');`,options:[
 o(`console.log(raw === null); // true`,true,'key ไม่มี getItem คืน null'),
 o(`console.log(raw === undefined); // true`,false,'null และ undefined เป็นคนละค่า'),
 o(`const prefs = JSON.parse(raw) ?? {theme:'light'};
console.log(prefs.theme); // "light"`,true,'JSON.parse(null) ได้ null แล้ว ?? เลือก default object'),
 o(`const prefs = JSON.parse(raw);
console.log(prefs.theme); // "light"`,false,'prefs เป็น null การอ่าน .theme ทำให้เกิด TypeError ไม่ได้ default อัตโนมัติ'),
 ]},
 {id:'remove',title:'ลบ Key เดียวหรือทั้งหมด?',assumption:storage,prompt:'เลือกคำสั่งที่ระบุผลหลังรันโค้ดได้ถูกต้อง',code:`localStorage.setItem('theme', 'dark');
localStorage.setItem('fontSize', 16);
localStorage.removeItem('theme');`,options:[
 o(`console.log(localStorage.getItem('theme')); // null`,true,'removeItem ลบ theme'),
 o(`console.log(localStorage.getItem('fontSize')); // "16"`,true,'fontSize ยังอยู่ และอ่านกลับเป็น string'),
 o(`console.log(localStorage.length); // 0`,false,'เหลือ fontSize หนึ่ง key จึง length เป็น 1'),
 o(`localStorage.clear();
console.log(localStorage.getItem('fontSize')); // null`,true,'clear ลบทุก key ใน localStorage ของ origin นี้'),
 ]},
 {id:'session',title:'Local และ Session ใช้ชื่อ Key เดียวกัน',assumption:storage+' · Reload ในแท็บเดิม ไม่มีโค้ดตั้งค่าใหม่ระหว่างโหลด',prompt:'ข้อใดเป็นจริง? โค้ดในตัวเลือกที่มีคอมเมนต์ระบุผลลัพธ์ต้องให้ผลตามนั้น',code:`localStorage.setItem('mode', 'dark');
sessionStorage.setItem('mode', 'light');`,options:[
 o(`console.log(localStorage.getItem('mode')); // "dark"`,true,'localStorage และ sessionStorage เป็นคนละพื้นที่'),
 o(`console.log(sessionStorage.getItem('mode')); // "light"`,true,'การตั้ง sessionStorage ไม่เขียนทับ localStorage'),
 o(`// หลัง Reload ในแท็บเดิม
console.log(sessionStorage.getItem('mode')); // null`,false,'Reload ไม่จบ page session จึงยังได้ "light"'),
 o(`sessionStorage.removeItem('mode');
console.log(localStorage.getItem('mode')); // "dark"`,true,'ลบฝั่ง session ไม่กระทบ local'),
 ]},
 {id:'cookie-set',title:'document.cookie ไม่ใช่ String ธรรมดา',assumption:'หน้า HTTPS ที่ path / ไม่มี cookie เดิม ไม่มี HttpOnly ไม่มีข้อจำกัดที่ปฏิเสธการเขียน และอ่านทันที',prompt:'หลังรันโค้ด ข้อใดให้ true? ไม่ต้องสมมุติลำดับ cookie ใน string',code:`document.cookie = 'mode=dark; Path=/; Max-Age=3600';
document.cookie = 'fontSize=16; Path=/';
document.cookie = 'mode=light; Path=/; Max-Age=3600';`,options:[
 o(`document.cookie.split(';').some(s => s.trim() === 'mode=light')`,true,'ชื่อ/path/domain เดิมถูกอัปเดตจาก dark เป็น light'),
 o(`document.cookie.split(';').some(s => s.trim() === 'fontSize=16')`,true,'เขียน mode ไม่ได้ลบ fontSize'),
 o(`document.cookie.includes('Max-Age=3600')`,false,'getter คืนคู่ name=value ไม่ได้คืน attributes'),
 o(`document.cookie.split(';').some(s => s.trim() === 'mode=dark')`,false,'mode ตัวเดิมถูกอัปเดต ไม่มีชื่อ/path/domain อื่นในโจทย์'),
 ]},
 {id:'cookie-delete',title:'เลือกโค้ดลบ Cookie ให้หมดอายุ',assumption:'รันแต่ละตัวเลือกแยกกัน หน้า HTTPS path / มี mode=dark แบบ host-only, Path=/ และ browser ยอมรับการเขียน',prompt:'โค้ดชุดใดลบ mode ตัวเดิมได้ทันที?',code:`document.cookie = 'mode=dark; Path=/; Max-Age=3600';`,options:[
 o(`document.cookie = 'mode=; Max-Age=0; Path=/';`,true,'Max-Age=0 ทำให้ cookie ขอบเขตเดิมหมดอายุทันที'),
 o(`document.cookie = 'mode=; Expires=' + new Date(0).toUTCString() + '; Path=/';`,true,'วันที่ปี 1970 เป็นอดีต จึงหมดอายุ'),
 o(`document.cookie = 'mode=; Path=/';`,false,'เป็นการอัปเดตให้ value ว่าง cookie ยังมีอยู่'),
 o(`document.cookie = 'mode=; Max-Age=0; Path=/admin';`,false,'Path ต่างกัน ไม่ได้ลบ cookie เดิมที่ Path=/'),
 ]},
 {id:'cookie-read',title:'อ่านชื่อให้ตรง ไม่ติดชื่อคล้ายกัน',assumption:'ใช้ string จำลองตามที่กำหนด ไม่เข้าถึง cookie จริง',prompt:'ข้อใดระบุผลลัพธ์ของโค้ดตัวเองถูกต้อง?',code:`const raw = 'modeExtra=wrong; mode=dark%20blue';
const prefix = 'mode=';
const row = raw.split(';').map(s => s.trim())
  .find(s => s.startsWith(prefix));`,options:[
 o(`console.log(row); // "mode=dark%20blue"`,true,'prefix มี = จึงไม่จับ modeExtra'),
 o(`console.log(row.substring(prefix.length)); // "dark%20blue"`,true,'ตัด mode= ทั้ง 5 ตัวออก'),
 o(`console.log(decodeURIComponent(row.substring(prefix.length))); // "dark blue"`,true,'decode เปลี่ยน %20 กลับเป็นเว้นวรรค'),
 o(`console.log(raw.split(';')[0].startsWith('mode')); // false`,false,'modeExtra ขึ้นต้นด้วย mode เช่นกัน จึง true นี่เป็นเหตุผลที่ต้องเติม ='),
 ]},
 {id:'equals',title:'กับดัก split("=")',assumption:'ใช้ string จำลองตามโจทย์',prompt:'ตัวเลือกใดทำให้ value === "a=b=c"?',code:`const row = 'token=a=b=c';`,options:[
 o(`const value = row.split('=')[1];`,false,'ได้แค่ "a" เพราะ split ทุกตำแหน่ง ='),
 o(`const value = row.substring('token='.length);`,true,'ตัดเฉพาะ prefix จึงเก็บ = ใน value ไว้ครบ'),
 o(`const value = row.slice(row.indexOf('=') + 1);`,true,'ตัดหลัง = ตัวแรก ผลเป็น "a=b=c"'),
 o(`const value = row.split('=').slice(1).join('=');`,true,'รวมส่วนของ value กลับด้วย = จึงครบ'),
 ]},
 {id:'expiry',title:'วินาที มิลลิวินาที และ Date',assumption:'now เป็นค่าที่จับไว้ครั้งเดียว ทุกตัวเลือกคำนวณจาก now เดียวกัน',prompt:'ข้อใดสร้างวันหมดอายุอีก 1 ชั่วโมง หรือกำหนด Max-Age เท่ากับ 1 ชั่วโมงได้ถูกต้อง?',code:`const now = Date.now();`,options:[
 o(`const expires = new Date(now + 60 * 60 * 1000).toUTCString();`,true,'Date รับมิลลิวินาที: 3,600 × 1,000 = หนึ่งชั่วโมง'),
 o(`const cookie = 'mode=dark; Max-Age=' + (60 * 60);`,true,'Max-Age รับวินาที จึงใช้ 3,600'),
 o(`const expires = new Date(now + 60 * 60).toUTCString();`,false,'เพิ่มเพียง 3,600 มิลลิวินาที หรือ 3.6 วินาที'),
 o(`const cookie = 'mode=dark; Max-Age=' + (60 * 60 * 1000);`,false,'เป็น 3,600,000 วินาที ไม่ใช่ 1 ชั่วโมง'),
 ]},
 {id:'encode',title:'Encode ตอนเก็บ Decode ตอนอ่าน',assumption:'ชื่อและค่า encode ด้วย encodeURIComponent ตามโค้ด และ percent encoding ถูกต้อง',prompt:'ข้อใดระบุผลลัพธ์ได้ถูกต้อง?',code:`const name = 'display name';
const value = 'dark blue';
const row = encodeURIComponent(name) + '=' + encodeURIComponent(value);`,options:[
 o(`console.log(row); // "display%20name=dark%20blue"`,true,'encode แปลงช่องว่างทั้งชื่อและค่า'),
 o(`const prefix = encodeURIComponent(name) + '=';
console.log(decodeURIComponent(row.substring(prefix.length))); // "dark blue"`,true,'ใช้ prefix ที่ encode ตรงกัน แล้ว decode เฉพาะ value'),
 o(`console.log(row.startsWith(name + '=')); // true`,false,'ชื่อใน row เป็น display%20name ไม่ใช่ display name'),
 o(`console.log(decodeURIComponent(row)); // "dark blue"`,false,'decode ทั้ง row ได้ "display name=dark blue" ไม่ได้ตัดชื่อให้'),
 ]},
 {id:'theme',title:'เลือก Handler ที่สลับธีมได้ทุกครั้ง',assumption:storage+' · มีปุ่ม btn อยู่จริง เริ่ม localStorage.theme เป็น light ตัวเลือกแต่ละชุดรันแยกกันแล้วคลิกสองครั้ง',prompt:'Handler ชุดใดทำให้ storage และข้อความปุ่มเป็น dark หลังคลิกแรก และ light หลังคลิกที่สอง?',code:`localStorage.setItem('theme', 'light');
// btn คือปุ่มที่มีอยู่แล้ว`,options:[
 o(`btn.addEventListener('click', () => {
  const current = localStorage.getItem('theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  btn.textContent = next;
});`,true,'อ่านค่าปัจจุบันใหม่ทุกคลิก แล้วบันทึกและแสดงค่า next เดียวกัน'),
 o(`let current = localStorage.getItem('theme') || 'light';
btn.addEventListener('click', () => {
  current = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', current);
  btn.textContent = current;
});`,true,'ตัวแปร let ถูกอัปเดตในทุกคลิก จึงสลับได้ทั้งสองครั้งตามเงื่อนไขโจทย์'),
 o(`const current = localStorage.getItem('theme') || 'light';
btn.addEventListener('click', () => {
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  btn.textContent = next;
});`,false,'current จับค่า light ไว้ครั้งเดียว ไม่เปลี่ยน คลิกกี่ครั้งก็ได้ dark'),
 o(`btn.addEventListener('click', () => {
  const current = localStorage.getItem('theme');
  btn.textContent = current === 'light' ? 'dark' : 'light';
});`,false,'เปลี่ยนแค่ข้อความ ไม่บันทึก storage จึงอ่าน light ทุกครั้งและ storage ไม่เคยเป็น dark'),
 ]},
];
