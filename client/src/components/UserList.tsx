import { useState, useEffect } from 'react';
import axios from 'axios';

import Loading from './Loading';
import UserItem from './UserItem';

interface UserProps {
  uuid: string;
  createdAt: string;
  username: string;
  email: string;
  rol: string;
}

const UserList: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState<Array<UserProps>>([]);
  const [isLoading, setIsLoading] = useState(false);
  //@ts-ignore
  const [filters, setFilters] = useState({ name: '', difficulty: '', lastModified: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      const query = new URLSearchParams(filters).toString();
      axios.get(`${apiUrl}users?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setIsLoading(false);
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        setIsLoading(false);
        setUsers([]);
      });
    }
  }, [filters]);

  /*
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };
  */

  return (
    <div className="user-list">
      {/* <div className="filter anim anim-slide-from-down">
        <input
          type="text"
          name="name"
          placeholder="Hledat podle jména"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <div className="menus">
          <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
            <option value="">Všechny obtížnosti</option>
            <option value="beginner">Beginner</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="extreme">Extreme</option>
          </select>
          <input
            type="date"
            name="lastModified"
            placeholder="Filter by last modified"
            value={filters.lastModified}
            onChange={handleFilterChange}
          />
        </div>
      </div> */}
      {!isLoading ? 
        <>
        {users.length === 0 && <p className='nothing-found'>Nic jsme tu nenašli..</p>}
        <div className='users'>
          {users && users.map((user, index) => (
            <UserItem user={user} key={user.uuid} index={index} />
          ))}
        </div>
        </>
        :
        <Loading />
      }
    </div>
  );
};

export default UserList;