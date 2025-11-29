const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');

const users = [
  {
    name: 'Admin User',
    email: 'admin@realestate.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 123-4567',
    company: 'RealEstate Pro',
    bio: 'Platform administrator with extensive experience in real estate.',
    isVerified: true
  },
  {
    name: 'John Smith',
    email: 'john@realestate.com',
    password: 'agent123',
    role: 'agent',
    phone: '+1 (555) 234-5678',
    company: 'Smith Realty',
    bio: 'Top-rated real estate agent with 10+ years of experience in luxury properties.',
    isVerified: true
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@realestate.com',
    password: 'agent123',
    role: 'agent',
    phone: '+1 (555) 345-6789',
    company: 'Johnson Properties',
    bio: 'Specializing in family homes and residential properties.',
    isVerified: true
  },
  {
    name: 'Mike Wilson',
    email: 'mike@example.com',
    password: 'user123',
    role: 'user',
    phone: '+1 (555) 456-7890'
  }
];

const properties = [
  {
    title: 'Luxury Modern Villa with Pool',
    description: 'Experience luxury living in this stunning modern villa. Features include a private pool, spacious living areas, gourmet kitchen with high-end appliances, and breathtaking views. Smart home technology throughout. Perfect for entertaining with open floor plan and seamless indoor-outdoor living.',
    propertyType: 'villa',
    listingType: 'sale',
    status: 'available',
    price: 2500000,
    address: {
      street: '123 Luxury Lane',
      city: 'Beverly Hills',
      state: 'California',
      zipCode: '90210',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-118.4065, 34.0901]
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      area: 6500,
      yearBuilt: 2022,
      parking: 3,
      floors: 2
    },
    amenities: ['pool', 'gym', 'smart-home', 'security', 'garden', 'garage', 'air-conditioning'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', isMain: true },
      { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200' }
    ],
    isFeatured: true
  },
  {
    title: 'Downtown Penthouse with City Views',
    description: 'Spectacular penthouse in the heart of downtown. Floor-to-ceiling windows offer panoramic city views. Features include private elevator access, chef\'s kitchen, marble bathrooms, and a spacious rooftop terrace. Building amenities include concierge, fitness center, and rooftop pool.',
    propertyType: 'apartment',
    listingType: 'sale',
    status: 'available',
    price: 3200000,
    address: {
      street: '500 High Rise Blvd',
      city: 'New York',
      state: 'New York',
      zipCode: '10001',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484]
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 3200,
      yearBuilt: 2021,
      parking: 2,
      floors: 1
    },
    amenities: ['elevator', 'gym', 'pool', 'doorman', 'rooftop', 'city-view', 'air-conditioning'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', isMain: true },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200' }
    ],
    isFeatured: true
  },
  {
    title: 'Charming Family Home in Quiet Neighborhood',
    description: 'Perfect family home in a highly sought-after neighborhood. Features updated kitchen, hardwood floors, large backyard, and excellent school district. Close to parks, shopping, and restaurants. Move-in ready with recent renovations.',
    propertyType: 'house',
    listingType: 'sale',
    status: 'available',
    price: 750000,
    address: {
      street: '456 Family Circle',
      city: 'Austin',
      state: 'Texas',
      zipCode: '78701',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-97.7431, 30.2672]
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      yearBuilt: 2015,
      parking: 2,
      floors: 2
    },
    amenities: ['garden', 'garage', 'hardwood-floors', 'pet-friendly', 'air-conditioning', 'heating'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', isMain: true },
      { url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200' }
    ],
    isFeatured: true
  },
  {
    title: 'Modern Condo Near Beach',
    description: 'Wake up to ocean breezes in this modern beachside condo. Features open layout, updated finishes, and private balcony with water views. Walking distance to beach, restaurants, and shops. Building offers pool and fitness center.',
    propertyType: 'condo',
    listingType: 'rent',
    status: 'available',
    price: 3500,
    priceUnit: 'monthly',
    address: {
      street: '789 Ocean Drive',
      city: 'Miami',
      state: 'Florida',
      zipCode: '33139',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-80.1341, 25.7825]
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      yearBuilt: 2019,
      parking: 1,
      floors: 1
    },
    amenities: ['pool', 'gym', 'balcony', 'waterfront', 'air-conditioning', 'security'],
    images: [
      { url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200', isMain: true },
      { url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200' }
    ],
    isFeatured: true
  },
  {
    title: 'Cozy Studio in Arts District',
    description: 'Charming studio apartment in the vibrant Arts District. Exposed brick, high ceilings, and large windows. Perfect for young professionals. Walking distance to galleries, cafes, and public transit.',
    propertyType: 'apartment',
    listingType: 'rent',
    status: 'available',
    price: 1800,
    priceUnit: 'monthly',
    address: {
      street: '321 Art Street',
      city: 'Los Angeles',
      state: 'California',
      zipCode: '90013',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-118.2349, 34.0447]
    },
    features: {
      bedrooms: 0,
      bathrooms: 1,
      area: 600,
      yearBuilt: 1920,
      parking: 0,
      floors: 1
    },
    amenities: ['laundry', 'pet-friendly', 'hardwood-floors'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', isMain: true }
    ],
    isFeatured: false
  },
  {
    title: 'Executive Office Space Downtown',
    description: 'Premium office space in prime downtown location. Features modern build-out, conference rooms, reception area, and parking. High-speed internet and 24/7 access included. Perfect for law firms or financial services.',
    propertyType: 'office',
    listingType: 'rent',
    status: 'available',
    price: 8500,
    priceUnit: 'monthly',
    address: {
      street: '100 Business Center',
      city: 'Chicago',
      state: 'Illinois',
      zipCode: '60601',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-87.6298, 41.8781]
    },
    features: {
      bedrooms: 0,
      bathrooms: 2,
      area: 3000,
      yearBuilt: 2018,
      parking: 5,
      floors: 1
    },
    amenities: ['elevator', 'security', 'air-conditioning', 'heating'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', isMain: true }
    ],
    isFeatured: false
  },
  {
    title: 'Townhouse in Historic District',
    description: 'Beautiful townhouse in the historic district. Original architectural details combined with modern updates. Features private courtyard, updated kitchen, and three levels of living space. Walking distance to waterfront and downtown.',
    propertyType: 'townhouse',
    listingType: 'sale',
    status: 'available',
    price: 895000,
    address: {
      street: '222 Heritage Row',
      city: 'Charleston',
      state: 'South Carolina',
      zipCode: '29401',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-79.9311, 32.7765]
    },
    features: {
      bedrooms: 3,
      bathrooms: 2.5,
      area: 2200,
      yearBuilt: 1890,
      parking: 1,
      floors: 3
    },
    amenities: ['garden', 'hardwood-floors', 'fireplace', 'air-conditioning'],
    images: [
      { url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200', isMain: true }
    ],
    isFeatured: true
  },
  {
    title: 'Mountain Retreat with Stunning Views',
    description: 'Escape to this mountain retreat with breathtaking views. Features wrap-around deck, stone fireplace, chef\'s kitchen, and hot tub. Perfect for vacation home or year-round living. Close to ski resorts and hiking trails.',
    propertyType: 'house',
    listingType: 'sale',
    status: 'available',
    price: 1450000,
    address: {
      street: '777 Summit Road',
      city: 'Aspen',
      state: 'Colorado',
      zipCode: '81611',
      country: 'USA'
    },
    location: {
      type: 'Point',
      coordinates: [-106.8175, 39.1911]
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 3800,
      yearBuilt: 2010,
      parking: 2,
      floors: 3
    },
    amenities: ['mountain-view', 'fireplace', 'garage', 'balcony', 'heating'],
    images: [
      { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200', isMain: true }
    ],
    isFeatured: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    console.log('Existing data cleared');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created`);

    // Get agent users for properties
    const agents = createdUsers.filter(u => u.role === 'agent' || u.role === 'admin');

    // Add agent to properties and create
    const propertiesWithAgents = properties.map((property, index) => ({
      ...property,
      agent: agents[index % agents.length]._id
    }));

    const createdProperties = await Property.create(propertiesWithAgents);
    console.log(`${createdProperties.length} properties created`);

    console.log('\n=== Seed Data Summary ===');
    console.log('Admin: admin@realestate.com / admin123');
    console.log('Agent 1: john@realestate.com / agent123');
    console.log('Agent 2: sarah@realestate.com / agent123');
    console.log('User: mike@example.com / user123');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
