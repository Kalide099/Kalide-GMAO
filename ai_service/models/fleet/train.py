"""
Model 3: Fleet APS Failure Prediction (Gradient Boosting)
Dataset: Synthetic APS data (modeled after Scania APS)
Industries: logistics, construction
Output: Binary failure prediction (APS failure Yes/No)
"""

import os
import numpy as np
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import (accuracy_score, f1_score, precision_score,
                             recall_score, classification_report, confusion_matrix)
from sklearn.preprocessing import StandardScaler
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_PATH = os.path.join(BASE_DIR, "gbm_fleet.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")


def train():
    """Train Gradient Boosting classifier for fleet APS failure."""
    print("\n[Model 3: Fleet] Loading synthetic APS dataset...")

    df = pd.read_csv(os.path.join(DATASET_DIR, "fleet_aps.csv"))

    feature_cols = [
        "engine_load_pct", "rpm", "oil_pressure_psi", "coolant_temp_c",
        "fuel_pressure_kpa", "brake_line_pressure_bar", "aps_pressure_bar",
        "mileage_km"
    ]

    X = df[feature_cols].values
    y = df["aps_failure"].values

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"  Training: {len(X_train)} | Testing: {len(X_test)}")
    print(f"  Failure rate: {y.mean():.2%}")

    # Train Gradient Boosting
    model = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        random_state=42
    )

    model.fit(X_train, y_train)

    # Save
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(feature_cols, os.path.join(BASE_DIR, "feature_cols.joblib"))

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    metrics = {
        "model": "Fleet APS Failure (Gradient Boosting)",
        "dataset": "Synthetic APS (Scania-modeled)",
        "accuracy": round(float(accuracy), 4),
        "f1_score": round(float(f1), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "confusion_matrix": cm.tolist(),
        "feature_importance": {col: round(float(imp), 4)
                              for col, imp in zip(feature_cols, model.feature_importances_)}
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\n  [SUCCESS] Model 3 trained successfully!")
    print(f"  Accuracy: {accuracy:.4f} | F1: {f1:.4f} | Precision: {precision:.4f} | Recall: {recall:.4f}")
    return metrics


if __name__ == "__main__":
    train()
