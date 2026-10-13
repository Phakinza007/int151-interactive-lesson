import {parse} from '../vendor/parser.js';
// Cooperative checkpoints keep accidental JS loops/recursion in DOM examples responsive.
// This is not an adversarial CPU or memory isolation boundary.
export function protectDOMCode(source){
 const tree=parse(source,{ecmaVersion:'latest',sourceType:'script',allowReturnOutsideFunction:true});
 const edits=[];
 const check='__int151Checkpoint();';
 function protectBlock(body,preserveDirectives=false){
  if(body.type==='BlockStatement'){
   let position=body.start+1;
   if(preserveDirectives)for(const statement of body.body){if(!statement.directive)break;position=statement.end;}
   edits.push({position,text:';'+check});
  }else{edits.push({position:body.start,text:'{'+check},{position:body.end,text:'}'});}
 }
 function visit(node){
  if(!node||typeof node!=='object')return;
  if(['ForStatement','ForInStatement','ForOfStatement','WhileStatement','DoWhileStatement'].includes(node.type))protectBlock(node.body);
  if(['FunctionDeclaration','FunctionExpression','ArrowFunctionExpression'].includes(node.type)){
   if(node.body.type==='BlockStatement')protectBlock(node.body,true);
   else edits.push({position:node.body.start,text:'(__int151Checkpoint(),('},{position:node.body.end,text:'))'});
  }
  for(const value of Object.values(node))if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value);
 }
 visit(tree);
 edits.sort((a,b)=>b.position-a.position);
 for(const edit of edits)source=source.slice(0,edit.position)+edit.text+source.slice(edit.position);
 return source;
}
