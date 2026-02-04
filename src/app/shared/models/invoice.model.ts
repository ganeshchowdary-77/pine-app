/**
 * Invoice represents a billing document
 * 
 * Invoices are created based on Purchase Orders (POs).
 * Each invoice references a PO, which in turn references an Enrollment.
 * 
 * Types:
 * - ADMIN: Invoice sent to client for payment
 * - TRAINER: Invoice submitted by trainer for compensation
 * 
 * Status Flow:
 * PENDING → APPROVED → SENT → PAID
 */
export interface Invoice {
    id: number | string;

    poId: number | string; // References PurchaseOrder.id
    trainerId?: number | string; // Direct link for simpler filtering

    issuedBy: 'ADMIN' | 'TRAINER';

    periodStart?: string;
    periodEnd?: string;

    amount: number;
    tax?: number;

    invoiceDate: string;

    status: 'PENDING' | 'APPROVED' | 'SENT' | 'PAID';
}
