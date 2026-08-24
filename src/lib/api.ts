const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  return res;
};

export const DISTRICTS = [
  "Kumasi Central District",
  "Kumasi South District",
  "Kumasi West 1 District",
  "Kumasi West 2 District",
  "Kumasi South-East District",
  "Obuasi District",
  "Konongo District",
];

export const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];
