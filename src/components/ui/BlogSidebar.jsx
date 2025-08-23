import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecentBlogs } from '../../data/blogs'

const BlogSidebar = () => {
  const navigate = useNavigate()
  const recentBlogs = getRecentBlogs(2)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-space-dark/80 rounded-lg border border-space-blue/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">📖 Latest Articles</h3>
        <button
          onClick={() => navigate('/blogs')}
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          View All →
        </button>
      </div>
      
      <div className="space-y-3">
        {recentBlogs.map(blog => (
          <article
            key={blog.id}
            className="cursor-pointer hover:bg-slate-700/50 p-3 rounded-lg transition-colors group"
            onClick={() => navigate(`/blog/${blog.id}`)}
          >
            {/* Category Icon */}
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {blog.category === 'Space News' ? '🚀' : '🌍'}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium">
                    {blog.category}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {formatDate(blog.date)}
                  </span>
                </div>
                
                {/* Title */}
                <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 text-sm mb-2">
                  {blog.title}
                </h4>
                
                {/* Excerpt */}
                <p className="text-slate-400 text-xs line-clamp-2">
                  {blog.excerpt}
                </p>
                
                {/* Read Time */}
                <div className="mt-2 text-xs text-slate-500">
                  {blog.readTime}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {/* Call to Action */}
      <div className="mt-4 pt-4 border-t border-slate-600">
        <button
          onClick={() => navigate('/blogs')}
          className="w-full px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm font-medium"
        >
          Explore All Articles 📚
        </button>
      </div>
    </div>
  )
}

export default BlogSidebar