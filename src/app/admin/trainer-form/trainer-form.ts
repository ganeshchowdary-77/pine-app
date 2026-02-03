import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TrainerService } from '../../shared/services/trainer.service';
import { UserService } from '../../shared/services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-trainer-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './trainer-form.html',
  styleUrl: './trainer-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainerForm {
  private fb = inject(FormBuilder);
  private trainerService = inject(TrainerService);
  private userService = inject(UserService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  trainerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    technologies: ['', [Validators.required]],
    paymentType: ['hourly' as 'hourly' | 'daily' | 'monthly', [Validators.required]],
    rate: [0, [Validators.required, Validators.min(0)]],
  });

  get nameControl() {
    return this.trainerForm.get('name');
  }

  get emailControl() {
    return this.trainerForm.get('email');
  }

  get passwordControl() {
    return this.trainerForm.get('password');
  }

  get technologiesControl() {
    return this.trainerForm.get('technologies');
  }

  get paymentTypeControl() {
    return this.trainerForm.get('paymentType');
  }

  get rateControl() {
    return this.trainerForm.get('rate');
  }

  onSubmit() {
    if (this.trainerForm.invalid) {
      this.trainerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.trainerForm.value;

    // Convert comma-separated technologies string to array
    const technologiesArray = formValue.technologies!
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    const trainerData = {
      name: formValue.name!,
      email: formValue.email!,
      technologies: technologiesArray,
      paymentType: formValue.paymentType!,
      rate: formValue.rate!,
    };

    // First create the trainer, then create the user with the trainerId
    this.trainerService.create(trainerData).pipe(
      switchMap(createdTrainer => {
        // Now create the user account linked to this trainer
        const userData = {
          email: formValue.email!,
          password: formValue.password!,
          role: 'trainer' as const,
          trainerId: createdTrainer.id,
        };
        return this.userService.create(userData);
      })
    ).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/trainer-availability']);
      },
      error: (err) => {
        console.error('Error creating trainer/user:', err);
        this.errorMessage.set('Failed to create trainer. Please try again.');
        this.isSubmitting.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/admin/trainer-availability']);
  }
}
