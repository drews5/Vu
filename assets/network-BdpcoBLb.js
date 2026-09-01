import{c as n}from"./main-Bnhssv6U.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]],u=n("message-circle",c);async function i(o,e={},s=1e4){const t=new AbortController,a=()=>t.abort(e.signal?.reason);e.signal?.aborted?a():e.signal?.addEventListener("abort",a,{once:!0});const r=window.setTimeout(()=>t.abort(),s);try{return await fetch(o,{...e,signal:t.signal})}finally{window.clearTimeout(r),e.signal?.removeEventListener("abort",a)}}async function d(o,e={},s=1e4){const t=await i(o,e,s);if(!t.ok)throw new Error(`Request failed with status ${t.status}.`);return t.json()}export{u as M,i as a,d as f};
