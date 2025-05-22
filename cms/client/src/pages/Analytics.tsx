import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

function Analytics() {
  const [userCount, setUserCount] = useState(0);
  const [uniqueCountries, setUniqueCountries] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        const users = response.data.users
        setUserCount(response.data.total);
        const countries = new Set(users.map((user: { country: any; }) => user.country));
        setUniqueCountries(countries.size);
        // console.log(response.data.users)
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ paddingLeft: '60px' }}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white to-blue-300 p-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-700 leading-tight mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
            Analytics <span className="text-blue-500">Dashboard</span>
          </h1>
          <Link
            to="/modules/users"
            className="text-xl font-semibold text-blue-700 mb-4 hover:underline hover:text-blue-900 transition block"
          >
            View platform insights
          </Link>
          <div className="mt-6">
            <p className="text-lg font-medium text-gray-600">
              👥 Total Users: <span className="text-blue-600 font-bold">{userCount}</span> 🌍 Unique Countries: <span className="text-green-600 font-bold">{uniqueCountries}</span>
            </p>
            {/* <p className="text-lg font-medium text-gray-600">
              🌍 Unique Countries: <span className="text-green-600 font-bold">{uniqueCountries}</span>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
