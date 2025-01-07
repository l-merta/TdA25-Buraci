//import React from 'react'
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <img src="/images/logos/Think-different-Academy_LOGO_oficialni-bile.png" alt="" />
      <Link to="/game" className='button button-red'>Nová hra</Link>
    </header>
  )
}

export default Header
