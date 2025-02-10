import mongoose, { Schema, model, models } from 'mongoose';

const PaymentSchema = new Schema({
    userID: {
        type: String,
        required: [true, 'Please provide a firstName for this user.'],
    },
    sportType: {
        type: String,
        required: [true, 'Please provide a lastName for this user.'],
    },
    academicYear: {
        type: String,
        required: [true, 'Please provide an emailID for this user.'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide an age for this user.'],
    },
    paidAmount: {
        type: Number,
        required: [true, 'Please provide a gender for this user.'],
    },
   
}, { timestamps: true });

const PaymentDataModel = models.Payments || model('Payments', PaymentSchema);

export default PaymentDataModel;