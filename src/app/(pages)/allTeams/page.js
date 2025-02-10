"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Select, Input, Spin } from "antd"; // Import Spin for loading indicator
import Link from "next/link";

const { Option } = Select;

// Fetch teams data asynchronously
async function fetchTeams() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${backendUrl}/api/coreTeamsData`, { cache: "no-store" });
  const data = await res.json();
  return data.success ? data.data : [];
}

// Main component
export default function AllTeams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedYear, setSelectedYear] = useState(""); // State for year filter
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showFilters, setShowFilters] = useState(true); // State to toggle filters visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true); // Set loading to true before fetching data
      const teamsData = await fetchTeams();
      setTeams(teamsData);
      setFilteredTeams(teamsData);
      setLoading(false); // Set loading to false after data is fetched
    };
    loadTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) => {
      const matchesYear = selectedYear
        ? team.createYear?.toString() === selectedYear
        : true;
      const matchesSearch = team.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesYear && matchesSearch;
    });
    setFilteredTeams(filtered);
  }, [teams, selectedYear, searchQuery]);

  const handleYearChange = useCallback((value) => {
    setSelectedYear(value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setShowFilters(currentScrollY < lastScrollY || currentScrollY < 100);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const noTeamsMessage = selectedYear
    ? `No teams were created in ${selectedYear}.`
    : "No teams available.";

  return (
    <section className="allteams-sec">
      {/* Fixed heading with filters */}
      <div
        className={`allteams-dynamic-division ${showFilters ? "visible" : "hidden"}`}
      >
        <div className="allteams-heading-container" style={{ width: "110%" }}>
          <h1 className="allteams-heading" style={{ marginTop: "120px" , padding: "30px 0 10px 0 "}}>
            All Teams
          </h1>
          <div className="allteams-filters">
            <div className="allteams-filters-left">
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                placeholder="Select Year"
                className="allteams-dropdown"
                style={{ textAlign: "left" }}
              >
                <Option value="">All</Option>
                <Option value="2025">2025</Option>
                <Option value="2024">2024</Option>
                <Option value="2023">2023</Option>
                <Option value="2022">2022</Option>
                <Option value="2021">2021</Option>
              </Select>
            </div>
            <div className="allteams-filters-right">
              <Input
                placeholder="Search Teams"
                value={searchQuery}
                onChange={handleSearchChange}
                className="allteams-search-box"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="allteams-main-container" style={{ margin: "140px 0" }}>
        <div className="allteams-container">
          {loading ? (
            <div className="allteams-loading" style={{textAlign: "center"}}>
              <Spin size="large" /> {/* Loading spinner */}
            </div>
          ) : filteredTeams.length > 0 ? (
            <Row gutter={[16, 16]} className="allteams-row">
              {filteredTeams.map((team) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={8}
                  key={team._id}
                  className="allteams-col"
                >
                  <Link href={`allTeams/teamPlayers/${team._id}`} passHref>
                    <Card
                      hoverable
                      className="allteams-card"
                      cover={
                        <img
                          alt={team.name}
                          src={team.logo_url || "/default-image.jpg"}
                          className="allteams-card-image"
                        />
                      }
                    >
                      <h3
                        className="allteams-card-title text-black outline-black"
                        style={{
                          fontSize: "1.5rem", // Increase font size for better readability
                          fontWeight: "bold", // Increase font weight for better visibility
                          color: team.teamColor, // Set dynamic color for the text
                          // WebkitTextStroke: "1px black", // Add black outline for better visibility
                        }}
                      >
                        {team.name}
                      </h3>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="allteams-empty">{noTeamsMessage}</div>
          )}
        </div>
      </div>
    </section>
  );
}
