import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, Link } from "react-router-dom";
import "../../App.css";
import EditPost from "../modals/EditPost";
import DeletePost from "../modals/DeletePost";
import DeleteComment from "../modals/DeleteComment";
import NewPost from "../modals/NewPost";
import LikeUnlikePost from "./LikeUnlikePost";
import LikeUnlikeComment from "./LikeUnlikeComment";
import ErrorHandler from "../ErrorHandler";

function ViewPost() {
  const userId = window.localStorage.getItem("userid");
  let userEmail = window.localStorage.getItem("userEmail");
  const [viewPost, setViewPost] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null); // Track specific comment
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [comments, setComments] = useState(undefined);
  const [displayedError, setDisplayedError] = useState(null);
  const [isError, setIsError] = useState(null);
  let { postId } = useParams();
  let comment;

  useEffect(() => {
    const getPostsAndComments = async () => {
      try {
        const response = await axios.get(`/community-posts/${postId}`);
        setViewPost(response.data);
        setComments(response.data.postComments);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setViewPost(undefined);
        setLoading(false);
        setDisplayedError("Post not found");
      }
    };
    getPostsAndComments();
    // eslint-disable-next-line
  }, [postId, count]);

  const handleChange = () => {
    setCount(count + 1);
  };

  const handleCommentChange = (event) => {
    if (!event.target.value.trim().length) {
      setIsError(true);
      setDisplayedError("Comment can't be empty!");
      document.querySelector("#post-comment").disabled = true;
    }
    else {
      setIsError(false);
      setDisplayedError(null);
      document.querySelector("#post-comment").disabled = false;
    }
  }

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handlePostDeleteModalOpen = () => {
    setDeletePostModalOpen(true);
  };

  const handlePostDeleteModalClose = () => {
    setDeletePostModalOpen(false);
  };

  const handleCommentDeleteModalOpen = (commentId) => {
    setCommentToDelete(commentId); // Store which comment to delete
  };

  const handleCommentDeleteModalClose = () => {
    setCommentToDelete(null); // Clear the comment to delete
  };

  const handleNewModalOpen = () => {
    setNewModalOpen(true);
  };

  const handleNewModalClose = () => {
    setNewModalOpen(false);
  };

  const handleCommentAdded = async (event) => {
    event.preventDefault();
    setIsError(false);
    document.querySelector("#post-comment").disabled = true;
    const data = new FormData(event.target);
    const formJson = Object.fromEntries(data.entries());
    let commentInput = formJson["comment-box"];
    axios
      .post(`/view-post/${postId}`, {
        userThatPosted: userId,
        comment: commentInput,
        userEmail: userEmail,
      })
      .then(() => {
        setCount(count + 1);
        document.getElementById("comment-box").value = "";
        document.querySelector("#post-comment").disabled = false;
      })
      .catch((error) => {
        setDisplayedError(error.response.data);
        document.getElementById("comment-box").value = "";
      });
  };

  const buildCard = () => {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8 border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">{viewPost.postTitle}</h2>
        </div>

        {viewPost.postImage && (
          <img
            className="w-full h-auto object-cover max-h-96"
            src={viewPost.postImage}
            alt={viewPost.postTitle}
          />
        )}

        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-gray-600 border-b border-gray-100 pb-2">
              <span className="font-semibold">Posted By:</span>
              <span>{viewPost && viewPost.userEmail.substring(0, viewPost.userEmail.indexOf("@"))}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 border-b border-gray-100 pb-2">
              <span className="font-semibold">Posted On:</span>
              <span>{viewPost && `${viewPost.postDate} at ${viewPost.postTime}`}</span>
            </div>

            <div className="py-2">
              <span className="font-semibold text-gray-700 block mb-1">Description:</span>
              <p className="text-gray-600">{viewPost && viewPost.postDescription}</p>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Found it useful?</span>
              <LikeUnlikePost
                className="like-button"
                countFunction={handleChange}
                post={viewPost}
              />
              <span className="text-sm text-gray-500">
                {viewPost.postLikes.length !== 0 &&
                  (viewPost.postLikes.length === 1
                    ? "like"
                    : "likes")}
              </span>
            </div>

            {viewPost.userThatPosted === userId && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleEditModalOpen}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={handlePostDeleteModalOpen}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {editModalOpen && (
            <EditPost
              handleEditModalClose={handleEditModalClose}
              isOpen={editModalOpen}
              handleChange={handleChange}
              oldDetails={{
                postId: postId,
                postImage: viewPost.postImage,
                postTitle: viewPost.postTitle,
                postDescription: viewPost.postDescription,
              }}
            />
          )}
          {deletePostModalOpen && (
            <DeletePost
              handlePostDeleteModalClose={handlePostDeleteModalClose}
              isOpen={deletePostModalOpen}
              handleChange={handleChange}
              postId={postId}
            />
          )}
        </div>

        <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Comment Section</h3>

          <form onSubmit={handleCommentAdded} className="mb-6">
            <div className="flex space-x-3">
              <input
                onChange={handleCommentChange}
                id="comment-box"
                name="comment-box"
                placeholder="Write a comment..."
                type="text"
                autoComplete="off"
                required
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                id="post-comment"
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 text-sm font-medium whitespace-nowrap"
              >
                Post
              </button>
            </div>
          </form>

          {isError && <ErrorHandler error={displayedError} />}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {comment && comment.length ? comment : <p className="text-gray-500 text-center py-4">No Comments Posted!</p>}
          </div>
        </div>
      </div>
    );
  };

  const buildComment = (com) => {
    return (
      <div key={com._id} className="border-b border-gray-100 last:border-0 py-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-gray-800">
                {com.userEmail.substring(0, com.userEmail.indexOf("@"))}
              </span>
              <span className="text-xs text-gray-500">
                {com.commentDate}, {com.commentTime}
              </span>
            </div>
            <p className="text-gray-700 mb-2">{com.comment}</p>
            <div className="flex items-center space-x-2">
              <LikeUnlikeComment countFunction={handleChange} commentObj={com} />
              <span className="text-xs text-gray-500">
                {com.commentLikes.length !== 0 &&
                  (com.commentLikes.length === 1
                    ? "like"
                    : "likes")}
              </span>
            </div>
          </div>

          {com.userEmail === userEmail && (
            <button
              onClick={() => handleCommentDeleteModalOpen(com._id)} // Pass comment ID
              className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

  comment =
    comments &&
    comments.map((com) => {
      return buildComment(com);
    });

  // Render delete modal outside the map, only for the selected comment
  const renderDeleteCommentModal = () => {
    if (!commentToDelete) return null;

    return (
      <DeleteComment
        handleCommentDeleteModalClose={handleCommentDeleteModalClose}
        isOpen={true}
        handleChange={handleChange}
        postId={postId}
        commentId={commentToDelete}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-600">Loading...</h2>
      </div>
    );
  }
  else if (viewPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <Link to={`/account/community-posts`}>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150 font-medium">
              Back to Community
            </button>
          </Link>
          <button onClick={handleNewModalOpen} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 font-medium">
            New Post
          </button>
        </div>

        {buildCard()}

        {renderDeleteCommentModal()} {/* Render delete modal for selected comment */}

        {newModalOpen && (
          <NewPost
            handleNewModalClose={handleNewModalClose}
            isOpen={newModalOpen}
            handleChange={handleChange}
          />
        )}
      </div>
    )
  }
  else if (displayedError) {
    return (
      <ErrorHandler error={
        <div className="text-center py10">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{displayedError}</h1>
          <Link to={`/account/community-posts`}>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 font-medium">
              Back to Community
            </button>
          </Link>
        </div>}
      />
    )
  }
}

export default ViewPost;
