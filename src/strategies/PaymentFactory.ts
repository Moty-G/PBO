import { PaymentStrategy } from "../interfaces/PaymentStrategy.js";
import { CashPayment } from "./CashPayment.js";
import { QRISPayment } from "./QRISPayment.js";
import { TransferPayment } from "./TransferPayment.js";
import { CreditCardPayment } from "./CreditCardPayment.js";

/**
 * Discriminated Union type untuk PaymentOptions agar type-safe.
 */
export type PaymentConfig =
    | { method: "CASH"; cashReceived: number }
    | { method: "QRIS" }
    | { method: "TRANSFER"; bankName?: string }
    | { method: "CREDIT_CARD"; cardNumber: string; expiryDate: string; cvv: string };

/**
 * Factory class untuk membuat PaymentStrategy.
 *
 * Keuntungan:
 * - Client code tidak perlu tahu concrete class mana yang dipakai
 * - Menambah payment method baru cukup edit di sini + buat class baru
 * - Return type selalu PaymentStrategy (interface), bukan concrete type
 */
export class PaymentFactory {
    /**
     * Buat instance PaymentStrategy berdasarkan PaymentConfig (type-safe).
     * @param config PaymentConfig discriminated union
     * @returns PaymentStrategy interface type, bukan concrete type
     */
    static createFromConfig(config: PaymentConfig): PaymentStrategy {
        switch (config.method) {
            case "CASH":
                return new CashPayment(config.cashReceived);
            case "QRIS":
                return new QRISPayment();
            case "TRANSFER":
                return new TransferPayment(config.bankName);
            case "CREDIT_CARD":
                return new CreditCardPayment(config.cardNumber, config.expiryDate, config.cvv);
        }
    }

    /**
     * Buat instance PaymentStrategy berdasarkan nama method (dynamic).
     * @param method Nama payment method: "CASH", "QRIS", "TRANSFER", "CREDIT_CARD"
     * @param options Opsi tambahan
     * @returns PaymentStrategy interface type
     */
    static create(method: string, options: {
        cashReceived?: number;
        bankName?: string;
        cardNumber?: string;
        expiryDate?: string;
        cvv?: string;
    } = {}): PaymentStrategy {
        switch (method.toUpperCase()) {
            case "CASH":
                if (options.cashReceived === undefined) {
                    throw new Error("Cash payment membutuhkan 'cashReceived'");
                }
                return new CashPayment(options.cashReceived);
            case "QRIS":
                return new QRISPayment();
            case "TRANSFER":
                return new TransferPayment(options.bankName);
            case "CREDIT_CARD":
                if (!options.cardNumber || !options.expiryDate || !options.cvv) {
                    throw new Error("Credit card membutuhkan 'cardNumber', 'expiryDate', dan 'cvv'");
                }
                return new CreditCardPayment(options.cardNumber, options.expiryDate, options.cvv);
            default:
                throw new Error(
                    `Payment method '${method}' tidak dikenal.\nPilihan: ${PaymentFactory.getAvailableMethods().join(", ")}`
                );
        }
    }

    /**
     * Daftar payment methods yang tersedia.
     */
    static getAvailableMethods(): string[] {
        return ["CASH", "QRIS", "TRANSFER", "CREDIT_CARD"];
    }
}
