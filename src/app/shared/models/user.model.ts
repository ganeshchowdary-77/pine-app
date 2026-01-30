/**
 * SHARED MODELS - READ-ONLY
 * 
 * These models are the CONTRACT between all teams.
 * DO NOT MODIFY without PM/Auth Owner approval.
 * 
 * To use in your components/services:
 * import { User, Company, Trainer, Enrollment, PurchaseOrder, Invoice } from '../shared/models';
 */

export interface User {
    id: number;
    email: string;
    password: string;
    role: 'admin' | 'trainer';
    trainerId?: number; // Links to Trainer.id if role is 'trainer'
}
