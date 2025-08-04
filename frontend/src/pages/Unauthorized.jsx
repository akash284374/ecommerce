import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
        <p className="text-gray-700 text-lg">
          You don’t have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
