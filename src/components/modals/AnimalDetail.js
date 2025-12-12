import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import noImage from "../../img/noImage.jpg";

//For react-modal
ReactModal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "800px",
    height: "85%",
    padding: "0",
    border: "none",
    borderRadius: "0.75rem",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

function AnimalDetail(props) {
  const [openModal, setOpenModal] = useState(props.isOpen);
  const [animal, setAnimal] = useState(props.animal);
  const [org, setOrg] = useState(null);
  const [token] = useState(props.token);

  const handleCloseModal = () => {
    setOpenModal(false);
    setAnimal(null);
    props.handleClose();
  };

  useEffect(() => {
    async function fetchData() {
      if (animal && animal.organization_id) {
        try {
          const response = await fetch(
            `https://api.petfinder.com/v2/organizations/${animal.organization_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setOrg(data.organization);
        } catch (error) {
          console.error("Error fetching organization:", error);
        }
      }
    }
    if (token && animal) {
      fetchData();
    }
  }, [token, animal]);

  if (!animal) return null;

  return (
    <ReactModal
      isOpen={openModal}
      onRequestClose={handleCloseModal}
      contentLabel="Animal Details"
      style={customStyles}
    >
      <div className="relative h-full flex flex-col bg-white">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors duration-200 shadow-sm backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="overflow-y-auto h-full">
          <div className="w-full h-64 sm:h-80 md:h-96 relative bg-gray-100">
            <img
              src={
                animal.photos && animal.photos[0]
                  ? animal.photos[0].full
                  : noImage
              }
              alt={animal.name}
              className="w-full h-full object-contain bg-gray-100"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-3xl font-bold text-white">{animal.name}</h2>
              <p className="text-white/90 font-medium">
                {animal.species && <span>{animal.species}</span>}
                {animal.gender && <span> • {animal.gender}</span>}
                {animal.breeds && animal.breeds.primary && (
                  <span> • {animal.breeds.primary}</span>
                )}
                {animal.breeds && animal.breeds.secondary && (
                  <span> x {animal.breeds.secondary}</span>
                )}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {animal.description && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Meet {animal.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {animal.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Attributes
                </h3>
                <dl className="space-y-2 text-sm">
                  {animal.coat && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Coat</dt>
                      <dd className="font-medium text-gray-900">
                        {animal.coat}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Declawed</dt>
                    <dd className="font-medium text-gray-900">
                      {animal.attributes && animal.attributes.declawed
                        ? "Yes"
                        : "No"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">House Trained</dt>
                    <dd className="font-medium text-gray-900">
                      {animal.attributes && animal.attributes.house_trained
                        ? "Yes"
                        : "No"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Vaccinations</dt>
                    <dd className="font-medium text-gray-900">
                      {animal.attributes && animal.attributes.shots_current
                        ? "Up to date"
                        : "Not Vaccinated"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Spayed / Neutered</dt>
                    <dd className="font-medium text-gray-900">
                      {animal.attributes && animal.attributes.spayed_neutered
                        ? "Yes"
                        : "No"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Contact Info
                </h3>
                {org && org.name && (
                  <div className="mb-3">
                    <span className="block text-xs text-gray-500 uppercase tracking-wide">
                      Shelter
                    </span>
                    <span className="font-medium text-gray-900">
                      {org.name}
                    </span>
                  </div>
                )}

                {animal.contact && animal.contact.address && (
                  <div className="mb-3">
                    <span className="block text-xs text-gray-500 uppercase tracking-wide">
                      Address
                    </span>
                    <span className="text-gray-700 text-sm">
                      {animal.contact.address.address1 && (
                        <span>{animal.contact.address.address1}, </span>
                      )}
                      {animal.contact.address.address2 && (
                        <span>{animal.contact.address.address2}, </span>
                      )}
                      {animal.contact.address.city && (
                        <span>{animal.contact.address.city}, </span>
                      )}
                      {animal.contact.address.state && (
                        <span>{animal.contact.address.state} </span>
                      )}
                      {animal.contact.address.postcode && (
                        <span>{animal.contact.address.postcode}</span>
                      )}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  {animal.contact && animal.contact.email && (
                    <div>
                      <span className="block text-xs text-gray-500 uppercase tracking-wide">
                        Email
                      </span>
                      <a
                        href={`mailto:${animal.contact.email}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium break-all"
                      >
                        {animal.contact.email}
                      </a>
                    </div>
                  )}
                  {animal.contact && animal.contact.phone && (
                    <div>
                      <span className="block text-xs text-gray-500 uppercase tracking-wide">
                        Phone
                      </span>
                      <a
                        href={`tel:${animal.contact.phone}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        {animal.contact.phone}
                      </a>
                    </div>
                  )}
                </div>

                {org && org.url && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <a
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                    >
                      More Info
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export default AnimalDetail;
