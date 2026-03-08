"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const BaseModel_js_1 = require("./BaseModel.js");
class Product extends BaseModel_js_1.BaseModel {
    _sku;
    _name;
    _price;
    _stock;
    _categoryId;
    _description;
    _isActive = true;
    constructor(id, sku, name, price, stock, categoryId, description = "") {
        super(id); // Memanggil constructor BaseModel WAJIB pertama
        if (sku.trim().length == 0)
            throw new Error("SKU tidak boleh kosong");
        if (name.trim().length == 0)
            throw new Error("Nama produk tidak boleh kosong");
        if (price <= 0)
            throw new Error("Harga harus lebih dari 0");
        if (stock < 0)
            throw new Error("Stok tidak boleh negatif");
        if (categoryId <= 0)
            throw new Error("Category ID harus lebih dari 0");
        this._sku = sku.trim().toUpperCase();
        this._name = name.trim();
        this._price = price;
        this._stock = stock;
        this._categoryId = categoryId;
        this._description = description.trim();
    }
    // Getter
    get sku() { return this._sku; }
    get name() { return this._name; }
    get price() { return this._price; }
    get stock() { return this._stock; }
    get categoryId() { return this._categoryId; }
    get description() { return this._description; }
    get isActive() { return this._isActive; }
    get isLowStock() { return this._stock <= 5; }
    // Setter
    set name(value) {
        if (!value || value.trim().length == 0)
            throw new Error("Nama produk tidak boleh kosong");
        if (value.trim().length > 100)
            throw new Error("Nama produk maksimal 100 karakter");
        this._name = value.trim();
    }
    set price(value) {
        if (value <= 0)
            throw new Error("Harga harus lebih dari 0");
        this._price = value;
    }
    set description(value) { this._description = value.trim(); }
    set categoryId(value) {
        if (value < 0)
            throw new Error("Category ID harus lebih dari 0");
        this._categoryId = value;
    }
    //--- Business Methods
    reduceStock(qty) {
        if (qty <= 0)
            throw new Error("Quantity harus positif");
        if (qty > this._stock) {
            throw new Error(`Stok tidak cukup: diminta ${qty}, tersedia ${this._stock}`);
        }
        this._stock -= qty;
    }
    addStock(qty) {
        if (qty <= 0)
            throw new Error("Quantity harus positif");
        this._stock += qty;
    }
    activate() { this._isActive = true; }
    deactivate() { this._isActive = false; }
    // Override toString() dari BaseModel
    toString() {
        const status = this._isActive ? "Active" : "Inactive";
        const stockWarning = this.isLowStock ? " LOW STOCK" : "";
        return `[Product#${this.id}] ${this._sku} ${this._name} | Rp ${this._price.toLocaleString("id-ID")} | Stok: ${this._stock}${stockWarning} (${status})`;
    }
}
exports.Product = Product;
