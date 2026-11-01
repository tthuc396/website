const localViewMetadata = {
  home: ["Project Cabinetry, Countertops & Furniture | Asina Global", "Florida-based project supply for cabinetry, countertops and furniture packages. Explore kitchen, vanity and wardrobe programs, then start a project review."],
  rooms: ["Complete Room Applications | Asina Global", "Explore four cabinet transformations, popular kitchen pairings, hardware, hood covers, vanity and wardrobe applications in one complete-room reference."],
  lookbook: ["Complete Room Applications | Asina Global", "Explore four cabinet transformations, popular kitchen pairings, hardware, hood covers, vanity and wardrobe applications in one complete-room reference."],
  technical: ["Cabinet Box Construction & Specifications | Asina Global", "Review cabinet construction, box materials, separate front options, hardware and installation notes. Confirm project specifications during review."],
  profiles: ["17 Cabinet Door Profiles | Asina Global", "Compare 17 cataloged door-profile references and save a direction for consultation. Confirm finish and configuration suitability during project review."],
  materials: ["Cabinet Materials & Finishes | Asina Global", "Explore nine finish families and 172 indexed records, including 58 TFL references. The broader finish range includes 600+ colours. Request a project quote."],
  configurations: ["Cabinet Configuration Quick Reference | Asina Global", "Use the Quick Book to identify cabinet names, codes and options across 362 references. Layouts follow project plans; confirm details during review."],
  quickbook: ["Quick Book Catalogue | Asina Global", "Browse 362 Quick Book cabinet and component references across ten categories. Identify codes for project review; pricing is quote-only."],
  accessories: ["Cabinet Storage Accessories & Hood Covers | Asina Global", "Review ten storage accessories and 12 custom hood styles shown in 13 visuals. Confirm cabinet fit, ventilation and specifications during project review."],
  "accessories-catalogue": ["Accessories Catalogue | Asina Global", "Browse Asina Global’s Accessories Catalogue online. Confirm item selection, cabinet fit, hardware and suitability during project review."],
  countertops: ["Countertops & Full-Height Backsplashes | Asina Global", "Explore quartz, granite and laminate countertops, full-height backsplashes, material comparisons and eight edge-profile visuals. Request a project quote."],
  faqs: ["Cabinetry & Project Supply FAQs | Asina Global", "Find concise answers about cabinet construction, profiles, finishes, Quick Book references, accessories, countertops and project review."],
  consultation: ["Start a Project Review | Asina Global", "Prepare a project review with room plans, cabinet selections, profiles, finishes, Quick Book codes, accessories and destination."],
  about: ["About Asina Global | Project Supply", "Learn how Asina Global coordinates cabinetry, countertops, project review, quality checks, packing and shipping planning with its manufacturing partner."],
  guides: ["Project Guides & Resources | Asina Global", "Browse cabinet supply, countertops, furniture packages, buyer planning, project operations and Florida commercial supply guides from Asina Global."]
};

export function updateLocalViewMetadata(view, guide = null) {
  const [title, description] = view === 'guide' && guide
    ? [guide.title, guide.description]
    : localViewMetadata[view] || localViewMetadata.home;
  document.title = title;
  for (const [selector, value, key, name] of [
    ['meta[name="description"]', description, 'name', 'description'],
    ['meta[property="og:title"]', title, 'property', 'og:title'],
    ['meta[property="og:description"]', description, 'property', 'og:description']
  ]) {
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute(key, name);
      document.head.append(node);
    }
    node.setAttribute('content', value);
  }
}
