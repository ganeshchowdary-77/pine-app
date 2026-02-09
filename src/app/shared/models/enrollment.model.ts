export interface Enrollment {
    id: string;

    companyId: string;
    requestId?: string;

    trainerId?: string | null;

    technology: string;
    startDate: string;
    endDate: string;

    budget?: number;

    status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED' | 'REJECTED';
}
