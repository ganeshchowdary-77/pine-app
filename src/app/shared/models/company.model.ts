/**
 * SHARED MODELS - READ-ONLY
 * 
 * These models are the CONTRACT between all teams.
 * DO NOT MODIFY without PM/Auth Owner approval.
 */

/**
 * Company represents a client organization that purchases training
 * Used by: Admin - Enrollment & PO Owner
 */
export interface Company {
    id: number;
    name: string;
    email: string;
    industry: string;
}
