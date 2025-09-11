import Navigation from './Navigation'
import Footer from './Footer'
import InteractiveBackground from '../ui/InteractiveBackground'
import { AudioControls } from '../audio/AudioSystem'
import GameControls from '../games/GameControls'
import { TouchUI } from '../mobile/TouchControls'
import { useResponsive } from '../responsive/ResponsiveLayout'
import useAppStore from '../../store/useAppStore'

const Layout = ({ children }) => {
  const { isMobile } = useResponsive()
  const { 
    showGravityField, 
    showEscapeVelocity, 
    showTimeDilation, 
    showTravelLine,
    setShowGravityField,
    setShowEscapeVelocity,
    setShowTimeDilation,
    setShowTravelLine
  } = useAppStore()

  const mobileControls = {
    gravity: { label: 'Gravity Field', enabled: showGravityField },
    escape: { label: 'Escape Velocity', enabled: showEscapeVelocity },
    time: { label: 'Time Dilation', enabled: showTimeDilation },
    travel: { label: 'Travel Line', enabled: showTravelLine }
  }

  const handleMobileToggle = (key, value) => {
    switch (key) {
      case 'gravity': setShowGravityField(value); break
      case 'escape': setShowEscapeVelocity(value); break
      case 'time': setShowTimeDilation(value); break
      case 'travel': setShowTravelLine(value); break
    }
  }

  return (
    <div className="min-h-screen bg-space-dark">
      <Navigation />
      <InteractiveBackground>
        <main className="relative">
          {children}
          
          {/* Audio Controls */}
          <div className="fixed top-16 md:top-20 right-2 md:right-4 z-40">
            <AudioControls />
          </div>
          
          {/* Game Controls */}
          <div className="fixed top-36 md:top-40 right-2 md:right-4 z-40">
            <GameControls />
          </div>
          
          {/* Mobile Touch Controls */}
          {isMobile && (
            <TouchUI 
              onToggle={handleMobileToggle}
              controls={mobileControls}
            />
          )}
        </main>
        <Footer />
      </InteractiveBackground>
    </div>
  )
}

export default Layout