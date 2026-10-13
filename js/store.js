export const KEY = 'int151-learning-v1';
export function createStore(storage) {
  if (storage === undefined) { try { storage = globalThis.localStorage; } catch { storage = null; } }
  let data = { done: {}, code: {}, last: null, lab: {} };
  try { const raw = JSON.parse(storage?.getItem(KEY) || 'null'); if (raw && typeof raw === 'object') { for(const key of ['done','code','lab']) if(raw[key]&&typeof raw[key]==='object'&&!Array.isArray(raw[key])) data[key]=raw[key]; if(raw.last&&typeof raw.last.unit==='string'&&typeof raw.last.activity==='string')data.last=raw.last; } } catch { /* keep memory */ }
  const save = () => { try { storage?.setItem(KEY,JSON.stringify(data)); } catch { /* memory fallback */ } };
  const key = (u,a) => `${u}/${a}`;
  return {
    isDone:(u,a)=>!!data.done[key(u,a)],
    markDone(u,a){data.done[key(u,a)]=true;save();},
    getCode:(u,a)=>data.code[key(u,a)]||null,
    setCode(u,a,code){data.code[key(u,a)]={...code};save();},
    getLast:()=>data.last,
    setLast(unit,activity){data.last={unit,activity};save();},
    getLab:(u,a)=>({...data.lab[key(u,a)]}),
    setLab(u,a,values){data.lab[key(u,a)]={...values};save();},
    clearLab(u,a){delete data.lab[key(u,a)];save();},
  };
}
