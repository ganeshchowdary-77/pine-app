import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
    providedIn: 'root'
})
export class MailService {

    // IMPORTANT: Replace these with actual keys from EmailJS
    private readonly SERVICE_ID = 'service_6159xct';
    private readonly TEMPLATE_ID = 'template_8g3ovlw';
    private readonly PUBLIC_KEY = 'KlomccSPSF-a4M2qo';

    /**
     * Sends a real email notification to a trainer using EmailJS.
     */
    async sendTrainerEnrollmentNotification(trainer: any, enrollment: any, companyName: string): Promise<void> {
        const templateParams = {
            to_name: trainer.name,
            to_email: trainer.email,
            company_name: companyName,
            technology: enrollment.technology,
            start_date: enrollment.startDate,
            end_date: enrollment.endDate,
            budget: `$${enrollment.budget?.toLocaleString() || 'N/A'}`,
            subject: `New Training Request: ${enrollment.technology}`
        };

        console.log('[MAIL] Attempting to send real email via EmailJS...');
        console.log('[MAIL] Service ID:', this.SERVICE_ID ? 'Configured' : 'MISSING');
        console.log('[MAIL] Template ID:', this.TEMPLATE_ID ? 'Configured' : 'MISSING');
        console.log('[MAIL] Template Params:', JSON.stringify(templateParams, null, 2));

        try {
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                templateParams,
                this.PUBLIC_KEY
            );
            console.log('[MAIL] Email sent successfully!', response.status, response.text);
        } catch (error) {
            console.error('[MAIL] Failed to send email:', error);
            // Fallback
            this.logSimulatedEmail(trainer, enrollment, companyName);
        }
    }

    private logSimulatedEmail(trainer: any, enrollment: any, companyName: string): void {
        console.log(`[SIMULATED EMAIL FALLBACK]
      TO: ${trainer.email}
      COMPANY: ${companyName}
      TECH: ${enrollment.technology}
      DATES: ${enrollment.startDate} to ${enrollment.endDate}
    `);
    }
}
