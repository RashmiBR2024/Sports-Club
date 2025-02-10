import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    enquiryType: {
      type: String,
      required: true,
      enum: [
        "Membership",
        "Match Registration",
        "Coaching/Training",
        "Sponsorship",
        "Facility Booking",
        "General Inquiry",
      ],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    additionalNotes: {
      type: String,
      trim: true,
    },
    dateOfEnquiry: {
      type: Date,
      default: Date.now,
    },
    enteredBy: {
      type: String,
      required: true,
      trim: true,
    },
  },    
  { timestamps: true }
);

const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
