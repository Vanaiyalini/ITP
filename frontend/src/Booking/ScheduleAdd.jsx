// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ScheduleAdd = () => {
//     const [formData, setFormData] = useState({
//         doctor: '',
//         slotDate: '',
//         start: '',
//         specialOption: ''
//     });

//     const [errors, setErrors] = useState({});
//     const [submitLoading, setSubmitLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const checkAuthStatus = () => {
//             const token = localStorage.getItem('authToken');
//             const userData = localStorage.getItem('userData');

//             if (!token || !userData) {
//                 toast.error('Please login to continue');
//                 navigate('/login');
//                 return;
//             }

//             try {
//                 const parsedUserData = JSON.parse(userData);
//                 if (!parsedUserData._id) {
//                     throw new Error('Invalid user data');
//                 }
//                 setIsAuthenticated(true);
//             } catch (e) {
//                 console.error('Auth check failed:', e);
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userData');
//                 toast.error('Session expired. Please login again.');
//                 navigate('/login');
//             }
//         };

//         checkAuthStatus();
//     }, [navigate]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const validateForm = () => {
//         let newErrors = {};
//         const today = new Date().toISOString().split('T')[0];

//         if (!formData.doctor.trim()) {
//             newErrors.doctor = "Doctor's name is required.";
//         }
//         if (!formData.slotDate) {
//             newErrors.slotDate = "Date is required.";
//         } else if (formData.slotDate < today) {
//             newErrors.slotDate = "Date cannot be in the past.";
//         }
//         if (!formData.start) {
//             newErrors.start = "Start time is required.";
//         }
//         if (!formData.specialOption.trim()) {
//             newErrors.specialOption = "Special option is required.";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         if (!validateForm()) return;

//         setSubmitLoading(true);
//         setError(null);

//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//                 throw new Error('No authentication token found');
//             }

//             const response = await axios.post(
//                 'http://localhost:4000/DoctorsController/Schedule',
//                 {
//                     doctor: formData.doctor,
//                     slotDate: formData.slotDate,
//                     start: formData.start,
//                     specialOption: formData.specialOption
//                     // userId will be added by backend from token
//                 },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (response.data.success) {
//                 toast.success('Slot added successfully!');
//                 navigate('/profile');
//             } else {
//                 throw new Error(response.data.message || 'Failed to add slot');
//             }
//         } catch (err) {
//             console.error('API Error:', {
//                 message: err.message,
//                 response: err.response?.data,
//                 status: err.response?.status
//             });

//             let errorMsg = 'Request failed';
//             if (err.response) {
//                 if (err.response.status === 403) {
//                     errorMsg = 'Session expired. Please login again.';
//                     localStorage.removeItem('authToken');
//                     localStorage.removeItem('userData');
//                     navigate('/login');
//                 } else {
//                     errorMsg = err.response.data?.message || err.message;
//                 }
//             }

//             setError(errorMsg);
//             toast.error(errorMsg);
//         } finally {
//             setSubmitLoading(false);
//         }
//     };

//     if (!isAuthenticated) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-lg">Verifying authentication...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto px-4 py-8 mt-10">
//                 <div className="flex flex-col lg:flex-row justify-center items-start gap-8 w-full max-w-6xl mx-auto pt-16">
//                     <div className="bg-white p-8 rounded-xl shadow-md w-full lg:w-1/2 max-w-lg border border-gray-100">
//                         <h1 className="text-center text-2xl font-bold text-[#007BFF] mb-6">Add Slot</h1>

//                         {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

//                         <form className="space-y-5" onSubmit={handleSubmit}>
//                             <div className="space-y-5">
//                                 <div>
//                                     <input
//                                         type="text"
//                                         placeholder="Doctor/Rep/Company-Name"
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
//                                         name="doctor"
//                                         value={formData.doctor}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.doctor && <p className="mt-1 text-red-500 text-sm">{errors.doctor}</p>}
//                                 </div>

//                                 <div>
//                                     <input
//                                         type="date"
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
//                                         name="slotDate"
//                                         value={formData.slotDate}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.slotDate && <p className="mt-1 text-red-500 text-sm">{errors.slotDate}</p>}
//                                 </div>

