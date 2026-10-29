from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load YOLO model
model = YOLO('yolov8n.pt')  # downloads automatically first time

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
    img = Image.open(io.BytesIO(img_bytes))

    # Run YOLO detection
    results = model(img)

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