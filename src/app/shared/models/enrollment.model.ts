export interface Enrollment {
    id: number | string;

    companyId: number | string;
    requestId?: number | string;

    trainerId?: number | string | null;

    technology: string;
    startDate: string;
    endDate: string;

    budget?: number;

    status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED' | 'REJECTED';
}
