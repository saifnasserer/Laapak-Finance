const Receivable = require('../models/receivableModel');

// @desc    Get all receivables
// @route   GET /api/receivables
// @access  Public
exports.getReceivables = async (req, res) => {
    try {
        const receivables = await Receivable.getAll();
        res.json(receivables);
    } catch (error) {
        console.error('ERROR FETCHING RECEIVABLES:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single receivable by ID
// @route   GET /api/receivables/:id
// @access  Public
exports.getReceivableById = async (req, res) => {
    try {
        const receivable = await Receivable.findById(req.params.id);
        if (receivable) {
            res.json(receivable);
        } else {
            res.status(404).json({ message: 'Receivable not found' });
        }
    } catch (error) {
        console.error(`ERROR FETCHING RECEIVABLE ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new receivable
// @route   POST /api/receivables
// @access  Public
exports.createReceivable = async (req, res) => {
    try {
        const newReceivable = await Receivable.create(req.body);
        res.status(201).json(newReceivable);
    } catch (error) {
        console.error('ERROR CREATING RECEIVABLE:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a receivable
// @route   PUT /api/receivables/:id
// @access  Public
exports.updateReceivable = async (req, res) => {
    try {
        const affectedRows = await Receivable.update(req.params.id, req.body);
        if (affectedRows > 0) {
            res.json({ message: 'Receivable updated successfully' });
        } else {
            res.status(404).json({ message: 'Receivable not found' });
        }
    } catch (error) {
        console.error(`ERROR UPDATING RECEIVABLE ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a receivable
// @route   DELETE /api/receivables/:id
// @access  Public
exports.deleteReceivable = async (req, res) => {
    try {
        const affectedRows = await Receivable.delete(req.params.id);
        if (affectedRows > 0) {
            res.json({ message: 'Receivable deleted successfully' });
        } else {
            res.status(404).json({ message: 'Receivable not found' });
        }
    } catch (error) {
        console.error(`ERROR DELETING RECEIVABLE ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
