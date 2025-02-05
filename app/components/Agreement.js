'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { PencilIcon } from '@heroicons/react/24/outline'; // Heroicons Pen Icon
import { formatNumber } from '@/utils/numberFormatter'; // Utility for formatting numbers
import { API_ROUTES } from '@/utils/apiRoutes'; // Centralized API routes
import { useAuth } from '@/hooks/useAuth';

export default function AgreementForm({ isEdit = false, agreementId = null }) {
  const { user } =  useAuth(); // Fetch roles from useAuth
  
  let isAdminOrManager
  
  if (user) {
    isAdminOrManager = user.roles.some(role => ['Admin', 'Manager'].includes(role.name));
  }
  

  const [formData, setFormData] = useState({
    flight_date: '',
    duration_of_stay: '',
    client_name: '',
    client_relatives: '',
    tariff_name: '',
    room_type: 'DOUBLE',
    transportation: '',
    exchange_rate: 12950,
    total_price: '',
    payment_paid: '',
    phone_numbers: [''],
    responsible_user_id: null,
    previous_agreement_taken_away: isEdit ? false : null,
    comments: '',
  });
  const [userOptions, setUserOptions] = useState([]); // List of available users
  const [loading, setLoading] = useState(false);
  const [isExchangeEditable, setIsExchangeEditable] = useState(false);
  const [errors, setErrors] = useState({});

  // console.log(isEdit);
  
  // Fetch existing agreement data if in edit mode
  useEffect(() => {
    if (isEdit && agreementId) {
      fetchAgreementData();
    }
    fetchUsers();
  }, [isEdit, agreementId]);

    // Fetch available users for the responsible user dropdown
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_ROUTES.USERS, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${document.cookie.split('token=')[1]}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        // Map user data to react-select options
        const options = data.map(user => ({
          value: user.id,
          label: user.name,
        }));
        setUserOptions(options);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

  const fetchAgreementData = async () => {
    
    try {
      const response = await fetch(API_ROUTES.AGREEMENT_DETAIL(agreementId), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.split('token=')[1]}`
        }});
      if (!response.ok) throw new Error('Failed to fetch agreement data');
      const data = await response.json();
      
      setFormData(data.data);
    } catch (error) {
      console.error('Error fetching agreement:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'flight_date',
      'duration_of_stay',
      'client_name',
      'tariff_name',
      'room_type',
      'transportation',
      'exchange_rate',
      'total_price',
      'payment_paid',
      'responsible_user_id',
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.toString().trim()) {
        return `${field.replace('_', ' ')} is required.`;
      }
    }

    if (formData.phone_numbers.every((number) => !number.trim())) {
      return 'At least one phone number is required.';
    }

    return null;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleUserChange = (selectedOption) => {
    setFormData({
      ...formData,
      responsible_user_id: selectedOption ? selectedOption.value : null,
    });
  };

  const handleExchangeRateEdit = () => {
    setIsExchangeEditable(true);
  };

  const handleExchangeRateChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) value = `${parts[0]}.${parts[1]}`;
    if (parts[1]?.length > 2) value = `${parts[0]}.${parts[1].substring(0, 2)}`;
    setFormData({ ...formData, exchange_rate: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, responsible_user_id: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setLoading(true);

    try {
      const method = isEdit ? 'PUT' : 'POST';
      
      const url = isEdit
      ? API_ROUTES.AGREEMENT_DETAIL(agreementId)
      : API_ROUTES.AGREEMENTS;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.split('token=')[1]}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to submit agreement');

      const data = await response.json();
      alert(`Agreement ${isEdit ? 'updated' : 'created'} successfully!`);
      
    } catch (error) {
      console.error('Error submitting agreement:', error);
      alert(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">
            {isEdit ? 'Edit Agreement' : 'Create Agreement'}
          </h1>
          {/* Responsible User Dropdown */}
          <div className="w-1/3">
            <label htmlFor="responsible_user_id" className="block text-sm font-medium dark:text-white">
              Responsible User
            </label>
            
              <Select
                id="responsible_user_id"
                instanceId="responsible-user-select"
                options={userOptions}
                value={console.log(formData)}
                  // formData ? (userOptions.find(option => option.value === formData.responsible_user_id.id) || null) : NULL}
                isDisabled={isEdit && (isAdminOrManager === null ? true : !isAdminOrManager)} // Disable for non-Admin/Manager in edit mode
                onChange={handleSelectChange}
                placeholder="Select a responsible user"
                className="dark:text-black"
              />
            
            {errors.responsible_user_id && (
              <p className="text-red-500 text-sm mt-1">{errors.responsible_user_id}</p>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {isEdit && (
            <div>
              <label htmlFor="previous_agreement_taken_away">
                Previous Agreement Taken Away:
              </label>
              <input
                type="checkbox"
                id="previous_agreement_taken_away"
                name="previous_agreement_taken_away"
                checked={!!formData.previous_agreement_taken_away}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Flight Date */}
          <div>
            <label htmlFor="flight_date" className="block text-sm font-medium dark:text-white">
              Reys
            </label>
            <input
              type="date"
              id="flight_date"
              name="flight_date"
              value={formData.flight_date ?? ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
            {errors.flight_date && <p className="text-red-500 text-sm mt-1">{errors.flight_date}</p>}
          </div>

          {/* Duration of Stay */}
          <div>
            <label htmlFor="duration_of_stay" className="block text-sm font-medium dark:text-white">
              Necha kunga
            </label>
            <input
              type="number"
              id="duration_of_stay"
              name="duration_of_stay"
              value={formData.duration_of_stay}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
            {errors.duration_of_stay && <p className="text-red-500 text-sm mt-1">{errors.duration_of_stay}</p>}
          </div>

          {/* Client Name */}
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium dark:text-white">
              Mijoz
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
            {errors.client_name && <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>}
          </div>

          {/* Client relatives */}
          <div>
            <label htmlFor="client_relatives" className="block text-sm font-medium dark:text-white">
                Mijoz yaqinlari
            </label>
            <input
                type="text"
                id="client_relatives"
                name="client_relatives"
                value={formData.client_relatives}
                onChange={(e) => setFormData({ ...formData, client_relatives: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Tariff Name */}
          <div>
            <label htmlFor="tariff_name" className="block text-sm font-medium dark:text-white">
              Paket yoki Tarif nomi
            </label>
            <input
              type="text"
              id="tariff_name"
              name="tariff_name"
              value={formData.tariff_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
            {errors.tariff_name && <p className="text-red-500 text-sm mt-1">{errors.tariff_name}</p>}
          </div>

          {/* Room Type */}
          {/* Room Type Dropdown */}
          <div>
            <label htmlFor="room_type" className="block text-sm font-medium dark:text-white">
              Xona turi
            </label>
            <select
              id="room_type"
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="DOUBLE">DOUBLE</option>
              <option value="TRIPLE">TRIPLE</option>
              <option value="QUAD">QUAD</option>
            </select>
            {errors.room_type && <p className="text-red-500 text-sm mt-1">{errors.room_type}</p>}
          </div>

          {/* Transportation */}
          <div>
            <label htmlFor="transportation" className="block text-sm font-medium dark:text-white">
              Transport
            </label>
            <input
              type="text"
              id="transportation"
              name="transportation"
              value={formData.transportation}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
            {errors.transportation && <p className="text-red-500 text-sm mt-1">{errors.transportation}</p>}
          </div>

          {/* Exchange Rate with Masking */}
          <div>
            <label htmlFor="exchange_rate" className="block text-sm font-medium dark:text-white">
                Valyuta kursi (USD/UZS)
            </label>
            <div className="flex items-center">
                <input
                type="text"
                id="exchange_rate"
                name="exchange_rate"
                value={
                    isExchangeEditable
                    ? formData.exchange_rate // Raw value during editing
                    : `${formatNumber(formData.exchange_rate || '0')}` // Masked when non-editable
                }
                onChange={handleExchangeRateChange}
                onBlur={() => setIsExchangeEditable(false)} // Revert to non-editable on blur
                className={`w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    isExchangeEditable ? '' : 'cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                }`}
                readOnly={!isExchangeEditable} // Make it read-only if not editable
                />
                <PencilIcon
                onClick={() => setIsExchangeEditable(true)} // Make the field editable on click
                className="h-5 w-5 text-blue-500 ml-2 cursor-pointer"
                />
            </div>
            {errors.exchange_rate && <p className="text-red-500 text-sm mt-1">{errors.exchange_rate}</p>}
        </div>



          {/* Total Price */}
          <div>
            <label htmlFor="total_price" className="block text-sm font-medium dark:text-white">
              Umumiy Narxi
            </label>
            <input
              type="number"
              step="0.01"
              id="total_price"
              name="total_price"
              value={formData.total_price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
            {errors.total_price && <p className="text-red-500 text-sm mt-1">{errors.total_price}</p>}
          </div>

          {/* Payment Paid */}
          <div>
            <label htmlFor="payment_paid" className="block text-sm font-medium dark:text-white">
              To'lov
            </label>
            <input
              type="number"
              step="0.01"
              id="payment_paid"
              name="payment_paid"
              value={formData.payment_paid}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
            {errors.payment_paid && <p className="text-red-500 text-sm mt-1">{errors.payment_paid}</p>}
          </div>


          {/* Phone Numbers */}
          <div>
            <label htmlFor="phone_numbers" className="block text-sm font-medium dark:text-white">
                Telefon raqam <span className="text-red-500">*</span>
            </label>
            {formData.phone_numbers.map((number, index) => (
                <div key={index} className="flex items-center mb-2">
                <input
                    type="text"
                    value={number}
                    onChange={(e) => {
                    const updatedNumbers = [...formData.phone_numbers];
                    updatedNumbers[index] = e.target.value;
                    setFormData({ ...formData, phone_numbers: updatedNumbers });
                    }}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                />
                {formData.phone_numbers.length > 1 && (
                    <button
                    type="button"
                    onClick={() => {
                        const updatedNumbers = formData.phone_numbers.filter((_, i) => i !== index);
                        setFormData({ ...formData, phone_numbers: updatedNumbers });
                    }}
                    className="ml-2 text-red-500 hover:underline"
                    >
                    O'chirish
                    </button>
                )}
                </div>
            ))}
            <button
                type="button"
                onClick={() => setFormData({ ...formData, phone_numbers: [...formData.phone_numbers, ''] })}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                Telefon raqam qo'shish
            </button>
            {/* Error message if all phone numbers are empty */}
            {formData.phone_numbers.every((number) => !number.trim()) && (
                <p className="text-red-500 text-sm mt-2">Kamida 1 dona telefon raqam shart.</p>
            )}
            </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium dark:text-white">
              Kommentariya
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : isEdit ? (
              `Shartnomani o'zgartirish`
            ) : (
              'Shartnoma yaratish'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
