/**
 * Script to seed test data for development
 */
import { storage } from '../lib/storage';
import { generateWaitlistEntry } from '../lib/storage';

async function seedWaitlistData() {
  console.log('Seeding waitlist data...');

  const testEntries = [
    { email: 'john.doe@example.com', variant: 'A' as const },
    { email: 'jane.smith@example.com', variant: 'B' as const },
    { email: 'bob.wilson@example.com', variant: 'A' as const },
    { email: 'alice.johnson@example.com', variant: 'B' as const },
    { email: 'charlie.brown@example.com', variant: 'A' as const },
    { email: 'diana.prince@example.com', variant: 'B' as const },
    { email: 'edward.norton@example.com', variant: 'A' as const },
    { email: 'fiona.apple@example.com', variant: 'B' as const },
  ];

  for (const { email, variant } of testEntries) {
    try {
      const entry = await generateWaitlistEntry(
        email,
        variant,
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'https://google.com'
      );
      await storage.storeWaitlistEntry(entry);
      console.log(`Added: ${email} (${variant})`);
    } catch (error) {
      // Log the error details
      console.error(
        `Error adding entry: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      console.log(`Skipped: ${email} (already exists)`);
    }
  }

  console.log('Seeding completed!');
}

// Run if called directly
if (require.main === module) {
  seedWaitlistData().catch(console.error);
}

export { seedWaitlistData };
