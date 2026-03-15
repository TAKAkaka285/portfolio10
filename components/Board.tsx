"use client";
import { useEffect } from "react";

// ─── Turntable widget HTML (SVG too complex for JSX attribute conversion) ───
const TT_HTML = `
<svg id="tt-svg-body" viewBox="0 0 230 148" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#f0b832"/>
      <stop offset="18%"  stop-color="#d4950c"/>
      <stop offset="45%"  stop-color="#b87808"/>
      <stop offset="72%"  stop-color="#9a6206"/>
      <stop offset="100%" stop-color="#7a4c04"/>
    </linearGradient>
    <pattern id="brushPat" x="0" y="0" width="3" height="230" patternUnits="userSpaceOnUse" patternTransform="rotate(168)">
      <rect width="1" height="230" fill="rgba(255,255,255,.06)"/>
      <rect x="1.5" width=".5" height="230" fill="rgba(0,0,0,.04)"/>
    </pattern>
    <radialGradient id="platGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#e8e8e8"/>
      <stop offset="40%"  stop-color="#c0c0c0"/>
      <stop offset="75%"  stop-color="#a8a8a8"/>
      <stop offset="100%" stop-color="#888"/>
    </radialGradient>
    <radialGradient id="vinylGrad" cx="46%" cy="42%" r="55%">
      <stop offset="0%"   stop-color="#2c2c2c"/>
      <stop offset="35%"  stop-color="#181818"/>
      <stop offset="70%"  stop-color="#0d0d0d"/>
      <stop offset="100%" stop-color="#070707"/>
    </radialGradient>
    <radialGradient id="vinylGloss" cx="32%" cy="28%" r="38%">
      <stop offset="0%"  stop-color="rgba(255,255,255,.13)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,.02)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <radialGradient id="vinylGloss2" cx="72%" cy="74%" r="30%">
      <stop offset="0%"  stop-color="rgba(255,255,255,.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <radialGradient id="labelGrad" cx="42%" cy="36%" r="62%">
      <stop offset="0%"   stop-color="#e8c060"/>
      <stop offset="30%"  stop-color="#cc9820"/>
      <stop offset="65%"  stop-color="#a07010"/>
      <stop offset="100%" stop-color="#6a4808"/>
    </radialGradient>
    <filter id="labelTex" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
      <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="blend"/>
      <feComposite in="blend" in2="SourceGraphic" operator="in"/>
    </filter>
    <radialGradient id="spindleGrad" cx="35%" cy="32%" r="65%">
      <stop offset="0%"   stop-color="#444"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <filter id="platShadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="rgba(0,0,0,.75)"/>
    </filter>
    <radialGradient id="housingGrad" cx="38%" cy="32%" r="62%">
      <stop offset="0%"   stop-color="#505050"/>
      <stop offset="45%"  stop-color="#282828"/>
      <stop offset="100%" stop-color="#0e0e0e"/>
    </radialGradient>
    <radialGradient id="bearingGrad" cx="42%" cy="36%" r="58%">
      <stop offset="0%"  stop-color="#5a5a5a"/>
      <stop offset="50%" stop-color="#2a2a2a"/>
      <stop offset="100%" stop-color="#111"/>
    </radialGradient>
    <linearGradient id="armTubeGrad" x1="185" y1="44" x2="130" y2="118" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#b87808"/>
      <stop offset="25%"  stop-color="#e8b030"/>
      <stop offset="55%"  stop-color="#f0c040"/>
      <stop offset="80%"  stop-color="#c89020"/>
      <stop offset="100%" stop-color="#9a6808"/>
    </linearGradient>
    <linearGradient id="armHighlight" x1="185" y1="44" x2="130" y2="118" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="rgba(255,240,160,.5)"/>
      <stop offset="40%"  stop-color="rgba(255,240,160,.25)"/>
      <stop offset="100%" stop-color="rgba(255,240,160,0)"/>
    </linearGradient>
    <linearGradient id="sliderTrackGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#6a3c02"/>
      <stop offset="40%"  stop-color="#8a5204"/>
      <stop offset="100%" stop-color="#5a3001"/>
    </linearGradient>
    <linearGradient id="sliderKnobGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#f4f4f4"/>
      <stop offset="40%"  stop-color="#d8d8d8"/>
      <stop offset="100%" stop-color="#a8a8a8"/>
    </linearGradient>
  </defs>
  <rect width="230" height="148" rx="9" fill="url(#bodyGrad)"/>
  <rect width="230" height="148" rx="9" fill="url(#brushPat)" opacity=".7"/>
  <rect width="230" height="1.5" rx="1" fill="rgba(255,230,120,.3)" y="0.5"/>
  <rect width="230" height="1.5" rx="1" fill="rgba(0,0,0,.35)" y="146"/>
  <circle cx="68" cy="72" r="66" fill="rgba(0,0,0,.45)"/>
  <circle cx="68" cy="72" r="64" fill="url(#platGrad)" filter="url(#platShadow)"/>
  <circle cx="68" cy="72" r="63.5" fill="none" stroke="rgba(255,255,255,.22)" stroke-width=".6"/>
  <circle cx="68" cy="72" r="62.0" fill="none" stroke="rgba(0,0,0,.18)"       stroke-width=".5"/>
  <circle cx="68" cy="72" r="60.5" fill="none" stroke="rgba(255,255,255,.18)" stroke-width=".4"/>
  <circle cx="68" cy="72" r="59.0" fill="none" stroke="rgba(0,0,0,.12)"       stroke-width=".4"/>
  <circle cx="68" cy="72" r="57.5" fill="none" stroke="rgba(255,255,255,.14)" stroke-width=".4"/>
  <circle cx="68" cy="72" r="56.0" fill="none" stroke="rgba(0,0,0,.10)"       stroke-width=".3"/>
  <g id="tt-disc-spin">
    <circle cx="68" cy="72" r="53" fill="url(#vinylGrad)"/>
    <circle cx="68" cy="72" r="52.0" fill="none" stroke="rgba(255,255,255,.07)" stroke-width=".5"/>
    <circle cx="68" cy="72" r="50.5" fill="none" stroke="rgba(255,255,255,.05)" stroke-width=".4"/>
    <circle cx="68" cy="72" r="49.0" fill="none" stroke="rgba(255,255,255,.07)" stroke-width=".5"/>
    <circle cx="68" cy="72" r="47.5" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="46.0" fill="none" stroke="rgba(255,255,255,.06)" stroke-width=".5"/>
    <circle cx="68" cy="72" r="44.5" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="43.0" fill="none" stroke="rgba(255,255,255,.06)" stroke-width=".5"/>
    <circle cx="68" cy="72" r="41.5" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="40.0" fill="none" stroke="rgba(255,255,255,.06)" stroke-width=".4"/>
    <circle cx="68" cy="72" r="38.5" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="37.0" fill="none" stroke="rgba(255,255,255,.05)" stroke-width=".4"/>
    <circle cx="68" cy="72" r="35.5" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="34.0" fill="none" stroke="rgba(255,255,255,.05)" stroke-width=".4"/>
    <circle cx="68" cy="72" r="32.5" fill="none" stroke="rgba(255,255,255,.03)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="31.0" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="29.5" fill="none" stroke="rgba(255,255,255,.03)" stroke-width=".2"/>
    <circle cx="68" cy="72" r="28.0" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
    <circle cx="68" cy="72" r="53" fill="url(#vinylGloss)"/>
    <circle cx="68" cy="72" r="53" fill="url(#vinylGloss2)"/>
    <circle cx="68" cy="72" r="24" fill="url(#labelGrad)" filter="url(#labelTex)"/>
    <circle cx="68" cy="72" r="23.2" fill="none" stroke="rgba(0,0,0,.25)"  stroke-width=".6"/>
    <circle cx="68" cy="72" r="20.0" fill="none" stroke="rgba(0,0,0,.15)"  stroke-width=".4"/>
    <circle cx="68" cy="72" r="17.0" fill="none" stroke="rgba(0,0,0,.10)"  stroke-width=".3"/>
    <ellipse cx="60" cy="63" rx="10" ry="8" fill="rgba(255,255,255,.08)" transform="rotate(-20,68,72)"/>
    <line x1="55" y1="70" x2="81" y2="70" stroke="rgba(0,0,0,.3)" stroke-width=".8"/>
    <line x1="57" y1="73" x2="79" y2="73" stroke="rgba(0,0,0,.2)" stroke-width=".6"/>
    <line x1="60" y1="76" x2="76" y2="76" stroke="rgba(0,0,0,.15)" stroke-width=".5"/>
    <circle cx="68" cy="72" r="12" fill="none" stroke="rgba(0,0,0,.2)" stroke-width=".5"/>
    <circle cx="68" cy="72" r="4.5" fill="#111" stroke="rgba(0,0,0,.8)" stroke-width=".5"/>
    <circle cx="68" cy="72" r="3.0" fill="url(#spindleGrad)"/>
    <circle cx="68" cy="72" r="1.5" fill="#080808"/>
    <circle cx="66.5" cy="70.5" r=".8" fill="rgba(255,255,255,.2)"/>
  </g>
  <circle cx="68" cy="72" r="53" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="1.2"/>
  <circle cx="68" cy="72" r="52.4" fill="none" stroke="rgba(255,255,255,.07)" stroke-width=".5"/>
  <circle cx="187" cy="37" r="29" fill="rgba(0,0,0,.5)" transform="translate(2,4)"/>
  <circle cx="187" cy="37" r="29" fill="url(#housingGrad)" stroke="rgba(0,0,0,.7)" stroke-width="1.5"/>
  <circle cx="187" cy="37" r="28.2" fill="none" stroke="rgba(255,255,255,.09)" stroke-width=".6"/>
  <circle cx="187" cy="37" r="25.5" fill="none" stroke="rgba(255,255,255,.05)" stroke-width=".4"/>
  <circle cx="187" cy="37" r="22.5" fill="none" stroke="rgba(255,255,255,.04)" stroke-width=".3"/>
  <circle cx="187" cy="37" r="14" fill="url(#bearingGrad)" stroke="rgba(0,0,0,.6)" stroke-width=".8"/>
  <circle cx="187" cy="37" r="10" fill="none" stroke="rgba(255,255,255,.07)" stroke-width=".5"/>
  <circle cx="187" cy="37" r="4.5" fill="#222" stroke="rgba(0,0,0,.8)" stroke-width=".8"/>
  <circle cx="187" cy="37" r="2"   fill="#333"/>
  <circle cx="185.8" cy="35.6" r=".8" fill="rgba(255,255,255,.2)"/>
  <g id="tt-arm">
    <path d="M187,45 C184,66 171,80 156,97 L140,116 L133,124" stroke="rgba(0,0,0,.55)" stroke-width="5.5" stroke-linecap="round" transform="translate(2,3)" fill="none"/>
    <path id="tt-arm-path" d="M187,45 C184,66 171,80 156,97 L140,116 L133,124" stroke="url(#armTubeGrad)" stroke-width="3.8" stroke-linecap="round" fill="none"/>
    <path d="M186,46 C183,66 170,80 155,97 L139,116 L132,124" stroke="url(#armHighlight)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <rect x="123" y="119" width="20" height="9" rx="2.5" fill="#282828" stroke="rgba(0,0,0,.7)" stroke-width=".8"/>
    <rect x="124" y="120" width="18" height="7" rx="2" fill="none" stroke="rgba(255,255,255,.06)" stroke-width=".5"/>
    <rect x="122" y="121" width="3" height="6" rx="1" fill="#333" stroke="#111" stroke-width=".5"/>
    <rect x="127" y="121.5" width="14" height="5" rx="1.2" fill="#1a1a1a" stroke="#0a0a0a" stroke-width=".5"/>
    <line x1="129" y1="124" x2="139" y2="124" stroke="rgba(255,255,255,.06)" stroke-width=".5"/>
    <line x1="134" y1="126.5" x2="131" y2="133" stroke="#BC2BFF" stroke-width="1.1" stroke-linecap="round"/>
    <circle cx="131" cy="133" r="1.2" fill="#BC2BFF" opacity=".95"/>
    <circle cx="131" cy="133" r=".5"  fill="rgba(255,255,255,.6)"/>
  </g>
  <rect x="218" y="16" width="7" height="110" rx="3.5" fill="url(#sliderTrackGrad)" stroke="rgba(0,0,0,.5)" stroke-width=".8"/>
  <line x1="218" y1="27"  x2="225" y2="27"  stroke="rgba(255,255,255,.12)" stroke-width=".5"/>
  <line x1="219" y1="34"  x2="224" y2="34"  stroke="rgba(255,255,255,.08)" stroke-width=".4"/>
  <line x1="218" y1="41"  x2="225" y2="41"  stroke="rgba(255,255,255,.12)" stroke-width=".5"/>
  <line x1="219" y1="48"  x2="224" y2="48"  stroke="rgba(255,255,255,.08)" stroke-width=".4"/>
  <line x1="218" y1="55"  x2="225" y2="55"  stroke="rgba(255,255,255,.2)"  stroke-width=".6"/>
  <line x1="219" y1="62"  x2="224" y2="62"  stroke="rgba(255,255,255,.08)" stroke-width=".4"/>
  <line x1="218" y1="69"  x2="225" y2="69"  stroke="rgba(255,255,255,.12)" stroke-width=".5"/>
  <line x1="219" y1="76"  x2="224" y2="76"  stroke="rgba(255,255,255,.08)" stroke-width=".4"/>
  <line x1="218" y1="83"  x2="225" y2="83"  stroke="rgba(255,255,255,.12)" stroke-width=".5"/>
  <line x1="219" y1="90"  x2="224" y2="90"  stroke="rgba(255,255,255,.08)" stroke-width=".4"/>
  <line x1="218" y1="97"  x2="225" y2="97"  stroke="rgba(255,255,255,.12)" stroke-width=".5"/>
  <line x1="219" y1="104" x2="224" y2="104" stroke="rgba(255,255,255,.08)" stroke-width=".4"/>
  <line x1="218" y1="111" x2="225" y2="111" stroke="rgba(255,255,255,.12)" stroke-width=".5"/>
  <rect x="217.5" y="51" width="8" height="19" rx="2" fill="url(#sliderKnobGrad)" stroke="rgba(0,0,0,.5)" stroke-width=".7"/>
  <line x1="218.5" y1="60.5" x2="224.5" y2="60.5" stroke="rgba(0,0,0,.25)" stroke-width=".8"/>
  <rect x="218.5" y="51.5" width="6" height="1" rx=".5" fill="rgba(255,255,255,.5)"/>
  <rect x="6" y="128" width="36" height="14" rx="2" fill="#0e0e0e" stroke="rgba(0,0,0,.7)" stroke-width=".6" filter="url(#platShadow)"/>
  <rect x="7" y="128.5" width="34" height="1" rx=".5" fill="rgba(255,255,255,.05)"/>
</svg>
<div id="tt-controls-wrap">
  <div id="tt-info">
    <div id="tt-track-name">–</div>
    <div id="tt-track-num">–</div>
  </div>
  <div id="tt-controls">
    <div id="tt-led"></div>
    <button class="tt-skip" id="tt-prev">◀◀</button>
    <button id="tt-start">START / STOP</button>
    <button class="tt-skip" id="tt-next">▶▶</button>
    <span id="tt-rpm">33 ⅓</span>
  </div>
</div>
`;

