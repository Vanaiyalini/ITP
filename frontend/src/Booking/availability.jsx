import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Availability = () => {
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({
    doctorName: '',
    date: ''
  });

  useEffect(() => {
    const fetchSlots = async () => {
        try {
            const response = await axios.get('http://localhost:4000/DoctorsController/getslot');
            setSlots(response.data.data || response.data); 
            setLoading(false);
        } catch (err) {
            console.error("Error fetching slots:", err);
            setError("Failed to load available slots");
            setLoading(false);
        }
    };
    fetchSlots();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      doctorName: '',
      date: ''
    };

    if (!doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required';
      valid = false;
    }

    if (!date) {
      newErrors.date = 'Date is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/DoctorsController/getslot', {
        params: {
          doctor: doctorName,
          date: date
        }
      });
      setSlots(response.data.data || response.data);
      setError('');
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search slots");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const filteredSlots = slots.filter(slot => {
    const matchesDoctor = doctorName ? 
      slot.doctor.toLowerCase().includes(doctorName.toLowerCase()) : true;
    const matchesDate = date ? slot.slotDate === date : true;
    return matchesDoctor && matchesDate;
  });

  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    if (!acc[slot.doctor]) {
      acc[slot.doctor] = [];
    }
    acc[slot.doctor].push(slot);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center pt-12 pb-12">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="mt-4 text-3xl font-bold text-blue-800">DOCTOR AVAILABILITY</h1>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-[900px]">
        <div className="bg-blue-800 rounded-xl p-4 shadow-lg w-full mx-auto">
          <div className="flex flex-wrap items-end gap-6">
            <fieldset className="fieldset bg-transparent rounded-lg p-4 flex-1 min-w-[250px]">
              <legend className="fieldset-legend px-2 text-sm font-medium text-gray-200">Doctor name</legend>
              <input 
                type="text" 
                className={`input mt-1 block w-full rounded-md border-gray-300 shadow-sm hover:border-gray-600 focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white ${
                  errors.doctorName ? 'border-red-500' : ''
                }`} 
                placeholder="Search Doctor name"
                value={doctorName}
                onChange={(e) => {
                  setDoctorName(e.target.value);
                  if (errors.doctorName) {
                    setErrors({...errors, doctorName: ''});
                  }
                }}
              />
              {errors.doctorName && (
                <p className="mt-1 text-sm text-red-300">{errors.doctorName}</p>
              )}
            </fieldset>

            <fieldset className="fieldset bg-transparent rounded-lg p-4 flex-1 min-w-[250px]">
              <legend className="fieldset-legend px-2 text-sm font-medium text-gray-200">Date</legend>
              <div className="relative">
                <input 
                  type="date" 
                  className={`input mt-1 block w-full rounded-md border-gray-300 shadow-sm hover:border-gray-600 focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white text-gray-700 appearance-none ${
                    errors.date ? 'border-red-500' : ''
                  }`} 
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) {
                      setErrors({...errors, date: ''});
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-300">{errors.date}</p>
                )}
              </div>
            </fieldset>

            <div className="min-w-[250px] p-4">
              <button 
                type="submit"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors h-[42px] w-full"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-red-500">{error}</div>
      )}

      {loading ? (
        <div className="mt-8 text-blue-800">Loading available slots...</div>
      ) : (
        <div className="mt-8 max-w-[900px] w-full mx-auto space-y-6">
          {Object.entries(groupedSlots).map(([doctorName, doctorSlots]) => {
            const firstSlot = doctorSlots[0];
            return (
              <div key={doctorName} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-4xl font-bold">
                      {doctorName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-blue-800">{doctorName}</h2>
                    <p className="text-blue-600 font-medium">{firstSlot.specialOption}</p>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-700">Available Time Slots</h3>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {doctorSlots.map((slot, index) => (
                          <div key={index} className="bg-gray-100 rounded-md p-2 text-center">
                            {formatTime(slot.start)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Link to='/booking'>
                      <button className="mt-6 bg-blue-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Book Appointment
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Availability;