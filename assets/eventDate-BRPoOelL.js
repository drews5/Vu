import{c as p}from"./main-DToap1MU.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],f=p("copy",u);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],l=p("map-pin",h),w="/assets/spring-showcase-m8eOjJUg.jpg",g=/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i;function M(e,n){const t=e.match(/^(\d{4})-(\d{2})-(\d{2})/),a=n?.match(g);if(!t)return new Date(e);const[,o,s,c]=t;let r=12,i=0;if(a){r=Number(a[1]),i=Number(a[2]||"0");const m=a[3].toUpperCase();m==="PM"&&r<12&&(r+=12),m==="AM"&&r===12&&(r=0)}return new Date(Number(o),Number(s)-1,Number(c),r,i)}function P(e,n=new Date){const t=new Date(e);return t.setHours(23,59,59,999),t>=n}function d(e){return e.toISOString().replace(/-|:|\.\d{3}/g,"")}function N({title:e,start:n,description:t,location:a,durationHours:o=2}){const s=new Date(n.getTime()+o*60*60*1e3);return`https://www.google.com/calendar/render?${new URLSearchParams({action:"TEMPLATE",text:e,dates:`${d(n)}/${d(s)}`,details:t,location:a}).toString()}`}export{f as C,l as M,N as g,P as i,M as p,w as s};
