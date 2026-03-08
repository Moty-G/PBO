"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
class CartItem {
    _product;
    _quantity;
    constructor(product, quantity) {
        if (!product)
            throw new Error("Produk tidak valid");
        if (quantity <= 0)
            throw new Error("Quantity harus lebih dari 0");
        this._product = product;
        this._quantity = quantity;
    }
    // --- Getter ---
    get product() {
        return this._product;
    }
    get quantity() {
        return this._quantity;
    }
    // --- Computed Property ---
    get subtotal() {
        return this._product.price * this._quantity;
    }
    // --- Methods ---
    updateQuantity(newQty) {
        if (newQty <= 0) {
            throw new Error("Quantity harus lebih dari 0");
        }
        this._quantity = newQty;
    }
    toString() {
        // Format output: Nasi Goreng x3 = Rp 45.000
        return `${this._product.name} x${this._quantity} = Rp ${this.subtotal.toLocaleString("id-ID")}`;
    }
}
exports.CartItem = CartItem;
