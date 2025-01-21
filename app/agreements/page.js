'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ROUTES } from '@/utils/apiRoutes';

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState({}); // Track expanded comments

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ROUTES.AGREEMENTS, {
        headers: {
          Authorization: `Bearer ${document.cookie.split('token=')[1]}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setAgreements(data);
    } catch (error) {
      console.error('Error fetching agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCommentExpansion = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Agreements</h1>
      <Link
        href="/agreements/create"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Agreement
      </Link>

      {/* Table Wrapper for Responsive Design */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left border-b dark:border-gray-700">Reys</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Mijoz</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Mijoz yaqinlari</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Paket/Tariff</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Necha kunga</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Xona turi</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Transport</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Valyuta kursi</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Umumiy Narxi</th>
              <th className="p-3 text-left border-b dark:border-gray-700">To'lov</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Telefon raqamlar</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Kommentariya</th>
              <th className="p-3 text-left border-b dark:border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {agreements.map((agreement) => (
              <tr
                key={agreement.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.flight_date}
                </td>
                <td
                  className="p-3 border-b dark:border-gray-700 truncate max-w-[200px]"
                  title={agreement.client_name}
                >
                  {agreement.client_name}
                </td>
                <td
                  className="p-3 border-b dark:border-gray-700 truncate max-w-[200px]"
                  title={agreement.client_relatives}
                >
                  {agreement.client_relatives}
                </td>
                <td
                  className="p-3 border-b dark:border-gray-700 truncate max-w-[200px]"
                  title={agreement.tariff_name}
                >
                  {agreement.tariff_name}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.duration_of_stay}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.room_type}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.transportation}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.exchange_rate}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.total_price}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.payment_paid}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {agreement.phone_numbers.join(', ')}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  {expandedComments[agreement.id] ? (
                    <>
                      {agreement.comments}{' '}
                      <button
                        onClick={() => toggleCommentExpansion(agreement.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Show Less
                      </button>
                    </>
                  ) : (
                    <>
                      {agreement.comments?.length > 50
                        ? `${agreement.comments.slice(0, 50)}...`
                        : agreement.comments}
                      {agreement.comments?.length > 50 && (
                        <button
                          onClick={() => toggleCommentExpansion(agreement.id)}
                          className="text-blue-500 hover:underline"
                        >
                          Read More
                        </button>
                      )}
                    </>
                  )}
                </td>
                <td className="p-3 border-b dark:border-gray-700">
                  <Link
                    href={`/agreements/edit/${agreement.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p>Loading agreements...</p>}
    </div>
  );
}
