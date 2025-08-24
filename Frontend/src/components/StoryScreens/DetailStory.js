import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Loader from '../GeneralScreens/Loader'
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit, FiArrowLeft } from 'react-icons/fi'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'
import CommentSidebar from '../CommentScreens/CommentSidebar'

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [story, setStory] = useState({})
  const [storyLikeUser, setStoryLikeUser] = useState([])
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const [storyReadListStatus, setStoryReadListStatus] = useState(false)
  const slug = useParams().slug
  const navigate = useNavigate()

  useEffect(() => {
    const getDetailStory = async () => {
      setLoading(true)
      let user = {}
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        user = data.user
        setActiveUser(user)
      } catch {
        setActiveUser({})
      }

      try {
        const { data } = await axios.post(`/story/${slug}`, { activeUser: user })
        setStory(data.data)
        setLikeStatus(data.likeStatus)
        setLikeCount(data.data.likeCount)
        setStoryLikeUser(data.data.likes)
        setLoading(false)

        if (user.readList && user.readList.includes(data.data._id)) {
          setStoryReadListStatus(true)
        }
      } catch {
        setStory({})
        navigate("/not-found")
      }
    }
    getDetailStory()
  }, [slug, navigate])

  const handleLike = async () => {
    setTimeout(() => setLikeStatus(!likeStatus), 500)
    try {
      const { data } = await axios.post(
        `/story/${slug}/like`,
        { activeUser },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      setLikeCount(data.data.likeCount)
      setStoryLikeUser(data.data.likes)
    } catch {
      setStory({})
      localStorage.removeItem("authToken")
      navigate("/")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this post?")) {
      try {
        await axios.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")
      } catch (err) {
        console.log(err)
      }
    }
  }

  const editDate = (createdAt) => {
    const d = new Date(createdAt)
    return d.toLocaleString('en', { month: 'short' }) + " " + d.getDate()
  }

  const addStoryToReadList = async () => {
    try {
      const { data } = await axios.post(
        `/user/${slug}/addStoryToReadList`,
        { activeUser },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      setStoryReadListStatus(data.status)
      document.getElementById("readListLength").textContent = data.user.readListLength
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
          {/* Top Section */}
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center text-gray-400 hover:text-white">
                <FiArrowLeft className="mr-2" /> Back
              </Link>
              <h2 className="text-xl font-semibold">{story.title}</h2>
            </div>

            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center space-x-3">
                {story.author && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={`/userPhotos/${story.author.photo}`}
                      alt={story.author.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{story.author.username}</span>
                  </div>
                )}
                <span>{editDate(story.createdAt)}</span>
                <span>· {story.readtime} min read</span>
              </div>

              {activeUser && story.author && story.author._id === activeUser._id && (
                <div className="flex items-center space-x-4">
                  <Link to={`/story/${story.slug}/edit`} className="hover:text-indigo-500">
                    <FiEdit />
                  </Link>
                  <button onClick={handleDelete} className="hover:text-red-500">
                    <RiDeleteBin6Line />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Comments */}
          <CommentSidebar
            slug={slug}
            sidebarShowStatus={sidebarShowStatus}
            setSidebarShowStatus={setSidebarShowStatus}
            activeUser={activeUser}
          />

          {/* Story Content */}
          <div className="w-full max-w-3xl mt-6">
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={`/storyImages/${story.image}`}
                alt={story.title}
                className="w-full object-cover"
              />
            </div>
            <div
              className="prose prose-invert max-w-none text-gray-200"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </div>

          {/* Fixed Options */}
          {activeUser.username && (
            <div className="fixed bottom-6 right-6 bg-neutral-900 p-3 rounded-full shadow-lg flex space-x-5">
              <button onClick={handleLike} className="flex items-center space-x-1">
                {likeStatus ? <FaHeart className="text-blue-500" /> : <FaRegHeart />}
                <span
                  className={`text-sm ${
                    likeStatus ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {likeCount}
                </span>
              </button>

              <button onClick={() => setSidebarShowStatus(!sidebarShowStatus)} className="flex items-center space-x-1">
                <FaRegComment />
                <span className="text-sm text-gray-400">{story.commentCount}</span>
              </button>

              <button onClick={addStoryToReadList}>
                {storyReadListStatus ? (
                  <BsBookmarkFill className="text-indigo-500" />
                ) : (
                  <BsBookmarkPlus />
                )}
              </button>

              <div className="relative group">
                <BsThreeDots />
                {activeUser && story.author?._id === activeUser._id && (
                  <div className="absolute right-0 mt-2 bg-neutral-800 rounded-lg shadow-lg p-2 hidden group-hover:block">
                    <Link to={`/story/${story.slug}/edit`} className="block px-3 py-1 hover:bg-neutral-700 rounded">
                      Edit Story
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-3 py-1 hover:bg-neutral-700 rounded text-red-400"
                    >
                      Delete Story
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default DetailStory
