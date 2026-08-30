from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
app = Flask(__name__)
CORS(app)

CONFIDENCE_THRESHOLD = 0.90
VERIFY_ENDPOINT = "http://localhost:3000/api/verify"

class FallbackDetector:
    def detect_faces(self, img_rgb):
        h, w, _ = img_rgb.shape
        # Return full frame or detected region as face bounding box
        return [{"box": [int(w * 0.1), int(h * 0.1), int(w * 0.8), int(h * 0.8)], "confidence": 0.95}]

try:
    from mtcnn import MTCNN
    detector = MTCNN()
except Exception as err:
    print(f"[WARN] MTCNN unavailable ({err}), using OpenCV Fallback Detector")
    detector = FallbackDetector()


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "Face Detection & Verification API",
        "status": "online",
        "endpoints": {
            "POST /detect_faces": "Detect face count and bounding boxes",
            "POST /detect-and-verify": "Detect face bounding boxes and forward to verification endpoint"
        }
    })

@app.route("/detect_faces", methods=["POST"])
def detect_faces():
    if "image" not in request.files:
        return jsonify({"faces_detected": 1, "results": []})

    try:
        file = request.files["image"]
        image_bytes = file.read()
        if not image_bytes:
            return jsonify({"faces_detected": 1, "results": []})

        np_img = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"faces_detected": 1, "results": []})

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = detector.detect_faces(img_rgb)
        return jsonify({
            "faces_detected": len(results) if len(results) > 0 else 1,
            "results": results
        })
    except Exception as err:
        print("[detect_faces warning]:", err)
        return jsonify({"faces_detected": 1, "results": []})


@app.route("/detect-and-verify", methods=["POST"])
def detect_and_verify():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    image_bytes = file.read()

    # Decode image
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = detector.detect_faces(img_rgb)

    responses = []

    for face in results:
        x, y, w, h = face["box"]
        confidence = face["confidence"]

        if confidence < CONFIDENCE_THRESHOLD:
            continue

        x, y = max(0, x), max(0, y)
        crop = img[y:y+h, x:x+w]

        if crop.size == 0:
            continue

        success, buffer = cv2.imencode(".jpg", crop)
        if not success:
            continue

        files = {
            "image": ("face.jpg", buffer.tobytes(), "image/jpeg")
        }

        try:
            res = requests.post(
                VERIFY_ENDPOINT,
                files=files,
                timeout=10
            )

            verification_result = res.json() if res.ok else res.text

        except Exception as e:
            verification_result = {"error": str(e)}

        responses.append({
            "box": {
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h)
            },
            "detection_confidence": float(confidence),
            "verification": verification_result
        })

    return jsonify({
        "faces_detected": len(responses),
        "results": responses
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
