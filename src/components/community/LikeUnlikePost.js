import { useState } from "react";
import axios from "../../api/axios";

const LikeUnlikePost = (props) => {
  const userId = localStorage.getItem("userId");
  const [liked, setLiked] = useState(props.post.postLikes.includes(userId));
  const [likesCount, setLikesCount] = useState(props.post.postLikes.length);

  const handleLike = () => {
    // Optimistically updating UI
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      axios
        .post(`/likes/${props.post._id}`, { userThatPosted: userId })
        .catch((error) => {
          // Reverting on error
          setLiked(false);
          setLikesCount((prev) => prev - 1);
          console.log(error);
        });
    } else {
      axios.delete(`/likes/${props.post._id}/${userId}`).catch((error) => {
        // Reverting on error
        setLiked(true);
        setLikesCount((prev) => prev + 1);
        console.log(error);
      });
    }
  };

  return liked ? (
    <button
      onClick={handleLike}
      className={`${props.className} text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center space-x-1`}
      aria-label="Unlike post"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
      </svg>
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  ) : (
    <button
      onClick={handleLike}
      className={`${props.className} text-gray-500 hover:text-indigo-600 transition-colors duration-200 flex items-center space-x-1`}
      aria-label="Like post"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
        />
      </svg>
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeUnlikePost;
