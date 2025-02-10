import mongoose, { Schema, model, models } from 'mongoose';

const TimetableSchema = new Schema({
    entityName: {
        type: String,
        required: [true, 'Please provide an entity name.'],
    },
   
    schedule: {
        monday: {
            morning: {
                type: String
            },
            evening: {
                type: String
            },
            isStatus: {
                type: Boolean,
                
            },
        },
        tuesday: {
            morning: {
                type: String
            },
            evening: {
                type: String
            },
            isStatus: {
                type: Boolean,
                
            },
        },
        wednesday: {
            morning: {
                type: String
            },
            evening: {
                type: String
            },
            isStatus: {
                type: Boolean,
                
            },
        },
        thursday: {
            morning: {
                type: String
            },
            evening: {
                type: String
            },
            isStatus: {
                type: Boolean,
                
            },
        },
        friday: {
            morning: {
                type: String
            },
            evening: {
                type: String
            },
            isStatus: {
                type: Boolean,
                
            },
        },
        saturday: {
            morning: {
                type: String
            },
            evening: {
                type: String
            },
            isStatus: {
                type: Boolean,
                
            },
        },
        sunday: {
            morning: {
                type: String
            },
            evening: {
                type: String
            },
            isStatus: {
                type: Boolean,
                
            },
        },
    },

}, { timestamps: true });

const TimetableDataModel = models.TimeTables || model('TimeTables', TimetableSchema);

export default TimetableDataModel;
