import { User } from "./User.js";

export class Supervisor extends User {
    /** Daftar fitur yang boleh diakses Supervisor - semua kecuali manage_users. */
    private static ALLOWED_FEATURES = [
        "transaction",
        "view_products",
        "view_categories",
        "view_reports",
        "manage_products",
        "manage_categories"
    ];

    constructor(id: number, username: string, password: string, fullName: string) {
        super(id, username, password, fullName);
    }

    override getRole(): string {
        return "SUPERVISOR";
    }

    /** Supervisor bisa akses semua kecuali manage_users. */
    override hasAccess(feature: string): boolean {
        if (feature === "manage_users") return false;
        return true;
    }

    override getPermissionList(): string[] {
        return [...Supervisor.ALLOWED_FEATURES];
    }
}
