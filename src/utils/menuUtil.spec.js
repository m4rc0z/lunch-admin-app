import {convertImportedMenus} from "./menuUtil";

const chai = require('chai');
const expect = chai.expect;

describe('menuUtil', function () {
    describe('convertImportedMenus', function () {
        it('should return converted menus', function () {
            const importedMenu = [
                {
                    Datum: '12.01.2000',
                    Preis: 20,
                    Gang1: 'Test',
                    Gang2: 'Test2',
                    Gang3: 'Test3',
                }
            ];
            const convertedMenu = [
                {
                    date: new Date(2000, 0, 12),
                    price: 20,
                    courses: [
                        {course: '1', description: 'Test'},
                        {course: '2', description: 'Test2'},
                        {course: '3', description: 'Test3'},
                    ]
                }
            ];

            expect(convertImportedMenus(importedMenu)).to.eql(convertedMenu);
        })
    });

});