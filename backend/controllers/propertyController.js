const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Filter by property type
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }

    // Filter by listing type (sale/rent)
    if (req.query.listingType) {
      query.listingType = req.query.listingType;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by city
    if (req.query.city) {
      query['address.city'] = { $regex: req.query.city, $options: 'i' };
    }

    // Filter by state
    if (req.query.state) {
      query['address.state'] = { $regex: req.query.state, $options: 'i' };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice);
    }

    // Filter by bedrooms
    if (req.query.bedrooms) {
      query['features.bedrooms'] = { $gte: parseInt(req.query.bedrooms) };
    }

    // Filter by bathrooms
    if (req.query.bathrooms) {
      query['features.bathrooms'] = { $gte: parseInt(req.query.bathrooms) };
    }

    // Filter by area
    if (req.query.minArea || req.query.maxArea) {
      query['features.area'] = {};
      if (req.query.minArea) query['features.area'].$gte = parseInt(req.query.minArea);
      if (req.query.maxArea) query['features.area'].$lte = parseInt(req.query.maxArea);
    }

    // Filter by amenities
    if (req.query.amenities) {
      const amenitiesArray = req.query.amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Filter by featured
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Filter by agent
    if (req.query.agent) {
      query.agent = req.query.agent;
    }

    // Search by keyword in title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'address.city': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortBy = { price: 1 };
          break;
        case 'price-desc':
          sortBy = { price: -1 };
          break;
        case 'newest':
          sortBy = { createdAt: -1 };
          break;
        case 'oldest':
          sortBy = { createdAt: 1 };
          break;
        case 'popular':
          sortBy = { views: -1 };
          break;
      }
    }

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('agent', 'name email phone avatar company')
      .skip(startIndex)
      .limit(limit)
      .sort(sortBy);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone avatar company bio socialLinks');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get property by slug
// @route   GET /api/properties/slug/:slug
// @access  Public
exports.getPropertyBySlug = async (req, res, next) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug })
      .populate('agent', 'name email phone avatar company bio socialLinks');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
exports.createProperty = async (req, res, next) => {
  try {
    // Add agent to body
    req.body.agent = req.user.id;

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    // Soft delete
    property.isActive = false;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;

    const properties = await Property.find({ 
      isFeatured: true, 
      isActive: true,
      status: 'available'
    })
      .populate('agent', 'name email phone avatar')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent's properties
// @route   GET /api/properties/agent/:agentId
// @access  Public
exports.getAgentProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const query = { agent: req.params.agentId, isActive: true };

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my properties (for agent dashboard)
// @route   GET /api/properties/my-properties
// @access  Private (Agent/Admin)
exports.getMyProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    let query = { agent: req.user.id };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by active/inactive
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar properties
// @route   GET /api/properties/:id/similar
// @access  Public
exports.getSimilarProperties = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const limit = parseInt(req.query.limit, 10) || 4;

    // Find similar properties based on type, city, and price range
    const priceRange = property.price * 0.3; // 30% price range
    
    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      isActive: true,
      status: 'available',
      $or: [
        { propertyType: property.propertyType },
        { 'address.city': property.address.city },
        { 
          price: { 
            $gte: property.price - priceRange, 
            $lte: property.price + priceRange 
          } 
        }
      ]
    })
      .populate('agent', 'name email phone avatar')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: similarProperties.length,
      data: similarProperties
    });
  } catch (error) {
    next(error);
  }
};
