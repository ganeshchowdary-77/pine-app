export interface TrainingRequest {
    id: string;

    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;

    technology: string;
    startDate: string;
    endDate: string;
    duration?: number;
    budget?: number;

    participants?: number;
    message?: string;

    status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
}
