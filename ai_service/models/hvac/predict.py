"""
Model 4: HVAC Anomaly — Prediction Module
"""

import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "iforest_hvac.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")

_model = None
_scaler = None


def load():
    global _model, _scaler
    if not os.path.exists(MODEL_PATH):
        print("[HVAC] Model not trained yet. Run train.py first.")
        return False

    _model = joblib.load(MODEL_PATH)
    _scaler = joblib.load(SCALER_PATH)
    print("[HVAC] Isolation Forest anomaly model loaded successfully.")
    return True


def predict(sensor_data: dict) -> dict:
    """
    Detect anomalies in HVAC system sensor readings.

    Args:
        sensor_data: dict with keys:
            supply_air_temp_c, return_air_temp_c, humidity_pct,
            airflow_cfm, power_draw_kw, refrigerant_pressure_psi, runtime_hours
    """
    if _model is None:
        return {"error": "Model not loaded", "anomaly": None}

    features = np.array([[
        sensor_data.get("supply_air_temp_c", 22),
        sensor_data.get("return_air_temp_c", 24),
        sensor_data.get("humidity_pct", 45),
        sensor_data.get("airflow_cfm", 2000),
        sensor_data.get("power_draw_kw", 15),
        sensor_data.get("refrigerant_pressure_psi", 200),
        sensor_data.get("runtime_hours", 5000)
    ]])

    features_scaled = _scaler.transform(features)
    pred = _model.predict(features_scaled)[0]
    anomaly_score = float(_model.decision_function(features_scaled)[0])

    is_anomaly = pred == -1
    # Normalize score to 0-1 range (more negative = more anomalous)
    normalized_score = max(0, min(1, 0.5 - anomaly_score))
    confidence = normalized_score if is_anomaly else 1 - normalized_score

    if is_anomaly:
        if normalized_score > 0.8:
            action = "repair"
            note_en = f"CRITICAL HVAC anomaly detected (severity: {normalized_score:.0%}). Immediate inspection required."
            note_fr = f"Anomalie CVAC CRITIQUE détectée (sévérité: {normalized_score:.0%}). Inspection immédiate requise."
        else:
            action = "overhaul"
            note_en = f"HVAC anomaly detected (severity: {normalized_score:.0%}). Schedule maintenance within 24h."
            note_fr = f"Anomalie CVAC détectée (sévérité: {normalized_score:.0%}). Planifiez la maintenance sous 24h."
    else:
        action = "monitor"
        note_en = "HVAC system operating normally. No anomalies detected."
        note_fr = "Système CVAC fonctionnant normalement. Aucune anomalie détectée."

    return {
        "model": "hvac_isolation_forest",
        "prediction_type": "anomaly_detection",
        "anomaly_detected": bool(is_anomaly),
        "anomaly_score": round(normalized_score, 4),
        "confidence": round(confidence, 4),
        "recommended_action": action,
        "note_en": note_en,
        "note_fr": note_fr
    }
