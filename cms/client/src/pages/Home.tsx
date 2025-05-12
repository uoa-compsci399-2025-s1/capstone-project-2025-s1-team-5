import React from 'react';

function Home() {
  return (
    <div style={{ paddingLeft: '60px' }}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white to-blue-300 p-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-700 leading-tight mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
            Welcome to <span className="text-blue-500">UOA: Your Way</span>
          </h1>
          <p className="text-xl font-semibold text-blue-700">Home Page</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
