import { BaseRepository } from "./BaseRepository.js";
import { Product } from "../models/Product.js";

export class ProductRepository extends BaseRepository<Product> {
    /**
     * Search produk berdasarkan nama atau SKU.
     * Implementasi abstract method dari BaseRepository.
     */
    search(keyword: string): Product[] {
        const lower = keyword.toLowerCase();
        return this.items.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.sku.toLowerCase().includes(lower)
        );
    }

    findBySku(sku: string): Product | undefined {
        return this.items.find(p => p.sku == sku.toUpperCase());
    }

    findByCategory(categoryId: number): Product[] {
        return this.items.filter(p => p.categoryId === categoryId);
    }

    findActive(): Product[] {
        return this.items.filter(p => p.isActive);
    }

    findLowStock(threshold: number = 5): Product[] {
        return this.items.filter(p => p.stock <= threshold && p.isActive);
    }
}
