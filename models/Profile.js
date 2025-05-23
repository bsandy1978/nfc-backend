const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  // Unique code embedded in NFC card
  activationCode: {
    type: String,
    required: true,
    unique: true
  },

  // Status tracking
  status: {
    type: String,
    enum: ['pending_activation', 'active'],
    default: 'pending_activation'
  },

  // Owner authentication
  ownerEmail: {
    type: String,
    default: null
  },
  ownerPasswordHash: {
    type: String,
    default: null
  },

  // Image URLs (Cloudinary or local)
  bannerUrl: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },

  // Identity
  name: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },

  // Social handles
  socialLinks: {
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },

  // 🔹 Optional custom slug for selected users
  customSlug: {
    type: String,
    unique: true,
    sparse: true, // allow many documents to not have it
    match: /^[a-z0-9_-]{3,30}$/ // basic validation: lowercase letters, numbers, hyphen, underscore
  },

  // 🔹 Exclusive badge for special profiles
  exclusiveBadge: {
    text: { type: String, default: null }
  }
}, { timestamps: true });

// 🔹 Ensure only one active profile per email
profileSchema.index(
  { ownerEmail: 1 },
  {
    unique: true,
    partialFilterExpression: {
      ownerEmail: { $type: 'string' },
      status: 'active'
    }
  }
);

// 🔹 Enforce uniqueness on customSlug
profileSchema.index(
  { customSlug: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model('Profile', profileSchema);