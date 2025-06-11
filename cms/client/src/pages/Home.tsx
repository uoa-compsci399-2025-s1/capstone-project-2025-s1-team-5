import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {

  const [userCount, setUserCount] = useState(0);
  const [uniqueCountries, setUniqueCountries] = useState(0);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
        const users = response.data.users;
        setUserCount(response.data.total);

  
        const countries = new Set(users.map((user: { country: string }) => user.country));
        setUniqueCountries(countries.size);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ paddingLeft: '60px' }}>
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-r from-white to-blue-300 p-6 space-y-8">
        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-700 leading-tight mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
            Welcome to <span className="text-blue-500">UOA: Your Way</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-700 leading-tight mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
            Analytics <span className="text-blue-500">Dashboard</span>
          </h1>
          <Link
            to="/users"
            className="text-xl font-semibold text-blue-700 mb-4 hover:underline hover:text-blue-900 transition block"
          >
            View platform insights
          </Link>
          <div className="mt-6">
            <p className="text-lg font-medium text-gray-600">
              👥 Total Users: <span className="text-blue-600 font-bold">{userCount}</span>
              {'  '}🌍 Unique Countries: <span className="text-green-600 font-bold">{uniqueCountries}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
