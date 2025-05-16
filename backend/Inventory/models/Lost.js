import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema({
    item_name: { 
        type: String, 
        required: [true, 'Item name is required'],
        trim: true,
        maxlength: [100, 'Item name cannot exceed 100 characters']
    },
    description: { 
        type: String, 
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    location: { 
        type: String, 
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    date_lost: { 
        type: Date, 
        required: [true, 'Date lost is required'] 
    },
    status: { 
        type: String, 
        required: true,
        enum: {
            values: ['lost', 'found', 'returned'],
            message: 'Status must be either lost, found, or returned'
        },
        default: 'lost'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
lostItemSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Update timestamps on update operations
lostItemSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const LostItem = mongoose.model("LostItem", lostItemSchema);

export default LostItem;