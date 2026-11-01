import {concepts} from '../impeccable.js';
const selected=concepts.find(c=>c.id==='I-03');
const common=`
.i03.refinement .hero .hero-copy{gap:0;display:block}
.i03.refinement.ref-c{--muted:oklch(44% .018 80);--accent:oklch(43% .06 70)}
.i03.refinement.ref-c .folio-side span{opacity:1}
.i03.refinement .hero-image{max-height:none}
.i03.refinement .section-heading p{max-width:58ch}
.i03.refinement .profile-item h3{font-size:14px;line-height:1.35}
.i03.refinement .finish-item h3{font-family:'Manrope',sans-serif;font-size:15px;line-height:1.35}
.i03.refinement .finish-item .spec-code{font-size:10px}
.i03.refinement .finish-item p{font-size:11px}
.i03.refinement .save-btn{min-height:36px;font-size:11px}
.i03.refinement .compare-check{min-height:30px;font-size:11px}
.i03.refinement .hero .hero-actions{margin-top:22px}
.i03.refinement .collection-item>div{padding-bottom:20px}
.i03.refinement .proof-photo img{height:calc(100% - 26px)}
.i03.refinement .chapter-nav{scrollbar-width:thin}
.i03.refinement .hero-index-links{display:flex;gap:16px;border-top:1px solid var(--line);margin-top:20px;padding-top:12px;font-size:10px;flex-wrap:wrap}
.i03.refinement .hero-index-links a{border-bottom:1px solid var(--line)}
@media(max-width:767px){
.i03.refinement .section{margin-inline:20px;display:block}
.i03.refinement .section-heading{position:static;display:grid;grid-template-columns:43px minmax(0,1fr);gap:10px 16px}
.i03.refinement .section-heading h2{font-size:34px}
.i03.refinement .section-heading p{grid-column:2;font-size:12px;line-height:1.7}
.i03.refinement .chapter-index{grid-row:span 2;font-size:42px;line-height:1;padding:0;margin:0}
.i03.refinement .program-grid,.i03.refinement .collection-grid,.i03.refinement .transformation-layout,.i03.refinement .proof-layout,.i03.refinement .material-layout,.i03.refinement .consultation-layout,.i03.refinement .room-grid{grid-template-columns:minmax(0,1fr)}
.i03.refinement .program-item,.i03.refinement .collection-item,.i03.refinement .collection-item:first-child{grid-column:auto;grid-row:auto;display:block;padding-top:0;margin:0}
.i03.refinement .program-item:first-child img,.i03.refinement .program-item img,.i03.refinement .collection-item:first-child img,.i03.refinement .collection-item img{width:100%;height:290px}
.i03.refinement .profile-grid,.i03.refinement .finish-grid,.i03.refinement .product-grid,.i03.refinement .accessory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.i03.refinement .profile-item{padding:5px 0 18px}
.i03.refinement .profile-item>img{height:185px}
.i03.refinement .finish-item img{height:145px}
.i03.refinement .product-item img{height:180px}
.i03.refinement .room-grid figure:nth-child(n){margin:0;padding:0}
.i03.refinement .room-grid img{height:340px}
.i03.refinement .proof-photo{height:330px}
.i03.refinement .process-list{grid-template-columns:1fr}
.i03.refinement .story-copy{display:block;max-width:none}
.i03.refinement .chapter-nav{max-width:100%;width:100%;gap:22px;font-size:10px}
.i03.refinement .folio-photo{grid-column:2;grid-row:auto}
.i03.refinement .folio-photo .hero-image{height:280px}
.i03.refinement .hero h1{font-size:39px;line-height:1.02}
.i03.refinement .hero p{font-size:12px}
.i03.refinement .hero .hero-kicker{font-size:9px;line-height:1.6;letter-spacing:.08em;margin-bottom:18px}
.i03.refinement .hero .hero-actions{flex-direction:row;align-items:center;gap:12px}
.i03.refinement .hero .btn{font-size:10px;padding:13px}
.i03.refinement #consultation{margin-inline:0;padding-inline:20px}
}
`;
const make=(letter,props,css)=>({...selected,...props,id:'I-03-'+letter,parent:'I-03',stage:2,variation:letter,bodyClass:'i03 refinement ref-'+letter.toLowerCase(),family:selected.family,typePairing:selected.typePairing,palette:[...selected.palette],css:selected.css+common+css+common.slice(common.indexOf('@media(max-width:767px)'))});
export const refinements=[
make('A',{
 name:'Editorial',thesis:'Give the selected publication a slower rhythm, with larger room plates, open margins and space to read each decision.',
 layout:'Wide photographic spreads, horizontal chapter openers and generous pauses between room stories and specification plates.',
 interaction:'A static folio index supports sequential reading; before/after and comparison tools remain inline in their chapters.',
 avoided:'New typefaces, alternate brand colors, extra motion, reordered chapters and a PDF-viewer treatment.',
 strengths:'Room photography leads; larger finish references and calm chapter openings give early project conversations more context.',
 risks:'Longer scrolling and fewer items visible at once; repeated project buyers may prefer the Catalog rhythm.',
 complexity:'Medium · wide editorial layouts with the same shared controls',
 initialFinishLimit:8,initialProductLimit:6,
 hero:d=>selected.hero(d).replace('Volume 01 / Catalog study','Volume 01 / Editorial study'),
},`
.i03.ref-a .hero{grid-template-columns:28px .74fr 1.26fr;gap:30px;min-height:525px;padding:34px 4vw 28px;align-items:stretch}
.i03.ref-a .hero h1{font-size:clamp(44px,4.1vw,59px);line-height:1.01}
.i03.ref-a .hero-kicker{margin-bottom:25px}
.i03.ref-a .folio-lead{padding-right:28px;justify-content:space-between}
.i03.ref-a .folio-photo .hero-image{height:440px;object-position:53% 52%}
.i03.ref-a .hero-actions{gap:10px}
.i03.ref-a .section{display:block;margin-inline:6vw;padding:100px 0 110px}
.i03.ref-a .section-heading{display:grid;grid-template-columns:80px 1.25fr .85fr;gap:32px;align-items:start;margin-bottom:55px}
.i03.ref-a .chapter-index{font-size:65px;margin:0;grid-row:auto}
.i03.ref-a .section-heading h2{font-size:49px;max-width:17ch}
.i03.ref-a .section-heading p{font-size:13px;line-height:1.9}
.i03.ref-a .program-grid{grid-template-columns:1.5fr 1fr;gap:35px}
.i03.ref-a .program-item:first-child img{height:530px;max-height:none}
.i03.ref-a .program-item img{height:235px}
.i03.ref-a .program-item:first-child{grid-row:span 2}
.i03.ref-a .collection-grid{display:grid;grid-template-columns:1fr;gap:64px}
.i03.ref-a .collection-item,.i03.ref-a .collection-item:first-child{display:grid;grid-template-columns:1.7fr .6fr;gap:42px;grid-column:auto;grid-row:auto;padding:0;align-items:end}
.i03.ref-a .collection-item:nth-child(2){grid-template-columns:.6fr 1.7fr}
.i03.ref-a .collection-item:nth-child(2)>img{grid-column:2;grid-row:1}
.i03.ref-a .collection-item:nth-child(2)>div{grid-column:1;grid-row:1}
.i03.ref-a .collection-item img,.i03.ref-a .collection-item:first-child img{height:450px}
.i03.ref-a .collection-item h3{font-size:39px}
.i03.ref-a .transformation-layout{grid-template-columns:1fr;gap:40px}
.i03.ref-a .comparison{height:570px;min-height:0}
.i03.ref-a .story-copy{max-width:75ch;margin-left:12%;padding-block:18px}
.i03.ref-a .proof-layout{grid-template-columns:1.25fr 1fr;gap:60px}
.i03.ref-a .proof-photo{height:570px}
.i03.ref-a .process-list{display:block}
.i03.ref-a .evidence-strip{margin-top:55px;gap:30px}
.i03.ref-a .evidence-strip img{height:245px}
.i03.ref-a .profile-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:42px 30px}
.i03.ref-a .profile-item>img{height:245px;padding:25px}
.i03.ref-a .material-layout{grid-template-columns:.65fr 1.55fr;gap:70px}
.i03.ref-a .finish-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:40px 22px}
.i03.ref-a .finish-item img{height:175px}
.i03.ref-a .material-note{position:sticky;top:35px;align-self:start}
.i03.ref-a .product-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:50px 32px}
.i03.ref-a .product-item img{height:285px}
.i03.ref-a .accessory-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:40px}
.i03.ref-a .accessory-item img{height:260px}
.i03.ref-a .room-grid{grid-template-columns:1.15fr 1fr;gap:70px}
.i03.ref-a .room-grid img{height:560px}
.i03.ref-a .room-grid figure:nth-child(2){margin-top:110px;padding-top:0}
.i03.ref-a .consultation-layout{grid-template-columns:1fr 1fr;gap:80px}
.i03.ref-a #consultation{padding:90px 6vw}
@media(min-width:768px) and (max-width:1100px){.i03.ref-a .hero{gap:20px;grid-template-columns:22px .9fr 1.1fr}.i03.ref-a .hero h1{font-size:47px}.i03.ref-a .folio-photo .hero-image{height:420px}.i03.ref-a .section-heading{grid-template-columns:65px 1fr;gap:20px}.i03.ref-a .section-heading p{grid-column:2}.i03.ref-a .material-layout{grid-template-columns:1fr;gap:30px}.i03.ref-a .material-note{position:static}.i03.ref-a .profile-grid{gap:25px 20px}.i03.ref-a .proof-layout{gap:30px}.i03.ref-a .consultation-layout{gap:40px}}
@media(max-width:767px){.i03.ref-a .hero{grid-template-columns:18px minmax(0,1fr);gap:16px;padding:30px 20px 24px;min-height:0}.i03.ref-a .section{padding:66px 0 72px}.i03.ref-a .section-heading{margin-bottom:34px}.i03.ref-a .collection-grid{gap:44px}.i03.ref-a .collection-item:nth-child(2){display:block;grid-template-columns:1fr}.i03.ref-a .collection-item h3{font-size:31px}.i03.ref-a .comparison{height:310px;min-height:0}.i03.ref-a .story-copy{margin:0;padding:0}.i03.ref-a .profile-grid{gap:32px 20px}.i03.ref-a .material-note{position:static}.i03.ref-a .material-layout{gap:30px}.i03.ref-a .finish-grid{gap:30px 18px}.i03.ref-a .accessory-item img{height:200px}.i03.ref-a .room-grid{gap:40px}.i03.ref-a #consultation{padding-block:60px}}
`),
make('B',{
 name:'Catalog',thesis:'Keep the editorial identity while bringing category navigation, comparisons and more specification references into view.',
 layout:'A compact opening spread, sticky chapter strip, narrow folio rail, collection rows and tightly spaced specimen bands.',
 interaction:'Direct chapter links, sticky progress and compact comparison controls shorten the route from a room direction to saved references.',
 avoided:'Commerce mechanics, tiny body text, new colors, changed taxonomy and assumed profile/finish compatibility.',
 strengths:'Faster repeat browsing; more profiles, swatches and configurations visible without losing source labels or review context.',
 risks:'Less room-scale immersion; the persistent chapter strip needs careful mobile spacing.',
 complexity:'Medium · denser responsive specimens and a sticky chapter strip',
 initialFinishLimit:18,initialProductLimit:12,
 hero:d=>selected.hero(d).replace('Volume 01 / Catalog study','Volume 01 / Specification index').replace('<div class="folio-bottom">','<nav class="hero-index-links" aria-label="Specification shortcuts"><a href="#profiles">05 / Door profiles ↗</a><a href="#finishes">06 / Finishes ↗</a><a href="#configurations">07 / Configurations ↗</a></nav><div class="folio-bottom">'),
},`
.i03.ref-b .hero{grid-template-columns:28px .95fr 1.05fr;gap:24px;padding:25px 4vw 22px;min-height:0;align-items:stretch}
.i03.ref-b .hero h1{font-size:clamp(43px,3.9vw,56px);line-height:.99;margin-bottom:18px}
.i03.ref-b .hero-kicker{margin-bottom:20px}
.i03.ref-b .hero p{font-size:12px}
.i03.ref-b .hero .hero-actions{flex-direction:row;align-items:center;gap:18px;margin-top:18px}
.i03.ref-b .hero .btn{font-size:11px;padding:12px 16px}
.i03.ref-b .folio-photo .hero-image{height:395px;object-position:53% 52%}
.i03.ref-b .folio-lead{padding-right:24px}
.i03.ref-b .folio-bottom{margin-top:16px;padding-top:12px}
.i03.ref-b .chapter-nav{position:sticky;top:0;z-index:3;padding-block:12px;gap:20px}
.i03.ref-b .section{grid-template-columns:170px minmax(0,1fr);gap:30px;padding:44px 0 50px;scroll-margin-top:85px}
.i03.ref-b .section-heading{position:sticky;top:96px;align-self:start}
.i03.ref-b .chapter-index{font-size:45px;margin-bottom:16px}
.i03.ref-b .section-heading h2{font-size:35px;margin-bottom:17px}
.i03.ref-b .section-heading p{font-size:12px;line-height:1.75}
.i03.ref-b .program-grid{grid-template-columns:1.4fr 1fr;gap:20px}
.i03.ref-b .program-item:first-child img{height:310px}
.i03.ref-b .program-item img{height:135px}
.i03.ref-b .program-item h3{font-size:26px}
.i03.ref-b .program-item p{font-size:11px}
.i03.ref-b .collection-grid{grid-template-columns:1fr;gap:18px}
.i03.ref-b .collection-item,.i03.ref-b .collection-item:first-child{display:grid;grid-template-columns:255px 1fr;grid-column:auto;grid-row:auto;gap:28px;padding:0 0 18px;border-bottom:1px solid var(--line);align-items:center}
.i03.ref-b .collection-item img,.i03.ref-b .collection-item:first-child img{height:185px}
.i03.ref-b .collection-item>div{padding:0;border:0}
.i03.ref-b .collection-item h3{font-size:31px}
.i03.ref-b .transformation-layout{grid-template-columns:1.2fr .9fr;gap:30px;align-items:start}
.i03.ref-b .comparison{height:350px;min-height:0}
.i03.ref-b .story-copy h3{font-size:31px}
.i03.ref-b .story-copy p,.i03.ref-b .story-copy li{font-size:12px}
.i03.ref-b .proof-layout{grid-template-columns:1fr 1.05fr;gap:30px}
.i03.ref-b .proof-photo{height:470px}
.i03.ref-b .process-list{display:block;margin-top:20px}
.i03.ref-b .process-list li{padding:13px 0}
.i03.ref-b .proof-copy h3{font-size:30px}
.i03.ref-b .evidence-strip{gap:18px;margin-top:25px}
.i03.ref-b .evidence-strip img{height:170px}
.i03.ref-b .filter-line,.i03.ref-b .filters{margin-bottom:20px;gap:15px}
.i03.ref-b .profile-grid{grid-template-columns:repeat(6,minmax(0,1fr));gap:22px 15px}
.i03.ref-b .profile-item{padding:0 0 13px}
.i03.ref-b .profile-item>img{height:165px;padding:16px}
.i03.ref-b .specimen-label{padding-top:10px}
.i03.ref-b .specimen-label h3{margin:7px 0 10px}
.i03.ref-b .material-layout{grid-template-columns:1fr;gap:24px}
.i03.ref-b .material-note{display:grid;grid-template-columns:.8fr 1fr 1.2fr;gap:20px;padding:18px 0;align-items:start}
.i03.ref-b .material-note h3{font-size:27px;margin:0}
.i03.ref-b .material-note>p{font-size:12px}
.i03.ref-b .material-note>.fine{grid-column:1/-1;font-size:11px}
.i03.ref-b .tfl-note{margin:0;padding:0;border:0}
.i03.ref-b .tfl-note p{font-size:12px}
.i03.ref-b .tfl-note button{margin-top:12px;font-size:11px}
.i03.ref-b .finish-grid{grid-template-columns:repeat(6,minmax(0,1fr));gap:26px 15px}
.i03.ref-b .finish-item img{height:115px}
.i03.ref-b .product-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:25px 18px}
.i03.ref-b .product-item img{height:170px;padding:10px}
.i03.ref-b .product-item h3{font-size:23px}
.i03.ref-b .product-item>div{padding-top:12px}
.i03.ref-b .accessory-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.i03.ref-b .accessory-item{display:grid;grid-template-columns:100px minmax(0,1fr);gap:15px;border-bottom:1px solid var(--line)}
.i03.ref-b .accessory-item img{height:150px;padding:8px}
.i03.ref-b .accessory-item h3{font-size:23px}
.i03.ref-b .room-grid{grid-template-columns:1fr 1fr;gap:28px}
.i03.ref-b .room-grid img{height:330px}
.i03.ref-b .room-grid figure:nth-child(2){padding-top:0;margin-top:0}
.i03.ref-b .consultation-layout{grid-template-columns:.8fr 1.2fr;gap:35px}
.i03.ref-b #consultation{padding-inline:4vw}
@media(min-width:768px) and (max-width:1100px){.i03.ref-b .hero .hero-actions{flex-direction:column;align-items:start;gap:5px}.i03.ref-b .hero-index-links{gap:10px;font-size:9px}.i03.ref-b .hero h1{font-size:46px}.i03.ref-b .folio-photo .hero-image{height:420px}.i03.ref-b .section{grid-template-columns:150px minmax(0,1fr);gap:25px}.i03.ref-b .profile-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.i03.ref-b .finish-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.i03.ref-b .product-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.i03.ref-b .transformation-layout,.i03.ref-b .proof-layout,.i03.ref-b .consultation-layout{grid-template-columns:1fr}.i03.ref-b .collection-item,.i03.ref-b .collection-item:first-child{grid-template-columns:180px 1fr}.i03.ref-b .accessory-grid{grid-template-columns:1fr 1fr}.i03.ref-b .material-note{grid-template-columns:1fr}.i03.ref-b .material-note>.fine{grid-column:auto}}
@media(max-width:767px){.i03.ref-b .hero{grid-template-columns:18px minmax(0,1fr);gap:16px;padding:24px 20px 20px}.i03.ref-b .hero .hero-actions{flex-direction:row;gap:12px}.i03.ref-b .hero-index-links{gap:12px;font-size:10px;line-height:1.8}.i03.ref-b .section{padding:34px 0 40px;scroll-margin-top:80px}.i03.ref-b .section-heading{margin-bottom:24px}.i03.ref-b .chapter-nav{padding-block:12px}.i03.ref-b .material-note{display:block}.i03.ref-b .material-note h3{margin-bottom:18px}.i03.ref-b .tfl-note{margin-top:20px;padding-top:20px;border-top:1px solid var(--line)}.i03.ref-b .material-note>.fine{margin-top:20px}.i03.ref-b .profile-grid{gap:20px 16px}.i03.ref-b .finish-grid{gap:24px 16px}.i03.ref-b .product-grid{gap:24px 16px}.i03.ref-b .accessory-item{display:block;padding:0}.i03.ref-b .accessory-item img{height:170px}.i03.ref-b .accessory-item h3{font-size:24px}.i03.ref-b .comparison{height:280px}.i03.ref-b .consultation-layout{gap:30px}}
`),
make('C',{
 name:'Balanced',thesis:'Retain the room-led opening and facing-page character while widening the chapters that require comparison and specification.',
 layout:'Editorial room spreads alternate with full-width profile, material and configuration plates; chapter navigation stays compact and persistent.',
 interaction:'Room chapters lead into comparison plates with sticky progress, independent saved selections and an inline consultation handoff.',
 avoided:'A new brand direction, equal card rows, long unbroken catalog grids, extra motion and compatibility assumptions.',
 strengths:'Room context and practical browsing share the page; technical chapters have enough width for useful comparison.',
 risks:'Alternating heading placement needs consistent folio markers; moderately longer than the Catalog refinement.',
 complexity:'Medium · two chapter layouts inside the selected visual system',
 initialFinishLimit:12,initialProductLimit:8,
 hero:d=>selected.hero(d).replace('Volume 01 / Catalog study','Volume 01 / Room & specification'),
},`
.i03.ref-c{--bg:rgb(239 239 238);--surface:rgb(216 215 211)}
.i03.ref-c .hero{grid-template-columns:30px .9fr 1.1fr;gap:26px;padding:30px 4vw 24px;min-height:0;align-items:stretch}
.i03.ref-c .hero h1{font-size:clamp(44px,4.4vw,62px);line-height:1}
.i03.ref-c .folio-photo .hero-image{height:435px;object-position:53% 52%}
.i03.ref-c .hero-kicker{margin-bottom:22px}
.i03.ref-c .hero .hero-actions{flex-direction:row;align-items:center;gap:18px}
.i03.ref-c .hero .btn{font-size:11px;padding:13px 17px}
.i03.ref-c .chapter-nav{position:sticky;top:0;z-index:3;padding-block:13px}
.i03.ref-c .section{grid-template-columns:215px minmax(0,1fr);gap:42px;padding:70px 0 78px;scroll-margin-top:90px}
.i03.ref-c .section-heading h2{font-size:40px}
.i03.ref-c .chapter-index{font-size:56px;margin-bottom:23px}
.i03.ref-c .program-grid{grid-template-columns:1.4fr 1fr;gap:25px}
.i03.ref-c .program-item:first-child img{height:400px}
.i03.ref-c .program-item img{height:185px}
.i03.ref-c .collection-grid{grid-template-columns:1fr 1fr;gap:35px 30px}
.i03.ref-c .collection-item:first-child{grid-column:1/-1;display:grid;grid-template-columns:1.6fr 1fr;gap:30px;align-items:end}
.i03.ref-c .collection-item:first-child img{height:360px}
.i03.ref-c .collection-item img{height:290px}
.i03.ref-c .collection-item h3{font-size:34px}
.i03.ref-c .transformation-layout{grid-template-columns:1fr;gap:30px}
.i03.ref-c .comparison{height:450px;min-height:0}
.i03.ref-c .story-copy{max-width:72ch}
.i03.ref-c .proof-layout{grid-template-columns:1fr;gap:32px}
.i03.ref-c .proof-photo{height:400px}
.i03.ref-c .process-list{grid-template-columns:1fr 1fr;gap:0 35px}
.i03.ref-c :is(#profiles,#finishes,#configurations){display:block}
.i03.ref-c :is(#profiles,#finishes,#configurations) .section-heading{display:grid;grid-template-columns:70px 1.2fr 1fr;gap:30px;margin-bottom:38px}
.i03.ref-c :is(#profiles,#finishes,#configurations) .chapter-index{margin:0}
.i03.ref-c :is(#profiles,#finishes,#configurations) .section-heading h2{font-size:44px}
.i03.ref-c .profile-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:30px 25px}
.i03.ref-c .profile-item>img{height:220px}
.i03.ref-c .material-layout{grid-template-columns:.65fr 1.6fr;gap:50px}
.i03.ref-c .finish-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:30px 18px}
.i03.ref-c .finish-item img{height:160px}
.i03.ref-c .product-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:30px 25px}
.i03.ref-c .product-item img{height:235px}
.i03.ref-c .product-item h3{font-size:27px}
.i03.ref-c .accessory-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:30px}
.i03.ref-c .accessory-item img{height:210px}
.i03.ref-c .room-grid{grid-template-columns:1fr 1.1fr;gap:35px}
.i03.ref-c .room-grid img{height:430px}
.i03.ref-c .room-grid figure:nth-child(2){padding-top:0;margin-top:65px}
.i03.ref-c .consultation-layout{grid-template-columns:1fr;gap:30px}
.i03.ref-c #consultation{padding-inline:4vw}
@media(min-width:768px) and (max-width:1100px){.i03.ref-c .hero h1{font-size:49px}.i03.ref-c .hero .hero-actions{flex-direction:column;align-items:start;gap:5px}.i03.ref-c .folio-photo .hero-image{height:440px}.i03.ref-c .section{grid-template-columns:170px minmax(0,1fr);gap:28px}.i03.ref-c .material-layout{grid-template-columns:1fr;gap:25px}.i03.ref-c .profile-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.i03.ref-c .collection-item:first-child{display:block}}
@media(max-width:767px){.i03.ref-c .hero{grid-template-columns:18px minmax(0,1fr);gap:16px;padding:27px 20px 22px}.i03.ref-c .hero .hero-actions{flex-direction:row;align-items:center;gap:12px}.i03.ref-c .section{padding:49px 0 56px}.i03.ref-c :is(#profiles,#finishes,#configurations) .section-heading{grid-template-columns:43px minmax(0,1fr);gap:10px 16px;margin-bottom:28px}.i03.ref-c :is(#profiles,#finishes,#configurations) .section-heading h2{font-size:34px}.i03.ref-c .collection-grid{gap:32px}.i03.ref-c .collection-item:first-child{display:block;grid-column:auto}.i03.ref-c .comparison{height:300px}.i03.ref-c .process-list{grid-template-columns:1fr}.i03.ref-c .profile-grid{gap:27px 18px}.i03.ref-c .material-layout{gap:28px}.i03.ref-c .finish-grid{gap:28px 18px}.i03.ref-c .product-grid{gap:28px 18px}}
`),
];
