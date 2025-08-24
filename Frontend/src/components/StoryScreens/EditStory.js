import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Loader from '../GeneralScreens/Loader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai';

const EditStory = () => {
  const { config } = useContext(AuthContext);
  const slug = useParams().slug;
  const imageEl = useRef(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState({});
  const [image, setImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getStoryInfo = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/story/editStory/${slug}`, config);
        setStory(data.data);
        setTitle(data.data.title);
        setContent(data.data.content);
        setImage(data.data.image);
        setPreviousImage(data.data.image);
        setLoading(false);
      } catch (error) {
        navigate("/");
      }
    };
    getStoryInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("content", content);
    formdata.append("image", image);
    formdata.append("previousImage", previousImage);

    try {
      const { data } = await axios.put(`/story/${slug}/edit`, formdata, config);
      setSuccess('Story updated successfully 🎉');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong!');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex justify-center items-center bg-gray-950 px-4 py-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700"
          >
            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-400 text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-400 text-green-400 text-sm flex justify-between items-center">
                <span>{success}</span>
                <Link to="/" className="underline text-green-300">
                  Go Home
                </Link>
              </div>
            )}

            {/* Title */}
            <input
              type="text"
              required
              placeholder="Enter story title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
            />

            {/* Editor */}
            <div className="mb-5">
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(e, editor) => setContent(editor.getData())}
              />
            </div>

            {/* Current Image */}
            <div className="mb-5">
              <p className="text-gray-400 text-sm mb-2">Currently Image</p>
              <img
                src={`http://localhost:5000/storyImages/${previousImage}`}
                alt="story"
                className="w-48 rounded-lg border border-gray-700"
              />
            </div>

            {/* Upload */}
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-dashed border-gray-600 rounded-lg hover:bg-gray-800 transition mb-5">
              <AiOutlineUpload className="text-xl text-indigo-400" />
              <span className="text-gray-300 text-sm">
                {image === previousImage
                  ? "Change the story image"
                  : image?.name || "Upload new image"}
              </span>
              <input
                type="file"
                name="image"
                ref={imageEl}
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
            >
              Update Story
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditStory;
