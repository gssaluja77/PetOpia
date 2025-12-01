import React, { useState } from "react";
import Modal from "react-modal";
import axios from "../../utils/axios";

const Prescriptions = ({
  prescriptions,
  addPrescription,
  deletePrescription,
  customStyles,
}) => {
  const [isOpenPres, setIsOpenPres] = useState(false);
  const [isHidden, setIsHidden] = useState(
    prescriptions && prescriptions.length > 0 ? false : true
  );
  const [presImg, setPresImg] = useState(null);
  const [uploading, setUploading] = useState(false);

  function showPres() {
    setIsOpenPres(!isOpenPres);
  }

  function toggleHidden() {
    setIsHidden(!isHidden);
  }

  function handleAddPres(e) {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("image", presImg);

    axios
      .post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data.url) {
          addPrescription(response.data.url);
        } else {
          console.log("Upload succeeded but no URL returned");
          alert("Upload failed");
        }
        setUploading(false);
        setIsOpenPres(false);
        setPresImg(null);
      })
      .catch((error) => {
        console.log("Upload failed", error);
        alert("Upload failed. Please try again.");
        setUploading(false);
        setPresImg(null);
      });
  }

  return (
    <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 w-full max-w-4xl">
      <div
        className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={toggleHidden}
      >
        <h2 className="text-xl font-bold text-gray-800">Prescriptions</h2>
        <span className="text-gray-500">{isHidden ? "▼" : "▲"}</span>
      </div>
      {!isHidden && (
        <div className="p-6">
          {prescriptions && prescriptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {prescriptions.map((val, index) => (
                <div key={index} className="relative group">
                  <a
                    href={typeof val === "string" ? val : val.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={typeof val === "string" ? val : val.imageUrl}
                      alt="Prescription"
                      className="w-full h-48 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                    />
                  </a>
                  <button
                    onClick={() =>
                      deletePrescription(
                        typeof val === "string" ? val : val.imageUrl
                      )
                    }
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 focus:outline-none"
                    title="Delete Prescription"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">
              No prescriptions recorded.
            </p>
          )}
          <button
            onClick={showPres}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Prescription
          </button>
        </div>
      )}

      <Modal isOpen={isOpenPres} onRequestClose={showPres} style={customStyles}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Add Prescription
        </h3>
        <form onSubmit={handleAddPres} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPresImg(e.target.files[0])}
              required
              className="w-full"
            />
          </div>
          {uploading ? (
            <div className="text-center text-indigo-600">Uploading...</div>
          ) : (
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Add
            </button>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default Prescriptions;
