import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a1a3a" roughness={0.3} metalness={0.4} />
    </mesh>
  )
}

function Walls() {
  return (
    <>
      <mesh position={[0, 3, -6]} receiveShadow>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#0d0d1f" roughness={0.9} />
      </mesh>
      <mesh position={[-6, 3, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 20]} />
        <meshStandardMaterial color="#0d0d1f" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a1a" />
      </mesh>
    </>
  )
}

function Bed({ color = '#4a4a8a' }) {
  return (
    <group position={[2.5, 0, -1.5]}>
      {/* Legs */}
      {[[-1, 0.1, -1.5], [1, 0.1, -1.5], [-1, 0.1, 1.5], [1, 0.1, 1.5]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.12, 0.2, 0.12]} />
          <meshStandardMaterial color="#888" metalness={0.9} />
        </mesh>
      ))}
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2.2, 0.25, 3.2]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.52, 0.1]} castShadow>
        <boxGeometry args={[2.0, 0.18, 2.9]} />
        <meshStandardMaterial color="#f0f0ff" roughness={0.9} />
      </mesh>
      {/* Blanket */}
      <mesh position={[0, 0.63, 0.5]} castShadow>
        <boxGeometry args={[1.95, 0.08, 2.0]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Pillow 1 */}
      <mesh position={[-0.5, 0.65, -1.2]} castShadow>
        <boxGeometry args={[0.75, 0.14, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Pillow 2 */}
      <mesh position={[0.5, 0.65, -1.2]} castShadow>
        <boxGeometry args={[0.75, 0.14, 0.5]} />
        <meshStandardMaterial color="#ddddff" roughness={0.9} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 1.2, -1.65]} castShadow>
        <boxGeometry args={[2.2, 1.8, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Headboard detail */}
      <mesh position={[0, 1.2, -1.58]}>
        <boxGeometry args={[1.8, 1.4, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Chair() {
  return (
    <group position={[-1.5, 0, 2]}>
      {/* Legs */}
      {[[-0.38, 0.25, -0.38], [0.38, 0.25, -0.38], [-0.38, 0.25, 0.38], [0.38, 0.25, 0.38]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Seat cushion */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.9, 0.14, 0.9]} />
        <meshStandardMaterial color="#e94560" roughness={0.8} />
      </mesh>
      {/* Seat base */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.95, 0.04, 0.95]} />
        <meshStandardMaterial color="#cc3350" metalness={0.3} />
      </mesh>
      {/* Back support */}
      <mesh position={[0, 0.95, -0.42]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.08]} />
        <meshStandardMaterial color="#cc3350" metalness={0.3} />
      </mesh>
      {/* Back cushion */}
      <mesh position={[0, 1.1, -0.4]} castShadow>
        <boxGeometry args={[0.85, 0.75, 0.12]} />
        <meshStandardMaterial color="#e94560" roughness={0.8} />
      </mesh>
      {/* Armrests */}
      {[[-0.5, 0.72, 0], [0.5, 0.72, 0]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.8]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Desk() {
  return (
    <group position={[-3.5, 0, -2]}>
      {/* Legs */}
      {[[-0.9, 0.4, -0.38], [0.9, 0.4, -0.38], [-0.9, 0.4, 0.38], [0.9, 0.4, 0.38]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#666" metalness={0.9} />
        </mesh>
      ))}
      {/* Desktop */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[2.0, 0.06, 0.9]} />
        <meshStandardMaterial color="#1a2a3a" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Desktop edge glow */}
      <mesh position={[0, 0.85, 0.44]}>
        <boxGeometry args={[2.0, 0.02, 0.02]} />
        <meshStandardMaterial emissive="#00ffff" emissiveIntensity={2} color="#00ffff" />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, 1.0, -0.3]} castShadow>
        <boxGeometry args={[0.15, 0.35, 0.15]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
      {/* Monitor */}
      <mesh position={[0, 1.45, -0.32]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.06]} />
        <meshStandardMaterial color="#111" metalness={0.9} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.45, -0.28]}>
        <planeGeometry args={[1.1, 0.6]} />
        <meshStandardMaterial color="#001833" emissive="#0055ff" emissiveIntensity={0.8} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, 0.88, 0.15]} castShadow>
        <boxGeometry args={[0.9, 0.03, 0.3]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>
      {/* Mouse */}
      <mesh position={[0.55, 0.88, 0.15]} castShadow>
        <boxGeometry args={[0.12, 0.03, 0.2]} />
        <meshStandardMaterial color="#333" metalness={0.7} />
      </mesh>
      <pointLight position={[0, 1.2, 0]} intensity={0.5} color="#0055ff" distance={2} />
    </group>
  )
}

