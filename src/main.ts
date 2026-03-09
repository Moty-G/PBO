import { seedCategories, seedProducts, seedTransactions } from "./data/SeedData.js";
import { SalesReport } from "./reports/SalesReport.js";
import { ProductAnalytics } from "./reports/ProductAnalytics.js";

// === SEED DATA ===
const categories = seedCategories();
const products = seedProducts();
const transactions = seedTransactions();

console.log(`Loaded: ${categories.length} categories, ${products.length} products, ${transactions.length} transactions\n`);

// === SALES REPORT ===
console.log("=== SALES REPORT ===\n");

const salesReport = new SalesReport(transactions);

// Total Revenue
console.log(`Total Revenue: Rp ${salesReport.totalRevenue().toLocaleString("id-ID")}`);
console.log(`Successful Transactions: ${salesReport.successfulTransactionCount()}`);

// Revenue by Payment Method
console.log("\nRevenue by Payment Method:");
const revenueByMethod = salesReport.revenueByPaymentMethod();
for (const [method, revenue] of revenueByMethod) {
  console.log(`- ${method.padEnd(10)}: Rp ${revenue.toLocaleString("id-ID")}`);
}

// Top Selling Products
console.log("\nTop 5 Selling Products:");
const topProducts = salesReport.topSellingProducts(5);
for (const [i, product] of topProducts.entries()) {
  console.log(
    `${i + 1}. ${product.productName.padEnd(20)} | ` +
    `Qty: ${String(product.qtySold).padStart(3)} | ` +
    `Revenue: Rp ${product.revenue.toLocaleString("id-ID")}`
  );
}

// Daily Summary
console.log("\nDaily Summary (2026-02-01):");
const feb1 = salesReport.dailySummary("2026-02-01");
console.log(`- Transactions: ${feb1.count}`);
console.log(`- Revenue: Rp ${feb1.revenue.toLocaleString("id-ID")}`);

// Daily Revenue
console.log("\nDaily Revenue:");
const dailyRevenue = salesReport.dailyRevenue();
for (const [date, revenue] of dailyRevenue) {
  const bar = "█".repeat(Math.round(revenue / 10_000));
  console.log(`- ${date} | Rp ${String(revenue.toLocaleString("id-ID")).padStart(10)} | ${bar}`);
}

// CSV Export
console.log("\nCSV Export (first 5 lines):");
const csv = salesReport.exportToCSV();
const csvLines = csv.split("\n");
for (const line of csvLines.slice(0, 6)) {
  console.log(line);
}

// === PRODUCT ANALYTICS ===
console.log("\n=== PRODUCT ANALYTICS ===\n");

const analytics = new ProductAnalytics(products);

// Summary
const summary = analytics.getSummary();
console.log("Product Summary:");
console.log(`- Total Products: ${summary.totalProducts}`);
console.log(`- Active Products: ${summary.activeProducts}`);
console.log(`- Total Stock Value: Rp ${summary.totalStockValue.toLocaleString("id-ID")}`);
console.log(`- Average Price: Rp ${summary.averagePrice.toLocaleString("id-ID")}`);
console.log(`- Low Stock Count: ${summary.lowStockCount}`);

// Low Stock
console.log("\nLow Stock Products:");
const lowStock = analytics.getLowStockProducts();
for (const p of lowStock) {
  console.log(`- [${p.sku}] ${p.name}: ${p.stock} remaining`);
}

// By Category
console.log("\nProducts by Category:");
const byCategory = analytics.getByCategory();
for (const [catId, prods] of byCategory) {
  const catName = categories.find(c => c.id === catId)?.name ?? "Unknown";
  console.log(`[${catName}]`);
  for (const p of prods) {
    console.log(`  - ${p.name} (Rp ${p.price.toLocaleString("id-ID")})`);
  }
}

// Most Expensive
console.log("\nTop 3 Most Expensive Products:");
const expensive = analytics.getMostExpensive(3);
for (const p of expensive) {
  console.log(`- ${p.name}: Rp ${p.price.toLocaleString("id-ID")}`);
}

// Search
console.log("\nSearch 'nasi':");
const searchResults = analytics.searchProducts("nasi");
for (const p of searchResults) {
  console.log(`- [${p.sku}] ${p.name}`);
}

console.log("\n=== SEMUA TEST SELESAI ===");