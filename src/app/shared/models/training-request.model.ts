export interface TrainingRequest {
    id: number;

    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;

    technology: string;
    startDate: string;
    endDate: string;

    participants?: number;
    message?: string;

    status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
}
