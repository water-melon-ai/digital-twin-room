import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const OBJECTS = ['bed', 'chair', 'desk', 'tv', 'lamp']

const mockDetect = () => {
  const count = Math.floor(Math.random() * 3) + 2
  const shuffled = [...OBJECTS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const COLORS = [
  { hex: '#4a4a8a', label: 'Blue' },
  { hex: '#e94560', label: 'Red' },
  { hex: '#2a6a4a', label: 'Green' },
  { hex: '#6a4a2a', label: 'Brown' },
  { hex: '#4a6a6a', label: 'Teal' },
]

export default function UI({ setDetectedObjects, setRoomReady, detectedObjects, roomReady, furnitureColor, setFurnitureColor, isNight, setIsNight }) {
  const [uploading, setUploading] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [preview, setPreview] = useState(null)
  const [detected, setDetected] = useState([])
  const fileRef = useRef()

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setRoomReady(false)
    setDetected([])
    setDetectedObjects([])

    try {
      // Try real backend first
      const formData = new FormData()
      formData.append('image', file)
      setUploading(false)
      setDetecting(true)

      const response = await fetch('http://127.0.0.1:5000/detect', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      const results = data.detected

      setDetected(results)
      setDetectedObjects(results)
      setDetecting(false)
      await new Promise(r => setTimeout(r, 500))
      setRoomReady(true)

    } catch (err) {
      // Fallback to mock if backend not running
      console.log('Backend not available, using mock detection')
      setUploading(false)
      setDetecting(true)
      await new Promise(r => setTimeout(r, 2000))
      const results = mockDetect()
      setDetected(results)
      setDetectedObjects(results)
      setDetecting(false)
      await new Promise(r => setTimeout(r, 500))
      setRoomReady(true)
    }
  }
  return (
    <div className="w-full h-full" style={{ pointerEvents: 'none' }}>

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-4 bg-black/30 backdrop-blur-md border-b border-cyan-500/20"
        style={{ pointerEvents: 'auto' }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-cyan-400">DIGITAL TWIN</h1>
          <p className="text-xs text-cyan-300/50 tracking-widest">AI ROOM GENERATOR</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-400/70 tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Left panel */}
      <div
        className="absolute left-6 top-24 bottom-6 w-72 flex flex-col gap-4"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Upload card */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5"
        >
          <p className="text-xs text-cyan-400/70 tracking-widest mb-3">UPLOAD ROOM IMAGE</p>
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-cyan-500/40 rounded-xl p-4 text-center cursor-pointer hover:border-cyan-400 transition-all hover:bg-cyan-500/5"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-28 object-cover rounded-lg" />
            ) : (
              <div className="py-4">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-xs text-cyan-300/60">Click to upload</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => fileRef.current.click()}
            className="mt-3 w-full py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-sm tracking-widest hover:bg-cyan-500/30 transition-all"
          >
            {uploading ? 'UPLOADING...' : detecting ? 'DETECTING...' : 'SCAN ROOM'}
          </motion.button>
        </motion.div>

        {/* Detection results */}
        <AnimatePresence>
          {detected.length > 0 && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5"
            >
              <p className="text-xs text-cyan-400/70 tracking-widest mb-3">AI DETECTED OBJECTS</p>
              <div className="flex flex-col gap-2">
                {detected.map((obj, i) => (
                  <motion.div
                    key={obj}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-cyan-500/10 rounded-lg px-3 py-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-sm text-cyan-300 capitalize tracking-widest">{obj}</span>
                    <span className="ml-auto text-xs text-cyan-400/50">✓ PLACED</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status */}
        <AnimatePresence>
          {(uploading || detecting) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-ping" />
                <p className="text-xs text-yellow-400 tracking-widest">
                  {uploading ? 'UPLOADING IMAGE...' : 'AI SCANNING OBJECTS...'}
                </p>
              </div>
              <div className="mt-3 h-1 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: uploading ? '40%' : '100%' }}
                  transition={{ duration: uploading ? 1 : 2 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-6 left-80 right-6 flex items-center justify-center gap-4"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl px-6 py-3 flex gap-4 items-center flex-wrap justify-center">
          {[
            { icon: '🖱️', label: 'DRAG TO ROTATE' },
            { icon: '🔍', label: 'SCROLL TO ZOOM' },
            { icon: '✋', label: 'RIGHT CLICK PAN' },
          ].map((tip) => (
            <div key={tip.label} className="flex items-center gap-2">
              <span>{tip.icon}</span>
              <span className="text-xs text-cyan-400/50 tracking-widest">{tip.label}</span>
            </div>
          ))}

          <div className="w-px h-6 bg-cyan-500/20" />

          {/* Day/Night toggle */}
          <button
            onClick={() => setIsNight(!isNight)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
          >
            <span>{isNight ? '🌙' : '☀️'}</span>
            <span className="text-xs text-cyan-400 tracking-widest">{isNight ? 'NIGHT' : 'DAY'}</span>
          </button>

          <div className="w-px h-6 bg-cyan-500/20" />

          {/* Color switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-cyan-400/50 tracking-widest">BED COLOR</span>
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setFurnitureColor(c.hex)}
                title={c.label}
                className="w-5 h-5 rounded-full transition-all hover:scale-125"
                style={{
                  background: c.hex,
                  border: furnitureColor === c.hex ? '2px solid white' : '2px solid transparent'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Room ready badge */}
      <AnimatePresence>
        {roomReady && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute top-24 right-6 bg-black/40 backdrop-blur-md border border-green-500/40 rounded-2xl px-5 py-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 tracking-widest">3D ROOM GENERATED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}