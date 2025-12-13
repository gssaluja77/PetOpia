import { useState } from "react";
import axios from "../../utils/axios";
import Modal from "react-modal";
import { useAuth } from "../../utils/hooks/useAuth";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "600px",
    padding: "2rem",
    borderRadius: "0.75rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

function EditPost(props) {
  const { userId } = useAuth();
  const [postImage, setPostImage] = useState(null);
  const [postTitle, setPostTitle] = useState(props.oldDetails.postTitle);
  const [postDescription, setPostDescription] = useState(
    props.oldDetails.postDescription
  );
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [axiosLoading, setAxiosLoading] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [displayedError, setDisplayedError] = useState(null);
  const [isDescError, setIsDescError] = useState(null);
  const [displayedErrorForTitle, setDisplayedErrorForTitle] = useState(null);
  const [displayedErrorFordesc, setDisplayedErrorForDesc] = useState(null);

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setPostImage(null);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setPostImage(event.target.files[0]);
      setRemoveImage(false);
    }
  };

  const handleTitleChange = (event) => {
    if (!event.target.value.trim().length) {
      setIsError(true);
      setDisplayedErrorForTitle("Title can't be empty!");
    } else if (event.target.value.length > 30) {
      setIsError(true);
      setDisplayedErrorForTitle(
        "Post title cannot contain more than 30 characters!"
      );
    } else {
      setIsError(false);
      setDisplayedErrorForTitle(null);
    }
    setPostTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    if (!event.target.value.trim().length) {
      setIsDescError(true);
      setDisplayedErrorForDesc("Description can't be empty!");
    } else {
      setIsDescError(false);
      setDisplayedErrorForDesc(null);
    }
    setPostDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isError || isDescError) return;

    setAxiosLoading(true);
    setIsError(false);
    setIsDescError(false);

    try {
      let imageUrl = null;

      if (removeImage) {
        imageUrl = null;
      } else if (postImage && typeof postImage === 'object' && postImage instanceof File) {
        const formData = new FormData();
        formData.append("image", postImage);

        const uploadResponse = await axios.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResponse.data.url;
      } else {
        imageUrl = props.oldDetails.postImage;
      }

      await axios.put(`/account/community-posts/${props.oldDetails.postId}`, {
        userThatPosted: userId,
        postImage: imageUrl,
        postTitle: postTitle,
        postDescription: postDescription,
      });

      setPostImage(null);
      setPostTitle("");
      setPostDescription("");
      handleCloseModal();
      setAxiosLoading(false);
      if (props.onSuccess) props.onSuccess();
    } catch (error) {
      setAxiosLoading(false);
      if (error.response?.data) {
        setServerError(true);
        setDisplayedError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    props.handleEditModalClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Edit Post Modal"
      style={customStyles}
    >
      <div className="relative">
        <button
          onClick={handleCloseModal}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {props.oldDetails.postImage && !removeImage && !postImage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Picture
              </label>
              <div className="relative inline-block">
                <img
                  src={props.oldDetails.postImage}
                  alt="Current post"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md"
                  title="Remove picture"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="post-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {removeImage
                ? "Picture will be removed"
                : postImage
                  ? "New Picture Selected"
                  : "Upload New Picture"}
            </label>
            {!removeImage && (
              <input
                id="post-image"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
            {removeImage && (
              <button
                type="button"
                onClick={() => setRemoveImage(false)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Keep current picture
              </button>
            )}
          </div>

          <div>
            <label
              htmlFor="post-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change Title
            </label>
            <input
              id="post-title"
              placeholder="Headline of your post..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              value={postTitle}
              onChange={handleTitleChange}
              required
            />
            {isError && (
              <div className="mt-1 text-sm text-red-600">
                {displayedErrorForTitle}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="post-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change Description
            </label>
            <textarea
              id="post-description"
              placeholder="Describe what your post is about..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={postDescription}
              onChange={handleDescriptionChange}
              required
            />
            {isDescError && (
              <div className="mt-1 text-sm text-red-600">
                {displayedErrorFordesc}
              </div>
            )}
          </div>

          {serverError && (
            <div className="text-red-600 text-sm text-center mt-2">
              {displayedError}
            </div>
          )}

          <div className="pt-4">
            {axiosLoading ? (
              <div className="text-center text-indigo-600 font-medium">
                Updating...
              </div>
            ) : (
              <button
                type="submit"
                disabled={isError || isDescError}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out ${isError || isDescError ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default EditPost;
