import React, { useState, useMemo } from 'react'
import BarChart from './BarChart'
import ScatterPlot from './ScatterPlot'
import DistributionChart from './DistributionChart'

const ExoplanetCharts = ({ data }) => {
  const [activeChart, setActiveChart] = useState('radius-distribution')

  // Process data for different visualizations
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return {}

    // 1. Planet Radius Distribution
    const radiusRanges = [
      { range: '0-1 R⊕', min: 0, max: 1, color: '#22c55e' },
      { range: '1-2 R⊕', min: 1, max: 2, color: '#3b82f6' },
      { range: '2-4 R⊕', min: 2, max: 4, color: '#f59e0b' },
      { range: '4-8 R⊕', min: 4, max: 8, color: '#ef4444' },
      { range: '8+ R⊕', min: 8, max: Infinity, color: '#8b5cf6' }
    ]

    const radiusDistribution = radiusRanges.map(range => ({
      ...range,
      count: data.filter(planet => 
        planet.pl_rade >= range.min && planet.pl_rade < range.max
      ).length
    }))

    // 2. Distance vs Mass scatter plot
    const distanceMassData = data
      .filter(planet => planet.sy_dist && planet.pl_masse)
      .map(planet => ({
        x: planet.sy_dist,
        y: planet.pl_masse,
        name: planet.pl_name,
        type: planet.pl_type || 'Unknown',
        temperature: planet.pl_eqt
      }))

    // 3. Discovery method distribution
    const methodCounts = {}
    data.forEach(planet => {
      const method = planet.discoverymethod || 'Unknown'
      methodCounts[method] = (methodCounts[method] || 0) + 1
    })

    const discoveryMethods = Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count,
      color: {
        'Transit': '#3b82f6',
        'Radial Velocity': '#22c55e', 
        'Direct Imaging': '#f59e0b',
        'Gravitational Microlensing': '#ef4444',
        'Unknown': '#6b7280'
      }[method] || '#6b7280'
    }))

    // 4. Temperature vs Radius
    const tempRadiusData = data
      .filter(planet => planet.pl_eqt && planet.pl_rade)
      .map(planet => ({
        x: planet.pl_eqt,
        y: planet.pl_rade,
        name: planet.pl_name,
        distance: planet.sy_dist,
        type: planet.pl_type || 'Unknown'
      }))

    // 5. Discovery timeline
    const yearCounts = {}
    data.forEach(planet => {
      const year = planet.disc_year
      if (year) {
        yearCounts[year] = (yearCounts[year] || 0) + 1
      }
    })

    const discoveryTimeline = Object.entries(yearCounts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year)

    return {
      radiusDistribution,
      distanceMassData,
      discoveryMethods,
      tempRadiusData,
      discoveryTimeline
    }
  }, [data])

  const charts = [
    {
      id: 'radius-distribution',
      title: 'Planet Size Distribution',
      description: 'Distribution of exoplanet radii compared to Earth',
      component: 'bar'
    },
    {
      id: 'distance-mass',
      title: 'Distance vs Mass',
      description: 'Relationship between system distance and planet mass',
      component: 'scatter'
    },
    {
      id: 'discovery-methods',
      title: 'Discovery Methods',
      description: 'How exoplanets were discovered',
      component: 'bar'
    },
    {
      id: 'temperature-radius',
      title: 'Temperature vs Radius',
      description: 'Planet temperature compared to size',
      component: 'scatter'
    },
    {
      id: 'discovery-timeline',
      title: 'Discovery Timeline',
      description: 'Exoplanet discoveries over time',
      component: 'line'
    }
  ]

  const renderChart = () => {
    switch (activeChart) {
      case 'radius-distribution':
        return (
          <BarChart
            data={chartData.radiusDistribution}
            xKey="range"
            yKey="count"
            colorKey="color"
            title="Planet Radius Distribution"
            xLabel="Planet Radius (Earth Radii)"
            yLabel="Number of Planets"
            tooltip={(d) => `${d.range}: ${d.count} planets`}
          />
        )
      
      case 'distance-mass':
        return (
          <ScatterPlot
            data={chartData.distanceMassData}
            xKey="x"
            yKey="y"
            title="Distance vs Mass"
            xLabel="Distance (parsecs)"
            yLabel="Mass (Earth masses)"
            colorBy="type"
            tooltip={(d) => `${d.name}\nDistance: ${d.x?.toFixed(1)} pc\nMass: ${d.y?.toFixed(2)} M⊕\nType: ${d.type}`}
          />
        )
      
      case 'discovery-methods':
        return (
          <BarChart
            data={chartData.discoveryMethods}
            xKey="method"
            yKey="count"
            colorKey="color"
            title="Discovery Methods"
            xLabel="Detection Method"
            yLabel="Number of Planets"
            tooltip={(d) => `${d.method}: ${d.count} planets`}
          />
        )
      
      case 'temperature-radius':
        return (
          <ScatterPlot
            data={chartData.tempRadiusData}
            xKey="x"
            yKey="y"
            title="Temperature vs Radius"
            xLabel="Temperature (K)"
            yLabel="Radius (Earth radii)"
            colorBy="type"
            tooltip={(d) => `${d.name}\nTemp: ${d.x?.toFixed(0)} K\nRadius: ${d.y?.toFixed(2)} R⊕\nType: ${d.type}`}
          />
        )
      
      case 'discovery-timeline':
        return (
          <BarChart
            data={chartData.discoveryTimeline}
            xKey="year"
            yKey="count"
            title="Discovery Timeline"
            xLabel="Year"
            yLabel="Discoveries"
            tooltip={(d) => `${d.year}: ${d.count} discoveries`}
            isTimeline={true}
          />
        )
      
      default:
        return <div>Select a chart to view</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Chart Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charts.map(chart => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`p-4 rounded-lg text-left transition-all duration-200 ${
              activeChart === chart.id
                ? 'bg-blue-600 shadow-lg scale-105'
                : 'bg-slate-700/50 hover:bg-slate-600/50'
            }`}
          >
            <h3 className="font-semibold text-white mb-1">{chart.title}</h3>
            <p className="text-sm text-slate-300">{chart.description}</p>
          </button>
        ))}
      </div>

      {/* Active Chart */}
      <div className="bg-slate-700/30 rounded-lg p-6">
        <div className="h-96 w-full">
          {renderChart()}
        </div>
      </div>

      {/* Chart Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Quick Insights</h4>
          <div className="space-y-2 text-sm text-slate-300">
            {activeChart === 'radius-distribution' && (
              <>
                <p>• Most exoplanets are larger than Earth</p>
                <p>• "Super-Earths" (1-2 R⊕) are common</p>
                <p>• Very few Earth-sized planets detected</p>
              </>
            )}
            {activeChart === 'distance-mass' && (
              <>
                <p>• Massive planets easier to detect at greater distances</p>
                <p>• Detection bias toward larger planets</p>
                <p>• Nearest systems tend to have smaller planets</p>
              </>
            )}
            {activeChart === 'discovery-methods' && (
              <>
                <p>• Transit method most successful</p>
                <p>• Radial velocity effective for massive planets</p>
                <p>• Direct imaging rare but growing</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Data Notes</h4>
          <div className="space-y-2 text-sm text-slate-300">
            <p>• R⊕ = Earth radii (Earth = 1 R⊕)</p>
            <p>• M⊕ = Earth masses (Earth = 1 M⊕)</p>
            <p>• 1 parsec ≈ 3.26 light years</p>
            <p>• Temperature in Kelvin (Earth ≈ 255 K)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExoplanetCharts
