"use client";
import React, { useState } from 'react';
import { Menu } from 'antd';
import BannerSlider from "@/app/components/matchesBanner";
import Upcoming from '@/app/components/upcomingMatches';
import Archives from '@/app/components/matchesArchives';
import LiveMatches from '@/app/components/liveMatches';

const items = [
  { label: 'Upcoming', key: 'upcoming' },
  { label: 'Archives', key: 'archives' },
];

const MatchesPage = () => {
  const [current, setCurrent] = useState('upcoming');

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div>
      <BannerSlider />
      <LiveMatches />
      <Menu
          onClick={onClick}
          className="matchesMenu"
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
      />
      <div style={{ marginTop: '20px' }}>
        {current === 'upcoming' && <Upcoming />}
        {current === 'archives' && <Archives />}
      </div>
    </div>
  );
};

export default MatchesPage;