export default function Board() {
  useEffect(() => {
    // ── cleanup registry ─────────────────────────────────────────────────────
    const cleanups: Array<() => void> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const on = (el: EventTarget, type: string, fn: any, opts?: any) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    // ── PENCIL STATE ─────────────────────────────────────────────────────────
    const PENCIL: Record<string, {r:number,g:number,b:number}> = {
      'pencil-dark':{r:20,g:20,b:20},'pencil-mid':{r:80,g:80,b:80},
      'pencil-light':{r:155,g:155,b:155},'pencil-red':{r:160,g:10,b:10},
      'pencil-blue':{r:10,g:20,b:160}
    };
    const strokes: Array<{p:{x:number,y:number}[],c:string,s:number,e:boolean}> = [];
    let curPts: {x:number,y:number}[] = [];
    let dPreset = 'pencil-dark', dSize = 3, isEraser = false, isDrawing = false;

    // ── CURSOR ───────────────────────────────────────────────────────────────
    const curEl = document.getElementById('cur')!;
    let cmx=-200,cmy=-200,ccx=-200,ccy=-200;
    on(document,'mousemove',(e:MouseEvent)=>{cmx=e.clientX;cmy=e.clientY;});
    on(document,'mouseover',(e:MouseEvent)=>{
      if(drawMode){curEl.className='';return;}
      curEl.className=(e.target as Element).closest('.note')?'on-note':'';
    });
    let curRafId: number;
    const cursorLoop=()=>{curRafId=requestAnimationFrame(cursorLoop);ccx+=(cmx-ccx)*.18;ccy+=(cmy-ccy)*.18;curEl.style.left=ccx+'px';curEl.style.top=ccy+'px';};
    cursorLoop();
    cleanups.push(()=>cancelAnimationFrame(curRafId));

    // ── FONTS ────────────────────────────────────────────────────────────────
    const FEN=["'EB Garamond',Georgia,serif","'Helvetica Neue',Helvetica,sans-serif","'IBM Plex Mono',monospace"];
    const FJA=["'Yu Gothic','游ゴシック',sans-serif","'Yu Mincho','游明朝',serif","'Hiragino Kaku Gothic ProN',sans-serif"];
    const pickF=(t:string)=>{const p=/[\u3000-\u9fff]/.test(t)?FJA:FEN;return p[Math.floor(Math.random()*p.length)];};

    // ── DATA ─────────────────────────────────────────────────────────────────
    interface NoteData {
      id:string; nc:string; label:string; title:string; body:string;
      x:number; y:number; rot:number; di:number; sh:string;
      art?:string;         // portfolio notes: centered art HTML
      artDefault?:string;  // work cards: default state Figma image HTML
      artHover?:string;    // work cards: hover state Figma image HTML
      brandColor?:string;  // work cards: brand bg color (hover/active state)
      brandShadow?:string; // work cards: inset shadow color (active state)
      popBg?:string;       // popover brand color (overrides nc color)
      popDesc?:string;     // popover main description
      popMinus?:string;    // unfinished items (shown in red)
      popPlus?:string;     // completed items (shown in green)
      popMeta?:{program?:string;client?:string;period?:string;url?:string};
    }

    // ── Figma asset URLs (valid 7 days from generation) ──
    // Default artwork HTML per work card
    const WD: Record<string,string> = {
      smoke:  `<img src="/images/img-card-smoke.svg"            style="position:absolute;width:144.882px;height:136.107px;left:87.98px;top:117.89px;max-width:none;display:block;">`,
      poetry: `<img src="/images/img-card-poetry.svg"           style="position:absolute;width:117px;height:183px;left:101.5px;top:94.5px;max-width:none;display:block;">`,
      tjh:    `<img src="/images/img-card-theJourneyHome.svg"   style="position:absolute;width:201.042px;height:212px;left:58.49px;top:79.5px;max-width:none;display:block;">`,
      ngs:    `<img src="/images/img-card-naganoShisha.svg"     style="position:absolute;width:120px;height:94px;left:50%;top:50%;transform:translate(-50%,-50%);max-width:none;display:block;">`,
      capx:   `<img src="/images/img-card-captureX.svg"        style="position:absolute;left:67px;top:160px;width:186px;height:52px;max-width:none;display:block;">`,
      gum:    `<img src="/images/img-card-gum.svg"             style="position:absolute;left:44px;top:133px;width:232px;height:106px;max-width:none;display:block;">`,
      nyan2:  `<img src="/images/img-card-sweetRainNyan2.svg"  style="position:absolute;left:19px;top:173px;width:281px;height:25px;max-width:none;display:block;">`,
      pour:   `<img src="/images/img-card-pourRoom.svg"        style="position:absolute;width:110px;height:122px;left:104.98px;top:125.24px;max-width:none;display:block;">`,
      rum33:  `<img src="/images/img-card-rum33.svg"           style="position:absolute;width:201px;height:101px;left:50%;top:50%;transform:translate(-50%,-50%);max-width:none;display:block;">`,
      mizu:   `<img src="/images/img-card-mizubashoSeries.svg" style="position:absolute;width:120px;height:94px;left:50%;top:50%;transform:translate(-50%,-50%);max-width:none;display:block;">`,
      plan10: `<img src="/images/img-card-plan10.svg"          style="position:absolute;width:120px;height:94px;left:50%;top:50%;transform:translate(-50%,-50%);max-width:none;display:block;">`,
    };

    // Hover artwork HTML per work card (centered)
    const WH: Record<string,string> = {
      smoke:  `<img src="/images/img-card-txt-smoke.svg"           style="width:109px;height:133px;max-width:none;display:block;">`,
      poetry: `<img src="/images/img-card-txt-poetry.svg"          style="width:171px;height:18px;max-width:none;display:block;">`,
      tjh:    `<img src="/images/img-card-txt-theJourneyHome.svg"  style="width:257px;height:26px;max-width:none;display:block;">`,
      ngs:    `<img src="/images/img-card-txt-naganoShisha.svg"    style="width:246px;height:101px;max-width:none;display:block;">`,
      capx:   `<img src="/images/img-card-txt-captureX.svg"       style="width:235px;height:29px;max-width:none;display:block;">`,
      gum:    `<img src="/images/img-card-txt-gum.svg"            style="width:170px;height:50px;max-width:none;display:block;">`,
      nyan2:  `<img src="/images/img-card-txt-sweetRainNyan2.svg" style="width:149px;height:70px;max-width:none;display:block;">`,
      pour:   `<img src="/images/img-card-txt-pourRoom.svg"       style="width:135px;height:100px;max-width:none;display:block;">`,
      rum33:  `<img src="/images/img-card-txt-rum33.svg"          style="width:59px;height:93px;max-width:none;display:block;">`,
      mizu:   `<img src="/images/img-card-txt-mizubashoSeries.svg" style="width:134px;height:169px;max-width:none;display:block;transform:rotate(43.16deg);">`,
      plan10: `<img src="/images/img-card-txt-plan10.svg"         style="width:120px;height:60px;max-width:none;display:block;">`,
    };

    const INIT: NoteData[] = [
      // ── Works cards (Figma: ButtonWorks — default/hover/active states) ──
      // default: gray bg | hover: brand color bg | active: brand color + overlay + card-header
      {id:'w-smoke', nc:'nc-gray', label:'Works', title:'Smoke',
        body:'ロゴ・ブランディング制作\nSmell × Work の造語。嗅覚に訴えるビジュアル。\n\n2023 / Identity',
        brandColor:'#ff007f', brandShadow:'rgba(255,0,166,0.5)',
        x:860, y:120, rot:-0.8, di:0, sh:'sh-rect', artDefault:WD.smoke, artHover:WH.smoke,
        popBg:'#FF0090', popDesc:'「色」を「濃淡」によって区別することは普遍的なことだと思いました。そこで、ドライアイスの煙を使ってムービーを作成しました。', popMinus:'raw footage / unedited photos', popPlus:'directed shots, color graded, final cut exported', popMeta:{program:'personal Work',period:'2021 Summer',url:'https://youtu.be/Nu2a9t4Lz14'}},
      {id:'w-poetry', nc:'nc-gray', label:'Works', title:'Poetry',
        body:'タイポグラフィ詩集\n文字そのものが詩となるビジュアルポエム。\n\n2023 / Typography',
        brandColor:'#ff9900', brandShadow:'rgba(0,140,42,0.5)',
        x:1290, y:80, rot:1.2, di:0, sh:'sh-rect', artDefault:WD.poetry, artHover:WH.poetry},
      {id:'w-tjh', nc:'nc-gray', label:'Works', title:'The Journey Home',
        body:'イラスト・ナラティブデザイン\n帰路をテーマにしたビジュアルストーリー。\n\n2022 / Illustration',
        brandColor:'#f25727', brandShadow:'rgba(0,238,255,0.5)',
        x:1720, y:140, rot:-1.5, di:0, sh:'sh-rect', artDefault:WD.tjh, artHover:WH.tjh,
        popDesc:'大学の課題でYSIS GL担当さんの「The Journey Home」のジャケットデザインを制作しました。', popMinus:'raw footage / unedited photos', popPlus:'directed shots, color graded, final cut exported', popMeta:{program:'School Work',period:'2023.12 – 2024.01'}},
      {id:'w-ngs', nc:'nc-gray', label:'Works', title:'Nagano Shisha',
        body:'ブランドデザイン / 長野シーシャ\n静寂と煙をモチーフにしたブランドVI。\n\n2023 / Branding',
        brandColor:'#000000', brandShadow:'rgba(106,0,255,0.5)',
        x:850, y:500, rot:2.1, di:0, sh:'sh-rect', artDefault:WD.ngs, artHover:WH.ngs,
        popBg:'#1a1a1a', popDesc:'地元に新しくオープンしたシーシャ「NAGANO Shisha」の企業ブランディングのアートディレクションを担当しました。', popMinus:'logo design, branding and visual design', popMeta:{client:'NAGANO Shisha',period:'2022.2-8'}},
      {id:'w-capx', nc:'nc-gray', label:'Works', title:'capture.X',
        body:'3Dキャラクターデザイン\nバーチャルアイデンティティの探求。\n\n2023 / 3D / Character',
        brandColor:'#ffdd00', brandShadow:'rgba(0,0,0,0.5)',
        x:1280, y:460, rot:-0.5, di:0, sh:'sh-rect', artDefault:WD.capx, artHover:WH.capx,
        popDesc:'宇宙飛行士をモチーフにした3DキャラクターデザインとCGモデリングを制作しました。バーチャルアイデンティティを探求するプロジェクトです。', popMeta:{program:'personal work',period:'2022.5-'}},
      {id:'w-gum', nc:'nc-gray', label:'Works', title:'GUM',
        body:'プロダクトブランディング\nシンプルかつ粘り強いビジュアル言語。\n\n2023 / Product',
        brandColor:'#00ca5b', brandShadow:'rgba(242,87,39,0.5)',
        x:1730, y:500, rot:1.8, di:0, sh:'sh-rect', artDefault:WD.gum, artHover:WH.gum,
        popDesc:'「GUM」のロゴアニメーションを制作しました。', popMinus:'unedited photos / unfinished character modeling', popPlus:'directed shots, character design, 3dcg modeling', popMeta:{program:'personal work',period:'2022.6-7',url:'https://youtube.com/shorts/NEnD30UsXF4?feature=share'}},
      {id:'w-nyan2', nc:'nc-gray', label:'Works', title:'sweet rain / Nyan2',
        body:'MVデザイン / モーショングラフィクス\nsweet rain の MV「Nyan2」ビジュアル制作。\n\n2022 / MV Design',
        brandColor:'#2600ff', brandShadow:'rgba(0,207,41,0.5)',
        x:840, y:880, rot:-1.2, di:0, sh:'sh-rect', artDefault:WD.nyan2, artHover:WH.nyan2,
        popDesc:'下北沢を拠点とするシューゲイザーバンド「sweet rain」の「Nyan2」のMV、ジャケットデザインを制作しました。', popMinus:'raw footage / unedited photos', popPlus:'directed shots, color graded, final cut exported and jacket artwork created', popMeta:{client:'sweet rain',period:'2023.2-3',url:'https://www.youtube.com/watch?v=mXArmzRlGDA'}},
      {id:'w-pour', nc:'nc-gray', label:'Works', title:'Pour Room',
        body:'空間デザイン / アート展示\n「注ぐ」行為をモチーフにしたインスタレーション。\n\n2023 / Space',
        brandColor:'#b2d0de', brandShadow:'rgba(0,80,120,0.5)',
        x:1270, y:860, rot:0.7, di:0, sh:'sh-rect', artDefault:WD.pour, artHover:WH.pour,
        popDesc:'長野市問屋町にあるビンテージショップ「POUR ROOM」のロゴデザインを制作しました。', popMinus:'unfinished logos', popMeta:{client:'POUR ROOM',period:'2025.6',url:'https://www.instagram.com/pour_room_/'}},
      {id:'w-rum33', nc:'nc-gray', label:'Works', title:'RUM 33',
        body:'バーブランディング / Rum33\nネオンと夜をテーマにしたバーの VI。\n\n2023 / Branding',
        brandColor:'#00039a', brandShadow:'rgba(197,240,186,0.5)',
        x:1720, y:840, rot:-2.0, di:0, sh:'sh-rect', artDefault:WD.rum33, artHover:WH.rum33,
        popBg:'#1400FF', popDesc:'フリースタイルラッパー「RUM33」の楽曲のMVとアルバムアートワークのビジュアルデザインを制作しました。', popMinus:'current logo and branding stuff', popMeta:{program:'personal work',url:'https://www.youtube.com/@RUM_33'}},
      {id:'w-mizu', nc:'nc-gray', label:'Works', title:'Mizubasho Series',
        body:'水芭蕉シリーズ / アートプロジェクト\n日本の湿地植物をモチーフにしたアートシリーズ。\n\n2023 / Art Project',
        brandColor:'#ffffff', brandShadow:'rgba(0,0,0,0.3)',
        x:850, y:1260, rot:1.5, di:0, sh:'sh-rect', artDefault:WD.mizu, artHover:WH.mizu},
      {id:'w-plan10', nc:'nc-gray', label:'Works', title:'Plan10',
        body:'音楽・映像制作\n808StateのPlan9にインスパイアされた楽曲と映像。\n\n2025 / Music / Movie',
        brandColor:'#6e00ff', brandShadow:'rgba(255,0,200,0.5)',
        x:1280, y:1240, rot:-0.9, di:0, sh:'sh-rect', artDefault:WD.plan10, artHover:WH.plan10},
    ];

    // ── STATE ─────────────────────────────────────────────────────────────────
    let vx=120,vy=80,vs=1,topZ=0,drawMode=false;
    let activeWorkEl: HTMLElement|null = null;
    // Work cards: randomize positions on each load
    const notes: NoteData[] = INIT.map(d=>{
      if(!d.id.startsWith('w-')) return {...d};
      return {...d, x:400+Math.random()*1600, y:80+Math.random()*1100, rot:(Math.random()-.5)*6};
    });
    const worldEl  = document.getElementById('world')!;
    const svgEl    = document.getElementById('connections')!;
    const zoomEl   = document.getElementById('zoom-hud')!;
    const boardEl  = document.getElementById('board')!;
    const wpEl     = document.getElementById('work-popover')!;

    // ── Crumple animation (SVG turbulence + clip-path) ────────────────────────
    function crumpleAndRemove(el: HTMLElement, onDone?: ()=>void){
      el.classList.add('crumpling');
      const filterId = 'crumple-'+Date.now()+'-'+Math.random().toString(36).slice(2);
      const seed = Math.floor(Math.random()*999);
      const svgFil = document.createElementNS('http://www.w3.org/2000/svg','svg') as SVGSVGElement;
      svgFil.style.cssText='position:fixed;width:0;height:0;overflow:visible;pointer-events:none;top:0;left:0;';
      svgFil.innerHTML=`<defs><filter id="${filterId}" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="${seed}" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G"/>
      </filter></defs>`;
      document.body.appendChild(svgFil);
      const turb = svgFil.querySelector('feTurbulence')!;
      const disp = svgFil.querySelector('feDisplacementMap')!;

      // Per-point random multipliers for organic feel
      const rng = ()=>0.75+Math.random()*0.5;
      const rm = Array.from({length:12},rng);
      const baseTransform = el.style.transform||'';
      const dur = 850;
      const t0 = performance.now();

      function raf(now: number){
        const p = Math.min((now-t0)/dur, 1);
        const e = p*p; // ease-in

        // Turbulence distortion grows
        turb.setAttribute('baseFrequency', String(0.03+e*0.22));
        disp.setAttribute('scale', String(e*110));
        el.style.filter = `url(#${filterId})`;

        // clip-path: 3 points per edge fold inward with per-point oscillation
        const fold = e*48;
        const jit = (i: number, phase: number)=>
          fold * rm[i] * (0.65 + 0.35*Math.sin(p*22+phase));
        const pts = [
          // top edge folds down
          `${12}% ${jit(0,0)}%`,
          `${50}% ${jit(1,1)*0.75}%`,
          `${88}% ${jit(2,2)}%`,
          // right edge folds left
          `${100-jit(3,3)}% ${12}%`,
          `${100-jit(4,4)*0.75}% ${50}%`,
          `${100-jit(5,5)}% ${88}%`,
          // bottom edge folds up
          `${88}% ${100-jit(6,6)}%`,
          `${50}% ${100-jit(7,7)*0.75}%`,
          `${12}% ${100-jit(8,8)}%`,
          // left edge folds right
          `${jit(9,9)}% ${88}%`,
          `${jit(10,10)*0.75}% ${50}%`,
          `${jit(11,11)}% ${12}%`,
        ];
        el.style.clipPath = `polygon(${pts.join(',')})`;

        // Slight wobble rotate + small scale
        const rot = Math.sin(p*10)*e*10;
        const sc  = 1 - e*0.18;
        el.style.transform = `${baseTransform} scale(${sc}) rotate(${rot}deg)`;

        // Fade out last 30%
        el.style.opacity = p < 0.7 ? '1' : String(1-(p-0.7)/0.3);

        if(p < 1){ requestAnimationFrame(raf); }
        else{ svgFil.remove(); onDone?.(); }
      }
      requestAnimationFrame(raf);
    }

    // Clear any notes left over from a previous effect run (React StrictMode mounts twice)
    worldEl.querySelectorAll('.note').forEach(n=>n.remove());
    svgEl.innerHTML='';
    const canvas   = document.getElementById('draw-canvas') as HTMLCanvasElement;
    const ctx      = canvas.getContext('2d')!;
    const dtEl     = document.getElementById('draw-toolbar')!;
    const btnDraw  = document.getElementById('btn-draw')!;
    const noteModal= document.getElementById('note-modal')!;

    // ── RENDER BODY ───────────────────────────────────────────────────────────
    function renderBody(body: string): string {
      if(body==='<contact/>'){
        return `<div class="contact-form">
          <div class="cf-row"><label>Name</label><input type="text" class="cf-name" placeholder="Your name"></div>
          <div class="cf-row"><label>Email</label><input type="email" class="cf-email" placeholder="your@email.com"></div>
          <div class="cf-row"><label>Message</label><textarea class="cf-msg" rows="4" placeholder="Tell me about your project..."></textarea></div>
          <button class="cf-submit">Send Message →</button>
          <div class="cf-sent">✓ Sent — I'll get back to you soon.</div>
        </div>`;
      }
      return body.replace(/\n/g,'<br>');
    }

    // ── BUILD NOTE ────────────────────────────────────────────────────────────
    const TRASH_ICO=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>`;
    function buildNote(d: NoteData){
      const isWork=d.id.startsWith('w-');
      const el=document.createElement('div');
      el.className=`note ${d.nc} ${d.sh||'sh-rect'}${isWork?' note-work':''}`;
      el.id='n-'+d.id;
      el.style.cssText=`left:${d.x}px;top:${d.y}px;transform:rotate(${d.rot}deg);width:320px;position:absolute;z-index:${++topZ};`;

      if(isWork){
        // ── Work card: Figma ButtonWorks layout ──
        // Default: gray bg + artwork image
        // Hover:   brand color bg + title text artwork
        // Active:  brand color + 20% overlay + card-header + inset shadow
        if(d.brandColor) el.style.setProperty('--brand', d.brandColor);
        if(d.brandShadow) el.style.setProperty('--brand-shadow', d.brandShadow);
        el.innerHTML=`
          <div class="paper">
            <div class="work-art-default">${d.artDefault||''}</div>
            <div class="work-art-hover">${d.artHover||''}</div>
            <div class="work-active-overlay"></div>
            <div class="work-card-header">
              <div class="wch-seg"></div><div class="wch-seg"></div>
              <div class="wch-seg"></div><div class="wch-seg"></div>
              <div class="wch-seg"></div>
            </div>
            <button class="note-close"><img src="/icons/icon-delete-enable.svg" width="48" height="48" alt="" draggable="false"></button>
          </div>`;
      } else {
        // ── Portfolio note: centered art + hover title overlay ──
        el.innerHTML=`
          <div class="paper">
            <div class="note-fold"></div>
            <div class="note-inner">
              <div class="note-art-default">${d.art||''}</div>
              <div class="note-title" style="font-family:${pickF(d.title)}">${d.title.replace(/\n/g,'<br>')}</div>
              <div class="note-body">${renderBody(d.body)}</div>
            </div>
            <button class="note-close">${TRASH_ICO}</button>
          </div>`;
      }
      el.addEventListener('dragstart',(e)=>e.preventDefault());
      let dragged=false;
      el.addEventListener('mousedown',(e)=>{
        e.stopPropagation();
        el.style.transition=''; // cancel any active transition to prevent ghost
        el.style.zIndex=String(++topZ);
        dragged=false;
        const sx=e.clientX,sy=e.clientY,ox=d.x,oy=d.y;
        const mv=(ev:MouseEvent)=>{const dx=(ev.clientX-sx)/vs,dy=(ev.clientY-sy)/vs;if(Math.abs(dx)>2||Math.abs(dy)>2){dragged=true;el.classList.add('dragging');}d.x=ox+dx;d.y=oy+dy;el.style.left=d.x+'px';el.style.top=d.y+'px';drawConns();};
        const up=()=>{el.classList.remove('dragging');window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up);};
        window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);
      });
      el.addEventListener('click',(e)=>{
        if(dragged)return;
        if((e.target as Element).closest('.note-close'))return;
        if((e.target as Element).closest('.cf-submit'))return;
        if(isWork){openWorkPopover(d);return;}
        const was=el.classList.contains('expanded');
        document.querySelectorAll('.note.expanded').forEach(n=>n.classList.remove('expanded'));
        if(!was){el.classList.add('expanded');el.style.zIndex=String(++topZ);}
      });
      el.querySelector('.note-close')!.addEventListener('click',(e)=>{
        e.stopPropagation();
        el.classList.remove('expanded');
        if(isWork){el.classList.remove('active');wpEl.classList.remove('open');activeWorkEl=null;}
        crumpleAndRemove(el, ()=>el.remove());
      });
      worldEl.appendChild(el);
    }
    notes.forEach(buildNote);

    // ── WORK POPOVER (modeless floating window) ───────────────────────────────
    // Per-work popup data (Figma PopOver frames, asset URLs valid 7 days)
    interface PopImg { src:string; withPlay?:boolean; imgBg?:string; }
    interface PopData {
      bg:string; headerName:string;
      logo?:string; titleArt?:string; images?:PopImg[];
      desc?:string; minus?:string; plus?:string;
      meta?:{program?:string;client?:string;period?:string;url?:string};
      textDark?:boolean;
    }
    const POP: Record<string,PopData> = {
      'w-smoke':{bg:'#ff007f',headerName:'smoke',
        logo:'/icons/icon-header-smoke.svg',
        titleArt:'/images/img-content-txt-smoke.svg',
        images:[{src:'https://www.figma.com/api/mcp/asset/8d4889f7-4ea4-4919-86c5-0da960189c88',withPlay:true}],
        desc:'「色」を「濃淡」によって区別することは普遍的なことだと思いました。\nそこで、ドライアイスの煙を使ってムービーを作成しました。',
        minus:'raw footage / unedited photos',plus:'directed shots, color graded, final cut exported',
        meta:{program:'personal Work',period:'2021 Summer',url:'https://youtu.be/Nu2a9t4Lz14'}},
      'w-tjh':{bg:'#f25727',headerName:'theJorneyHome',
        logo:'/icons/icon-header-theJorneyHome.svg',
        titleArt:'/images/img-content-txt-theJourneyHome.svg',
        images:[
          {src:'/images/img-content-main-theJourneyHome.png'},
          {src:'/images/img-content-theJourneyHome01.png',imgBg:'#000'},
          {src:'/images/img-content-theJourneyHome02.png',imgBg:'#000'},
          {src:'/images/img-content-theJourneyHome03.png',imgBg:'#000'},
        ],
        desc:'大学の課題でYSIG Gt.吉澤成友さんの「The Journey Home」のジャケットデザインを制作しました。',
        minus:'raw footage / unedited photos',plus:'shot, jacket artwork created, final cut exported',
        meta:{program:'School Work',period:'2021.12.02 — 16'}},
      'w-ngs':{bg:'#000000',headerName:'naganoShisha',
        logo:'/icons/icon-header-naganoShisha.svg',
        titleArt:'/images/img-content-txt-naganoShisha.svg',
        images:[
          {src:'/images/img-content-main-naganoShisha.png'},
          {src:'/images/img-content-naganoShisha01.png',imgBg:'#202225'},
          {src:'/images/img-content-naganoShisha02.png',imgBg:'#202225'},
          {src:'/images/img-content-naganoShisha03.png',imgBg:'#202225'},
          {src:'/images/img-content-naganoShisha04.svg',imgBg:'#202225'},
          {src:'/images/img-content-naganoShisha05.png',imgBg:'#202225'},
        ],
        desc:'長野市にあるシーシャバー「NAGANO shisha」の店舗ブランディングおよびアートディレクションを担当しました。',
        minus:'unfinished branding',plus:'store design, branding, and visual design',
        meta:{client:'NAGANO Shisha',period:'2022.2-6',url:'https://www.nagano-shisha.jp'}},
      'w-capx':{bg:'#ffdd00',headerName:'captureX',textDark:true,
        logo:'/icons/icon-header-captureX.svg',
        titleArt:'/images/img-content-txt-captureX.svg',
        images:[
          {src:'/images/img-content-main-captureX.png'},
          {src:'/images/img-content-captureX01.png'},
          {src:'/images/img-content-captureX02.svg'},
          {src:'/images/img-content-captureX03.svg'},
          {src:'/images/img-content-captureX04.png'},
          {src:'/images/img-content-captureX05.png'},
          {src:'/images/img-content-captureX06.png'},
          {src:'/images/img-content-captureX07.png'},
        ],
        desc:'株式会社bajjiからリリースされている環境貢献型NFT「capture.x」のNFTキャラクターを制作しました。',
        minus:'unfinished character modeling',plus:'character design, 3dcg modeling',
        meta:{client:'bajji, inc.',period:'2023.3-5',url:'https://capturex.studio.site'}},
      'w-gum':{bg:'#00ca5b',headerName:'gum',textDark:true,
        logo:'/icons/icon-header-gum.svg',
        titleArt:'/images/img-content-txt-gum.svg',
        images:[{src:'https://www.figma.com/api/mcp/asset/1d1c2912-fdce-407e-b448-713eb2fadeb7',withPlay:true}],
        desc:'「GUM」のロゴアニメーションを制作しました。',
        minus:'unedited photos / unfinished character modeling',plus:'directed shots, character design, 3dcg modeling',
        meta:{program:'personal work',period:'2022.6-7',url:'https://youtube.com/shorts/NEnD30UsXF4?feature=share'}},
      'w-nyan2':{bg:'#2600ff',headerName:'sweetRainNyan2',
        logo:'/icons/icon-header-sweetRainNyan2.svg',
        titleArt:'/images/img-content-txt-sweetRainNyan2.svg',
        images:[
          {src:'/images/img-content-sweetRainNyan201.svg',withPlay:true},
          {src:'/images/img-content-sweetRainNyan202.png'},
        ],
        desc:'下北沢を拠点とするシューゲイザーバンド「sweet rain」の「Nyan2」のMV、ジャケットデザインを制作しました。',
        minus:'raw footage / unedited photos',plus:'directed shots, color graded, final cut exported and jacket artwork created',
        meta:{client:'sweet rain',period:'2023.2-3',url:'https://www.youtube.com/watch?v=mXArmzRI0DA'}},
      'w-pour':{bg:'#b2d0de',headerName:'pourRoom',
        logo:'/icons/icon-header-pourRoom.svg',
        titleArt:'/images/img-content-txt-pourRoom.svg',
        images:[
          {src:'/images/img-content-main-pourRoom.png'},
          {src:'/images/img-content-pourRoom01.svg',imgBg:'#fff'},
          {src:'/images/img-content-pourRoom02.svg',imgBg:'#fff'},
          {src:'/images/img-content-pourRoom03.svg',imgBg:'#fff'},
        ],
        desc:'長野市南千歳にあるビンテージショップ「POUR ROOM」のロゴデザインを制作しました。',
        minus:'unfinished logos',plus:'created logo and shopcard design',
        meta:{client:'POUR ROOM',period:'2025.6-',url:'https://www.instagram.com/pour_room__/'}},
      'w-rum33':{bg:'#00039a',headerName:'rum33',
        logo:'/icons/icon-header-rum33.svg',
        titleArt:'/images/img-content-txt-rum33.svg',
        images:[
          {src:'/images/img-content-main-rum33.png'},
          {src:'/images/img-content-rum3301.svg'},
          {src:'/images/img-content-rum3302.svg'},
          {src:'/images/img-content-rum3303.png'},
          {src:'/images/img-content-rum3304.png'},
          {src:'https://www.figma.com/api/mcp/asset/325baf17-a2d8-4915-9661-2ade0c46f00e',withPlay:true},
          {src:'https://www.figma.com/api/mcp/asset/a3532bd0-2a44-4026-8b9a-aa189e1e4356',withPlay:true},
          {src:'https://www.figma.com/api/mcp/asset/e868c936-d62e-4378-83e7-45358df73159',withPlay:true},
        ],
        desc:'長野市で拠点とするラッパー「RUM33」のロゴデザイン、ジャケットデザイン、アートディレクションを担当しました。',
        minus:'unfinished logos / unfinished art direction',plus:'created logo, jacket artwork and directed branding',
        meta:{client:'RUM33',period:'2025.4-',url:'https://www.youtube.com/@RUM_33'}},
      'w-plan10':{bg:'#6e00ff',headerName:'plan10',
        logo:'/icons/icon-header-plan10.svg',
        titleArt:'/images/img-content-txt-plan10.svg',
        images:[{src:'https://www.figma.com/api/mcp/asset/39c715ea-10dd-4797-9cff-a3ff5577adf8',withPlay:true,imgBg:'#000'}],
        desc:'808Stateの「Plan9」を参考に、「Plan10」を制作しました。',
        minus:'unfinished nothing',plus:'created music and movie',
        meta:{program:'personal work',period:'2025.5-12',url:'https://youtu.be/dQppdMuRjVc'}},
    };
    function openWorkPopover(d: NoteData){
      const pop = POP[d.id];
      if(!pop) return;
      // Mark card as active (Figma active state)
      if(activeWorkEl) activeWorkEl.classList.remove('active');
      activeWorkEl = document.getElementById('n-'+d.id);
      if(activeWorkEl) activeWorkEl.classList.add('active');
      const tc = pop.textDark ? '#111' : '#fff';
      // background
      document.getElementById('wp-window')!.style.background = pop.bg;
      // logo
      const logoImg = document.getElementById('wp-logo-img') as HTMLImageElement;
      if(pop.logo){logoImg.src=pop.logo;logoImg.style.display='block';}
      else logoImg.style.display='none';
      // header name
      document.getElementById('wp-name-text')!.textContent = pop.headerName;
      // close icon (inline SVG — no src needed)
      // title art
      const artImg = document.getElementById('wp-art-img') as HTMLImageElement;
      if(pop.titleArt){artImg.src=pop.titleArt;artImg.style.display='block';}
      else artImg.style.display='none';
      // images
      const imagesEl = document.getElementById('wp-images')!;
      imagesEl.innerHTML=(pop.images||[]).map(img=>{
        const bgAttr=img.imgBg?` style="background:${img.imgBg}"`:'';
        const imgTag=`<img src="${img.src}" class="wp-content-img" draggable="false">`;
        const playSvg=`<img src="/icons/icon-playMovie.svg" width="96px" height="96px" alt="" draggable="false">`;
        if(img.withPlay){return `<div class="wp-img-wrap"${bgAttr}>${imgTag}<div class="wp-play-icon">${playSvg}</div></div>`;}
        return `<div class="wp-img-wrap"${bgAttr}>${imgTag}</div>`;
      }).join('');
      // text band
      const textBand=document.getElementById('wp-text-band')!;
      textBand.style.background=pop.bg; textBand.style.color=tc;
      document.getElementById('wp-desc')!.innerHTML=(pop.desc||'').replace(/\n/g,'<br>');
      let cHtml='';
      if(pop.minus) cHtml+=`<div class="wp-code-minus">- ${pop.minus}</div>`;
      if(pop.plus)  cHtml+=`<div class="wp-code-plus">+ ${pop.plus}</div>`;
      const m=pop.meta;
      if(m){
        cHtml+=`<div>&nbsp;</div>`;
        if(m.program) cHtml+=`<div>  program : ${m.program}</div>`;
        if(m.client)  cHtml+=`<div>  cliant  : ${m.client}</div>`;
        if(m.period)  cHtml+=`<div>  period  : ${m.period}</div>`;
        if(m.url)     cHtml+=`<div>  url     : <a href="${m.url}" target="_blank" rel="noopener" class="wp-code-url">${m.url}</a></div>`;
      }
      document.getElementById('wp-code')!.innerHTML=cHtml;
      // trash icon (inline SVG — no src needed)
      // reset scroll, position, show
      document.getElementById('wp-body')!.scrollTop=0;
      wpEl.classList.add('open');
      // Position near the clicked card, clamped to screen
      const cardEl=document.getElementById('n-'+d.id);
      const wpWin=document.getElementById('wp-window')!;
      const wpW=wpEl.offsetWidth||800;
      const margin=20;
      let left=margin, top=margin;
      if(cardEl){
        const r=cardEl.getBoundingClientRect();
        // prefer right of card, fallback left, fallback center
        if(r.right+margin+wpW<=window.innerWidth){
          left=r.right+margin;
        } else if(r.left-margin-wpW>=0){
          left=r.left-margin-wpW;
        } else {
          left=Math.max(margin,(window.innerWidth-wpW)/2);
        }
        // align top with card top, clamped to margin from screen top
        top=Math.max(margin,r.top);
      }
      wpEl.style.left=left+'px';
      wpEl.style.top=top+'px';
      // Constrain window height so it never exceeds screen bottom
      wpWin.style.maxHeight=(window.innerHeight-top-margin)+'px';
    }
    // Resizable window
    const wpWinEl=document.getElementById('wp-window')!;
    let rsing=false, rsDir='', rsX=0, rsY=0, rsW=0, rsH=0;
    (['wp-rs-r','wp-rs-b','wp-rs-br'] as const).forEach(id=>{
      document.getElementById(id)!.addEventListener('mousedown',(e)=>{
        rsing=true; rsDir=id.replace('wp-rs-','');
        rsX=e.clientX; rsY=e.clientY;
        rsW=wpWinEl.offsetWidth; rsH=wpWinEl.offsetHeight;
        // Lock both dimensions to prevent reflow-driven changes
        wpWinEl.style.width=rsW+'px';
        wpWinEl.style.height=rsH+'px';
        wpWinEl.style.maxHeight='none';
        e.preventDefault(); e.stopPropagation();
      });
    });
    window.addEventListener('mousemove',(e)=>{
      if(!rsing)return;
      if(rsDir==='r'||rsDir==='br') wpWinEl.style.width=Math.max(320,rsW+(e.clientX-rsX))+'px';
      if(rsDir==='b'||rsDir==='br') wpWinEl.style.height=Math.max(200,rsH+(e.clientY-rsY))+'px';
    });
    window.addEventListener('mouseup',()=>{ rsing=false; });
    // Draggable header
    let wpDrag=false, wpOx=0, wpOy=0;
    const wpBarEl = document.getElementById('wp-bar')!;
    wpBarEl.addEventListener('mousedown',(e)=>{
      if((e.target as Element).closest('#wp-close')||(e.target as Element).closest('#wp-tab-btn'))return;
      wpDrag=true; wpOx=e.clientX-wpEl.getBoundingClientRect().left; wpOy=e.clientY-wpEl.getBoundingClientRect().top;
      e.preventDefault(); e.stopPropagation();
    });
    window.addEventListener('mousemove',(e)=>{
      if(!wpDrag)return;
      const ww=wpEl.offsetWidth;
      wpEl.style.left=Math.max(0,Math.min(window.innerWidth-ww,e.clientX-wpOx))+'px';
      wpEl.style.top=Math.max(0,e.clientY-wpOy)+'px';
    });
    window.addEventListener('mouseup',()=>{wpDrag=false;});
    const closePopover=()=>{
      wpEl.classList.remove('open');
      if(activeWorkEl){activeWorkEl.classList.remove('active');activeWorkEl=null;}
      // restore from fullscreen if needed
      if(wpEl.classList.contains('wp-fs')) exitFullscreen();
    };
    document.getElementById('wp-close')!.addEventListener('click',closePopover);
    document.getElementById('wp-trash-btn')!.addEventListener('click',()=>{
      // Crumple the active card simultaneously
      if(activeWorkEl){
        const cardEl = activeWorkEl;
        activeWorkEl = null;
        crumpleAndRemove(cardEl, ()=>cardEl.remove());
      }
      // Crumple the floating window
      crumpleAndRemove(wpWinEl, ()=>{
        wpWinEl.style.cssText='';
        wpWinEl.classList.remove('crumpling');
        wpEl.classList.remove('open','wp-fs');
      });
    });
    on(document,'keydown',(e:KeyboardEvent)=>{if(e.key==='Escape')closePopover();});
    // Fullscreen toggle — uses native Fullscreen API
    const tabBtn=document.getElementById('wp-tab-btn')!;

    function enterFullscreen(){
      const el = wpWinEl as Element & {
        webkitRequestFullscreen?:()=>Promise<void>;
        msRequestFullscreen?:()=>Promise<void>;
      };
      if(el.requestFullscreen) el.requestFullscreen();
      else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if(el.msRequestFullscreen) el.msRequestFullscreen();
    }
    function exitFullscreen(){
      const doc = document as Document & {
        webkitExitFullscreen?:()=>Promise<void>;
        msExitFullscreen?:()=>Promise<void>;
      };
      if(doc.exitFullscreen) doc.exitFullscreen();
      else if(doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if(doc.msExitFullscreen) doc.msExitFullscreen();
    }
    document.addEventListener('fullscreenchange',()=>{
      const isFs = !!document.fullscreenElement;
      wpEl.classList.toggle('wp-fs', isFs);
      (document.getElementById('wp-tab-img') as HTMLImageElement).src = isFs
        ? '/icons/icon-allDisplayClose-enable.svg'
        : '/icons/icon-allDisplayOpen-enable.svg';
    });
    tabBtn.addEventListener('click',()=>{
      if(document.fullscreenElement) exitFullscreen();
      else enterFullscreen();
    });
    cleanups.push(closePopover);

    // ── CONTACT FORM (event delegation) ──────────────────────────────────────
    function sendContact(noteEl: Element){
      const name  =(noteEl.querySelector('.cf-name')  as HTMLInputElement)?.value?.trim()||'';
      const email =(noteEl.querySelector('.cf-email') as HTMLInputElement)?.value?.trim()||'';
      const msg   =(noteEl.querySelector('.cf-msg')   as HTMLTextAreaElement)?.value?.trim()||'';
      if(!name||!email||!msg){alert('Please fill in all fields.');return;}
      const subject=encodeURIComponent(`Portfolio Contact from ${name}`);
      const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
      fetch('https://formspree.io/f/xwkgvdjr',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name,email,message:msg,_replyto:email})})
        .then(r=>{
          const sent=noteEl.querySelector('.cf-sent') as HTMLElement;
          if(r.ok&&sent){sent.style.display='block';}
          else{window.open(`mailto:takaya112520@gmail.com?subject=${subject}&body=${body}`);}
        }).catch(()=>window.open(`mailto:takaya112520@gmail.com?subject=${subject}&body=${body}`));
    }
    on(document,'click',(e:MouseEvent)=>{
      const btn=(e.target as Element).closest('.cf-submit');
      if(!btn)return;
      const noteEl=btn.closest('.note');
      if(noteEl)sendContact(noteEl);
    });

    // ── CONNECTIONS ───────────────────────────────────────────────────────────
    let drawConns = ()=>{};

    function drawConnsInteractive(){
      svgEl.innerHTML='';
      // Work card chain connections
      const WORK_IDS=['w-smoke','w-poetry','w-tjh','w-ngs','w-capx','w-gum','w-nyan2','w-pour','w-rum33','w-mizu','w-plan10'];
      const C:Record<string,string[]>={};
      WORK_IDS.forEach((id,i)=>{ if(i<WORK_IDS.length-1) C[id]=[WORK_IDS[i+1]]; });
      // Extra cross-connections for organic look
      C['w-smoke'].push('w-ngs'); C['w-tjh'].push('w-gum'); C['w-capx'].push('w-nyan2');
      const ns='http://www.w3.org/2000/svg';
      Object.entries(C).forEach(([fid,tids])=>{
        const fd=notes.find(n=>n.id===fid);if(!fd)return;
        tids.forEach(tid=>{
          const td=notes.find(n=>n.id===tid);if(!td)return;
          const p=document.createElementNS(ns,'path');
          const cx=fd.x+160, cy=fd.y+186, tx=td.x+160, ty=td.y+186;
          const mx=(cx+tx)/2, my=(cy+ty)/2;
          p.setAttribute('d',`M${cx},${cy} Q${mx},${my} ${tx},${ty}`);
          p.setAttribute('fill','none');p.setAttribute('stroke','rgba(255,255,255,.25)');p.setAttribute('stroke-width','1.5');p.setAttribute('stroke-dasharray','5,4');
          p.style.cursor='pointer';p.style.transition='stroke .15s';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p as any)._snapping=false;
          p.addEventListener('mouseenter',()=>p.setAttribute('stroke','rgba(188,43,255,.7)'));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          p.addEventListener('mouseleave',()=>{if(!(p as any)._snapping)p.setAttribute('stroke','rgba(255,255,255,.25)');});
          p.addEventListener('click',()=>{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if((p as any)._snapping)return;(p as any)._snapping=true;
            p.setAttribute('stroke','#BC2BFF');p.setAttribute('stroke-width','2.5');
            let t=0;
            const snap=()=>{t+=0.18;const boom=Math.sin(t*Math.PI)*28*Math.exp(-t*1.1);p.setAttribute('d',`M${fd.x+115},${fd.y+65} Q${mx},${my+boom} ${td.x+115},${td.y+65}`);
              if(t<3.5)requestAnimationFrame(snap);
              else{p.setAttribute('d',`M${fd.x+115},${fd.y+65} Q${mx},${my} ${td.x+115},${td.y+65}`);p.setAttribute('stroke','rgba(255,255,255,.25)');p.setAttribute('stroke-width','1.5');(p as any)._snapping=false;}
            };snap();
            try{const ac=new AudioContext();const osc=ac.createOscillator();const g=ac.createGain();osc.type='triangle';osc.frequency.setValueAtTime(320,ac.currentTime);osc.frequency.exponentialRampToValueAtTime(120,ac.currentTime+0.4);g.gain.setValueAtTime(0.18,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.5);osc.connect(g);g.connect(ac.destination);osc.start();osc.stop(ac.currentTime+0.5);}catch(_){}
          });
          svgEl.appendChild(p);
        });
      });
    }
    drawConns=drawConnsInteractive;
    drawConnsInteractive();

    // ── DRAW ENGINE ───────────────────────────────────────────────────────────
    function screenToWorld(sx:number,sy:number){return{x:(sx-vx)/vs,y:(sy-vy)/vs};}
    function worldToScreen(wx:number,wy:number){return{x:wx*vs+vx,y:wy*vs+vy};}

    function paintStroke(pts:{x:number,y:number}[],preset:string,size:number,erase:boolean){
      if(pts.length<2)return;
      const sp=pts.map(p=>worldToScreen(p.x,p.y));
      ctx.save();
      if(erase){
        ctx.globalCompositeOperation='destination-out';ctx.strokeStyle='rgba(0,0,0,1)';ctx.lineWidth=size*vs*8;ctx.lineCap=ctx.lineJoin='round';
        ctx.beginPath();ctx.moveTo(sp[0].x,sp[0].y);
        for(let i=1;i<sp.length-1;i++)ctx.quadraticCurveTo(sp[i].x,sp[i].y,(sp[i].x+sp[i+1].x)/2,(sp[i].y+sp[i+1].y)/2);
        ctx.lineTo(sp[sp.length-1].x,sp[sp.length-1].y);ctx.stroke();
      }else{
        const p=PENCIL[preset]||PENCIL['pencil-dark'];
        ctx.globalCompositeOperation='source-over';ctx.strokeStyle=`rgb(${p.r},${p.g},${p.b})`;
        ctx.lineWidth=size*vs;ctx.lineCap=ctx.lineJoin='round';ctx.globalAlpha=1;
        ctx.beginPath();ctx.moveTo(sp[0].x,sp[0].y);
        for(let i=1;i<sp.length-1;i++)ctx.quadraticCurveTo(sp[i].x,sp[i].y,(sp[i].x+sp[i+1].x)/2,(sp[i].y+sp[i+1].y)/2);
        ctx.lineTo(sp[sp.length-1].x,sp[sp.length-1].y);ctx.stroke();
      }
      ctx.restore();
    }
    function redraw(){ctx.clearRect(0,0,canvas.width,canvas.height);strokes.forEach(s=>paintStroke(s.p,s.c,s.s,s.e));}

    function resizeCanvas(){
      const tmp=document.createElement('canvas');tmp.width=canvas.width;tmp.height=canvas.height;
      tmp.getContext('2d')!.drawImage(canvas,0,0);
      canvas.width=window.innerWidth;canvas.height=window.innerHeight;
      ctx.drawImage(tmp,0,0);redraw();
    }
    on(window,'resize',resizeCanvas);
    resizeCanvas();

    // draw pointer events
    on(window,'mousedown',(e:MouseEvent)=>{
      if(!drawMode)return;if((e.target as Element).closest('#toolbar,#draw-toolbar,#logo,#zoom-hud'))return;
      isDrawing=true;curPts=[screenToWorld(e.clientX,e.clientY)];
    });
    on(window,'mousemove',(e:MouseEvent)=>{
      if(!drawMode||!isDrawing)return;curPts.push(screenToWorld(e.clientX,e.clientY));redraw();paintStroke(curPts,dPreset,dSize,isEraser);
    });
    on(window,'mouseup',()=>{
      if(!drawMode||!isDrawing)return;isDrawing=false;if(curPts.length>1)strokes.push({p:[...curPts],c:dPreset,s:dSize,e:isEraser});curPts=[];redraw();
    });
    on(window,'touchstart',(e:TouchEvent)=>{
      if(!drawMode||e.touches.length!==1)return;if((e.target as Element).closest('#toolbar,#draw-toolbar,#logo,#zoom-hud'))return;
      e.preventDefault();isDrawing=true;curPts=[screenToWorld(e.touches[0].clientX,e.touches[0].clientY)];
    },{passive:false});
    on(window,'touchmove',(e:TouchEvent)=>{
      if(!drawMode||!isDrawing)return;e.preventDefault();curPts.push(screenToWorld(e.touches[0].clientX,e.touches[0].clientY));redraw();paintStroke(curPts,dPreset,dSize,isEraser);
    },{passive:false});
    on(window,'touchend',()=>{
      if(!drawMode||!isDrawing)return;isDrawing=false;if(curPts.length>1)strokes.push({p:[...curPts],c:dPreset,s:dSize,e:isEraser});curPts=[];redraw();
    },{passive:false});

    // ── PAN / ZOOM ────────────────────────────────────────────────────────────
    function applyT(){
      worldEl.style.transform=`translate(${vx}px,${vy}px) scale(${vs})`;
      zoomEl.textContent=Math.round(vs*100)+'%';
      (boardEl as HTMLElement).style.backgroundPosition=`${vx%40}px ${vy%40}px`;
      redraw();
    }
    applyT();

    let pan=false,psx=0,psy=0,pvx=0,pvy=0;
    on(boardEl,'mousedown',(e:MouseEvent)=>{
      if(drawMode)return;if((e.target as Element).closest('.note'))return;
      pan=true;psx=e.clientX;psy=e.clientY;pvx=vx;pvy=vy;
    });
    on(window,'mousemove',(e:MouseEvent)=>{if(!pan)return;vx=pvx+(e.clientX-psx);vy=pvy+(e.clientY-psy);applyT();});
    on(window,'mouseup',()=>pan=false);
    on(boardEl,'wheel',(e:WheelEvent)=>{
      e.preventDefault();if(drawMode)return;
      const f=e.deltaY>0?.88:1.14,ns=Math.max(.1,Math.min(4,vs*f));
      vx=e.clientX-(e.clientX-vx)*(ns/vs);vy=e.clientY-(e.clientY-vy)*(ns/vs);vs=ns;applyT();
    },{passive:false});

    let t0:number|null=null,tpan=false,tsx=0,tsy=0,tvx=0,tvy=0;
    const tDist=(e:TouchEvent)=>{const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;return Math.sqrt(dx*dx+dy*dy);};
    const tMid=(e:TouchEvent)=>({x:(e.touches[0].clientX+e.touches[1].clientX)/2,y:(e.touches[0].clientY+e.touches[1].clientY)/2});
    on(boardEl,'touchstart',(e:TouchEvent)=>{if(drawMode)return;if(e.touches.length===1){tpan=true;tsx=e.touches[0].clientX;tsy=e.touches[0].clientY;tvx=vx;tvy=vy;}if(e.touches.length===2)t0=tDist(e);},{passive:true});
    on(boardEl,'touchmove',(e:TouchEvent)=>{
      e.preventDefault();if(drawMode)return;
      if(e.touches.length===1&&tpan){vx=tvx+(e.touches[0].clientX-tsx);vy=tvy+(e.touches[0].clientY-tsy);applyT();}
      if(e.touches.length===2&&t0){const nd=tDist(e),ns=Math.max(.1,Math.min(4,vs*(nd/t0)));const m=tMid(e);vx=m.x-(m.x-vx)*(ns/vs);vy=m.y-(m.y-vy)*(ns/vs);vs=ns;t0=nd;applyT();}
    },{passive:false});
    on(boardEl,'touchend',()=>{tpan=false;t0=null;},{passive:true});

    // ── TOOLBAR ───────────────────────────────────────────────────────────────
    document.getElementById('btn-home')!.addEventListener('click',()=>{vx=120;vy=80;vs=1;applyT();});
    document.getElementById('btn-shuf')!.addEventListener('click',()=>{
      notes.forEach(d=>{
        const el=document.getElementById('n-'+d.id);if(!el)return;
        d.x+=(Math.random()-.5)*400;d.y+=(Math.random()-.5)*300;d.rot=(Math.random()-.5)*14;
        el.style.transition='left .6s cubic-bezier(.34,1.56,.64,1),top .6s cubic-bezier(.34,1.56,.64,1),transform .6s cubic-bezier(.34,1.56,.64,1)';
        el.style.left=d.x+'px';el.style.top=d.y+'px';el.style.transform=`rotate(${d.rot}deg)`;
        setTimeout(()=>el.style.transition='',660);
      });
      setTimeout(drawConns,300);
    });

    // ── DRAW MODE ─────────────────────────────────────────────────────────────
    const enterDraw=()=>{drawMode=true;document.body.classList.add('draw-mode');btnDraw.classList.add('on');dtEl.style.display='flex';};
    const exitDraw=()=>{drawMode=false;isDrawing=false;curPts=[];document.body.classList.remove('draw-mode');btnDraw.classList.remove('on');dtEl.style.display='none';};
    btnDraw.addEventListener('click',()=>drawMode?exitDraw():enterDraw());
    document.getElementById('btn-done')!.addEventListener('click',exitDraw);

    // draw toolbar controls
    document.querySelectorAll('.dt-swatch').forEach(s=>s.addEventListener('click',()=>{
      document.querySelectorAll('.dt-swatch').forEach(x=>x.classList.remove('sel'));s.classList.add('sel');
      dPreset=(s as HTMLElement).dataset.c||'pencil-dark';isEraser=false;
      document.getElementById('btn-eraser')!.classList.remove('on');document.getElementById('btn-pencil-mode')!.classList.add('on');
    }));
    (document.getElementById('dt-sz') as HTMLInputElement).addEventListener('input',e=>dSize=+(e.target as HTMLInputElement).value);
    document.getElementById('btn-pencil-mode')!.addEventListener('click',()=>{isEraser=false;document.getElementById('btn-eraser')!.classList.remove('on');document.getElementById('btn-pencil-mode')!.classList.add('on');});
    document.getElementById('btn-eraser')!.addEventListener('click',()=>{isEraser=!isEraser;document.getElementById('btn-eraser')!.classList.toggle('on',isEraser);document.getElementById('btn-pencil-mode')!.classList.toggle('on',!isEraser);});
    document.getElementById('btn-undo')!.addEventListener('click',()=>{strokes.pop();redraw();});
    document.getElementById('btn-clr')!.addEventListener('click',()=>{if(confirm('全て消しますか？')){strokes.length=0;redraw();}});

    // ── NOTE CREATION MODAL ───────────────────────────────────────────────────
    let selectedNc='nc-white';
    document.getElementById('btn-add')!.addEventListener('click',()=>{
      (document.getElementById('nm-title') as HTMLInputElement).value='';
      (document.getElementById('nm-body') as HTMLTextAreaElement).value='';
      selectedNc='nc-white';
      document.querySelectorAll('.nm-color').forEach(c=>c.classList.toggle('sel',(c as HTMLElement).dataset.nc==='nc-white'));
      noteModal.style.display='flex';
      setTimeout(()=>(document.getElementById('nm-title') as HTMLInputElement).focus(),50);
    });
    document.querySelectorAll('.nm-color').forEach(c=>c.addEventListener('click',()=>{
      selectedNc=(c as HTMLElement).dataset.nc||'nc-white';
      document.querySelectorAll('.nm-color').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');
    }));
    document.getElementById('nm-cancel')!.addEventListener('click',()=>noteModal.style.display='none');
    noteModal.addEventListener('click',(e)=>{if(e.target===noteModal)noteModal.style.display='none';});
    document.getElementById('nm-create')!.addEventListener('click',()=>{
      const title=(document.getElementById('nm-title') as HTMLInputElement).value.trim()||'Note';
      const body=(document.getElementById('nm-body') as HTMLTextAreaElement).value.trim()||'...';
      const uid='u'+Date.now();
      const d:NoteData={id:uid,nc:selectedNc,label:'New',title,body,x:(-vx/vs)+window.innerWidth/vs/2-160,y:(-vy/vs)+window.innerHeight/vs/2-90,rot:(Math.random()-.5)*6,di:0,sh:'sh-rect'};
      notes.push(d);buildNote(d);noteModal.style.display='none';
    });

    // ── TYPEWRITER CLICK SOUND ────────────────────────────────────────────────
    function playClick(){
      try{
        const ac=new AudioContext();const buf=ac.createBuffer(1,Math.floor(ac.sampleRate*.06),ac.sampleRate);const d=buf.getChannelData(0);
        for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,8)*.35;
        const src=ac.createBufferSource();const gain=ac.createGain();const filt=ac.createBiquadFilter();
        filt.type='bandpass';filt.frequency.value=1800;filt.Q.value=1.2;
        src.buffer=buf;src.connect(filt);filt.connect(gain);gain.connect(ac.destination);
        gain.gain.setValueAtTime(1,ac.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+.06);src.start();
      }catch(_){}
    }
    on(document,'click',(e:MouseEvent)=>{
      const note=(e.target as Element).closest('.note');
      if(!note||(e.target as Element).closest('.note-close')||(e.target as Element).closest('.cf-submit'))return;
      if(!note.classList.contains('expanded'))playClick();
    });

    // ── NOTE WOBBLE ────────────────────────────────────────────────────────────
    let wobbleStopped=false;
    let wobbleTimer: ReturnType<typeof setTimeout>;
    function wobbleRandomNote(){
      if(wobbleStopped)return;
      const eligible=notes.filter(d=>{const el=document.getElementById('n-'+d.id);return el&&!el.classList.contains('expanded');});
      if(!eligible.length){wobbleTimer=setTimeout(wobbleRandomNote,4000+Math.random()*8000);return;}
      const d=eligible[Math.floor(Math.random()*eligible.length)];
      const el=document.getElementById('n-'+d.id);if(!el)return;
      const seq=[2,-2,1.5,-1.5,0.8,-0.8,0].map(r=>`rotate(${d.rot+r}deg)`);
      let i=0;const step=()=>{el.style.transform=seq[i++];if(i<seq.length)setTimeout(step,45);};step();
      wobbleTimer=setTimeout(wobbleRandomNote,4000+Math.random()*8000);
    }
    wobbleTimer=setTimeout(wobbleRandomNote,3000);
    cleanups.push(()=>{wobbleStopped=true;clearTimeout(wobbleTimer);});

    // ── TURNTABLE ─────────────────────────────────────────────────────────────
    (()=>{
      const disc    =document.getElementById('tt-disc-spin')!;
      const arm     =document.getElementById('tt-arm')!;
      const tname   =document.getElementById('tt-track-name')!;
      const tnum    =document.getElementById('tt-track-num')!;
      const led     =document.getElementById('tt-led')!;
      const btnStart=document.getElementById('tt-start')!;
      const btnPrev =document.getElementById('tt-prev')!;
      const btnNext =document.getElementById('tt-next')!;

      let playing=false,trackIdx=0;
      let ac: AudioContext|null=null;
      const killFns: Array<()=>void>=[];

      interface Track{name:string;sub:string;bpm:number;prog:{root:number;chord:number[]}[];}
      const TRACKS:Track[]=[
        {name:'midnight desk',sub:'— piano · rain',bpm:70,prog:[{root:43.65,chord:[1,1.189,1.414,1.682,2.0]},{root:58.27,chord:[1,1.260,1.498,1.782,2.245]},{root:38.89,chord:[1,1.260,1.498,1.888,2.245]},{root:32.70,chord:[1,1.189,1.414,1.682,2.0]}]},
        {name:'3am focus',sub:'— rhodes · vinyl',bpm:66,prog:[{root:36.71,chord:[1,1.189,1.414,1.782,2.245]},{root:49.00,chord:[1,1.260,1.498,1.888,2.245]},{root:32.70,chord:[1,1.260,1.498,1.888,2.378]},{root:27.50,chord:[1,1.189,1.414,1.682,2.0]}]},
        {name:'lamp light',sub:'— vibraphone · bass',bpm:74,prog:[{root:51.91,chord:[1,1.260,1.498,1.888,2.245]},{root:43.65,chord:[1,1.189,1.414,1.782,2.245]},{root:34.65,chord:[1,1.260,1.498,1.888,2.245]},{root:38.89,chord:[1,1.260,1.498,1.782,2.245]}]},
        {name:'last chapter',sub:'— guitar · brush',bpm:78,prog:[{root:49.00,chord:[1,1.260,1.498,1.888,2.378]},{root:41.20,chord:[1,1.189,1.414,1.682,2.0]},{root:32.70,chord:[1,1.260,1.498,1.888,2.245]},{root:36.71,chord:[1,1.335,1.498,1.782,2.245]}]},
      ];

      const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

      function makeBus(ac:AudioContext){
        const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3800;lp.Q.value=0.5;
        const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=60;
        const gain=ac.createGain();gain.gain.value=0;
        const ws=ac.createWaveShaper();const n=256;const curve=new Float32Array(n);
        for(let i=0;i<n;i++){const x=i*2/n-1;curve[i]=x/(1+Math.abs(x)*1.4);}
        ws.curve=curve;ws.oversample='4x';
        gain.connect(hp);hp.connect(lp);lp.connect(ws);ws.connect(ac.destination);
        gain.gain.setValueAtTime(0,ac.currentTime);gain.gain.linearRampToValueAtTime(0.82,ac.currentTime+1.6);
        return{in:gain,lp};
      }

      function makeVinyl(ac:AudioContext,out:AudioNode){
        const sr=ac.sampleRate;const buf=ac.createBuffer(2,sr*4,sr);
        for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<d.length;i++){const r=Math.random();d[i]=r<.00035?(Math.random()*2-1)*.7:r<.0012?(Math.random()*2-1)*.2:(Math.random()*2-1)*.004;}}
        const src=ac.createBufferSource();src.buffer=buf;src.loop=true;
        const g=ac.createGain();g.gain.value=0.22;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=4500;const f2=ac.createBiquadFilter();f2.type='highpass';f2.frequency.value=300;
        src.connect(f);f.connect(f2);f2.connect(g);g.connect(out);src.start();
        return()=>{try{src.stop();}catch(_){}};
      }

      function rhodes(ac:AudioContext,t:number,freq:number,dur:number,vol:number,out:AudioNode){
        const oTine=ac.createOscillator();const gTine=ac.createGain();oTine.type='sine';oTine.frequency.value=freq*5.4;gTine.gain.setValueAtTime(vol*.5,t);gTine.gain.exponentialRampToValueAtTime(.0001,t+.18);oTine.connect(gTine);gTine.connect(out);oTine.start(t);oTine.stop(t+.22);
        const oFund=ac.createOscillator();const gFund=ac.createGain();oFund.type='sine';oFund.frequency.value=freq;
        const lfo=ac.createOscillator();const lfoG=ac.createGain();lfo.type='sine';lfo.frequency.value=4.8;lfoG.gain.value=vol*.025;lfo.connect(lfoG);lfoG.connect(gFund.gain);
        gFund.gain.setValueAtTime(vol,t);gFund.gain.exponentialRampToValueAtTime(vol*.55,t+.12);gFund.gain.exponentialRampToValueAtTime(.0001,t+clamp(dur,.1,2.4));
        oFund.connect(gFund);gFund.connect(out);oFund.start(t);oFund.stop(t+clamp(dur,.1,2.5));lfo.start(t);lfo.stop(t+clamp(dur,.1,2.5));
      }

      function vibes(ac:AudioContext,t:number,freq:number,dur:number,vol:number,out:AudioNode){
        [[1,vol],[2.756,vol*.25],[5.404,vol*.07]].forEach(([ratio,v])=>{
          const o=ac.createOscillator();const g=ac.createGain();o.type='sine';o.frequency.value=freq*ratio;
          const dec=ratio===1?clamp(dur*1.2,.4,3.5):.5;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dec);
          o.connect(g);g.connect(out);o.start(t);o.stop(t+dec+.05);
        });
      }

      function guitar(ac:AudioContext,t:number,freqs:number[],vol:number,out:AudioNode){
        freqs.forEach((freq,i)=>{
          const delay=i*.018;const o=ac.createOscillator();const g=ac.createGain();const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=2200;
          o.type='sawtooth';o.frequency.value=freq;o.detune.value=(Math.random()-.5)*10;
          g.gain.setValueAtTime(0,t+delay);g.gain.linearRampToValueAtTime(vol,t+delay+.01);g.gain.exponentialRampToValueAtTime(vol*.3,t+delay+.07);g.gain.exponentialRampToValueAtTime(.0001,t+delay+.55);
          o.connect(f);f.connect(g);g.connect(out);o.start(t+delay);o.stop(t+delay+.7);
        });
      }

      function bass(ac:AudioContext,t:number,freq:number,dur:number,vol:number,out:AudioNode){
        const o=ac.createOscillator();const g=ac.createGain();const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=320;
        o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.025);g.gain.exponentialRampToValueAtTime(vol*.4,t+.12);g.gain.exponentialRampToValueAtTime(.0001,t+clamp(dur*.8,.1,1.0));
        o.connect(f);f.connect(g);g.connect(out);o.start(t);o.stop(t+1.1);
        const o2=ac.createOscillator();const g2=ac.createGain();o2.type='sine';o2.frequency.value=freq*2.01;
        g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol*.18,t+.02);g2.gain.exponentialRampToValueAtTime(.0001,t+.25);o2.connect(g2);g2.connect(out);o2.start(t);o2.stop(t+.3);
      }

      function kick(ac:AudioContext,t:number,vol:number,out:AudioNode){const o=ac.createOscillator();const g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.10);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.24);o.connect(g);g.connect(out);o.start(t);o.stop(t+.28);}

      function brushSnare(ac:AudioContext,t:number,vol:number,out:AudioNode){const sr=ac.sampleRate;const len=~~(sr*.16);const buf=ac.createBuffer(1,len,sr);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.5);const src=ac.createBufferSource();src.buffer=buf;const g=ac.createGain();const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=1900;f.Q.value=1.0;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);src.connect(f);f.connect(g);g.connect(out);src.start(t);}

      function hat(ac:AudioContext,t:number,vol:number,open:boolean,out:AudioNode){const sr=ac.sampleRate;const dur=open?.12:.032;const len=~~(sr*dur*2);const buf=ac.createBuffer(1,len,sr);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,open?1.2:3);const src=ac.createBufferSource();src.buffer=buf;const g=ac.createGain();const f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=7500;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.connect(f);f.connect(g);g.connect(out);src.start(t);}

      function makeReverb(ac:AudioContext,out:AudioNode){const sr=ac.sampleRate;const len=~~(sr*1.8);const buf=ac.createBuffer(2,len,sr);for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(sr*.4));}const conv=ac.createConvolver();conv.buffer=buf;const g=ac.createGain();g.gain.value=0.18;conv.connect(g);g.connect(out);return conv;}

      function buildSequencer(ac:AudioContext,trk:Track,bus:{in:GainNode,lp:BiquadFilterNode}){
        const beat=60/trk.bpm,bar=beat*4,swing=beat*.62,prog=trk.prog,BARS=prog.length;
        let stopped=false;let timerID: ReturnType<typeof setTimeout>;
        const rev=makeReverb(ac,bus.lp);
        function scheduleLoop(startTime:number){
          if(stopped)return;
          for(let b=0;b<BARS;b++){
            const bt=startTime+b*bar;const{root,chord}=prog[b];const chordFreqs=chord.map(r=>root*r*2);const BEAT_DUR=bar*.92;
            if(trackIdx===0){chordFreqs.forEach(f=>{rhodes(ac,bt,f,BEAT_DUR*.48,.058,rev);rhodes(ac,bt+beat*2,f,BEAT_DUR*.38,.044,rev);});chordFreqs.forEach(f=>{rhodes(ac,bt,f,BEAT_DUR*.48,.04,bus.in);rhodes(ac,bt+beat*2,f,BEAT_DUR*.38,.03,bus.in);});}
            else if(trackIdx===1){chordFreqs.forEach(f=>{rhodes(ac,bt,f,BEAT_DUR,.048,rev);rhodes(ac,bt,f,BEAT_DUR,.034,bus.in);});chordFreqs.forEach(f=>{rhodes(ac,bt+beat,f,beat*.5,.022,bus.in);});}
            else if(trackIdx===2){chordFreqs.forEach((f,i)=>{vibes(ac,bt+i*.025,f,bar*1.1,.055,rev);vibes(ac,bt+i*.025,f,bar*1.1,.038,bus.in);});}
            else{guitar(ac,bt+beat,chordFreqs,.06,rev);guitar(ac,bt+beat*3+swing,chordFreqs,.046,rev);guitar(ac,bt+beat,chordFreqs,.04,bus.in);guitar(ac,bt+beat*3+swing,chordFreqs,.03,bus.in);}
            const nextRoot=prog[(b+1)%BARS].root;[1,1.125,1.25,nextRoot/root].forEach((m,i)=>bass(ac,bt+beat*i,root*m*.5,beat*.85,.28,bus.in));bass(ac,bt+beat*1.5,root*1.189*.5,beat*.4,.15,bus.in);
            kick(ac,bt,.36,bus.in);kick(ac,bt+beat*2+swing*.5,.18,bus.in);brushSnare(ac,bt+beat,.18,bus.in);brushSnare(ac,bt+beat*3,.18,bus.in);
            for(let h=0;h<8;h++){const ht=bt+Math.floor(h/2)*beat+(h%2===0?0:swing);hat(ac,ht,h%2===0?.06:.034,false,bus.in);}
            hat(ac,bt+beat*3+swing,.05,true,bus.in);
          }
          const loopDur=BARS*bar;timerID=setTimeout(()=>scheduleLoop(startTime+loopDur),(loopDur-.05)*1000);
        }
        scheduleLoop(ac.currentTime+.1);
        return()=>{stopped=true;if(timerID)clearTimeout(timerID);};
      }

      function startTrack(){
        ac=new AudioContext();const bus=makeBus(ac);const stopVinyl=makeVinyl(ac,bus.in);const stopSeq=buildSequencer(ac,TRACKS[trackIdx],bus);
        killFns.length=0;killFns.push(stopVinyl,stopSeq);
        playing=true;disc.classList.add('spinning');arm.classList.add('on');led.classList.add('on');btnStart.classList.add('on');updateInfo();
      }
      function stopTrack(cb?:()=>void){
        if(!playing){if(cb)cb();return;}playing=false;disc.classList.remove('spinning');arm.classList.remove('on');led.classList.remove('on');btnStart.classList.remove('on');
        killFns.forEach(f=>{try{f();}catch(_){}});killFns.length=0;
        setTimeout(()=>{if(ac){try{ac.close();}catch(_){}ac=null;}if(cb)cb();},300);
      }
      function updateInfo(){const t=TRACKS[trackIdx];tname.textContent=t.name;tnum.textContent=t.sub;}
      btnStart.addEventListener('click',()=>playing?stopTrack():startTrack());
      btnNext.addEventListener('click',()=>{const p=playing;stopTrack(()=>{trackIdx=(trackIdx+1)%TRACKS.length;updateInfo();if(p)startTrack();});});
      btnPrev.addEventListener('click',()=>{const p=playing;stopTrack(()=>{trackIdx=(trackIdx-1+TRACKS.length)%TRACKS.length;updateInfo();if(p)startTrack();});});
      updateInfo();
      cleanups.push(()=>stopTrack());
    })();

    // ── GLOBAL CLEANUP ────────────────────────────────────────────────────────
    return () => {
      cleanups.forEach(f => { try { f(); } catch (_) {} });
      worldEl.querySelectorAll('.note').forEach(n=>n.remove());
      svgEl.innerHTML='';
    };
  }, []);

  return (
    <>
      <div id="board">
        <div id="world">
          <svg id="connections"></svg>
        </div>
      </div>

      <canvas id="draw-canvas" />

      <div id="logo">∅ Board</div>

      <div id="turntable" dangerouslySetInnerHTML={{ __html: TT_HTML }} />

      <div id="zoom-hud">100%</div>

      {/* Draw toolbar */}
      <div id="draw-toolbar">
        <span className="dt-label">✏ Pencil</span>
        <div className="dt-swatch sel" style={{background:'#1a1a1a'}} data-c="pencil-dark"></div>
        <div className="dt-swatch"     style={{background:'#555'}}    data-c="pencil-mid"></div>
        <div className="dt-swatch"     style={{background:'#aaa'}}    data-c="pencil-light"></div>
        <div className="dt-swatch"     style={{background:'#c00'}}    data-c="pencil-red"></div>
        <div className="dt-swatch"     style={{background:'#00c'}}    data-c="pencil-blue"></div>
        <div className="dt-size">
          <span>Size</span>
          <input type="range" id="dt-sz" min="1" max="12" defaultValue="3" />
        </div>
        <button className="dt-btn on"     id="btn-pencil-mode">Pencil</button>
        <button className="dt-btn"        id="btn-eraser">Eraser</button>
        <button className="dt-btn"        id="btn-undo">↩ Undo</button>
        <button className="dt-btn danger" id="btn-clr">Clear</button>
        <button className="dt-btn dt-done" id="btn-done">Done ✓</button>
      </div>

      {/* Work detail popover — modeless floating window */}
      <div id="work-popover">
        <div id="wp-window">
          <div id="wp-bar">
            <div id="wp-header-title">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="wp-logo-img" src="" alt="" draggable={false} style={{display:'none'}} />
              <span id="wp-name-text"></span>
            </div>
            <button className="wp-icon-btn" id="wp-tab-btn" aria-label="all works">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="wp-tab-img" src="/icons/icon-allDisplayOpen-enable.svg" width="48" height="48" alt="" draggable={false} />
            </button>
            <button className="wp-icon-btn" id="wp-close" aria-label="close">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/icon-close-enable.svg" width="48" height="48" alt="" draggable={false} />
            </button>
          </div>
          <div id="wp-body">
            <div id="wp-title-band">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="wp-art-img" src="" alt="" width="auto" height="auto" draggable={false} style={{display:'none'}} />
            </div>
            <div id="wp-images"></div>
            <div id="wp-text-band">
              <p id="wp-desc"></p>
              <div id="wp-code"></div>
            </div>
          </div>
          <button id="wp-trash-btn" aria-label="delete">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-delete-enable.svg" width="48" height="48" alt="" draggable={false} />
          </button>
          <div id="wp-rs-r"></div>
          <div id="wp-rs-b"></div>
          <div id="wp-rs-br"></div>
        </div>
      </div>

      {/* Note creation modal */}
      <div id="note-modal">
        <div id="note-modal-box">
          <h3>New Note</h3>
          <div className="nm-row">
            <label>Title</label>
            <input type="text" id="nm-title" placeholder="Title..." maxLength={40} />
          </div>
          <div className="nm-row">
            <label>Body</label>
            <textarea id="nm-body" rows={4} placeholder="Content..."></textarea>
          </div>
          <div className="nm-row">
            <label>Color</label>
            <div className="nm-colors">
              <div className="nm-color sel" data-nc="nc-white"  style={{background:'#fff',border:'1.5px solid #ddd'}}></div>
              <div className="nm-color"     data-nc="nc-beige"  style={{background:'#e8e4cc'}}></div>
              <div className="nm-color"     data-nc="nc-orange" style={{background:'#ff9900'}}></div>
              <div className="nm-color"     data-nc="nc-yellow" style={{background:'#ffdd00'}}></div>
              <div className="nm-color"     data-nc="nc-green"  style={{background:'#00ca5b'}}></div>
              <div className="nm-color"     data-nc="nc-teal"   style={{background:'#b2d0de'}}></div>
              <div className="nm-color"     data-nc="nc-blue"   style={{background:'#2600ff'}}></div>
              <div className="nm-color"     data-nc="nc-pink"   style={{background:'#ff0090'}}></div>
              <div className="nm-color"     data-nc="nc-red"    style={{background:'#f25727'}}></div>
              <div className="nm-color"     data-nc="nc-gray"   style={{background:'#b9b9b9'}}></div>
              <div className="nm-color"     data-nc="nc-navy"   style={{background:'#000'}}></div>
            </div>
          </div>
          <div className="nm-actions">
            <button className="nm-btn" id="nm-cancel">Cancel</button>
            <button className="nm-btn primary" id="nm-create">Create ＋</button>
          </div>
        </div>
      </div>

      {/* Main toolbar */}
      <div id="toolbar">
        <span className="tb-label">Board</span>
        <button className="tb-btn" id="btn-home">⊙</button>
        <div className="tb-sep"></div>
        <button className="tb-btn" id="btn-add">＋</button>
        <button className="tb-btn" id="btn-draw">✏</button>
        <button className="tb-btn" id="btn-shuf">⟳</button>
      </div>

      <div id="cur"></div>
    </>
  );
}
