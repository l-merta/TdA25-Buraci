import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface ProfilePicProps {
  user: any
  index?: number
}

const ProfilePic: React.FC<ProfilePicProps> = ({ user, index }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [rank, setRank] = useState(index);

  useEffect(() => {
    if (!rank) {
      axios.get(`${apiUrl}users/rank/${user.uuid}`, {
        headers: {
          //'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Rank:', response.data);
        setRank(response.data.rank);
      })
      //.catch(error => {});
    }
  }, [rank]);

  return (
    <div className={"profile-pic " + (rank ? "profile-pic-border profile-pic-place-" + rank : "")}>
      {/* <img src="https://unsplash.it/1920/1080" alt="" /> */}
      <div className="background" style={ { backgroundColor: user && user.color } }></div>
      <div className="username-letter">{user.username[0].toUpperCase()}</div>
    </div>
  )
}

export default ProfilePic
