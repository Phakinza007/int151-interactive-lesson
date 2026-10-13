const source='week9/INT151_G2_20261007.docx · แนวฝึกเรียบเรียงจากคาบ 7 ต.ค. 2569';
const concept=(id,title,body,prediction)=>({id,title,body,prediction,source,type:'concept',mode:'js'});
const prediction=(question,choices,answer,explanation)=>({question,choices,answer,explanation});
const snippet=text=>`<pre><code>${text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}</code></pre>`;
const cookieSolution=`function readCookie(raw, name) {
  const prefix = encodeURIComponent(name) + '=';
  const entry = raw.split(';').map(part => part.trim())
    .find(part => part.startsWith(prefix));
  return entry === undefined ? null
    : decodeURIComponent(entry.substring(prefix.length));
}`;
const questions=[
 ['อยากจำธีม dark/light ข้ามการปิดเปิด browser ใช้อะไร?', 'localStorage เพราะข้อมูลคงอยู่ข้าม browser session จนถูกล้าง ไม่ต้องแนบไป server อัตโนมัติ'],
 ['ข้อมูลในแท็บต้องอยู่เมื่อ Reload แต่หมดเมื่อปิดแท็บ ใช้อะไร?', 'sessionStorage ผูกกับ origin และ page session ของแท็บ; การ Reload ไม่จบ session'],
 ['server ต้องได้รับ session identifier อัตโนมัติกับ request ใช้อะไร?', 'Cookie ที่ตรงเงื่อนไข domain/path และข้อจำกัดอื่นของ cookie; Web Storage ไม่แนบอัตโนมัติ'],
 ['Max-Age=3600 อยู่ได้นานเท่าไร?', '3,600 วินาที = 1 ชั่วโมง ไม่ใช่มิลลิวินาที'],
 ['ไม่กำหนดทั้ง Expires และ Max-Age ได้ cookie แบบใด?', 'Session cookie; อายุผูกกับ browser session และ browser อาจคืนค่าผ่าน session restore อย่าสับสนกับ sessionStorage ที่แยกตามแท็บ'],
 ['document.cookie = "theme=dark" แล้ว cookie ตัวอื่นหายไหม?', 'ไม่หาย setter นี้สร้าง/อัปเดต cookie ทีละตัว ไม่ได้แทน cookie ทั้งหมดด้วย string ใหม่'],
 ['อยากลบ cookie ต้องทำอะไร?', 'ตั้ง Max-Age=0 หรือ Expires เป็นอดีต โดยใช้ชื่อ/path/domain ให้ตรงตัวเดิม การตั้ง value ว่างอย่างเดียวไม่ได้ทำให้หมดอายุ'],
 ['HttpOnly กับ Secure ต่างกันอย่างไร?', 'HttpOnly จำกัดไม่ให้ JavaScript อ่าน/แก้ cookie; Secure จำกัดการส่งผ่านช่องทางปลอดภัย เช่น HTTPS สองอย่างทำคนละหน้าที่'],
 ['localStorage.setItem("count", 3) แล้ว getItem ได้อะไร?', 'string "3"; ถ้า key ไม่มี getItem คืน null ไม่ใช่ undefined'],
 ['เก็บ {theme:"dark"} แล้วอ่านกลับเป็น object ทำอย่างไร?', 'JSON.stringify ก่อน setItem และ JSON.parse หลัง getItem; ส่ง object ตรง ๆ จะได้ข้อความ "[object Object]"'],
 ['ทำไมอ่าน cookie ต้องค้นหา "mode=" แทน "mode"?', 'ป้องกันชื่อคล้ายกัน เช่น modeExtra; ตัด substring หลังชื่อรวมเครื่องหมาย = แล้ว decode ค่า'],
 ['document.cookie อ่านแล้วเห็น Expires, Path, HttpOnly ด้วยไหม?', 'ไม่เห็น attributes แบบ Set-Cookie header; ได้คู่ name=value ของ cookie ที่ JavaScript เข้าถึงได้เท่านั้น'],
];

