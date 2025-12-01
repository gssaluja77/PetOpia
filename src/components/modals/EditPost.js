import { useState } from "react";
import axios from "../../utils/axios";
import Modal from "react-modal";
import ErrorHandler from "../ErrorHandler";

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
  const userId = localStorage.getItem("userId");
  const [postImage, setPostImage] = useState("");
  const [postTitle, setPostTitle] = useState(props.oldDetails.postTitle);
  const [postDescription, setPostDescription] = useState(
    props.oldDetails.postDescription
  );
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [axiosLoading, setAxiosLoading] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [displayedError, setDisplayedError] = useState(null);
  const [isDescError, setIsDescError] = useState(null);
  const [displayedErrorForTitle, setDisplayedErrorForTitle] = useState(null);
  const [displayedErrorFordesc, setDisplayedErrorForDesc] = useState(null);

  const handleCheckBox = () => {
    setChecked(!checked);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0] && props.oldDetails.postImage) {
      setPostImage(event.target.files[0]);
      setChecked(false);
    } else if (event.target.files[0]) {
      setPostImage(event.target.files[0]);
    } else if (checked) {
      setPostImage("");
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

    if (postImage) {
      const formData = new FormData();
      formData.append("image", postImage);

      axios
        .post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          setPostImage(response.data.url);

          axios
            .put(`/community-posts/${props.oldDetails.postId}`, {
              userThatPosted: userId,
              postImage: response.data.url,
              postTitle: postTitle,
              postDescription: postDescription,
            })
            .then(() => {
              setAxiosLoading(false);
              setServerError(false);
              setPostImage("");
              setPostTitle("");
              setPostDescription("");
              handleCloseModal();
              setChecked(false);
            })
            .catch((error) => {
              setAxiosLoading(false);
              setServerError(true);
              setDisplayedError(error.response.data);
            });
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .put(`/community-posts/${props.oldDetails.postId}`, {
          userThatPosted: userId,
          postImage: checked ? "" : props.oldDetails.postImage,
          postTitle: postTitle,
          postDescription: postDescription,
        })
        .then(() => {
          setAxiosLoading(false);
          setServerError(false);
          setPostImage("");
          setPostTitle("");
          setPostDescription("");
          handleCloseModal();
          setChecked(false);
        })
        .catch((error) => {
          setAxiosLoading(false);
          setServerError(true);
          setDisplayedError(error.response.data);
        });
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    props.handleChange();
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
          <div>
            <label
              htmlFor="post-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change Picture
            </label>
            <input
              id="post-image"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={checked}
            />
          </div>

          {props.oldDetails.postImage && (
            <div className="flex items-center">
              <input
                id="remove-pic"
                type="checkbox"
                checked={checked}
                onChange={handleCheckBox}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remove-pic"
                className="ml-2 block text-sm text-gray-900"
              >
                Remove Picture
              </label>
            </div>
          )}

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

          {serverError && <ErrorHandler error={displayedError} />}

          <div className="pt-4">
            {axiosLoading ? (
              <div className="text-center text-indigo-600 font-medium">
                Updating...
              </div>
            ) : (
              <button
                type="submit"
                disabled={isError || isDescError}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out ${
                  isError || isDescError ? "opacity-50 cursor-not-allowed" : ""
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
