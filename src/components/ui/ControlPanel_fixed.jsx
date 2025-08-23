import useAppStore from '../../store/useAppStore'

const ControlPanel = () => {
  const {
    showGravityField,
    showEventHorizon,
    showTimeDilation,
    showTravelAnimation,
    distanceFromSurface,
    spacecraftSpeed,
    orbitAltitude,
    toggleGravityField,
    toggleEventHorizon,
    toggleTimeDilation,
    toggleTravelAnimation,
    setDistanceFromSurface,
    setSpacecraftSpeed,
    setOrbitAltitude
  } = useAppStore()

  const Toggle = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between p-3 bg-space-dark/50 rounded-lg border border-space-blue/20">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        <div className="text-gray-400 text-xs">{description}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-space-gold' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const Slider = ({ label, value, onChange, min, max, step, unit, description }) => (
    <div className="p-3 bg-space-dark/50 rounded-lg border border-space-blue/20">
      <div className="flex justify-between items-center mb-2">
        <div className="text-white font-medium">{label}</div>
        <div className="text-space-gold font-mono">{value}{unit}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-gray-400 text-xs mt-1">{description}</div>
    </div>
  )

  return (
    <div>
      <h3 className="text-lg font-semibold text-space-gold mb-4">Controls</h3>
      
      {/* Visualization Toggles */}
      <div className="space-y-3 mb-6">
        <Toggle
          label="Gravity Field Lines"
          checked={showGravityField}
          onChange={toggleGravityField}
          description="Show gravitational field visualization"
        />

        <Toggle
          label="Event Horizon"
          checked={showEventHorizon}
          onChange={toggleEventHorizon}
          description="Show black hole event horizon"
        />
        
        <Toggle
          label="Time Dilation"
          checked={showTimeDilation}
          onChange={toggleTimeDilation}
          description="Visualize relativistic effects"
        />
        
        <Toggle
          label="🚀 Travel Animation"
          checked={showTravelAnimation}
          onChange={toggleTravelAnimation}
          description="Show 3D travel animation with rocket"
        />
      </div>

      {/* Parameter Sliders */}
      <div className="space-y-4">
        <Slider
          label="Distance from Surface"
          value={distanceFromSurface}
          onChange={setDistanceFromSurface}
          min={10}
          max={1000}
          step={10}
          unit=" km"
          description="Observer distance from object surface"
        />
        <Slider
          label="Spacecraft Speed"
          value={spacecraftSpeed}
          onChange={setSpacecraftSpeed}
          min={0.01}
          max={0.99}
          step={0.01}
          unit="c"
          description="Speed as fraction of light speed"
        />
        <Slider
          label="Orbit Altitude"
          value={orbitAltitude}
          onChange={setOrbitAltitude}
          min={100}
          max={2000}
          step={50}
          unit=" km"
          description="Orbital height above surface"
        />
      </div>
    </div>
  )
}

export default ControlPanel
