import { PaymentStrategy } from "../interfaces/PaymentStrategy.js";
import { ProductRepository } from "../repositories/ProductRepository.js";

/**
 * Service untuk memproses checkout/transaksi.
 * Menerima PaymentStrategy secara polymorphic.
 */
export class TransactionService {
    private productRepo: ProductRepository;

    constructor(productRepo: ProductRepository) {
        this.productRepo = productRepo;
    }

    /**
     * Proses checkout dari cart.
     * Method ini menerima PaymentStrategy secara polymorphic (bukan concrete type).
     * @param cart Array berisi productId dan quantity
     * @param paymentStrategy PaymentStrategy interface - bisa CashPayment, QRISPayment, dll
     */
    checkout(
        cart: { productId: number; quantity: number }[],
        paymentStrategy: PaymentStrategy
    ): void {
        if (cart.length === 0) {
            console.log("Cart kosong, tidak ada yang di-checkout");
            return;
        }

        console.log("--- RECEIPT ---");
        let total = 0;

        for (const item of cart) {
            const product = this.productRepo.findById(item.productId);
            if (!product) {
                console.log(`Produk ID ${item.productId} tidak ditemukan, skip.`);
                continue;
            }

            const subtotal = product.price * item.quantity;
            console.log(`${product.name} x${item.quantity} = Rp ${subtotal.toLocaleString("id-ID")}`);
            total += subtotal;
        }

        console.log(`TOTAL: Rp ${total.toLocaleString("id-ID")}`);

        // Proses pembayaran secara polymorphic
        const result = paymentStrategy.processPayment(total);
        console.log(`Payment [${paymentStrategy.methodName}]: ${result.success ? "SUCCESS" : "FAILED"}`);
        console.log(`${result.message}`);
        console.log("--- END ---\n");
    }
}
