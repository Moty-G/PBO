import { Product } from "../models/Product.js";

/**
 * Analisis produk menggunakan collection operations.
 */
export class ProductAnalytics {
    constructor(private products: Product[]) { }

    /**
     * Produk dengan stok rendah, diurutkan dari stok terendah.
     * Menggunakan: filter + sort
     */
    getLowStockProducts(threshold: number = 5): Product[] {
        return this.products
            .filter(p => p.stock <= threshold && p.isActive)
            .sort((a, b) => a.stock - b.stock);
    }

    /**
     * Group produk berdasarkan kategori.
     * Menggunakan: reduce + Map<number, Product[]>
     */
    getByCategory(): Map<number, Product[]> {
        return this.products.reduce((map, p) => {
            const list = map.get(p.categoryId) ?? [];
            list.push(p);
            map.set(p.categoryId, list);
            return map;
        }, new Map<number, Product[]>());
    }

    /**
     * Search produk berdasarkan nama atau SKU.
     * Menggunakan: filter + includes
     */
    searchProducts(keyword: string): Product[] {
        const lower = keyword.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.sku.toLowerCase().includes(lower)
        );
    }

    /**
     * Ringkasan statistik: total produk, total value, rata-rata harga.
     * Menggunakan: filter + reduce + length
     */
    getSummary(): {
        totalProducts: number;
        activeProducts: number;
        totalStockValue: number;
        averagePrice: number;
        lowStockCount: number;
    } {
        const active = this.products.filter(p => p.isActive);

        return {
            totalProducts: this.products.length,
            activeProducts: active.length,
            totalStockValue: active.reduce((sum, p) => sum + (p.price * p.stock), 0),
            averagePrice: active.length > 0
                ? active.reduce((sum, p) => sum + p.price, 0) / active.length
                : 0,
            lowStockCount: active.filter(p => p.isLowStock).length,
        };
    }

    /**
     * Top produk termahal.
     * Menggunakan: filter + sort + slice
     */
    getMostExpensive(n: number = 5): Product[] {
        return this.products
            .filter(p => p.isActive)
            .sort((a, b) => b.price - a.price)
            .slice(0, n);
    }
}