function TV() {
  return (
    <group position={[0, 0, -5.7]}>
      {/* Base */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.4]} />
        <meshStandardMaterial color="#222" metalness={0.9} />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.06, 0.9, 0.06]} />
        <meshStandardMaterial color="#333" metalness={0.9} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3.2, 1.85, 0.08]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.5, 0.05]}>
        <planeGeometry args={[3.0, 1.7]} />
        <meshStandardMaterial color="#001122" emissive="#0044cc" emissiveIntensity={0.6} />
      </mesh>
      {/* Screen content lines */}
      {[-0.4, 0, 0.4].map((y, i) => (
        <mesh key={i} position={[0, 1.5 + y, 0.06]}>
          <planeGeometry args={[2.0, 0.04]} />
          <meshStandardMaterial emissive="#00aaff" emissiveIntensity={1} color="#00aaff" />
        </mesh>
      ))}
      <pointLight position={[0, 1.5, 0.8]} intensity={2} color="#0044ff" distance={5} />
    </group>
  )
}

function Lamp() {
  return (
    <group position={[1.5, 0, 1.5]}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.12, 16]} />
        <meshStandardMaterial color="#333" metalness={0.9} />
      </mesh>
      {/* Pole bottom */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
        <meshStandardMaterial color="#888" metalness={0.95} />
      </mesh>
      {/* Pole top */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.6, 8]} />
        <meshStandardMaterial color="#888" metalness={0.95} />
      </mesh>
      {/* Shade outer */}
      <mesh position={[0, 1.72, 0]}>
        <coneGeometry args={[0.38, 0.5, 16, 1, true]} />
        <meshStandardMaterial color="#ff4466" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      {/* Shade inner glow */}
      <mesh position={[0, 1.72, 0]}>
        <coneGeometry args={[0.35, 0.48, 16, 1, true]} />
        <meshStandardMaterial color="#ff6688" emissive="#ff2244" emissiveIntensity={0.5} side={THREE.BackSide} />
      </mesh>
      <pointLight position={[0, 1.5, 0]} intensity={4} color="#ff88aa" distance={6} castShadow />
    </group>
  )
}

function Rug() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.01, 0.5]}>
      <planeGeometry args={[4, 3]} />
      <meshStandardMaterial color="#2a1a3a" roughness={1} />
    </mesh>
  )
}

function NeonLights() {
  return (
    <>
      {/* Left wall neon */}
      <mesh position={[-5.85, 5.2, 0]}>
        <boxGeometry args={[0.04, 0.04, 10]} />
        <meshStandardMaterial emissive="#00ffff" emissiveIntensity={4} color="#00ffff" />
      </mesh>
      {/* Back wall neon */}
      <mesh position={[0, 5.2, -5.85]}>
        <boxGeometry args={[10, 0.04, 0.04]} />
        <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={4} color="#ff00ff" />
      </mesh>
      {/* Floor neon strip left */}
      <mesh position={[-5.7, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 10]} />
        <meshStandardMaterial emissive="#00ffff" emissiveIntensity={3} color="#00ffff" />
      </mesh>
      {/* Floor neon strip back */}
      <mesh position={[0, 0.02, -5.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.05]} />
        <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={3} color="#ff00ff" />
      </mesh>
      <pointLight position={[-5, 3, 0]} intensity={3} color="#00ffff" distance={10} />
      <pointLight position={[0, 3, -5]} intensity={3} color="#ff00ff" distance={10} />
    </>
  )
}

