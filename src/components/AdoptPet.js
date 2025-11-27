import { useState, useEffect } from "react";
import AnimalDetail from "./modals/AnimalDetail";
import noImage from "../img/noImage.jpg";
import ErrorHandler from "./ErrorHandler";

function AdoptPet() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [maxPage, setMaxPage] = useState(null);
  const [error, setError] = useState(null);
  const [animal, setAnimal] = useState(null);
  const clientId = "mR1WfUgThjt5RpjyZuTHIHMf5BC0SzUbTuJjJnSyJZiRodfiPA";
  const clientSecret = "dep3PivKfHYkOfGRYbrkwD2EefMrogmngnPjdomZ";

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch(
          "https://api.petfinder.com/v2/oauth2/token",
          {
            method: "POST",
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const t = await response.json();
        setToken(t.access_token);
      } catch (e) {
        console.error("Error fetching token:", e);
      }
    }
    fetchToken();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await fetch(`https://api.petfinder.com/v2/animals?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 401) {
            console.error("Unauthorized access to PetFinder API");
          }
          setMaxPage(response.pagination ? response.pagination.total_pages : 1);
          setData(response.animals);
          setError(null);
        })
        .catch((error) => setError(error.message));
    }
    if (token) {
      fetchData();
    }
  }, [token, page]);

  const handleOpenModal = (event) => {
    setOpenModal(true);
    setAnimal(event);
  };
  const handleCloseModals = () => {
    setOpenModal(false);
  };

  const handlePrevios = () => {
    setPage(page - 1);
  };
  const handleNext = () => {
    setPage(page + 1);
  };

  const buildCard = (event) => {
    const characterists = event.tags.map((tag) => {
      return `${tag} `;
    });

    return (
      <div
        key={event.id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full max-w-sm mx-auto w-full cursor-pointer group"
        onClick={() => handleOpenModal(event)}
      >
        <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden relative bg-gray-100">
          <img
            src={
              event.photos && event.photos[0] ? event.photos[0].large : noImage
            }
            alt={event.name}
            className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-white font-medium px-4 py-2 border border-white rounded-full text-sm">
              View Details
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
            {event.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {event.age && <span>{event.age}</span>}
            {event.gender && <span> • {event.gender}</span>}
            {event.breeds.primary && <span> • {event.breeds.primary}</span>}
          </p>

          {characterists.length > 0 && (
            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-center flex-wrap gap-2">
              {characterists.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return <ErrorHandler error={error}></ErrorHandler>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Adopt a Pet
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find your new best friend. Browse through thousands of adoptable pets
          from shelters and rescues.
        </p>
      </div>

      <div className="flex justify-center items-center mb-8 gap-4">
        <button
          onClick={() => handlePrevios()}
          disabled={page <= 1}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition duration-150 ${
            page <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
          }`}
        >
          &larr; Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} {maxPage && `of ${maxPage}`}
        </span>

        <button
          onClick={() => handleNext()}
          disabled={page >= maxPage}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition duration-150 ${
            page >= maxPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
          }`}
        >
          Next &rarr;
        </button>
      </div>

      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {data.map((event) => buildCard(event))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      <div className="flex justify-center mt-12 mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => handlePrevios()}
            disabled={page <= 1}
            className={`px-4 py-2 rounded-md font-medium transition duration-150 ${
              page <= 1
                ? "hidden"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            &larr; Previous Page
          </button>
          <button
            onClick={() => handleNext()}
            disabled={page >= maxPage}
            className={`px-4 py-2 rounded-md font-medium transition duration-150 ${
              page >= maxPage
                ? "hidden"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            Next Page &rarr;
          </button>
        </div>
      </div>

      {openModal && (
        <AnimalDetail
          isOpen={openModal}
          handleClose={handleCloseModals}
          animal={animal}
          token={token}
        />
      )}
    </div>
  );
}

export default AdoptPet;
