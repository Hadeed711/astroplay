import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBlogs, getBlogsByCategory } from '../data/blogs'

const BlogsPage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const allBlogs = getAllBlogs()
  const filteredBlogs = selectedCategory === 'all' 
    ? allBlogs 
    : getBlogsByCategory(selectedCategory)

  const categories = [
    { key: 'all', label: 'All Posts', icon: '📚' },
    { key: 'Space News', label: 'Space News', icon: '🚀' },
    { key: 'Climate Science', label: 'Climate Science', icon: '🌍' }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-display font-bold mb-4 tracking-tight">📖 AstroPlay Blog</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore the latest in space exploration, climate science, and cosmic discoveries
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                selectedCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <article
              key={blog.id}
              className="bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/blog/${blog.id}`)}
            >
              {/* Blog Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-4xl">
                  {blog.category === 'Space News' ? '🌌' : '🌍'}
                </span>
              </div>
              
              {/* Blog Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-medium">
                    {blog.category}
                  </span>
                  <span className="text-slate-400 text-sm">{blog.readTime}</span>
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-heading font-bold mb-3 line-clamp-2 hover:text-blue-400 transition-colors tracking-tight">
                  {blog.title}
                </h2>
                
                {/* Excerpt */}
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                
                {/* Meta Info */}
                <div className="flex justify-between items-center text-sm text-slate-400">
                  <span>{blog.author}</span>
                  <span>{formatDate(blog.date)}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {blog.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Posts Message */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-heading font-bold mb-2 tracking-tight">No posts found</h3>
            <p className="text-slate-400">Try selecting a different category</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8">
            <h3 className="text-2xl font-heading font-bold mb-4 tracking-tight">Stay Updated</h3>
            <p className="text-blue-100 mb-6">
              Get the latest space news and climate science updates delivered to your inbox
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogsPage