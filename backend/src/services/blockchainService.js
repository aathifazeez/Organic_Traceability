const crypto = require('crypto');

/**
 * Simplified blockchain implementation for product traceability
 * In production, integrate with actual blockchain (Ethereum, Hyperledger, etc.)
 */

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Simplified difficulty
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), { type: 'genesis' }, '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            data,
            this.getLatestBlock().hash
        );
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    getBlock(hash) {
        return this.chain.find(block => block.hash === hash);
    }
}

// Singleton blockchain instance
let blockchainInstance = null;

/**
 * Get or create blockchain instance
 * @returns {Blockchain} Blockchain instance
 */
const getBlockchain = () => {
    if (!blockchainInstance) {
        blockchainInstance = new Blockchain();
    }
    return blockchainInstance;
};

/**
 * Add QR code record to blockchain
 * @param {object} qrData - QR code data
 * @returns {object} Block information
 */
const addQRToBlockchain = (qrData) => {
    const blockchain = getBlockchain();

    const blockData = {
        type: 'QR_CODE',
        qrId: qrData.qrId,
        productBatchId: qrData.productBatchId,
        productName: qrData.productName,
        manufacturer: qrData.manufacturer,
        timestamp: Date.now(),
    };

    const block = blockchain.addBlock(blockData);

    return {
        blockHash: block.hash,
        blockIndex: block.index,
        timestamp: block.timestamp,
        previousHash: block.previousHash,
    };
};

/**
 * Verify blockchain record
 * @param {string} blockHash - Block hash to verify
 * @returns {object} Verification result
 */
const verifyBlockchainRecord = (blockHash) => {
    const blockchain = getBlockchain();
    const block = blockchain.getBlock(blockHash);

    if (!block) {
        return {
            valid: false,
            message: 'Block not found',
        };
    }

    const isValid = blockchain.isChainValid();

    return {
        valid: isValid,
        block: block,
        message: isValid ? 'Blockchain record verified' : 'Blockchain integrity compromised',
    };
};

/**
 * Get blockchain statistics
 * @returns {object} Blockchain stats
 */
const getBlockchainStats = () => {
    const blockchain = getBlockchain();

    return {
        totalBlocks: blockchain.chain.length,
        isValid: blockchain.isChainValid(),
        latestBlock: blockchain.getLatestBlock(),
        difficulty: blockchain.difficulty,
    };
};

module.exports = {
    getBlockchain,
    addQRToBlockchain,
    verifyBlockchainRecord,
    getBlockchainStats,
};