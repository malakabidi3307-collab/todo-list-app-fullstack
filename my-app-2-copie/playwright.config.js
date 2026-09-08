const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  
  fullyParallel: false,
  
  retries: 0,
  
  reporter: "list",

  use: {
    
    channel: "chrome",
    
    headless: false,
    
    baseURL: "http://localhost:3000",
    
    trace: "on"
  }
});