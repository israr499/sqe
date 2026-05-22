// src/authService.js
// Simple Authentication Service for Continuous Testing Demo

const users = new Map(); // In-memory store (mock database)

/**
 * Validates registration input fields.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {{ valid: boolean, error?: string }}
 */
function validateRegistrationInput(username, email, password) {
  if (!username || username.trim().length < 3) {
    return { valid: false, error: "Username must be at least 3 characters." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Invalid email address." };
  }
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters." };
  }
  return { valid: true };
}

/**
 * Registers a new user.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, message: string }}
 */
function registerUser(username, email, password) {
  const validation = validateRegistrationInput(username, email, password);
  if (!validation.valid) {
    return { success: false, message: validation.error };
  }

  if (users.has(email)) {
    return { success: false, message: "User with this email already exists." };
  }

  // Store user (in real app, password would be hashed with bcrypt)
  users.set(email, { username: username.trim(), email, password });
  return { success: true, message: "User registered successfully." };
}

/**
 * Logs in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, message: string, token?: string }}
 */
function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const user = users.get(email);
  if (!user) {
    return { success: false, message: "No user found with this email." };
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password." };
  }

  // Simulate a session token (in real app, use JWT)
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
  return { success: true, message: "Login successful.", token };
}

/**
 * Resets the user store (used between tests).
 */
function resetStore() {
  users.clear();
}

module.exports = { validateRegistrationInput, registerUser, loginUser, resetStore };
