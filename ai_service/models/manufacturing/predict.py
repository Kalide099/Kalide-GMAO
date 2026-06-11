"""
Model 2: Manufacturing Failure — Prediction Module
"""

import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "xgb_manufacturing.joblib")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.joblib")

_model = None
_encoder = None


def load():
    """Load the trained XGBoost model and label encoder."""
    global _model, _encoder
    if not os.path.exists(MODEL_PATH):
        print("[Manufacturing] Model not trained yet. Run train.py first.")
        return False

    _model = joblib.load(MODEL_PATH)
    _encoder = joblib.load(ENCODER_PATH)
    print("[Manufacturing] XGBoost failure classifier loaded successfully.")
    return True


def predict(sensor_data: dict) -> dict:
    """
    Predict failure type for manufacturing equipment.

    Args:
        sensor_data: dict with keys:
            - type (L/M/H), air_temp, process_temp,
            - rotational_speed, torque, tool_wear

    Returns:
        dict with failure_type, confidence, recommendation
    """
    if _model is None:
        return {"error": "Model not loaded", "failure_type": None}

    # Map input to feature vector
    type_map = {"L": 0, "M": 1, "H": 2}
    product_type = type_map.get(sensor_data.get("type", "M"), 1)

    features = np.array([[
        product_type,
        sensor_data.get("air_temp", 300),
        sensor_data.get("process_temp", 310),
        sensor_data.get("rotational_speed", 1500),
        sensor_data.get("torque", 40),
        sensor_data.get("tool_wear", 0)
    ]])

    # Predict class and probabilities
    pred_class = _model.predict(features)[0]
    pred_proba = _model.predict_proba(features)[0]
    confidence = float(np.max(pred_proba))
    failure_type = _encoder.inverse_transform([pred_class])[0]

    # Recommendations
    action_map = {
        "No Failure": ("monitor", 
                       "Equipment operating within normal parameters.",
                       "Équipement fonctionnant dans les paramètres normaux."),
        "Tool Wear Failure": ("replace",
                              f"Tool wear failure predicted (confidence: {confidence:.0%}). Replace tooling immediately.",
                              f"Panne par usure d'outil prédite (confiance: {confidence:.0%}). Remplacez l'outillage immédiatement."),
        "Heat Dissipation Failure": ("repair",
                                    f"Heat dissipation failure predicted (confidence: {confidence:.0%}). Check cooling system.",
                                    f"Panne de dissipation thermique prédite (confiance: {confidence:.0%}). Vérifiez le système de refroidissement."),
        "Power Failure": ("repair",
                         f"Power failure predicted (confidence: {confidence:.0%}). Inspect electrical systems.",
                         f"Panne électrique prédite (confiance: {confidence:.0%}). Inspectez les systèmes électriques."),
        "Overstrain Failure": ("overhaul",
                              f"Overstrain failure predicted (confidence: {confidence:.0%}). Reduce load or replace component.",
                              f"Panne par surcharge prédite (confiance: {confidence:.0%}). Réduisez la charge ou remplacez le composant."),
        "Random Failure": ("monitor",
                          f"Random failure pattern detected (confidence: {confidence:.0%}). Increase monitoring frequency.",
                          f"Modèle de panne aléatoire détecté (confiance: {confidence:.0%}). Augmentez la fréquence de surveillance.")
    }

    action, note_en, note_fr = action_map.get(failure_type, ("monitor", "Unknown state.", "État inconnu."))

    return {
        "model": "manufacturing_xgboost",
        "prediction_type": "failure_classification",
        "failure_type": failure_type,
        "all_probabilities": {_encoder.inverse_transform([i])[0]: round(float(p), 4)
                              for i, p in enumerate(pred_proba)},
        "confidence": round(confidence, 4),
        "recommended_action": action,
        "note_en": note_en,
        "note_fr": note_fr
    }
