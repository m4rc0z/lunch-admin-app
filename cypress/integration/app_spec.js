describe('App', () => {
    it('should be able to login and logout', () => {
        const publicResponse = 'public response';
        cy.server();
        cy.route({
            method: 'GET',
            url: '/api/public',
            response: { message: publicResponse }
        });

        cy.visit('/home', {
                onBeforeLoad: (win) => {
                    win.fetch = null
                }
            })
            .get('[data-cy=responseText]')
            .invoke('text').should('contain', publicResponse)
            .get('[data-cy=loginBtn]')
            .click()
            .get('[data-cy=logoutBtn]')
            .click()
            .get('[data-cy=loginBtn]')
    });

    it('should show private reponse if user is logged in', () => {
        const privateResponse = 'private response';
        cy.server();
        cy.route({
            method: 'GET',
            url: '/api/private',
            response: { message: privateResponse }
        });
        cy.visit('/home', {
            onBeforeLoad: (win) => {
                win.fetch = null;
                win.localStorage.setItem('access_token', 'test');
            }
        })
            .get('[data-cy=responseText]')
            .invoke('text').should('contain', privateResponse);
    });
});