import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import ExplorePage from './pages/ExplorePage'
import QuizPage from './pages/QuizPage'
import QuizDashboard from './pages/QuizDashboard'
import DefinitionsPage from './pages/DefinitionsPage'
import BlogsPage from './pages/BlogsPage'
import BlogPostPage from './pages/BlogPostPage'
import { AudioProvider } from './components/audio/AudioSystem'
import { PerformanceDisplay } from './components/performance/PerformanceLOD'

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
        <Layout>
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz-dashboard" element={<QuizDashboard />} />
            <Route path="/definitions" element={<DefinitionsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
          </Routes>
          {/* Performance Monitor */}
          <PerformanceDisplay />
        </Layout>
      </Router>
    </AudioProvider>
  )
}

export default App