import React from 'react';
import { Link } from "react-router-dom";
import { useUser } from './User';
import axios from 'axios';

import ProfilePic from './ProfilePic';

interface UserProps {
  user: any;
  index: number;
}

const UserItem: React.FC<UserProps> = ({ user, index }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user: loggedInUser } = useUser();

  const userBan = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post(`${apiUrl}users/${user.uuid}/ban`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Optionally, you can update the UI to reflect the banned user
        console.log(`User ${user.uuid} banned successfully`);
      } catch (error) {
        console.error('Failed to ban user:', error);
      }
    }
  };

  return (
    <div className={(loggedInUser && loggedInUser.uuid == user.uuid && "user-active") + " user user-admin anim anim-slide-from-down"} style={{ animationDelay: index * 0.08 + "s" }}>
      <div className="user-info">
        <span className="index">{index + 1}.</span>
        <ProfilePic user={user} index={index + 1} />
        <div className="s1">
          <span className="username">{user.username}</span>
          <div className="elo">
            <i className="fa-solid fa-trophy"></i>
            <span>{user.elo}</span>
          </div>
        </div>
      </div>
      <div className="user-data">
        <div className="item item-wins">
          <span className="value">{user.wins}</span>
          <span className='label'>Výhry</span>
        </div>
        <div className="item item-losses">
          <span className="value">{user.losses}</span>
          <span className='label'>Prohry</span>
        </div>
        <div className="item item-draws">
          <span className="value">{user.draws}</span>
          <span className='label'>Remízy</span>
        </div>
        <button className="button button-red button-border" onClick={userBan}>Ban</button>
      </div>
    </div>
  );
};

export default UserItem;