describe('App', () => {
    it('succesfully starts', () => {
        // visit 'baseUrl'
        cy.visit('/');
        // assert if we are in good place
        cy.contains('My First React App now its hacking time !!!');
    });
});