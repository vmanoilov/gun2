#!/usr/bin/env tsx

import { PersonaService } from "../lib/database/personas";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Seed ChaosAlchemist persona
    await PersonaService.seedChaosAlchemist();

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };