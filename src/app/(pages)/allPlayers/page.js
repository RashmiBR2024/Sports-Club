"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card, Col, Row, Select, Input, Spin } from "antd";
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

const AllPlayers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDynamicDiv, setShowDynamicDiv] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreUsersData?authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
      );
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
        setFilteredUsers(data.data);
      } else {
        console.error("Error fetching data:", data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

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

  const filteredUsersMemo = useMemo(() => {
    return users.filter((user) => {
      const matchesGender = gender ? user.gender === gender : true;
      const matchesYear = year ? user.activeYear.includes(parseInt(year)) : true;
      const matchesSearch = user.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesGender && matchesYear && matchesSearch;
    });
  }, [users, gender, year, debouncedSearchQuery]);

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

  if (filteredUsersMemo.length === 0) {
    return <div className="allplayers-empty">No users available</div>;
  }

  return (
    <div className="allplayers-container">
      {showDynamicDiv && (
        <div className="allplayers-dynamic-division">
          <h1 className="allplayers-heading" style={{marginTop: "70px"}}>All Players</h1>
          <div className="allplayers-filters">
            <div className="allplayers-dropdowns">
              <Select
                value={gender}
                onChange={handleGenderChange}
                placeholder="Select Gender"
                style={{textAlign: "left"}}
                className="allplayers-dropdown"
              >
                <Option value="">All</Option>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
              <Select
                value={year}
                onChange={handleYearChange}
                placeholder="Select Year"
                className="allplayers-dropdown"
                style={{textAlign: "left"}}
              >
                <Option value="">All Years</Option>
                {Array.from(new Set(users.flatMap((user) => user.activeYear))).map(
                  (year) => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  )
                )}
              </Select>
            </div>
            <div className="allplayers-search" style={{ marginRight: "1.5%" }}>
              <Input
                placeholder="Search Players"
                value={searchQuery}
                onChange={handleSearchChange}
                className="allplayers-input"
              />
            </div>
          </div>
        </div>
      )}

      <div className="allplayers-cards-container" style={{marginTop: "13%"}}>
        {filteredUsersMemo.map((user) => (
          <div className="allplayers-card-wrapper" key={user._id}>
            <Card
              hoverable
              cover={
                <div className="allplayers-card-image">
                  <img
                    alt={user.name?.charAt(0).toUpperCase() + user.name?.slice(1).toLowerCase()}
                    src={user.profilePicture || "/default-profile.jpg"}
                    className="allplayers-image"
                  />
                </div>
              }
              className="allplayers-card"
            >
              <div>
              <Card.Meta style={{ fontSize: "12px" }} title={user.name?.charAt(0).toUpperCase() + user.name?.slice(1).toLowerCase()}  />
              </div>
              <div style={{ height: "45px" }}>
              <Card.Meta style={{ fontSize: "12px" }} description={user.specialization?.join(" | ")} />
              </div>

              <Link href={`/playerOverview/${user._id}`} className="allplayers-link" style={{color: "white"}}>
                View Profile
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPlayers;
