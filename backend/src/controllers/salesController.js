// backend/src/controllers/salesController.js
const salesService = require('../services/salesService'); // Import the service

const getSales = async (req, res) => {
    try {
        // Pass the entire query object to the service
        const result = await salesService.getSalesData(req.query);

        res.json({
            success: true,
            count: result.total,
            total_pages: result.totalPages,
            current_page: result.currentPage,
            stats: result.stats,
            data: result.data
        });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFilterOptions = async (req, res) => {
    try {
        const options = await salesService.getUniqueOptions();
        res.json({
            success: true,
            data: options
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getSales, getFilterOptions };