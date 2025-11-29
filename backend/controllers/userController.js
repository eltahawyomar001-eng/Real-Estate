const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's property count if agent
    let propertyCount = 0;
    if (user.role === 'agent' || user.role === 'admin') {
      propertyCount = await Property.countDocuments({ agent: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        propertyCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Fields that can be updated
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      company: req.body.company,
      bio: req.body.bio,
      address: req.body.address,
      socialLinks: req.body.socialLinks,
      avatar: req.body.avatar
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // Admin can update additional fields
    if (req.user.role === 'admin') {
      if (req.body.role) fieldsToUpdate.role = req.body.role;
      if (req.body.isActive !== undefined) fieldsToUpdate.isActive = req.body.isActive;
      if (req.body.isVerified !== undefined) fieldsToUpdate.isVerified = req.body.isVerified;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - just deactivate
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agents
// @route   GET /api/users/agents
// @access  Public
exports.getAgents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { role: { $in: ['agent', 'admin'] }, isActive: true };

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await User.countDocuments(query);
    const agents = await User.find(query)
      .select('name email phone avatar company bio address socialLinks')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Add property count to each agent
    const agentsWithCount = await Promise.all(
      agents.map(async (agent) => {
        const propertyCount = await Property.countDocuments({ agent: agent._id, isActive: true });
        return {
          ...agent.toObject(),
          propertyCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: agents.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: agentsWithCount
    });
  } catch (error) {
    next(error);
  }
};
