describe('Admin can visit all pages', () => {
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
  
  it('should navigate to dashboard', () => {
    cy.get('[data-cy=dashboard-page-quote]').should('be.visible');
    
  });
  it('should navigate to students', () => {
    cy.get('[data-cy=nav-button-students]').click({force: true});
    cy.get('[data-cy=students-table]').should('be.visible');
  });
  it('should navigate to analytics', () => {
    cy.get('[data-cy=nav-button-analytics]').click({force: true});
    cy.get('[data-cy=analytics-filters]').should('be.visible');
  });
  it('should navigate to upload', () => {
    cy.get('[data-cy=nav-button-upload]').click({force: true});
    cy.get('[data-cy=upload-dropzone]').should('be.visible');
  });
  it('should navigate to admin', () => {
    cy.get('[data-cy=nav-button-admin]').click({force: true});
    cy.get('[data-cy=admin-control-section]').should('be.visible');
  });
});

describe('Lecturer can visit all pages', () => {
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
  
  it('should navigate to dashboard', () => {
    cy.get('[data-cy=dashboard-page-quote]').should('be.visible');
    
  });
  it('should navigate to students', () => {
    cy.get('[data-cy=nav-button-students]').click({force: true});
    cy.get('[data-cy=students-table]').should('be.visible');
  });
  it('should navigate to analytics', () => {
    cy.get('[data-cy=nav-button-analytics]').click({force: true});
    cy.get('[data-cy=analytics-filters]').should('be.visible');
  });
  it('should navigate to upload', () => {
    cy.get('[data-cy=nav-button-upload]').click({force: true});
    cy.get('[data-cy=upload-dropzone]').should('be.visible');
  });
  
  it('should not be able to access admin', () => {
    cy.visit('http://localhost:3000/admin');
    cy.get('[data-cy=not-found-page]').should('be.visible');
  });
});