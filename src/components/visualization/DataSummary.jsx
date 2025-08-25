import React, { useMemo } from 'react'

const DataSummary = ({ data }) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null

    // Filter out invalid data
    const validData = data.filter(planet => 
      planet.pl_rade && planet.pl_masse && planet.sy_dist
    )

    // Basic statistics
    const totalPlanets = data.length
    const validCount = validData.length
    
    // Radius statistics
    const radii = validData.map(p => p.pl_rade).sort((a, b) => a - b)
    const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length
    const medianRadius = radii[Math.floor(radii.length / 2)]
    const maxRadius = Math.max(...radii)
    const minRadius = Math.min(...radii)
    
    // Mass statistics
    const masses = validData.map(p => p.pl_masse).sort((a, b) => a - b)
    const avgMass = masses.reduce((sum, m) => sum + m, 0) / masses.length
    const medianMass = masses[Math.floor(masses.length / 2)]
    const maxMass = Math.max(...masses)
    const minMass = Math.min(...masses)
    
    // Distance statistics
    const distances = validData.map(p => p.sy_dist).sort((a, b) => a - b)
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length
    const nearestDistance = Math.min(...distances)
    const farthestDistance = Math.max(...distances)
    
    // Temperature statistics
    const temperatures = data.filter(p => p.pl_eqt).map(p => p.pl_eqt)
    const avgTemp = temperatures.length > 0 ? 
      temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length : 0
    const hottestTemp = temperatures.length > 0 ? Math.max(...temperatures) : 0
    const coldestTemp = temperatures.length > 0 ? Math.min(...temperatures) : 0
    
    // Planet classifications
    const earthLike = validData.filter(p => p.pl_rade >= 0.5 && p.pl_rade <= 1.5).length
    const superEarths = validData.filter(p => p.pl_rade > 1.5 && p.pl_rade <= 3).length
    const neptunelike = validData.filter(p => p.pl_rade > 3 && p.pl_rade <= 8).length
    const gasGiants = validData.filter(p => p.pl_rade > 8).length
    
    // Over 10 Earth masses
    const massivePlanets = validData.filter(p => p.pl_masse > 10)
    
    // Discovery method breakdown
    const methodCounts = {}
    data.forEach(planet => {
      const method = planet.discoverymethod || 'Unknown'
      methodCounts[method] = (methodCounts[method] || 0) + 1
    })
    
    // Find extreme planets
    const largestPlanet = validData.find(p => p.pl_rade === maxRadius)
    const mostMassive = validData.find(p => p.pl_masse === maxMass)
    const nearest = validData.find(p => p.sy_dist === nearestDistance)
    const hottest = data.find(p => p.pl_eqt === hottestTemp)
    
    return {
      totalPlanets,
      validCount,
      avgRadius: avgRadius.toFixed(2),
      medianRadius: medianRadius.toFixed(2),
      maxRadius: maxRadius.toFixed(2),
      minRadius: minRadius.toFixed(2),
      avgMass: avgMass.toFixed(2),
      medianMass: medianMass.toFixed(2),
      maxMass: maxMass.toFixed(2),
      minMass: minMass.toFixed(2),
      avgDistance: avgDistance.toFixed(1),
      nearestDistance: nearestDistance.toFixed(1),
      farthestDistance: farthestDistance.toFixed(1),
      avgTemp: avgTemp.toFixed(0),
      hottestTemp: hottestTemp.toFixed(0),
      coldestTemp: coldestTemp.toFixed(0),
      earthLike,
      superEarths,
      neptunelike,
      gasGiants,
      massivePlanets: massivePlanets.length,
      methodCounts,
      largestPlanet,
      mostMassive,
      nearest,
      hottest
    }
  }, [data])

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No data available for analysis</p>
      </div>
    )
  }

  const StatCard = ({ title, value, unit, description, highlight = false }) => (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-blue-900/50 border border-blue-500/30' : 'bg-slate-700/50'}`}>
      <div className="text-center">
        <div className={`text-2xl font-bold ${highlight ? 'text-blue-300' : 'text-white'}`}>
          {value} {unit && <span className="text-lg text-slate-400">{unit}</span>}
        </div>
        <div className={`text-sm font-medium ${highlight ? 'text-blue-200' : 'text-slate-300'}`}>
          {title}
        </div>
        {description && (
          <div className="text-xs text-slate-400 mt-1">{description}</div>
        )}
      </div>
    </div>
  )

  const ExtremeCard = ({ title, planet, metric, unit, icon }) => (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-purple-200">{title}</h4>
        <span className="text-2xl">{icon}</span>
      </div>
      {planet ? (
        <div>
          <div className="text-white font-bold">{planet.pl_name}</div>
          <div className="text-purple-300">{metric} {unit}</div>
          <div className="text-xs text-purple-400 mt-1">
            System: {planet.hostname}
          </div>
        </div>
      ) : (
        <div className="text-purple-400">Data not available</div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Dataset Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Planets" 
            value={stats.totalPlanets} 
            highlight={true}
          />
          <StatCard 
            title="With Complete Data" 
            value={stats.validCount} 
          />
          <StatCard 
            title="Discovery Methods" 
            value={Object.keys(stats.methodCounts).length} 
          />
          <StatCard 
            title="Massive Planets" 
            value={stats.massivePlanets} 
            description="> 10 Earth masses"
          />
        </div>
      </div>

      {/* Size & Mass Statistics */}
      <div>
        <h3 className="text-xl font-heading font-semibold mb-4">📏 Size & Mass Statistics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-blue-300">Planet Radius (Earth Radii)</h4>
            <div className="grid grid-cols-2 gap-3">
              <StatCard title="Average" value={stats.avgRadius} unit="R⊕" />
              <StatCard title="Median" value={stats.medianRadius} unit="R⊕" />
              <StatCard title="Largest" value={stats.maxRadius} unit="R⊕" />
              <StatCard title="Smallest" value={stats.minRadius} unit="R⊕" />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-green-300">Planet Mass (Earth Masses)</h4>
            <div className="grid grid-cols-2 gap-3">
              <StatCard title="Average" value={stats.avgMass} unit="M⊕" />
              <StatCard title="Median" value={stats.medianMass} unit="M⊕" />
              <StatCard title="Most Massive" value={stats.maxMass} unit="M⊕" />
              <StatCard title="Least Massive" value={stats.minMass} unit="M⊕" />
            </div>
          </div>
        </div>
      </div>

      {/* Planet Classifications */}
      <div>
        <h3 className="text-xl font-heading font-semibold mb-4">🪐 Planet Classifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Earth-like" 
            value={stats.earthLike} 
            description="0.5-1.5 R⊕"
            highlight={true}
          />
          <StatCard 
            title="Super-Earths" 
            value={stats.superEarths} 
            description="1.5-3 R⊕"
          />
          <StatCard 
            title="Neptune-like" 
            value={stats.neptunelike} 
            description="3-8 R⊕"
          />
          <StatCard 
            title="Gas Giants" 
            value={stats.gasGiants} 
            description="> 8 R⊕"
          />
        </div>
      </div>

      {/* Distance & Temperature */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-heading font-semibold mb-4">🌌 Distance Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard title="Average Distance" value={stats.avgDistance} unit="pc" />
            <StatCard title="Nearest System" value={stats.nearestDistance} unit="pc" />
            <StatCard title="Farthest System" value={stats.farthestDistance} unit="pc" />
            <StatCard title="In Light Years" value={(stats.nearestDistance * 3.26).toFixed(1)} unit="ly" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold mb-4">🌡️ Temperature Range</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard title="Average Temp" value={stats.avgTemp} unit="K" />
            <StatCard title="Hottest Planet" value={stats.hottestTemp} unit="K" />
            <StatCard title="Coldest Planet" value={stats.coldestTemp} unit="K" />
            <StatCard title="Earth's Temp" value="255" unit="K" description="For comparison" />
          </div>
        </div>
      </div>

      {/* Record Holders */}
      <div>
        <h3 className="text-xl font-heading font-semibold mb-4">🏆 Record Holders</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ExtremeCard 
            title="Largest Planet"
            planet={stats.largestPlanet}
            metric={stats.maxRadius}
            unit="R⊕"
            icon="🌍"
          />
          <ExtremeCard 
            title="Most Massive"
            planet={stats.mostMassive}
            metric={stats.maxMass}
            unit="M⊕"
            icon="⚖️"
          />
          <ExtremeCard 
            title="Nearest System"
            planet={stats.nearest}
            metric={stats.nearestDistance}
            unit="pc"
            icon="🎯"
          />
          <ExtremeCard 
            title="Hottest Planet"
            planet={stats.hottest}
            metric={stats.hottestTemp}
            unit="K"
            icon="🔥"
          />
        </div>
      </div>

      {/* Discovery Methods */}
      <div>
        <h3 className="text-xl font-heading font-semibold mb-4">🔍 Discovery Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.methodCounts).map(([method, count]) => (
            <StatCard 
              key={method}
              title={method}
              value={count}
              description={`${((count / stats.totalPlanets) * 100).toFixed(1)}%`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DataSummary
