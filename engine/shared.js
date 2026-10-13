export function equal(a,b){
  if(Object.is(a,b))return true;
  if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
  const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k]));
}
export function show(value){
  if(typeof value==='string')return value;
  if(value===undefined)return 'undefined';
  try{return JSON.stringify(value);}catch{return String(value);}
}
export function createMemoryStorage(initial={}){
  const values=Object.create(null);
  for(const [k,v] of Object.entries(initial)) values[k]=String(v);
  return {get length(){return Object.keys(values).length;},key:i=>Object.keys(values)[i]??null,
    getItem:k=>Object.hasOwn(values,String(k))?values[String(k)]:null,
    setItem:(k,v)=>{values[String(k)]=String(v);},removeItem:k=>{delete values[String(k)];},clear:()=>{for(const k of Object.keys(values))delete values[k];},snapshot:()=>({...values})};
}
