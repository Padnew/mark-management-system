import { defineConfig } from 'cypress'
 
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    testIsolation: false,
  },
  defaultCommandTimeout: 60000
})