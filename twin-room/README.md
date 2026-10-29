# Digital Twin Room

Upload a photo of a room, detect the furniture with YOLOv8, and get a 3D version of it (React + Three.js).

## Run the frontend

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173

## Run the backend (optional)

Without the backend the app falls back to random mock detection.

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Runs on http://127.0.0.1:5000. To point the frontend elsewhere, set `VITE_API_URL` in a `.env` file.

Note: yolov8n is trained on the COCO dataset, which has no "lamp" class, so a real
detection will never place the lamp. Beds, chairs/couches, desks (dining table/laptop), and TVs work.
