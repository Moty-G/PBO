/**
 * Hasil dari proses pembayaran.
 * Interface ini menstandarisasi response dari semua payment method.
 */
export interface PaymentResult {
    success: boolean;
    message: string;
    transactionCode: string;
    changeAmount?: number; // Opsional hanya untuk cash payment
}

/**
 * Kontrak untuk semua payment method.
 * Setiap payment method HARUS mengimplementasikan interface ini.
 *
 * Mengapa interface, bukan abstract class?
 * - Tidak ada shared state antar payment methods
 * - Tidak ada default implementation yang masuk akal untuk semua
 * - Satu class bisa implement multiple interface (fleksibilitas)
 */
export interface PaymentStrategy {
    /** Nama method pembayaran (readonly tidak boleh diubah setelah inisialisasi) */
    readonly methodName: string;

    /**
     * Proses pembayaran dengan jumlah tertentu.
     * @param amount Jumlah yang harus dibayar (dalam Rupiah)
     * @returns PaymentResult berisi status dan detail pembayaran
     */
    processPayment(amount: number): PaymentResult;

    /**
     * Validasi apakah pembayaran bisa dilakukan.
     * @param amount Jumlah yang akan divalidasi
     * @returns true jika pembayaran valid/bisa dilakukan
     */
    validatePayment(amount: number): boolean;

    /**
     * Mengembalikan ringkasan informasi payment method.
     * @returns String berisi detail payment method
     */
    getPaymentSummary(): string;
}
