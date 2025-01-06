//@ts-ignore
import React, { useEffect } from 'react'
import { Link } from "react-router-dom";

import Header from './../components/Header';
import Footer from './../components/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <h1>Think Different Academy</h1>
        <nav>
          <Link to="/game" className='button button-1'>Nová hra</Link>
          <Link to="/games" className='button button-1'>Seznam her</Link>
          <Link to="/create" className='button button-2'>Vytvořit hru</Link>
        </nav>
      </main>
      <section>
        <h2>AI Battle</h2>
      </section>
      <section>
        <h2>O Think Different Academy</h2>
      </section>
      <section>
        <h2>Co aplikace umí</h2>
      </section>
      <Footer />
    </>
  )
}

export default App