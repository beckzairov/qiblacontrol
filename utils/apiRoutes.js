const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ROUTES = {
  TEST: `${BASE_URL}/api/test`,
  LOGIN: `${BASE_URL}/api/login`,
  REGISTER: `${BASE_URL}/api/register`,
  USER: `${BASE_URL}/api/user`,
  ADMIN: `${BASE_URL}/api/admin`,
  MANAGER: `${BASE_URL}/api/manager`,
  SALE_OPERATOR: `${BASE_URL}/api/sale-operator`,
  SPECIALIST: `${BASE_URL}/api/specialist`,





  AGREEMENTS: `${BASE_URL}/api/agreements`, // POST for creating agreements, GET for retrieving all
  AGREEMENT_DETAIL: (id) => `${BASE_URL}/api/agreements/${id}`, // For viewing, updating, or deleting a specific agreement
};
