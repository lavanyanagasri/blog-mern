import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import SearchForm from './SearchForm';
import { RiPencilFill } from 'react-icons/ri'
import { FaUserEdit } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { BsBookmarks } from 'react-icons/bs'
import SkeletonElement from '../Skeletons/SkeletonElement';
import { AuthContext } from '../../Context/AuthContext';

const Header = () => {
    const bool = localStorage.getItem("authToken") ? true : false;
    const [auth, setAuth] = useState(bool);
    const { activeUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setAuth(bool);
        setTimeout(() => setLoading(false), 1600);
    }, [bool]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate('/');
    };

    return (
        <header className="bg-white shadow-md py-3">
            <div className="container mx-auto px-4 flex justify-between items-center flex-wrap gap-4">
                
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-600 ml-16">
                    MERN BLOG
                </Link>

                {/* Search */}
               <div className="flex-grow max-w-xl w-full">
              <SearchForm />
                 </div>


                {/* Right-side Options */}
                <div className="flex items-center gap-4">
                    {auth ? (
                        <div className="flex items-center gap-4">
                            {/* Add Story */}
                            <Link to="/addstory" className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                                <RiPencilFill />
                                Add Story
                            </Link>

                            {/* Read List */}
                            <Link to="/readList" className="relative text-sm text-purple-600 hover:text-purple-700 font-medium">
                                <BsBookmarks className="text-lg" />
                                <span id="readListLength" className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                                    {activeUser.readListLength}
                                </span>
                            </Link>

                            {/* Profile Picture + Dropdown */}
                            <div className="relative group">
                                {loading ? (
                                    <SkeletonElement type="minsize-avatar" />
                                ) : (
                                    <img
                                        src={`/userPhotos/${activeUser.photo}`}
                                        alt={activeUser.username}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                                    />
                                )}

                                {/* Profile Dropdown */}
                                <div className="absolute hidden group-hover:flex flex-col right-0 mt-2 bg-white border rounded shadow-lg z-50">
                                    <Link to="/profile" className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm">
                                        <FaUserEdit />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm text-red-600"
                                    >
                                        <BiLogOut />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 mr-9">
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
