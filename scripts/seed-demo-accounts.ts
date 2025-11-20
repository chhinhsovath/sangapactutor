import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const demoAccounts = [
    // Institution Accounts
    {
        email: 'sovan.kim@rupp.edu.kh',
        password: 'demo123',
        firstName: 'Sovan',
        lastName: 'Kim',
        role: 'faculty_coordinator',
    },
    {
        email: 'sokha.chan@rupp.edu.kh',
        password: 'demo123',
        firstName: 'Sokha',
        lastName: 'Chan',
        role: 'tutor',
    },
    {
        email: 'sophea.prak@kcu.edu.kh',
        password: 'demo123',
        firstName: 'Sophea',
        lastName: 'Prak',
        role: 'student',
    },
    // Original Accounts
    {
        email: 'admin@tutorhub.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
    },
    {
        email: 'sarah@example.com',
        password: 'tutor123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'tutor',
    },
    {
        email: 'john@example.com',
        password: 'student123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
    },
];

async function seedDemoAccounts() {
    console.log('Starting to seed demo accounts...');

    for (const account of demoAccounts) {
        try {
            // Check if user already exists
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, account.email))
                .limit(1);

            if (existingUser.length > 0) {
                console.log(`✓ User ${account.email} already exists, updating password...`);
                // Hash password
                const hashedPassword = await bcrypt.hash(account.password, 10);

                await db
                    .update(users)
                    .set({ password: hashedPassword })
                    .where(eq(users.email, account.email));

                console.log(`✓ Updated password for: ${account.email}`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(account.password, 10);

            // Insert user
            await db.insert(users).values({
                email: account.email,
                password: hashedPassword,
                firstName: account.firstName,
                lastName: account.lastName,
                role: account.role as any,
                authProvider: 'local',
                emailVerified: true,
                isActive: true,
                creditBalance: account.role === 'student' ? '100.00' : '0.00',
            });

            console.log(`✓ Created user: ${account.email} (${account.role})`);
        } catch (error) {
            console.error(`✗ Error creating user ${account.email}:`, error);
        }
    }

    console.log('Demo accounts seeding completed!');
    process.exit(0);
}

seedDemoAccounts().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
