const Property = require('../models/Property');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    // Get counts
    const totalProperties = await Property.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalAgents = await User.countDocuments({ role: { $in: ['agent', 'admin'] }, isActive: true });
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });

    // Properties by status
    const propertiesByStatus = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Properties by type
    const propertiesByType = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    // Properties by listing type
    const propertiesByListing = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$listingType', count: { $sum: 1 } } }
    ]);

    // Recent properties
    const recentProperties = await Property.find({ isActive: true })
      .populate('agent', 'name email')
      .limit(5)
      .sort({ createdAt: -1 });

    // Recent inquiries
    const recentInquiries = await Inquiry.find()
      .populate('property', 'title')
      .limit(5)
      .sort({ createdAt: -1 });

    // Monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyProperties = await Property.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyInquiries = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top cities
    const topCities = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Price statistics
    const priceStats = await Property.aggregate([
      { $match: { isActive: true, status: 'available' } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalProperties,
          totalUsers,
          totalAgents,
          totalInquiries,
          newInquiries
        },
        propertiesByStatus,
        propertiesByType,
        propertiesByListing,
        recentProperties,
        recentInquiries,
        monthlyProperties,
        monthlyInquiries,
        topCities,
        priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent stats
// @route   GET /api/stats/agent
// @access  Private/Agent
exports.getAgentStats = async (req, res, next) => {
  try {
    const agentId = req.user.id;

    // Get agent's properties
    const totalProperties = await Property.countDocuments({ agent: agentId, isActive: true });
    const activeListings = await Property.countDocuments({ agent: agentId, isActive: true, status: 'available' });
    const soldProperties = await Property.countDocuments({ agent: agentId, status: 'sold' });
    const rentedProperties = await Property.countDocuments({ agent: agentId, status: 'rented' });

    // Get agent's property IDs for inquiry count
    const properties = await Property.find({ agent: agentId }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const totalInquiries = await Inquiry.countDocuments({ property: { $in: propertyIds } });
    const newInquiries = await Inquiry.countDocuments({ property: { $in: propertyIds }, status: 'new' });

    // Total views
    const viewsResult = await Property.aggregate([
      { $match: { agent: agentId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsResult[0]?.totalViews || 0;

    // Properties by status
    const propertiesByStatus = await Property.aggregate([
      { $match: { agent: agentId, isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent inquiries
    const recentInquiries = await Inquiry.find({ property: { $in: propertyIds } })
      .populate('property', 'title')
      .limit(5)
      .sort({ createdAt: -1 });

    // Top performing properties (by views)
    const topProperties = await Property.find({ agent: agentId, isActive: true })
      .select('title views address images price')
      .limit(5)
      .sort({ views: -1 });

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalProperties,
          activeListings,
          soldProperties,
          rentedProperties,
          totalInquiries,
          newInquiries,
          totalViews
        },
        propertiesByStatus,
        recentInquiries,
        topProperties
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats for agents/admins
// @route   GET /api/stats/dashboard
// @access  Private/Agent/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const agentId = req.user.id;

    let query = {};
    if (!isAdmin) {
      query = { agent: agentId };
    }

    // Get counts
    const totalProperties = await Property.countDocuments({ ...query, isActive: true });
    const totalInquiries = isAdmin
      ? await Inquiry.countDocuments()
      : await Inquiry.countDocuments({
          property: { $in: (await Property.find(query).select('_id')).map(p => p._id) }
        });

    // Get total views
    const viewsResult = await Property.aggregate([
      { $match: query },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsResult[0]?.totalViews || 0;

    // Get total users (admin only)
    const totalUsers = isAdmin ? await User.countDocuments({ isActive: true }) : 0;

    // Recent properties
    const recentProperties = await Property.find({ ...query, isActive: true })
      .select('title price images isActive status')
      .limit(5)
      .sort({ createdAt: -1 });

    // Recent inquiries
    let recentInquiries;
    if (isAdmin) {
      recentInquiries = await Inquiry.find()
        .populate('property', 'title')
        .limit(5)
        .sort({ createdAt: -1 });
    } else {
      const propertyIds = (await Property.find(query).select('_id')).map(p => p._id);
      recentInquiries = await Inquiry.find({ property: { $in: propertyIds } })
        .populate('property', 'title')
        .limit(5)
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalUsers,
        totalInquiries,
        totalViews,
        recentProperties,
        recentInquiries
      }
    });
  } catch (error) {
    next(error);
  }
};