export const quizPrep=[
 concept('quiz-14-oct','เตรียมควิซ 14 ต.ค. · อ่านอะไรก่อน',`<p><b>ตามประกาศในคาบ 7 ต.ค.:</b> คาบถัดไปมีควิซ Client-side Storage และจะเรียน Web Storage ที่เหลือต่อ ข้อมูลนี้อ้างอิง transcript ไม่ใช่ประกาศสด และคาบนั้นไม่ได้ระบุจำนวนข้อหรือเวลาควิซนี้ชัดเจน</p><p><b>แนวต่อไปนี้เป็นการคาดจากหัวข้อและจุดที่อาจารย์ย้ำ ไม่ใช่ข้อสอบจริง</b> อาจารย์ต้องการให้เลือก storage ให้เหมาะกับ use case อธิบายเหตุผล และอ่าน/เขียน JavaScript ใช้งานเป็น</p><ol><li><b>เริ่มที่ Cookie:</b> สร้าง อ่าน แก้ ลบ อายุ และ attributes</li><li><b>เปรียบเทียบ 3 แบบ:</b> Cookie / localStorage / sessionStorage</li><li><b>ไล่โค้ดอ่าน cookie:</b> split → trim → find → substring → decode</li><li><b>ทวน Web Storage:</b> getItem / setItem / removeItem / clear, string และ JSON</li></ol><p>ถ้ามี 30 นาที: 10 นาทีอ่าน Cookie → 5 นาทีตารางเปรียบเทียบ → 10 นาทีคำถามซ้อม → 5 นาทีเขียน readCookie เอง และกลับไปทำแบบฝึก Cookie 2 ข้อที่อาจารย์มอบหมายให้ครบ</p><p><a href="#quiz-compare">เริ่มเปรียบเทียบ storage →</a> · <a href="#quiz-questions">ไปคำถามซ้อม 12 ข้อ →</a></p>`),
 concept('quiz-compare','แนวที่ 1 · เลือก Storage จากโจทย์',`<table><thead><tr><th>แบบ</th><th>อายุ / ขอบเขต</th><th>ส่งไป server อัตโนมัติ?</th><th>ตัวอย่าง</th></tr></thead><tbody><tr><td>Cookie</td><td>Session หรือกำหนด Expires / Max-Age; จำกัด domain/path</td><td>ส่งเมื่อ request ตรงเงื่อนไข</td><td>Session identifier</td></tr><tr><td>localStorage</td><td>แยกตาม origin; อยู่ข้าม browser session จนถูกล้าง</td><td>ไม่ส่ง</td><td>จำธีมระยะยาว</td></tr><tr><td>sessionStorage</td><td>แยกตาม origin และแท็บ; Reload ยังอยู่ ปิดแท็บจบ session</td><td>ไม่ส่ง</td><td>ข้อมูลชั่วคราวในแท็บ</td></tr></tbody></table><p><b>จุดหลอก:</b> “ไม่แนบอัตโนมัติ” ไม่ได้แปลว่าเขียน JavaScript อ่านข้อมูลแล้วส่งเองไม่ได้; และ Cookie ไม่ได้แนบทุก request ไปทุกเว็บ</p><p>Cookie เก็บได้ประมาณ 4 KB ต่อรายการ จึงต้องคิดถึงขนาดที่เพิ่มมากับ request ด้วย ส่วน IndexedDB ไม่ใช่จุดโฟกัสในคาบนี้</p>`,prediction('ข้อใดถูกเกี่ยวกับ sessionStorage?',['Reload แล้วข้อมูลหายทันที','Reload ในแท็บเดิมยังอ่านค่าได้','ทุกแท็บแชร์พื้นที่เดียวกันเสมอ'],1,'sessionStorage ผูกกับ page session ของแต่ละแท็บ ไม่ได้หายเพราะ Reload')),
 concept('quiz-cookie','แนวที่ 2 · สร้าง แก้ ลบ Cookie และอ่าน Attributes',`${snippet('document.cookie = "mode=dark; Max-Age=3600; Path=/";\ndocument.cookie = "fontSize=16; Path=/";\n// อัปเดต mode โดยใช้ path เดิม\ndocument.cookie = "mode=light; Max-Age=3600; Path=/";\n// ลบ mode โดยใช้ชื่อและขอบเขตเดิม\ndocument.cookie = "mode=; Max-Age=0; Path=/";')}<ul><li><b>Max-Age:</b> จำนวนวินาที; 0 หรือติดลบทำให้หมดอายุ</li><li><b>Expires:</b> วันเวลาหมดอายุ ใช้ Date.toUTCString(); new Date(0) คือจุดเริ่มต้นเวลา Unix ในปี 1970 จึงเป็นอดีต</li><li><b>ไม่ระบุอายุ:</b> เป็น session cookie; browser session restore อาจคืน cookie ได้</li><li><b>Path / Domain:</b> จำกัดขอบเขตการส่ง cookie; เวลาแก้/ลบต้องให้ตรงตัวเดิม</li><li><b>Secure:</b> ส่งผ่านช่องทางปลอดภัย เช่น HTTPS</li><li><b>HttpOnly:</b> ตั้งจาก server; JavaScript ใช้ document.cookie อ่าน/แก้ cookie นั้นไม่ได้</li></ul><p>server สั่งสร้างผ่าน <code>Set-Cookie</code> ใน response; browser ส่งกลับผ่าน <code>Cookie</code> ใน request เมื่อเข้าเงื่อนไข เวลาอ่าน <code>document.cookie</code> จะเห็น name=value ไม่ใช่ attributes ทั้งชุด</p>`,prediction('ตั้ง mode=dark แล้วตั้ง fontSize=16 ผ่าน document.cookie แยกกัน ได้ผลอย่างไร?',['เหลือ fontSize ตัวเดียว','มีทั้งสองตัว ถ้า browser ยอมรับและอยู่ในขอบเขตที่อ่านได้','Cookie ทั้งหมดถูกลบ'],1,'document.cookie เป็น getter/setter พิเศษ การกำหนดค่าจัดการ cookie ทีละตัว ไม่ใช่แทน string ทั้งชุด')),
 {id:'quiz-cookie-trace',title:'แนวที่ 3 · ไล่โค้ดอ่าน Cookie ทีละขั้น',source,type:'experiment',mode:'js',body:`<p>ทดลองด้วย <b>string จำลอง</b> ไม่ใช่ cookie จริงของเว็บ อ่านผลแต่ละขั้นใน Console แล้วเปลี่ยน mode เป็น modeExtra เพื่อดูเหตุผลที่ต้องค้นหาชื่อพร้อมเครื่องหมาย =</p><p>ใช้ split(';') แล้ว trim เพื่อรับได้ทั้งมี/ไม่มีเว้นวรรค; substring ตัดเฉพาะ prefix จึงไม่ทิ้งเครื่องหมาย = ที่อยู่ใน value ส่วน encodeURIComponent/decodeURIComponent ช่วยจัดการอักขระพิเศษ</p>`,code:`const raw = 'modeExtra=wrong; mode=dark%20blue; fontSize=16';
const prefix = encodeURIComponent('mode') + '=';
const parts = raw.split(';').map(part => part.trim());
const entry = parts.find(part => part.startsWith(prefix));
console.log('1. แยกคู่:', parts);
console.log('2. คู่ที่พบ:', entry);
console.log('3. ตัดชื่อ:', entry.substring(prefix.length));
console.log('4. decode:', decodeURIComponent(entry.substring(prefix.length)));`,prediction:prediction('ถ้า raw = "mode=dark%20blue" หลัง decode ค่าได้อะไร?',['dark%20blue','dark blue','mode=dark blue'],1,'substring ตัด mode= ก่อน แล้ว decodeURIComponent เปลี่ยน %20 กลับเป็นเว้นวรรค')},
 {id:'quiz-read-cookie',title:'ซ้อมเขียน · อ่าน Cookie ตามชื่อ',source,type:'exercise',mode:'js',fn:'readCookie',body:`<p>เขียน <code>readCookie(raw, name)</code> รับ string รูปแบบ document.cookie กับชื่อที่ยังไม่ encode แล้วคืน value ที่ decode แล้ว ถ้าไม่พบคืน <code>null</code></p><p>โจทย์กำหนดให้ข้อมูล percent encoding ถูกต้อง ชื่อไม่ซ้ำ และรองรับช่องว่างหลัง ; ได้ ห้ามคืนค่าของชื่อที่แค่ขึ้นต้นคล้ายกัน ตัวอย่างนี้ฝึกแยก string โดยไม่เข้าถึง cookie จริง</p>`,code:'function readCookie(raw, name) {\n  // แยกคู่ → หาชื่อที่ตรง → ตัด prefix → decode\n}',solution:cookieSolution,hints:['สร้าง prefix ด้วย encodeURIComponent(name) + "=" แล้ว split ด้วย ; และ trim แต่ละคู่','find คู่ที่ startsWith(prefix); ถ้าไม่พบคืน null ถ้าพบ substring(prefix.length) แล้ว decodeURIComponent'],tests:[
 {name:'เลือกชื่อที่ตรง ไม่ใช่ prefix คล้ายกัน',args:['modeExtra=wrong; mode=dark','mode'],expected:'dark'},
 {name:'decode ช่องว่าง',args:['mode=dark%20blue','mode'],expected:'dark blue'},
 {name:'ไม่มี cookie ชื่อนี้',args:['fontSize=16','mode'],expected:null},
 {name:'value ว่างไม่ใช่ null',args:['mode=; size=16','mode'],expected:''},
 {name:'ไม่มี cookie เลย',args:['','mode'],expected:null},
 {name:'value มีเครื่องหมายเท่ากับ',args:['token=a=b=c','token'],expected:'a=b=c'},
 {name:'ไม่มีช่องว่างหลัง semicolon',args:['size=16;mode=light','mode'],expected:'light'},
 {name:'ชื่อและค่า encode อักขระพิเศษ',args:['display%20name=%E0%B9%84%E0%B8%97%E0%B8%A2','display name'],expected:'ไทย'},
 ]},
 concept('quiz-questions','ซ้อมก่อนเข้าเรียน · 12 ข้อพร้อมเหตุผล',`<p>ลองตอบเองก่อนกดเปิดเฉลย คำถามเหล่านี้เรียบเรียงเพื่อฝึกจากบทเรียน ไม่ใช่ชุดข้อสอบของอาจารย์</p>${questions.map(([q,a],i)=>`<details class="help"><summary>${i+1}. ${q}</summary><p>${a}</p></details>`).join('')}<h2>โค้ด Web Storage ที่ควรอ่านออก</h2>${snippet('localStorage.setItem("count", 3);\nconsole.log(typeof localStorage.getItem("count")); // "string"\nlocalStorage.removeItem("count");\nconsole.log(localStorage.getItem("count")); // null\n\nlocalStorage.setItem("prefs", JSON.stringify({theme:"dark"}));\nconst prefs = JSON.parse(localStorage.getItem("prefs"));\nconsole.log(prefs.theme); // "dark"')}<p><code>removeItem(key)</code> ลบ key เดียว; <code>clear()</code> ลบทุก key ในพื้นที่ storage นั้น ถ้ายังไม่มั่นใจให้ทำกิจกรรมเก็บ/อ่าน preferences ต่อในบทนี้</p><p>ตรวจรายละเอียด API เพิ่มเติม: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie">MDN · document.cookie</a> และ <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API">MDN · Web Storage</a></p>`),
];
