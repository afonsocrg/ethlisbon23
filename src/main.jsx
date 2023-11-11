import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegulatorApp from './regulator/RegulatorPage'
import ProducerApp from './producer/ProducerApp'
import LandingPage from './LandingPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/regulator",
    element: <RegulatorApp />,
  },
  {
    path: "/producer",
    element: <ProducerApp/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
