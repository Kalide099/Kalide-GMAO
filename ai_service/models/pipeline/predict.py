"""
Model 5: Pipeline Anomaly — Prediction Module
"""

import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "autoencoder_pipeline.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")
THRESHOLD_PATH = os.path.join(BASE_DIR, "threshold.joblib")

_model = None
_scaler = None
_threshold = None


def load():
    global _model, _scaler, _threshold
    if not os.path.exists(MODEL_PATH):
        print("[Pipeline] Model not trained yet. Run train.py first.")
        return False

    _model = joblib.load(MODEL_PATH)
    _scaler = joblib.load(SCALER_PATH)
    _threshold = joblib.load(THRESHOLD_PATH)
    print("[Pipeline] Autoencoder anomaly model loaded successfully.")
    return True


def predict(sensor_data: dict) -> dict:
    """
    Detect anomalies in pipeline/fluid system sensor readings.

    Args:
        sensor_data: dict with keys:
            flow_rate_lps, pressure_bar, ph_level,
            turbidity_ntu, chlorine_ppm, conductivity_us, water_temp_c
    """
    if _model is None:
        return {"error": "Model not loaded", "anomaly": None}

    features = np.array([[
        sensor_data.get("flow_rate_lps", 45),
        sensor_data.get("pressure_bar", 4.5),
        sensor_data.get("ph_level", 7.2),
        sensor_data.get("turbidity_ntu", 1.5),
        sensor_data.get("chlorine_ppm", 1.5),
        sensor_data.get("conductivity_us", 450),
        sensor_data.get("water_temp_c", 18)
    ]])

    features_scaled = _scaler.transform(features)
    reconstruction = _model.predict(features_scaled)
    mse = float(np.mean(np.power(features_scaled - reconstruction, 2)))

    is_anomaly = mse > _threshold

    # Normalize reconstruction error to a 0-1 severity scale
    severity = min(1.0, mse / (_threshold * 3))
    confidence = min(0.99, severity if is_anomaly else 1 - severity)

    if is_anomaly:
        if severity > 0.7:
            action = "repair"
            note_en = f"CRITICAL: Major pipeline anomaly detected (severity: {severity:.0%}). Possible leak or contamination event."
            note_fr = f"CRITIQUE: Anomalie majeure de pipeline détectée (sévérité: {severity:.0%}). Possible fuite ou contamination."
        else:
            action = "overhaul"
            note_en = f"Pipeline anomaly detected (severity: {severity:.0%}). Investigate flow and pressure readings."
            note_fr = f"Anomalie de pipeline détectée (sévérité: {severity:.0%}). Investiguer les lectures de débit et pression."
    else:
        action = "monitor"
        note_en = "Pipeline system operating normally. All parameters within expected range."
        note_fr = "Système de pipeline fonctionnant normalement. Tous les paramètres dans la plage attendue."

    return {
        "model": "pipeline_autoencoder",
        "prediction_type": "anomaly_detection",
        "anomaly_detected": bool(is_anomaly),
        "reconstruction_error": round(mse, 6),
        "anomaly_threshold": round(float(_threshold), 6),
        "severity": round(severity, 4),
        "confidence": round(confidence, 4),
        "recommended_action": action,
        "note_en": note_en,
        "note_fr": note_fr
    }
