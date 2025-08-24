import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { BsThreeDots, BsBookmarkFill } from 'react-icons/bs'

const ReadListStoryItem = ({ story, editDate }) => {
  const truncateContent = (content) => {
    const trimmedString = content.substr(0, 130)
    return trimmedString
  }

  return (
    <div className="flex items-start justify-between bg-gray-900 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-5 mb-6">
      {/* Left Content */}
      <section className="flex-1 pr-4">
        {/* Top block */}
        <div className="flex items-center text-sm text-gray-400 mb-2 space-x-2">
          <span className="font-semibold text-gray-300">{story.author.username}</span>
          <span>•</span>
          <span>{editDate(story.createdAt)}</span>
          <AiFillStar className="text-yellow-400 ml-1" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold hover:text-yellow-400 transition">
          <a href={`/story/${story.slug}`}>{story.title}</a>
        </h2>

        {/* Content Preview */}
        <p
          className="text-gray-300 mt-2 text-sm line-clamp-3"
          dangerouslySetInnerHTML={{ __html: truncateContent(story.content) + "..." }}
        ></p>

        {/* Bottom Block */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <a
            href={`/story/${story.slug}`}
            className="flex items-center gap-2 hover:text-yellow-400 transition"
          >
            <span>Read More</span>
            <span>•</span>
            <span>{story.readtime} min read</span>
          </a>

          <div className="flex items-center gap-3 text-lg">
            <BsBookmarkFill className="cursor-pointer hover:text-yellow-400" />
            <BsThreeDots className="cursor-pointer hover:text-yellow-400" />
          </div>
        </div>
      </section>

      {/* Right Image */}
      <section className="w-40 h-28 flex-shrink-0">
        <img
          src={`/storyImages/${story.image}`}
          alt={story.title}
          className="w-full h-full object-cover rounded-xl"
        />
      </section>
    </div>
  )
}

export default ReadListStoryItem
