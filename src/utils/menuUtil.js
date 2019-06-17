import {createDate} from "./dateUtil";

const convertImportedMenus = function(importedMenus) {
    return importedMenus.map(menu => (
        {
            id: menu._id,
            date: createDate(menu.Datum),
            price: menu.Preis,
            courses: [
                { course: '1', description: menu.Gang1 },
                { course: '2', description: menu.Gang2 },
                { course: '3', description: menu.Gang3 },
            ]
        }
    ));
};

export {convertImportedMenus}