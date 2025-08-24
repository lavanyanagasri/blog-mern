import React, { useRef, useContext, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { AuthContext } from "../../Context/AuthContext"
import { AiOutlineUpload } from 'react-icons/ai'
import { FiArrowLeft } from 'react-icons/fi'

const AddStory = () => {
  const { config } = useContext(AuthContext)
  const imageEl = useRef(null)
  const editorEl = useRef(null)
  const [image, setImage] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const clearInputs = () => {
    setTitle('')
    setContent('')
    setImage('')
    editorEl.current.editor.setData('')
    imageEl.current.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append("title", title)
    formdata.append("image", image)
    formdata.append("content", content)

    try {
      const { data } = await axios.post("/story/addstory", formdata, config)
      setSuccess('Story published successfully!')
      clearInputs()
      setTimeout(() => setSuccess(''), 7000)
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong")
      setTimeout(() => setError(''), 7000)
    }
  }

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-neutral-900 p-6 rounded-2xl shadow-lg text-white">
        <Link to="/" className="flex items-center text-gray-300 hover:text-white mb-4">
          <FiArrowLeft className="mr-2" /> Back
        </Link>

        {error && <div className="mb-3 p-3 rounded bg-red-600">{error}</div>}
        {success && (
          <div className="mb-3 p-3 rounded bg-green-600 flex justify-between items-center">
            <span>{success}</span>
            <Link to="/" className="underline ml-4">Go home</Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            required
            placeholder="Title"
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
            <CKEditor
              editor={ClassicEditor}
              onChange={(e, editor) => setContent(editor.getData())}
              ref={editorEl}
            />
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:border-indigo-500 transition">
            <AiOutlineUpload className="text-3xl mb-2 text-gray-400" />
            <p className="text-sm text-gray-400">
              {image ? image.name : "Upload a high-quality image for your story"}
            </p>
            <input
              type="file"
              className="hidden"
              ref={imageEl}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={!image}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              image
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddStory
