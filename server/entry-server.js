import React, { Suspense, useEffect, useEffect as useEffect$1, useLayoutEffect, useRef, useRef as useRef$1, useState, useState as useState$1 } from "react";
import { renderToString } from "react-dom/server";
import { AnimatePresence, AnimatePresence as AnimatePresence$1, LayoutGroup, MotionConfig, motion, motion as motion$1, useMotionValueEvent, useReducedMotion, useReducedMotion as useReducedMotion$1, useScroll, useTransform } from "motion/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Armchair, ArrowRight, ArrowRight as ArrowRight$1, Box, Building2, CalendarDays, Check, Check as Check$1, Clock, Clock as Clock$1, FileText, FileText as FileText$1, Mail, MapPin, MapPin as MapPin$1, Maximize2, PackageCheck, PackageCheck as PackageCheck$1, Phone, Phone as Phone$1, Ruler, Send, Send as Send$1, ShieldCheck, Truck, Truck as Truck$1, X } from "lucide-react";
import { createPortal } from "react-dom";
//#region src/components/ui/background-components.jsx
var vertexShaderSource = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;
var fragmentShaderSource = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 proofGlow = vec2(0.72 * (u_resolution.x / u_resolution.y), 0.48);
    float dist = distance(uv, proofGlow);

    vec2 q = vec2(0.0);
    q.x = fbm(uv + 0.035 * u_time);
    q.y = fbm(uv + vec2(1.0, 1.0));

    vec2 r = vec2(0.0);
    r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.075 * u_time);
    r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.063 * u_time);

    float f = fbm(uv + r);

    vec3 baseColor = vec3(0.935, 0.895, 0.810);
    vec3 mistColor = vec3(0.990, 0.955, 0.875);
    vec3 accentColor = vec3(0.740, 0.665, 0.410);

    vec3 color = mix(baseColor, mistColor, f);
    color = mix(color, accentColor, dot(q, r) * 0.22);

    float fixedGlow = smoothstep(0.42, 0.0, dist);
    color += fixedGlow * 0.014 * vec3(1.0, 0.86, 0.55);

    float vignette = smoothstep(1.15, 0.22, distance(uv, vec2(0.72, 0.48)));
    color = mix(color * 0.93, color * 1.04, vignette);
    color = pow(color, vec3(1.04));

    gl_FragColor = vec4(color, 1.0);
  }
`;
function compileShader(gl, type, source) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}
var Component = () => {
	const canvasRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return void 0;
		const gl = canvas.getContext("webgl", {
			alpha: false,
			antialias: false,
			depth: false,
			stencil: false,
			powerPreference: "low-power"
		});
		if (!gl) return void 0;
		const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		const program = gl.createProgram();
		if (!vertexShader || !fragmentShader || !program) return void 0;
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			gl.deleteProgram(program);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			return;
		}
		gl.useProgram(program);
		const vertices = new Float32Array([
			-1,
			-1,
			1,
			-1,
			-1,
			1,
			-1,
			1,
			1,
			-1,
			1,
			1
		]);
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		const positionAttribute = gl.getAttribLocation(program, "position");
		gl.enableVertexAttribArray(positionAttribute);
		gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
		const timeLocation = gl.getUniformLocation(program, "u_time");
		const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const compactViewport = window.matchMedia("(max-width: 760px)").matches;
		const resize = () => {
			const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
			const width = Math.max(1, Math.floor(window.innerWidth * pixelRatio));
			const height = Math.max(1, Math.floor(window.innerHeight * pixelRatio));
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
				canvas.style.width = `${window.innerWidth}px`;
				canvas.style.height = `${window.innerHeight}px`;
				gl.viewport(0, 0, width, height);
			}
		};
		const maxAnimatedMs = compactViewport ? 0 : 5200;
		let animationFrameId = 0;
		let firstFrameTime = 0;
		let disposed = false;
		const draw = (time) => {
			resize();
			if (!firstFrameTime) firstFrameTime = time;
			const elapsed = Math.min(time - firstFrameTime, maxAnimatedMs);
			gl.uniform1f(timeLocation, reducedMotion || compactViewport ? 0 : elapsed * .001);
			gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		};
		const render = (time) => {
			draw(time);
			const elapsed = time - firstFrameTime;
			if (!reducedMotion && !compactViewport && elapsed < maxAnimatedMs && document.visibilityState === "visible" && !disposed) animationFrameId = window.requestAnimationFrame(render);
			else animationFrameId = 0;
		};
		const start = () => {
			if (disposed || animationFrameId) return;
			animationFrameId = window.requestAnimationFrame(render);
		};
		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				window.cancelAnimationFrame(animationFrameId);
				animationFrameId = 0;
				return;
			}
			const elapsed = firstFrameTime ? performance.now() - firstFrameTime : 0;
			if (!reducedMotion && !compactViewport && elapsed < maxAnimatedMs) start();
			else window.requestAnimationFrame(draw);
		};
		const handleResize = () => {
			window.requestAnimationFrame(draw);
		};
		window.addEventListener("resize", handleResize, { passive: true });
		document.addEventListener("visibilitychange", handleVisibilityChange);
		if (compactViewport || reducedMotion) window.requestAnimationFrame(draw);
		else start();
		return () => {
			disposed = true;
			window.removeEventListener("resize", handleResize);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.cancelAnimationFrame(animationFrameId);
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
		};
	}, []);
	return /* @__PURE__ */ jsx("canvas", {
		ref: canvasRef,
		className: "mist-background",
		"aria-hidden": "true"
	});
};
//#endregion
//#region src/siteRoutes.js
var defaultSocialImage = "/assets/supporting/brand/asina-global-social-card.png";
var isRasterSocialImage = (value = "") => /\.(?:jpe?g|png)(?:[?#].*)?$/i.test(value);
var pages = [
	{
		id: "home",
		label: "Home",
		path: "/",
		title: "Wholesale Cabinets & Countertops for Contractors | Asina Global",
		description: "Asina Global supplies project-scale cabinets, countertops, and furniture packages with drawing review, mockup approval, QA, packing, and shipping coordination.",
		image: "/assets/supporting/brand/asina-global-logo.svg",
		imageAlt: "Asina Global project supply dossier for cabinets, countertops, furniture, QA, and shipping coordination.",
		serviceType: "Wholesale project supply",
		keywords: [
			"wholesale project supply",
			"import cabinets",
			"quartz countertops",
			"custom furniture packages",
			"project supply review"
		]
	},
	{
		id: "cabinets",
		label: "Cabinets",
		path: "/cabinets/",
		title: "Commercial and Multi-Unit Cabinets | Asina Global",
		description: "Compare Asina cabinet packages for builders and developers by finish, construction, panel platform, unit count, quote inputs, mockup, QA, and shipping.",
		image: "/assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
		imageAlt: "Cabinet project room used for wholesale cabinet collection review.",
		serviceType: "Wholesale cabinet supply",
		keywords: [
			"wholesale cabinets",
			"Malibu cabinets",
			"Monterey cabinets",
			"Newport cabinets",
			"framed and frameless cabinets"
		]
	},
	{
		id: "countertops",
		label: "Countertops",
		path: "/countertops/",
		title: "Wholesale Quartz Countertop Supply in Florida | Asina Global",
		description: "Wholesale quartz countertop supply in Florida. Review slab codes by collection, movement, size, thickness, edge profile, and cutout requirements. Countertops sourced and coordinated alongside cabinet packages.",
		schemaDescription: "Wholesale quartz countertop supply in Florida. Review slab codes by collection, movement, size, thickness, edge profile, and cutout requirements. Coordinated alongside cabinet packages.",
		image: "/assets/pdf-extracted/countertops/exotic/9114-calacatta-storm-black-pdf-slab.jpg",
		imageAlt: "Calacatta Storm Black quartz slab prepared for Asina Global countertop project review.",
		serviceType: "Wholesale countertop supply",
		keywords: [
			"wholesale countertops",
			"countertop slab supply",
			"quartz slab supplier",
			"wholesale countertops Florida",
			"contractor countertop supply",
			"quartz slabs",
			"Calacatta Storm Black 9114",
			"countertop project review",
			"quartz slab codes"
		]
	},
	{
		id: "furniture",
		label: "Furniture Packages",
		path: "/custom-furniture-packages/",
		aliases: ["/furniture/", "/furniture-packages/"],
		title: "Restaurant and Hospitality Furniture | Asina Global",
		description: "Review restaurant, hospitality, franchise, and rollout furniture packages by quantity, brand standards, floor plan, mockup needs, QA checkpoints, and timeline.",
		image: "/assets/supporting/furniture/velit/terrace-lounge.jpeg",
		imageAlt: "Furniture package example for restaurant, franchise, and commercial rollout review.",
		serviceType: "Custom commercial furniture package supply",
		keywords: [
			"custom furniture packages",
			"restaurant furniture package",
			"franchise rollout furniture",
			"commercial furniture package supplier",
			"commercial furniture mockup"
		]
	},
	{
		id: "process",
		label: "Process",
		path: "/process/",
		title: "Drawing To Production | Asina Global",
		description: "See the Asina Global process from project basics and emailed drawings to mockup approval, production QA, packing review, and shipping coordination path.",
		image: "/assets/supporting/brand/asina-global-logo.svg",
		imageAlt: "Asina Global drawing to production process for project supply review.",
		serviceType: "Drawing to production coordination",
		keywords: [
			"drawing to production",
			"mockup approval",
			"production QA",
			"packing review",
			"shipping coordination"
		]
	},
	{
		id: "qa",
		label: "QA + Shipping",
		path: "/qa-shipping-import-risk/",
		aliases: [
			"/qa/",
			"/qa-shipping/",
			"/import-risk/"
		],
		title: "Import Risk, QA and Shipping Review | Asina Global",
		description: "Review Asina Global import-risk controls, source protection, production QA, packing checks, shipping options, and Incoterms® 2020 planning before release.",
		image: "/assets/pdf-extracted/countertops/exotic/9137-rainforest-pdf-detail.jpg",
		imageAlt: "Material detail inspected before QA, packing, and shipping review.",
		serviceType: "Import-risk and QA coordination",
		keywords: [
			"import risk",
			"import cabinet QA process",
			"direct import cabinet problems",
			"cabinet QA inspections",
			"cabinet mockup approval",
			"production QA",
			"packing review",
			"shipping responsibility",
			"Incoterms 2020 planning"
		]
	},
	{
		id: "about",
		label: "About Asina",
		path: "/about/",
		aliases: ["/about.html"],
		title: "About Asina Global | Project Supply Accountability",
		description: "Meet Asina Global founder-led team supporting builders, developers, procurement teams, and rollout buyers with project review, QA, and shipping support.",
		image: "/assets/supporting/brand/asina-global-logo.svg",
		imageAlt: "Asina Global identity for project supply accountability.",
		serviceType: "Project supply accountability",
		keywords: [
			"Asina Global",
			"project supply accountability",
			"procurement support",
			"builder supply review",
			"developer supply partner"
		]
	},
	{
		id: "design",
		label: "Design To Production Support",
		path: "/design-to-production-support/",
		aliases: [
			"/designer/",
			"/designer.html",
			"/design-help/",
			"/consult-design/"
		],
		title: "Design To Production Support | Asina Global",
		description: "Turn layouts, finish direction, custom sizing, brand standards, and room intent into production details before mockup approval and repeat production support.",
		image: "/assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg",
		imageAlt: "Interior finish and material direction prepared for design to production support.",
		serviceType: "Design to production support",
		keywords: [
			"design to production support",
			"finish direction",
			"custom sizing review",
			"brand standards production",
			"mockup approval"
		]
	},
	{
		id: "review",
		label: "Project Review",
		path: "/project-review/",
		aliases: ["/review/", "/start-project-review/"],
		title: "Request Project Supply Review | Asina Global",
		description: "Request an Asina Global project supply review with basic scope, location, scale, and timeline. Asina requests drawings by email after the first review.",
		image: "/assets/supporting/brand/asina-global-logo.svg",
		imageAlt: "Asina Global project review intake for builders, developers, and procurement teams.",
		serviceType: "Project supply review",
		keywords: [
			"project review",
			"project supply review",
			"cabinet quote requirements",
			"countertop quote requirements",
			"furniture package review"
		]
	},
	{
		id: "contact",
		label: "Contact",
		path: "/contact/",
		showInHeader: false,
		title: "Contact Asina Global LLC | Longwood Project Supply",
		description: "Contact Asina Global LLC in Longwood, Florida for cabinet, countertop, and furniture package project review, phone support, NAP details, and follow-up.",
		image: "/assets/supporting/brand/asina-global-logo.svg",
		imageAlt: "Asina Global LLC contact details for project supply review in Longwood, Florida.",
		serviceType: "Project supply contact",
		keywords: [
			"Asina Global contact",
			"Longwood project supply",
			"cabinet supplier contact Florida",
			"countertop supplier contact Florida",
			"commercial furniture package contact"
		],
		areaServed: [{
			"@type": "AdministrativeArea",
			name: "Florida"
		}, {
			"@type": "Country",
			name: "United States"
		}]
	},
	{
		id: "privacy",
		label: "Privacy Policy",
		path: "/privacy-policy/",
		aliases: ["/privacy/"],
		showInHeader: false,
		title: "Privacy Policy | Asina Global LLC",
		description: "Read the Asina Global LLC privacy policy for project review forms, contact details, business inquiries, follow-up, data sharing, retention, and requests.",
		image: "/assets/supporting/brand/asina-global-logo.svg",
		imageAlt: "Asina Global LLC privacy policy for project review and contact form information.",
		keywords: [
			"Asina Global privacy policy",
			"project review form privacy",
			"contact form privacy",
			"Asina Global LLC data policy",
			"Florida business privacy policy"
		]
	},
	{
		id: "buyer-paths",
		label: "Buyer Paths",
		path: "/buyer-paths/",
		showInHeader: false,
		title: "Buyer Paths For Project Supply | Asina Global",
		description: "Choose the right Asina Global route for cabinets, countertops, furniture packages, RFQ prep, QA, shipping, commercial use, and project review planning.",
		image: "/assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg",
		imageAlt: "Asina Global buyer path directory prepared for project supply review.",
		serviceType: "Project supply buyer path directory",
		keywords: [
			"buyer path project supply",
			"commercial supply path",
			"cabinet countertop furniture supply",
			"project supply directory",
			"RFQ project review"
		]
	},
	{
		id: "multi-unit",
		label: "Multi-Unit Cabinets",
		path: "/multi-unit-cabinet-packages/",
		showInHeader: false,
		title: "Multi-Unit Cabinets for Florida Developers | Asina Global",
		description: "Asina Global supplies multi-unit and multifamily cabinet packages for developers and contractors in Florida. Drawing review, mockup approval, QA, and shipping coordination for 10–200 unit builds.",
		image: "/assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
		imageAlt: "Cabinet package room prepared for multi-unit project supply review.",
		articleHeadline: "Multi-Unit Cabinet Packages for Developers and Contractors in Florida",
		datePublished: "2026-06-05",
		dateModified: "2026-06-05",
		articleAuthor: "Kim Nguyen",
		articleAuthorTitle: "Co-Founder, Asina Global",
		articleAuthorUrl: "https://asinaglobal.com/about/",
		serviceType: "Multi-unit cabinet package supply",
		keywords: [
			"multi-unit cabinet supplier",
			"apartment cabinet packages",
			"developer cabinet procurement",
			"cabinet supplier for builders",
			"commercial cabinet packages",
			"contractor cabinet supply"
		]
	},
	{
		id: "dealer-supply",
		label: "Dealer Cabinet Supply",
		path: "/wholesale-cabinet-supply-for-dealers/",
		showInHeader: false,
		title: "Cabinet Supply for Florida Dealers | Asina Global",
		description: "Asina Global supplies Florida cabinet dealers, kitchen designers, and distributors with project-scale imported cabinets, quartz countertops, and furniture packages. Container quantities, QA included. Dealer client relationships protected.",
		ogDescription: "Asina Global supplies Florida cabinet dealers, kitchen designers, and distributors with project-scale imported cabinets, quartz countertops, and furniture packages. Container quantities, QA included.",
		socialImage: defaultSocialImage,
		image: "/assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
		imageAlt: "Cabinet package room prepared for dealer and distributor wholesale supply review.",
		articleHeadline: "Cabinet Wholesale Supply for Dealers and Distributors in Florida",
		serviceType: "Cabinet Wholesale Supply for Dealers and Distributors",
		keywords: [
			"wholesale cabinet supplier for dealers Florida",
			"cabinet wholesale distributor Florida",
			"cabinet dealer supply Central Florida",
			"import cabinet source for dealers Florida",
			"cabinet supply for resellers Florida",
			"wholesale cabinet source kitchen designers Florida"
		],
		areaServed: [{
			"@type": "State",
			name: "Florida"
		}]
	},
	{
		id: "restaurant-furniture",
		label: "Restaurant + Franchise Furniture",
		path: "/restaurant-franchise-furniture-packages/",
		aliases: ["/hospitality-furniture-packages/"],
		showInHeader: false,
		title: "Restaurant and Franchise Furniture | Asina Global",
		description: "Review restaurant, franchise, and rollout furniture packages with store count, quantity estimate, brand standards, mockup, QA, and shipping planning needs.",
		image: "/assets/supporting/furniture/velit/lounge-group.jpeg",
		imageAlt: "Commercial seating package reference for restaurant and franchise rollout review.",
		serviceType: "Restaurant and franchise furniture package supply",
		keywords: [
			"restaurant furniture packages",
			"commercial furniture supplier",
			"custom FF&E packages",
			"restaurant furniture bulk order",
			"franchise furniture rollout",
			"commercial FF&E sourcing"
		]
	},
	{
		id: "rfq",
		label: "RFQ Resources",
		path: "/rfq-procurement-resources/",
		showInHeader: false,
		title: "RFQ Checklist For Project Supply | Asina Global",
		description: "Prepare cabinet, countertop, and furniture package RFQs with project basics, quote inputs, lead-time factors, and drawings requested by email after review.",
		image: "/assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg",
		imageAlt: "Project supply desk prepared for cabinet, countertop, and furniture RFQ review.",
		serviceType: "Project supply RFQ support",
		keywords: [
			"RFQ for cabinets",
			"RFQ kitchen cabinet supplier",
			"cabinet RFI template",
			"RFP commercial furniture",
			"procurement risk reduction",
			"RFQ commercial furniture",
			"request cabinet quote"
		]
	},
	{
		id: "importer-resources",
		label: "Buyer Resources",
		path: "/project-supply-importer-resources/",
		showInHeader: false,
		title: "Importer and Landed Cost Resources | Asina Global",
		description: "Plan landed cost, order scale, lead time, QA, packing, and shipping responsibility before cabinet, countertop, or furniture quotes can move forward with Asina.",
		image: "/assets/catalog/countertops/extracted/page-06-img-01-obj-1756.jpg",
		imageAlt: "Project supply material detail prepared for importer resource planning.",
		serviceType: "Project supply importer resources",
		keywords: [
			"project supply importer resources",
			"landed cost cabinets",
			"container load cabinets wholesale",
			"wholesale cabinet MOQ",
			"cabinet lead time contractor",
			"imported cabinet quality",
			"import vs domestic cabinets cost",
			"FOB vs CIF cabinets",
			"DDP cabinets",
			"supplier of record"
		]
	},
	{
		id: "supplier-guide",
		label: "Wholesale Cabinet Supplier Guide",
		path: "/how-to-choose-wholesale-cabinet-supplier/",
		showInHeader: false,
		title: "How to Choose a Wholesale Cabinet Supplier | Contractor Guide 2026 | Asina Global",
		schemaBreadcrumbLabel: "How to Choose a Wholesale Cabinet Supplier",
		description: "Compare five wholesale cabinet supplier models for contractors in Central Florida by order size, lead time, service level, project fit, and QA ownership.",
		twitterDescription: "Five supplier models, five project types. A contractor's guide to choosing the right wholesale cabinet source in Central Florida.",
		image: "/assets/supporting/brand/asina-global-logo.svg",
		imageAlt: "Asina Global guide for choosing a wholesale cabinet supplier in Central Florida.",
		articleHeadline: "How to Choose a Wholesale Cabinet Supplier for Contractors and Developers (2026)",
		datePublished: "2026-06-05",
		dateModified: "2026-06-05",
		keywords: [
			"how to choose a wholesale cabinet supplier",
			"wholesale cabinet supplier for contractors",
			"contractor cabinet supplier guide",
			"Central Florida cabinet supplier models",
			"wholesale cabinet source developers"
		],
		areaServed: [{
			"@type": "AdministrativeArea",
			name: "Central Florida"
		}, {
			"@type": "State",
			name: "Florida"
		}]
	},
	{
		id: "supplier-comparison",
		label: "Supplier Comparison",
		path: "/wholesale-cabinet-suppliers-central-florida/",
		showInHeader: false,
		title: "Wholesale Cabinet Suppliers Central FL | Asina Global",
		description: "Compare wholesale cabinet suppliers in Central Florida by model, lead time, supply path, project fit, contractor needs, and developer-scale buying needs.",
		image: "/assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
		imageAlt: "Cabinet package room prepared for Central Florida wholesale cabinet supplier comparison.",
		articleHeadline: "Wholesale Cabinet Suppliers in Central Florida Compared for Contractors",
		keywords: [
			"wholesale cabinet suppliers Central Florida",
			"wholesale cabinets Orlando contractor",
			"bulk cabinet supplier Central Florida",
			"wholesale cabinet supply Florida contractor",
			"ELLIE Cabinetry vs Asina Global",
			"KitchenCrest alternatives Florida",
			"ROC Cabinetry alternatives Florida"
		],
		areaServed: [{
			"@type": "AdministrativeArea",
			name: "Central Florida"
		}, {
			"@type": "State",
			name: "Florida"
		}]
	},
	{
		id: "container-economics",
		label: "Container Math",
		path: "/how-many-kitchens-fit-40ft-container/",
		showInHeader: false,
		title: "40ft Container Cabinet Loading | Asina Global",
		description: "Plan how kitchen cabinet boxes, mixed SKUs, packing, and project scale affect 40ft container loading before Asina reviews cabinet pricing and quote fit.",
		image: "/assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
		imageAlt: "Cabinet package room used for 40ft container loading and project scale planning.",
		serviceType: "Cabinet container loading planning",
		keywords: [
			"how many kitchens fit in a 40ft container",
			"40ft container cabinet loading",
			"cabinet MOQ wholesale",
			"container load cabinets wholesale",
			"cabinet import math",
			"multi-unit cabinet container"
		]
	},
	{
		id: "landed-cost",
		label: "Landed Cost",
		path: "/landed-cost-imported-cabinets/",
		showInHeader: false,
		title: "Landed Cost For Imported Cabinets | Asina Global",
		description: "Understand imported cabinet landed cost, including product scope, packing, freight, handling, delivery, responsibility, and project review inputs before quote.",
		image: "/assets/catalog/countertops/extracted/page-06-img-01-obj-1756.jpg",
		imageAlt: "Project supply material detail prepared for imported cabinet landed cost planning.",
		serviceType: "Imported cabinet landed cost planning",
		keywords: [
			"landed cost imported cabinets",
			"cabinet landed cost",
			"imported cabinet cost planning",
			"cabinet freight and handling",
			"cabinet import duty planning",
			"project supply cost picture"
		]
	},
	{
		id: "shipping-responsibility",
		label: "Shipping Terms",
		path: "/cabinet-import-shipping-responsibility/",
		showInHeader: false,
		title: "Cabinet Import Shipping Terms | Asina Global",
		description: "Compare FOB, CIF, DAP, DPU, and DDP planning language for cabinet imports before shipping responsibility enters the project quote review and planning.",
		image: "/assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg",
		imageAlt: "Installed project environment prepared for cabinet import shipping responsibility review.",
		serviceType: "Cabinet import shipping responsibility planning",
		keywords: [
			"FOB vs CIF cabinets",
			"DDP cabinet imports",
			"cabinet import shipping responsibility",
			"Incoterms 2020 cabinets",
			"cabinet freight quote",
			"shipping responsibility cabinet imports"
		]
	},
	{
		id: "imported-quality",
		label: "Imported Quality",
		path: "/imported-cabinet-quality-qa/",
		showInHeader: false,
		title: "Imported Cabinet Quality And QA | Asina Global",
		description: "Review how imported cabinet quality depends on material direction, mockup approval, production checks, packing review, and written documentation before release.",
		image: "/assets/catalog/cabinets/optimized/page-11-img-05-obj-1910.jpg",
		imageAlt: "Cabinet finish sample prepared for imported cabinet quality and QA review.",
		serviceType: "Imported cabinet quality and QA review",
		keywords: [
			"are imported cabinets good quality",
			"imported cabinet quality",
			"cabinet QA inspections",
			"CARB TSCA cabinet documents",
			"cabinet mockup approval",
			"import cabinet packing review"
		]
	},
	{
		id: "lead-times",
		label: "Lead Times",
		path: "/cabinet-lead-times-builders-import-stock/",
		showInHeader: false,
		title: "Cabinet Lead Times For Builders | Asina Global",
		description: "Plan cabinet lead times for builder projects by reviewing drawings, mockup approval, production, QA, freight, site readiness, and phasing needs before orders.",
		image: "/assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
		imageAlt: "Installed cabinet package used for builder lead time and phased delivery planning.",
		serviceType: "Builder cabinet lead time planning",
		keywords: [
			"cabinet lead time contractor",
			"cabinet lead times builders",
			"imported cabinet lead time",
			"phased cabinet delivery",
			"multi-unit cabinet schedule",
			"builder cabinet supply planning"
		]
	},
	{
		id: "import-vs-domestic",
		label: "Import vs Domestic",
		path: "/import-vs-domestic-cabinets-cost/",
		showInHeader: false,
		title: "Import vs Domestic Cabinets Cost | Asina Global",
		schemaBreadcrumbLabel: "Import vs. Domestic Cabinets: Cost Guide",
		articleHeadline: "Import vs. Domestic Cabinets: Cost Guide for Florida Contractors",
		datePublished: "2026-06-05",
		dateModified: "2026-06-05",
		description: "Compare import vs. domestic cabinet costs for Florida contractors — landed cost breakdown, Section 232 tariff impact, container-scale savings, lead times, QA, and repeatability.",
		image: "/assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg",
		imageAlt: "Project supply environment used for import versus domestic cabinet planning.",
		serviceType: "Import versus domestic cabinet planning",
		keywords: [
			"import vs domestic cabinets cost",
			"imported cabinets vs domestic",
			"domestic stock cabinets vs import",
			"cabinet supply cost comparison",
			"container scale cabinet supply",
			"project cabinet supply comparison"
		]
	},
	{
		id: "orlando",
		label: "Orlando Project Supply",
		path: "/orlando-commercial-project-supply/",
		showInHeader: false,
		title: "Orlando Commercial Project Supply | Asina Global",
		description: "Review Florida-based project supply support for Orlando-area and qualified nationwide buyers sourcing cabinets, countertops, and furniture packages by scope.",
		image: "/assets/catalog/cabinets/optimized/page-11-img-05-obj-1910.jpg",
		imageAlt: "Cabinet finish sample used for Florida-to-nationwide commercial project supply review.",
		serviceType: "Florida-to-nationwide commercial project supply",
		keywords: [
			"Orlando commercial cabinet supplier",
			"commercial cabinet supplier Florida",
			"contractor cabinet supply Orlando",
			"nationwide commercial cabinet supplier",
			"Orlando project supply",
			"Florida project supply",
			"nationwide project supply",
			"Orlando multi-unit cabinet packages",
			"Central Florida commercial furniture",
			"Orlando countertop supplier",
			"Central Florida cabinet procurement",
			"Central Florida countertop supplier"
		],
		areaServed: [
			{
				"@type": "City",
				name: "Orlando",
				address: {
					"@type": "PostalAddress",
					addressRegion: "FL",
					addressCountry: "US"
				}
			},
			{
				"@type": "City",
				name: "Longwood",
				address: {
					"@type": "PostalAddress",
					addressRegion: "FL",
					addressCountry: "US"
				}
			},
			{
				"@type": "AdministrativeArea",
				name: "Greater Orlando"
			},
			{
				"@type": "AdministrativeArea",
				name: "Central Florida"
			},
			{
				"@type": "Country",
				name: "United States"
			}
		]
	},
	{
		id: "commercial-mixed",
		label: "Commercial Cabinet + Countertop Supply",
		path: "/commercial-cabinet-countertop-supply-florida/",
		showInHeader: false,
		title: "Florida Cabinet & Countertop Supply | Asina Global",
		description: "Asina Global supplies commercial cabinet and countertop packages for Florida contractors, developers, and franchise buyers. Drawing review, QA, and shipping coordination included. Cabinets and quartz countertops from one supplier.",
		schemaDescription: "Asina Global supplies commercial cabinet and countertop packages for Florida contractors, developers, and franchise buyers. Drawing review, QA, and shipping coordination included.",
		image: "/assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg",
		imageAlt: "Commercial cabinet and countertop supply packet prepared for Florida project review.",
		articleHeadline: "Commercial Cabinet and Countertop Supply in Florida",
		datePublished: "2026-06-05",
		dateModified: "2026-06-05",
		articleAuthor: "Kim Nguyen",
		articleAuthorTitle: "Co-Founder, Asina Global",
		articleAuthorUrl: "https://asinaglobal.com/about/",
		serviceType: "Commercial cabinet and countertop supply",
		keywords: [
			"commercial cabinet and countertop supplier Florida",
			"commercial cabinet supplier Florida",
			"commercial countertop supplier Florida",
			"mixed-category commercial project supply",
			"Florida project supply review",
			"wholesale cabinet countertop supplier"
		],
		areaServed: [{
			"@type": "AdministrativeArea",
			name: "Florida"
		}, {
			"@type": "Country",
			name: "United States"
		}]
	},
	{
		id: "commercial-countertops",
		label: "Commercial Countertop Supply Orlando",
		path: "/commercial-countertop-supply-orlando/",
		showInHeader: false,
		title: "Commercial Countertop Supply Orlando | Asina Global",
		description: "Review Orlando and Florida commercial countertop supply by slab code, square footage, edge needs, cutouts, destination, and project timeline before pricing.",
		image: "/assets/pdf-extracted/countertops/exotic/9114-calacatta-storm-black-pdf-slab.jpg",
		imageAlt: "Quartz slab prepared for Orlando commercial countertop supply review.",
		serviceType: "Commercial countertop supply",
		keywords: [
			"commercial countertop supplier Orlando",
			"commercial countertops Greater Orlando",
			"quartz countertop supply Orlando",
			"restaurant countertop supplier Orlando",
			"hotel countertop supply Florida",
			"countertop slab supply Florida"
		],
		areaServed: [
			{
				"@type": "City",
				name: "Orlando"
			},
			{
				"@type": "AdministrativeArea",
				name: "Greater Orlando"
			},
			{
				"@type": "AdministrativeArea",
				name: "Florida"
			}
		]
	},
	{
		id: "hospitality-ffe",
		label: "Hospitality Furniture Packages",
		path: "/hospitality-ffe-furniture-packages-florida/",
		showInHeader: false,
		title: "Hospitality Furniture Packages Florida | Asina Global",
		description: "Plan hospitality furniture package review for Florida projects with quantity, brand standards, floor plan, samples, packing, and shipping needs before pricing.",
		image: "/assets/supporting/furniture/velit/terrace-lounge.jpeg",
		imageAlt: "Hospitality furniture package reference prepared for project review.",
		serviceType: "Hospitality furniture package supply",
		keywords: [
			"hospitality furniture packages Florida",
			"commercial FF&E packages",
			"hospitality FF&E supplier Florida",
			"restaurant furniture packages Florida",
			"hotel furniture package review",
			"custom commercial furniture Florida"
		],
		areaServed: [{
			"@type": "AdministrativeArea",
			name: "Florida"
		}, {
			"@type": "Country",
			name: "United States"
		}]
	},
	{
		id: "multifamily-supply",
		label: "Multifamily Cabinet + Countertop Supply",
		path: "/multifamily-cabinet-countertop-supply-florida/",
		showInHeader: false,
		title: "Multifamily Cabinet Countertop Supply | Asina Global",
		description: "Plan Florida multifamily cabinet and countertop supply by unit count, finish schedule, mockup approval, QA, packing, and phase timing needs before pricing.",
		image: "/assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
		imageAlt: "Multifamily cabinet and countertop package prepared for Florida development review.",
		serviceType: "Multifamily cabinet and countertop supply",
		keywords: [
			"multifamily cabinet supplier Florida",
			"multifamily countertop supply Florida",
			"apartment cabinet countertop packages",
			"developer cabinet procurement Florida",
			"multi-family cabinet packages",
			"Florida development project supply"
		],
		areaServed: [{
			"@type": "AdministrativeArea",
			name: "Florida"
		}, {
			"@type": "Country",
			name: "United States"
		}]
	},
	{
		id: "cabinet-malibu",
		label: "Malibu Cabinets",
		path: "/cabinets/malibu/",
		showInHeader: false,
		title: "Malibu Cabinet Collection | Asina Global",
		description: "Review Malibu cabinet finishes, painted shaker style, 5/8-inch premium plywood panels, face material, quote inputs, and project supply fit for builders.",
		image: "/assets/catalog/cabinets/optimized/page-07-img-02-obj-1858.jpg",
		imageAlt: "Malibu cabinet collection finish wall prepared for project review.",
		serviceType: "Malibu cabinet collection supply",
		keywords: [
			"Malibu cabinets",
			"painted shaker cabinets",
			"Malibu cabinet collection",
			"5/8-inch premium plywood panels"
		]
	},
	{
		id: "cabinet-monterey",
		label: "Monterey Cabinets",
		path: "/cabinets/monterey/",
		showInHeader: false,
		title: "Monterey Cabinet Collection | Asina Global",
		description: "Review Monterey cabinet finishes, construction facts, face material, panel platform, quote inputs, and project fit for repeat commercial rooms and builders.",
		image: "/assets/catalog/cabinets/optimized/page-11-img-05-obj-1910.jpg",
		imageAlt: "Monterey cabinet finish sample prepared for project review.",
		serviceType: "Monterey cabinet collection supply",
		keywords: [
			"Monterey cabinets",
			"stained wood cabinets",
			"Monterey cabinet collection",
			"premium plywood cabinet panels"
		]
	},
	{
		id: "cabinet-newport",
		label: "Newport Cabinets",
		path: "/cabinets/newport/",
		showInHeader: false,
		title: "Newport Cabinet Collection | Asina Global",
		description: "Review Newport cabinet finishes, construction facts, face material, panel platform, quote inputs, and project fit for modern commercial rooms and builders.",
		image: "/assets/catalog/cabinets/optimized/page-17-img-02-obj-1981.jpg",
		imageAlt: "Newport cabinet finish prepared for commercial project review.",
		serviceType: "Newport cabinet collection supply",
		keywords: [
			"Newport cabinets",
			"Newport cabinet collection",
			"commercial cabinet finishes",
			"premium plywood cabinets"
		]
	},
	{
		id: "cabinet-catalina",
		label: "Catalina Cabinets",
		path: "/cabinets/catalina/",
		showInHeader: false,
		title: "Catalina Cabinet Collection | Asina Global",
		description: "Review Catalina cabinet finishes, construction facts, face material, panel platform, quote inputs, and project fit for repeat supply needs and builders.",
		image: "/assets/catalog/cabinets/optimized/page-20-img-03-obj-2042.jpg",
		imageAlt: "Catalina cabinet finish prepared for repeat project review.",
		serviceType: "Catalina cabinet collection supply",
		keywords: [
			"Catalina cabinets",
			"Catalina cabinet collection",
			"repeat cabinet packages",
			"premium plywood cabinet supply"
		]
	},
	{
		id: "cabinet-laguna",
		label: "Laguna Cabinets",
		path: "/cabinets/laguna/",
		showInHeader: false,
		title: "Laguna Cabinet Collection | Asina Global",
		description: "Review Laguna cabinet finishes, construction facts, face material, panel platform, quote inputs, and project fit for developer supply needs and builders.",
		image: "/assets/catalog/cabinets/optimized/page-23-img-04-obj-2077.jpg",
		imageAlt: "Laguna cabinet finish prepared for developer supply review.",
		serviceType: "Laguna cabinet collection supply",
		keywords: [
			"Laguna cabinets",
			"Laguna cabinet collection",
			"developer cabinet supply",
			"premium plywood panels"
		]
	},
	{
		id: "cabinet-jersey",
		label: "Jersey Cabinets",
		path: "/cabinets/jersey/",
		showInHeader: false,
		title: "Jersey Cabinet Collection | Asina Global",
		description: "Review Jersey cabinet finishes, construction facts, face material, panel platform, quote inputs, and fit for project-scale cabinet supply and builders.",
		image: "/assets/catalog/cabinets/optimized/page-25-img-04-obj-2102.jpg",
		imageAlt: "Jersey cabinet finish prepared for project-scale supply review.",
		serviceType: "Jersey cabinet collection supply",
		keywords: [
			"Jersey cabinets",
			"Jersey cabinet collection",
			"project cabinet supply",
			"premium plywood cabinet panels"
		]
	},
	{
		id: "countertop-quartz-codes",
		label: "Quartz Slab Codes",
		path: "/countertops/quartz-slab-codes/",
		showInHeader: false,
		title: "Quartz Slab Codes | Asina Global",
		description: "Review Asina Global quartz slab codes by collection, movement, slab facts, quote inputs, and commercial countertop project supply fit before pricing review.",
		image: "/assets/pdf-extracted/countertops/exotic/9114-calacatta-storm-black-pdf-slab.jpg",
		imageAlt: "Quartz slab code ledger prepared for project review.",
		serviceType: "Quartz slab code review",
		keywords: [
			"quartz slab codes",
			"quartz slab supplier",
			"commercial quartz slab supply",
			"countertop code list"
		]
	},
	{
		id: "countertop-exotic",
		label: "Exotic Quartz Slabs",
		path: "/countertops/exotic-quartz-slabs/",
		showInHeader: false,
		title: "Exotic Quartz Slabs | Asina Global",
		description: "Review Exotic quartz slabs by code, high-contrast movement, slab facts, quote inputs, and commercial countertop project supply fit before project pricing.",
		image: "/assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-04.jpg",
		imageAlt: "Exotic quartz slab collection prepared for project review.",
		serviceType: "Exotic quartz slab supply",
		keywords: [
			"Exotic quartz slabs",
			"dramatic quartz slabs",
			"commercial quartz slabs",
			"Exotic countertop collection"
		]
	},
	{
		id: "countertop-natural",
		label: "Natural Quartz Slabs",
		path: "/countertops/natural-quartz-slabs/",
		showInHeader: false,
		title: "Natural Quartz Slabs | Asina Global",
		description: "Review Natural quartz slabs by code, softer movement, slab facts, size, thickness, quote inputs, and commercial countertop project supply fit before pricing.",
		image: "/assets/catalog/countertops/lifestyle/natural/natural-lifestyle-01.jpg",
		imageAlt: "Natural quartz slab collection prepared for project review.",
		serviceType: "Natural quartz slab supply",
		keywords: [
			"Natural quartz slabs",
			"natural quartz collection",
			"commercial countertop slabs",
			"quartz slab supply"
		]
	},
	{
		id: "countertop-grain",
		label: "Grain Quartz Slabs",
		path: "/countertops/grain-quartz-slabs/",
		showInHeader: false,
		title: "Grain Quartz Slabs | Asina Global",
		description: "Review Grain quartz slabs by code, quieter movement, slab facts, size, thickness, quote inputs, and commercial countertop project supply fit before pricing.",
		image: "/assets/catalog/countertops/lifestyle/grain/grain-lifestyle-01.jpg",
		imageAlt: "Grain quartz slab collection prepared for project review.",
		serviceType: "Grain quartz slab supply",
		keywords: [
			"Grain quartz slabs",
			"grain quartz collection",
			"quiet quartz movement",
			"commercial quartz slab supply"
		]
	}
];
var pageIds = new Set(pages.map((page) => page.id));
var pageFaqs = {
	home: [
		["Do you publish pricing?", "No. Pricing depends on drawings, quantity, materials, finish, timeline, packing, shipping, and agreed trade terms."],
		["What order size works best?", "Wholesale value is usually strongest at 40ft container scale. Asina can review smaller trial runs when they lead to future volume."],
		["Can smaller trial orders be reviewed?", "Yes, when they lead to future wholesale, multi-unit, franchise, commercial, or repeat-project volume. Smaller orders may not keep the same savings after shipping and logistics."],
		["How are drawings handled?", "Start with project basics only. If the project looks like a fit, Asina requests drawings and specs by email."],
		["Do you accept public uploads?", "No. The form does not accept uploads. Asina requests drawings, specs, plans, brand standards, and furniture files by email after the first review."],
		["Do you disclose production sources?", "No. Asina acts as supplier of record and protects private source relationships while managing communication, QA, and accountability."],
		["Who handles shipping?", "Asina reviews shipping responsibility during consultation and can provide freight quotes based on destination, responsibility level, delivery needs, and agreed trade terms."],
		["How long does shipping take?", "When DAP is the agreed term, transit planning is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast. Orders usually move in 20-foot or 40-foot containers."],
		["What Incoterms may apply?", "Common project discussions may include EXW, FOB, CIF, DAP, DPU, or DDP. Final responsibility follows the agreed Incoterms® 2020 rule in the project quote."],
		["What is a typical project timeline?", "Consultation and design finalization usually take about 3 weeks. Production usually takes about 40 to 50 days, depending on capacity, order complexity, and approved details."],
		["What happens after I submit project basics?", "Asina reviews the details and follows up by email within 1-2 business days. If the project is a fit, Asina requests drawings or specs next."],
		["How does mockup approval reduce risk?", "A mockup or sample package confirms measurements, material direction, color, finish, and details before repeat production begins."]
	],
	cabinets: [
		["What drawings are needed?", "Cabinet runs, room plans, vanity needs, finish direction, unit count, and timeline are enough to start review."],
		["Which collections are available?", "Malibu, Monterey, Newport, Catalina, Laguna, and Jersey are available for cabinet project review."],
		["Which panel platforms are available?", "Framed collections use the published 5/8-inch premium plywood panels. Frameless collections use the published 3/4-inch premium plywood panels where shown in the collection facts."],
		["How much fits in a cabinet container?", "A 40HC container typically fits about 700 to 800 cabinet boxes. A 20-foot container typically fits about 370 boxes. Final capacity depends on the mix of sizes and product types."],
		["How long does cabinet shipping take?", "Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast. Orders usually move in 20-foot or 40-foot containers."],
		["How are finishes confirmed?", "Asina reviews finish direction before sample or mockup approval, then checks production against the approved reference."],
		["What does mockup approval cover?", "Mockup approval confirms measurements, color, finish, materials, and details before repeat production."],
		["What should buyers send for pricing?", "Send finish choice, room type, cabinet run, unit count, timeline, and any vanity, pantry, wall, base, or tall-unit requirements."]
	],
	countertops: [
		["What details affect quote readiness?", "Slab name, square footage, edge profile, sink or cooktop cutouts, destination, and timeline."],
		["What slab sizes are available?", "Collection facts include 126 x 63 inches, 137 x 78 inches, 3200 x 1600mm, or 3500 x 2000mm where published."],
		["What thickness is available?", "Published slabs include 20mm and, for selected collections, 30mm. Asina confirms final availability during project review."],
		["How should edge profiles be handled?", "Send the desired edge profile, finished square footage, sink or cooktop cutouts, and timeline so Asina can prepare the pricing review."],
		["Can countertops be coordinated with cabinets?", "Yes. Asina can review countertops and cabinets as one project path, not as a retail bundle."],
		["How is slab movement evaluated?", "The slab view keeps the image beside the specs so bold, quiet, and uniform surfaces can be matched to project needs."]
	],
	furniture: [
		["Are minimums fixed?", "Minimums vary by product type, design complexity, material, finish, and production requirements."],
		["Can Asina review franchise standards?", "Yes. Brand requirements and store counts are central inputs for furniture package review."],
		["What files help the review?", "Brand standards, look-and-feel references, chair or table files, floor plans, seating layouts, quantity estimates, finish direction, and timeline."],
		["How do samples or mockups work?", "A mockup or sample approval step can confirm dimensions, materials, finishes, and details before repeat production."],
		["What makes repeat rollout different?", "The first package becomes the production reference for later stores, phases, packing plans, and shipping coordination."],
		["Are products shoppable?", "No. Asina reviews furniture as a custom package, not as a retail catalog."]
	],
	qa: [
		["Who handles shipping?", "Asina reviews shipping responsibility during consultation and can provide freight quotes through partners where applicable."],
		["How long does shipping take?", "Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast. Orders usually move in 20-foot or 40-foot containers."],
		["What Incoterms can apply?", "Common terms may include EXW, FOB, CIF, DAP, DPU, and DDP. Final responsibility, risk, cost, and delivery terms follow the agreed Incoterms® 2020 rule in the project quote."],
		["How does Asina reduce measurement risk?", "Asina reviews drawings before production language is finalized, and mockup approval creates a reference before repeat production."],
		["How are finishes checked?", "Asina checks finish and color direction against the approved sample or mockup during production QA."],
		["How is moisture risk reduced during shipping?", "Asina can place continuous lines of desiccant bags or silica gel packets along both sides of the container to absorb humidity and reduce condensation, mold, and moisture damage in transit."],
		["What packing risks does Asina check?", "Asina can review item count, organization, labels or instructions, added protection, and shipment readiness."],
		["Why no source disclosure?", "Asina protects its supply network and manages accountability through its role as supplier of record."]
	],
	about: [
		["Who is Asina built for?", "Builders, developers, procurement teams, general contractors, restaurant groups, franchise operators, and rollout buyers with project-scale or repeat-project needs."],
		["Is Asina a retail remodeling catalog?", "No. Asina shows cabinet, countertop, and furniture package options so qualified buyers can prepare a project review, not shop a cart."],
		["Does Asina disclose private production sources?", "No. Asina acts as supplier of record and does not disclose private production sources or supplier relationships."],
		["Can one project include multiple categories?", "Yes. Asina can review cabinets, countertops, and custom furniture together when one coordinated supply review makes the scope clearer."],
		["What happens after project basics are sent?", "Asina reviews the details and follows up by email within 1-2 business days. If the project is a fit, Asina requests drawings or specs next."],
		["Where is Asina Global LLC based?", "Asina Global LLC is based in Longwood, Florida, in the Greater Orlando market, and can coordinate qualified project work nationwide."]
	],
	design: [
		["Is this interior design?", "Not as a standalone decorating service. This is production support for projects that need layout, finish, custom sizing, or brand intent translated into supply-review detail."],
		["When should we use it?", "Use it before quote and production details become fixed, especially for mixed-category rooms, finish matching, restaurant packages, franchise standards, or custom dimensions."],
		["Can custom sizing be reviewed?", "Yes. Asina can review custom sizing and specifications by product category, drawings, order scale, minimums, and production feasibility."],
		["What files help the review?", "Floor plans, seating layouts, finish direction, brand standards, product references, chair or table files, unit or store counts, and timeline."],
		["How does it connect to mockup approval?", "The approved direction becomes the reference for mockup or sample review so measurements, color, finish, materials, and details are checked before repeat production."],
		["Do we upload files publicly?", "No. Asina requests drawings, specs, plans, brand standards, and furniture files by email after the first review."]
	],
	contact: [
		["What is the best first step?", "Start with the project basics form. If the project fits the supply model, Asina follows up by email or phone and requests detailed files by email."],
		["Can I call Asina Global LLC?", "Yes. Call 407-743-7473 during business hours for project supply questions, or use the form when you want the details organized before follow-up."],
		["Where is the office located?", "Asina Global LLC lists its office in Longwood, Florida at 151 Sabal Palm Dr, Longwood, FL 32779."],
		["Do you accept public file uploads?", "No. Asina requests drawings, plans, specs, brand standards, and furniture files by email after the first project fit check."]
	],
	privacy: [
		["What information does the project form collect?", "The form collects contact details, company information, project type, product category, location, scale, timeline, and notes needed for the first project review."],
		["Does Asina sell personal information?", "No. Asina Global LLC does not sell personal information submitted through the website or project review form."],
		["Are drawings uploaded through the website?", "No. The website form does not accept public uploads. Asina requests drawings, plans, specs, and files by email only after the first project fit check."],
		["Who can I contact about privacy requests?", "Email asinaglobal@gmail.com or call 407-743-7473 to request an update, correction, or deletion of information submitted through the website."]
	],
	"buyer-paths": [
		["What is the buyer paths page for?", "It helps project buyers choose the right Asina route before sending project basics, drawings, specs, or package details."],
		["Does it replace the project review form?", "No. It organizes the options. The Project Review form is still the first step when a buyer is ready to send basics."],
		["Can one project use multiple paths?", "Yes. A single review can connect cabinets, countertops, furniture packages, RFQ prep, QA, shipping, and commercial pages when that makes the scope clearer."],
		["Are drawings uploaded on this page?", "No. Start with basics. Asina requests drawings and specs by email after checking whether the project is a fit."]
	],
	"multi-unit": [
		["What makes a cabinet order a fit?", "A strong fit is a repeatable room, unit, phase, venue, or builder package where Asina can review finish direction, cabinet run, and quantity together."],
		["Do you publish multi-unit pricing?", "No. Pricing depends on drawings, quantities, finishes, construction details, packing, shipping, and agreed project terms."],
		["Can Asina review cabinet collections before drawings?", "Yes. Start with the category, room type, finish direction, unit count, location, and timeline. Asina requests drawings by email after the first review."],
		["How does mockup approval help?", "A mockup or sample confirms measurements, color, finish, materials, and details before repeat production begins."]
	],
	"dealer-supply": [
		["Does Asina compete with my direct clients?", "No. Asina is a wholesale supplier — we work through dealers, not around them. We do not contact dealer clients directly or quote to the same buyer a dealer has brought to us."],
		["What is the minimum order for a dealer account?", "There is no formal minimum, but container-scale quantities — a full or near-full 40ft container equivalent — are where the economics are strongest. Smaller dealer orders are reviewed case by case."],
		["How does pricing work for a dealer account?", "Pricing is per project, based on cabinet specifications, quantity, and shipping terms. Submit a project review with your client's drawing set and Asina will respond with a proposal."],
		["What lead times should a dealer communicate to their client?", "8–14 weeks from drawing approval and deposit. This is an import production timeline, not a stock pull. Plan and communicate accordingly."],
		["What Incoterms does Asina offer?", "FOB, CIF, DAP, DPU, and DDP are available depending on the project. Full shipping responsibility planning is covered in the QA and shipping page."]
	],
	"restaurant-furniture": [
		["What projects fit this page?", "Restaurants, franchise rollouts, commercial venues, outdoor areas, and repeat-location furniture packages."],
		["What furniture can Asina review?", "Asina can review tables, chairs, stools, table bases, benches, booths, outdoor groups, and custom branded pieces by project fit."],
		["Do you show a public furniture menu?", "No. Examples show package direction. Pricing and production depend on quantities, materials, finish direction, minimums, packing, and shipping."],
		["When is a sample needed?", "A sample or mockup is useful when dimensions, color, finish, material, comfort, or brand consistency needs confirmation before repeat production."]
	],
	rfq: [
		["Should drawings be uploaded here?", "No. Start with project basics. Asina requests drawings and specs by email after the first review."],
		["What affects pricing most?", "Quantity, finish direction, material, product category, custom sizing, packing, shipping destination, timeline, and approved details."],
		["Can one RFQ include multiple categories?", "Yes. Asina can review cabinets, countertops, and furniture packages together when one organized review helps the project."],
		["Is this a bid template download?", "The checklist is available directly on the page. Downloadable templates can support it later, but the main guidance stays on the page."]
	],
	"importer-resources": [
		["What is landed cost in a project supply review?", "Landed cost is the working cost picture after product scope, freight, packing, handling, delivery, and responsibility level sit in one review. It gives buyers a clearer starting point than a low unit price that leaves major costs out of the first quote."],
		["Do I need a full container to start?", "Not always. Full-container planning usually gives the strongest value, but Asina can review smaller trial runs when they connect to future multi-unit, franchise, commercial, or repeat-project volume."],
		["Can styles or SKUs be mixed in one project package?", "Often yes, but the mix affects packing, container fit, count review, and quote quality. Send the expected styles, sizes, quantities, and phases before drawings move by email."],
		["How far ahead should a builder plan supply?", "Plan as early as possible once unit count, finish direction, and construction timing are known. Production, sample approval, freight planning, and jobsite readiness all affect the schedule."],
		["What happens if shipment timing changes?", "Asina reviews schedule risk during the project review. Buyers should share milestone dates, phase priorities, and any critical handoff dates before quote approval."],
		["How does Asina review quality before shipment?", "The process starts with drawings or specs by email. From there, Asina reviews sample or mockup approval where needed, production checks against approved details, packing, and shipment-readiness documentation."],
		["Who is responsible if product is damaged in transit?", "Responsibility depends on the agreed quote and shipping terms. Buyers should document visible damage, count issues, and packing concerns immediately so Asina can review the claim path."],
		["Do I need to manage Incoterms myself?", "Not at the first step. Start with the practical responsibility level you want. Asina can discuss common Incoterms® 2020 terms during quote review when precision is needed."],
		["Can Asina review a smaller first order?", "Yes, if it connects to future project volume. Smaller orders may not carry the same cost advantage after freight, packing, and handling, so the next phase should be clear."],
		["Can cabinets, countertops, and furniture be reviewed together?", "Yes. Mixed-scope projects can start in one Project Supply Review when the categories, quantities, destination, timeline, and file needs are clear."]
	],
	"supplier-guide": [
		["What is the difference between RTA and assembled cabinets for a multi-unit project?", "RTA cabinets require on-site assembly before installation — your crew boxes and builds each cabinet. Assembled cabinets arrive as complete units ready to hang. For multi-unit projects with tight installation schedules, assembled cabinets reduce on-site labor. Asina Global supplies assembled cabinets built to a drawing set, not flat-pack RTA boxes."],
		["How many units do I need for import cabinet pricing to make sense?", "Container-scale orders — enough to fill or nearly fill a 40ft container — are where per-unit import economics are strongest. Projects under 10 units may find that local stock suppliers are more practical given import lead times. A standard 40ft container holds approximately 15–22 complete kitchens depending on door style and cabinet count."],
		["Are imported cabinets subject to tariffs in 2026?", "Yes. A 25% Section 232 tariff on imported kitchen cabinets has been in effect since October 2025. Import project suppliers factor current tariff rates into their proposals. Verify the current tariff status directly with any import supplier before committing."],
		["Can one supplier handle cabinets, countertops, and furniture for a commercial project?", "Most cabinet suppliers cannot. Asina Global supplies cabinet packages, quartz countertop slabs, and custom commercial furniture packages from the same project review, which reduces procurement coordination for commercial projects that need all three categories."],
		["What lead time should I communicate to my GC for imported cabinets?", "Plan for 8–14 weeks from drawing approval and deposit to US delivery. Add 2–3 weeks of buffer for schedule uncertainty. Communicate the full timeline to your GC before drawings are finalized."]
	],
	"supplier-comparison": [
		["Who is this comparison for?", "It is for contractors, builders, developers, procurement teams, dealers, and repeat-project buyers comparing wholesale cabinet suppliers in Central Florida."],
		["Is Asina Global LLC included in the comparison?", "Yes. Asina Global LLC is one of the suppliers compared, and the page discloses that relationship at the top."],
		["Does the page publish competitor pricing?", "No. The page does not fabricate pricing. When public pricing is not listed, it treats pricing as not publicly listed and compares the buying model instead."],
		["When should a contractor choose a local RTA warehouse?", "A local RTA warehouse can make sense when the project needs fast stock, pickup, or a smaller order that does not justify import planning."],
		["When should a buyer review Asina Global LLC?", "Review Asina when the project has repeat rooms, developer or commercial scale, import planning time, and a need for mockup approval, QA, packing review, and supplier-of-record accountability."]
	],
	"container-economics": [
		["How many kitchens fit in a 40ft container?", "There is no single fixed count. Capacity depends on cabinet mix, box sizes, assembly state, packing protection, accessories, and whether the shipment includes other product categories."],
		["Can different SKUs or finishes be mixed?", "Often yes, but the mix affects packing, count review, container fit, and quote quality. Send the expected rooms, finishes, sizes, and quantities before drawings move by email."],
		["Is a full container required?", "Not always. Full-container planning usually gives the strongest value, while Asina can review smaller trial runs when they connect to future repeat volume."],
		["What should buyers send first?", "Send project category, room or unit count, finish direction, destination, timeline, and any known packing or phase needs."]
	],
	"landed-cost": [
		["What is landed cost for imported cabinets?", "Landed cost is the working cost picture after product scope, packing, freight, handling, delivery, and responsibility level sit in one review."],
		["Does Asina publish landed cost numbers?", "No. Costs depend on the project, product mix, destination, shipping responsibility, timing, and agreed quote terms."],
		["Can duties or tariffs change the cost picture?", "They can, where applicable. Any duty, tariff, or customs-related estimate needs project-specific review and should not be treated as legal, tax, or customs advice."],
		["What helps Asina review cost clearly?", "Send category, quantity or phase count, destination, timeline, material direction, packing needs, and the responsibility level you expect."]
	],
	"shipping-responsibility": [
		["What do FOB, CIF, DAP, DPU, and DDP change?", "They change how cost, delivery responsibility, risk transfer, unloading, clearance, and documentation are discussed in the project quote."],
		["Does Asina always quote DDP?", "No. Asina does not promise one public shipping model. The quote sets shipping responsibility and agreed terms."],
		["Who documents damage after delivery?", "The responsible party depends on the agreed quote and shipping terms. Buyers should document visible damage, count issues, and packing concerns immediately."],
		["Is this legal or freight advice?", "No. These summaries are for planning only. Final responsibility, risk, cost, and delivery terms follow the agreed project quote."]
	],
	"imported-quality": [
		["Are imported cabinets good quality?", "They can be when materials, approved details, mockup review, production checks, packing, and documentation are controlled before shipment."],
		["What quality issues should buyers watch for?", "Common concerns include finish mismatch, incorrect measurements, weak packing, missing details, unclear documents, and hardware or accessory substitutions."],
		["Can compliance documents be reviewed?", "Asina can discuss document needs during project review. Requirements may include CARB, TSCA, FSC, KCMA, or project-specific documentation where applicable."],
		["How does mockup approval help?", "A sample or mockup gives the project a reference for measurements, material direction, finish, color, and details before repeat production."]
	],
	"lead-times": [
		["How far ahead should builders plan cabinet supply?", "Plan as early as possible once unit count, finish direction, construction timing, and phase needs are known."],
		["Are imported cabinets faster than local stock?", "Not for urgent one-off needs. Imported supply usually makes sense when the project has enough planning time and repeat volume to justify the longer path."],
		["What affects cabinet lead time?", "Drawings, mockup approval, production capacity, order complexity, QA, packing, freight timing, site readiness, and phased delivery needs can all affect timing."],
		["Can deliveries be phased?", "Asina can review phasing when the project has clear milestones, room groups, unit counts, destination details, and a written quote path."]
	],
	"import-vs-domestic": [
		["What savings should commercial buyers realistically expect from imported cabinets?", "At full container scale with verified non-China origin product, net savings of 20 to 30 percent below comparable domestic distributor pricing can be realistic. The exact gap depends on spec, quantity, construction, freight, duties, QA, and agreed terms."],
		["When do domestic cabinets make sense?", "Domestic stock often fits urgent replacement work, small one-off jobs, local pickup, or projects where speed matters more than volume planning."],
		["When can imported cabinets make sense?", "Imported supply can make sense for repeat rooms, multi-unit work, planned developments, hospitality projects, franchise rollouts, and container-scale volume where the schedule supports production, QA, and freight."],
		["Are concerns about imported cabinet quality valid?", "Yes, when import purchases are unmanaged. Material uncertainty, weak construction, finish mismatch, and poor packing are real risks without mockup approval, production QA, packing review, and a supplier of record."],
		["Does Section 301 apply to cabinets from Vietnam and Malaysia?", "Section 301 is tied to Chinese-origin goods when the HTS classification is covered. Vietnam and Malaysia product still needs origin verification, especially when Chinese cabinet components are involved."],
		["Does Asina guarantee savings?", "No. Cost advantage depends on product scope, quantities, verified construction, packing, freight, responsibility level, timing, tariff exposure, and agreed quote terms."],
		["What should buyers compare before deciding?", "Compare total landed cost, timeline, QA path, finish consistency, repeatability, packing, delivery responsibility, and the supplier accountability behind the quote."]
	],
	orlando: [
		["Is Asina Global LLC located in Orlando?", "Asina Global LLC's office is in Longwood, Florida, within the Greater Orlando market. NAP and schema use the same business address."],
		["What Orlando-area projects fit?", "Multi-unit, commercial, development, franchise, restaurant, and repeat-project supply inquiries are usually the best fit."],
		["Is Asina an Orlando RTA cabinets warehouse?", "No. Buyers comparing Orlando RTA cabinets or RTA cabinets Orlando should know Asina is a project-supply review company, not an in-stock retail warehouse."],
		["Does Asina review nearby commercial searches?", "Yes, when the project is a fit. Asina can review Longwood cabinet supplier, Longwood project supply, Longwood furniture supplier, Altamonte Springs cabinet packages, Altamonte Springs commercial cabinet supplier, and Lake Mary cabinet supplier inquiries for commercial or repeat-project work."],
		["Is this a cheap cabinets Orlando or kitchen cabinets sale page?", "No. Asina is not built around discount retail sale language. Pricing depends on drawings, quantities, finishes, construction details, packing, shipping, and agreed project terms."],
		["Can Asina Global LLC review projects outside Florida?", "Yes. Asina Global LLC can review qualified nationwide commercial and project-scale inquiries when the scope fits the supply model."],
		["Does Asina operate like a local showroom?", "No. The public process starts with project basics, then drawings and specs by email when the project is a fit."],
		["Can cabinets, countertops, and furniture be reviewed together?", "Yes. Mixed-category projects can start through the same Project Review when one coordinated review makes sense."]
	],
	"commercial-mixed": [
		["What projects fit this page?", "Florida builders, developers, hospitality buyers, restaurant groups, and procurement teams with cabinet and countertop scope are usually the best fit."],
		["Is this a retail showroom page?", "No. Asina reviews project-scale supply, quote inputs, mockup approval, QA, packing, and shipping responsibility before pricing."],
		["Can cabinets and countertops be reviewed together?", "Yes. Mixed-category projects can start in one Project Review when one organized review would make the scope clearer."],
		["When are drawings requested?", "Project basics come first. Asina requests drawings or specs by email after the first review when the project is a fit."]
	],
	"commercial-countertops": [
		["What commercial countertop projects fit?", "Asina can review restaurants, hotels, apartments, bars, amenity spaces, and repeat commercial interiors when slab and scope details are clear."],
		["What should buyers send first?", "Send slab name or code, square footage, edge profile, cutouts, destination, timeline, and whether cabinets are part of the scope."],
		["Is Asina a countertop installer?", "This page is for countertop supply review. Asina can discuss installation details only when they affect scope, responsibility, or project coordination."],
		["Where is Asina Global LLC based?", "Asina Global LLC's office is in Longwood, within the Greater Orlando market, and Asina Global LLC can review qualified Florida or nationwide projects."]
	],
	"hospitality-ffe": [
		["Is this a public FF&E catalog?", "No. The page is for package review, not item-by-item shopping. Quantity, brand standards, floor plan, finish direction, samples, and shipping shape the review."],
		["What hospitality projects fit?", "Asina can review restaurant, hotel, outdoor, amenity, franchise, and repeat-location furniture packages by project fit."],
		["What does Asina need first?", "Store or room count, quantity estimate, brand standards, floor plan, seating layout, finish direction, durability needs, and timeline."],
		["When is a sample useful?", "A sample or mockup is useful when dimensions, color, finish, material, durability, or brand consistency needs confirmation before repeat production."]
	],
	"multifamily-supply": [
		["What multifamily projects fit?", "Apartments, phased developments, repeat rooms, model units, and amenity spaces are strong fits when unit count and finish direction are clear."],
		["What should a developer send first?", "Send unit count, finish schedule, cabinet run, slab direction, phase timing, destination, and whether a model unit or mockup is planned."],
		["Can domestic stock make more sense?", "Yes. Urgent or small work may fit domestic stock better. Asina reviews whether import planning is practical for the actual schedule and volume."],
		["How does repeatability reduce risk?", "The approved sample or mockup gives later units and phases a reference for QA, packing, and shipping responsibility."]
	],
	"cabinet-malibu": [
		["What is Malibu best for?", "Malibu fits painted shaker cabinet projects that need a bright, familiar face with repeatable finish direction."],
		["What panel language applies?", "Malibu uses 5/8-inch premium plywood panels in the published public material language."],
		["What should buyers send?", "Send finish choice, room type, cabinet run, unit count, location, timeline, and any known approval or packing needs."]
	],
	"cabinet-monterey": [
		["What is Monterey best for?", "Monterey fits projects that need a warmer cabinet direction and finish facts before drawings move into quote review."],
		["What should buyers send?", "Send finish choice, room type, cabinet run, unit count, location, timeline, and any known approval or packing needs."],
		["Can Monterey be reviewed for commercial rooms?", "Yes. Asina reviews the collection by project fit, quantity, finish direction, mockup needs, QA, and shipping responsibility."]
	],
	"cabinet-newport": [
		["What is Newport best for?", "Newport fits commercial rooms and repeat spaces that need collection facts before quote review."],
		["What should buyers send?", "Send finish choice, room type, cabinet run, unit count, location, timeline, and any known approval or packing needs."],
		["Does Asina publish collection pricing?", "No. Pricing depends on drawings, quantities, finishes, construction details, packing, shipping, and agreed terms."]
	],
	"cabinet-catalina": [
		["What is Catalina best for?", "Catalina fits repeat supply when finish direction, cabinet run, and quantity are ready for a first project check."],
		["What should buyers send?", "Send finish choice, room type, cabinet run, unit count, location, timeline, and any known approval or packing needs."],
		["How does mockup approval apply?", "A mockup or sample confirms measurements, color, finish, material, and details before repeat production begins."]
	],
	"cabinet-laguna": [
		["What is Laguna best for?", "Laguna fits developer and commercial supply when collection facts and quote inputs need to be clear before pricing."],
		["What should buyers send?", "Send finish choice, room type, cabinet run, unit count, location, timeline, and any known approval or packing needs."],
		["Can Laguna be part of a mixed-scope project?", "Yes. Asina can review cabinet and countertop scope together when one organized review makes sense."]
	],
	"cabinet-jersey": [
		["What is Jersey best for?", "Jersey fits project-scale supply when finish direction, construction facts, and quantity are ready for pricing review."],
		["What should buyers send?", "Send finish choice, room type, cabinet run, unit count, location, timeline, and any known approval or packing needs."],
		["Does Asina disclose production sources?", "No. Asina acts as supplier of record and protects private source relationships while managing the project review."]
	],
	"countertop-quartz-codes": [
		["Why use slab codes?", "Codes identify the selected slab by collection, movement, size, thickness, square footage, edge needs, cutouts, and quote review."],
		["Can a buyer send only a slab name?", "A slab name helps, but a code is better when available. Square footage, edge profile, cutouts, destination, and timeline are also needed."],
		["Can countertops move with cabinets?", "Yes. Countertop review can be coordinated with cabinet packages when one supply review would make the project clearer."]
	],
	"countertop-exotic": [
		["What is Exotic best for?", "Exotic is best for high-visibility counters, islands, bars, and commercial rooms where stronger quartz movement matters."],
		["What should buyers send?", "Send slab code, square footage, edge profile, cutouts, destination, timeline, and whether cabinets are part of the scope."],
		["Does Asina show every slab in the quote?", "The selected code anchors the review. Final availability and quote details depend on project review."]
	],
	"countertop-natural": [
		["What is Natural best for?", "Natural is best for projects that want a quartz surface with a softer natural-stone read and practical project facts."],
		["What should buyers send?", "Send slab code, square footage, edge profile, cutouts, destination, timeline, and whether cabinets are part of the scope."],
		["Can Natural slabs fit commercial rooms?", "Yes. Asina reviews use case, square footage, edge needs, packing, and shipping responsibility before pricing."]
	],
	"countertop-grain": [
		["What is Grain best for?", "Grain is best for quieter commercial surfaces, repeat interiors, and rooms where the slab should support the space without taking over."],
		["What should buyers send?", "Send slab code, square footage, edge profile, cutouts, destination, timeline, and whether cabinets are part of the scope."],
		["Can Grain slabs be used with cabinet packages?", "Yes. Asina can review countertop and cabinet scope together when one supply review makes the project clearer."]
	]
};
var siteOrigin = "https://asinaglobal.com";
var siteDetails = {
	name: "Asina Global",
	legalName: "Asina Global LLC",
	origin: siteOrigin,
	email: "asinaglobal@gmail.com",
	googleBusinessProfile: "https://maps.app.goo.gl/WsPbwyXMaGTXLbdt5",
	address: {
		streetAddress: "151 Sabal Palm Dr",
		addressLocality: "Longwood",
		addressRegion: "FL",
		postalCode: "32779",
		addressCountry: "US"
	},
	logo: "/assets/supporting/brand/asina-global-logo.svg",
	socialImage: defaultSocialImage,
	mark: "/assets/supporting/brand/asina-mark.svg",
	foundingDate: "2026-04-13",
	priceRange: "$$",
	geo: {
		latitude: 28.703102,
		longitude: -81.417381
	},
	areaServed: [
		{
			"@type": "City",
			name: "Orlando"
		},
		{
			"@type": "City",
			name: "Longwood"
		},
		{
			"@type": "State",
			name: "Florida"
		},
		{
			"@type": "Country",
			name: "United States"
		}
	],
	businessHours: {
		label: "Monday-Friday, 9:00 AM-5:00 PM",
		days: [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday"
		],
		opens: "09:00",
		closes: "17:00"
	},
	appointmentText: "Project reviews by appointment after initial email review.",
	authorName: "Chuck Tran",
	leadership: [
		{
			name: "Chuck Tran",
			title: "Founder",
			background: "Real estate experience and project supply review, with buyer coordination through accountable handoff.",
			experience: "35 Under 35 Realtor; project supply coordination",
			photo: "/assets/supporting/team/chuck-tran.jpg",
			photoWidth: 960,
			photoHeight: 960,
			photoPosition: "center 42%",
			initials: "CT"
		},
		{
			name: "Hai Ho",
			title: "Co-Founder",
			background: "Real estate and supplier-of-record support for project buyers, with operations coordination through review.",
			experience: "Top 300 Realtor in the Panhandle; operations support",
			photo: "/assets/supporting/team/hai-ho.jpg",
			photoWidth: 512,
			photoHeight: 512,
			photoPosition: "center 42%",
			initials: "HH"
		},
		{
			name: "Kim Nguyen",
			title: "Co-Founder",
			background: "Builder-side experience, business administration, and project record support for supply reviews.",
			experience: "25+ years of builder experience",
			photo: "/assets/supporting/team/kim-nguyen.jpeg",
			photoWidth: 200,
			photoHeight: 200,
			photoPosition: "center 42%",
			initials: "KN"
		},
		{
			name: "Andy Pham",
			title: "Co-Founder",
			background: "Founder-side project review support for commercial buyers, with focus on fit, accountability, and coordinated handoff.",
			experience: "Commercial project supply and buyer coordination",
			photo: "/assets/supporting/team/andy-pham.jpg",
			photoWidth: 2048,
			photoHeight: 2046,
			photoPosition: "56% 31%",
			photoOffsetY: "15px",
			photoScale: 1.2,
			photoHoverScale: 1.245,
			initials: "AP"
		}
	],
	description: "Asina Global supplies project-scale cabinets, countertops, and custom furniture packages with drawing review, mockup approval, QA, packing, and shipping coordination.",
	businessDescription: "Asina Global supplies wholesale cabinets, countertops, and custom furniture packages for builders, developers, and contractors in Florida. Services include drawing review, mockup approval, QA, packing, and import coordination.",
	audience: "Builders, developers, procurement teams, restaurant groups, franchise rollout teams, and commercial project buyers.",
	phone: "407-743-7473",
	schemaPhone: "+1-407-743-7473",
	phoneHref: "+14077437473"
};
[...pages.flatMap((page) => (page.aliases ?? []).map((from) => ({
	from,
	to: page.path
})))];
var getPageById = (id) => pages.find((page) => page.id === id) ?? pages[0];
var getPathForPage = (id) => getPageById(id).path;
var getCanonicalUrlForPage = (id) => new URL(getPathForPage(id), siteOrigin).toString();
var getAbsoluteUrl = (value = "/") => new URL(value, siteOrigin).toString();
var getSocialImageForPage = (id) => {
	const page = getPageById(id);
	const candidate = page.socialImage ?? page.image;
	return getAbsoluteUrl(isRasterSocialImage(candidate) ? candidate : siteDetails.socialImage);
};
var normalizePath = (pathname = "/") => {
	return pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
};
var getPageIdFromPathname = (pathname = "/") => {
	const path = normalizePath(pathname);
	return pages.find((page) => normalizePath(page.path) === path || page.aliases?.some((alias) => normalizePath(alias) === path))?.id ?? "home";
};
var getPageIdFromHash = (hash = "") => {
	const id = hash.replace(/^#\/?/, "");
	return pageIds.has(id) ? id : null;
};
//#endregion
//#region src/appShell.jsx
var motionEase$2 = [
	.23,
	1,
	.32,
	1
];
var routeDossiers = {
	home: {
		code: "AG-00",
		label: "Project Supply",
		stage: 0
	},
	cabinets: {
		code: "CAB-01",
		label: "Cabinets",
		stage: 2
	},
	countertops: {
		code: "SLAB-02",
		label: "Countertops",
		stage: 2
	},
	furniture: {
		code: "PKG-03",
		label: "Furniture Packages",
		stage: 2
	},
	process: {
		code: "PATH-04",
		label: "Production Process",
		stage: 3
	},
	qa: {
		code: "QA-05",
		label: "QA + Shipping",
		stage: 4
	},
	about: {
		code: "TRUST-06",
		label: "About Asina",
		stage: 2
	},
	design: {
		code: "DTP-07",
		label: "Design Support",
		stage: 2
	},
	review: {
		code: "REV-08",
		label: "Project Review",
		stage: 0
	},
	contact: {
		code: "NAP-25",
		label: "Contact",
		stage: 1
	},
	"buyer-paths": {
		code: "NAV-24",
		label: "Buyer Paths",
		stage: 1
	},
	"multi-unit": {
		code: "CAB-09",
		label: "Multi-Unit Cabinets",
		stage: 2
	},
	"dealer-supply": {
		code: "DLR-26",
		label: "Dealer Cabinet Supply",
		stage: 2
	},
	"restaurant-furniture": {
		code: "FURN-10",
		label: "Restaurant + Franchise Furniture",
		stage: 2
	},
	rfq: {
		code: "RFQ-11",
		label: "RFQ Resources",
		stage: 1
	},
	"importer-resources": {
		code: "BUY-12",
		label: "Buyer Resources",
		stage: 2
	},
	"supplier-comparison": {
		code: "CMP-27",
		label: "Supplier Comparison",
		stage: 2
	},
	"supplier-guide": {
		code: "GUIDE-28",
		label: "Supplier Guide",
		stage: 2
	},
	"container-economics": {
		code: "BOX-13",
		label: "Container Math",
		stage: 2
	},
	"landed-cost": {
		code: "COST-14",
		label: "Landed Cost",
		stage: 2
	},
	"shipping-responsibility": {
		code: "SHIP-15",
		label: "Shipping Terms",
		stage: 4
	},
	"imported-quality": {
		code: "QA-16",
		label: "Imported Quality",
		stage: 4
	},
	"lead-times": {
		code: "TIME-17",
		label: "Lead Times",
		stage: 3
	},
	"import-vs-domestic": {
		code: "FIT-18",
		label: "Import vs Domestic",
		stage: 2
	},
	orlando: {
		code: "ORL-19",
		label: "Orlando Project Supply",
		stage: 2
	},
	"commercial-mixed": {
		code: "FL-20",
		label: "Commercial Cabinet + Countertop",
		stage: 2
	},
	"commercial-countertops": {
		code: "SLAB-21",
		label: "Commercial Countertops",
		stage: 2
	},
	"hospitality-ffe": {
		code: "FFE-22",
		label: "Hospitality FF&E",
		stage: 2
	},
	"multifamily-supply": {
		code: "MF-23",
		label: "Multifamily Supply",
		stage: 2
	},
	"cabinet-malibu": {
		code: "CAB-MA",
		label: "Malibu Cabinets",
		stage: 2
	},
	"cabinet-monterey": {
		code: "CAB-MO",
		label: "Monterey Cabinets",
		stage: 2
	},
	"cabinet-newport": {
		code: "CAB-NE",
		label: "Newport Cabinets",
		stage: 2
	},
	"cabinet-catalina": {
		code: "CAB-CA",
		label: "Catalina Cabinets",
		stage: 2
	},
	"cabinet-laguna": {
		code: "CAB-LA",
		label: "Laguna Cabinets",
		stage: 2
	},
	"cabinet-jersey": {
		code: "CAB-JE",
		label: "Jersey Cabinets",
		stage: 2
	},
	"countertop-quartz-codes": {
		code: "SLAB-C",
		label: "Quartz Slab Codes",
		stage: 2
	},
	"countertop-exotic": {
		code: "SLAB-E",
		label: "Exotic Quartz",
		stage: 2
	},
	"countertop-natural": {
		code: "SLAB-N",
		label: "Natural Quartz",
		stage: 2
	},
	"countertop-grain": {
		code: "SLAB-G",
		label: "Grain Quartz",
		stage: 2
	}
};
var processSteps = [
	{
		title: "Submit Project Basics",
		short: "Basics",
		input: "Category, location, unit count, timeline, and project notes.",
		review: "Asina checks whether the scope fits the supply model.",
		output: "A clear next step for drawings and specs.",
		risk: "Keeps early conversations inside the right scope.",
		next: "If the scope is a fit, Asina requests drawings, plans, specs, or package files by email."
	},
	{
		title: "Send Drawings By Email",
		short: "Drawings",
		input: "Drawings, specs, plans, brand standards, or furniture files by email.",
		review: "The team reads the project intent and turns it into usable production notes.",
		output: "Notes the production team can use, without public uploads.",
		risk: "Reduces wrong dimensions and missing production details.",
		next: "Asina organizes the information for a Project Supply Review covering value, feasibility, QA, and shipping responsibility."
	},
	{
		title: "Project Supply Review",
		short: "Review",
		input: "Cost goals, material direction, timeline, packing needs, and shipping needs.",
		review: "Asina reviews value, feasibility, minimums, QA concerns, and responsibility level.",
		output: "A practical basis for the quote.",
		risk: "Keeps pricing, logistics, and quality expectations tied together.",
		next: "If the project is practical, Asina narrows the material, finish, or sample direction for mockup approval."
	},
	{
		title: "Mockup Approval",
		short: "Mockup",
		input: "Selected material, finish, sizing, and project detail direction.",
		review: "The sample or mockup package confirms measurements, color, finish, and details.",
		output: "An approved reference before repeat production.",
		risk: "Reduces finish mismatch and wrong-size production risk.",
		next: "The approved sample becomes the reference for repeat quantities."
	},
	{
		title: "Production + QA",
		short: "QA",
		input: "Approved spec, approved mockup, and production quantity.",
		review: "Production QA checks cover finish, color, visible defects, material match, and consistency.",
		output: "Production checked against the approved requirements.",
		risk: "Catches import problems before shipment.",
		next: "Goods move into packing review, count organization, labeling, and shipping coordination."
	},
	{
		title: "Packing + Shipping Coordination",
		short: "Shipping",
		input: "Packing requirements, destination, responsibility level, and delivery needs.",
		review: "Packing and shipping options are coordinated with applicable Incoterms® 2020 terms.",
		output: "Shipment details checked before release.",
		risk: "Reduces weak packing and unclear responsibility.",
		next: "Final responsibility, risk, cost, and delivery terms follow the agreed project quote."
	}
];
var formattedOfficeAddress = `${siteDetails.address.streetAddress}, ${siteDetails.address.addressLocality}, ${siteDetails.address.addressRegion} ${siteDetails.address.postalCode}`;
var contactDetails = {
	email: siteDetails.email,
	phone: siteDetails.phone,
	phoneHref: siteDetails.phoneHref ? `tel:${siteDetails.phoneHref}` : "",
	address: formattedOfficeAddress,
	googleBusinessProfile: siteDetails.googleBusinessProfile,
	hours: siteDetails.businessHours.label,
	appointmentText: siteDetails.appointmentText,
	mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.549835518365!2d-81.41994612315483!3d28.703109780869784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e773c9915d7561%3A0x6206daa65955a029!2sAsina%20Global%20LLC!5e0!3m2!1sen!2sus!4v1780928963994!5m2!1sen!2sus"
};
var getPageFromLocation = (fallback = "home") => {
	if (typeof window === "undefined") return fallback;
	return getPageIdFromHash(window.location.hash) ?? getPageIdFromPathname(window.location.pathname);
};
var shouldHandleClientNavigation = (event) => !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;
var setHeadMeta = (selector, attributeName, attributeValue, content) => {
	if (typeof document === "undefined") return;
	let element = document.head.querySelector(selector);
	if (!element) {
		element = document.createElement("meta");
		element.setAttribute(attributeName, attributeValue);
		document.head.appendChild(element);
	}
	element.setAttribute("content", content);
};
function RouteLink({ page, navigate, children, onNavigate, ...props }) {
	return /* @__PURE__ */ jsx("a", {
		href: getPathForPage(page),
		onClick: (event) => {
			if (!shouldHandleClientNavigation(event)) return;
			event.preventDefault();
			navigate(page);
			onNavigate?.();
		},
		...props,
		children
	});
}
function Header({ activePage, mobileOpen, setMobileOpen, navigate }) {
	const reducedMotion = useReducedMotion();
	const menuRef = useRef(null);
	const triggerRef = useRef(null);
	const secondaryPageIds = new Set(["about", "design"]);
	const menuItems = pages.filter((page) => page.id !== "home" && page.showInHeader !== false);
	const navItems = pages.filter((page) => page.id !== "home" && page.id !== "review" && page.showInHeader !== false && !secondaryPageIds.has(page.id));
	useEffect(() => {
		if (!mobileOpen) return void 0;
		const previousActive = document.activeElement;
		requestAnimationFrame(() => {
			(menuRef.current?.querySelector("a[href], button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"))?.focus();
		});
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				setMobileOpen(false);
				triggerRef.current?.focus();
				return;
			}
			if (event.key !== "Tab" || !menuRef.current) return;
			const focusable = Array.from(menuRef.current.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"));
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			if (previousActive instanceof HTMLElement) previousActive.focus();
		};
	}, [mobileOpen, setMobileOpen]);
	return /* @__PURE__ */ jsxs("header", {
		className: "site-header",
		"data-mobile-open": mobileOpen ? "true" : "false",
		children: [
			/* @__PURE__ */ jsxs(RouteLink, {
				page: "home",
				navigate,
				className: "logo-button",
				"aria-label": "Go to home",
				children: [/* @__PURE__ */ jsx("img", {
					src: "/assets/supporting/brand/asina-global-logo.svg",
					alt: "Asina Global",
					width: "160",
					height: "150",
					decoding: "async",
					loading: "eager"
				}), /* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Asina Global home"
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "desktop-nav",
				"aria-label": "Primary navigation",
				children: navItems.map((page) => /* @__PURE__ */ jsx(RouteLink, {
					page: page.id,
					navigate,
					className: activePage === page.id ? "nav-link active" : "nav-link",
					"aria-current": activePage === page.id ? "page" : void 0,
					children: page.label
				}, page.id))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "header-actions",
				children: [
					/* @__PURE__ */ jsx(RouteLink, {
						page: "contact",
						navigate,
						className: "button secondary compact phone-action",
						children: "Contact"
					}),
					/* @__PURE__ */ jsx(RouteLink, {
						page: "process",
						navigate,
						className: "button secondary compact",
						children: "See The Process"
					}),
					/* @__PURE__ */ jsx(RouteLink, {
						page: "review",
						navigate,
						className: "button primary compact cta",
						children: "Start Project Review"
					}),
					/* @__PURE__ */ jsx("button", {
						ref: triggerRef,
						type: "button",
						className: mobileOpen ? "icon-button mobile-menu-trigger active" : "icon-button mobile-menu-trigger",
						onClick: () => setMobileOpen((open) => !open),
						"aria-label": mobileOpen ? "Close menu" : "Open menu",
						"aria-expanded": mobileOpen,
						"aria-controls": "mobile-navigation-menu",
						children: /* @__PURE__ */ jsxs("span", {
							className: "hamburger-lines",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ jsx("i", {}),
								/* @__PURE__ */ jsx("i", {}),
								/* @__PURE__ */ jsx("i", {})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: mobileOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
				className: "mobile-menu-backdrop",
				"aria-hidden": "true",
				initial: reducedMotion ? { opacity: 1 } : { opacity: 0 },
				animate: { opacity: 1 },
				exit: reducedMotion ? { opacity: 1 } : { opacity: 0 },
				transition: {
					duration: reducedMotion ? 0 : .18,
					ease: motionEase$2
				},
				onClick: () => setMobileOpen(false)
			}), /* @__PURE__ */ jsxs(motion.div, {
				id: "mobile-navigation-menu",
				ref: menuRef,
				className: "mobile-menu",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Asina Global navigation",
				initial: reducedMotion ? { opacity: 1 } : {
					opacity: 0,
					y: -14,
					scale: .985,
					clipPath: "inset(0 0 10% 0)"
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1,
					clipPath: "inset(0 0 0% 0)"
				},
				exit: reducedMotion ? { opacity: 1 } : {
					opacity: 0,
					y: -10,
					scale: .985,
					clipPath: "inset(0 0 8% 0)"
				},
				transition: {
					duration: reducedMotion ? 0 : .28,
					ease: motionEase$2
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mobile-menu-header",
						children: [/* @__PURE__ */ jsx("span", { children: "Project supply command" }), /* @__PURE__ */ jsx("strong", { children: "Lower cost. Verified quality. Less import friction." })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mobile-menu-process",
						"aria-hidden": "true",
						children: [
							"Basics",
							"Drawings",
							"Review",
							"Mockup"
						].map((label, index) => /* @__PURE__ */ jsx(motion.span, {
							initial: reducedMotion ? {
								opacity: 1,
								y: 0
							} : {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: reducedMotion ? 0 : .18,
								delay: reducedMotion ? 0 : .05 + index * .03,
								ease: motionEase$2
							},
							children: label
						}, label))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mobile-menu-grid",
						children: menuItems.map((page, index) => /* @__PURE__ */ jsxs(motion.a, {
							href: getPathForPage(page.id),
							className: activePage === page.id ? "active" : "",
							"aria-current": activePage === page.id ? "page" : void 0,
							onClick: (event) => {
								if (!shouldHandleClientNavigation(event)) return;
								event.preventDefault();
								navigate(page.id);
							},
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 12
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 8
							},
							transition: {
								duration: reducedMotion ? 0 : .2,
								delay: reducedMotion ? 0 : index * .035,
								ease: motionEase$2
							},
							whileTap: reducedMotion ? void 0 : { scale: .98 },
							children: [/* @__PURE__ */ jsx("span", { children: page.label }), /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
						}, page.id))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mobile-menu-actions",
						children: [/* @__PURE__ */ jsx(RouteLink, {
							page: "process",
							navigate,
							onNavigate: () => setMobileOpen(false),
							className: "button secondary",
							children: "See The Process"
						}), /* @__PURE__ */ jsxs(RouteLink, {
							page: "review",
							navigate,
							onNavigate: () => setMobileOpen(false),
							className: "button primary cta",
							children: ["Start Project Review ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
						})]
					})
				]
			})] }) })
		]
	});
}
function DossierSpine({ navigate, activeDossier }) {
	const reducedMotion = useReducedMotion();
	const activeStage = activeDossier.stage;
	return /* @__PURE__ */ jsxs("aside", {
		className: "dossier-spine",
		"aria-label": "Drawing to production stages",
		children: [/* @__PURE__ */ jsx(RouteLink, {
			page: "process",
			navigate,
			className: "spine-label",
			children: "Drawing To Production"
		}), /* @__PURE__ */ jsx("div", {
			className: "spine-track",
			children: processSteps.map((step, index) => /* @__PURE__ */ jsxs("span", {
				className: index === activeStage ? "active" : index < activeStage ? "complete" : "",
				children: [
					index > 0 && /* @__PURE__ */ jsx("i", {}),
					/* @__PURE__ */ jsx("strong", { children: String(index + 1).padStart(2, "0") }),
					step.short,
					index === activeStage && /* @__PURE__ */ jsx(motion.em, {
						className: "spine-live-marker",
						layoutId: "spine-live-marker",
						transition: {
							duration: reducedMotion ? 0 : .24,
							ease: motionEase$2
						}
					})
				]
			}, step.short))
		})]
	});
}
function RouteHandoff({ activePage, activeDossier }) {
	const reducedMotion = useReducedMotion();
	const previousPage = useRef(activePage);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (previousPage.current === activePage) return void 0;
		previousPage.current = activePage;
		setVisible(true);
		const timeout = window.setTimeout(() => setVisible(false), 640);
		return () => window.clearTimeout(timeout);
	}, [activePage]);
	if (reducedMotion || !visible) return null;
	return /* @__PURE__ */ jsx(AnimatePresence, {
		mode: "wait",
		children: /* @__PURE__ */ jsxs(motion.div, {
			className: "route-handoff",
			"aria-hidden": "true",
			initial: { opacity: 0 },
			animate: { opacity: [
				0,
				1,
				1,
				0
			] },
			exit: { opacity: 0 },
			transition: {
				duration: .58,
				times: [
					0,
					.18,
					.76,
					1
				],
				ease: motionEase$2
			},
			children: [
				/* @__PURE__ */ jsx(motion.span, {
					className: "handoff-rule top",
					initial: { scaleX: 0 },
					animate: { scaleX: [
						0,
						1,
						1,
						0
					] },
					transition: {
						duration: .58,
						times: [
							0,
							.28,
							.76,
							1
						],
						ease: motionEase$2
					}
				}),
				/* @__PURE__ */ jsxs(motion.div, {
					className: "handoff-stamp",
					initial: {
						opacity: 0,
						y: 8,
						rotate: -.6
					},
					animate: {
						opacity: [
							0,
							1,
							1,
							0
						],
						y: [
							8,
							0,
							0,
							-5
						],
						rotate: [
							-.6,
							0,
							0,
							.35
						]
					},
					transition: {
						duration: .58,
						times: [
							0,
							.22,
							.78,
							1
						],
						ease: motionEase$2
					},
					children: [/* @__PURE__ */ jsx("span", { children: activeDossier.code }), /* @__PURE__ */ jsx("strong", { children: activeDossier.label })]
				}),
				/* @__PURE__ */ jsx(motion.span, {
					className: "handoff-rule bottom",
					initial: { scaleX: 0 },
					animate: { scaleX: [
						0,
						1,
						1,
						0
					] },
					transition: {
						duration: .58,
						times: [
							0,
							.32,
							.78,
							1
						],
						ease: motionEase$2
					}
				})
			]
		}, activePage)
	});
}
function MobileStickyCTA({ activePage, navigate }) {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (activePage === "review") return void 0;
		const updateVisibility = () => setVisible(window.scrollY > 540);
		updateVisibility();
		window.addEventListener("scroll", updateVisibility, { passive: true });
		return () => window.removeEventListener("scroll", updateVisibility);
	}, [activePage]);
	if (activePage === "review") return null;
	return /* @__PURE__ */ jsx("div", {
		className: visible ? "mobile-sticky-cta visible" : "mobile-sticky-cta",
		children: /* @__PURE__ */ jsxs(RouteLink, {
			page: "review",
			navigate,
			className: "button primary",
			children: ["Start Project Review ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
		})
	});
}
function Footer({ activePage, navigate }) {
	return /* @__PURE__ */ jsxs("footer", {
		id: "footer",
		className: "site-footer",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "footer-action-band",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "footer-brand-panel",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Start with the right project review." }),
						/* @__PURE__ */ jsx("p", { children: "Asina reviews cabinets, countertops, and furniture packages for fit, QA, packing, and shipping responsibility before drawings move by email." }),
						/* @__PURE__ */ jsxs("div", {
							className: "footer-cta-row",
							children: [/* @__PURE__ */ jsxs(RouteLink, {
								page: "review",
								navigate,
								className: "button primary",
								"aria-current": activePage === "review" ? "page" : void 0,
								children: ["Start Project Review ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
							}), /* @__PURE__ */ jsxs(RouteLink, {
								page: "buyer-paths",
								navigate,
								className: "footer-secondary-link",
								"aria-current": activePage === "buyer-paths" ? "page" : void 0,
								children: ["See Buyer Paths ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "footer-contact-panel",
					"aria-label": "Asina Global contact and review details",
					children: [
						/* @__PURE__ */ jsxs("a", {
							className: "footer-contact-item",
							href: `mailto:${contactDetails.email}`,
							children: [
								/* @__PURE__ */ jsx(Send, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "Email" }),
								/* @__PURE__ */ jsx("strong", { children: contactDetails.email })
							]
						}),
						/* @__PURE__ */ jsxs("a", {
							className: "footer-contact-item",
							href: contactDetails.phoneHref,
							children: [
								/* @__PURE__ */ jsx(Phone, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "Phone" }),
								/* @__PURE__ */ jsx("strong", { children: contactDetails.phone })
							]
						}),
						/* @__PURE__ */ jsxs("a", {
							className: "footer-contact-item",
							href: contactDetails.googleBusinessProfile,
							target: "_blank",
							rel: "noopener noreferrer",
							children: [
								/* @__PURE__ */ jsx(MapPin, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "Office located in Longwood" }),
								/* @__PURE__ */ jsx("strong", { children: contactDetails.address })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "footer-contact-item",
							children: [
								/* @__PURE__ */ jsx(Clock, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "Business hours" }),
								/* @__PURE__ */ jsx("strong", { children: contactDetails.hours })
							]
						}),
						/* @__PURE__ */ jsxs(RouteLink, {
							page: "process",
							navigate,
							className: activePage === "process" ? "footer-contact-item active" : "footer-contact-item",
							"aria-current": activePage === "process" ? "page" : void 0,
							children: [
								/* @__PURE__ */ jsx(Truck, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "Review path" }),
								/* @__PURE__ */ jsx("strong", { children: "Basics, drawings, mockup, QA, packing" })
							]
						}),
						/* @__PURE__ */ jsxs(RouteLink, {
							page: "rfq",
							navigate,
							className: activePage === "rfq" ? "footer-contact-item active" : "footer-contact-item",
							"aria-current": activePage === "rfq" ? "page" : void 0,
							children: [
								/* @__PURE__ */ jsx(FileText, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "RFQ prep" }),
								/* @__PURE__ */ jsx("strong", { children: "Scope, quantity, timeline, quote inputs" })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "footer-link-board",
				"aria-label": "Footer navigation",
				children: [
					{
						title: "Start",
						links: [
							"buyer-paths",
							"review",
							"cabinets",
							"countertops",
							"furniture"
						]
					},
					{
						title: "Commercial",
						links: [
							"commercial-mixed",
							"commercial-countertops",
							"multifamily-supply",
							"hospitality-ffe",
							"dealer-supply",
							"multi-unit",
							"restaurant-furniture",
							"orlando"
						]
					},
					{
						title: "Guides",
						links: [
							"rfq",
							"importer-resources",
							"supplier-guide",
							"container-economics",
							"landed-cost",
							"shipping-responsibility",
							"imported-quality",
							"lead-times",
							"import-vs-domestic"
						]
					},
					{
						title: "Company",
						links: [
							"contact",
							"process",
							"qa",
							"design",
							"about",
							"privacy"
						]
					}
				].map((group) => /* @__PURE__ */ jsxs("section", {
					className: `footer-link-column footer-link-column-${group.title.toLowerCase()}`,
					"aria-label": `${group.title} links`,
					children: [/* @__PURE__ */ jsx("h3", { children: group.title }), /* @__PURE__ */ jsx("ul", { children: group.links.map((pageId, index) => {
						const page = getPageById(pageId);
						const isActive = activePage === page.id;
						const isPriority = group.title === "Start" || index < 2;
						const linkClassName = [isActive ? "active" : "", isPriority ? "priority" : ""].filter(Boolean).join(" ");
						return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(RouteLink, {
							page: page.id,
							navigate,
							className: linkClassName || void 0,
							"aria-current": isActive ? "page" : void 0,
							children: [/* @__PURE__ */ jsx("span", { children: page.label }), /* @__PURE__ */ jsx(ArrowRight, { size: 14 })]
						}) }, page.id);
					}) })]
				}, group.title))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "footer-legal-line",
				children: [
					/* @__PURE__ */ jsx("span", { children: "© 2026 Asina Global LLC" }),
					/* @__PURE__ */ jsx("span", { children: contactDetails.address }),
					/* @__PURE__ */ jsx("a", {
						href: contactDetails.phoneHref,
						children: contactDetails.phone
					}),
					/* @__PURE__ */ jsx("a", {
						href: `mailto:${contactDetails.email}`,
						children: contactDetails.email
					}),
					/* @__PURE__ */ jsx("span", { children: contactDetails.hours }),
					/* @__PURE__ */ jsx(RouteLink, {
						page: "privacy",
						navigate,
						children: "Privacy Policy"
					}),
					/* @__PURE__ */ jsx("a", {
						href: contactDetails.googleBusinessProfile,
						target: "_blank",
						rel: "noopener noreferrer",
						children: "Google Business Profile"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/App.jsx
var getRouteProps = (page, { navigate, reviewOrigin }) => {
	if (page === "review") return {
		originPage: reviewOrigin,
		navigate
	};
	if ([
		"container-economics",
		"landed-cost",
		"shipping-responsibility",
		"imported-quality",
		"lead-times",
		"import-vs-domestic"
	].includes(page)) return {
		guideId: page,
		navigate
	};
	if ([
		"commercial-mixed",
		"commercial-countertops",
		"hospitality-ffe",
		"multifamily-supply"
	].includes(page)) return {
		pageId: page,
		navigate
	};
	if ([
		"cabinet-malibu",
		"cabinet-monterey",
		"cabinet-newport",
		"cabinet-catalina",
		"cabinet-laguna",
		"cabinet-jersey"
	].includes(page)) return {
		pageId: page,
		navigate
	};
	if ([
		"countertop-exotic",
		"countertop-natural",
		"countertop-grain"
	].includes(page)) return {
		pageId: page,
		navigate
	};
	return { navigate };
};
function App({ initialPage = "home", routeComponents = {} }) {
	const [activePage, setActivePage] = useState(() => getPageFromLocation(initialPage));
	const [mobileOpen, setMobileOpen] = useState(false);
	const [reviewOrigin, setReviewOrigin] = useState(() => {
		const page = getPageFromLocation(initialPage);
		return page === "review" ? "home" : page;
	});
	const reducedMotion = useReducedMotion();
	const activeMeta = getPageById(activePage);
	const activeDossier = routeDossiers[activePage] ?? routeDossiers.home;
	useEffect(() => {
		document.title = activeMeta.title;
		document.querySelector("meta[name=\"description\"]")?.setAttribute("content", activeMeta.description);
		let canonical = document.querySelector("link[rel=\"canonical\"]");
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.setAttribute("rel", "canonical");
			document.head.appendChild(canonical);
		}
		const canonicalUrl = getCanonicalUrlForPage(activePage);
		const socialImage = getSocialImageForPage(activePage);
		const hasArticleMeta = Boolean(activeMeta.articleHeadline);
		canonical.setAttribute("href", canonicalUrl);
		setHeadMeta("meta[property=\"og:type\"]", "property", "og:type", hasArticleMeta ? "article" : "website");
		setHeadMeta("meta[property=\"og:site_name\"]", "property", "og:site_name", siteDetails.name);
		setHeadMeta("meta[property=\"og:title\"]", "property", "og:title", activeMeta.title);
		setHeadMeta("meta[property=\"og:description\"]", "property", "og:description", activeMeta.description);
		setHeadMeta("meta[property=\"og:url\"]", "property", "og:url", canonicalUrl);
		setHeadMeta("meta[property=\"og:image\"]", "property", "og:image", socialImage);
		setHeadMeta("meta[property=\"og:image:alt\"]", "property", "og:image:alt", activeMeta.imageAlt ?? siteDetails.description);
		setHeadMeta("meta[name=\"twitter:card\"]", "name", "twitter:card", "summary_large_image");
		setHeadMeta("meta[name=\"twitter:title\"]", "name", "twitter:title", activeMeta.title);
		setHeadMeta("meta[name=\"twitter:description\"]", "name", "twitter:description", activeMeta.description);
		setHeadMeta("meta[name=\"twitter:image\"]", "name", "twitter:image", socialImage);
		setHeadMeta("meta[name=\"keywords\"]", "name", "keywords", (activeMeta.keywords ?? []).join(", "));
		setHeadMeta("meta[name=\"author\"]", "name", "author", activeMeta.articleAuthor ?? (hasArticleMeta ? siteDetails.authorName : siteDetails.name));
		setHeadMeta("meta[name=\"publisher\"]", "name", "publisher", siteDetails.name);
	}, [activeMeta, activePage]);
	useEffect(() => {
		const syncFromLocation = () => {
			setActivePage(getPageFromLocation(initialPage));
			const legacyHashPage = getPageIdFromHash(window.location.hash);
			if (legacyHashPage) window.history.replaceState({ page: legacyHashPage }, "", getPathForPage(legacyHashPage));
		};
		syncFromLocation();
		window.addEventListener("popstate", syncFromLocation);
		window.addEventListener("hashchange", syncFromLocation);
		return () => {
			window.removeEventListener("popstate", syncFromLocation);
			window.removeEventListener("hashchange", syncFromLocation);
		};
	}, [initialPage]);
	const navigate = (page) => {
		const isRouteChange = page !== activePage;
		if (page === "review" && activePage !== "review") setReviewOrigin(activePage);
		setActivePage(page);
		setMobileOpen(false);
		if (typeof window !== "undefined") {
			const targetPath = getPathForPage(page);
			if (window.location.pathname !== targetPath || window.location.hash) window.history.pushState({ page }, "", targetPath);
			if (isRouteChange) requestAnimationFrame(() => {
				window.scrollTo({
					top: 0,
					behavior: reducedMotion ? "auto" : "smooth"
				});
			});
		}
	};
	const ActiveRoute = routeComponents[activePage] ?? routeComponents.home;
	const routeProps = getRouteProps(activePage, {
		navigate,
		reviewOrigin
	});
	return /* @__PURE__ */ jsx(MotionConfig, {
		reducedMotion: "user",
		transition: { ease: [
			.23,
			1,
			.32,
			1
		] },
		children: /* @__PURE__ */ jsxs("div", {
			className: `${activePage === "review" ? "site-shell" : "site-shell has-mobile-dock"} route-${activePage}`,
			"data-route": activePage,
			children: [
				/* @__PURE__ */ jsx(Component, {}),
				/* @__PURE__ */ jsx(Header, {
					activePage,
					mobileOpen,
					setMobileOpen,
					navigate
				}),
				/* @__PURE__ */ jsx(DossierSpine, {
					navigate,
					activeDossier
				}),
				/* @__PURE__ */ jsx(RouteHandoff, {
					activePage,
					activeDossier
				}),
				/* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ jsx(motion.div, {
						className: "page-route-surface",
						initial: false,
						animate: {
							opacity: 1,
							y: 0,
							clipPath: "inset(0 0 0% 0)"
						},
						exit: reducedMotion ? { opacity: 1 } : {
							opacity: .86,
							y: -8,
							clipPath: "inset(1.5% 0 0 0)"
						},
						transition: {
							duration: reducedMotion ? 0 : .24,
							ease: motionEase$2
						},
						children: /* @__PURE__ */ jsx(Suspense, {
							fallback: null,
							children: ActiveRoute ? /* @__PURE__ */ jsx(ActiveRoute, { ...routeProps }) : null
						})
					}, activePage)
				}) }),
				/* @__PURE__ */ jsx(MobileStickyCTA, {
					activePage,
					navigate
				}),
				/* @__PURE__ */ jsx(Footer, {
					activePage,
					navigate
				})
			]
		})
	});
}
var cabinets_default = {
	catalog: "cabinets",
	collections: [
		{
			"key": "malibu",
			"name": "Malibu",
			"line": "Framed",
			"box": "5/8-inch premium plywood panels",
			"panel_thickness": "5/8-inch premium plywood panels",
			"style_family": "Painted shaker",
			"title": "Malibu Cabinet Collection | Asina Global",
			"meta_description": "Malibu cabinet collection details for Asina Global, including painted shaker finishes, 3-layer lacquer paint, and 5/8-inch premium plywood panel construction.",
			"hero": {
				"headline": "Painted shaker warmth on 5/8-inch premium plywood panels.",
				"body": "Malibu is the brighter painted line in the cabinet catalog, built for projects that want a classic cabinet face with a smooth, durable finish.",
				"image": "assets/catalog/cabinets/optimized/page-07-img-02-obj-1858.jpg"
			},
			"facts": [
				{
					"label": "Finish system",
					"value": "Three-layer lacquer paint across four painted shaker options."
				},
				{
					"label": "Door build",
					"value": "One-piece shaker door profile with a cleaner, crack-resistant face."
				},
				{
					"label": "5/8-inch Panels",
					"value": "Constructed from full 5/8-inch premium plywood panels for strength, stability, and long service life."
				},
				{
					"label": "Frame and overlay",
					"value": "Full access frame, full plywood back panel, and full overlay fronts."
				}
			],
			"finishes": [
				{
					"name": "White Shaker",
					"family": "Malibu / White Shaker",
					"description": "Painted white shaker finish on the Malibu line for projects that want a bright cabinet face without extra detailing.",
					"image": "assets/catalog/cabinets/optimized/page-08-img-01-obj-1865.jpg",
					"sample_image": "assets/catalog/cabinets/optimized/page-08-img-04-obj-2663.jpg",
					"sample_position": "center center",
					"specs": {
						"Wood": "Hardwood (Rubberwood)",
						"Frame": "Flush face frame, full overlay",
						"Panels": "5/8\" Premium plywood",
						"Shelves": "3/4\" Premium plywood",
						"Tracks": "Undermount softclose",
						"Hinges": "Softclose",
						"Drawers": "5/8\" Solid wood dovetail box",
						"Interior": "Natural wood color",
						"Vanities": "24\"-60\"W, 32\"H, 21\"D",
						"Feature": "One-piece door design"
					},
					"swatches": [{
						"name": "White",
						"color": "#f2f1ec"
					}, {
						"name": "Undertone",
						"color": "#ddd8cf"
					}]
				},
				{
					"name": "Grey Shaker",
					"family": "Malibu / Grey Shaker",
					"description": "Painted grey shaker finish for cooler cabinet palettes and cleaner contrast against lighter counters.",
					"image": "assets/catalog/cabinets/optimized/page-09-img-04-obj-1882.jpg",
					"sample_image": "assets/catalog/cabinets/optimized/page-09-img-05-obj-1883.jpg",
					"sample_position": "center center",
					"specs": {
						"Wood": "Hardwood (Rubberwood)",
						"Frame": "Flush face frame, full overlay",
						"Panels": "5/8\" Premium plywood",
						"Shelves": "3/4\" Premium plywood",
						"Tracks": "Undermount softclose",
						"Hinges": "Softclose",
						"Drawers": "5/8\" Solid wood dovetail box",
						"Interior": "Natural wood color",
						"Vanities": "24\"-60\"W, 32\"H, 21\"D",
						"Feature": "One-piece door design"
					},
					"swatches": [{
						"name": "Grey",
						"color": "#8d9094"
					}, {
						"name": "Undertone",
						"color": "#b3b5b7"
					}]
				},
				{
					"name": "Antique White",
					"family": "Malibu / Antique White",
					"description": "Warmer off-white painted shaker finish for rooms that want a softer cabinet tone than bright white.",
					"image": "assets/catalog/cabinets/optimized/page-10-img-06-obj-1897.jpg",
					"sample_image": "assets/catalog/cabinets/optimized/page-10-img-07-obj-1898.jpg",
					"sample_position": "center center",
					"specs": {
						"Wood": "Hardwood (Rubberwood)",
						"Frame": "Flush face frame, full overlay",
						"Panels": "5/8\" Premium plywood",
						"Shelves": "3/4\" Premium plywood",
						"Tracks": "Undermount softclose",
						"Hinges": "Softclose",
						"Drawers": "5/8\" Solid wood dovetail box",
						"Interior": "Natural wood color",
						"Wall Cabinets": "36\" and 42\" high only",
						"Vanities": "24\"-60\"W, 32\"H, 21\"D",
						"Feature": "One-piece door design",
						"Note": "Glazing not available"
					},
					"swatches": [{
						"name": "Antique white",
						"color": "#e6ddd1"
					}, {
						"name": "Warm cream",
						"color": "#d3c3ad"
					}]
				},
				{
					"name": "Ash Taupe",
					"family": "Malibu / Ash Taupe",
					"description": "Ash Taupe brings a softer painted neutral into the Malibu line for rooms that want warmth without moving into a darker stained cabinet.",
					"image": "assets/catalog/cabinets/optimized/page-11-img-04-obj-1909.jpg",
					"sample_image": "assets/catalog/cabinets/optimized/page-11-img-05-obj-1910.jpg",
					"sample_position": "center center",
					"specs": {
						"Wood": "Hardwood (Rubberwood)",
						"Frame": "Flush face frame, full overlay",
						"Panels": "5/8\" Premium plywood",
						"Shelves": "3/4\" Premium plywood",
						"Tracks": "Undermount softclose",
						"Hinges": "Softclose",
						"Drawers": "5/8\" Solid wood dovetail box",
						"Interior": "Natural wood color",
						"Vanities": "24\"-60\"W, 32\"H, 21\"D",
						"Feature": "One-piece door design"
					},
					"swatches": [{
						"name": "Taupe",
						"color": "#a3978b"
					}, {
						"name": "Mushroom",
						"color": "#c6baac"
					}]
				}
			],
			"details": [
				{
					"label": "3-Layer Lacquer Finish",
					"value": "The three-layer lacquer process gives White Shaker, Grey Shaker, Antique White, and Ash Taupe a smooth, durable cabinet face."
				},
				{
					"label": "One-Piece Door Design",
					"value": "Built from a single wood slab, Malibu doors remove joints from the shaker face."
				},
				{
					"label": "5/8-Inch Panels",
					"value": "Constructed from full 5/8-inch premium plywood panels for strength, stability, and long service life."
				},
				{
					"label": "Full Access Frame",
					"value": "The Malibu platform keeps a traditional cabinet expression while maximizing usable access inside the box."
				},
				{
					"label": "Best fit",
					"value": "Projects that want a painted shaker direction with cleaner construction and full plywood cabinet strength."
				},
				{
					"label": "Use cases",
					"value": "Kitchens, baths, and commercial rooms where a brighter painted finish works better than deeper stained cabinetry."
				},
				{
					"label": "What to send",
					"value": "Send the finish name, room type, cabinet run, and any vanity widths or tall-unit requirements to start a Malibu quote."
				}
			]
		},
		{
			"key": "monterey",
			"name": "Monterey",
			"line": "Framed",
			"box": "5/8-inch premium plywood panels",
			"panel_thickness": "5/8-inch premium plywood panels",
			"style_family": "Stained wood shaker",
			"title": "Monterey Cabinet Collection | Asina Global",
			"meta_description": "Monterey cabinet collection details for Asina Global, including stained finishes, 3-layer lacquer stain, and 5/8-inch premium plywood panel construction.",
			"hero": {
				"headline": "Stained cabinet warmth on the same traditional platform.",
				"body": "Monterey covers the wood-toned side of the framed cabinet catalog for projects that want the cabinet finish to add warmth to the room.",
				"image": "assets/catalog/cabinets/optimized/page-12-img-02-obj-1919.jpg"
			},
			"facts": [
				{
					"label": "Finish system",
					"value": "Three-layer lacquer stain that leaves more of the natural grain visible."
				},
				{
					"label": "Door build",
					"value": "Rubber strip design supports panel movement and keeps the center panel stable over time."
				},
				{
					"label": "5/8-inch Panels",
					"value": "Constructed from full 5/8-inch premium plywood panels for strength, stability, and long service life."
				},
				{
					"label": "Frame and overlay",
					"value": "Full access frame, full plywood back panel, and full overlay fronts."
				}
			],
			"finishes": [{
				"name": "American Walnut",
				"family": "Monterey / American Walnut",
				"description": "American walnut face for projects that want the richest wood tone in the framed Monterey lineup.",
				"image": "assets/catalog/cabinets/optimized/page-13-img-08-obj-1937.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-13-img-09-obj-1938.jpg",
				"sample_position": "center center",
				"specs": {
					"Wood": "Solid American Walnut",
					"Frame": "Flush face frame, full overlay",
					"Panels": "5/8\" Premium plywood",
					"Shelves": "3/4\" Premium plywood",
					"Tracks": "Undermount softclose",
					"Hinges": "Softclose",
					"Drawers": "5/8\" Solid wood dovetail box",
					"Interior": "Natural wood color",
					"Wall Cabinets": "36\" and 42\" high only",
					"Vanities": "24\"-60\"W, 32\"H, 21\"D",
					"Feature": "Rubber strip design"
				},
				"swatches": [{
					"name": "Walnut",
					"color": "#6b4b38"
				}, {
					"name": "Grain",
					"color": "#8f6d56"
				}]
			}, {
				"name": "Espresso Shaker",
				"family": "Monterey / Espresso Shaker",
				"description": "Dark stained shaker tone for rooms that want a deeper cabinet body without moving fully black.",
				"image": "assets/catalog/cabinets/optimized/page-14-img-11-obj-1957.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-14-img-12-obj-1958.jpg",
				"sample_position": "center center",
				"specs": {
					"Wood": "Hardwood (Rubberwood)",
					"Frame": "Flush face frame, full overlay",
					"Panels": "5/8\" Premium plywood",
					"Shelves": "3/4\" Premium plywood",
					"Tracks": "Undermount softclose",
					"Hinges": "Softclose",
					"Drawers": "5/8\" Solid wood dovetail box",
					"Interior": "Natural wood color",
					"Wall Cabinets": "36\" and 42\" high only",
					"Vanities": "24\"-60\"W, 32\"H, 21\"D",
					"Feature": "Rubber strip design"
				},
				"swatches": [{
					"name": "Espresso",
					"color": "#4a3128"
				}, {
					"name": "Brown",
					"color": "#705243"
				}]
			}],
			"details": [
				{
					"label": "3-Layer Lacquer Stain",
					"value": "The Monterey stain process keeps more of the natural wood character visible while adding a smooth protective finish."
				},
				{
					"label": "Rubber Strip Design",
					"value": "Flexible rubber strips support natural panel movement and help maintain a more stable door face over time."
				},
				{
					"label": "5/8-Inch Panels",
					"value": "Constructed from full 5/8-inch premium plywood panels for strength, stability, and long service life."
				},
				{
					"label": "Full Access Frame",
					"value": "The framed platform is built to maximize usable access while keeping the fuller, traditional cabinet look."
				},
				{
					"label": "Best fit",
					"value": "Projects that need a warmer stained cabinet expression instead of a brighter painted look."
				},
				{
					"label": "Use cases",
					"value": "Commercial and residential interiors where walnut or espresso supports the room palette."
				},
				{
					"label": "What to send",
					"value": "Send the finish choice, room type, cabinet run, and whether the quote needs vanity or tall storage pieces."
				}
			]
		},
		{
			"key": "newport",
			"name": "Newport",
			"line": "Frameless",
			"box": "3/4-inch premium plywood panels",
			"panel_thickness": "3/4-inch premium plywood panels",
			"style_family": "Textured melamine",
			"title": "Newport Cabinet Collection | Asina Global",
			"meta_description": "Newport frameless cabinet collection details for Asina Global, including textured melamine finishes, MDF faces, and 3/4-inch premium plywood panel construction.",
			"hero": {
				"headline": "Textured melamine and modern woodgrain inside the frameless system.",
				"body": "Newport brings quieter woodgrain into the contemporary cabinet line for projects that want warmth, durability, and a calmer modern read.",
				"image": "assets/catalog/cabinets/optimized/page-17-img-02-obj-1981.jpg"
			},
			"facts": [
				{
					"label": "Finish system",
					"value": "Textured melamine woodgrain built for durability, easy cleaning, and calmer modern rooms."
				},
				{
					"label": "Face material",
					"value": "Melamine on MDF faces bring a wood look without the maintenance of stained real wood."
				},
				{
					"label": "3/4-inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "Drawer system",
					"value": "European soft-close tracks, soft-close hinges, and tandem drawer boxes."
				}
			],
			"finishes": [{
				"name": "Lucca",
				"family": "Newport / Lucca",
				"description": "Warm wood-look melamine for cleaner modern rooms that want grain without moving into a stained hardwood program.",
				"image": "assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-18-img-15-obj-2005.jpg",
				"sample_position": "center center",
				"specs": {
					"Faces": "Melamine on MDF",
					"Frame": "Frameless, full overlay",
					"Panels": "3/4\" Premium plywood",
					"Tracks": "European softclose",
					"Hinges": "Softclose",
					"Drawers": "Tandem drawer box",
					"Interior": "Natural wood color",
					"Vanities": "24\"-36\"W, 32\"H, 21\"D"
				},
				"swatches": [{
					"name": "Wood tone",
					"color": "#b08e6a"
				}, {
					"name": "Grain",
					"color": "#8b6b4d"
				}]
			}, {
				"name": "Bella",
				"family": "Newport / Bella",
				"description": "Lighter textured wood-look melamine for projects that want a softer oak direction on the Newport line.",
				"image": "assets/catalog/cabinets/optimized/page-19-img-16-obj-2031.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-19-img-17-obj-2032.jpg",
				"sample_position": "center center",
				"specs": {
					"Faces": "Textured melamine on MDF",
					"Frame": "Frameless, full overlay",
					"Panels": "3/4\" Premium plywood",
					"Tracks": "European softclose",
					"Hinges": "Softclose",
					"Drawers": "Tandem drawer box",
					"Interior": "Natural wood color",
					"Vanities": "24\"-36\"W, 32\"H, 21\"D"
				},
				"swatches": [{
					"name": "Light wood",
					"color": "#e6e0d4"
				}, {
					"name": "Grain",
					"color": "#c8b59c"
				}]
			}],
			"details": [
				{
					"label": "Textured Melamine",
					"value": "Durable melamine faces bring woodgrain depth and character while staying easy to clean and lower maintenance."
				},
				{
					"label": "3/4-Inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "Door Flush End Panel",
					"value": "A flush transition between cabinet body and door keeps the Newport line cleaner and more contemporary."
				},
				{
					"label": "Full Overlay",
					"value": "Full overlay fronts maximize door coverage for a more continuous frameless cabinet face."
				},
				{
					"label": "Best fit",
					"value": "Modern kitchens and project spaces that want a woodgrain feel with lower-maintenance melamine surfaces."
				},
				{
					"label": "Use cases",
					"value": "Value-conscious frameless programs where natural texture matters more than gloss or painted lacquer."
				},
				{
					"label": "What to send",
					"value": "Send the finish choice, room type, cabinet run, and any pantry or vanity needs to start a Newport quote."
				}
			]
		},
		{
			"key": "catalina",
			"name": "Catalina",
			"line": "Frameless",
			"box": "3/4-inch premium plywood panels",
			"panel_thickness": "3/4-inch premium plywood panels",
			"style_family": "High gloss",
			"title": "Catalina Cabinet Collection | Asina Global",
			"meta_description": "Catalina frameless cabinet collection details for Asina Global, including high gloss lacquer finishes, MDF faces, and premium plywood construction.",
			"hero": {
				"headline": "High gloss modern cabinetry for the brightest contemporary rooms.",
				"body": "Catalina is the reflective high-gloss option in the frameless cabinet line, designed for projects that want sharper planes, brighter surfaces, and stronger visual contrast.",
				"image": "assets/catalog/cabinets/optimized/page-20-img-03-obj-2042.jpg"
			},
			"facts": [
				{
					"label": "Finish system",
					"value": "Piano-paint high gloss gives Catalina its bright reflective cabinet plane."
				},
				{
					"label": "Face material",
					"value": "Lacquer-finished MDF faces create a clean, mirror-like modern surface."
				},
				{
					"label": "3/4-inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "Hardware",
					"value": "European soft-close tracks, soft-close hinges, tandem drawer boxes, and natural wood interiors."
				}
			],
			"finishes": [{
				"name": "High Gloss White",
				"family": "Catalina / High Gloss White",
				"description": "High gloss white lacquer finish for brighter contemporary rooms and cleaner reflected light.",
				"image": "assets/catalog/cabinets/optimized/page-21-img-02-obj-2053.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-21-img-03-obj-2054.jpg",
				"sample_position": "center center",
				"specs": {
					"Colors": "White",
					"Faces": "Lacquer finish on MDF",
					"Frame": "Frameless, full overlay",
					"Panels": "3/4\" Premium plywood",
					"Tracks": "European softclose",
					"Hinges": "Softclose",
					"Drawers": "Tandem drawer box",
					"Interior": "Natural wood color",
					"Vanities": "24\"-36\"W, 32\"H, 21\"D"
				},
				"swatches": [{
					"name": "Gloss white",
					"color": "#f5f5f2"
				}, {
					"name": "Sheen",
					"color": "#d9d9d7"
				}]
			}, {
				"name": "High Gloss Charcoal Grey",
				"family": "Catalina / High Gloss Charcoal Grey",
				"description": "High gloss charcoal lacquer finish for darker contemporary rooms that want sharper contrast with stone and metal.",
				"image": "assets/catalog/cabinets/optimized/page-22-img-04-obj-2066.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-22-img-05-obj-2067.jpg",
				"sample_position": "center center",
				"specs": {
					"Colors": "Charcoal Grey",
					"Faces": "Lacquer finish on MDF",
					"Frame": "Frameless, full overlay",
					"Panels": "3/4\" Premium plywood",
					"Tracks": "European softclose",
					"Hinges": "Softclose",
					"Drawers": "Tandem drawer box",
					"Interior": "Natural wood color",
					"Vanities": "24\"-36\"W, 32\"H, 21\"D"
				},
				"swatches": [{
					"name": "Charcoal",
					"color": "#4b4d52"
				}, {
					"name": "Gloss",
					"color": "#7a7d84"
				}]
			}],
			"details": [
				{
					"label": "Piano Paint High Gloss",
					"value": "A mirror-like lacquer finish gives Catalina its brighter showroom look while protecting color and surface clarity over time."
				},
				{
					"label": "3/4-Inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "Door Flush End Panel",
					"value": "A flush transition between cabinet body and door keeps the exterior read cleaner and more contemporary."
				},
				{
					"label": "Full Overlay",
					"value": "Full overlay fronts maximize door coverage for a sleeker, more continuous modern cabinet face."
				},
				{
					"label": "Best fit",
					"value": "Modern interiors that want stronger reflectivity, cleaner planes, and a higher-contrast contemporary look."
				},
				{
					"label": "Use cases",
					"value": "Open kitchens, commercial spaces, and premium residential programs."
				},
				{
					"label": "What to send",
					"value": "Send the finish choice, room type, cabinet run, and whether the quote needs wall, base, pantry, or vanity units."
				}
			]
		},
		{
			"key": "laguna",
			"name": "Laguna",
			"line": "Frameless",
			"box": "3/4-inch premium plywood panels",
			"panel_thickness": "3/4-inch premium plywood panels",
			"style_family": "Soft-touch matte",
			"title": "Laguna Cabinet Collection | Asina Global",
			"meta_description": "Laguna frameless cabinet collection details for Asina Global, including soft-touch matte finish and 3/4-inch premium plywood panel construction.",
			"hero": {
				"headline": "Soft-touch matte cabinetry for quieter contemporary interiors.",
				"body": "Laguna uses the same frameless cabinet platform with a calm, tactile, lower-reflectivity finish.",
				"image": "assets/catalog/cabinets/optimized/page-23-img-04-obj-2077.jpg"
			},
			"facts": [
				{
					"label": "Face material",
					"value": "MDF with a soft-touch matte surface."
				},
				{
					"label": "Frame",
					"value": "Frameless, full overlay."
				},
				{
					"label": "3/4-inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "Hardware",
					"value": "European softclose tracks, softclose hinges, tandem drawer box, and natural wood interior."
				}
			],
			"finishes": [{
				"name": "Matte Grey",
				"family": "Laguna / Matte Grey",
				"description": "Soft-touch matte grey finish for cooler contemporary rooms that want a low-sheen cabinet surface.",
				"image": "assets/catalog/cabinets/optimized/page-24-img-06-obj-2092.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-23-img-04-obj-2077.jpg",
				"sample_position": "center center",
				"specs": {
					"Color": "Matte Grey",
					"Faces": "MDF, soft touch",
					"Frame": "Frameless, full overlay",
					"3/4-inch Panels": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life.",
					"Tracks": "European softclose",
					"Hinges": "Softclose",
					"Drawers": "Tandem drawer box",
					"Interior": "Natural wood color",
					"Vanities": "24\"-36\"W, 32\"H, 21\"D"
				},
				"swatches": [{
					"name": "Matte grey",
					"color": "#8a8e8f"
				}, {
					"name": "Cool stone",
					"color": "#b2b5b6"
				}]
			}],
			"details": [
				{
					"label": "Soft Touch Matte",
					"value": "A silky matte face gives Laguna a softer look and lower reflectivity than gloss."
				},
				{
					"label": "3/4-Inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "European Softclose",
					"value": "Tracks and hinges are softclose, with tandem drawer boxes and a natural wood interior."
				},
				{
					"label": "Vanity Range",
					"value": "Vanities run from 24 inches to 36 inches wide, with 32-inch height and 21-inch depth."
				},
				{
					"label": "Best fit",
					"value": "Projects that want a modern matte finish with less reflectivity and a tactile surface."
				},
				{
					"label": "Use cases",
					"value": "Quiet contemporary kitchens and interiors where gloss would feel too aggressive."
				},
				{
					"label": "What to send",
					"value": "Send the room type, cabinet run, and any pantry, wall, or vanity requirements to start a Laguna quote."
				}
			]
		},
		{
			"key": "jersey",
			"name": "Jersey",
			"line": "Frameless",
			"box": "3/4-inch premium plywood panels",
			"panel_thickness": "3/4-inch premium plywood panels",
			"style_family": "White shaker",
			"title": "Jersey Cabinet Collection | Asina Global",
			"meta_description": "Jersey frameless shaker cabinet collection details for Asina Global, including 3-layer lacquer paint and 3/4-inch premium plywood panel construction.",
			"hero": {
				"headline": "White shaker familiarity on a cleaner frameless cabinet box.",
				"body": "Jersey is the bridge collection for projects that still want a classic shaker face but prefer the cleaner construction baseline of the frameless system.",
				"image": "assets/catalog/cabinets/optimized/page-25-img-04-obj-2102.jpg"
			},
			"facts": [
				{
					"label": "Face material",
					"value": "HDF with paint."
				},
				{
					"label": "Frame",
					"value": "Frameless, full overlay."
				},
				{
					"label": "3/4-inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "Hardware",
					"value": "European softclose tracks, softclose hinges, tandem drawer box, and natural wood interior."
				}
			],
			"finishes": [{
				"name": "Jersey White Shaker",
				"family": "Jersey / White Shaker",
				"description": "White shaker finish on the Jersey frameless platform for projects that want a cleaner frameless face with a bright painted look.",
				"image": "assets/catalog/cabinets/optimized/page-26-img-08-obj-2120.jpg",
				"sample_image": "assets/catalog/cabinets/optimized/page-25-img-04-obj-2102.jpg",
				"sample_position": "center center",
				"specs": {
					"Color": "Jersey White Shaker",
					"Faces": "HDF with paint",
					"Frame": "Frameless, full overlay",
					"3/4-inch Panels": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life.",
					"Tracks": "European softclose",
					"Hinges": "Softclose",
					"Drawers": "Tandem drawer box",
					"Interior": "Natural wood color",
					"Vanities": "24\"-36\"W, 32\"H, 21\"D"
				},
				"swatches": [{
					"name": "White",
					"color": "#f0efea"
				}, {
					"name": "Soft cream",
					"color": "#d9d5cd"
				}]
			}],
			"details": [
				{
					"label": "Painted HDF Face",
					"value": "Jersey keeps a white shaker look with an HDF face and paint finish."
				},
				{
					"label": "3/4-Inch Panels",
					"value": "Built with full 3/4-inch premium plywood on all sides for strength, stability, and long service life."
				},
				{
					"label": "European Softclose",
					"value": "Tracks and hinges are softclose, with tandem drawer boxes and a natural wood interior."
				},
				{
					"label": "Vanity Range",
					"value": "Vanities run from 24 inches to 36 inches wide, with 32-inch height and 21-inch depth."
				},
				{
					"label": "Best fit",
					"value": "Projects that want white shaker familiarity but prefer the cleaner frameless box system."
				},
				{
					"label": "Use cases",
					"value": "Residential and commercial programs where classic shaker style still needs a more modern construction baseline."
				},
				{
					"label": "What to send",
					"value": "Send the room type, cabinet run, and any pantry, wall, or vanity needs to start a Jersey quote."
				}
			]
		}
	]
};
var countertops_default = {
	catalog: "countertops",
	collections: [
		{
			"key": "exotic",
			"name": "Exotic",
			"collection": "Exotic",
			"behavior": "Dramatic quartz movement, higher-contrast veining, and surfaces for high-visibility rooms.",
			"title": "Exotic Countertop Collection | Asina Global",
			"meta_description": "Exotic countertop collection details for Asina Global, including dramatic quartz surfaces, 20mm slabs, and jumbo or super jumbo sizing.",
			"hero": {
				"headline": "Bold veining for high-visibility counters and islands.",
				"body": "Asina Global Exotic Collection uses large flowing veins across light and dark quartz bases for islands, feature counters, and rooms where the surface needs a stronger natural-stone read.",
				"image": "assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-04.jpg"
			},
			"facts": [
				{
					"label": "Product surface",
					"value": "Polish finish for a brighter reflective slab face."
				},
				{
					"label": "Standard size",
					"value": "126 x 63 inches (3200 x 1600mm) and 137 x 78 inches (3500 x 2000mm)."
				},
				{
					"label": "Thickness",
					"value": "20mm (0.78 inch) and 30mm (1.18 inch)."
				}
			],
			"details": [
				{
					"label": "Material",
					"value": "Asina Global quartz is made with more than 90% natural quartz, giving the slab a hard surface with low maintenance."
				},
				{
					"label": "Weight",
					"value": "About 51kg per square meter (112.4 lbs) at 20mm and 70kg per square meter (154.3 lbs) at 30mm."
				},
				{
					"label": "Performance",
					"value": "Quartz rates about 7 on the Mohs scale, with strong resistance to scratching, chipping, staining, heat exposure, and water penetration."
				},
				{
					"label": "Best fit",
					"value": "Feature islands, counters, and premium rooms that need stronger movement."
				},
				{
					"label": "Use cases",
					"value": "Restaurant, commercial venue, and high-visibility residential programs where the slab is part of the room's main visual decision."
				},
				{
					"label": "What to send",
					"value": "Send the slab name, approximate square footage, edge profile, and sink or appliance cutout count to start an Exotic quote."
				}
			],
			"lifestyle_images": [
				{
					"caption": "Bath vanity",
					"image": "assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-01.jpg",
					"alt": "Exotic quartz installed in a double vanity bath"
				},
				{
					"caption": "Kitchen sink run",
					"image": "assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-02.jpg",
					"alt": "Exotic quartz installed around an undermount sink"
				},
				{
					"caption": "Surface detail",
					"image": "assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-03.jpg",
					"alt": "Exotic quartz styled across a polished countertop surface"
				},
				{
					"caption": "Vanity wall",
					"image": "assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-04.jpg",
					"alt": "Exotic quartz installed as a bright vanity wall and counter"
				}
			],
			"slabs": [
				{
					"name": "Oriental Gray",
					"code": "9203",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/001-da-00200.jpg",
					"alt": "Exotic slab Oriental Gray, 9203"
				},
				{
					"name": "Imperial Gold",
					"code": "9204",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/9204-imperial-gold-full-slab-no-logo.jpg",
					"alt": "Exotic slab Imperial Gold, 9204"
				},
				{
					"name": "Alaska Blue",
					"code": "9205",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/004-alaska-blue-9205-full-slab.jpg",
					"alt": "Exotic slab Alaska Blue, 9205"
				},
				{
					"name": "Fusion Gold",
					"code": "9185",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/007-da-00455.jpg",
					"alt": "Exotic slab Fusion Gold, 9185"
				},
				{
					"name": "Oriental Gold",
					"code": "9201",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/008-da-00083.jpg",
					"alt": "Exotic slab Oriental Gold, 9201"
				},
				{
					"name": "Oriental Black",
					"code": "9202",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/010-9202.jpg",
					"alt": "Exotic slab Oriental Black, 9202"
				},
				{
					"name": "Picasso Gold",
					"code": "9179",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/012-picasso-gold-9179.jpg",
					"alt": "Exotic slab Picasso Gold, 9179"
				},
				{
					"name": "Miami White",
					"code": "9180",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/015-miami-white-9180.jpg",
					"alt": "Exotic slab Miami White, 9180"
				},
				{
					"name": "Moon Sand",
					"code": "9181",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/016-moon-sandquartz-countertop-designs.jpg",
					"alt": "Exotic slab Moon Sand, 9181"
				},
				{
					"name": "Sahara Gold",
					"code": "9176",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/019-da-00581.jpg",
					"alt": "Exotic slab Sahara Gold, 9176"
				},
				{
					"name": "Siberia Gold",
					"code": "9177",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-siberia-gold-9177-edge-clean.jpg",
					"alt": "Exotic slab Siberia Gold, 9177"
				},
				{
					"name": "Venato Gold",
					"code": "9178",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/022-da-00573.jpg",
					"alt": "Exotic slab Venato Gold, 9178"
				},
				{
					"name": "Fantasy Blue",
					"code": "9173",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/023-da-00157.jpg",
					"alt": "Exotic slab Fantasy Blue, 9173"
				},
				{
					"name": "Fantasy Gold",
					"code": "9174",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-fantasy-gold-9174-edge-clean.jpg",
					"alt": "Exotic slab Fantasy Gold, 9174"
				},
				{
					"name": "California Gold",
					"code": "9175",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/027-da-00105.jpg",
					"alt": "Exotic slab California Gold, 9175"
				},
				{
					"name": "Seren Blue",
					"code": "9169",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-seren-blue-9169-copy.jpg",
					"alt": "Exotic slab Seren Blue, 9169"
				},
				{
					"name": "Gray Ottoman",
					"code": "9170",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-gray-ottoman-9170-edge-clean.jpg",
					"alt": "Exotic slab Gray Ottoman, 9170"
				},
				{
					"name": "Luxe Blue",
					"code": "9171",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-luxe-blue-9171-edge-clean.jpg",
					"alt": "Exotic slab Luxe Blue, 9171"
				},
				{
					"name": "Rocky Gold",
					"code": "9161",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/035-rocky-gold-no-background.jpg",
					"alt": "Exotic slab Rocky Gold, 9161"
				},
				{
					"name": "Sky Gray",
					"code": "9162",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/slabs/exotic/037-da-00622.jpg",
					"alt": "Exotic slab Sky Gray, 9162"
				},
				{
					"name": "Seren Gold",
					"code": "9165",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-seren-gold-9165-edge-clean.jpg",
					"alt": "Exotic slab Seren Gold, 9165"
				},
				{
					"name": "Calacatta Gold",
					"code": "9139",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-gold-9139-edge-clean.jpg",
					"alt": "Exotic slab Calacatta Gold, 9139"
				},
				{
					"name": "Calacatta Classique",
					"code": "9140",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-classique-9140-copy.jpg",
					"alt": "Exotic slab Calacatta Classique, 9140"
				},
				{
					"name": "Borghini Premium",
					"code": "9143",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-borghini-premium-9143-edge-clean.jpg",
					"alt": "Exotic slab Borghini Premium, 9143"
				},
				{
					"name": "Calacatta Stella",
					"code": "9132",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-stella-9132-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Stella, 9132"
				},
				{
					"name": "Nero Marquina",
					"code": "9134",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-nero-marquina-9134-logo-crop.jpg",
					"alt": "Exotic slab Nero Marquina, 9134"
				},
				{
					"name": "Tranquility Gold",
					"code": "9131",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-tranquility-gold-9131-logo-crop.jpg",
					"alt": "Exotic slab Tranquility Gold, 9131"
				},
				{
					"name": "Calacatta Old Stain",
					"code": "9115",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-old-stain-9115-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Old Stain, 9115"
				},
				{
					"name": "Calacatta Duo",
					"code": "9116",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-duo-9116-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Duo, 9116"
				},
				{
					"name": "Calacatta Roma",
					"code": "9121",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-roma-9121-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Roma, 9121"
				},
				{
					"name": "Calacatta Lilac",
					"code": "9119",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-lilac-9119-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Lilac, 9119"
				},
				{
					"name": "Calacatta Bella",
					"code": "9126",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-bella-9126-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Bella, 9126"
				},
				{
					"name": "Calacatta Oro",
					"code": "9133",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-oro-9133-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Oro, 9133"
				},
				{
					"name": "Calacatta Unique",
					"code": "9117",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-unique-9117-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Unique, 9117"
				},
				{
					"name": "Calacatta Alpharetta",
					"code": "9125",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-alpharetta-9125-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Alpharetta, 9125"
				},
				{
					"name": "Calacatta Ocean",
					"code": "9105",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-ocean-9105-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Ocean, 9105"
				},
				{
					"name": "Calacatta Storm",
					"code": "9101",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-storm-9101-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Storm, 9101"
				},
				{
					"name": "Calacatta Storm Gold",
					"code": "9102",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-storm-gold-9102-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Storm Gold, 9102"
				},
				{
					"name": "Calacatta Grey No.2",
					"code": "9110",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-grey-no-2-9110-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Grey No.2, 9110"
				},
				{
					"name": "Marquina Grey",
					"code": "9106",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-marquina-grey-9106-logo-crop.jpg",
					"alt": "Exotic slab Marquina Grey, 9106"
				},
				{
					"name": "Calacatta Rio Light",
					"code": "9108",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-rio-light-9108-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Rio Light, 9108"
				},
				{
					"name": "Calacatta Black No.2",
					"code": "9111",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-black-no-2-9111-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Black No.2, 9111"
				},
				{
					"name": "Calacatta Black No.01",
					"code": "9104",
					"collection": "Exotic",
					"image": "assets/catalog/countertops/curated/exotic/exotic-calacatta-black-no-01-9104-logo-crop.jpg",
					"alt": "Exotic slab Calacatta Black No.01, 9104"
				},
				{
					"name": "Calacatta Storm Black",
					"code": "9114",
					"collection": "Exotic",
					"image": "assets/pdf-extracted/countertops/exotic/9114-calacatta-storm-black-pdf-slab.jpg",
					"alt": "Exotic slab Calacatta Storm Black, 9114",
					"catalog_pdf_label": "GSV-9114 Calacatta Storm Black",
					"asset_description": "White quartz slab with bold, irregular black veining and subtle fine gray hairline movement."
				},
				{
					"name": "Calacatta Rainforest Gray",
					"code": "9137",
					"collection": "Exotic",
					"image": "assets/pdf-extracted/countertops/exotic/9137-rainforest-pdf-slab.jpg",
					"alt": "Exotic slab Calacatta Rainforest Gray, 9137",
					"detail_image": "assets/pdf-extracted/countertops/exotic/9137-rainforest-pdf-detail.jpg",
					"catalog_pdf_label": "GSV-9137 Rainforest",
					"asset_description": "Soft off-white quartz slab with long, thin gray diagonal veining and restrained movement."
				}
			]
		},
		{
			"key": "natural",
			"name": "Natural",
			"collection": "Natural",
			"behavior": "Calmer Carrara-led quartz movement and lighter slab behavior.",
			"title": "Natural Countertop Collection | Asina Global",
			"meta_description": "Natural countertop collection details for Asina Global, including Carrara and Bianca quartz surfaces, 20mm slabs, and jumbo or super jumbo sizing.",
			"hero": {
				"headline": "The lighter Carrara and Bianca side of the slab catalog.",
				"body": "Natural is the calmer quartz family for brighter kitchens, baths, and commercial rooms that need a cleaner surface without dramatic, high-contrast veining.",
				"image": "assets/catalog/countertops/curated/natural/natural-carrara-white-7101-hero-prop.jpg"
			},
			"facts": [
				{
					"label": "Visual behavior",
					"value": "Soft veining, cleaner white fields, and calmer movement."
				},
				{
					"label": "Slab sizes",
					"value": "Jumbo slab 126 x 63 inches and Super Jumbo 3500 x 2000mm."
				},
				{
					"label": "Thickness",
					"value": "20mm (0.78 inch) on the published collection pages."
				}
			],
			"details": [
				{
					"label": "Material",
					"value": "Asina Global quartz is made with more than 90% natural quartz, creating a hard surface with a polished or matte-ready finish and very little routine maintenance."
				},
				{
					"label": "Performance",
					"value": "Quartz rates about 7 on the Mohs scale, giving the slab strong scratch, chip, stain, and everyday wear resistance across kitchen and bath use."
				},
				{
					"label": "Care",
					"value": "Low porosity helps block water penetration and supports an easy-clean, anti-bacterial surface that also handles short hot-pot or boiling-water contact."
				},
				{
					"label": "Best fit",
					"value": "Projects that need lighter slabs with calmer veining and a cleaner visual field."
				},
				{
					"label": "Use cases",
					"value": "Kitchens, vanities, commercial surfaces, and public counters where a brighter quartz surface fits the room."
				},
				{
					"label": "What to send",
					"value": "Send the slab name, square footage, edge profile, and sink or cooktop cutout count to start a Natural quote."
				}
			],
			"lifestyle_images": [{
				"caption": "Kitchen island",
				"image": "assets/catalog/countertops/lifestyle/natural/natural-lifestyle-01.jpg",
				"alt": "Natural quartz installed as a kitchen island and perimeter countertop"
			}, {
				"caption": "Perimeter counters",
				"image": "assets/catalog/countertops/lifestyle/natural/natural-lifestyle-02.jpg",
				"alt": "Natural quartz installed in a bright kitchen with softer veining"
			}],
			"slabs": [
				{
					"name": "Sea Flower",
					"code": "8201",
					"collection": "Natural",
					"image": "assets/catalog/countertops/slabs/natural/002-sea-flower-8201-full-slab.jpg",
					"alt": "Natural slab Sea Flower, 8201"
				},
				{
					"name": "Sand Flower",
					"code": "8202",
					"collection": "Natural",
					"image": "assets/catalog/countertops/slabs/natural/005-8202-san-flower-crop-full.jpg",
					"alt": "Natural slab Sand Flower, 8202"
				},
				{
					"name": "Sun Flower",
					"code": "8203",
					"collection": "Natural",
					"image": "assets/catalog/countertops/slabs/natural/006-da-00325.jpg",
					"alt": "Natural slab Sun Flower, 8203"
				},
				{
					"name": "Avenza Venatino",
					"code": "8114",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-avenza-venatino-8114-logo-crop.jpg",
					"alt": "Natural slab Avenza Venatino, 8114"
				},
				{
					"name": "Mystic White",
					"code": "8115",
					"collection": "Natural",
					"image": "assets/catalog/countertops/slabs/natural/010-8115-mystic-white.jpg",
					"alt": "Natural slab Mystic White, 8115"
				},
				{
					"name": "Bianco Dolomite",
					"code": "8121",
					"collection": "Natural",
					"image": "assets/catalog/countertops/slabs/natural/012-8121.jpg",
					"alt": "Natural slab Bianco Dolomite, 8121"
				},
				{
					"name": "Carrara Cloudy",
					"code": "7112",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-cloudy-7112-logo-crop.jpg",
					"alt": "Natural slab Carrara Cloudy, 7112"
				},
				{
					"name": "Carrara Bianca Gold",
					"code": "8106",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-bianca-gold-8106-logo-crop.jpg",
					"alt": "Natural slab Carrara Bianca Gold, 8106"
				},
				{
					"name": "Carrara Classic Blue",
					"code": "8111",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-classic-blue-8111-logo-crop.jpg",
					"alt": "Natural slab Carrara Classic Blue, 8111"
				},
				{
					"name": "Carrara Alto Gold",
					"code": "8101",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-alto-gold-8101-logo-crop.jpg",
					"alt": "Natural slab Carrara Alto Gold, 8101"
				},
				{
					"name": "Carrara White",
					"code": "7101",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-white-7101-closeup.jpg",
					"alt": "Natural slab Carrara White, 7101"
				},
				{
					"name": "Carrara Abraba",
					"code": "7107",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-abraba-7107-logo-crop.jpg",
					"alt": "Natural slab Carrara Abraba, 7107"
				},
				{
					"name": "Carrara Lyskamm",
					"code": "7102",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-lyskamm-7102-logo-crop.jpg",
					"alt": "Natural slab Carrara Lyskamm, 7102"
				},
				{
					"name": "Carrara Alto",
					"code": "8104",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-alto-8104-logo-crop.jpg",
					"alt": "Natural slab Carrara Alto, 8104"
				},
				{
					"name": "Carrara Venato",
					"code": "7103",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-venato-7103-logo-crop.jpg",
					"alt": "Natural slab Carrara Venato, 7103"
				},
				{
					"name": "Black Carrara",
					"code": "7105",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-black-carrara-7105-logo-crop.jpg",
					"alt": "Natural slab Black Carrara, 7105"
				},
				{
					"name": "Classic",
					"code": "8108",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-classic-8108-logo-crop.jpg",
					"alt": "Natural slab Classic, 8108"
				},
				{
					"name": "Carrara Line",
					"code": "8109",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-line-8109-logo-crop.jpg",
					"alt": "Natural slab Carrara Line, 8109"
				},
				{
					"name": "Carrara Venatino",
					"code": "8102",
					"collection": "Natural",
					"image": "assets/catalog/countertops/curated/natural/natural-carrara-venatino-8102-logo-crop.jpg",
					"alt": "Natural slab Carrara Venatino, 8102"
				},
				{
					"name": "Carrara Gold",
					"code": "7115",
					"collection": "Natural",
					"image": "assets/catalog/countertops/slabs/natural/051-quartz-model.jpg",
					"alt": "Natural slab Carrara Gold, 7115"
				},
				{
					"name": "Avenza Brown",
					"code": "8113",
					"collection": "Natural",
					"image": "assets/catalog/countertops/slabs/natural/053-quartz-collections.jpg",
					"alt": "Natural slab Avenza Brown, 8113"
				}
			]
		},
		{
			"key": "grain",
			"name": "Grain",
			"collection": "Grain Classic",
			"behavior": "Uniform granular, concrete-like, and steadier repeat slab behavior.",
			"title": "Grain Countertop Collection | Asina Global",
			"meta_description": "Grain countertop collection details for Asina Global, including uniform granular quartz surfaces, 20mm slabs, and jumbo or super jumbo sizing.",
			"hero": {
				"headline": "Cleaner, more uniform, concrete-like quartz surfaces.",
				"body": "Asina Global Grain Collection is built around a purer granular slab read, inspired by sugar grain, snow-like fields, and sandy mineral texture for projects that want bright, clean, repeatable quartz surfaces.",
				"image": "assets/catalog/countertops/lifestyle/grain/grain-lifestyle-04.jpg"
			},
			"facts": [
				{
					"label": "Product surface",
					"value": "Polish finish for a bright, clean slab face with subtle granular depth."
				},
				{
					"label": "Standard size",
					"value": "126 x 63 inches (3200 x 1600mm) and 137 x 78 inches (3500 x 2000mm)."
				},
				{
					"label": "Thickness",
					"value": "20mm (0.78 inch) and 30mm (1.18 inch)."
				}
			],
			"details": [
				{
					"label": "Material",
					"value": "Asina Global quartz is made with more than 90% natural quartz, giving Grain a dense hard surface with consistent finish quality and low maintenance."
				},
				{
					"label": "Weight",
					"value": "About 51kg per square meter (112.4 lbs) at 20mm and 70kg per square meter (154.3 lbs) at 30mm."
				},
				{
					"label": "Performance",
					"value": "Quartz rates about 7 on the Mohs scale, with solid resistance to scratching, chipping, staining, short direct heat exposure, and water penetration."
				},
				{
					"label": "Best fit",
					"value": "Projects that need more uniform slab behavior, lower visual movement, and easier repeatability across multiple spaces."
				},
				{
					"label": "Use cases",
					"value": "Multi-unit kitchens, utility surfaces, service counters, and calmer rooms where consistency matters more than bold veining."
				},
				{
					"label": "What to send",
					"value": "Send the slab name, square footage, edge profile, and sink or appliance cutout count to start a Grain quote."
				}
			],
			"lifestyle_images": [
				{
					"caption": "Bath counter",
					"image": "assets/catalog/countertops/lifestyle/grain/grain-lifestyle-01.jpg",
					"alt": "Grain quartz installed in a commercial wash area"
				},
				{
					"caption": "Kitchen island",
					"image": "assets/catalog/countertops/lifestyle/grain/grain-lifestyle-03.jpg",
					"alt": "Grain quartz installed across a darker kitchen layout"
				},
				{
					"caption": "Bright kitchen",
					"image": "assets/catalog/countertops/lifestyle/grain/grain-lifestyle-04.jpg",
					"alt": "Grain quartz installed in a bright kitchen with a large white island"
				},
				{
					"caption": "Worktop detail",
					"image": "assets/catalog/countertops/lifestyle/grain/grain-lifestyle-05.jpg",
					"alt": "Grain quartz installed as a clean white kitchen worktop"
				}
			],
			"slabs": [
				{
					"name": "Mirror White",
					"code": "1204",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-mirror-white-1204-logo-crop.jpg",
					"alt": "Grain Classic slab Mirror White, 1204"
				},
				{
					"name": "Iced White",
					"code": "1301",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-iced-white-1301-logo-crop.jpg",
					"alt": "Grain Classic slab Iced White, 1301"
				},
				{
					"name": "Moon White",
					"code": "1102",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-moon-white-1102-logo-crop.jpg",
					"alt": "Grain Classic slab Moon White, 1102"
				},
				{
					"name": "Diamond White",
					"code": "1201",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-diamond-white-1201-logo-crop.jpg",
					"alt": "Grain Classic slab Diamond White, 1201"
				},
				{
					"name": "Pure White",
					"code": "1101",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-pure-white-1101-logo-crop.jpg",
					"alt": "Grain Classic slab Pure White, 1101"
				},
				{
					"name": "Super White",
					"code": "1103",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-super-white-1103-logo-crop.jpg",
					"alt": "Grain Classic slab Super White, 1103"
				},
				{
					"name": "Pepper White",
					"code": "1303",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/slabs/grain/020-1303-pepper-white.jpg",
					"alt": "Grain Classic slab Pepper White, 1303"
				},
				{
					"name": "Light Grey",
					"code": "1203",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-light-grey-1203-logo-crop.jpg",
					"alt": "Grain Classic slab Light Grey, 1203"
				},
				{
					"name": "Cemento",
					"code": "1105",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-cemento-1105-logo-crop.jpg",
					"alt": "Grain Classic slab Cemento, 1105"
				},
				{
					"name": "Dark Grey Sparkle",
					"code": "1205",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-dark-grey-sparkle-1205-logo-crop.jpg",
					"alt": "Grain Classic slab Dark Grey Sparkle, 1205"
				},
				{
					"name": "White Sparkle",
					"code": "1202",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-white-sparkle-1202-logo-crop.jpg",
					"alt": "Grain Classic slab White Sparkle, 1202"
				},
				{
					"name": "Black Sparkle",
					"code": "1206",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-black-sparkle-1206-logo-crop.jpg",
					"alt": "Grain Classic slab Black Sparkle, 1206"
				},
				{
					"name": "Blue Sparkle",
					"code": "1209",
					"collection": "Grain Classic",
					"image": "assets/catalog/countertops/curated/grain/grain-blue-sparkle-1209-logo-crop.jpg",
					"alt": "Grain Classic slab Blue Sparkle, 1209"
				}
			]
		}
	]
};
//#endregion
//#region src/components/FloridaGlobePanel.jsx
var globeLandPaths = [
	["north-america", "M101 216C130 164 191 143 245 155C288 165 322 190 336 225C350 260 327 286 289 292C252 298 242 332 213 346C176 363 135 333 111 296C91 264 84 238 101 216Z"],
	["south-america", "M360 386C394 410 404 456 388 500C376 531 383 559 356 584C327 548 324 502 340 456C352 423 338 398 360 386Z"],
	["europe-africa", "M434 208C462 190 498 207 509 238C520 273 493 294 498 326C506 375 485 420 450 452C421 418 431 379 414 346C397 312 398 232 434 208Z"],
	["asia", "M554 190C611 179 661 215 682 269C650 302 610 304 577 333C549 358 528 334 541 303C557 264 529 217 554 190Z"],
	["australia", "M579 454C606 437 649 449 667 476C647 497 607 500 580 482C564 470 562 464 579 454Z"]
];
function GlobeLandSet({ offset = 0 }) {
	return /* @__PURE__ */ jsx("g", {
		transform: `translate(${offset} 0)`,
		children: globeLandPaths.map(([name, path]) => /* @__PURE__ */ jsx("path", {
			className: `globe-land ${name}`,
			d: path
		}, `${name}-${offset}`))
	});
}
function FloridaGlobePanel() {
	const reducedMotion = useReducedMotion();
	return /* @__PURE__ */ jsxs("div", {
		className: "florida-globe-panel",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "florida-globe-stage",
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsxs("svg", {
					className: "florida-globe-map",
					viewBox: "0 0 640 640",
					focusable: "false",
					children: [
						/* @__PURE__ */ jsxs("defs", { children: [/* @__PURE__ */ jsx("clipPath", {
							id: "florida-globe-clip",
							children: /* @__PURE__ */ jsx("circle", {
								cx: "320",
								cy: "320",
								r: "298"
							})
						}), /* @__PURE__ */ jsxs("radialGradient", {
							id: "florida-globe-shade",
							cx: "38%",
							cy: "28%",
							r: "72%",
							children: [
								/* @__PURE__ */ jsx("stop", {
									offset: "0%",
									stopColor: "oklch(99% 0.012 84 / 0.48)"
								}),
								/* @__PURE__ */ jsx("stop", {
									offset: "52%",
									stopColor: "oklch(86% 0.03 122 / 0.14)"
								}),
								/* @__PURE__ */ jsx("stop", {
									offset: "100%",
									stopColor: "oklch(18% 0.025 132 / 0.2)"
								})
							]
						})] }),
						/* @__PURE__ */ jsx("circle", {
							className: "globe-face",
							cx: "320",
							cy: "320",
							r: "298"
						}),
						/* @__PURE__ */ jsxs("g", {
							clipPath: "url(#florida-globe-clip)",
							children: [
								/* @__PURE__ */ jsx("circle", {
									className: "globe-shade",
									cx: "320",
									cy: "320",
									r: "298"
								}),
								/* @__PURE__ */ jsxs("g", {
									className: "globe-graticule",
									children: [
										/* @__PURE__ */ jsx("path", { d: "M22 320H618" }),
										/* @__PURE__ */ jsx("ellipse", {
											cx: "320",
											cy: "320",
											rx: "292",
											ry: "82"
										}),
										/* @__PURE__ */ jsx("ellipse", {
											cx: "320",
											cy: "320",
											rx: "292",
											ry: "162"
										}),
										/* @__PURE__ */ jsx("ellipse", {
											cx: "320",
											cy: "320",
											rx: "292",
											ry: "238"
										}),
										/* @__PURE__ */ jsx("path", { d: "M320 22C250 112 214 214 214 320C214 426 250 528 320 618" }),
										/* @__PURE__ */ jsx("path", { d: "M320 22C390 112 426 214 426 320C426 426 390 528 320 618" }),
										/* @__PURE__ */ jsx("path", { d: "M320 22C178 112 104 214 104 320C104 426 178 528 320 618" }),
										/* @__PURE__ */ jsx("path", { d: "M320 22C462 112 536 214 536 320C536 426 462 528 320 618" })
									]
								}),
								/* @__PURE__ */ jsxs("g", {
									className: "globe-world-track",
									children: [
										!reducedMotion && /* @__PURE__ */ jsx("animateTransform", {
											attributeName: "transform",
											type: "translate",
											from: "0 0",
											to: "-760 0",
											dur: "84s",
											repeatCount: "indefinite"
										}),
										/* @__PURE__ */ jsx(GlobeLandSet, { offset: -760 }),
										/* @__PURE__ */ jsx(GlobeLandSet, { offset: 0 }),
										/* @__PURE__ */ jsx(GlobeLandSet, { offset: 760 })
									]
								})
							]
						}),
						/* @__PURE__ */ jsx("circle", {
							className: "globe-edge",
							cx: "320",
							cy: "320",
							r: "298"
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "florida-globe-copy",
				children: [
					/* @__PURE__ */ jsx("span", { children: "From Florida to nationwide" }),
					/* @__PURE__ */ jsx("strong", { children: "Office in Longwood. Nationwide project review." }),
					/* @__PURE__ */ jsx("p", { children: "Asina reviews qualified cabinet, countertop, and furniture package inquiries across the United States, with Orlando-area coordination from Longwood, Florida." })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "florida-globe-pins",
				"aria-label": "Florida base and nationwide project coverage",
				children: [
					/* @__PURE__ */ jsx("span", { children: "Florida base" }),
					/* @__PURE__ */ jsx("span", { children: "Orlando area" }),
					/* @__PURE__ */ jsx("span", { children: "Southeast" }),
					/* @__PURE__ */ jsx("span", { children: "Nationwide" }),
					/* @__PURE__ */ jsx("span", { children: "Project-scale" })
				]
			})
		]
	});
}
//#endregion
//#region src/components/ProjectReviewForm.jsx
var motionEase$1 = [
	.23,
	1,
	.32,
	1
];
var netlifyFormName = "project-review";
var contactEmail = "asinaglobal@gmail.com";
var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var projectTypeOptions = [
	"Multi-unit development",
	"Restaurant or commercial venue",
	"Restaurant build-out",
	"Franchise rollout"
];
var categoryOptions = [
	"Cabinets",
	"Countertops",
	"Furniture package",
	"Multiple categories"
];
var timelineOptions = [
	"Bid deadline",
	"0-3 months",
	"3-6 months",
	"6+ months"
];
var scaleOptions = [
	"Unit count",
	"Store count",
	"Room count",
	"Seat count"
];
var handleChoiceKeyDown = (event, count, activeIndex, onSelect) => {
	const container = event.currentTarget.parentElement;
	let nextIndex = null;
	if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (activeIndex + 1) % count;
	else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (activeIndex - 1 + count) % count;
	else if (event.key === "Home") nextIndex = 0;
	else if (event.key === "End") nextIndex = count - 1;
	if (nextIndex === null) return;
	event.preventDefault();
	onSelect(nextIndex);
	requestAnimationFrame(() => {
		(container?.querySelectorAll("[data-choice-option]"))?.[nextIndex]?.focus();
	});
};
function ChoiceGroup({ label, name, value, options, setValue, hint }) {
	const selectedIndex = options.findIndex((option) => value === option || value.startsWith(`${option}:`));
	const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "choice-field",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "choice-field-heading",
			children: [/* @__PURE__ */ jsx("span", { children: label }), hint && /* @__PURE__ */ jsx("small", { children: hint })]
		}), /* @__PURE__ */ jsx("div", {
			className: "choice-chip-grid",
			role: "radiogroup",
			"aria-label": label,
			children: options.map((option, index) => {
				const active = value === option || value.startsWith(`${option}:`);
				return /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: active ? "choice-chip active" : "choice-chip",
					role: "radio",
					"aria-checked": active,
					tabIndex: index === focusIndex ? 0 : -1,
					"data-choice-option": true,
					onClick: () => setValue(name, option),
					onKeyDown: (event) => handleChoiceKeyDown(event, options.length, focusIndex, (nextIndex) => setValue(name, options[nextIndex])),
					children: [active && /* @__PURE__ */ jsx(Check, { size: 13 }), /* @__PURE__ */ jsx("span", { children: option })]
				}, option);
			})
		})]
	});
}
function FormGroup({ title, children, className = "" }) {
	return /* @__PURE__ */ jsxs("fieldset", {
		className: ["form-group", className].filter(Boolean).join(" "),
		children: [/* @__PURE__ */ jsx("legend", { children: title }), /* @__PURE__ */ jsx("div", { children })]
	});
}
function Field({ label, name, value, error, onChange, type = "text", hint, ...props }) {
	const id = `field-${name}`;
	const errorId = `${id}-error`;
	const hintId = `${id}-hint`;
	const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ jsxs("label", {
		className: [
			"field",
			error ? "invalid" : "",
			value?.trim() ? "filled" : ""
		].filter(Boolean).join(" "),
		htmlFor: id,
		children: [
			/* @__PURE__ */ jsxs("span", { children: [label, Boolean(props.required) && /* @__PURE__ */ jsx("em", { children: "Required" })] }),
			hint && /* @__PURE__ */ jsx("small", {
				className: "field-hint",
				id: hintId,
				children: hint
			}),
			/* @__PURE__ */ jsx("input", {
				id,
				name,
				type,
				value,
				onChange,
				"aria-invalid": Boolean(error),
				"aria-describedby": describedBy,
				...props
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsx(motion.small, {
				id: errorId,
				initial: {
					opacity: 0,
					y: -3
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: { opacity: 0 },
				children: error
			}) })
		]
	});
}
function ProjectReviewForm({ originDossier }) {
	const [values, setValues] = useState({
		name: "",
		company: "",
		email: "",
		phone: "",
		projectType: "",
		category: "",
		location: "",
		count: "",
		timeline: "",
		notes: ""
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const reducedMotion = useReducedMotion();
	const receiptPanelRef = useRef(null);
	const inlineReceiptRef = useRef(null);
	const requiredFields = [
		"name",
		"company",
		"email",
		"phone",
		"projectType",
		"category",
		"location",
		"count",
		"timeline"
	];
	const fieldLabels = {
		name: "name",
		company: "company",
		email: "email address",
		phone: "phone number",
		projectType: "project type",
		category: "product category",
		location: "project location",
		count: "unit, store, or room count",
		timeline: "timeline"
	};
	const fieldErrors = {
		name: "Enter your name.",
		company: "Enter the company or buying organization.",
		email: "Enter a work email address.",
		phone: "Enter a phone number for follow-up.",
		projectType: "Choose or enter the project type: multi-unit, restaurant, franchise rollout, or commercial venue.",
		category: "Choose or enter the product category: cabinets, countertops, furniture, or multiple categories.",
		location: "Enter the project city and state.",
		count: "Enter the unit, store, room, or seat count.",
		timeline: "Choose or enter the target timeline, bid deadline, or opening date."
	};
	const validateField = (field, value) => {
		const trimmed = value.trim();
		if (requiredFields.includes(field) && !trimmed) return fieldErrors[field] ?? `Enter ${fieldLabels[field]}.`;
		if (field === "email" && trimmed && !emailPattern.test(trimmed)) return "Enter a complete email address. Example: name@company.com.";
		return "";
	};
	const update = (event) => {
		const { name, value } = event.target;
		setValues((current) => ({
			...current,
			[name]: value
		}));
		setErrors((current) => ({
			...current,
			[name]: "",
			form: ""
		}));
	};
	const setChoice = (name, value) => {
		setValues((current) => ({
			...current,
			[name]: value
		}));
		setErrors((current) => ({
			...current,
			[name]: "",
			form: ""
		}));
	};
	const blur = (event) => {
		const { name, value } = event.target;
		setErrors((current) => ({
			...current,
			[name]: validateField(name, value)
		}));
	};
	const submit = async (event) => {
		event.preventDefault();
		if (loading || submitted) return;
		const form = event.currentTarget;
		const nextErrors = {};
		requiredFields.forEach((field) => {
			const message = validateField(field, values[field]);
			if (message) nextErrors[field] = message;
		});
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) {
			requestAnimationFrame(() => {
				const firstInvalidField = Object.keys(nextErrors)[0];
				document.getElementById(`field-${firstInvalidField}`)?.focus();
			});
			return;
		}
		setLoading(true);
		try {
			const response = await fetch("/", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams(new FormData(form)).toString()
			});
			if (!response.ok) throw new Error(`Netlify form POST failed with ${response.status}`);
			setLoading(false);
			setSubmitted(true);
		} catch {
			setLoading(false);
			setErrors((current) => ({
				...current,
				form: "We could not send the project basics. Try again, or email Asina directly with the same project basics."
			}));
		}
	};
	useEffect(() => {
		if (!submitted) return void 0;
		const timeout = window.setTimeout(() => {
			const mobile = window.matchMedia("(max-width: 760px)").matches;
			(mobile ? inlineReceiptRef.current ?? receiptPanelRef.current : receiptPanelRef.current)?.scrollIntoView({
				block: mobile ? "center" : "start",
				behavior: reducedMotion ? "auto" : "smooth"
			});
		}, 80);
		return () => window.clearTimeout(timeout);
	}, [submitted, reducedMotion]);
	const receiptRows = [
		[
			"Category",
			values.category || "Choose a product category",
			!values.category
		],
		[
			"Scale",
			values.count || "Add the unit, store, room, or seat count",
			!values.count
		],
		[
			"Timeline",
			values.timeline || "Choose a target timeline",
			!values.timeline
		],
		[
			"Location",
			values.location || "Add the project location",
			!values.location
		]
	];
	const fieldErrorEntries = Object.entries(errors).filter(([field, message]) => field !== "form" && Boolean(message));
	const missingSummary = fieldErrorEntries.map(([field]) => fieldLabels[field] ?? field);
	return /* @__PURE__ */ jsxs("section", {
		className: "review-layout",
		children: [
			/* @__PURE__ */ jsxs("aside", {
				className: submitted ? "receipt-panel submitted" : "receipt-panel",
				ref: receiptPanelRef,
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "receipt-label",
						children: submitted ? "Review Receipt" : "Next Step"
					}),
					/* @__PURE__ */ jsx("h2", { children: submitted ? "Review Received" : "After you send basics" }),
					/* @__PURE__ */ jsxs(motion.div, {
						className: "receipt-origin",
						initial: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: 6
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: reducedMotion ? 0 : .2,
							ease: motionEase$1
						},
						children: [/* @__PURE__ */ jsx("span", { children: originDossier.code }), /* @__PURE__ */ jsxs("strong", { children: ["Started from ", originDossier.label] })]
					}),
					/* @__PURE__ */ jsx(AnimatePresence, {
						mode: "wait",
						children: submitted ? /* @__PURE__ */ jsxs(motion.div, {
							className: "receipt-success",
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 8,
								scale: .98
							},
							animate: {
								opacity: 1,
								y: 0,
								scale: 1
							},
							exit: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: -4
							},
							transition: {
								duration: reducedMotion ? 0 : .24,
								ease: motionEase$1
							},
							children: [
								/* @__PURE__ */ jsx(motion.span, {
									className: "receipt-icon",
									initial: reducedMotion ? {
										opacity: 1,
										scale: 1
									} : {
										opacity: 0,
										scale: .9,
										rotate: -2
									},
									animate: {
										opacity: 1,
										scale: 1,
										rotate: 0
									},
									transition: {
										duration: reducedMotion ? 0 : .2,
										delay: reducedMotion ? 0 : .08,
										ease: motionEase$1
									},
									children: /* @__PURE__ */ jsx(PackageCheck, { size: 30 })
								}),
								/* @__PURE__ */ jsx("p", { children: "We received your project basics. Asina will review the details and follow up by email within 1-2 business days. If the project is a fit, the next email will request drawings or specs for a Project Supply Review." }),
								/* @__PURE__ */ jsx("div", {
									className: "receipt-confirmed-rows",
									children: receiptRows.map(([label, value], index) => /* @__PURE__ */ jsxs(motion.dl, {
										initial: reducedMotion ? {
											opacity: 1,
											y: 0
										} : {
											opacity: 0,
											y: 7
										},
										animate: {
											opacity: 1,
											y: 0
										},
										transition: {
											duration: reducedMotion ? 0 : .16,
											delay: reducedMotion ? 0 : .1 + index * .035,
											ease: motionEase$1
										},
										children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: value })]
									}, label))
								})
							]
						}, "receipt") : /* @__PURE__ */ jsxs(motion.div, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							exit: { opacity: 0 },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "live-receipt",
								children: [/* @__PURE__ */ jsx("span", { children: "Project packet preview" }), receiptRows.map(([label, value, pending], index) => /* @__PURE__ */ jsxs(motion.dl, {
									className: pending ? "pending" : "filled",
									initial: reducedMotion ? { opacity: 1 } : {
										opacity: 0,
										x: 6
									},
									animate: {
										opacity: 1,
										x: 0
									},
									transition: {
										duration: reducedMotion ? 0 : .16,
										delay: reducedMotion ? 0 : index * .025,
										ease: motionEase$1
									},
									children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: value })]
								}, label))]
							}), /* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsx("li", { children: "No public uploads." }),
								/* @__PURE__ */ jsx("li", { children: "Drawings requested by email after initial review." }),
								/* @__PURE__ */ jsx("li", { children: "Project Supply Review for qualified projects." })
							] })]
						}, "pending")
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: submitted ? "mobile-review-summary submitted" : "mobile-review-summary",
				"aria-label": "Project review next step",
				children: [
					/* @__PURE__ */ jsx("strong", { children: "Project basics only" }),
					/* @__PURE__ */ jsx("p", { children: "No public uploads. If the project is a fit, Asina requests drawings or specs by email in 1-2 business days." }),
					/* @__PURE__ */ jsx("div", { children: receiptRows.slice(0, 3).map(([label, value, pending]) => /* @__PURE__ */ jsxs("span", {
						className: pending ? "pending" : "filled",
						children: [
							label,
							": ",
							value
						]
					}, label)) })
				]
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "project-form",
				name: netlifyFormName,
				method: "POST",
				"data-netlify": "true",
				"netlify-honeypot": "bot-field",
				onSubmit: submit,
				noValidate: true,
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "hidden",
						name: "form-name",
						value: netlifyFormName
					}),
					/* @__PURE__ */ jsx("input", {
						type: "hidden",
						name: "origin",
						value: originDossier.label
					}),
					/* @__PURE__ */ jsx("p", {
						className: "netlify-honeypot",
						"aria-hidden": "true",
						children: /* @__PURE__ */ jsxs("label", { children: ["Do not fill this out if you are human:", /* @__PURE__ */ jsx("input", {
							name: "bot-field",
							type: "text",
							tabIndex: -1,
							autoComplete: "off"
						})] })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "form-intake-note",
						children: [/* @__PURE__ */ jsx("strong", { children: "Basics only. No public uploads." }), /* @__PURE__ */ jsx("p", { children: "Share the project type, scale, and contact details here. If the scope fits Asina's supply model, drawings and specs are requested by email." })]
					}),
					/* @__PURE__ */ jsx(AnimatePresence, { children: fieldErrorEntries.length > 0 && /* @__PURE__ */ jsxs(motion.div, {
						className: "validation-summary",
						role: "alert",
						initial: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: -4
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: -4
						},
						transition: {
							duration: reducedMotion ? 0 : .16,
							ease: motionEase$1
						},
						children: [
							/* @__PURE__ */ jsxs("strong", { children: [
								"Finish ",
								fieldErrorEntries.length,
								" required ",
								fieldErrorEntries.length === 1 ? "detail" : "details",
								" before sending."
							] }),
							" ",
							/* @__PURE__ */ jsxs("p", { children: [
								"Add ",
								missingSummary.slice(0, 4).join(", "),
								missingSummary.length > 4 ? `, and ${missingSummary.length - 4} more.` : "."
							] })
						]
					}) }),
					/* @__PURE__ */ jsxs(FormGroup, {
						title: "Contact",
						className: "form-group-contact",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Name",
								name: "name",
								value: values.name,
								error: errors.name,
								onChange: update,
								onBlur: blur,
								autoComplete: "name",
								required: true
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Company",
								name: "company",
								value: values.company,
								error: errors.company,
								onChange: update,
								onBlur: blur,
								autoComplete: "organization",
								required: true
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Email",
								name: "email",
								type: "email",
								value: values.email,
								error: errors.email,
								onChange: update,
								onBlur: blur,
								autoComplete: "email",
								inputMode: "email",
								required: true
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Phone",
								name: "phone",
								type: "tel",
								value: values.phone,
								error: errors.phone,
								onChange: update,
								onBlur: blur,
								autoComplete: "tel",
								inputMode: "tel",
								required: true
							})
						]
					}),
					/* @__PURE__ */ jsxs(FormGroup, {
						title: "Project Details",
						className: "form-group-project",
						children: [
							/* @__PURE__ */ jsx(ChoiceGroup, {
								label: "Project Type",
								name: "projectType",
								value: values.projectType,
								options: projectTypeOptions,
								setValue: setChoice,
								hint: "Choose the closest option. Use the field below for commercial or mixed project types."
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Project Type Detail",
								name: "projectType",
								value: values.projectType,
								error: errors.projectType,
								onChange: update,
								onBlur: blur,
								placeholder: "Multi-unit development, restaurant, franchise, commercial venue, mixed project",
								hint: "Use the buyer type or build-out type for Asina's first review.",
								required: true
							}),
							/* @__PURE__ */ jsx(ChoiceGroup, {
								label: "Product Category",
								name: "category",
								value: values.category,
								options: categoryOptions,
								setValue: setChoice,
								hint: "Choose the supply category for Asina to review first."
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Product Category Detail",
								name: "category",
								value: values.category,
								error: errors.category,
								onChange: update,
								onBlur: blur,
								placeholder: "Cabinets, countertops, furniture, multiple categories",
								hint: "List every category that may be part of the quote.",
								required: true
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Project Location",
								name: "location",
								value: values.location,
								error: errors.location,
								onChange: update,
								onBlur: blur,
								autoComplete: "address-level2",
								hint: "City and state are enough for initial review.",
								required: true
							})
						]
					}),
					/* @__PURE__ */ jsxs(FormGroup, {
						title: "Scale + Timing",
						className: "form-group-scale",
						children: [
							/* @__PURE__ */ jsx(ChoiceGroup, {
								label: "Scale Type",
								name: "count",
								value: values.count,
								options: scaleOptions,
								setValue: (name, option) => setChoice(name, `${option}: `),
								hint: "Choose the count type, then add the number."
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Unit, Store, Room, or Seat Count",
								name: "count",
								value: values.count,
								error: errors.count,
								onChange: update,
								onBlur: blur,
								hint: "Use the count that best matches the project: units, stores, rooms, or seats.",
								required: true
							}),
							/* @__PURE__ */ jsx(ChoiceGroup, {
								label: "Timeline",
								name: "timeline",
								value: values.timeline,
								options: timelineOptions,
								setValue: setChoice,
								hint: "Choose the closest window. Add opening date or delivery detail below."
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Timeline Detail",
								name: "timeline",
								value: values.timeline,
								error: errors.timeline,
								onChange: update,
								onBlur: blur,
								hint: "Share bid deadline, production target, opening date, or delivery window.",
								required: true
							})
						]
					}),
					/* @__PURE__ */ jsx(FormGroup, {
						title: "Notes",
						className: "form-group-notes",
						children: /* @__PURE__ */ jsxs("label", {
							className: "field span-all",
							htmlFor: "field-notes",
							children: [/* @__PURE__ */ jsx("span", { children: "Notes" }), /* @__PURE__ */ jsx("textarea", {
								id: "field-notes",
								name: "notes",
								value: values.notes,
								onChange: update,
								rows: 5,
								placeholder: "Materials, finishes, target budget, franchise standards, shipping needs"
							})]
						})
					}),
					/* @__PURE__ */ jsx(AnimatePresence, { children: submitted && /* @__PURE__ */ jsxs(motion.div, {
						className: "inline-receipt",
						ref: inlineReceiptRef,
						"aria-live": "polite",
						initial: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: 8,
							scale: .98
						},
						animate: {
							opacity: 1,
							y: 0,
							scale: 1
						},
						exit: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: -4
						},
						transition: {
							duration: reducedMotion ? 0 : .22,
							ease: motionEase$1
						},
						children: [
							/* @__PURE__ */ jsx(motion.span, {
								className: "inline-receipt-scan",
								"aria-hidden": "true",
								initial: reducedMotion ? { scaleX: 1 } : { scaleX: 0 },
								animate: { scaleX: 1 },
								transition: {
									duration: reducedMotion ? 0 : .32,
									ease: motionEase$1
								}
							}),
							/* @__PURE__ */ jsx(PackageCheck, { size: 22 }),
							/* @__PURE__ */ jsx("p", { children: "Review received. Asina will follow up by email within 1-2 business days and request drawings or specs if the project is a fit." })
						]
					}) }),
					/* @__PURE__ */ jsx(AnimatePresence, { children: errors.form && /* @__PURE__ */ jsxs(motion.div, {
						className: "form-status-error",
						role: "alert",
						initial: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: -4
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: -4
						},
						transition: {
							duration: reducedMotion ? 0 : .16,
							ease: motionEase$1
						},
						children: [/* @__PURE__ */ jsx("p", { children: errors.form }), /* @__PURE__ */ jsx("a", {
							href: `mailto:${contactEmail}`,
							children: contactEmail
						})]
					}) }),
					/* @__PURE__ */ jsxs("div", {
						className: "form-footer",
						children: [/* @__PURE__ */ jsxs("p", { children: [
							"For security, drawings and specs are requested by email after initial review. See the",
							" ",
							/* @__PURE__ */ jsx("a", {
								href: "/privacy-policy/",
								children: "Privacy Policy"
							}),
							" for how project basics are handled."
						] }), /* @__PURE__ */ jsxs("button", {
							className: "button primary stable-submit",
							type: "submit",
							disabled: loading || submitted,
							"aria-busy": loading,
							children: [
								/* @__PURE__ */ jsx(AnimatePresence, { children: loading && /* @__PURE__ */ jsx(motion.span, {
									className: "submit-progress",
									initial: {
										scaleX: 0,
										opacity: 0
									},
									animate: {
										scaleX: 1,
										opacity: 1
									},
									exit: { opacity: 0 },
									transition: {
										duration: reducedMotion ? 0 : .62,
										ease: motionEase$1
									}
								}) }),
								/* @__PURE__ */ jsx(AnimatePresence, {
									mode: "wait",
									children: /* @__PURE__ */ jsx(motion.span, {
										initial: reducedMotion ? { opacity: 1 } : {
											opacity: 0,
											y: 4
										},
										animate: {
											opacity: 1,
											y: 0
										},
										exit: reducedMotion ? { opacity: 1 } : {
											opacity: 0,
											y: -4
										},
										transition: {
											duration: reducedMotion ? 0 : .16,
											ease: motionEase$1
										},
										children: submitted ? "Review Received" : loading ? "Sending Basics" : "Start Project Review"
									}, submitted ? "done" : loading ? "loading" : "default")
								}),
								!submitted && /* @__PURE__ */ jsx(Send, { size: 17 })
							]
						})]
					})
				]
			})
		]
	});
}
var image_manifest_default = {
	format: "webp",
	images: /* @__PURE__ */ JSON.parse("{\"assets/catalog/cabinets/optimized/page-05-img-01-obj-1839.jpg\":[1600,1200,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-07-img-02-obj-1858.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-08-img-01-obj-1865.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-08-img-04-obj-2663.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-09-img-04-obj-1882.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-09-img-05-obj-1883.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-10-img-06-obj-1897.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-10-img-07-obj-1898.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-11-img-04-obj-1909.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-11-img-05-obj-1910.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-12-img-02-obj-1919.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-13-img-08-obj-1937.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-13-img-09-obj-1938.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-14-img-11-obj-1957.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-14-img-12-obj-1958.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-17-img-02-obj-1981.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-18-img-15-obj-2005.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-19-img-16-obj-2031.jpg\":[1600,914,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-19-img-17-obj-2032.jpg\":[1600,914,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-20-img-03-obj-2042.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-21-img-02-obj-2053.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-21-img-03-obj-2054.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-22-img-04-obj-2066.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-22-img-05-obj-2067.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-23-img-04-obj-2077.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-24-img-06-obj-2092.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-25-img-04-obj-2102.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/cabinets/optimized/page-26-img-08-obj-2120.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/countertops/curated/exotic/exotic-borghini-premium-9143-edge-clean.jpg\":[1584,920,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-alpharetta-9125-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-bella-9126-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-black-no-01-9104-logo-crop.jpg\":[559,398,[160,240,320,480,559]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-black-no-2-9111-logo-crop.jpg\":[1109,740,[160,240,320,480,640,768,960,1109]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-classique-9140-copy.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-duo-9116-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-gold-9139-edge-clean.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-grey-no-2-9110-logo-crop.jpg\":[1212,794,[160,240,320,480,640,768,960,1212]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-lilac-9119-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-ocean-9105-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-old-stain-9115-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-oro-9133-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-rio-light-9108-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-roma-9121-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-stella-9132-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-storm-9101-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-storm-gold-9102-logo-crop.jpg\":[1208,794,[160,240,320,480,640,768,960,1208]],\"assets/catalog/countertops/curated/exotic/exotic-calacatta-unique-9117-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-fantasy-gold-9174-edge-clean.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/curated/exotic/exotic-gray-ottoman-9170-edge-clean.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/curated/exotic/exotic-luxe-blue-9171-edge-clean.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/curated/exotic/exotic-marquina-grey-9106-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/exotic/exotic-nero-marquina-9134-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/exotic/exotic-seren-blue-9169-copy.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/curated/exotic/exotic-seren-gold-9165-edge-clean.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/curated/exotic/exotic-siberia-gold-9177-edge-clean.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/curated/exotic/exotic-tranquility-gold-9131-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/grain/grain-black-sparkle-1206-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/grain/grain-blue-sparkle-1209-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/grain/grain-cemento-1105-logo-crop.jpg\":[1183,794,[160,240,320,480,640,768,960,1183]],\"assets/catalog/countertops/curated/grain/grain-dark-grey-sparkle-1205-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/grain/grain-diamond-white-1201-logo-crop.jpg\":[1226,794,[160,240,320,480,640,768,960,1226]],\"assets/catalog/countertops/curated/grain/grain-iced-white-1301-logo-crop.jpg\":[1203,794,[160,240,320,480,640,768,960,1203]],\"assets/catalog/countertops/curated/grain/grain-light-grey-1203-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/grain/grain-mirror-white-1204-logo-crop.jpg\":[1133,794,[160,240,320,480,640,768,960,1133]],\"assets/catalog/countertops/curated/grain/grain-moon-white-1102-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/grain/grain-pure-white-1101-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/grain/grain-super-white-1103-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/grain/grain-white-sparkle-1202-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/curated/natural/natural-avenza-venatino-8114-logo-crop.jpg\":[1299,751,[160,240,320,480,640,768,960,1280,1299]],\"assets/catalog/countertops/curated/natural/natural-black-carrara-7105-logo-crop.jpg\":[1136,740,[160,240,320,480,640,768,960,1136]],\"assets/catalog/countertops/curated/natural/natural-carrara-abraba-7107-logo-crop.jpg\":[666,777,[160,240,320,480,640,666]],\"assets/catalog/countertops/curated/natural/natural-carrara-alto-8104-logo-crop.jpg\":[1283,794,[160,240,320,480,640,768,960,1280,1283]],\"assets/catalog/countertops/curated/natural/natural-carrara-alto-gold-8101-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/natural/natural-carrara-bianca-gold-8106-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/natural/natural-carrara-classic-blue-8111-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/natural/natural-carrara-cloudy-7112-logo-crop.jpg\":[688,466,[160,240,320,480,640,688]],\"assets/catalog/countertops/curated/natural/natural-carrara-line-8109-logo-crop.jpg\":[1187,740,[160,240,320,480,640,768,960,1187]],\"assets/catalog/countertops/curated/natural/natural-carrara-lyskamm-7102-logo-crop.jpg\":[1090,794,[160,240,320,480,640,768,960,1090]],\"assets/catalog/countertops/curated/natural/natural-carrara-venatino-8102-logo-crop.jpg\":[1147,794,[160,240,320,480,640,768,960,1147]],\"assets/catalog/countertops/curated/natural/natural-carrara-venato-7103-logo-crop.jpg\":[1136,740,[160,240,320,480,640,768,960,1136]],\"assets/catalog/countertops/curated/natural/natural-carrara-white-7101-closeup.jpg\":[1200,772,[160,240,320,480,640,768,960,1200]],\"assets/catalog/countertops/curated/natural/natural-carrara-white-7101-hero-prop.jpg\":[1080,840,[160,240,320,480,640,768,960,1080]],\"assets/catalog/countertops/curated/natural/natural-carrara-white-7101-logo-crop.jpg\":[1053,758,[160,240,320,480,640,768,960,1053]],\"assets/catalog/countertops/curated/natural/natural-classic-8108-logo-crop.jpg\":[1164,794,[160,240,320,480,640,768,960,1164]],\"assets/catalog/countertops/extracted/page-06-img-01-obj-1756.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg\":[1600,900,[160,240,320,480,640,768,960,1280,1600]],\"assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-01.jpg\":[1414,1800,[160,240,320,480,640,768,960,1280,1414]],\"assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-02.jpg\":[2000,1520,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-03.jpg\":[2000,1516,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-04.jpg\":[2000,1284,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-05.jpg\":[2000,1460,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/lifestyle/grain/grain-lifestyle-01.jpg\":[2000,1334,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/lifestyle/grain/grain-lifestyle-03.jpg\":[2000,1306,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/lifestyle/grain/grain-lifestyle-04.jpg\":[1500,1002,[160,240,320,480,640,768,960,1280,1500]],\"assets/catalog/countertops/lifestyle/grain/grain-lifestyle-05.jpg\":[800,534,[160,240,320,480,640,768,800]],\"assets/catalog/countertops/lifestyle/natural/natural-lifestyle-01.jpg\":[2000,1250,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/lifestyle/natural/natural-lifestyle-02.jpg\":[2000,1250,[160,240,320,480,640,768,960,1280,1600,2000]],\"assets/catalog/countertops/slabs/exotic/001-da-00200.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/004-alaska-blue-9205-full-slab.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/007-da-00455.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/exotic/008-da-00083.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/010-9202.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/012-picasso-gold-9179.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/015-miami-white-9180.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/016-moon-sandquartz-countertop-designs.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/019-da-00581.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/exotic/022-da-00573.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/exotic/023-da-00157.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/exotic/027-da-00105.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/exotic/035-rocky-gold-no-background.jpg\":[1584,788,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/037-da-00622.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/exotic/102-9137-quartz-full-slab.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/exotic/9204-imperial-gold-full-slab-no-logo.jpg\":[2560,1463,[160,240,320,480,640,768,960,1280,1600,2560]],\"assets/catalog/countertops/slabs/grain/020-1303-pepper-white.jpg\":[1280,732,[160,240,320,480,640,768,960,1280]],\"assets/catalog/countertops/slabs/natural/002-sea-flower-8201-full-slab.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/natural/005-8202-san-flower-crop-full.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/natural/006-da-00325.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/natural/010-8115-mystic-white.jpg\":[876,500,[160,240,320,480,640,768,876]],\"assets/catalog/countertops/slabs/natural/012-8121.jpg\":[1584,906,[160,240,320,480,640,768,960,1280,1584]],\"assets/catalog/countertops/slabs/natural/051-quartz-model.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/catalog/countertops/slabs/natural/053-quartz-collections.jpg\":[1384,924,[160,240,320,480,640,768,960,1280,1384]],\"assets/pdf-extracted/countertops/exotic/9114-calacatta-storm-black-pdf-slab.jpg\":[1544,436,[160,240,320,480,640,768,960,1280,1544]],\"assets/pdf-extracted/countertops/exotic/9137-rainforest-pdf-detail.jpg\":[330,438,[160,240,320,330]],\"assets/pdf-extracted/countertops/exotic/9137-rainforest-pdf-slab.jpg\":[509,1005,[160,240,320,480,509]],\"assets/supporting/brand/asina-global-logo.jpg\":[2667,2500,[160,240,320,480,640,768,960,1280,1600,2667]],\"assets/supporting/brand/asina-global-logo.png\":[1600,800,[160,240,320,480,640,768,960,1280,1600]],\"assets/supporting/brand/asina-global-social-card.png\":[1200,630,[160,240,320,480,640,768,960,1200]],\"assets/supporting/furniture/osos/base-frasca-maxi-fix.jpg\":[600,600,[160,240,320,480,600]],\"assets/supporting/furniture/osos/ghe-volos-chair.jpg\":[519,600,[160,240,320,480,519]],\"assets/supporting/furniture/velit/lounge-group.jpeg\":[1531,1372,[160,240,320,480,640,768,960,1280,1531]],\"assets/supporting/furniture/velit/marina-dining.jpeg\":[1245,1759,[160,240,320,480,640,768,960,1245]],\"assets/supporting/furniture/velit/sunset-dining.jpeg\":[1245,1759,[160,240,320,480,640,768,960,1245]],\"assets/supporting/furniture/velit/terrace-lounge.jpeg\":[1243,1759,[160,240,320,480,640,768,960,1243]],\"assets/supporting/team/andy-pham.jpg\":[2048,2046,[160,240,320,480,640,768,960,1280,1600,2048]],\"assets/supporting/team/chuck-tran.jpg\":[960,960,[160,240,320,480,640,768,960]],\"assets/supporting/team/hai-ho.jpg\":[512,512,[160,240,320,480,512]],\"assets/supporting/team/kim-nguyen.jpeg\":[200,200,[160,200]]}")
};
//#endregion
//#region src/pageShared.jsx
var ASSET = (path) => `/${path}`;
var motionEase = [
	.23,
	1,
	.32,
	1
];
var cabinetShowcaseStorageKey = "asina:last-cabinet-showcase";
var cabinetShowcaseKeyForPageLoad = null;
var slabShowcaseStorageKey = "asina:last-slab-showcase";
var slabShowcaseKeyForPageLoad = null;
var normalizeAssetPath = (path) => String(path).replace(/^\/+/, "").split("?")[0];
var getGeneratedImagePath = (path, width) => {
	const assetPath = normalizeAssetPath(path).replace(/^assets\//, "");
	const extensionIndex = assetPath.lastIndexOf(".");
	return `assets/generated/${extensionIndex >= 0 ? assetPath.slice(0, extensionIndex) : assetPath}-${width}.webp`;
};
var getImageMeta = (path) => {
	const key = normalizeAssetPath(path);
	const entry = image_manifest_default.images?.[key];
	if (!entry) return null;
	if (Array.isArray(entry)) {
		const [width, height, widths = []] = entry;
		return {
			width,
			height,
			variants: widths.map((variantWidth) => ({
				width: variantWidth,
				path: getGeneratedImagePath(key, variantWidth)
			}))
		};
	}
	return entry;
};
var getImageVariant = (path, preferredWidth) => {
	const variants = getImageMeta(path)?.variants ?? [];
	if (!variants.length) return String(path).replace(/^\/+/, "");
	if (!preferredWidth) return variants[variants.length - 1].path;
	return variants.find((variant) => variant.width >= preferredWidth)?.path ?? variants[variants.length - 1].path;
};
var getImageSrcSet = (path) => {
	return (getImageMeta(path)?.variants ?? []).map((variant) => `${ASSET(variant.path)} ${variant.width}w`).join(", ");
};
var responsiveImageAttrs = (path, { alt = "", sizes = "100vw", loading = "lazy", fetchPriority, preferredWidth, width, height } = {}) => {
	const meta = getImageMeta(path);
	const attrs = {
		src: ASSET(getImageVariant(path, preferredWidth)),
		alt,
		decoding: "async"
	};
	if (loading) attrs.loading = loading;
	if (fetchPriority) attrs.fetchPriority = fetchPriority;
	if (meta?.width) attrs.width = width ?? meta.width;
	if (meta?.height) attrs.height = height ?? meta.height;
	if (!meta?.width && width) attrs.width = width;
	if (!meta?.height && height) attrs.height = height;
	const srcSet = getImageSrcSet(path);
	if (srcSet) {
		attrs.srcSet = srcSet;
		attrs.sizes = sizes;
	}
	return attrs;
};
function ResponsiveImage({ src, alt, sizes, loading, fetchPriority, preferredWidth, width, height, ...props }) {
	if (typeof alt !== "string" || alt.trim().length === 0) throw new Error(`ResponsiveImage requires a descriptive alt for ${src}`);
	return /* @__PURE__ */ jsx("img", {
		...responsiveImageAttrs(src, {
			alt,
			sizes,
			loading,
			fetchPriority,
			preferredWidth,
			width,
			height
		}),
		...props
	});
}
var getCabinetShowcaseKey = (collections) => {
	if (!collections.length) return null;
	const fallback = collections[0].key;
	if (typeof window === "undefined") return fallback;
	const keys = collections.map((collection) => collection.key);
	if (cabinetShowcaseKeyForPageLoad && keys.includes(cabinetShowcaseKeyForPageLoad)) return cabinetShowcaseKeyForPageLoad;
	try {
		const previous = window.localStorage.getItem(cabinetShowcaseStorageKey);
		const candidates = keys.filter((key) => key !== previous);
		const pool = candidates.length ? candidates : keys;
		const next = pool[Math.floor(Math.random() * pool.length)] ?? fallback;
		cabinetShowcaseKeyForPageLoad = next;
		window.localStorage.setItem(cabinetShowcaseStorageKey, next);
		return next;
	} catch {
		const next = keys[Math.floor(Math.random() * keys.length)] ?? fallback;
		cabinetShowcaseKeyForPageLoad = next;
		return next;
	}
};
var getSlabShowcaseDossier = (collections) => {
	const slabs = collections.flatMap((collection) => collection.slabs.map((slab) => ({
		collection,
		slab
	})));
	const fallback = {
		collection: collections[0],
		slab: collections[0]?.slabs?.[0]
	};
	if (!slabs.length) return fallback;
	if (typeof window === "undefined") return slabs[0];
	slabs.map(({ collection, slab }) => `${collection.key}:${slab.code}`);
	if (slabShowcaseKeyForPageLoad) {
		const dossier = slabs.find(({ collection, slab }) => `${collection.key}:${slab.code}` === slabShowcaseKeyForPageLoad);
		if (dossier) return dossier;
	}
	try {
		const previous = window.localStorage.getItem(slabShowcaseStorageKey);
		const candidates = slabs.filter(({ collection, slab }) => `${collection.key}:${slab.code}` !== previous);
		const pool = candidates.length ? candidates : slabs;
		const next = pool[Math.floor(Math.random() * pool.length)] ?? slabs[0];
		slabShowcaseKeyForPageLoad = `${next.collection.key}:${next.slab.code}`;
		window.localStorage.setItem(slabShowcaseStorageKey, slabShowcaseKeyForPageLoad);
		return next;
	} catch {
		const next = slabs[Math.floor(Math.random() * slabs.length)] ?? slabs[0];
		slabShowcaseKeyForPageLoad = `${next.collection.key}:${next.slab.code}`;
		return next;
	}
};
var processCues = [
	{
		cue: "Project basics logged",
		tag: "Unit count / category / timeline",
		visual: "Project form"
	},
	{
		cue: "Drawings requested",
		tag: "Plans by email, no public upload",
		visual: "Drawing tag"
	},
	{
		cue: "Supply review ready",
		tag: "Cost, minimums, QA, shipping",
		visual: "Review checklist"
	},
	{
		cue: "Mockup approved as reference",
		tag: "Measurement / color / finish",
		visual: "Approval stamp"
	},
	{
		cue: "Production checked to approved spec",
		tag: "Production QA",
		visual: "QA ledger"
	},
	{
		cue: "Packing and responsibility reviewed",
		tag: "Freight quote / Incoterms® 2020",
		visual: "Shipping label"
	}
];
var qaStages = [
	"Mockup Approved",
	"Built To Approved Spec",
	"Production QA",
	"Finish + Color Check",
	"Checked Before Packing",
	"Quality Checked Before Shipment"
];
var heroAssets = {
	environment: "assets/catalog/countertops/extracted/page-08-img-03-obj-1770.jpg",
	materialContext: "assets/catalog/countertops/extracted/page-06-img-01-obj-1756.jpg",
	countertopContext: "assets/catalog/countertops/lifestyle/exotic/exotic-lifestyle-05.jpg",
	slab: "assets/pdf-extracted/countertops/exotic/9114-calacatta-storm-black-pdf-slab.jpg",
	cabinet: "assets/catalog/cabinets/optimized/page-11-img-05-obj-1910.jpg",
	cabinetRoom: "assets/catalog/cabinets/optimized/page-18-img-14-obj-2004.jpg",
	furniture: "assets/supporting/furniture/velit/terrace-lounge.jpeg",
	furnitureCutout: "assets/supporting/furniture/velit/lounge-group.jpeg",
	logo: "assets/supporting/brand/asina-global-logo.svg?v=20260525-8"
};
var furnitureCases = [
	{
		title: "Restaurant packet",
		image: "assets/supporting/furniture/velit/marina-dining.jpeg",
		scale: "Dining group quantities, seating layout, finish direction",
		packet: [
			"Floor plan",
			"Chair and table files",
			"Material direction",
			"Timeline"
		],
		path: "The mockup confirms dimensions, finishes, and packing before repeat production."
	},
	{
		title: "Franchise repeat kit",
		image: "assets/supporting/furniture/velit/lounge-group.jpeg",
		scale: "Store count, brand standards, first-store reference",
		packet: [
			"Brand standard",
			"Store count",
			"Quantity estimate",
			"Repeat phase"
		],
		path: "The first approved package sets the reference for later locations."
	},
	{
		title: "Commercial outdoor set",
		image: "assets/supporting/furniture/velit/terrace-lounge.jpeg",
		scale: "Use case, finish exposure, packing protection",
		packet: [
			"Look reference",
			"Finish target",
			"Use condition",
			"Destination"
		],
		path: "Packing and shipping responsibility are checked before release."
	}
];
var cabinetCollectionRouteMap = {
	"cabinet-malibu": "malibu",
	"cabinet-monterey": "monterey",
	"cabinet-newport": "newport",
	"cabinet-catalina": "catalina",
	"cabinet-laguna": "laguna",
	"cabinet-jersey": "jersey"
};
var countertopCollectionRouteMap = {
	"countertop-exotic": "exotic",
	"countertop-natural": "natural",
	"countertop-grain": "grain"
};
var cabinetCollectionRoutes = Object.entries(cabinetCollectionRouteMap).map(([pageId, key]) => ({
	pageId,
	key
}));
var countertopCollectionRoutes = Object.entries(countertopCollectionRouteMap).map(([pageId, key]) => ({
	pageId,
	key
}));
var commercialIntentPages = {
	"commercial-mixed": {
		eyebrow: "Commercial Cabinet + Countertop Supply",
		title: "Commercial Cabinet and Countertop Supply in Florida",
		copy: "For builders, developers, hospitality buyers, restaurant groups, and procurement teams, Asina reviews cabinet packages, slab decisions, QA, packing, and shipping responsibility in one place.",
		media: heroAssets.environment,
		mediaAlt: "Commercial cabinet and countertop supply packet prepared for Florida project review",
		ticket: "Cabinet finish, slab code, destination, timeline",
		introEyebrow: "Mixed Scope Fit",
		introTitle: "Wholesale Cabinet and Countertop Supply for Florida Commercial Projects",
		introCopy: "This page answers commercial cabinet and countertop supplier searches without turning the site into a retail showroom. Asina checks scope, scale, timeline, and approvals before drawings or specs move by email.",
		scopes: [
			["Cabinet packages", "Finish choice, room type, cabinet run, unit count, and mockup needs."],
			["Countertop supply", "Slab code, square footage, edge profile, cutouts, destination, and timeline."],
			["Commercial rooms", "Apartments, hospitality rooms, restaurant spaces, amenity areas, and repeat interiors."],
			["Supply controls", "QA, packing review, shipping responsibility, and written quote terms."]
		],
		inputGroups: [
			["Cabinets", [
				"Finish choice",
				"Room type",
				"Cabinet run",
				"Unit count"
			]],
			["Countertops", [
				"Slab code",
				"Square footage",
				"Edge profile",
				"Cutouts"
			]],
			["Project path", [
				"Destination",
				"Timeline",
				"Mockup needs",
				"Shipping responsibility"
			]]
		],
		proofRows: [
			["Retail showroom", "Useful for browsing. Less useful when unit count, repeat rooms, and import planning drive the decision."],
			["Warehouse or discount page", "Helpful for in-stock needs. It often leaves QA, packing, and responsibility for later."],
			["Asina project review", "Brings cabinet and countertop decisions into the same review with drawings, mockup approval, QA, packing, and shipping."]
		],
		whatItems: [
			"Product categories",
			"Project location",
			"Unit, store, or room count",
			"Cabinet finish direction",
			"Slab code or surface direction",
			"Timeline and shipping needs"
		],
		handoffTitle: "Use one review when the rooms need one coordinated answer.",
		handoffCopy: "Asina can review cabinet and countertop scope together when a buyer needs one answer for quote inputs, approvals, QA, packing, and delivery responsibility."
	},
	"commercial-countertops": {
		eyebrow: "Commercial Countertop Supply Orlando",
		title: "Countertop supply review for Orlando and Florida commercial projects.",
		copy: "Asina reviews commercial countertop requests by slab code, square footage, edge needs, cutouts, destination, timeline, and whether cabinets need to move with the surface package.",
		media: heroAssets.slab,
		mediaAlt: "Quartz slab prepared for Orlando commercial countertop supply review",
		ticket: "Slab code, edge profile, cutouts, square footage",
		introEyebrow: "Greater Orlando Countertops",
		introTitle: "The office is in Longwood, within the Greater Orlando market.",
		introCopy: "A slab name is not enough for commercial work. Pricing gets cleaner when material direction, sizing, cutouts, packing, destination, and timing are known first.",
		scopes: [
			["Restaurants + bars", "High-use counters, bar fronts, service surfaces, edge needs, and cutouts."],
			["Hotels + amenities", "Lobby, vanity, amenity, and repeat room surfaces that need finish consistency."],
			["Apartments", "Repeat unit counters, model-unit review, phase timing, and packing responsibility."],
			["Cabinet coordination", "Use one review when cabinets and surfaces need to land in the same project path."]
		],
		inputGroups: [
			["Slab facts", [
				"Code or name",
				"Collection",
				"Movement",
				"Thickness"
			]],
			["Cut plan", [
				"Square footage",
				"Edge profile",
				"Sink cutouts",
				"Cooktop cutouts"
			]],
			["Project fit", [
				"Destination",
				"Timeline",
				"Commercial use",
				"Cabinet scope"
			]]
		],
		proofRows: [
			["Material read", "Asina checks the slab code and movement against the commercial use case."],
			["Quote inputs", "Square footage, edge profile, cutouts, destination, and timeline are separated before review."],
			["Supply path", "Countertops can stay standalone or be reviewed with cabinet packages when that makes the project clearer."]
		],
		whatItems: [
			"Slab code or name",
			"Square footage",
			"Edge profile",
			"Cutout count",
			"Project destination",
			"Timeline"
		],
		handoffTitle: "Start with slab facts before drawings move.",
		handoffCopy: "Asina uses the first request to decide whether the commercial countertop scope fits, then requests drawings or specs by email when needed."
	},
	"hospitality-ffe": {
		eyebrow: "Hospitality FF&E Furniture Packages",
		title: "Hospitality furniture packages reviewed before production details lock in.",
		copy: "Asina reviews hospitality, restaurant, franchise, amenity, and outdoor furniture packages around quantity, brand standards, floor plan, finish direction, samples, packing, and shipping.",
		media: heroAssets.furniture,
		mediaAlt: "Hospitality furniture package reference prepared for FF&E review",
		ticket: "Brand standards, quantity, floor plan, finish direction",
		introEyebrow: "Package Review",
		introTitle: "This is not a public furniture menu.",
		introCopy: "Hospitality FF&E planning works better when the buyer sends the room intent, quantity estimate, floor plan, finish direction, durability needs, timeline, and sample needs before item-by-item pricing starts.",
		scopes: [
			["Restaurant groups", "Dining groups, seating layout, table bases, booths, and finish direction."],
			["Hotel + amenity", "Indoor and outdoor packages reviewed by room use, durability, and packing needs."],
			["Franchise rollouts", "Brand standards, store count, repeat phase, and first-location approval reference."],
			["Custom pieces", "Tables, chairs, benches, stools, booths, and branded pieces reviewed by feasibility."]
		],
		inputGroups: [
			["Buyer packet", [
				"Room count",
				"Store count",
				"Quantity estimate",
				"Timeline"
			]],
			["Design packet", [
				"Brand standards",
				"Floor plan",
				"Seating layout",
				"Finish direction"
			]],
			["Approval path", [
				"Sample needs",
				"Durability needs",
				"Packing needs",
				"Destination"
			]]
		],
		proofRows: [
			["Design direction", "Look and feel become production notes before pricing locks in."],
			["Sample review", "Mockups or samples confirm dimensions, color, finish, comfort, and material direction."],
			["Rollout control", "The first approved package can become the reference for later rooms or locations."]
		],
		whatItems: [
			"Room or store count",
			"Quantity estimate",
			"Brand standards",
			"Floor plan or seating layout",
			"Finish direction",
			"Timeline and destination"
		],
		handoffTitle: "A furniture package needs a packet, not a cart.",
		handoffCopy: "Asina keeps hospitality FF&E review focused on quantities, standards, sample needs, packing, and shipping responsibility before repeat production."
	},
	"multifamily-supply": {
		eyebrow: "Multifamily Cabinet + Countertop Supply",
		title: "Cabinet and countertop planning for Florida multifamily developments.",
		copy: "Asina reviews multifamily cabinet and countertop supply by unit count, finish schedule, model unit or mockup, slab direction, phase timing, QA, packing, and delivery responsibility.",
		media: heroAssets.cabinetRoom,
		mediaAlt: "Multifamily cabinet and countertop package prepared for Florida development review",
		ticket: "Unit count, finish schedule, phase timing, QA",
		introEyebrow: "Developer Fit",
		introTitle: "Repeat units need one approved reference.",
		introCopy: "Apartments, phased developments, model units, amenity spaces, and repeat room types need cabinet runs, slab direction, phase timing, QA, and packing tied to the same approval reference.",
		scopes: [
			["Unit packages", "Repeat kitchens, baths, vanities, cabinet runs, and countertop direction."],
			["Model unit", "A first approved room can anchor finish, sizing, and production details."],
			["Phase planning", "Unit groups, building phases, destination timing, and site readiness shape the handoff."],
			["Domestic vs import fit", "Urgent or small work may fit domestic stock better. The review needs to make that clear."]
		],
		inputGroups: [
			["Development", [
				"Unit count",
				"Room types",
				"Phase timing",
				"Destination"
			]],
			["Cabinets", [
				"Finish schedule",
				"Cabinet run",
				"Mockup needs",
				"Panel platform"
			]],
			["Countertops", [
				"Slab direction",
				"Square footage",
				"Edge profile",
				"Cutouts"
			]]
		],
		proofRows: [
			["First approval", "A sample, mockup, or model-unit review gives repeat production a practical reference."],
			["Repeatability", "Finish, sizing, cabinet run, slab direction, and packing decisions remain visible by phase."],
			["Responsibility", "QA, packing review, freight planning, and damage documentation are discussed before release."]
		],
		whatItems: [
			"Unit count",
			"Finish schedule",
			"Cabinet run",
			"Slab direction",
			"Phase timing",
			"Destination and site needs"
		],
		handoffTitle: "Use the first approved unit to protect the later ones.",
		handoffCopy: "Asina reviews cabinet and countertop details before the development moves into repeat production, QA, packing, and shipping."
	}
};
var buyerPathEntries = [
	{
		page: "commercial-mixed",
		label: "Commercial cabinet + countertop supply",
		copy: "Review cabinet and surface scope together before Asina asks for drawings by email.",
		meta: "Cabinets / slabs / QA / shipping",
		Icon: PackageCheck$1
	},
	{
		page: "commercial-countertops",
		label: "Commercial countertop supply",
		copy: "Organize slab codes, cutouts, edge needs, destination, and timeline.",
		meta: "Slab code / edge / destination / timeline",
		Icon: Ruler
	},
	{
		page: "multi-unit",
		label: "Multi-unit cabinet packages",
		copy: "Plan repeatable cabinet runs for builders, developers, apartments, and commercial projects.",
		meta: "Finish choice / room type / cabinet run / unit count",
		Icon: Box
	},
	{
		page: "dealer-supply",
		label: "Dealer cabinet supply",
		copy: "Support dealer, designer, and distributor projects that need an import source with QA.",
		meta: "Dealer / reseller / distributor",
		Icon: FileText$1
	},
	{
		page: "supplier-guide",
		label: "Central Florida supplier comparison",
		copy: "Compare local stock, showroom, assembled supply, and project-scale import models.",
		meta: "Supplier models / Central Florida",
		Icon: PackageCheck$1
	},
	{
		page: "multifamily-supply",
		label: "Multifamily cabinet + countertop supply",
		copy: "Review unit count, finish schedule, slab direction, phases, QA, and packing.",
		meta: "Unit count / finish schedule / phase timing",
		Icon: FileText$1
	},
	{
		page: "restaurant-furniture",
		label: "Restaurant + franchise furniture packages",
		copy: "Organize repeat-location furniture around brand standards and quantity planning.",
		meta: "Store count / floor plan / brand requirements / timeline",
		Icon: Armchair
	},
	{
		page: "hospitality-ffe",
		label: "Hospitality FF&E furniture packages",
		copy: "Prepare hospitality and amenity packets by quantity, samples, packing, and shipping.",
		meta: "FF&E / brand standards / samples / packing",
		Icon: Armchair
	},
	{
		page: "rfq",
		label: "RFQ procurement resources",
		copy: "Use cabinet, countertop, and furniture checklists before quote review begins.",
		meta: "Category / scale / quote inputs / lead-time factors",
		Icon: FileText$1
	},
	{
		page: "orlando",
		label: "Florida-to-nationwide project supply",
		copy: "Start Florida-based and qualified nationwide project inquiries from one review.",
		meta: "Cabinets / countertops / furniture packages / QA",
		Icon: PackageCheck$1
	}
];
var buyerPathGroups = [
	{
		title: "Start by product",
		copy: "Start here when the buyer already knows the main category.",
		links: [
			"cabinets",
			"countertops",
			"furniture",
			"review"
		]
	},
	{
		title: "Commercial paths",
		copy: "Use these when the buyer intent is tied to project type, location, or repeat scope.",
		links: buyerPathEntries.map((entry) => entry.page)
	},
	{
		title: "Planning guides",
		copy: "Use these when the quote depends on cost picture, timing, QA, packing, or responsibility.",
		links: [
			"importer-resources",
			"container-economics",
			"landed-cost",
			"shipping-responsibility",
			"imported-quality",
			"lead-times",
			"import-vs-domestic",
			"qa",
			"process"
		]
	},
	{
		title: "Collection detail",
		copy: "Use these when the buyer wants a specific cabinet collection or slab family.",
		links: [
			"cabinet-malibu",
			"cabinet-monterey",
			"cabinet-newport",
			"cabinet-catalina",
			"cabinet-laguna",
			"cabinet-jersey",
			"countertop-quartz-codes",
			"countertop-exotic",
			"countertop-natural",
			"countertop-grain"
		]
	}
];
var faqs = pageFaqs.home.map(([q, a]) => ({
	q,
	a
}));
var buyerQuestionGuides = {
	"container-economics": {
		eyebrow: "Container Economics",
		title: "How many kitchens fit in a 40ft container?",
		copy: "Use this guide to plan cabinet box count, mixed SKUs, packing needs, and project scale before Asina reviews the quote.",
		artifactTitle: "40ft cabinet loading",
		answerTitle: "The useful answer is a planning range, not a fixed promise.",
		answerCopy: "A 40HC container typically holds about 700 to 800 cabinet boxes. For wholesale cabinets for a 40-unit build Florida buyers can actually schedule, start with cabinet box count, repeat room mix, accessories, finish protection, packing density, and whether the shipment includes countertops or furniture.",
		checks: [
			["Cabinet mix", "Wall, base, tall, vanity, pantry, and accessory pieces change the box count."],
			["Packing method", "Flat-pack, assembled pieces, finish protection, and moisture control affect capacity."],
			["SKU mix", "Mixed styles, finishes, and sizes can work, but they need cleaner count review."],
			["Project scale", "Full containers usually have the strongest economics, while trial orders should point to future volume."],
			["Destination", "Routing and delivery needs shape the quote and responsibility discussion."],
			["Timeline", "Plan production, QA, packing, freight, and site readiness together."]
		],
		matrixTitle: "Container fit depends on the package, not one headline number.",
		matrixCopy: "These questions keep container planning honest before drawings and specs move by email.",
		cards: [
			{
				title: "Box count",
				lead: "Start with the rooms or units, then count the cabinet mix. One kitchen does not equal one fixed package.",
				questions: [
					"How many repeat rooms or units are planned?",
					"Which cabinet types repeat?",
					"Are accessories counted with the cabinet package?"
				]
			},
			{
				title: "Mixed styles",
				lead: "Asina can review mixed finishes or sizes when packing logic and container fit stay easy to check.",
				questions: [
					"Can finishes be grouped by phase?",
					"Which SKUs repeat most often?",
					"What should stay consistent across units?"
				]
			},
			{
				title: "Trial order",
				lead: "A smaller first order can make sense when it is tied to future repeat volume and a clear project reason.",
				questions: [
					"Is there a future phase?",
					"What should the trial prove?",
					"Will the next order repeat the same package?"
				]
			}
		],
		proofTitle: "Container planning becomes quote-ready when the package is specific.",
		proofCopy: "Asina reviews category, quantity, destination, timeline, material direction, packing needs, and responsibility level before the project is treated as container-ready.",
		proofRows: [
			["Buyer sends", "Room count, unit count, cabinet run, finish direction, destination, and timeline."],
			["Asina reviews", "Container fit, count risk, mixed SKUs, packing needs, and quote inputs."],
			["Files move later", "Asina requests drawings and specs by email after the first fit check."],
			["Quote improves", "The cabinet package is better defined before pricing, QA, and shipping responsibility are discussed."]
		],
		image: heroAssets.cabinetRoom,
		mediaAlt: "Cabinet package room used for 40ft container loading planning",
		whatTitle: "What to send before container planning",
		whatItems: [
			"Room or unit count",
			"Cabinet run or cabinet types",
			"Finish direction",
			"Destination",
			"Timeline",
			"Packing or phase notes"
		],
		whatNote: "Start with the practical scope. Asina can request drawings and specs by email after the first review.",
		handoffTitle: "Use this before the cabinet quote starts.",
		handoffCopy: "Container loading questions are useful when they connect to a real project, not a generic box-count guess.",
		faqTitle: "Container Economics FAQ"
	},
	"landed-cost": {
		eyebrow: "Landed Cost Planning",
		title: "What goes into the landed cost of imported cabinets?",
		copy: "Sort product scope, packing, freight, handling, delivery, and responsibility before a low unit price turns into an unclear project cost.",
		artifactTitle: "Landed cost picture",
		answerTitle: "Landed cost is the working cost picture around the product.",
		answerCopy: "For imported cabinet projects, landed cost starts with the real package: 40 to 50 days of production after approved details, 22 to 30 days West Coast transit or 40 to 50 days East Coast, and about 700 to 800 boxes at 40HC scale. The unit price is only one input.",
		checks: [
			["Product scope", "Cabinet category, finish direction, count, and accessories shape the starting point."],
			["Packing", "Protection, labels, moisture control, and count organization affect the shipment."],
			["Freight", "Ocean and domestic movement depend on destination, timing, and responsibility."],
			["Handling", "Storage, unloading, transfer, or phased delivery can change the practical cost picture."],
			["Duties", "Applicable duty or tariff questions require project-specific review and human confirmation."],
			["Responsibility", "The quote should make cost, risk, and delivery responsibility clear in writing."]
		],
		matrixTitle: "Cost gets easier to understand when each moving part is separated.",
		matrixCopy: "These questions help buyers compare the whole project cost instead of chasing one low line item.",
		cards: [
			{
				title: "Product cost",
				lead: "The cabinet package needs enough detail before unit pricing means much.",
				questions: [
					"Which rooms or units repeat?",
					"Which finishes and panel platforms matter?",
					"Which accessories are included?"
				]
			},
			{
				title: "Freight path",
				lead: "Discuss freight with destination, delivery needs, and responsibility level in mind.",
				questions: [
					"Where is the project going?",
					"Is jobsite delivery needed?",
					"Who documents visible damage?"
				]
			},
			{
				title: "Quote boundaries",
				lead: "The quote should say what is included and what remains project-specific.",
				questions: [
					"What is included in writing?",
					"Which fees may change?",
					"What requires final approval?"
				]
			}
		],
		proofTitle: "The cost picture gets cleaner when scope and responsibility are clear.",
		proofCopy: "Asina uses project basics to understand whether imported supply makes sense before asking for drawings and detailed specs by email.",
		proofRows: [
			["Scope first", "Category, quantity, finish direction, destination, and timeline set the base review."],
			["Cost buckets", "Product, packing, freight, handling, delivery, and responsibility are separated."],
			["Human review", "Duty, tariff, tax, or customs-sensitive details need project-specific review."],
			["Written path", "Final pricing follows the approved quote, not a generic calculator."]
		],
		image: heroAssets.materialContext,
		mediaAlt: "Project supply surface detail used for landed cost planning",
		whatTitle: "What to send for landed cost review",
		whatItems: [
			"Product category",
			"Quantity or phase count",
			"Destination",
			"Timeline",
			"Material direction",
			"Responsibility expectations"
		],
		whatNote: "Do not treat a public estimate as final pricing. A written project quote controls the actual terms.",
		handoffTitle: "Use landed cost planning before comparing suppliers.",
		handoffCopy: "A low unit price can hide packing, handling, delivery, or responsibility questions. Asina brings those inputs into the quote review.",
		faqTitle: "Landed Cost FAQ"
	},
	"shipping-responsibility": {
		eyebrow: "Shipping Responsibility",
		title: "FOB, CIF, DAP, DPU, or DDP: what changes in a cabinet import quote?",
		copy: "Use plain-language responsibility first, then Incoterms® 2020 detail where the project quote needs precision.",
		artifactTitle: "Shipping responsibility",
		answerTitle: "Shipping terms decide who carries which responsibility.",
		answerCopy: "Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast. FOB, CIF, DAP, DPU, and DDP can affect cost, risk transfer, delivery point, unloading, clearance, and documentation.",
		checks: [
			["Delivery point", "Clarify whether responsibility stops at port, warehouse, destination, or another named place."],
			["Risk transfer", "The project quote should identify where risk changes hands."],
			["Clearance", "Import clearance and duty responsibility depend on the agreed term."],
			["Unloading", "Set unloading responsibility before delivery is scheduled."],
			["Damage notes", "Visible damage, count issues, and packing concerns need quick documentation."],
			["Written terms", "Final responsibility follows the quote, not a casual conversation."]
		],
		matrixTitle: "Responsibility language should reduce uncertainty, not add freight jargon.",
		matrixCopy: "These buyer questions keep shipping terms connected to the project handoff.",
		cards: [
			{
				title: "Where goods move",
				lead: "The named place matters because it affects delivery planning and responsibility.",
				questions: [
					"Is delivery to a port, warehouse, or project site?",
					"Who unloads?",
					"Is phased delivery needed?"
				]
			},
			{
				title: "Who documents issues",
				lead: "Damage documentation is easier when the project knows what to check on arrival.",
				questions: [
					"Who checks visible damage?",
					"Who confirms counts?",
					"When should photos be taken?"
				]
			},
			{
				title: "Which term fits",
				lead: "Incoterms should match the buyer's experience and the written quote.",
				questions: [
					"Does the buyer manage freight?",
					"Is expanded delivery support needed?",
					"Which term is written in the quote?"
				]
			}
		],
		proofTitle: "Shipping responsibility belongs inside the quote review.",
		proofCopy: "Asina discusses practical delivery needs first, then uses precise terms where the quote requires them.",
		proofRows: [
			["Buyer sends", "Destination, delivery needs, timeline, site constraints, and documentation expectations."],
			["Asina reviews", "Responsibility level, freight quote path, packing needs, and handoff risks."],
			["Quote states", "Final cost, risk, delivery, and responsibility follow the written project quote."],
			["Arrival matters", "Document visible damage and count issues immediately."]
		],
		image: heroAssets.environment,
		mediaAlt: "Installed project environment used for cabinet shipping responsibility planning",
		whatTitle: "What to send before shipping review",
		whatItems: [
			"Destination",
			"Delivery point",
			"Timeline",
			"Unloading needs",
			"Damage documentation needs",
			"Preferred responsibility level"
		],
		whatNote: "These summaries are planning guidance only. Final responsibility follows the agreed project quote.",
		handoffTitle: "Keep freight language attached to the real destination.",
		handoffCopy: "Shipping terms work best when the buyer knows where goods must arrive, who receives them, and how issues will be documented.",
		faqTitle: "Shipping Responsibility FAQ"
	},
	"imported-quality": {
		eyebrow: "Imported Cabinet Quality",
		title: "Are imported cabinets good quality?",
		copy: "Imported cabinets can work at project scale when materials, details, mockup approval, production QA, packing, and documentation are controlled.",
		artifactTitle: "Quality before shipment",
		answerTitle: "Quality depends on the approval path before shipment.",
		answerCopy: "Imported cabinet quality depends on the approval path before the 40 to 50 day production window starts. A 40HC container may carry about 700 to 800 boxes, then DAP transit planning runs 22 to 30 days West Coast or 40 to 50 days East Coast, so checks, packing, and responsibility need to be settled before release.",
		checks: [
			["Material direction", "Face material, panel platform, finish family, and hardware expectations need review."],
			["Mockup approval", "A sample or mockup creates a reference before repeat quantities are produced."],
			["Production checks", "Check finish, color, visible defects, and approved details before packing."],
			["Packing review", "Protection, labels, count organization, and moisture controls reduce avoidable risk."],
			["Documents", "Asina can discuss CARB, TSCA, FSC, KCMA, or project documents where applicable."],
			["Accountability", "Asina stays supplier of record without exposing private source relationships."]
		],
		matrixTitle: "The buyer risks are practical: finish, sizing, documents, and packing.",
		matrixCopy: "These questions address imported cabinet concerns without making absolute guarantees.",
		cards: [
			{
				title: "Finish risk",
				lead: "Finish direction needs a sample or approved reference so repeat rooms do not drift.",
				questions: [
					"Which finish family is selected?",
					"What sample confirms it?",
					"What changes require approval?"
				]
			},
			{
				title: "Measurement risk",
				lead: "Drawings and mockup review reduce wrong dimensions before repeat production begins.",
				questions: [
					"Are room plans ready?",
					"Which runs repeat?",
					"What custom sizing matters?"
				]
			},
			{
				title: "Packing risk",
				lead: "Long-distance shipping needs protection, count control, labels, and damage documentation.",
				questions: [
					"What needs extra protection?",
					"How are counts organized?",
					"Who documents arrival issues?"
				]
			}
		],
		proofTitle: "Quality work has to be visible before the shipment leaves.",
		proofCopy: "Asina reviews materials, mockup approval, production checks, packing review, and shipping responsibility together.",
		proofRows: [
			["Pre-production", "Drawings, finish direction, materials, and details are checked before repeat production."],
			["Production QA", "Asina reviews visible defects, finish consistency, material match, and approved details."],
			["Packing review", "Item count, protection, labeling, moisture planning, and shipment readiness are checked."],
			["Source protection", "Buyers see the accountability path without private source disclosure."]
		],
		image: heroAssets.cabinet,
		mediaAlt: "Cabinet finish sample used for imported cabinet quality review",
		whatTitle: "What to send before quality review",
		whatItems: [
			"Finish direction",
			"Room type",
			"Cabinet run",
			"Unit count",
			"Document requirements",
			"Packing concerns"
		],
		whatNote: "Asina can review document needs during project review. Public pages should not be treated as compliance guarantees.",
		handoffTitle: "Use QA language before the quote is locked.",
		handoffCopy: "Quality protection is clearest when the project names the materials, approved references, packing needs, and documents before production begins.",
		faqTitle: "Imported Cabinet Quality FAQ"
	},
	"lead-times": {
		eyebrow: "Lead Time Planning",
		title: "How should builders plan cabinet lead times?",
		copy: "Compare urgent stock needs with planned import supply, then review drawings, mockup approval, production, QA, freight, and phasing.",
		artifactTitle: "Lead time and phasing",
		answerTitle: "Lead time planning starts before the quote is approved.",
		answerCopy: "Imported cabinet production usually takes 40 to 50 days after approved details. Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast. Domestic stock can be better for urgent one-off work.",
		checks: [
			["Drawings", "Room plans, cabinet runs, and project specs need time for review."],
			["Mockup", "A sample or mockup can confirm measurements, finish, materials, and details."],
			["Production", "Capacity, complexity, quantity, and approved details affect the schedule."],
			["QA", "Production checks and packing review should not be skipped for speed."],
			["Freight", "Transit, destination, and responsibility terms shape timing."],
			["Phasing", "Multi-unit, franchise, and rollout work may need staged delivery."]
		],
		matrixTitle: "The schedule is a chain, not one production number.",
		matrixCopy: "These questions help buyers decide whether planned import supply fits the construction calendar.",
		cards: [
			{
				title: "Urgent need",
				lead: "If the project needs product immediately, local stock may be the better fit.",
				questions: [
					"Is this a one-off replacement?",
					"Can the timeline wait for production?",
					"Is local pickup required?"
				]
			},
			{
				title: "Planned volume",
				lead: "Repeat projects can benefit from earlier planning and cleaner phase control.",
				questions: [
					"How many units or rooms repeat?",
					"What phase comes first?",
					"Which finish stays consistent?"
				]
			},
			{
				title: "Site readiness",
				lead: "Delivery timing should match site access, installation sequence, and documentation needs.",
				questions: [
					"When is the site ready?",
					"Who receives the shipment?",
					"How are count issues documented?"
				]
			}
		],
		proofTitle: "Lead time is easier to trust when every approval step is visible.",
		proofCopy: "Asina reviews timing as part of the project path: drawings, mockup, production, QA, packing, freight, and final responsibility.",
		proofRows: [
			["Start early", "Share category, count, destination, finish direction, and milestone dates."],
			["Approve details", "Mockup or sample approval protects repeat production before the schedule tightens."],
			["Plan freight", "Destination, responsibility, and delivery needs shape the handoff."],
			["Phase work", "Asina can review repeat units or locations around milestones."]
		],
		image: heroAssets.cabinetRoom,
		mediaAlt: "Cabinet project room used for builder lead time planning",
		whatTitle: "What to send for lead time review",
		whatItems: [
			"Project milestones",
			"Unit or room count",
			"Finish direction",
			"Drawing status",
			"Destination",
			"Phase priorities"
		],
		whatNote: "Lead times stay as estimates until Asina confirms project scope, approvals, production path, and quote terms.",
		handoffTitle: "Use this before schedule assumptions become commitments.",
		handoffCopy: "The safest lead time discussion starts with the real project calendar and the approval steps that cannot be skipped.",
		faqTitle: "Cabinet Lead Time FAQ"
	},
	"import-vs-domestic": {
		eyebrow: "Cabinet Cost Planning",
		title: "Import vs. Domestic Cabinets: Cost Guide for Florida Contractors",
		heroLeadLabel: "The short answer:",
		copy: "For Florida contractors running 10+ repeat rooms, imported cabinets typically land 20–30% below comparable domestic distributor pricing at full container scale — but only when production, QA, packing, and freight are managed. Domestic stock makes more sense for urgent jobs, small one-off orders, or projects where schedule doesn't support an 8–14 week lead time.",
		heroExtraCopy: ["The real comparison isn't unit price. It's total landed cost — product + packing + freight + delivery + QA accountability — set against your project timeline and repeat volume. A $200 domestic box and a $140 imported box are not the same decision when one requires 12 weeks of planning and verified origin documentation.", "This guide breaks down both supply paths by speed, scale, cost structure, consistency, and quality risk — so you can match the source to the project, not the other way around."],
		artifactTitle: "Import or domestic fit",
		artifactCopy: "20-30% savings can appear at container scale when QA, packing, freight, and origin review stay managed. Domestic stock stays better for urgent or small work.",
		answerTitle: "Domestic and imported supply solve different project problems.",
		answerCopy: "Planned import supply usually means 40 to 50 days of production, 22 to 30 days of West Coast transit or 40 to 50 days East Coast, and about 700 to 800 cabinet boxes in a 40HC container. Domestic stock is often better for urgent or small needs.",
		checks: [
			["Speed", "Domestic stock can win when timing is the only priority."],
			["Scale", "Imported supply usually needs repeat volume to justify the longer planning path."],
			["Cost picture", "Compare product, packing, freight, handling, delivery, and responsibility together."],
			["Consistency", "Repeat rooms or stores can benefit from one approved package."],
			["QA", "Mockup, production checks, and packing review reduce imported project risk."],
			["Accountability", "Supplier-of-record support matters when several moving parts need one accountable review."]
		],
		matrixTitle: "The right answer depends on project fit, not slogans.",
		matrixCopy: "Use these questions to decide whether speed, scale, QA, and responsibility point toward domestic stock or a planned import package.",
		cards: [
			{
				title: "Domestic fit",
				lead: "Domestic stock can be right when speed, local pickup, or a small one-off order matters most.",
				questions: [
					"Is the need urgent?",
					"Is the job small?",
					"Does local stock solve the problem?"
				]
			},
			{
				title: "Import fit",
				lead: "Imported supply can be right when the project has repeatable scope and enough planning time.",
				questions: [
					"Do rooms or stores repeat?",
					"Is container-scale volume possible?",
					"Can mockup approval happen early?"
				]
			},
			{
				title: "Decision fit",
				lead: "The comparison should include cost, timing, QA, packing, and responsibility in writing.",
				questions: [
					"What is included in the quote?",
					"Who manages responsibility?",
					"What details still need approval before production?"
				]
			}
		],
		proofTitle: "The comparison becomes useful when the project is specific.",
		proofCopy: "Asina uses the real project scope to decide whether domestic speed or import planning gives the buyer the cleaner path.",
		proofRows: [
			["Concede speed", "Urgent and small jobs may fit domestic stock better. That is the honest answer when the timeline does not support import planning."],
			["Review scale", "Repeat units, phases, and rollout needs can make import planning practical."],
			["Check the supply path", "Quality, packing, and responsibility need a documented process before production begins."],
			["Start the review", "The project form collects the basics before detailed files move by email. If the scope fits, Asina follows up within 1 to 2 business days."]
		],
		image: heroAssets.environment,
		mediaAlt: "Project supply environment used for import versus domestic cabinet comparison",
		whatTitle: "What Asina needs to start the cost review",
		whatItems: [
			"Project category",
			"Project location and destination",
			"Unit, room, or store count",
			"Timeline and site-ready date",
			"Finish direction",
			"Budget sensitivity",
			"QA or packing concerns"
		],
		whatNote: "Asina does not publish quote pricing. The project review is where product, freight, duties, QA, and responsibility get built around the specific scope.",
		handoffTitle: "Use the real project before choosing how to source cabinets.",
		handoffCopy: "The comparison gets clearer when timing, volume, quality expectations, and responsibility sit in the same review.",
		faqTitle: "Import vs. Domestic Cabinet FAQ"
	}
};
var routeProofDossiers = {
	cabinets: {
		eyebrow: "Cabinet Review",
		title: "Cabinet pricing starts with the facts buyers can verify.",
		items: [
			[
				"Finish sample",
				"Asina reviews selected finish direction with room type, run, and unit count.",
				Box
			],
			[
				"Panel platform",
				"5/8-inch and 3/4-inch premium plywood panel platforms, frame type, and panel thickness stay with the pricing request.",
				FileText$1
			],
			[
				"Mockup check",
				"Mockup approval confirms measurements, color, finish, materials, and details before the order repeats.",
				PackageCheck$1
			]
		]
	},
	countertops: {
		eyebrow: "Slab Review",
		title: "Review the slab by code, movement, thickness, edge, and cutout logic.",
		items: [
			[
				"Slab code",
				"Each selected surface carries its code and collection into pricing.",
				Ruler
			],
			[
				"Movement read",
				"Asina reviews bold, calm, or uniform movement against the project use case.",
				Maximize2
			],
			[
				"Cutout logic",
				"Square footage, edge profile, sink or cooktop cutouts, destination, and timeline are checked together.",
				FileText$1
			]
		]
	},
	furniture: {
		eyebrow: "Rollout Review",
		title: "Furniture starts with rollout needs, not a shopping grid.",
		items: [
			[
				"Brand standard",
				"Look, finish, material direction, and franchise requirements shape the production file.",
				Armchair
			],
			[
				"Store count",
				"Store count, quantity estimate, and seating layout decide feasibility and minimums.",
				FileText$1
			],
			[
				"Repeat kit",
				"The first approved package becomes the reference for later rollout phases.",
				PackageCheck$1
			]
		]
	},
	process: {
		eyebrow: "Production Review",
		title: "Every step shows what the buyer sends, what Asina checks, and what comes next.",
		items: [
			[
				"Basics",
				"The project starts with category, location, scale, timeline, and notes.",
				FileText$1
			],
			[
				"Mockup",
				"The approved sample becomes the reference before production scales.",
				PackageCheck$1
			],
			[
				"Shipping",
				"Asina reviews packing and responsibility before release.",
				Truck$1
			]
		]
	},
	qa: {
		eyebrow: "QA Proof",
		title: "Quality work is checked before shipment.",
		items: [
			[
				"Built to spec",
				"Production is checked against the approved mockup or sample package.",
				ShieldCheck
			],
			[
				"Packing label",
				"Asina reviews counts, labels, protection, and organization before shipment readiness.",
				PackageCheck$1
			],
			[
				"Responsibility",
				"Freight quote options and Incoterms® 2020 responsibility are clarified in the project quote.",
				Truck$1
			]
		]
	},
	about: {
		eyebrow: "Accountability",
		title: "The company story is direct: organized project supply, handled carefully.",
		items: [
			[
				"Orlando-area base",
				"US-based project support operates from Longwood in the Orlando area and coordinates qualified work nationwide.",
				FileText$1
			],
			[
				"One first review",
				"Cabinets, countertops, furniture packages, and mixed scopes can start in the same intake.",
				PackageCheck$1
			],
			[
				"Protected network",
				"Buyers see process, QA, packing, and responsibility without private source disclosure.",
				ShieldCheck
			]
		]
	},
	design: {
		eyebrow: "Design Translation",
		title: "Design intent becomes production detail before the quote is locked.",
		items: [
			[
				"Room intent",
				"Use, layout, finish direction, and brand standards are captured before quote review.",
				Ruler
			],
			[
				"Production notes",
				"Custom sizing and finish requirements become production notes the supplier can use.",
				FileText$1
			],
			[
				"Approval reference",
				"Mockup or sample approval confirms the direction before repeat production.",
				PackageCheck$1
			]
		]
	},
	review: {
		eyebrow: "Review Intake",
		title: "The form stays short. Drawings and specs come later by email.",
		items: [
			[
				"Private file follow-up",
				"The public form collects basics only. Asina requests project files after the first review.",
				ShieldCheck
			],
			[
				"1-2 business days",
				"Asina follows up by email when the project is a fit for the supply model.",
				FileText$1
			],
			[
				"Receipt",
				"The buyer gets a real confirmation and a specific next step.",
				PackageCheck$1
			]
		]
	},
	"buyer-paths": {
		eyebrow: "Path Directory",
		title: "The route index groups buyer decisions by intent.",
		items: [
			[
				"Product lanes",
				"Cabinets, countertops, and furniture packages are grouped by quote inputs.",
				PackageCheck$1
			],
			[
				"Commercial intent",
				"Project type, repeat scope, Florida context, and nationwide fit move into clear paths.",
				FileText$1
			],
			[
				"Planning guides",
				"RFQ, landed cost, lead time, QA, packing, and shipping questions are easy to find.",
				ShieldCheck
			]
		]
	},
	"multi-unit": {
		eyebrow: "Builder Package Review",
		title: "Multifamily Cabinet Supply for Developers — How It Works",
		items: [
			[
				"Unit count",
				"Room count, run direction, finish choice, and timeline shape the first review.",
				FileText$1
			],
			[
				"Mockup path",
				"Sample approval gives repeat production a reference before volume scales.",
				PackageCheck$1
			],
			[
				"Shipping plan",
				"Asina reviews packing, container fit, and responsibility before release.",
				Truck$1
			]
		]
	},
	"dealer-supply": {
		eyebrow: "Dealer Supply Review",
		title: "Dealer work needs protected relationships and a clear import path.",
		items: [
			[
				"Dealer-led client",
				"The dealer brings the project, scope, relationship, and markup path.",
				FileText$1
			],
			[
				"Import review",
				"Asina reviews drawings, quantity, mockup needs, production QA, and packing.",
				PackageCheck$1
			],
			[
				"Trade terms",
				"Shipping responsibility and Incoterms® planning stay inside the quote path.",
				Truck$1
			]
		]
	},
	"restaurant-furniture": {
		eyebrow: "Rollout Package Review",
		title: "Furniture packages are organized around brand standards, quantities, and repeat locations.",
		items: [
			[
				"Brand standard",
				"Design direction, floor plan, and finish intent become production-ready notes.",
				Armchair
			],
			[
				"Store count",
				"Quantity estimates and rollout phases guide feasibility, minimums, and planning.",
				FileText$1
			],
			[
				"Sample approval",
				"The first approved package becomes the reference for later locations.",
				PackageCheck$1
			]
		]
	},
	rfq: {
		eyebrow: "Procurement Workbench",
		title: "RFQ inputs are separated before drawings and specs move by email.",
		items: [
			[
				"Project basics",
				"Category, location, scale, and timing qualify the request first.",
				FileText$1
			],
			[
				"Quote inputs",
				"Cabinet, slab, and furniture details stay easy to check before pricing review.",
				Ruler
			],
			[
				"Private file follow-up",
				"Asina requests drawings and specs privately after the first fit check.",
				ShieldCheck
			]
		]
	},
	"importer-resources": {
		eyebrow: "Buyer Planning Guide",
		title: "Buyer questions are sorted before the quote starts moving.",
		items: [
			[
				"Landed cost",
				"Asina reviews product, freight, handling, delivery, packing, and responsibility as one planning picture.",
				FileText$1
			],
			[
				"Order scale",
				"Container fit, mixed styles, trial runs, and repeat volume are discussed before buyers overcommit.",
				PackageCheck$1
			],
			[
				"Lead time + QA",
				"Schedule planning, sample approval, quality review, and damage documentation stay in the same review.",
				ShieldCheck
			]
		]
	},
	"supplier-comparison": {
		eyebrow: "Supplier Comparison",
		title: "A useful comparison names the buying model before the price talk.",
		items: [
			[
				"Local stock",
				"RTA and warehouse options can be faster for small or urgent cabinet needs.",
				Box
			],
			[
				"Project import",
				"Asina fits repeat volume, mockup approval, QA, packing, and supplier-of-record review.",
				PackageCheck$1
			],
			[
				"Fair disclosure",
				"The page names Asina as one of the suppliers compared and avoids invented pricing.",
				ShieldCheck
			]
		]
	},
	"supplier-guide": {
		eyebrow: "Supplier Model Guide",
		title: "Choose the cabinet supplier model before you compare the quote.",
		items: [
			[
				"Stock speed",
				"RTA warehouses and showroom chains can fit small, urgent, or homeowner-led work.",
				Box
			],
			[
				"Project scale",
				"Import project suppliers fit drawing sets, repeat units, mockup approval, QA, and container planning.",
				PackageCheck$1
			],
			[
				"Dealer path",
				"Dealer supply keeps the reseller relationship protected while the import supply path is reviewed.",
				ShieldCheck
			]
		]
	},
	orlando: {
		eyebrow: "Florida To Nationwide Support",
		title: "Orlando-area buyers, Florida projects, and qualified nationwide teams start from one project review.",
		items: [
			[
				"Florida base",
				"Qualified builders, developers, procurement teams, restaurant groups, and franchise buyers can start from the Longwood project review.",
				FileText$1
			],
			[
				"Project categories",
				"Cabinets, countertops, furniture packages, and mixed scopes move into the right review.",
				PackageCheck$1
			],
			[
				"Nationwide review",
				"Service language can cover qualified United States projects while the public business address remains Longwood, Florida.",
				ShieldCheck
			]
		]
	},
	"commercial-mixed": {
		eyebrow: "Mixed Scope Review",
		title: "Wholesale Cabinet and Countertop Supply for Florida Commercial Projects",
		items: [
			[
				"Cabinet facts",
				"Finish choice, cabinet run, unit count, and approval needs stay visible before pricing.",
				Box
			],
			[
				"Slab facts",
				"Asina reviews code, square footage, edge needs, cutouts, destination, and timeline in the same request.",
				Ruler
			],
			[
				"Supply controls",
				"Asina reviews mockup approval, QA, packing, and responsibility before the project moves.",
				ShieldCheck
			]
		]
	},
	"commercial-countertops": {
		eyebrow: "Commercial Slab Review",
		title: "Commercial countertop requests start with slab facts and use case.",
		items: [
			[
				"Slab code",
				"Asina checks the selected quartz code and movement against the commercial room.",
				Ruler
			],
			[
				"Cut details",
				"Square footage, edge profile, and cutouts are separated before quote review.",
				FileText$1
			],
			[
				"Project path",
				"Countertops can stay standalone or move with cabinet package review when needed.",
				PackageCheck$1
			]
		]
	},
	"hospitality-ffe": {
		eyebrow: "FF&E Packet Review",
		title: "Furniture package scope is organized around quantity, standards, and samples.",
		items: [
			[
				"Brand standard",
				"Look, finish, material direction, and durability needs become production-ready notes.",
				Armchair
			],
			[
				"Quantity plan",
				"Store count, room count, seating layout, and rollout phase guide feasibility.",
				FileText$1
			],
			[
				"Sample path",
				"Mockup or sample approval protects repeat rooms and later locations.",
				PackageCheck$1
			]
		]
	},
	"multifamily-supply": {
		eyebrow: "Development Package Review",
		title: "Multifamily supply planning gives repeat units one approved reference.",
		items: [
			[
				"Unit count",
				"Rooms, phases, finish schedule, cabinet run, and slab direction shape the first review.",
				FileText$1
			],
			[
				"Model reference",
				"A sample, mockup, or model unit can anchor repeat production.",
				PackageCheck$1
			],
			[
				"Shipping plan",
				"Packing, phase timing, destination, and damage documentation are discussed before release.",
				Truck$1
			]
		]
	},
	"cabinet-collection": {
		eyebrow: "Collection Inspection",
		title: "Collection facts stay visible before a finish becomes a pricing request.",
		items: [
			[
				"Finish options",
				"Each finish shows its image, family, face material, and project use context.",
				Box
			],
			[
				"Panel platform",
				"Published panel language stays attached to the collection review.",
				FileText$1
			],
			[
				"Quote inputs",
				"Room type, cabinet run, unit count, location, and timeline shape the next step.",
				Send$1
			]
		]
	},
	"countertop-collection": {
		eyebrow: "Slab Code Inspection",
		title: "Review quartz collections by code, movement, size, and quote inputs.",
		items: [
			[
				"Code list",
				"Each slab code stays visible so buyers can reference the right surface.",
				Ruler
			],
			[
				"Movement read",
				"Collection behavior helps match the surface to the commercial use case.",
				Maximize2
			],
			[
				"Quote inputs",
				"Square footage, edge profile, cutouts, destination, and timeline drive the review.",
				Send$1
			]
		]
	}
};
var countertopCollectionLabel = (collection) => collection.name === "Grain" ? "Grain Classic" : collection.name;
var handleRovingOptionKeyDown = (event, count, activeIndex, onSelect) => {
	const container = event.currentTarget.parentElement;
	let nextIndex = null;
	if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (activeIndex + 1) % count;
	else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (activeIndex - 1 + count) % count;
	else if (event.key === "Home") nextIndex = 0;
	else if (event.key === "End") nextIndex = count - 1;
	if (nextIndex === null) return;
	event.preventDefault();
	onSelect(nextIndex);
	requestAnimationFrame(() => {
		(container?.querySelectorAll("[data-roving-option]"))?.[nextIndex]?.focus();
	});
};
var isolateAppRoot = () => {
	if (typeof document === "undefined") return () => {};
	const root = document.getElementById("root");
	if (!root) return () => {};
	const hadInert = root.hasAttribute("inert");
	const previousAriaHidden = root.getAttribute("aria-hidden");
	root.setAttribute("inert", "");
	root.setAttribute("aria-hidden", "true");
	return () => {
		if (hadInert) root.setAttribute("inert", "");
		else root.removeAttribute("inert");
		if (previousAriaHidden === null) root.removeAttribute("aria-hidden");
		else root.setAttribute("aria-hidden", previousAriaHidden);
	};
};
function Reveal({ children, className = "", delay = 0 }) {
	const reducedMotion = useReducedMotion$1();
	const visibleState = {
		opacity: 1,
		y: 0,
		clipPath: "inset(0 0 0% 0)"
	};
	return /* @__PURE__ */ jsx(motion$1.div, {
		className,
		initial: reducedMotion ? visibleState : {
			opacity: 1,
			y: 12,
			clipPath: "inset(0 0 0% 0)"
		},
		animate: visibleState,
		whileInView: visibleState,
		viewport: {
			once: true,
			amount: .16,
			margin: "0px 0px -8% 0px"
		},
		transition: {
			duration: reducedMotion ? 0 : .38,
			delay: reducedMotion ? 0 : delay,
			ease: motionEase
		},
		children
	});
}
function Stamp$1({ label, className = "", delay = 0 }) {
	const reducedMotion = useReducedMotion$1();
	return /* @__PURE__ */ jsxs(motion$1.span, {
		className: `qa-stamp ${className}`,
		initial: reducedMotion ? {
			opacity: 1,
			scale: 1,
			rotate: 0
		} : {
			opacity: 1,
			scale: .96,
			rotate: -1.5
		},
		whileInView: {
			opacity: 1,
			scale: 1,
			rotate: 0
		},
		viewport: { once: true },
		transition: {
			duration: reducedMotion ? 0 : .2,
			delay: reducedMotion ? 0 : delay,
			ease: motionEase
		},
		children: [
			/* @__PURE__ */ jsx(motion$1.i, {
				className: "qa-stamp-confirmation",
				"aria-hidden": "true",
				initial: reducedMotion ? {
					scaleX: 1,
					opacity: .32
				} : {
					scaleX: 0,
					opacity: 0
				},
				whileInView: reducedMotion ? {
					scaleX: 1,
					opacity: .32
				} : {
					scaleX: [
						0,
						1,
						1
					],
					opacity: [
						0,
						.45,
						.2
					]
				},
				viewport: { once: true },
				transition: {
					duration: reducedMotion ? 0 : .34,
					delay: reducedMotion ? 0 : delay + .06,
					ease: motionEase
				}
			}),
			/* @__PURE__ */ jsx(Check$1, { size: 14 }),
			/* @__PURE__ */ jsx("span", {
				className: "qa-stamp-label",
				children: label
			})
		]
	});
}
function DossierPacketVisual$1({ active, headingLevel = "h3" }) {
	const reducedMotion = useReducedMotion$1();
	const step = processSteps[active];
	const cue = processCues[active];
	const HeadingTag = headingLevel === "h2" ? "h2" : "h3";
	const artifacts = [
		["Buyer input", step.input],
		["Asina review", step.review],
		["Output", step.output],
		["Risk reduced", step.risk]
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "packet-visual",
		"aria-label": `${step.title} dossier packet`,
		children: [/* @__PURE__ */ jsx(AnimatePresence$1, {
			mode: "wait",
			children: /* @__PURE__ */ jsxs(motion$1.div, {
				className: "packet-document",
				initial: reducedMotion ? { opacity: 1 } : {
					opacity: 0,
					y: 12,
					rotate: -.5,
					clipPath: "inset(0 0 7% 0)"
				},
				animate: {
					opacity: 1,
					y: 0,
					rotate: 0,
					clipPath: "inset(0 0 0% 0)"
				},
				exit: reducedMotion ? { opacity: 1 } : {
					opacity: 0,
					y: -8,
					rotate: .5,
					clipPath: "inset(6% 0 0 0)"
				},
				transition: {
					duration: reducedMotion ? 0 : .26,
					ease: motionEase
				},
				children: [
					/* @__PURE__ */ jsx(motion$1.span, {
						className: "packet-reveal-scan",
						"aria-hidden": "true",
						initial: reducedMotion ? {
							opacity: 0,
							x: 0
						} : {
							opacity: 0,
							x: "-32%"
						},
						animate: reducedMotion ? {
							opacity: 0,
							x: 0
						} : {
							opacity: [
								0,
								.38,
								0
							],
							x: [
								"-32%",
								"35%",
								"82%"
							]
						},
						transition: {
							duration: reducedMotion ? 0 : .54,
							delay: reducedMotion ? 0 : .06,
							ease: motionEase
						}
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "packet-header",
						children: [/* @__PURE__ */ jsx("span", { children: String(active + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: cue.visual
						}), /* @__PURE__ */ jsx(HeadingTag, { children: step.title })] })]
					}),
					/* @__PURE__ */ jsxs(motion$1.div, {
						className: "packet-seal",
						initial: reducedMotion ? {
							opacity: 1,
							y: 0,
							scale: 1
						} : {
							opacity: 0,
							y: 6,
							scale: .98
						},
						animate: {
							opacity: 1,
							y: 0,
							scale: 1
						},
						transition: {
							duration: reducedMotion ? 0 : .18,
							delay: reducedMotion ? 0 : .08,
							ease: motionEase
						},
						children: [/* @__PURE__ */ jsx(Check$1, { size: 14 }), /* @__PURE__ */ jsx("span", { children: cue.cue })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "artifact-grid",
						children: artifacts.map(([label, copy], index) => /* @__PURE__ */ jsxs(motion$1.dl, {
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: reducedMotion ? 0 : .18,
								delay: reducedMotion ? 0 : index * .04,
								ease: motionEase
							},
							children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: copy })]
						}, label))
					}),
					/* @__PURE__ */ jsxs(motion$1.div, {
						className: "packet-next",
						initial: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: reducedMotion ? 0 : .2,
							delay: reducedMotion ? 0 : .12,
							ease: motionEase
						},
						children: [/* @__PURE__ */ jsx("strong", { children: "Next handoff" }), /* @__PURE__ */ jsx("span", { children: step.next })]
					})
				]
			}, step.title)
		}), /* @__PURE__ */ jsx("div", {
			className: "packet-backdrop",
			"aria-hidden": "true",
			children: [
				"Drawings",
				"Mockup",
				"QA",
				"Shipping"
			].map((label, index) => /* @__PURE__ */ jsx(motion$1.span, {
				animate: reducedMotion ? {
					opacity: 1,
					y: 0
				} : {
					opacity: index <= active ? 1 : .72,
					y: index === active ? -3 : 0
				},
				transition: {
					duration: reducedMotion ? 0 : .22,
					ease: motionEase
				},
				children: label
			}, label))
		})]
	});
}
function SlabZoomOverlay$1({ slab, onClose }) {
	const reducedMotion = useReducedMotion$1();
	const panelRef = useRef$1(null);
	const closeButtonRef = useRef$1(null);
	useEffect$1(() => {
		if (!slab) return void 0;
		const previousOverflow = document.body.style.overflow;
		const previousFocus = document.activeElement;
		const restoreAppRoot = isolateAppRoot();
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose();
				return;
			}
			if (event.key !== "Tab" || !panelRef.current) return;
			const focusable = panelRef.current.querySelectorAll("a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex=\"-1\"])");
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);
		requestAnimationFrame(() => closeButtonRef.current?.focus());
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
			restoreAppRoot();
			if (previousFocus instanceof HTMLElement) previousFocus.focus();
		};
	}, [slab, onClose]);
	const overlay = /* @__PURE__ */ jsx(AnimatePresence$1, { children: slab && /* @__PURE__ */ jsx(motion$1.div, {
		className: "slab-zoom-backdrop",
		onClick: onClose,
		initial: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		animate: { opacity: 1 },
		exit: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		transition: {
			duration: reducedMotion ? 0 : .2,
			ease: motionEase
		},
		children: /* @__PURE__ */ jsxs(motion$1.div, {
			ref: panelRef,
			className: "slab-zoom-panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "slab-zoom-title",
			onClick: (event) => event.stopPropagation(),
			initial: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 14,
				scale: .985
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 8,
				scale: .985
			},
			transition: {
				duration: reducedMotion ? 0 : .24,
				ease: motionEase
			},
			children: [
				/* @__PURE__ */ jsx("button", {
					ref: closeButtonRef,
					className: "zoom-close",
					type: "button",
					onClick: onClose,
					"aria-label": "Close slab zoom",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "slab-zoom-media",
					children: [
						/* @__PURE__ */ jsx(motion$1.i, {
							className: "slab-zoom-scan",
							"aria-hidden": "true",
							initial: reducedMotion ? {
								opacity: 0,
								x: 0
							} : {
								opacity: 0,
								x: "-38%"
							},
							animate: reducedMotion ? {
								opacity: 0,
								x: 0
							} : {
								opacity: [
									0,
									.5,
									0
								],
								x: [
									"-38%",
									"34%",
									"88%"
								]
							},
							transition: {
								duration: reducedMotion ? 0 : .72,
								delay: reducedMotion ? 0 : .08,
								ease: motionEase
							}
						}),
						/* @__PURE__ */ jsx(ResponsiveImage, {
							src: slab.image,
							alt: slab.alt,
							loading: "eager",
							sizes: "(max-width: 920px) 92vw, 54vw",
							preferredWidth: 960
						}),
						/* @__PURE__ */ jsx("span", {
							className: "inspection-corner top",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "inspection-corner bottom",
							"aria-hidden": "true"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "slab-zoom-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "dialog-label",
							children: "Slab Inspection"
						}),
						/* @__PURE__ */ jsx("h2", {
							id: "slab-zoom-title",
							children: slab.name
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "slab-zoom-tags",
							children: [/* @__PURE__ */ jsx("span", { children: slab.code }), /* @__PURE__ */ jsx("span", { children: slab.collectionLabel ?? slab.collection })]
						}),
						/* @__PURE__ */ jsx("p", { children: slab.behavior ?? slab.asset_description }),
						/* @__PURE__ */ jsxs("dl", {
							className: "slab-zoom-facts",
							children: [(slab.facts ?? []).map((fact, index) => /* @__PURE__ */ jsxs(motion$1.div, {
								initial: reducedMotion ? {
									opacity: 1,
									y: 0
								} : {
									opacity: 0,
									y: 6
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: reducedMotion ? 0 : .16,
									delay: reducedMotion ? 0 : .12 + index * .035,
									ease: motionEase
								},
								children: [/* @__PURE__ */ jsx("dt", { children: fact.label }), /* @__PURE__ */ jsx("dd", { children: fact.value })]
							}, fact.label)), /* @__PURE__ */ jsxs(motion$1.div, {
								initial: reducedMotion ? {
									opacity: 1,
									y: 0
								} : {
									opacity: 0,
									y: 6
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: reducedMotion ? 0 : .16,
									delay: reducedMotion ? 0 : .24,
									ease: motionEase
								},
								children: [/* @__PURE__ */ jsx("dt", { children: "Quote inputs" }), /* @__PURE__ */ jsx("dd", { children: "Slab name, square footage, edge profile, cutouts, destination, and timeline." })]
							})]
						})
					]
				})
			]
		})
	}) });
	if (typeof document === "undefined") return overlay;
	return createPortal(overlay, document.body);
}
function SectionIntro({ eyebrow, title, copy, align = "split" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `section-intro ${align}`,
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "section-label",
				children: eyebrow
			}),
			/* @__PURE__ */ jsx("h2", { children: title }),
			copy && /* @__PURE__ */ jsx("p", { children: copy })
		]
	});
}
var relatedRouteGroups = {
	cabinets: {
		eyebrow: "Related Cabinet Paths",
		title: "Connect cabinet review to the next project decision.",
		copy: "These links help cabinet buyers prepare quantities, surfaces, RFQ inputs, QA, and shipping details.",
		links: [
			{
				page: "multi-unit",
				label: "Multi-unit cabinet packages",
				copy: "Use this path when cabinet runs repeat across rooms, phases, or units.",
				meta: "Unit count / room type / finish choice",
				Icon: Box
			},
			{
				page: "countertops",
				label: "Countertop coordination",
				copy: "Line up slab codes, square footage, edge needs, and cutouts when surfaces are part of the cabinet scope.",
				meta: "Slab code / square footage / cutouts",
				Icon: Ruler
			},
			{
				page: "rfq",
				label: "Cabinet RFQ checklist",
				copy: "Prepare quote inputs before Asina asks for drawings and specs by email.",
				meta: "RFQ inputs / timeline / location",
				Icon: FileText$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Review landed cost, order scale, lead time, QA, and shipping questions before cabinet pricing.",
				meta: "Cost picture / order scale / lead time",
				Icon: PackageCheck$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Review mockup, packing, and responsibility before repeat quantities move.",
				meta: "Mockup / packing / shipping",
				Icon: ShieldCheck
			}
		]
	},
	countertops: {
		eyebrow: "Related Countertop Paths",
		title: "Bring slab decisions into project review.",
		copy: "Countertop scope is easier to quote when cabinet coordination, RFQ inputs, cutouts, and responsibility stay in one review.",
		links: [
			{
				page: "cabinets",
				label: "Cabinet collections",
				copy: "Coordinate cabinet finish direction and room logic before surface decisions are locked.",
				meta: "Collections / finishes / room runs",
				Icon: Box
			},
			{
				page: "rfq",
				label: "Countertop RFQ checklist",
				copy: "Prepare slab name, square footage, edge profile, cutouts, destination, and timeline.",
				meta: "Slab code / edge / destination",
				Icon: FileText$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Sort landed cost, lead time, QA, packing, and responsibility questions before quote review.",
				meta: "Cost picture / QA / responsibility",
				Icon: PackageCheck$1
			},
			{
				page: "qa",
				label: "QA + shipping review",
				copy: "Review material consistency, packing needs, and shipping responsibility before release.",
				meta: "Consistency / packing / responsibility",
				Icon: ShieldCheck
			},
			{
				page: "review",
				label: "Start project review",
				copy: "Send the basics first; drawings and specs move by email after the first fit check.",
				meta: "Basics first / email follow-up",
				Icon: Send$1
			}
		]
	},
	furniture: {
		eyebrow: "Related Furniture Paths",
		title: "Move from furniture examples to package-ready review.",
		copy: "Furniture package buyers usually need rollout logic, design support, RFQ inputs, and QA before pricing is useful.",
		links: [
			{
				page: "restaurant-furniture",
				label: "Restaurant + franchise packages",
				copy: "Use this path for repeat-location, restaurant, franchise, venue, and rollout furniture packages.",
				meta: "Store count / floor plan / brand direction",
				Icon: Armchair
			},
			{
				page: "design",
				label: "Design-to-production support",
				copy: "Turn room intent, custom sizing, finish direction, and brand standards into review notes.",
				meta: "Layout / finish / custom sizing",
				Icon: Ruler
			},
			{
				page: "rfq",
				label: "Furniture RFQ checklist",
				copy: "Prepare quantities, room plans, finish direction, brand requirements, and timeline.",
				meta: "Quantity / plan / timeline",
				Icon: FileText$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Use the guide when order scale, lead time, packing, and responsibility need review before pricing.",
				meta: "Scale / lead time / packing",
				Icon: PackageCheck$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Keep sample approval, packing, and responsibility clear before repeat quantities move.",
				meta: "Mockup / packing / shipping",
				Icon: ShieldCheck
			}
		]
	},
	process: {
		eyebrow: "Related Process Paths",
		title: "Use the process page with the right preparation path.",
		copy: "The next step depends on whether the buyer needs RFQ guidance, design support, QA review, or the project form.",
		links: [
			{
				page: "rfq",
				label: "RFQ procurement resources",
				copy: "Prepare category, scale, inputs, lead-time factors, and the details that shape quote quality.",
				meta: "RFQ inputs / quote quality",
				Icon: FileText$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Review the buyer questions that affect landed cost, order size, lead time, QA, and shipping.",
				meta: "Cost picture / scale / QA",
				Icon: PackageCheck$1
			},
			{
				page: "design",
				label: "Design-to-production support",
				copy: "Use this when room intent, finish direction, or custom sizing needs production notes the supplier can use.",
				meta: "Room intent / finish / sizing",
				Icon: Ruler
			},
			{
				page: "qa",
				label: "QA + shipping review",
				copy: "See how mockup, production QA, packing, and responsibility connect before release.",
				meta: "QA / packing / responsibility",
				Icon: ShieldCheck
			},
			{
				page: "review",
				label: "Start project review",
				copy: "Share project basics first; Asina requests drawings and specs by email after the first review.",
				meta: "Basics / fit check / email follow-up",
				Icon: Send$1
			}
		]
	},
	qa: {
		eyebrow: "Related QA Paths",
		title: "Keep risk controls inside the quote.",
		copy: "QA and shipping decisions are clearer when the process, RFQ inputs, and product categories stay connected.",
		links: [
			{
				page: "process",
				label: "Drawing-to-production process",
				copy: "Review the sequence from basics to drawings, mockup approval, production QA, and shipping.",
				meta: "Basics / mockup / shipment",
				Icon: PackageCheck$1
			},
			{
				page: "rfq",
				label: "RFQ procurement resources",
				copy: "Prepare the details that reduce missing information before quote development starts.",
				meta: "Category / scale / inputs",
				Icon: FileText$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Use this guide when quality, shipping, order scale, and landed cost questions need one place.",
				meta: "QA / shipping / landed cost",
				Icon: PackageCheck$1
			},
			{
				page: "cabinets",
				label: "Cabinet packages",
				copy: "Check collections, finishes, and construction facts before cabinet pricing review.",
				meta: "Finish / run / unit count",
				Icon: Box
			},
			{
				page: "countertops",
				label: "Countertop supply",
				copy: "Keep slab codes, square footage, edge profiles, and cutouts ready for review.",
				meta: "Slab / edge / cutouts",
				Icon: Ruler
			}
		]
	},
	about: {
		eyebrow: "Related Asina Paths",
		title: "See how the accountability model works in practice.",
		copy: "The about page gives project-scale buyers the location, process, QA, and design support context.",
		links: [
			{
				page: "orlando",
				label: "Florida-to-nationwide supply",
				copy: "See how Greater Orlando, Florida, and qualified nationwide projects start from the same review process.",
				meta: "Florida / nationwide / project fit",
				Icon: PackageCheck$1
			},
			{
				page: "process",
				label: "Drawing-to-production process",
				copy: "Follow the controlled sequence from project basics to production and shipping review.",
				meta: "Basics / drawings / QA",
				Icon: FileText$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Review how quality checks, packing, and responsibility are handled before release.",
				meta: "QA / packing / responsibility",
				Icon: ShieldCheck
			},
			{
				page: "design",
				label: "Design-to-production support",
				copy: "Use this when layout, finish direction, or custom sizing needs review notes the supplier can use.",
				meta: "Layout / finish / sizing",
				Icon: Ruler
			}
		]
	},
	design: {
		eyebrow: "Related Design Paths",
		title: "Move design intent into the right supply review.",
		copy: "Design support points buyers toward the category, RFQ, process, or package review that makes the project buildable.",
		links: [
			{
				page: "furniture",
				label: "Custom furniture packages",
				copy: "Review furniture scope when quantities, room intent, materials, or custom pieces need structure.",
				meta: "Quantity / room intent / materials",
				Icon: Armchair
			},
			{
				page: "restaurant-furniture",
				label: "Restaurant + franchise packages",
				copy: "Bring brand standards, floor plans, finish direction, and repeat-location planning into one review.",
				meta: "Brand standards / floor plan / rollout",
				Icon: PackageCheck$1
			},
			{
				page: "process",
				label: "Drawing-to-production process",
				copy: "See how approved direction becomes the reference for mockup and production review.",
				meta: "Drawings / mockup / QA",
				Icon: FileText$1
			},
			{
				page: "rfq",
				label: "RFQ procurement resources",
				copy: "Prepare the first-request details before files move by email.",
				meta: "Category / scale / timeline",
				Icon: Send$1
			}
		]
	},
	"multi-unit": {
		eyebrow: "Related Cabinet Package Paths",
		title: "Tie repeat cabinet work to the right pricing inputs.",
		copy: "Multi-unit cabinet review depends on collection facts, RFQ preparation, QA, and location fit.",
		links: [
			{
				page: "cabinets",
				label: "Inspect cabinet collections",
				copy: "Compare Malibu, Monterey, Newport, Catalina, Laguna, and Jersey by construction and finish.",
				meta: "Collections / finishes / construction",
				Icon: Box
			},
			{
				page: "rfq",
				label: "Cabinet RFQ checklist",
				copy: "Prepare finish choice, room type, cabinet run, unit count, location, and timeline.",
				meta: "Finish / run / unit count",
				Icon: FileText$1
			},
			{
				page: "importer-resources",
				label: "Order scale guide",
				copy: "Review container fit, mixed styles, trial runs, excess inventory risk, and lead time questions.",
				meta: "Container fit / trial run / lead time",
				Icon: PackageCheck$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Review mockup approval, packing, and shipping responsibility for repeat quantities.",
				meta: "Mockup / packing / shipping",
				Icon: ShieldCheck
			},
			{
				page: "orlando",
				label: "Florida-to-nationwide supply",
				copy: "Send Florida and qualified nationwide cabinet package inquiries through project review.",
				meta: "Florida / nationwide / project fit",
				Icon: PackageCheck$1
			}
		]
	},
	"restaurant-furniture": {
		eyebrow: "Related Furniture Package Paths",
		title: "Connect rollout furniture to the pages that define scope.",
		copy: "Repeat-location furniture review needs category examples, design support, RFQ inputs, QA, and shipping responsibility.",
		links: [
			{
				page: "furniture",
				label: "Custom furniture packages",
				copy: "Review the broader furniture package path for commercial rooms, venues, and rollout buyers.",
				meta: "Package direction / quantity / materials",
				Icon: Armchair
			},
			{
				page: "design",
				label: "Design-to-production support",
				copy: "Turn room layout, custom sizing, finish direction, and brand standards into usable notes.",
				meta: "Layout / sizing / brand standards",
				Icon: Ruler
			},
			{
				page: "rfq",
				label: "Furniture RFQ checklist",
				copy: "Prepare store count, quantity estimate, floor plan, finish direction, and timeline.",
				meta: "Store count / floor plan / timeline",
				Icon: FileText$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Keep sample approval, packing review, and responsibility clear before release.",
				meta: "Sample / packing / responsibility",
				Icon: ShieldCheck
			}
		]
	},
	rfq: {
		eyebrow: "Related RFQ Paths",
		title: "Send each RFQ toward the right category page.",
		copy: "These links help buyers turn a request for quote into product-specific preparation before the first review.",
		links: [
			{
				page: "cabinets",
				label: "Cabinet packages",
				copy: "Review cabinet collections, finish choices, room type, cabinet run, and unit count.",
				meta: "Finish / run / unit count",
				Icon: Box
			},
			{
				page: "countertops",
				label: "Countertop supply",
				copy: "Review slab codes, square footage, edge profiles, cutouts, and destination details.",
				meta: "Slab code / edge / cutouts",
				Icon: Ruler
			},
			{
				page: "restaurant-furniture",
				label: "Restaurant + franchise packages",
				copy: "Review store count, quantity estimates, floor plans, brand direction, and timeline.",
				meta: "Store count / floor plan / brand direction",
				Icon: Armchair
			},
			{
				page: "process",
				label: "Drawing-to-production process",
				copy: "See how project basics lead to emailed drawings, mockup approval, QA, and shipping.",
				meta: "Basics / drawings / QA",
				Icon: PackageCheck$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Use this guide to prepare landed cost, order size, lead time, quality, and responsibility questions.",
				meta: "Landed cost / MOQ / lead time",
				Icon: ShieldCheck
			}
		]
	},
	"importer-resources": {
		eyebrow: "Related Buyer Resource Paths",
		title: "Turn importer questions into the right project review.",
		copy: "This guide supports category pages, RFQ preparation, QA review, and the project intake form without exposing private supply details.",
		links: [
			{
				page: "rfq",
				label: "RFQ procurement resources",
				copy: "Prepare the product inputs that improve quote quality before drawings and specs move by email.",
				meta: "Category / inputs / timeline",
				Icon: FileText$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Review sample approval, production QA, packing, damage documentation, and shipping responsibility.",
				meta: "QA / packing / responsibility",
				Icon: ShieldCheck
			},
			{
				page: "multi-unit",
				label: "Multi-unit cabinet packages",
				copy: "Use this path when cabinet work repeats across rooms, phases, developments, or unit counts.",
				meta: "Units / cabinet runs / finish",
				Icon: Box
			},
			{
				page: "review",
				label: "Start project review",
				copy: "Send project basics first. Asina requests drawings and specs by email after the fit check.",
				meta: "Basics / email follow-up",
				Icon: Send$1
			}
		]
	},
	"dealer-supply": {
		eyebrow: "Related Dealer Supply Paths",
		title: "Related Resources",
		copy: "Use these pages to compare supplier models, prepare quote inputs, review QA controls, and check whether import supply fits the dealer-led project.",
		links: [
			{
				page: "supplier-guide",
				label: "Central Florida supplier comparison",
				copy: "Compare local stock, showroom, assembled, and project-scale import supplier models.",
				meta: "Comparison / local suppliers",
				Icon: FileText$1
			},
			{
				page: "rfq",
				label: "RFQ procurement resources",
				copy: "Prepare drawings, finish schedule, unit count, destination, timeline, and quote inputs.",
				meta: "RFQ / drawings / quantity",
				Icon: FileText$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Review mockup approval, production checks, packing, and shipping responsibility.",
				meta: "Mockup / QA / packing",
				Icon: ShieldCheck
			},
			{
				page: "import-vs-domestic",
				label: "Import vs domestic planning",
				copy: "Compare speed, container scale, cost picture, QA, and tariff exposure before quoting a client.",
				meta: "Speed / scale / cost",
				Icon: PackageCheck$1
			}
		]
	},
	"supplier-comparison": {
		eyebrow: "Related Supplier Comparison Paths",
		title: "Related Pages on Asina Global",
		copy: "The comparison page should lead buyers into dealer supply, multi-unit packages, import planning, or mixed commercial review only when those paths fit.",
		links: [
			{
				page: "dealer-supply",
				label: "Dealer cabinet supply",
				copy: "Use this path when a dealer, designer, or distributor is bringing a project client.",
				meta: "Dealer / reseller / distributor",
				Icon: FileText$1
			},
			{
				page: "multi-unit",
				label: "Multi-unit cabinet packages",
				copy: "Use this path when cabinet runs repeat across units, rooms, or phases.",
				meta: "Units / cabinet runs / finish",
				Icon: Box
			},
			{
				page: "import-vs-domestic",
				label: "Import vs domestic cabinet cost",
				copy: "Compare timing, scale, cost picture, QA, and responsibility before choosing a sourcing path.",
				meta: "Import / domestic / cost",
				Icon: PackageCheck$1
			},
			{
				page: "commercial-mixed",
				label: "Commercial cabinet + countertop supply",
				copy: "Use this when cabinets and surfaces need one coordinated project review.",
				meta: "Cabinets / countertops",
				Icon: Ruler
			}
		]
	},
	"supplier-guide": {
		eyebrow: "Related Supplier Guide Paths",
		title: "Move from supplier model into the right Asina path.",
		copy: "Use these pages once the supplier model fits the project schedule, order size, and service level.",
		links: [
			{
				page: "dealer-supply",
				label: "Cabinet wholesale supply for dealers",
				copy: "Use this when a dealer, kitchen designer, or distributor brings a project-scale client.",
				meta: "Dealer / reseller / client protected",
				Icon: FileText$1
			},
			{
				page: "multi-unit",
				label: "Multi-unit cabinet packages",
				copy: "Use this when cabinet runs repeat across units, rooms, or phases.",
				meta: "Developers / contractors / units",
				Icon: Box
			},
			{
				page: "import-vs-domestic",
				label: "Import vs domestic cost guide",
				copy: "Compare speed, landed cost, tariff exposure, QA, and repeatability before sourcing.",
				meta: "Cost / lead time / QA",
				Icon: PackageCheck$1
			},
			{
				page: "review",
				label: "Start project review",
				copy: "Send project basics first. Asina requests drawings and specs by email after the fit check.",
				meta: "Basics / email follow-up",
				Icon: Send$1
			}
		]
	},
	orlando: {
		eyebrow: "Related Florida-To-Nationwide Paths",
		title: "Guide local and nationwide buyers into the right review.",
		copy: "Location intent should connect to product category, repeat package logic, and process before a quote starts.",
		links: [
			{
				page: "multi-unit",
				label: "Multi-unit cabinet packages",
				copy: "Use this path for repeatable cabinet rooms, phases, developments, and builder packages.",
				meta: "Units / phases / cabinet runs",
				Icon: Box
			},
			{
				page: "countertops",
				label: "Countertop supply",
				copy: "Prepare slab code, square footage, edge needs, cutouts, destination, and timeline.",
				meta: "Slab / edge / destination",
				Icon: Ruler
			},
			{
				page: "restaurant-furniture",
				label: "Restaurant + franchise packages",
				copy: "Review quantity, floor plan, brand direction, and repeat-location furniture needs.",
				meta: "Quantity / floor plan / rollout",
				Icon: Armchair
			},
			{
				page: "process",
				label: "Drawing-to-production process",
				copy: "See how project basics, drawings, mockup approval, QA, and shipping fit together.",
				meta: "Basics / drawings / QA",
				Icon: PackageCheck$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Review landed cost, order scale, lead time, QA, and shipping questions before quote review.",
				meta: "Buyer questions / importer planning",
				Icon: FileText$1
			}
		]
	},
	review: {
		eyebrow: "Before You Submit",
		title: "Use the right preparation page if you need more context.",
		copy: "The form stays simple, but these pages help buyers prepare stronger project basics before submitting.",
		links: [
			{
				page: "rfq",
				label: "RFQ procurement resources",
				copy: "Check the category-specific inputs that make a quote request easier to review.",
				meta: "RFQ / inputs / timeline",
				Icon: FileText$1
			},
			{
				page: "process",
				label: "Drawing-to-production process",
				copy: "Understand what happens after basics are sent and drawings move by email.",
				meta: "Basics / drawings / follow-up",
				Icon: PackageCheck$1
			},
			{
				page: "importer-resources",
				label: "Project supply buyer guide",
				copy: "Read the landed cost, order scale, lead time, QA, and shipping questions before submitting.",
				meta: "Cost picture / scale / QA",
				Icon: FileText$1
			},
			{
				page: "cabinets",
				label: "Cabinet packages",
				copy: "Review collections, finishes, room type, cabinet run, and unit count before submitting.",
				meta: "Collections / finish / run",
				Icon: Box
			},
			{
				page: "countertops",
				label: "Countertop supply",
				copy: "Review slab codes, square footage, edge needs, and cutouts before submitting.",
				meta: "Slab / square footage / edge",
				Icon: Ruler
			}
		]
	}
};
Object.assign(relatedRouteGroups, {
	"commercial-mixed": {
		eyebrow: "Related Commercial Supply Paths",
		title: "Guide mixed-scope buyers into the right next review.",
		copy: "Cabinet and countertop supply is easier to quote when category facts, RFQ inputs, QA, and local fit are clear.",
		links: [
			{
				page: "cabinets",
				label: "Cabinet collections",
				copy: "Compare finishes, construction facts, panel platform, face material, and quote inputs.",
				meta: "Finish / construction / run",
				Icon: Box
			},
			{
				page: "countertops",
				label: "Countertop supply",
				copy: "Review slab codes, movement, size, edge needs, cutouts, and destination.",
				meta: "Slab / edge / cutouts",
				Icon: Ruler
			},
			{
				page: "commercial-countertops",
				label: "Commercial countertop supply",
				copy: "Use this when the surface package is the main commercial buying intent.",
				meta: "Commercial surfaces / Orlando",
				Icon: FileText$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Review mockup, production checks, packing review, and responsibility before release.",
				meta: "Mockup / packing / shipping",
				Icon: ShieldCheck
			}
		]
	},
	"commercial-countertops": {
		eyebrow: "Related Countertop Paths",
		title: "Tie commercial surface review to slab facts and project scope.",
		copy: "Countertop buyers can move from collection review into RFQ inputs, mixed supply, or QA planning.",
		links: [
			{
				page: "countertop-quartz-codes",
				label: "Quartz slab codes",
				copy: "Use the code ledger when a buyer needs to reference a specific slab.",
				meta: "Codes / collection / movement",
				Icon: Ruler
			},
			{
				page: "countertops",
				label: "Countertop catalog",
				copy: "Review Exotic, Natural, and Grain collections with slab facts and quote inputs.",
				meta: "Collections / slab facts",
				Icon: Maximize2
			},
			{
				page: "commercial-mixed",
				label: "Cabinet + countertop supply",
				copy: "Use this when surfaces need to be reviewed with cabinet packages.",
				meta: "Cabinets / surfaces",
				Icon: PackageCheck$1
			},
			{
				page: "orlando",
				label: "Florida-to-nationwide support",
				copy: "Connect Orlando-area and Florida location intent to the broader supply process.",
				meta: "Longwood office / Florida",
				Icon: MapPin$1
			}
		]
	},
	"hospitality-ffe": {
		eyebrow: "Related Hospitality Paths",
		title: "Connect FF&E package planning to furniture, design support, and RFQ inputs.",
		copy: "Hospitality furniture buyers need quantity, room intent, standards, samples, and shipping in one review.",
		links: [
			{
				page: "furniture",
				label: "Custom furniture packages",
				copy: "Review the broader furniture package category before starting a project request.",
				meta: "Furniture / custom pieces",
				Icon: Armchair
			},
			{
				page: "restaurant-furniture",
				label: "Restaurant + franchise packages",
				copy: "Use this for restaurant groups, franchise rollouts, and repeat-location packages.",
				meta: "Store count / rollout",
				Icon: PackageCheck$1
			},
			{
				page: "design",
				label: "Design-to-production support",
				copy: "Move brand standards, floor plans, and finish direction into production notes.",
				meta: "Brand / floor plan / finish",
				Icon: FileText$1
			},
			{
				page: "rfq",
				label: "RFQ procurement resources",
				copy: "Prepare category, quantity, timeline, and project notes before files move by email.",
				meta: "RFQ / project basics",
				Icon: Send$1
			}
		]
	},
	"multifamily-supply": {
		eyebrow: "Related Multifamily Paths",
		title: "Connect development supply planning to cabinets, surfaces, and risk controls.",
		copy: "Multifamily requests need unit count, phase timing, finish schedule, mockup reference, QA, and responsibility review.",
		links: [
			{
				page: "multi-unit",
				label: "Multi-unit cabinet packages",
				copy: "Use this when cabinet runs and finish schedules repeat across rooms or units.",
				meta: "Units / rooms / cabinet runs",
				Icon: Box
			},
			{
				page: "commercial-mixed",
				label: "Commercial cabinet + countertop supply",
				copy: "Use this when cabinets and surfaces need one coordinated review.",
				meta: "Mixed category / Florida",
				Icon: PackageCheck$1
			},
			{
				page: "import-vs-domestic",
				label: "Import vs domestic planning",
				copy: "Compare timing, scale, QA, and accountability before choosing how to source the package.",
				meta: "Timing / scale / QA",
				Icon: FileText$1
			},
			{
				page: "qa",
				label: "QA + shipping controls",
				copy: "Review mockup approval, packing, count checks, and responsibility before repeat units move.",
				meta: "Mockup / packing / phases",
				Icon: ShieldCheck
			}
		]
	}
});
function RelatedProjectPaths({ currentPage, navigate }) {
	const group = relatedRouteGroups[currentPage];
	if (!group || !navigate) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "section related-paths",
		"aria-label": group.eyebrow,
		children: [/* @__PURE__ */ jsx(SectionIntro, {
			eyebrow: group.eyebrow,
			title: group.title,
			copy: group.copy
		}), /* @__PURE__ */ jsx("div", {
			className: "pathway-ledger related-path-ledger",
			children: group.links.map(({ page, label, copy, meta, Icon }, index) => /* @__PURE__ */ jsx(Reveal, {
				className: "pathway-row related-path-row",
				delay: index * .035,
				children: /* @__PURE__ */ jsxs(RouteLink, {
					page,
					navigate,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsx(Icon, { size: 20 }),
						/* @__PURE__ */ jsx("strong", { children: label }),
						/* @__PURE__ */ jsx("p", { children: copy }),
						/* @__PURE__ */ jsx("em", { children: meta }),
						/* @__PURE__ */ jsx(ArrowRight$1, { size: 17 })
					]
				})
			}, `${currentPage}-${page}`))
		})]
	});
}
function CollectionInternalLinks({ type, currentPage, navigate }) {
	const isCabinet = type === "cabinet";
	const collectionRoutes = isCabinet ? cabinetCollectionRoutes : countertopCollectionRoutes;
	const currentIndex = collectionRoutes.findIndex((item) => item.pageId === currentPage);
	const nextCollection = collectionRoutes[(currentIndex + 1 + collectionRoutes.length) % collectionRoutes.length];
	const previousCollection = collectionRoutes[(currentIndex - 1 + collectionRoutes.length) % collectionRoutes.length];
	const currentKey = collectionRoutes[currentIndex]?.key;
	const collection = isCabinet ? cabinets_default.collections.find((item) => item.key === currentKey) : countertops_default.collections.find((item) => item.key === currentKey);
	const collectionLabel = isCabinet ? `${collection?.name ?? "Collection"} cabinets` : `${collection?.name ?? "Collection"} quartz`;
	const baseLinks = isCabinet ? [
		{
			page: "cabinets",
			label: "All cabinet collections",
			copy: "Return to the main cabinet inspection page.",
			meta: "Cabinets"
		},
		{
			page: "multi-unit",
			label: "Multi-unit cabinet path",
			copy: "Review repeat rooms, unit counts, mockup needs, and cabinet runs.",
			meta: "Developer supply"
		},
		{
			page: "commercial-mixed",
			label: "Cabinet + countertop supply",
			copy: "Connect cabinet finish direction with slab decisions and project timing.",
			meta: "Mixed scope"
		}
	] : [
		{
			page: "countertops",
			label: "All countertop collections",
			copy: "Return to the main slab and code inspection page.",
			meta: "Countertops"
		},
		{
			page: "countertop-quartz-codes",
			label: "Quartz slab code ledger",
			copy: "Use slab codes when a specific surface needs quote review.",
			meta: "Code list"
		},
		{
			page: "commercial-countertops",
			label: "Commercial countertop supply",
			copy: "Match slab movement, square footage, edge details, and destination.",
			meta: "Commercial use"
		}
	];
	const peerLinks = [previousCollection, nextCollection].filter(Boolean).filter((item, index, arr) => item.pageId !== currentPage && arr.findIndex((other) => other.pageId === item.pageId) === index).map((item) => {
		const peer = isCabinet ? cabinets_default.collections.find((collectionItem) => collectionItem.key === item.key) : countertops_default.collections.find((collectionItem) => collectionItem.key === item.key);
		return {
			page: item.pageId,
			label: isCabinet ? `${peer?.name ?? "Collection"} cabinets` : `${peer?.name ?? "Collection"} quartz`,
			copy: isCabinet ? "Compare another cabinet finish family before the project review." : "Compare another quartz collection before choosing the slab code.",
			meta: isCabinet ? "Collection peer" : "Slab peer"
		};
	});
	const links = [
		...baseLinks,
		...peerLinks,
		{
			page: "review",
			label: "Start Project Review",
			copy: `Send the basics when ${collectionLabel} is ready for Asina review.`,
			meta: "Next step"
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "section collection-link-board",
		"aria-label": `${collectionLabel} related review links`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "collection-link-heading",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "ledger-caption",
					children: "Internal Review Paths"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Keep the product choice connected to the project path." }),
				/* @__PURE__ */ jsx("p", { children: "Collection pages should not end as isolated product pages. These routes connect the visual choice to quote inputs, commercial use, QA, and the next review step." })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "collection-link-ledger",
			children: links.map((link, index) => /* @__PURE__ */ jsx(Reveal, {
				className: "collection-link-row",
				delay: index * .025,
				children: /* @__PURE__ */ jsxs(RouteLink, {
					page: link.page,
					navigate,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsx("strong", { children: link.label }),
						/* @__PURE__ */ jsx("p", { children: link.copy }),
						/* @__PURE__ */ jsx("em", { children: link.meta }),
						/* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })
					]
				})
			}, `${currentPage}-${link.page}`))
		})]
	});
}
function CTASection({ navigate }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "cta-section",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "section-label center",
				children: "Project Basics Only"
			}),
			/* @__PURE__ */ jsx("h2", { children: "Start with the project. Drawings come by email after review." }),
			/* @__PURE__ */ jsx("p", { children: "Share the basics first so Asina can check fit. If the project makes sense for the supply model, the team follows up in 1-2 business days to request drawings or specs by email." }),
			/* @__PURE__ */ jsxs(RouteLink, {
				page: "review",
				navigate,
				className: "button primary",
				children: ["Start Project Review ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 18 })]
			})
		]
	});
}
function ModeSwitch({ mode, setMode, scope }) {
	const reducedMotion = useReducedMotion$1();
	const modes = ["visual", "spec"];
	const activeIndex = modes.indexOf(mode);
	return /* @__PURE__ */ jsx("div", {
		className: "mode-switch",
		role: "tablist",
		"aria-label": `${scope} view mode`,
		children: modes.map((item, index) => /* @__PURE__ */ jsxs(motion$1.button, {
			type: "button",
			id: `${scope}-${item}-tab`,
			role: "tab",
			"aria-selected": mode === item,
			"aria-controls": `${scope}-${item}-panel`,
			tabIndex: mode === item ? 0 : -1,
			"data-roving-option": true,
			className: mode === item ? "active" : "",
			onClick: () => setMode(item),
			onKeyDown: (event) => handleRovingOptionKeyDown(event, modes.length, activeIndex, (nextIndex) => setMode(modes[nextIndex])),
			whileTap: reducedMotion ? void 0 : { scale: .98 },
			children: [
				mode === item && /* @__PURE__ */ jsx(motion$1.span, {
					layoutId: `mode-pill-${scope}`,
					className: "mode-pill",
					transition: {
						duration: reducedMotion ? 0 : .22,
						ease: motionEase
					}
				}),
				mode === item && /* @__PURE__ */ jsx(motion$1.span, {
					className: "mode-switch-scan",
					"aria-hidden": "true",
					initial: reducedMotion ? {
						opacity: 0,
						x: 0
					} : {
						opacity: 0,
						x: "-60%"
					},
					animate: reducedMotion ? {
						opacity: 0,
						x: 0
					} : {
						opacity: [
							0,
							.34,
							0
						],
						x: [
							"-60%",
							"15%",
							"68%"
						]
					},
					transition: {
						duration: reducedMotion ? 0 : .42,
						ease: motionEase
					}
				}),
				/* @__PURE__ */ jsx("span", { children: item === "visual" ? "Visual" : "Spec" })
			]
		}, item))
	});
}
function PageShell({ variant, eyebrow, title, copy, heroLeadLabel, heroExtraCopy, heroByline, actionPage, navigate, breadcrumb, heroMeta, heroDisclosure, children }) {
	const heroParagraphs = [copy, ...heroExtraCopy ?? []].filter(Boolean);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("section", {
			className: `page-hero ${variant ? `page-hero-${variant}` : ""}`,
			children: [/* @__PURE__ */ jsxs(Reveal, {
				className: "page-hero-copy",
				children: [
					breadcrumb && /* @__PURE__ */ jsx("nav", {
						className: "page-breadcrumb",
						"aria-label": "Breadcrumb",
						children: breadcrumb.map((item, index) => item.page ? /* @__PURE__ */ jsx(RouteLink, {
							page: item.page,
							navigate,
							children: item.label
						}, item.label) : /* @__PURE__ */ jsx("span", {
							"aria-current": index === breadcrumb.length - 1 ? "page" : void 0,
							children: item.label
						}, item.label))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "page-label",
						children: eyebrow
					}),
					/* @__PURE__ */ jsx("h1", { children: title }),
					heroByline,
					heroMeta && /* @__PURE__ */ jsx("p", {
						className: "page-hero-meta",
						children: heroMeta
					}),
					heroDisclosure && /* @__PURE__ */ jsx("p", {
						className: "page-hero-disclosure",
						children: heroDisclosure
					}),
					heroParagraphs.map((paragraph, index) => /* @__PURE__ */ jsxs("p", { children: [index === 0 && heroLeadLabel && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("strong", { children: heroLeadLabel }), " "] }), paragraph] }, `${variant ?? "page"}-hero-copy-${index}`)),
					actionPage && navigate && /* @__PURE__ */ jsxs(RouteLink, {
						page: actionPage,
						navigate,
						className: "button primary",
						children: ["Start Project Review ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 18 })]
					})
				]
			}), variant && /* @__PURE__ */ jsx(PageHeroArtifact, { variant })]
		}),
		variant && variant !== "review" && /* @__PURE__ */ jsx(DossierProofRail, { variant }),
		children
	] });
}
function PageHeroArtifact({ variant }) {
	const reducedMotion = useReducedMotion$1();
	const [cabinetShowcaseKey, setCabinetShowcaseKey] = useState$1(cabinets_default.collections[0].key);
	const cabinetCollection = cabinets_default.collections.find((collection) => collection.key === cabinetShowcaseKey) ?? cabinets_default.collections[0];
	const cabinetFinishes = cabinetCollection.finishes.slice(0, 4);
	const countertopCollections = countertops_default.collections;
	const [randomSlabDossier, setRandomSlabDossier] = useState$1(() => ({
		collection: countertopCollections[0],
		slab: countertopCollections[0].slabs[0]
	}));
	const randomSlab = randomSlabDossier.slab;
	const randomSlabCollection = randomSlabDossier.collection;
	const randomSlabFact = (label) => randomSlabCollection.facts.find((fact) => fact.label === label)?.value;
	const randomSlabFacts = [
		["Code", randomSlab.code],
		["Movement", randomSlab.asset_description ?? randomSlabCollection.behavior],
		["Standard size", randomSlabFact("Standard size")],
		["Thickness", randomSlabFact("Thickness")]
	].filter(([, value]) => Boolean(value));
	useEffect$1(() => {
		const nextCollectionKey = getCabinetShowcaseKey(cabinets_default.collections);
		if (nextCollectionKey) setCabinetShowcaseKey(nextCollectionKey);
		setRandomSlabDossier(getSlabShowcaseDossier(countertopCollections));
	}, []);
	const intentArtifact = (pageId) => {
		const page = commercialIntentPages[pageId];
		if (!page) return null;
		return /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact importer-artifact commercial-intent-artifact",
			"aria-label": `${page.eyebrow} proof packet`,
			children: [
				/* @__PURE__ */ jsx(ResponsiveImage, {
					className: "importer-artifact-media",
					src: page.media,
					alt: page.mediaAlt,
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 92vw, 34vw",
					preferredWidth: 960
				}),
				/* @__PURE__ */ jsx("span", {
					className: "seo-artifact-scan",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "importer-artifact-ticket",
					children: [
						/* @__PURE__ */ jsx("span", { children: page.eyebrow }),
						/* @__PURE__ */ jsx("strong", { children: page.ticket }),
						/* @__PURE__ */ jsx("p", { children: page.copy })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "importer-artifact-ledger",
					children: page.scopes.slice(0, 5).map(([item], index) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { children: String(index + 1).padStart(2, "0") }), item] }, item))
				})
			]
		});
	};
	const guideArtifact = (guideId) => {
		const guide = buyerQuestionGuides[guideId];
		if (!guide) return null;
		const usesEnvironmentPhoto = guide.image === heroAssets.environment;
		return /* @__PURE__ */ jsxs("div", {
			className: `hero-artifact importer-artifact seo-artifact${usesEnvironmentPhoto ? " seo-artifact-static-media" : ""}`,
			"aria-label": `${guide.eyebrow} proof packet`,
			children: [
				/* @__PURE__ */ jsx(ResponsiveImage, {
					className: `importer-artifact-media${usesEnvironmentPhoto ? " is-static-artifact-media" : ""}`,
					src: guide.image,
					alt: guide.mediaAlt,
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 92vw, 34vw",
					preferredWidth: usesEnvironmentPhoto ? 1280 : 960
				}),
				/* @__PURE__ */ jsx("span", {
					className: "seo-artifact-scan",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "importer-artifact-ticket",
					children: [
						/* @__PURE__ */ jsx("span", { children: guide.eyebrow }),
						/* @__PURE__ */ jsx("strong", { children: guide.artifactTitle }),
						/* @__PURE__ */ jsx("p", { children: guide.artifactCopy ?? guide.copy })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "importer-artifact-ledger",
					children: guide.checks.slice(0, 5).map(([item], index) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { children: String(index + 1).padStart(2, "0") }), item] }, item))
				})
			]
		});
	};
	const routedCabinetCollection = cabinets_default.collections.find((collection) => collection.key === cabinetCollectionRouteMap[variant]);
	const routedCountertopCollection = countertops_default.collections.find((collection) => collection.key === countertopCollectionRouteMap[variant]);
	const variants = {
		cabinets: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact cabinet-artifact",
			"aria-label": "Cabinet finish and construction proof",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "cabinet-finish-wall",
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: cabinetCollection.hero.image,
					alt: `${cabinetCollection.name} cabinet finish wall`,
					loading: "eager",
					sizes: "(max-width: 920px) 88vw, 30vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsx("div", { children: cabinetFinishes.map((finish) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { style: { background: finish.swatches?.[0]?.color } }), finish.name] }, finish.name)) })]
			}), /* @__PURE__ */ jsxs("dl", { children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Frame" }), /* @__PURE__ */ jsx("dd", { children: cabinetCollection.line })] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Panel" }), /* @__PURE__ */ jsx("dd", { children: cabinetCollection.panel_thickness })] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Quote input" }), /* @__PURE__ */ jsx("dd", { children: "Run, room, unit count" })] })
			] })]
		}),
		countertops: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact slab-artifact",
			"aria-label": "Slab inspection proof",
			children: [/* @__PURE__ */ jsxs("figure", {
				className: "slab-proof-image",
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: randomSlab.image,
					alt: randomSlab.alt,
					loading: "eager",
					sizes: "(max-width: 920px) 72vw, 24vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsx("span", { children: randomSlab.code })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "slab-artifact-detail slab-artifact-dossier",
				children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("p", {
					className: "document-tab",
					children: "Slab Dossier"
				}), /* @__PURE__ */ jsx("h2", { children: randomSlab.name })] }), /* @__PURE__ */ jsx("dl", { children: randomSlabFacts.map(([label, value]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: value })] }, label)) })]
			})]
		}),
		furniture: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact furniture-artifact",
			"aria-label": "Furniture rollout package proof",
			children: [/* @__PURE__ */ jsx(ResponsiveImage, {
				src: heroAssets.furnitureCutout,
				alt: "Furniture rollout package seating reference",
				loading: "eager",
				sizes: "(max-width: 920px) 70vw, 28vw",
				preferredWidth: 960
			}), /* @__PURE__ */ jsx("div", {
				className: "artifact-file-stack",
				children: [
					"Brand standard",
					"Store count",
					"Floor plan",
					"Finish direction"
				].map((item, index) => /* @__PURE__ */ jsxs("span", {
					style: { "--artifact-step": index },
					children: [/* @__PURE__ */ jsx(FileText$1, { size: 15 }), item]
				}, item))
			})]
		}),
		process: /* @__PURE__ */ jsx("div", {
			className: "hero-artifact process-artifact",
			"aria-label": "Drawing to production tracker proof",
			children: processSteps.map((step, index) => /* @__PURE__ */ jsxs("div", {
				className: index < 3 ? "complete" : index === 3 ? "current" : "",
				children: [
					/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
					/* @__PURE__ */ jsx("strong", { children: step.short }),
					/* @__PURE__ */ jsx("small", { children: processCues[index].visual })
				]
			}, step.short))
		}),
		qa: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact qa-artifact",
			"aria-label": "QA control ledger proof",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("strong", { children: "Risk" }),
				/* @__PURE__ */ jsx("span", { children: "Wrong measurements" }),
				/* @__PURE__ */ jsx("span", { children: "Weak packing" }),
				/* @__PURE__ */ jsx("span", { children: "Unclear responsibility" })
			] }), /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("strong", { children: "Control" }),
				/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(Check$1, { size: 14 }), " Mockup approved"] }),
				/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(Check$1, { size: 14 }), " Packing reviewed"] }),
				/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(Check$1, { size: 14 }), " Shipping terms clarified"] })
			] })]
		}),
		about: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact about-artifact",
			"aria-label": "Asina project accountability proof",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "accountability-ticket",
				children: [
					/* @__PURE__ */ jsx(ResponsiveImage, {
						className: "artifact-card-media",
						src: heroAssets.cabinetRoom,
						alt: "Installed cabinet room used for Asina project accountability and supply review",
						sizes: "(max-width: 920px) 92vw, 32vw",
						loading: "eager",
						fetchPriority: "high",
						preferredWidth: 960
					}),
					/* @__PURE__ */ jsx("span", { children: "Greater Orlando" }),
					/* @__PURE__ */ jsxs("strong", { children: [
						"US-based",
						/* @__PURE__ */ jsx("br", {}),
						"project",
						/* @__PURE__ */ jsx("br", {}),
						"support"
					] }),
					/* @__PURE__ */ jsxs("p", { children: [
						"Qualified project coordination",
						/* @__PURE__ */ jsx("br", {}),
						"for builders and developers,",
						/* @__PURE__ */ jsx("br", {}),
						"procurement teams,",
						/* @__PURE__ */ jsx("br", {}),
						"and rollout buyers."
					] })
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "artifact-file-stack",
				children: [
					"Project basics",
					"Drawings by email",
					"QA checks",
					"Shipping review"
				].map((item, index) => /* @__PURE__ */ jsxs("span", {
					style: { "--artifact-step": index },
					children: [/* @__PURE__ */ jsx(FileText$1, { size: 15 }), item]
				}, item))
			})]
		}),
		design: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact design-artifact",
			"aria-label": "Design to production support proof",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "design-flow-card",
					children: [
						/* @__PURE__ */ jsx(ResponsiveImage, {
							className: "artifact-card-media",
							src: heroAssets.furniture,
							alt: "Outdoor furniture setting reviewed for room intent, layout, and finish direction",
							sizes: "(max-width: 920px) 92vw, 24vw",
							loading: "eager",
							fetchPriority: "high",
							preferredWidth: 768
						}),
						/* @__PURE__ */ jsx("span", { children: "Room intent" }),
						/* @__PURE__ */ jsx("strong", { children: "Layout, use, finish, custom sizing." })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "design-flow-card approved",
					children: [
						/* @__PURE__ */ jsx(ResponsiveImage, {
							className: "artifact-card-media",
							src: heroAssets.cabinetRoom,
							alt: "Installed cabinet room prepared for production-detail and mockup approval review",
							sizes: "(max-width: 920px) 92vw, 24vw",
							loading: "eager",
							fetchPriority: "high",
							preferredWidth: 960
						}),
						/* @__PURE__ */ jsx("span", { children: "Production detail" }),
						/* @__PURE__ */ jsx("strong", { children: "Mockup approval ready." })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "design-flow-rail",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ jsx(Ruler, { size: 18 }),
						/* @__PURE__ */ jsx(FileText$1, { size: 18 }),
						/* @__PURE__ */ jsx(PackageCheck$1, { size: 18 })
					]
				})
			]
		}),
		review: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact review-artifact",
			"aria-label": "Project review receipt proof",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "receipt-mini",
				children: [
					/* @__PURE__ */ jsx("span", { children: "First fit check" }),
					/* @__PURE__ */ jsx("strong", { children: "Ready for project review" }),
					/* @__PURE__ */ jsx("p", { children: "Asina asks for drawings by email after the project looks like a fit." })
				]
			}), /* @__PURE__ */ jsxs("ol", { children: [
				/* @__PURE__ */ jsx("li", { children: "Contact" }),
				/* @__PURE__ */ jsx("li", { children: "Project type" }),
				/* @__PURE__ */ jsx("li", { children: "Order scale" }),
				/* @__PURE__ */ jsx("li", { children: "Timeline" })
			] })]
		}),
		"buyer-paths": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact review-artifact buyer-path-artifact",
			"aria-label": "Buyer path directory proof",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "receipt-mini",
				children: [
					/* @__PURE__ */ jsx("span", { children: "Route directory" }),
					/* @__PURE__ */ jsx("strong", { children: "Product, commercial, planning" }),
					/* @__PURE__ */ jsx("p", { children: "Use the route index when the project needs a more specific starting point." })
				]
			}), /* @__PURE__ */ jsxs("ol", { children: [
				/* @__PURE__ */ jsx("li", { children: "Product" }),
				/* @__PURE__ */ jsx("li", { children: "Commercial" }),
				/* @__PURE__ */ jsx("li", { children: "Planning" }),
				/* @__PURE__ */ jsx("li", { children: "Review" })
			] })]
		}),
		"multi-unit": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact cabinet-artifact",
			"aria-label": "Multi-unit cabinet package proof",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "cabinet-finish-wall",
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: heroAssets.cabinetRoom,
					alt: "Installed cabinet package reviewed for repeatable project supply",
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 88vw, 30vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsx("div", { children: [
					"Unit count",
					"Finish choice",
					"Cabinet run",
					"Timeline"
				].map((item) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { style: { background: "var(--route-accent)" } }), item] }, item)) })]
			}), /* @__PURE__ */ jsxs("dl", { children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Fit" }), /* @__PURE__ */ jsx("dd", { children: "Developers, builders, repeat rooms" })] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Review" }), /* @__PURE__ */ jsx("dd", { children: "Mockup, QA, packing" })] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Scale" }), /* @__PURE__ */ jsx("dd", { children: "Container planning" })] })
			] })]
		}),
		"dealer-supply": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact dealer-artifact",
			"aria-label": "Dealer wholesale cabinet supply proof packet",
			children: [
				/* @__PURE__ */ jsx(ResponsiveImage, {
					className: "dealer-artifact-media",
					src: heroAssets.cabinetRoom,
					alt: "Cabinet package room prepared for dealer and distributor wholesale supply review",
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 92vw, 34vw",
					preferredWidth: 960
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "dealer-artifact-ticket",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Dealer packet" }),
						/* @__PURE__ */ jsx("strong", { children: "Client protected. Import path reviewed." }),
						/* @__PURE__ */ jsx("p", { children: "Drawings, quantity, mockup, QA, packing, and trade terms stay in one dealer-led review." })
					]
				}),
				/* @__PURE__ */ jsx("ol", {
					className: "dealer-artifact-steps",
					children: [
						"Dealer brings project",
						"Asina reviews fit",
						"Mockup approved",
						"Dealer sells through"
					].map((item, index) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), item] }, item))
				})
			]
		}),
		"restaurant-furniture": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact furniture-artifact",
			"aria-label": "Restaurant and franchise furniture rollout packet proof",
			children: [/* @__PURE__ */ jsx(ResponsiveImage, {
				src: heroAssets.furnitureCutout,
				alt: "Commercial seating package reviewed for restaurant and franchise rollout",
				loading: "eager",
				fetchPriority: "high",
				sizes: "(max-width: 920px) 70vw, 28vw",
				preferredWidth: 960
			}), /* @__PURE__ */ jsx("div", {
				className: "artifact-file-stack",
				children: [
					"Brand standard",
					"Floor plan",
					"Quantity estimate",
					"Rollout phase"
				].map((item, index) => /* @__PURE__ */ jsxs("span", {
					style: { "--artifact-step": index },
					children: [/* @__PURE__ */ jsx(FileText$1, { size: 15 }), item]
				}, item))
			})]
		}),
		rfq: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact rfq-artifact",
			"aria-label": "RFQ procurement checklist proof",
			children: [
				/* @__PURE__ */ jsx(ResponsiveImage, {
					className: "rfq-artifact-media",
					src: heroAssets.environment,
					alt: "Project supply desk prepared for cabinet, countertop, and furniture RFQ review",
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 92vw, 34vw",
					preferredWidth: 960
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rfq-ticket",
					children: [
						/* @__PURE__ */ jsx("span", { children: "RFQ packet" }),
						/* @__PURE__ */ jsx("strong", { children: "Inputs sorted before drawings" }),
						/* @__PURE__ */ jsx("p", { children: "Project basics route into Project Review first. Drawings and specs move by email after the fit check." })
					]
				}),
				/* @__PURE__ */ jsx("ol", {
					className: "rfq-artifact-steps",
					children: [
						"Category",
						"Scale",
						"Inputs",
						"Start review"
					].map((item, index) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), item] }, item))
				})
			]
		}),
		"importer-resources": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact importer-artifact",
			"aria-label": "Project supply buyer planning guide",
			children: [
				/* @__PURE__ */ jsx(ResponsiveImage, {
					className: "importer-artifact-media",
					src: heroAssets.materialContext,
					alt: "Project supply material detail prepared for importer resource planning",
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 92vw, 34vw",
					preferredWidth: 960
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "importer-artifact-ticket",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Buyer guide" }),
						/* @__PURE__ */ jsx("strong", { children: "Landed cost, lead time, QA, shipping." }),
						/* @__PURE__ */ jsx("p", { children: "Questions are grouped before quote review so the project can be priced with fewer gaps." })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "importer-artifact-ledger",
					children: [
						"Cost picture",
						"Order scale",
						"Lead time",
						"QA proof",
						"Shipping"
					].map((item, index) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { children: String(index + 1).padStart(2, "0") }), item] }, item))
				})
			]
		}),
		"supplier-comparison": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact comparison-artifact",
			"aria-label": "Central Florida wholesale cabinet supplier comparison proof",
			children: [
				/* @__PURE__ */ jsx(ResponsiveImage, {
					className: "comparison-artifact-media",
					src: heroAssets.cabinetRoom,
					alt: "Cabinet package room prepared for Central Florida supplier comparison",
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 92vw, (max-width: 1280px) 42vw, 36vw",
					preferredWidth: 1600
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "comparison-artifact-panel",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Comparison guide" }),
						/* @__PURE__ */ jsx("strong", { children: "Stock speed, assembled supply, project import." }),
						/* @__PURE__ */ jsx("p", { children: "Five supplier models compared by fit, lead time signal, and responsibility path." })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "comparison-artifact-ledger",
					children: [
						"Asina Global",
						"ELLIE Cabinetry",
						"KitchenCrest",
						"ROC Cabinetry",
						"Cabinets To Go"
					].map((item, index) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { children: String(index + 1).padStart(2, "0") }), item] }, item))
				})
			]
		}),
		"supplier-guide": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact comparison-artifact",
			"aria-label": "Wholesale cabinet supplier model guide proof",
			children: [
				/* @__PURE__ */ jsx(ResponsiveImage, {
					className: "comparison-artifact-media",
					src: heroAssets.cabinetRoom,
					alt: "Cabinet package room prepared for wholesale cabinet supplier model review",
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 92vw, (max-width: 1280px) 42vw, 36vw",
					preferredWidth: 1600
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "comparison-artifact-panel",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Supplier guide" }),
						/* @__PURE__ */ jsx("strong", { children: "RTA, assembled, showroom, import, dealer supply." }),
						/* @__PURE__ */ jsx("p", { children: "Five supplier models mapped to project type, lead time, service level, and order scale." })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "comparison-artifact-ledger",
					children: [
						"RTA",
						"Stock",
						"Retail",
						"Import",
						"Dealer"
					].map((item, index) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { children: String(index + 1).padStart(2, "0") }), item] }, item))
				})
			]
		}),
		"container-economics": guideArtifact("container-economics"),
		"landed-cost": guideArtifact("landed-cost"),
		"shipping-responsibility": guideArtifact("shipping-responsibility"),
		"imported-quality": guideArtifact("imported-quality"),
		"lead-times": guideArtifact("lead-times"),
		"import-vs-domestic": guideArtifact("import-vs-domestic"),
		orlando: /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact about-artifact",
			"aria-label": "Florida-to-nationwide project supply proof",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "accountability-ticket",
				children: [
					/* @__PURE__ */ jsx(ResponsiveImage, {
						className: "artifact-card-media",
						src: heroAssets.cabinet,
						alt: "Cabinet finish sample used for Florida-to-nationwide commercial project supply review",
						sizes: "(max-width: 920px) 92vw, 32vw",
						loading: "eager",
						fetchPriority: "high",
						preferredWidth: 960
					}),
					/* @__PURE__ */ jsx("span", { children: "Florida to nationwide" }),
					/* @__PURE__ */ jsxs("strong", { children: [
						"Project",
						/* @__PURE__ */ jsx("br", {}),
						"supply",
						/* @__PURE__ */ jsx("br", {}),
						"support"
					] }),
					/* @__PURE__ */ jsxs("p", { children: [
						"Cabinets, countertops,",
						/* @__PURE__ */ jsx("br", {}),
						"furniture packages,",
						/* @__PURE__ */ jsx("br", {}),
						"QA, and shipping review."
					] })
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "artifact-file-stack",
				children: [
					"Florida base",
					"Nationwide review",
					"Office in Longwood",
					"Email follow-up"
				].map((item, index) => /* @__PURE__ */ jsxs("span", {
					style: { "--artifact-step": index },
					children: [/* @__PURE__ */ jsx(FileText$1, { size: 15 }), item]
				}, item))
			})]
		}),
		"commercial-mixed": intentArtifact("commercial-mixed"),
		"commercial-countertops": intentArtifact("commercial-countertops"),
		"hospitality-ffe": intentArtifact("hospitality-ffe"),
		"multifamily-supply": intentArtifact("multifamily-supply"),
		"countertop-quartz-codes": /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact slab-artifact collection-route-artifact",
			"aria-label": "Quartz slab code inspection proof",
			children: [/* @__PURE__ */ jsxs("figure", {
				className: "slab-proof-image",
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: heroAssets.slab,
					alt: "Quartz slab code selected for project review",
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 72vw, 24vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsx("span", { children: "Code list" })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "slab-artifact-detail slab-artifact-dossier",
				children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("p", {
					className: "document-tab",
					children: "Quartz Codes"
				}), /* @__PURE__ */ jsx("h2", { children: "Slabs stay tied to project inputs." })] }), /* @__PURE__ */ jsx("dl", { children: countertops_default.collections.map((collection) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: collection.name }), /* @__PURE__ */ jsxs("dd", { children: [collection.slabs.length, " visible codes"] })] }, collection.key)) })]
			})]
		})
	};
	if (routedCabinetCollection) {
		const finishes = routedCabinetCollection.finishes.slice(0, 4);
		variants[variant] = /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact cabinet-artifact collection-route-artifact",
			"aria-label": `${routedCabinetCollection.name} cabinet collection proof`,
			children: [/* @__PURE__ */ jsxs("div", {
				className: "cabinet-finish-wall",
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: routedCabinetCollection.hero.image,
					alt: `${routedCabinetCollection.name} cabinet collection hero`,
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 88vw, 30vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsx("div", { children: finishes.map((finish) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { style: { background: finish.swatches?.[0]?.color ?? "var(--route-accent)" } }), finish.name] }, finish.name)) })]
			}), /* @__PURE__ */ jsxs("dl", { children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Line" }), /* @__PURE__ */ jsx("dd", { children: routedCabinetCollection.line })] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Panel" }), /* @__PURE__ */ jsx("dd", { children: routedCabinetCollection.panel_thickness })] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Fit" }), /* @__PURE__ */ jsx("dd", { children: routedCabinetCollection.style_family })] })
			] })]
		});
	}
	if (routedCountertopCollection) {
		const heroSlab = routedCountertopCollection.slabs[0];
		const standardSize = routedCountertopCollection.facts.find((fact) => fact.label === "Standard size")?.value;
		const thickness = routedCountertopCollection.facts.find((fact) => fact.label === "Thickness")?.value;
		variants[variant] = /* @__PURE__ */ jsxs("div", {
			className: "hero-artifact slab-artifact collection-route-artifact",
			"aria-label": `${routedCountertopCollection.name} quartz slab collection proof`,
			children: [/* @__PURE__ */ jsxs("figure", {
				className: "slab-proof-image",
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: heroSlab.image,
					alt: heroSlab.alt,
					loading: "eager",
					fetchPriority: "high",
					sizes: "(max-width: 920px) 72vw, 24vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsx("span", { children: heroSlab.code })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "slab-artifact-detail slab-artifact-dossier",
				children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsxs("p", {
					className: "document-tab",
					children: [routedCountertopCollection.name, " Collection"]
				}), /* @__PURE__ */ jsx("h2", { children: routedCountertopCollection.behavior })] }), /* @__PURE__ */ jsxs("dl", { children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Codes" }), /* @__PURE__ */ jsxs("dd", { children: [routedCountertopCollection.slabs.length, " visible slabs"] })] }),
					standardSize && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Standard size" }), /* @__PURE__ */ jsx("dd", { children: standardSize })] }),
					thickness && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Thickness" }), /* @__PURE__ */ jsx("dd", { children: thickness })] })
				] })]
			})]
		});
	}
	return /* @__PURE__ */ jsx(motion$1.div, {
		className: "page-hero-artifact",
		initial: reducedMotion ? {
			opacity: 1,
			y: 0,
			rotate: 0
		} : {
			opacity: 1,
			y: 14,
			rotate: -.25
		},
		animate: {
			opacity: 1,
			y: 0,
			rotate: 0
		},
		transition: {
			duration: reducedMotion ? 0 : .38,
			ease: motionEase
		},
		children: variants[variant]
	});
}
function DossierProofRail({ variant }) {
	const dossier = routeProofDossiers[variant] ?? (cabinetCollectionRouteMap[variant] ? routeProofDossiers["cabinet-collection"] : null) ?? (variant === "countertop-quartz-codes" || countertopCollectionRouteMap[variant] ? routeProofDossiers["countertop-collection"] : null);
	if (!dossier) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: `route-proof-rail route-proof-${variant}`,
		"aria-label": `${dossier.eyebrow} proof points`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "route-proof-lead",
			children: [/* @__PURE__ */ jsx("p", {
				className: "proof-label proof-label-light",
				children: dossier.eyebrow
			}), /* @__PURE__ */ jsx("h2", { children: dossier.title })]
		}), /* @__PURE__ */ jsx("div", {
			className: "route-proof-items",
			children: dossier.items.map(([label, copy, Icon], index) => /* @__PURE__ */ jsxs(Reveal, {
				className: `route-proof-item route-proof-item-${index + 1}`,
				delay: index * .045,
				children: [
					/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
					/* @__PURE__ */ jsx(Icon, { size: 20 }),
					/* @__PURE__ */ jsx("strong", { children: label }),
					/* @__PURE__ */ jsx("p", { children: copy })
				]
			}, label))
		})]
	});
}
function WhatToSend({ title, items, note, navigate }) {
	const [open, setOpen] = useState$1(() => {
		if (typeof window === "undefined") return true;
		return !window.matchMedia("(max-width: 760px)").matches;
	});
	return /* @__PURE__ */ jsx("aside", {
		className: "what-to-send",
		children: /* @__PURE__ */ jsxs("details", {
			open,
			onToggle: (event) => setOpen(event.currentTarget.open),
			children: [/* @__PURE__ */ jsxs("summary", { children: [/* @__PURE__ */ jsx("span", {
				className: "need-label",
				children: "What Asina Needs Next"
			}), /* @__PURE__ */ jsx("strong", { children: title })] }), /* @__PURE__ */ jsxs("div", {
				className: "what-content",
				children: [
					/* @__PURE__ */ jsx("ul", { children: items.map((item) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Check$1, { size: 15 }), item] }, item)) }),
					note && /* @__PURE__ */ jsx("p", { children: note }),
					/* @__PURE__ */ jsx(RouteLink, {
						page: "review",
						navigate,
						className: "button primary",
						children: "Start Project Review"
					})
				]
			})]
		})
	});
}
function CollectionComparison({ collections }) {
	const detailValue = (collection, label) => collection.details.find((detail) => detail.label === label)?.value ?? "Reviewed during project supply review.";
	const specValue = (collection, keys) => {
		const specs = collection.finishes[0]?.specs ?? {};
		const foundKey = keys.find((key) => specs[key]);
		return foundKey ? specs[foundKey] : "Review finish spec";
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "section comparison-section",
		children: [/* @__PURE__ */ jsx(SectionIntro, {
			eyebrow: "Collection Comparison",
			title: "Compare construction before choosing a finish direction.",
			copy: "Core construction facts stay easy to check so procurement teams can compare collections quickly."
		}), /* @__PURE__ */ jsxs("div", {
			className: "comparison-table",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "comparison-head",
				children: [
					/* @__PURE__ */ jsx("span", { children: "Collection" }),
					/* @__PURE__ */ jsx("span", { children: "Frame" }),
					/* @__PURE__ */ jsx("span", { children: "Panel" }),
					/* @__PURE__ */ jsx("span", { children: "Face Material" }),
					/* @__PURE__ */ jsx("span", { children: "Finishes" }),
					/* @__PURE__ */ jsx("span", { children: "Best Fit" })
				]
			}), collections.map((collection) => /* @__PURE__ */ jsxs("div", {
				className: "comparison-row",
				children: [
					/* @__PURE__ */ jsx("strong", { children: collection.name }),
					/* @__PURE__ */ jsx("span", {
						"data-label": "Frame",
						children: specValue(collection, ["Frame"])
					}),
					/* @__PURE__ */ jsx("span", {
						"data-label": "Panel",
						children: collection.panel_thickness
					}),
					/* @__PURE__ */ jsx("span", {
						"data-label": "Face material",
						children: specValue(collection, [
							"Faces",
							"Wood",
							"Color",
							"Colors"
						])
					}),
					/* @__PURE__ */ jsx("span", {
						"data-label": "Finishes",
						children: collection.finishes.map((finish) => finish.name).join(", ")
					}),
					/* @__PURE__ */ jsx("span", {
						"data-label": "Best fit",
						children: detailValue(collection, "Best fit")
					})
				]
			}, collection.key))]
		})]
	});
}
function ResourceByline({ pageId, navigate }) {
	const page = getPageById(pageId);
	const authorName = page.articleAuthor ?? siteDetails.authorName;
	const publishedDate = formatArticleDate(page.datePublished ?? "2026-06-03");
	const modifiedDate = formatArticleDate(page.dateModified ?? "2026-06-03");
	return /* @__PURE__ */ jsxs("aside", {
		className: "resource-byline",
		"aria-label": `${page.label} author and update details`,
		children: [
			/* @__PURE__ */ jsxs("span", { children: [
				/* @__PURE__ */ jsx(Building2, { size: 16 }),
				"Prepared by",
				" ",
				page.articleAuthorUrl ? /* @__PURE__ */ jsx("a", {
					href: page.articleAuthorUrl,
					children: authorName
				}) : /* @__PURE__ */ jsx(RouteLink, {
					page: "about",
					navigate,
					children: authorName
				})
			] }),
			/* @__PURE__ */ jsxs("span", { children: [
				/* @__PURE__ */ jsx(CalendarDays, { size: 16 }),
				"Published ",
				publishedDate
			] }),
			/* @__PURE__ */ jsxs("span", { children: [
				/* @__PURE__ */ jsx(Clock$1, { size: 16 }),
				"Updated ",
				modifiedDate
			] })
		]
	});
}
function ArticleByline({ name = "Kim Nguyen", title = "Co-Founder", note = "25+ years builder experience", image = "/assets/supporting/team/kim-nguyen.jpeg" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "article-byline",
		children: [/* @__PURE__ */ jsx("img", {
			src: image,
			alt: name,
			width: 32,
			height: 32
		}), /* @__PURE__ */ jsxs("span", { children: [
			"By ",
			/* @__PURE__ */ jsx("strong", { children: name }),
			", ",
			title,
			" · ",
			note
		] })]
	});
}
function formatArticleDate(value) {
	const date = /* @__PURE__ */ new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric"
	});
}
function ImportVsDomesticCostSection({ navigate }) {
	const supplyPaths = [
		{
			title: "Domestic stock",
			copy: "Fastest when the right size, finish, and quantity are already available. Compare product, local freight, taxes, pickup or delivery, and rush substitutions."
		},
		{
			title: "Domestic made-to-order",
			copy: "Useful when local fabrication control matters. Confirm current lead time, finish limitations, change fees, and whether the line can repeat across phases."
		},
		{
			title: "Planned import package",
			copy: "Best reviewed when rooms or units repeat, details are locked early, and the timeline supports production, freight, verified construction, mockup approval, QA, and written responsibility."
		}
	];
	const landedRows = [
		["FOB product cost", "Spec, box construction, finish type, and quantity"],
		["Ocean freight", "Origin port, destination port, container size, and market rates"],
		["Import duty", "Product classification, country of origin, and current duty treatment"],
		["Trade-remedy tariffs", "Section 301, Section 232, AD/CVD, or other measures when applicable"],
		["Customs brokerage", "Entry processing, classification support, and shipment documentation"],
		["Inland freight", "Distance from port, delivery method, site access, and receiving needs"],
		["QA and inspection", "Factory review, packing check, and damage documentation"],
		["Carrying cost", "Time between payment, production, freight, and site delivery"]
	];
	const savingsRows = [
		["Under 150 boxes", "Marginal. Freight and handling absorb most of the product cost advantage."],
		["150 to 370 boxes", "Often 10 to 20 percent below comparable domestic pricing when the supply path is clean."],
		["370 to 700 boxes", "Often 20 to 30 percent below comparable domestic pricing at 40HC partial to full scale."],
		["700 to 800+ boxes", "Can exceed 30 percent on full 40HC or multi-container work when verified and well planned."]
	];
	const leadRows = [
		["Consultation and design finalization", "About 3 weeks"],
		["Production", "40 to 50 days after approved details"],
		["West Coast transit under DAP planning", "22 to 30 days"],
		["East Coast transit under DAP planning", "40 to 50 days"],
		["Total West Coast planning reference", "About 14 to 16 weeks"],
		["Total East Coast planning reference", "About 17 to 20 weeks"]
	];
	const decisionRows = [
		[
			"Timeline",
			"Needed in under 8 weeks",
			"14+ weeks available before site-ready date"
		],
		[
			"Unit count",
			"Under 10 units",
			"20+ repeat units with consistent spec"
		],
		[
			"Container volume",
			"Under 150 boxes",
			"370+ boxes for 20-foot range or 700+ boxes for 40HC range"
		],
		[
			"Finish consistency",
			"One-off or highly custom",
			"Repeat finish across rooms or locations"
		],
		[
			"Budget priority",
			"Speed premium is acceptable",
			"Per-unit cost matters at scale"
		],
		[
			"QA tolerance",
			"Local return or swap is available",
			"Mockup approval and pre-ship inspection are part of the process"
		],
		[
			"Supply path",
			"Direct domestic distributor",
			"Verified origin, confirmed construction, accountable supplier of record"
		],
		[
			"Origin country",
			"Not applicable",
			"Verified non-China origin when Section 301 exposure matters"
		]
	];
	const tariffRows = [
		[
			"China",
			"Section 301 may apply when the covered HTS classification and origin match. AD/CVD and other measures can also matter.",
			"Confirm HTS code, country of origin, and current trade-remedy treatment before quote approval."
		],
		[
			"Vietnam",
			"Verify current status and origin documentation.",
			"Commerce has treated certain Malaysia or Vietnam cabinets with Chinese components as covered by China cabinet orders."
		],
		[
			"Malaysia",
			"Verify current status and origin documentation.",
			"Component origin and substantial-transformation facts matter before a buyer relies on non-China treatment."
		],
		[
			"Other origin",
			"Depends on current trade status and classification.",
			"Confirm HTS classification, origin documentation, and any current trade agreements or special measures."
		]
	];
	const choiceRows = [
		["Choose domestic stock when", "The project is urgent, the quantity is small, or local stock solves the problem within the timeline. Import logistics will not close in time and the economics do not support the overhead."],
		["Choose domestic made-to-order when", "Local fabrication control matters more than container economics, or the project has finish or modification requirements a domestic shop handles better."],
		["Review a planned import package when", "Units or locations repeat, spec can lock before production, mockup approval is workable, and there is time for production, QA, packing, and freight."],
		["Do not compare on", "A single advertised unit price, a broad savings percentage, or a quote that excludes freight, inland delivery, duties, QA, packing documentation, and responsibility terms."]
	];
	const Table = ({ columns, rows, caption }) => /* @__PURE__ */ jsx("div", {
		className: "import-table-scroll",
		role: "region",
		"aria-label": caption,
		tabIndex: 0,
		children: /* @__PURE__ */ jsxs("table", {
			className: "import-data-table",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((column) => /* @__PURE__ */ jsx("th", {
				scope: "col",
				children: column
			}, column)) }) }), /* @__PURE__ */ jsx("tbody", { children: rows.map((row) => /* @__PURE__ */ jsx("tr", { children: row.map((cell, index) => index === 0 ? /* @__PURE__ */ jsx("th", {
				scope: "row",
				children: cell
			}, cell) : /* @__PURE__ */ jsx("td", { children: cell }, cell)) }, row.join("-"))) })]
		})
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "section import-decision-workbench import-cost-guide",
		"aria-label": "Import versus domestic cabinet cost and lead time comparison",
		children: [
			/* @__PURE__ */ jsx(SectionIntro, {
				eyebrow: "Cost + Timing Comparison",
				title: "Compare the whole supply path, not one cabinet number.",
				copy: "Domestic stock, domestic made-to-order, and planned import supply solve different problems. The useful comparison includes product, packing, freight, duties, QA, lead time, delivery, and responsibility together."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "import-supply-paths",
				"aria-label": "Cabinet supply path comparison",
				children: supplyPaths.map((path, index) => /* @__PURE__ */ jsxs(Reveal, {
					className: "import-supply-path",
					delay: index * .04,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsx("h3", { children: path.title }),
						/* @__PURE__ */ jsx("p", { children: path.copy })
					]
				}, path.title))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "import-cost-ledger",
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "import-cost-panel import-cost-panel-wide",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Landed Cost Breakdown"
						}),
						/* @__PURE__ */ jsx("h3", { children: "The full column is the cost picture." }),
						/* @__PURE__ */ jsx("p", { children: "No single line wins or loses the comparison. Import value only holds when product cost, logistics, tariff exposure, QA, packing, and responsibility are reviewed before release." }),
						/* @__PURE__ */ jsx(Table, {
							caption: "Imported cabinet landed cost breakdown",
							columns: ["Cost component", "What drives it"],
							rows: landedRows
						})
					]
				}), /* @__PURE__ */ jsxs(Reveal, {
					className: "import-scale-panel",
					delay: .06,
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Scale"
						}),
						/* @__PURE__ */ jsx("h3", { children: "Container economics need real volume." }),
						/* @__PURE__ */ jsx("p", { children: "A 40HC container typically holds about 700 to 800 cabinet boxes. A 20-foot container holds roughly 370 boxes. Below 150 boxes, freight and logistics overhead can absorb much of the product cost advantage unless the order connects to future volume." }),
						/* @__PURE__ */ jsx("p", { children: "Projects with 20 or more repeat units, such as multifamily buildings, franchise locations, and hospitality rooms, tend to reach the volume where landed cost can move materially below comparable domestic distributor pricing." })
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Reveal, {
				className: "import-savings-panel",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Planning Benchmarks"
						}),
						/* @__PURE__ */ jsx("h2", { children: "What the cost difference actually looks like at scale." }),
						/* @__PURE__ */ jsx("p", { children: "These are planning benchmarks, not quotes. Your actual number depends on spec, origin, verified construction, quantity, current duties, freight, and agreed terms." })
					] }),
					/* @__PURE__ */ jsx(Table, {
						caption: "Net cabinet savings at container scale",
						columns: ["Project volume", "Typical net savings vs. comparable domestic spec"],
						rows: savingsRows
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "import-quote-note",
						children: [/* @__PURE__ */ jsx("strong", { children: "Raw quote gaps can look larger than landed savings." }), /* @__PURE__ */ jsx("p", { children: "One reviewed comparison showed an $18,000 imported cabinet quote against a $35,000 domestic equivalent for the same kitchen configuration. After freight, QA, and handling, the import-side savings were still substantial, but the supply path is what protected the result." })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "import-timing-grid",
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "import-cost-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Lead Time"
						}),
						/* @__PURE__ */ jsx("h3", { children: "Lead time drives as much as price does." }),
						/* @__PURE__ */ jsxs("div", {
							className: "import-timing-list",
							children: [
								/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Urgent replacement:" }), " domestic stock usually fits better unless product is already staged."] }),
								/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Model unit or first store:" }), " use the first approval to protect later repeat work."] }),
								/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Repeat project or rollout:" }), " compare full project cost, not one cabinet line."] }),
								/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Freight planning:" }), " plan receiving, site access, and installation around the actual destination window."] })
							]
						})
					]
				}), /* @__PURE__ */ jsx(Reveal, {
					className: "import-cost-panel",
					delay: .06,
					children: /* @__PURE__ */ jsx(Table, {
						caption: "Total import cabinet timeline planning reference",
						columns: ["Phase", "Typical duration"],
						rows: leadRows
					})
				})]
			}),
			/* @__PURE__ */ jsxs(Reveal, {
				className: "import-decision-panel",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "ledger-caption",
						children: "Decision Framework"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Use project signals before choosing import or domestic." }),
					/* @__PURE__ */ jsx(Table, {
						caption: "Import versus domestic cabinet decision framework",
						columns: [
							"Project signal",
							"Points toward domestic",
							"Points toward import"
						],
						rows: decisionRows
					}),
					/* @__PURE__ */ jsx("blockquote", { children: /* @__PURE__ */ jsx("p", { children: "\"Customer dissatisfaction with poor quality lingers long after the excitement of a cheaper price has been forgotten.\"" }) }),
					/* @__PURE__ */ jsx("div", {
						className: "proof-step-list import-choice-list",
						children: choiceRows.map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
							className: "proof-step",
							delay: index * .04,
							children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
						}, title))
					})
				]
			}),
			/* @__PURE__ */ jsxs(Reveal, {
				className: "import-tariff-panel",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Tariff Context"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Tariff exposure starts with origin and classification." }),
						/* @__PURE__ */ jsx("p", { children: "Tariff exposure varies by country of origin, HTS classification, product details, and current trade measures. This is planning context, not legal or customs advice. Final duty treatment belongs in the agreed quote and customs documentation." })
					] }),
					/* @__PURE__ */ jsx(Table, {
						caption: "Cabinet tariff context by country of origin",
						columns: [
							"Origin",
							"Exposure to verify",
							"Notes"
						],
						rows: tariffRows
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "import-tariff-footnote",
						children: [/* @__PURE__ */ jsx("strong", { children: "What a 25 percent tariff does to the cost picture" }), /* @__PURE__ */ jsx("p", { children: "If a 25 percent additional duty applies to a $60,000 FOB order, that adds $15,000 before freight, brokerage, handling, or delivery. Cabinet imports may also face other trade remedies, so Asina verifies classification, origin, and applicable duty treatment during consultation before drawings move or a quote is issued." })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "page-footer-note",
				children: [
					"For a full comparison of supplier models available in Central Florida, see our",
					" ",
					/* @__PURE__ */ jsx(RouteLink, {
						page: "supplier-guide",
						navigate,
						className: "copy-link",
						children: "wholesale cabinet supplier guide for contractors"
					}),
					"."
				]
			})
		]
	});
}
function PageFAQ({ title, items, id }) {
	return /* @__PURE__ */ jsxs("section", {
		id,
		className: "section page-faq",
		children: [/* @__PURE__ */ jsx("h2", { children: title }), /* @__PURE__ */ jsx("div", {
			className: "faq-grid",
			children: items.map(([q, a], index) => /* @__PURE__ */ jsxs(Reveal, {
				className: "faq-item",
				delay: index * .04,
				children: [/* @__PURE__ */ jsx("h3", { children: q }), /* @__PURE__ */ jsx("p", { children: a })]
			}, q))
		})]
	});
}
//#endregion
//#region src/pages/homePages.jsx
function HomePage({ navigate }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Hero, { navigate }),
		/* @__PURE__ */ jsx(DossierSnapshot, {}),
		/* @__PURE__ */ jsx(SupplyRouter, { navigate }),
		/* @__PURE__ */ jsx(BuyerPathTeaser, { navigate }),
		/* @__PURE__ */ jsx(ProcessPreview, { navigate }),
		/* @__PURE__ */ jsx(QAProofBand, { navigate }),
		/* @__PURE__ */ jsx(EconomicsShipping, { navigate }),
		/* @__PURE__ */ jsx(SourceProtectionPanel, { navigate }),
		/* @__PURE__ */ jsxs("section", {
			className: "dossier-grid quote-dossier",
			children: [/* @__PURE__ */ jsx(WhatToSend, {
				title: "What to send first",
				items: [
					"Project category",
					"Project location",
					"Unit, store, or room count",
					"Timeline",
					"Notes on materials, finishes, budget, or shipping needs"
				],
				note: "Start with the basics. If the project looks like a fit, Asina requests drawings and specs by email.",
				navigate
			}), /* @__PURE__ */ jsxs("div", {
				className: "quote-proof-panel",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "document-tab",
						children: "First Handoff"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Start with basics, then move into drawings and specs." }),
					/* @__PURE__ */ jsx("p", { children: "Builders, developers, procurement teams, and rollout buyers get a focused first step, not a public file drop or a retail shopping flow. If the project fits Asina's supply model, the team follows up by email for the drawings and specs." })
				]
			})]
		}),
		/* @__PURE__ */ jsx(FAQPreview, {}),
		/* @__PURE__ */ jsx(CTASection, { navigate })
	] });
}
function DossierSnapshot() {
	const reducedMotion = useReducedMotion$1();
	return /* @__PURE__ */ jsx("section", {
		className: "dossier-snapshot",
		"aria-label": "Project dossier control points",
		children: [
			["Materials", "Installed material references, finish samples, furniture direction"],
			["Drawings", "Asina requests plans and specs by email after the first review"],
			["Approval", "Mockup confirms dimensions, color, finish, and details"],
			["Shipment", "Packing and responsibility checked before release"]
		].map(([label, copy], index) => /* @__PURE__ */ jsxs(motion$1.div, {
			initial: reducedMotion ? {
				opacity: 1,
				y: 0,
				clipPath: "inset(0 0 0% 0)"
			} : {
				opacity: 1,
				y: 14,
				clipPath: "inset(0 0 0% 0)"
			},
			whileInView: {
				opacity: 1,
				y: 0,
				clipPath: "inset(0 0 0% 0)"
			},
			viewport: {
				once: true,
				amount: .42
			},
			transition: {
				duration: reducedMotion ? 0 : .34,
				delay: reducedMotion ? 0 : index * .055,
				ease: motionEase
			},
			children: [
				/* @__PURE__ */ jsx(motion$1.i, {
					className: "dossier-progress-mark",
					initial: reducedMotion ? { scaleX: 1 } : { scaleX: 0 },
					whileInView: { scaleX: 1 },
					viewport: {
						once: true,
						amount: .42
					},
					transition: {
						duration: reducedMotion ? 0 : .36,
						delay: reducedMotion ? 0 : .1 + index * .055,
						ease: motionEase
					}
				}),
				/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
				/* @__PURE__ */ jsx("strong", { children: label }),
				/* @__PURE__ */ jsx("p", { children: copy })
			]
		}, label))
	});
}
function Hero({ navigate }) {
	const reducedMotion = useReducedMotion$1();
	return /* @__PURE__ */ jsxs("section", {
		className: "hero-section",
		children: [/* @__PURE__ */ jsx("div", {
			className: "hero-copy",
			children: /* @__PURE__ */ jsxs(Reveal, { children: [
				/* @__PURE__ */ jsx("p", {
					className: "hero-label",
					children: "Asina Global LLC"
				}),
				/* @__PURE__ */ jsx("h1", { children: "Wholesale Cabinets, Countertops & Furniture — Longwood, FL" }),
				/* @__PURE__ */ jsx("p", {
					className: "hero-lede",
					children: "Import pricing without the usual mistakes. Asina Global LLC supplies cabinets, countertops, and custom furniture packages with drawing review, mockup approval, production QA, packing checks, and shipping coordination."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "local-trust-badge",
					"aria-label": "Asina Global LLC is local to Central Florida in Longwood",
					children: [/* @__PURE__ */ jsx(MapPin$1, {
						size: 16,
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("span", { children: "Local to Central Florida? We're in Longwood." })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "button-row",
					children: [/* @__PURE__ */ jsxs(RouteLink, {
						page: "review",
						navigate,
						className: "button primary cta",
						children: ["Start Project Review ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 18 })]
					}), /* @__PURE__ */ jsx(RouteLink, {
						page: "process",
						navigate,
						className: "button secondary",
						children: "See The Process"
					})]
				})
			] })
		}), /* @__PURE__ */ jsxs(motion$1.div, {
			className: "handoff-desk",
			initial: false,
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: reducedMotion ? 0 : .62,
				ease: motionEase
			},
			"aria-label": "Material handoff dossier",
			children: [
				/* @__PURE__ */ jsx(motion$1.span, {
					className: "desk-scan-rule",
					"aria-hidden": "true",
					initial: reducedMotion ? {
						opacity: 0,
						x: 0
					} : {
						opacity: 0,
						x: "-28%"
					},
					animate: reducedMotion ? {
						opacity: 0,
						x: 0
					} : {
						opacity: [
							0,
							.72,
							0
						],
						x: [
							"-28%",
							"38%",
							"76%"
						]
					},
					transition: {
						duration: reducedMotion ? 0 : 1.15,
						delay: .22,
						ease: motionEase
					}
				}),
				/* @__PURE__ */ jsx("div", {
					className: "desk-environment",
					children: /* @__PURE__ */ jsx(ResponsiveImage, {
						src: heroAssets.environment,
						alt: "Installed stone and cabinetry environment prepared for project supply review",
						loading: "eager",
						fetchPriority: "high",
						sizes: "(max-width: 920px) 94vw, 52vw",
						preferredWidth: 960
					})
				}),
				/* @__PURE__ */ jsxs(motion$1.div, {
					className: "desk-document",
					initial: reducedMotion ? {
						opacity: 1,
						rotate: -1,
						y: 0
					} : {
						opacity: 0,
						rotate: -3,
						y: 12
					},
					animate: {
						opacity: 1,
						rotate: -1,
						y: 0
					},
					transition: {
						duration: reducedMotion ? 0 : .5,
						delay: reducedMotion ? 0 : .28,
						ease: motionEase
					},
					children: [
						/* @__PURE__ */ jsx("span", { children: "Project Supply Review" }),
						/* @__PURE__ */ jsx("strong", { children: "40ft container value" }),
						/* @__PURE__ */ jsx("small", { children: "Drawings requested by email" })
					]
				}),
				/* @__PURE__ */ jsx(motion$1.img, {
					className: "desk-cabinet",
					...responsiveImageAttrs(heroAssets.cabinet, {
						alt: "Cabinet finish sample under review",
						sizes: "(max-width: 920px) 34vw, 220px",
						preferredWidth: 320
					}),
					initial: reducedMotion ? {
						opacity: 1,
						y: 0,
						rotate: 1
					} : {
						opacity: 0,
						y: 18,
						rotate: 2
					},
					animate: {
						opacity: 1,
						y: 0,
						rotate: 1
					},
					transition: {
						duration: reducedMotion ? 0 : .5,
						delay: reducedMotion ? 0 : .38,
						ease: motionEase
					}
				}),
				/* @__PURE__ */ jsx(motion$1.img, {
					className: "desk-furniture",
					...responsiveImageAttrs(heroAssets.furnitureCutout, {
						alt: "Furniture package example with lounge seating",
						sizes: "(max-width: 920px) 30vw, 160px",
						preferredWidth: 240
					}),
					initial: reducedMotion ? {
						opacity: 1,
						y: 0,
						rotate: -2
					} : {
						opacity: 0,
						y: 18,
						rotate: -1
					},
					animate: {
						opacity: 1,
						y: 0,
						rotate: -2
					},
					transition: {
						duration: reducedMotion ? 0 : .5,
						delay: reducedMotion ? 0 : .45,
						ease: motionEase
					}
				}),
				/* @__PURE__ */ jsx(Stamp, {
					label: "Mockup Approved",
					className: "hero-stamp",
					delay: .58
				}),
				/* @__PURE__ */ jsx("div", {
					className: "hero-path-tabs",
					children: [
						["Cabinets", "cabinets"],
						["Countertops", "countertops"],
						["Furniture Packages", "furniture"]
					].map(([label, id]) => /* @__PURE__ */ jsxs(RouteLink, {
						page: id,
						navigate,
						children: [label, /* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })]
					}, id))
				})
			]
		})]
	});
}
function Stamp({ label, className = "", delay = 0 }) {
	const reducedMotion = useReducedMotion$1();
	return /* @__PURE__ */ jsxs(motion$1.span, {
		className: `qa-stamp ${className}`,
		initial: reducedMotion ? {
			opacity: 1,
			scale: 1,
			rotate: 0
		} : {
			opacity: 1,
			scale: .96,
			rotate: -1.5
		},
		whileInView: {
			opacity: 1,
			scale: 1,
			rotate: 0
		},
		viewport: { once: true },
		transition: {
			duration: reducedMotion ? 0 : .2,
			delay: reducedMotion ? 0 : delay,
			ease: motionEase
		},
		children: [
			/* @__PURE__ */ jsx(motion$1.i, {
				className: "qa-stamp-confirmation",
				"aria-hidden": "true",
				initial: reducedMotion ? {
					scaleX: 1,
					opacity: .32
				} : {
					scaleX: 0,
					opacity: 0
				},
				whileInView: reducedMotion ? {
					scaleX: 1,
					opacity: .32
				} : {
					scaleX: [
						0,
						1,
						1
					],
					opacity: [
						0,
						.45,
						.2
					]
				},
				viewport: { once: true },
				transition: {
					duration: reducedMotion ? 0 : .34,
					delay: reducedMotion ? 0 : delay + .06,
					ease: motionEase
				}
			}),
			/* @__PURE__ */ jsx(Check$1, { size: 14 }),
			/* @__PURE__ */ jsx("span", {
				className: "qa-stamp-label",
				children: label
			})
		]
	});
}
function SupplyRouter({ navigate }) {
	const items = [
		{
			id: "countertops",
			label: "Countertops",
			icon: Ruler,
			image: heroAssets.countertopContext,
			fit: "Quartz and surface packages coordinated with cabinets or sourced standalone.",
			send: "Slab name, square footage, edge profile, cutouts, and timeline."
		},
		{
			id: "cabinets",
			label: "Cabinets",
			icon: Box,
			image: heroAssets.cabinetRoom,
			fit: "Repeatable cabinet packages for multi-unit, commercial, and development work.",
			send: "Finish choice, room type, cabinet run, unit count, and timeline."
		},
		{
			id: "furniture",
			label: "Furniture Packages",
			icon: Armchair,
			image: heroAssets.furniture,
			fit: "Custom furniture packages for restaurants, franchises, venues, and rollout buyers.",
			send: "Store count, quantity estimate, brand requirements, floor plan, and timeline."
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "section",
		children: [/* @__PURE__ */ jsx(SectionIntro, {
			eyebrow: "Supply Paths",
			title: "Wholesale cabinets, countertops, and furniture start with the right category.",
			copy: "Each category shows what buyers can inspect and what Asina needs before pricing."
		}), /* @__PURE__ */ jsx("div", {
			className: "supply-router",
			children: items.map((item, index) => {
				const Icon = item.icon;
				return /* @__PURE__ */ jsx(Reveal, {
					className: `supply-panel ${index === 1 ? "featured" : ""}`,
					delay: index * .06,
					children: /* @__PURE__ */ jsxs(RouteLink, {
						page: item.id,
						navigate,
						className: "panel-hit",
						children: [/* @__PURE__ */ jsx(ResponsiveImage, {
							src: item.image,
							alt: `${item.label} material reference`,
							sizes: index === 1 ? "(max-width: 920px) 92vw, 38vw" : "(max-width: 920px) 92vw, 28vw",
							preferredWidth: index === 1 ? 768 : 640
						}), /* @__PURE__ */ jsxs("div", {
							className: "panel-copy",
							children: [
								/* @__PURE__ */ jsx(Icon, { size: 22 }),
								/* @__PURE__ */ jsx("h3", { children: item.label }),
								/* @__PURE__ */ jsx("p", { children: item.fit }),
								/* @__PURE__ */ jsxs("dl", { children: [/* @__PURE__ */ jsx("dt", { children: "What to send" }), /* @__PURE__ */ jsx("dd", { children: item.send })] }),
								/* @__PURE__ */ jsxs("span", { children: [
									"Open ",
									item.label,
									" ",
									/* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })
								] })
							]
						})]
					})
				}, item.id);
			})
		})]
	});
}
function BuyerPathTeaser({ navigate }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "section buyer-path-teaser",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "buyer-path-teaser-copy",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "section-label",
					children: "Buyer Paths"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Find the right cabinet, countertop, or furniture starting point." }),
				/* @__PURE__ */ jsx("p", { children: "Buyers who need a specific route can open the full directory for product categories, commercial use cases, RFQ preparation, QA, shipping, and collection detail." }),
				/* @__PURE__ */ jsxs(RouteLink, {
					page: "buyer-paths",
					navigate,
					className: "button secondary",
					children: ["Open Buyer Paths ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 18 })]
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "buyer-path-teaser-lanes",
			"aria-label": "Buyer path summary lanes",
			children: [
				{
					label: "Product lane",
					copy: "Cabinets, countertops, and furniture packages each keep their own quote inputs.",
					pages: [
						"cabinets",
						"countertops",
						"furniture"
					],
					Icon: PackageCheck$1
				},
				{
					label: "Commercial lane",
					copy: "Mixed-scope, multifamily, hospitality, restaurant, and Florida-to-nationwide paths are grouped by buyer intent.",
					pages: [
						"commercial-mixed",
						"multifamily-supply",
						"hospitality-ffe"
					],
					Icon: FileText$1
				},
				{
					label: "Planning lane",
					copy: "RFQ, landed cost, QA, lead time, and shipping questions live in one organized index.",
					pages: [
						"rfq",
						"importer-resources",
						"qa"
					],
					Icon: ShieldCheck
				}
			].map(({ label, copy, pages: lanePages, Icon }, index) => /* @__PURE__ */ jsxs(Reveal, {
				className: "buyer-path-lane",
				delay: index * .055,
				children: [
					/* @__PURE__ */ jsx(Icon, { size: 20 }),
					/* @__PURE__ */ jsx("strong", { children: label }),
					/* @__PURE__ */ jsx("p", { children: copy }),
					/* @__PURE__ */ jsx("div", { children: lanePages.map((pageId) => /* @__PURE__ */ jsx(RouteLink, {
						page: pageId,
						navigate,
						children: getPageById(pageId).label
					}, pageId)) })
				]
			}, label))
		})]
	});
}
function CommercialPathways({ navigate }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "section commercial-pathways",
		children: [/* @__PURE__ */ jsx(SectionIntro, {
			eyebrow: "Commercial Buyer Paths",
			title: "Focused paths for project-scale buyers.",
			copy: "Each path keeps the conversation focused on scope, quantity, approval, QA, and the details Asina needs before pricing."
		}), /* @__PURE__ */ jsx("div", {
			className: "pathway-ledger",
			children: buyerPathEntries.map(({ page, label, copy, meta, Icon }, index) => /* @__PURE__ */ jsx(Reveal, {
				className: "pathway-row",
				delay: index * .045,
				children: /* @__PURE__ */ jsxs(RouteLink, {
					page,
					navigate,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsx(Icon, { size: 20 }),
						/* @__PURE__ */ jsx("strong", { children: label }),
						/* @__PURE__ */ jsx("p", { children: copy }),
						/* @__PURE__ */ jsx("em", { children: meta }),
						/* @__PURE__ */ jsx(ArrowRight$1, { size: 17 })
					]
				})
			}, page))
		})]
	});
}
function BuyerPathsPage({ navigate }) {
	const [openPathGroups, setOpenPathGroups] = useState$1([0]);
	const handlePathGroupToggle = (groupIndex, isOpen) => {
		setOpenPathGroups((current) => {
			if (isOpen) return current.includes(groupIndex) ? current : [...current, groupIndex].sort((a, b) => a - b);
			return current.filter((index) => index !== groupIndex);
		});
	};
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "buyer-paths",
		eyebrow: "Buyer Paths",
		title: "Find the right project supply route before the quote starts.",
		copy: "Use this directory to choose the right route for product pages, commercial use cases, RFQ preparation, QA, shipping, and collection detail before project review starts.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "section buyer-path-index",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "buyer-path-index-card",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Route Index"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Choose the path by what the project needs first." }),
						/* @__PURE__ */ jsx("p", { children: "Some buyers start with a product category. Others need commercial intent, quote preparation, or shipping responsibility clarified before pricing. This page keeps those paths separate so each project can move into review with clearer context." }),
						/* @__PURE__ */ jsxs("p", { children: [
							"Buyers comparing local sourcing can also see",
							" ",
							/* @__PURE__ */ jsx(RouteLink, {
								page: "supplier-guide",
								navigate,
								className: "copy-link",
								children: "how Asina compares to local suppliers"
							}),
							" ",
							"before choosing a product or planning route."
						] })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "buyer-path-index-steps",
					"aria-label": "Buyer path routing steps",
					children: [[
						"Product",
						"Use case",
						"Planning",
						"Review"
					].map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "buyer-path-index-step",
						delay: index * .05,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: item }),
							/* @__PURE__ */ jsx("p", { children: [
								"Start with cabinets, countertops, or furniture when the category is clear.",
								"Use commercial paths when scope, location, or repeat type is the real search intent.",
								"Open planning guides when cost picture, QA, lead time, or shipping needs context.",
								"Send project basics once the route is clear. Drawings move by email after the fit review."
							][index] })
						]
					}, item)), /* @__PURE__ */ jsxs(Reveal, {
						className: "buyer-path-index-handoff",
						delay: .24,
						children: [
							/* @__PURE__ */ jsx("span", { children: "Next step" }),
							/* @__PURE__ */ jsx("strong", { children: "Start with project basics." }),
							/* @__PURE__ */ jsx("p", { children: "Drawings and specs move by email after Asina checks whether the project is a fit." }),
							/* @__PURE__ */ jsxs(RouteLink, {
								page: "review",
								navigate,
								children: ["Start Project Review ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(CommercialPathways, { navigate }),
			/* @__PURE__ */ jsxs("section", {
				className: "section buyer-path-directory",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Full Directory",
					title: "All buyer routes, grouped for faster scanning.",
					copy: "Use the group that matches the buyer's first decision. Every link stays available to search engines and project teams."
				}), /* @__PURE__ */ jsx("div", {
					className: "buyer-path-directory-grid",
					children: buyerPathGroups.map((group, groupIndex) => /* @__PURE__ */ jsx(Reveal, {
						className: "buyer-path-group",
						delay: groupIndex * .05,
						children: /* @__PURE__ */ jsxs("details", {
							open: openPathGroups.includes(groupIndex),
							onToggle: (event) => handlePathGroupToggle(groupIndex, event.currentTarget.open),
							children: [
								/* @__PURE__ */ jsxs("summary", { children: [
									/* @__PURE__ */ jsx("span", { children: String(groupIndex + 1).padStart(2, "0") }),
									/* @__PURE__ */ jsx("strong", { children: group.title }),
									/* @__PURE__ */ jsxs("small", { children: [group.links.length, " paths"] })
								] }),
								/* @__PURE__ */ jsx("p", { children: group.copy }),
								/* @__PURE__ */ jsx("div", { children: group.links.map((pageId) => /* @__PURE__ */ jsxs(RouteLink, {
									page: pageId,
									navigate,
									children: [getPageById(pageId).label, /* @__PURE__ */ jsx(ArrowRight$1, { size: 15 })]
								}, pageId)) })
							]
						})
					}, group.title))
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Buyer Paths FAQ",
				items: [
					["Which path should I start with?", "Start with the product page if the category is clear. Use the commercial path page when project type, repeat scope, or location is the main need."],
					["Does this replace the project review form?", "No. This page organizes the routes. The project review form is still the first step when you are ready to send basics."],
					["Can one project include multiple routes?", "Yes. One coordinated review can connect cabinets, countertops, furniture packages, RFQ preparation, QA, and shipping when that makes the scope clearer."],
					["When do drawings move?", "Asina requests drawings, specs, plans, brand standards, and furniture files by email after checking the project basics."]
				]
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function ProcessPreview({ navigate }) {
	const [active, setActive] = useState$1(0);
	const scrollerRef = useRef$1(null);
	const reducedMotion = useReducedMotion$1();
	const { scrollYProgress } = useScroll({
		target: scrollerRef,
		offset: ["start end", "end start"]
	});
	const progressScale = useTransform(scrollYProgress, [.08, .92], [.08, 1]);
	const packetLift = useTransform(scrollYProgress, [0, 1], ["18px", "-18px"]);
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		setActive(Math.min(processSteps.length - 1, Math.max(0, Math.floor(latest * processSteps.length))));
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "production-sequence",
		ref: scrollerRef,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "sequence-copy",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "ledger-caption",
						children: "Drawing To Production"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Project drawings become cabinet, countertop, and furniture production plans." }),
					/* @__PURE__ */ jsx("p", { children: "The sequence shows how basics and emailed drawings become supply review, mockup approval, production QA, packing, and shipping responsibility." }),
					/* @__PURE__ */ jsx(RouteLink, {
						page: "process",
						navigate,
						className: "button secondary",
						children: "See Full Process"
					})
				]
			}),
			/* @__PURE__ */ jsxs(motion$1.div, {
				className: "packet-stage",
				style: { y: reducedMotion ? 0 : packetLift },
				children: [/* @__PURE__ */ jsx(motion$1.div, {
					className: "stage-progress",
					style: { scaleY: reducedMotion ? 1 : progressScale }
				}), /* @__PURE__ */ jsx(DossierPacketVisual, { active })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sequence-rail",
				"aria-label": "Production dossier stages",
				children: processSteps.map((step, index) => /* @__PURE__ */ jsxs(motion$1.button, {
					type: "button",
					className: active === index ? "active" : "",
					"aria-current": active === index ? "step" : void 0,
					onMouseEnter: () => setActive(index),
					onFocus: () => setActive(index),
					onClick: () => setActive(index),
					whileTap: reducedMotion ? void 0 : { scale: .985 },
					transition: {
						duration: reducedMotion ? 0 : .18,
						ease: motionEase
					},
					children: [
						active === index && /* @__PURE__ */ jsx(motion$1.span, {
							className: "tracker-indicator",
							layoutId: "production-sequence-tracker",
							transition: {
								duration: reducedMotion ? 0 : .24,
								ease: motionEase
							}
						}),
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsx("strong", { children: step.short }),
						/* @__PURE__ */ jsx("small", { children: processCues[index].tag })
					]
				}, step.title))
			})
		]
	});
}
function DossierPacketVisual({ active, headingLevel = "h3" }) {
	const reducedMotion = useReducedMotion$1();
	const step = processSteps[active];
	const cue = processCues[active];
	const HeadingTag = headingLevel === "h2" ? "h2" : "h3";
	const artifacts = [
		["Buyer input", step.input],
		["Asina review", step.review],
		["Output", step.output],
		["Risk reduced", step.risk]
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "packet-visual",
		"aria-label": `${step.title} dossier packet`,
		children: [/* @__PURE__ */ jsx(AnimatePresence$1, {
			mode: "wait",
			children: /* @__PURE__ */ jsxs(motion$1.div, {
				className: "packet-document",
				initial: reducedMotion ? { opacity: 1 } : {
					opacity: 0,
					y: 12,
					rotate: -.5,
					clipPath: "inset(0 0 7% 0)"
				},
				animate: {
					opacity: 1,
					y: 0,
					rotate: 0,
					clipPath: "inset(0 0 0% 0)"
				},
				exit: reducedMotion ? { opacity: 1 } : {
					opacity: 0,
					y: -8,
					rotate: .5,
					clipPath: "inset(6% 0 0 0)"
				},
				transition: {
					duration: reducedMotion ? 0 : .26,
					ease: motionEase
				},
				children: [
					/* @__PURE__ */ jsx(motion$1.span, {
						className: "packet-reveal-scan",
						"aria-hidden": "true",
						initial: reducedMotion ? {
							opacity: 0,
							x: 0
						} : {
							opacity: 0,
							x: "-32%"
						},
						animate: reducedMotion ? {
							opacity: 0,
							x: 0
						} : {
							opacity: [
								0,
								.38,
								0
							],
							x: [
								"-32%",
								"35%",
								"82%"
							]
						},
						transition: {
							duration: reducedMotion ? 0 : .54,
							delay: reducedMotion ? 0 : .06,
							ease: motionEase
						}
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "packet-header",
						children: [/* @__PURE__ */ jsx("span", { children: String(active + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: cue.visual
						}), /* @__PURE__ */ jsx(HeadingTag, { children: step.title })] })]
					}),
					/* @__PURE__ */ jsxs(motion$1.div, {
						className: "packet-seal",
						initial: reducedMotion ? {
							opacity: 1,
							y: 0,
							scale: 1
						} : {
							opacity: 0,
							y: 6,
							scale: .98
						},
						animate: {
							opacity: 1,
							y: 0,
							scale: 1
						},
						transition: {
							duration: reducedMotion ? 0 : .18,
							delay: reducedMotion ? 0 : .08,
							ease: motionEase
						},
						children: [/* @__PURE__ */ jsx(Check$1, { size: 14 }), /* @__PURE__ */ jsx("span", { children: cue.cue })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "artifact-grid",
						children: artifacts.map(([label, copy], index) => /* @__PURE__ */ jsxs(motion$1.dl, {
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: reducedMotion ? 0 : .18,
								delay: reducedMotion ? 0 : index * .04,
								ease: motionEase
							},
							children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: copy })]
						}, label))
					}),
					/* @__PURE__ */ jsxs(motion$1.div, {
						className: "packet-next",
						initial: reducedMotion ? { opacity: 1 } : {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: reducedMotion ? 0 : .2,
							delay: reducedMotion ? 0 : .12,
							ease: motionEase
						},
						children: [/* @__PURE__ */ jsx("strong", { children: "Next handoff" }), /* @__PURE__ */ jsx("span", { children: step.next })]
					})
				]
			}, step.title)
		}), /* @__PURE__ */ jsx("div", {
			className: "packet-backdrop",
			"aria-hidden": "true",
			children: [
				"Drawings",
				"Mockup",
				"QA",
				"Shipping"
			].map((label, index) => /* @__PURE__ */ jsx(motion$1.span, {
				animate: reducedMotion ? {
					opacity: 1,
					y: 0
				} : {
					opacity: index <= active ? 1 : .72,
					y: index === active ? -3 : 0
				},
				transition: {
					duration: reducedMotion ? 0 : .22,
					ease: motionEase
				},
				children: label
			}, label))
		})]
	});
}
function QAProofBand({ navigate }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "qa-band",
		children: [/* @__PURE__ */ jsx("div", {
			className: "qa-band-media",
			children: /* @__PURE__ */ jsx(ResponsiveImage, {
				src: heroAssets.materialContext,
				alt: "Installed stone surface reviewed for material and finish consistency",
				sizes: "(max-width: 920px) 92vw, 52vw",
				preferredWidth: 960
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "qa-band-copy",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "proof-label proof-label-light",
					children: "QA Proof"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Import pricing needs cabinet and countertop QA before shipping." }),
				/* @__PURE__ */ jsx("p", { children: "Many import problems happen before goods ship. Asina reduces that risk through drawing review, mockup confirmation, production QA, finish checks, and packing review." }),
				/* @__PURE__ */ jsx("div", {
					className: "stamp-row",
					children: qaStages.map((stage, index) => /* @__PURE__ */ jsx(Stamp, {
						label: stage,
						delay: index * .06
					}, stage))
				}),
				/* @__PURE__ */ jsx(RouteLink, {
					page: "qa",
					navigate,
					className: "button dark-secondary",
					children: "Review QA + Shipping"
				})
			]
		})]
	});
}
function EconomicsShipping({ navigate }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "section economics",
		children: [/* @__PURE__ */ jsxs(Reveal, {
			className: "economics-panel main",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "ledger-caption",
					children: "Wholesale Economics"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Wholesale cabinet value usually starts at container scale." }),
				/* @__PURE__ */ jsx("p", { children: "A 40ft container load usually gives builders and developers the best cost advantage. Asina can discuss smaller trial runs when they point to future wholesale or repeat-project volume." }),
				/* @__PURE__ */ jsx("p", { children: "Cabinet orders typically move in 20-foot or 40-foot containers. A 40HC container can typically fit about 700 to 800 cabinet boxes; a 20-foot container can typically fit about 370 boxes, depending on the final mix." })
			]
		}), /* @__PURE__ */ jsxs(Reveal, {
			className: "economics-panel",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "ledger-caption",
					children: "Shipping Responsibility"
				}),
				/* @__PURE__ */ jsx("h3", { children: "Asina reviews shipping options during consultation." }),
				/* @__PURE__ */ jsx("p", { children: "Asina can provide freight quotes based on destination, responsibility level, delivery needs, and applicable Incoterms® 2020 terms where agreed. Final responsibility, risk, cost, and delivery terms follow the agreed project quote." }),
				/* @__PURE__ */ jsx("p", { children: "Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast." }),
				/* @__PURE__ */ jsx(RouteLink, {
					page: "review",
					navigate,
					className: "button secondary",
					children: "Start Project Review"
				})
			]
		})]
	});
}
function SourceProtectionPanel({ navigate }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "source-protection-panel",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("p", {
				className: "ledger-caption",
				children: "Source Protection + Accountability"
			}),
			/* @__PURE__ */ jsx("h2", { children: "Cabinet, countertop, and furniture buyers see the review path." }),
			/* @__PURE__ */ jsx("p", { children: "Asina is the supplier of record. Buyers see the review, QA, packing, and shipping process while private production sources stay protected." }),
			/* @__PURE__ */ jsx(RouteLink, {
				page: "qa",
				navigate,
				className: "button secondary",
				children: "Review QA + Shipping"
			})
		] }), /* @__PURE__ */ jsx("div", {
			className: "trust-grid",
			children: [
				["Supplier Of Record", "Asina manages pricing, communication, QA, and project accountability."],
				["No Source Disclosure", "Private production sources and supplier relationships stay protected."],
				["Private File Follow-Up", "Asina requests drawings and specs by email only after the initial project review."],
				["Shipping Reviewed", "Freight quote coordination and responsibility level are discussed before release."]
			].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
				className: "trust-tile",
				delay: index * .04,
				children: [
					/* @__PURE__ */ jsx(ShieldCheck, { size: 19 }),
					/* @__PURE__ */ jsx("strong", { children: title }),
					/* @__PURE__ */ jsx("span", { children: copy })
				]
			}, title))
		})]
	});
}
function FAQPreview() {
	return /* @__PURE__ */ jsxs("section", {
		className: "section faq-preview",
		children: [/* @__PURE__ */ jsx(SectionIntro, {
			eyebrow: "Buyer Questions",
			title: "Answers before you send project basics.",
			copy: "Pricing, minimums, drawings, source protection, shipping, and QA all affect the buying decision."
		}), /* @__PURE__ */ jsx("div", {
			className: "faq-grid",
			children: faqs.map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
				className: "faq-item",
				delay: index * .04,
				children: [/* @__PURE__ */ jsx("h3", { children: item.q }), /* @__PURE__ */ jsx("p", { children: item.a })]
			}, item.q))
		})]
	});
}
//#endregion
//#region src/pages/cabinetPages.jsx
var cabinetCollectionPageByKey = Object.fromEntries(Object.entries(cabinetCollectionRouteMap).map(([pageId, key]) => [key, pageId]));
function CabinetsPage({ navigate }) {
	const collections = cabinets_default.collections;
	const [collectionKey, setCollectionKey] = useState$1(collections[0].key);
	const [mode, setMode] = useState$1("visual");
	const [finishIndex, setFinishIndex] = useState$1(0);
	const [detailOpen, setDetailOpen] = useState$1(false);
	const reducedMotion = useReducedMotion$1();
	const active = collections.find((collection) => collection.key === collectionKey) ?? collections[0];
	const finish = active.finishes[finishIndex] ?? active.finishes[0];
	useEffect$1(() => {
		setFinishIndex(0);
	}, [collectionKey]);
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "cabinets",
		eyebrow: "Wholesale Cabinets",
		title: "Cabinet packages prepared for pricing.",
		copy: "Compare collections, inspect finishes, and keep construction facts close to the pricing request.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "collection-hero",
				children: [/* @__PURE__ */ jsx("div", {
					className: "file-tabs",
					role: "radiogroup",
					"aria-label": "Cabinet collections",
					children: collections.map((collection, index) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						role: "radio",
						"aria-checked": collection.key === collectionKey,
						tabIndex: collection.key === collectionKey ? 0 : -1,
						"data-roving-option": true,
						className: collection.key === collectionKey ? "active" : "",
						onClick: () => setCollectionKey(collection.key),
						onKeyDown: (event) => handleRovingOptionKeyDown(event, collections.length, index, (nextIndex) => setCollectionKey(collections[nextIndex].key)),
						children: [collection.key === collectionKey && /* @__PURE__ */ jsx(motion$1.span, {
							layoutId: "cabinet-tab",
							className: "tab-pill"
						}), /* @__PURE__ */ jsx("span", { children: collection.name })]
					}, collection.key))
				}), /* @__PURE__ */ jsxs("div", {
					className: "collection-summary",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: active.hero.image,
						alt: `${active.name} cabinet collection`,
						loading: "eager",
						sizes: "(max-width: 920px) 92vw, 52vw",
						preferredWidth: 960
					}), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("p", {
							className: "spec-caption",
							children: [
								active.line,
								" / ",
								active.panel_thickness
							]
						}),
						/* @__PURE__ */ jsx("h2", { children: active.hero.headline }),
						/* @__PURE__ */ jsx("p", { children: active.hero.body }),
						/* @__PURE__ */ jsxs("div", {
							className: "fact-strip",
							children: [
								/* @__PURE__ */ jsx("span", { children: active.panel_thickness }),
								/* @__PURE__ */ jsx("span", { children: active.style_family }),
								/* @__PURE__ */ jsxs("span", { children: [active.finishes.length, " finishes"] })
							]
						})
					] })]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section cabinet-collection-directory",
				"aria-label": "Cabinet collection pages",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Cabinet Collection Pages",
					title: "Open each cabinet collection before pricing.",
					copy: "Use these collection pages to review finish families, construction facts, and quote inputs before starting a cabinet package review."
				}), /* @__PURE__ */ jsx("div", {
					className: "cabinet-collection-directory-grid",
					children: collections.map((collection, index) => /* @__PURE__ */ jsx(Reveal, {
						className: "cabinet-collection-directory-card",
						delay: index * .025,
						children: /* @__PURE__ */ jsxs(RouteLink, {
							page: cabinetCollectionPageByKey[collection.key],
							navigate,
							children: [
								/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
								/* @__PURE__ */ jsxs("strong", { children: [collection.name, " cabinet collection"] }),
								/* @__PURE__ */ jsx("p", { children: collection.hero.headline }),
								/* @__PURE__ */ jsxs("em", { children: [
									collection.panel_thickness,
									" / ",
									collection.finishes.length,
									" finishes"
								] }),
								/* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })
							]
						})
					}, collection.key))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "inspection-panel",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "panel-topline",
						children: [/* @__PURE__ */ jsxs("h2", { children: [active.name, " Review"] }), /* @__PURE__ */ jsxs("div", {
							className: "panel-actions",
							children: [/* @__PURE__ */ jsxs("button", {
								className: "button secondary compact cabinet-detail-trigger",
								type: "button",
								onClick: () => setDetailOpen(true),
								children: [/* @__PURE__ */ jsx(Maximize2, { size: 15 }), "Details"]
							}), /* @__PURE__ */ jsx(ModeSwitch, {
								mode,
								setMode,
								scope: "cabinets"
							})]
						})]
					}), /* @__PURE__ */ jsx(AnimatePresence$1, {
						mode: "wait",
						children: mode === "visual" ? /* @__PURE__ */ jsxs(motion$1.div, {
							className: "visual-mode",
							id: "cabinets-visual-panel",
							role: "tabpanel",
							"aria-labelledby": "cabinets-visual-tab",
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 10,
								clipPath: "inset(0 0 6% 0)"
							},
							animate: {
								opacity: 1,
								y: 0,
								clipPath: "inset(0 0 0% 0)"
							},
							exit: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: -6
							},
							transition: {
								duration: reducedMotion ? 0 : .22,
								ease: motionEase
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "image-pair",
									children: [/* @__PURE__ */ jsx(motion$1.img, {
										...responsiveImageAttrs(finish.image, {
											alt: `${finish.name} cabinet finish`,
											sizes: "(max-width: 920px) 88vw, 34vw",
											preferredWidth: 768
										}),
										initial: reducedMotion ? { opacity: 1 } : {
											opacity: .78,
											scale: .988
										},
										animate: {
											opacity: 1,
											scale: 1
										},
										transition: {
											duration: reducedMotion ? 0 : .22,
											ease: motionEase
										}
									}, finish.image), /* @__PURE__ */ jsx(motion$1.img, {
										...responsiveImageAttrs(finish.sample_image, {
											alt: `${finish.name} cabinet sample`,
											sizes: "(max-width: 920px) 88vw, 26vw",
											preferredWidth: 960
										}),
										initial: reducedMotion ? { opacity: 1 } : {
											opacity: .78,
											scale: .988
										},
										animate: {
											opacity: 1,
											scale: 1
										},
										transition: {
											duration: reducedMotion ? 0 : .22,
											delay: reducedMotion ? 0 : .04,
											ease: motionEase
										}
									}, finish.sample_image)]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "finish-tabs",
									role: "radiogroup",
									"aria-label": `${active.name} finishes`,
									children: active.finishes.map((item, index) => /* @__PURE__ */ jsxs("button", {
										type: "button",
										role: "radio",
										"aria-checked": finishIndex === index,
										tabIndex: finishIndex === index ? 0 : -1,
										"data-roving-option": true,
										className: finishIndex === index ? "active" : "",
										onClick: () => setFinishIndex(index),
										onKeyDown: (event) => handleRovingOptionKeyDown(event, active.finishes.length, index, setFinishIndex),
										children: [/* @__PURE__ */ jsx("span", {
											className: "swatch",
											style: { background: item.swatches?.[0]?.color }
										}), item.name]
									}, item.name))
								}),
								/* @__PURE__ */ jsx("p", { children: finish.description })
							]
						}, "cabinet-visual") : /* @__PURE__ */ jsx(motion$1.div, {
							className: "spec-mode",
							id: "cabinets-spec-panel",
							role: "tabpanel",
							"aria-labelledby": "cabinets-spec-tab",
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 10,
								clipPath: "inset(0 0 6% 0)"
							},
							animate: {
								opacity: 1,
								y: 0,
								clipPath: "inset(0 0 0% 0)"
							},
							exit: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: -6
							},
							transition: {
								duration: reducedMotion ? 0 : .22,
								ease: motionEase
							},
							children: Object.entries(finish.specs).map(([label, value], index) => /* @__PURE__ */ jsxs(motion$1.dl, {
								initial: reducedMotion ? { opacity: 1 } : {
									opacity: 0,
									y: 6
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: reducedMotion ? 0 : .16,
									delay: reducedMotion ? 0 : index * .035,
									ease: motionEase
								},
								children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: value })]
							}, label))
						}, "cabinet-spec")
					})]
				}), /* @__PURE__ */ jsx(WhatToSend, {
					title: "What to send for cabinet pricing",
					items: [
						"Finish choice",
						"Room type",
						"Cabinet run",
						"Unit count",
						"Timeline"
					],
					note: active.details.find((detail) => detail.label === "What to send")?.value,
					navigate
				})]
			}),
			/* @__PURE__ */ jsx(CabinetDetailOverlay, {
				collection: detailOpen ? active : null,
				finish,
				onClose: () => setDetailOpen(false)
			}),
			/* @__PURE__ */ jsx(CollectionComparison, { collections }),
			/* @__PURE__ */ jsx(CabinetMaterialGuide, {}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Cabinet FAQ",
				items: [
					["What drawings are needed?", "Cabinet runs, room plans, vanity needs, finish direction, unit count, and timeline help start review."],
					["Which collections are available?", "Malibu, Monterey, Newport, Catalina, Laguna, and Jersey are available for cabinet project review."],
					["Which panel platforms are available?", "Framed collections use the published 5/8-inch premium plywood panels. Frameless collections use the published 3/4-inch premium plywood panels where shown in the collection facts."],
					["How much fits in a cabinet container?", "A 40HC container typically fits about 700 to 800 cabinet boxes. A 20-foot container typically fits about 370 boxes. Final capacity depends on the mix of sizes and product types."],
					["How long does cabinet shipping take?", "Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast. Orders usually move in 20-foot or 40-foot containers."],
					["How are finishes confirmed?", "Asina reviews finish direction before mockup or sample approval, then checks production against the approved reference."],
					["What does mockup approval cover?", "Mockup approval confirms measurements, color, finish, materials, and details before repeat production."],
					["What should buyers send for pricing?", "Send finish choice, room type, cabinet run, unit count, timeline, and any vanity, pantry, wall, base, or tall-unit requirements."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "cabinets",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function CabinetDetailOverlay({ collection, finish, onClose }) {
	const reducedMotion = useReducedMotion$1();
	const panelRef = useRef$1(null);
	const closeButtonRef = useRef$1(null);
	useEffect$1(() => {
		if (!collection) return void 0;
		const previousOverflow = document.body.style.overflow;
		const previousFocus = document.activeElement;
		const restoreAppRoot = isolateAppRoot();
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose();
				return;
			}
			if (event.key !== "Tab" || !panelRef.current) return;
			const focusable = panelRef.current.querySelectorAll("a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex=\"-1\"])");
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);
		requestAnimationFrame(() => closeButtonRef.current?.focus());
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
			restoreAppRoot();
			if (previousFocus instanceof HTMLElement) previousFocus.focus();
		};
	}, [collection, onClose]);
	const media = collection && finish ? [[
		`${finish.name} finish`,
		finish.image,
		`${finish.name} cabinet finish full view`
	], [
		`${finish.name} sample`,
		finish.sample_image,
		`${finish.name} cabinet sample full view`
	]].filter(([, src]) => Boolean(src)) : [];
	const faceMaterial = finish?.specs?.Faces ?? finish?.specs?.Wood ?? finish?.specs?.Color ?? finish?.specs?.Colors;
	const overviewRows = collection && finish ? [
		["Collection", collection.name],
		["Line", collection.line],
		["Panel platform", collection.panel_thickness],
		["Style", collection.style_family],
		["Face Material", faceMaterial ?? "Reviewed during project supply review."],
		["Selected finish", finish.name],
		["Finish family", finish.family]
	] : [];
	const detailSections = collection && finish ? [
		["Finish specs", Object.entries(finish.specs)],
		["Collection facts", collection.facts.map((fact) => [fact.label, fact.value])],
		["Project details", collection.details.map((detail) => [detail.label, detail.value])]
	] : [];
	const overlay = /* @__PURE__ */ jsx(AnimatePresence$1, { children: collection && finish && /* @__PURE__ */ jsx(motion$1.div, {
		className: "cabinet-detail-backdrop",
		onClick: onClose,
		initial: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		animate: { opacity: 1 },
		exit: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		transition: {
			duration: reducedMotion ? 0 : .2,
			ease: motionEase
		},
		children: /* @__PURE__ */ jsxs(motion$1.div, {
			ref: panelRef,
			className: "cabinet-detail-panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "cabinet-detail-title",
			onClick: (event) => event.stopPropagation(),
			initial: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 14,
				scale: .985
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 8,
				scale: .985
			},
			transition: {
				duration: reducedMotion ? 0 : .24,
				ease: motionEase
			},
			children: [
				/* @__PURE__ */ jsx("button", {
					ref: closeButtonRef,
					className: "zoom-close",
					type: "button",
					onClick: onClose,
					"aria-label": "Close cabinet details",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				}),
				/* @__PURE__ */ jsx("div", {
					className: "cabinet-detail-media",
					children: media.map(([label, src, alt], index) => /* @__PURE__ */ jsxs("figure", {
						className: index === 0 ? "primary" : "",
						children: [/* @__PURE__ */ jsx(ResponsiveImage, {
							src,
							alt,
							sizes: index === 0 ? "(max-width: 920px) 92vw, 46vw" : "(max-width: 920px) 46vw, 20vw",
							preferredWidth: index === 0 ? 960 : 480
						}), /* @__PURE__ */ jsx("figcaption", { children: label })]
					}, label))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "cabinet-detail-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "dialog-label",
							children: "Cabinet Details"
						}),
						/* @__PURE__ */ jsxs("h2", {
							id: "cabinet-detail-title",
							children: [
								collection.name,
								" / ",
								finish.name
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "cabinet-detail-table",
							children: [/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", { children: "Overview" }), overviewRows.map(([label, value]) => /* @__PURE__ */ jsxs("dl", { children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: value })] }, label))] }), detailSections.map(([title, rows]) => /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", { children: title }), rows.map(([label, value]) => /* @__PURE__ */ jsxs("dl", { children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: value })] }, `${title}-${label}`))] }, title))]
						})
					]
				})
			]
		})
	}) });
	if (typeof document === "undefined") return overlay;
	return createPortal(overlay, document.body);
}
function CabinetMaterialGuide() {
	return /* @__PURE__ */ jsxs("section", {
		className: "material-guide",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "ledger-caption",
				children: "Cabinet Material Guide"
			}), /* @__PURE__ */ jsx("h2", { children: "A native guide for the details builders usually ask about first." })] }),
			/* @__PURE__ */ jsx("div", {
				className: "guide-lanes",
				children: [
					[
						"Painted Shaker",
						"Malibu and Jersey",
						"Painted faces for cleaner cabinet runs."
					],
					[
						"Stained Wood",
						"Monterey",
						"Warmer wood tone for commercial rooms and richer interiors."
					],
					[
						"Modern Surfaces",
						"Newport, Catalina, Laguna",
						"Frameless directions with melamine, high gloss, and soft-touch finishes."
					]
				].map(([title, meta, copy]) => /* @__PURE__ */ jsxs(Reveal, {
					className: "guide-lane",
					children: [
						/* @__PURE__ */ jsx("h3", { children: title }),
						/* @__PURE__ */ jsx("strong", { children: meta }),
						/* @__PURE__ */ jsx("p", { children: copy })
					]
				}, title))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "cabinet-cutaway",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "cutaway-drawing",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "cutaway-face",
							children: "Face"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "cutaway-box",
							children: "Box"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "cutaway-shelf",
							children: "Shelf / back"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "cutaway-drawer",
							children: "Drawer"
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "anatomy-panel",
					children: [
						["Door / face", "Face material changes by collection: hardwood, walnut, melamine on MDF, lacquer-finished MDF, soft-touch MDF, or painted HDF."],
						["Cabinet box", "Framed collections use 5/8-inch premium plywood panels. Frameless collections use 3/4-inch premium plywood panels where published."],
						["Shelf / back panel", "Shelf, back, frame, overlay, and interior details stay with the selected collection before quote review."],
						["Drawer + hardware", "Asina confirms tracks, hinges, drawer boxes, vanity ranges, and softclose details with the selected finish and mockup path."]
					].map(([item, copy]) => /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("span", {}),
						/* @__PURE__ */ jsx("strong", { children: item }),
						/* @__PURE__ */ jsx("p", { children: copy })
					] }, item))
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/countertopPages.jsx
var countertopCollectionPageByKey = Object.fromEntries(Object.entries(countertopCollectionRouteMap).map(([pageId, key]) => [key, pageId]));
function CountertopsPage({ navigate }) {
	const collections = countertops_default.collections;
	const [collectionKey, setCollectionKey] = useState$1(collections[0].key);
	const [selectedCode, setSelectedCode] = useState$1(collections[0].slabs[0].code);
	const [slabSearch, setSlabSearch] = useState$1("");
	const [mode, setMode] = useState$1("visual");
	const [zoomSlab, setZoomSlab] = useState$1(null);
	const reducedMotion = useReducedMotion$1();
	const active = collections.find((collection) => collection.key === collectionKey) ?? collections[0];
	const selected = active.slabs.find((slab) => slab.code === selectedCode) ?? active.slabs[0];
	const signatureCollection = collections.find((collection) => collection.slabs.some((slab) => slab.code === "9114")) ?? active;
	const signatureSlab = signatureCollection.slabs.find((slab) => slab.code === "9114") ?? selected;
	const slabPreviewLimit = 12;
	const previewSlabs = active.slabs.slice(0, slabPreviewLimit);
	const visibleSlabs = previewSlabs.some((slab) => slab.code === selected.code) ? previewSlabs : [selected, ...previewSlabs.slice(0, slabPreviewLimit - 1)];
	const allSlabDossiers = collections.flatMap((collection) => collection.slabs.map((slab) => ({
		collection,
		slab
	})));
	const slabSearchTerm = slabSearch.trim().toLowerCase();
	const slabSearchMatches = slabSearchTerm ? allSlabDossiers.filter(({ slab }) => slab.code.toLowerCase().includes(slabSearchTerm) || slab.name.toLowerCase().includes(slabSearchTerm)).slice(0, 6) : [];
	const scrollToSlabInspector = () => {
		if (typeof document === "undefined") return;
		requestAnimationFrame(() => {
			document.getElementById("countertop-slab-inspector")?.scrollIntoView({
				behavior: reducedMotion ? "auto" : "smooth",
				block: "start"
			});
		});
	};
	const selectCollection = (collection) => {
		setCollectionKey(collection.key);
		setSelectedCode(collection.slabs[0].code);
	};
	const selectSlabDossier = (slab, collection = active) => {
		setCollectionKey(collection.key);
		setSelectedCode(slab.code);
	};
	const openSlabZoom = (slab, collection = active) => {
		selectSlabDossier(slab, collection);
		setZoomSlab({
			...slab,
			behavior: slab.asset_description ?? collection.behavior,
			collectionLabel: countertopCollectionLabel(collection),
			facts: collection.facts
		});
	};
	const selectSlabCode = (slab, collection = active, shouldScroll = false) => {
		selectSlabDossier(slab, collection);
		setMode("visual");
		if (shouldScroll) scrollToSlabInspector();
	};
	useEffect$1(() => {
		if (!active.slabs.some((slab) => slab.code === selectedCode)) setSelectedCode(active.slabs[0].code);
	}, [active, selectedCode]);
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "countertops",
		eyebrow: "Wholesale Countertops",
		title: "Wholesale Quartz Countertop Supply in Florida",
		copy: "Start with the slab, then keep size, thickness, edge, cutout, and timeline details close by.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "slab-hero",
				children: [/* @__PURE__ */ jsxs(motion$1.button, {
					type: "button",
					className: "slab-showcase-button",
					onClick: () => openSlabZoom(signatureSlab, signatureCollection),
					whileTap: reducedMotion ? void 0 : { scale: .992 },
					"aria-label": `Zoom ${signatureSlab.code} ${signatureSlab.name}`,
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: heroAssets.slab,
						alt: "Calacatta Storm Black slab",
						loading: "eager",
						sizes: "(max-width: 920px) 92vw, 50vw",
						preferredWidth: 960
					}), /* @__PURE__ */ jsx("span", {
						className: "zoom-cue",
						"aria-hidden": "true",
						children: /* @__PURE__ */ jsx(Maximize2, { size: 15 })
					})]
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "inspection-label",
						children: "Signature Slab"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Bold material, clear pricing inputs." }),
					/* @__PURE__ */ jsx("p", { children: "Use the slab catalog for visual inspection, then move directly into size, thickness, edge profile, cutout, and timeline requirements. Project-scale requests can include countertop slab supply, contractor countertop supply, wholesale countertops Florida, quartz slab supplier comparisons, countertop slabs for fabricators, quartz slabs for fabricators, or slab supplier for fabricators needs when the scope fits Asina's review model." }),
					/* @__PURE__ */ jsx("div", {
						className: "chip-row",
						role: "radiogroup",
						"aria-label": "Countertop collection preview",
						children: collections.map((collection, index) => /* @__PURE__ */ jsxs(motion$1.button, {
							type: "button",
							role: "radio",
							"aria-checked": collection.key === collectionKey,
							tabIndex: collection.key === collectionKey ? 0 : -1,
							"data-roving-option": true,
							className: collection.key === collectionKey ? "chip active" : "chip",
							onClick: () => selectCollection(collection),
							onKeyDown: (event) => handleRovingOptionKeyDown(event, collections.length, index, (nextIndex) => selectCollection(collections[nextIndex])),
							whileTap: reducedMotion ? void 0 : { scale: .98 },
							children: [collection.key === collectionKey && /* @__PURE__ */ jsx(motion$1.span, {
								className: "chip-marker",
								layoutId: "countertop-hero-chip",
								transition: {
									duration: reducedMotion ? 0 : .2,
									ease: motionEase
								}
							}), /* @__PURE__ */ jsx("span", { children: countertopCollectionLabel(collection) })]
						}, collection.key))
					})
				] })]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section countertop-collection-directory",
				"aria-label": "Countertop slab and collection pages",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Countertop Collection Pages",
					title: "Open slab codes and countertop collections before quoting.",
					copy: "Use these pages to review slab codes, movement behavior, collection facts, and quote inputs before starting a countertop package review."
				}), /* @__PURE__ */ jsxs("div", {
					className: "countertop-collection-directory-grid",
					children: [/* @__PURE__ */ jsx(Reveal, {
						className: "countertop-collection-directory-card featured",
						delay: 0,
						children: /* @__PURE__ */ jsxs(RouteLink, {
							page: "countertop-quartz-codes",
							navigate,
							children: [
								/* @__PURE__ */ jsx("span", { children: "01" }),
								/* @__PURE__ */ jsx("strong", { children: "Quartz slab visual code gallery" }),
								/* @__PURE__ */ jsx("p", { children: "Review all slab codes in one gallery when a specific surface needs project review." }),
								/* @__PURE__ */ jsxs("em", { children: [allSlabDossiers.length, " slab codes / visual gallery"] }),
								/* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })
							]
						})
					}), collections.map((collection, index) => /* @__PURE__ */ jsx(Reveal, {
						className: "countertop-collection-directory-card",
						delay: (index + 1) * .025,
						children: /* @__PURE__ */ jsxs(RouteLink, {
							page: countertopCollectionPageByKey[collection.key],
							navigate,
							children: [
								/* @__PURE__ */ jsx("span", { children: String(index + 2).padStart(2, "0") }),
								/* @__PURE__ */ jsxs("strong", { children: [countertopCollectionLabel(collection), " quartz slabs"] }),
								/* @__PURE__ */ jsx("p", { children: collection.hero.headline }),
								/* @__PURE__ */ jsxs("em", { children: [
									collection.slabs.length,
									" slabs / ",
									collection.facts[0]?.label ?? "Collection facts"
								] }),
								/* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })
							]
						})
					}, collection.key))]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "slab-inspector-section",
				id: "countertop-slab-inspector",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "slab-filter",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "slab-filter-options",
							role: "radiogroup",
							"aria-label": "Countertop collections",
							children: [/* @__PURE__ */ jsx("p", {
								className: "rail-caption",
								children: "Collections"
							}), collections.map((collection, index) => /* @__PURE__ */ jsxs(motion$1.button, {
								type: "button",
								role: "radio",
								"aria-checked": collection.key === collectionKey,
								tabIndex: collection.key === collectionKey ? 0 : -1,
								"data-roving-option": true,
								className: collection.key === collectionKey ? "active" : "",
								onClick: () => selectCollection(collection),
								onKeyDown: (event) => handleRovingOptionKeyDown(event, collections.length, index, (nextIndex) => selectCollection(collections[nextIndex])),
								whileTap: reducedMotion ? void 0 : { scale: .985 },
								children: [
									collection.key === collectionKey && /* @__PURE__ */ jsx(motion$1.span, {
										className: "tracker-indicator",
										layoutId: "slab-filter-tracker",
										transition: {
											duration: reducedMotion ? 0 : .22,
											ease: motionEase
										}
									}),
									/* @__PURE__ */ jsx("span", { children: countertopCollectionLabel(collection) }),
									/* @__PURE__ */ jsxs("small", { children: [collection.slabs.length, " slabs"] })
								]
							}, collection.key))]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "slab-mobile-summary",
							children: [
								/* @__PURE__ */ jsx("span", { children: selected.code }),
								/* @__PURE__ */ jsx("strong", { children: selected.name }),
								/* @__PURE__ */ jsxs("small", { children: [countertopCollectionLabel(active), " selected"] })
							]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "slab-code-search",
							children: [/* @__PURE__ */ jsx("span", { children: "Jump To Code" }), /* @__PURE__ */ jsx("input", {
								type: "search",
								value: slabSearch,
								onChange: (event) => setSlabSearch(event.target.value),
								placeholder: "Search 9114, 9137, Carrara...",
								"aria-label": "Search slab code or name"
							})]
						}),
						slabSearchTerm && /* @__PURE__ */ jsx("div", {
							className: "slab-search-results",
							role: "listbox",
							"aria-label": "Matching slab codes",
							children: slabSearchMatches.length ? slabSearchMatches.map(({ slab, collection }) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								className: slab.code === selected.code ? "active" : "",
								role: "option",
								"aria-selected": slab.code === selected.code,
								"aria-label": `Select ${slab.code} ${slab.name} from ${countertopCollectionLabel(collection)}`,
								onClick: () => {
									selectSlabCode(slab, collection, true);
									setSlabSearch("");
								},
								children: [
									/* @__PURE__ */ jsx("span", { children: slab.code }),
									/* @__PURE__ */ jsx("strong", { children: slab.name }),
									/* @__PURE__ */ jsx("small", { children: countertopCollectionLabel(collection) })
								]
							}, `${collection.key}-${slab.code}`)) : /* @__PURE__ */ jsx("p", { children: "No matching slab code found." })
						})
					]
				}), /* @__PURE__ */ jsxs(LayoutGroup, { children: [/* @__PURE__ */ jsxs("aside", {
					className: "slab-inspector slab-inspector-primary",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "panel-topline",
						children: [/* @__PURE__ */ jsx("h2", { children: selected.name }), /* @__PURE__ */ jsx(ModeSwitch, {
							mode,
							setMode,
							scope: "countertops"
						})]
					}), /* @__PURE__ */ jsx(AnimatePresence$1, {
						mode: "wait",
						children: mode === "visual" ? /* @__PURE__ */ jsxs(motion$1.div, {
							className: "slab-visual-inspection",
							id: "countertops-visual-panel",
							role: "tabpanel",
							"aria-labelledby": "countertops-visual-tab",
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 10,
								clipPath: "inset(0 0 6% 0)"
							},
							animate: {
								opacity: 1,
								y: 0,
								clipPath: "inset(0 0 0% 0)"
							},
							exit: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: -6
							},
							transition: {
								duration: reducedMotion ? 0 : .22,
								ease: motionEase
							},
							children: [
								/* @__PURE__ */ jsxs(motion$1.div, {
									className: "slab-selected-receipt",
									initial: reducedMotion ? {
										opacity: 1,
										y: 0
									} : {
										opacity: 0,
										y: 7
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										duration: reducedMotion ? 0 : .18,
										ease: motionEase
									},
									children: [/* @__PURE__ */ jsx("span", { children: selected.code }), /* @__PURE__ */ jsxs("strong", { children: [countertopCollectionLabel(active), " inspection"] })]
								}),
								/* @__PURE__ */ jsxs(motion$1.button, {
									type: "button",
									className: "slab-detail-image",
									onClick: () => openSlabZoom(selected, active),
									whileTap: reducedMotion ? void 0 : { scale: .992 },
									"aria-label": `Zoom ${selected.code} ${selected.name}`,
									children: [
										/* @__PURE__ */ jsx(motion$1.i, {
											className: "slab-inspection-scan",
											"aria-hidden": "true",
											initial: reducedMotion ? {
												opacity: 0,
												x: 0
											} : {
												opacity: 0,
												x: "-40%"
											},
											animate: reducedMotion ? {
												opacity: 0,
												x: 0
											} : {
												opacity: [
													0,
													.48,
													0
												],
												x: [
													"-40%",
													"30%",
													"92%"
												]
											},
											transition: {
												duration: reducedMotion ? 0 : .58,
												ease: motionEase
											}
										}),
										/* @__PURE__ */ jsx(motion$1.img, {
											...responsiveImageAttrs(selected.image, {
												alt: selected.alt,
												sizes: "(max-width: 920px) 86vw, 42vw",
												preferredWidth: 768
											}),
											initial: reducedMotion ? { opacity: 1 } : {
												opacity: .72,
												scale: .985
											},
											animate: {
												opacity: 1,
												scale: 1
											},
											transition: {
												duration: reducedMotion ? 0 : .24,
												ease: motionEase
											}
										}, selected.image),
										/* @__PURE__ */ jsx("span", {
											className: "zoom-cue",
											"aria-hidden": "true",
											children: /* @__PURE__ */ jsx(Maximize2, { size: 15 })
										})
									]
								}),
								/* @__PURE__ */ jsxs("dl", { children: [
									/* @__PURE__ */ jsx("dt", { children: "Collection" }),
									/* @__PURE__ */ jsx("dd", { children: selected.collection }),
									/* @__PURE__ */ jsx("dt", { children: "Movement" }),
									/* @__PURE__ */ jsx("dd", { children: selected.asset_description ?? active.behavior })
								] })
							]
						}, selected.code + "-visual") : /* @__PURE__ */ jsxs(motion$1.div, {
							className: "spec-mode compact",
							id: "countertops-spec-panel",
							role: "tabpanel",
							"aria-labelledby": "countertops-spec-tab",
							initial: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: 10,
								clipPath: "inset(0 0 6% 0)"
							},
							animate: {
								opacity: 1,
								y: 0,
								clipPath: "inset(0 0 0% 0)"
							},
							exit: reducedMotion ? { opacity: 1 } : {
								opacity: 0,
								y: -6
							},
							transition: {
								duration: reducedMotion ? 0 : .22,
								ease: motionEase
							},
							children: [
								/* @__PURE__ */ jsxs(motion$1.div, {
									className: "spec-receipt",
									initial: reducedMotion ? {
										opacity: 1,
										y: 0
									} : {
										opacity: 0,
										y: 6
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										duration: reducedMotion ? 0 : .16,
										ease: motionEase
									},
									children: [/* @__PURE__ */ jsx(Check$1, { size: 15 }), /* @__PURE__ */ jsxs("span", { children: [selected.code, " spec review"] })]
								}),
								/* @__PURE__ */ jsxs(motion$1.dl, {
									initial: reducedMotion ? { opacity: 1 } : {
										opacity: 0,
										y: 6
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										duration: reducedMotion ? 0 : .16,
										ease: motionEase
									},
									children: [/* @__PURE__ */ jsx("dt", { children: "Code" }), /* @__PURE__ */ jsx("dd", { children: selected.code })]
								}),
								active.facts.map((fact, index) => /* @__PURE__ */ jsxs(motion$1.dl, {
									initial: reducedMotion ? { opacity: 1 } : {
										opacity: 0,
										y: 6
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										duration: reducedMotion ? 0 : .16,
										delay: reducedMotion ? 0 : (index + 1) * .035,
										ease: motionEase
									},
									children: [/* @__PURE__ */ jsx("dt", { children: fact.label }), /* @__PURE__ */ jsx("dd", { children: fact.value })]
								}, fact.label)),
								/* @__PURE__ */ jsxs(motion$1.dl, {
									initial: reducedMotion ? { opacity: 1 } : {
										opacity: 0,
										y: 6
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										duration: reducedMotion ? 0 : .16,
										delay: reducedMotion ? 0 : (active.facts.length + 1) * .035,
										ease: motionEase
									},
									children: [/* @__PURE__ */ jsx("dt", { children: "Quote inputs" }), /* @__PURE__ */ jsx("dd", { children: "Slab name, square footage, edge profile, cutouts, and timeline." })]
								})
							]
						}, selected.code + "-spec")
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "slab-grid-shell",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "slab-grid-topline",
							children: [/* @__PURE__ */ jsx("p", {
								className: "rail-caption",
								children: "Slab Bench"
							}), /* @__PURE__ */ jsxs("span", { children: [
								visibleSlabs.length,
								" previewed, ",
								active.slabs.length,
								" in code list"
							] })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "slab-grid",
							children: visibleSlabs.map((slab) => /* @__PURE__ */ jsxs(motion$1.div, {
								layout: true,
								className: slab.code === selected.code ? "slab-tile active" : "slab-tile",
								initial: reducedMotion ? {
									opacity: 1,
									y: 0
								} : {
									opacity: 1,
									y: 8
								},
								whileInView: {
									opacity: 1,
									y: 0
								},
								viewport: {
									once: true,
									amount: .2
								},
								whileHover: reducedMotion ? void 0 : { y: -2 },
								transition: {
									duration: reducedMotion ? 0 : .18,
									ease: motionEase
								},
								children: [
									slab.code === selected.code && /* @__PURE__ */ jsx(motion$1.span, {
										className: "slab-selection-ring",
										layoutId: "slab-selection-ring",
										transition: {
											duration: reducedMotion ? 0 : .22,
											ease: motionEase
										}
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										className: "slab-thumb-button",
										onClick: () => openSlabZoom(slab, active),
										"aria-label": `Zoom ${slab.code} ${slab.name}`,
										children: [/* @__PURE__ */ jsx(ResponsiveImage, {
											src: slab.image,
											alt: slab.alt,
											sizes: "(max-width: 920px) 42vw, 180px",
											preferredWidth: 320
										}), /* @__PURE__ */ jsx("span", {
											className: "zoom-cue compact",
											"aria-hidden": "true",
											children: /* @__PURE__ */ jsx(Maximize2, { size: 13 })
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										className: "slab-tile-detail",
										onClick: () => selectSlabCode(slab, active, true),
										"aria-label": `Select ${slab.code} ${slab.name}`,
										children: [/* @__PURE__ */ jsx("span", { children: slab.code }), /* @__PURE__ */ jsx("strong", { children: slab.name })]
									})
								]
							}, slab.code))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "slab-index-actions",
							children: /* @__PURE__ */ jsxs("details", {
								className: "slab-code-ledger",
								children: [/* @__PURE__ */ jsxs("summary", { children: [
									"Full ",
									countertopCollectionLabel(active),
									" code list"
								] }), /* @__PURE__ */ jsx("ul", { children: active.slabs.map((slab) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
									type: "button",
									className: slab.code === selected.code ? "active" : "",
									"aria-current": slab.code === selected.code ? "true" : void 0,
									"aria-label": `Select slab ${slab.code} ${slab.name}`,
									onClick: () => selectSlabCode(slab, active, true),
									children: [/* @__PURE__ */ jsx("span", { children: slab.code }), /* @__PURE__ */ jsx("strong", { children: slab.name })]
								}) }, slab.code)) })]
							})
						})
					]
				})] })]
			}),
			/* @__PURE__ */ jsx(SlabZoomOverlay, {
				slab: zoomSlab,
				onClose: () => setZoomSlab(null)
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to send for countertop pricing",
					items: [
						"Slab name or code",
						"Square footage",
						"Edge profile",
						"Sink or cooktop cutouts",
						"Destination and timeline"
					],
					note: "Edge profiles, cutouts, square footage, destination, and timeline determine quote readiness.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Spec Inspection"
						}),
						/* @__PURE__ */ jsx("h2", { children: "The slab choice stays tied to edge and cutout details." }),
						/* @__PURE__ */ jsx("p", { children: "The slab is one part of countertop pricing. Edge profile, sink or cooktop cutouts, finished square footage, slab sizing, thickness, destination, and timeline also affect the review." }),
						/* @__PURE__ */ jsxs("div", {
							className: "fact-strip",
							children: [
								/* @__PURE__ */ jsx("span", { children: "Exotic" }),
								/* @__PURE__ */ jsx("span", { children: "Natural" }),
								/* @__PURE__ */ jsx("span", { children: "Grain Classic" }),
								/* @__PURE__ */ jsx("span", { children: "20mm / 30mm where published" })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(CountertopSpecLedger, {
				active,
				selected
			}),
			/* @__PURE__ */ jsx(MaterialBehaviorDossiers, { collections }),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Countertop FAQ",
				items: [
					["What details affect quote readiness?", "Slab name, square footage, edge profile, sink or cooktop cutouts, destination, and timeline."],
					["What slab sizes are available?", "Collection facts include 126 x 63 inches, 137 x 78 inches, 3200 x 1600mm, or 3500 x 2000mm where published."],
					["What thickness is available?", "Published slabs include 20mm and, for selected collections, 30mm. Asina confirms final availability during project review."],
					["How should edge profiles be handled?", "Send the desired edge profile, finished square footage, sink or cooktop cutouts, and timeline so Asina can prepare the pricing review."],
					["Can countertops be coordinated with cabinets?", "Yes. Asina can review countertops and cabinets as one project path, not as a retail bundle."],
					["How is slab movement evaluated?", "The slab inspector keeps the image beside the spec panel so dramatic, calm, and uniform surfaces can be matched to project needs."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "countertops",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function CountertopSpecLedger({ active, selected }) {
	const rows = [
		["Selected slab", `${selected.code} / ${selected.name}`],
		["Collection behavior", selected.asset_description ?? active.behavior],
		["Published facts", active.facts.map((fact) => `${fact.label}: ${fact.value}`).join(" · ")],
		["Quote check", "Square footage, edge profile, cutouts, destination, timeline."]
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "countertop-ledger",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "countertop-ledger-lead",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "proof-label proof-label-light",
					children: "Quote Ledger"
				}),
				/* @__PURE__ */ jsx("h2", { children: "One material choice, kept beside the pricing conditions." }),
				/* @__PURE__ */ jsx("p", { children: "Buyers who already know a slab code can jump straight to it. The selected surface stays tied to movement, size facts, edge work, cutouts, and timeline." })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "countertop-ledger-table",
			children: rows.map(([label, value], index) => /* @__PURE__ */ jsxs(Reveal, {
				className: "countertop-ledger-row",
				delay: index * .035,
				children: [
					/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
					/* @__PURE__ */ jsx("strong", { children: label }),
					/* @__PURE__ */ jsx("p", { children: value })
				]
			}, label))
		})]
	});
}
function SlabZoomOverlay({ slab, onClose }) {
	const reducedMotion = useReducedMotion$1();
	const panelRef = useRef$1(null);
	const closeButtonRef = useRef$1(null);
	useEffect$1(() => {
		if (!slab) return void 0;
		const previousOverflow = document.body.style.overflow;
		const previousFocus = document.activeElement;
		const restoreAppRoot = isolateAppRoot();
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose();
				return;
			}
			if (event.key !== "Tab" || !panelRef.current) return;
			const focusable = panelRef.current.querySelectorAll("a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex=\"-1\"])");
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);
		requestAnimationFrame(() => closeButtonRef.current?.focus());
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
			restoreAppRoot();
			if (previousFocus instanceof HTMLElement) previousFocus.focus();
		};
	}, [slab, onClose]);
	const overlay = /* @__PURE__ */ jsx(AnimatePresence$1, { children: slab && /* @__PURE__ */ jsx(motion$1.div, {
		className: "slab-zoom-backdrop",
		onClick: onClose,
		initial: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		animate: { opacity: 1 },
		exit: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		transition: {
			duration: reducedMotion ? 0 : .2,
			ease: motionEase
		},
		children: /* @__PURE__ */ jsxs(motion$1.div, {
			ref: panelRef,
			className: "slab-zoom-panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "slab-zoom-title",
			onClick: (event) => event.stopPropagation(),
			initial: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 14,
				scale: .985
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 8,
				scale: .985
			},
			transition: {
				duration: reducedMotion ? 0 : .24,
				ease: motionEase
			},
			children: [
				/* @__PURE__ */ jsx("button", {
					ref: closeButtonRef,
					className: "zoom-close",
					type: "button",
					onClick: onClose,
					"aria-label": "Close slab zoom",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "slab-zoom-media",
					children: [
						/* @__PURE__ */ jsx(motion$1.i, {
							className: "slab-zoom-scan",
							"aria-hidden": "true",
							initial: reducedMotion ? {
								opacity: 0,
								x: 0
							} : {
								opacity: 0,
								x: "-38%"
							},
							animate: reducedMotion ? {
								opacity: 0,
								x: 0
							} : {
								opacity: [
									0,
									.5,
									0
								],
								x: [
									"-38%",
									"34%",
									"88%"
								]
							},
							transition: {
								duration: reducedMotion ? 0 : .72,
								delay: reducedMotion ? 0 : .08,
								ease: motionEase
							}
						}),
						/* @__PURE__ */ jsx(ResponsiveImage, {
							src: slab.image,
							alt: slab.alt,
							loading: "eager",
							sizes: "(max-width: 920px) 92vw, 54vw",
							preferredWidth: 960
						}),
						/* @__PURE__ */ jsx("span", {
							className: "inspection-corner top",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "inspection-corner bottom",
							"aria-hidden": "true"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "slab-zoom-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "dialog-label",
							children: "Slab Inspection"
						}),
						/* @__PURE__ */ jsx("h2", {
							id: "slab-zoom-title",
							children: slab.name
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "slab-zoom-tags",
							children: [/* @__PURE__ */ jsx("span", { children: slab.code }), /* @__PURE__ */ jsx("span", { children: slab.collectionLabel ?? slab.collection })]
						}),
						/* @__PURE__ */ jsx("p", { children: slab.behavior ?? slab.asset_description }),
						/* @__PURE__ */ jsxs("dl", {
							className: "slab-zoom-facts",
							children: [(slab.facts ?? []).map((fact, index) => /* @__PURE__ */ jsxs(motion$1.div, {
								initial: reducedMotion ? {
									opacity: 1,
									y: 0
								} : {
									opacity: 0,
									y: 6
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: reducedMotion ? 0 : .16,
									delay: reducedMotion ? 0 : .12 + index * .035,
									ease: motionEase
								},
								children: [/* @__PURE__ */ jsx("dt", { children: fact.label }), /* @__PURE__ */ jsx("dd", { children: fact.value })]
							}, fact.label)), /* @__PURE__ */ jsxs(motion$1.div, {
								initial: reducedMotion ? {
									opacity: 1,
									y: 0
								} : {
									opacity: 0,
									y: 6
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: reducedMotion ? 0 : .16,
									delay: reducedMotion ? 0 : .24,
									ease: motionEase
								},
								children: [/* @__PURE__ */ jsx("dt", { children: "Quote inputs" }), /* @__PURE__ */ jsx("dd", { children: "Slab name, square footage, edge profile, cutouts, destination, and timeline." })]
							})]
						})
					]
				})
			]
		})
	}) });
	if (typeof document === "undefined") return overlay;
	return createPortal(overlay, document.body);
}
function MaterialBehaviorDossiers({ collections }) {
	const quoteRisks = {
		exotic: "Bold veining needs tighter slab approval, seam planning, and edge confirmation.",
		natural: "Calmer movement still needs square footage, cutouts, and final thickness review.",
		grain: "Repeatable grain helps rollout consistency, but code selection still affects pricing."
	};
	const bestFits = {
		exotic: "Feature islands, commercial bars, amenity surfaces",
		natural: "Multi-unit kitchens, calmer vanities, premium repeat surfaces",
		grain: "Franchise counters, back-of-house consistency, large repeat runs"
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "material-behavior-dossiers",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "section-intro",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "section-label",
					children: "Material Behavior"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Review each slab family by how it behaves in a real project." }),
				/* @__PURE__ */ jsx("p", { children: "Movement, thickness, cutouts, and edge details stay tied to the surface choice." })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "behavior-dossier-grid",
			children: collections.map((collection, index) => /* @__PURE__ */ jsxs(Reveal, {
				className: "behavior-dossier",
				delay: index * .05,
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: collection.hero.image,
					alt: `${collection.name} countertop surface behavior`,
					sizes: "(max-width: 920px) 92vw, 30vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsxs("div", {
					className: "behavior-dossier-copy",
					children: [
						/* @__PURE__ */ jsxs("span", { children: [collection.slabs.length, " slab options"] }),
						/* @__PURE__ */ jsx("h3", { children: countertopCollectionLabel(collection) }),
						/* @__PURE__ */ jsx("p", { children: collection.behavior }),
						/* @__PURE__ */ jsxs("dl", { children: [
							/* @__PURE__ */ jsx("dt", { children: "Quote risk" }),
							/* @__PURE__ */ jsx("dd", { children: quoteRisks[collection.key] ?? "Code, square footage, cutouts, edge profile, and timeline drive pricing." }),
							/* @__PURE__ */ jsx("dt", { children: "Best fit" }),
							/* @__PURE__ */ jsx("dd", { children: bestFits[collection.key] ?? "Project-scale countertop packages." })
						] })
					]
				})]
			}, collection.key))
		})]
	});
}
//#endregion
//#region src/pages/operationsPages.jsx
function FurniturePage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "furniture",
		eyebrow: "Custom Furniture Packages",
		title: "Rollout furniture packages.",
		copy: "Asina reviews brand requirements, quantity, store count, design files, materials, mockup needs, and repeat-production potential.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "furniture-hero",
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: heroAssets.furniture,
					alt: "Commercial furniture package example",
					loading: "eager",
					sizes: "(max-width: 920px) 92vw, 46vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "document-tab",
						children: "Package Intake"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Restaurant, franchise, venue, and commercial furniture programs." }),
					/* @__PURE__ */ jsx("p", { children: "This is not a public furniture menu. Asina reviews a production-ready package with brand standards, floor plans, quantity estimates, finish direction, and timeline." })
				] })]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section package-board",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Intake Board",
					title: "Prepare production details, not a retail order.",
					copy: "Each slot names what Asina may request by email after the first review."
				}), /* @__PURE__ */ jsxs("div", {
					className: "package-blueprint",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "blueprint-cover",
						children: [
							/* @__PURE__ */ jsx("span", { children: "Package Intake" }),
							/* @__PURE__ */ jsx("strong", { children: "Brand standards, quantities, layout, finish, timeline." }),
							/* @__PURE__ */ jsx("p", { children: "Asina requests files by email after the first review, then prepares the package for production." })
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "slot-grid",
						children: [
							"Brand standards",
							"Look-and-feel references",
							"Chair/table files",
							"Floor plan or seating layout",
							"Store count and quantities",
							"Finish direction and timeline"
						].map((slot, index) => /* @__PURE__ */ jsxs(Reveal, {
							className: "slot",
							delay: index * .04,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "slot-index",
									children: String(index + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ jsx(FileText$1, { size: 22 }),
								/* @__PURE__ */ jsx("strong", { children: slot }),
								/* @__PURE__ */ jsx("span", { children: "Requested by email after the first review" })
							]
						}, slot))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to send for furniture package review",
					items: [
						"Store count",
						"Quantity estimate",
						"Brand requirements",
						"Floor plan or seating layout",
						"Material and finish direction",
						"Timeline"
					],
					note: "Asina requests furniture files, look-and-feel references, and brand standards by email after the first review. Then Asina checks feasibility, mockup needs, minimums, and repeat rollout potential.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Repeat Production"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Package intake protects the first store and the rollout after it." }),
						/* @__PURE__ */ jsx("p", { children: "Asina reviews custom furniture as a coordinated package: brand standards, chair and table files, seating layouts, quantity estimates, material direction, sample approval, packing, and shipping coordination." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(FurnitureCaseDossiers, {}),
			/* @__PURE__ */ jsx(FurnitureRolloutBoard, {}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Furniture Package FAQ",
				items: [
					["Are minimums fixed?", "Minimums vary by product type, design complexity, material, finish, and production requirements."],
					["Can Asina review franchise standards?", "Yes. Brand requirements and store counts are core inputs for furniture package review."],
					["What files help the review?", "Brand standards, look-and-feel references, chair or table files, floor plans, seating layouts, quantity estimates, finish direction, and timeline."],
					["How do samples or mockups work?", "A mockup or sample approval step can confirm dimensions, materials, finishes, and details before repeat production."],
					["What makes repeat rollout different?", "The first package becomes a production reference for later stores, phases, packing plans, and shipping coordination."],
					["Are products shoppable?", "No. Asina reviews furniture as a custom package, not as a retail catalog."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "furniture",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function FurnitureRolloutBoard() {
	return /* @__PURE__ */ jsxs("section", {
		className: "rollout-board",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rollout-board-copy",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "proof-label proof-label-light",
					children: "Rollout Board"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Furniture moves as an approved package, not a cart." }),
				/* @__PURE__ */ jsx("p", { children: "The point is repeatable production: confirm the first package, then protect each later store, room, or phase with the same approved reference." })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "rollout-board-rail",
			children: [
				["Feasibility", "Brand standards, store count, quantities, and timeline are checked before quoting."],
				["Sample path", "Mockup or sample approval confirms dimensions, materials, finish, and comfort details."],
				["First package", "The first approved package becomes the reference for ordering, packing, and install coordination."],
				["Repeat rollout", "Later locations follow the approved package instead of restarting from a retail-style product list."],
				["Shipment review", "Asina reviews packing, labels, destination, and responsibility level before release."]
			].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
				className: "rollout-board-step",
				delay: index * .04,
				children: [
					/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
					/* @__PURE__ */ jsx("strong", { children: title }),
					/* @__PURE__ */ jsx("p", { children: copy })
				]
			}, title))
		})]
	});
}
function FurnitureCaseDossiers() {
	return /* @__PURE__ */ jsxs("section", {
		className: "furniture-case-section",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "section-intro",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "section-label",
					children: "Package Cases"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Furniture examples start as rollout packets, not product cards." }),
				/* @__PURE__ */ jsx("p", { children: "Each case shows the project context, the files needed, and the approval steps before repeat production." })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "furniture-case-grid",
			children: furnitureCases.map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
				className: `furniture-case case-${index + 1}`,
				delay: index * .05,
				children: [/* @__PURE__ */ jsx(ResponsiveImage, {
					src: item.image,
					alt: `${item.title} furniture package`,
					sizes: "(max-width: 920px) 92vw, 30vw",
					preferredWidth: 960
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("span", { children: item.scale }),
					/* @__PURE__ */ jsx("h3", { children: item.title }),
					/* @__PURE__ */ jsx("ul", { children: item.packet.map((packetItem) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Check$1, { size: 14 }), packetItem] }, packetItem)) }),
					/* @__PURE__ */ jsx("p", { children: item.path })
				] })]
			}, item.title))
		})]
	});
}
function ProcessPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "process",
		eyebrow: "Drawing To Production",
		title: "A controlled sequence from drawing to production.",
		copy: "Every stage shows the buyer input, Asina review, output, and risk reduced.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsx(ResourceByline, {
				pageId: "process",
				navigate
			}),
			/* @__PURE__ */ jsx(ProcessWorkbench, {}),
			/* @__PURE__ */ jsxs("section", {
				className: "security-note",
				children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 28 }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Project files stay private." }), /* @__PURE__ */ jsx("p", { children: "Asina requests drawings, specs, plans, brand standards, and furniture files by email after the first review." })] })]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to prepare before the first review",
					items: [
						"Project category",
						"Location",
						"Unit, store, or room count",
						"Timeline",
						"Drawings or specs ready for email follow-up"
					],
					note: "The form starts with basics only. Asina requests drawings, specs, plans, and brand standards by email after checking project fit.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Clean Intake"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Keep files off the public form." }),
						/* @__PURE__ */ jsx("p", { children: "The process starts with a small set of basics. Asina first checks category, scale, and timeline, then requests the documents needed to translate design intent into production-ready requirements." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "process",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function ProcessWorkbench() {
	const [active, setActive] = useState$1(0);
	const reducedMotion = useReducedMotion$1();
	const activeProgress = (active + 1) / processSteps.length;
	return /* @__PURE__ */ jsxs("section", {
		className: "process-workbench",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "process-workbench-rail",
				"aria-label": "Process steps",
				children: processSteps.map((item, index) => /* @__PURE__ */ jsxs(motion$1.button, {
					type: "button",
					className: active === index ? "active" : "",
					"aria-current": active === index ? "step" : void 0,
					onClick: () => setActive(index),
					whileTap: reducedMotion ? void 0 : { scale: .985 },
					children: [
						active === index && /* @__PURE__ */ jsx(motion$1.span, {
							className: "tracker-indicator",
							layoutId: "process-workbench-rail-tracker",
							transition: {
								duration: reducedMotion ? 0 : .22,
								ease: motionEase
							}
						}),
						/* @__PURE__ */ jsx("span", {
							className: "process-rail-number",
							children: String(index + 1).padStart(2, "0")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "process-rail-label",
							children: item.short
						})
					]
				}, item.short))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "workbench-stage",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "process-state-strip",
					"aria-live": "polite",
					children: [
						/* @__PURE__ */ jsxs("span", { children: [
							String(active + 1).padStart(2, "0"),
							" / ",
							processSteps.length
						] }),
						/* @__PURE__ */ jsx("strong", { children: processCues[active].cue }),
						/* @__PURE__ */ jsx(motion$1.i, {
							"aria-hidden": "true",
							initial: false,
							animate: { scaleX: reducedMotion ? 1 : activeProgress },
							transition: {
								duration: reducedMotion ? 0 : .28,
								ease: motionEase
							}
						})
					]
				}), /* @__PURE__ */ jsx(DossierPacketVisual$1, {
					active,
					headingLevel: "h2"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "process-docket-list",
				children: processSteps.map((item, index) => /* @__PURE__ */ jsxs(motion$1.button, {
					type: "button",
					className: active === index ? "active" : "",
					onClick: () => setActive(index),
					whileTap: reducedMotion ? void 0 : { scale: .99 },
					children: [
						active === index && /* @__PURE__ */ jsx(motion$1.span, {
							className: "tracker-indicator",
							layoutId: "process-docket-tracker",
							transition: {
								duration: reducedMotion ? 0 : .22,
								ease: motionEase
							}
						}),
						/* @__PURE__ */ jsx("strong", { children: item.title }),
						/* @__PURE__ */ jsx("span", { children: processCues[index].tag })
					]
				}, item.title))
			})
		]
	});
}
function QAPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "qa",
		eyebrow: "QA + Import Risk",
		title: "Lower cost only matters when it arrives right.",
		copy: "Asina reviews import cabinet risk in plain terms: direct import cabinet problems, the import cabinet QA process, cabinet mockup approval, cabinet QA inspections, procurement risk reduction, packing review, and shipping responsibility.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "risk-matrix",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "risk-col",
					children: [/* @__PURE__ */ jsx("p", {
						className: "ledger-caption",
						children: "Common Import Risks"
					}), [
						"Wrong measurements",
						"Inconsistent finishes",
						"Missing details",
						"Weak packing",
						"Unclear shipping responsibility"
					].map((item) => /* @__PURE__ */ jsxs("div", {
						className: "risk-row warning",
						children: [/* @__PURE__ */ jsx("span", {}), item]
					}, item))]
				}), /* @__PURE__ */ jsxs("div", {
					className: "risk-col",
					children: [/* @__PURE__ */ jsx("p", {
						className: "ledger-caption",
						children: "Asina Controls"
					}), [
						"Drawing review",
						"Design-to-production translation",
						"Mockup approval",
						"Production QA",
						"Packing review",
						"Freight quote coordination"
					].map((item) => /* @__PURE__ */ jsxs("div", {
						className: "risk-row proof",
						children: [/* @__PURE__ */ jsx(Check$1, { size: 16 }), item]
					}, item))]
				})]
			}),
			/* @__PURE__ */ jsx(QALedger, {}),
			/* @__PURE__ */ jsx(QAPackingDossier, {}),
			/* @__PURE__ */ jsx("section", {
				className: "section qa-stages",
				children: [
					["Pre-Production QA", "The initial mockup or sample package confirms drawings, measurements, colors, finishes, materials, and requirements."],
					["Production QA", "Production is checked for finish consistency, color accuracy, visible defects, build quality, material match, and approved-spec consistency."],
					["Packing / Shipment QA", "Asina reviews packing against customer requirements, item count, labels, added protection, and shipping readiness."]
				].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
					className: "qa-stage",
					delay: index * .05,
					children: [/* @__PURE__ */ jsx(Stamp$1, { label: title }), /* @__PURE__ */ jsx("p", { children: copy })]
				}, title))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "supplier-record",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "proof-label proof-label-light",
						children: "Supplier Of Record"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Asina manages accountability without exposing private production sources." }),
					/* @__PURE__ */ jsx("p", { children: "Asina manages pricing, project communication, QA checkpoints, packing review, and shipping coordination through its role as supplier of record. For supplier of record cabinets, private production sources and supplier relationships are not disclosed." })
				] }), /* @__PURE__ */ jsx("div", {
					className: "shipping-options",
					children: [
						"Buyer-Managed Freight",
						"Coordinated Freight Quote",
						"Expanded Delivery Support"
					].map((item) => /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx(Truck$1, { size: 20 }),
						/* @__PURE__ */ jsx("strong", { children: item }),
						/* @__PURE__ */ jsx("p", { children: "Reviewed during consultation based on destination and responsibility level." })
					] }, item))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section logistics-timeline",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "proof-label proof-label-light",
							children: "Typical Timeline"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Plan production around design finalization, production timing, and transit." }),
						/* @__PURE__ */ jsx("p", { children: "Consultation and design finalization usually take about 3 weeks. Production usually takes about 40 to 50 days, with timing affected by production capacity, order complexity, and final approved details." })
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("span", { children: "01" }),
						/* @__PURE__ */ jsx("strong", { children: "Consultation + design finalization" }),
						/* @__PURE__ */ jsx("p", { children: "Usually about 3 weeks to review selections, settle details, and finalize what moves into production." })
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("span", { children: "02" }),
						/* @__PURE__ */ jsx("strong", { children: "Production" }),
						/* @__PURE__ */ jsx("p", { children: "Usually about 40 to 50 days after approval, depending on production capacity and order complexity." })
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("span", { children: "03" }),
						/* @__PURE__ */ jsx("strong", { children: "Transit planning" }),
						/* @__PURE__ */ jsx("p", { children: "Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast." })
					] })
				]
			}),
			/* @__PURE__ */ jsx(IncotermsPlanning, {}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to prepare for QA and shipping review",
					items: [
						"Drawings or project specs",
						"Approved material or finish direction",
						"Packing requirements",
						"Destination",
						"Preferred responsibility level",
						"Timeline"
					],
					note: "Asina reviews shipping options during consultation. Final risk, cost, responsibility, and delivery terms follow the agreed project quote.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Before Release"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Packing and shipment checks are part of the quality review." }),
						/* @__PURE__ */ jsx("p", { children: "Quality verified before shipment means the project is checked against approved requirements, packed with the agreed needs in mind, and reviewed for shipping responsibility before release." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "QA + Shipping FAQ",
				items: [
					["Who handles shipping?", "Asina reviews shipping responsibility during consultation and can provide freight quotes through partners where applicable."],
					["How long does shipping take?", "Under DAP planning, transit is typically 22 to 30 days to the West Coast and 40 to 50 days to the East Coast. Orders usually move in 20-foot or 40-foot containers."],
					["What Incoterms can apply?", "Common terms may include EXW, FOB, CIF, DAP, DPU, and DDP. Final responsibility, risk, cost, and delivery terms follow the agreed Incoterms® 2020 rule in the project quote."],
					["How does Asina reduce measurement risk?", "Asina reviews drawings before production language is finalized, and mockup approval creates a reference before repeat production."],
					["How are finishes checked?", "Asina checks finish and color direction against the approved sample or mockup during production QA."],
					["How is moisture risk reduced during shipping?", "Asina can place continuous lines of desiccant bags or silica gel packets along both sides of the container to absorb humidity and reduce condensation, mold, and moisture damage in transit."],
					["What packing risks does Asina check?", "Asina can review item count, organization, labels or instructions, added protection, and shipment readiness."],
					["Why no source disclosure?", "Asina protects its supply network and manages accountability through its role as supplier of record."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "qa",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function QAPackingDossier() {
	const reducedMotion = useReducedMotion$1();
	return /* @__PURE__ */ jsxs("section", {
		className: "qa-packing-dossier",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "packing-copy",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "ledger-caption",
					children: "Inspection Labels"
				}),
				/* @__PURE__ */ jsx("h2", { children: "QA shows up in stamps, labels, and shipment checks buyers can audit." }),
				/* @__PURE__ */ jsx("p", { children: "Risk control becomes tangible: approved sample, production check, packing review, and shipping responsibility before release." })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "packing-label-grid",
			children: [
				["Finish sample", "Color and finish checked against the approved reference before repeat production continues."],
				["Packing label", "Asina reviews counts, room groups, item protection, and label needs before shipping readiness."],
				["Responsibility ticket", "Destination, freight quote options, and Incoterms® 2020 responsibility are clarified in the project quote."]
			].map(([title, copy], index) => /* @__PURE__ */ jsxs(motion$1.div, {
				className: "packing-label",
				initial: reducedMotion ? {
					opacity: 1,
					y: 0,
					rotate: 0
				} : {
					opacity: 1,
					y: 12,
					rotate: index === 1 ? .8 : -.8
				},
				whileInView: {
					opacity: 1,
					y: 0,
					rotate: reducedMotion ? 0 : index === 1 ? .3 : -.2
				},
				viewport: {
					once: true,
					amount: .35
				},
				transition: {
					duration: reducedMotion ? 0 : .26,
					delay: reducedMotion ? 0 : index * .06,
					ease: motionEase
				},
				children: [
					/* @__PURE__ */ jsx(motion$1.i, {
						"aria-hidden": "true",
						className: "packing-label-scan",
						initial: reducedMotion ? {
							scaleX: 1,
							opacity: .14
						} : {
							scaleX: 0,
							opacity: 0
						},
						whileInView: reducedMotion ? {
							scaleX: 1,
							opacity: .14
						} : {
							scaleX: [
								0,
								1,
								1
							],
							opacity: [
								0,
								.26,
								.14
							]
						},
						viewport: {
							once: true,
							amount: .4
						},
						transition: {
							duration: reducedMotion ? 0 : .34,
							delay: reducedMotion ? 0 : .08 + index * .06,
							ease: motionEase
						}
					}),
					/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
					/* @__PURE__ */ jsx("strong", { children: title }),
					/* @__PURE__ */ jsx("p", { children: copy }),
					/* @__PURE__ */ jsx("small", { children: "Checked before shipment" })
				]
			}, title))
		})]
	});
}
function QALedger() {
	const reducedMotion = useReducedMotion$1();
	return /* @__PURE__ */ jsxs("section", {
		className: "qa-ledger",
		"aria-label": "Quality verification ledger",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
			className: "proof-label proof-label-light",
			children: "QA Stamp Sequence"
		}), /* @__PURE__ */ jsx("h2", { children: "QA checkpoints appear before shipment." })] }), /* @__PURE__ */ jsx("div", {
			className: "qa-ledger-grid",
			children: [
				[
					"01",
					"Mockup Approved",
					"Approved sample confirms measurement, finish, color, and detail direction."
				],
				[
					"02",
					"Built To Approved Spec",
					"Asina reviews production against the approved project requirements."
				],
				[
					"03",
					"Checked Before Packing",
					"Asina reviews counts, labels, protection needs, and shipping readiness."
				],
				[
					"04",
					"Quality Checked Before Shipment",
					"Shipment readiness is checked before release."
				]
			].map(([number, title, copy], index) => /* @__PURE__ */ jsxs(motion$1.div, {
				className: "qa-ledger-card",
				initial: reducedMotion ? {
					opacity: 1,
					y: 0,
					scale: 1
				} : {
					opacity: 1,
					y: 10,
					scale: .985
				},
				whileInView: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				viewport: {
					once: true,
					amount: .4
				},
				transition: {
					duration: reducedMotion ? 0 : .22,
					delay: reducedMotion ? 0 : index * .055,
					ease: motionEase
				},
				children: [
					/* @__PURE__ */ jsx(motion$1.i, {
						className: "qa-ledger-confirm",
						"aria-hidden": "true",
						initial: reducedMotion ? { scaleX: 1 } : { scaleX: 0 },
						whileInView: { scaleX: 1 },
						viewport: {
							once: true,
							amount: .4
						},
						transition: {
							duration: reducedMotion ? 0 : .28,
							delay: reducedMotion ? 0 : .1 + index * .055,
							ease: motionEase
						}
					}),
					/* @__PURE__ */ jsx("span", { children: number }),
					/* @__PURE__ */ jsx("strong", { children: title }),
					/* @__PURE__ */ jsx("p", { children: copy })
				]
			}, title))
		})]
	});
}
function IncotermsPlanning() {
	return /* @__PURE__ */ jsxs("section", {
		className: "incoterms-section",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("p", {
					className: "ledger-caption",
					children: "Incoterms® 2020 Planning"
				}),
				/* @__PURE__ */ jsx("h2", { children: "Plain responsibility first, trade-term precision second." }),
				/* @__PURE__ */ jsx("p", { children: "Shipping is not one fixed model. Asina reviews buyer-managed freight, coordinated freight quotes, or expanded delivery support based on destination, responsibility level, and project requirements. Use this section when comparing import cabinets USA planning, container cabinet shipping, a 40 ft container cabinet order, cabinet import shipping timeline, Incoterms cabinets, FOB vs DAP cabinets, or import delivery responsibility before the final quote." })
			] }),
			/* @__PURE__ */ jsx("div", {
				className: "incoterms-grid",
				children: [
					["EXW", "Buyer takes responsibility from the named place of delivery."],
					["FOB", "Goods are delivered on board at the named port of loading; risk transfers once on board."],
					["CIF", "Cost, insurance, and freight are paid to the named destination port; risk transfers once on board."],
					["DAP", "Goods are delivered ready for unloading at the named destination; import clearance and unloading are buyer responsibilities unless agreed otherwise."],
					["DPU", "Goods are delivered and unloaded at the named destination."],
					["DDP", "Delivery includes import clearance and duties to the named destination when expressly agreed."]
				].map(([term, copy]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: term }), /* @__PURE__ */ jsx("span", { children: copy })] }, term))
			}),
			/* @__PURE__ */ jsx("p", {
				className: "terms-disclaimer",
				children: "These summaries are for planning only. Final responsibility, risk, cost, and delivery terms follow the agreed Incoterms® 2020 rule in the project quote."
			})
		]
	});
}
//#endregion
//#region src/pages/companyPages.jsx
function ContactPage({ navigate }) {
	const rows = [
		{
			label: "Email",
			value: contactDetails.email,
			href: `mailto:${contactDetails.email}`,
			Icon: Mail
		},
		{
			label: "Phone",
			value: contactDetails.phone,
			href: contactDetails.phoneHref,
			Icon: Phone$1
		},
		{
			label: "Office located in Longwood",
			value: contactDetails.address,
			Icon: MapPin$1
		},
		{
			label: "Business hours",
			value: contactDetails.hours,
			Icon: Clock$1
		},
		{
			label: "Review availability",
			value: contactDetails.appointmentText,
			Icon: Clock$1
		}
	];
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "review",
		eyebrow: "Contact Asina",
		title: "Contact Asina Global LLC for project supply review.",
		copy: "Use this page for verified business contact details, map location, and the first project-review request. Asina requests drawings and specs by email after the first fit check.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "contact-command-board",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "contact-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Our Office"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Reach Asina Global LLC directly in Longwood." }),
						/* @__PURE__ */ jsx("p", { children: "Asina Global LLC is based in Longwood, Florida and supports qualified project buyers in Florida and nationwide. Start with project basics first; the team follows up with the right next step by email or phone." }),
						/* @__PURE__ */ jsx("div", {
							className: "contact-method-grid",
							children: rows.map(({ label, value, href, external, Icon }) => {
								const content = /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx(Icon, { size: 18 }),
									/* @__PURE__ */ jsx("span", { children: label }),
									/* @__PURE__ */ jsx("strong", { children: value })
								] });
								return href ? /* @__PURE__ */ jsx("a", {
									className: "contact-method-card",
									href,
									target: external ? "_blank" : void 0,
									rel: external ? "noopener noreferrer" : void 0,
									children: content
								}, label) : /* @__PURE__ */ jsx("div", {
									className: "contact-method-card",
									children: content
								}, label);
							})
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "contact-map-panel",
					"aria-label": "Asina Global office map",
					children: [/* @__PURE__ */ jsx("iframe", {
						title: "Map showing Asina Global LLC office in Longwood, Florida",
						src: contactDetails.mapEmbedUrl,
						allowFullScreen: true,
						loading: "lazy",
						referrerPolicy: "no-referrer-when-downgrade"
					}), /* @__PURE__ */ jsxs("div", {
						className: "map-ticket",
						children: [
							/* @__PURE__ */ jsx("span", { children: "Longwood, Florida" }),
							/* @__PURE__ */ jsx("strong", { children: "151 Sabal Palm Dr" }),
							/* @__PURE__ */ jsx("p", { children: contactDetails.hours }),
							/* @__PURE__ */ jsx("a", {
								href: contactDetails.googleBusinessProfile,
								target: "_blank",
								rel: "noopener noreferrer",
								children: "Open Google Maps"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section contact-form-section",
				"aria-labelledby": "contact-form-title",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Project Basics",
					title: "Send the first review request from the contact page.",
					copy: "The form stays focused on project basics. If the project fits Asina's supply model, drawings, plans, specs, or furniture files move by email after the first review."
				}), /* @__PURE__ */ jsx(ProjectReviewForm, { originDossier: routeDossiers.contact })]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Contact Asina FAQ",
				items: [
					["What is the best first step?", "Start with the project basics form. If the project fits the supply model, Asina follows up by email or phone and requests detailed files by email."],
					["Can I call Asina Global LLC?", `Yes. Call ${contactDetails.phone} during business hours for project supply questions, or use the form when you want the details organized before follow-up.`],
					["Where is the office located?", "Asina Global LLC lists its office in Longwood, Florida at 151 Sabal Palm Dr, Longwood, FL 32779."],
					["Do you accept public file uploads?", "No. Asina requests drawings, plans, specs, brand standards, and furniture files by email after the first project fit check."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "contact",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function PrivacyPolicyPage({ navigate }) {
	const policyUpdated = "June 4, 2026";
	const policyCards = [
		[
			"01",
			"Information Asina collects",
			"When you send a project review or contact request, Asina Global LLC collects the details you provide: name, company, email, phone, project type, product category, project location, scale, timeline, and notes."
		],
		[
			"02",
			"How the information is used",
			"Asina uses submitted information to review project fit, respond by email or phone, request drawings or specs when appropriate, prepare supply discussions, coordinate quotes, and maintain business records."
		],
		[
			"03",
			"Files and drawings",
			"The public website form does not accept uploads. Drawings, plans, specs, furniture files, and brand standards are requested by email only after the first project fit check."
		],
		[
			"04",
			"Sharing and service providers",
			"Asina may share project information with service providers, logistics partners, suppliers, inspectors, or professional advisers only when needed for review, quoting, delivery, administration, or legal requirements."
		],
		[
			"05",
			"No sale of submitted information",
			"Asina Global LLC does not sell personal information submitted through the website. Information is used for business communication and project review, not public resale."
		],
		[
			"06",
			"Requests and contact",
			`To request an update, correction, or deletion of submitted information, contact Asina at ${contactDetails.email} or ${contactDetails.phone}.`
		]
	];
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "review",
		eyebrow: "Privacy Policy",
		title: "Privacy Policy",
		copy: "How Asina Global LLC handles project basics, contact details, and follow-up information submitted through this website.",
		navigate,
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "section privacy-policy-board",
				"aria-label": "Privacy policy overview",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Last Updated",
					title: "Project form information is used for project review and follow-up.",
					copy: `Last updated ${policyUpdated}. This policy applies to information submitted through asinaglobal.com, including project review and contact forms.`
				}), /* @__PURE__ */ jsx("div", {
					className: "privacy-policy-grid",
					children: policyCards.map(([number, title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "privacy-policy-card",
						delay: index * .035,
						children: [/* @__PURE__ */ jsx("span", { children: number }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section privacy-detail-board",
				"aria-label": "Privacy policy operating details",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "privacy-detail-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "section-label",
							children: "Policy Details"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Practical handling for project review data." }),
						/* @__PURE__ */ jsx("p", { children: "Asina uses form information to decide whether a project fits the supply model and to follow up with the right next step. If the project moves forward, more detailed files are requested by email and handled as part of the project review." }),
						/* @__PURE__ */ jsxs(RouteLink, {
							page: "contact",
							navigate,
							className: "button secondary compact",
							children: ["Contact Asina ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 16 })]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "privacy-detail-list",
					children: [
						["Technical data", "The website may collect basic technical data such as browser type, device information, pages visited, referral source, IP-related server logs, and security or performance information."],
						["Retention", "Asina keeps submitted information as long as needed for project review, follow-up, business records, dispute prevention, legal compliance, and normal administration."],
						["Email security", "Website forms and email are useful for project communication, but they are not guaranteed to be end-to-end encrypted. Do not send sensitive financial information through the public form."],
						["Business audience", "The site is intended for business, construction, development, procurement, design, restaurant, hospitality, and commercial project buyers. It is not directed to children."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "privacy-detail-item",
						delay: index * .04,
						children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 18 }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section privacy-contact-panel",
				"aria-label": "Privacy contact information",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "section-label",
						children: "Privacy Contact"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Questions or data requests go through Asina directly." }),
					/* @__PURE__ */ jsx("p", { children: "For privacy questions, correction requests, deletion requests, or business-record questions, contact Asina Global LLC using the details below." })
				] }), /* @__PURE__ */ jsxs("div", {
					className: "privacy-contact-grid",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: `mailto:${contactDetails.email}`,
							children: [
								/* @__PURE__ */ jsx(Mail, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "Email" }),
								/* @__PURE__ */ jsx("strong", { children: contactDetails.email })
							]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: contactDetails.phoneHref,
							children: [
								/* @__PURE__ */ jsx(Phone$1, { size: 18 }),
								/* @__PURE__ */ jsx("span", { children: "Phone" }),
								/* @__PURE__ */ jsx("strong", { children: contactDetails.phone })
							]
						}),
						/* @__PURE__ */ jsxs("span", { children: [
							/* @__PURE__ */ jsx(MapPin$1, { size: 18 }),
							/* @__PURE__ */ jsx("span", { children: "Office" }),
							/* @__PURE__ */ jsx("strong", { children: contactDetails.address })
						] })
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Privacy Policy FAQ",
				items: pageFaqs.privacy
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "privacy",
				navigate
			})
		]
	});
}
function AboutPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "about",
		eyebrow: "About Asina",
		title: "Project supply accountability, not sourcing guesswork.",
		copy: "Asina Global LLC supports builders, developers, procurement teams, and rollout buyers from project basics into drawing review, mockup approval, QA, packing, and shipping coordination.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "about-command-board",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "about-command-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "How Asina Works"
						}),
						/* @__PURE__ */ jsx("h2", { children: "One clear first review for project-scale supply." }),
						/* @__PURE__ */ jsx("p", { children: "Asina Global LLC is based in Longwood, Florida, within the Greater Orlando market, and coordinates qualified project work nationwide. The useful first conversation is not an ordinary contact request. It is a structured review of category, scale, location, timeline, drawings, finish direction, QA concerns, packing needs, and shipping responsibility." }),
						/* @__PURE__ */ jsxs("dl", { children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Base" }), /* @__PURE__ */ jsx("dd", { children: contactDetails.address })] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Email" }), /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("a", {
								href: `mailto:${contactDetails.email}`,
								children: contactDetails.email
							}) })] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Phone" }), /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("a", {
								href: contactDetails.phoneHref,
								children: contactDetails.phone
							}) })] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Google" }), /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx("a", {
								href: contactDetails.googleBusinessProfile,
								target: "_blank",
								rel: "noopener noreferrer",
								children: "Google Business Profile"
							}) })] })
						] })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "about-image-ledger",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: heroAssets.cabinetRoom,
						alt: "Cabinet project room prepared for product review",
						sizes: "(max-width: 920px) 92vw, 48vw",
						preferredWidth: 960
					}), /* @__PURE__ */ jsx("div", { children: [
						"Cabinets",
						"Countertops",
						"Furniture packages",
						"Mixed-category scope"
					].map((item) => /* @__PURE__ */ jsx("span", { children: item }, item)) })]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section about-team-board",
				"aria-label": "Asina Global founders",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "about-team-copy",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Founder Team"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Four founders, one accountable review path." }),
						/* @__PURE__ */ jsx("p", { children: "Chuck, Hai, Kim, and Andy keep the first review focused on fit, buyer coordination, supplier-of-record responsibility, and the next files Asina needs by email." })
					] }), /* @__PURE__ */ jsxs("div", {
						className: "about-team-meta",
						children: [
							/* @__PURE__ */ jsx("span", { children: "Founder-led" }),
							/* @__PURE__ */ jsx("span", { children: "Longwood, FL" }),
							/* @__PURE__ */ jsx("span", { children: "Email-first review" })
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "about-team-grid",
					children: siteDetails.leadership.map((person, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "about-team-card",
						delay: index * .04,
						"data-founder-index": String(index + 1).padStart(2, "0"),
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "about-founder-photo",
								"aria-label": person.photo ? void 0 : `${person.name} initials`,
								children: person.photo ? /* @__PURE__ */ jsx(ResponsiveImage, {
									src: person.photo,
									alt: `${person.name}, ${person.title} at ${siteDetails.name}`,
									sizes: "(max-width: 620px) 32vw, (max-width: 980px) 18vw, 13vw",
									width: person.photoWidth,
									height: person.photoHeight,
									style: {
										objectPosition: person.photoPosition ?? "center center",
										"--founder-photo-y": person.photoOffsetY ?? void 0,
										"--founder-photo-scale": person.photoScale ? String(person.photoScale) : void 0,
										"--founder-photo-hover-scale": person.photoHoverScale ? String(person.photoHoverScale) : void 0
									}
								}) : /* @__PURE__ */ jsx("span", { children: person.initials })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "about-founder-identity",
								children: [/* @__PURE__ */ jsx("h3", { children: person.name }), /* @__PURE__ */ jsx("strong", { children: person.title })]
							}),
							/* @__PURE__ */ jsx("p", { children: person.background }),
							/* @__PURE__ */ jsxs("div", {
								className: "about-founder-foot",
								children: [/* @__PURE__ */ jsx("span", { children: "Experience" }), /* @__PURE__ */ jsx("strong", { children: person.experience })]
							})
						]
					}, person.name))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section about-support",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Who Asina Supports",
					title: "Wholesale buyers first, with design influence where it improves production detail.",
					copy: "Asina qualifies serious project buyers without turning into a homeowner inspiration catalog."
				}), /* @__PURE__ */ jsx("div", {
					className: "about-support-grid",
					children: [
						["Builders + developers", "Multi-unit, development, commercial, and repeat-project buyers who need product facts before pricing."],
						["Procurement + project teams", "Purchasing managers, general contractors, owners, and project managers who need one organized review process."],
						["Designers + architects", "Design influence is useful when finish direction, layout intent, and specifications need to reach production cleanly."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "about-support-card",
						delay: index * .05,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("h3", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "about-principle-board",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "ledger-caption",
						children: "Operating Principles"
					}),
					/* @__PURE__ */ jsx("h2", { children: "Proof belongs where buyers make decisions." }),
					/* @__PURE__ */ jsx("p", { children: "Cost savings only work when specifications, finish references, mockups, QA checks, packing, and shipping responsibility are controlled before release." })
				] }), /* @__PURE__ */ jsx("div", {
					className: "about-principle-grid",
					children: [
						["Product facts before pricing", "Cabinet collections, slab codes, furniture requirements, and mixed-category scope are organized before pricing is finalized."],
						["Design intent translated", "Room use, finish direction, custom sizing, and brand standards become production notes where the project needs it."],
						["QA before shipment", "Mockup approval, built-to-spec checks, packing review, and shipping responsibility stay in view through the project."],
						["Source network protected", "Asina manages the supply model as supplier of record without exposing private production sources."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "about-principle",
						delay: index * .04,
						children: [
							/* @__PURE__ */ jsx(ShieldCheck, { size: 19 }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to prepare for the first Asina review",
					items: [
						"Project category",
						"Location",
						"Unit, store, or room count",
						"Timeline",
						"Material or finish direction",
						"Drawings ready for email follow-up"
					],
					note: "Start with project basics. Asina requests drawings, specs, plans, brand standards, or furniture files by email after the first review.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Accountability Model"
						}),
						/* @__PURE__ */ jsx("h2", { children: "One accountable supplier relationship." }),
						/* @__PURE__ */ jsx("p", { children: "Asina manages project communication, review logic, quality checkpoints, packing review, and shipping coordination through one supplier-of-record relationship. Buyers get a clear accountable process without private source disclosure." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "About Asina FAQ",
				items: [
					["Who is Asina built for?", "Builders, developers, procurement teams, general contractors, restaurant groups, franchise operators, and rollout buyers with project-scale or repeat-project needs."],
					["Is Asina a retail remodeling catalog?", "No. Asina shows cabinet, countertop, and furniture package options so qualified buyers can prepare a project review, not shop a cart."],
					["Does Asina disclose private production sources?", "No. Asina acts as supplier of record and does not disclose private production sources or supplier relationships."],
					["Can one project include multiple categories?", "Yes. Asina can review cabinets, countertops, and custom furniture packages together when one coordinated supply review helps the scope."],
					["What happens after project basics are sent?", "Asina reviews the details and follows up by email within 1-2 business days. If the project is a fit, Asina requests drawings or specs next."],
					["Where is Asina Global LLC based?", "Asina Global LLC is based in Longwood, Florida, in the Greater Orlando market, and can coordinate qualified project work nationwide."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "about",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function DesignSupportPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "design",
		eyebrow: "Design To Production Support",
		title: "Turn room intent into production-ready detail.",
		copy: "Use this review when layout, finish direction, custom sizing, brand standards, or mixed-category scope need production language before mockup approval and repeat production.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "design-support-board",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "design-support-lead",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Not A Style-Only Service"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Design support exists to make the project buildable." }),
						/* @__PURE__ */ jsx("p", { children: "Design support matters most when it is tied to the supply model: Asina reviews room intent, settles finish decisions, and turns the approved direction into notes a production team can read." })
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "design-support-grid",
					children: [
						["Layout + use review", "Asina reviews room function, seating layout, cabinet run, counter use, and product mix before production notes are written."],
						["Finish + material direction", "Cabinet finishes, slab codes, furniture materials, and brand requirements are matched where the package needs consistency."],
						["Custom sizing review", "Asina can review custom sizing or specifications based on category, drawings, minimums, and production feasibility."],
						["Production notes", "Approved direction becomes production-review language before mockup, sample, or repeat production."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "design-support-card",
						delay: index * .04,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("h3", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "support-path",
				children: [
					["Gather room intent", "Use case, layout, finish direction, brand standards, and rough quantities."],
					["Align product decisions", "Cabinet collections, slabs, furniture pieces, materials, and category mix."],
					["Translate to production detail", "Production-ready notes for review, quote development, and mockup planning."],
					["Confirm by mockup or sample", "Measurements, color, finish, materials, and details become the approved reference."]
				].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
					className: "support-step",
					delay: index * .04,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsx("h3", { children: title }),
						/* @__PURE__ */ jsx("p", { children: copy })
					]
				}, title))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to prepare for design-to-production review",
					items: [
						"Floor plans or seating layouts",
						"Finish or material direction",
						"Brand standards",
						"Room, unit, or store count",
						"Custom sizing notes",
						"Timeline"
					],
					note: "Asina requests files by email after the first review. The form stays focused on project basics and fit.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Production Translation"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Use design support before pricing is finalized." }),
						/* @__PURE__ */ jsx("p", { children: "This is most useful when a project crosses categories, needs finish matching, includes custom dimensions, or has franchise and brand requirements that need to survive the move from design language into production language." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Design To Production FAQ",
				items: [
					["Is this interior design?", "Not as a standalone decorating service. This is production support for projects that need layout, finish, custom sizing, or brand intent translated into supply-review detail."],
					["When should we use it?", "Use it before quote and production details become fixed, especially for mixed-category rooms, finish matching, restaurant packages, franchise standards, or custom dimensions."],
					["Can custom sizing be reviewed?", "Yes. Asina can review custom sizing and specifications by product category, drawings, order scale, minimums, and production feasibility."],
					["What files help the review?", "Floor plans, seating layouts, finish direction, brand standards, product references, chair or table files, unit or store counts, and timeline."],
					["How does it connect to mockup approval?", "The approved direction becomes the reference for mockup or sample review so measurements, color, finish, materials, and details are checked before repeat production."],
					["Do we upload files publicly?", "No. Asina requests drawings, specs, plans, brand standards, and furniture files by email after the first review."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "design",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function ProjectReviewPage({ originPage = "home", navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "review",
		eyebrow: "Start Project Review",
		title: "Project basics first. Drawings by email.",
		copy: "This form collects basics only. If the project fits Asina's supply model, Asina requests drawings by email within 1-2 business days.",
		children: [/* @__PURE__ */ jsx(ProjectReviewForm, { originDossier: routeDossiers[originPage] ?? routeDossiers.home }), /* @__PURE__ */ jsx(RelatedProjectPaths, {
			currentPage: "review",
			navigate
		})]
	});
}
//#endregion
//#region src/pages/resourcePages.jsx
function MultiUnitCabinetPackagesPage({ navigate }) {
	const inputs = [
		"Finish choice",
		"Room type",
		"Cabinet run",
		"Unit or room count",
		"Project location",
		"Timeline"
	];
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "multi-unit",
		eyebrow: "Multi-Unit Cabinet Packages",
		title: "Multi-Unit Cabinet Packages for Developers and Contractors in Florida",
		copy: "For developers building 10 to 200 units, Asina Global reviews cabinet packages from drawing set through mockup approval, production QA, and shipping coordination. Multifamily projects, phased builds, and repeat-room commercial work are the primary use case.",
		heroByline: /* @__PURE__ */ jsx(ArticleByline, {}),
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Project Fit"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Good cabinet procurement starts with repeatability." }),
						/* @__PURE__ */ jsx("p", { children: "This page is for project buyers comparing a multi-unit cabinet supplier, apartment cabinet packages, developer cabinet procurement, cabinet supplier for builders, commercial cabinet packages, commercial cabinet supply, or contractor cabinet supply. Asina reviews repeated rooms, units, phases, commercial spaces, and builder packages. It is not a retail kitchen cart or a discount cabinet page." }),
						/* @__PURE__ */ jsxs("p", { children: [
							"For cabinet supplier for apartment development Florida work, or wholesale cabinets for a 40-unit build Florida buyers can actually schedule, compare",
							" ",
							/* @__PURE__ */ jsx(RouteLink, {
								page: "supplier-guide",
								navigate,
								className: "copy-link",
								children: "wholesale cabinet suppliers in Central Florida"
							}),
							" ",
							"before choosing local stock, dealer supply, or a planned import package."
						] }),
						/* @__PURE__ */ jsxs("p", { children: [
							"Not sure which supplier model fits your project? See our guide on",
							" ",
							/* @__PURE__ */ jsx(RouteLink, {
								page: "supplier-guide",
								navigate,
								className: "copy-link",
								children: "how to choose a wholesale cabinet supplier for contractors and developers"
							}),
							"."
						] }),
						/* @__PURE__ */ jsx(RouteLink, {
							page: "cabinets",
							navigate,
							className: "button secondary",
							children: "Inspect Cabinet Collections"
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "input-check-grid",
					"aria-label": "Multi-unit cabinet quote inputs",
					children: inputs.map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "input-check",
						delay: index * .035,
						children: [
							/* @__PURE__ */ jsx(Check$1, { size: 16 }),
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: item })
						]
					}, item))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section cabinet-proof-board",
				"aria-label": "Multi-unit cabinet package proof board",
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "proof-board-media",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: heroAssets.cabinetRoom,
						alt: "Installed cabinet package reviewed for repeatable multi-unit supply",
						sizes: "(max-width: 920px) 92vw, 42vw",
						preferredWidth: 960
					}), /* @__PURE__ */ jsxs("div", {
						className: "proof-media-ticket",
						children: [/* @__PURE__ */ jsx("span", { children: "Repeat room packet" }), /* @__PURE__ */ jsx("strong", { children: "Finish, run, unit count, timeline" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "proof-board-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Cabinet Package Checks"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Every repeat room keeps the same approval reference." }),
						/* @__PURE__ */ jsx("div", {
							className: "proof-step-list",
							children: [
								["Project fit", "Apartments, developments, builder packages, and repeat commercial rooms."],
								["Construction review", "Framed vs frameless cabinets, cabinet face material, cabinet panel thickness, and finish family stay easy to check before pricing."],
								["Mockup approval", "A sample or mockup confirms measurements, color, finish, materials, and detail direction before repeat production."],
								["Container planning", "Asina reviews container-scale planning without public pricing or savings guarantees."]
							].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
								className: "proof-step",
								delay: index * .04,
								children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
							}, title))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to send for cabinet package review",
					items: inputs,
					note: "Asina starts with project basics, then requests drawings and cabinet runs by email after the first fit check.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Approval Path"
						}),
						/* @__PURE__ */ jsx("h2", { children: "From cabinet direction to repeat production." }),
						/* @__PURE__ */ jsx("p", { children: "Collection facts, finish direction, unit count, and room logic feed the mockup path. Approved details then become the reference for production QA, packing review, and shipping responsibility." }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [/* @__PURE__ */ jsx(RouteLink, {
								page: "process",
								navigate,
								children: "See process"
							}), /* @__PURE__ */ jsx(RouteLink, {
								page: "qa",
								navigate,
								children: "Review QA"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Multi-Unit Cabinet FAQ",
				items: [
					["What makes a cabinet order a fit?", "A strong fit is a repeatable room, unit, phase, venue, or builder package where Asina can review finish direction, cabinet run, and quantity together."],
					["Do you publish multi-unit pricing?", "No. Pricing depends on drawings, quantities, finishes, construction details, packing, shipping, and agreed project terms."],
					["Can Asina review cabinet collections before drawings?", "Yes. Start with the category, room type, finish direction, unit count, location, and timeline. Asina requests drawings by email after the first review."],
					["How does mockup approval help?", "A mockup or sample confirms measurements, color, finish, materials, and details before repeat production begins."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "multi-unit",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function DealerCabinetSupplyPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "dealer-supply",
		eyebrow: "Dealer + Distributor Supply",
		title: "Cabinet Wholesale Supply for Dealers and Distributors in Florida",
		copy: "Asina supplies Florida cabinet dealers, kitchen designers, and distributors with project-scale imported cabinets, quartz countertops, and furniture packages when the client scope has repeat volume and enough planning time.",
		navigate,
		actionPage: "review",
		breadcrumb: [
			{
				label: "Home",
				page: "home"
			},
			{
				label: "Resources",
				page: "importer-resources"
			},
			{ label: "Cabinet Wholesale Supply for Dealers" }
		],
		heroMeta: "Last updated June 2026 · Written by Chuck Tran, Asina Global LLC",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench dealer-fit-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Who This Is For"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Who This Is For" }),
						/* @__PURE__ */ jsx("p", { children: "This page is for cabinet dealers, kitchen designers, and distributors who resell to developer, commercial, or repeat-project clients. If the job is a single-family remodel that needs stock next week, a local RTA warehouse will usually be faster." }),
						/* @__PURE__ */ jsx(RouteLink, {
							page: "supplier-guide",
							navigate,
							className: "button secondary",
							children: "Compare local supplier models"
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "dealer-fit-grid",
					"aria-label": "Dealer supply buyer fit",
					children: [
						["Cabinet dealers", "For dealers supplying developer or commercial clients who need an import source with QA and shipping coordination included."],
						["Kitchen designers", "For designers with large project accounts who need container economics without managing overseas production alone."],
						["Distributors", "For distributors who want an import cabinet source for their network without building their own factory QA process."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "dealer-fit-row",
						delay: index * .04,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section dealer-supply-board",
				"aria-label": "What Asina supplies to dealers",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Dealer-Scale Supply",
					title: "What Asina Supplies to Dealers",
					copy: "This model fits repeat client scope, container-scale planning, or mixed-SKU project volume, not a single small order that needs pickup this week."
				}), /* @__PURE__ */ jsx("div", {
					className: "dealer-supply-grid",
					children: [
						["Cabinet collections", "Malibu, Monterey, Newport, Catalina, Laguna, and Jersey, with painted shaker and wood-tone finishes, 5/8-inch premium plywood where published, and soft-close hardware as the standard expectation."],
						["Quartz countertops", "Exotic, Natural, and Grain quartz slabs organized by code, movement, size, thickness, edge needs, and cutouts."],
						["Furniture packages", "Commercial furniture packages for restaurants, hospitality, franchise, outdoor, and repeat-location projects."],
						["Container planning", "Full or near-full 40ft equivalent volume is where value is strongest. Mixed-SKU containers can be reviewed when cabinets, slabs, and furniture are planned together."],
						["Custom sizing", "Reviewed when commercial drawings need cabinet dimensions a stock distributor does not carry."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "dealer-supply-row",
						delay: index * .035,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("h3", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section dealer-model-board",
				"aria-label": "Dealer wholesale supply model",
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "dealer-model-media",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: heroAssets.cabinetRoom,
						alt: "Cabinet package room reviewed for dealer wholesale supply",
						sizes: "(max-width: 920px) 92vw, 44vw",
						preferredWidth: 960
					}), /* @__PURE__ */ jsxs("div", {
						className: "proof-media-ticket",
						children: [/* @__PURE__ */ jsx("span", { children: "Dealer model" }), /* @__PURE__ */ jsx("strong", { children: "Client protected, project reviewed" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "dealer-model-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "How It Works"
						}),
						/* @__PURE__ */ jsx("h2", { children: "How the Dealer Supply Model Works" }),
						/* @__PURE__ */ jsx("p", { children: "Pricing is per project. There is no public dealer price list because specifications, quantities, mockup needs, packing, destination, and trade terms change the actual cost." }),
						/* @__PURE__ */ jsx("div", {
							className: "proof-step-list",
							children: [
								["Dealer brings the project", "Send the client scope, drawings, finish schedule, unit count, destination, and timeline."],
								["Asina reviews fit", "Asina checks product fit, sizing, lead time, mockup needs, QA, packing, and shipping responsibility."],
								["Mockup approval comes first", "A sample or mockup confirms sizing, finish, material direction, and details before a full run."],
								["Dealer sells through", "The dealer marks up to the client. Asina does not quote around a dealer relationship brought to us."]
							].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
								className: "proof-step",
								delay: index * .04,
								children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
							}, title))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section dealer-advantage-board",
				"aria-label": "Why dealers use an import source",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Why Dealers Use It",
					title: "Why Dealers Use an Import Source",
					copy: "A wholesale cabinet source for kitchen designers and dealers needs to protect the dealer relationship while still giving the project a serious QA path."
				}), /* @__PURE__ */ jsx("div", {
					className: "dealer-advantage-grid",
					children: [
						["Container economics", "For dealers running 20 or more repeat units, container-scale review can change the per-unit cost picture."],
						["Custom commercial sizing", "Project drawings sometimes need sizes that fixed stock distributors cannot supply."],
						["One source path", "Cabinets, countertops, and furniture can move through one supply review when the dealer manages a broader project package."],
						["QA ownership", "Asina's mockup, production QA, and packing review reduce the dealer's need to manage overseas oversight alone."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "dealer-advantage-item",
						delay: index * .035,
						children: [
							/* @__PURE__ */ jsx(Check$1, { size: 17 }),
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What a dealer should send first",
					items: [
						"Client project type",
						"Drawing set status",
						"Finish schedule",
						"Unit or room count",
						"Destination",
						"Timeline"
					],
					note: "Start with project basics. If the dealer-led scope fits, Asina requests drawings and specs by email after the first review.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Dealer CTA"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Bring the drawing set and project details." }),
						/* @__PURE__ */ jsx("p", { children: "Asina reviews whether the dealer project has the scale, timing, and repeatability to justify imported supply. Smaller dealer orders can be reviewed case by case when they connect to future volume." }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "rfq",
									navigate,
									children: "RFQ prep"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "qa",
									navigate,
									children: "QA + shipping"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "restaurant-furniture",
									navigate,
									children: "Restaurant + franchise furniture"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "review",
									navigate,
									children: "Start review"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Frequently Asked Questions",
				items: pageFaqs["dealer-supply"]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "dealer-supply",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function WholesaleCabinetSupplierGuidePage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "supplier-guide",
		eyebrow: "Wholesale Cabinet Supplier Guide",
		title: "How to Choose a Wholesale Cabinet Supplier for Contractors and Developers (2026)",
		copy: "Match the supplier model to order size, lead time, service level, and project fit before asking for a cabinet quote.",
		navigate,
		actionPage: "review",
		breadcrumb: [
			{
				label: "Home",
				page: "home"
			},
			{
				label: "Resources",
				page: "importer-resources"
			},
			{ label: "How to Choose a Wholesale Cabinet Supplier" }
		],
		heroMeta: "Last updated June 2026 · Written by Chuck Tran, Asina Global LLC",
		heroDisclosure: "Disclosure: Asina Global is a wholesale cabinet supplier. This guide is written for buyers evaluating any source, including us.",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "section guide-jump-board",
				"aria-label": "Wholesale cabinet supplier guide quick navigation",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "guide-jump-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Scan The Guide"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Pick the answer you need first." }),
						/* @__PURE__ */ jsx("p", { children: "Use the model list for sourcing strategy, the table for fast project fit, or the questions section before a supplier quote becomes a commitment." })
					]
				}), /* @__PURE__ */ jsx("nav", {
					className: "guide-jump-list",
					"aria-label": "Supplier guide sections",
					children: [
						[
							"#supplier-models",
							"Supplier models",
							"RTA, stock, showroom, import, dealer"
						],
						[
							"#supplier-project-table",
							"Project fit table",
							"Match project type to model"
						],
						[
							"#supplier-questions",
							"Questions to ask",
							"Check risk before committing"
						],
						[
							"#supplier-faq",
							"FAQ",
							"Lead time, tariffs, containers"
						]
					].map(([href, label, copy], index) => /* @__PURE__ */ jsxs("a", {
						href,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: label }),
							/* @__PURE__ */ jsx("em", { children: copy })
						]
					}, href))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-direct-answer",
				"aria-label": "Wholesale cabinet supplier guide introduction",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "comparison-answer-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Project Fit"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Choosing the wrong model costs time and money." }),
						/* @__PURE__ */ jsx("p", { children: "This guide maps the five supplier models that exist in Central Florida, explains which fits which project, and gives you the questions to ask before committing to any source." })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "comparison-disclosure-card",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Guide scope" }),
						/* @__PURE__ */ jsx("strong", { children: "Five supplier models, five project types." }),
						/* @__PURE__ */ jsx("p", { children: "Compare order size, lead time, service level, project fit, and who owns the review." })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "supplier-models",
				className: "section supplier-profile-stack",
				"aria-label": "The five wholesale cabinet supplier models",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Supplier Models",
					title: "The Five Wholesale Cabinet Supplier Models",
					copy: "Each model can be useful. The right answer depends on project type, order scale, lead time, and how much review support the buyer needs."
				}), [
					{
						title: "1. RTA Warehouse Suppliers",
						intro: "What they are: Wholesale warehouses that stock ready-to-assemble (RTA) cabinet boxes. You pick up or receive delivery and your crew assembles on site.",
						bestFor: "Best for: Remodelers, small contractors, and restoration companies that need fast in-stock inventory and handle their own assembly.",
						leadTime: "Lead time: Days to a few weeks, depending on in-stock availability.",
						gap: "What they don't offer: Drawing review, custom sizing, production QA, countertop or furniture packages, or project coordination services. You buy a box. What happens after is on you.",
						fit: "Right fit if: Your jobs are single-family or light multi-unit, you assemble on site, and turnaround speed matters more than custom specs or service depth."
					},
					{
						title: "2. Assembled Stock Wholesalers (Dealer Model)",
						intro: "What they are: Wholesale suppliers that sell pre-assembled cabinets primarily to cabinet dealers and resellers. Pricing and access are structured for dealers who mark up to their own clients.",
						bestFor: "Best for: Cabinet dealers, kitchen designers with repeat residential clients, and remodelers who want assembled product without a showroom markup.",
						leadTime: "Lead time: Often same-day to one week for in-stock items.",
						gap: "What they don't offer: Drawing-to-production services, custom sizing, or project-level coordination. Product is stock dimensions from a fixed catalog.",
						fit: "Right fit if: You're a dealer reselling to clients, or a contractor who wants assembled stock without the retail premium."
					},
					{
						title: "3. Showroom Chains",
						intro: "What they are: National or regional showroom brands that sell cabinets with a design consultation experience. Primarily retail-oriented, with some contractor programs.",
						bestFor: "Best for: Homeowners, house flippers, and small contractors whose clients want to walk in, see the product, and get a kitchen design.",
						leadTime: "Lead time: Stock items typically ship within 10 days. Made-to-order items take longer.",
						gap: "What they don't offer: Container-scale economics, multi-unit procurement workflows, or project-level drawing review.",
						fit: "Right fit if: Your client is a homeowner or small investor who wants a design consultation and fast delivery on a single kitchen."
					},
					{
						title: "4. Import Project Suppliers",
						intro: "What they are: Wholesale suppliers who source cabinets directly from overseas manufacturers, coordinate production to a drawing set, and manage QA and shipping before the product reaches the US. This is Asina Global's model.",
						bestFor: "Best for: Multi-unit developers, commercial contractors, franchise rollout buyers, and procurement teams who work from a drawing set and need container-scale quantities with production oversight included.",
						leadTime: "Lead time: 8-14 weeks from drawing approval and deposit.",
						gap: "What they offer that others don't: Drawing review before production, custom sizing for commercial applications, mockup approval before the full run, QA and packing inspection before the container loads, shipping coordination with Incoterms planning, and countertop and furniture packages from the same supplier.",
						fit: "Right fit if: Your project has a drawing set, a finish schedule, 10 or more units, and a timeline that accommodates import lead times."
					},
					{
						title: "5. Cabinet Dealer Supply (Supplier to Suppliers)",
						intro: "What they are: A subset of import project suppliers, like Asina Global, who also supply Florida cabinet dealers and distributors who in turn supply developer or commercial clients.",
						bestFor: "Best for: Cabinet dealers in Florida who supply larger project accounts and want container-scale import pricing without managing their own overseas QA.",
						leadTime: "How it works: The dealer manages the client relationship. The import supplier quotes, produces, inspects, and ships. The dealer marks up to their client. The import supplier does not contact the dealer's clients directly.",
						gap: "Right fit if: You're a dealer whose client base includes developers or commercial buyers, and stock distributor pricing is eating your margin on larger jobs.",
						fit: null,
						dealerLink: true
					}
				].map((model, index) => /* @__PURE__ */ jsxs(Reveal, {
					className: `supplier-profile supplier-profile-${index + 1}`,
					delay: index * .04,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: model.title }), /* @__PURE__ */ jsx("p", { children: model.intro })] }),
						/* @__PURE__ */ jsxs("dl", { children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Best for" }), /* @__PURE__ */ jsx("dd", { children: model.bestFor.replace(/^Best for:\s*/, "") })] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Lead time" }), /* @__PURE__ */ jsx("dd", { children: model.leadTime.replace(/^Lead time:\s*/, "") })] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Fit signal" }), /* @__PURE__ */ jsx("dd", { children: model.fit ? model.fit.replace(/^Right fit if:\s*/, "") : model.gap.replace(/^Right fit if:\s*/, "") })] })
						] }),
						/* @__PURE__ */ jsx("p", { children: model.gap }),
						model.dealerLink && /* @__PURE__ */ jsxs("p", { children: [
							"Dealers who supply larger project accounts can",
							" ",
							/* @__PURE__ */ jsx(RouteLink, {
								page: "dealer-supply",
								navigate,
								className: "copy-link",
								children: "review Asina's dealer supply model here"
							}),
							"."
						] })
					]
				}, model.title))]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "supplier-project-table",
				className: "section comparison-table-section",
				"aria-label": "Supplier model versus project type",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Quick Reference",
					title: "Quick Reference: Supplier Model vs Project Type",
					copy: "Use this as the first filter before asking any supplier for a quote."
				}), /* @__PURE__ */ jsx("div", {
					className: "supplier-comparison-table-scroll",
					role: "region",
					"aria-label": "Supplier model versus project type table",
					tabIndex: 0,
					children: /* @__PURE__ */ jsxs("table", {
						className: "supplier-comparison-table",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Your project"
						}), /* @__PURE__ */ jsx("th", {
							scope: "col",
							children: "Best supplier model"
						})] }) }), /* @__PURE__ */ jsx("tbody", { children: [
							["Single-family remodel, 1-3 kitchens", "RTA warehouse or showroom chain"],
							["Multi-unit build, 10-200 units", "Import project supplier"],
							["Commercial renovation: restaurant, franchise, hospitality", "Import project supplier"],
							["Cabinet dealer supplying residential clients", "Assembled stock wholesaler"],
							["Cabinet dealer supplying developer / commercial clients", "Import project supplier (dealer supply model)"],
							["Fast restocking for active remodel business", "RTA warehouse"],
							["Homeowner or flip with design consultation need", "Showroom chain"]
						].map(([project, model]) => /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("th", {
							scope: "row",
							children: project
						}), /* @__PURE__ */ jsx("td", { children: model })] }, project)) })]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "supplier-questions",
				className: "section importer-question-matrix seo-guide-matrix",
				"aria-label": "Questions to ask wholesale cabinet suppliers",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Before Committing",
					title: "Questions to Ask Any Wholesale Cabinet Supplier Before Committing",
					copy: "The questions below separate catalog sellers from project suppliers before the schedule is at risk."
				}), /* @__PURE__ */ jsx("div", {
					className: "importer-question-grid",
					children: [
						["1. Do you review drawings before I place an order?", "RTA warehouses and showroom chains sell from a catalog. There is no drawing review. Import project suppliers like Asina Global review your drawing set before production to confirm fit, sizing, and lead time. If your project has a drawing set, this matters."],
						["2. What is your lead time from order placement to delivery at my site?", "Stock suppliers quote days to two weeks. Import suppliers quote weeks to months. Make sure the lead time fits your project schedule before you commit. For multi-unit developments, plan cabinet delivery 2-3 weeks ahead of installation start."],
						["3. Do you offer mockup approval before the full production run?", "Only import project suppliers typically offer this. A mockup lets you verify finish direction, construction quality, and sizing before the full container runs. If a mistake is caught at mockup, it costs a few weeks. If it is caught on delivery, it costs months."],
						["4. Who handles QA at the factory?", "With RTA warehouses and stock distributors, QA is the manufacturer's process. You have no visibility into it. With Asina Global's model, QA is a step we manage on your behalf before the container is packed."],
						["5. What are your shipping terms and who handles US-side delivery?", "Incoterms such as FOB, CIF, DAP, and DDP define where responsibility transfers. Know which terms you want before you sign a proposal."],
						["6. Can you supply countertops and furniture from the same order?", "Most cabinet-only suppliers cannot. If your project needs cabinets, quartz countertop slabs, and custom furniture packages, sourcing all three from one supplier reduces coordination overhead significantly."],
						["7. What is the minimum order size for your pricing to make sense?", "RTA warehouses have no stated minimum. Import project suppliers are most economical at container scale. If your project is below that threshold, import pricing may not beat local stock alternatives. A good supplier will tell you this honestly."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "importer-question-card",
						delay: index * .035,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("h3", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy }),
							index === 4 && /* @__PURE__ */ jsx(RouteLink, {
								page: "shipping-responsibility",
								navigate,
								className: "copy-link",
								children: "Read the shipping responsibility guide"
							})
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "section comparison-summary-board",
				"aria-label": "Central Florida sourcing market",
				children: /* @__PURE__ */ jsxs("div", {
					className: "comparison-summary-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Central Florida Market"
						}),
						/* @__PURE__ */ jsx("h2", { children: "What Makes Central Florida a Distinct Sourcing Market" }),
						/* @__PURE__ */ jsx("p", { children: "Central Florida has a concentration of RTA warehouse operations serving the residential remodel market. For developers and commercial buyers, the picture is different. The import project supply model, drawing review, mockup approval, and container-scale QA, is less represented locally." }),
						/* @__PURE__ */ jsx("p", { children: "Asina Global is based in Longwood, FL and operates the import project supply model locally: a Florida point of contact for projects that ship from overseas." })
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-choice-board",
				"aria-label": "Wholesale cabinet supplier guide summary",
				children: [
					/* @__PURE__ */ jsx(SectionIntro, {
						eyebrow: "Summary",
						title: "No supplier model is right for every project.",
						copy: "The right question is not which supplier is cheapest. It is which model matches the project workflow."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "comparison-choice-grid",
						children: [
							"RTA warehouse: fast, in-stock, you assemble. Right for remodelers and light contractors.",
							"Assembled stock wholesaler: assembled product, dealer pricing. Right for dealers and residential contractors.",
							"Showroom chain: design experience, retail model. Right for homeowners and small flips.",
							"Import project supplier: drawing review, QA, container scale. Right for developers and commercial buyers.",
							"Dealer supply model: import pricing for dealers whose clients run projects."
						].map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
							className: "comparison-choice-row",
							delay: index * .035,
							children: [
								/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
								/* @__PURE__ */ jsx("strong", { children: item.split(":")[0] }),
								/* @__PURE__ */ jsx("p", { children: item.slice(item.indexOf(":") + 1).trim() })
							]
						}, item))
					}),
					/* @__PURE__ */ jsxs("p", { children: [
						"If your project fits the import project supplier model,",
						" ",
						/* @__PURE__ */ jsx(RouteLink, {
							page: "review",
							navigate,
							className: "copy-link",
							children: "start a project review with Asina Global"
						}),
						" ",
						"and bring your drawing set."
					] })
				]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				id: "supplier-faq",
				title: "Frequently Asked Questions",
				items: pageFaqs["supplier-guide"]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-related-pages",
				"aria-label": "Related resources",
				children: [
					/* @__PURE__ */ jsx(SectionIntro, {
						eyebrow: "Related Resources",
						title: "Keep the sourcing decision connected to project details.",
						copy: "Use these pages after the supplier model is clear enough to prepare drawings, quantities, lead-time questions, and quote inputs."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "pathway-ledger related-path-ledger",
						children: [
							[
								"multi-unit",
								"Multi-unit cabinet packages",
								"how Asina structures cabinet supply for repeatable rooms and phased builds"
							],
							[
								"import-vs-domestic",
								"Import vs domestic cabinets: cost comparison",
								"full breakdown of per-unit cost picture"
							],
							[
								"landed-cost",
								"Landed cost for imported cabinets",
								"what landed cost actually includes beyond FOB product price"
							],
							[
								"shipping-responsibility",
								"Cabinet import shipping responsibility",
								"FOB, CIF, DAP, DDP explained"
							],
							[
								"imported-quality",
								"Imported cabinet quality and QA",
								"how quality is managed through mockup, production checks, and packing review"
							],
							[
								"dealer-supply",
								"Cabinet wholesale supply for dealers",
								"dealer supply model for project-scale cabinet accounts"
							],
							[
								"container-economics",
								"How many kitchens fit in a 40ft container",
								"container loading and order scale planning"
							],
							[
								"review",
								"Start a project review",
								"bring your drawing set, unit count, and timeline"
							]
						].map(([page, label, copy], index) => /* @__PURE__ */ jsx(Reveal, {
							className: "pathway-row related-path-row",
							delay: index * .035,
							children: /* @__PURE__ */ jsxs(RouteLink, {
								page,
								navigate,
								children: [
									/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
									/* @__PURE__ */ jsx(FileText$1, { size: 20 }),
									/* @__PURE__ */ jsx("strong", { children: label }),
									/* @__PURE__ */ jsx("p", { children: copy }),
									/* @__PURE__ */ jsx("em", { children: "Related resource" }),
									/* @__PURE__ */ jsx(ArrowRight$1, { size: 17 })
								]
							})
						}, page))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "page-footer-note",
						children: "Page last reviewed: June 2026. Written by Chuck Tran, Asina Global LLC, Longwood, FL."
					})
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "supplier-guide",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function WholesaleCabinetSupplierComparisonPage({ navigate }) {
	const supplierRows = [
		{
			supplier: "Asina Global LLC",
			profileTitle: "Project-Scale Import Wholesale (Longwood, FL)",
			model: "Project-scale import wholesale",
			fit: "Developers, contractors, dealers, and commercial buyers with repeat scope.",
			lead: "Import timeline, reviewed by project and approval path.",
			note: "Best fit when mockup approval, QA, packing review, and supplier-of-record support matter."
		},
		{
			supplier: "ELLIE Cabinetry and More",
			profileTitle: "RTA Wholesale Warehouse (Orlando, FL)",
			model: "RTA wholesale warehouse",
			fit: "Contractors who need local cabinet stock or faster warehouse access.",
			lead: "Confirm stock and pickup timing directly.",
			note: "Good comparison point for Orlando RTA wholesale cabinet searches."
		},
		{
			supplier: "KitchenCrest Cabinets",
			profileTitle: "RTA Warehouse (Orlando, FL)",
			model: "RTA warehouse",
			fit: "Contractors, remodelers, and local buyers comparing stock RTA cabinet options.",
			lead: "Confirm inventory and lead time directly.",
			note: "Useful when speed and local availability matter more than import planning."
		},
		{
			supplier: "ROC Cabinetry",
			profileTitle: "Assembled Wholesale (Tampa, FL)",
			model: "Assembled wholesale cabinet supply",
			fit: "Buyers comparing assembled cabinet supply around the Tampa/Central Florida market.",
			lead: "Confirm current program and delivery timing directly.",
			note: "A relevant alternative when assembled supply is the main buying requirement."
		},
		{
			supplier: "Cabinets To Go",
			profileTitle: "Showroom Retail with Contractor Program (FL Showrooms)",
			model: "Showroom retail with contractor program",
			fit: "Contractors or buyers who want showroom access and a national retail footprint.",
			lead: "Confirm contractor terms and location timing directly.",
			note: "Better fit for retail showroom browsing than container-scale project import review."
		}
	];
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "supplier-comparison",
		eyebrow: "Central Florida Supplier Comparison",
		title: "Wholesale Cabinet Suppliers in Central Florida — Compared for Contractors (2026)",
		copy: "Compare five supplier models before choosing a cabinet path for contractor, developer, dealer, or repeat commercial work.",
		navigate,
		actionPage: "review",
		breadcrumb: [
			{
				label: "Home",
				page: "home"
			},
			{
				label: "Resources",
				page: "importer-resources"
			},
			{ label: "Wholesale Cabinet Suppliers in Central Florida" }
		],
		heroMeta: "Last updated June 2026 · Written by Chuck Tran, Asina Global LLC",
		heroDisclosure: "Disclosure: Asina Global LLC is one of the five suppliers compared on this page.",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-direct-answer",
				"aria-label": "Wholesale cabinet supplier comparison direct answer",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "comparison-answer-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Quick Answer"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Choose the buying model before you compare price." }),
						/* @__PURE__ */ jsx("p", { children: "Local RTA warehouses can be the faster choice for stock and small orders. Asina Global LLC fits repeat projects that need import planning, mockup approval, QA, packing review, and supplier-of-record accountability. A contractor comparing ELLIE Cabinetry vs Asina Global, KitchenCrest alternatives Florida, or ROC Cabinetry alternatives Florida should start with project type and timeline before asking for a price." })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "comparison-disclosure-card",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Fair-use note" }),
						/* @__PURE__ */ jsx("strong", { children: "No fabricated pricing." }),
						/* @__PURE__ */ jsx("p", { children: "Competitor pricing, inventory, and lead times change. Confirm current terms directly with each supplier." })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-table-section",
				"aria-label": "Quick comparison table",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Supplier Models",
					title: "Quick Comparison Table",
					copy: "Five supplier models are compared by best-fit buyer, lead-time signal, and where each option tends to make sense."
				}), /* @__PURE__ */ jsx("div", {
					className: "supplier-comparison-table-scroll",
					role: "region",
					"aria-label": "Wholesale cabinet suppliers Central Florida comparison",
					tabIndex: 0,
					children: /* @__PURE__ */ jsxs("table", {
						className: "supplier-comparison-table",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Supplier"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Model"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Best fit"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Lead-time signal"
							}),
							/* @__PURE__ */ jsx("th", {
								scope: "col",
								children: "Project note"
							})
						] }) }), /* @__PURE__ */ jsx("tbody", { children: supplierRows.map((row) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								scope: "row",
								children: row.supplier
							}),
							/* @__PURE__ */ jsx("td", { children: row.model }),
							/* @__PURE__ */ jsx("td", { children: row.fit }),
							/* @__PURE__ */ jsx("td", { children: row.lead }),
							/* @__PURE__ */ jsx("td", { children: row.note })
						] }, row.supplier)) })]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench comparison-audience-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Who This Is For"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Who This Comparison Is For" }),
						/* @__PURE__ */ jsx("p", { children: "This guide is for project buyers comparing wholesale cabinet suppliers in Central Florida, including Orlando contractor cabinet searches, bulk cabinet supplier Central Florida searches, and wholesale cabinet supply Florida contractor research." }),
						/* @__PURE__ */ jsx("p", { children: "This is not a ranking of who is cheapest. It is a model comparison: stock speed, warehouse access, assembled supply, showroom support, and project-scale import review." })
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "input-check-grid comparison-fit-grid",
					children: [
						"Contractor order",
						"Developer package",
						"Dealer resale",
						"Commercial repeat rooms"
					].map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "input-check comparison-fit-check",
						delay: index * .035,
						children: [
							/* @__PURE__ */ jsx(Check$1, { size: 16 }),
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: item })
						]
					}, item))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "section supplier-profile-stack",
				"aria-label": "Central Florida wholesale cabinet supplier profiles",
				children: supplierRows.map((row, index) => /* @__PURE__ */ jsxs(Reveal, {
					className: `supplier-profile supplier-profile-${index + 1}`,
					delay: index * .04,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", { children: [
							index + 1,
							". ",
							row.supplier,
							" — ",
							row.profileTitle
						] }), /* @__PURE__ */ jsx("p", { children: row.note })] }),
						/* @__PURE__ */ jsxs("dl", { children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Model" }), /* @__PURE__ */ jsx("dd", { children: row.model })] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Best fit" }), /* @__PURE__ */ jsx("dd", { children: row.fit })] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Lead-time signal" }), /* @__PURE__ */ jsx("dd", { children: row.lead })] })
						] })
					]
				}, row.supplier))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-choice-board",
				"aria-label": "How to choose based on project type",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "How To Choose Based On Project Type",
					title: "How to Choose Based on Project Type",
					copy: "The right lane changes when the project moves from stock availability to repeat volume, mockup approval, or dealer-led resale."
				}), /* @__PURE__ */ jsx("div", {
					className: "comparison-choice-grid",
					children: [
						[
							"Urgent single job",
							"Local stock or showroom route",
							"Speed matters more than container economics."
						],
						[
							"Small contractor order",
							"RTA or assembled local supplier",
							"The order may not justify import overhead."
						],
						[
							"20+ repeat units",
							"Asina project review or other project-scale path",
							"Repeat volume can support mockup, QA, packing, and freight planning."
						],
						[
							"Dealer-managed client project",
							"Dealer supply route",
							"The dealer needs client protection and one import source to answer for the path."
						],
						[
							"Multi-category package",
							"Asina mixed-scope review",
							"Cabinets, slabs, furniture, QA, and shipping can sit in one review."
						]
					].map(([project, likely, reason], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "comparison-choice-row",
						delay: index * .035,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: project }),
							/* @__PURE__ */ jsx("p", { children: likely }),
							/* @__PURE__ */ jsx("em", { children: reason })
						]
					}, project))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-summary-board",
				"aria-label": "Wholesale cabinet supplier comparison summary",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "comparison-summary-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Summary"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Summary" }),
						/* @__PURE__ */ jsx("p", { children: "A local RTA warehouse, an assembled cabinet wholesaler, a showroom program, and a project-scale import supplier solve different problems. If the work is urgent or small, local stock may win. If the work repeats across units, rooms, stores, or phases, compare local wholesale cabinet suppliers against the full cost picture: approvals, QA, packing, freight, responsibility, and who owns the review." })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "inline-link-row",
					children: [
						/* @__PURE__ */ jsx(RouteLink, {
							page: "dealer-supply",
							navigate,
							children: "Dealer supply"
						}),
						/* @__PURE__ */ jsx(RouteLink, {
							page: "multi-unit",
							navigate,
							children: "Multi-unit cabinets"
						}),
						/* @__PURE__ */ jsx(RouteLink, {
							page: "import-vs-domestic",
							navigate,
							children: "Import vs domestic"
						}),
						/* @__PURE__ */ jsx(RouteLink, {
							page: "review",
							navigate,
							children: "Start review"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Frequently Asked Questions",
				items: pageFaqs["supplier-comparison"]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section comparison-related-pages",
				"aria-label": "Related pages on Asina Global",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Related Pages On Asina Global",
					title: "Continue from comparison into the right project path.",
					copy: "Use these pages when the supplier model is clear enough to prepare project details."
				}), /* @__PURE__ */ jsx("div", {
					className: "pathway-ledger related-path-ledger",
					children: [
						[
							"dealer-supply",
							"Wholesale cabinet supply for dealers",
							"Dealer-led import supply for resellers, designers, and distributors."
						],
						[
							"multi-unit",
							"Multi-unit cabinet packages",
							"Repeatable cabinet runs for developers, builders, and apartment projects."
						],
						[
							"import-vs-domestic",
							"Import vs domestic cabinet cost",
							"Compare speed, scale, landed cost, QA, and responsibility."
						],
						[
							"shipping-responsibility",
							"Cabinet import shipping responsibility",
							"FOB, CIF, DAP, DDP — know Incoterms before committing to a supplier."
						],
						[
							"imported-quality",
							"Imported cabinet quality and QA",
							"Mockup approval, production checks, and packing review before the container loads."
						],
						[
							"restaurant-furniture",
							"Restaurant and franchise furniture packages",
							"Commercial furniture for restaurants, hospitality, and franchise rollout projects."
						],
						[
							"commercial-mixed",
							"Commercial cabinet + countertop supply",
							"Review cabinets and slabs together when the project scope overlaps."
						]
					].map(([page, label, copy], index) => /* @__PURE__ */ jsx(Reveal, {
						className: "pathway-row related-path-row",
						delay: index * .035,
						children: /* @__PURE__ */ jsxs(RouteLink, {
							page,
							navigate,
							children: [
								/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
								/* @__PURE__ */ jsx(FileText$1, { size: 20 }),
								/* @__PURE__ */ jsx("strong", { children: label }),
								/* @__PURE__ */ jsx("p", { children: copy }),
								/* @__PURE__ */ jsx("em", { children: "Next path" }),
								/* @__PURE__ */ jsx(ArrowRight$1, { size: 17 })
							]
						})
					}, page))
				})]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "supplier-comparison",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function RestaurantFranchiseFurniturePackagesPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "restaurant-furniture",
		eyebrow: "Restaurant + Franchise Furniture Packages",
		title: "Furniture packages for restaurants and rollouts.",
		copy: "Asina reviews furniture packages around store count, quantity, brand standards, floor plan, finish direction, mockup approval, packing, and shipping.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench restaurant-furniture-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Not A Furniture Store"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Package review comes before item-by-item shopping." }),
						/* @__PURE__ */ jsx("p", { children: "A restaurant or franchise furniture package starts with the room plan, quantities, brand rules, finish direction, and timeline. Pricing makes sense after those inputs are clear. The first approved package becomes the reference for later locations." }),
						/* @__PURE__ */ jsx(RouteLink, {
							page: "furniture",
							navigate,
							className: "button secondary",
							children: "View Furniture Category"
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "document-slice-stack",
					children: [
						["Store count", "How many locations, phases, rooms, or rollout groups need review."],
						["Quantity estimate", "Seating counts, table counts, table bases, stools, benches, booths, or custom pieces."],
						["Brand requirements", "Finish direction, material references, durability needs, and brand standards."],
						["Floor plan", "Room layout, seating layout, traffic flow, and special sizing notes."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "document-slice",
						delay: index * .04,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "section rollout-proof-wall",
				"aria-label": "Restaurant and franchise furniture rollout package proof",
				children: furnitureCases.map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
					className: `rollout-proof-card ${index === 0 ? "featured" : ""}`,
					delay: index * .05,
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: item.image,
						alt: `${item.title} furniture package reference`,
						sizes: index === 0 ? "(max-width: 920px) 92vw, 48vw" : "(max-width: 920px) 92vw, 28vw",
						preferredWidth: index === 0 ? 960 : 640
					}), /* @__PURE__ */ jsxs("div", {
						className: "rollout-proof-copy",
						children: [
							/* @__PURE__ */ jsx("span", { children: item.scale }),
							/* @__PURE__ */ jsx("h3", { children: item.title }),
							/* @__PURE__ */ jsx("p", { children: item.path }),
							/* @__PURE__ */ jsx("ul", { children: item.packet.map((packetItem) => /* @__PURE__ */ jsx("li", { children: packetItem }, packetItem)) })
						]
					})]
				}, item.title))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to send for restaurant and franchise package review",
					items: [
						"Store count",
						"Quantity estimate",
						"Brand requirements",
						"Floor plan",
						"Finish direction",
						"Timeline"
					],
					note: "Asina requests furniture files, detailed plans, and brand standards by email after the first fit check.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Rollout Logic"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Repeat locations change the review." }),
						/* @__PURE__ */ jsx("p", { children: "A first package can become the reference for later locations when brand standards, measurements, finish direction, and sample approval are clear before repeat production." }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [/* @__PURE__ */ jsx(RouteLink, {
								page: "design",
								navigate,
								children: "Design support"
							}), /* @__PURE__ */ jsx(RouteLink, {
								page: "process",
								navigate,
								children: "Process"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Restaurant + Franchise Furniture FAQ",
				items: [
					["What projects fit this page?", "Restaurants, franchise rollouts, commercial venues, outdoor areas, and repeat-location furniture packages."],
					["What furniture can Asina review?", "Asina can review tables, chairs, stools, table bases, benches, booths, outdoor groups, and custom branded pieces by project fit."],
					["Do you show a public furniture menu?", "No. Examples show package direction. Pricing and production depend on quantities, materials, finish direction, minimums, packing, and shipping."],
					["When is a sample needed?", "A sample or mockup is useful when dimensions, color, finish, material, comfort, or brand consistency needs confirmation before repeat production."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "restaurant-furniture",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function RFQProcurementResourcesPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "rfq",
		eyebrow: "RFQ Procurement Resources",
		title: "A cleaner RFQ starts before the drawings.",
		copy: "Use this page to separate the cabinet, countertop, and furniture package inputs that affect quote quality, lead time, mockup review, and production readiness.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsx(ResourceByline, {
				pageId: "rfq",
				navigate
			}),
			/* @__PURE__ */ jsx("section", {
				className: "procurement-checklists",
				"aria-label": "RFQ checklist workbench",
				children: [
					["Cabinet RFQ", [
						"Finish choice",
						"Room type",
						"Cabinet run",
						"Unit or room count",
						"Location",
						"Timeline"
					]],
					["Countertop RFQ", [
						"Slab name or code",
						"Square footage",
						"Edge profile",
						"Sink or cooktop cutouts",
						"Destination",
						"Timeline"
					]],
					["Furniture Package RFQ", [
						"Store count",
						"Quantity estimate",
						"Brand requirements",
						"Floor plan",
						"Finish direction",
						"Timeline"
					]]
				].map(([title, items], index) => /* @__PURE__ */ jsxs(Reveal, {
					className: "procurement-checklist",
					delay: index * .05,
					children: [
						/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
						/* @__PURE__ */ jsx("h2", { children: title }),
						/* @__PURE__ */ jsx("ul", { children: items.map((item) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Check$1, { size: 15 }), item] }, item)) })
					]
				}, title))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "No Public Uploads"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Project basics come first. Files move by email after review." }),
						/* @__PURE__ */ jsx("p", { children: "The public form should not become a public file drop. Asina first checks whether the project is a fit for the supply model, then requests drawings, specs, brand standards, or furniture files by email." })
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "input-check-grid",
					children: [
						"Scope changes",
						"Finish changes",
						"Quantity changes",
						"Destination changes",
						"Timeline changes",
						"Packing needs"
					].map((item, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "input-check",
						delay: index * .03,
						children: [
							/* @__PURE__ */ jsx(FileText$1, { size: 16 }),
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: item })
						]
					}, item))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to include in the first request",
					items: [
						"Product category",
						"Project location",
						"Unit, store, or room count",
						"Timeline",
						"Material or finish direction",
						"Notes on shipping or packing needs"
					],
					note: "Keep the first request simple. If the project is a fit, Asina follows up by email for drawings and specs.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Procurement Handoff"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Useful RFQ content stays on the page." }),
						/* @__PURE__ */ jsx("p", { children: "The checklists are written for buyers and crawlers. Downloads can be added later, but the core RFQ guidance should remain available without a gate. Procurement teams can use it as an RFQ for cabinets, an RFQ kitchen cabinet supplier checklist, a cabinet RFI template, an RFP commercial furniture prompt, an RFQ commercial furniture starting point, or a procurement risk reduction checklist before requesting cabinet quote details." })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rfq-form-embed",
				"aria-labelledby": "rfq-form-title",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rfq-form-heading",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Request For Quote"
						}),
						/* @__PURE__ */ jsx("h2", {
							id: "rfq-form-title",
							children: "Start the quote request from this page."
						}),
						/* @__PURE__ */ jsx("p", { children: "Share the project basics first. If the project is a fit for Asina's supply model, the team follows up by email within 1-2 business days to request drawings, specs, brand standards, or furniture files. The same path supports RFQ kitchen cabinets, request quote cabinets, request cabinet quote, and cabinet, countertop, or furniture package questions without public uploads." })
					]
				}), /* @__PURE__ */ jsx(ProjectReviewForm, { originDossier: routeDossiers.rfq })]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "RFQ Resources FAQ",
				items: [
					["Should drawings be uploaded here?", "No. Start with project basics. Asina requests drawings and specs by email after the first review."],
					["What affects pricing most?", "Quantity, finish direction, material, product category, custom sizing, packing, shipping destination, timeline, and approved details."],
					["Can one RFQ include multiple categories?", "Yes. Asina can review cabinets, countertops, and furniture packages together when one organized review helps the project."],
					["Is this a bid template download?", "The checklist is available directly on the page. Downloadable templates can support it later, but the main guidance stays on the page."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "rfq",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function ProjectSupplyImporterResourcesPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "importer-resources",
		eyebrow: "Project Supply Importer Resources",
		title: "Plan the import questions before quote review.",
		copy: "Use this buyer guide to organize landed cost, order scale, lead time, QA, packing, and shipping responsibility before cabinet, countertop, or furniture package pricing starts.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsx(ResourceByline, {
				pageId: "importer-resources",
				navigate
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench importer-planning-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Buyer Planning"
						}),
						/* @__PURE__ */ jsx("h2", { children: "The strongest quote starts before a line item is priced." }),
						/* @__PURE__ */ jsx("p", { children: "Builders, developers, procurement teams, restaurant groups, franchise buyers, and commercial project teams rarely get a useful quote from a product number alone. The first review needs the cost picture, order size, container fit, lead time, quality path, packing plan, damage documentation, and shipping responsibility." }),
						/* @__PURE__ */ jsx("p", { children: "This is not a legal or tax guide. It is a practical checklist for sending better project basics so Asina can review fit, request the right files by email, and prepare a cleaner Project Supply Review." }),
						/* @__PURE__ */ jsxs("p", { children: [
							"If the first question is who to call locally, start with",
							" ",
							/* @__PURE__ */ jsx(RouteLink, {
								page: "supplier-guide",
								navigate,
								className: "copy-link",
								children: "wholesale cabinet suppliers in Central Florida"
							}),
							" ",
							"before narrowing the project to import planning, local stock, or dealer supply."
						] }),
						/* @__PURE__ */ jsxs("p", { children: [
							"See also:",
							" ",
							/* @__PURE__ */ jsx(RouteLink, {
								page: "supplier-guide",
								navigate,
								className: "copy-link",
								children: "how to choose a wholesale cabinet supplier"
							}),
							", with five supplier models compared by project type and lead time."
						] }),
						/* @__PURE__ */ jsx(RouteLink, {
							page: "rfq",
							navigate,
							className: "button secondary",
							children: "Use The RFQ Checklist"
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "input-check-grid importer-planning-checks",
					"aria-label": "Project supply importer planning checks",
					children: [
						["Landed cost picture", "Product scope, freight, packing, handling, delivery, and responsibility level."],
						["Order scale", "Full container, mixed styles, phased quantities, or smaller trial review tied to future volume."],
						["Lead-time fit", "Production timing, transit planning, phase needs, site deadlines, and backup timing."],
						["QA documentation", "Sample approval, finish checks, packing photos, count review, and damage documentation."],
						["Shipping responsibility", "Plain-language responsibility first, with Incoterms® 2020 terms only where useful."],
						["Category mix", "Cabinets, countertops, furniture packages, or a combined project request."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "input-check importer-check",
						delay: index * .03,
						children: [
							/* @__PURE__ */ jsx(Check$1, { size: 16 }),
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section importer-question-matrix",
				"aria-label": "Project supply buyer questions",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Buyer Questions",
					title: "The questions buyers ask before imported supply makes sense.",
					copy: "These questions usually decide whether imported project supply is practical: cost picture, order scale, timing, quality, and responsibility."
				}), /* @__PURE__ */ jsx("div", {
					className: "importer-question-grid",
					children: [
						{
							title: "Landed cost",
							lead: "A low unit price does not help if the rest of the project cost is still unclear. Start with product scope, freight, packing, handling, delivery, and responsibility.",
							questions: [
								"What is included in the quote besides the product itself?",
								"Which shipping, handling, packing, or delivery items should the buyer expect?",
								"How early should landed cost be estimated for a build schedule?"
							]
						},
						{
							title: "MOQ and container economics",
							lead: "Volume can help, but the first order still has to fit the project. Review container needs, mixed styles, phases, and trial quantities before pricing is locked.",
							questions: [
								"Do I need a full container to start?",
								"Can styles, sizes, or SKUs be mixed in one project package?",
								"How do I avoid excess inventory on a first order?"
							]
						},
						{
							title: "Lead time and phasing",
							lead: "Lead time has to match the construction calendar. Discuss production timing, transit planning, and site readiness before approving the project.",
							questions: [
								"How far ahead should a builder plan supply?",
								"Can deliveries be phased around project milestones?",
								"What happens to the schedule if freight timing moves?"
							]
						},
						{
							title: "Quality and compliance documents",
							lead: "Imported product can work well at project scale when the approval path is written down. Include samples, finish checks, packing photos, and required documents in the review.",
							questions: [
								"How is quality reviewed before shipment?",
								"Which documents should Asina request for CARB, TSCA, FSC, or KCMA needs?",
								"How are finish, measurement, and packing details confirmed?"
							]
						},
						{
							title: "Domestic versus import",
							lead: "The useful comparison is practical: value, consistency, schedule fit, accountability, and whether the project has enough scale to justify the longer planning path.",
							questions: [
								"When is imported supply worth the longer planning path?",
								"Can imported packages stay consistent across repeat units or locations?",
								"Should a project use domestic stock for urgent needs and import for volume?"
							]
						},
						{
							title: "Shipping responsibility",
							lead: "Set shipping responsibility before freight language enters the quote.",
							questions: [
								"Which responsibility level fits a new buyer?",
								"What do FOB, CIF, DAP, DPU, or DDP change in the review?",
								"Who documents visible damage or missing pieces when goods arrive?"
							]
						}
					].map((group, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "importer-question-card",
						delay: index * .04,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("h3", { children: group.title }),
							/* @__PURE__ */ jsx("p", { children: group.lead }),
							/* @__PURE__ */ jsx("ul", { children: group.questions.map((question) => /* @__PURE__ */ jsx("li", { children: question }, question)) })
						]
					}, group.title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section related-paths resource-topic-rail",
				"aria-label": "Project supply resource guides",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Resource Guides",
					title: "Each buyer question has a deeper planning page.",
					copy: "Use these pages when a project needs more detail before the RFQ or Project Review."
				}), /* @__PURE__ */ jsx("div", {
					className: "pathway-ledger related-path-ledger",
					children: [
						[
							"container-economics",
							"40ft container cabinet loading",
							"Plan cabinet box count, mixed SKUs, packing, and full-container fit before pricing."
						],
						[
							"landed-cost",
							"Landed cost for imported cabinets",
							"Separate product scope, packing, freight, handling, delivery, and responsibility."
						],
						[
							"shipping-responsibility",
							"Cabinet import shipping terms",
							"Compare FOB, CIF, DAP, DPU, and DDP planning language before quote review."
						],
						[
							"imported-quality",
							"Imported cabinet quality and QA",
							"Review materials, mockup approval, production checks, packing, and documents."
						],
						[
							"lead-times",
							"Cabinet lead times for builders",
							"Plan drawings, mockup approval, production, QA, freight, site readiness, and phasing."
						],
						[
							"import-vs-domestic",
							"Import vs domestic cabinets",
							"Compare speed, scale, cost picture, QA, repeatability, and accountability."
						]
					].map(([page, label, copy], index) => /* @__PURE__ */ jsx(Reveal, {
						className: "pathway-row related-path-row",
						delay: index * .035,
						children: /* @__PURE__ */ jsxs(RouteLink, {
							page,
							navigate,
							children: [
								/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
								/* @__PURE__ */ jsx(FileText$1, { size: 20 }),
								/* @__PURE__ */ jsx("strong", { children: label }),
								/* @__PURE__ */ jsx("p", { children: copy }),
								/* @__PURE__ */ jsx("em", { children: "Guide / FAQ / project review" }),
								/* @__PURE__ */ jsx(ArrowRight$1, { size: 17 })
							]
						})
					}, page))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section importer-handoff-board",
				"aria-label": "Project supply importer handoff",
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "importer-handoff-media",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: heroAssets.environment,
						alt: "Project supply review environment for landed cost and shipping responsibility planning",
						sizes: "(max-width: 920px) 92vw, 44vw",
						preferredWidth: 960
					}), /* @__PURE__ */ jsxs("div", {
						className: "proof-media-ticket",
						children: [/* @__PURE__ */ jsx("span", { children: "Review packet" }), /* @__PURE__ */ jsx("strong", { children: "Scope before quote, files after fit check" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "importer-handoff-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "How Asina Uses It"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Planning questions make the project handoff safer." }),
						/* @__PURE__ */ jsx("p", { children: "Buyers often compare imported supply with domestic availability, tight schedules, and quality risk. Asina reviews those questions in one place, with supplier-of-record accountability and no private source disclosure." }),
						/* @__PURE__ */ jsx("div", {
							className: "proof-step-list",
							children: [
								["Buyer sends", "Category, quantity, destination, timeline, material direction, packing needs, and any document requirements."],
								["Asina reviews", "Fit, scale, quote inputs, sample needs, QA checkpoints, packing path, and shipping responsibility."],
								["Files move later", "Asina requests drawings, plans, specs, brand standards, and detailed furniture files by email after the first fit check."],
								["Quote improves", "Pricing can reflect a cleaner scope because the main buyer questions were handled before numbers are finalized."]
							].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
								className: "proof-step",
								delay: index * .04,
								children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
							}, title))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to send before an importer-style review",
					items: [
						"Product category",
						"Quantity or phase count",
						"Destination",
						"Timeline",
						"Material or finish direction",
						"Packing or document requirements"
					],
					note: "Keep the first message practical. If the project is a fit, drawings, plans, specs, and supporting files move by email after initial review.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Next Review"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Use this guide before the RFQ or project review." }),
						/* @__PURE__ */ jsx("p", { children: "Landed cost, container economics, MOQ, cabinet lead time, imported cabinet quality, Incoterms planning, and import versus domestic comparison questions all affect the first quote. Use this page to sort those items before choosing the category page or starting Project Review." }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "qa",
									navigate,
									children: "Review QA"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "process",
									navigate,
									children: "See process"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "review",
									navigate,
									children: "Start review"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Project Supply Importer FAQ",
				items: [
					["What is landed cost in a project supply review?", "Landed cost is the working cost picture after product scope, freight, packing, handling, delivery, and responsibility level sit in one review. It gives buyers a clearer start than a low unit price that leaves major project costs outside the first quote."],
					["Do I need a full container to start?", "Not always. Full-container planning usually gives the strongest value, but Asina can review smaller trial runs when they connect to future multi-unit, franchise, commercial, or repeat-project volume."],
					["Can styles or SKUs be mixed in one project package?", "Often yes, but the mix affects packing, container fit, count review, and quote quality. Send the expected styles, sizes, quantities, and phases before drawings move by email."],
					["How far ahead should a builder plan supply?", "Plan as early as possible once unit count, finish direction, and construction timing are known. Production, sample approval, freight planning, and jobsite readiness all affect the schedule."],
					["What happens if shipment timing changes?", "Asina reviews schedule risk during the project review. Buyers should share milestone dates, phase priorities, and any critical handoff dates before quote approval."],
					["How does Asina review quality before shipment?", "The path starts with drawings or specs by email, then sample or mockup approval where needed, production checks against approved details, packing review, and shipment-readiness documentation."],
					["Who is responsible if product is damaged in transit?", "Responsibility depends on the agreed quote and shipping terms. Buyers should document visible damage, count issues, and packing concerns immediately so Asina can review the claim path."],
					["Do I need to manage Incoterms myself?", "Not at the first step. Start with the practical responsibility level you want. Asina can discuss common Incoterms® 2020 terms during quote review when precision is needed."],
					["Can Asina review a smaller first order?", "Yes, if it connects to future project volume. Smaller orders may not carry the same cost advantage after freight, packing, and handling, so the next phase should be clear."],
					["Can cabinets, countertops, and furniture be reviewed together?", "Yes. Mixed-scope projects can start in one Project Supply Review when the categories, quantities, destination, timeline, and file needs are clear."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "importer-resources",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function BuyerQuestionGuidePage({ guideId, navigate }) {
	const guide = buyerQuestionGuides[guideId];
	const faqItems = pageFaqs[guideId] ?? [];
	if (!guide) return null;
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: guideId,
		eyebrow: guide.eyebrow,
		title: guide.title,
		copy: guide.copy,
		heroLeadLabel: guide.heroLeadLabel,
		heroExtraCopy: guide.heroExtraCopy,
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsx(ResourceByline, {
				pageId: guideId,
				navigate
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench seo-guide-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Direct Answer"
						}),
						/* @__PURE__ */ jsx("h2", { children: guide.answerTitle }),
						/* @__PURE__ */ jsx("p", { children: guide.answerCopy }),
						/* @__PURE__ */ jsx("div", {
							className: "guide-route-strip",
							"aria-label": `${guide.eyebrow} review sequence`,
							children: guide.checks.slice(0, 4).map(([title], index) => /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { children: String(index + 1).padStart(2, "0") }), title] }, title))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "importer-resources",
									navigate,
									children: "Buyer guide"
								}),
								guideId === "import-vs-domestic" && /* @__PURE__ */ jsx(RouteLink, {
									page: "supplier-guide",
									navigate,
									children: "Compare local wholesale cabinet suppliers"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "rfq",
									navigate,
									children: "RFQ checklist"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "review",
									navigate,
									children: "Start review"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "input-check-grid importer-planning-checks",
					"aria-label": `${guide.eyebrow} planning checks`,
					children: guide.checks.map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "input-check importer-check",
						delay: index * .03,
						children: [
							/* @__PURE__ */ jsx(Check$1, { size: 16 }),
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			guideId === "import-vs-domestic" && /* @__PURE__ */ jsx(ImportVsDomesticCostSection, { navigate }),
			/* @__PURE__ */ jsxs("section", {
				className: "section importer-question-matrix seo-guide-matrix",
				"aria-label": `${guide.eyebrow} buyer questions`,
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Buyer Questions",
					title: guide.matrixTitle,
					copy: guide.matrixCopy
				}), /* @__PURE__ */ jsx("div", {
					className: "importer-question-grid",
					children: guide.cards.map((card, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "importer-question-card",
						delay: index * .04,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("h3", { children: card.title }),
							/* @__PURE__ */ jsx("p", { children: card.lead }),
							/* @__PURE__ */ jsx("ul", { children: card.questions.map((question) => /* @__PURE__ */ jsx("li", { children: question }, question)) })
						]
					}, card.title))
				})]
			}),
			guideId === "import-vs-domestic" && /* @__PURE__ */ jsx(PageFAQ, {
				title: guide.faqTitle,
				items: faqItems
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section importer-handoff-board seo-guide-proof",
				"aria-label": `${guide.eyebrow} project handoff`,
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "importer-handoff-media",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						src: guide.image,
						alt: guide.mediaAlt,
						sizes: "(max-width: 920px) 92vw, 44vw",
						preferredWidth: 960
					}), /* @__PURE__ */ jsxs("div", {
						className: "proof-media-ticket",
						children: [/* @__PURE__ */ jsx("span", { children: "Review packet" }), /* @__PURE__ */ jsx("strong", { children: guide.eyebrow })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "importer-handoff-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "How Asina Uses It"
						}),
						/* @__PURE__ */ jsx("h2", { children: guide.proofTitle }),
						/* @__PURE__ */ jsx("p", { children: guide.proofCopy }),
						/* @__PURE__ */ jsx("div", {
							className: "proof-step-list",
							children: guide.proofRows.map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
								className: "proof-step",
								delay: index * .04,
								children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
							}, title))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier seo-guide-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: guide.whatTitle,
					items: guide.whatItems,
					note: guide.whatNote,
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Next Review"
						}),
						/* @__PURE__ */ jsx("h2", { children: guide.handoffTitle }),
						/* @__PURE__ */ jsx("p", { children: guide.handoffCopy }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "cabinets",
									navigate,
									children: "Cabinets"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "qa",
									navigate,
									children: "QA + shipping"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "review",
									navigate,
									children: "Project Review"
								})
							]
						})
					]
				})]
			}),
			guideId !== "import-vs-domestic" && /* @__PURE__ */ jsx(PageFAQ, {
				title: guide.faqTitle,
				items: faqItems
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "importer-resources",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function OrlandoCommercialProjectSupplyPage({ navigate }) {
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "orlando",
		eyebrow: "Orlando-Area Project Supply",
		title: "Commercial supply support from Florida to nationwide projects.",
		copy: "Asina Global LLC supports Greater Orlando, Florida, and qualified nationwide commercial buyers from its Longwood office with project review, QA, packing, and shipping coordination.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "local-proof-board",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Office Location"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Office in Longwood. Project review nationwide." }),
						/* @__PURE__ */ jsx("p", { children: "Asina Global LLC's office is in Longwood, within the Greater Orlando market. Orlando-area and Florida buyers can start here when they need cabinet packages, quartz countertops, or furniture packages for commercial and repeat-project work. Qualified nationwide projects can use the same review process. The public address stays exact for NAP and schema." })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "address-ticket",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Office located in Longwood" }),
						/* @__PURE__ */ jsx("strong", { children: contactDetails.address }),
						/* @__PURE__ */ jsx("p", { children: "Submit project basics online. Asina Global LLC requests drawings and specs by email after the first review." }),
						/* @__PURE__ */ jsx("a", {
							href: contactDetails.googleBusinessProfile,
							target: "_blank",
							rel: "noopener noreferrer",
							children: "Open Google Business Profile"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench local-service-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Greater Orlando Fit"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Local intent only helps when the project is actually commercial." }),
						/* @__PURE__ */ jsx("p", { children: "This page is not built for retail showroom browsing or discount cabinet sale traffic. It is for Orlando-area builders, developers, procurement teams, restaurant groups, franchise buyers, and repeat commercial teams that need a focused supply review before drawings and specs move by email." }),
						/* @__PURE__ */ jsx("p", { children: "Nearby project areas can include Longwood, Lake Mary, Altamonte Springs, Sanford, Winter Garden, Kissimmee, Lake Nona, and the broader Central Florida market when the project is a fit for Asina Global LLC's supply model." })
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "input-check-grid importer-planning-checks",
					children: [
						["Commercial cabinets", "Multi-unit, development, builder, and repeat-room cabinet package review."],
						["Quartz surfaces", "Countertop and slab review by code, square footage, edge needs, and destination."],
						["Furniture packages", "Restaurant, franchise, venue, and rollout package planning by quantity and brand direction."],
						["Supply controls", "Mockup approval, QA, packing review, and shipping responsibility are handled in the quote review."]
					].map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "input-check importer-check",
						delay: index * .03,
						children: [
							/* @__PURE__ */ jsx(MapPin$1, { size: 16 }),
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section local-supply-routes",
				"aria-label": "Orlando-area commercial supply routes",
				children: [/* @__PURE__ */ jsx(Reveal, {
					className: "local-supply-scene globe-scene",
					children: /* @__PURE__ */ jsx(FloridaGlobePanel, {})
				}), /* @__PURE__ */ jsx("div", {
					className: "local-route-list",
					children: [
						{
							title: "Cabinet packages",
							copy: "Repeatable cabinet packages for Orlando-area builders, developers, and commercial rooms.",
							page: "cabinets",
							signal: "Cabinet Review"
						},
						{
							title: "Countertop supply",
							copy: "Quartz and surface packages reviewed by slab code, square footage, edge needs, and destination.",
							page: "countertops",
							signal: "Slab Review"
						},
						{
							title: "Furniture packages",
							copy: "Restaurant, franchise, venue, and rollout furniture packages reviewed by quantity and brand direction.",
							page: "restaurant-furniture",
							signal: "Rollout Review"
						},
						{
							title: "QA + shipping",
							copy: "Asina reviews mockup approval, QA, packing review, and responsibility planning together.",
							page: "qa",
							signal: "QA Proof"
						}
					].map((service, index) => /* @__PURE__ */ jsx(Reveal, {
						className: "local-route-card",
						delay: index * .04,
						children: /* @__PURE__ */ jsxs(RouteLink, {
							page: service.page,
							navigate,
							children: [
								/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
								/* @__PURE__ */ jsx("strong", { children: service.title }),
								/* @__PURE__ */ jsx("p", { children: service.copy }),
								/* @__PURE__ */ jsxs("em", { children: [service.signal, /* @__PURE__ */ jsx(ArrowRight$1, { size: 15 })] })
							]
						})
					}, service.title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What Florida and nationwide buyers should send first",
					items: [
						"Project category",
						"Project location",
						"Unit, store, or room count",
						"Timeline",
						"Material or finish direction",
						"Shipping or delivery needs"
					],
					note: "Asina follows up by email when the project appears to fit the supply model.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Service Reach Fit"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Nationwide review stays tied to real project scope." }),
						/* @__PURE__ */ jsx("p", { children: "Asina connects Florida and qualified nationwide inquiries to concrete supply decisions: cabinets, countertops, custom furniture packages, QA, packing review, and shipping coordination." }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "cabinets",
									navigate,
									children: "Cabinets"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "countertops",
									navigate,
									children: "Countertops"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "restaurant-furniture",
									navigate,
									children: "Commercial Furniture"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Orlando Project Supply FAQ",
				items: [
					["Is Asina Global LLC located in Orlando?", "Asina Global LLC's office is in Longwood, Florida, within the Greater Orlando market. NAP and schema use the same business address."],
					["What Orlando-area projects fit?", "Multi-unit, commercial, development, franchise, restaurant, and repeat-project supply inquiries are usually the best fit."],
					["Is Asina an Orlando RTA cabinets warehouse?", "No. Buyers comparing Orlando RTA cabinets or RTA cabinets Orlando should know Asina is a project-supply review company, not an in-stock retail warehouse."],
					["Does Asina review nearby commercial searches?", "Yes, when the project is a fit. Asina can review Longwood cabinet supplier, Longwood project supply, Longwood furniture supplier, Altamonte Springs cabinet packages, Altamonte Springs commercial cabinet supplier, and Lake Mary cabinet supplier inquiries for commercial or repeat-project work."],
					["Is this a cheap cabinets Orlando or kitchen cabinets sale page?", "No. Asina is not built around discount retail sale language. Pricing depends on drawings, quantities, finishes, construction details, packing, shipping, and agreed project terms."],
					["Can Asina Global LLC review projects outside Florida?", "Yes. Asina Global LLC can review qualified nationwide commercial and project-scale inquiries when the scope fits the supply model."],
					["Does Asina operate like a local showroom?", "No. The public process starts with project basics, then drawings and specs by email when the project is a fit."],
					["Can cabinets, countertops, and furniture be reviewed together?", "Yes. Mixed-category projects can start through the same Project Review when one coordinated review makes sense."]
				]
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: "orlando",
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
function CommercialIntentPage({ pageId, navigate }) {
	const page = commercialIntentPages[pageId];
	const faqs = pageFaqs[pageId] ?? [];
	if (!page) return null;
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: pageId,
		eyebrow: page.eyebrow,
		title: page.title,
		copy: page.copy,
		heroByline: pageId === "commercial-mixed" ? /* @__PURE__ */ jsx(ArticleByline, {}) : null,
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "commercial-workbench intent-workbench",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "commercial-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: page.introEyebrow
						}),
						/* @__PURE__ */ jsx("h2", { children: page.introTitle }),
						/* @__PURE__ */ jsx("p", { children: page.introCopy }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "rfq",
									navigate,
									children: "RFQ checklist"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "process",
									navigate,
									children: "Process"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "review",
									navigate,
									children: "Start review"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "intent-scope-stack",
					"aria-label": `${page.eyebrow} project fit`,
					children: page.scopes.map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "intent-scope-row",
						delay: index * .035,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("strong", { children: title }),
							/* @__PURE__ */ jsx("p", { children: copy })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section quote-input-workbench",
				"aria-label": `${page.eyebrow} quote inputs`,
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Quote Inputs",
					title: "Separate the details that change price, timing, and responsibility.",
					copy: "The first request needs to give Asina enough context to decide whether drawings, specs, plans, or brand files move by email."
				}), /* @__PURE__ */ jsx("div", {
					className: "quote-input-grid",
					children: page.inputGroups.map(([title, items], index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "quote-input-card",
						delay: index * .04,
						children: [
							/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ jsx("h3", { children: title }),
							/* @__PURE__ */ jsx("ul", { children: items.map((item) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Check$1, { size: 15 }), item] }, item)) })
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section intent-proof-board",
				"aria-label": `${page.eyebrow} comparison proof`,
				children: [/* @__PURE__ */ jsx(Reveal, {
					className: `intent-proof-media ${page.media === heroAssets.slab ? "is-full-slab-media" : ""}`,
					children: /* @__PURE__ */ jsx(ResponsiveImage, {
						className: page.media === heroAssets.slab ? "intent-proof-image full-slab" : "intent-proof-image",
						src: page.media,
						alt: page.mediaAlt,
						sizes: "(max-width: 920px) 92vw, 44vw",
						preferredWidth: 960
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "intent-proof-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Buyer Comparison"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Compare Asina on project control, not retail shelf browsing." }),
						/* @__PURE__ */ jsx("div", {
							className: "proof-step-list",
							children: page.proofRows.map(([title, copy], index) => /* @__PURE__ */ jsxs(Reveal, {
								className: "proof-step",
								delay: index * .04,
								children: [/* @__PURE__ */ jsx("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("p", { children: copy })] })]
							}, title))
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: `What to send for ${page.eyebrow.toLowerCase()}`,
					items: page.whatItems,
					note: "Start with project basics. Asina requests drawings, specs, plans, or brand files by email after the first fit check.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Project Handoff"
						}),
						/* @__PURE__ */ jsx("h2", { children: page.handoffTitle }),
						/* @__PURE__ */ jsx("p", { children: page.handoffCopy }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "cabinets",
									navigate,
									children: "Cabinets"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "countertops",
									navigate,
									children: "Countertops"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "qa",
									navigate,
									children: "QA + shipping"
								}),
								pageId === "commercial-mixed" && /* @__PURE__ */ jsx(RouteLink, {
									page: "supplier-guide",
									navigate,
									children: "See how local suppliers compare"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: `${page.eyebrow} FAQ`,
				items: faqs
			}),
			/* @__PURE__ */ jsx(RelatedProjectPaths, {
				currentPage: pageId,
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate })
		]
	});
}
//#endregion
//#region src/pages/collectionPages.jsx
var getCabinetCollectionHeroAlt = (collection) => `${collection.name} ${collection.style_family.toLowerCase()} cabinet collection with ${collection.panel_thickness}`;
var getCountertopCollectionHeroAlt = (collection) => {
	const codeFromHeroImage = collection.hero.image.match(/(?:^|[-_])(\d{4})(?:[-_.]|$)/)?.[1];
	const heroSlab = collection.slabs?.find((slab) => slab.code === codeFromHeroImage);
	if (heroSlab) return `${heroSlab.name} ${collection.name.toLowerCase()} quartz slab ${heroSlab.code} hero view`;
	return collection.lifestyle_images?.find((image) => image.image === collection.hero.image)?.alt ?? `${collection.name} quartz slab collection with ${collection.behavior.toLowerCase()}`;
};
function CabinetCollectionSeoPage({ pageId, navigate }) {
	const collectionKey = cabinetCollectionRouteMap[pageId];
	const collection = cabinets_default.collections.find((item) => item.key === collectionKey);
	const faqs = pageFaqs[pageId] ?? [];
	const [zoomImage, setZoomImage] = useState$1(null);
	const faceMaterial = (finish) => finish.specs?.Faces ?? finish.specs?.Wood ?? finish.specs?.Color ?? finish.specs?.Colors ?? "Reviewed during project supply review.";
	const compactSpecValue = (value) => {
		if (!value) return value;
		const text = String(value);
		const lower = text.toLowerCase();
		if (lower.includes("3/4-inch premium plywood")) return "3/4\" Premium plywood";
		if (lower.includes("5/8-inch premium plywood")) return "5/8\" Premium plywood";
		return text.replace(/softclose/gi, "soft-close");
	};
	const finishFacts = (finish) => {
		const specs = finish.specs ?? {};
		return [
			["Face", faceMaterial(finish)],
			["Frame", specs.Frame],
			["Panel", specs.Panels ?? specs["3/4-inch Panels"]],
			["Close", specs.Tracks ?? specs.Hinges],
			["Drawer", specs.Drawers],
			["Interior", specs.Interior],
			["Vanity", specs.Vanities]
		].filter(([, value]) => Boolean(value)).slice(0, 6).map(([label, value]) => [label, compactSpecValue(value)]);
	};
	const bestFit = collection?.details.find((detail) => detail.label === "Best fit")?.value ?? "Repeatable cabinet packages and project-scale rooms.";
	if (!collection) return null;
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: pageId,
		eyebrow: `${collection.name} Cabinet Collection`,
		title: `${collection.name} cabinets organized by finish, construction, and project fit.`,
		copy: `Asina reviews ${collection.name} with ${collection.panel_thickness}, ${collection.style_family.toLowerCase()} direction, finish options, face material, quote inputs, and mockup needs before pricing.`,
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "section collection-inspection-board cabinet-collection-board",
				"aria-label": `${collection.name} cabinet collection facts`,
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "collection-inspection-media",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						className: "collection-portrait-image",
						src: collection.hero.image,
						alt: getCabinetCollectionHeroAlt(collection),
						sizes: "(max-width: 920px) 92vw, 34vw",
						preferredWidth: 1280
					}), /* @__PURE__ */ jsxs("div", {
						className: "proof-media-ticket",
						children: [/* @__PURE__ */ jsx("span", { children: collection.name }), /* @__PURE__ */ jsxs("strong", { children: [
							collection.line,
							", ",
							collection.panel_thickness
						] })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "collection-inspection-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Collection Facts"
						}),
						/* @__PURE__ */ jsx("h2", { children: collection.hero.headline }),
						/* @__PURE__ */ jsx("p", { children: collection.hero.body }),
						/* @__PURE__ */ jsxs("dl", {
							className: "collection-fact-list",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Line" }), /* @__PURE__ */ jsx("dd", { children: collection.line })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Panel platform" }), /* @__PURE__ */ jsx("dd", { children: collection.panel_thickness })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Style" }), /* @__PURE__ */ jsx("dd", { children: collection.style_family })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Best fit" }), /* @__PURE__ */ jsx("dd", { children: bestFit })] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section finish-inspection-grid",
				"aria-label": `${collection.name} cabinet finishes`,
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Finish Options",
					title: "Finish choice stays tied to face material and quote context.",
					copy: "Use the finish name, room type, cabinet run, unit count, location, and timeline when starting a Project Review."
				}), /* @__PURE__ */ jsx("div", {
					className: `finish-grid ${collection.finishes.length === 1 ? "single-finish-grid" : ""}`,
					children: collection.finishes.map((finish, index) => {
						const facts = finishFacts(finish);
						const zoomImages = [{
							src: finish.image,
							alt: `${finish.name} finish from the ${collection.name} cabinet collection`,
							label: "Finish view"
						}, finish.sample_image ? {
							src: finish.sample_image,
							alt: `${finish.name} cabinet finish detail sample`,
							label: "Detail sample",
							objectPosition: finish.sample_position ?? "center center"
						} : null].filter(Boolean);
						return /* @__PURE__ */ jsxs(Reveal, {
							className: `finish-inspection-card ${index === 0 ? "featured" : ""}`,
							delay: index * .035,
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: `finish-inspection-media finish-media-button portrait-media single-image ${finish.sample_image ? "has-gallery" : ""}`,
								onClick: () => setZoomImage({
									src: finish.image,
									alt: zoomImages[0].alt,
									images: zoomImages,
									title: `${collection.name} / ${finish.name}`,
									eyebrow: finish.family,
									caption: finish.description
								}),
								"aria-label": `Zoom ${collection.name} ${finish.name} cabinet finish`,
								children: [/* @__PURE__ */ jsx(ResponsiveImage, {
									className: "finish-primary-image",
									src: finish.image,
									alt: `${finish.name} finish from the ${collection.name} cabinet collection`,
									sizes: collection.finishes.length === 1 ? "(max-width: 760px) 86vw, 54vw" : "(max-width: 760px) 86vw, (max-width: 1180px) 40vw, 34vw",
									preferredWidth: 1280
								}), /* @__PURE__ */ jsx("span", {
									className: "zoom-cue",
									"aria-hidden": "true",
									children: /* @__PURE__ */ jsx(Maximize2, { size: 15 })
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "finish-inspection-copy",
								children: [
									/* @__PURE__ */ jsx("span", { children: finish.family }),
									/* @__PURE__ */ jsx("h3", { children: finish.name }),
									/* @__PURE__ */ jsx("p", { children: finish.description }),
									finish.swatches?.length > 0 && /* @__PURE__ */ jsx("div", {
										className: "finish-swatch-strip",
										"aria-label": `${finish.name} color cues`,
										children: finish.swatches.map((swatch) => /* @__PURE__ */ jsx("i", {
											style: { backgroundColor: swatch.color },
											title: swatch.name
										}, `${finish.name}-${swatch.name}`))
									}),
									/* @__PURE__ */ jsx("dl", {
										className: "finish-spec-grid",
										children: facts.map(([label, value]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: label }), /* @__PURE__ */ jsx("dd", { children: value })] }, `${finish.name}-${label}`))
									})
								]
							})]
						}, finish.name);
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: `What to send for ${collection.name} cabinet review`,
					items: [
						"Selected finish",
						"Room type",
						"Cabinet run",
						"Unit or room count",
						"Project location",
						"Timeline"
					],
					note: "Asina requests drawings and cabinet runs by email after the first fit check.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Collection Handoff"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Use collection facts before the quote becomes detailed." }),
						/* @__PURE__ */ jsxs("p", { children: [collection.name, " can move into a project review when finish direction, cabinet run, room type, quantity, mockup needs, QA, packing, and shipping responsibility are ready to discuss."] }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "cabinets",
									navigate,
									children: "All cabinets"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "multi-unit",
									navigate,
									children: "Multi-unit path"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "commercial-mixed",
									navigate,
									children: "Commercial supply"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: `${collection.name} Cabinet FAQ`,
				items: faqs
			}),
			/* @__PURE__ */ jsx(CollectionInternalLinks, {
				type: "cabinet",
				currentPage: pageId,
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate }),
			/* @__PURE__ */ jsx(FinishImageZoomOverlay, {
				image: zoomImage,
				onClose: () => setZoomImage(null)
			})
		]
	});
}
function FinishImageZoomOverlay({ image, onClose }) {
	const reducedMotion = useReducedMotion$1();
	const panelRef = useRef$1(null);
	const closeButtonRef = useRef$1(null);
	const [activeIndex, setActiveIndex] = useState$1(0);
	const images = image?.images?.length ? image.images : image ? [{
		src: image.src,
		alt: image.alt,
		label: image.eyebrow
	}] : [];
	const activeImage = images[Math.min(activeIndex, Math.max(images.length - 1, 0))] ?? images[0];
	const hasSlides = images.length > 1;
	const showSlide = (direction) => {
		if (!hasSlides) return;
		setActiveIndex((index) => (index + direction + images.length) % images.length);
	};
	useEffect$1(() => {
		setActiveIndex(0);
	}, [image?.src, image?.title]);
	useEffect$1(() => {
		if (!image) return void 0;
		const imageCount = image.images?.length ?? 1;
		const previousOverflow = document.body.style.overflow;
		const previousFocus = document.activeElement;
		const restoreAppRoot = isolateAppRoot();
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose();
				return;
			}
			if (imageCount > 1 && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
				event.preventDefault();
				setActiveIndex((index) => event.key === "ArrowLeft" ? (index - 1 + imageCount) % imageCount : (index + 1) % imageCount);
				return;
			}
			if (event.key !== "Tab" || !panelRef.current) return;
			const focusable = panelRef.current.querySelectorAll("a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex=\"-1\"])");
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);
		requestAnimationFrame(() => closeButtonRef.current?.focus());
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
			restoreAppRoot();
			if (previousFocus instanceof HTMLElement) previousFocus.focus();
		};
	}, [image, onClose]);
	const overlay = /* @__PURE__ */ jsx(AnimatePresence$1, { children: image && /* @__PURE__ */ jsx(motion$1.div, {
		className: "finish-zoom-backdrop",
		onClick: onClose,
		initial: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		animate: { opacity: 1 },
		exit: reducedMotion ? { opacity: 1 } : { opacity: 0 },
		transition: {
			duration: reducedMotion ? 0 : .2,
			ease: motionEase
		},
		children: /* @__PURE__ */ jsxs(motion$1.div, {
			ref: panelRef,
			className: "finish-zoom-panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "finish-zoom-title",
			onClick: (event) => event.stopPropagation(),
			initial: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 14,
				scale: .985
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: reducedMotion ? { opacity: 1 } : {
				opacity: 0,
				y: 8,
				scale: .985
			},
			transition: {
				duration: reducedMotion ? 0 : .24,
				ease: motionEase
			},
			children: [
				/* @__PURE__ */ jsx("button", {
					ref: closeButtonRef,
					className: "zoom-close",
					type: "button",
					onClick: onClose,
					"aria-label": "Close cabinet finish zoom",
					children: /* @__PURE__ */ jsx(X, { size: 20 })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "finish-zoom-media",
					children: [/* @__PURE__ */ jsx("div", {
						className: "finish-zoom-image-stage",
						children: /* @__PURE__ */ jsx(AnimatePresence$1, {
							mode: "wait",
							children: activeImage && /* @__PURE__ */ jsx(motion$1.div, {
								className: "finish-zoom-slide",
								initial: reducedMotion ? { opacity: 1 } : {
									opacity: 0,
									x: 18
								},
								animate: {
									opacity: 1,
									x: 0
								},
								exit: reducedMotion ? { opacity: 1 } : {
									opacity: 0,
									x: -18
								},
								transition: {
									duration: reducedMotion ? 0 : .2,
									ease: motionEase
								},
								children: /* @__PURE__ */ jsx(ResponsiveImage, {
									src: activeImage.src,
									alt: activeImage.alt,
									loading: "eager",
									sizes: "(max-width: 920px) 92vw, 68vw",
									preferredWidth: 1280,
									style: { objectPosition: activeImage.objectPosition ?? "center center" }
								})
							}, activeImage.src)
						})
					}), hasSlides && /* @__PURE__ */ jsxs("div", {
						className: "finish-zoom-controls",
						"aria-label": "Cabinet finish image controls",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => showSlide(-1),
								"aria-label": "Previous cabinet finish image",
								children: /* @__PURE__ */ jsx(ChevronLeft, { size: 19 })
							}),
							/* @__PURE__ */ jsxs("span", { children: [
								activeIndex + 1,
								" / ",
								images.length
							] }),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => showSlide(1),
								"aria-label": "Next cabinet finish image",
								children: /* @__PURE__ */ jsx(ChevronRight, { size: 19 })
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "finish-zoom-copy",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "dialog-label",
							children: image.eyebrow
						}),
						/* @__PURE__ */ jsx("h2", {
							id: "finish-zoom-title",
							children: image.title
						}),
						/* @__PURE__ */ jsx("p", { children: image.caption }),
						hasSlides && /* @__PURE__ */ jsx("div", {
							className: "finish-zoom-thumb-row",
							"aria-label": "Cabinet finish zoom slides",
							children: images.map((item, index) => /* @__PURE__ */ jsx("button", {
								type: "button",
								className: index === activeIndex ? "active" : "",
								onClick: () => setActiveIndex(index),
								"aria-current": index === activeIndex ? "true" : void 0,
								children: item.label ?? `Image ${index + 1}`
							}, item.src))
						})
					]
				})
			]
		})
	}) });
	if (typeof document === "undefined") return overlay;
	return createPortal(overlay, document.body);
}
function QuartzSlabCodesPage({ navigate }) {
	const allSlabs = countertops_default.collections.flatMap((collection) => collection.slabs.map((slab) => ({
		collection,
		slab
	})));
	const faqs = pageFaqs["countertop-quartz-codes"] ?? [];
	const [zoomSlab, setZoomSlab] = useState$1(null);
	const reducedMotion = useReducedMotion$1();
	const openCodeSlabZoom = (slab, collection) => {
		setZoomSlab({
			...slab,
			behavior: slab.asset_description ?? collection.behavior,
			collectionLabel: countertopCollectionLabel(collection),
			facts: collection.facts
		});
	};
	useLayoutEffect(() => {
		if (typeof window === "undefined" || typeof document === "undefined") return void 0;
		const previousScrollRestoration = "scrollRestoration" in window.history ? window.history.scrollRestoration : null;
		if (previousScrollRestoration) window.history.scrollRestoration = "manual";
		let cancelled = false;
		const frameIds = [];
		const timeoutIds = [];
		const scrollToGallery = (smooth = false) => {
			if (cancelled) return;
			const target = document.getElementById("quartz-visual-code-gallery");
			if (!target) return;
			const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 84;
			const top = Math.max(target.getBoundingClientRect().top + window.scrollY - headerHeight - 28, 0);
			window.scrollTo({
				top,
				behavior: smooth && !reducedMotion ? "smooth" : "auto"
			});
		};
		const restoreScrollRestoration = () => {
			if (previousScrollRestoration) window.history.scrollRestoration = previousScrollRestoration;
		};
		const queueFrame = (callback) => {
			const frameId = window.requestAnimationFrame(callback);
			frameIds.push(frameId);
		};
		const handleLoad = () => scrollToGallery(false);
		queueFrame(() => queueFrame(() => scrollToGallery(false)));
		[
			120,
			360,
			720,
			1200,
			1800
		].forEach((delay, index, delays) => {
			timeoutIds.push(window.setTimeout(() => scrollToGallery(index === delays.length - 1), delay));
		});
		timeoutIds.push(window.setTimeout(restoreScrollRestoration, 2200));
		window.addEventListener("load", handleLoad, { once: true });
		return () => {
			cancelled = true;
			frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
			timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
			window.removeEventListener("load", handleLoad);
			restoreScrollRestoration();
		};
	}, [reducedMotion]);
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: "countertop-quartz-codes",
		eyebrow: "Quartz Slab Codes",
		title: "Quartz slab codes stay tied to project quote inputs.",
		copy: "Review Asina Global quartz codes by collection, movement, slab facts, square footage, edge needs, cutouts, destination, and timeline before requesting a countertop supply review.",
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "section slab-preview-board",
				id: "quartz-visual-code-gallery",
				"aria-label": "Quartz slab visual code gallery",
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Visual Code Gallery",
					title: "Use the image and code when you want Asina to review a specific slab.",
					copy: "A code is easier to review when the movement is visible. Pair the slab code with square footage, edge needs, cutouts, destination, and timeline."
				}), /* @__PURE__ */ jsx("div", {
					className: "slab-preview-grid slab-preview-grid-coded",
					children: allSlabs.map(({ collection, slab }, index) => {
						return [index === 0 || allSlabs[index - 1].collection.key !== collection.key ? /* @__PURE__ */ jsxs("div", {
							className: "slab-preview-collection-break",
							children: [
								/* @__PURE__ */ jsx("span", { children: collection.name }),
								/* @__PURE__ */ jsxs("strong", { children: [collection.slabs.length, " visible codes"] }),
								/* @__PURE__ */ jsx("p", { children: collection.behavior })
							]
						}, `break-${collection.key}`) : null, /* @__PURE__ */ jsxs(Reveal, {
							className: "slab-preview-card",
							delay: index % 12 * .014,
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "slab-preview-media-button",
								onClick: () => openCodeSlabZoom(slab, collection),
								"aria-label": `Zoom ${collection.name} slab ${slab.code} ${slab.name}`,
								children: [/* @__PURE__ */ jsx(ResponsiveImage, {
									className: "slab-portrait-image",
									src: slab.image,
									alt: slab.alt ?? `${collection.name} quartz slab ${slab.name}, ${slab.code}`,
									sizes: "(max-width: 760px) 86vw, (max-width: 1180px) 42vw, 24vw",
									preferredWidth: 1280
								}), /* @__PURE__ */ jsx("span", {
									className: "zoom-cue compact",
									"aria-hidden": "true",
									children: /* @__PURE__ */ jsx(Maximize2, { size: 13 })
								})]
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("span", { children: [
									collection.name,
									" / ",
									slab.code
								] }),
								/* @__PURE__ */ jsx("h3", { children: slab.name }),
								/* @__PURE__ */ jsx("p", { children: slab.asset_description ?? collection.behavior }),
								/* @__PURE__ */ jsxs("strong", {
									className: "slab-review-note",
									children: [
										"Use code ",
										slab.code,
										" in Project Review."
									]
								})
							] })]
						}, `${collection.key}-${slab.code}`)];
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: "What to send with a slab code",
					items: [
						"Slab code or name",
						"Approximate square footage",
						"Edge profile",
						"Sink or cooktop cutouts",
						"Project destination",
						"Timeline"
					],
					note: "Asina requests countertop drawings or specs by email after the first review when the project is a fit.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Countertop Handoff"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Code first, then commercial use case." }),
						/* @__PURE__ */ jsx("p", { children: "The code tells Asina which slab you mean. The use case, size, cutouts, destination, and timing tell Asina whether the project is ready for countertop supply review." }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "countertops",
									navigate,
									children: "Countertops"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "commercial-countertops",
									navigate,
									children: "Commercial countertops"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "commercial-mixed",
									navigate,
									children: "Mixed supply"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: "Quartz Slab Code FAQ",
				items: faqs
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate }),
			/* @__PURE__ */ jsx(SlabZoomOverlay$1, {
				slab: zoomSlab,
				onClose: () => setZoomSlab(null)
			})
		]
	});
}
function CountertopCollectionSeoPage({ pageId, navigate }) {
	const collectionKey = countertopCollectionRouteMap[pageId];
	const collection = countertops_default.collections.find((item) => item.key === collectionKey);
	const faqs = pageFaqs[pageId] ?? [];
	const [zoomSlab, setZoomSlab] = useState$1(null);
	const standardSize = collection?.facts.find((fact) => fact.label === "Standard size")?.value;
	const thickness = collection?.facts.find((fact) => fact.label === "Thickness")?.value;
	const openCollectionSlabZoom = (slab) => {
		if (!collection) return;
		setZoomSlab({
			...slab,
			behavior: slab.asset_description ?? collection.behavior,
			collectionLabel: countertopCollectionLabel(collection),
			facts: collection.facts
		});
	};
	if (!collection) return null;
	return /* @__PURE__ */ jsxs(PageShell, {
		variant: pageId,
		eyebrow: `${collection.name} Quartz Slabs`,
		title: `${collection.name} quartz slabs organized by code and project fit.`,
		copy: `Asina reviews ${collection.name} surfaces by code, movement, size, thickness, square footage, edge profile, cutouts, destination, and commercial use case before quote review.`,
		navigate,
		actionPage: "review",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "section collection-inspection-board countertop-collection-board",
				"aria-label": `${collection.name} quartz collection facts`,
				children: [/* @__PURE__ */ jsxs(Reveal, {
					className: "collection-inspection-media",
					children: [/* @__PURE__ */ jsx(ResponsiveImage, {
						className: "collection-portrait-image",
						src: collection.hero.image,
						alt: getCountertopCollectionHeroAlt(collection),
						sizes: "(max-width: 920px) 92vw, 34vw",
						preferredWidth: 1280
					}), /* @__PURE__ */ jsxs("div", {
						className: "proof-media-ticket",
						children: [/* @__PURE__ */ jsx("span", { children: collection.name }), /* @__PURE__ */ jsx("strong", { children: collection.behavior })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "collection-inspection-ledger",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "ledger-caption",
							children: "Collection Facts"
						}),
						/* @__PURE__ */ jsx("h2", { children: collection.hero.headline }),
						/* @__PURE__ */ jsx("p", { children: collection.hero.body }),
						/* @__PURE__ */ jsxs("dl", {
							className: "collection-fact-list",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Visible codes" }), /* @__PURE__ */ jsx("dd", { children: collection.slabs.length })] }),
								standardSize && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Standard size" }), /* @__PURE__ */ jsx("dd", { children: standardSize })] }),
								thickness && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Thickness" }), /* @__PURE__ */ jsx("dd", { children: thickness })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Review use" }), /* @__PURE__ */ jsx("dd", { children: "Commercial countertops, repeat interiors, and mixed cabinet plus surface scope." })] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "section slab-preview-board",
				"aria-label": `${collection.name} quartz slab visual preview`,
				children: [/* @__PURE__ */ jsx(SectionIntro, {
					eyebrow: "Visual Code Gallery",
					title: "Choose from slab images, not a text-only code list.",
					copy: "Each code stays attached to a full slab preview so buyers can compare movement before sending a Project Review request."
				}), /* @__PURE__ */ jsx("div", {
					className: "slab-preview-grid",
					children: collection.slabs.map((slab, index) => /* @__PURE__ */ jsxs(Reveal, {
						className: "slab-preview-card",
						delay: index % 12 * .018,
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "slab-preview-media-button",
							onClick: () => openCollectionSlabZoom(slab),
							"aria-label": `Zoom ${collection.name} slab ${slab.code} ${slab.name}`,
							children: [/* @__PURE__ */ jsx(ResponsiveImage, {
								className: "slab-portrait-image",
								src: slab.image,
								alt: slab.alt ?? `${collection.name} quartz slab ${slab.name}, ${slab.code}`,
								sizes: "(max-width: 760px) 86vw, (max-width: 1180px) 42vw, 24vw",
								preferredWidth: 1280
							}), /* @__PURE__ */ jsx("span", {
								className: "zoom-cue compact",
								"aria-hidden": "true",
								children: /* @__PURE__ */ jsx(Maximize2, { size: 13 })
							})]
						}), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("span", { children: [
								collection.name,
								" / ",
								slab.code
							] }),
							/* @__PURE__ */ jsx("h3", { children: slab.name }),
							/* @__PURE__ */ jsx("p", { children: collection.behavior }),
							/* @__PURE__ */ jsxs("strong", {
								className: "slab-review-note",
								children: [
									"Use code ",
									slab.code,
									" in Project Review."
								]
							})
						] })]
					}, `${collection.key}-${slab.code}`))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "dossier-grid quote-dossier",
				children: [/* @__PURE__ */ jsx(WhatToSend, {
					title: `What to send for ${collection.name} quartz review`,
					items: [
						"Slab code or name",
						"Approximate square footage",
						"Edge profile",
						"Sink or cooktop cutouts",
						"Destination",
						"Timeline"
					],
					note: "Asina requests countertop drawings or specs by email after the first fit check.",
					navigate
				}), /* @__PURE__ */ jsxs("div", {
					className: "quote-proof-panel",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "document-tab",
							children: "Collection Handoff"
						}),
						/* @__PURE__ */ jsx("h2", { children: "Surface selection travels with the commercial room." }),
						/* @__PURE__ */ jsxs("p", { children: [collection.name, " review is clearest when slab code, movement, square footage, cutouts, destination, timeline, packing needs, and cabinet coordination are clear enough to review."] }),
						/* @__PURE__ */ jsxs("div", {
							className: "inline-link-row",
							children: [
								/* @__PURE__ */ jsx(RouteLink, {
									page: "countertops",
									navigate,
									children: "All countertops"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "countertop-quartz-codes",
									navigate,
									children: "Quartz codes"
								}),
								/* @__PURE__ */ jsx(RouteLink, {
									page: "commercial-countertops",
									navigate,
									children: "Commercial countertops"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(PageFAQ, {
				title: `${collection.name} Quartz FAQ`,
				items: faqs
			}),
			/* @__PURE__ */ jsx(CollectionInternalLinks, {
				type: "countertop",
				currentPage: pageId,
				navigate
			}),
			/* @__PURE__ */ jsx(CTASection, { navigate }),
			/* @__PURE__ */ jsx(SlabZoomOverlay$1, {
				slab: zoomSlab,
				onClose: () => setZoomSlab(null)
			})
		]
	});
}
//#endregion
//#region src/routeRegistry.server.jsx
var serverRouteComponents = {
	home: HomePage,
	"buyer-paths": BuyerPathsPage,
	cabinets: CabinetsPage,
	countertops: CountertopsPage,
	furniture: FurniturePage,
	process: ProcessPage,
	qa: QAPage,
	contact: ContactPage,
	privacy: PrivacyPolicyPage,
	about: AboutPage,
	design: DesignSupportPage,
	review: ProjectReviewPage,
	"multi-unit": MultiUnitCabinetPackagesPage,
	"dealer-supply": DealerCabinetSupplyPage,
	"supplier-guide": WholesaleCabinetSupplierGuidePage,
	"supplier-comparison": WholesaleCabinetSupplierComparisonPage,
	"restaurant-furniture": RestaurantFranchiseFurniturePackagesPage,
	rfq: RFQProcurementResourcesPage,
	"importer-resources": ProjectSupplyImporterResourcesPage,
	"container-economics": BuyerQuestionGuidePage,
	"landed-cost": BuyerQuestionGuidePage,
	"shipping-responsibility": BuyerQuestionGuidePage,
	"imported-quality": BuyerQuestionGuidePage,
	"lead-times": BuyerQuestionGuidePage,
	"import-vs-domestic": BuyerQuestionGuidePage,
	orlando: OrlandoCommercialProjectSupplyPage,
	"commercial-mixed": CommercialIntentPage,
	"commercial-countertops": CommercialIntentPage,
	"hospitality-ffe": CommercialIntentPage,
	"multifamily-supply": CommercialIntentPage,
	"cabinet-malibu": CabinetCollectionSeoPage,
	"cabinet-monterey": CabinetCollectionSeoPage,
	"cabinet-newport": CabinetCollectionSeoPage,
	"cabinet-catalina": CabinetCollectionSeoPage,
	"cabinet-laguna": CabinetCollectionSeoPage,
	"cabinet-jersey": CabinetCollectionSeoPage,
	"countertop-quartz-codes": QuartzSlabCodesPage,
	"countertop-exotic": CountertopCollectionSeoPage,
	"countertop-natural": CountertopCollectionSeoPage,
	"countertop-grain": CountertopCollectionSeoPage
};
//#endregion
//#region src/entry-server.jsx
function render(pageId = "home") {
	return renderToString(/* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(App, {
		initialPage: pageId,
		routeComponents: serverRouteComponents
	}) }));
}
//#endregion
export { render };
