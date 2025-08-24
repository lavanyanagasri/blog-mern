import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from "../StoryScreens/CardStory";
import NoStories from "../StoryScreens/NoStories";
import Pagination from "./Pagination";

import FlickeringGridDemo from "../ui/FlickeringGridDemo";

const Home = () => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get("search");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const getStories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/story/getAllStories?search=${searchKey || ""}&page=${page}`
        );

        if (searchKey) {
          navigate({
            pathname: "/",
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        } else {
          navigate({
            pathname: "/",
            search: `${page > 1 ? `page=${page}` : ""}`,
          });
        }

        setStories(data.data);
        setPages(data.pages);
        setLoading(false);
      } catch (error) {
        setLoading(true);
      }
    };
    getStories();
  }, [setLoading, search, page, navigate]);

  useEffect(() => {
    setPage(1);
  }, [searchKey]);

  return (
  <div className="min-h-screen bg-black text-white px-6 py-8">
    {/* ✅ FlickeringGrid Section */}
    <div className="mb-10">
      <FlickeringGridDemo />
    </div>

    {loading ? (
      <div className="flex flex-col gap-6">
        {[...Array(6)].map(() => (
          <SkeletonStory key={uuidv4()} />
        ))}
      </div>
    ) : (
      <div>
        <div className="flex flex-col gap-6">
          {stories.length !== 0 ? (
            stories.map((story) => (
              <CardStory key={uuidv4()} story={story} />
            ))
          ) : (
            <div className="flex justify-center items-center py-20">
              <NoStories />
            </div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="mt-8 flex justify-center">
          <Pagination page={page} pages={pages} changePage={setPage} />
        </div>
      </div>
    )}
  </div>
);

};

export default Home;
