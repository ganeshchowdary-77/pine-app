import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-assigned-trainings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './assigned-trainings.component.html',
  styleUrls: ['./assigned-trainings.component.css']
})
export class AssignedTrainingsComponent implements OnInit {
  trainings = signal<any[]>([]);
  companies = signal<any[]>([]);

  ngOnInit() {
    // Mock data for demo - in real app, this would come from services
    this.loadAssignedTrainings();
    this.loadCompanies();
  }

  private loadAssignedTrainings() {
    // Mock training data
    const mockTrainings = [
      {
        id: 1,
        companyId: 1,
        trainerId: 1,
        technology: 'Angular',
        startDate: '2026-02-15',
        endDate: '2026-02-19',
        budget: 20000,
        status: 'APPROVED'
      },
      {
        id: 3,
        companyId: 3,
        trainerId: 1,
        technology: 'React',
        startDate: '2026-04-10',
        endDate: '2026-04-14',
        budget: 18000,
        status: 'ONGOING'
      }
    ];

    this.trainings.set(mockTrainings);
  }

  private loadCompanies() {
    // Mock company data
    this.companies.set([
      { id: 1, name: 'TechCorp Inc.' },
      { id: 2, name: 'InnovateLabs' },
      { id: 3, name: 'GlobalSoft Solutions' }
    ]);
  }

  getCompanyName(companyId: number): string {
    const company = this.companies().find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
  }
}
