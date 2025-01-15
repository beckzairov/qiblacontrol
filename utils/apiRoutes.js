const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ROUTES = {
  LOGIN: `${BASE_URL}/api/login`,
  REGISTER: `${BASE_URL}/api/register`,
  USER: `${BASE_URL}/api/user`,
  ADMIN: `${BASE_URL}/api/admin`,
  MANAGER: `${BASE_URL}/api/manager`,
  SALE_OPERATOR: `${BASE_URL}/api/sale-operator`,
  SPECIALIST: `${BASE_URL}/api/specialist`,
};
