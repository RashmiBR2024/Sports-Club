import mongoose, { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema({
    entityID: {
        type: String,
        required: [true, 'Please provide an userID name.'],
    },
    isStatus: {
        type:Boolean,
        required: [true, 'Please provide an status of the link.'],
    },
    link: {
        type: String,
        required: [true, 'Please provide an link to register.'],
    },
    subTitle: {
        type: String,
        required: [true, 'Please provide an subtitle name.'],
    },
   


}, { timestamps: true });

const NotificationDataModel = models.Notification || model('Notification', NotificationSchema);

export default NotificationDataModel;
