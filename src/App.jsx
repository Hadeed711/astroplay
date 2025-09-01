import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import ExplorePage from './pages/ExplorePage'
import QuizPage from './pages/QuizPage'
import QuizDashboard from './pages/QuizDashboard'
import DefinitionsPage from './pages/DefinitionsPage'
import BlogsPage from './pages/BlogsPage'
import BlogPostPage from './pages/BlogPostPage'
import DataVisualizationPage from './pages/DataVisualizationPage'
import SpaceLegendsPage from './pages/SpaceLegendsPage'
import { AudioProvider } from './components/audio/AudioSystem'
import ScrollToTop from './components/utils/ScrollToTop'

// Simple preload function
const preloadModels = () => {
  console.log('preloadModels called - models will be loaded when needed')
}

function App() {
  // Preload 3D models for better performance
  useEffect(() => {
    preloadModels()
  }, [])

  return (
    <AudioProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz-dashboard" element={<QuizDashboard />} />
            <Route path="/definitions" element={<DefinitionsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/data-viz" element={<DataVisualizationPage />} />
            <Route path="/space-legends" element={<SpaceLegendsPage />} />
            {/* Catch-all route for 404 pages - redirects to home */}
            <Route path="*" element={<ExplorePage />} />
          </Routes>
        </Layout>
      </Router>
    </AudioProvider>
  )
}

export default App