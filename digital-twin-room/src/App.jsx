import { useState } from 'react'
import Scene from './components/Scene'
import UI from './components/UI'

function App() {
  const [detectedObjects, setDetectedObjects] = useState([])
  const [roomReady, setRoomReady] = useState(false)
  const [furnitureColor, setFurnitureColor] = useState('#4a4a8a')
  const [isNight, setIsNight] = useState(true)

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Scene
          detectedObjects={detectedObjects}
          roomReady={roomReady}
          furnitureColor={furnitureColor}
          isNight={isNight}
        />
      </div>
      <div className="absolute inset-0" style={{ zIndex: 1, pointerEvents: 'none' }}>
        <UI
          setDetectedObjects={setDetectedObjects}
          setRoomReady={setRoomReady}
          detectedObjects={detectedObjects}
          roomReady={roomReady}
          furnitureColor={furnitureColor}
          setFurnitureColor={setFurnitureColor}
          isNight={isNight}
          setIsNight={setIsNight}
        />
      </div>
    </div>
  )
}

export default App