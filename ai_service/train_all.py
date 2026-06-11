"""
KGMAO AI Engine — Master Training Script
Trains all 5 model archetypes sequentially and outputs evaluation results.
"""

import os
import sys
import json
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)


def main():
    print("=" * 70)
    print("  KGMAO AI ENGINE — MASTER TRAINING PIPELINE")
    print("=" * 70)
    print()

    all_metrics = {}
    start_time = time.time()

    # ── Step 1: Generate Datasets ──────────────────────────────
    print("STEP 1: Generating / Downloading Datasets")
    print("-" * 50)
    from generate_datasets import (
        download_nasa_cmapss,
        download_ai4i_2020,
        generate_fleet_dataset,
        generate_hvac_dataset,
        generate_pipeline_dataset
    )

    download_nasa_cmapss()
    download_ai4i_2020()
    generate_fleet_dataset()
    generate_hvac_dataset()
    generate_pipeline_dataset()
    print()

    # ── Step 2: Train Model 1 (Turbomachinery LSTM) ────────────
    print("STEP 2: Training Model 1 — Turbomachinery RUL (LSTM)")
    print("-" * 50)
    try:
        from models.turbomachinery.train import train as train_turbo
        metrics = train_turbo()
        all_metrics["turbomachinery"] = metrics
    except Exception as e:
        print(f"  [ERROR] Model 1 training failed: {e}")
        all_metrics["turbomachinery"] = {"error": str(e)}
    print()

    # ── Step 3: Train Model 2 (Manufacturing XGBoost) ──────────
    print("STEP 3: Training Model 2 — Manufacturing Failure (XGBoost)")
    print("-" * 50)
    try:
        from models.manufacturing.train import train as train_mfg
        metrics = train_mfg()
        all_metrics["manufacturing"] = metrics
    except Exception as e:
        print(f"  [ERROR] Model 2 training failed: {e}")
        all_metrics["manufacturing"] = {"error": str(e)}
    print()

    # ── Step 4: Train Model 3 (Fleet GBM) ──────────────────────
    print("STEP 4: Training Model 3 — Fleet APS Failure (GBM)")
    print("-" * 50)
    try:
        from models.fleet.train import train as train_fleet
        metrics = train_fleet()
        all_metrics["fleet"] = metrics
    except Exception as e:
        print(f"  [ERROR] Model 3 training failed: {e}")
        all_metrics["fleet"] = {"error": str(e)}
    print()

    # ── Step 5: Train Model 4 (HVAC Isolation Forest) ──────────
    print("STEP 5: Training Model 4 — HVAC Anomaly (Isolation Forest)")
    print("-" * 50)
    try:
        from models.hvac.train import train as train_hvac
        metrics = train_hvac()
        all_metrics["hvac"] = metrics
    except Exception as e:
        print(f"  [ERROR] Model 4 training failed: {e}")
        all_metrics["hvac"] = {"error": str(e)}
    print()

    # ── Step 6: Train Model 5 (Pipeline Autoencoder) ───────────
    print("STEP 6: Training Model 5 — Pipeline Anomaly (Autoencoder)")
    print("-" * 50)
    try:
        from models.pipeline.train import train as train_pipe
        metrics = train_pipe()
        all_metrics["pipeline"] = metrics
    except Exception as e:
        print(f"  [ERROR] Model 5 training failed: {e}")
        all_metrics["pipeline"] = {"error": str(e)}
    print()

    # ── Summary ────────────────────────────────────────────────
    elapsed = time.time() - start_time

    output_path = os.path.join(BASE_DIR, "evaluation_results.json")
    with open(output_path, "w") as f:
        json.dump({
            "training_time_seconds": round(elapsed, 2),
            "models": all_metrics
        }, f, indent=2)

    print("=" * 70)
    print("  TRAINING COMPLETE — EVALUATION SUMMARY")
    print("=" * 70)
    print()

    for name, m in all_metrics.items():
        if "error" in m:
            print(f"  [ERROR] {name}: FAILED — {m['error']}")
        else:
            model_name = m.get("model", name)
            if "rmse" in m:
                print(f"  [SUCCESS] {model_name}: RMSE={m['rmse']}, MAE={m['mae']}, R²={m['r2_score']}")
            elif "f1_macro" in m:
                print(f"  [SUCCESS] {model_name}: Accuracy={m['accuracy']}, F1(macro)={m['f1_macro']}, F1(weighted)={m['f1_weighted']}")
            elif "f1_score" in m:
                print(f"  [SUCCESS] {model_name}: Accuracy={m['accuracy']}, F1={m['f1_score']}, Precision={m['precision']}, Recall={m['recall']}")
            elif "auc_roc" in m:
                print(f"  [SUCCESS] {model_name}: Accuracy={m['accuracy']}, F1={m['f1_score']}, AUC={m['auc_roc']}")

    print()
    print(f"  Total training time: {elapsed:.1f} seconds")
    print(f"  Results saved to: {output_path}")
    print("=" * 70)


if __name__ == "__main__":
    main()
