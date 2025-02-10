import { Schema, model, models } from 'mongoose';

const bannerSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please enter the title']
    },
    subTitle: {
        type: String,
        required: [true, 'Please enter the subtitle']
    },
    isStatus: {
        type: Boolean,
        default: true,
        required: [true, 'Please enter the status']
    },
    isButton: {
        type: Boolean,
        default: true,
        required: [true, 'Please enter the isButton']
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: [true, 'Please enter the type']
    },
    buttonName: {
        type: String,
        required: [true, 'Please enter the button name']
    },
    content_url: {
        type: String,
        required: [true, 'Please provide the URL'],
        default: "" 
    },
    isText: {
        type: Boolean,
        required: [false, 'Please enter the isText value']
    },
    button_url: {
        type: String,
        required: [false, 'Please enter the button URL']
    },
    displayDuration: {
        type: Number,
        required: [true, 'Please specify the display duration in seconds'],
        min: [1, 'Display duration must be at least 1 second']
    },
    displayOnPages: {
        type: [String], 
        enum: ['home', 'matches', 'sponsorsanddeals', 'newsmedia'],
        required: [true, 'Please specify the pages this banner should display on']
    },
    schedule: {
        startDate: {
            type: Date,
            required: [true, 'Please specify the start date'],
        },
        endDate: {
            type: Date,
            required: [true, 'Please specify the end date'],
        }
    },
    fontStyle: {
        type: String,
        default: "Poppins",
    },
    titleFontColor: {
        type: String,
        default: "#FFFFFF",
    },
    titleFontSize: {
        type: String,
        default: "26px",   
    },
    subTitleFontSize: {
        type: String,
        default: "14px",   
    },
    // button styles 
    buttonFontSize: {
        type: String,
        default: "14px",   
    },
    buttonFontColor: {
        type: String,
        default: "black",
    },
    buttonBackgroundColor: {
        type: String,
        default: "white",
    },
}, { timestamps: true });

// **Middleware to update banner status automatically**
bannerSchema.pre('save', function (next) {
    if (this.schedule?.endDate && new Date() > this.schedule.endDate) {
        this.isStatus = false;
    }
    next();
});

const bannerdataModel = models.Banner || model('Banner', bannerSchema);
export default bannerdataModel;
