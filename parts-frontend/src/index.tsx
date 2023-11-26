import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { Login, Register } from './auth';
import { Browse, Cart, Order, Sell, Home, About } from './main';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/cart",
    element: <Cart />
  },
  {
    path: '/orders',
    element: <Order />
  },
  {
    path: '/sell',
    element: <Sell />
  },
  {
    path: '/about',
    element: <About />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);