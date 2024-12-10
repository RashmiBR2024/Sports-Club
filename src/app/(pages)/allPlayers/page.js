"use client";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Select, Input, Button, Spin } from "antd";
import Link from "next/link";

const { Option } = Select;

const AllPlayers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await fetch(
        "http://localhost:3000/api/coreUsersData?authkey=4c297349128e778505576f6045efb963"
      );
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setFilteredUsers(data.data); // Set initial filtered users
      } else {
        console.error("Error fetching data:", data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Handle filtering based on gender, year, and search query
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesGender = gender ? user.gender === gender : true;
      const matchesYear = year ? user.activeYear.includes(parseInt(year)) : true;
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGender && matchesYear && matchesSearch;
    });
    setFilteredUsers(filtered);
  }, [gender, year, searchQuery, users]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle gender change
  const handleGenderChange = (value) => {
    setGender(value);
  };

  // Handle year change
  const handleYearChange = (value) => {
    setYear(value);
  };

  // Clear filters
  const clearFilters = () => {
    setGender("");
    setYear("");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 mt-40 text-center text-lg font-semibold">
        <Spin size="large" />
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="container mx-auto py-10 mt-40 text-center text-lg font-semibold">
        No users available
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 mt-24">
      <h1 className="text-3xl font-bold text-center my-5">All Players</h1>

      {/* Search bar */}
      <div className="flex justify-center mb-5">
        <Input
          placeholder="Search Players"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ width: 300 }}
        />
      </div>

      {/* Dropdowns for gender and year */}
      <div className="flex justify-center gap-4 mb-5">
        <Select
          value={gender}
          onChange={handleGenderChange}
          placeholder="Select Gender"
          style={{ width: 200 }}
        >
          <Option value="">All Genders</Option>
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
        </Select>

        <Select
          value={year}
          onChange={handleYearChange}
          placeholder="Select Year"
          style={{ width: 200 }}
        >
          <Option value="">All Years</Option>
          {Array.from(new Set(users.flatMap((user) => user.activeYear)))
            .map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
        </Select>

        {/* Clear Filters Button */}
        <Button onClick={clearFilters} className="ml-4" type="default">
          Clear Filters
        </Button>
      </div>

      {/* Display filtered players */}
      <Row gutter={[16, 16]}>
        {filteredUsers.map((user) => (
          <Col span={6} key={user._id}>
            <Card
              hoverable
              cover={
                <div className="h-[250px] overflow-hidden">
                  <img
                    alt={user.name}
                    src={user.profilePicture || "/default-profile.jpg"}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              }
              className="flex flex-col justify-between h-full"
            >
              <Card.Meta title={user.name} description={user.specialization} />
              <Link href={`/players/${user._id}`} className="text-blue-500">
                View Profile
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AllPlayers;
