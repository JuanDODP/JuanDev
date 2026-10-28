import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Footer, Navbar, PointerGlow, ScrollManager, ScrollProgress } from './components/layout';
import { Home } from './pages/Home';

// The detail page is only reached by navigation, so it ships in its own chunk.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then((m) => ({ default: m.ProjectDetail })));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <PointerGlow />
      <ScrollProgress />
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" style={{ flex: 1 }}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
