import { useEffect } from "react";
import seoData from "@/data/seo.json";

/**
 * Single source of truth for site-wide SEO data. Shared by the React app
 * (this module) and the build-time scripts in /scripts, which read the same
 * src/data/seo.json file.
 */
export interface SiteConfig {
  name: string;
  shortName: string;
  url: string;
  description: string;
  telephone: string;
  phoneDisplay: string;
  email: string;
  foundingDate: string;
  priceRange: string;
  logo: string;
  image: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { latitude: number; longitude: number } | null;
  areaServed: string[];
  openingHours: { days: string[]; opens: string; closes: string }[];
  defaultTitle: string;
  defaultDescription: string;
  twitterHandle: string | null;
  sameAs: string[];
}

export type SchemaKind =
  | "autoDealer"
  | "breadcrumb"
  | "itemList"
  | "service"
  | "faq"
  | "aboutPage";

export interface RouteConfig {
  path: string;
  title: string;
  description: string;
  changefreq: string;
  priority: string;
  ogType: string;
  noindex?: boolean;
  sitemap?: boolean;
  schema: SchemaKind[];
}

export interface ServiceConfig {
  name: string;
  description: string;
}

export interface FaqConfig {
  question: string;
  answer: string;
}

export const SITE = seoData.site as SiteConfig;
export const ROUTES = seoData.routes as RouteConfig[];
export const FAQS = seoData.faqs as FaqConfig[];
export const SERVICES = seoData.services as ServiceConfig[];
export const VEHICLE_TEMPLATES = seoData.vehicle as {
  title: string;
  description: string;
};

/** Attribute used to mark tags this module owns, so it can update them safely. */
const MANAGED = "data-seo";

/** Turn a site-relative path into an absolute URL (the shape crawlers expect). */
export const absoluteUrl = (path: string): string =>
  /^https?:\/\//i.test(path) ? path : `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Replace {token} placeholders in a template string. */
export const interpolate = (
  template: string,
  vars: Record<string, string | number>
): string =>
  template.replace(/\{(\w+)\}/g, (_match, key: string) =>
    vars[key] === undefined || vars[key] === null ? "" : String(vars[key])
  );

/** Format a whole-pound amount the way the site displays it (e.g. 24,995). */
export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);

/** Format a mileage figure (e.g. 15,000). */
export const formatMileage = (value: number): string =>
  new Intl.NumberFormat("en-GB").format(value);

export interface SeoOptions {
  /** Page title — keep under ~60 characters where possible. */
  title: string;
  /** Meta description — keep under ~155 characters. */
  description: string;
  /** Canonical path for this page, e.g. "/stock" or "/car/123". */
  path: string;
  /** Set true for admin/404 pages so they stay out of the index. */
  noindex?: boolean;
  ogType?: string;
  /** Absolute URL or site-relative path to the social sharing image. */
  image?: string;
  /** JSON-LD objects to embed on this page. */
  schema?: unknown[];
}

/** Upsert a <meta> tag by its name/property, creating it when missing. */
const setMeta = (attr: "name" | "property", key: string, content: string): void => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

/** Upsert the canonical <link>. */
const setCanonical = (href: string): void => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/** Replace every JSON-LD block this module previously inserted. */
const setJsonLd = (blocks: unknown[]): void => {
  document.head
    .querySelectorAll(`script[${MANAGED}="jsonld"]`)
    .forEach((node) => node.remove());
  for (const block of blocks) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(MANAGED, "jsonld");
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
};

/** Apply a full SEO payload to the document head. */
export const applySeo = (opts: SeoOptions): void => {
  const url = absoluteUrl(opts.path);
  const image = absoluteUrl(opts.image ?? SITE.image);

  document.title = opts.title;
  setMeta("name", "description", opts.description);
  setMeta(
    "name",
    "robots",
    opts.noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  );
  setCanonical(url);

  setMeta("property", "og:type", opts.ogType ?? "website");
  setMeta("property", "og:site_name", SITE.name);
  setMeta("property", "og:locale", "en_GB");
  setMeta("property", "og:title", opts.title);
  setMeta("property", "og:description", opts.description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", image);
  setMeta("property", "og:image:alt", opts.title);

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", opts.title);
  setMeta("name", "twitter:description", opts.description);
  setMeta("name", "twitter:image", image);

  setJsonLd(opts.schema ?? []);
};

/**
 * Declare the SEO metadata for a page. Runs on mount and whenever any value
 * changes, so client-side navigation keeps the head in sync.
 */
export const useSeo = (opts: SeoOptions): void => {
  // Serialising every input keeps the dependency list exhaustive in one value.
  const key = JSON.stringify(opts);
  useEffect(() => {
    applySeo(opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` serialises every input
  }, [key]);
};

/* -------------------------------------------------------------------------- */
/*  Structured data (JSON-LD) builders                                        */
/* -------------------------------------------------------------------------- */

/** Stable @id so every schema block can reference the one dealership entity. */
export const ORGANIZATION_ID = `${SITE.url}/#organization`;

/** Human labels for the visible + schema breadcrumb trail. */
export const ROUTE_LABELS: Record<string, string> = {
  "/": "Home",
  "/stock": "Stock",
  "/sold": "Sold Cars",
  "/customers": "Happy Customers",
  "/finance": "Finance",
  "/servicing": "Servicing",
  "/contact": "Contact",
  "/about": "About",
};

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Home → current page, used when a page doesn't pass an explicit trail. */
export const defaultBreadcrumb = (path: string): BreadcrumbItem[] => [
  { name: ROUTE_LABELS["/"], path: "/" },
  ...(path === "/" ? [] : [{ name: ROUTE_LABELS[path] ?? "Page", path }]),
];

/** The dealership itself — embeds NAP data for local search. */
export const autoDealerSchema = () => ({
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": ORGANIZATION_ID,
  name: SITE.name,
  alternateName: SITE.shortName,
  description: SITE.description,
  url: `${SITE.url}/`,
  telephone: SITE.telephone,
  email: SITE.email,
  image: SITE.image,
  logo: SITE.logo,
  priceRange: SITE.priceRange,
  foundingDate: SITE.foundingDate,
  currenciesAccepted: "GBP",
  address: { "@type": "PostalAddress", ...SITE.address },
  // Only emitted once real coordinates are supplied (never invented).
  ...(SITE.geo ? { geo: { "@type": "GeoCoordinates", ...SITE.geo } } : {}),
  areaServed: SITE.areaServed.map((name) => ({ "@type": "Place", name })),
  openingHoursSpecification: SITE.openingHours.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.days,
    opens: hours.opens,
    closes: hours.closes,
  })),
  ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  makesOffer: SERVICES.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.name,
      description: service.description,
    },
  })),
});

