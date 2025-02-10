import { Schema, model, models } from 'mongoose';

const tournmentSchema = new Schema({
    format:{
        type:String,
        required:[true,'please enter the format']
    },
    name:{
        type:String,
        required:[true,'please enter the name']
    },
    location:{
        type:String,
        required:[true,'please enter the location']
    },
    startDate:{
        type:Date,
        required:[true,'please enter the startDate']
    },
    endDate:{
        type:Date,
        required:[true,'please enter the end date']
    },
    teams:{
        type:Array,
        required:[true,'please enter the teams']
    },
    matches:{
        type:Array,
        required:[true,'please enter the matches']
    },
    crickheroes_url:{
        type:String,
        required:[true,'please give the crickheroes_url']
    },
    others:{
        type:Array,
        required:[false,'please enter']
    },


},{timestamps:true} );

const tournamentdataModel = models.Tournment || model('Tournment', tournmentSchema);
export default tournamentdataModel;