/**
 * Script to generate mock data for development and testing
 */
import { storage } from '../lib/storage';
import { generateWaitlistEntry } from '../lib/storage';

/**
 * Generate random email addresses with various domains
 */
function generateRandomEmail(): string {
  const firstNames = [
    'john',
    'jane',
    'bob',
    'alice',
    'charlie',
    'diana',
    'edward',
    'fiona',
    'george',
    'helen',
    'ivan',
    'julia',
    'kevin',
    'laura',
    'mike',
    'nancy',
    'oscar',
    'penny',
    'quinn',
    'rachel',
  ];
  const lastNames = [
    'smith',
    'johnson',
    'williams',
    'brown',
    'jones',
    'garcia',
    'miller',
    'davis',
    'rodriguez',
    'martinez',
    'hernandez',
    'lopez',
    'gonzalez',
    'wilson',
    'anderson',
    'thomas',
    'taylor',
    'moore',
    'jackson',
    'martin',
  ];
  const domains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'company.com',
    'startup.io',
    'tech.org',
    'business.net',
    'example.com',
    'test.co',
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return `${firstName}.${lastName}@${domain}`;
}

/**
 * Generate random user agent strings
 */
function generateRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',
  ];

  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Generate random referrer URLs
 */
function generateRandomReferrer(): string {
  const referrers = [
    'https://google.com/search?q=ai+marketing',
    'https://twitter.com/soku_ai',
    'https://linkedin.com/company/soku-ai',
    'https://facebook.com/sokuai',
    'https://reddit.com/r/marketing',
    'https://producthunt.com/posts/soku-ai',
    'https://techcrunch.com/ai-marketing-tools',
    'https://ycombinator.com/companies',
    'https://github.com/soku-ai',
    'https://medium.com/@soku-ai',
    'direct',
    'https://newsletter.marketing.com',
    'https://blog.startup.com/ai-tools',
  ];

  return referrers[Math.floor(Math.random() * referrers.length)];
}

/**
 * Generate random timestamp within the last 30 days
 */
function generateRandomTimestamp(): Date {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime =
    thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());

  return new Date(randomTime);
}

/**
 * Generate mock waitlist data
 */
async function generateMockData(count: number = 50) {
  console.log(`Generating ${count} mock waitlist entries...`);

  const variants: ('A' | 'B')[] = ['A', 'B'];
  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < count; i++) {
    try {
      const email = generateRandomEmail();
      const variant = variants[Math.floor(Math.random() * variants.length)];
      const userAgent = generateRandomUserAgent();
      const referrer = generateRandomReferrer();

      // Create entry with custom timestamp
      const entry = await generateWaitlistEntry(email, variant, userAgent, referrer);

      // Override timestamp with random one
      entry.timestamp = generateRandomTimestamp();

      await storage.storeWaitlistEntry(entry);
      successCount++;

      if (i % 10 === 0) {
        console.log(`Progress: ${i + 1}/${count} entries processed...`);
      }
    } catch (error) {
      skipCount++;
      // Log the error and skip duplicate emails
      console.error(
        `Error adding entry: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  console.log(`\n✅ Mock data generation completed!`);
  console.log(`📊 Successfully added: ${successCount} entries`);
  console.log(`⏭️  Skipped duplicates: ${skipCount} entries`);

  // Show summary statistics
  const allEntries = await storage.getWaitlistEntries();
  const variantA = allEntries.filter(e => e.variant === 'A').length;
  const variantB = allEntries.filter(e => e.variant === 'B').length;

  console.log(`\n📈 Current database statistics:`);
  console.log(`   Total entries: ${allEntries.length}`);
  console.log(`   Variant A: ${variantA} (${Math.round((variantA / allEntries.length) * 100)}%)`);
  console.log(`   Variant B: ${variantB} (${Math.round((variantB / allEntries.length) * 100)}%)`);
}

/**
 * Clear all existing data
 */
async function clearAllData() {
  console.log('🗑️  Clearing all existing data...');
  await storage.clearAll();
  console.log('✅ All data cleared!');
}

/**
 * Main function to handle command line arguments
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'clear':
      await clearAllData();
      break;
    case 'generate':
      const count = parseInt(args[1]) || 50;
      await generateMockData(count);
      break;
    case 'reset':
      await clearAllData();
      await generateMockData(50);
      break;
    default:
      console.log('📋 Available commands:');
      console.log('   yarn mock-data generate [count]  - Generate mock data (default: 50)');
      console.log('   yarn mock-data clear             - Clear all existing data');
      console.log('   yarn mock-data reset             - Clear and regenerate data');
      console.log('');
      console.log('Examples:');
      console.log('   yarn mock-data generate 100     - Generate 100 mock entries');
      console.log('   yarn mock-data reset             - Reset with 50 new entries');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  generateMockData,
  clearAllData,
  generateRandomEmail,
  generateRandomUserAgent,
  generateRandomReferrer,
};
