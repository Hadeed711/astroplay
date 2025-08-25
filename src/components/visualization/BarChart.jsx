import React, { useRef, useEffect, useState } from 'react'

const BarChart = ({ 
  data, 
  xKey, 
  yKey, 
  colorKey, 
  title, 
  xLabel, 
  yLabel, 
  tooltip,
  isTimeline = false 
}) => {
  const svgRef = useRef()
  const [hoveredBar, setHoveredBar] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = svgRef.current
    const margin = { top: 20, right: 20, bottom: 60, left: 60 }
    const width = svg.clientWidth - margin.left - margin.right
    const height = svg.clientHeight - margin.top - margin.bottom

    // Clear previous content
    svg.innerHTML = ''

    // Create main group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`)
    svg.appendChild(g)

    // Scales
    const maxY = Math.max(...data.map(d => d[yKey]))
    const xScale = (index) => (index * width) / data.length
    const yScale = (value) => height - (value / maxY) * height
    const barWidth = width / data.length * 0.8

    // Bars
    data.forEach((d, i) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', xScale(i) + (width / data.length - barWidth) / 2)
      rect.setAttribute('y', yScale(d[yKey]))
      rect.setAttribute('width', barWidth)
      rect.setAttribute('height', height - yScale(d[yKey]))
      rect.setAttribute('fill', colorKey ? d[colorKey] : '#3b82f6')
      rect.setAttribute('opacity', hoveredBar === i ? '1' : '0.8')
      rect.style.cursor = 'pointer'
      rect.style.transition = 'opacity 0.2s'
      
      rect.addEventListener('mouseenter', (e) => {
        setHoveredBar(i)
        setTooltipPos({ x: e.clientX, y: e.clientY })
      })
      rect.addEventListener('mouseleave', () => {
        setHoveredBar(null)
      })
      rect.addEventListener('mousemove', (e) => {
        setTooltipPos({ x: e.clientX, y: e.clientY })
      })
      
      g.appendChild(rect)
    })

    // X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    xAxis.setAttribute('x1', 0)
    xAxis.setAttribute('y1', height)
    xAxis.setAttribute('x2', width)
    xAxis.setAttribute('y2', height)
    xAxis.setAttribute('stroke', '#64748b')
    g.appendChild(xAxis)

    // Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    yAxis.setAttribute('x1', 0)
    yAxis.setAttribute('y1', 0)
    yAxis.setAttribute('x2', 0)
    yAxis.setAttribute('y2', height)
    yAxis.setAttribute('stroke', '#64748b')
    g.appendChild(yAxis)

    // X-axis labels
    data.forEach((d, i) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', xScale(i) + width / data.length / 2)
      text.setAttribute('y', height + 15)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('fill', '#94a3b8')
      text.setAttribute('font-size', '12')
      text.textContent = isTimeline ? d[xKey] : 
        (d[xKey].length > 8 ? d[xKey].substring(0, 8) + '...' : d[xKey])
      g.appendChild(text)
    })

    // Y-axis labels (reduced from 5 to 3 ticks)
    const yTicks = 3
    for (let i = 0; i <= yTicks; i++) {
      const value = (maxY / yTicks) * i
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', -10)
      text.setAttribute('y', yScale(value) + 4)
      text.setAttribute('text-anchor', 'end')
      text.setAttribute('fill', '#94a3b8')
      text.setAttribute('font-size', '12')
      text.textContent = Math.round(value)
      g.appendChild(text)

      if (i > 0) {
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        gridLine.setAttribute('x1', 0)
        gridLine.setAttribute('y1', yScale(value))
        gridLine.setAttribute('x2', width)
        gridLine.setAttribute('y2', yScale(value))
        gridLine.setAttribute('stroke', '#374151')
        gridLine.setAttribute('stroke-dasharray', '2,2')
        gridLine.setAttribute('opacity', '0.3')
        g.appendChild(gridLine)
      }
    }

    // Axis labels
    if (xLabel) {
      const xLabelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      xLabelEl.setAttribute('x', width / 2)
      xLabelEl.setAttribute('y', height + 45)
      xLabelEl.setAttribute('text-anchor', 'middle')
      xLabelEl.setAttribute('fill', '#e2e8f0')
      xLabelEl.setAttribute('font-size', '14')
      xLabelEl.setAttribute('font-weight', 'bold')
      xLabelEl.textContent = xLabel
      g.appendChild(xLabelEl)
    }

    if (yLabel) {
      const yLabelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      yLabelEl.setAttribute('x', -40)
      yLabelEl.setAttribute('y', height / 2)
      yLabelEl.setAttribute('text-anchor', 'middle')
      yLabelEl.setAttribute('fill', '#e2e8f0')
      yLabelEl.setAttribute('font-size', '14')
      yLabelEl.setAttribute('font-weight', 'bold')
      yLabelEl.setAttribute('transform', `rotate(-90, -40, ${height / 2})`)
      yLabelEl.textContent = yLabel
      g.appendChild(yLabelEl)
    }

  }, [data, xKey, yKey, colorKey, hoveredBar, isTimeline])

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
      
      {hoveredBar !== null && tooltip && (
        <div 
          className="absolute bg-slate-800 text-white px-3 py-2 rounded-lg text-sm border border-slate-600 pointer-events-none z-10 whitespace-pre-line"
          style={{ 
            left: tooltipPos.x - 100, 
            top: tooltipPos.y - 60,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip(data[hoveredBar])}
        </div>
      )}
    </div>
  )
}

export default BarChart
