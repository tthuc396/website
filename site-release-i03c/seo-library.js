import {seoPages} from './seo-pages.js';

const categoryOrder = [
  'Start here',
  'Cabinet supply',
  'Countertops',
  'Furniture packages',
  'Process, quality & delivery',
  'Buyer planning',
  'Florida & commercial supply',
  'Project review',
  'Company information'
];
const articleLayouts = [
  {id:'1', name:'Open Dossier', influence:'Current I-03-C language', thesis:'Wide reading panel with a clear topic header and section rail.'},
  {id:'2', name:'Library Folio', influence:'Material library browsing', thesis:'Image-led expandable panels with a warm, tactile reading surface.'},
  {id:'3', name:'Specimen Ledger', influence:'Technical process clarity', thesis:'Compact topic headers open into full-width specification rows.'},
  {id:'4', name:'Editorial Spread', influence:'Printed catalogue pacing', thesis:'Large photography and spacious section breaks guide a slower read.'},
  {id:'5', name:'Review Path', influence:'Guided buyer journey', thesis:'A clear reading sequence connects article sections to project review.'}
];
const editorialVariants = [
  {id:'1', name:'Feature Plate', thesis:'Open on one large image, then move into broad section rows.'},
  {id:'2', name:'Offset Spread', thesis:'Pair the image and caption in an asymmetric opening.'},
  {id:'3', name:'Type-led Folio', thesis:'Give section headings more scale and let the full-width copy breathe.'},
  {id:'4', name:'Field Notes', thesis:'Use quiet bands and fine rules to organize long article content.'},
  {id:'5', name:'Chapter Sequence', thesis:'Place section titles, images, and notes in a continuous reading path.'}
];
let activeArticleLayout = '4';
let activeEditorialVariant = '5';
const guideHref = (id, layout=activeArticleLayout, variant=activeEditorialVariant) => `?concept=I-03-C&view=guide&page=${encodeURIComponent(id)}&article-layout=${layout}${layout === '4' ? `&editorial-variant=${variant}` : ''}`;
const guideIndexHref = () => '?concept=I-03-C&view=guides';
const catalogTargets = {
  'Start here': ['home', 'Overview'],
  'Cabinet supply': ['profiles', 'Door profiles'],
  'Countertops': ['countertops', 'Countertops & backsplashes'],
  'Furniture packages': ['rooms', 'Complete room'],
  'Process, quality & delivery': ['technical', 'Cabinet specifications'],
  'Buyer planning': ['consultation', 'Project review'],
  'Florida & commercial supply': ['consultation', 'Project review'],
  'Project review': ['consultation', 'Project review'],
  'Company information': ['consultation', 'Contact Asina Global']
};

function guideRow(page, esc, layout='4') {
  const guideArticles = (page.articles || []).filter(article => article.id !== 'about');
  const articleTerms = guideArticles.flatMap(article => [article.visibleTitle, article.description, ...article.keywords]);
  const searchable = [page.title, page.description, page.label, page.category, ...page.keywords, ...articleTerms].join(' ').toLowerCase();
  return `<li class="seo-guide-row" data-guide-item data-guide-category="${esc(page.category)}" data-search="${esc(searchable)}">
    ${page.image ? `<a class="seo-guide-row-image" href="${guideHref(page.id, layout)}" tabindex="-1" aria-hidden="true"><img src="${esc(page.image)}" alt="" loading="lazy"></a>` : '<span class="seo-guide-row-image" aria-hidden="true"></span>'}
    <a class="seo-guide-row-main" href="${guideHref(page.id, layout)}"><strong>${esc(page.visibleTitle)}</strong><span>${esc(page.description)}</span></a>
    <small>${esc(page.category)}</small><a class="seo-guide-open" href="${guideHref(page.id, layout)}" aria-label="Open ${esc(page.visibleTitle)}">Read guide ↗</a>
  </li>`;
}

function renderArticleLayoutPicker(layout, esc, page, editorialVariant='1') {
  if (layout === '4') {
    const links = editorialVariants.map(item => {
      const href = `?concept=I-03-C&view=guide&page=${encodeURIComponent(page.id)}&article-layout=4&editorial-variant=${item.id}${page.openArticleId ? `&topic=${encodeURIComponent(page.openArticleId)}` : ''}`;
      return `<a href="${href}"${editorialVariant === item.id ? ' aria-current="page"' : ''}><span>A-04.${item.id} · ${esc(item.name)}</span><small>${esc(item.thesis)}</small></a>`;
    }).join('');
    return `<nav class="article-layout-picker editorial-variant-picker" aria-label="Five Editorial Spread refinements"><div><p class="eyebrow">A-04 / EDITORIAL SPREAD · VARIATION ${editorialVariant} OF 05</p><strong>Choose the article reading treatment</strong><a href="?concept=I-03-C&view=guide&page=${encodeURIComponent(page.id)}&article-layout=1${page.openArticleId ? `&topic=${encodeURIComponent(page.openArticleId)}` : ''}">Other article directions ↗</a></div>${links}</nav>`;
  }
  const links = articleLayouts.map(item => {
    const href = `?concept=I-03-C&view=guide&page=${encodeURIComponent(page.id)}&article-layout=${item.id}${page.openArticleId ? `&topic=${encodeURIComponent(page.openArticleId)}` : ''}`;
    return `<a href="${href}"${layout === item.id ? ' aria-current="page"' : ''}><span>A-${item.id.padStart(2,'0')} · ${esc(item.name)}</span><small class="guide-layout-influence">${esc(item.influence)}</small><small>${esc(item.thesis)}</small></a>`;
  }).join('');
  return `<nav class="article-layout-picker" aria-label="Five expandable article designs"><div><p class="eyebrow">ARTICLE PANEL STUDY / ${layout.padStart(2, '0')} OF 05</p><strong>Choose how article content opens</strong></div>${links}</nav>`;
}

export function renderGuideIndex(esc) {
  const groups = categoryOrder.map(category => {
    const pages = seoPages.filter(page => page.category === category);
    if (!pages.length) return '';
    return `<section class="seo-guide-group" id="guide-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
      <header><h2>${esc(category)}</h2><span>${pages.length} ${pages.length === 1 ? 'page' : 'pages'}</span></header>
      <ul>${pages.map(page => guideRow(page, esc)).join('')}</ul>
    </section>`;
  }).join('');
  return `<section class="seo-guide-index">
    <header class="seo-guide-index-heading"><div><p class="eyebrow">ASINA GLOBAL / PROJECT GUIDES</p><h1>Project guides, connected to the product journey.</h1><p>Find concise answers about products, project review, and delivery. Learn about the company and founders on <a href="?concept=I-03-C&view=about">Who We Are ↗</a>.</p></div></header>
    <div class="seo-guide-tools"><label for="seo-guide-search">Find a guide or topic</label><input id="seo-guide-search" type="search" placeholder="Try “Malibu”, “multifamily”, “quartz codes”, or “shipping”"><p id="seo-guide-count" aria-live="polite">Showing ${seoPages.length} guides</p></div>
    <nav class="seo-guide-category-nav" aria-label="Project guide categories">${categoryOrder.map(category => { const count = seoPages.filter(page => page.category === category).length; return count ? `<a href="#guide-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" data-guide-category-link="${esc(category)}">${esc(category)} <span>${count}</span></a>` : ''; }).join('')}</nav>
    <div class="seo-guide-groups">${groups}</div>
    <p class="seo-guide-note">Use these guides to prepare for a project discussion. Product fit, pricing, dimensions, lead time, and shipping responsibility remain project-specific.</p>
    <a class="seo-guide-project-link" href="?concept=I-03-C&view=consultation"><span><strong>Bring a project question into review.</strong><small>Share the scope, room type, destination, and any relevant guide or product references.</small></span><b>Start a project review ↗</b></a>
  </section>`;
}

