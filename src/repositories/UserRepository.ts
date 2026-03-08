import { BaseRepository } from "./BaseRepository.js";
import { User } from "../models/User.js";

export class UserRepository extends BaseRepository<User> {
    /** Search user berdasarkan username atau fullName. */
    search(keyword: string): User[] {
        const lower = keyword.toLowerCase();
        return this.items.filter(u =>
            u.username.toLowerCase().includes(lower) ||
            u.fullName.toLowerCase().includes(lower)
        );
    }

    findByUsername(username: string): User | undefined {
        return this.items.find(u =>
            u.username.toLowerCase() === username.toLowerCase()
        );
    }

    findByRole(role: string): User[] {
        return this.items.filter(u =>
            u.getRole().toUpperCase() === role.toUpperCase()
        );
    }
}
