"""
KGMAO AI Microservice — FastAPI Application
Hosts 5 trained ML model archetypes with industry-aware routing.

Start: uvicorn main:app --host 0.0.0.0 --port 8100
"""

import os
import json
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ============================================================
# INDUSTRY → MODEL ROUTING MAP
# ============================================================
INDUSTRY_MODEL_MAP = {
    # Model 1: Turbomachinery RUL (LSTM)
    "aerospace": "turbomachinery",
    "energy": "turbomachinery",
    "oil_gas": "turbomachinery",
    "mining": "turbomachinery",

    # Model 2: Manufacturing Failure (XGBoost)
    "manufacturing": "manufacturing",
    "agrifood": "manufacturing",

    # Model 3: Fleet APS Failure (GBM)
    "logistics": "fleet",
    "construction": "fleet",

    # Model 4: HVAC Anomaly (Isolation Forest)
    "hospitality": "hvac",
    "healthcare": "hvac",
    "education": "hvac",
    "retail": "hvac",

    # Model 5: Pipeline Anomaly (Autoencoder)
    "environment": "pipeline",
    "public_works": "pipeline",
}

# ============================================================
# MODEL LOADERS
# ============================================================
model_modules = {}
model_status = {}


def load_all_models():
    """Load all trained models at startup."""
    print("\n" + "=" * 60)
    print("KGMAO AI ENGINE — Loading Models")
    print("=" * 60)

    model_dirs = {
        "turbomachinery": "models.turbomachinery.predict",
        "manufacturing": "models.manufacturing.predict",
        "fleet": "models.fleet.predict",
        "hvac": "models.hvac.predict",
        "pipeline": "models.pipeline.predict",
    }

    for name, module_path in model_dirs.items():
        try:
            mod = __import__(module_path, fromlist=["load", "predict"])
            loaded = mod.load()
            if loaded:
                model_modules[name] = mod
                model_status[name] = "loaded"
            else:
                model_status[name] = "not_trained"
                print(f"  ⚠ {name}: Model artifacts not found (not trained yet)")
        except Exception as e:
            model_status[name] = f"error: {str(e)}"
            print(f"  ❌ {name}: Failed to load — {e}")

    print(f"\nModels loaded: {sum(1 for v in model_status.values() if v == 'loaded')}/{len(model_dirs)}")
    print("=" * 60 + "\n")


# ============================================================
# FASTAPI APP
# ============================================================
app = FastAPI(
    title="KGMAO AI Engine",
    description="Multi-Model Predictive Maintenance Microservice",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST / RESPONSE MODELS
# ============================================================
class PredictionRequest(BaseModel):
    industry_type: str
    sensor_data: dict[str, Any]
    asset_id: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    service: str
    models_loaded: int
    models_total: int
    uptime_seconds: float


# ============================================================
# STARTUP EVENT
# ============================================================
_start_time = time.time()


@app.on_event("startup")
async def startup():
    load_all_models()


# ============================================================
# ENDPOINTS
# ============================================================

@app.get("/ai/health")
async def health_check():
    """Health check for the AI microservice."""
    loaded_count = sum(1 for v in model_status.values() if v == "loaded")
    return {
        "status": "healthy" if loaded_count > 0 else "degraded",
        "service": "KGMAO AI Engine",
        "models_loaded": loaded_count,
        "models_total": len(model_status),
        "model_status": model_status,
        "uptime_seconds": round(time.time() - _start_time, 2)
    }


@app.get("/ai/models")
async def list_models():
    """Return metadata about all loaded models including evaluation metrics."""
    models_info = {}

    for name in ["turbomachinery", "manufacturing", "fleet", "hvac", "pipeline"]:
        metrics_path = os.path.join(BASE_DIR, "models", name, "metrics.json")
        info = {
            "status": model_status.get(name, "unknown"),
            "industries": [k for k, v in INDUSTRY_MODEL_MAP.items() if v == name]
        }

        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                info["evaluation"] = json.load(f)

        models_info[name] = info

    return {"models": models_info}


@app.post("/ai/predict")
async def predict(request: PredictionRequest):
    """
    Main prediction endpoint.
    Routes to the correct model based on industry_type.
    """
    industry = request.industry_type.lower().strip()

    # Resolve model archetype
    model_name = INDUSTRY_MODEL_MAP.get(industry)
    if model_name is None:
        raise HTTPException(
            status_code=400,
            detail={
                "error": f"Unknown industry type: '{industry}'",
                "supported_industries": list(INDUSTRY_MODEL_MAP.keys())
            }
        )

    # Check if model is loaded
    if model_name not in model_modules:
        raise HTTPException(
            status_code=503,
            detail={
                "error": f"Model '{model_name}' is not available",
                "status": model_status.get(model_name, "unknown"),
                "message": "Model may not be trained yet. Run train_all.py first."
            }
        )

    # Run prediction
    try:
        mod = model_modules[model_name]
        result = mod.predict(request.sensor_data)

        return {
            "success": True,
            "industry_type": industry,
            "model_archetype": model_name,
            "asset_id": request.asset_id,
            "prediction": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": f"Prediction failed: {str(e)}",
                "model": model_name
            }
        )


@app.get("/ai/routing-map")
async def get_routing_map():
    """Returns the full industry-to-model routing configuration."""
    return {
        "routing_map": INDUSTRY_MODEL_MAP,
        "model_archetypes": {
            "turbomachinery": {
                "algorithm": "Random Forest Regressor",
                "prediction_type": "Remaining Useful Life (RUL) Regression",
                "dataset": "NASA C-MAPSS FD001"
            },
            "manufacturing": {
                "algorithm": "XGBoost Classifier",
                "prediction_type": "Multi-class Failure Classification",
                "dataset": "AI4I 2020 Predictive Maintenance"
            },
            "fleet": {
                "algorithm": "Gradient Boosting Classifier",
                "prediction_type": "Binary APS Failure Prediction",
                "dataset": "Synthetic APS Data"
            },
            "hvac": {
                "algorithm": "Isolation Forest",
                "prediction_type": "Unsupervised Anomaly Detection",
                "dataset": "Synthetic HVAC Sensor Data"
            },
            "pipeline": {
                "algorithm": "MLP Autoencoder",
                "prediction_type": "Reconstruction-based Anomaly Detection",
                "dataset": "Synthetic Water Distribution Data"
            }
        }
    }


# ============================================================
# DIRECT LAUNCH
# ============================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8100, reload=False)