export function renderWhoWeAre(esc, image) {
  const page = seoPages.find(item => item.id === 'home');
  const about = page?.articles?.find(item => item.id === 'about');
  const team = about?.sections?.find(section => section.title.toLowerCase().includes('founder'));
  if (!about || !team) return '<section class="seo-guide-page"><h1>Who We Are</h1><p>Company information is being prepared.</p></section>';
  const people = team.visuals || [];
  const processVisuals = [
    ['assets/cnc-machine-affa0ed.jpg', 'CNC production at Asina Global’s manufacturing partner', 'CNC machining'],
    ['assets/edge-banding-line-973b760.jpg', 'Edge-banding production line at Asina Global’s manufacturing partner', 'Edge banding'],
    ['assets/quality-inspection-b23947e.jpg', 'Quality inspection at Asina Global’s manufacturing partner', 'Quality inspection'],
    ['assets/packing-floor-1fc9749.jpg', 'Packing and shipment preparation at Asina Global’s manufacturing partner', 'Packing and shipment preparation']
  ];
  const founderNames = ['Chuck Tran', 'Hai Ho', 'Kim Nguyen', 'Andy Pham'];
  const intro = team.blocks.find(block => block.type === 'paragraph' && /Chuck, Hai, Kim, and Andy/.test(block.text));
  const bios = founderNames.map(name => {
    const headingIndex = team.blocks.findIndex(block => block.type === 'heading' && block.text === name);
    return team.blocks.slice(headingIndex + 1).find(block => block.type === 'paragraph')?.text || '';
  });
  return `<article class="seo-guide-page who-we-are-page" data-article-layout="4" data-editorial-variant="5">
    <nav class="seo-guide-breadcrumbs" aria-label="Breadcrumb"><a href="?concept=I-03-C&view=home">Overview</a><span> / </span><span>Who We Are</span></nav>
    <header class="seo-guide-hero"><div><p class="eyebrow">ASINA GLOBAL / COMPANY</p><h1>Who We Are</h1><p class="seo-guide-deck">${esc(about.description)}</p></div></header>
    <section class="seo-guide-section who-we-are-intro"><header class="seo-guide-section-head"><h2>${esc(team.title)}</h2></header><div class="seo-guide-section-body"><p>${esc(intro?.text || 'Four founders, one accountable project review path.')}</p></div></section>
    <section class="who-we-are-founders" aria-label="Asina Global founders">${people.map((person, index) => `<article><figure>${image(person.image, person.alt, 'seo-guide-inline-image')}<figcaption>${esc(person.caption || person.alt)}</figcaption></figure><div><h2>${esc(founderNames[index] || person.caption || person.alt)}</h2><p>${esc(bios[index] || '')}</p></div></article>`).join('')}</section>
    <section class="who-we-are-partner"><header><p class="eyebrow">MANUFACTURING PARTNER / VIETNAM</p><h2>Production capability, with one accountable project path.</h2><p>Asina Global works with an established manufacturing partner in Vietnam. The partner operates the facility; Asina Global remains the supplier of record and coordinates project review, approvals, communication, QA, packing, and logistics planning.</p></header><div class="who-we-are-capabilities"><article><h3>From panel to assembled cabinet</h3><p>Panel cutting, edge banding, CNC work, painting and finishing, door production, and assembly.</p></article><article><h3>Reviewed for the approved specification</h3><p>Technical development, sample or mockup review, production QA, packing checks, warehousing, and export logistics support.</p></article></div><div class="who-we-are-process-grid" aria-label="Manufacturing partner process photographs">${processVisuals.map(([src,alt,caption])=>`<figure>${image(src,alt,'who-we-are-process-image')}<figcaption><span>Asina Global’s manufacturing partner</span><strong>${esc(caption)}</strong></figcaption></figure>`).join('')}</div><p class="who-we-are-note">Exact materials, construction, packing, and shipping responsibility are confirmed for each approved project.</p></section>
  </article>`;
}

