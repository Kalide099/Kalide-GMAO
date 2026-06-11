"""
Model 1: Turbomachinery RUL Prediction (Random Forest Regressor)
Dataset: NASA C-MAPSS FD001 (Synthetic)
Industries: aerospace, energy, oil_gas, mining
Output: Remaining Useful Life (RUL) in cycles

Note: Uses Random Forest instead of LSTM for Python 3.14 compatibility.
Random Forest is a well-established algorithm for RUL prediction in academic literature.
"""

import os
import numpy as np
import pandas as pd
import json
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_PATH = os.path.join(BASE_DIR, "rf_rul_model.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")

# Sensor columns
SENSOR_COLS = [f"sensor_{i}" for i in range(1, 22)]
OP_COLS = [f"op_setting_{i}" for i in range(1, 4)]
MAX_RUL = 125  # Cap RUL to prevent skewed learning


def load_data():
    """Load and preprocess C-MAPSS data."""
    col_names = ["unit_id", "cycle"] + OP_COLS + SENSOR_COLS

    train_df = pd.read_csv(
        os.path.join(DATASET_DIR, "train_FD001.txt"),
        sep=r"\s+", header=None, names=col_names
    )

    test_df = pd.read_csv(
        os.path.join(DATASET_DIR, "test_FD001.txt"),
        sep=r"\s+", header=None, names=col_names
    )

    rul_df = pd.read_csv(
        os.path.join(DATASET_DIR, "RUL_FD001.txt"),
        header=None, names=["rul"]
    )

    return train_df, test_df, rul_df


def add_rul_column(df):
    """Calculate RUL for each row in training data."""
    max_cycles = df.groupby("unit_id")["cycle"].max().reset_index()
    max_cycles.columns = ["unit_id", "max_cycle"]
    df = df.merge(max_cycles, on="unit_id", how="left")
    df["rul"] = df["max_cycle"] - df["cycle"]
    df["rul"] = df["rul"].clip(upper=MAX_RUL)
    df.drop("max_cycle", axis=1, inplace=True)
    return df


def create_rolling_features(df, features, window=5):
    """Create rolling window statistical features per engine unit."""
    new_features = []
    for unit_id in df["unit_id"].unique():
        unit_data = df[df["unit_id"] == unit_id][features].copy()

        # Rolling mean and std for each feature
        rolling_mean = unit_data.rolling(window=window, min_periods=1).mean()
        rolling_mean.columns = [f"{c}_roll_mean" for c in features]

        rolling_std = unit_data.rolling(window=window, min_periods=1).std().fillna(0)
        rolling_std.columns = [f"{c}_roll_std" for c in features]

        combined = pd.concat([unit_data.reset_index(drop=True),
                              rolling_mean.reset_index(drop=True),
                              rolling_std.reset_index(drop=True)], axis=1)
        new_features.append(combined)

    return pd.concat(new_features, ignore_index=True)


def train():
    """Train Random Forest model for RUL prediction."""
    print("\n[Model 1: Turbomachinery] Loading NASA C-MAPSS dataset...")
    train_df, test_df, rul_df = load_data()
    train_df = add_rul_column(train_df)

    # Drop constant sensors (those with very low variance)
    sensor_variance = train_df[SENSOR_COLS].var()
    useful_sensors = sensor_variance[sensor_variance > 0.01].index.tolist()
    base_features = OP_COLS + useful_sensors

    print(f"  Using {len(base_features)} base features (dropped {len(SENSOR_COLS) - len(useful_sensors)} constant sensors)")

    # Create rolling window features for temporal context
    print("  Creating rolling window features...")
    train_features = create_rolling_features(train_df, base_features, window=5)
    all_feature_cols = list(train_features.columns)

    # Normalize features
    scaler = MinMaxScaler()
    X_train = scaler.fit_transform(train_features.values)
    y_train = train_df["rul"].values

    joblib.dump(scaler, SCALER_PATH)
    joblib.dump({
        "base_features": base_features,
        "all_feature_cols": all_feature_cols,
        "n_features": len(all_feature_cols)
    }, os.path.join(BASE_DIR, "feature_config.joblib"))

    print(f"  Training samples: {len(X_train)}, Total features: {len(all_feature_cols)}")

    # Train Random Forest Regressor
    print("  Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features='sqrt',
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)

    # Evaluate on test data (use last reading per engine)
    print("  Evaluating on test set...")
    test_features = create_rolling_features(test_df, base_features, window=5)
    X_test_all = scaler.transform(test_features.values)

    # Get last reading per engine
    X_test = []
    for unit_id in test_df["unit_id"].unique():
        unit_mask = test_df["unit_id"] == unit_id
        unit_indices = np.where(unit_mask.values)[0]
        last_idx = unit_indices[-1]
        X_test.append(X_test_all[last_idx])

    X_test = np.array(X_test)
    y_test = rul_df["rul"].values[:len(X_test)]
    y_test_capped = np.clip(y_test, 0, MAX_RUL)

    y_pred = model.predict(X_test)
    y_pred = np.clip(y_pred, 0, MAX_RUL)

    rmse = np.sqrt(mean_squared_error(y_test_capped, y_pred))
    mae = mean_absolute_error(y_test_capped, y_pred)
    r2 = r2_score(y_test_capped, y_pred)

    # Feature importance (top 10)
    importance = dict(zip(all_feature_cols, model.feature_importances_))
    top_features = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True)[:10])

    metrics = {
        "model": "Turbomachinery RUL (Random Forest)",
        "dataset": "NASA C-MAPSS FD001 (Synthetic)",
        "algorithm": "RandomForestRegressor",
        "rmse": round(float(rmse), 4),
        "mae": round(float(mae), 4),
        "r2_score": round(float(r2), 4),
        "train_samples": int(len(X_train)),
        "test_engines": int(len(X_test)),
        "max_rul_cap": MAX_RUL,
        "n_base_features": len(base_features),
        "n_total_features": len(all_feature_cols),
        "n_estimators": 200,
        "top_features": {k: round(float(v), 4) for k, v in top_features.items()}
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\n  [SUCCESS] Model 1 trained successfully!")
    print(f"  RMSE: {rmse:.2f} cycles | MAE: {mae:.2f} cycles | R²: {r2:.4f}")
    return metrics


if __name__ == "__main__":
    train()
