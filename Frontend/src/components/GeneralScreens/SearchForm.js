import React, { useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
    setSearchTerm('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2"
    >
      <input
        type="text"
        name="search"
        placeholder="Search..."
        className="flex-grow px-3 py-1 outline-none text-sm placeholder-gray-500"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />

      <button
        type="submit"
        disabled={!searchTerm.trim()}
        className={`ml-2 p-2 rounded-full transition-colors ${
          searchTerm.trim()
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <BiSearchAlt2 className="text-lg" />
      </button>
    </form>
  );
};

export default SearchForm;
