-- ============================================================
-- KGMAO Migration V10: AI Industry Type & Model Tracking
-- Adds industry_type column to companies for AI model routing
-- Adds AI tracking columns to failure_predictions
-- ============================================================

-- 1. Add industry_type to companies table (normalized key for AI routing)
-- This maps to the INDUSTRY_MODEL_MAP in ai_gateway.service.js
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS industry_type VARCHAR(50) NULL 
COMMENT 'Normalized industry key for AI model routing (e.g., manufacturing, energy, logistics)';

-- 2. Backfill industry_type from existing industry_en data
UPDATE companies SET industry_type = LOWER(TRIM(industry_en)) 
WHERE industry_type IS NULL AND industry_en IS NOT NULL;

-- 3. Add AI model tracking to failure_predictions
ALTER TABLE failure_predictions 
ADD COLUMN IF NOT EXISTS ai_model_archetype VARCHAR(50) NULL 
COMMENT 'Which AI model made this prediction (e.g., turbomachinery, manufacturing)';

ALTER TABLE failure_predictions 
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(5,4) NULL 
COMMENT 'ML model confidence score (0.0000 to 1.0000)';

ALTER TABLE failure_predictions 
ADD COLUMN IF NOT EXISTS prediction_source ENUM('statistical', 'ai', 'hybrid') DEFAULT 'statistical' 
COMMENT 'Whether prediction came from MTBF/MTTR stats, AI model, or both';

-- 4. Add AI tracking to ai_prescriptions table
ALTER TABLE ai_prescriptions 
ADD COLUMN IF NOT EXISTS model_archetype VARCHAR(50) NULL 
COMMENT 'AI model archetype that generated this prescription';

ALTER TABLE ai_prescriptions 
ADD COLUMN IF NOT EXISTS model_confidence DECIMAL(5,4) NULL 
COMMENT 'Model confidence score';

-- 5. Index for faster industry-based queries
CREATE INDEX IF NOT EXISTS idx_company_industry_type 
ON companies(industry_type);