export const breadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const itemListSchema = (cars: { id: string | number; title: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Used Mercedes-Benz stock at IQ Motors",
  numberOfItems: cars.length,
  itemListElement: cars.map((car, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(`/car/${car.id}`),
    name: car.title,
  })),
});

export const serviceSchema = () =>
  SERVICES.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.description,
    provider: { "@type": "AutoDealer", "@id": ORGANIZATION_ID, name: SITE.name },
    areaServed: SITE.areaServed.map((name) => ({ "@type": "Place", name })),
  }));

/** FAQ markup — every question is also rendered visibly on the page. */
export const faqSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

export const aboutPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${SITE.name}`,
  url: absoluteUrl("/about"),
  about: { "@type": "AutoDealer", "@id": ORGANIZATION_ID },
});

export interface VehicleSchemaInput {
  id: string | number;
  title: string;
  year: number;
  price: number;
  mileage: number;
  description?: string;
  images: string[];
  isSold?: boolean;
}

/** A single vehicle listing with its offer — drives price/availability rich results. */
export const vehicleSchema = (car: VehicleSchemaInput) => {
  const url = absoluteUrl(`/car/${car.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.title,
    url,
    brand: { "@type": "Brand", name: "Mercedes-Benz" },
    vehicleModelDate: String(car.year),
    itemCondition: "https://schema.org/UsedCondition",
    ...(car.description ? { description: car.description } : {}),
    ...(car.images.length ? { image: car.images } : {}),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "SMI",
    },
    offers: {
      "@type": "Offer",
      url,
      price: car.price,
      priceCurrency: "GBP",
      itemCondition: "https://schema.org/UsedCondition",
      availability: car.isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", "@id": ORGANIZATION_ID, name: SITE.name },
    },
  };
};

/** Resolve the JSON-LD blocks a configured route asks for. */
export const staticRouteSchema = (
  path: string,
  context: {
    breadcrumb?: BreadcrumbItem[];
    cars?: { id: string | number; title: string }[];
  } = {}
): unknown[] => {
  const route = ROUTES.find((entry) => entry.path === path);
  if (!route) return [];

  return route.schema.flatMap((kind): unknown[] => {
    switch (kind) {
      case "autoDealer":
        return [autoDealerSchema()];
      case "breadcrumb":
        return [breadcrumbSchema(context.breadcrumb ?? defaultBreadcrumb(path))];
      case "itemList":
        return [itemListSchema(context.cars ?? [])];
      case "service":
        return serviceSchema();
      case "faq":
        return [faqSchema()];
      case "aboutPage":
        return [aboutPageSchema()];
      default:
        return [];
    }
  });
};

/** Title/description for a vehicle page, from the shared template. */
export const vehicleSeo = (car: {
  id: string | number;
  title: string;
  year: number;
  price: number;
  mileage: number;
}) => ({
  path: `/car/${car.id}`,
  title: interpolate(VEHICLE_TEMPLATES.title, {
    year: car.year,
    title: car.title,
    price: formatPrice(car.price),
  }),
  description: interpolate(VEHICLE_TEMPLATES.description, {
    year: car.year,
    title: car.title,
    price: formatPrice(car.price),
    mileage: formatMileage(car.mileage),
  }),
});

/** Ready-made SEO payload for a configured static route. */
export const pageSeo = (
  path: string,
  context: {
    breadcrumb?: BreadcrumbItem[];
    cars?: { id: string | number; title: string }[];
  } = {},
  image?: string
): SeoOptions => {
  const route = ROUTES.find((entry) => entry.path === path);
  return {
    title: route?.title ?? SITE.defaultTitle,
    description: route?.description ?? SITE.defaultDescription,
    path,
    noindex: route?.noindex,
    ogType: route?.ogType ?? "website",
    image,
    schema: staticRouteSchema(path, context),
  };
};
