export const siteOrigin = "https://asinaglobal.com";

export const publicRoutes = [
  { path: "/", view: "home", title: "Project Cabinetry, Countertops & Furniture | Asina Global", description: "Florida-based project supply for cabinetry, countertops and furniture packages. Explore kitchen, vanity and wardrobe programs, then start a project review.", index: true },
  { path: "/about/", view: "about", title: "About Asina Global | Project Supply", description: "Learn how Asina Global coordinates cabinetry, countertops, project review, quality checks, packing and shipping planning with its manufacturing partner.", index: true },
  { path: "/cabinet-specifications/", view: "technical", title: "Cabinet Box Construction & Specifications | Asina Global", description: "Review cabinet construction, box materials, separate front options, hardware and installation notes. Confirm project specifications during review.", index: true },
  { path: "/door-profiles/", view: "profiles", title: "17 Cabinet Door Profiles | Asina Global", description: "Compare 17 cataloged door-profile references and save a direction for consultation. Confirm finish and configuration suitability during project review.", index: true },
  { path: "/materials-finishes/", view: "materials", title: "Cabinet Materials & Finishes | Asina Global", description: "Explore nine finish families and 172 indexed records, including 58 TFL references. The broader finish range includes 600+ colours. Request a project quote.", index: true },
  { path: "/cabinet-configurations/", view: "configurations", title: "Cabinet Configuration Quick Reference | Asina Global", description: "Use the Quick Book to identify cabinet names, codes and options across 362 references. Layouts follow project plans; confirm details during review.", index: true },
  { path: "/accessories/", view: "accessories", title: "Cabinet Storage Accessories & Hood Covers | Asina Global", description: "Review ten storage accessories and 12 custom hood styles shown in 13 visuals. Confirm cabinet fit, ventilation and specifications during project review.", index: true },
  { path: "/countertops/", view: "countertops", title: "Countertops & Full-Height Backsplashes | Asina Global", description: "Explore quartz, granite and laminate countertops, full-height backsplashes, material comparisons and eight edge-profile visuals. Request a project quote.", index: true },
  { path: "/vanity-wardrobe/", view: "vanity-wardrobe", title: "Vanity & Wardrobe Systems | Asina Global", description: "Explore custom vanity cabinet directions and cataloged wardrobe and closet storage systems. Review configurations and accessory references with Asina Global.", index: true },
  { path: "/complete-room/", view: "rooms", title: "Complete Room Applications | Asina Global", description: "Explore four cabinet transformations, popular kitchen pairings, hardware, hood covers, vanity and wardrobe applications in one complete-room reference.", index: true },
  { path: "/project-faqs/", view: "faqs", title: "Cabinetry & Project Supply FAQs | Asina Global", description: "Find concise answers about cabinet construction, profiles, finishes, Quick Book references, accessories, countertops and project review.", index: true },
  { path: "/project-guides/", view: "guides", title: "Project Guides & Resources | Asina Global", description: "Browse concise guides for cabinet supply, countertops, furniture packages, buyer planning, quality, shipping and project review.", index: true },
  { path: "/project-review/", view: "consultation", title: "Start a Project Review | Asina Global", description: "Prepare a project review with room plans, cabinet selections, profiles, finishes, Quick Book codes, accessories and destination.", index: true },
  { path: "/multi-unit-cabinet-packages/", view: "guide", page: "multi-unit-supply", index: true },
  { path: "/custom-furniture-packages/", view: "guide", page: "furniture-packages", index: true },
  { path: "/buyer-paths/", view: "guide", page: "commercial-supply", index: true },
  { path: "/project-supply-importer-resources/", view: "guide", page: "import-planning", index: true },
  { path: "/process/", view: "guide", page: "manufacturing-quality", index: true },
  { path: "/privacy-policy/", view: "guide", page: "privacy", title: "Privacy Policy | Asina Global", description: "Read how Asina Global handles contact details and project information submitted for a project review, how information is used, and how to request an update or deletion.", index: true },
  { path: "/project-review/received/", view: "thank-you", title: "Project Review Received | Asina Global", description: "Your project review request has been received.", index: false }
];

