"""
Model 5: Pipeline Anomaly Detection (Autoencoder via MLPRegressor)
Dataset: Synthetic water distribution sensor data
Industries: environment, public_works
Output: Reconstruction error anomaly score

Note: Uses scikit-learn MLPRegressor as an Autoencoder for Python 3.14 compatibility.
"""

import os
import numpy as np
import pandas as pd
import json
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import (precision_score, recall_score, f1_score,
                             accuracy_score, confusion_matrix, roc_auc_score)
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_PATH = os.path.join(BASE_DIR, "autoencoder_pipeline.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")
THRESHOLD_PATH = os.path.join(BASE_DIR, "threshold.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")


def train():
    """Train MLP Autoencoder for pipeline anomaly detection."""
    print("\n[Model 5: Pipeline] Loading synthetic pipeline dataset...")

    df = pd.read_csv(os.path.join(DATASET_DIR, "pipeline_sensors.csv"))

    feature_cols = [
        "flow_rate_lps", "pressure_bar", "ph_level",
        "turbidity_ntu", "chlorine_ppm", "conductivity_us", "water_temp_c"
    ]

    X = df[feature_cols].values
    y_true = df["anomaly"].values

    # Scale
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(feature_cols, os.path.join(BASE_DIR, "feature_cols.joblib"))

    # Split: train only on normal data
    X_normal = X_scaled[y_true == 0]
    X_anomaly = X_scaled[y_true == 1]

    X_train, X_val = train_test_split(X_normal, test_size=0.2, random_state=42)

    print(f"  Normal samples: {len(X_normal)} | Anomaly samples: {len(X_anomaly)}")
    print(f"  Training on: {len(X_train)} normal | Validating: {len(X_val)} normal")

    # Build Autoencoder using MLPRegressor
    # Architecture: 7 (input) -> 16 -> 8 (bottleneck) -> 16 -> 7 (output)
    print("  Training MLP Autoencoder...")
    autoencoder = MLPRegressor(
        hidden_layer_sizes=(16, 8, 16),
        activation='relu',
        solver='adam',
        alpha=0.0001,
        batch_size=32,
        learning_rate='constant',
        learning_rate_init=0.001,
        max_iter=50,
        random_state=42,
        early_stopping=True,
        validation_fraction=0.1,
        verbose=False
    )

    # Train to reconstruct the input
    autoencoder.fit(X_train, X_train)
    joblib.dump(autoencoder, MODEL_PATH)

    # Determine threshold using validation set reconstruction error
    val_reconstructions = autoencoder.predict(X_val)
    val_mse = np.mean(np.power(X_val - val_reconstructions, 2), axis=1)
    threshold = float(np.percentile(val_mse, 95))  # 95th percentile of normal data
    joblib.dump(threshold, THRESHOLD_PATH)

    print(f"  Anomaly threshold: {threshold:.6f}")

    # Evaluate on full dataset
    all_reconstructions = autoencoder.predict(X_scaled)
    all_mse = np.mean(np.power(X_scaled - all_reconstructions, 2), axis=1)
    y_pred = (all_mse > threshold).astype(int)

    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    auc = roc_auc_score(y_true, all_mse)
    cm = confusion_matrix(y_true, y_pred)

    metrics = {
        "model": "Pipeline Anomaly Detection (MLP Autoencoder)",
        "dataset": "Synthetic Water Distribution Data",
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "auc_roc": round(float(auc), 4),
        "threshold": round(threshold, 6),
        "total_samples": int(len(X)),
        "normal_samples": int(len(X_normal)),
        "anomaly_samples": int(len(X_anomaly)),
        "confusion_matrix": cm.tolist(),
        "architecture": "7 → 16 → 8 → 16 → 7"
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\n  [SUCCESS] Model 5 trained successfully!")
    print(f"  Accuracy: {accuracy:.4f} | Precision: {precision:.4f} | Recall: {recall:.4f} | F1: {f1:.4f} | AUC: {auc:.4f}")
    return metrics


if __name__ == "__main__":
    train()
