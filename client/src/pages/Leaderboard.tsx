//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
//import { useTheme, themeToImg } from '../components/ThemeHandler';
//import { useUser } from '../components/User';

import Header from '../components/Header';
import UserList from '../components/UserList';
import Footer from '../components/Footer';

function AdminDashboard() {
  document.title = "Žebříček - TdA";

  //const { user } = useUser();
  //const theme = useTheme();

  return (
    <>
      <Header active='leaderboard'/>
      <div className="bg-grad"></div>
      <div className="main-leaderboard anim anim-slide-from-down">
        <h1>Žebříček hráčů</h1>
        <UserList />
      </div>
      <Footer />
    </>
  )
}

export default AdminDashboard