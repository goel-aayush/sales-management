const Sale = require('../models/Sale');

// Helper: Build the MongoDB Query Object based on user filters
const buildQuery = (params) => {
    const { search, region, gender, age, category, tags, paymentMethod, date, startDate, endDate } = params;
    let queryConditions = [];

    // 1. Search (Name OR Phone)
    if (search) {
        queryConditions.push({
            $or: [
                { customer_name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ]
        });
    }

    // 2. Simple Filters
    if (region) queryConditions.push({ region: { $in: region.split(',') } });
    if (gender) queryConditions.push({ gender: { $in: gender.split(',') } });
    if (category) queryConditions.push({ category: { $in: category.split(',') } });
    if (tags) queryConditions.push({ tags: { $in: tags.split(',') } });
    if (paymentMethod) queryConditions.push({ payment_method: { $in: paymentMethod.split(',') } });

    // 3. Age Logic
    if (age) {
        const ranges = age.split(',');
        const ageOrConditions = [];
        ranges.forEach(r => {
            if (r === '46+') {
                ageOrConditions.push({ age: { $gte: 46 } });
            } else {
                const parts = r.split('-');
                if (parts.length === 2) {
                    ageOrConditions.push({ 
                        age: { $gte: parseInt(parts[0]), $lte: parseInt(parts[1]) } 
                    });
                }
            }
        });
        if (ageOrConditions.length > 0) queryConditions.push({ $or: ageOrConditions });
    }

    // 4. Date Logic
    if (startDate && endDate) {
        queryConditions.push({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
    } else if (date) {
        const today = new Date();
        if (date === 'Last 7 Days') {
            const d = new Date(); d.setDate(today.getDate() - 7);
            queryConditions.push({ date: { $gte: d } });
        } else if (date === 'Last Month') {
            const d = new Date(); d.setMonth(today.getMonth() - 1);
            queryConditions.push({ date: { $gte: d } });
        }
    }

    return queryConditions.length > 0 ? { $and: queryConditions } : {};
};

// Main Service Function: Fetch Paginated Sales
const getSalesData = async (params) => {
    const { sortBy, page = 1 } = params;
    const query = buildQuery(params);

    // Sorting Logic
    let sortOptions = { date: -1 };
    if (sortBy === 'name_asc') sortOptions = { customer_name: 1 };
    if (sortBy === 'quantity_desc') sortOptions = { quantity: -1 };
    if (sortBy === 'date_desc') sortOptions = { date: -1 };

    // Pagination
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    // Execute Parallel Queries
    const [results, totalCount, statsData] = await Promise.all([
        Sale.find(query).sort(sortOptions).skip(skip).limit(limit),
        Sale.countDocuments(query),
        Sale.aggregate([
            { $match: query },
            { $group: { 
                _id: null, 
                total_units: { $sum: "$quantity" }, 
                total_amount: { $sum: "$total_amount" }, 
                total_discount: { $sum: "$discount" } 
            }}
        ])
    ]);

    const stats = statsData[0] || { total_units: 0, total_amount: 0, total_discount: 0 };

    return {
        data: results,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        stats
    };
};

// Service Function: Fetch Filter Options
const getUniqueOptions = async () => {
    const [regions, categories, paymentMethods, tags] = await Promise.all([
        Sale.distinct('region'),
        Sale.distinct('category'),
        Sale.distinct('payment_method'),
        Sale.distinct('tags')
    ]);
    
    return {
        regions: regions.sort(),
        categories: categories.sort(),
        paymentMethods: paymentMethods.sort(),
        tags: tags.sort()
    };
};

module.exports = { getSalesData, getUniqueOptions };