import { User } from "./User.js";

export class Cashier extends User {
    /** Daftar fitur yang boleh diakses Cashier. Static karena berlaku untuk SEMUA instance Cashier. */
    private static ALLOWED_FEATURES = [
        "transaction",
        "view_products",
        "view_categories"
    ];

    constructor(id: number, username: string, password: string, fullName: string) {
        super(id, username, password, fullName);
    }

    override getRole(): string {
        return "CASHIER";
    }

    /** Cashier hanya boleh akses fitur yang ada di ALLOWED_FEATURES. */
    override hasAccess(feature: string): boolean {
        return Cashier.ALLOWED_FEATURES.includes(feature);
    }

    /** Mengembalikan daftar fitur yang bisa diakses Cashier. */
    override getPermissionList(): string[] {
        return [...Cashier.ALLOWED_FEATURES];
    }
}
