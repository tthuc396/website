export const sectionPolishCSS=`
.i03.ref-c .comparison[data-interactive]{position:relative;width:min(100%,700px);height:auto;aspect-ratio:var(--comparison-ratio);min-height:0;overflow:hidden;isolation:isolate;touch-action:pan-y;user-select:none}
.i03.ref-c .comparison[data-interactive] img{position:absolute;inset:0;width:100%;height:100%;max-width:none;max-height:none;aspect-ratio:auto;object-fit:cover;object-position:center;margin:0;pointer-events:none;user-select:none;-webkit-user-drag:none}
.i03.ref-c .comparison[data-interactive] .before-image{clip-path:inset(0 calc(100% - var(--split,50%)) 0 0)}
.i03.ref-c .comparison-divider{position:absolute;top:0;bottom:0;left:var(--split,50%);width:2px;background:#f1eee3;pointer-events:none;z-index:1}
.i03.ref-c .comparison-handle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:52px;height:52px;min-height:52px;border:1px solid #b2ac9a;border-radius:50%;background:#f1eee3;color:#34332e;display:grid;place-items:center;font-size:25px;line-height:1;cursor:ew-resize;touch-action:none;pointer-events:auto;padding:0;box-shadow:0 2px 14px #34332e25}
.i03.ref-c .comparison-handle:active{transform:translate(-50%,-50%)}
.i03.ref-c .comparison-handle:focus-visible{outline:3px solid var(--accent);outline-offset:5px}
.i03.ref-c .comparison[data-dragging=true]{cursor:ew-resize}
.i03.ref-c .comparison-instruction{font-size:11px;color:var(--muted);margin-top:14px}
.i03.ref-c .comparison-note{margin-top:8px}
.i03.ref-c .profile-item>img{background:transparent;mix-blend-mode:multiply;object-fit:contain;width:100%;height:235px;padding:12px;max-height:none}
.i03.ref-c .profile-comparison img{background:transparent;mix-blend-mode:multiply;object-fit:contain;padding:10px}
.i03.ref-c .product-item>.image-button>img{background:transparent;object-fit:contain;padding:18px;height:245px}
.i03.ref-c .product-interior{padding:13px 8px 16px;border-top:1px solid var(--line);margin-top:12px}
.i03.ref-c .product-interior img{height:155px;object-fit:contain;background:transparent;mix-blend-mode:multiply;padding:0}
.i03.ref-c .product-interior figcaption{font-family:var(--body);font-size:10px;color:var(--muted);margin-top:10px}
.i03.ref-c .source-visual-note{font-size:11px;line-height:1.7;margin-top:12px;color:var(--muted)}
.detail-drawer .technical-reference{margin:25px 0;padding-top:20px;border-top:1px solid var(--line)}
.detail-drawer .technical-reference img{width:100%;height:300px;object-fit:contain;background:transparent;mix-blend-mode:multiply}
.i03.ref-c .faq-library{margin-top:42px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.i03.ref-c .faq-library>section{border-top:1px solid var(--line);padding:20px 4px 12px}
.i03.ref-c .faq-library>section>h3{font-family:var(--display);font-size:24px;margin:0 0 10px}
.i03.ref-c .faq-items{padding:0 0 10px 16px}
.i03.ref-c .faq-items>details{border-top:1px solid color-mix(in srgb,var(--line) 65%,transparent)}
.i03.ref-c .faq-items>details>summary{padding:14px 0;cursor:pointer;font-size:13px}
.i03.ref-c .faq-items p{max-width:76ch;margin:0 0 16px;color:var(--muted);font-size:13px;line-height:1.7}
.i03.ref-c .lookbook-pairings{display:grid;gap:45px}
.i03.ref-c .catalog-page-header{padding:52px 5% 28px}
.i03.ref-c .catalog-page-header>a{display:inline-block;font-size:11px;margin-bottom:26px;border-bottom:1px solid var(--line);padding-bottom:5px}
.i03.ref-c .catalog-page-header h1{font-size:clamp(38px,6vw,74px);margin:8px 0 12px;max-width:16ch}
.i03.ref-c .catalog-page-header>p:last-child{max-width:65ch;color:var(--muted);font-size:14px}
.i03.ref-c .chapter-nav a[aria-current=page]{border-color:var(--accent);color:var(--accent)}
.i03.ref-c .next-stage{margin:5px 4vw 48px;padding:16px 0 18px;border-block:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:24px}
.i03.ref-c .next-stage>.eyebrow{flex:0 0 auto;color:var(--accent);font-size:9px;letter-spacing:.08em;text-transform:uppercase}
.i03.ref-c .next-stage>a{display:flex;justify-content:space-between;align-items:center;gap:28px;flex:1;max-width:760px}
.i03.ref-c .next-stage>a>span{display:grid;gap:3px}
.i03.ref-c .next-stage strong{font-family:var(--display);font-size:24px;line-height:1.15}
.i03.ref-c .next-stage small{font-size:11px;color:var(--muted);line-height:1.55}
.i03.ref-c .next-stage b{display:inline-flex;align-items:center;justify-content:center;min-width:138px;min-height:46px;padding:12px 18px;border:1px solid var(--ink);background:var(--ink);color:var(--surface);font-size:12px;font-weight:700;letter-spacing:.025em;white-space:nowrap}
.i03.ref-c .next-stage>a:hover strong{color:var(--accent)}
.i03.ref-c .next-stage>a:hover b{border-color:var(--accent);background:var(--accent);color:var(--ink)}
.i03.ref-c .next-stage>a:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.i03.ref-c .home-path-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 28px;border-top:1px solid var(--line)}
.i03.ref-c .home-path-grid>a{display:block;border-bottom:1px solid var(--line);padding:20px 2px}
.i03.ref-c .home-path-grid>a>span{font-family:var(--display);font-size:23px}
.i03.ref-c .home-path-grid>a>p{font-size:12px;color:var(--muted)}
.i03.ref-c .home-path-grid>a>b{font-size:10px;font-weight:500}
.i03.ref-c #decision-sequence{margin-inline:clamp(20px,4vw,68px)}
.i03.ref-c #decision-sequence .section-content{width:100%;min-width:0;max-width:100%;overflow:hidden}
.i03.ref-c .guided-sequence{display:grid;width:100%;min-width:0;max-width:100%;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 20px;border-top:1px solid var(--line)}
.i03.ref-c .guided-step{position:relative;display:flex;flex-direction:column;width:100%;min-width:0;max-width:100%;overflow:hidden;padding:21px 0 24px;border-bottom:1px solid var(--line);color:inherit;text-decoration:none}
.i03.ref-c .guided-step-number{position:absolute;top:18px;right:0;color:var(--accent);font-family:var(--display);font-size:15px}
.i03.ref-c .guided-step-images{position:relative;width:calc(100% - 28px);min-width:0;height:112px;flex:0 0 112px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:0 28px 18px 0;align-items:center;overflow:hidden}
.i03.ref-c .guided-step-images img{position:relative;inset:auto;width:100%!important;height:100%!important;min-width:0;max-width:100%!important;max-height:100%!important;object-fit:contain;padding:5px;background:#f5f2e9;mix-blend-mode:multiply}
.i03.ref-c .guided-step-images.single{grid-template-columns:1fr}
.i03.ref-c .guided-step-images.single img{object-fit:contain!important;padding:6px;mix-blend-mode:multiply}
.i03.ref-c .guided-step-copy{display:flex;flex-direction:column;align-items:flex-start;flex:1}
.i03.ref-c .guided-step-copy .eyebrow{font-size:9px;color:var(--accent);letter-spacing:.08em;text-transform:uppercase}
.i03.ref-c .guided-step-copy h3{font-family:var(--display);font-size:24px;line-height:1.1;margin:7px 0}
.i03.ref-c .guided-step-copy p{font-size:11px;line-height:1.65;color:var(--muted);margin:0 0 12px;max-width:35ch}
.i03.ref-c .guided-step-count{font-size:10px;margin-top:auto;padding:7px 0 12px;color:var(--ink)}
.i03.ref-c .guided-step-copy .text-link{font-size:10px;border-bottom:1px solid var(--line);padding-bottom:3px}
.i03.ref-c .guided-step:hover .guided-step-copy .text-link{border-color:var(--accent);color:var(--accent)}
.i03.ref-c .home-construction-layout{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:34px;align-items:start;min-width:0}
.i03.ref-c .home-construction-figure img{display:block;width:100%;height:420px;max-width:100%;max-height:none;object-fit:contain;padding:8px;background:var(--surface)}
.i03.ref-c .home-construction-figure figcaption{margin-top:8px;color:var(--muted);font-size:10px}
.i03.ref-c .home-construction-copy .eyebrow{font-size:9px;color:var(--accent);letter-spacing:.08em;text-transform:uppercase}
.i03.ref-c .home-construction-copy h3{font-family:var(--display);font-size:27px;line-height:1.12;margin:10px 0 14px;max-width:20ch}
.i03.ref-c .construction-key{list-style:none;padding:0;margin:0 0 15px;display:grid;grid-template-columns:minmax(0,1fr);gap:0}
.i03.ref-c .construction-key li{display:grid;grid-template-columns:20px minmax(0,1fr);gap:9px;align-items:start;padding:6px 0;border-bottom:1px solid var(--line);font-size:12px;line-height:1.5;color:var(--muted)}
.i03.ref-c .construction-key li>span{font-family:var(--display);font-size:15px;line-height:1.2;color:var(--accent)}
.i03.ref-c .construction-key li>p{margin:0}
.i03.ref-c .home-front-box-options{border-top:1px solid var(--line);margin:0 0 15px}
.i03.ref-c .home-front-box-options>div{display:grid;grid-template-columns:145px minmax(0,1fr);gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:11px;line-height:1.6}
.i03.ref-c .home-front-box-options dt{font-weight:600}
.i03.ref-c .home-front-box-options dd{margin:0;color:var(--muted)}
.i03.ref-c .home-construction-copy .fine{font-size:11px;line-height:1.65}
.i03.ref-c .construction-notes{margin-top:25px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.i03.ref-c .construction-notes>summary{padding:14px 0;cursor:pointer;font-family:var(--display);font-size:19px}
.i03.ref-c .construction-notes-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 34px;padding:8px 0 17px}
.i03.ref-c .construction-notes-grid>section{padding:15px 0 17px;border-bottom:1px solid var(--line)}
.i03.ref-c .construction-notes-grid h4{margin:0 0 9px;font-family:var(--display);font-size:20px}
.i03.ref-c .construction-notes-grid ul{padding-left:17px;margin:0;color:var(--muted);font-size:12px;line-height:1.75}
.i03.ref-c .construction-notes>.fine{font-size:10px;color:var(--muted)}
.i03.ref-c .home-summary-grid{grid-template-columns:minmax(0,1fr)}
.i03.ref-c .decision-sequence-note,.i03.ref-c .faq-inline-link{font-size:10px;line-height:1.7;color:var(--muted)}
.i03.ref-c .decision-sequence-note{margin:20px 0 6px}
.i03.ref-c .faq-inline-link{display:inline-block;border-bottom:1px solid var(--line);padding-bottom:3px;color:var(--ink)}
.i03.ref-c .home-summary-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:50px;align-items:start}
.i03.ref-c .home-cabinet-summary{padding:24px;background:var(--surface);border-top:1px solid var(--accent)}
.i03.ref-c .home-cabinet-summary h3{font-size:25px;margin:12px 0}
.i03.ref-c .home-cabinet-summary ul{padding-left:18px;font-size:12px;line-height:1.8;margin-bottom:20px}
.i03.ref-c .pairing-sheet,.i03.ref-c .comparison-sheet{border-top:1px solid var(--line);padding-top:18px}
.i03.ref-c .pairing-sheet>header,.i03.ref-c .comparison-sheet>header{display:grid;grid-template-columns:1fr auto;gap:12px 24px;align-items:end;margin-bottom:20px}
.i03.ref-c .pairing-sheet>header>span,.i03.ref-c .comparison-sheet>header>span{font-size:10px;color:var(--muted);letter-spacing:.08em}
.i03.ref-c .pairing-sheet>header h3,.i03.ref-c .comparison-sheet>header h3{grid-column:1;font-size:clamp(24px,3vw,38px);margin:0}
.i03.ref-c .pairing-sheet>header p{grid-column:2;grid-row:1/3;max-width:40ch;color:var(--muted);font-size:12px}
.i03.ref-c .pairing-room-image{display:block;width:100%;height:auto;max-width:none;max-height:none;object-fit:contain;margin:14px 0 22px}
.i03.ref-c .pairing-specimens{display:grid;grid-template-columns:.8fr 1.2fr .9fr;gap:28px;padding:20px 0;border-block:1px solid var(--line)}
.i03.ref-c .pairing-specimens h4{font-size:11px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 15px}
.i03.ref-c .pairing-images{display:flex;gap:12px;flex-wrap:wrap}
.i03.ref-c .pairing-images figure{width:calc(50% - 8px);margin:0}
.i03.ref-c .pairing-images img{height:142px;width:100%;object-fit:contain;background:transparent;mix-blend-mode:multiply}
.i03.ref-c .pairing-images figcaption{font-size:10px;margin-top:7px}
.i03.ref-c .pairing-images figcaption small{display:block;color:var(--muted);margin-top:4px}
.i03.ref-c .finish-pairings figure{width:calc(25% - 10px)}
.i03.ref-c .finish-pairings img{height:128px}
.i03.ref-c .hardware-list{padding-left:17px;font-size:12px;line-height:1.8}
.i03.ref-c .hardware-items{display:flex;flex-wrap:wrap;gap:10px}
.i03.ref-c .hardware-items figure{width:calc(50% - 5px);max-width:180px;margin:0}
.i03.ref-c .hardware-items img{width:auto;max-width:100%;height:74px;object-fit:contain;background:#fff}
.i03.ref-c .hardware-items figcaption{font-size:10px;line-height:1.5;margin-top:5px}
.i03.ref-c .hardware-items figcaption small{display:block;color:var(--muted)}
.i03.ref-c .front-box-diagrams{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(210px,.6fr);gap:34px;align-items:start;margin:18px 0 28px}
.i03.ref-c .front-diagram-main,.i03.ref-c .box-diagram-inset{position:relative;margin:0;min-width:0}
.i03.ref-c .front-art{position:relative;max-width:508px}
.i03.ref-c .front-art>img{display:block;width:100%;height:auto;max-width:508px;object-fit:contain;background:#fff}
.i03.ref-c .front-callout-line{position:absolute;left:43%;bottom:8%;width:82px;border-top:1px solid var(--ink);transform:rotate(110deg);transform-origin:left center}
.i03.ref-c .front-diagram-main>figcaption,.i03.ref-c .box-diagram-inset>figcaption{display:inline-block;margin:14px 0 10px;padding:11px 20px;border-radius:30px;background:#282321;color:#fff;font-size:15px}
.i03.ref-c .front-option-list,.i03.ref-c .box-option-list{list-style:none;padding:0;margin:0;display:grid;gap:7px;max-width:300px}
.i03.ref-c .front-option-list li,.i03.ref-c .box-option-list li{border:1px solid var(--line);border-radius:20px;text-align:center;padding:7px 12px;font-size:11px;background:transparent}
.i03.ref-c .box-art{position:relative;display:grid;place-items:center;min-height:250px}
.i03.ref-c .box-art:before{content:"";position:absolute;left:-70px;top:53%;width:110px;border-top:1px solid var(--ink);transform:rotate(-26deg);transform-origin:right center}
.i03.ref-c .box-roundel{width:225px;height:225px;border-radius:50%;overflow:hidden;background:#282321;display:grid;place-items:center;position:relative}
.i03.ref-c .box-roundel img{display:block;width:150px;height:200px;max-width:none;object-fit:contain;background:transparent}
.i03.ref-c .pairing-comments{border-top:1px solid var(--line);margin-top:18px;padding-top:16px}
.i03.ref-c .pairing-comments h4{font-size:11px;text-transform:uppercase;letter-spacing:.08em}
.i03.ref-c .pairing-comments ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding-left:18px;font-size:11px;line-height:1.7;color:var(--muted)}
.i03.ref-c .technical-breakdown{margin:14px 0}
.i03.ref-c .technical-breakdown img{width:100%;height:auto;max-height:620px;object-fit:contain;background:#fff}
.i03.ref-c .technical-breakdown figcaption{font-size:10px;color:var(--muted);margin-top:7px}
.i03.ref-c .breakdown-legend{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 18px;border-top:1px solid var(--line);margin-top:15px}
.i03.ref-c .breakdown-legend>div{display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid var(--line)}
.i03.ref-c .breakdown-legend>div>span{display:grid;place-items:center;width:25px;height:25px;border:1px solid var(--accent);border-radius:50%;font-size:11px;font-weight:600}
.i03.ref-c .breakdown-legend p{margin:2px 0;font-size:11px;line-height:1.55}
.i03.ref-c .front-box-key{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.i03.ref-c .front-box-key>div{padding:15px;background:var(--surface);border-top:1px solid var(--accent)}
.i03.ref-c .front-box-key h4{margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:.07em}
.i03.ref-c .front-box-key p{margin:0;font-size:12px;line-height:1.7}
.i03.ref-c .front-box-key ul{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0}
.i03.ref-c .front-box-key li{border:1px solid var(--line);padding:6px 9px;font-size:10px;line-height:1.3}
.i03.ref-c .catalog-breakdown-art{margin:24px auto;max-width:920px;background:#fff}
.i03.ref-c .catalog-breakdown-art img{display:block;width:100%;height:auto;max-height:none;object-fit:contain;background:#fff}
.i03.ref-c .catalog-breakdown-art figcaption{font-size:10px;color:var(--muted);padding:0 12px 12px}
.i03.ref-c .material-definitions dd img{display:block;width:100%;height:110px;object-fit:contain;background:#fff;margin-bottom:10px}
.i03.ref-c .pairing-sheet>.fine,.i03.ref-c .source-caption{margin-top:16px;color:var(--muted);font-size:10px}
.i03.ref-c .box-spec-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:32px}
.i03.ref-c .box-spec-grid>article{border-top:1px solid var(--line);padding-top:18px}
.i03.ref-c .box-spec-grid h3{font-size:25px;margin:12px 0 18px}
.i03.ref-c .box-spec-grid ul{padding-left:19px}
.i03.ref-c .box-spec-grid li,.i03.ref-c .material-definitions dd{font-size:12px;line-height:1.75;margin-bottom:10px}
.i03.ref-c .material-definitions div{display:grid;grid-template-columns:120px 1fr;gap:15px;border-top:1px solid var(--line);padding:12px 0}
.i03.ref-c .material-definitions dt{font-size:12px;font-weight:600}
.i03.ref-c .material-definitions dd{margin:0;color:var(--muted)}
.i03.ref-c .box-spec-grid .front-options{grid-column:1/-1;background:var(--surface);padding:22px}
.i03.ref-c .front-options>p:first-of-type{font-size:17px;line-height:1.8}
.i03.ref-c .comparison-intro{display:flex;justify-content:space-between;gap:30px;margin-bottom:30px;color:var(--muted);font-size:12px}
.i03.ref-c .relative-price{font-size:12px;margin:16px 0}
.i03.ref-c .material-compare-table{width:100%;border-collapse:collapse;font-size:12px}
.i03.ref-c .comparison-table-wrap{min-width:0;max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain}
.i03.ref-c .material-compare-table th,.i03.ref-c .material-compare-table td{text-align:left;border-bottom:1px solid var(--line);padding:12px 14px}
.i03.ref-c .material-compare-table thead th{font-size:10px;text-transform:uppercase;letter-spacing:.06em;background:var(--surface)}
.i03.ref-c .material-compare-table td{text-align:center}
.i03.ref-c .comparison-sheet{margin:38px 0}
.i03.ref-c .finish-family-guide{border-top:1px solid var(--line)}
.i03.ref-c .finish-family-guide>details{border-bottom:1px solid var(--line);padding:0 4px}
.i03.ref-c .finish-family-guide>details>summary{display:flex;justify-content:space-between;gap:18px;padding:20px 0;cursor:pointer;font-size:15px}
.i03.ref-c .finish-family-guide>details>summary small{font-size:11px;color:var(--muted)}
.i03.ref-c .family-samples{display:flex;gap:15px;flex-wrap:wrap}
.i03.ref-c .family-samples figure{width:calc(25% - 12px);margin:0}
.i03.ref-c .family-samples img{height:150px;width:100%;object-fit:contain;background:transparent}
.i03.ref-c .family-samples figcaption{font-size:11px;margin-top:6px}
.i03.ref-c .family-samples figcaption small{display:block;color:var(--muted);margin-top:4px}
.i03.ref-c .finish-family-guide>details>p,.i03.ref-c .finish-family-guide>details>a{font-size:12px;line-height:1.7}
.i03.ref-c .finish-family-guide>details>a{display:inline-block;margin:3px 0 18px;border-bottom:1px solid currentColor}
.i03.ref-c .accessory-item>div>p:not(.fine){font-size:12px;line-height:1.65;max-width:38ch}
.i03.ref-c .room-details{margin-top:32px}
.i03.ref-c .faq-library{margin-top:0}

.i03.ref-c .continuous-material-comparison{border-top:1px solid var(--line)}
.i03.ref-c .continuous-material-comparison .comparison-sheet{margin:0;padding:24px 0 28px;border-bottom:1px solid var(--line)}
.i03.ref-c .continuous-material-comparison .comparison-sheet>header{grid-template-columns:minmax(0,1fr) auto;margin-bottom:14px}
.i03.ref-c .continuous-material-comparison .comparison-sheet>header>span{grid-column:1/-1}
.i03.ref-c .continuous-material-comparison .comparison-sheet>header h3{font-size:25px}
.i03.ref-c .continuous-material-comparison .comparison-sheet>header p{grid-column:2;grid-row:2;margin:0;text-align:right;font-size:11px;color:var(--muted)}
.i03.ref-c .continuous-material-comparison .material-compare-table th,.i03.ref-c .continuous-material-comparison .material-compare-table td{padding:9px 12px}
.i03.ref-c .finish-library-intro{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:35px;align-items:center;margin-bottom:22px;color:var(--muted);font-size:13px;line-height:1.7}
.i03.ref-c .finish-library-intro>p:first-child{max-width:68ch;margin:0}
.i03.ref-c .finish-record-count{display:flex;align-items:center;gap:12px;border-left:1px solid var(--line);padding-left:22px;margin:0}
.i03.ref-c .finish-record-count strong{font-size:32px;line-height:1;color:var(--ink);font-weight:500}
.i03.ref-c .finish-record-count span{max-width:115px;font-size:10px;line-height:1.4}
.i03.ref-c .finish-type-index{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--line);border-left:1px solid var(--line);margin:20px 0 28px}
.i03.ref-c .finish-type-index button{display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:left;background:transparent;color:var(--ink);border:0;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:13px 15px;cursor:pointer;transition:background .2s,color .2s}
.i03.ref-c .finish-type-index button:hover,.i03.ref-c .finish-type-index button.is-active{background:var(--ink);color:var(--surface)}
.i03.ref-c .finish-type-index button:hover .family-kind,.i03.ref-c .finish-type-index button:hover .family-count,.i03.ref-c .finish-type-index button.is-active .family-kind,.i03.ref-c .finish-type-index button.is-active .family-count{color:var(--surface);opacity:.78}
.i03.ref-c .finish-type-index .family-label{display:block;font-size:12px}
.i03.ref-c .finish-type-index .family-kind{display:block;font-size:9px;white-space:normal;margin-top:4px;opacity:.7}
.i03.ref-c .finish-type-index .family-count{font-size:10px;white-space:nowrap;opacity:.72}
.i03.ref-c .tfl-highlight{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:18px 21px;margin:0 0 34px;background:var(--surface);border-block:1px solid var(--line)}
.i03.ref-c .tfl-highlight h3{font-size:21px;margin:5px 0}
.i03.ref-c .tfl-highlight p{font-size:12px;line-height:1.55;color:var(--muted);margin:0}
.i03.ref-c .tfl-highlight .text-button{flex:0 0 auto;font-weight:650;border-bottom:1px solid currentColor;padding:8px 0}
.i03.ref-c .finish-browser{scroll-margin-top:28px;border-top:1px solid var(--line);padding-top:20px}
.i03.ref-c .finish-browser-heading{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:14px}
.i03.ref-c .finish-browser-heading h3{font-size:24px;margin:5px 0 0}
.i03.ref-c .finish-browser-heading>p{max-width:42ch;font-size:11px;line-height:1.55;color:var(--muted);margin:0}
.i03.ref-c .finish-browser .filters{grid-template-columns:minmax(240px,1fr) minmax(190px,.5fr);margin:12px 0}
.i03.ref-c .finish-browser .filters label{font-size:10px}
.i03.ref-c .finish-browser .filters input,.i03.ref-c .finish-browser .filters select{min-height:38px}
.i03.ref-c .finish-browser .finish-tools{margin:12px 0}
.i03.ref-c .finish-browser .finish-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:18px 14px}
.i03.ref-c .finish-browser .finish-item{display:grid;grid-template-columns:76px minmax(0,1fr);gap:12px;padding:10px 0;border-top:1px solid var(--line)}
.i03.ref-c .finish-browser .finish-item>.image-button{height:76px}
.i03.ref-c .finish-browser .finish-item h3{font-size:13px;margin:3px 0}
.i03.ref-c .finish-browser .finish-item p{font-size:10px;margin:3px 0}
.i03.ref-c .finish-browser .compare-check{font-size:9px}
@media(max-width:900px){.i03.ref-c .finish-browser .finish-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c .finish-type-index button{padding:12px 10px}.i03.ref-c .continuous-material-comparison .comparison-sheet>header p{grid-column:1;grid-row:auto;text-align:left;margin-top:6px}}
@media(max-width:600px){.i03.ref-c .finish-library-intro{grid-template-columns:1fr;gap:12px}.i03.ref-c .finish-record-count{border-left:0;border-top:1px solid var(--line);padding:12px 0 0}.i03.ref-c .finish-type-index{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c .tfl-highlight,.i03.ref-c .finish-browser-heading{align-items:flex-start;flex-direction:column}.i03.ref-c .finish-browser .filters{grid-template-columns:1fr}.i03.ref-c .finish-browser .finish-grid{grid-template-columns:1fr}.i03.ref-c .continuous-material-comparison .material-compare-table{min-width:680px}}

.i03.ref-c .material-layout-picker{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-block:1px solid var(--line);margin:0 clamp(20px,4vw,68px) 28px}
.i03.ref-c .material-layout-picker>span{grid-column:1/-1;color:var(--accent);font-size:9px;letter-spacing:.1em;padding:11px 0 7px}
.i03.ref-c .material-layout-picker>a{display:grid;gap:4px;padding:11px 12px 13px 0;border-top:1px solid var(--line);border-right:1px solid var(--line);color:var(--ink)}
.i03.ref-c .material-layout-picker>a:not(:first-of-type){padding-left:12px}
.i03.ref-c .material-layout-picker>a:last-child{border-right:0}
.i03.ref-c .material-layout-picker>a strong{font-size:12px;font-weight:560}
.i03.ref-c .material-layout-picker>a small{font-size:9px;color:var(--muted)}
.i03.ref-c .material-layout-picker>a[aria-current=page]{background:var(--ink);color:var(--surface);padding-left:10px}
.i03.ref-c .material-layout-picker>a:focus-visible{outline:2px solid var(--accent);outline-offset:2px;position:relative;z-index:1}
.i03.ref-c .material-layout-picker>a[aria-current=page] small{color:color-mix(in srgb,var(--surface) 72%,transparent)}
.i03.ref-c .comparison-source-note{font-size:11px;color:var(--muted);margin:15px 0 0}
.i03.ref-c .mat-layout-2 .continuous-material-comparison{border-top:2px solid var(--ink)}
.i03.ref-c .mat-layout-2 #material-comparison .section-heading{max-width:1180px}
.i03.ref-c .mat-layout-2 .continuous-material-comparison .comparison-sheet{padding-block:30px}
.i03.ref-c .mat-layout-2 .material-compare-table thead th{background:color-mix(in srgb,var(--surface) 86%,var(--accent))}
.i03.ref-c .mat-layout-3 .finish-library-intro{grid-template-columns:minmax(0,1fr) 180px;padding-bottom:20px;border-bottom:1px solid var(--line)}
.i03.ref-c .mat-layout-3 .finish-type-index{grid-template-columns:1fr;border:0;margin-top:5px}
.i03.ref-c .mat-layout-3 .finish-type-index button{display:grid;grid-template-columns:minmax(0,1fr) minmax(110px,.7fr) 80px;align-items:center;padding:9px 12px;border-left:0;border-right:0}
.i03.ref-c .mat-layout-3 .finish-type-index .family-kind{display:inline;margin:0 0 0 10px}
.i03.ref-c .mat-layout-3 .finish-type-index .family-count{text-align:right}
.i03.ref-c .mat-layout-3 .finish-browser .finish-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 24px}
.i03.ref-c .mat-layout-3 .finish-browser .finish-item{grid-template-columns:92px minmax(0,1fr);padding:12px 0}
.i03.ref-c .mat-layout-4 #material-comparison{background:color-mix(in srgb,var(--surface) 68%,var(--accent));margin-inline:clamp(20px,4vw,68px);padding:clamp(20px,3vw,45px);}
.i03.ref-c .mat-layout-4 #material-comparison .section-heading{margin:0 0 18px}
.i03.ref-c .mat-layout-4 #material-comparison .section-content{width:100%;max-width:none}
.i03.ref-c .mat-layout-4 .comparison-sheet{padding:22px 0}
.i03.ref-c .mat-layout-4 .comparison-sheet>header h3{font-size:clamp(21px,2.4vw,30px)}
.i03.ref-c .mat-layout-4 .material-compare-table tbody tr:last-child{background:color-mix(in srgb,var(--surface) 65%,var(--accent));font-weight:650}
.i03.ref-c .mat-layout-4 .material-compare-table tbody tr:last-child th,.i03.ref-c .mat-layout-4 .material-compare-table tbody tr:last-child td{border-color:var(--accent)}
.i03.ref-c .mat-layout-4 .material-compare-table tbody tr:last-child td{font-weight:650}
.i03.ref-c .mat-layout-5 .finish-library-intro{grid-template-columns:1fr auto;background:color-mix(in srgb,var(--surface) 78%,var(--ink));padding:24px 26px;margin-bottom:0}
.i03.ref-c .mat-layout-5 .finish-type-index{grid-template-columns:repeat(9,minmax(120px,1fr));overflow-x:auto;margin:0 0 20px;border-top:0}
.i03.ref-c .mat-layout-5 .finish-type-index button{min-height:82px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;padding:12px 10px}
.i03.ref-c .mat-layout-5 .finish-type-index .family-kind{font-size:8px}
.i03.ref-c .mat-layout-5 .tfl-highlight{background:#e9e2d4}
.i03.ref-c .mat-layout-5 .finish-browser .finish-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.i03.ref-c .mat-layout-5 .finish-browser .finish-item{grid-template-columns:1fr;gap:8px;border:0;padding:0}
.i03.ref-c .mat-layout-5 .finish-browser .finish-item>.image-button{height:auto;aspect-ratio:1.55;background:var(--surface)}
.i03.ref-c .mat-layout-5 .finish-browser .finish-item>.image-button img{height:100%;width:100%;object-fit:cover}
.i03.ref-c .mat-layout-5 .finish-browser .finish-item>div{padding:0 2px}
@media(max-width:800px){.i03.ref-c .material-layout-picker{grid-template-columns:repeat(5,minmax(130px,1fr));overflow-x:auto}.i03.ref-c .mat-layout-3 .finish-type-index button{grid-template-columns:1fr auto}.i03.ref-c .mat-layout-3 .finish-type-index .family-kind{grid-column:1;grid-row:2;margin:3px 0}.i03.ref-c .mat-layout-3 .finish-browser .finish-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c .mat-layout-5 .finish-type-index{grid-template-columns:repeat(9,140px)}}
@media(max-width:600px){.i03.ref-c .mat-layout-5 .finish-browser .finish-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c .mat-layout-4 #material-comparison{margin-inline:14px;padding:16px 12px}.i03.ref-c .mat-layout-3 .finish-browser .finish-grid{grid-template-columns:1fr}}

.i03.ref-c .price-variant-picker{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));margin:0 clamp(20px,4vw,68px) 28px;border-bottom:1px solid var(--line)}
.i03.ref-c .price-variant-picker>span{grid-column:1/-1;font-size:9px;letter-spacing:.1em;color:var(--accent);padding-bottom:8px}
.i03.ref-c .price-variant-picker>a{display:grid;gap:4px;padding:11px 12px 12px 0;border-top:1px solid var(--line);border-right:1px solid var(--line);color:var(--ink)}
.i03.ref-c .price-variant-picker>a:not(:first-of-type){padding-left:12px}
.i03.ref-c .price-variant-picker>a:last-child{border-right:0}
.i03.ref-c .price-variant-picker>a strong{font-size:11px;font-weight:600}
.i03.ref-c .price-variant-picker>a small{font-size:9px;color:var(--muted)}
.i03.ref-c .price-variant-picker>a[aria-current=page]{background:var(--ink);color:var(--surface);padding-left:10px}
.i03.ref-c .price-variant-picker>a[aria-current=page] small{color:color-mix(in srgb,var(--surface) 72%,transparent)}
.i03.ref-c .price-landscape{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:0 clamp(20px,4vw,68px) 25px;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.i03.ref-c .price-landscape-heading{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:11px 0;border-bottom:1px solid var(--line)}
.i03.ref-c .price-landscape-heading span{font-size:9px;letter-spacing:.09em;color:var(--accent)}
.i03.ref-c .price-landscape-heading p{font-size:10px;color:var(--muted);margin:0}
.i03.ref-c .price-landscape>article{padding:17px 18px 18px 0;border-right:1px solid var(--line)}
.i03.ref-c .price-landscape>article:not(:nth-of-type(2)){padding-left:18px}
.i03.ref-c .price-landscape>article:last-child{border-right:0}
.i03.ref-c .price-landscape>article>small{font-size:10px;color:var(--accent)}
.i03.ref-c .price-landscape>article h3{font-size:16px;margin:7px 0}
.i03.ref-c .price-landscape>article p{font-size:11px;line-height:1.65;color:var(--muted);margin:0}
.i03.ref-c .price-variant-picker>a:focus-visible{outline:2px solid var(--accent);outline-offset:2px;position:relative;z-index:1}
/* P1: a fine, continuous cost strip that reads like an architect's price key. */
.i03.ref-c.price-variant-1 .price-landscape>article{min-height:112px}
.i03.ref-c.price-variant-1 .price-landscape>article:nth-of-type(3){background:color-mix(in srgb,var(--surface) 91%,var(--accent))}
/* P2: three vertically stacked material steps with the tier as the anchor. */
.i03.ref-c.price-variant-2 .price-landscape{grid-template-columns:1fr;border:0;gap:0}
.i03.ref-c.price-variant-2 .price-landscape-heading{border-bottom:1px solid var(--ink)}
.i03.ref-c.price-variant-2 .price-landscape>article{display:grid;grid-template-columns:160px 120px minmax(0,1fr);align-items:center;gap:14px;padding:12px 15px;border:0;border-bottom:1px solid var(--line)}
.i03.ref-c.price-variant-2 .price-landscape>article:nth-of-type(2){background:color-mix(in srgb,var(--surface) 88%,var(--accent))}
.i03.ref-c.price-variant-2 .price-landscape>article h3{margin:0}
.i03.ref-c.price-variant-2 .price-landscape>article p br{display:none}
.i03.ref-c.price-variant-2 .price-landscape>article p{display:flex;gap:14px}
/* P3: generous price bands lead the comparison as the dominant information. */
.i03.ref-c.price-variant-3 .price-landscape{gap:1px;border:0;background:var(--line)}
.i03.ref-c.price-variant-3 .price-landscape-heading{background:var(--surface);padding:16px}
.i03.ref-c.price-variant-3 .price-landscape>article{padding:25px 22px;min-height:155px;background:color-mix(in srgb,var(--surface) 94%,var(--accent));border:0}
.i03.ref-c.price-variant-3 .price-landscape>article:nth-of-type(3){background:color-mix(in srgb,var(--surface) 84%,var(--accent))}
.i03.ref-c.price-variant-3 .price-landscape>article>small{font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.i03.ref-c.price-variant-3 .price-landscape>article h3{font-size:23px}
/* P4: price label and finish character align as a compact decision ledger. */
.i03.ref-c.price-variant-4 .price-landscape{grid-template-columns:1fr;border:0}
.i03.ref-c.price-variant-4 .price-landscape-heading{border-bottom:1px solid var(--ink)}
.i03.ref-c.price-variant-4 .price-landscape>article{display:grid;grid-template-columns:190px 155px minmax(0,1fr);align-items:center;gap:20px;padding:13px 0;border:0;border-bottom:1px solid var(--line)}
.i03.ref-c.price-variant-4 .price-landscape>article h3{margin:0}
.i03.ref-c.price-variant-4 .price-landscape>article p br{display:none}
.i03.ref-c.price-variant-4 .price-landscape>article p{display:flex;gap:20px}
/* P5: dense procurement-style tier index beside the complete source tables. */
.i03.ref-c.price-variant-5 .price-landscape{grid-template-columns:210px repeat(3,minmax(0,1fr));border:0;align-items:stretch}
.i03.ref-c.price-variant-5 .price-landscape-heading{grid-column:1;grid-row:1/4;display:block;border:0;border-right:1px solid var(--line);padding:14px 18px 12px 0}
.i03.ref-c.price-variant-5 .price-landscape-heading p{margin-top:10px;line-height:1.5}
.i03.ref-c.price-variant-5 .price-landscape>article{padding:12px;border:0;border-top:1px solid var(--line);border-right:1px solid var(--line)}
.i03.ref-c.price-variant-5 .price-landscape>article:last-child{border-right:0}
.i03.ref-c.price-variant-5 .price-landscape>article h3{font-size:14px}
.i03.ref-c.price-variant-5 .price-landscape>article p{font-size:10px}
@media(max-width:800px){.i03.ref-c .price-variant-picker{grid-template-columns:repeat(5,minmax(130px,1fr));overflow-x:auto}.i03.ref-c.price-variant-2 .price-landscape>article,.i03.ref-c.price-variant-4 .price-landscape>article{grid-template-columns:130px 110px minmax(0,1fr)}.i03.ref-c.price-variant-5 .price-landscape{grid-template-columns:repeat(3,minmax(0,1fr))}.i03.ref-c.price-variant-5 .price-landscape-heading{grid-column:1/-1;grid-row:auto;border:0;border-bottom:1px solid var(--line);padding:10px 0}}
@media(max-width:600px){.i03.ref-c .price-landscape{grid-template-columns:1fr}.i03.ref-c .price-landscape-heading{display:block}.i03.ref-c .price-landscape-heading p{margin-top:6px}.i03.ref-c .price-landscape>article,.i03.ref-c .price-landscape>article:not(:nth-of-type(2)){padding:13px 0;border-right:0;border-bottom:1px solid var(--line)}.i03.ref-c.price-variant-2 .price-landscape>article,.i03.ref-c.price-variant-4 .price-landscape>article{grid-template-columns:1fr;gap:5px}.i03.ref-c.price-variant-5 .price-landscape{grid-template-columns:1fr}.i03.ref-c.price-variant-5 .price-landscape-heading{grid-column:auto}.i03.ref-c.price-variant-3 .price-landscape>article{min-height:0;padding:16px}}

.i03.ref-c.price-variant-5 .price-samples{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:9px 0 10px}
.i03.ref-c.price-variant-5 .price-samples figure{min-width:0;margin:0}
.i03.ref-c.price-variant-5 .price-samples img{display:block;width:100%;height:70px;max-height:none;object-fit:contain;padding:5px;background:var(--surface)}
.i03.ref-c.price-variant-5 .price-samples figcaption{font-size:9px;line-height:1.3;margin-top:4px;color:var(--muted)}
.i03.ref-c.price-variant-5 #material-comparison{margin-bottom:0;padding-bottom:28px}
.i03.ref-c.price-variant-5 #material-comparison .section-content{padding-bottom:6px}
.i03.ref-c.price-variant-5 #finishes{margin:58px clamp(20px,4vw,68px) 0;padding:36px 0 0;border-top:1px solid var(--ink)}
.i03.ref-c.price-variant-5 #finishes .section-heading{margin-bottom:18px}
.i03.ref-c.price-variant-5 #finishes .section-heading{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);align-items:end;gap:20px 48px;width:100%;max-width:none}
.i03.ref-c.price-variant-5 #finishes .section-heading h2{font-size:clamp(28px,3.2vw,42px)}
.i03.ref-c.price-variant-5 #finishes .section-heading h2{grid-column:1;min-width:0;max-width:none;margin:0}
.i03.ref-c.price-variant-5 #finishes .section-intro{grid-column:2;align-self:end;max-width:none;margin:0 0 3px;min-width:0}
.i03.ref-c.price-variant-5 #finishes .section-content{width:100%;max-width:none}
.i03.ref-c.price-variant-5 #finishes .finish-library-intro{grid-template-columns:minmax(0,1fr) auto;gap:28px;border-bottom:1px solid var(--line);padding-bottom:18px}
.i03.ref-c.price-variant-5 #finishes .finish-type-index{margin-top:0}
.i03.ref-c.price-variant-5 #finishes .tfl-highlight{margin-top:20px}
.i03.ref-c.price-variant-5 #finishes .finish-browser{margin-top:28px}
.i03.ref-c.price-variant-5 #finishes .finish-browser .finish-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
.i03.ref-c.price-variant-5 #finishes .finish-browser .finish-item>.image-button img{object-fit:contain;padding:8px}
.i03.ref-c.price-variant-5 #finishes .fine{width:100%;max-width:none;margin-top:25px;line-height:1.65}
.i03.ref-c.price-variant-5 #material-comparison .comparison-source-note,.i03.ref-c.price-variant-5 #material-comparison>.section-content>.fine{width:100%;max-width:none}
@media(max-width:800px){.i03.ref-c.price-variant-5 .price-landscape{grid-template-columns:repeat(3,minmax(0,1fr))}.i03.ref-c.price-variant-5 .price-landscape-heading{grid-column:1/-1;grid-row:auto;border:0;border-bottom:1px solid var(--line);padding:10px 0}.i03.ref-c.price-variant-5 .price-landscape>article{border-top:1px solid var(--line)}.i03.ref-c.price-variant-5 #finishes .finish-browser .finish-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.i03.ref-c.price-variant-5 .price-landscape{grid-template-columns:1fr}.i03.ref-c.price-variant-5 .price-landscape>article{border-right:0;padding:13px 0}.i03.ref-c.price-variant-5 #finishes{margin:42px 18px 0;padding-top:28px}.i03.ref-c.price-variant-5 #finishes .section-heading{grid-template-columns:1fr;gap:10px}.i03.ref-c.price-variant-5 #finishes .section-heading h2,.i03.ref-c.price-variant-5 #finishes .section-intro{grid-column:1}.i03.ref-c.price-variant-5 #finishes .finish-library-intro{grid-template-columns:1fr}.i03.ref-c.price-variant-5 #finishes .finish-browser .finish-grid{grid-template-columns:1fr}}

.i03.ref-c.price-variant-5 #material-comparison .material-compare-table{table-layout:fixed;width:100%}
.i03.ref-c.price-variant-5 #material-comparison .material-compare-table thead th:first-child{width:22%}
.i03.ref-c.price-variant-5 #material-comparison .material-compare-table thead th:not(:first-child){text-align:center;vertical-align:bottom;line-height:1.45}
.i03.ref-c.price-variant-5 #material-comparison .material-compare-table .price-row{background:color-mix(in srgb,var(--surface) 66%,var(--accent))}
.i03.ref-c.price-variant-5 #material-comparison .material-compare-table .price-row th{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.i03.ref-c.price-variant-5 #material-comparison .material-compare-table .price-row td{font-size:13px;font-weight:700;color:var(--ink);text-align:center}
.i03.ref-c.price-variant-5 #material-comparison .material-compare-table .price-row th,.i03.ref-c.price-variant-5 #material-comparison .material-compare-table .price-row td{padding-block:14px;border-top:1px solid var(--accent);border-bottom:1px solid var(--accent)}
.i03.ref-c.price-variant-5 #material-comparison .comparison-sheet>header{align-items:end}
.i03.ref-c.price-variant-5 #material-comparison .comparison-sheet>header h3{max-width:34ch}
.i03.ref-c.price-variant-5 #material-comparison .comparison-sheet>header p{max-width:34ch;line-height:1.5}


.i03.ref-c #configurations .section-heading{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);align-items:end;gap:20px 48px;width:100%;max-width:none}
.i03.ref-c #configurations .section-heading h2{grid-column:1;min-width:0;max-width:none;margin:0;font-size:clamp(30px,3.4vw,46px)}
.i03.ref-c #configurations .section-intro{grid-column:2;align-self:end;max-width:none;margin:0 0 3px;min-width:0}
.i03.ref-c #configurations .section-content{width:100%;max-width:none}
.i03.ref-c .configuration-quick-reference{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(260px,.7fr);align-items:center;gap:12px 56px;padding:27px 0 0;border-top:1px solid var(--line)}
.i03.ref-c .configuration-quick-reference>.eyebrow{grid-column:1/-1;color:var(--accent);font-size:9px;letter-spacing:.1em}
.i03.ref-c .configuration-quick-reference h3{grid-column:1;max-width:22ch;font-size:clamp(25px,3vw,38px);line-height:1.15;margin:0}
.i03.ref-c .configuration-quick-reference>p:not(.eyebrow):not(.configuration-note){grid-column:1;max-width:62ch;font-size:13px;line-height:1.7;color:var(--muted);margin:0}
.i03.ref-c .quickbook-open{grid-column:2;grid-row:2/4;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:19px 0;border-block:1px solid var(--ink);color:var(--ink)}
.i03.ref-c .quickbook-open>span{display:grid;gap:5px}
.i03.ref-c .quickbook-open strong{font-size:15px;font-weight:650}
.i03.ref-c .quickbook-open small{font-size:10px;color:var(--muted)}
.i03.ref-c .quickbook-open>b{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 15px;background:var(--ink);color:var(--surface);font-size:11px;white-space:nowrap}
.i03.ref-c .quickbook-open:hover>b{background:var(--accent);color:var(--ink)}
.i03.ref-c .quickbook-open:focus-visible,.i03.ref-c .quickbook-inline:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
.i03.ref-c .configuration-quick-reference .configuration-note{grid-column:1/-1;width:100%;max-width:none;margin:14px 0 0;padding-top:13px;border-top:1px solid var(--line);font-size:11px;line-height:1.6;color:var(--muted)}
.i03.ref-c .quickbook-inline{display:inline-block;margin:22px 0 0;padding:10px 0;border-bottom:1px solid var(--line);font-size:11px;font-weight:600;color:var(--ink)}
.i03.ref-c .quickbook-inline:hover{color:var(--accent);border-color:var(--accent)}
@media(max-width:800px){.i03.ref-c .configuration-quick-reference{grid-template-columns:1fr;gap:12px 20px}.i03.ref-c .quickbook-open{grid-column:1;grid-row:auto}}
@media(max-width:600px){.i03.ref-c #configurations .section-heading{grid-template-columns:1fr;gap:10px}.i03.ref-c #configurations .section-heading h2,.i03.ref-c #configurations .section-intro{grid-column:1}.i03.ref-c .configuration-quick-reference{padding-top:20px}.i03.ref-c .quickbook-open{align-items:flex-start;flex-direction:column}.i03.ref-c .quickbook-open>b{width:100%}}

.i03.ref-c .configuration-reference-bar{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:24px 38px;margin:18px 4vw 10px;padding:19px 22px;background:color-mix(in srgb,var(--surface) 72%,var(--accent));border:1px solid var(--line)}
.i03.ref-c .configuration-reference-bar .eyebrow{display:block;font-size:9px;letter-spacing:.09em;color:var(--accent);margin-bottom:6px}
.i03.ref-c .configuration-reference-bar h3{font-size:19px;line-height:1.2;margin:0 0 6px}
.i03.ref-c .configuration-reference-bar p{max-width:74ch;font-size:11px;line-height:1.6;color:var(--muted);margin:0}
.i03.ref-c .configuration-reference-bar>a{display:flex;align-items:center;gap:20px;padding-left:24px;border-left:1px solid var(--line);color:var(--ink);white-space:nowrap}
.i03.ref-c .configuration-reference-bar>a>span{display:grid;gap:4px}
.i03.ref-c .configuration-reference-bar>a strong{font-size:12px;font-weight:650}
.i03.ref-c .configuration-reference-bar>a small{font-size:9px;color:var(--muted)}
.i03.ref-c .configuration-reference-bar>a b{font-size:10px;font-weight:650;border-bottom:1px solid currentColor;padding:7px 0}
.i03.ref-c .configuration-reference-bar>a:hover{color:var(--accent)}
.i03.ref-c .configuration-reference-bar>a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
@media(max-width:700px){.i03.ref-c .configuration-reference-bar{grid-template-columns:1fr;gap:14px;margin:16px 18px 10px;padding:16px}.i03.ref-c .configuration-reference-bar>a{justify-content:space-between;border-left:0;border-top:1px solid var(--line);padding:12px 0 0;white-space:normal}}
@media(max-width:1100px){.i03.ref-c .construction-notes-grid{gap:0 22px}}
@media(max-width:900px){.i03.ref-c .guided-sequence{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 17px}}
@media(max-width:767px){.i03.ref-c .next-stage{margin-inline:20px;align-items:flex-start;flex-direction:column;gap:8px}.i03.ref-c .next-stage>a{width:100%;gap:12px}.i03.ref-c .next-stage strong{font-size:21px}.i03.ref-c .next-stage small{font-size:10px}}
@media(max-width:767px){.i03.ref-c .pairing-specimens,.i03.ref-c .box-spec-grid,.i03.ref-c .home-summary-grid,.i03.ref-c .home-construction-layout,.i03.ref-c .construction-key,.i03.ref-c .construction-notes-grid,.i03.ref-c .front-box-diagrams{grid-template-columns:1fr}.i03.ref-c .home-construction-layout{gap:23px}.i03.ref-c .home-construction-figure img{height:260px}.i03.ref-c .home-front-box-options>div{grid-template-columns:110px minmax(0,1fr)}.i03.ref-c .pairing-sheet>header{grid-template-columns:1fr}.i03.ref-c .pairing-sheet>header p{grid-column:1;grid-row:auto}.i03.ref-c .finish-pairings figure,.i03.ref-c .family-samples figure{width:calc(50% - 8px)}.i03.ref-c .comparison-intro{display:block}.i03.ref-c .comparison-table-wrap{overflow-x:auto}.i03.ref-c .material-compare-table{min-width:620px}.i03.ref-c .box-spec-grid .front-options{grid-column:auto}.i03.ref-c .material-definitions div{grid-template-columns:95px 1fr}.i03.ref-c .home-path-grid{grid-template-columns:1fr 1fr}.i03.ref-c .guided-sequence{grid-template-columns:1fr}.i03.ref-c .guided-step{display:grid;grid-template-columns:112px minmax(0,1fr);gap:0 15px;padding:17px 20px 17px 0}.i03.ref-c .guided-step-number{top:17px}.i03.ref-c .guided-step-images{grid-column:1;grid-row:1;align-self:start;width:100%;height:90px;margin:0}.i03.ref-c .guided-step-copy{grid-column:2;grid-row:1}.i03.ref-c .guided-step-copy h3{font-size:21px;margin:4px 0}.i03.ref-c .guided-step-copy p{font-size:10px;margin-bottom:7px}.i03.ref-c .guided-step-count{padding:2px 0 8px}.i03.ref-c .pairing-comments ul{grid-template-columns:1fr}.i03.ref-c .breakdown-legend,.i03.ref-c .front-box-key{grid-template-columns:1fr}.i03.ref-c .box-roundel{width:205px;height:205px}.i03.ref-c .box-art:before{left:0;width:55px}.i03.ref-c .front-callout-line{width:50px}.i03.ref-c .catalog-page-header{padding:36px 20px 22px}}
@media(max-width:767px){.i03.ref-c .comparison-handle{width:46px;height:46px;min-height:46px;font-size:23px}.i03.ref-c .profile-item>img{height:205px;padding:10px}.i03.ref-c .product-item>.image-button>img{height:190px;padding:12px}.i03.ref-c .product-interior{padding:12px 0}.i03.ref-c .product-interior img{height:135px}}

.i03.ref-c .quickbook-reader{margin:20px 4vw 56px;padding:0;border-top:1px solid var(--line)}
.i03.ref-c .quickbook-reader-bar{display:flex;align-items:end;justify-content:space-between;gap:24px;padding:22px 0 17px}
.i03.ref-c .quickbook-reader-bar .eyebrow{display:block;margin-bottom:8px;color:var(--accent);font-size:9px;letter-spacing:.1em}
.i03.ref-c .quickbook-reader-bar h2{margin:0;font-size:clamp(23px,2.5vw,34px);line-height:1.15}
.i03.ref-c .quickbook-reader-back{flex:none;padding:8px 0;border-bottom:1px solid var(--line);font-size:11px;color:var(--ink)}
.i03.ref-c .quickbook-reader-back:hover{color:var(--accent);border-color:var(--accent)}
.i03.ref-c .quickbook-pdf{display:block;width:100%;height:clamp(680px,82vh,1120px);border:1px solid var(--line);background:var(--surface)}
.i03.ref-c .quickbook-reader-note{width:100%;max-width:none;margin:0;padding:13px 0;border-bottom:1px solid var(--line);font-size:11px;line-height:1.65;color:var(--muted)}
.i03.ref-c .quickbook-reader-back:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
@media(max-width:700px){.i03.ref-c .quickbook-reader{margin:16px 18px 40px}.i03.ref-c .quickbook-reader-bar{align-items:flex-start;flex-direction:column;gap:13px}.i03.ref-c .quickbook-pdf{height:76vh;min-height:560px}}

.i03.ref-c #accessories .section-heading{grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:20px 54px;align-items:end}
.i03.ref-c #accessories .section-heading h2{grid-column:1;max-width:13ch;margin:0;font-size:clamp(34px,4.4vw,58px);line-height:1.02}
.i03.ref-c #accessories .section-intro{grid-column:2;max-width:48ch;margin:0 0 4px;line-height:1.7}
.i03.ref-c #accessories .section-content{width:100%;max-width:none}
.i03.ref-c #accessories .accessory-index{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-block:1px solid var(--line);margin:0 0 38px}
.i03.ref-c #accessories .accessory-index>a{display:flex;align-items:center;gap:12px;min-width:0;padding:15px 14px;border-right:1px solid var(--line);font-size:12px}
.i03.ref-c #accessories .accessory-index>a:first-child{padding-left:0}
.i03.ref-c #accessories .accessory-index>a:last-child{border-right:0}
.i03.ref-c #accessories .accessory-index>a>span{color:var(--accent);font-size:9px;letter-spacing:.08em}
.i03.ref-c #accessories .accessory-index>a>b{margin-left:auto;font-size:13px;font-weight:400}
.i03.ref-c #accessories .accessory-index>a:hover{color:var(--accent)}
.i03.ref-c #accessories .accessory-value-promise{display:grid;grid-template-columns:minmax(180px,.45fr) minmax(0,1fr) minmax(220px,.7fr);align-items:center;gap:10px 28px;margin:-13px 0 28px;padding:16px 0;border-block:1px solid var(--line)}
.i03.ref-c #accessories .accessory-value-promise .eyebrow{font-size:9px;letter-spacing:.1em;color:var(--accent)}
.i03.ref-c #accessories .accessory-value-promise strong{font-family:var(--display);font-size:clamp(21px,2.2vw,29px);font-weight:500;line-height:1.15}
.i03.ref-c #accessories .accessory-value-promise p{margin:0;font-size:10px;line-height:1.65;color:var(--muted)}
.i03.ref-c #accessories .accessory-categories{display:grid;gap:40px}
.i03.ref-c #accessories .accessory-catalogue-reference{display:flex;align-items:center;justify-content:space-between;gap:22px;padding:16px 0;border-block:1px solid var(--line);color:var(--ink)}
.i03.ref-c #accessories .accessory-catalogue-reference>span{display:grid;gap:5px}
.i03.ref-c #accessories .accessory-catalogue-reference strong{font-family:var(--display);font-size:20px;font-weight:500}
.i03.ref-c #accessories .accessory-catalogue-reference small{font-size:10px;color:var(--muted)}
.i03.ref-c #accessories .accessory-catalogue-reference>b{font-size:10px;font-weight:600;border-bottom:1px solid currentColor;padding:7px 0}
.i03.ref-c #accessories .accessory-catalogue-reference:hover{color:var(--accent)}
.i03.ref-c #accessories .accessory-catalogue-reference:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
.i03.ref-c #accessories .accessory-category{scroll-margin-top:20px}
.i03.ref-c #accessories .accessory-category>header{display:grid;grid-template-columns:minmax(0,1fr) minmax(200px,.6fr);align-items:end;gap:20px;margin-bottom:17px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.i03.ref-c #accessories .accessory-category>header .eyebrow{font-size:9px;color:var(--accent);letter-spacing:.1em}
.i03.ref-c #accessories .accessory-category>header h3{margin:5px 0 0;font-size:clamp(23px,2.5vw,32px);font-weight:500}
.i03.ref-c #accessories .accessory-category>header>p{max-width:38ch;margin:0 0 2px;font-size:11px;line-height:1.6;color:var(--muted)}
.i03.ref-c #accessories .hood-category>header>p{max-width:65ch}
.i03.ref-c #accessories .accessory-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:23px 18px}
.i03.ref-c #accessories .accessory-item{min-width:0;border-top:0;padding:0}
.i03.ref-c #accessories .accessory-visual{display:grid;place-items:center;height:clamp(160px,17vw,225px);background:color-mix(in srgb,var(--surface) 78%,var(--accent));border:1px solid color-mix(in srgb,var(--line) 75%,transparent)}
.i03.ref-c #accessories .accessory-visual img{width:100%;height:100%;object-fit:contain;padding:17px;background:transparent}
.i03.ref-c #accessories .accessory-copy{padding-top:12px}
.i03.ref-c #accessories .accessory-copy .item-index{font-size:9px;color:var(--accent)}
.i03.ref-c #accessories .accessory-copy h4{margin:4px 0 3px;font-size:17px;line-height:1.2;font-weight:550}
.i03.ref-c #accessories .accessory-reference{min-height:28px;margin:0 0 9px;font-size:9px;line-height:1.45;color:var(--muted)}
.i03.ref-c #accessories .accessory-copy>p:not(.accessory-reference){min-height:68px;margin:0;font-size:10px;line-height:1.6;color:var(--muted)}
.i03.ref-c #accessories .accessory-actions{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:10px;padding-top:9px;border-top:1px solid var(--line)}
.i03.ref-c #accessories .accessory-actions>span{font-size:9px;line-height:1.45;color:var(--muted)}
.i03.ref-c #accessories .accessory-actions .save-button{flex:none}
.i03.ref-c #accessories .accessory-review-note{display:block;width:100%;max-width:none;box-sizing:border-box;clear:both;margin:34px 0 0;padding:14px 0;border-block:1px solid var(--line);font-size:11px;line-height:1.65;color:var(--muted)}
.i03.ref-c #accessories .hood-feature-layout{display:grid;grid-template-columns:minmax(240px,.7fr) minmax(0,1.3fr);gap:28px;align-items:stretch;margin:24px 0 30px}
.i03.ref-c #accessories .hood-feature-copy{display:flex;flex-direction:column;justify-content:center;padding:24px;background:color-mix(in srgb,var(--surface) 78%,var(--accent));border:1px solid var(--line)}
.i03.ref-c #accessories .hood-feature-copy>.eyebrow{font-size:9px;color:var(--accent);letter-spacing:.1em}
.i03.ref-c #accessories .hood-feature-copy ol{display:grid;gap:0;padding:0;margin:12px 0;list-style:none}
.i03.ref-c #accessories .hood-feature-copy li{display:grid;grid-template-columns:30px minmax(0,1fr);gap:9px;padding:12px 0;border-bottom:1px solid var(--line);font-size:11px;line-height:1.5}
.i03.ref-c #accessories .hood-feature-copy li>b{font-size:9px;font-weight:500;color:var(--accent)}
.i03.ref-c #accessories .hood-feature-copy>p{margin:7px 0 0;font-size:10px;line-height:1.6;color:var(--muted)}
.i03.ref-c #accessories .hood-feature-image{display:flex;flex-direction:column;min-width:0;margin:0}
.i03.ref-c #accessories .hood-feature-image img{display:block;width:100%;height:100%;min-height:330px;max-height:490px;object-fit:cover;background:var(--surface)}
.i03.ref-c #accessories .hood-feature-image figcaption{padding:8px 0 0;font-size:9px;line-height:1.5;color:var(--muted)}
.i03.ref-c #accessories .hood-style-index{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-top:1px solid var(--line)}
.i03.ref-c #accessories .hood-style-index>article{display:flex;flex-direction:column;align-items:stretch;gap:7px;min-width:0;padding:10px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.i03.ref-c #accessories .hood-style-index>article:nth-child(5n+1){padding-left:0}
.i03.ref-c #accessories .hood-style-index>article:nth-child(5n){border-right:0}
.i03.ref-c #accessories .hood-style-thumb{display:grid;place-items:center;height:158px;min-height:158px;overflow:visible;background:color-mix(in srgb,var(--surface) 78%,var(--accent))}
.i03.ref-c #accessories .hood-image-button{position:relative;display:grid;place-items:center;width:100%;height:100%;min-width:0;padding:0;border:0;background:transparent;cursor:zoom-in}
.i03.ref-c #accessories .hood-image-button>img{display:block;width:auto!important;height:auto!important;max-width:100%!important;max-height:144px!important;object-fit:contain!important;object-position:center;padding:0;box-sizing:border-box;background:transparent;mix-blend-mode:multiply}
.i03.ref-c #accessories .hood-image-button>span{position:absolute;right:6px;bottom:6px;padding:4px 6px;background:var(--bg);font-size:8px;color:var(--ink);opacity:.9}
.i03.ref-c #accessories .hood-image-button:hover>span{background:var(--ink);color:var(--bg)}
.i03.ref-c #accessories .hood-image-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.i03.ref-c .detail-drawer>img.hood-detail-image{height:420px;object-fit:contain;background:transparent;mix-blend-mode:multiply}
.i03.ref-c #accessories .hood-style-meta{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;gap:7px}
.i03.ref-c #accessories .hood-style-meta>span{font-size:8px;letter-spacing:.06em;color:var(--accent)}
.i03.ref-c #accessories .hood-style-meta>strong{font-size:10px;font-weight:500;line-height:1.35}
.i03.ref-c #accessories .hood-style-index .save-btn{font-size:9px;white-space:nowrap}
.i03.ref-c #accessories .hood-order-note{max-width:90ch;margin:15px 0 0;font-size:10px;line-height:1.7;color:var(--muted)}
@media(max-width:900px){.i03.ref-c #accessories .accessory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c #accessories .accessory-visual{height:220px}}
@media(max-width:800px){.i03.ref-c #accessories .accessory-value-promise{grid-template-columns:1fr 1.3fr;gap:8px 20px}.i03.ref-c #accessories .accessory-value-promise p{grid-column:2}}
@media(max-width:700px){.i03.ref-c #accessories .section-heading{grid-template-columns:1fr;gap:12px}.i03.ref-c #accessories .section-heading h2,.i03.ref-c #accessories .section-intro{grid-column:1}.i03.ref-c #accessories .accessory-value-promise{grid-template-columns:1fr;gap:8px}.i03.ref-c #accessories .accessory-value-promise p{grid-column:1}.i03.ref-c #accessories .accessory-index{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c #accessories .accessory-index>a:nth-child(2),.i03.ref-c #accessories .accessory-index>a:nth-child(4){border-right:0}.i03.ref-c #accessories .accessory-index>a:nth-child(-n+3){border-bottom:1px solid var(--line)}.i03.ref-c #accessories .accessory-index>a:first-child{padding-left:14px}.i03.ref-c #accessories .accessory-catalogue-reference{align-items:flex-start;flex-direction:column;gap:10px}.i03.ref-c #accessories .accessory-category>header{grid-template-columns:1fr;gap:8px}.i03.ref-c #accessories .accessory-copy>p:not(.accessory-reference){min-height:0}.i03.ref-c #accessories .hood-feature-layout{grid-template-columns:1fr;gap:16px}.i03.ref-c #accessories .hood-feature-image{grid-row:1}.i03.ref-c #accessories .hood-feature-image img{height:auto;min-height:0;max-height:none;aspect-ratio:1.9;object-fit:cover}.i03.ref-c #accessories .hood-style-index{grid-template-columns:repeat(3,minmax(0,1fr))}.i03.ref-c #accessories .hood-style-index>article:nth-child(3n+1){padding-left:0}.i03.ref-c #accessories .hood-style-index>article:nth-child(3n){border-right:0}}
@media(max-width:480px){.i03.ref-c #accessories .accessory-grid{grid-template-columns:1fr}.i03.ref-c #accessories .accessory-visual{height:230px}.i03.ref-c #accessories .accessory-reference{min-height:0}.i03.ref-c #accessories .hood-style-index{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c #accessories .hood-style-index>article:nth-child(2n+1){padding-left:0}.i03.ref-c #accessories .hood-style-index>article:nth-child(2n){border-right:0}.i03.ref-c #accessories .hood-style-thumb{height:145px;min-height:145px}.i03.ref-c #accessories .hood-image-button>img{max-height:132px!important}}
.i03.ref-c .countertop-feature{display:grid;grid-template-columns:minmax(290px,.8fr) minmax(0,1.2fr);gap:28px;align-items:stretch;margin:10px 0 0}
.i03.ref-c .countertop-feature-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(22px,3.5vw,48px);background:color-mix(in srgb,var(--surface) 78%,var(--accent));border-top:1px solid var(--accent)}
.i03.ref-c .countertop-feature-copy>.eyebrow,.i03.ref-c .countertop-edge-index>.eyebrow{font-size:9px;color:var(--accent);letter-spacing:.1em}
.i03.ref-c .countertop-feature-copy h3{font-family:var(--display);font-size:clamp(26px,3vw,40px);line-height:1.08;margin:13px 0}
.i03.ref-c .countertop-feature-copy>p{max-width:56ch;font-size:12px;line-height:1.7;color:var(--muted)}
.i03.ref-c .countertop-feature-copy .countertop-value-note{margin:0 0 12px;font-size:10px;color:var(--accent)}
.i03.ref-c .countertop-materials{margin:12px 0 18px;border-top:1px solid var(--line)}
.i03.ref-c .countertop-materials>div{display:grid;grid-template-columns:100px 1fr;gap:16px;align-items:baseline;padding:12px 0;border-bottom:1px solid var(--line)}
.i03.ref-c .countertop-materials strong{font-family:var(--display);font-size:18px;font-weight:500}
.i03.ref-c .countertop-materials span{font-size:10px;color:var(--muted)}
.i03.ref-c .countertop-feature-image{display:flex;flex-direction:column;justify-content:center;min-width:0;margin:0}
.i03.ref-c .countertop-feature-image img{display:block;width:100%;height:auto;max-height:580px;object-fit:contain;background:var(--surface)}
.i03.ref-c .countertop-feature-image figcaption,.i03.ref-c .countertop-secondary-image figcaption{padding:8px 0 0;font-size:9px;line-height:1.5;color:var(--muted)}
.i03.ref-c .countertop-detail-grid{display:grid;grid-template-columns:minmax(260px,.8fr) minmax(0,1.2fr);gap:36px;align-items:center}
.i03.ref-c .countertop-edge-index ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 20px;margin:15px 0;padding:0;list-style:none;border-top:1px solid var(--line)}
.i03.ref-c .countertop-edge-index li{display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:baseline;padding:11px 0;border-bottom:1px solid var(--line)}
.i03.ref-c .countertop-edge-index li>span{font-family:var(--display);font-size:13px;color:var(--accent)}
.i03.ref-c .countertop-edge-index li>strong{font-size:11px;font-weight:500}
.i03.ref-c .countertop-edge-index>p{font-size:10px;line-height:1.7;color:var(--muted)}
.i03.ref-c .countertop-secondary-image{min-width:0;margin:0}
.i03.ref-c .countertop-secondary-image img{display:block;width:100%;height:auto;max-height:500px;object-fit:contain;background:var(--surface)}
.i03.ref-c .countertop-review-note{width:100%;max-width:none;box-sizing:border-box;margin:30px 0 0;padding:13px 0;border-block:1px solid var(--line);font-size:11px;line-height:1.7;color:var(--muted)}
.i03.ref-c .countertop-room-link{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:20px 0;border-block:1px solid var(--line)}
.i03.ref-c .countertop-room-link>span{display:grid;gap:4px}
.i03.ref-c .countertop-room-link strong{font-family:var(--display);font-size:23px}
.i03.ref-c .countertop-room-link small{font-size:11px;color:var(--muted)}
.i03.ref-c .countertop-room-link>b{display:inline-flex;align-items:center;min-height:44px;padding:10px 16px;background:var(--ink);color:var(--surface);font-size:11px}
.i03.ref-c .countertop-room-link:hover strong{color:var(--accent)}
@media(max-width:760px){.i03.ref-c .countertop-feature,.i03.ref-c .countertop-detail-grid{grid-template-columns:1fr;gap:18px}.i03.ref-c .countertop-feature-image{grid-row:1}.i03.ref-c .countertop-feature-image img{min-height:0;max-height:none;aspect-ratio:1.55}.i03.ref-c .countertop-secondary-image img{max-height:none}.i03.ref-c .countertop-room-link{align-items:flex-start;flex-direction:column;gap:14px}}
@media(max-width:767px){.i03.ref-c #countertop-direction .section-heading,.i03.ref-c #countertop-material-comparison .section-heading,.i03.ref-c #countertop-detail .section-heading{grid-template-columns:1fr;gap:10px}.i03.ref-c #countertop-direction .section-heading h2,.i03.ref-c #countertop-direction .section-intro,.i03.ref-c #countertop-material-comparison .section-heading h2,.i03.ref-c #countertop-material-comparison .section-intro,.i03.ref-c #countertop-detail .section-heading h2,.i03.ref-c #countertop-detail .section-intro{grid-column:1}}
.i03.ref-c .countertop-reference-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:34px;align-items:start}
.i03.ref-c .countertop-sample-library>.eyebrow,.i03.ref-c .countertop-edge-library>.eyebrow{display:block;margin:0 0 14px;font-size:9px;letter-spacing:.1em;color:var(--accent)}
.i03.ref-c .countertop-sample-intro{margin:-4px 0 16px;font-size:10px;line-height:1.5;color:var(--muted)}
.i03.ref-c .countertop-sample-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:12px}
.i03.ref-c .countertop-sample-grid figure,.i03.ref-c .countertop-profile-grid figure{min-width:0;margin:0;border-top:1px solid var(--line);padding-top:10px}
.i03.ref-c .countertop-sample-open{display:block;width:100%;padding:0;border:0;background:transparent;text-align:left;cursor:zoom-in}
.i03.ref-c .countertop-sample-open img{display:block;width:100%;aspect-ratio:1;object-fit:cover;background:var(--surface)}
.i03.ref-c .countertop-sample-open>span{display:block;padding-top:6px;font-size:9px;color:var(--muted)}
.i03.ref-c .countertop-sample-open:hover>span,.i03.ref-c .countertop-sample-open:focus-visible>span{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.i03.ref-c .countertop-sample-open:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.i03.ref-c .countertop-sample-grid figcaption{display:grid;gap:3px;padding-top:7px}
.i03.ref-c .countertop-sample-grid figcaption strong{font-size:11px;font-weight:600}
.i03.ref-c .countertop-sample-grid figcaption small{font-size:9px;color:var(--muted)}
.i03.ref-c .countertop-profile-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px 10px}
.i03.ref-c .countertop-profile-grid img{display:block;width:100%;height:70px;object-fit:contain;mix-blend-mode:multiply}
.i03.ref-c .countertop-profile-grid figcaption{padding-top:6px;font-size:9px;color:var(--muted)}
.i03.ref-c .countertop-edge-open img{height:82px;aspect-ratio:auto;object-fit:contain;background:transparent}
.i03.ref-c .countertop-profile-grid figcaption{display:grid;gap:3px}
.i03.ref-c .countertop-profile-grid figcaption strong{font-size:10px;font-weight:550;color:var(--ink)}
.i03.ref-c .countertop-profile-grid figcaption small{font-size:8px;color:var(--muted)}
.i03.ref-c .countertop-comparison{display:grid;grid-template-columns:minmax(200px,.55fr) minmax(0,1fr);gap:20px 30px;align-items:start}
.i03.ref-c .countertop-comparison-surfaces{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.i03.ref-c .countertop-comparison-surfaces figure{min-width:0;margin:0;border-top:1px solid var(--line);padding-top:9px}
.i03.ref-c .countertop-comparison-surfaces .countertop-sample-open img{height:150px;aspect-ratio:auto;object-fit:contain;background:transparent;mix-blend-mode:multiply}
.i03.ref-c .countertop-comparison-surfaces figcaption{padding-top:5px;font-size:10px;font-weight:600}
.i03.ref-c .countertop-comparison-table-wrap{min-width:0;overflow-x:auto}
.i03.ref-c .countertop-comparison-table{width:100%;min-width:0;table-layout:fixed;border-collapse:collapse;font-size:10px}
.i03.ref-c .countertop-comparison-table th,.i03.ref-c .countertop-comparison-table td{padding:9px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
.i03.ref-c .countertop-comparison-table thead th{font-size:9px;font-weight:650;color:var(--accent);border-top:1px solid var(--line)}
.i03.ref-c .countertop-comparison-table tbody th{width:42%;font-weight:500;color:var(--muted)}
.i03.ref-c .countertop-comparison-table tbody th{min-width:0}
.i03.ref-c .countertop-comparison-table tbody td{width:29%;font-weight:550}
.i03.ref-c .countertop-comparison-table th,.i03.ref-c .countertop-comparison-table td{overflow-wrap:anywhere}
.i03.ref-c .countertop-comparison-table tbody tr:nth-child(odd){background:color-mix(in srgb,var(--surface) 62%,transparent)}
.i03.ref-c .countertop-comparison-note{grid-column:1/-1;width:100%;max-width:none;margin:0;padding:12px 0;border-block:1px solid var(--line);font-size:10px;line-height:1.65;color:var(--muted)}
@media(max-width:900px){.i03.ref-c .countertop-reference-layout{grid-template-columns:1fr;gap:25px}.i03.ref-c .countertop-sample-grid{grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}.i03.ref-c .countertop-profile-grid{grid-template-columns:repeat(auto-fit,minmax(110px,1fr))}.i03.ref-c .countertop-edge-open img{height:68px}.i03.ref-c .countertop-comparison{grid-template-columns:1fr;gap:18px}.i03.ref-c .countertop-comparison-surfaces{grid-template-columns:repeat(2,minmax(0,130px))}.i03.ref-c .countertop-comparison-surfaces .countertop-sample-open img{height:150px}}
.detail-drawer.countertop-image-detail{display:block;width:min(920px,calc(100% - 28px));height:auto;max-height:92dvh;margin:auto;padding:clamp(16px,3vw,34px);border:1px solid var(--line);background:var(--bg);color:var(--ink);overflow:auto}
.i03.ref-c .detail-drawer.countertop-image-detail{height:max-content;min-height:0;max-height:92dvh;width:min(920px,calc(100% - 28px));margin:auto;overflow:auto}
.detail-drawer.countertop-image-detail figure{margin:12px 0 18px}
.detail-drawer.countertop-image-detail figure img{display:block;width:min(100%,560px);height:auto;max-height:68dvh;object-fit:contain;margin:0 auto;background:transparent;mix-blend-mode:multiply}
.detail-drawer.countertop-image-detail figcaption{padding-top:12px;text-align:center;font-family:var(--display);font-size:20px}
.detail-drawer.countertop-image-detail>p{max-width:65ch;margin:14px auto 0;text-align:center;font-size:11px;color:var(--muted)}
.i03.ref-c .countertop-surface-tabs{display:flex;gap:0;margin:22px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.i03.ref-c .countertop-surface-tabs button{display:flex;align-items:baseline;gap:12px;padding:13px 18px 13px 0;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--muted);font:inherit;text-align:left;cursor:pointer}
.i03.ref-c .countertop-surface-tabs button+button{padding-left:22px;border-left:1px solid var(--line)}
.i03.ref-c .countertop-surface-tabs button.is-active{border-bottom-color:var(--accent);color:var(--ink)}
.i03.ref-c .countertop-surface-tabs button span{font-size:10px;color:var(--muted)}
.i03.ref-c .countertop-surface-tabs button:focus-visible,.i03.ref-c .countertop-catalog-tools input:focus-visible,.i03.ref-c .countertop-catalog-tools select:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.i03.ref-c .countertop-catalog-tools{display:grid;grid-template-columns:minmax(180px,.6fr) minmax(220px,1fr) auto;gap:14px;align-items:end;margin:18px 0 12px}
.i03.ref-c .countertop-catalog-tools label{display:grid;gap:6px;min-width:0}
.i03.ref-c .countertop-catalog-tools label>span{font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.i03.ref-c .countertop-catalog-tools select,.i03.ref-c .countertop-catalog-tools input{width:100%;min-width:0;min-height:42px;padding:0 12px;border:1px solid var(--line);border-radius:0;background:var(--bg);color:var(--ink);font:inherit;font-size:12px}
.i03.ref-c .countertop-catalog-tools>p{margin:0 0 11px;color:var(--muted);font-size:10px;white-space:nowrap}
.i03.ref-c .countertop-sample-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px 12px}
.i03.ref-c .countertop-catalog-item{border-top:1px solid var(--line);padding-top:10px}
.i03.ref-c .countertop-catalog-item .countertop-sample-open img{height:auto;aspect-ratio:1.55;object-fit:contain;background:color-mix(in srgb,var(--surface) 75%,transparent)}
.i03.ref-c .countertop-catalog-item .countertop-sample-open>span{font-size:10px}
.i03.ref-c .countertop-catalog-item figcaption{padding-top:9px}
.i03.ref-c .countertop-catalog-item figcaption strong{font-size:12px;line-height:1.35}
.i03.ref-c .countertop-catalog-item figcaption small{font-size:10px;line-height:1.45}
.i03.ref-c .countertop-no-results{padding:22px 0;border-top:1px solid var(--line);color:var(--muted);font-size:12px}
.i03.ref-c .countertop-partner-code-index{margin-top:28px;padding-top:18px;border-top:1px solid var(--line)}
.i03.ref-c .countertop-partner-code-index>p{max-width:66ch;margin:8px 0 14px;color:var(--muted);font-size:11px;line-height:1.65}
.i03.ref-c .countertop-partner-code-index>div{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.i03.ref-c .countertop-partner-code-index figure{min-width:0;margin:0;border-top:1px solid var(--line);padding-top:8px}
.i03.ref-c .countertop-partner-code-index .countertop-sample-open img,.i03.ref-c .countertop-code-placeholder{display:grid;place-items:center;width:100%;height:112px;aspect-ratio:auto;object-fit:contain;background:color-mix(in srgb,var(--surface) 75%,transparent)}
.i03.ref-c .countertop-code-placeholder{border:1px solid var(--line);color:var(--muted);font-family:var(--display);font-size:22px}
.i03.ref-c .countertop-partner-code-index figcaption{display:grid;gap:3px;padding-top:7px}
.i03.ref-c .countertop-partner-code-index figcaption strong{font-size:11px}
.i03.ref-c .countertop-partner-code-index figcaption small{font-size:9px;line-height:1.4;color:var(--muted)}
.i03.ref-c .countertop-granite-panel{margin-top:18px;padding:24px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.i03.ref-c .countertop-granite-panel h3{margin:12px 0;font-family:var(--display);font-size:clamp(22px,3vw,34px);font-weight:500}
.i03.ref-c .countertop-granite-panel p{max-width:68ch;color:var(--muted);font-size:12px;line-height:1.7}
.i03.ref-c .countertop-profile-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:16px 12px}
.i03.ref-c .countertop-profile-grid figure{padding-top:10px}
.i03.ref-c .countertop-edge-open img{height:112px;object-fit:contain;background:color-mix(in srgb,var(--surface) 70%,transparent);mix-blend-mode:multiply}
.i03.ref-c .countertop-profile-grid figcaption{display:grid;grid-template-columns:26px 1fr;align-items:baseline;gap:4px 8px;padding-top:8px}
.i03.ref-c .countertop-profile-grid figcaption>small{grid-row:span 2;color:var(--accent);font-size:10px}
.i03.ref-c .countertop-profile-grid figcaption>strong{font-size:11px;line-height:1.35}
.i03.ref-c .countertop-profile-grid figcaption>em{font-size:9px;font-style:normal;color:var(--muted)}
.i03.ref-c .countertop-edge-note{max-width:65ch;margin:16px 0 0;color:var(--muted);font-size:11px;line-height:1.7}
.i03.ref-c .countertop-catalog-item[hidden],.i03.ref-c [data-surface-panel][hidden]{display:none!important}
.detail-drawer.countertop-image-detail figure img{width:auto;max-width:100%;max-height:72dvh}
.detail-drawer.countertop-image-detail figure img.countertop-edge-detail-image{width:min(100%,760px);height:auto;max-height:68dvh;object-fit:contain}
.i03.ref-c .quickbook-reader-overview{display:grid;grid-template-columns:minmax(220px,.7fr) minmax(0,1.3fr);gap:10px 28px;padding:16px 0;border-block:1px solid var(--line)}
.i03.ref-c .quickbook-reader-overview>p{margin:0;color:var(--muted);font-size:11px;line-height:1.65}
.i03.ref-c .quickbook-reader-overview>p:first-child{grid-column:1/-1;color:var(--ink)}
.i03.ref-c .quickbook-reader-overview>p strong{font-weight:700}
.i03.ref-c .quickbook-reader-overview ul{display:flex;flex-wrap:wrap;gap:6px 16px;margin:0;padding:0;list-style:none}
.i03.ref-c .quickbook-reader-overview li{font-size:10px;line-height:1.5;color:var(--muted)}
.i03.ref-c .consultation-copy>h4{margin:24px 0 9px;font-family:var(--display);font-size:20px;font-weight:500}
.i03.ref-c .consultation-copy .intake-list{display:grid;gap:8px;margin:0 0 16px;padding-left:18px}
.i03.ref-c .consultation-copy .intake-list li{font-size:12px;line-height:1.65;color:var(--muted)}
.i03.ref-c .consultation-copy>p{max-width:65ch;line-height:1.7}
@media(max-width:900px){.i03.ref-c .countertop-sample-grid{grid-template-columns:repeat(auto-fill,minmax(155px,1fr))}.i03.ref-c .countertop-profile-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:900px){.i03.ref-c .countertop-catalog-tools{grid-template-columns:1fr 1fr}.i03.ref-c .countertop-catalog-tools>p{grid-column:1/-1;margin:0}.i03.ref-c .countertop-sample-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 9px}.i03.ref-c .countertop-partner-code-index>div{grid-template-columns:repeat(2,minmax(0,1fr))}.i03.ref-c .countertop-surface-tabs button{font-size:12px}.i03.ref-c .countertop-surface-tabs button+button{padding-left:14px}.i03.ref-c .countertop-edge-open img{height:88px}.i03.ref-c .countertop-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.i03.ref-c .quickbook-reader-overview{grid-template-columns:1fr;gap:10px}.i03.ref-c .quickbook-reader-overview>p:first-child{grid-column:1}.i03.ref-c .quickbook-reader-overview ul{gap:6px 12px}}
`;
