describe('App', () => {

    function mockLogin(win) {
        win.fetch = null;
        win.localStorage.setItem('expires_at', JSON.stringify((5000) + new Date().getTime()));
    }

    const notLoggedInText = 'You are not logged in';
    it('should be able to login and logout', () => {
        cy.visit('/home', {
            onBeforeLoad: (win) => {
                win.fetch = null
            }
        })
            .get('[data-cy=menu_container]').should('not.be.visible')
            .get('[data-cy=responseText]')
            .invoke('text').should('contain', notLoggedInText)
            .get('[data-cy=loginBtn]')
            .click({ force: true })
            .get('[data-cy=logoutBtn]')
            .click({ force: true })
            .get('[data-cy=loginBtn]')
    });

    it('should show private reponse if user is logged in', () => {
        cy.visit('/home', {
            onBeforeLoad: (win) => {
                win.fetch = null;
                win.localStorage.setItem('expires_at', JSON.stringify((5000) + new Date().getTime()));
            }
        })
            .get('[data-cy=responseText]')
            .invoke('text').should('contain', 'You are logged in!');
    });

    it('should be able to open SideNavigation and click on home', () => {
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
            .invoke('text').should('contain', notLoggedInText)
    });

    it('should show requested menus if user is logged in', () => {
        cy.server();
        cy.fixture('./getMenusFixture.json').as('getMenusFixture');
        cy.route(
            'GET',
            'api/menus',
            '@getMenusFixture',
        ).as('getMenus');
        cy.visit('/home', {
            onBeforeLoad: (win) => {
                win.fetch = null;
                win.localStorage.setItem('expires_at', JSON.stringify((5000) + new Date().getTime()));

            }
        })
            .get('[data-cy=expansionPanelTitle14]')
            .click()
            .get('[data-cy=week14MenuIndex1course1]')
            .contains('Salat')
            .get('[data-cy=week14MenuIndex1course2]')
            .contains('Schnitzel')
            .get('[data-cy=week14MenuIndex1course3]')
            .contains('Apfelstrudel2')
            .get('[data-cy=expansionPanelTitle15]')
            .click()
            .get('[data-cy=week15MenuIndex0course1]')
            .contains('TestSalat')
            .get('[data-cy=week15MenuIndex0course2]')
            .contains('TestSchnitzel3')
            .get('[data-cy=week15MenuIndex0course3]')
            .contains('Eis')
    });

    describe('Menu Import', () => {
        function checkMenuOverView(index, dateString, course1, course2, course3) {
            cy.get(`[data-cy=menuOverview_${index}_date]`).contains(dateString);
            cy.get(`[data-cy=menuOverview_${index}_course1]`).contains(course1);
            cy.get(`[data-cy=menuOverview_${index}_course2]`).contains(course2);
            cy.get(`[data-cy=menuOverview_${index}_course3]`).contains(course3);
        }

        it('should upload file and show imported menus', (done) => {
            cy.visit('/home', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            });

            cy.fixture('./baseMenus.csv').as('menuFile')
                .get('[data-cy=upload_file]').then(function (el) {
                return Cypress.Blob.base64StringToBlob(btoa(this.menuFile), 'text/csv')
                    .then(blob => {
                        if (el != null) {
                            cy.window().then((win) => {
                                const testFile = new win.File([blob], 'test.csv', {type: "text/csv"});
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(testFile);
                                el[0].files = dataTransfer.files;
                                el[0].dispatchEvent(new Event('change', {bubbles: true}));
                            })
                        }
                    })
            });

            checkMenuOverView(0, '01.02.2019', 'Salat', 'Schnitzel', 'Apfelstrudel');
            checkMenuOverView(1, '02.02.2019', 'Salat2', 'Schnitzel2', 'Apfelstrudel2');
            checkMenuOverView(2, '03.02.2019', 'Salat3', 'Schnitzel3', 'Apfelstrudel3');

            cy.server();
            cy.route({
                method: 'PUT',
                url: 'api/menus',
                onResponse: () => {
                    expect(true).to.be.true;
                    done();
                }
            }).as('saveMenus');

            cy.get('[data-cy=menuOverview_save]').click();

            cy.get('@saveMenus').should('have.been.called');

        });

        it('should show error toast on failed save imported menus', () => {
            cy.visit('/home', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            });

            cy.fixture('./baseMenus.csv').as('menuFile')
                .get('[data-cy=upload_file]').then(function (el) {
                return Cypress.Blob.base64StringToBlob(btoa(this.menuFile), 'text/csv')
                    .then(blob => {
                        if (el != null) {
                            cy.window().then((win) => {
                                const testFile = new win.File([blob], 'test.csv', {type: "text/csv"});
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(testFile);
                                el[0].files = dataTransfer.files;
                                el[0].dispatchEvent(new Event('change', {bubbles: true}));
                            })
                        }
                    })
            });

            cy.server();
            cy.route({
                method: 'PUT',
                url: 'api/menus',
                status: 500,
                response: {},
            }).as('saveMenus');

            cy.get('[data-cy=menuOverview_save]').click();
            cy.wait('@saveMenus');

            cy.contains('#client-snackbar', 'Fehler beim Speichern');
        });


        it('should call get menus when imported menus are saved', (done) => {
            cy.visit('/home', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            });

            cy.fixture('./baseMenus.csv').as('menuFile')
                .get('[data-cy=upload_file]').then(function (el) {
                return Cypress.Blob.base64StringToBlob(btoa(this.menuFile), 'text/csv')
                    .then(blob => {
                        if (el != null) {
                            cy.window().then((win) => {
                                const testFile = new win.File([blob], 'test.csv', {type: "text/csv"});
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(testFile);
                                el[0].files = dataTransfer.files;
                                el[0].dispatchEvent(new Event('change', {bubbles: true}));
                            })
                        }
                    })
            });

            cy.server();
            cy.route({
                method: 'PUT',
                url: 'api/menus',
                status: 200,
                response: {},
            }).as('saveMenus');

            cy.route({
                method: 'GET',
                url: 'api/menus',
                onResponse: () => {
                    done();
                },
                response: {},
            }).as('getMenus');

            cy.get('[data-cy=menuOverview_save]').click();
            cy.wait('@saveMenus');
            cy.wait('@getMenus');

            cy.contains('#client-snackbar', 'Menüs erfolgreich gespeichert');
        });
    });

    describe('Menu deletion', () => {
        it('should call get menus when imported menus are saved', (done) => {
            cy.server();
            cy.route({
                method: 'DELETE',
                url: 'api/menus',
                status: 200,
                response: {},
            }).as('deleteMenus');

            cy.fixture('./getMenusFixture.json').as('getMenusFixture');
            cy.route(
                'GET',
                'api/menus',
                '@getMenusFixture',
            ).as('getMenus');

            cy.visit('/home', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            });

            cy.get('[data-cy=expansionPanelTitle14]').click();
            cy.get('[data-cy=delete_week_14]').click();
            cy.contains('#client-snackbar', 'Menüs erfolgreich gelöscht');
            cy.wait('@deleteMenus');

            cy.wait('@getMenus').then(() => done());
        });
    });
});