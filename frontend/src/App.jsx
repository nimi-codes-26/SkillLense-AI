import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Analysis from "./pages/Analysis";
import CareerAlignment from "./pages/CareerAlignment";
import SkillGap from "./pages/SkillGap";
import About from "./pages/About";

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />

      <div className="app-main">
        <TopBar onToggleSidebar={() => setMobileNavOpen((open) => !open)} />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/career-alignment" element={<CareerAlignment />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
