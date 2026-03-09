import { PaymentStrategy, PaymentResult } from "../interfaces/PaymentStrategy.js";

/**
 * Pembayaran kartu kredit (simulasi).
 * Validasi nomor kartu (16 digit), expiry date, dan CVV.
 */
export class CreditCardPayment implements PaymentStrategy {
    readonly methodName = "CREDIT_CARD";
    private cardNumber: string;
    private expiryDate: string;
    private cvv: string;

    constructor(cardNumber: string, expiryDate: string, cvv: string) {
        const cleanCard = cardNumber.replace(/\s|-/g, "");
        if (!/^\d{16}$/.test(cleanCard)) {
            throw new Error("Nomor kartu harus 16 digit angka");
        }
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            throw new Error("Format expiry date harus MM/YY");
        }
        if (!/^\d{3}$/.test(cvv)) {
            throw new Error("CVV harus 3 digit angka");
        }

        this.cardNumber = cleanCard;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
    }

    validatePayment(amount: number): boolean {
        // Simulasi: kartu selalu valid selama jumlah > 0
        return amount > 0;
    }

    processPayment(amount: number): PaymentResult {
        if (amount <= 0) {
            return {
                success: false,
                message: "Jumlah pembayaran harus lebih dari 0",
                transactionCode: "",
            };
        }

        const maskedCard = `****-****-****-${this.cardNumber.slice(-4)}`;
        const transactionCode = `CC-${Date.now()}`;

        return {
            success: true,
            message: `Pembayaran kartu kredit berhasil.\nKartu: ${maskedCard}\nJumlah: Rp ${amount.toLocaleString("id-ID")}`,
            transactionCode,
        };
    }

    getPaymentSummary(): string {
        const maskedCard = `****-****-****-${this.cardNumber.slice(-4)}`;
        return `[CREDIT CARD] Kartu: ${maskedCard} | Exp: ${this.expiryDate}`;
    }
}
