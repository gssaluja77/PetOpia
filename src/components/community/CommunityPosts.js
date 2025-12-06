import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import NewPost from "../modals/NewPost";
import LikeUnlikePost from "./LikeUnlikePost";
import SearchPosts from "./SearchPosts";
import ErrorHandler from "../ErrorHandler";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { useAuth } from "../../utils/hooks/useAuth";
import { useRefresh } from "../../utils/hooks/useRefresh";

function CommunityPosts() {
  const { userId } = useAuth();
  const [firstPage, setFirstPage] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allPostsData, setAllPostsData] = useState([]);
  const [myPostsData, setMyPostsData] = useState([]);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [postType, setPostType] = useState("allPosts");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery);
  const { refreshTriggers, triggerRefresh } = useRefresh();

  useEffect(() => {
    const getPostsData = async () => {
      try {
        const response = await axios.get(
          `/community-posts?page=${currentPage}&keyword=${debouncedSearchQuery}`
        );
        const { allPostsData, allPosts, numberOfDocs, limit } =
          response.data.allData;

        if (debouncedSearchQuery) {
          const { searchedData } = response.data;
          setSearchedData(searchedData);
        } else {
          setAllPostsData(allPosts);
          const postsByUser = allPostsData.filter((post) => {
            return post.userThatPosted === userId;
          });
          setMyPostsData(postsByUser);

          setFirstPage(currentPage === 1);
          const totalPages = Math.ceil(numberOfDocs / limit);
          setLastPage(currentPage >= totalPages);
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    getPostsData();
  }, [currentPage, debouncedSearchQuery, userId, refreshTriggers.communityPosts]);

  const handleNewModalOpen = () => {
    setNewModalOpen(true);
  };

  const handleNewModalClose = () => {
    setNewModalOpen(false);
  };

  const buildCard = (post) => {
    return (
      <div
        key={post._id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
      >
        <Link
          to={`/account/community-posts/${post._id}`}
          className="block relative"
        >
          {post.postImage ? (
            <div className="h-48 w-full overflow-hidden">
              <img
                src={post.postImage}
                alt={post.postTitle}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">📝</span>
            </div>
          )}
        </Link>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                {post.userThatPosted === userId
                  ? "You"
                  : post.username.length > 13
                    ? post.username.slice(0, 13) + "..."
                    : post.username}
              </span>
              <span className="mx-1">•</span>
              <span>{post.postDate}</span>
            </div>
            <LikeUnlikePost
              className="like-button"
              post={post}
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
            {post.postTitle}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {post.postDescription}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">{post.postTime}</span>
            <Link
              to={`/account/community-posts/${post._id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Read more &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const handleDropdown = (event) => {
    if (event.target.value === "option1") {
      setPostType("allPosts");
    } else if (event.target.value === "option2") {
      setPostType("myPosts");
    }
  };

  const searchValue = (value) => {
    setSearchQuery(value.toLowerCase());
  };

  const next = () => {
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    setCurrentPage(currentPage - 1);
  };

  let cards = null;
  if (debouncedSearchQuery) {
    cards = searchedData.length ? (
      searchedData.map((post) => buildCard(post))
    ) : (
      <div className="col-span-full text-center py10">
        <h2 className="text-xl text-gray-600">No posts found!</h2>
      </div>
    );
  } else {
    if (postType === "allPosts") {
      cards = allPostsData.length ? (
        allPostsData.map((post) => buildCard(post))
      ) : (
        <div className="col-span-full text-center py10">
          <h2 className="text-xl text-gray-600">No community posts yet!</h2>
        </div>
      );
    } else if (postType === "myPosts") {
      cards = myPostsData.length ? (
        myPostsData.map((post) => buildCard(post))
      ) : (
        <div className="col-span-full text-center py10">
          <h2 className="text-xl text-gray-600">You haven't posted yet!</h2>
        </div>
      );
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-600">Loading...</h2>
      </div>
    );
  }

  if (!allPostsData || !myPostsData) {
    return (
      <ErrorHandler
        error={
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ERROR 500: Internal Server Error!
            </h1>
            <p className="text-gray-500 mt-2">
              Please try again later.
            </p>
          </div>
        }
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          PetOpia Community
        </h1>
        <p className="text-gray-600">
          Connect with other pet owners and share your stories.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              onChange={handleDropdown}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="option1">All Posts</option>
              <option value="option2">My Posts</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => handleNewModalOpen()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition duration-150 ease-in-out"
          >
            <span className="mr-2 text-xl">+</span>
            New Post
          </button>
        </div>

        <div className="w-full md:w-auto">
          <SearchPosts searchValue={searchValue} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {cards}
      </div>

      {!debouncedSearchQuery && postType === "allPosts" && (
        <div className="flex justify-center space-x-4 mt-8">
          {!firstPage && (
            <button
              onClick={prev}
              className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-150"
            >
              &larr; Previous
            </button>
          )}
          {!lastPage && (
            <button
              onClick={next}
              className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-150"
            >
              Next &rarr;
            </button>
          )}
        </div>
      )}

      {newModalOpen && (
        <NewPost
          handleNewModalClose={handleNewModalClose}
          isOpen={newModalOpen}
          onSuccess={() => triggerRefresh('communityPosts')}
        />
      )}
    </div>
  );
}

export default CommunityPosts;