function renderBlock(block, esc) {
  if (block.type === 'heading') return `<h3>${esc(block.text)}</h3>`;
  if (block.type === 'paragraph' || block.type === 'note') return `<p class="${block.type === 'note' ? 'seo-guide-note-block' : ''}">${esc(block.text)}</p>`;
  if (block.type === 'list') {
    const density = block.items.length >= 12 ? ' seo-guide-list-3' : block.items.length >= 6 ? ' seo-guide-list-2' : '';
    return `<ul class="seo-guide-list${density}">${block.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  }
  if (block.type === 'table') {
    return `<div class="seo-guide-table-wrap"><table><tbody>${block.rows.map(row => `<tr>${row.cells.map((cell, index) => row.header ? `<th scope="col">${esc(cell)}</th>` : index === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if (block.type === 'reference-grid') {
    return `<div class="seo-guide-reference-grid" role="list" aria-label="Slab code references">${block.items.map(item => `<article role="listitem"><small>${esc(item.family)}${item.code ? ` / ${esc(item.code)}` : ''}</small><strong>${esc(item.title)}</strong>${item.code ? `<span>Use code ${esc(item.code)} in project review</span>` : ''}</article>`).join('')}</div>`;
  }
  return '';
}

function renderGuideSections(sections, esc, image, pageId, articleId) {
  const seenCopy = new Set();
  return sections.filter(section => {
    const title = section.title.trim().toLowerCase();
    if (title === 'keep the product choice connected to the project path.' || title === 'turn importer questions into the right project review.' || title === 'use the right preparation page if you need more context.' || title === 'collection facts stay visible before a finish becomes a pricing request.') return false;
    if (title === 'is your project a fit before drawings move?' && !(pageId === 'project-review' && articleId === 'review')) return false;
    return true;
  }).map((section, index) => {
    const displayTitle = section.title.toLowerCase().startsWith('authoritative sources used for import') ? 'Reference sources' : section.title;
    const heading = displayTitle && displayTitle !== 'Overview' ? `<h3>${esc(displayTitle)}</h3>` : '';
    const sectionVisuals = (section.visuals || []).filter(visual => !(visual.alt === 'Kim Nguyen' && ['multi-unit-supply','commercial-supply'].includes(pageId)));
    const visuals = sectionVisuals.length ? `<div class="seo-guide-visuals${sectionVisuals.length > 1 ? ' has-multiple' : ''}">${sectionVisuals.map(visual => `<figure>${image(visual.image, visual.alt, 'seo-guide-inline-image')}<figcaption>${esc(visual.caption || visual.alt)}</figcaption></figure>`).join('')}</div>` : '';
    const blocks = section.blocks.filter(block => {
      if (block.type === 'heading' && block.text.trim() === section.title?.trim()) return false;
      if (block.type === 'paragraph' || block.type === 'note' || block.type === 'heading') {
        const key = block.text.trim().toLowerCase().replace(/\s+/g, ' ');
        if (!key || seenCopy.has(key)) return false;
        seenCopy.add(key);
      }
      return true;
    });
    return `<section class="seo-guide-section"><header class="seo-guide-section-head">${heading}${section.lead ? `<p class="seo-guide-lead">${esc(section.lead)}</p>` : ''}</header><div class="seo-guide-section-body">${visuals}${blocks.map(block => renderBlock(block, esc)).join('')}</div></section>`;
  }).join('');
}

function renderRfqArticleBody(article, esc, image) {
  const categories = [
    {title:'Cabinet RFQ', items:['Room or unit count','Cabinet runs or layout','Finish direction','Project location','Target timing'], href:'profiles', link:'Explore door profiles'},
    {title:'Countertop RFQ', items:['Slab name or code','Approximate square footage','Edge profile','Sink or cooktop cutouts','Destination and target timing'], href:'countertops', link:'Explore countertop references'},
    {title:'Furniture package RFQ', items:['Store or site count','Estimated quantity','Brand requirements','Floor plan','Finish direction and target timing'], href:'rooms', link:'Explore room references'}
  ];
  const faq = [
    ['Should I upload drawings here?', 'No. Start with project basics. If the project is a fit, Asina requests drawings and specifications by email after the first review.'],
    ['What information helps with pricing review?', 'Quantity, finish direction, material, product category, custom sizing, packing needs, destination, target timing, and approved details. Pricing is quote-based.'],
    ['Can one RFQ cover more than one category?', 'Yes. Cabinets, countertops, and furniture packages can be reviewed together when a coordinated project review is useful.'],
    ['Do I need a template?', 'No. Use the checklist here to prepare your first request.']
  ];
  const planningVisual = article.sections.flatMap(section => section.visuals || []).find(visual => visual.image.includes('project-review-02'));
  return `<div class="rfq-article-body">
    <section class="seo-guide-section rfq-basics"><h3>Start with four project basics</h3><p>These details let the team route the request before it asks for drawings or detailed specifications.</p><dl><div><dt>Category</dt><dd>Cabinets, countertops, furniture packages, or a combination.</dd></div><div><dt>Location</dt><dd>Project city or destination.</dd></div><div><dt>Scale</dt><dd>Unit, room, store, or approximate quantity.</dd></div><div><dt>Target timing</dt><dd>When the project needs quote review and planned supply.</dd></div></dl><p class="seo-guide-note-block">Keep the first request brief. Drawings, specifications, brand standards, and furniture files are requested by email after the initial fit review.</p></section>
    <section class="seo-guide-section"><h3>Add details for the category</h3><p>Include what you already know. Mark unconfirmed options for project review.</p><div class="rfq-category-list">${categories.map(category=>`<article><header><h4>${esc(category.title)}</h4><a href="?concept=I-03-C&view=${category.href}">${esc(category.link)} ↗</a></header><ul>${category.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div></section>
    <section class="seo-guide-section"><h3>Drawings come after the first review</h3><div class="rfq-review-sequence"><div><span>First</span><strong>You share project basics</strong><p>Category, location, scale, target timing, and any known finish or material direction.</p></div><div><span>Next</span><strong>Asina reviews project fit</strong><p>The initial review checks whether the project suits the supply model.</p></div><div><span>If it fits</span><strong>Send drawings by email</strong><p>The source RFQ guide states that Asina follows up within 1–2 business days to request drawings, specifications, or other project files.</p></div></div>${planningVisual ? `<figure class="rfq-planning-visual">${image(planningVisual.image, planningVisual.alt, 'seo-guide-inline-image')}<figcaption>${esc(planningVisual.caption)}</figcaption></figure>` : ''}<p class="seo-guide-note-block">Do not upload project files here. Drawings and specifications are requested privately by email after the initial review.</p></section>
    <section class="seo-guide-section"><h3>What shapes quote review</h3><p>Pricing is quote-based. The project review considers the scope together, including:</p><ul class="seo-guide-list seo-guide-list-2">${['Product category and quantity','Material and finish direction','Custom sizing or details','Packing requirements','Destination','Target timing','Approved drawings and specifications'].map(item=>`<li>${esc(item)}</li>`).join('')}</ul><p>Exact pricing and project requirements are confirmed against the approved specifications.</p></section>
    <section class="seo-guide-section rfq-faq"><h3>Common RFQ questions</h3>${faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>
  </div>`;
}

function renderGuideArticle(article, page, esc, image) {
  const sourceHero = article.image && article.image !== page.image
    ? `<figure class="seo-guide-article-hero">${image(article.image, article.imageAlt, 'seo-guide-hero-image')}<figcaption>${esc(article.imageCaption || article.imageAlt)}</figcaption></figure>`
    : '';
  const summaryImage = article.image && article.image !== page.image
    ? `<figure class="seo-guide-article-thumb">${image(article.image, article.imageAlt, 'seo-guide-article-thumb-image')}</figure>`
    : '';
  const body = article.id === 'rfq' ? `<div class="seo-guide-rfq">${renderRfqArticleBody(article, esc, image)}</div>` : renderGuideSections(article.sections, esc, image, page.id, article.id);
  const articleId = `guide-topic-${article.id}`;
  const content = `${sourceHero}${body}`;
  if (page.articles.length === 1) return `<section class="seo-guide-single-topic" id="${articleId}"><h2>${esc(article.visibleTitle)}</h2><p class="seo-guide-lead">${esc(article.description)}</p>${content}</section>`;
  return `<details class="seo-guide-article" id="${articleId}" ${page.openArticleId === article.id ? 'open' : ''}><summary><span class="seo-guide-article-summary-copy"><small>${esc(article.label)}</small><strong>${esc(article.visibleTitle)}</strong><span class="seo-guide-article-description">${esc(article.description)}</span></span>${summaryImage}<b class="seo-guide-article-toggle" aria-hidden="true"></b></summary><div class="seo-guide-article-content">${content}</div></details>`;
}

export function renderGuidePage(page, esc, image, layout='4', editorialVariant='5') {
  activeArticleLayout = articleLayouts.some(item => item.id === String(layout)) ? String(layout) : '4';
  layout = activeArticleLayout;
  editorialVariant = editorialVariants.some(item => item.id === String(editorialVariant)) ? String(editorialVariant) : '5';
  activeEditorialVariant = editorialVariant;
  if (!page) return renderGuideIndex(esc);
  const displayPage = page.id === 'home' ? {...page, articles:(page.articles || []).filter(article => article.id !== 'about')} : page;
  const articles = displayPage.articles.map(article => renderGuideArticle(article, displayPage, esc, image)).join('');
  const sectionLinks = displayPage.articles.map(article => `<a href="#guide-topic-${article.id}">${esc(article.label)} · ${esc(article.visibleTitle)}</a>`).join('');
  const preferred = page.target || catalogTargets[page.category] || catalogTargets['Buyer planning'];
  const related = [];
  const seen = new Set([page.id]);
  for (const link of page.related || []) {
    const target = seoPages.find(candidate => candidate.id === link.id);
    if (target && !seen.has(target.id)) { seen.add(target.id); related.push({id:target.id,label:link.label || target.label}); }
    if (related.length >= 6) break;
  }
  for (const candidate of seoPages.filter(x => x.category === page.category && x.id !== page.id)) {
    if (related.length >= 6) break;
    if (!seen.has(candidate.id)) { seen.add(candidate.id); related.push({id:candidate.id,label:candidate.label}); }
  }
  const topicImage = page.image ? image(page.image, page.imageAlt, 'seo-guide-hero-image') : '';
  return `<article class="seo-guide-page" data-guide-id="${esc(page.id)}" data-article-layout="${layout}" data-editorial-variant="${layout === '4' ? editorialVariant : '1'}">
    <nav class="seo-guide-breadcrumbs" aria-label="Breadcrumb"><a href="${guideIndexHref()}">Project guides</a><span> / </span><a href="?concept=I-03-C&view=home">Product journey</a><span> / </span><span>${esc(page.label)}</span></nav>
    <header class="seo-guide-hero"><div><p class="eyebrow">${esc(page.category)} ${page.serviceType ? `/ ${esc(page.serviceType)}` : ''}</p><h1>${esc(page.visibleTitle)}</h1><p class="seo-guide-deck">${esc(page.lead || page.description)}</p><a class="text-link" href="?concept=I-03-C&view=${preferred[0]}">${esc(preferred[1])} ↗</a></div>${topicImage ? `<figure>${topicImage}<figcaption>${esc(page.imageCaption || page.imageAlt)}</figcaption></figure>` : ''}</header>
    <div class="seo-guide-reading-layout">${sectionLinks ? `<aside class="seo-guide-toc"><p class="eyebrow">IN THIS GUIDE</p><nav aria-label="Guide topics">${sectionLinks}</nav><a class="text-link" href="?concept=I-03-C&view=consultation">Start a project review ↗</a></aside>` : ''}<div class="seo-guide-story"><div class="seo-guide-articles">${articles}</div></div></div>
    <section class="seo-guide-related"><div><p class="eyebrow">CONNECTED READING</p><h2>Related project guides</h2></div><nav aria-label="Related guides">${related.map(link => { const target = seoPages.find(candidate => candidate.id === link.id); return `<a href="${guideHref(link.id, layout)}"><span>${esc(target?.category || page.category)}</span><strong>${esc(target?.visibleTitle || link.label)}</strong><small>Open guide ↗</small></a>`; }).join('')}</nav></section>
    <nav class="seo-guide-next-stage" aria-label="Continue to project review"><span class="eyebrow">PUT THIS GUIDE TO WORK</span><a href="?concept=I-03-C&view=consultation"><span><strong>Share the project details with Asina Global.</strong><small>Include this guide, your drawings or cabinet references, destination, quantity, and any questions for review.</small></span><b>Start a project review ↗</b></a></nav>
  </article>`;
}

function renderRfqGuide(page, esc, image) {
  const toc = [
    ['rfq-basics', 'Start with project basics'],
    ['rfq-category-inputs', 'Add category details'],
    ['rfq-file-review', 'Send files after review'],
    ['rfq-price-review', 'What shapes quote review'],
    ['rfq-faq', 'Common questions']
  ];
  const categories = [
    {title:'Cabinet RFQ', label:'Cabinet supply', items:['Room or unit count','Cabinet runs or layout','Finish direction','Project location','Target timing'], href:'?concept=I-03-C&view=profiles', link:'Explore door profiles'},
    {title:'Countertop RFQ', label:'Countertop supply', items:['Slab name or code','Approximate square footage','Edge profile','Sink or cooktop cutouts','Destination and target timing'], href:'?concept=I-03-C&view=countertops', link:'Explore countertop references'},
    {title:'Furniture package RFQ', label:'Furniture packages', items:['Store or site count','Estimated quantity','Brand requirements','Floor plan','Finish direction and target timing'], href:'?concept=I-03-C&view=rooms', link:'Explore room references'}
  ];
  const faq = [
    ['Should I upload drawings here?', 'No. Start with project basics. If the project is a fit, Asina requests drawings and specifications by email after the first review.'],
    ['What information helps with pricing review?', 'Quantity, finish direction, material, product category, custom sizing, packing needs, destination, target timing, and approved details. Pricing is quote-based.'],
    ['Can one RFQ cover more than one category?', 'Yes. Cabinets, countertops, and furniture packages can be reviewed together when a coordinated project review is useful.'],
    ['Do I need a template?', 'No. Use the checklist on this page to prepare your first request.']
  ];
  const relatedIds = ['cabinets','countertops','restaurant-furniture','process','importer-resources'];
  const planningVisual = page.sections.flatMap(section => section.visuals || []).find(visual => visual.image.includes('project-review-02'));
  const related = relatedIds.map(id => page.related?.find(link => link.id === id)).filter(Boolean).map(link => {
    const target = seoPages.find(candidate => candidate.id === link.id);
    return `<a href="${guideHref(link.id)}"><span>${esc(target?.category || page.category)}</span><strong>${esc(target?.visibleTitle || link.label)}</strong><small>Open guide ↗</small></a>`;
  }).join('');
  const leadImage = page.image ? `<figure>${image(page.image, page.imageAlt, 'seo-guide-hero-image')}<figcaption>${esc(page.imageCaption || page.imageAlt)}</figcaption></figure>` : '';
  return `<article class="seo-guide-page seo-guide-rfq" data-guide-id="rfq">
    <nav class="seo-guide-breadcrumbs" aria-label="Breadcrumb"><a href="?concept=I-03-C&view=guides">Project guides</a><span> / </span><a href="?concept=I-03-C&view=home">Product journey</a><span> / </span><span>RFQ Resources</span></nav>
    <header class="seo-guide-hero"><div><p class="eyebrow">BUYER PLANNING / PROJECT SUPPLY RFQ</p><h1>What to include in a cabinet, countertop, or furniture RFQ</h1><p class="seo-guide-deck">Start with four basics: what you need, where the project is, its approximate scale, and target timing. Asina reviews those details first. If the project is a fit, drawings and specifications are requested by email.</p><a class="text-link" href="?concept=I-03-C&view=consultation">Start a project review ↗</a></div>${leadImage}</header>
    <div class="seo-guide-reading-layout"><aside class="seo-guide-toc"><p class="eyebrow">IN THIS GUIDE</p><nav aria-label="On this page">${toc.map(([id,label])=>`<a href="#${id}">${esc(label)}</a>`).join('')}</nav><a class="text-link" href="?concept=I-03-C&view=consultation">Project review ↗</a></aside><div class="seo-guide-story">
      <section class="seo-guide-section rfq-basics" id="rfq-basics"><h2>Start with four project basics</h2><p>These details let the team route the request before it asks for drawings or detailed specifications.</p><dl><div><dt>Category</dt><dd>Cabinets, countertops, furniture packages, or a combination.</dd></div><div><dt>Location</dt><dd>Project city or destination.</dd></div><div><dt>Scale</dt><dd>Unit, room, store, or approximate quantity.</dd></div><div><dt>Target timing</dt><dd>When the project needs the quote review and planned supply.</dd></div></dl><p class="seo-guide-note-block">Keep the first request brief. Drawings, specifications, brand standards, and furniture files are requested by email after the initial fit review.</p></section>
      <section class="seo-guide-section" id="rfq-category-inputs"><h2>Add details for the category</h2><p>Include the details you already know. Unconfirmed options can be marked for project review.</p><div class="rfq-category-list">${categories.map(category=>`<article><header><div><p class="eyebrow">${esc(category.label)}</p><h3>${esc(category.title)}</h3></div><a href="${category.href}">${esc(category.link)} ↗</a></header><ul>${category.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div></section>
      <section class="seo-guide-section" id="rfq-file-review"><h2>Drawings come after the first review</h2><div class="rfq-review-sequence"><div><span>First</span><strong>You share project basics</strong><p>Category, location, scale, target timing, and any known finish or material direction.</p></div><div><span>Next</span><strong>Asina reviews project fit</strong><p>The initial review checks whether the project suits the supply model.</p></div><div><span>If it fits</span><strong>Send drawings by email</strong><p>The source RFQ guide states that Asina follows up within 1–2 business days to request drawings, specifications, or other project files.</p></div></div>${planningVisual ? `<figure class="rfq-planning-visual">${image(planningVisual.image, planningVisual.alt, 'seo-guide-inline-image')}<figcaption>${esc(planningVisual.caption)}</figcaption></figure>` : ''}<p class="seo-guide-note-block">Do not upload project files to this page. Drawings and specifications are requested privately by email after the initial review.</p></section>
      <section class="seo-guide-section" id="rfq-price-review"><h2>What shapes quote review</h2><p>Pricing is quote-based. The project review considers the scope together, including:</p><ul class="seo-guide-list seo-guide-list-2">${['Product category and quantity','Material and finish direction','Custom sizing or details','Packing requirements','Destination','Target timing','Approved drawings and specifications'].map(item=>`<li>${esc(item)}</li>`).join('')}</ul><p>Exact pricing and project requirements are confirmed against the approved specifications.</p></section>
      <section class="seo-guide-section rfq-faq" id="rfq-faq"><h2>Common RFQ questions</h2>${faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>
      <section class="seo-guide-related rfq-related"><div><p class="eyebrow">GO DEEPER BY CATEGORY</p><h2>Related project guides</h2></div><nav aria-label="Related guides">${related}</nav></section>
      <nav class="seo-guide-next-stage" aria-label="Start a project review"><span class="eyebrow">READY TO BEGIN</span><a href="?concept=I-03-C&view=consultation"><span><strong>Share the project basics.</strong><small>Include category, location, approximate scale, target timing, and any known finish or material direction.</small></span><b>Start a project review ↗</b></a></nav>
    </div></div>
  </article>`;
}

export function attachGuideSearch() {
  const input = document.querySelector('#seo-guide-search');
  if (!input) return;
  const rows = [...document.querySelectorAll('[data-guide-item]')];
  const groups = [...document.querySelectorAll('.seo-guide-group')];
  const status = document.querySelector('#seo-guide-count');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    for (const row of rows) {
      const match = !query || row.dataset.search.includes(query);
      row.hidden = !match;
      shown += Number(match);
    }
    for (const group of groups) group.hidden = !group.querySelector('[data-guide-item]:not([hidden])');
    status.textContent = query ? `Showing ${shown} of ${rows.length} guides` : `Showing ${rows.length} guides`;
  });
}

export const seoLibraryCSS = `
.i03.ref-c .seo-guide-index,.i03.ref-c .seo-guide-page{max-width:1540px;margin:0 auto;padding:clamp(34px,5vw,76px) clamp(20px,4vw,58px);color:var(--ink)}
.i03.ref-c .seo-guide-index-heading{display:block;border-bottom:1px solid var(--line);padding-bottom:36px}
.i03.ref-c .seo-guide-index-heading h1,.i03.ref-c .seo-guide-hero h1{max-width:22ch;margin:14px 0;font-size:clamp(38px,5vw,68px);line-height:.98;letter-spacing:-.035em}
.i03.ref-c .seo-guide-index-heading>div>p:last-child{max-width:70ch;color:var(--muted);line-height:1.75}
.i03.ref-c .seo-guide-tools{display:grid;grid-template-columns:180px minmax(240px,1fr) auto;align-items:center;gap:16px;margin:28px 0 14px}
.i03.ref-c .seo-guide-tools label,.i03.ref-c .seo-guide-tools p{font-size:14px;color:var(--muted)}
.i03.ref-c .seo-guide-tools input{min-height:48px;width:100%;border:1px solid var(--line);border-radius:0;background:var(--surface);padding:11px 14px;font:inherit;color:var(--ink)}
.i03.ref-c .seo-guide-category-nav{display:flex;gap:8px;overflow:auto;padding:14px 0 24px;border-bottom:1px solid var(--line);white-space:nowrap}
.i03.ref-c .seo-guide-category-nav a{border:1px solid var(--line);padding:9px 12px;font-size:13px;text-decoration:none}
.i03.ref-c .seo-guide-category-nav span{margin-left:6px;color:var(--accent)}
.i03.ref-c .seo-guide-group{padding:23px 0 10px;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-group>header{display:flex;align-items:baseline;justify-content:space-between;gap:20px;margin-bottom:14px}
.i03.ref-c .seo-guide-group h2{margin:0;font-size:22px}
.i03.ref-c .seo-guide-group>header>span{font-size:13px;color:var(--muted)}
.i03.ref-c .seo-guide-group ul{list-style:none;margin:0;padding:0}
.i03.ref-c .seo-guide-row{display:grid;grid-template-columns:minmax(0,1fr) 170px 92px;align-items:center;gap:18px;padding:14px 0;border-top:1px solid color-mix(in srgb,var(--line) 75%,transparent)}
.i03.ref-c .seo-guide-row-main{display:grid;gap:4px;text-decoration:none}
.i03.ref-c .seo-guide-row-main strong{font-size:16px;font-weight:600}
.i03.ref-c .seo-guide-row-main span{max-width:78ch;font-size:14px;line-height:1.6;color:var(--muted)}
.i03.ref-c .seo-guide-row>small{font-size:12px;color:var(--muted)}
.i03.ref-c .seo-guide-open{font-size:13px;text-decoration:none;text-align:right}
.i03.ref-c .seo-guide-row[hidden],.i03.ref-c .seo-guide-group[hidden]{display:none}
.i03.ref-c .seo-guide-note{max-width:90ch;margin:28px 0;color:var(--muted);font-size:14px;line-height:1.7}
.i03.ref-c .seo-guide-project-link,.i03.ref-c .seo-guide-next-stage>a{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 0;border-top:1px solid var(--ink);border-bottom:1px solid var(--line);text-decoration:none}
.i03.ref-c .seo-guide-project-link span,.i03.ref-c .seo-guide-next-stage>a span{display:grid;gap:5px}
.i03.ref-c .seo-guide-project-link strong,.i03.ref-c .seo-guide-next-stage strong{font-size:18px}
.i03.ref-c .seo-guide-project-link small,.i03.ref-c .seo-guide-next-stage small{color:var(--muted);font-size:14px;line-height:1.6}
.i03.ref-c .seo-guide-project-link>b,.i03.ref-c .seo-guide-next-stage b{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:10px 16px;background:var(--ink);color:var(--surface);font-size:13px;white-space:nowrap}
.i03.ref-c .seo-guide-breadcrumbs{display:flex;flex-wrap:wrap;gap:8px;color:var(--muted);font-size:12px}
.i03.ref-c .seo-guide-breadcrumbs a{text-decoration:none}
.i03.ref-c .seo-guide-hero{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr);gap:clamp(28px,5vw,72px);align-items:center;padding:38px 0 48px;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-hero h1{max-width:19ch}
.i03.ref-c .seo-guide-deck{max-width:68ch;font-size:14px;line-height:1.75;color:var(--muted)}
.i03.ref-c .seo-guide-hero figure{margin:0;background:var(--surface);padding:12px}
.i03.ref-c .seo-guide-hero-image{width:100%;height:clamp(220px,31vw,440px);object-fit:contain;object-position:center;background:var(--surface)}
.i03.ref-c .seo-guide-hero figure figcaption{margin-top:8px;color:var(--muted);font-size:12px;line-height:1.5}
.i03.ref-c .seo-guide-reading-layout{display:grid;grid-template-columns:minmax(175px,235px) minmax(0,1fr);gap:clamp(34px,7vw,110px);padding:48px 0}
.i03.ref-c .seo-guide-toc{position:sticky;top:132px;align-self:start;display:grid;gap:9px;max-height:calc(100vh - 155px);overflow:auto}
.i03.ref-c .seo-guide-toc>nav{display:grid;gap:0}
.i03.ref-c .seo-guide-toc>nav a{padding:9px 0;border-bottom:1px solid var(--line);font-size:14px;line-height:1.5;text-decoration:none;color:var(--muted)}
.i03.ref-c .seo-guide-story{min-width:0;max-width:none;width:100%}
.i03.ref-c .seo-guide-articles{border-top:1px solid var(--ink)}
.i03.ref-c .seo-guide-article{border-bottom:1px solid var(--line);scroll-margin-top:120px}
.i03.ref-c .seo-guide-article>summary{display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;gap:18px;padding:18px 0;cursor:pointer;list-style:none}
.i03.ref-c .seo-guide-article>summary:has(.seo-guide-article-thumb){grid-template-columns:minmax(0,1fr) minmax(100px,160px) 44px}
.i03.ref-c .seo-guide-article>summary::-webkit-details-marker{display:none}
.i03.ref-c .seo-guide-article>summary::marker{content:"";display:none}
.i03.ref-c .seo-guide-article>summary>span{display:grid;gap:5px}
.i03.ref-c .seo-guide-article>summary small{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--accent)}
.i03.ref-c .seo-guide-article>summary strong{font-size:clamp(20px,2vw,26px);line-height:1.25;font-weight:600}
.i03.ref-c .seo-guide-article-description{max-width:72ch;font-size:14px;line-height:1.6;color:var(--muted)}
.i03.ref-c .seo-guide-article-toggle{display:grid;place-items:center;width:44px;height:44px;border:1px solid var(--line);font-weight:400}
.i03.ref-c .seo-guide-article-toggle:before{content:'+';font-size:26px;line-height:1}
.i03.ref-c .seo-guide-article[open] .seo-guide-article-toggle:before{content:'−'}
.i03.ref-c .seo-guide-article>summary:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
.i03.ref-c .seo-guide-article-content{padding:0 0 28px}
.i03.ref-c .seo-guide-article-hero{margin:0 0 24px;background:var(--surface);padding:10px}
.i03.ref-c .seo-guide-article-hero .seo-guide-hero-image{height:clamp(180px,23vw,330px)}
.i03.ref-c .seo-guide-article-hero figcaption{margin-top:7px;color:var(--muted);font-size:12px}
.i03.ref-c .seo-guide-single-topic{padding-top:30px}
.i03.ref-c .seo-guide-single-topic h2{font-size:clamp(22px,2.6vw,34px)}
.i03.ref-c .seo-guide-section{padding:0 0 30px;margin:0 0 30px;border-bottom:1px solid var(--line);scroll-margin-top:120px}
.i03.ref-c .seo-guide-section h2{font-size:clamp(22px,2.6vw,34px);line-height:1.1;margin:0 0 16px;max-width:32ch}
.i03.ref-c .seo-guide-section h3{font-size:19px;line-height:1.35;margin:16px 0 7px}
.i03.ref-c .seo-guide-section p,.i03.ref-c .seo-guide-section li{font-size:16px;line-height:1.7;color:var(--ink-soft)}
.i03.ref-c .seo-guide-section p{margin:10px 0}
.i03.ref-c .seo-guide-section ul{padding-left:19px;margin:12px 0}
.i03.ref-c .seo-guide-section ul.seo-guide-list{padding-left:0;list-style:none;display:grid;grid-template-columns:1fr;gap:0}
.i03.ref-c .seo-guide-section ul.seo-guide-list-2{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:22px}
.i03.ref-c .seo-guide-section ul.seo-guide-list-3{grid-template-columns:repeat(3,minmax(0,1fr));column-gap:20px}
.i03.ref-c .seo-guide-section ul.seo-guide-list li{min-width:0;padding:10px 0;border-top:1px solid var(--line);font-size:15px;line-height:1.6}
.i03.ref-c .seo-guide-section .seo-guide-lead{font-size:15px;line-height:1.8;color:var(--ink)}
.i03.ref-c .seo-guide-visuals{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;margin:22px 0 26px}
.i03.ref-c .seo-guide-visuals.has-multiple{grid-template-columns:repeat(2,minmax(0,1fr))}
.i03.ref-c .seo-guide-visuals figure{margin:0;min-width:0;background:color-mix(in srgb,var(--surface) 75%,var(--accent) 7%);padding:12px}
.i03.ref-c .seo-guide-inline-image{display:block;width:100%;height:clamp(210px,28vw,390px);object-fit:contain;object-position:center;background:transparent}
.i03.ref-c .seo-guide-visuals.has-multiple .seo-guide-inline-image{height:clamp(170px,20vw,290px)}
.i03.ref-c .seo-guide-visuals figcaption{margin-top:9px;color:var(--muted);font-size:12px;line-height:1.5}
.i03.ref-c .seo-guide-section .seo-guide-note-block{padding:14px;background:color-mix(in srgb,var(--surface) 75%,var(--accent) 7%);font-size:14px}
 .i03.ref-c .seo-guide-visuals.has-multiple{grid-template-columns:1fr}
 .i03.ref-c .seo-guide-inline-image,.i03.ref-c .seo-guide-visuals.has-multiple .seo-guide-inline-image{height:250px}
.i03.ref-c .seo-guide-table-wrap{max-width:100%;overflow:auto;margin:18px 0}
.i03.ref-c .seo-guide-table-wrap table{width:100%;border-collapse:collapse;font-size:11px}
.i03.ref-c .seo-guide-table-wrap th,.i03.ref-c .seo-guide-table-wrap td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-table-wrap th{font-weight:600;background:color-mix(in srgb,var(--surface) 75%,transparent)}
.i03.ref-c .seo-guide-reference-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 14px;margin:18px 0 24px}
.i03.ref-c .seo-guide-reference-grid article{display:grid;align-content:start;gap:5px;min-width:0;padding:10px 0;border-top:1px solid var(--line)}
.i03.ref-c .seo-guide-reference-grid small{font-size:9px;line-height:1.4;color:var(--accent)}
.i03.ref-c .seo-guide-reference-grid strong{font-size:12px;line-height:1.35;font-weight:600}
.i03.ref-c .seo-guide-reference-grid span{font-size:9px;line-height:1.4;color:var(--muted)}
.i03.ref-c .seo-guide-related{border-top:1px solid var(--ink);padding:28px 0}
.i03.ref-c .seo-guide-related>div h2{font-size:25px;margin:8px 0 20px}
.i03.ref-c .seo-guide-related>nav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.i03.ref-c .seo-guide-related>nav a{display:grid;align-content:start;gap:8px;padding:14px 0;border-top:1px solid var(--line);text-decoration:none}
.i03.ref-c .seo-guide-related>nav span,.i03.ref-c .seo-guide-related>nav small{font-size:9px;color:var(--muted)}
.i03.ref-c .seo-guide-related>nav strong{font-size:13px;line-height:1.4}
.i03.ref-c .seo-guide-next-stage{padding:22px 0 4px}
.i03.ref-c .seo-guide-next-stage>.eyebrow{color:var(--accent);font-size:9px}
.i03.ref-c .seo-guide-rfq .rfq-basics dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:22px 0;border-top:1px solid var(--line)}
.i03.ref-c .seo-guide-rfq .rfq-basics dl>div{padding:15px 14px 15px 0;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-rfq .rfq-basics dt{font-size:12px;font-weight:600}
.i03.ref-c .seo-guide-rfq .rfq-basics dd{margin:5px 0 0;color:var(--muted);font-size:11px;line-height:1.6}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article{padding:17px 0;border-top:1px solid var(--line)}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article>header{display:flex;justify-content:space-between;align-items:center;gap:18px}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article h3{margin:0;font-size:19px}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article header a{font-size:10px;white-space:nowrap}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article ul{display:flex;flex-wrap:wrap;gap:0;margin:11px 0 0;padding:0;list-style:none}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article li{padding:6px 13px 6px 0;margin-right:13px;border-bottom:1px solid var(--line);font-size:11px;line-height:1.4}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin:20px 0}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence>div{padding:12px 0;border-top:1px solid var(--ink)}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence span{display:block;margin-bottom:11px;color:var(--accent);font-size:10px;text-transform:uppercase;letter-spacing:.08em}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence strong{font-size:14px}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence p{margin:7px 0 0;color:var(--muted);font-size:11px;line-height:1.6}
.i03.ref-c .seo-guide-rfq .rfq-planning-visual{display:grid;grid-template-columns:minmax(0,210px) minmax(0,1fr);align-items:center;gap:17px;margin:20px 0;padding:10px;background:color-mix(in srgb,var(--surface) 75%,var(--accent) 7%)}
.i03.ref-c .seo-guide-rfq .rfq-planning-visual .seo-guide-inline-image{height:145px}
.i03.ref-c .seo-guide-rfq .rfq-planning-visual figcaption{font-size:10px;line-height:1.55;color:var(--muted)}
.i03.ref-c .seo-guide-rfq .rfq-faq details{padding:13px 0;border-top:1px solid var(--line)}
.i03.ref-c .seo-guide-rfq .rfq-faq summary{cursor:pointer;font-size:13px;font-weight:600}
.i03.ref-c .seo-guide-rfq .rfq-faq details p{margin:10px 0 0;color:var(--muted)}
.i03.ref-c .seo-guide-rfq .rfq-related{padding-top:30px}

.i03.ref-c .seo-guide-page{max-width:none}
.i03.ref-c .seo-guide-index .eyebrow,.i03.ref-c .seo-guide-page .eyebrow{font-size:12px}
.i03.ref-c .seo-guide-page .seo-guide-reading-layout{display:block;width:100%;padding:28px 0}
.i03.ref-c .seo-guide-page .seo-guide-toc{position:relative;top:auto;max-height:none;display:grid;grid-template-columns:145px minmax(0,1fr);align-items:center;gap:16px;width:100%;margin:0 0 26px;padding:0 0 13px;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page .seo-guide-toc>nav{display:flex;gap:0;overflow:auto;white-space:nowrap}
.i03.ref-c .seo-guide-page .seo-guide-toc>nav a{padding:8px 14px;border:0;border-left:1px solid var(--line)}
.i03.ref-c .seo-guide-page .seo-guide-toc>.text-link{justify-self:start}
.i03.ref-c .seo-guide-page .seo-guide-story{width:100%;max-width:none;min-width:0}
.i03.ref-c .seo-guide-page .seo-guide-articles{width:100%;border-top:1px solid var(--ink)}
.i03.ref-c .seo-guide-page .seo-guide-article{width:100%;scroll-margin-top:125px}
.i03.ref-c .seo-guide-page .seo-guide-article>summary{grid-template-columns:minmax(0,1fr) auto 28px;align-items:center;min-height:90px;padding:20px 12px;gap:22px}
.i03.ref-c .seo-guide-page .seo-guide-article-summary-copy{display:grid;gap:6px;min-width:0}
.i03.ref-c .seo-guide-page .seo-guide-article-thumb{width:110px;height:68px;margin:0;background:var(--surface)}
.i03.ref-c .seo-guide-page .seo-guide-article-thumb-image{display:block;width:100%;height:100%;object-fit:cover}
.i03.ref-c .seo-guide-page .seo-guide-article-toggle{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--line)}
.i03.ref-c .seo-guide-page .seo-guide-article-content{width:100%;max-width:none;padding:0 12px 34px}
.i03.ref-c .seo-guide-page .seo-guide-article-hero{width:100%;margin:0 0 24px;padding:0;background:transparent}
.i03.ref-c .seo-guide-page .seo-guide-article-hero .seo-guide-hero-image{height:clamp(230px,34vw,500px);object-fit:contain;background:color-mix(in srgb,var(--surface) 78%,var(--accent) 4%)}
.i03.ref-c .seo-guide-page .seo-guide-section{width:100%;max-width:none}
.i03.ref-c .seo-guide-page .seo-guide-section-head{min-width:0}
.i03.ref-c .seo-guide-page .seo-guide-section-body{min-width:0;width:100%}
.i03.ref-c .seo-guide-page .seo-guide-section-body>*{max-width:100%}
.i03.ref-c .article-layout-picker{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;margin:20px 0 28px;background:var(--line);border:1px solid var(--line)}
.i03.ref-c .article-layout-picker>div{grid-column:1/-1;display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:10px 13px;background:var(--surface)}
.i03.ref-c .article-layout-picker>div .eyebrow{margin:0;color:var(--accent);font-size:9px;letter-spacing:.08em}
.i03.ref-c .article-layout-picker>div strong{font-size:11px;font-weight:600}
.i03.ref-c .article-layout-picker>a{display:grid;align-content:start;gap:6px;min-height:102px;padding:12px 13px;background:var(--surface);text-decoration:none;transition:background-color .18s ease,color .18s ease}
.i03.ref-c .article-layout-picker>a>span{font-size:11px;font-weight:600}
.i03.ref-c .article-layout-picker>a>small{font-size:9px;line-height:1.45;color:var(--muted)}
.i03.ref-c .article-layout-picker>a>small.guide-layout-influence{text-transform:uppercase;letter-spacing:.06em;color:var(--accent)}
.i03.ref-c .article-layout-picker>a:hover,.i03.ref-c .article-layout-picker>a[aria-current="page"]{background:var(--ink);color:var(--surface)}
.i03.ref-c .article-layout-picker>a:hover small,.i03.ref-c .article-layout-picker>a[aria-current="page"] small{color:color-mix(in srgb,var(--surface) 72%,transparent)}
.i03.ref-c .editorial-variant-picker>div>a{margin-left:auto;font-size:10px;text-decoration:none;color:var(--muted)}
.i03.ref-c .editorial-variant-picker>div>a:hover{color:var(--ink)}
.i03.ref-c .editorial-variant-picker>a[aria-current="page"]{box-shadow:inset 0 -2px 0 var(--accent)}

/* A-01 · Open Dossier: full-width article with a section title rail. */
.i03.ref-c .seo-guide-page[data-article-layout="1"] .seo-guide-section{display:grid;grid-template-columns:minmax(190px,24%) minmax(0,1fr);gap:26px;padding:24px 0;margin:0;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="1"] .seo-guide-section-head h3{margin:0 0 9px;font-size:17px}
.i03.ref-c .seo-guide-page[data-article-layout="1"] .seo-guide-section-head .seo-guide-lead{font-size:12px}
.i03.ref-c .seo-guide-page[data-article-layout="1"] .seo-guide-section-body .seo-guide-visuals{margin-top:0}

/* A-02 · Library Folio: warm disclosure panels with image-led topic headers. */
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-articles{border-top:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 16px}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-article{align-self:start;margin:0 0 12px;background:color-mix(in srgb,var(--surface) 78%,var(--accent) 5%);border:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-article[open]{grid-column:1/-1}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-article>summary{min-height:112px;padding:14px}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-article-thumb{width:124px;height:82px}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-article-content{padding:0 18px 28px}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-section{padding:18px 0;margin:0;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-section-head{padding:0 0 6px}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-section-body .seo-guide-visuals.has-multiple{grid-template-columns:repeat(3,minmax(0,1fr))}
.i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-section-body .seo-guide-visuals.has-multiple .seo-guide-inline-image{height:clamp(150px,17vw,240px)}

/* A-03 · Specimen Ledger: fast article headers and technical section rows. */
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article>summary{min-height:72px;padding:14px 8px;grid-template-columns:minmax(0,1fr) 28px}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-thumb{display:none}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-summary-copy{grid-template-columns:minmax(150px,.45fr) minmax(0,1.1fr) minmax(0,1fr);align-items:center;gap:16px}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-summary-copy>small{grid-column:1;grid-row:1 / span 2}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-summary-copy>strong{grid-column:2;grid-row:1 / span 2}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-description{grid-column:3;grid-row:1 / span 2}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-content{padding:0 8px 25px}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-section{display:grid;grid-template-columns:minmax(160px,20%) minmax(0,1fr);gap:20px;padding:17px 0;margin:0;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-section-head h3{margin:0;font-size:13px}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-section-head .seo-guide-lead{font-size:11px;line-height:1.6}
.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-section-body p,.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-section-body li{font-size:12px}

/* A-04 · Editorial Spread: photographic opening and open page-like reading. */
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article{border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article>summary{min-height:120px;padding:22px 8px}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article-summary-copy>strong{font-size:clamp(22px,3vw,34px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article-thumb{width:170px;height:100px}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article-content{padding:0 8px 48px}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article-hero{margin:0 0 38px}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article-hero .seo-guide-hero-image{height:clamp(300px,42vw,560px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-section{padding:28px 0;margin:0;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-section-head{max-width:72ch;margin-bottom:14px}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-section-head h3{font-size:clamp(18px,2.2vw,26px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-section-body .seo-guide-visuals.has-multiple{grid-template-columns:repeat(2,minmax(0,1fr))}

/* A-04.1 · Feature Plate */
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="1"] .seo-guide-article-hero .seo-guide-hero-image{height:clamp(390px,48vw,620px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="1"] .seo-guide-section{display:grid;grid-template-columns:minmax(220px,26%) minmax(0,1fr);gap:30px;padding:30px 0}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="1"] .seo-guide-section-head h3{max-width:20ch;font-size:clamp(20px,2.5vw,32px)}

/* A-04.2 · Offset Spread */
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-article-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(210px,.34fr);align-items:stretch;gap:0;background:color-mix(in srgb,var(--surface) 78%,var(--accent) 5%)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-article-hero .seo-guide-hero-image{height:clamp(300px,36vw,470px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-article-hero figcaption{align-self:end;padding:22px;font-size:11px;line-height:1.7}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-section{display:grid;grid-template-columns:minmax(250px,34%) minmax(0,1fr);gap:32px;padding:26px 0}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-section-head{align-self:start;position:sticky;top:125px}

/* A-04.3 · Type-led Folio */
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="3"] .seo-guide-article-hero .seo-guide-hero-image{height:clamp(250px,31vw,400px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="3"] .seo-guide-section{padding:40px 0}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="3"] .seo-guide-section-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,.72fr);align-items:baseline;gap:26px;margin-bottom:18px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="3"] .seo-guide-section-head h3{font-size:clamp(25px,3.6vw,48px);line-height:1.02;max-width:18ch}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="3"] .seo-guide-section-head .seo-guide-lead{font-size:14px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="3"] .seo-guide-section-body .seo-guide-visuals.has-multiple{grid-template-columns:repeat(2,minmax(0,1fr))}

/* A-04.4 · Field Notes */
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-article-content{padding:18px 18px 42px;background:color-mix(in srgb,var(--surface) 80%,var(--accent) 4%)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-article-hero .seo-guide-hero-image{height:clamp(280px,32vw,420px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-section{padding:22px 20px;margin:0;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-section:nth-child(even){background:color-mix(in srgb,var(--surface) 83%,var(--accent) 3%)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-section-head{display:grid;grid-template-columns:minmax(180px,.28fr) minmax(0,1fr);gap:24px;align-items:baseline}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-section-head h3{font-size:16px}

/* A-04.5 · Chapter Sequence */
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-content{padding-left:30px;border-left:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article>summary:has(.seo-guide-article-thumb){grid-template-columns:minmax(0,1fr) minmax(110px,170px) 48px;gap:22px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article>summary:not(:has(.seo-guide-article-thumb)){grid-template-columns:minmax(0,1fr) 48px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-thumb{width:100%;height:104px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-toggle{width:48px;height:48px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-hero{margin-left:-30px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-hero .seo-guide-hero-image{height:clamp(320px,38vw,490px)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-hero .seo-guide-hero-image,.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-inline-image{height:auto;max-height:500px;object-fit:contain;background:color-mix(in srgb,var(--surface) 82%,var(--accent) 5%)}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-section{display:grid;grid-template-columns:minmax(190px,23%) minmax(0,1fr);gap:30px;padding:30px 0;margin:0}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-section-head{position:relative}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-section-head h3{margin:0;font-size:18px}
.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-section-body .seo-guide-visuals{margin-top:0}
.i03.ref-c .who-we-are-founders{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin:20px 0 50px}
.i03.ref-c .who-we-are-founders>article{min-width:0;border-top:1px solid var(--line);padding-top:12px}
.i03.ref-c .who-we-are-founders figure{margin:0 0 14px}
.i03.ref-c .who-we-are-founders .seo-guide-inline-image{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;background:var(--surface)}
.i03.ref-c .who-we-are-founders h2{margin:0 0 8px;font-size:19px}
.i03.ref-c .who-we-are-founders p{font-size:15px;line-height:1.65;color:var(--muted)}
.i03.ref-c .who-we-are-founders figcaption{font-size:12px;line-height:1.5}
.i03.ref-c .who-we-are-partner{margin:10px 0 48px;padding:30px 0;border-top:1px solid var(--ink);border-bottom:1px solid var(--line)}
.i03.ref-c .who-we-are-partner>header{max-width:78ch}
.i03.ref-c .who-we-are-partner>header h2{max-width:23ch;margin:10px 0 14px;font-size:clamp(26px,3.1vw,40px);line-height:1.08}
.i03.ref-c .who-we-are-partner>header>p:last-child{font-size:16px;line-height:1.7;color:var(--muted)}
.i03.ref-c .who-we-are-capabilities{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px;margin-top:28px}
.i03.ref-c .who-we-are-capabilities article{border-top:1px solid var(--line);padding-top:13px}
.i03.ref-c .who-we-are-capabilities span{font-size:12px;letter-spacing:.08em;color:var(--accent)}
.i03.ref-c .who-we-are-capabilities h3{margin:12px 0 8px;font-size:21px}
.i03.ref-c .who-we-are-capabilities p,.i03.ref-c .who-we-are-note{font-size:15px;line-height:1.7;color:var(--muted)}
.i03.ref-c .who-we-are-note{margin:24px 0 0}
.i03.ref-c .who-we-are-process-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin:34px 0 0}
.i03.ref-c .who-we-are-process-grid figure{min-width:0;margin:0;border-top:1px solid var(--line);padding-top:11px}
.i03.ref-c .who-we-are-process-image{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;background:var(--surface)}
.i03.ref-c .who-we-are-process-grid figcaption{display:grid;gap:5px;margin-top:10px;font-size:14px;line-height:1.45}
.i03.ref-c .who-we-are-process-grid figcaption span{color:var(--muted);font-size:12px}
.i03.ref-c .who-we-are-process-grid figcaption strong{font-size:15px;font-weight:600}
.i03.ref-c .seo-guide-page .seo-guide-table-wrap table{font-size:14px}
.i03.ref-c .seo-guide-page .seo-guide-reference-grid small{font-size:12px}
.i03.ref-c .seo-guide-page .seo-guide-reference-grid strong{font-size:15px}
.i03.ref-c .seo-guide-page .seo-guide-reference-grid span{font-size:13px}
.i03.ref-c .seo-guide-page .seo-guide-related>nav span{font-size:12px}
.i03.ref-c .seo-guide-page .seo-guide-related>nav small{font-size:13px}
.i03.ref-c .seo-guide-page .seo-guide-related>nav strong{font-size:16px}
.i03.ref-c .seo-guide-page .seo-guide-next-stage>.eyebrow{font-size:12px}
.i03.ref-c .seo-guide-rfq .rfq-basics dt{font-size:15px}
.i03.ref-c .seo-guide-rfq .rfq-basics dd{font-size:14px}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article header a{font-size:14px}
.i03.ref-c .seo-guide-rfq .rfq-category-list>article li{font-size:14px}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence span{font-size:12px}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence strong{font-size:16px}
.i03.ref-c .seo-guide-rfq .rfq-review-sequence p{font-size:14px}
.i03.ref-c .seo-guide-rfq .rfq-planning-visual figcaption{font-size:12px}
.i03.ref-c .seo-guide-rfq .rfq-faq summary{font-size:16px}

/* A-05 · Review Path: prominent open state, checkpoints, and an explicit handoff. */
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article>summary{grid-template-columns:150px minmax(0,1fr) auto 28px;gap:18px;min-height:92px;padding:18px 10px}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-summary-copy{display:contents}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-summary-copy>small{grid-column:1;grid-row:1 / span 2}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-summary-copy>strong{grid-column:2;grid-row:1}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-description{grid-column:2;grid-row:2}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-thumb{grid-column:3;grid-row:1 / span 2}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-content{padding:0 10px 28px}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-section{display:grid;grid-template-columns:minmax(185px,22%) minmax(0,1fr);gap:24px;padding:22px 0;margin:0;border-bottom:1px solid var(--line)}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-section-head{border-left:2px solid var(--accent);padding-left:14px}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-section-head h3{margin:0 0 8px;font-size:16px}
.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-section-body .seo-guide-note-block{width:100%;border-left:2px solid var(--accent)}
@media(max-width:760px){
 .i03.ref-c .seo-guide-index,.i03.ref-c .seo-guide-page{padding:28px 18px}
 .i03.ref-c .seo-guide-tools{grid-template-columns:1fr;gap:6px}
 .i03.ref-c .seo-guide-row{grid-template-columns:minmax(0,1fr) auto;gap:8px 12px}
 .i03.ref-c .seo-guide-row>small{grid-column:1}
 .i03.ref-c .seo-guide-article>summary{grid-template-columns:minmax(0,1fr) 22px;gap:10px;padding:15px 0}
 .i03.ref-c .seo-guide-article>summary strong{font-size:16px}
 .i03.ref-c .seo-guide-open{grid-column:2;grid-row:1 / span 2}
 .i03.ref-c .seo-guide-hero{grid-template-columns:1fr;gap:22px;padding:25px 0 30px}
 .i03.ref-c .seo-guide-hero-image{height:260px}
 .i03.ref-c .seo-guide-reading-layout{grid-template-columns:1fr;gap:22px;padding:25px 0}
 .i03.ref-c .seo-guide-toc{position:relative;top:auto;max-height:225px;overflow:auto;border-bottom:1px solid var(--line);padding-bottom:16px}
 .i03.ref-c .seo-guide-toc>nav{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:14px}
 .i03.ref-c .seo-guide-related>nav{grid-template-columns:1fr}
 .i03.ref-c .seo-guide-section ul.seo-guide-list-2,.i03.ref-c .seo-guide-section ul.seo-guide-list-3{grid-template-columns:1fr}
 .i03.ref-c .seo-guide-reference-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 12px}
 .i03.ref-c .seo-guide-rfq .rfq-basics dl{grid-template-columns:1fr}
 .i03.ref-c .seo-guide-rfq .rfq-category-list>article>header{align-items:flex-start;flex-direction:column;gap:9px}
 .i03.ref-c .seo-guide-rfq .rfq-review-sequence{grid-template-columns:1fr;gap:8px}
 .i03.ref-c .seo-guide-rfq .rfq-planning-visual{grid-template-columns:1fr}
 .i03.ref-c .seo-guide-rfq .rfq-planning-visual .seo-guide-inline-image{height:190px}
 .i03.ref-c .seo-guide-project-link,.i03.ref-c .seo-guide-next-stage>a{align-items:flex-start;flex-direction:column}

 .i03.ref-c .article-layout-picker{grid-template-columns:repeat(2,minmax(0,1fr))}
 .i03.ref-c .article-layout-picker>div{grid-column:1/-1;align-items:flex-start;flex-direction:column;gap:5px}
 .i03.ref-c .article-layout-picker>a:last-child{grid-column:1/-1}
 .i03.ref-c .seo-guide-page .seo-guide-toc{grid-template-columns:1fr;gap:8px}
 .i03.ref-c .seo-guide-page .seo-guide-toc>nav{display:flex}
 .i03.ref-c .seo-guide-page .seo-guide-article>summary{grid-template-columns:minmax(0,1fr) 44px;gap:12px;padding:16px 8px}
 .i03.ref-c .seo-guide-page .seo-guide-article>summary:has(.seo-guide-article-thumb){grid-template-columns:minmax(0,1fr) 76px 44px}
 .i03.ref-c .seo-guide-page .seo-guide-article-thumb{width:76px;height:58px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-thumb{width:76px;height:58px}
 .i03.ref-c .seo-guide-page .seo-guide-article-content{padding:0 8px 24px}
 .i03.ref-c .seo-guide-page[data-article-layout="1"] .seo-guide-section,.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-section,.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-section{grid-template-columns:1fr;gap:8px}
 .i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-articles{grid-template-columns:1fr}
 .i03.ref-c .seo-guide-page[data-article-layout="2"] .seo-guide-article[open]{grid-column:auto}
 .i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article>summary{grid-template-columns:minmax(0,1fr) 24px}
 .i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-summary-copy{grid-template-columns:1fr;gap:4px}
 .i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-summary-copy>small,.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-summary-copy>strong,.i03.ref-c .seo-guide-page[data-article-layout="3"] .seo-guide-article-description{grid-column:1;grid-row:auto}
 .i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article>summary{min-height:90px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"] .seo-guide-article-thumb{width:72px;height:54px}
 .i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article>summary{grid-template-columns:minmax(0,1fr) auto 24px}
 .i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-summary-copy{display:grid}
 .i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-summary-copy>small,.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-summary-copy>strong,.i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-description{grid-column:auto;grid-row:auto}
 .i03.ref-c .seo-guide-page[data-article-layout="5"] .seo-guide-article-thumb{grid-column:auto;grid-row:auto}
 .i03.ref-c .editorial-variant-picker>div>a{margin-left:0}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="1"] .seo-guide-section,.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-section,.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-section{grid-template-columns:1fr;gap:10px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-article-hero{grid-template-columns:1fr}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="2"] .seo-guide-section-head{position:relative;top:auto}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="3"] .seo-guide-section-head{grid-template-columns:1fr;gap:7px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-article-content{padding:8px 8px 22px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-section{padding:16px 12px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="4"] .seo-guide-section-head{grid-template-columns:1fr;gap:4px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-content{padding-left:12px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-hero{margin-left:-12px}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-section{grid-template-columns:1fr;gap:8px;padding:19px 0}
 .i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-article-hero .seo-guide-hero-image,.i03.ref-c .seo-guide-page[data-article-layout="4"][data-editorial-variant="5"] .seo-guide-inline-image{max-height:340px}
 .i03.ref-c .who-we-are-founders{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 14px}
 .i03.ref-c .who-we-are-capabilities{grid-template-columns:1fr;gap:20px}
 .i03.ref-c .who-we-are-process-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}
 .i03.ref-c .seo-guide-page .seo-guide-article>summary strong{font-size:19px}
 .i03.ref-c .seo-guide-page .seo-guide-article-description{font-size:14px}
 .i03.ref-c .seo-guide-page .seo-guide-related>nav strong{font-size:16px}
 .i03.ref-c .seo-guide-article>summary strong{font-size:15px}
 .i03.ref-c .seo-guide-article-description{font-size:10px}

}
@media(prefers-reduced-motion:reduce){.i03.ref-c .seo-guide-index *,.i03.ref-c .seo-guide-page *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
`;

export {seoPages};
