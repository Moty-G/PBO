"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cashier = void 0;
const User_js_1 = require("./User.js");
class Cashier extends User_js_1.User {
    /** Daftar fitur yang boleh diakses Cashier. Static karena berlaku untuk SEMUA instance Cashier. */
    static ALLOWED_FEATURES = [
        "transaction",
        "view_products",
        "view_categories"
    ];
    constructor(id, username, password, fullName) {
        super(id, username, password, fullName);
    }
    getRole() {
        return "CASHIER";
    }
    /** Cashier hanya boleh akses fitur yang ada di ALLOWED_FEATURES. */
    hasAccess(feature) {
        return Cashier.ALLOWED_FEATURES.includes(feature);
    }
}
exports.Cashier = Cashier;
