import { BaseRepository } from "./BaseRepository.js";
import { Transaction } from "../models/Transaction.js";

export class TransactionRepository extends BaseRepository<Transaction> {
    /** Search transaksi berdasarkan kode transaksi. */
    search(keyword: string): Transaction[] {
        const lower = keyword.toLowerCase();
        return this.items.filter(t =>
            t.code.toLowerCase().includes(lower)
        );
    }

    findByDate(date: string): Transaction[] {
        return this.items.filter(t => {
            const trxDate = t.transactionDate.toLocaleDateString("id-ID");
            return trxDate === date;
        });
    }

    findByUserId(userId: number): Transaction[] {
        return this.items.filter(t => t.userId === userId);
    }

    findByStatus(status: string): Transaction[] {
        return this.items.filter(t =>
            t.status.toUpperCase() === status.toUpperCase()
        );
    }
}
