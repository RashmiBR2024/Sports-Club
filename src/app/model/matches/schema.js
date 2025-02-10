import { Schema, model, models, Types } from 'mongoose';
import mongoose from 'mongoose'; // Import mongoose
import AutoIncrement from 'mongoose-sequence'; // Import AutoIncrement

const matchSchema = new Schema({
    title: { type: String, required: [true, 'please enter the title'] },
    date: { type: Date, required: [true, 'please enter the date'] },
    location: { type: String, required: [true, 'please enter the location'] },
    team_1: { type: Types.ObjectId, ref: 'Team', required: [true, 'please enter team_1'] },
    team_2: { type: Types.ObjectId, ref: 'Team', required: [true, 'please enter team_2'] },
    overs: { type: Number, required: [true, 'please enter the overs'] },
    format: { type: String, required: [true, 'please enter the format'] },
    status: { type: String, required: [true, 'please enter the status'] },
    result: { type: String, required: false },
    score: { type: String, required: false }, // Changed to String for better flexibility
    tournment_id: { type: Types.ObjectId, ref: 'Tournament', required: [true, 'please enter tournment_id'] }, // Fixed
    crickheroes_url: { type: String, required: false }
}, { timestamps: true });

// Apply AutoIncrement Plugin
matchSchema.plugin(AutoIncrement(mongoose), { inc_field: 'match_no' });

const matchdataModel = models.Match || model('Match', matchSchema);
export default matchdataModel;
