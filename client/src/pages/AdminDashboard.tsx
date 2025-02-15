//import { useState, useEffect } from 'react'
//import { Link } from "react-router-dom";
//import { useTheme, themeToImg } from '../components/ThemeHandler';
import { useUser } from './../components/User';

import Header from '../components/Header';
import Footer from '../components/Footer';

function AdminDashboard() {
  document.title = "Admin Dashboard";

  const { user } = useUser();
  //const theme = useTheme();

  if (!user || user.role !== 'admin') {
    window.location.href = '/';
  }
  else return (
    <>
      <Header active='admin'/>
      <div className="bg-grad"></div>
      <div className="main-admin anim anim-slide-from-down">
        <h1>Admin Dashboard</h1>
      </div>
      <Footer />
    </>
  )
}

export default AdminDashboard