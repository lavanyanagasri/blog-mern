import React from 'react';
import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';

function Postpage({ _id, title, summary, cover, content, createdAt, author }) {
  // Use proper env variable name (REACT_APP_ for Create React App, VITE_ for Vite)
  const backendUrl = process.env.REACT_APP_API_URL;

  // Ensure URL is valid even if cover already includes a path like "uploads/image.jpg"
  const imageUrl = cover ? new URL(cover, backendUrl).toString() : '';

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <Link to={`/post/${_id}`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="cover"
            className="w-full h-64 object-cover"
          />
        )}
      </Link>
      <div className="p-4">
        <Link to={`/post/${_id}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
        </Link>
        <div className="text-sm text-gray-500 mb-2">
          <span>By {author?.username}</span> ·{' '}
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
        <p className="text-gray-700">{summary}</p>
      </div>
    </div>
  );
}

export default Postpage;
