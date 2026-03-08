import { BaseModel } from "./models/BaseModel.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { Admin } from "./models/Admin.js";
import { Cashier } from "./models/Cashier.js";

console.log("=== TEST INHERITANCE ===\n");

const product = new Product(1, "FD001", "Nasi Goreng", 15_000, 50, 1);
const category = new Category(1, "Makanan");

// toString() dari BaseModel di-override oleh masing-masing subclass
console.log(product.toString());
// Output: [Product#1] FD001 Nasi Goreng | Rp 15.000 | Stok: 50 | Active

console.log(category.toString());
// Output: [Category#1] Makanan

// instanceof check inheritance chain
console.log(`product instanceof Product: ${product instanceof Product}`); // true
console.log(`product instanceof BaseModel: ${product instanceof BaseModel}`); // true

console.log("\nTEST USER HIERARCHY\n");

const admin = new Admin(1, "admin", "admin123", "Administrator");
const kasir = new Cashier(2, "kasir01", "kasir123", "Siti Rahayu");

console.log(admin.toString());
// Output: [ADMIN#1] admin (Administrator) | Active

console.log(kasir.toString());
// Output: [CASHIER#2] kasir01 (Siti Rahayu) | Active

console.log("\n- Access Control -");
const features = ["transaction", "view_products", "manage_users", "view_reports"];

for (const feature of features) {
  const adminAccess = admin.hasAccess(feature) ? "✓" : "✗";
  const kasirAccess = kasir.hasAccess(feature) ? "✓" : "✗";
  console.log(`${feature.padEnd(20)} Admin: ${adminAccess} Kasir: ${kasirAccess}`);
}

console.log("\n--- Instanceof Chain ---");
console.log(`admin instanceof Admin: ${admin instanceof Admin}`); // true
console.log(`admin instanceof User: ${admin instanceof User}`); // true
console.log(`admin instanceof BaseModel: ${admin instanceof BaseModel}`); // true

console.log("\n--- POLYMORPHIC ARRAY ---");
const users: User[] = [admin, kasir];

for (const user of users) {
  console.log(`${user.getRole().padEnd(10)} ${user.fullName.padEnd(20)} transaction: ${user.hasAccess("transaction")}`);
}
// Meskipun array bertipe User[], method yang dipanggil adalah milik subclass masing-masing. Ini adalah POLYMORPHISM.

console.log("\nSEMUA TEST SELESAI");