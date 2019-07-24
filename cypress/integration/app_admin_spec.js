describe('App', () => {
    function mockLogin(win) {
        win.fetch = null;
        win.localStorage.setItem('expires_at', JSON.stringify((5000) + new Date().getTime()));
        win.localStorage.setItem('isAdmin', JSON.stringify(false));
        win.localStorage.setItem('isLoggedIn', JSON.stringify(true));
        win.localStorage.setItem('userId', 'testRestaurant');
    }

    function mockAdminLogin(win) {
        win.fetch = null;
        win.localStorage.setItem('expires_at', JSON.stringify((5000) + new Date().getTime()));
        win.localStorage.setItem('isAdmin', JSON.stringify(true));
        win.localStorage.setItem('isLoggedIn', JSON.stringify(true));
        win.localStorage.setItem('userId', 'testRestaurant');
    }

    describe('SideNavigation', () => {
        it('should be able to open SideNavigation and click on home', () => {
            cy.visit('/', {
                onBeforeLoad: (win) => {
                    mockLogin(win)
                }
            })
                .get('[data-cy=logoutBtn]').should('be.visible')
                .get('[data-cy=menuBtn]')
                .click()
                .get('[data-cy=homeBtn]')
                .should('be.visible');
        });

        it('should show Restaurants SideNavigation entry for admin', () => {
            cy.visit('/home', {
                onBeforeLoad: (win) => {
                    mockAdminLogin(win);
                }
            })
                .get('[data-cy=menuBtn]')
                .click()
                .get('[data-cy=homeBtn]')
                .should('be.visible')
                .get('[data-cy=restaurantBtn]')
                .should('be.visible')
        });

        it('should not show Restaurants SideNavigation entry for non-admin', () => {
            cy.visit('/home', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            })
                .get('[data-cy=menuBtn]')
                .click()
                .get('[data-cy=homeBtn]')
                .should('be.visible')
                .get('[data-cy=restaurantBtn]')
                .should('not.be.visible')
        });
    });

    describe('Routing', () => {
        it('should redirect non-admin his home', () => {
            cy.visit('/restaurants', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            })
                .url().should('contain', '/restaurants/testRestaurant');
        });
        it('should not redirect admin to his home', () => {
            cy.visit('/restaurants', {
                onBeforeLoad: (win) => {
                    mockAdminLogin(win);
                }
            })
                .url().should('not.include', '/restaurants/testRestaurant');
        });
        it('should redirect admin to restaurants when wrong path', () => {
            cy.visit('/test123', {
                onBeforeLoad: (win) => {
                    mockAdminLogin(win);
                }
            })
                .url().should('not.include', '/restaurants/testRestaurant');
            cy.url().should('include', '/restaurants');


        });
        it('should redirect non-admin to his restaurants when wrong path', () => {
            cy.visit('/test123', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            })
                .url().should('include', '/restaurants/testRestaurant');
        });
    });

    describe('Restaurant Menus Non-Admin', () => {
        describe('Load Menus', () => {
            it('should show requested menus if user is logged in', () => {
                cy.server();
                cy.fixture('./getMenusFixture.json').as('getMenusFixture');
                cy.route(
                    'GET',
                    '/api/restaurants/testRestaurant/menus',
                    '@getMenusFixture',
                ).as('getMenusForWeek');
                cy.visit('/restaurants/testRestaurant', {
                    onBeforeLoad: (win) => {
                        mockLogin(win);
                    }
                });
                cy
                    .get('[data-cy=expansionPanelTitle15]')
                    .click()
                    .get('[data-cy=week15MenuIndex0course1]')
                    .contains('Salat')
                    .get('[data-cy=week15MenuIndex0course2]')
                    .contains('Schnitzel')
                    .get('[data-cy=week15MenuIndex0course3]')
                    .contains('Eis');

                cy
                    .get('[data-cy=expansionPanelTitle31]')
                    .click()
                    .get('[data-cy=week31MenuIndex0course1]')
                    .contains('Salat2')
                    .get('[data-cy=week31MenuIndex0course2]')
                    .contains('Schnitzel2')
                    .get('[data-cy=week31MenuIndex0course3]')
                    .contains('Apfelstrudel2')
            });
        });
        describe('Save Menus', () => {
            function checkMenuOverView(index, dateString, course1, course2, course3) {
                cy.get(`[data-cy=menuOverview_${index}_date]`).contains(dateString);
                cy.get(`[data-cy=menuOverview_${index}_course1]`).contains(course1);
                cy.get(`[data-cy=menuOverview_${index}_course2]`).contains(course2);
                cy.get(`[data-cy=menuOverview_${index}_course3]`).contains(course3);
            }

            it('should upload file and show imported menus', () => {
                cy.visit('/restaurants/testRestaurant', {
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
                    url: 'api/restaurants/testRestaurant/menus',
                    status: 200,
                    response: {},
                }).as('saveMenus');

                cy.get('[data-cy=menuOverview_save]').click();

                cy.wait('@saveMenus');
                cy.get('[data-cy=menuImportPanel]').should('not.be.visible');
            });

            it('should show error toast on failed save imported menus', () => {
                cy.visit('/restaurants/testRestaurant', {
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
                    url: 'api/restaurants/testRestaurant/menus',
                    status: 500,
                    response: {},
                }).as('saveMenus');

                cy.get('[data-cy=menuOverview_save]').click();
                cy.wait('@saveMenus');

                cy.get('[data-cy=menuImportPanel]').should('be.visible');

                cy.contains('#client-snackbar', 'Fehler beim Speichern');
            });


            it('should call get menus when imported menus are saved', (done) => {
                cy.visit('/restaurants/testRestaurant', {
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
                    url: 'api/restaurants/testRestaurant/menus',
                    status: 200,
                    response: {},
                }).as('saveMenus');

                cy.route({
                    method: 'GET',
                    url: '/api/restaurants/testRestaurant/menus',
                    onResponse: () => {
                        done();
                    },
                    response: {},
                }).as('getMenusForWeek');

                cy.get('[data-cy=menuOverview_save]').click();
                cy.wait('@saveMenus');
                cy.wait('@getMenusForWeek');

                cy.contains('#client-snackbar', 'Menüs erfolgreich gespeichert');
            });
        });
        describe('Delete Menus', () => {
            it('should call get menus when imported menus are saved', (done) => {
                const menusToDelete = require('../fixtures/menusToDelete');

                cy.server();
                cy.route({
                    method: 'DELETE',
                    url: 'api/restaurants/testRestaurant/menus',
                    status: 200,
                    response: {},
                    onRequest(...args) {
                        expect(JSON.stringify(args[0].request.body.menus)).to.be.equal(JSON.stringify(menusToDelete));
                    }
                }).as('deleteMenus');

                cy.fixture('./getMenusFixture.json').as('getMenusFixture');
                cy.route(
                    'GET',
                    'api/restaurants/testRestaurant/menus',
                    '@getMenusFixture',
                ).as('getMenusForWeek');

                cy.visit('/restaurants/testRestaurant', {
                    onBeforeLoad: (win) => {
                        mockLogin(win);
                    }
                });

                cy.get('[data-cy=expansionPanelTitle31]').click();
                cy.get('[data-cy=delete_week_31]').click();
                cy.contains('#client-snackbar', 'Menüs erfolgreich gelöscht');
                cy.wait('@deleteMenus');

                cy.wait('@getMenusForWeek').then(() => done());
            });
            it('should call get menus when menus are deleted', (done) => {
                cy.server();
                cy.route({
                    method: 'DELETE',
                    url: '/api/restaurants/testRestaurant/menus',
                    status: 200,
                    response: {},
                }).as('deleteMenus');

                cy.fixture('./getMenusFixture.json').as('getMenusFixture');
                cy.route(
                    'GET',
                    '/api/restaurants/testRestaurant/menus',
                    '@getMenusFixture',
                ).as('getMenusForWeek');

                cy.visit('/restaurants/testRestaurant', {
                    onBeforeLoad: (win) => {
                        mockLogin(win);
                    }
                });

                cy.get('[data-cy=expansionPanelTitle15]').click();
                cy.get('[data-cy=delete_week_15]').click();
                cy.contains('#client-snackbar', 'Menüs erfolgreich gelöscht');
                cy.wait('@deleteMenus');

                cy.wait('@getMenusForWeek').then(() => done());
            });
        });
    });

    describe('Restaurant Menus Admin', () => {
        describe('Load Menus', () => {
            it('should be able to load menus from different restaurants', () => {
                cy.server();
                cy.fixture('./getMenusFixture.json').as('getMenusFixture');
                cy.route(
                    'GET',
                    '/api/restaurants/testRestaurant/menus',
                    '@getMenusFixture',
                ).as('getMenusForWeek');
                cy.fixture('./getMenusFixture2.json').as('getMenusFixture2');
                cy.route(
                    'GET',
                    '/api/restaurants/testRestaurant2/menus',
                    '@getMenusFixture2',
                ).as('getMenusForWeek2');
                cy.visit('/restaurants/testRestaurant', {
                    onBeforeLoad: (win) => {
                        mockAdminLogin(win);
                    }
                });
                cy
                    .get('[data-cy=expansionPanelTitle15]')
                    .click()
                    .get('[data-cy=week15MenuIndex0course1]')
                    .contains('Salat')
                    .get('[data-cy=week15MenuIndex0course2]')
                    .contains('Schnitzel')
                    .get('[data-cy=week15MenuIndex0course3]')
                    .contains('Eis');

                cy
                    .get('[data-cy=expansionPanelTitle31]')
                    .click()
                    .get('[data-cy=week31MenuIndex0course1]')
                    .contains('Salat2')
                    .get('[data-cy=week31MenuIndex0course2]')
                    .contains('Schnitzel2')
                    .get('[data-cy=week31MenuIndex0course3]')
                    .contains('Apfelstrudel2');

                cy.visit('/restaurants/testRestaurant2', {
                    onBeforeLoad: (win) => {
                        mockAdminLogin(win);
                    }
                });
                cy
                    .get('[data-cy=expansionPanelTitle15]')
                    .click()
                    .get('[data-cy=week15MenuIndex0course1]')
                    .contains('Salat')
                    .get('[data-cy=week15MenuIndex0course2]')
                    .contains('Schnitzel')
                    .get('[data-cy=week15MenuIndex0course3]')
                    .contains('Eis');

                cy
                    .get('[data-cy=expansionPanelTitle31]')
                    .click()
                    .get('[data-cy=week31MenuIndex0course1]')
                    .contains('Salat2')
                    .get('[data-cy=week31MenuIndex0course2]')
                    .contains('Schnitzel2')
                    .get('[data-cy=week31MenuIndex0course3]')
                    .contains('Apfelstrudel2')
            });
            it('should be able to load all restaurants', () => {
                cy.server();
                cy.fixture('./getRestaurantsFixture.json').as('getRestaurants');
                cy.route(
                    'GET',
                    '/api/restaurants/',
                    '@getRestaurants',
                ).as('getRestaurants');

                cy.visit('/restaurants', {
                    onBeforeLoad: (win) => {
                        mockAdminLogin(win);
                    }
                });
                cy.get('[data-cy=restaurant-testRestaurant]');
                cy.get('[data-cy=restaurant-testRestaurant2]');
            });
            it('should not be able to load all restaurants and should be redirected', () => {
                cy.visit('/restaurants', {
                    onBeforeLoad: (win) => {
                        mockLogin(win);
                    }
                });

                cy.url().should('contain', 'restaurants/testRestaurant');
            });
            it('should not be able to load menus from different restaurants when no admin', () => {
                cy.server();
                cy.fixture('./getMenusFixture.json').as('getMenusFixture');
                cy.route(
                    'GET',
                    '/api/restaurants/testRestaurant/menus',
                    '@getMenusFixture',
                ).as('getMenusForWeek');
                cy.fixture('./getMenusFixture2.json').as('getMenusFixture2');
                cy.route(
                    'GET',
                    '/api/restaurants/testRestaurant2/menus',
                    '@getMenusFixture2',
                ).as('getMenusForWeek2');
                cy.visit('/restaurants/testRestaurant', {
                    onBeforeLoad: (win) => {
                        mockLogin(win);
                    }
                });
                cy
                    .get('[data-cy=expansionPanelTitle15]')
                    .click()
                    .get('[data-cy=week15MenuIndex0course1]')
                    .contains('Salat')
                    .get('[data-cy=week15MenuIndex0course2]')
                    .contains('Schnitzel')
                    .get('[data-cy=week15MenuIndex0course3]')
                    .contains('Eis');

                cy
                    .get('[data-cy=expansionPanelTitle31]')
                    .click()
                    .get('[data-cy=week31MenuIndex0course1]')
                    .contains('Salat2')
                    .get('[data-cy=week31MenuIndex0course2]')
                    .contains('Schnitzel2')
                    .get('[data-cy=week31MenuIndex0course3]')
                    .contains('Apfelstrudel2');

                cy.visit('/restaurants/testRestaurant2', {
                    onBeforeLoad: (win) => {
                        mockLogin(win);
                    }
                });
                cy
                    .get('[data-cy=expansionPanelTitle15]')
                    .should('not.be.visible');
            });
        });
    });

    describe('Login and Logout', () => {
        it('should show login button when logged out', () => {
            cy.visit('/', {
                onBeforeLoad: (win) => {
                    win.fetch = null
                }
            })
                .get('[data-cy=menu_container]').should('not.be.visible')
                .get('[data-cy=loginBtn]')
                .should('be.visible');
        });
        it('should show logout button when logged in', () => {
            cy.visit('/', {
                onBeforeLoad: (win) => {
                    mockLogin(win);
                }
            })
                .get('[data-cy=logoutBtn]')
                .should('be.visible');
        });
    });

});