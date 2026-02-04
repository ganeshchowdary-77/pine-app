export interface Company {
    id: number | string;

    name: string;
    email: string;

    industry?: string;
    contactPerson?: string;
    phone?: string;
}
