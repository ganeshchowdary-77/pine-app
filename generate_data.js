const fs = require('fs');
const crypto = require('crypto');

const generateId = () => crypto.randomUUID();

const technologies = ['Angular', 'React', 'Node.js', 'Java', 'Python', 'AWS', 'Docker', 'Kubernetes'];

const companies = [];
const trainers = [];
const users = [];
const requests = [];
// Leaving downstream data empty for manual testing
const enrollments = [];
const purchaseOrders = [];
const invoices = [];

// 1. Generate 1 Admin User
users.push({
    id: generateId(),
    email: 'admin@pine.com',
    password: 'admin',
    role: 'admin'
});

// 2. Generate 4 Trainers and their Users
for (let i = 1; i <= 4; i++) {
    const trainerId = generateId();
    const trainerName = `Trainer ${i}`;
    const trainerEmail = `trainer${i}@example.com`;
    const tech1 = technologies[(i - 1) % technologies.length];
    const tech2 = technologies[(i) % technologies.length];

    trainers.push({
        id: trainerId,
        name: trainerName,
        email: trainerEmail,
        technologies: [tech1, tech2],
        paymentType: i % 2 === 0 ? 'hourly' : 'daily',
        rate: i % 2 === 0 ? 80 : 600
    });

    // Create User for Trainer
    users.push({
        id: generateId(),
        email: trainerEmail,
        password: 'password123',
        role: 'trainer',
        trainerId: trainerId
    });
}

// 3. Generate 5 Training Requests
// These conceptually come from companies, so we'll generate companies on the fly or implicitly.
// To make it realistic, I'll create 5 companies first.
for (let i = 1; i <= 5; i++) {
    const company = {
        id: generateId(),
        name: `Client Company ${i}`,
        email: `info@company${i}.com`,
        industry: 'IT',
        contactPerson: `Contact ${i}`,
        phone: `555-010${i}`
    };
    companies.push(company);

    requests.push({
        id: generateId(),
        companyName: company.name,
        contactPerson: company.contactPerson,
        email: `request@company${i}.com`,
        phone: company.phone,
        technology: technologies[i % technologies.length],
        startDate: '2023-12-01',
        endDate: '2023-12-15',
        duration: 15,
        budget: 5000 + (i * 1000),
        participants: 5 + i,
        message: `We need training for ${technologies[i % technologies.length]}.`,
        status: 'NEW' // All set to NEW so admin can process them
    });
}

const db = {
    users,
    companies,
    trainers,
    "trainingRequests": requests,
    "enrollments": enrollments,
    "purchaseOrders": purchaseOrders,
    "invoices": invoices
};

// Write directly to file to ensure UTF-8 encoding
fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully wrote to db.json');
