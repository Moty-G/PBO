/**
 * Interface untuk object yang bisa ditampilkan dalam format tertentu.
 * Berguna nanti saat integrasi dengan GUI.
 */
export interface Displayable {
    /** Representasi singkat untuk tampilan di tabel/list */
    toDisplayString(): string;

    /** Representasi detail untuk tampilan di form/detail view */
    toDetailString(): string;
}
