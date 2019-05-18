const getWeekNumber = function(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

const getWeekDay = function(date) {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return days[date.getDay()];
};

const createDate = function(germanDateString) {
    const dayMonthYear = germanDateString.split('.');
    return new Date(dayMonthYear[2], dayMonthYear[1]-1, dayMonthYear[0]);
};

exports.getWeekNumber = getWeekNumber;
exports.getWeekDay = getWeekDay;
exports.createDate = createDate;