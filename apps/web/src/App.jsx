import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import CandidatePage from "./pages/CandidatePage";
import EmployerPage from "./pages/EmployerPage";

const siteUrl =
  import.meta.env.VITE_MARKETING_SITE_URL ?? "https://turanthire.com";

const routeSeo = {
  home: {
    title: "TurantHire | Faster Hiring for Local Businesses",
    description:
      "TurantHire helps local businesses capture hiring requirements fast and receive screened, relevant candidates quickly.",
    canonical: siteUrl,
    robots: "index,follow",
  },
  candidate: {
    title: "TurantHire Candidate Overview",
    description:
      "Explore how TurantHire helps candidates maintain a ready profile, active availability, and faster role matching.",
    canonical: null,
    robots: "noindex,nofollow",
  },
  employer: {
    title: "TurantHire Employer Overview",
    description:
      "See how TurantHire structures employer requirements and prepares screened candidate shortlists.",
    canonical: null,
    robots: "noindex,nofollow",
  },
};

function upsertMeta(name, content, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(href) {
  const existing = document.head.querySelector('link[rel="canonical"]');

  if (!href) {
    existing?.remove();
    return;
  }

  let element = existing;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function getRouteFromPath(pathname) {
  if (pathname === "/candidate") {
    return "candidate";
  }

  if (pathname === "/employer") {
    return "employer";
  }

  return "home";
}

export default function App() {
  const route = getRouteFromPath(window.location.pathname);

  useEffect(() => {
    const seo = routeSeo[route];
    document.title = seo.title;
    upsertMeta("description", seo.description);
    upsertMeta("robots", seo.robots);
    upsertMeta("googlebot", seo.robots);
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:title", seo.title, "property");
    upsertMeta("og:description", seo.description, "property");
    upsertMeta("og:url", seo.canonical, "property");
    upsertMeta("og:site_name", "TurantHire", "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", seo.title);
    upsertMeta("twitter:description", seo.description);
    upsertCanonical(seo.canonical);
  }, [route]);

  if (route === "candidate") {
    return <CandidatePage />;
  }

  if (route === "employer") {
    return <EmployerPage />;
  }

  return <HomePage />;
}
