import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required']
        },
        subscription_id: {
            type: String,
            required: [true, 'Subscription ID is required']
        },
        dateOfJoining: {
            type: Date,
            required: [true, 'Date of joining is required']
        },
        age: {
            type: Number,
            required: [true, 'Age is required']
        },
        specialization: {
            type: [String],
            required: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        activeYear: {
            type: [Number],
            required: false
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Phone number must be 10 digits']
        },
        profilePicture: {
            type: String, // Change from Buffer to String for URL storage
            required: false
        },
        statistics_id: {
            type: String,
            required: [true, 'Statistics ID is required']
        },
        crickheros_url: {
            type: String,
            required: false
        },
        userCode: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: [true, 'Gender is required']
        },
        government_ids: {
            type: [String],
            required: true
        },
        government_urls: {
            type: [String],
            required: false
        }
    },
    {
        timestamps: true
    }
);

// **🔹 Auto-generate userCode before saving**
userSchema.pre("save", async function (next) {
    if (!this.isNew) return next(); // Only generate for new users

    // Extract initials from the name
    const initials = this.name
        .split(" ")
        .map(word => word[0].toUpperCase())
        .join("");

    // Find the latest user with the same initials
    const latestUser = await models.User.findOne({ userCode: new RegExp(`^${initials}\\d{3}$`, "i") })
        .sort({ userCode: -1 })
        .exec();

    let nextNumber = 1;
    if (latestUser) {
        const match = latestUser.userCode.match(/\d+$/);
        if (match) {
            nextNumber = parseInt(match[0], 10) + 1;
        }
    }

    // Format userCode like 'AN001'
    this.userCode = `${initials}${String(nextNumber).padStart(3, "0")}`;

    next();
});

// Check if the model already exists
const UserModel = models.User || model('User', userSchema);

export default UserModel;
