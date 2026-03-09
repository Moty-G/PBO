import { PaymentStrategy, PaymentResult } from "../interfaces/PaymentStrategy.js";

/**
 * Pembayaran transfer bank (simulasi).
 * Generate nomor Virtual Account dummy dan simulasikan konfirmasi manual.
 */
export class TransferPayment implements PaymentStrategy {
    readonly methodName = "TRANSFER";
    private bankName: string;

    /** Daftar bank yang didukung */
    private static SUPPORTED_BANKS = ["BCA", "BNI", "BRI", "MANDIRI"];

    constructor(bankName: string = "BCA") {
        const upper = bankName.toUpperCase();
        if (!TransferPayment.SUPPORTED_BANKS.includes(upper)) {
            throw new Error(
                `Bank '${bankName}' tidak didukung.\nPilihan: ${TransferPayment.SUPPORTED_BANKS.join(", ")}`
            );
        }
        this.bankName = upper;
    }

    validatePayment(amount: number): boolean {
        // Transfer selalu valid selama jumlah > 0
        return amount > 0;
    }

    processPayment(amount: number): PaymentResult {
        if (amount <= 0) {
            return {
                success: false,
                message: "Jumlah pembayaran harus lebih dari 0",
                transactionCode: ""
            };
        }

        // Generate nomor VA dummy
        const vaNumber = this.generateVANumber();
        const transactionCode = `TRF-${Date.now()}`;

        return {
            success: true,
            message: `Transfer (${this.bankName}) berhasil.\nVA: ${vaNumber}\nJumlah: Rp ${amount.toLocaleString("id-ID")}`,
            transactionCode,
        };
    }

    getPaymentSummary(): string {
        return `[TRANSFER] Bank: ${this.bankName} | Banks tersedia: ${TransferPayment.SUPPORTED_BANKS.join(", ")}`;
    }

    /**
     * Generate nomor Virtual Account dummy.
     * Format: [kode bank 3 digit][10 digit random]
     */
    private generateVANumber(): string {
        const bankCodes: Record<string, string> = {
            BCA: "014",
            BNI: "009",
            BRI: "002",
            MANDIRI: "008",
        };

        const code = bankCodes[this.bankName] ?? "000";
        const random = Math.floor(Math.random() * 10_000_000_000)
            .toString()
            .padStart(10, "0");

        return `${code}${random}`;
    }

    /** Daftar bank yang didukung */
    static getSupportedBanks(): string[] {
        return [...TransferPayment.SUPPORTED_BANKS];
    }
}
