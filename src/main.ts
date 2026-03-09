import { PaymentStrategy } from "./interfaces/PaymentStrategy.js";
import { CashPayment } from "./strategies/CashPayment.js";
import { QRISPayment } from "./strategies/QRISPayment.js";
import { TransferPayment } from "./strategies/TransferPayment.js";
import { PaymentFactory } from "./strategies/PaymentFactory.js";

const AMOUNT = 35_000; // Rp 35.000 jumlah yang akan dibayar

console.log("=== TEST INDIVIDUAL PAYMENT ===\n");

// 1. Cash uang cukup
const cash = new CashPayment(50_000);
const cashResult = cash.processPayment(AMOUNT);
console.log(`[${cash.methodName}] ${cashResult.message}`);
console.log(`Code: ${cashResult.transactionCode}`);
console.log(`Kembalian: Rp ${cashResult.changeAmount?.toLocaleString("id-ID")}`);

// 2. Cash uang tidak cukup
console.log();
const cashInsufficient = new CashPayment(20_000);
const failResult = cashInsufficient.processPayment(AMOUNT);
console.log(`[${cashInsufficient.methodName}] ${failResult.message}`);
console.log(`Success: ${failResult.success}`);

// 3. QRIS
console.log();
const qris = new QRISPayment();
const qrisResult = qris.processPayment(AMOUNT);
console.log(`[${qris.methodName}] ${qrisResult.message}`);

// 4. Transfer
console.log();
const transfer = new TransferPayment("BNI");
const transferResult = transfer.processPayment(AMOUNT);
console.log(`[${transfer.methodName}] ${transferResult.message}`);

// === POLYMORPHISM IN ACTION ===
console.log("\n=== POLYMORPHISM IN ACTION ===\n");

// Array bertipe PaymentStrategy[]
// bisa berisi class apapun yang implements PaymentStrategy
const strategies: PaymentStrategy[] = [
  PaymentFactory.create("CASH", { cashReceived: 50_000 }),
  PaymentFactory.create("QRIS"),
  PaymentFactory.create("TRANSFER", { bankName: "MANDIRI" }),
];

// Loop panggil processPayment() secara polymorphic
// Kita TIDAK TAHU concrete type setiap element, tapi TAHU pasti punya processPayment()
for (const strategy of strategies) {
  const result = strategy.processPayment(AMOUNT);
  const status = result.success ? "✅" : "❌";
  console.log(`${status} [${strategy.methodName.padEnd(10)}] ${result.message}`);
}

// === FACTORY PATTERN ===
console.log("\n=== FACTORY PATTERN ===\n");

console.log("Available methods:", PaymentFactory.getAvailableMethods().join(", "));

// Simulasi: user memilih payment method (input dari console)
const userChoices = [
  { method: "CASH", options: { cashReceived: 100_000 } },
  { method: "QRIS", options: {} },
  { method: "TRANSFER", options: { bankName: "BCA" } },
];

for (const choice of userChoices) {
  const strategy = PaymentFactory.create(choice.method, choice.options);
  const result = strategy.processPayment(75_000);
  console.log(`\nPayment: ${strategy.methodName}`);
  console.log(`Result: ${result.message}`);
  console.log(`Code: ${result.transactionCode}`);
}

// Test unknown payment method
try {
  PaymentFactory.create("BITCOIN");
} catch (err) {
  console.log(`\nError (expected): ${(err as Error).message}`);
}

// === POLYMORPHISM POWER ===
console.log("\n=== POLYMORPHISM POWER ===\n");

/**
 * Fungsi ini menerima PaymentStrategy (interface), bukan concrete type.
 * Bisa dipakai untuk payment method APAPUN sekarang dan di masa depan.
 * Ini adalah kekuatan polymorphism: kode yang terbuka untuk extension.
 */
function processCheckout(
  items: { name: string; price: number; qty: number }[],
  strategy: PaymentStrategy
): void {
  console.log("--- RECEIPT ---");
  let total = 0;
  for (const item of items) {
    const subtotal = item.price * item.qty;
    console.log(`${item.name} x${item.qty} = Rp ${subtotal.toLocaleString("id-ID")}`);
    total += subtotal;
  }

  console.log(`TOTAL: Rp ${total.toLocaleString("id-ID")}`);

  const result = strategy.processPayment(total);
  console.log(`Payment [${strategy.methodName}]: ${result.success ? "SUCCESS" : "FAILED"}`);
  console.log(`${result.message}`);
  console.log("--- END ---\n");
}

const sampleItems = [
  { name: "Nasi Goreng", price: 15_000, qty: 2 },
  { name: "Teh Botol", price: 5_000, qty: 3 },
];

// Proses checkout yang SAMA, tapi payment method BERBEDA
processCheckout(sampleItems, PaymentFactory.create("CASH", { cashReceived: 50_000 }));
processCheckout(sampleItems, PaymentFactory.create("QRIS"));
processCheckout(sampleItems, PaymentFactory.create("TRANSFER"));

console.log("=== SEMUA TEST SELESAI ===");