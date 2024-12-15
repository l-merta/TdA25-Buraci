import { useEffect } from 'react';
const Game = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + "games"); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // Parse JSON data
        console.log(result);
      } catch (error: any) {
        console.log(error.message); // Set error message if there's an issue
      } finally {
        //setLoading(false);
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <h1>Game list</h1>
    </>
  )
}

export default Game
