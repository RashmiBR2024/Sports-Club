import mongoose, { Schema, model, models } from 'mongoose';

const AttendencxeSchema = new Schema({
    userID: {
        type: String,
        required: [true, 'Please provide an userID name.'],
    },
   
    schedule: [{
            date: {
                type: Date
            },
            checkIn: {
                type: Boolean
            },
            checkOut: {
                type: Boolean,
            },
            isStatus: {
                type: Boolean,
            }
        },
    
    ]

}, { timestamps: true });

const AttendenceDataModel = models.Attendence || model('Attendence', AttendencxeSchema);

export default AttendenceDataModel;
