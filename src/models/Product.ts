import { BaseModel } from "./BaseModel.js";
import { Displayable } from "../interfaces/Displayable.js";
import { Searchable } from "../interfaces/Searchable.js";

export class Product extends BaseModel implements Displayable, Searchable {
  private _sku: string;
  private _name: string;
  private _price: number;
  private _stock: number;
  private _categoryId: number;
  private _description: string;
  private _isActive: boolean = true;

  constructor(
    id: number,
    sku: string,
    name: string,
    price: number,
    stock: number,
    categoryId: number,
    description: string = ""
  ) {
    super(id);
    if (sku.trim().length == 0) throw new Error("SKU tidak boleh kosong");
    if (name.trim().length == 0) throw new Error("Nama produk tidak boleh kosong");
    if (price <= 0) throw new Error("Harga harus lebih dari 0");
    if (stock < 0) throw new Error("Stok tidak boleh negatif");
    if (categoryId <= 0) throw new Error("Category ID harus lebih dari 0");

    this._sku = sku.trim().toUpperCase();
    this._name = name.trim();
    this._price = price;
    this._stock = stock;
    this._categoryId = categoryId;
    this._description = description.trim();
  }

  // Getter
  get sku(): string { return this._sku; }
  get name(): string { return this._name; }
  get price(): number { return this._price; }
  get stock(): number { return this._stock; }
  get categoryId(): number { return this._categoryId; }
  get description(): string { return this._description; }
  get isActive(): boolean { return this._isActive; }
  get isLowStock(): boolean { return this._stock <= 5; }

  // Setter
  set name(value: string) {
    if (!value || value.trim().length == 0) throw new Error("Nama produk tidak boleh kosong");
    if (value.trim().length > 100) throw new Error("Nama produk maksimal 100 karakter");
    this._name = value.trim();
  }

  set price(value: number) {
    if (value <= 0) throw new Error("Harga harus lebih dari 0");
    this._price = value;
  }

  set description(value: string) { this._description = value.trim(); }

  set categoryId(value: number) {
    if (value < 0) throw new Error("Category ID harus lebih dari 0");
    this._categoryId = value;
  }

  //--- Business Methods
  reduceStock(qty: number): void {
    if (qty <= 0) throw new Error("Quantity harus positif");
    if (qty > this._stock) {
      throw new Error(`Stok tidak cukup: diminta ${qty}, tersedia ${this._stock}`);
    }
    this._stock -= qty;
  }

  addStock(qty: number): void {
    if (qty <= 0) throw new Error("Quantity harus positif");
    this._stock += qty;
  }

  activate(): void { this._isActive = true; }
  deactivate(): void { this._isActive = false; }

  // Implementasi Displayable
  toDisplayString(): string {
    return `${this._sku} - ${this._name}`;
  }

  toDetailString(): string {
    const stockWarning = this.isLowStock ? " (LOW STOCK)" : "";
    return [
      `ID: ${this.id}`,
      `SKU: ${this.sku}`,
      `Nama: ${this._name}`,
      `Harga: Rp ${this._price.toLocaleString("id-ID")}`,
      `Stok: ${this._stock}${stockWarning}`,
      `Kategori: #${this._categoryId}`,
      `Deskripsi: ${this.description}`,
      `Status: ${this.isActive ? "Active" : "Inactive"}`,
      `Dibuat: ${this.createdAt.toLocaleString("id-ID")}`
    ].join("\n");
  }

  // Implementasi Searchable
  matches(keyword: string): boolean {
    const lower = keyword.toLowerCase();
    return this._name.toLowerCase().includes(lower) ||
      this._sku.toLowerCase().includes(lower) ||
      this._description.toLowerCase().includes(lower);
  }

  override toString(): string {
    return this.toDisplayString();
  }
}
