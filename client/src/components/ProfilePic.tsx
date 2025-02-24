import React from 'react'

interface ProfilePicProps {
  user: any
}

const ProfilePic: React.FC<ProfilePicProps> = ({ user }) => {
  //console.log(user);

  return (
    <div className="profile-pic" style={ { backgroundColor: user && user.color } }>
      {/* <img src="https://unsplash.it/1920/1080" alt="" /> */}
      <div className="username-letter">{user.username[0].toUpperCase()}</div>
    </div>
  )
}

export default ProfilePic
