"""
Model 4: HVAC Anomaly Detection (Isolation Forest)
Dataset: Synthetic HVAC sensor data
Industries: hospitality, healthcare, education, retail
Output: Anomaly score and binary anomaly flag
"""

import os
import numpy as np
import pandas as pd
import json
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (precision_score, recall_score, f1_score,
                             accuracy_score, confusion_matrix)
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_PATH = os.path.join(BASE_DIR, "iforest_hvac.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")


def train():
    """Train Isolation Forest for HVAC anomaly detection."""
    print("\n[Model 4: HVAC] Loading synthetic HVAC dataset...")

    df = pd.read_csv(os.path.join(DATASET_DIR, "hvac_sensors.csv"))

    feature_cols = [
        "supply_air_temp_c", "return_air_temp_c", "humidity_pct",
        "airflow_cfm", "power_draw_kw", "refrigerant_pressure_psi",
        "runtime_hours"
    ]

    X = df[feature_cols].values
    y_true = df["anomaly"].values

    # Scale
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print(f"  Total samples: {len(X)} | Anomaly rate: {y_true.mean():.2%}")

    # Train Isolation Forest (unsupervised, but we set contamination to match)
    contamination = float(y_true.mean())
    model = IsolationForest(
        n_estimators=200,
        contamination=contamination,
        max_features=1.0,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_scaled)

    # Save
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(feature_cols, os.path.join(BASE_DIR, "feature_cols.joblib"))

    # Evaluate
    y_pred_raw = model.predict(X_scaled)  # Returns 1 (normal) or -1 (anomaly)
    y_pred = (y_pred_raw == -1).astype(int)  # Convert to 0/1

    # Anomaly scores (lower = more anomalous)
    anomaly_scores = model.decision_function(X_scaled)

    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    cm = confusion_matrix(y_true, y_pred)

    metrics = {
        "model": "HVAC Anomaly Detection (Isolation Forest)",
        "dataset": "Synthetic HVAC Sensor Data",
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "contamination": round(contamination, 4),
        "total_samples": int(len(X)),
        "true_anomalies": int(y_true.sum()),
        "detected_anomalies": int(y_pred.sum()),
        "confusion_matrix": cm.tolist()
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\n  [SUCCESS] Model 4 trained successfully!")
    print(f"  Accuracy: {accuracy:.4f} | Precision: {precision:.4f} | Recall: {recall:.4f} | F1: {f1:.4f}")
    return metrics


if __name__ == "__main__":
    train()
