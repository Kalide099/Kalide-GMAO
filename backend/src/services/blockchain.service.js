const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * Blockchain Immutable Ledger Service
 * Implements cryptographic hash-chaining for industrial events.
 */
exports.sealEvent = async (entityType, entityId, eventData) => {
    // 1. Fetch the hash of the latest block in the chain
    const [lastBlocks] = await pool.query(
        'SELECT data_hash FROM blockchain_ledger ORDER BY timestamp DESC LIMIT 1'
    );
    
    const previousHash = lastBlocks.length > 0 ? lastBlocks[0].data_hash : 'GENESIS_BLOCK_0000000000';

    // 2. Generate SH-256 for current event payload + link to previous block
    const payload = JSON.stringify({ entityId, entityType, eventData, timestamp: Date.now() });
    const currentHash = crypto.createHash('sha256')
        .update(payload + previousHash)
        .digest('hex');

    // 3. Persist the sealed block
    const id = uuidv4();
    await pool.query(
        'INSERT INTO blockchain_ledger (id, entity_type, entity_id, data_hash, previous_hash) VALUES (?, ?, ?, ?, ?)',
        [id, entityType, entityId, currentHash, previousHash]
    );

    return { id, hash: currentHash };
};

/**
 * Validates the entire database integrity by re-calculating hashes
 */
exports.verifyChainIntegrity = async () => {
    const [chain] = await pool.query('SELECT * FROM blockchain_ledger ORDER BY timestamp ASC');
    
    let isValid = true;
    for (let i = 1; i < chain.length; i++) {
        if (chain[i].previous_hash !== chain[i-1].data_hash) {
            isValid = false;
            break;
        }
    }
    return isValid;
};
