import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TrainingRequestService } from '../../shared/services/training-request.service';

@Component({
    selector: 'app-training-request-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './training-request-form.component.html',
    styleUrl: './training-request-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingRequestFormComponent {
    private trainingRequestService = inject(TrainingRequestService);

    isSubmitting = signal(false);
    submitSuccess = signal(false);
    submitError = signal<string | null>(null);

    requestForm = new FormGroup({
        companyName: new FormControl('', [Validators.required]),
        contactPerson: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl(''),
        technology: new FormControl('', [Validators.required]),
        startDate: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        participants: new FormControl<number | null>(null, [Validators.min(1)]),
        budget: new FormControl<number | null>(null, [Validators.min(0)]),
        message: new FormControl(''),
    });

    onSubmit() {
        if (this.requestForm.invalid) {
            this.requestForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.submitError.set(null);

        const formValue = this.requestForm.value;

        // Helper to format date if needed, though input[type=date] gives YYYY-MM-DD
        const requestData: any = {
            ...formValue,
            status: 'NEW'
        };

        this.trainingRequestService.create(requestData).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.submitSuccess.set(true);
                this.requestForm.reset();
                setTimeout(() => this.submitSuccess.set(false), 5000);
            },
            error: (err) => {
                console.error('Error submitting request', err);
                this.isSubmitting.set(false);
                this.submitError.set('Failed to submit request. Please try again.');
            }
        });
    }

    // Getters for easy access in template
    get f() { return this.requestForm.controls; }
}
