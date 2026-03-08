import { Product } from "./Product.js";

export class CartItem {
  private _product: Product;
  private _quantity: number;

  constructor(product: Product, quantity: number) {
    if (!product) throw new Error("Produk tidak valid");
    if (quantity <= 0) throw new Error("Quantity harus lebih dari 0");

    this._product = product;
    this._quantity = quantity;
  }

  // --- Getter ---
  get product(): Product {
    return this._product;
  }

  get quantity(): number {
    return this._quantity;
  }

  // --- Computed Property ---
  get subtotal(): number {
    return this._product.price * this._quantity;
  }

  // --- Methods ---
  updateQuantity(newQty: number): void {
    if (newQty <= 0) {
      throw new Error("Quantity harus lebih dari 0");
    }
    this._quantity = newQty;
  }

  toString(): string {
    // Format output: Nasi Goreng x3 = Rp 45.000
    return `${this._product.name} x${this._quantity} = Rp ${this.subtotal.toLocaleString("id-ID")}`;
  }
}