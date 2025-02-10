"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Card, Select, Input, Spin } from "antd";
import Link from "next/link";

const { Option } = Select;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const TeamPlayers = () => {
  const pathname = usePathname();
  const [teamId, setTeamId] = useState(null);
  const [playerIds, setPlayerIds] = useState([]);
  const [playerDetails, setPlayerDetails] = useState([]);
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Extract `teamId` from the URL
  useEffect(() => {
    const id = pathname.split("/").pop();
    setTeamId(id);
  }, [pathname]);

  // Fetch Team Details using `teamId`
  useEffect(() => {
    if (teamId) {
      const fetchTeamDetails = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTeamsData?team_id=${teamId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch team details. Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);
          if (data?.data) {
            setTeamDetails(data.data);
          } else {
            console.error("Team details field is missing in the response.");
          }
        } catch (e) {
          console.error("Error fetching team details:", e);
        }
      };

      fetchTeamDetails();
    }
  }, [teamId]);

  // Fetch Player IDs using `teamId`
  useEffect(() => {
    if (teamId) {
      const fetchPlayers = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getPlayerListByTeamId?team_id=${teamId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch players. Status: ${response.status}`);
          }

          const data = await response.json();
          if (data?.data?.players) {
            setPlayerIds(data.data.players);
          } else {
            console.error("Players field is missing in the response.");
          }
        } catch (e) {
          console.error("Error fetching players:", e);
        }
      };

      fetchPlayers();
    }
  }, [teamId]);

  // Fetch Player Details using `playerIds`
  useEffect(() => {
    if (playerIds.length > 0) {
      const fetchPlayerDetails = async () => {
        try {
          const promises = playerIds.map((playerId) =>
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUsersData?id=${playerId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
            ).then((res) => {
              if (!res.ok) {
                throw new Error(`Failed to fetch player details for ID: ${playerId}`);
              }
              return res.json();
            })
          );

          const details = await Promise.all(promises);
          const allPlayerDetails = details.map((playerData) => {
            if (playerData && playerData.data && playerData.data.length > 0) {
              return playerData.data[0];
            }
            console.warn("Unexpected structure for player data:", playerData);
            return null;
          });

          setPlayerDetails(allPlayerDetails.filter((player) => player !== null));
          setLoading(false);
        } catch (e) {
          console.error("Error fetching player details:", e);
          setLoading(false);
        }
      };

      fetchPlayerDetails();
    }
  }, [playerIds]);

  const filteredPlayers = useMemo(() => {
    return playerDetails.filter((player) => {
      const matchesGender = gender ? player.gender === gender : true;
      const matchesYear = year ? player.activeYear?.includes(parseInt(year)) : true;
      const matchesSearch = player.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesGender && matchesYear && matchesSearch;
    });
  }, [playerDetails, gender, year, debouncedSearchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleGenderChange = useCallback((value) => {
    setGender(value);
  }, []);

  const handleYearChange = useCallback((value) => {
    setYear(value);
  }, []);

  if (loading) {
    return (
      <div className="allplayers-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (filteredPlayers.length === 0) {
    return <div className="allplayers-empty">No players available</div>;
  }

  return (
    <div className="teamPlayers-page">
      <div className="team-details" style={{ backgroundColor: teamDetails?.teamColor || "#090F13" }}>
          {teamDetails && (
            <div className="team-details-container">
              <div className="team-logo">
                <img
                  src={teamDetails.logo_url || "/default-team-logo.jpg"} // Updated to use logo_url
                  alt={teamDetails.name}
                  className="team-logo-image"
                />
              </div>
              <div className="team-info">
                <p className="team-name">{teamDetails.name}</p>
                <button className="team-profile-button">Cricket Heros Profile</button>
              </div>
              <div className="team-owner-coach">
                <p>Owner: {teamDetails.owner}</p> {/* Updated from teamDetails.ownerName to teamDetails.owner */}
                <p>Coach: {teamDetails.coachName}</p>
              </div>
            </div>
          )}
        </div>
      <div className="allplayers-container">
      
      <div className="teamplayers-dynamic-division">
        <h1 className="allplayers-heading" style={{ marginTop: "40px" }}>
          Team Players
        </h1>
        <div className="allplayers-filters">
          <div className="allplayers-dropdowns">
            <Select
              value={gender}
              onChange={handleGenderChange}
              placeholder="Select Gender"
              className="allplayers-dropdown"
              style={{ textAlign: "left" }}
            >
              <Option value="">All</Option>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
            <Select
              value={year}
              onChange={handleYearChange}
              placeholder="Select Year"
              style={{ textAlign: "left" }}
              className="allplayers-dropdown"
            >
              <Option value="">All Years</Option>
              {Array.from(new Set(playerDetails.flatMap((player) => player.activeYear || []))).map(
                (year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                )
              )}
            </Select>
          </div>
          <div className="allplayers-search">
            <Input
              placeholder="Search Players"
              value={searchQuery}
              onChange={handleSearchChange}
              className="allplayers-input"
            />
          </div>
        </div>
      </div>

      <div className="teamplayers-cards-container">
        {filteredPlayers.map((player) => (
          <div className="allplayers-card-wrapper" key={player._id}>
            <Card
              hoverable
              cover={
                <div className="allplayers-card-image">
                  <img
                    alt={player.name}
                    src={player.profilePicture || "/default-profile.jpg"}
                    className="allplayers-image"
                  />
                </div>
              }
              className="allplayers-card"
            >
              <Card.Meta title={player.name} description={player.specialization} />
              <Link href={`/playerOverview/${player._id}`} className="allplayers-link" style={{ color: "white" }}>
                View Profile
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default TeamPlayers;
