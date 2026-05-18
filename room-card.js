/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

var RoomCard_1;
// Icon defaults for each entity type
const ENTITY_DEFAULTS = {
    tv: { icon: "mdi:television", domain: "media_player" },
    media_player_1: { icon: "mdi:speaker", domain: "media_player" },
    media_player_2: { icon: "mdi:speaker", domain: "media_player" },
    climate_1: { icon: "mdi:thermostat", domain: "climate" },
    climate_2: { icon: "mdi:thermostat", domain: "climate" },
    light_1: { icon: "mdi:lightbulb", domain: "light" },
    light_2: { icon: "mdi:lightbulb", domain: "light" },
    smoke_detector: { icon: "mdi:smoke-detector", domain: "binary_sensor" },
};
function isActive(entity, type) {
    if (!entity)
        return false;
    const state = entity.state.toLowerCase();
    switch (type) {
        case "tv":
        case "media_player_1":
        case "media_player_2":
            return !["off", "standby", "idle", "unavailable", "unknown"].includes(state);
        case "climate_1":
        case "climate_2":
            return state !== "off" && state !== "unavailable" && state !== "unknown";
        case "light_1":
        case "light_2":
            return state === "on";
        case "smoke_detector":
            return state === "on";
        default:
            return state === "on";
    }
}
function getEntityIcon(entity, type) {
    if (entity?.attributes.icon && typeof entity.attributes.icon === "string") {
        return entity.attributes.icon;
    }
    return ENTITY_DEFAULTS[type]?.icon || "mdi:circle";
}
let RoomCard = RoomCard_1 = class RoomCard extends i {
    static async getConfigElement() {
        return document.createElement("room-card-editor");
    }
    static getStubConfig() {
        return {
            title: "Living Room",
            icon: "mdi:sofa",
            icon_color: "#4A90D9",
            background_color: "#1C1C1E",
            active_color: "#4CD964",
            inactive_color: "#636366",
        };
    }
    setConfig(config) {
        if (!config) {
            throw new Error("Invalid configuration");
        }
        this._config = { ...RoomCard_1.getStubConfig(), ...config };
    }
    getCardSize() {
        return 4;
    }
    _getEntity(type) {
        if (!this.hass || !this._config)
            return undefined;
        const entityId = this._config[`${type}_entity`];
        if (!entityId)
            return undefined;
        return this.hass.states[entityId];
    }
    _getTempEntity() {
        if (!this.hass || !this._config)
            return undefined;
        const c1 = this._config.climate_1_entity;
        const c2 = this._config.climate_2_entity;
        if (c1 && this.hass.states[c1]?.attributes.current_temperature !== undefined) {
            return this.hass.states[c1];
        }
        if (c2 && this.hass.states[c2]?.attributes.current_temperature !== undefined) {
            return this.hass.states[c2];
        }
        return undefined;
    }
    _getHumidityEntity() {
        if (!this.hass || !this._config)
            return undefined;
        const c1 = this._config.climate_1_entity;
        const c2 = this._config.climate_2_entity;
        if (c1 && this.hass.states[c1]?.attributes.current_humidity !== undefined) {
            return this.hass.states[c1];
        }
        if (c2 && this.hass.states[c2]?.attributes.current_humidity !== undefined) {
            return this.hass.states[c2];
        }
        return undefined;
    }
    _fire(type, detail) {
        const event = new CustomEvent(type, {
            bubbles: true,
            composed: true,
            detail,
        });
        this.dispatchEvent(event);
    }
    _handleEntityClick(ev, type) {
        ev.stopPropagation();
        if (!this.hass || !this._config)
            return;
        const entityId = this._config[`${type}_entity`];
        if (!entityId)
            return;
        this._fire("hass-more-info", { entityId });
    }
    async _handleEntityDblClick(ev, type) {
        ev.stopPropagation();
        if (!this.hass || !this._config)
            return;
        const entityId = this._config[`${type}_entity`];
        if (!entityId)
            return;
        const domain = entityId.split(".")[0];
        const entity = this.hass.states[entityId];
        if (!entity)
            return;
        if (domain === "media_player") {
            const newState = entity.state === "off" ? "turn_on" : "turn_off";
            await this.hass.callService("media_player", newState, { entity_id: entityId });
        }
        else if (domain === "light") {
            await this.hass.callService("light", "toggle", { entity_id: entityId });
        }
        else if (domain === "climate") {
            await this.hass.callService("climate", entity.state === "off" ? "turn_on" : "turn_off", {
                entity_id: entityId,
            });
        }
        else if (domain === "binary_sensor") {
            this._fire("hass-more-info", { entityId });
        }
    }
    _renderEntityCircle(type) {
        if (!this._config)
            return A;
        const entityId = this._config[`${type}_entity`];
        if (!entityId)
            return A;
        const entity = this._getEntity(type);
        if (!entity)
            return A;
        const active = isActive(entity, type);
        const icon = getEntityIcon(entity, type);
        const color = active ? this._config.active_color : this._config.inactive_color;
        return b `
      <div
        class="entity-circle ${active ? "active" : "inactive"}"
        style="--circle-color: ${color}"
        @click=${(e) => this._handleEntityClick(e, type)}
        @dblclick=${(e) => this._handleEntityDblClick(e, type)}
      >
        <ha-icon icon=${icon} style="color: ${active ? "#fff" : "#aaa"}"></ha-icon>
      </div>
    `;
    }
    render() {
        if (!this._config || !this.hass) {
            return b `<ha-card><div class="placeholder">Configure Room Card</div></ha-card>`;
        }
        const tempEntity = this._getTempEntity();
        const humidityEntity = this._getHumidityEntity();
        const temperature = tempEntity?.attributes.current_temperature;
        const humidity = humidityEntity?.attributes.current_humidity;
        // Collect top row entities (TV, media players) and bottom row entities (climates, lights, smoke)
        const topRowEntities = ["tv", "media_player_1", "media_player_2"].filter((type) => {
            const eid = this._config[`${type}_entity`];
            return !!eid;
        });
        const bottomRowEntities = ["climate_1", "climate_2", "light_1", "light_2", "smoke_detector"].filter((type) => {
            const eid = this._config[`${type}_entity`];
            return !!eid;
        });
        return b `
      <ha-card
        class="room-card"
        style="--room-bg: ${this._config.background_color}; --icon-color: ${this._config.icon_color}"
      >
        ${this._config.title
            ? b `<div class="card-header">${this._config.title}</div>`
            : A}
        <div class="card-body">
          <div class="entities-grid">
            <div class="entity-row">
              ${topRowEntities.map((type) => this._renderEntityCircle(type))}
            </div>
            <div class="entity-row">
              ${bottomRowEntities.map((type) => this._renderEntityCircle(type))}
            </div>
          </div>
          <div class="bottom-bar">
            ${temperature !== undefined
            ? b `
                  <div class="sensor-value">
                    <ha-icon icon="mdi:thermometer"></ha-icon>
                    <span>${temperature}${tempEntity?.attributes.temperature_unit || "°C"}</span>
                  </div>
                `
            : A}
            ${humidity !== undefined
            ? b `
                  <div class="sensor-value">
                    <ha-icon icon="mdi:water-percent"></ha-icon>
                    <span>${humidity}%</span>
                  </div>
                `
            : A}
            ${temperature === undefined && humidity === undefined
            ? b `<div class="sensor-value placeholder-text">--</div>`
            : A}
          </div>
          <div class="room-icon-container">
            <ha-icon
              icon=${this._config.icon || "mdi:home-outline"}
              style="color: ${this._config.icon_color}"
            ></ha-icon>
          </div>
        </div>
      </ha-card>
    `;
    }
};
RoomCard.styles = i$3 `
    :host {
      display: block;
    }

    ha-card.room-card {
      background: var(--room-bg, #1c1c1e);
      border-radius: 16px;
      overflow: hidden;
      position: relative;
    }

    .card-header {
      padding: 16px 16px 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      letter-spacing: 0.3px;
    }

    .card-body {
      padding: 8px 16px 12px;
      position: relative;
    }

    .entities-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .entity-row {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .entity-circle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--circle-color, #636366);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease;
      position: relative;
    }

    .entity-circle:hover {
      transform: scale(1.08);
    }

    .entity-circle.active {
      box-shadow: 0 0 8px 2px rgba(76, 217, 100, 0.3);
    }

    .entity-circle.inactive {
      opacity: 0.6;
    }

    .entity-circle ha-icon {
      --mdi-icon-size: 22px;
      display: flex;
    }

    .bottom-bar {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sensor-value {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-primary-color, #fff);
      font-size: 13px;
      font-weight: 500;
    }

    .sensor-value ha-icon {
      --mdi-icon-size: 16px;
      color: var(--secondary-text-color, #aaa);
    }

    .placeholder-text {
      color: var(--disabled-text-color, #666);
    }

    .room-icon-container {
      position: absolute;
      bottom: 8px;
      left: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .room-icon-container ha-icon {
      --mdi-icon-size: 24px;
    }

    .placeholder {
      padding: 20px;
      text-align: center;
      color: var(--disabled-text-color, #666);
    }
  `;
