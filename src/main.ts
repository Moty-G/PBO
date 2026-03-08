import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { CategoryRepository } from "./repositories/CategoryRepository.js";

console.log("== SETUP DATA ==\n");

const categoryRepo = new CategoryRepository();
const productRepo = new ProductRepository();

categoryRepo.add(new Category(1, "Makanan", "Kategori makanan"));
categoryRepo.add(new Category(2, "Minuman", "Kategori minuman"));
categoryRepo.add(new Category(3, "Snack", "Kategori snack"));

const products = [
  new Product(1, "FD001", "Nasi Goreng", 15_000, 50, 1, "Nasi goreng spesial"),
  new Product(2, "BV001", "Teh Botol", 5_000, 3, 2, "Teh botol sosro"),
  new Product(3, "SN001", "Chitato", 10_000, 30, 3, "Chitato rasa sapi panggang"),
  new Product(4, "FD002", "Mie Goreng", 12_000, 2, 1, "Mie goreng spesial"),
  new Product(5, "BV002", "Kopi Susu", 8_000, 100, 2, "Kopi susu gula aren")
];

for (const product of products) {
  productRepo.add(product);
}

console.log(`Categories: ${categoryRepo.count()}`);
console.log(`Products: ${productRepo.count()}`);

console.log("\n== TEST REPOSITORY ==\n");

const found = productRepo.findById(1);
console.log(`findById(1): ${found?.toString() ?? "Not found"}`);

console.log("\nSearch 'goreng':");
const searchResults = productRepo.search("goreng");
for (const p of searchResults) {
  console.log(`- ${p.toDisplayString()}`);
}

console.log("\n== TEST DISPLAYABLE ==\n");
const nasiGoreng = productRepo.findById(1);
if (nasiGoreng) {
  console.log("Display String:");
  console.log(nasiGoreng.toDisplayString());
  console.log("\nDetail String:");
  console.log(nasiGoreng.toDetailString());
}

console.log("\n== TEST ABSTRACT CLASS ==\n");
// const baseRepo = new BaseRepository<Product>(); // Error! Cannot instantiate abstract class

console.log(`Before delete: ${productRepo.count()} products`);
productRepo.delete(5);
console.log(`After delete: ${productRepo.count()} products`);

try {
  productRepo.add(new Product(1, "XX001", "Duplicate", 1000, 10, 1));
} catch (err) {
  console.log(`\nError (expected): ${(err as Error).message}`);
}

console.log("\n== SEMUA TEST SELESAI ==");