import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import Postpage from './Postpage';

const Index = () => {
  const [posts,setposts]=useState([]);
  
  useEffect(()=>{
    fetch('http://localhost:4000/post').then(response=>{
      response.json().then(posts=>{
        setposts(posts);
      })
    })
  },[]);
  return (
    <div>
      {posts.length > 0 && posts.map(post => (
  <Postpage key={post._id} {...post} />
))}

    </div>
  )
}

export default Index
