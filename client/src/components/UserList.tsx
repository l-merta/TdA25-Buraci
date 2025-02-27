import { useState, useEffect } from 'react';
import axios from 'axios';

import Loading from './Loading';
import UserItemAdmin from './UserItemAdmin';
import UserItem from './UserItem';

interface UserListProps {
  admin?: boolean;
}
interface UserProps {
  uuid: string;
  createdAt: string;
  username: string;
  email: string;
  role: string;
}

const UserList: React.FC<UserListProps> = ({ admin = false }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState<Array<UserProps>>([]);
  const [isLoading, setIsLoading] = useState(false);
  //@ts-ignore
  const [filters, setFilters] = useState({ name: '', difficulty: '', lastModified: '' });

  useEffect(() => {
    //const token = localStorage.getItem('token');
    setIsLoading(true);
    const query = new URLSearchParams(filters).toString();
    axios.get(`${apiUrl}users?${query}`, {
      headers: {
        //'Authorization': `Bearer ${token}`
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
  }, [filters]);

  /*
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };
  */

  return (
    <div className="user-list">
      {!isLoading ? 
        <>
        {users.length === 0 && <p className='nothing-found'>Nic jsme tu nenašli..</p>}
        <div className='users'>
          {users && users.map((user, index) => (
            (admin ?
              <UserItemAdmin user={user} key={user.uuid} index={index} />
              :
              <UserItem user={user} key={user.uuid} index={index} />
            )
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