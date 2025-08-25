import React, { useRef, useEffect, useState } from 'react'

const ScatterPlot = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  xLabel, 
  yLabel, 
  colorBy,
  tooltip 
}) => {
  const svgRef = useRef()
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Color scheme for different categories
  const colors = {
    'Super Earth': '#22c55e',
    'Neptune-like': '#3b82f6', 
    'Gas Giant': '#f59e0b',
    'Terrestrial': '#10b981',
    'Hot Jupiter': '#ef4444',
    'Unknown': '#6b7280'
  }

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = svgRef.current
    const margin = { top: 20, right: 100, bottom: 60, left: 80 }
    const width = svg.clientWidth - margin.left - margin.right
    const height = svg.clientHeight - margin.top - margin.bottom

    // Clear previous content
    svg.innerHTML = ''

    // Create main group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`)
    svg.appendChild(g)

    // Scales
    const xExtent = [Math.min(...data.map(d => d[xKey])), Math.max(...data.map(d => d[xKey]))]
    const yExtent = [Math.min(...data.map(d => d[yKey])), Math.max(...data.map(d => d[yKey]))]
    
    // Add some padding to extents
    const xPadding = (xExtent[1] - xExtent[0]) * 0.1
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1
    xExtent[0] -= xPadding
    xExtent[1] += xPadding
    yExtent[0] -= yPadding
    yExtent[1] += yPadding

    const xScale = (value) => ((value - xExtent[0]) / (xExtent[1] - xExtent[0])) * width
    const yScale = (value) => height - ((value - yExtent[0]) / (yExtent[1] - yExtent[0])) * height

    // Grid lines (reduced from 5 to 3)
    const gridLines = 3
    for (let i = 0; i <= gridLines; i++) {
      // Vertical grid lines
      const x = (i / gridLines) * width
      const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      vLine.setAttribute('x1', x)
      vLine.setAttribute('y1', 0)
      vLine.setAttribute('x2', x)
      vLine.setAttribute('y2', height)
      vLine.setAttribute('stroke', '#374151')
      vLine.setAttribute('stroke-dasharray', '3,3')
      vLine.setAttribute('opacity', '0.2')
      g.appendChild(vLine)

      // Horizontal grid lines
      const y = (i / gridLines) * height
      const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      hLine.setAttribute('x1', 0)
      hLine.setAttribute('y1', y)
      hLine.setAttribute('x2', width)
      hLine.setAttribute('y2', y)
      hLine.setAttribute('stroke', '#374151')
      hLine.setAttribute('stroke-dasharray', '3,3')
      hLine.setAttribute('opacity', '0.2')
      g.appendChild(hLine)
    }

    // Data points
    data.forEach((d, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', xScale(d[xKey]))
      circle.setAttribute('cy', yScale(d[yKey]))
      circle.setAttribute('r', hoveredPoint === i ? '6' : '4')
      circle.setAttribute('fill', colorBy ? colors[d[colorBy]] || colors['Unknown'] : '#3b82f6')
      circle.setAttribute('opacity', hoveredPoint === i ? '1' : '0.7')
      circle.setAttribute('stroke', hoveredPoint === i ? '#fff' : 'none')
      circle.setAttribute('stroke-width', hoveredPoint === i ? '2' : '0')
      circle.style.cursor = 'pointer'
      circle.style.transition = 'all 0.2s'
      
      circle.addEventListener('mouseenter', (e) => {
        setHoveredPoint(i)
        setTooltipPos({ x: e.clientX, y: e.clientY })
      })
      circle.addEventListener('mouseleave', () => {
        setHoveredPoint(null)
      })
      circle.addEventListener('mousemove', (e) => {
        setTooltipPos({ x: e.clientX, y: e.clientY })
      })
      
      g.appendChild(circle)
    })

    // Axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    xAxis.setAttribute('x1', 0)
    xAxis.setAttribute('y1', height)
    xAxis.setAttribute('x2', width)
    xAxis.setAttribute('y2', height)
    xAxis.setAttribute('stroke', '#64748b')
    xAxis.setAttribute('stroke-width', '2')
    g.appendChild(xAxis)

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    yAxis.setAttribute('x1', 0)
    yAxis.setAttribute('y1', 0)
    yAxis.setAttribute('x2', 0)
    yAxis.setAttribute('y2', height)
    yAxis.setAttribute('stroke', '#64748b')
    yAxis.setAttribute('stroke-width', '2')
    g.appendChild(yAxis)

    // X-axis labels
    for (let i = 0; i <= gridLines; i++) {
      const value = xExtent[0] + (i / gridLines) * (xExtent[1] - xExtent[0])
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', (i / gridLines) * width)
      text.setAttribute('y', height + 20)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('fill', '#94a3b8')
      text.setAttribute('font-size', '12')
      text.textContent = value.toFixed(value > 100 ? 0 : 1)
      g.appendChild(text)
    }

    // Y-axis labels
    for (let i = 0; i <= gridLines; i++) {
      const value = yExtent[0] + (i / gridLines) * (yExtent[1] - yExtent[0])
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', -15)
      text.setAttribute('y', height - (i / gridLines) * height + 4)
      text.setAttribute('text-anchor', 'end')
      text.setAttribute('fill', '#94a3b8')
      text.setAttribute('font-size', '12')
      text.textContent = value.toFixed(value > 100 ? 0 : 1)
      g.appendChild(text)
    }

    // Axis labels
    if (xLabel) {
      const xLabelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      xLabelEl.setAttribute('x', width / 2)
      xLabelEl.setAttribute('y', height + 50)
      xLabelEl.setAttribute('text-anchor', 'middle')
      xLabelEl.setAttribute('fill', '#e2e8f0')
      xLabelEl.setAttribute('font-size', '14')
      xLabelEl.setAttribute('font-weight', 'bold')
      xLabelEl.textContent = xLabel
      g.appendChild(xLabelEl)
    }

    if (yLabel) {
      const yLabelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      yLabelEl.setAttribute('x', -50)
      yLabelEl.setAttribute('y', height / 2)
      yLabelEl.setAttribute('text-anchor', 'middle')
      yLabelEl.setAttribute('fill', '#e2e8f0')
      yLabelEl.setAttribute('font-size', '14')
      yLabelEl.setAttribute('font-weight', 'bold')
      yLabelEl.setAttribute('transform', `rotate(-90, -50, ${height / 2})`)
      yLabelEl.textContent = yLabel
      g.appendChild(yLabelEl)
    }

    // Legend (if colorBy is used)
    if (colorBy) {
      const uniqueTypes = [...new Set(data.map(d => d[colorBy]))]
      uniqueTypes.forEach((type, i) => {
        const legendY = 20 + i * 20
        
        const legendCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        legendCircle.setAttribute('cx', width + 20)
        legendCircle.setAttribute('cy', legendY)
        legendCircle.setAttribute('r', '6')
        legendCircle.setAttribute('fill', colors[type] || colors['Unknown'])
        g.appendChild(legendCircle)
        
        const legendText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        legendText.setAttribute('x', width + 35)
        legendText.setAttribute('y', legendY + 4)
        legendText.setAttribute('fill', '#e2e8f0')
        legendText.setAttribute('font-size', '12')
        legendText.textContent = type
        g.appendChild(legendText)
      })
    }

  }, [data, xKey, yKey, colorBy, hoveredPoint])

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '350px' }}
      />
      
      {hoveredPoint !== null && tooltip && (
        <div 
          className="absolute bg-slate-800 text-white px-3 py-2 rounded-lg text-sm border border-slate-600 pointer-events-none z-10 whitespace-pre-line"
          style={{ 
            left: tooltipPos.x - 100, 
            top: tooltipPos.y - 80,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip(data[hoveredPoint])}
        </div>
      )}
    </div>
  )
}

export default ScatterPlot
