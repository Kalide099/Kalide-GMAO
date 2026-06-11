"""
Model 2: Manufacturing Failure Classification (XGBoost)
Dataset: AI4I 2020 Predictive Maintenance (UCI-like synthetic)
Industries: manufacturing, agrifood
Output: Multi-class failure type prediction
"""

import os
import numpy as np
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (classification_report, f1_score,
                             accuracy_score, confusion_matrix)
import xgboost as xgb
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_PATH = os.path.join(BASE_DIR, "xgb_manufacturing.joblib")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")


def create_failure_label(row):
    """Map failure columns to a single failure type label."""
    if row["TWF"] == 1:
        return "Tool Wear Failure"
    elif row["HDF"] == 1:
        return "Heat Dissipation Failure"
    elif row["PWF"] == 1:
        return "Power Failure"
    elif row["OSF"] == 1:
        return "Overstrain Failure"
    elif row["RNF"] == 1:
        return "Random Failure"
    else:
        return "No Failure"


def train():
    """Train XGBoost classifier for manufacturing failure prediction."""
    print("\n[Model 2: Manufacturing] Loading AI4I 2020 dataset...")

    df = pd.read_csv(os.path.join(DATASET_DIR, "ai4i2020.csv"))

    # Create target label
    df["failure_type"] = df.apply(create_failure_label, axis=1)

    # Encode product type
    type_map = {"L": 0, "M": 1, "H": 2}
    df["type_encoded"] = df["Type"].map(type_map)

    # Feature columns
    feature_cols = [
        "type_encoded",
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]"
    ]

    X = df[feature_cols].values
    le = LabelEncoder()
    y = le.fit_transform(df["failure_type"])

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"  Training: {len(X_train)} samples | Testing: {len(X_test)} samples")
    print(f"  Classes: {list(le.classes_)}")

    # Train XGBoost
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="mlogloss",
        random_state=42,
        use_label_encoder=False
    )

    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False
    )

    # Save model and encoder
    joblib.dump(model, MODEL_PATH)
    joblib.dump(le, ENCODER_PATH)
    joblib.dump(feature_cols, os.path.join(BASE_DIR, "feature_cols.joblib"))

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    f1_macro = f1_score(y_test, y_pred, average="macro")
    f1_weighted = f1_score(y_test, y_pred, average="weighted")
    
    unique_labels = np.unique(np.concatenate((y_test, y_pred)))
    target_names_present = [le.classes_[i] for i in unique_labels]
    
    report = classification_report(y_test, y_pred, labels=unique_labels, target_names=target_names_present, output_dict=True)
    cm = confusion_matrix(y_test, y_pred)

    metrics = {
        "model": "Manufacturing Failure (XGBoost)",
        "dataset": "AI4I 2020 Predictive Maintenance (Synthetic)",
        "accuracy": round(float(accuracy), 4),
        "f1_macro": round(float(f1_macro), 4),
        "f1_weighted": round(float(f1_weighted), 4),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "n_classes": int(len(le.classes_)),
        "classes": list(le.classes_),
        "confusion_matrix": cm.tolist(),
        "classification_report": {k: v for k, v in report.items()
                                  if k not in ("accuracy", "macro avg", "weighted avg")}
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\n  [SUCCESS] Model 2 trained successfully!")
    print(f"  Accuracy: {accuracy:.4f} | F1 (macro): {f1_macro:.4f} | F1 (weighted): {f1_weighted:.4f}")
    return metrics


if __name__ == "__main__":
    train()
