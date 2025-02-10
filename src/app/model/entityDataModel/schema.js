import mongoose, { Schema, model, models } from 'mongoose';

const EntitySchema = new Schema({
    entityName: {
        type: String,
        required: [true, 'Please provide an entity name.'],
    },

}, { timestamps: true });

const EntityDataModel = models.Entity || model('Entity', EntitySchema);

export default EntityDataModel;
