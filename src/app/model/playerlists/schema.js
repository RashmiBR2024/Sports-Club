import { model,models,Schema } from "mongoose";

const playerListSchema = new Schema({
    team_id:{
        type:String,
        required:[true,'please enter the team_id']
    },
    players:{
        type:Array,
        required:[true,'please enter the player_id']
    },
    created_year:{
        type:Number,
        required:[true,'please enter the year']
    }
},{timestamps:true});

const playersDataModel=models.teamPlayers || model('teamPlayers',playerListSchema);

export default playersDataModel;