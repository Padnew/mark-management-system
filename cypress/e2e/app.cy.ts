describe('Navigation', () => {
    it('should navigate to the landing page', () => {
      cy.visit('http://localhost:3000/')

      cy.get('<h2>').contains('Welcome to your new Mark Management System!',{timeout: 30000})

    })
  })