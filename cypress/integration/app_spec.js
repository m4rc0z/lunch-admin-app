const menuResponse = require('../support/menus');

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

    it('should be able to open SideNavigation and click on home', () => {
        const publicResponse = 'public response';
        cy.server();
        cy.route({
            method: 'GET',
            url: '/api/public',
            response: { message: publicResponse }
        });

        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.fetch = null
            }
        })
            .get('[data-cy=responseText]').should('not.exist')
            .get('[data-cy=menuBtn]')
                .click()
            .get('[data-cy=homeBtn]')
                .click()
            .get('[data-cy=responseText]')
            .invoke('text').should('contain', publicResponse)
    });

    it('should show requested menus if user is logged in', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: '/api/menus',
            response: menuResponse
        });
        cy.route({
            method: 'GET',
            url: '/api/private',
            response: { message: '' }
        });
        cy.visit('/home', {
            onBeforeLoad: (win) => {
                win.fetch = null;
                win.localStorage.setItem('access_token', 'test');
            }
        })
            .get('[data-cy=expansionPanelTitle1]')
            .click()
            .get('[data-cy=week1MenuIndex1course1]')
            .contains('Salat')
            .get('[data-cy=week1MenuIndex1course2]')
            .contains('Schnitzel')
            .get('[data-cy=week1MenuIndex1course3]')
            .contains('Eis')
            .get('[data-cy=expansionPanelTitle2]')
            .click()
            .get('[data-cy=week2MenuIndex1course1]')
            .contains('Salat7')
            .get('[data-cy=week2MenuIndex1course2]')
            .contains('Schnitzel7')
            .get('[data-cy=week2MenuIndex1course3]')
            .contains('Eis7')
    });
});