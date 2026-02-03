export interface Enrollment {
    id: number;

    companyId: number;
    requestId?: number;

    trainerId?: number | null;

    technology: string;
    startDate: string;
    endDate: string;

    budget?: number;

    status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED';
}
