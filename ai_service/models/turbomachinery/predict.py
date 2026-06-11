"""
Model 1: Turbomachinery RUL — Prediction Module
Uses Random Forest Regressor with rolling window features.
"""

import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "rf_rul_model.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")
CONFIG_PATH = os.path.join(BASE_DIR, "feature_config.joblib")

_model = None
_scaler = None
_config = None


def load():
    """Load the trained Random Forest model and scaler."""
    global _model, _scaler, _config
    if not os.path.exists(MODEL_PATH):
        print("[Turbomachinery] Model not trained yet. Run train.py first.")
        return False

    _model = joblib.load(MODEL_PATH)
    _scaler = joblib.load(SCALER_PATH)
    _config = joblib.load(CONFIG_PATH)
    print("[Turbomachinery] Random Forest RUL model loaded successfully.")
    return True


def predict(sensor_data: dict) -> dict:
    """
    Predict Remaining Useful Life for turbomachinery asset.

    Args:
        sensor_data: dict with sensor keys or simplified keys
                     (temperature, vibration, pressure, etc.)

    Returns:
        dict with rul_cycles, confidence, recommendation
    """
    if _model is None:
        return {"error": "Model not loaded", "rul_cycles": None}

    base_features = _config["base_features"]
    all_feature_cols = _config["all_feature_cols"]

    # Build base feature vector from input
    base_vector = []
    for f in base_features:
        base_vector.append(sensor_data.get(f, 0.0))

    # For single reading prediction, rolling mean = value, rolling std = 0
    rolling_mean = list(base_vector)  # Same as value for single reading
    rolling_std = [0.0] * len(base_features)  # No variance for single reading

    feature_vector = base_vector + rolling_mean + rolling_std

    # Ensure feature vector length matches
    if len(feature_vector) < len(all_feature_cols):
        feature_vector.extend([0.0] * (len(all_feature_cols) - len(feature_vector)))
    elif len(feature_vector) > len(all_feature_cols):
        feature_vector = feature_vector[:len(all_feature_cols)]

    # Normalize and predict
    X = np.array([feature_vector])
    X_scaled = _scaler.transform(X)
    rul_pred = float(_model.predict(X_scaled)[0])
    rul_pred = max(0, min(125, rul_pred))

    # Confidence based on prediction stability
    # For RF, we can use the std of individual tree predictions
    tree_predictions = np.array([tree.predict(X_scaled)[0] for tree in _model.estimators_])
    pred_std = float(np.std(tree_predictions))
    # Lower std = higher confidence
    confidence = min(0.98, max(0.3, 1 - (pred_std / 50)))

    # Recommendation
    if rul_pred < 15:
        action = "repair"
        note_en = f"CRITICAL: Estimated {int(rul_pred)} cycles remaining. Immediate overhaul required."
        note_fr = f"CRITIQUE: {int(rul_pred)} cycles restants estimés. Révision immédiate requise."
    elif rul_pred < 50:
        action = "overhaul"
        note_en = f"WARNING: Estimated {int(rul_pred)} cycles remaining. Schedule preventive overhaul."
        note_fr = f"AVERTISSEMENT: {int(rul_pred)} cycles restants estimés. Planifier une révision préventive."
    elif rul_pred < 100:
        action = "monitor"
        note_en = f"Asset has approximately {int(rul_pred)} cycles of useful life. Continue monitoring."
        note_fr = f"L'actif a environ {int(rul_pred)} cycles de vie utile. Continuer la surveillance."
    else:
        action = "monitor"
        note_en = f"Asset is healthy with {int(rul_pred)}+ cycles remaining."
        note_fr = f"L'actif est en bonne santé avec {int(rul_pred)}+ cycles restants."

    return {
        "model": "turbomachinery_rf",
        "prediction_type": "rul_regression",
        "rul_cycles": int(rul_pred),
        "confidence": round(confidence, 4),
        "prediction_std": round(pred_std, 4),
        "recommended_action": action,
        "note_en": note_en,
        "note_fr": note_fr
    }
