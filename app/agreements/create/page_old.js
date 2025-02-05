'use client';

import { useState } from 'react';
import { PencilIcon } from "@heroicons/react/24/outline"; // Heroicons Pen Icon
import { formatNumber } from '@/utils/numberFormatter'; // Utility function for masking
// import { API_ROUTES } from '@/utils/apiRoutes';

export default function Agreements({ isEdit = false, agreementData = {} }) {
    const [formData, setFormData] = useState({
        flight_date: agreementData.flight_date || '',
        duration_of_stay: agreementData.duration_of_stay || '',
        client_name: agreementData.client_name || '',
        client_relatives: agreementData.client_relatives || '', // Client relatives
        tariff_name: agreementData.tariff_name || '',
        room_type: agreementData.room_type || 'DOUBLE',
        transportation: agreementData.transportation || '',
        exchange_rate: agreementData.exchange_rate || 12950,
        total_price: agreementData.total_price || '',
        payment_paid: agreementData.payment_paid || '',
        phone_numbers: agreementData.phone_numbers || [''], // Default to one empty number
        responsible_user_id: agreementData.responsible_user_id || '',
        created_by: agreementData.created_by || '',
        previous_agreement_taken_away: agreementData.previous_agreement_taken_away || false,
        comments: agreementData.comments || '',
    });

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
        ];
      
        // Check if any required field is empty
        for (const field of requiredFields) {
          if (!formData[field]?.toString().trim()) {
            return `${field.replace('_', ' ')} is required`; // Return error message for the first invalid field
          }
        }
      
        // Ensure at least one phone number is provided
        if (formData.phone_numbers.every((number) => !number.trim())) {
          return 'At least one phone number is required.';
        }
      
        return null; // No errors
    };
      
      
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
      if (!value?.toString().trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: `${name.replace('_', ' ')} shart!` }));
      } else {
        setErrors((prevErrors) => {
          const { [name]: removed, ...rest } = prevErrors; // Remove error for the valid field
          return rest;
        });
      }
    };

  const [loading, setLoading] = useState(false);
  const [isExchangeEditable, setIsExchangeEditable] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
  
    setFormData({ ...formData, [name]: fieldValue });
  
    // Validate the field immediately
    validateField(name, fieldValue);
  };

  const handleExchangeRateEdit = () => {
    setIsExchangeEditable(true);
  };

  const handleExchangeRateChange = (e) => {
    let value = e.target.value;
  
    // Remove invalid characters (anything that's not a digit or dot)
    value = value.replace(/[^0-9.]/g, '');
  
    // Allow only one dot in the input
    const parts = value.split('.');
    if (parts.length > 2) {
      value = `${parts[0]}.${parts[1]}`; // Keep only the first dot
    }
  
    // Limit to 2 decimal places if a dot exists
    if (parts[1]?.length > 2) {
      value = `${parts[0]}.${parts[1].substring(0, 2)}`;
    }
  
    // Update the formData state
    setFormData({ ...formData, exchange_rate: value });
  };
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage); // Display the validation error
      return; // Prevent submission
    }
  
    setLoading(true);
  
    try {
      // Prepare the request payload
      const payload = {
        flight_date: formData.flight_date,
        duration_of_stay: formData.duration_of_stay,
        client_name: formData.client_name,
        client_relatives: formData.client_relatives, // Optional
        tariff_name: formData.tariff_name,
        room_type: formData.room_type,
        transportation: formData.transportation,
        exchange_rate: parseFloat(formData.exchange_rate), // Ensure it's a number
        total_price: parseFloat(formData.total_price),
        payment_paid: parseFloat(formData.payment_paid),
        phone_numbers: formData.phone_numbers.filter((num) => num.trim()), // Remove empty numbers
        comments: formData.comments, // Optional
      };
  
      // Send the POST request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agreements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.split('token=')[1]}`, // Include token if required
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create agreement. Please try again.');
      }
  
      const data = await response.json();
  
      alert('Agreement created successfully!');
  
      // Reset the form or redirect as needed
      setFormData({
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
        comments: '',
      });
    } catch (error) {
      console.error('Error creating agreement:', error);
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">
          {isEdit ? `Shartnomani o'zgartirish` : 'Shartnoma yaratish'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Show this field only in Edit Mode */}
          {isEdit && (
            <div className="flex items-center">
              <label htmlFor="previous_agreement_taken_away" className="mr-4 dark:text-white">
                Previous Agreement Taken Away:
              </label>
              <input
                type="checkbox"
                id="previous_agreement_taken_away"
                name="previous_agreement_taken_away"
                checked={formData.previous_agreement_taken_away}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-500 dark:bg-gray-800 dark:border-gray-700"
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
              value={formData.flight_date}
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
