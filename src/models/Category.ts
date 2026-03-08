import { BaseModel } from "./BaseModel.js";

export class Category extends BaseModel {
  private _name: string;
  private _description: string;

  constructor(id: number, name: string, description: string = "") {
    super(id);
    if (!name || name.trim().length == 0) {
      throw new Error("Nama kategori tidak boleh kosong");
    }
    this._name = name.trim();
    this._description = description.trim();
  }

  get name(): string { return this._name; }
  get description(): string { return this._description; }

  set name(value: string) {
    if (!value || value.trim().length == 0) {
      throw new Error("Nama kategori tidak boleh kosong");
    }
    this._name = value.trim();
  }

  set description(value: string) { this._description = value.trim(); }

  override toString(): string {
    return `[Category#${this.id}] ${this._name}`;
  }
}