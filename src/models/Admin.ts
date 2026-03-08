import { User } from "./User.js";

export class Admin extends User {
    /** Daftar semua fitur yang tersedia di sistem. */
    private static ALL_FEATURES = [
        "transaction",
        "view_products",
        "view_categories",
        "view_reports",
        "manage_products",
        "manage_categories",
        "manage_users"
    ];

    constructor(id: number, username: string, password: string, fullName: string) {
        super(id, username, password, fullName);
    }

    /** Admin selalu return "ADMIN". */
    override getRole(): string {
        return "ADMIN";
    }

    /** Admin punya akses ke SEMUA fitur. */
    override hasAccess(_feature: string): boolean {
        return true;
    }

    /** Admin bisa akses semua fitur. */
    override getPermissionList(): string[] {
        return [...Admin.ALL_FEATURES];
    }

    /** Override toString() dengan badge [SUPER ADMIN]. */
    override toString(): string {
        const status = this.isActive ? "Active" : "Inactive";
        return `[SUPER ADMIN#${this.id}] ${this.username} (${this.fullName}) | ${status}`;
    }
}
