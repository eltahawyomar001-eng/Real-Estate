const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const sendEmail = require('../utils/sendEmail');

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Public
exports.createInquiry = async (req, res, next) => {
  try {
    // Check if property exists
    const property = await Property.findById(req.body.property).populate('agent', 'email name');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Add user if logged in
    if (req.user) {
      req.body.user = req.user.id;
    }

    const inquiry = await Inquiry.create(req.body);

    // Send email notification to agent
    try {
      const agentMessage = `
        You have received a new inquiry for your property: ${property.title}
        
        From: ${req.body.name}
        Email: ${req.body.email}
        Phone: ${req.body.phone}
        
        Message:
        ${req.body.message}
        
        Inquiry Type: ${req.body.inquiryType || 'General'}
        Preferred Contact Method: ${req.body.preferredContactMethod || 'Email'}
        
        Please log in to your dashboard to respond.
      `;

      await sendEmail({
        email: property.agent.email,
        subject: `New Inquiry for ${property.title} - RealEstate Pro`,
        message: agentMessage
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private/Admin
exports.getInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by property
    if (req.query.property) {
      query.property = req.query.property;
    }

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate('property', 'title slug address images')
      .populate('user', 'name email')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent's inquiries
// @route   GET /api/inquiries/my-inquiries
// @access  Private/Agent
exports.getMyInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get agent's property IDs
    const properties = await Property.find({ agent: req.user.id }).select('_id');
    const propertyIds = properties.map(p => p._id);

    let query = { property: { $in: propertyIds } };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate('property', 'title slug address images')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private
exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property', 'title slug address images agent')
      .populate('user', 'name email phone');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check authorization (admin or property owner)
    const property = await Property.findById(inquiry.property._id);
    if (req.user.role !== 'admin' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this inquiry'
      });
    }

    // Mark as read if new
    if (inquiry.status === 'new') {
      inquiry.status = 'read';
      await inquiry.save();
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private
exports.updateInquiry = async (req, res, next) => {
  try {
    let inquiry = await Inquiry.findById(req.params.id)
      .populate('property', 'agent');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && inquiry.property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    // Update fields
    const updateFields = {};
    
    if (req.body.status) updateFields.status = req.body.status;
    if (req.body.notes) updateFields.notes = req.body.notes;
    
    if (req.body.response) {
      updateFields.response = {
        message: req.body.response,
        respondedAt: Date.now(),
        respondedBy: req.user.id
      };
      updateFields.status = 'responded';

      // Send response email to inquirer
      try {
        await sendEmail({
          email: inquiry.email,
          subject: `Response to Your Property Inquiry - RealEstate Pro`,
          message: `
            Dear ${inquiry.name},
            
            Thank you for your interest. Here is the response to your inquiry:
            
            ${req.body.response}
            
            Best regards,
            RealEstate Pro Team
          `
        });
      } catch (emailError) {
        console.error('Response email failed:', emailError);
      }
    }

    inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
