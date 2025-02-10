import mongoose from "mongoose";

const enquiryTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate enquiry types
        trim: true
    },
}, { timestamps: true });

const EnquiryType = mongoose.models.EnquiryType || mongoose.model("EnquiryType", enquiryTypeSchema);

export default EnquiryType;
