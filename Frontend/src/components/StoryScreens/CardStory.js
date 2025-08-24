import React from "react";
import { Link } from "react-router-dom";

const Story = ({ story }) => {
  const editDate = (createdAt) => {
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const d = new Date(createdAt);
    return `${d.getDate()} ${monthNames[d.getMonth()]} , ${d.getFullYear()}`;
  };

  const truncateContent = (content) => content.substr(0, 100);
  const truncateTitle = (title) => title.substr(0, 80);

  return (
    <div className="flex bg-gray-900 text-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden w-full max-w-3xl mx-auto mb-6">
      {/* Image */}
      <div className="w-1/3 h-40 overflow-hidden">
        <img
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          src={`/storyImages/${story.image}`}
          alt={story.title}
        />
      </div>

      {/* Content */}
      <div className="w-2/3 p-4 flex flex-col justify-between">
        {/* Title */}
        <Link to={`/story/${story.slug}`}>
          <h5 className="text-lg font-semibold hover:text-blue-400">
            {story.title.length > 80
              ? truncateTitle(story.title) + "..."
              : story.title}
          </h5>
        </Link>

        {/* Description */}
        <p
          className="text-sm text-gray-400 mt-2 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: truncateContent(story.content) + "...",
          }}
        />

        {/* Date */}
        <p className="text-xs text-gray-500 mt-3">{editDate(story.createdAt)}</p>
      </div>
    </div>
  );
};

export default Story;
