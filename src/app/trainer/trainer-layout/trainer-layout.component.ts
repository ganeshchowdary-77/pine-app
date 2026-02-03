import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
    selector: 'app-trainer-layout',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet],
    templateUrl: './trainer-layout.component.html',
    styleUrls: ['./trainer-layout.component.css']
})
export class TrainerLayoutComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    welcomeMessage = signal<string>('');
    stars: { left: string; top: string; duration: string; delay: string }[] = [];

    ngOnInit() {
        this.generateStars();
        this.loadUserData();
    }

    private generateStars() {
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                duration: Math.random() * 3 + 2 + 's',
                delay: Math.random() * 2 + 's'
            });
        }
    }

    private loadUserData() {
        const user = this.authService.getUser();
        if (user) {
            // We might want to fetch more details or just use what we have.
            // For the layout header, just "Trainer" or email name is fine initially.
            // The individual pages can show more detailed titles.
            const name = user.email.split('@')[0];
            this.welcomeMessage.set(`Welcome, ${name}!`);
        }
    }

    logout() {
        this.authService.logout();
    }
}
