import { BaseModel } from "../models/BaseModel.js";

/**
 * Abstract class untuk Repository pattern.
 * Menyediakan operasi CRUD dasar yang berlaku untuk semua entity.
 *
 * Mengapa abstract class, bukan interface?
 * - Ada shared implementation: add(), findById(), getAll(), delete()
 * - Ada shared state: protected items array
 * - Subclass hanya perlu implement method yang spesifik: search()
 *
 * Generic <T extends BaseModel> memastikan:
 * - Hanya class turunan BaseModel yang bisa dimasukkan
 * - Method findById() bisa memanfaatkan property .id dari BaseModel
 */
export abstract class BaseRepository<T extends BaseModel> {
    protected items: T[] = [];

    add(item: T): void {
        if (this.items.some(existing => existing.id == item.id)) {
            throw new Error(`Item dengan ID ${item.id} sudah ada`);
        }
        this.items.push(item);
    }

    findById(id: number): T | undefined {
        return this.items.find(item => item.id == id);
    }

    getAll(): T[] {
        return [...this.items]; // Spread operator return copy, bukan reference
    }

    update(item: T): void {
        const index = this.items.findIndex(existing => existing.id == item.id);
        if (index == -1) {
            throw new Error(`Item dengan ID ${item.id} tidak ditemukan`);
        }
        this.items[index] = item;
    }

    delete(id: number): boolean {
        const index = this.items.findIndex(item => item.id == id);
        if (index == -1) return false;
        this.items.splice(index, 1);
        return true;
    }

    count(): number {
        return this.items.length;
    }

    /**
     * Abstract method yang HARUS diimplementasikan oleh setiap subclass.
     * Setiap entity punya cara search yang berbeda.
     */
    abstract search(keyword: string): T[];
}
