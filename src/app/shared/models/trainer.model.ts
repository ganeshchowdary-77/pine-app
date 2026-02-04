/**
 * SHARED MODELS - READ-ONLY
 * 
 * These models are the CONTRACT between all teams.
 * DO NOT MODIFY without PM/Auth Owner approval.
 */

/**
 * Trainer represents an individual who delivers training
 * Used by: Both Admin and Trainer teams
 */
export interface Trainer {
    id: number | string;
    name: string;
    email: string;
    technologies: string[]; // List of technologies they can teach
    paymentType: 'hourly' | 'daily' | 'monthly';
    rate: number; // Payment rate based on paymentType
}
