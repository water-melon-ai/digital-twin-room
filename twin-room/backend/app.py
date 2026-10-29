from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import io
import os
from PIL import Image, UnidentifiedImageError

app = Flask(__name__)
CORS(app)

# Load YOLO model. Path is relative to this file, so it works no matter which
# directory you start the server from (a bare 'yolov8n.pt' only works from backend/).
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'yolov8n.pt')
model = YOLO(MODEL_PATH)

# Objects we care about mapping to our 3D furniture
FURNITURE_MAP = {
    'bed': 'bed',
    'chair': 'chair',
    'couch': 'chair',
    'sofa': 'chair',
    'desk': 'desk',
    'dining table': 'desk',
    'laptop': 'desk',
    'tv': 'tv',
    'monitor': 'tv',
    'television': 'tv',
    'lamp': 'lamp',
    'book': 'desk',
    'keyboard': 'desk',
    'mouse': 'desk',
}

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    img_bytes = file.read()
    try:
        # convert('RGB') handles PNGs with alpha, palette images, etc.
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    except (UnidentifiedImageError, OSError):
        return jsonify({'error': 'File is not a valid image'}), 400

    # Run YOLO detection
    results = model(img, verbose=False)

    detected_furniture = set()

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id].lower()
            confidence = float(box.conf[0])

            if confidence > 0.3:  # only confident detections
                if class_name in FURNITURE_MAP:
                    detected_furniture.add(FURNITURE_MAP[class_name])

    return jsonify({
        'detected': list(detected_furniture),
        'count': len(detected_furniture)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)