// tests/unit.test.js
// Unit Tests – Continuous Testing Demo (Assignment #04)
// Course: Software Quality Engineering (SEN 321)

const {
  validateRegistrationInput,
  registerUser,
  loginUser,
  resetStore
} = require("../src/authService");

// ─────────────────────────────────────────────────
// UNIT TESTS: validateRegistrationInput()
// ─────────────────────────────────────────────────
describe("validateRegistrationInput()", () => {
  test("should return valid for correct inputs", () => {
    const result = validateRegistrationInput("john_doe", "john@example.com", "securePass1");
    expect(result.valid).toBe(true);
  });

  test("should reject username shorter than 3 characters", () => {
    const result = validateRegistrationInput("jo", "john@example.com", "securePass1");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/username/i);
  });

  test("should reject malformed email address", () => {
    const result = validateRegistrationInput("john_doe", "not-an-email", "securePass1");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/email/i);
  });

  test("should reject password shorter than 8 characters", () => {
    const result = validateRegistrationInput("john_doe", "john@example.com", "short");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/password/i);
  });

  test("should reject empty username", () => {
    const result = validateRegistrationInput("", "john@example.com", "securePass1");
    expect(result.valid).toBe(false);
  });

  test("should reject null inputs gracefully", () => {
    const result = validateRegistrationInput(null, null, null);
    expect(result.valid).toBe(false);
  });
});

// ─────────────────────────────────────────────────
// UNIT TESTS: registerUser()
// ─────────────────────────────────────────────────
describe("registerUser()", () => {
  beforeEach(() => {
    resetStore(); // Clear state before each test
  });

  test("should register a valid user successfully", () => {
    const result = registerUser("alice", "alice@test.com", "password123");
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/successfully/i);
  });

  test("should reject duplicate email registration", () => {
    registerUser("alice", "alice@test.com", "password123");
    const result = registerUser("alice2", "alice@test.com", "password456");
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/already exists/i);
  });
});

// ─────────────────────────────────────────────────
// UNIT TESTS: loginUser()
// ─────────────────────────────────────────────────
describe("loginUser()", () => {
  beforeEach(() => {
    resetStore();
    registerUser("bob", "bob@test.com", "mypassword99");
  });

  test("should login with correct credentials", () => {
    const result = loginUser("bob@test.com", "mypassword99");
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  test("should reject login with wrong password", () => {
    const result = loginUser("bob@test.com", "wrongpassword");
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/incorrect password/i);
  });

  test("should reject login for unregistered email", () => {
    const result = loginUser("nobody@test.com", "anypassword");
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/no user found/i);
  });

  test("should reject login with missing fields", () => {
    const result = loginUser("", "");
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/required/i);
  });
});
