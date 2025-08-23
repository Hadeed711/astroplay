import React from 'react'

// Simple markdown renderer for basic formatting
const MarkdownRenderer = ({ content }) => {
  const renderContent = (text) => {
    // Split by lines and process each
    const lines = text.split('\n')
    const elements = []
    let currentElement = []
    let inList = false
    
    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        if (currentElement.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4 text-slate-200 leading-relaxed">{formatText(currentElement.join(' '))}</p>)
          currentElement = []
        }
        elements.push(<h1 key={index} className="text-3xl font-display font-bold mb-6 text-white tracking-tight">{line.substring(2)}</h1>)
      } else if (line.startsWith('## ')) {
        if (currentElement.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4 text-slate-200 leading-relaxed">{formatText(currentElement.join(' '))}</p>)
          currentElement = []
        }
        elements.push(<h2 key={index} className="text-2xl font-display font-semibold mb-4 mt-8 text-blue-400 tracking-tight">{line.substring(3)}</h2>)
      } else if (line.startsWith('### ')) {
        if (currentElement.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4 text-slate-200 leading-relaxed">{formatText(currentElement.join(' '))}</p>)
          currentElement = []
        }
        elements.push(<h3 key={index} className="text-xl font-heading font-semibold mb-3 mt-6 text-blue-300 tracking-tight">{line.substring(4)}</h3>)
      } 
      // List items
      else if (line.startsWith('- ')) {
        if (currentElement.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4 text-slate-200 leading-relaxed">{formatText(currentElement.join(' '))}</p>)
          currentElement = []
        }
        if (!inList) {
          inList = true
        }
        elements.push(
          <div key={index} className="flex items-start gap-2 mb-2 text-slate-200">
            <span className="text-blue-400 mt-2">•</span>
            <span>{formatText(line.substring(2))}</span>
          </div>
        )
      }
      // Horizontal rule
      else if (line.trim() === '---') {
        if (currentElement.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4 text-slate-200 leading-relaxed">{formatText(currentElement.join(' '))}</p>)
          currentElement = []
        }
        elements.push(<hr key={index} className="my-8 border-slate-600" />)
      }
      // Empty line
      else if (line.trim() === '') {
        if (currentElement.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4 text-slate-200 leading-relaxed">{formatText(currentElement.join(' '))}</p>)
          currentElement = []
        }
        inList = false
      }
      // Regular text
      else {
        if (line.trim()) {
          currentElement.push(line)
        }
      }
    })
    
    // Add remaining content
    if (currentElement.length > 0) {
      elements.push(<p key="final" className="mb-4 text-slate-200 leading-relaxed">{formatText(currentElement.join(' '))}</p>)
    }
    
    return elements
  }
  
  const formatText = (text) => {
    // Handle bold text **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    // Handle italic text *text*
    text = text.replace(/\*(.*?)\*/g, '<em class="text-blue-300">$1</em>')
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }
  
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      {renderContent(content)}
    </div>
  )
}

export default MarkdownRenderer