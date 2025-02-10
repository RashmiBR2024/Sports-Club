import { Schema, model, models } from 'mongoose';

const teamSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Team name is required']
    },
    logo_url: {
        type: String, // URL to the team's logo
        required: false // Optional
    },
    owner: {
        type: String,
        required: [true, 'Owner name is required']
    },
    coachName: {
        type: String,
        required: [true, 'Coach name is required']
    },
    createYear: {
        type: Number, // Year the team was created
        required: [true, 'Creation year is required']
    },
    teamColor: {
        type: String, 
        required: false,
        default: "#090F13"
    },
    teamCode: {
        type: String,
        required: false,
        unique: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Pre-save middleware to generate a unique teamCode
teamSchema.pre('save', async function (next) {
    if (!this.isNew) return next(); // Only generate for new documents

    // Extract initials from team name
    const initials = this.name
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('');

    // Find the latest team code with the same initials
    const latestTeam = await models.Team.findOne({ teamCode: new RegExp(`^${initials}\\d{3}$`, 'i') })
        .sort({ teamCode: -1 })
        .exec();

    let nextNumber = 1;
    if (latestTeam) {
        const match = latestTeam.teamCode.match(/\d+$/);
        if (match) {
            nextNumber = parseInt(match[0], 10) + 1;
        }
    }

    // Format the team code as 'ABC001'
    this.teamCode = `${initials}${String(nextNumber).padStart(3, '0')}`;

    next();
});

// Check if the model already exists to avoid overwrite errors
const TeamModel = models.Team || model('Team', teamSchema);

export default TeamModel;
