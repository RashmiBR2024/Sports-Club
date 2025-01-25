"use client";
import { useEffect, useState } from "react";

const LiveMatches = () => {

    const [liveMatch, setLiveMatch] = useState(null);

    useEffect(() => {
        const fetchMatchesAndTeams = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreMatchesData`, {
                    headers: {
                        'x-api-key': `${process.env.NEXT_PUBLIC_API_AUTH_KEY}`,
                    },
                });
                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

                    // Find today's match that is still marked as "Scheduled"
                    const todayMatch = data.data.find(match => 
                        match.date.startsWith(today) && match.status === "Scheduled"
                    );

                    if (todayMatch) {
                        // Fetch team details
                        const teamIds = [todayMatch.team_1, todayMatch.team_2];

                        const teamDetailsPromises = teamIds.map(async (teamId) => {
                            const teamResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTeamsData?team_id=${teamId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
                            );
                            const teamData = await teamResponse.json();
                            return teamData.success ? { [teamId]: teamData.data } : { [teamId]: null };
                        });

                        const teamsDataArray = await Promise.all(teamDetailsPromises);
                        const teamsMap = Object.assign({}, ...teamsDataArray);

                        // Enrich match data
                        const enrichedMatch = {
                            ...todayMatch,
                            team1: teamsMap[todayMatch.team_1] || { name: "Unknown", logo_url: "" },
                            team2: teamsMap[todayMatch.team_2] || { name: "Unknown", logo_url: "" },
                        };

                        setLiveMatch(enrichedMatch);
                    }
                }
            } catch (error) {
                console.error("Error fetching live match data:", error);
            }
        };

        fetchMatchesAndTeams();
    }, []);

    return (
        <div className="live-container">
            {liveMatch ? (
                <div className="live-match-card">
                    <div className="live-match-header" style={{ marginTop: "20px" }}>
                        <button class="live-btn">Live</button>
                    </div>
                    <div className="live-match-title">{liveMatch.title}</div>
                    <div className="live-match-content">
                        <div className="live-team team-1">
                            <img src={liveMatch.team1.logo_url} alt={liveMatch.team1.name} className="live-team-logo" />
                            <p className="live-team-name team-1-name" style={{marginLeft: "10px", width: "380px", padding: "7px 0",  backgroundColor: liveMatch.team1.teamColor || "#122758", color: "white"}}>{liveMatch.team1.name}</p>
                        </div>
                        <div className="live-versus">
                            <p className="live-versus">V/S</p>
                        </div>
                        <div className="live-team team-2">
                            <p className="live-team-name team-2-name" style={{marginRight: "10px", width: "380px", padding: "7px 0",  backgroundColor: liveMatch.team2.teamColor || "#122758", color: "white"}}>{liveMatch.team2.name}</p>
                            <img src={liveMatch.team2.logo_url} alt={liveMatch.team2.name} className="live-team-logo" />
                        </div>
                    </div>
                    <div className="live-match-details">
                        <div className="live-match-info" >
                            <img src="https://png.pngtree.com/png-clipart/20230425/original/pngtree-3d-location-icon-clipart-in-transparent-background-png-image_9095284.png" alt="Location" className="live-icon" />
                            {liveMatch.location || "Unknown"}
                        </div>
                        <div className="live-match-info" >
                            {liveMatch.format || "Unknown"}
                        </div>
                        <div className="live-match-info">
                            {liveMatch.overs || "Unknown"} Overs
                        </div>
                    </div>
                </div>
            ) : (
                <p className="live-no-match">No live matches available.</p>
            )}
        </div>
    );
};

export default LiveMatches;
