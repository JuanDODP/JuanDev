import { BrowserRouter, Routes, Route } from 'react-router';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import CustomCursor from './components/ui/CustomCursor';
import AmbientOrbs from './components/ui/AmbientOrbs';
import ScrollProgress from './components/ui/ScrollProgress';

/* ── SVG film-grain noise filter ── */
function NoiseOverlay() {
  return (
    <>
      <svg aria-hidden style={{ position: 'fixed', width: 0, height: 0, zIndex: -1 }}>
        <filter id="portfolio-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0,
          filter: 'url(#portfolio-noise)',
          opacity: 0.032,
          zIndex: 9991,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* ── Global overlay layers ── */}
      <AmbientOrbs />
      <CustomCursor />
      <ScrollProgress />
      <NoiseOverlay />

      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
