import { User } from "./User.js";

export class Admin extends User {
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
}
