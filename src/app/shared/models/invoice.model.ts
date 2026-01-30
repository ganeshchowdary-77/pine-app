/**
 * SHARED MODELS - READ-ONLY
 * 
 * These models are the CONTRACT between all teams.
 * DO NOT MODIFY without PM/Auth Owner approval.
 */

/**
 * Invoice represents a billing document
 * 
 * Issued by:
 * - ADMIN: Invoice sent to client for training payment
 * - TRAINER: Invoice submitted by trainer for compensation
 * 
 * Admin Invoices:
 * - Created/approved by: Admin - Invoice & Dashboard Owner (Team 3)
 * - Sent to clients for payment
 * 
 * Trainer Invoices:
 * - Uploaded by: Trainer - Invoice & Dashboard Owner (Team 5)
 * - Approved by: Admin - Invoice & Dashboard Owner (Team 3)
 * 
 * Status Flow:
 * PENDING → APPROVED → SENT → PAID
 */
export interface Invoice {
    id: number;
    poId: number;               // References PurchaseOrder.id
    issuedBy: 'ADMIN' | 'TRAINER';
    amount: number;
    tax?: number;               // Optional tax amount
    invoiceDate: string;        // ISO date string
    status: 'PENDING' | 'APPROVED' | 'SENT' | 'PAID';
}
