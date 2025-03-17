import React from 'react';
import { Routes, Route, RouterProvider } from 'react-router-dom';
import { router } from './router/router';

function App() {
  return (
    <div>
 
      <RouterProvider router={router} />
    </div>
  );
}

export default App;