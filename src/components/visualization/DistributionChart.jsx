import React from 'react'
import BarChart from './BarChart'

const DistributionChart = ({ data, title, xLabel, yLabel }) => {
  // This is a wrapper around BarChart for distribution-specific styling
  return (
    <BarChart 
      data={data}
      xKey="range"
      yKey="count"
      colorKey="color"
      title={title}
      xLabel={xLabel}
      yLabel={yLabel}
      tooltip={(d) => `${d.range}: ${d.count} items`}
    />
  )
}

export default DistributionChart
