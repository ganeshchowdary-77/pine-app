import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrainingRequestFormComponent } from './training-request-form/training-request-form.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterLink, CommonModule, TrainingRequestFormComponent],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
    showRequestForm = signal(false);

    toggleRequestForm() {
        this.showRequestForm.update(v => !v);
    }

    scrollToRequest() {
        this.showRequestForm.set(true);
        setTimeout(() => {
            const element = document.getElementById('request-form-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
}
