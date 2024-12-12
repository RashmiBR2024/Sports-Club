"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card, Select, Input, Spin } from "antd";
import Link from "next/link";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const { Option } = Select;

const TeamPlayers = ({ params }) => {
  const { teamId } = params; // Access teamId from params
  const [playerIds, setPlayerIds] = useState([]);
  const [playerDetails, setPlayerDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDynamicDiv, setShowDynamicDiv] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchPlayerIds = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getPlayerListByTeamId?team_id=${teamId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
        );
        const data = await response.json();

        if (data.success && data.data.players) {
          setPlayerIds(data.data.players);
        } else {
          console.error("Error fetching player IDs:", data);
        }
      } catch (error) {
        console.error("Error fetching player IDs:", error);
      }
    };

    fetchPlayerIds();
  }, [teamId]);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      if (playerIds.length === 0) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreUsersData?authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const filteredPlayers = data.data.filter((user) =>
            playerIds.includes(user._id)
          );
          setPlayerDetails(filteredPlayers);
        } else {
          console.error("Error fetching player details:", data);
        }
      } catch (error) {
        console.error("Error fetching player details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [playerIds]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop) {
        setShowDynamicDiv(false);
      } else {
        setShowDynamicDiv(true);
      }
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const filteredPlayersMemo = useMemo(() => {
    return playerDetails.filter((player) => {
      const matchesGender = gender ? player.gender === gender : true;
      const matchesYear = year ? player.activeYear.includes(parseInt(year)) : true;
      const matchesSearch = player.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
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
      <div className="team-players-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (filteredPlayersMemo.length === 0) {
    return <div className="team-players-empty">No players found for this team.</div>;
  }

  return (
    <div className="team-players-container">
      {showDynamicDiv && (
        <div className="team-players-dynamic-division">
          <h1 className="team-players-heading">Team Players</h1>
          <div className="team-players-filters">
            <Select
              value={gender}
              onChange={handleGenderChange}
              placeholder="Select Gender"
              className="team-players-dropdown"
            >
              <Option value="">All</Option>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
            <Select
              value={year}
              onChange={handleYearChange}
              placeholder="Select Year"
              className="team-players-dropdown"
            >
              <Option value="">All Years</Option>
              {Array.from(
                new Set(playerDetails.flatMap((player) => player.activeYear))
              ).map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="Search Players"
              value={searchQuery}
              onChange={handleSearchChange}
              className="team-players-search"
            />
          </div>
        </div>
      )}

      <div className="team-players-cards">
        {filteredPlayersMemo.map((player) => (
          <Card
            key={player._id}
            hoverable
            cover={
              <img
                alt={player.name}
                src={player.profilePicture || "/default-profile.jpg"}
              />
            }
            className="team-players-card"
          >
            <Card.Meta title={player.name} description={player.specialization} />
            <Link href={`/players/${player._id}`} className="team-players-link">
              View Profile
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamPlayers;
