const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().required().max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().max(20),
    role: Joi.string().valid('user', 'agent')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().max(50),
    phone: Joi.string().max(20),
    company: Joi.string().max(100),
    bio: Joi.string().max(500),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    }),
    socialLinks: Joi.object({
      facebook: Joi.string().uri().allow(''),
      twitter: Joi.string().uri().allow(''),
      linkedin: Joi.string().uri().allow(''),
      instagram: Joi.string().uri().allow('')
    })
  }),

  createProperty: Joi.object({
    title: Joi.string().required().max(100),
    description: Joi.string().required().max(5000),
    propertyType: Joi.string().required().valid('house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial', 'office'),
    listingType: Joi.string().required().valid('sale', 'rent'),
    price: Joi.number().required().positive(),
    priceUnit: Joi.string().valid('total', 'monthly', 'yearly', 'sqft'),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string()
    }).required(),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2)
    }),
    features: Joi.object({
      bedrooms: Joi.number().min(0),
      bathrooms: Joi.number().min(0),
      area: Joi.number().required().positive(),
      yearBuilt: Joi.number().min(1800).max(new Date().getFullYear() + 5),
      parking: Joi.number().min(0),
      floors: Joi.number().min(1)
    }).required(),
    amenities: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.object({
      url: Joi.string().required(),
      public_id: Joi.string(),
      caption: Joi.string(),
      isMain: Joi.boolean()
    })),
    virtualTour: Joi.string().uri().allow(''),
    video: Joi.string().uri().allow(''),
    isFeatured: Joi.boolean()
  }),

  updateProperty: Joi.object({
    title: Joi.string().max(100),
    description: Joi.string().max(5000),
    propertyType: Joi.string().valid('house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial', 'office'),
    listingType: Joi.string().valid('sale', 'rent'),
    status: Joi.string().valid('available', 'pending', 'sold', 'rented'),
    price: Joi.number().positive(),
    priceUnit: Joi.string().valid('total', 'monthly', 'yearly', 'sqft'),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    }),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2)
    }),
    features: Joi.object({
      bedrooms: Joi.number().min(0),
      bathrooms: Joi.number().min(0),
      area: Joi.number().positive(),
      yearBuilt: Joi.number().min(1800).max(new Date().getFullYear() + 5),
      parking: Joi.number().min(0),
      floors: Joi.number().min(1)
    }),
    amenities: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.object({
      url: Joi.string().required(),
      public_id: Joi.string(),
      caption: Joi.string(),
      isMain: Joi.boolean()
    })),
    virtualTour: Joi.string().uri().allow(''),
    video: Joi.string().uri().allow(''),
    isFeatured: Joi.boolean(),
    isActive: Joi.boolean()
  }),

  createInquiry: Joi.object({
    property: Joi.string().required(),
    name: Joi.string().required().max(50),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    message: Joi.string().required().max(1000),
    inquiryType: Joi.string().valid('general', 'viewing', 'offer', 'question'),
    preferredContactMethod: Joi.string().valid('email', 'phone', 'both'),
    preferredContactTime: Joi.string().valid('morning', 'afternoon', 'evening', 'anytime')
  })
};

module.exports = { validate, schemas };
