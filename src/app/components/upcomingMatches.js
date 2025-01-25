"use client";
import { useEffect, useState } from "react";
import { Button, Flex } from 'antd';


const Upcoming = () => {
    const [matches, setMatches] = useState([]);
    // const [completedMatches, setCompletedMatches] = useState([]);

    useEffect(() => {
        const fetchMatchesAndTeams = async () => {
            try {
                // Fetch all match data
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreMatchesData`, {
                    headers: {
                        'x-api-key': `${process.env.NEXT_PUBLIC_API_AUTH_KEY}`,
                    },
                });
                const data = await response.json();
    
                if (data.success && Array.isArray(data.data)) {
                    const upcomingMatches = data.data.filter(match => match.status === "Scheduled");
    
                    // Extract unique team IDs from matches
                    const teamIds = Array.from(
                        new Set(upcomingMatches.flatMap(match => [match.team_1, match.team_2]))
                    );
    
                    // Fetch details for each team ID
                    const teamDetailsPromises = teamIds.map(async (teamId) => {
                        const teamResponse = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTeamsData?team_id=${teamId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
                        );
                        const teamData = await teamResponse.json();
                        return teamData.success ? { [teamId]: teamData.data } : { [teamId]: null };
                    });
    
                    // Combine all team details into a single object
                    const teamsDataArray = await Promise.all(teamDetailsPromises);
                    const teamsMap = Object.assign({}, ...teamsDataArray);
    
                    // Enrich match data with team details
                    const enrichedMatches = upcomingMatches.map(match => ({
                        ...match,
                        team1: teamsMap[match.team_1] || { name: "Unknown", flagUrl: "" },
                        team2: teamsMap[match.team_2] || { name: "Unknown", flagUrl: "" },
                    }));
    
                    // Sort matches by date (ascending order)
                    enrichedMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
    
                    setMatches(enrichedMatches);
                }
            } catch (error) {
                console.error("Error fetching matches or teams:", error);
            }
        };
    
        fetchMatchesAndTeams();
    }, []);    

    return (
        <div style={{ marginTop: "5%" }}>
            <div className="matches-container">
                <div className="matches-grid">
                    {matches.length > 0 ? (
                        matches.map(match => (
                            <div key={match._id} className="match-card">
                                <div className="match-card-title">
                                    <p className="result" style={{ color:"teal" }}>{match.title}</p>
                                </div>
                                <div className="match-card-header">
                                    <div>
                                        <img
                                            src={match.team1.logo_url}
                                            alt={match.team1.name}
                                            className="team-flag"
                                        />
                                        <div className="matches-team-details">
                                            <p>{match.team1.name}</p>
                                            {/* <p>{match.score}</p> */}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="match-date" style={{fontSize: "12px", width: "80px"}}>{new Date(match.date).toDateString()}</p>
                                        <p className="match-format" style={{color: "red", fontWeight: "bold"}}>{match.format}</p>
                                        <p className="match-location" style={{fontSize: "10px", width: "80px"}}>{match.location}</p>
                                    </div>

                                    <div>
                                        <img
                                            src={match.team2.logo_url}
                                            alt={match.team2.name}
                                            className="team-flag"
                                        />
                                        <div className="matches-team-details">
                                            <p>{match.team2.name}</p>
                                            {/* <p>{match.team2.score}</p> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="match-card-pay-button">
                                    <Button type="primary">Register Now</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{fontWeight: "bold", marginLeft: "5%"}}>No completed matches available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Upcoming;
