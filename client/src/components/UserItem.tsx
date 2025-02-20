import React from 'react';
import axios from 'axios';

interface UserProps {
  user: any;
  index: number;
}

const UserItem: React.FC<UserProps> = ({ user, index }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

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
    <div className={"user anim anim-slide-from-down"} style={{ animationDelay: index * 0.08 + "s" }}>
      <div className="user-name">
        <span className="username">{user.username}</span>
        <span className="email">{user.email}</span>
      </div>
      <div className="user-data">
        <span className="role">{user.role}</span>
        <span className="created-at">{user.createdAt}</span>
      </div>
      <button className="button button-red button-border" onClick={userBan}>Ban</button>
    </div>
  );
};

export default UserItem;