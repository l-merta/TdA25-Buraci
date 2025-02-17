//import React, { useState, useEffect, useRef } from 'react';
//import { Link } from "react-router-dom";
//import { useTheme, themeToImg } from './ThemeHandler';

//import Loading from './Loading';

interface UserProps {
  user: any;
  index: number;
}

const UserItem:React.FC<UserProps> = ({ user, index }) => {
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
  )
}

export default UserItem