__decorate([
    n({ attribute: false })
], RoomCard.prototype, "hass", void 0);
__decorate([
    r()
], RoomCard.prototype, "_config", void 0);
RoomCard = RoomCard_1 = __decorate([
    t("room-card")
], RoomCard);

let RoomCardEditor = class RoomCardEditor extends i {
    setConfig(config) {
        this._config = { ...config };
        this._loadHelpers();
    }
    async _loadHelpers() {
        if (this._helpers)
            return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const helpers = await window.loadCardHelpers();
            this._helpers = helpers;
        }
        catch {
            // helpers not available
        }
    }
    _valueChanged(ev) {
        if (!this._config || !this.hass)
            return;
        const target = ev.target;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getValue = (el) => {
            if (el.tagName === "HA-ENTITY-PICKER") {
                return el.value;
            }
            if (el.tagName === "HA-TEXTFIELD" || el.tagName === "INPUT") {
                return el.value;
            }
            return el.value;
        };
        const value = getValue(target);
        const name = target.name;
        if (!name)
            return;
        const newConfig = { ...this._config };
        if (value === "" || value === undefined) {
            delete newConfig[name];
        }
        else {
            newConfig[name] = value;
        }
        this._config = newConfig;
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
        }));
    }
    _getEntities(domain) {
        if (!this.hass)
            return [];
        return Object.keys(this.hass.states)
            .filter((eid) => eid.startsWith(`${domain}.`))
            .sort();
    }
    render() {
        if (!this._config || !this.hass) {
            return b `<div class="editor-placeholder">Loading...</div>`;
        }
        const entityFields = [
            { key: "tv_entity", label: "TV Entity", domain: "media_player" },
            { key: "media_player_1_entity", label: "Sonos / Media Player 1", domain: "media_player" },
            { key: "media_player_2_entity", label: "Sonos / Media Player 2", domain: "media_player" },
            { key: "climate_1_entity", label: "Climate 1 Entity", domain: "climate" },
            { key: "climate_2_entity", label: "Climate 2 Entity", domain: "climate" },
            { key: "light_1_entity", label: "Light 1 Entity", domain: "light" },
            { key: "light_2_entity", label: "Light 2 Entity", domain: "light" },
            { key: "smoke_detector_entity", label: "Smoke Detector Entity", domain: "binary_sensor" },
        ];
        return b `
      <div class="editor">
        <div class="section">
          <div class="section-title">General</div>
          ${this._renderTextField("title", "Title", this._config.title || "")}
          ${this._renderTextField("icon", "Room Icon (e.g. mdi:sofa)", this._config.icon || "")}
          ${this._renderColorField("icon_color", "Icon Color", this._config.icon_color || "#4A90D9")}
          ${this._renderColorField("background_color", "Background Color", this._config.background_color || "#1C1C1E")}
          ${this._renderColorField("active_color", "Active Color", this._config.active_color || "#4CD964")}
          ${this._renderColorField("inactive_color", "Inactive Color", this._config.inactive_color || "#636366")}
        </div>

        <div class="section">
          <div class="section-title">Media</div>
          ${entityFields
            .filter((e) => ["tv_entity", "media_player_1_entity", "media_player_2_entity"].includes(e.key))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>

        <div class="section">
          <div class="section-title">Climate</div>
          ${entityFields
            .filter((e) => e.key.startsWith("climate"))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>

        <div class="section">
          <div class="section-title">Lights</div>
          ${entityFields
            .filter((e) => e.key.startsWith("light"))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>

        <div class="section">
          <div class="section-title">Safety</div>
          ${entityFields
            .filter((e) => e.key.startsWith("smoke"))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>
      </div>
    `;
    }
    _renderTextField(name, label, value) {
        return b `
      <ha-textfield
        .name=${name}
        .label=${label}
        .value=${value}
        @change=${this._valueChanged}
        outlined
        class="field"
      ></ha-textfield>
    `;
    }
    _renderColorField(name, label, value) {
        return b `
      <div class="color-field">
        <ha-textfield
          .name=${name}
          .label=${label}
          .value=${value}
          @change=${this._valueChanged}
          outlined
          class="field"
        ></ha-textfield>
        <input
          type="color"
          .name=${name}
          .value=${value}
          @input=${this._valueChanged}
          class="color-picker"
        />
      </div>
    `;
    }
    _renderEntityPicker(name, label, domain) {
        this._getEntities(domain);
        const value = this._config[name];
        return b `
      <ha-entity-picker
        .hass=${this.hass}
        .name=${name}
        .value=${value || ""}
        .label=${label}
        .includeDomains=${[domain]}
        @value-changed=${this._valueChanged}
        allow-custom-entity
        outlined
        class="field"
      ></ha-entity-picker>
    `;
    }
};
RoomCardEditor.styles = i$3 `
    :host {
      display: block;
    }

    .editor {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }

    .field {
      width: 100%;
    }

    .color-field {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .color-field .field {
      flex: 1;
    }

    .color-picker {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      padding: 2px;
      background: transparent;
    }

    .editor-placeholder {
      padding: 20px;
      text-align: center;
      color: var(--disabled-text-color);
    }
  `;
__decorate([
    n({ attribute: false })
], RoomCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], RoomCardEditor.prototype, "_config", void 0);
__decorate([
    r()
], RoomCardEditor.prototype, "_helpers", void 0);
RoomCardEditor = __decorate([
    t("room-card-editor")
], RoomCardEditor);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowAny = window;
// Register the card with Home Assistant's custom card system
windowAny.customCards = windowAny.customCards || [];
windowAny.customCards.push({
    type: "room-card",
    name: "Room Card",
    description: "A custom card that shows an overview of a room with entities like TVs, speakers, climate, lights, and smoke detectors.",
    documentationURL: "https://github.com/TheBToby/room-card",
});
