import {createDate, getWeekNumber} from "./dateUtil";

const convertImportedMenus = function(importedMenus) {
    return importedMenus.map(menu => (
        {
            id: menu._id,
            date: createDate(menu.Datum),
            price: menu.Preis,
            categories: menu.Kategorien.split(','),
            courses: [
                { course: '1', description: menu.Gang1 },
                { course: '2', description: menu.Gang2 },
                { course: '3', description: menu.Gang3 },
            ]
        }
    ));
};

const getFilteredMenusByWeek = (weekNumber, menus) => {
    return menus && menus.filter(menu => {
        return getWeekNumber(new Date(menu.date)) === weekNumber;
    });
};

export {convertImportedMenus, getFilteredMenusByWeek}