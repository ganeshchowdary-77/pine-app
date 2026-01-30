/**
 * SHARED MODELS - READ-ONLY
 * 
 * These models are the CONTRACT between all teams.
 * DO NOT MODIFY without PM/Auth Owner approval.
 */

/**
 * Enrollment represents a training engagement between a Company and Trainer
 * 
 * Created by: Admin - Enrollment & PO Owner (Team 2)
 * Used by: All admin teams, Trainer teams
 * 
 * Status Flow:
 * REQUESTED → APPROVED → ONGOING → COMPLETED
 */
export interface Enrollment {
    id: number;
    companyId: number;        // References Company.id
    trainerId: number;        // References Trainer.id
    technology: string;       // The training subject/technology
    startDate: string;        // ISO date string
    endDate: string;          // ISO date string
    budget: number;           // Total budget for this enrollment
    status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED';
}