function makeParticlePositions(count) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = Math.random() * 6
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12
  }
  return positions
}

function Particles() {
  const mesh = useRef()
  const count = 80
  // Generated once. Previously this ran on every render, so the particles
  // teleported whenever day/night or the bed colour changed.
  const positions = useMemo(() => makeParticlePositions(count), [])

  useFrame((_, delta) => {
    if (mesh.current) {
      const pos = mesh.current.geometry.attributes.position
      for (let i = 0; i < count; i++) {
        pos.array[i * 3 + 1] += delta * 0.1
        if (pos.array[i * 3 + 1] > 6) pos.array[i * 3 + 1] = 0
      }
      pos.needsUpdate = true
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00ffff" transparent opacity={0.6} />
    </points>
  )
}

function CameraFlythrough({ roomReady }) {
  const t = useRef(0)
  const done = useRef(false)

  useEffect(() => {
    if (roomReady) {
      t.current = 0
      done.current = false
    }
  }, [roomReady])

  useFrame((state, delta) => {
    if (!roomReady || done.current) return

    // OrbitControls re-aims the camera at its own target every frame, which
    // fights this animation. Switch it off while we fly, hand it back after.
    const controls = state.controls
    if (controls) controls.enabled = false

    t.current = Math.min(t.current + delta * 0.25, 1)
    const p = t.current
    const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p
    const angle = ease * Math.PI * 0.6
    state.camera.position.set(Math.sin(angle) * 11, 8 - ease * 2, Math.cos(angle) * 11)
    state.camera.lookAt(0, 1, 0)

    if (p >= 1) {
      done.current = true
      if (controls) {
        controls.target.set(0, 1, 0) // match lookAt above so there's no snap
        controls.enabled = true
        controls.update()
      }
    }
  })

  return null
}

export default function Scene({ detectedObjects, roomReady, furnitureColor, isNight }) {
  const showBed = detectedObjects.includes('bed')
  const showChair = detectedObjects.includes('chair')
  const showDesk = detectedObjects.includes('desk') || detectedObjects.includes('laptop')
  const showTV = detectedObjects.includes('tv')
  const showLamp = detectedObjects.includes('lamp')

  return (
    <Canvas
      shadows
      camera={{ position: [10, 7, 10], fov: 65 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ background: isNight ? '#05050f' : '#0a1525' }}
      onWheel={(e) => e.stopPropagation()}
    >
      <ambientLight intensity={isNight ? 0.5 : 2} />
      <directionalLight position={[5, 10, 5]} intensity={isNight ? 0.8 : 3} color={isNight ? '#aaaaff' : '#fffaee'} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-5, 8, -5]} intensity={isNight ? 0.3 : 1.5} />
      <directionalLight position={[0, 5, 8]} intensity={isNight ? 0.3 : 1.5} />

      <NeonLights />
      <Particles />
      <Floor />
      <Walls />
      <Rug />

      {roomReady ? (
        <>
          {showBed && <Bed color={furnitureColor} />}
          {showChair && <Chair />}
          {showDesk && <Desk />}
          {showTV && <TV />}
          {showLamp && <Lamp />}
        </>
      ) : (
        <>
          <Bed color={furnitureColor} />
          <Chair />
          <Desk />
          <TV />
          <Lamp />
        </>
      )}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={20} blur={2.5} />
      <OrbitControls makeDefault target={[0, 1, 0]} enablePan={true} enableZoom={true} enableRotate={true} minDistance={4} maxDistance={18} />
      <CameraFlythrough roomReady={roomReady} />
    </Canvas>
  )
}