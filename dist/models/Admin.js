"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const User_js_1 = require("./User.js");
class Admin extends User_js_1.User {
    constructor(id, username, password, fullName) {
        super(id, username, password, fullName);
    }
    /** Admin selalu return "ADMIN". */
    getRole() {
        return "ADMIN";
    }
    /** Admin punya akses ke SEMUA fitur. */
    hasAccess(_feature) {
        return true;
    }
}
exports.Admin = Admin;
