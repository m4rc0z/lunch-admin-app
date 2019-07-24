const chai = require('chai');
const expect = chai.expect;
import {createDate, getWeekDay, getWeekNumber} from "./dateUtil";

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
        it('should return correct WeekDay', function() {
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
    });

    describe('createDate', function() {
        it('should return correct Date', function() {
            const expected = [
                { dateString: '12.02.1991', date: new Date(1991, 1, 12) },
                { dateString: '12.03.1991', date: new Date(1991, 2, 12) },
                { dateString: '12.03.1992', date: new Date(1992, 2, 12) },
                { dateString: '13.03.1992', date: new Date(1992, 2, 13) },
            ];

            expected.forEach(obj => {
                expect(createDate(obj.dateString)).to.eql(obj.date);
            })
        })
    })
});