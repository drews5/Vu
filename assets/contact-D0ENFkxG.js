import{c as a}from"./main-C3eutwaI.js";import{a as s}from"./network-BaEiGJ1S.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]],c=a("mail",e),r="vocalu@umn.edu";async function m(o){const t=await s("https://formspree.io/f/xanygerw",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(o)},12e3);if(!t.ok)throw new Error(`Contact submission failed with status ${t.status}.`)}export{c as M,r as c,m as s};
