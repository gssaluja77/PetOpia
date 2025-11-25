import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import SignOutButton from './SignOut';
import logo from '../img/petopia-logo.svg';

const Navigation = ({ userId, handleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="PetOpia Logo" className="h-8 w-auto" />
                <span className="text-2xl text-primary tracking-wide font-bold" style={{ fontFamily: "'Leckerli One', cursive" }}>PetOpia</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!userId && (
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  Home
                </NavLink>
              )}
              {userId && (
                <NavLink
                  to="/account/my-pets"
                  className={({ isActive }) =>
                    isActive
                      ? "border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  Pet Center
                </NavLink>
              )}
              {userId && (
                <NavLink
                  to="/account/community-posts"
                  className={({ isActive }) =>
                    isActive
                      ? "border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  Community
                </NavLink>
              )}
              <NavLink
                to="/adoptpet"
                className={({ isActive }) =>
                  isActive
                    ? "border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Adopt
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {userId ? (
              <>
                <span className="text-gray-700 font-medium mr-4">
                  Hi, <strong>{window.sessionStorage.getItem("userEmail")?.split('@')[0]}</strong>!
                </span>
                <SignOutButton handleChange={handleChange} />
              </>
            ) : (
              <Link to="/">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Sign In
                </button>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {!userId && (
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#fff8e6] border-primary text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
              >
                Home
              </NavLink>
            )}
            {userId && (
              <NavLink
                to="/account/my-pets"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#fff8e6] border-primary text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
              >
                Pet Center
              </NavLink>
            )}
            {userId && (
              <NavLink
                to="/account/community-posts"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#fff8e6] border-primary text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
              >
                Community
              </NavLink>
            )}
            <NavLink
              to="/adoptpet"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "bg-[#fff8e6] border-primary text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              }
            >
              Adopt
            </NavLink>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
            <div className="flex items-center px-4">
              {userId ? (
                <div className="w-full flex items-center justify-between">
                  <span className="text-gray-700 font-medium mr-4">
                    Hello, {window.sessionStorage.getItem("userEmail")?.split('@')[0]}!
                  </span>
                  <SignOutButton handleChange={handleChange} />
                </div>
              ) : (
                <Link to="/" onClick={() => setIsOpen(false)} className="w-full">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
