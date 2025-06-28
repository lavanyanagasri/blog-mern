import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

export default function Header() {
  const {setuserinfo,userinfo} = useContext(UserContext);
  
  useEffect(() => {
  fetch('http://localhost:4000/profile', {
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((userinfo) => {
      setuserinfo(userinfo);
    });
}, []);

function logout() {
  fetch('http://localhost:4000/logout', {
    credentials: 'include',
    method: 'POST',
  }).then(() => setuserinfo(null));
}

const username=userinfo?.username;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MyBlog
      </Link>
      <nav className="flex gap-4">
        {username &&(
          <>
           <Link to='/create'>create new post</Link>
           <a onClick={logout}>Logout</a>
          </>
        )
        }
        {!username &&(
          <>
           <Link
          to="/login"
          className="text-gray-700 hover:text-blue-500 transition duration-200"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-gray-700 hover:text-blue-500 transition duration-200"
        >
          Register
        </Link>
          </>
        )
        }
        
      </nav>
    </header>
  );
}
