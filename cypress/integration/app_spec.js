describe('App', () => {
    it('should be able to login and logout', () => {
        cy.visit('/home')
            .get('[data-cy=loginBtn]')
            .click()
            .get('[data-cy=logoutBtn]')
            .click()
            .get('[data-cy=loginBtn]')
    });
});