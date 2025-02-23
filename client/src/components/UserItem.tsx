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
      <div className="user-info">
        <div className="profile-pic">
          {/* <img src="https://unsplash.it/1920/1080" alt="" /> */}
          <div className="username-letter">{user.username[0].toUpperCase()}</div>
        </div>
        <div className="s1">
          <span className="username">{user.username}</span>
          <div className="elo">{user.elo}</div>
        </div>
      </div>
      <div className="user-data">
        <div className="item item-wins">
          <span className="value">{user.wins}</span>
          <span className='label'>Výhry</span>
        </div>
        <div className="item item-losses">
          <span className="value">{user.wins}</span>
          <span className='label'>Prohry</span>
        </div>
        <div className="item item-draws">
          <span className="value">{user.wins}</span>
          <span className='label'>Remízy</span>
        </div>
      </div>
    </div>
  );
};

export default UserItem;