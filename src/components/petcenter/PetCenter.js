import axios from "../../utils/axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/hooks/useAuth";
import { useRefresh } from "../../utils/hooks/useRefresh";

Modal.setAppElement("#root");

const PetCenter = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [getMyPets, setMyPets] = useState([]);
  const [isOpenPet, setIsOpenPet] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [isOpenEmptyError, setIsOpenEmptyError] = useState(false);
  const [petImage, setPetImage] = useState("");
  const [axiosLoading, setAxiosLoading] = useState(null);
  const { refreshTriggers, triggerRefresh } = useRefresh();

  useEffect(() => {
    async function getPets() {
      try {
        const response = await axios.get(`/account/pets/${userId}`);
        setMyPets(response.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
    getPets();
  }, [userId, refreshTriggers.pets]);

  function showPet() {
    setIsOpenPet(!isOpenPet);
  }

  const handleImageChange = (e) => {
    setPetImage(e.target.files[0]);
  };

  function showError() {
    setAxiosLoading(false);
    setIsOpenError(!isOpenError);
  }

  function showEmptyError() {
    setAxiosLoading(false);
    setIsOpenEmptyError(!isOpenEmptyError);
  }

  function addPet(e) {
    e.preventDefault();
    setAxiosLoading(true);
    const data = new FormData(e.target);
    const formJson = Object.fromEntries(data.entries());
    let petName = formJson.petName;
    let petAge = formJson.petAge;
    let petType = formJson.petType;
    let petBreed = formJson.petBreed;

    if (!petName || !petAge || !petType || !petBreed || !Number(petAge)) {
      showEmptyError();
    } else if (
      petName.trim().length === 0 ||
      petAge.trim().length === 0 ||
      petType.trim().length === 0 ||
      petBreed.trim().length === 0
    ) {
      showError();
    } else if (petAge > 150) {
      showError();
    } else {
      const savePet = async (imageUrl) => {
        try {
          await axios.post(`/account/pets/${userId}`, {
            petImage: imageUrl,
            petName: petName,
            petAge: petAge,
            petType: petType,
            petBreed: petBreed,
          });

          setPetImage(null);
          setAxiosLoading(false);
          setIsOpenPet(!isOpenPet);
          setLoading(false);
          triggerRefresh('pets');
        } catch (e) {
          console.log(e);
          setAxiosLoading(false);
        }
      };

      if (petImage) {
        const formData = new FormData();
        formData.append("image", petImage);
        axios
          .post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            savePet(response.data.url);
          })
          .catch((error) => {
            console.log("Upload failed", error);
            setAxiosLoading(false);
            showError();
          });
      } else {
        savePet(null);
      }
    }
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "500px",
      width: "90%",
      padding: "2rem",
      borderRadius: "0.75rem",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  const buildCard = (pet) => {
    return (
      <div
        key={pet._id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
      >
        <Link
          to={`/account/my-pet-info/${pet._id}`}
          className="block flex-grow"
        >
          {pet.petImage ? (
            <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden">
              <img
                src={pet.petImage}
                alt={pet.petName}
                className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="h-64 w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-5xl">🐾</span>
            </div>
          )}
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {pet.petName}
            </h3>
          </div>
        </Link>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-600">Loading...</h2>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Your Pet Center
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Manage your pets' health and wellness in one place.
          </p>
          <button
            onClick={() => showPet()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition duration-150 ease-in-out flex items-center mx-auto text-lg"
          >
            <span className="mr-2 text-2xl">+</span> Add Pet
          </button>
        </div>

        {getMyPets.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {getMyPets.map((pet) => buildCard(pet))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl p-4 text-gray-600">No pets added yet!</h2>
            <p className="text-gray-500 p-4 mt-2">
              Click the "Add Pet" button to get started.
            </p>
          </div>
        )}

        <Modal
          isOpen={isOpenPet}
          onRequestClose={showPet}
          contentLabel="Add Pet Dialog"
          style={customStyles}
        >
          <div className="relative">
            <button
              onClick={showPet}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600"
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add your Pet
            </h3>
            <form onSubmit={addPet} className="space-y-4">
              <div>
                <label
                  htmlFor="petImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image
                </label>
                <input
                  onChange={handleImageChange}
                  type="file"
                  id="petImage"
                  name="petImage"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              <div>
                <label
                  htmlFor="petName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  placeholder="Ex: Tommy"
                  type="text"
                  id="petName"
                  name="petName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="petAge"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age (in years)
                </label>
                <input
                  placeholder="Ex: 1.5"
                  min={0}
                  step={0.1}
                  type="number"
                  id="petAge"
                  name="petAge"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="petType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type
                </label>
                <input
                  placeholder="Ex: Dog"
                  type="text"
                  id="petType"
                  name="petType"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="petBreed"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Breed
                </label>
                <input
                  placeholder="Ex: Husky"
                  type="text"
                  id="petBreed"
                  name="petBreed"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="pt-4">
                {axiosLoading ? (
                  <div className="text-center text-indigo-600 font-medium">
                    Uploading...
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                  >
                    Add Pet
                  </button>
                )}
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          isOpen={isOpenError}
          onRequestClose={showError}
          style={customStyles}
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">Invalid Input!</h3>
            <button
              onClick={showError}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={isOpenEmptyError}
          onRequestClose={showEmptyError}
          style={customStyles}
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">
              Input cannot be empty!
            </h3>
            <button
              onClick={showEmptyError}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    );
  }
};

export default PetCenter;
