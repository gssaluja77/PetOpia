import React, { useState } from "react";
import axios from "../../utils/axios";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
    padding: "2rem",
    borderRadius: "0.75rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

function DeleteComment(props) {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [axiosLoading, setAxiosLoading] = useState(null);

  const handleCloseModal = () => {
    setIsOpen(false);
    props.handleCommentDeleteModalClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAxiosLoading(true);
    axios
      .delete(`/view-post/${props.postId}/${props.commentId}`)
      .then(() => {
        setAxiosLoading(false);
        handleCloseModal();
      })
      .catch((error) => {
        console.log(error);
        setAxiosLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Delete Comment Modal"
      style={customStyles}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Confirm delete comment?
        </h3>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>

        <form onSubmit={handleSubmit} className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-150"
          >
            No, Cancel
          </button>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 flex items-center"
            disabled={axiosLoading}
          >
            {axiosLoading ? "Deleting..." : "Yes, Delete"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default DeleteComment;
