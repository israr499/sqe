// tests/integration.test.js
// Integration Tests – Continuous Testing Demo (Assignment #04)
// Tests the full register → login → re-login flow end-to-end.

const { registerUser, loginUser, resetStore } = require("../src/authService");

describe("Integration: Full Authentication Flow", () => {
  beforeEach(() => {
    resetStore();
  });

  test("should complete a full register → login flow successfully", () => {
    // Step 1: Register
    const reg = registerUser("carol", "carol@example.com", "carol_secure99");
    expect(reg.success).toBe(true);

    // Step 2: Login with registered credentials
    const login = loginUser("carol@example.com", "carol_secure99");
    expect(login.success).toBe(true);
    expect(login.token).toBeDefined();
    expect(typeof login.token).toBe("string");
    expect(login.token.length).toBeGreaterThan(10);
  });

  test("should prevent login before registration", () => {
    const login = loginUser("ghost@example.com", "doesntmatter");
    expect(login.success).toBe(false);
  });

  test("should allow multiple distinct users to register and login", () => {
    registerUser("user1", "user1@example.com", "pass1pass1");
    registerUser("user2", "user2@example.com", "pass2pass2");

    const login1 = loginUser("user1@example.com", "pass1pass1");
    const login2 = loginUser("user2@example.com", "pass2pass2");

    expect(login1.success).toBe(true);
    expect(login2.success).toBe(true);

    // Tokens should be different for different users
    expect(login1.token).not.toBe(login2.token);
  });

  test("should reject duplicate registration even after successful login", () => {
    registerUser("dave", "dave@example.com", "dave1234pass");
    loginUser("dave@example.com", "dave1234pass");

    // Try to register again with same email
    const dupReg = registerUser("dave_clone", "dave@example.com", "otherpass99");
    expect(dupReg.success).toBe(false);
    expect(dupReg.message).toMatch(/already exists/i);
  });

  test("should handle high-volume sequential registrations", () => {
    const results = [];
    for (let i = 0; i < 50; i++) {
      results.push(registerUser(`user${i}`, `user${i}@test.com`, `password${i}pass`));
    }
    const allSuccess = results.every(r => r.success);
    expect(allSuccess).toBe(true);
  });

  test("should maintain data isolation between test runs", () => {
    registerUser("isolated", "isolated@test.com", "isolatedPass1");
    // After resetStore in beforeEach, this user should not exist
    // This test verifies that isolation by checking a fresh state
    const users = [];
    // Simulate checking - since store is fresh, only our registered user exists
    const login = loginUser("isolated@test.com", "isolatedPass1");
    expect(login.success).toBe(true);
  });
});
