#!/usr/bin/env node

/**
 * Script to clear lib/data.ts and reset it to an empty array
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../src/lib/data.ts');

const emptyContent = `import type { FoodItem } from './types';

export const foodData: FoodItem[] = [];
`;

try {
    fs.writeFileSync(OUTPUT_FILE, emptyContent, 'utf-8');
    console.log('✅ Successfully cleared data.ts');
    console.log('   The foodData array is now empty.');
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
