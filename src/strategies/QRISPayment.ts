import { PaymentStrategy, PaymentResult } from "../interfaces/PaymentStrategy.js";

/**
 * Pembayaran QRIS (simulasi).
 * Dalam implementasi nyata, ini akan generate QR code dan menunggu konfirmasi.
 * Untuk praktikum, kita simulasikan pembayaran selalu berhasil.
 */
export class QRISPayment implements PaymentStrategy {
    readonly methodName = "QRIS";

    validatePayment(amount: number): boolean {
        // QRIS selalu valid selama jumlah > 0
        // (dalam realita, ada limit transaksi QRIS)
        return amount > 0 && amount <= 5_000_000; // Simulasi limit QRIS Rp 5 juta
    }

    processPayment(amount: number): PaymentResult {
        if (amount <= 0) {
            return {
                success: false,
                message: "Jumlah pembayaran harus lebih dari 0",
                transactionCode: "",
            };
        }

        if (!this.validatePayment(amount)) {
            return {
                success: false,
                message: `Transaksi QRIS maksimal Rp 5.000.000.\nJumlah: Rp ${amount.toLocaleString("id-ID")}`,
                transactionCode: "",
            };
        }

        // Simulasi: generate QR payload dan auto-success
        const transactionCode = `QR-${Date.now()}`;

        return {
            success: true,
            message: `QRIS Rp ${amount.toLocaleString("id-ID")} pembayaran dikonfirmasi.\nQR Payload: ${transactionCode}`,
            transactionCode,
        };
    }

    getPaymentSummary(): string {
        return `[QRIS] Limit: Rp 5.000.000 per transaksi`;
    }
}