//                                 <div>
//                                     <input
//                                         type="time"
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
//                                         name="start"
//                                         value={formData.start}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.start && <p className="mt-1 text-red-500 text-sm">{errors.start}</p>}
//                                 </div>

//                                 <div>
//                                     <input
//                                         type="text"
//                                         placeholder="Special Option"
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
//                                         name="specialOption"
//                                         value={formData.specialOption}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.specialOption && <p className="mt-1 text-red-500 text-sm">{errors.specialOption}</p>}
//                                 </div>
//                             </div>

//                             <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
//                                 <button 
//                                     type="submit" 
//                                     className="w-full py-3 px-6 bg-[#007BFF] text-white rounded-lg hover:bg-[#0069d9] transition-colors font-medium"
//                                     disabled={submitLoading}
//                                 >
//                                     {submitLoading ? 'Processing...' : 'Confirm'}
//                                 </button>
//                                 <button 
//                                     type="button" 
//                                     className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                                     onClick={() => navigate('/Profile')}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ScheduleAdd;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScheduleAdd = () => {
    const [formData, setFormData] = useState({
        doctor: '',
        slotDate: '',
        start: '',
        specialOption: ''
    });

    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');

            if (!token || !userData) {
                toast.error('Please login to continue');
                navigate('/login');
                return;
            }

            try {
                const parsedUserData = JSON.parse(userData);
                if (!parsedUserData._id) {
                    throw new Error('Invalid user data');
                }
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Auth check failed:', e);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                toast.error('Session expired. Please login again.');
                navigate('/login');
            }
        };

        checkAuthStatus();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        const today = new Date().toISOString().split('T')[0];

        if (!formData.doctor.trim()) {
            newErrors.doctor = "Doctor's name is required.";
        }
        if (!formData.slotDate) {
            newErrors.slotDate = "Date is required.";
        } else if (formData.slotDate < today) {
            newErrors.slotDate = "Date cannot be in the past.";
        }
        if (!formData.start) {
            newErrors.start = "Start time is required.";
        }
        if (!formData.specialOption.trim()) {
            newErrors.specialOption = "Special option is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setSubmitLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                'http://localhost:4000/DoctorsController/Schedule',
                {
                    doctor: formData.doctor,
                    slotDate: formData.slotDate,
                    start: formData.start,
                    specialOption: formData.specialOption
                    // userId will be added by backend from token
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Slot added successfully!');
                navigate('/profile');
            } else {
                throw new Error(response.data.message || 'Failed to add slot');
            }
        } catch (err) {
            console.error('API Error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            let errorMsg = 'Request failed';
            if (err.response) {
                if (err.response.status === 403) {
                    errorMsg = 'Session expired. Please login again.';
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                } else {
                    errorMsg = err.response.data?.message || err.message;
                }
            }

            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg">Verifying authentication...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Schedule Appointment</h1>
                        <p className="mt-2 text-gray-600">Fill in the details to create a new time slot</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-red-600 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                                Doctor
                            </label>
                            <input
                                id="doctor"
                                type="text"
                                placeholder="Dr.Nikshan"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.doctor ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                            />
                            {errors.doctor && <p className="mt-2 text-sm text-red-600">{errors.doctor}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="slotDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Appointment Date
                                </label>
                                <input
                                    id="slotDate"
                                    type="date"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.slotDate ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                    name="slotDate"
                                    value={formData.slotDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.slotDate && <p className="mt-2 text-sm text-red-600">{errors.slotDate}</p>}
                            </div>

                            <div>
                                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                </label>
                                <input
                                    id="start"
                                    type="time"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.start ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                    name="start"
                                    value={formData.start}
                                    onChange={handleChange}
                                />
                                {errors.start && <p className="mt-2 text-sm text-red-600">{errors.start}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="specialOption" className="block text-sm font-medium text-gray-700 mb-1">
                                Special Requirements
                            </label>
                            <input
                                id="specialOption"
                                type="text"
                                placeholder="Any special instructions"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.specialOption ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                name="specialOption"
                                value={formData.specialOption}
                                onChange={handleChange}
                            />
                            {errors.specialOption && <p className="mt-2 text-sm text-red-600">{errors.specialOption}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/Profile')}
                                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${submitLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {submitLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Confirm Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ScheduleAdd;

