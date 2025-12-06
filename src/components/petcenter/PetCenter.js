import axios from "../../utils/axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate, useParams } from "react-router-dom";
import Medications from "./Medications";
import Appointments from "./Appointments";
import Prescriptions from "./Prescriptions";
import { useAuth } from "../../utils/hooks/useAuth";
import { useRefresh } from "../../utils/hooks/useRefresh";
import ErrorHandler from "../ErrorHandler";

Modal.setAppElement("#root");

const PetCenterHome = () => {
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
            <p className="text-base text-gray-500">
              {pet.petBreed} • {pet.petAge} years
            </p>
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

const PetInfo = () => {
  const { userId } = useAuth();

  let [loading, setLoading] = useState(true);
  let [getMyPets, setMyPets] = useState(undefined);
  const [isOpenEditPet, setIsOpenEditPet] = useState(false);
  const [isOpenDelPet, setIsOpenDelPet] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isOpenEmptyError, setIsOpenEmptyError] = useState(false);
  const [petImageFile, setPetImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [axiosLoading, setAxiosLoading] = useState(false);

  const { petId } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    async function getPets() {
      try {
        const response = await axios.get(
          `/account/pets/mypet/${userId}/${petId}`
        );
        setMyPets(response.data);
        setLoading(false);
      } catch (error) {
        setErrorMsg("Error fetching pet info");
        setMyPets(undefined);
        setLoading(false);
      }
    }
    getPets();
  }, [petId, userId]);

  function showEditPet() {
    setIsOpenEditPet(!isOpenEditPet);
  }

  function showDelPet() {
    setIsOpenDelPet(!isOpenDelPet);
  }

  function showError() {
    setIsOpenError(!isOpenError);
  }

  function showEmptyError() {
    setIsOpenEmptyError(!isOpenEmptyError);
  }

  const handleImageChange = (e) => {
    setPetImageFile(e.target.files[0]);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setPetImageFile(null);
  };

  function addMed(medData) {
    let medicationName = medData.medicationName;
    let administeredDate = medData.administeredDate;
    let dosage = medData.dosage;

    if (
      !medicationName ||
      !administeredDate ||
      !dosage ||
      !Date.parse(administeredDate)
    ) {
      showEmptyError();
    } else if (
      medicationName.trim().length === 0 ||
      administeredDate.trim().length === 0 ||
      dosage.trim().length === 0
    ) {
      showError();
    } else {
      async function addMedication() {
        try {
          const response = await axios.post(`/account/pets/medication`, {
            userId: userId,
            petId: petId,
            medicationName: medicationName,
            administeredDate: administeredDate,
            dosage: dosage,
          });
          setMyPets(response.data);
        } catch (e) {
          console.log(e);
        }
      }
      addMedication();
    }
  }

  function addApp(appData) {
    let appointmentDate = appData.appointmentDate;
    let reason = appData.reason;
    let clinicName = appData.clinicName;

    if (
      !appointmentDate ||
      !reason ||
      !clinicName ||
      !Date.parse(appointmentDate)
    ) {
      showEmptyError();
    } else if (
      appointmentDate.trim().length === 0 ||
      reason.trim().length === 0 ||
      clinicName.trim().length === 0
    ) {
      showError();
    } else {
      async function addAppointment() {
        try {
          const response = await axios.post(`/account/pets/appointment`, {
            userId: userId,
            petId: petId,
            appointmentDate: appointmentDate,
            reason: reason,
            clinicName: clinicName,
          });
          setMyPets(response.data);
        } catch (e) {
          console.log(e);
        }
      }
      addAppointment();
    }
  }

  async function addPres(url) {
    try {
      const response = await axios.post(`/account/pets/prescription`, {
        userId: userId,
        petId: petId,
        imageUrl: url,
      });
      setMyPets(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteMed(val) {
    try {
      const response = await axios.delete(`/account/pets/medication`, {
        data: {
          userId: userId,
          petId: petId,
          medId: val._id,
        },
      });
      setMyPets(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteApp(val) {
    try {
      const response = await axios.delete(`/account/pets/appointment`, {
        data: {
          userId: userId,
          petId: petId,
          appId: val._id,
        },
      });
      setMyPets(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function deletePres(imageUrl) {
    try {
      const response = await axios.delete(`/account/pets/prescription`, {
        data: {
          userId: userId,
          petId: petId,
          imageUrl: imageUrl,
        },
      });
      setMyPets(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  function editPet(e) {
    e.preventDefault();
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
    } else {
      setAxiosLoading(true);

      const savePetUpdate = async (imageUrl) => {
        try {
          const response = await axios.put(`/account/pets/${userId}`, {
            petId: petId,
            petName: petName,
            petAge: petAge,
            petType: petType,
            petBreed: petBreed,
            petImage: imageUrl,
          });
          setMyPets(response.data);
          setIsOpenEditPet(!isOpenEditPet);
          setAxiosLoading(false);
          setPetImageFile(null);
          setRemoveImage(false);
        } catch (e) {
          console.log(e);
          setAxiosLoading(false);
        }
      };

      if (removeImage) {
        savePetUpdate(null);
      } else if (petImageFile) {
        const formData = new FormData();
        formData.append("image", petImageFile);
        axios
          .post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            savePetUpdate(response.data.url);
          })
          .catch((error) => {
            console.log("Upload failed", error);
            setAxiosLoading(false);
            showError();
          });
      } else {
        savePetUpdate(undefined);
      }
    }
  }

  async function delPet(e) {
    e.preventDefault();
    try {
      await axios.delete(`/account/pets/${userId}`, {
        data: {
          petId: petId,
        },
      });
      navigate("/account/my-pets");
    } catch (e) {
      console.log(e);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-600">Loading...</h2>
      </div>
    );
  } else if (getMyPets) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link to={`/account/my-pets`}>
            <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              &larr; Back to Pet Center
            </button>
          </Link>
          <div className="space-x-2">
            <button
              onClick={() => showEditPet()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition duration-150"
            >
              Edit
            </button>
            <button
              onClick={() => showDelPet()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition duration-150"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {getMyPets.petImage && (
                <div className="w-full md:w-1/3">
                  <img
                    src={getMyPets.petImage}
                    alt={getMyPets.petName}
                    className="w-full h-auto rounded-lg shadow-md object-cover"
                  />
                </div>
              )}
              <div className="w-full md:w-2/3">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                  {getMyPets.petName}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider">
                      Age
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {getMyPets.petAge} years
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider">
                      Type
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {getMyPets.petType}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider">
                      Breed
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {getMyPets.petBreed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Medications
          medications={getMyPets.medications}
          addMedication={addMed}
          deleteMedication={deleteMed}
          customStyles={customStyles}
        />

        <Appointments
          appointments={getMyPets.appointments}
          addAppointment={addApp}
          deleteAppointment={deleteApp}
          customStyles={customStyles}
        />

        <Prescriptions
          prescriptions={getMyPets.prescription}
          addPrescription={addPres}
          deletePrescription={deletePres}
          customStyles={customStyles}
        />

        <Modal
          isOpen={isOpenEditPet}
          onRequestClose={showEditPet}
          style={customStyles}
        >
          <div className="relative">
            <button
              onClick={showEditPet}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Pet</h3>
            <form onSubmit={editPet} className="space-y-4">
              {/* Current Photo Section */}
              {getMyPets.petImage && !removeImage && !petImageFile && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Photo
                  </label>
                  <div className="relative inline-block">
                    <img
                      src={getMyPets.petImage}
                      alt={getMyPets.petName}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md"
                      title="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Photo Upload Section */}
              <div>
                <label
                  htmlFor="petImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {removeImage
                    ? "Photo will be removed"
                    : petImageFile
                      ? "New Photo Selected"
                      : "Upload New Photo"}
                </label>
                {!removeImage && (
                  <input
                    onChange={handleImageChange}
                    type="file"
                    id="petImage"
                    name="petImage"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                )}
                {removeImage && (
                  <button
                    type="button"
                    onClick={() => setRemoveImage(false)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Keep current photo
                  </button>
                )}
              </div>

              <div>
                <label
                  htmlFor="petName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  defaultValue={getMyPets.petName}
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
                  defaultValue={getMyPets.petAge}
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
                  defaultValue={getMyPets.petType}
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
                  defaultValue={getMyPets.petBreed}
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
                    Save Changes
                  </button>
                )}
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          isOpen={isOpenDelPet}
          onRequestClose={showDelPet}
          style={customStyles}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Delete Pet?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {getMyPets.petName}? This action
              cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={showDelPet}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={delPet}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isOpenError}
          onRequestClose={showError}
          style={customStyles}
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">
              Input cannot be empty
            </h3>
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
            <h3 className="text-lg font-medium text-red-600">Invalid Input</h3>
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
  } else if (errorMsg) {
    return (
      <ErrorHandler
        error={
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Pet not found!
            </h1>
            <div className="flex justify-center">
              <Link to={`/account/my-pets`}>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  &larr; Back to Pet Center
                </button>
              </Link>
            </div>
          </div>
        }
      />
    );
  } else {
    return null;
  }
};

export { PetCenterHome, PetInfo };
