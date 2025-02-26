import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfilePicProps {
  user: any;
  index?: number;
}

const ProfilePic: React.FC<ProfilePicProps> = ({ user, index }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [rank, setRank] = useState(index);
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    if (!rank) {
      axios.get(`${apiUrl}users/rank/${user.uuid}`, {
        headers: {
          //'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log(user.username, response.data.rank);
        setRank(response.data.rank);
      })
      //.catch(error => {});
    }
  }, [rank]);

  useEffect(() => {
    axios.get(`${apiUrl}users/images/${user.username}`)
      .then(response => {
        if (response.status === 200) {
          setImageExists(true);
        }
      })
      .catch(() => {
        setImageExists(false);
      });
  }, [user.username]);

  return (
    <div className={"profile-pic " + (rank ? "profile-pic-border profile-pic-place-" + rank : "")}>
      {imageExists && <img src={`${apiUrl}users/images/${user.username}`} alt="" />}
      {!imageExists &&
        <div className="background" style={{ backgroundColor: user && user.color }}></div>
      }
      <div className="effect"></div>
      <div className="username-letter">{user.username[0].toUpperCase()}</div>
      {user.role == "admin" && <div className="admin"><i className="fa-solid fa-gear"></i></div>}
    </div>
  );
};

export default ProfilePic;
