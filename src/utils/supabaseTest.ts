// Mock Supabase test utility

/**
 * Tests the connection to the mock database
 * @returns Connection status
 */
export async function testSupabaseConnection() {
  return {
    connected: true,
    message: "Connected to mock database",
    error: null
  };
}

/**
 * Initializes the mock database
 * @returns Initialization result
 */
export async function initializeDatabase() {
  return {
    success: true,
    message: "Mock database initialized successfully",
    error: null
  };
}