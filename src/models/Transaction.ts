import { BaseModel } from "./BaseModel.js";

export interface TransactionDetail {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export class Transaction extends BaseModel {
    private _code: string;
    private _userId: number;
    private _items: TransactionDetail[];
    private _totalAmount: number;
    private _paymentMethod: string;
    private _status: string;
    private _transactionDate: Date;

    constructor(
        id: number,
        code: string,
        userId: number,
        items: TransactionDetail[],
        totalAmount: number,
        paymentMethod: string,
        status: string = "SUCCESS",
        transactionDate: Date = new Date()
    ) {
        super(id);
        this._code = code;
        this._userId = userId;
        this._items = [...items]; // Copy array
        this._totalAmount = totalAmount;
        this._paymentMethod = paymentMethod;
        this._status = status;
        this._transactionDate = transactionDate;
    }

    get code(): string { return this._code; }
    get userId(): number { return this._userId; }
    get items(): TransactionDetail[] { return [...this._items]; }
    get totalAmount(): number { return this._totalAmount; }
    get paymentMethod(): string { return this._paymentMethod; }
    get status(): string { return this._status; }
    get transactionDate(): Date { return this._transactionDate; }

    override toString(): string {
        return `[TRX#${this.id}] ${this._code} | Rp ${this._totalAmount.toLocaleString("id-ID")} | ${this._paymentMethod} | ${this._status}`;
    }
}
