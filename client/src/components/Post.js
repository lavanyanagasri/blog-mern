import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

export default function Post() {
  const [postInfo, setPostInfo] = useState(null);
  const { userinfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`https://blog-mern-backend-zdm1.onrender.com/post/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Post not found");
        return response.json();
      })
      .then((data) => setPostInfo(data))
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  if (!postInfo) return <div className="text-center mt-10">Loading post...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{postInfo.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time> ·{" "}
        <span className="text-gray-600">by @{postInfo.author?.username}</span>
      </div>

      {userinfo?.id === postInfo.author?._id && (
        <div className="mb-4 flex justify-end">
          <Link
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            to={`/edit/${postInfo._id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 7.125L18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit
          </Link>
        </div>
      )}

      <div className="mb-6">
        <img
          className="w-full rounded-lg object-cover"
          src={`https://blog-mern-backend-zdm1.onrender.com/${postInfo.cover}`}
          alt="Post Cover"
        />
      </div>

      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
