"""
Model 3: Fleet APS Failure — Prediction Module
"""

import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "gbm_fleet.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")

_model = None
_scaler = None


def load():
    global _model, _scaler
    if not os.path.exists(MODEL_PATH):
        print("[Fleet] Model not trained yet. Run train.py first.")
        return False

    _model = joblib.load(MODEL_PATH)
    _scaler = joblib.load(SCALER_PATH)
    print("[Fleet] GBM APS failure model loaded successfully.")
    return True


def predict(sensor_data: dict) -> dict:
    """
    Predict APS failure for fleet vehicles.

    Args:
        sensor_data: dict with keys:
            engine_load_pct, rpm, oil_pressure_psi, coolant_temp_c,
            fuel_pressure_kpa, brake_line_pressure_bar, aps_pressure_bar, mileage_km
    """
    if _model is None:
        return {"error": "Model not loaded", "failure_predicted": None}

    features = np.array([[
        sensor_data.get("engine_load_pct", 50),
        sensor_data.get("rpm", 1800),
        sensor_data.get("oil_pressure_psi", 45),
        sensor_data.get("coolant_temp_c", 90),
        sensor_data.get("fuel_pressure_kpa", 350),
        sensor_data.get("brake_line_pressure_bar", 8.5),
        sensor_data.get("aps_pressure_bar", 12),
        sensor_data.get("mileage_km", 200000)
    ]])

    features_scaled = _scaler.transform(features)
    pred = _model.predict(features_scaled)[0]
    pred_proba = _model.predict_proba(features_scaled)[0]
    failure_prob = float(pred_proba[1])
    confidence = float(max(pred_proba))

    if pred == 1:
        action = "repair"
        note_en = f"APS failure predicted with {failure_prob:.0%} probability. Inspect air pressure system immediately."
        note_fr = f"Panne APS prédite avec {failure_prob:.0%} de probabilité. Inspectez le système de pression d'air immédiatement."
    elif failure_prob > 0.3:
        action = "monitor"
        note_en = f"Elevated APS failure risk ({failure_prob:.0%}). Schedule preventive inspection."
        note_fr = f"Risque élevé de panne APS ({failure_prob:.0%}). Planifiez une inspection préventive."
    else:
        action = "monitor"
        note_en = "APS system operating within normal parameters."
        note_fr = "Système APS fonctionnant dans les paramètres normaux."

    return {
        "model": "fleet_gbm",
        "prediction_type": "binary_classification",
        "failure_predicted": bool(pred),
        "failure_probability": round(failure_prob, 4),
        "confidence": round(confidence, 4),
        "recommended_action": action,
        "note_en": note_en,
        "note_fr": note_fr
    }
