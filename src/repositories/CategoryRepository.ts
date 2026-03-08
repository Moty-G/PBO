import { BaseRepository } from "./BaseRepository.js";
import { Category } from "../models/Category.js";

export class CategoryRepository extends BaseRepository<Category> {
    /** Search kategori berdasarkan nama. */
    search(keyword: string): Category[] {
        const lower = keyword.toLowerCase();
        return this.items.filter(c =>
            c.name.toLowerCase().includes(lower)
        );
    }

    findByName(name: string): Category | undefined {
        return this.items.find(c =>
            c.name.toLowerCase() === name.toLowerCase()
        );
    }
}
