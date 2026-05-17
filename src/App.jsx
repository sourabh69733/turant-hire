import HomePage from "./pages/HomePage";
import CandidatePage from "./pages/CandidatePage";
import EmployerPage from "./pages/EmployerPage";

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

  if (route === "candidate") {
    return <CandidatePage />;
  }

  if (route === "employer") {
    return <EmployerPage />;
  }

  return <HomePage />;
}
