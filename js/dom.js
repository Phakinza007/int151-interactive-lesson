export function h(tag,attrs={},...children){
  const el=document.createElement(tag);
  for(const [key,value] of Object.entries(attrs)){
    if(key==='class')el.className=value;
    else if(key==='html')el.innerHTML=value;
    else if(key.startsWith('on')&&typeof value==='function')el.addEventListener(key.slice(2),value);
    else if(value!==false&&value!=null)el.setAttribute(key,value===true?'':value);
  }
  for(const child of children.flat(Infinity))if(child!=null&&child!==false)el.append(child.nodeType?child:document.createTextNode(String(child)));
  return el;
}
export const labels={concept:'ทำความเข้าใจ',experiment:'ลองเปลี่ยน',exercise:'เขียนเอง'};
export const doneLabels={concept:'อ่านแล้ว',experiment:'ทดลองแล้ว',exercise:'ตรวจผ่านแล้ว'};
