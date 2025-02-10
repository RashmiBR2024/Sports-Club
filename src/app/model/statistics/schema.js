import { Schema, model, models } from 'mongoose';

const statisticsSchema = new Schema({
    userid:{
        type:String,
        required:[true,'please enter the userid']
    },
    matchesPlayed:{
        type:Number,
        required:[true,'please enter the matchesPlayed']
    },
    runs:{
        type:Number,
        required:[true,'please enter the runs']
    },
    wickets:{
        type:Number,
        required:[true,'please enter the wickets']
    },
    catches:{
        type:Number,
        required:[true,'please enter the catches']
    }
},{timestamps:true});

const statisticsdataModel = models.Statistics || model('Statistics',statisticsSchema);
export default statisticsdataModel;