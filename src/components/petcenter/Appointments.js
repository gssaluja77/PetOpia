import React, { useState } from "react";
import Modal from "react-modal";

const Appointments = ({ appointments, addAppointment, deleteAppointment, customStyles }) => {
  const [isOpenApp, setIsOpenApp] = useState(false);
  const [isHidden, setIsHidden] = useState(appointments && appointments.length > 0 ? false : true);

  function showApp() {
    setIsOpenApp(!isOpenApp);
  }

  function toggleHidden() {
    setIsHidden(!isHidden);
  }

  function handleAddApp(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const formJson = Object.fromEntries(data.entries());
    addAppointment(formJson);
    setIsOpenApp(false);
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;
  const maxDate = `${yyyy + 1}-${mm}-${dd}`;

  return (
    <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 w-full max-w-4xl">
      <div
        className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={toggleHidden}
      >
        <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
        <span className="text-gray-500">{isHidden ? "▼" : "▲"}</span>
      </div>
      {!isHidden && (
        <div className="p-6">
          {appointments && appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clinic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((val) => (
                    <tr key={val._id || val.appointmentDate}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {val.clinicName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {val.appointmentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {val.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => deleteAppointment(val)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">
              No appointments recorded.
            </p>
          )}
          <button
            onClick={showApp}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Appointment
          </button>
        </div>
      )}

      <Modal isOpen={isOpenApp} onRequestClose={showApp} style={customStyles}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Add Appointment
        </h3>
        <form onSubmit={handleAddApp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="appointmentDate"
              min={minDate}
              max={maxDate}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              name="reason"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinic
            </label>
            <input
              type="text"
              name="clinicName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
