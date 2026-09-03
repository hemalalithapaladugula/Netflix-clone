const API_BASE_URL = "http://localhost:5000/api";

// =========================
// AUTH APIs
// =========================

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

export const loginUser = async (loginData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  return response.json();
};


// =========================
// MOVIE APIs
// =========================

export const getMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/movies`);

  return response.json();
};

export const getMovieById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/movies/${id}`);

  return response.json();
};


// =========================
// PROTECTED API
// =========================

export const getProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/protected/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};


// =========================
// ADMIN MOVIE APIs
// =========================

export const createMovie = async (movieData, token) => {
  const response = await fetch(`${API_BASE_URL}/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movieData),
  });

  return response.json();
};

export const updateMovie = async (id, movieData, token) => {
  const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movieData),
  });

  return response.json();
};

export const deleteMovie = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};