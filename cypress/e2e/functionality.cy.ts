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

describe('Admin can use upload page functionality', () => {
    it('should navigate to upload', () => {
        cy.get('[data-cy=nav-button-upload]').click({force: true});
        cy.get('[data-cy=upload-dropzone]').should('be.visible');
    });

    it('should be able to search for course', () => {
        cy.get('[data-cy=select-class-dropdown]').should('be.visible');
        cy.get('[data-cy=select-class-dropdown]').click({force: true});
    });

    it('should be able to search for year', () => {
        cy.get('[data-cy=select-year-dropdown]').should('be.visible');
        cy.get('[data-cy=select-year-dropdown]').click({force: true});
    });

});

describe('Admin can use admin page functionality', () => {
    it('should navigate to admin', () => {
        cy.get('[data-cy=nav-button-admin]').click({force: true});
        cy.get('[data-cy=nav-button-admin]').click({force: true});
        cy.get('[data-cy=admin-control-section]').should('be.visible');
    });

    it('should be able reset lecturers (opens modal)', () => {
        cy.get('[data-cy=reset-assigned-lecturers-button]').click({force: true});
        cy.get('[data-cy=confirm-reset-lecturers-modal]').should('be.visible');
        cy.get('[data-cy=cancel-reset-lecturers-button]').click({force: true});
    });

    it('should be able clear excess students (opens modal)', () => {
        cy.get('[data-cy=clear-excess-students-button]').click({force: true});
        cy.get('[data-cy=confirm-clear-students-modal]').should('be.visible');
        cy.get('[data-cy=cancel-clear-students-button]').click({force: true});
    });

    it('should be able create class', () => {
        cy.get('[data-cy=create-class-modal-button]').click({force: true});
        cy.get('[data-cy=create-class-modal]').should('be.visible');
        cy.get('[data-cy=class-code-textbox]').type('TD404');
        cy.get('[data-cy=class-name-textbox]').type('Test class');
        cy.get('[data-cy=class-credits-textbox]').type('20');
        cy.get('[data-cy=class-credit-level-textbox]').type('3');
        cy.get('[data-cy=create-class-button]').should('be.visible');
        cy.get('body').click(0, 0);
    });

    it('should be able create a lecturer', () => {
        cy.get('[data-cy=create-lecturer-modal-button]').click({force: true});
        cy.get('[data-cy=create-lecturer-modal]').should('be.visible');
        cy.get('[data-cy=lecturer-first-textbox]').type('Barry');
        cy.get('[data-cy=lecturer-last-textbox]').type('Scott');
        cy.get('[data-cy=lecturer-email-textbox]').type('Barry@strath.ac.uk');
        cy.get('[data-cy=create-lecturer-button]').should('be.visible');
        cy.get('body').click(0, 0);
    });

    it('should throw error creating an invalid lecturer', () => {
        cy.get('[data-cy=create-lecturer-modal-button]').click({force: true});
        cy.get('[data-cy=create-lecturer-modal]').should('be.visible');
        cy.get('[data-cy=lecturer-first-textbox]').type('B');
        cy.get('[data-cy=lecturer-last-textbox]').type('S');
        cy.get('[data-cy=lecturer-email-textbox]').type('Bazza@yoohoo.ru');
        cy.get('[data-cy=create-lecturer-button]').click({force: true});
        cy.get('[data-cy=error-creating-lecturer]').should('be.visible');
        cy.get('body').click(0, 0);
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

describe('Lecturer can use upload page functionality', () => {
    it('should navigate to upload', () => {
        cy.get('[data-cy=nav-button-upload]').click({force: true});
        cy.get('[data-cy=upload-dropzone]').should('be.visible');
    });
    
    it('should be able to search for course', () => {
        cy.get('[data-cy=select-class-dropdown]').should('be.visible');
        cy.get('[data-cy=select-class-dropdown]').click({force: true});
    });
});

describe('Lecturer who hasn\'t uploaded marks cant access analytics functionality' , () => {
    it('should log in as new lecturer', () => {
        cy.clearAllLocalStorage();
        cy.visit('http://localhost:3000/');
    
        cy.get('[data-cy=nav-button-log-in]').click();
    
        cy.get('[data-cy=login-username-field]').type('JWayne@strath.ac.uk');
    
        cy.get('[data-cy=login-password-field]').type('john');
    
        cy.get('[data-cy=login-submit-button]').click();
    
        cy.get('[data-cy=logged-in-modal]').should('be.visible');
    
        cy.get('body').click(0, 0);
        
    });

    it('should navigate to analytics', () => {
        cy.get('[data-cy=nav-button-analytics]').click({force: true});
        cy.get('[data-cy=analytics-filters]').should('be.visible');
    });

    it('should be warned no marks are uploaded', () => {
        cy.get('[data-cy=lecturer-no-marks-notice]').should('be.visible');
    });

    it('shouldn\'t be able to generate analytics', () => {
        cy.get('[data-cy=generate-graphs-button]').should('be.disabled');
    });

    it('shouldn\'t be able to clear filters', () => {
        cy.get('[data-cy=clear-filters-button]').should('be.disabled');
    });
});

describe('Lecturer who hasn\'t uploaded marks cant access students functionality' , () => {
    it('should navigate to students', () => {
        cy.get('[data-cy=nav-button-students]').click({force: true});
    });

    it('shouldn\'t be warned no students results', () => {
        cy.get('[data-cy=no-marks-uploaded]').should('be.visible');
    });

    it('should be redirected to upload', () => {
        cy.get('[data-cy=redirect-to-upload-button]').should('be.visible');
        cy.get('[data-cy=redirect-to-upload-button]').click({force:true});
        cy.get('[data-cy=upload-no-classes-assigned]').should('be.visible');
    });

});
