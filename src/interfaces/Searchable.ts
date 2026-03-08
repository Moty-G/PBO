/**
 * Interface untuk object yang bisa dicocokkan dengan keyword pencarian.
 * Implementasi matches() menentukan cara pencarian untuk tiap class.
 */
export interface Searchable {
    /** Cek apakah object cocok dengan keyword pencarian */
    matches(keyword: string): boolean;
}
