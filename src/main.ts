import { BaseModel } from "./models/BaseModel.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { Admin } from "./models/Admin.js";
import { Cashier } from "./models/Cashier.js";
import { Supervisor } from "./models/Supervisor.js";
import { Transaction } from "./models/Transaction.js";

console.log("=== TEST INHERITANCE ===\n");

const product = new Product(1, "FD001", "Nasi Goreng", 15_000, 50, 1);
const category = new Category(1, "Makanan");

// toString() dari BaseModel di-override oleh masing-masing subclass
console.log(product.toString());
console.log(category.toString());

// instanceof check inheritance chain
console.log(`product instanceof Product: ${product instanceof Product}`); // true
console.log(`product instanceof BaseModel: ${product instanceof BaseModel}`); // true

console.log("\n=== TEST USER HIERARCHY ===\n");

const admin = new Admin(1, "admin", "admin123", "Administrator");
const kasir = new Cashier(2, "kasir01", "kasir123", "Siti Rahayu");
const spv = new Supervisor(3, "spv01", "spv12345", "Budi Santoso");

console.log(admin.toString());
// Output: [SUPER ADMIN#1] admin (Administrator) | Active

console.log(kasir.toString());
// Output: [CASHIER#2] kasir01 (Siti Rahayu) | Active

console.log(spv.toString());
// Output: [SUPERVISOR#3] spv01 (Budi Santoso) | Active

console.log("\n--- Access Control ---");
const features = ["transaction", "view_products", "manage_users", "view_reports"];

for (const feature of features) {
  const adminAccess = admin.hasAccess(feature) ? "✓" : "✗";
  const spvAccess = spv.hasAccess(feature) ? "✓" : "✗";
  const kasirAccess = kasir.hasAccess(feature) ? "✓" : "✗";
  console.log(`${feature.padEnd(20)} Admin: ${adminAccess}  Supervisor: ${spvAccess}  Kasir: ${kasirAccess}`);
}

console.log("\n--- Permission List ---");
console.log(`Admin permissions:      ${admin.getPermissionList().join(", ")}`);
console.log(`Supervisor permissions: ${spv.getPermissionList().join(", ")}`);
console.log(`Cashier permissions:    ${kasir.getPermissionList().join(", ")}`);

console.log("\n--- Instanceof Chain ---");
console.log(`admin instanceof Admin: ${admin instanceof Admin}`); // true
console.log(`admin instanceof User: ${admin instanceof User}`); // true
console.log(`admin instanceof BaseModel: ${admin instanceof BaseModel}`); // true
console.log(`spv instanceof Supervisor: ${spv instanceof Supervisor}`); // true
console.log(`spv instanceof User: ${spv instanceof User}`); // true

console.log("\n--- POLYMORPHIC ARRAY ---");
const users: User[] = [admin, spv, kasir];

for (const user of users) {
  console.log(`${user.getRole().padEnd(12)} ${user.fullName.padEnd(20)} transaction: ${user.hasAccess("transaction")}`);
}

// ==================== TEST TRANSACTION ====================
console.log("\n=== TEST TRANSACTION ===\n");

const trx = new Transaction(1, "TRX-001", 2, "CASH");
console.log(`Transaksi dibuat: ${trx.code} | Status: ${trx.status}`);

// Tambah item
trx.addItem(1, "Nasi Goreng", 15_000, 2);
trx.addItem(2, "Teh Botol", 5_000, 3);
trx.addItem(3, "Es Jeruk", 8_000, 1);

console.log(`\nJumlah item: ${trx.itemCount}`);
console.log(`Total: Rp ${trx.totalAmount.toLocaleString("id-ID")}`);

// Tampilkan ringkasan transaksi
console.log("\n--- Ringkasan Transaksi ---");
console.log(trx.toString());

// Complete transaksi
trx.complete();
console.log(`\nStatus setelah complete: ${trx.status}`);

// Test: tidak bisa tambah item setelah complete
try {
  trx.addItem(4, "Mie Goreng", 12_000, 1);
} catch (err) {
  console.log(`Error (expected): ${(err as Error).message}`);
}

// Test: tidak bisa complete lagi
try {
  trx.complete();
} catch (err) {
  console.log(`Error (expected): ${(err as Error).message}`);
}

// Test cancel
console.log("\n--- Test Cancel Transaksi ---");
const trx2 = new Transaction(2, "TRX-002", 2, "QRIS");
trx2.addItem(1, "Nasi Goreng", 15_000, 1);
console.log(`Status sebelum cancel: ${trx2.status}`);
trx2.cancel();
console.log(`Status setelah cancel: ${trx2.status}`);

// instanceof check
console.log(`\ntrx instanceof Transaction: ${trx instanceof Transaction}`);
console.log(`trx instanceof BaseModel: ${trx instanceof BaseModel}`);

console.log("\n=== SEMUA TEST SELESAI ===");