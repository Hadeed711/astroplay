import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogById, getRecentBlogs } from '../data/blogs'
import MarkdownRenderer from '../components/ui/MarkdownRenderer'

const BlogPostPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
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

            {/* Featured Image Placeholder */}
            <div className="h-64 md:h-96 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-8 flex items-center justify-center">
              <span className="text-6xl">
                {blog.category === 'Space News' ? '🌌' : '🌍'}
              </span>
            </div>

            {/* Content */}
            <MarkdownRenderer content={blog.content} />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <h3 className="text-xl font-bold mb-4">Share this article</h3>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Share on Twitter
                </button>
                <button className="px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors">
                  Share on Facebook
                </button>
                <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors">
                  Copy Link
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
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
                        <h4 className="font-medium mb-2 line-clamp-2 text-sm">
                          {recentBlog.title}
                        </h4>
                        <div className="text-xs text-slate-400">
                          {formatDate(recentBlog.date)}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest space and climate science updates
                </p>
                <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Subscribe
                </button>
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