import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogById, getRecentBlogs } from '../data/blogs'
import MarkdownRenderer from '../components/ui/MarkdownRenderer'
import { Mail, ExternalLink, Copy, CheckCircle, Share2, Linkedin, Facebook } from 'lucide-react'

const BlogPostPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  
  const blog = getBlogById(id)
  const recentBlogs = getRecentBlogs(3).filter(b => b.id !== id)

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-slate-400 mb-8">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/blogs')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Share functionality
  const handleCopyContent = async () => {
    try {
      const { description, points } = createRichDescription()
      
      const blogContent = `🚀 ${blog.title}

By ${blog.author} | Published: ${formatDate(blog.date)}
Category: ${blog.category} | Read time: ${blog.readTime}

${description}

Key Points:
${points.join('\n')}

Tags: ${blog.tags.join(', ')}

Read the full article at: ${window.location.href}

---
Explore more space science at AstroPlay! 🌌`

      await navigator.clipboard.writeText(blogContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }

  const createRichDescription = () => {
    // Extract first few sentences for description
    const sentences = blog.content.split('.').filter(s => s.trim().length > 20)
    const description = sentences.slice(0, 2).join('.') + '.'
    
    // Create key points from content
    const points = []
    const lines = blog.content.split('\n').filter(line => line.trim())
    
    // Look for bullet points or numbered lists in content
    const listItems = lines.filter(line => 
      line.trim().startsWith('•') || 
      line.trim().startsWith('-') || 
      line.trim().match(/^\d+\./)
    )
    
    if (listItems.length > 0) {
      points.push(...listItems.slice(0, 3))
    } else {
      // If no lists, create points from paragraphs
      const paragraphs = blog.content.split('\n\n').filter(p => p.trim().length > 50)
      paragraphs.slice(0, 3).forEach((para, index) => {
        const sentence = para.split('.')[0] + '.'
        if (sentence.length > 20 && sentence.length < 150) {
          points.push(`• ${sentence}`)
        }
      })
    }

    return {
      description,
      points: points.slice(0, 3)
    }
  }

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(blog.title)
    
    const { description, points } = createRichDescription()
    
    // Create rich content for LinkedIn
    const richContent = `🚀 ${blog.title}

📝 ${description}

💡 Key insights:
${points.join('\n')}

🏷️ ${blog.tags.join(' • ')}
⏰ ${blog.readTime}
👤 ${blog.author}

Dive deeper into space science with AstroPlay! 🌌

#SpaceExploration #Science #AstroPlay ${blog.category === 'Climate Science' ? '#ClimateScience #Environment' : '#SpaceNews #Astronomy'}`

    const summary = encodeURIComponent(richContent)
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
  }

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href)
    
    const { description, points } = createRichDescription()
    
    // Create rich content for Facebook
    const richContent = `🌌 ${blog.title}

📖 ${description}

✨ Key highlights:
${points.join('\n')}

📅 ${formatDate(blog.date)} • 👤 ${blog.author} • ⏱️ ${blog.readTime}

Discover amazing space science discoveries! 🚀✨

${blog.category === 'Space News' ? '#SpaceNews #Astronomy #Universe' : '#ClimateScience #Environment #Earth'} #Science #Education #AstroPlay`

    // For Facebook, we'll use the quote parameter to include rich content
    const quote = encodeURIComponent(richContent)
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blogs')}
          className="mb-8 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
        >
          ← Back to Blogs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Header */}
            <header className="mb-8">
              {/* Category Badge */}
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                <span className="text-slate-400">{blog.readTime}</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight tracking-tight">
                {blog.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex items-center gap-6 text-slate-400 mb-6">
                <span>By {blog.author}</span>
                <span>{formatDate(blog.date)}</span>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Featured Image */}
            <div className="h-64 md:h-96 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-8 flex items-center justify-center overflow-hidden relative">
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div 
                className={`absolute inset-0 flex items-center justify-center rounded-xl ${blog.image ? 'hidden' : 'flex'}`}
                style={{ display: blog.image ? 'none' : 'flex' }}
              >
                <div className="text-center">
                  <span className="text-6xl block mb-4">
                    {blog.category === 'Space News' ? '🌌' : '🌍'}
                  </span>
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 max-w-md">
                    <p className="text-sm text-blue-100 opacity-90 mb-2 font-medium">
                      Image Location:
                    </p>
                    <code className="text-xs text-blue-200 bg-black/30 px-3 py-1 rounded block">
                      /public{blog.image || '/images/blogs/blog-' + blog.id + '.jpg'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <MarkdownRenderer content={blog.content} />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={20} />
                <h3 className="text-xl font-bold">Share this article</h3>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button 
                  onClick={handleLinkedInShare}
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-sm"
                >
                  <Linkedin size={16} />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <span className="sm:hidden">LI</span>
                </button>
                <button 
                  onClick={handleFacebookShare}
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                >
                  <Facebook size={16} />
                  <span className="hidden sm:inline">Facebook</span>
                  <span className="sm:hidden">FB</span>
                </button>
                <button 
                  onClick={handleCopyContent}
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} className="text-green-400" />
                      <span className="hidden sm:inline">Copied!</span>
                      <span className="sm:hidden">✓</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="hidden sm:inline">Copy Content</span>
                      <span className="sm:hidden">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-8 space-y-6 md:space-y-8">
              {/* Recent Posts */}
              {recentBlogs.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {recentBlogs.map(recentBlog => (
                      <article
                        key={recentBlog.id}
                        className="cursor-pointer hover:bg-slate-700 p-3 rounded-lg transition-colors"
                        onClick={() => navigate(`/blog/${recentBlog.id}`)}
                      >
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {recentBlog.image ? (
                              <img
                                src={recentBlog.image}
                                alt={recentBlog.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <span 
                              className={`text-sm ${recentBlog.image ? 'hidden' : 'block'}`}
                              style={{ display: recentBlog.image ? 'none' : 'block' }}
                            >
                              {recentBlog.category === 'Space News' ? '🌌' : '🌍'}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-2 line-clamp-2 text-sm">
                              {recentBlog.title}
                            </h4>
                            <div className="text-xs text-slate-400">
                              {formatDate(recentBlog.date)}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Section */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6">
                <div className="text-center">
                  <Mail className="mx-auto mb-3 text-white" size={32} />
                  <h3 className="text-lg font-bold mb-2">Get in Touch</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Questions about this article?
                  </p>
                  <a 
                    href="mailto:hadeedahmad711@gmail.com" 
                    className="inline-flex items-center gap-2 w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors group justify-center"
                  >
                    <Mail size={16} />
                    Contact Me
                    <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Explore More */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Explore More</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/explore')}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left"
                  >
                    🌌 3D Space Explorer
                  </button>
                  <button
                    onClick={() => navigate('/quiz')}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-left"
                  >
                    🧠 Take a Quiz
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage