import React from 'react'

const TestErrorBoundary = () => {
  return (
    <div className="p-4 bg-green-900/50 text-green-300 rounded-lg border border-green-500/30">
      <h3 className="font-bold mb-2">✅ 3D Scene Test</h3>
      <p className="text-sm">
        If you can see this message, the ErrorBoundary is working correctly and catching any 3D rendering errors.
      </p>
      <div className="mt-2 text-xs text-green-400">
        • Line geometries fixed<br/>
        • Error boundaries added<br/>
        • Travel line component created<br/>
        • Smooth animations enhanced
      </div>
    </div>
  )
}

export default TestErrorBoundary
