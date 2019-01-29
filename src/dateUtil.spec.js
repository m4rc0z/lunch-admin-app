const chai = require('chai');
const expect = chai.expect;
import {getWeekDay, getWeekNumber} from "./dateUtil";

describe('dateUtil', function() {
    describe('getWeekNumber', function() {
        it('should return correct WeekNumber', function() {
            const expected = [
                { date: new Date(2019, 0, 1), week: 1 },
                { date: new Date(2019, 0, 12), week: 2 },
                { date: new Date(2019, 1, 12), week: 7 },
                { date: new Date(2019, 11, 12), week: 50 },
            ];

            expected.forEach(obj => {
                expect(getWeekNumber(obj.date)).to.equal(obj.week);
            })
        })
    });

    describe('getWeekDay', function() {
        it.only('should return correct WeekDay', function() {
            const expected = [
                { date: new Date(2019, 0, 1), day: 'Dienstag' },
                { date: new Date(2019, 0, 12), day: 'Samstag' },
                { date: new Date(2019, 1, 12), day: 'Dienstag' },
                { date: new Date(2019, 11, 12), day: 'Donnerstag' },
            ];

            expected.forEach(obj => {
                expect(getWeekDay(obj.date)).to.equal(obj.day);
            })
        })
    })
});