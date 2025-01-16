import { useLocation } from "react-router-dom";

import Header from '../components/Header';
import Footer from '../components/Footer';

function ErrorPage() {
  document.title = "Error - TdA";
  
  const location = useLocation();
  const { error, message } = location.state || {
    error: "404",
    message: "Stránka nebyla nalezena"
  };

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-error anim anim-slide-from-down">
        <h1>Nastala chybička..</h1>
        <h2>
          <span className="message">{message}</span>
          <span className="code">ERROR:{error}</span>  
        </h2>
      </div>
      <Footer />
    </>
  )
}

export default ErrorPage