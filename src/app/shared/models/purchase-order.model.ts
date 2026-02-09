/**
 * SHARED MODELS - READ-ONLY
 * 
 * These models are the CONTRACT between all teams.
 * DO NOT MODIFY without PM/Auth Owner approval.
 */

/**
 * PurchaseOrder represents a financial commitment document
 * 
 * Types:
 * - CLIENT: PO sent to client for payment
 * - TRAINER: PO sent to trainer for their compensation
 * 
 * Created by: Admin - Enrollment & PO Owner (Team 2)
 * Viewed by: Admin teams, Trainer teams (trainers see only their POs)
 * 
 * Status Flow:
 * GENERATED → SENT → ACCEPTED → RECEIVED
 */
export interface PurchaseOrder {
    id: string;
    enrollmentId?: string | null;                          // References Enrollment.id
    trainerId?: string;                            // Direct link for trainer filtering
    type: 'CLIENT' | 'TRAINER';                    // Who receives this PO
    paymentType?: 'hourly' | 'daily' | 'monthly'; // For TRAINER POs
    rate?: number;                                 // For TRAINER POs
    totalAmount: number;                           // Total PO amount
    paymentTerms?: string;                         // E.g., "Net 30", "Upon completion"
    status: 'GENERATED' | 'SENT' | 'ACCEPTED' | 'RECEIVED';
}
