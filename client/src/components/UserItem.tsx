import React from 'react';
//import axios from 'axios';

interface UserProps {
  user: any;
  index: number;
}

const UserItem: React.FC<UserProps> = ({ user, index }) => {
  //const apiUrl = import.meta.env.VITE_API_URL;

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
    </div>
  );
};

export default UserItem;