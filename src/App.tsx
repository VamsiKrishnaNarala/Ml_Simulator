import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Playground from './pages/Playground'
import Algorithms from './pages/Algorithms'
import Compare from './pages/Compare'
import Quiz from './pages/Quiz'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