// One-hop redirects into the new guided journey. Where the new information
// architecture combines an old article, the target opens the corresponding
// article section inside its concise topic hub.
export const publicRedirects = [
  ["/cabinets/", "/"], ["/cabinets.html", "/"], ["/cabinet-catalog.html", "/"],
  ["/cabinet-malibu.html", "/"], ["/cabinet-monterey.html", "/"], ["/cabinet-newport.html", "/"],
  ["/cabinet-catalina.html", "/"], ["/cabinet-laguna.html", "/"], ["/cabinet-jersey.html", "/"],
  ["/cabinets/malibu/", "/"], ["/cabinets/monterey/", "/"], ["/cabinets/newport/", "/"],
  ["/cabinets/catalina/", "/"], ["/cabinets/laguna/", "/"], ["/cabinets/jersey/", "/"],
  ["/furniture/", "/custom-furniture-packages/"], ["/furniture-packages/", "/custom-furniture-packages/"], ["/furniture.html", "/custom-furniture-packages/"],
  ["/restaurant-franchise-furniture-packages/", "/custom-furniture-packages/#guide-topic-restaurant-furniture"],
  ["/hospitality-furniture-packages/", "/custom-furniture-packages/#guide-topic-hospitality-ffe"],
  ["/hospitality-ffe-furniture-packages-florida/", "/custom-furniture-packages/#guide-topic-hospitality-ffe"],
  ["/qa-shipping-import-risk/", "/process/"], ["/qa/", "/process/#guide-topic-qa"],
  ["/qa-shipping/", "/process/#guide-topic-qa"], ["/import-risk/", "/process/#guide-topic-qa"],
  ["/imported-cabinet-quality-qa/", "/process/#guide-topic-imported-quality"],
  ["/design-to-production-support/", "/process/"], ["/designer/", "/process/"], ["/designer.html", "/process/"],
  ["/design-help/", "/process/"], ["/consult-design/", "/process/"],
  ["/contact/", "/project-review/#contact-details"], ["/contact.html", "/project-review/#contact-details"],
  ["/review/", "/project-review/"], ["/start-project-review/", "/project-review/"], ["/rfq-procurement-resources/", "/project-review/"],
  ["/privacy/", "/privacy-policy/"], ["/about.html", "/about/"],
  ["/wholesale-cabinet-supply-for-dealers/", "/multi-unit-cabinet-packages/#guide-topic-dealer-supply"],
  ["/multifamily-cabinet-countertop-supply-florida/", "/multi-unit-cabinet-packages/#guide-topic-multifamily-supply"],
  ["/wholesale-cabinet-suppliers-central-florida/", "/buyer-paths/#guide-topic-supplier-comparison"],
  ["/how-to-choose-wholesale-cabinet-supplier/", "/buyer-paths/#guide-topic-supplier-comparison"],
  ["/how-many-kitchens-fit-40ft-container/", "/project-supply-importer-resources/#guide-topic-container-economics"],
  ["/landed-cost-imported-cabinets/", "/project-supply-importer-resources/#guide-topic-landed-cost"],
  ["/importer-resources/", "/project-supply-importer-resources/"],
  ["/cabinet-import-shipping-responsibility/", "/project-supply-importer-resources/#guide-topic-shipping-responsibility"],
  ["/cabinet-lead-times-builders-import-stock/", "/project-supply-importer-resources/#guide-topic-lead-times"],
  ["/import-vs-domestic-cabinets-cost/", "/project-supply-importer-resources/#guide-topic-import-vs-domestic"],
  ["/orlando-commercial-project-supply/", "/buyer-paths/#guide-topic-orlando"],
  ["/commercial-cabinet-countertop-supply-florida/", "/buyer-paths/#guide-topic-commercial-mixed"],
  ["/commercial-countertop-supply-orlando/", "/countertops/"],
  ["/countertop-catalog.html", "/countertops/"], ["/countertops.html", "/countertops/"],
  ["/countertop-exotic.html", "/countertops/#countertop-surface-grid"], ["/countertop-natural.html", "/countertops/#countertop-surface-grid"],
  ["/countertop-grain.html", "/countertops/#countertop-surface-grid"], ["/quartz-guides.html", "/countertops/"],
  ["/guide-clean-quartz-countertops.html", "/countertops/"], ["/guide-modern-quartz-countertop-designs.html", "/countertops/"],
  ["/guide-quartz-slab-manufacturer.html", "/countertops/"], ["/countertops/quartz-slab-codes/", "/countertops/#countertop-surface-grid"],
  ["/countertops/exotic-quartz-slabs/", "/countertops/#countertop-surface-grid"], ["/countertops/natural-quartz-slabs/", "/countertops/#countertop-surface-grid"],
  ["/countertops/grain-quartz-slabs/", "/countertops/#countertop-surface-grid"],
  ["/blog/", "/countertops/"], ["/blog/index.html", "/countertops/"], ["/blog/how-to-clean-quartz-countertops.html", "/countertops/"],
  ["/blog/modern-quartz-countertop-designs.html", "/countertops/"], ["/blog/quartz-slab-manufacturer.html", "/countertops/"],
  ["/index.html", "/"], ["/landing.html", "/"], ["/faq.html", "/project-faqs/"], ["/projects.html", "/complete-room/"],
  ["/restaurant-project-supply/", "/custom-furniture-packages/"],
  ["/llms-full.txt", "/project-guides/"]
].map(([from, to]) => ({ from, to }));

export const hostRedirects = [
  { from: "http://www.asinaglobal.com/*", to: "https://asinaglobal.com/:splat" },
  { from: "https://www.asinaglobal.com/*", to: "https://asinaglobal.com/:splat" },
  { from: "http://asinaglobal.com/*", to: "https://asinaglobal.com/:splat" }
];

export const routeForPath = (pathname) => publicRoutes.find((route) => route.path === (pathname.endsWith("/") ? pathname : `${pathname}/`));

export function publicPathForView(view, page = "", topic = "", hash = "") {
  let route;
  if (view === "guide") route = publicRoutes.find((item) => item.view === "guide" && item.page === page);
  else if (view === "quickbook") route = publicRoutes.find((item) => item.path === "/cabinet-configurations/");
  else if (view === "accessories-catalogue") route = publicRoutes.find((item) => item.path === "/accessories/");
  else if (view === "lookbook") route = publicRoutes.find((item) => item.path === "/complete-room/");
  else route = publicRoutes.find((item) => item.view === view);
  if (!route) route = publicRoutes[0];

  const extraHash = view === "quickbook" ? "quick-book-reader" : view === "accessories-catalogue" ? "accessories-catalogue" : topic ? `guide-${topic}` : hash;
  return `${route.path}${extraHash ? `#${extraHash.replace(/^#/, "")}` : ""}`;
}
