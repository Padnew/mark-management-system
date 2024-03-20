describe('Admin can use student page functionality', () => {
    it('should log in as admin', () => {
      cy.clearAllLocalStorage();
      cy.visit('http://localhost:3000/');
  
      cy.get('[data-cy=nav-button-log-in]').click();
  
      cy.get('[data-cy=login-username-field]').type('admin@strath.ac.uk');
  
      cy.get('[data-cy=login-password-field]').type('StrongPassword');
  
      cy.get('[data-cy=login-submit-button]').click();
  
      cy.get('[data-cy=logged-in-modal]').should('be.visible');
  
      cy.get('body').click(0, 0);
      
    });
    it('should navigate to students', () => {
        cy.get('[data-cy=nav-button-students]').click({force: true});
        cy.get('[data-cy=students-table]').should('be.visible');
    });
    it('should be able to open export students modal', () =>{
        cy.get('[data-cy=students-table]').should('be.visible');
        cy.get('[data-cy=export-students-button]').click();
        cy.get('[data-cy=export-student-csv-modal]').should('be.visible');
        cy.get('body').click(0, 0);
    })
    it('should be able to query students', () =>{
        cy.get('[data-cy=students-table]').should('be.visible');
        cy.get('[data-cy=student-name-filter]').type('John');
        cy.get('[data-cy=student-name-filter]').should('have.value', 'John');
    })
    });

describe('Admin can use analytic page functionality', () => {
    it('should navigate to analytics', () => {
        cy.get('[data-cy=nav-button-analytics]').click({force: true});
        cy.get('[data-cy=analytics-filters]').should('be.visible');
    });
    it('should be able to query for course', () => {
        cy.get('[data-cy=selected-course-dropdown]').click({force: true});
        cy.get('body').click(750,300)
        cy.get('[data-cy=selected-course-dropdown]').should('have.value', 'Software Engineering');
    });
    it('should be able generate new graphs', () => {
        cy.get('[data-cy=generate-graphs-button]').click();
    });
    it('should be able to clear filters', () => {
        cy.get('[data-cy=clear-filters-button]').click();
        cy.get('[data-cy=generate-graphs-button]').click();
    });
    });

describe('Lecturer can use student page functionality', () => {
    it('should log in as lecturer', () => {
      cy.clearAllLocalStorage();
      cy.visit('http://localhost:3000/');
  
      cy.get('[data-cy=nav-button-log-in]').click();
  
      cy.get('[data-cy=login-username-field]').type('paddy@strath.ac.uk');
  
      cy.get('[data-cy=login-password-field]').type('password');
  
      cy.get('[data-cy=login-submit-button]').click();
  
      cy.get('[data-cy=logged-in-modal]').should('be.visible');
  
      cy.get('body').click(0, 0);
      
    });
    it('should navigate to students', () => {
        cy.get('[data-cy=nav-button-students]').click({force: true});
        cy.get('[data-cy=students-table]').should('be.visible');
    });
    it('should be able to query students', () =>{
        cy.get('[data-cy=students-table]').should('be.visible');
        cy.get('[data-cy=student-name-filter]').type('John');
        cy.get('[data-cy=student-name-filter]').should('have.value', 'John');
    })
    });

describe('Lecturer can use analytic page functionality', () => {
    it('should navigate to analytics', () => {
        cy.get('[data-cy=nav-button-analytics]').click({force: true});
        cy.get('[data-cy=analytics-filters]').should('be.visible');
    });
    it('should be able to query for course', () => {
        cy.get('[data-cy=selected-course-dropdown]').click({force: true});
        cy.get('body').click(750,300)
        cy.get('[data-cy=selected-course-dropdown]').should('have.value', 'Electrical Engineering');
    });
    it('should be able generate new graphs', () => {
        cy.get('[data-cy=generate-graphs-button]').click();
    });
    it('should be able to clear filters', () => {
        cy.get('[data-cy=clear-filters-button]').click();
        cy.get('[data-cy=generate-graphs-button]').click();
    });
    });
