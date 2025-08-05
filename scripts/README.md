# Scripts Documentation

This directory contains utility scripts for development and testing.

## Generate Mock Data Script

The `generate-mock-data.ts` script helps you create realistic test data for the waitlist functionality.

### Usage

```bash
# Generate 50 mock entries (default)
yarn mock-data generate

# Generate specific number of entries
yarn mock-data generate 100

# Clear all existing data
yarn mock-data clear

# Reset: clear all data and generate 50 new entries
yarn mock-data reset

# Show help
yarn mock-data
```

### Features

- **Realistic Data**: Generates random but realistic email addresses, user agents, and referrer URLs
- **Time Distribution**: Creates entries with timestamps spread over the last 30 days
- **Variant Balance**: Randomly assigns A/B test variants
- **Duplicate Handling**: Automatically skips duplicate email addresses
- **Progress Tracking**: Shows progress for large data generation
- **Statistics**: Displays summary statistics after generation

### Generated Data Includes

- **Email Addresses**: Random combinations of first names, last names, and domains
- **Variants**: Random A/B test assignments
- **User Agents**: Realistic browser and device user agent strings
- **Referrers**: Various traffic sources (Google, social media, direct, etc.)
- **Timestamps**: Random timestamps within the last 30 days

### Examples

```bash
# Start fresh with 100 entries
yarn mock-data reset
yarn mock-data generate 100

# Add more data to existing entries
yarn mock-data generate 50

# Clear everything
yarn mock-data clear
```

## Seed Data Script

The `seed-data.ts` script provides a simple way to add a few predefined test entries.

```bash
npx tsx scripts/seed-data.ts
```

This script adds 8 predefined entries with known email addresses for testing purposes.