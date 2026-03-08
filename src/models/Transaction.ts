import { BaseModel } from "./BaseModel.js";

export interface TransactionItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export class Transaction extends BaseModel {
    private _code: string;
    private _userId: number;
    private _items: TransactionItem[] = [];
    private _totalAmount: number = 0;
    private _paymentMethod: string;
    private _status: string = "PENDING";
    private _transactionDate: Date;

    constructor(
        id: number,
        code: string,
        userId: number,
        paymentMethod: string = "CASH"
    ) {
        super(id);

        if (!code || code.trim().length === 0) {
            throw new Error("Kode transaksi tidak boleh kosong");
        }
        if (userId <= 0) {
            throw new Error("User ID harus lebih dari 0");
        }

        const validMethods = ["CASH", "DEBIT", "CREDIT", "QRIS"];
        if (!validMethods.includes(paymentMethod.toUpperCase())) {
            throw new Error(`Metode pembayaran tidak valid. Pilihan: ${validMethods.join(", ")}`);
        }

        this._code = code.trim().toUpperCase();
        this._userId = userId;
        this._paymentMethod = paymentMethod.toUpperCase();
        this._transactionDate = new Date();
    }

    // ==================== GETTER ====================
    get code(): string { return this._code; }
    get userId(): number { return this._userId; }
    get items(): TransactionItem[] { return [...this._items]; }
    get totalAmount(): number { return this._totalAmount; }
    get paymentMethod(): string { return this._paymentMethod; }
    get status(): string { return this._status; }
    get transactionDate(): Date { return this._transactionDate; }
    get itemCount(): number { return this._items.length; }

    // ==================== BUSINESS METHODS ====================

    /**
     * Menambahkan item ke transaksi.
     * Transaksi harus masih PENDING untuk bisa ditambah item.
     */
    addItem(productId: number, productName: string, price: number, quantity: number): void {
        if (this._status !== "PENDING") {
            throw new Error("Tidak bisa menambah item, transaksi sudah selesai atau dibatalkan");
        }
        if (productId <= 0) throw new Error("Product ID harus lebih dari 0");
        if (!productName || productName.trim().length === 0) throw new Error("Nama produk tidak boleh kosong");
        if (price <= 0) throw new Error("Harga harus lebih dari 0");
        if (quantity <= 0) throw new Error("Quantity harus positif");

        const subtotal = price * quantity;

        this._items.push({
            productId,
            productName: productName.trim(),
            price,
            quantity,
            subtotal
        });

        this.calculateTotal();
    }

    /**
     * Menghitung ulang total amount berdasarkan semua item.
     */
    calculateTotal(): number {
        this._totalAmount = this._items.reduce((sum, item) => sum + item.subtotal, 0);
        return this._totalAmount;
    }

    /**
     * Menyelesaikan transaksi - mengubah status menjadi COMPLETED.
     * Transaksi harus punya minimal 1 item.
     */
    complete(): void {
        if (this._status !== "PENDING") {
            throw new Error("Transaksi sudah selesai atau dibatalkan");
        }
        if (this._items.length === 0) {
            throw new Error("Tidak bisa menyelesaikan transaksi tanpa item");
        }
        this._status = "COMPLETED";
    }

    /**
     * Membatalkan transaksi.
     */
    cancel(): void {
        if (this._status === "COMPLETED") {
            throw new Error("Tidak bisa membatalkan transaksi yang sudah selesai");
        }
        this._status = "CANCELLED";
    }

    override toString(): string {
        const itemLines = this._items
            .map(item => `  - ${item.productName} x${item.quantity} = Rp ${item.subtotal.toLocaleString("id-ID")}`)
            .join("\n");

        return `[Transaction#${this.id}] ${this._code} | ${this._paymentMethod} | ${this._status}\n` +
            `  Kasir ID: ${this._userId}\n` +
            `  Tanggal: ${this._transactionDate.toLocaleString("id-ID")}\n` +
            `  Items (${this._items.length}):\n${itemLines}\n` +
            `  TOTAL: Rp ${this._totalAmount.toLocaleString("id-ID")}`;
    }
}
