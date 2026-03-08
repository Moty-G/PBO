"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const BaseModel_js_1 = require("./BaseModel.js");
class User extends BaseModel_js_1.BaseModel {
    _username;
    _password;
    _fullName;
    _isActive = true;
    constructor(id, username, password, fullName) {
        super(id);
        if (!username || username.trim().length < 3) {
            throw new Error("Username minimal 3 karakter");
        }
        if (!password || password.length < 6) {
            throw new Error("Password minimal 6 karakter");
        }
        if (!fullName || fullName.trim().length == 0) {
            throw new Error("Nama Lengkap tidak boleh kosong");
        }
        this._username = username.trim().toLowerCase();
        this._password = password;
        this._fullName = fullName.trim();
    }
    get username() { return this._username; }
    get fullName() { return this._fullName; }
    get isActive() { return this._isActive; }
    set fullName(value) {
        if (!value || value.trim().length == 0) {
            throw new Error("Nama lengkap tidak boleh kosong");
        }
        this._fullName = value.trim();
    }
    verifyPassword(inputPassword) {
        return this._password === inputPassword;
    }
    changePassword(oldPassword, newPassword) {
        if (!this.verifyPassword(oldPassword))
            throw new Error("Password lama salah");
        if (newPassword.length < 6)
            throw new Error("Password baru minimal 6 karakter");
        if (oldPassword === newPassword)
            throw new Error("Password baru harus berbeda");
        this._password = newPassword;
    }
    deactivate() { this._isActive = false; }
    /** Method yang akan di-override oleh subclass. Base User tidak punya role spesifik. */
    getRole() {
        return "USER";
    }
    /** Method yang akan di-override oleh subclass. Base User tidak punya akses ke fitur apapun. */
    hasAccess(feature) {
        return false;
    }
    toString() {
        const status = this._isActive ? "Active" : "Inactive";
        return `[${this.getRole()}#${this.id}] ${this._username} (${this._fullName}) | ${status}`;
    }
}
exports.User = User;
