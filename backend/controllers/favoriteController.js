const Favorite = require('../models/Favorite');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const total = await Favorite.countDocuments({ user: req.user.id });
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'property',
        populate: { path: 'agent', select: 'name email phone avatar' }
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Filter out any favorites with deleted properties
    const validFavorites = favorites.filter(f => f.property && f.property.isActive);

    res.status(200).json({
      success: true,
      count: validFavorites.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: validFavorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;

    // Check if already favorited
    const existing = await Favorite.findOne({
      user: req.user.id,
      property: propertyId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      property: propertyId
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      property: req.params.propertyId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if property is favorited
// @route   GET /api/favorites/check/:propertyId
// @access  Private
exports.checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId
    });

    res.status(200).json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    next(error);
  }
};
