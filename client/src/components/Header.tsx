//import React from 'react'
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/"><img src="/images/logos/Think-different-Academy_LOGO_oficialni-bile.png" alt="" /></Link>
      <div className="actions">
        <Link to="/games" className='button button-empty'>Seznam her</Link>
        <Link to="/think-different-academy" className='button button-empty'>O TdA</Link>
        <Link to="/about-team" className='button button-empty'>O týmu a aplikaci</Link>
      </div>
      <Link to="/game" className='button button-red'>Nová hra</Link>
    </header>
  )
}

export default Header
