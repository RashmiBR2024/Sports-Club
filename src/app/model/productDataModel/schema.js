import mongoose, { Schema, model, models } from 'mongoose';

// Define the schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide the product name.'], // Product name
  },
  description: {
    type: String,
    required: [true, 'Please provide the product description.'], // Product description
  },
  category: {
    type: String,
    required: [true, 'Please provide the product category.'], // Product category
  },
  brand: {
    type: String,
    required: [true, 'Please provide the product brand.'], // Product brand
  },
  variants: [{
    isStatus: {
      type: Boolean,
      required: true
  },
    color: {
      type: String,
      default: '', 
    },
    material: {
      type: String,
      default: '', // Default empty string if no material is provided
    },
    weight: {
      type: String,
      default: '', // Default empty string if no weight is provided
    },
    dimensions: {
      length: {
        type: String,
        default: '', // Default empty string if no length is provided
      },
      width: {
        type: String,
        default: '', // Default empty string if no width is provided
      }
    },
    images: {
      type: [String],
      required: [true, 'Please provide image URLs.'], // Array of image URLs
    },
    sizes: [{
      size: {
        type: String,
        required: [true, 'Please provide the size.'], // E.g., "Standard", "Small"
      },
      quantity: {
        type: Number,
        required: [true, 'Please provide the quantity.'], // Quantity available
      },
      mrp: {
        type: Number,
        required: [true, 'Please provide the MRP.'], // Maximum Retail Price
      },
      sellingPrice: {
        type: Number,
        required: [true, 'Please provide the selling price.'], // Selling price
      },
      discount: {
        type: Number,
        required: [true, 'Please provide the discount percentage.'], // Discount percentage
      },
      barcode: {
        type: String,
        default: '', // Default empty string if no barcode is provided
      },
      purchasePrice: {
        type: String,
        default: '', 
      }
    }]
  }],
  isStatus: {
    type: String,
    default: 'active', // Status of the product (e.g., "active")
    required: [true, 'Please provide the status of the product.']
  },
  tags: {
    type: [String], // Array of tags
    default: [], // Default to an empty array if no tags are provided
  },
  ratings: {
    average: {
      type: Number,
       // Default average rating
    },
    count: {
      type: Number,
     // Default number of ratings
    }
  },
  reviews: [{
    userId: {
      type: String,
      required: [true, 'Please provide the user ID.'], // User ID of the reviewer
    },
    rating: {
      type: Number,
      required: [true, 'Please provide the rating.'], // Rating provided by the user
    },
    comment: {
      type: String,
      default: '', // Default empty string if no comment is provided
    },
    date: {
      type: Date,
      default: Date.now, // Default to the current date and time
    }
  }],
  additionalInfo: {
    warranty: {
      type: String,
      default: '', // Default empty string if no warranty information is provided
    },
    careInstructions: {
      type: String,
      default: '', // Default empty string if no care instructions are provided
    }
  }
}, { timestamps: true });

// Export the Product model
const productDataModel = models.Product || model('Product', ProductSchema);

export default productDataModel;
