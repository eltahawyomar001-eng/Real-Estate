const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a property title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Please specify property type'],
    enum: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial', 'office']
  },
  listingType: {
    type: String,
    required: [true, 'Please specify listing type'],
    enum: ['sale', 'rent']
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold', 'rented'],
    default: 'available'
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  priceUnit: {
    type: String,
    enum: ['total', 'monthly', 'yearly', 'sqft'],
    default: 'total'
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide zip code']
    },
    country: {
      type: String,
      default: 'USA'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  features: {
    bedrooms: {
      type: Number,
      default: 0
    },
    bathrooms: {
      type: Number,
      default: 0
    },
    area: {
      type: Number,
      required: [true, 'Please provide area in sqft']
    },
    yearBuilt: Number,
    parking: {
      type: Number,
      default: 0
    },
    floors: {
      type: Number,
      default: 1
    }
  },
  amenities: [{
    type: String,
    enum: [
      'air-conditioning',
      'heating',
      'washer-dryer',
      'dishwasher',
      'pool',
      'gym',
      'security',
      'elevator',
      'balcony',
      'garden',
      'garage',
      'fireplace',
      'hardwood-floors',
      'pet-friendly',
      'furnished',
      'waterfront',
      'mountain-view',
      'city-view',
      'smart-home',
      'solar-panels',
      'storage',
      'laundry',
      'doorman',
      'rooftop'
    ]
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  virtualTour: {
    type: String // URL to virtual tour
  },
  video: {
    type: String // URL to video tour
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create property slug from title
propertySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

// Create indexes
propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ isFeatured: 1 });
propertySchema.index({ createdAt: -1 });

// Virtual for inquiries
propertySchema.virtual('inquiries', {
  ref: 'Inquiry',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

// Static method to get average price by city
propertySchema.statics.getAveragePriceByCity = async function(city) {
  const result = await this.aggregate([
    { $match: { 'address.city': city, status: 'available' } },
    { $group: { _id: '$address.city', avgPrice: { $avg: '$price' } } }
  ]);
  return result.length > 0 ? result[0].avgPrice : 0;
};

module.exports = mongoose.model('Property', propertySchema);
