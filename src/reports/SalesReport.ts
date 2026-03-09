import { Transaction, TransactionDetail } from "../models/Transaction.js";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";

/**
 * Sales Report - semua method menggunakan collection operations.
 * TIDAK ADA loop for manual di class ini.
 */
export class SalesReport {
    constructor(private transactions: Transaction[]) { }

    /**
     * Total revenue dari transaksi yang berhasil (SUCCESS).
     * Menggunakan: filter + reduce
     */
    totalRevenue(): number {
        return this.transactions
            .filter(t => t.status === "SUCCESS")
            .reduce((sum, t) => sum + t.totalAmount, 0);
    }

    /**
     * Jumlah transaksi yang berhasil.
     * Menggunakan: filter + length
     */
    successfulTransactionCount(): number {
        return this.transactions
            .filter(t => t.status === "SUCCESS")
            .length;
    }

    /**
     * Revenue breakdown per payment method.
     * Menggunakan: filter + reduce + Map<string, number>
     */
    revenueByPaymentMethod(): Map<string, number> {
        return this.transactions
            .filter(t => t.status === "SUCCESS")
            .reduce((map, t) => {
                const current = map.get(t.paymentMethod) ?? 0;
                map.set(t.paymentMethod, current + t.totalAmount);
                return map;
            }, new Map<string, number>());
    }

    /**
     * Top selling products berdasarkan quantity.
     * Menggunakan: filter + flatMap + reduce (grouping) + sort + slice
     */
    topSellingProducts(n: number = 5): { productName: string; qtySold: number; revenue: number }[] {
        // 1. flatMap: kumpulkan semua items dari semua transaksi sukses
        const allItems = this.transactions
            .filter(t => t.status === "SUCCESS")
            .flatMap(t => t.items);

        // 2. reduce: group by productName, aggregate qty dan revenue
        const grouped = allItems.reduce((map, item) => {
            const key = item.productName;
            const existing = map.get(key) ?? { productName: key, qtySold: 0, revenue: 0 };

            existing.qtySold += item.quantity;
            existing.revenue += item.subtotal;

            map.set(key, existing);
            return map;
        }, new Map<string, { productName: string; qtySold: number; revenue: number }>());

        // 3. sort by quantity (descending) + take top n
        return Array.from(grouped.values())
            .sort((a, b) => b.qtySold - a.qtySold)
            .slice(0, n);
    }

    /**
     * Filter transaksi berdasarkan date range.
     * Menggunakan: filter
     */
    transactionsByDateRange(start: Date, end: Date): Transaction[] {
        return this.transactions.filter(t =>
            t.transactionDate >= start && t.transactionDate < end
        );
    }

    /**
     * Ringkasan harian: jumlah transaksi dan total revenue.
     * Menggunakan: filter + reduce
     */
    dailySummary(dateString: string): { count: number; revenue: number } {
        const dayTrx = this.transactions
            .filter(t =>
                t.transactionDate.toISOString().startsWith(dateString) &&
                t.status === "SUCCESS"
            );

        return {
            count: dayTrx.length,
            revenue: dayTrx.reduce((sum, t) => sum + t.totalAmount, 0),
        };
    }

    /**
     * Revenue per hari - untuk grafik/chart.
     * Menggunakan: filter + reduce + Map<string, number> + sort
     */
    dailyRevenue(): Map<string, number> {
        const dailyMap = this.transactions
            .filter(t => t.status === "SUCCESS")
            .reduce((map, t) => {
                const dateKey = t.transactionDate.toISOString().slice(0, 10);
                const current = map.get(dateKey) ?? 0;
                map.set(dateKey, current + t.totalAmount);
                return map;
            }, new Map<string, number>());

        // Sort by date
        return new Map(
            Array.from(dailyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))
        );
    }

    /**
     * Export data transaksi ke CSV string (termasuk detail items).
     * Menggunakan: filter + flatMap + map + join
     */
    exportToCSV(): string {
        const header = "Kode,Tanggal,Payment Method,Total,Status";

        const rows = this.transactions
            .filter(t => t.status === "SUCCESS")
            .map(t => [
                t.code,
                t.transactionDate.toISOString().slice(0, 10),
                t.paymentMethod,
                t.totalAmount,
                t.status
            ].join(","));

        return [header, ...rows].join("\n");
    }

    /**
     * Distribusi transaksi per jam.
     * Menggunakan: filter + reduce + Map<number, number>
     */
    getHourlyDistribution(): Map<number, number> {
        return this.transactions
            .filter(t => t.status === "SUCCESS")
            .reduce((map, t) => {
                const hour = t.transactionDate.getHours();
                const current = map.get(hour) ?? 0;
                map.set(hour, current + 1);
                return map;
            }, new Map<number, number>());
    }

    /**
     * Perbandingan performa 2 hari.
     * Menggunakan: filter + reduce
     */
    compareDaily(date1: string, date2: string): {
        date1: { date: string; count: number; revenue: number };
        date2: { date: string; count: number; revenue: number };
        revenueDiff: number;
        countDiff: number;
    } {
        const summary1 = this.dailySummary(date1);
        const summary2 = this.dailySummary(date2);

        return {
            date1: { date: date1, ...summary1 },
            date2: { date: date2, ...summary2 },
            revenueDiff: summary2.revenue - summary1.revenue,
            countDiff: summary2.count - summary1.count,
        };
    }

    /**
     * Revenue per kategori - menggabungkan data transaksi, produk, dan kategori.
     * Menggunakan: filter + flatMap + reduce + Map
     */
    getRevenueByCategory(categories: Category[], products: Product[]): Map<string, number> {
        // Buat lookup: productId → categoryId
        const productCategoryMap = products.reduce((map, p) => {
            map.set(p.id, p.categoryId);
            return map;
        }, new Map<number, number>());

        // Buat lookup: categoryId → categoryName
        const categoryNameMap = categories.reduce((map, c) => {
            map.set(c.id, c.name);
            return map;
        }, new Map<number, string>());

        // Aggregate revenue per category
        return this.transactions
            .filter(t => t.status === "SUCCESS")
            .flatMap(t => t.items)
            .reduce((map, item) => {
                const categoryId = productCategoryMap.get(item.productId) ?? 0;
                const categoryName = categoryNameMap.get(categoryId) ?? "Unknown";
                const current = map.get(categoryName) ?? 0;
                map.set(categoryName, current + item.subtotal);
                return map;
            }, new Map<string, number>());
    }
}
