import{c as p,_ as l}from"./main-bmKzFnmo.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],w=p("copy",h);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],P=p("map-pin",y);let o=null;async function _(){o||(o=l(()=>import("./supabase-zFFfqLFo.js"),[]));try{const{supabase:e}=await o;return e}catch(e){throw o=null,e}}const M="/assets/spring-showcase-m8eOjJUg.jpg",f=/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i;function b(e,a){const t=e.match(/^(\d{4})-(\d{2})-(\d{2})/),n=a?.match(f);if(!t)return new Date(e);const[,s,c,i]=t;let r=12,u=0;if(n){r=Number(n[1]),u=Number(n[2]||"0");const d=n[3].toUpperCase();d==="PM"&&r<12&&(r+=12),d==="AM"&&r===12&&(r=0)}return new Date(Number(s),Number(c)-1,Number(i),r,u)}function D(e,a=new Date){const t=new Date(e);return t.setHours(23,59,59,999),t>=a}function m(e){return e.toISOString().replace(/-|:|\.\d{3}/g,"")}function N({title:e,start:a,description:t,location:n,durationHours:s=2}){const c=new Date(a.getTime()+s*60*60*1e3);return`https://www.google.com/calendar/render?${new URLSearchParams({action:"TEMPLATE",text:e,dates:`${m(a)}/${m(c)}`,details:t,location:n}).toString()}`}export{w as C,P as M,N as g,D as i,_ as l,b as p,M as s};
