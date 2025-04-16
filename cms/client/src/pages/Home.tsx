import React from 'react';
import Layout from '../components/Layout';

function Home() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome to the UoA International Student Hub
        </h1>

        <p className="text-lg text-gray-700 mb-4">
          Moving to a new country for your studies is both exciting and challenging. This app is designed 
          specifically for international students at the University of Auckland to help make your transition 
          smoother and more enjoyable.
        </p>

        <p className="text-gray-600 mb-4">
          Here, you'll find helpful resources on student visas and immigration, discover housing and 
          accommodation options, stay up to date with social events, and connect with university support services. 
          It’s your go-to guide for thriving as an international student in Auckland.
        </p>

        <p className="text-gray-600 italic">
          Whether you're just arriving or already settling in, this hub is here to support you every step of the way.
          Welcome to your new academic home!
        </p>
      </div>
    </Layout>
  );
}

export default Home;