"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

const PlayerOverview = () => {
  const [playerData, setPlayerData] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const pathname = usePathname();

  // Extract `playerId` from the URL
  useEffect(() => {
    const id = pathname.split("/").pop();
    setPlayerId(id);
  }, [pathname]);

  useEffect(() => {
    if (playerId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUsersData?id=${playerId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`)
        .then((response) => {
          console.log("API Response:", response.data);
          // Ensure you access the first item in the `data` array
          if (response.data?.data?.length > 0) {
            setPlayerData(response.data.data[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching player data:", error);
        });
    }
  }, [playerId]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const dob = new Date(dateOfBirth);
    const diff = Date.now() - dob.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  if (!playerData) {
    return <div>Loading...</div>;
  }

  const activeYears = playerData.activeYear || [];

  const formatDate = (date) => {
    if (!date) return "N/A";
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
  
    return `${day} - ${month} - ${year}`;
  };
  

  return (
    <div className="playeroverview-container" style={{ marginTop: "-5%" }}>
    <div className="playeroverview">
      <div className="playeroverview-head">
        <h1 className="playeroverview-heading1">Player Overview</h1>
      </div>

      <div className="playeroverview-profile">
        <div className="playeroverview-img">
          <img
            src={playerData.profilePicture}
            alt="player"
          />
        </div>

        <div className="playeroverview-details">
          <p className="playerName">{playerData.name}</p>
          <p className="playerText">Joining Date: {formatDate(playerData.dateOfJoining)}</p>
          <p className="playerText">Date of Birth: {formatDate(playerData.dateOfBirth)}</p>
          <p className="playerText">Age: {calculateAge(playerData.dateOfBirth)}</p>
          <p className="player-specialization">Specialization: {playerData.specialization}</p>
          <div className="playeroverview-runs-wickets">
            <p>Total Wickets: {playerData.wickets || "N/A"}</p>
            <p>Total Runs: {playerData.runs || "N/A"}</p>
          </div>
          <a
            className="playeroverview-button"
            href={playerData.crickheros_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "black", display: "flex" , width: "40%", fontSize: "20px"}}
          >
            <img style={{height: "30px", paddingRight: "20px"}} src="https://static.gameloop.com/img/492a88780e4e55222a117ab92d72f964.png?imageMogr2/thumbnail/172.8x172.8/format/webp" alt="crickheros" />  
            Crickheros Profile
          </a>
        </div>
      </div>
      </div>

      <div className="playeroverview-history">
        <h2 className="playeroverview-heading">Player History</h2>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Team</th>
              <th>Position</th>
              <th>Runs</th>
              <th>Wickets</th>
            </tr>
          </thead>
          <tbody>
            {activeYears.map((year, index) => (
              <tr key={index}>
                <td>{year}</td>
                <td>Team {index + 1}</td>
                <td>Position {index + 1}</td>
                <td>{playerData.runs || "N/A"}</td>
                <td>{playerData.wickets || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
  );
};

export default PlayerOverview;
