import './App.css';
import React, { useState,useEffect } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Logout from "./Pages/Logout";
import ListDocuments from './Pages/ListDocuments';
import CreateDocument from './Pages/CreateDocument';
import DocumentByHash from './Pages/DocumentByHash';
import DocumentView from './Pages/DocumentView';
// import { ReactComponent as NavigationIcon } from './Assets/Icons/INCASELogo.svg';
// import {HomeIcon,ClockIcon,StatsIcon,DocumentIcon,GlobeIcon,ProfileIcon,RocketIcon} from './Assets/Icons/Icons'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  return (
    <Routes>
        <Route path="/" element={<Layout isAuthenticated={isAuthenticated} />}>
          <Route path="signup" element={<Register onRegister={handleLogin}/>} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="logout" element={<Logout onLogout={handleLogout}/>} />
          <Route path="list_documents" element={<ListDocuments isAuthenticated={isAuthenticated}/>} />
          <Route path="list_documents/view/:id" element={<DocumentView isAuthenticated={isAuthenticated}/>} />
          <Route path="create_document" element={<CreateDocument isAuthenticated={isAuthenticated}/>} />
          <Route path="document_by_hash" element={<DocumentByHash isAuthenticated={isAuthenticated}/>} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
  );
}
function Layout() {
  const token = localStorage.getItem('token');
  return (
    <div className="grid grid-cols-10 grid-rows-6 gap-3 h-screen">
      <div className="col-span-1 bg-gray-900 h-full row-span-6 text-white rounded-2xl m-2 sm:col-span-2">
        <div className="p-4">
          {/* <NavigationIcon /> */}
        </div>
        <nav className="text-lg flex-grow">
          <ul className="p-4">
            <li className="my-4">
              <Link
                to="/list_documents"
                className="flex items-center justify-center block p-2 rounded hover:bg-green-700 hover:text-white bg-white text-gray-800 font-semibold"
              >
                <div className="bg-green-700 rounded p-2">
                  {/* <HomeIcon color="#ffffff" /> */}
                </div>
                <span className="ml-2 flex-grow">List Documents</span>
              </Link>
            </li>

            <li className="my-4 ">
              <Link
                to="/create_document"
                className="flex items-center justify-center block p-2  rounded hover:bg-green-700 hover:text-white bg-white text-gray-800 font-semibold"
              >
                <div className="bg-green-700 rounded p-2">
                  {/* <GlobeIcon color="#ffffff" /> */}
                </div>
                <span className=" flex-grow ml-2">Create Documents</span>
              </Link>
            </li>
            <li className="my-4">
              <Link
                to="/document_by_hash"
                className="flex items-center justify-center block p-2  rounded hover:bg-green-700 hover:text-white bg-white text-gray-800 font-semibold"
              >
                <div className="bg-green-700 rounded p-2">
                  {/* <DocumentIcon color="#ffffff" /> */}
                </div>
                <span className="flex-grow ml-2">Documents By Hash</span>
              </Link>
            
            </li>
            
            <hr className="my-4" />
            
            {token && (
              <>
                <li className="my-4">
                  <Link
                    to="/logout"
                    className="flex items-center justify-center block p-2  rounded hover:bg-green-700 hover:text-white bg-white text-gray-800 font-semibold"
                  >
                    <div className="bg-green-700 rounded p-2">
                      {/* <RocketIcon color="#ffffff" /> */}
                    </div>
                    <span className="flex-grow ml-2">Logout</span>
                  </Link>
                </li>
              </>
            )}
            {!token && (
              <>
                <li className="my-4">
                  <Link
                    to="/signup"
                    className="flex items-center justify-center block p-2  rounded hover:bg-green-700 hover:text-white bg-white text-gray-800 font-semibold"
                  >
                    <div className="bg-green-700 rounded p-2">
                      {/* <RocketIcon color="#ffffff" /> */}
                    </div>
                    <span className="flex-grow ml-2">Sign up</span>
                  </Link>
                </li>
                <li className="my-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center block p-2  rounded hover:bg-green-700 hover:text-white bg-white text-gray-800 font-semibold"
                  >
                    <div className="bg-green-700 rounded p-2">
                      {/* <RocketIcon color="#ffffff" /> */}
                    </div>
                    <span className="flex-grow ml-2">Login</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="m-8 col-span-8 row-span-6 bg-gray-200 rounded-2xl shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}


function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

