#!/usr/bin/env node

/**
 * Script to update lib/data.ts with data from timestamped CSV files
 * Reads food and alcohol CSV files from the most recent dated folder in lib/data/
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/lib/data');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/data.ts');

/**
 * Find the most recent timestamped folder (format: YYYY-MM-DD)
 */
function findLatestDataFolder() {
    const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
    const folders = entries
        .filter(entry => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
        .map(entry => entry.name)
        .sort()
        .reverse();

    if (folders.length === 0) {
        throw new Error('No timestamped folders found in ' + DATA_DIR);
    }

    return folders[0];
}

/**
 * Parse CSV content and extract data rows
 * Handles the complex USDA CSV format with multi-line headers
 */
function parseCSV(content, type) {
    const lines = content.split('\n').map(line => line.trim().replace(/\r$/, ''));
    const items = [];

    // Find the data start line (after headers)
    let dataStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        // Look for the description column header
        if (lines[i].startsWith('Food Description,') || lines[i].startsWith('Alcoholic Beverage Description,')) {
            dataStartIndex = i + 2; // Skip the header row and units row
            break;
        }
    }

    if (dataStartIndex === -1) {
        throw new Error(`Could not find data start in ${type} CSV`);
    }

    // Parse data rows
    for (let i = dataStartIndex; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines, footnotes, and category headers
        if (!line || line.startsWith('1 ') || line.startsWith('2 ') || line.startsWith('*') ||
            line.startsWith('ND =') || line.includes('Sources of data')) {
            continue;
        }

        // Parse the CSV line (handling quoted fields with commas)
        const fields = parseCSVLine(line);

        if (fields.length < 19) continue; // Not enough columns for a valid data row

        const name = fields[0].replace(/^"|"$/g, '').trim();

        // Skip category headers (they have empty numeric columns)
        if (!name || name.includes('Organ Products') || name.includes('other than organs') ||
            name === 'Beverages' || name === 'Dairy and Eggs' || name === 'Finfish and shellfish' ||
            name === 'Fruits' || name === 'Legumes and legume products' || name === 'Nuts and seeds' ||
            name === 'Sausages and luncheon meats' || name === 'Sweets' || name === 'Vegetables' ||
            name.includes('(other than') || name.endsWith('products') || name.startsWith('Cereal grains') ||
            name.startsWith('Lamb, veal') || name.startsWith('Pork organ') || name.startsWith('Pork (other') ||
            name.startsWith('Poultry organ') || name.startsWith('Poultry (other') ||
            name.startsWith('Soups, sauces') || name.startsWith('Beef Organ') || name.startsWith('Beef (other') ||
            name.startsWith('Vegetarian meat')) {
            continue;
        }

        // Get Total Purines column (column 19 in 0-indexed, i.e., 20th column)
        const totalPurinesStr = fields[18];

        // Skip if total purines is empty, ND, or not a number
        if (!totalPurinesStr || totalPurinesStr === 'ND' || totalPurinesStr === '-') {
            continue;
        }

        const purines = parseFloat(totalPurinesStr);
        if (isNaN(purines)) continue;

        // Determine category based on type and name
        const category = determineCategory(name, type);

        // Determine purine level
        const purineLevel = determinePurineLevel(purines);

        // Clean up the name
        const cleanName = cleanFoodName(name);

        items.push({
            name: cleanName,
            purines: Math.round(purines),
            category,
            purineLevel
        });
    }

    return items;
}

/**
 * Parse a single CSV line, handling quoted fields with commas
 */
function parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    fields.push(current.trim());
    return fields;
}

/**
 * Determine the food category based on name and type
 */
function determineCategory(name, type) {
    const nameLower = name.toLowerCase();

    if (type === 'alcohol') {
        return 'Beverages';
    }

    // Seafood
    if (nameLower.includes('fish') || nameLower.includes('salmon') || nameLower.includes('tuna') ||
        nameLower.includes('shrimp') || nameLower.includes('crab') || nameLower.includes('lobster') ||
        nameLower.includes('oyster') || nameLower.includes('clam') || nameLower.includes('mussel') ||
        nameLower.includes('squid') || nameLower.includes('octopus') || nameLower.includes('scallop') ||
        nameLower.includes('mackerel') || nameLower.includes('sardine') || nameLower.includes('anchovy') ||
        nameLower.includes('herring') || nameLower.includes('cod') || nameLower.includes('halibut') ||
        nameLower.includes('flounder') || nameLower.includes('eel') || nameLower.includes('carp') ||
        nameLower.includes('trout') || nameLower.includes('roe') || nameLower.includes('milt') ||
        nameLower.includes('seabass') || nameLower.includes('snail') || nameLower.includes('krill') ||
        nameLower.includes('whitebait') || nameLower.includes('bonito') || nameLower.includes('yellowtail')) {
        return 'Seafood';
    }

    // Meat
    if (nameLower.includes('beef') || nameLower.includes('pork') || nameLower.includes('chicken') ||
        nameLower.includes('lamb') || nameLower.includes('mutton') || nameLower.includes('veal') ||
        nameLower.includes('duck') || nameLower.includes('goose') || nameLower.includes('turkey') ||
        nameLower.includes('liver') || nameLower.includes('kidney') || nameLower.includes('heart') ||
        nameLower.includes('tongue') || nameLower.includes('ham') || nameLower.includes('bacon') ||
        nameLower.includes('sausage') || nameLower.includes('frankfurter') || nameLower.includes('salami') ||
        nameLower.includes('prosciutto') || nameLower.includes('corned') || nameLower.includes('whale') ||
        nameLower.includes('foie gras') || nameLower.includes('gizzard') || nameLower.includes('pate')) {
        return 'Meat';
    }

    // Dairy
    if (nameLower.includes('milk') || nameLower.includes('cheese') || nameLower.includes('yogurt') ||
        nameLower.includes('cream') || nameLower.includes('butter') || nameLower.includes('egg')) {
        return 'Dairy';
    }

    // Legumes
    if (nameLower.includes('bean') || nameLower.includes('soy') || nameLower.includes('tofu') ||
        nameLower.includes('lentil') || nameLower.includes('pea') || nameLower.includes('chickpea') ||
        nameLower.includes('miso') || nameLower.includes('natto') || nameLower.includes('okara')) {
        return 'Legumes';
    }

    // Grains
    if (nameLower.includes('rice') || nameLower.includes('bread') || nameLower.includes('flour') ||
        nameLower.includes('noodle') || nameLower.includes('pasta') || nameLower.includes('spaghetti') ||
        nameLower.includes('barley') || nameLower.includes('wheat') || nameLower.includes('oat') ||
        nameLower.includes('cereal') || nameLower.includes('bran') || nameLower.includes('ramen') ||
        nameLower.includes('udon') || nameLower.includes('soba')) {
        return 'Grains';
    }

    // Nuts
    if (nameLower.includes('nut') || nameLower.includes('almond') || nameLower.includes('walnut') ||
        nameLower.includes('peanut') || nameLower.includes('cashew') || nameLower.includes('pistachio') ||
        nameLower.includes('seed') || nameLower.includes('sesame') || nameLower.includes('chia')) {
        return 'Nuts';
    }

    // Fruits
    if (nameLower.includes('apple') || nameLower.includes('banana') || nameLower.includes('orange') ||
        nameLower.includes('strawberry') || nameLower.includes('grape') || nameLower.includes('mango') ||
        nameLower.includes('avocado') || nameLower.includes('goji') || nameLower.includes('fruit')) {
        return 'Fruits';
    }

    // Vegetables
    if (nameLower.includes('spinach') || nameLower.includes('broccoli') || nameLower.includes('carrot') ||
        nameLower.includes('potato') || nameLower.includes('tomato') || nameLower.includes('onion') ||
        nameLower.includes('cabbage') || nameLower.includes('lettuce') || nameLower.includes('mushroom') ||
        nameLower.includes('asparagus') || nameLower.includes('pepper') || nameLower.includes('corn') ||
        nameLower.includes('cucumber') || nameLower.includes('eggplant') || nameLower.includes('garlic') ||
        nameLower.includes('ginger') || nameLower.includes('pumpkin') || nameLower.includes('squash') ||
        nameLower.includes('seaweed') || nameLower.includes('radish') || nameLower.includes('leek') ||
        nameLower.includes('sprout') || nameLower.includes('parsley') || nameLower.includes('okra') ||
        nameLower.includes('bamboo') || nameLower.includes('turnip') || nameLower.includes('taro') ||
        nameLower.includes('cauliflower') || nameLower.includes('burdock') || nameLower.includes('green beans')) {
        return 'Vegetables';
    }

    // Beverages
    if (nameLower.includes('tea') || nameLower.includes('coffee') || nameLower.includes('juice') ||
        nameLower.includes('beverage') || nameLower.includes('amazake')) {
        return 'Beverages';
    }

    // Default to Other
    return 'Other';
}

/**
 * Determine purine level based on mg/100g
 */
function determinePurineLevel(purines) {
    if (purines < 100) return 'Low';
    if (purines < 200) return 'Medium';
    if (purines < 300) return 'High';
    return 'Very High';
}

/**
 * Clean up food names for better readability
 */
function cleanFoodName(name) {
    // First, normalize all types of quotes to straight single quotes
    let cleaned = name
        .replace(/[\u2018\u2019\u201A\u201B]/g, "'")  // Normalize curly single quotes
        .replace(/[\u201C\u201D\u201E\u201F]/g, '"')  // Normalize curly double quotes
        .replace(/^"|"$/g, '');  // Remove leading/trailing double quotes

    // Handle patterns like: 'Bacon', meatless -> Bacon (Meatless) BEFORE stripping quotes
    if (/^'[^']+',\s*meatless$/i.test(cleaned)) {
        cleaned = cleaned.replace(/^'([^']+)',\s*meatless$/i, '$1 (Meatless)');
    }

    cleaned = cleaned
        .replace(/^'+|'+$/g, '')  // Remove leading/trailing single quotes
        // Handle other quoted patterns like 'regular' within text
        .replace(/,\s*raw\s*$/i, '')
        .replace(/,\s*fresh\s*$/i, '')
        .replace(/,\s*dried\s*$/i, ' (dried)')
        .replace(/\s+\(unspecified\)/i, '')
        .replace(/\s+\(no further specified\)/i, '')
        .replace(/\s+\(not further specified\)/i, '')
        .replace(/,?\s*raw\d*$/i, '')  // Remove footnote references like ", raw6"
        .trim();

    // Capitalize first letter of each word
    cleaned = cleaned.split(' ').map(word => {
        if (word.startsWith('(')) {
            return '(' + word.charAt(1).toUpperCase() + word.slice(2);
        }
        if (word.startsWith("'")) {
            return "'" + word.charAt(1).toUpperCase() + word.slice(2);
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    return cleaned;
}

/**
 * Generate the TypeScript file content
 */
function generateTypeScriptFile(items) {
    // Sort items alphabetically by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    // Remove duplicates (keep the one with more data)
    const uniqueItems = [];
    const seen = new Set();

    for (const item of items) {
        const key = item.name.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            uniqueItems.push(item);
        }
    }

    const itemsStr = uniqueItems.map(item => {
        // Escape single quotes and backslashes
        const nameEscaped = item.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `  { name: '${nameEscaped}', purines: ${item.purines}, category: '${item.category}', purineLevel: '${item.purineLevel}' }`;
    }).join(',\n');

    return `import type { FoodItem } from './types';

export const foodData: FoodItem[] = [
${itemsStr},
];
`;
}

/**
 * Main function
 */
function main() {
    try {
        console.log('🔍 Finding latest data folder...');
        const latestFolder = findLatestDataFolder();
        console.log(`📁 Using folder: ${latestFolder}`);

        const folderPath = path.join(DATA_DIR, latestFolder);
        const files = fs.readdirSync(folderPath);

        // Find food and alcohol CSV files
        const foodFile = files.find(f => f.includes('food') && f.endsWith('.csv'));
        const alcoholFile = files.find(f => f.includes('alcohol') && f.endsWith('.csv'));

        if (!foodFile) {
            throw new Error('Food CSV file not found in ' + folderPath);
        }
        if (!alcoholFile) {
            throw new Error('Alcohol CSV file not found in ' + folderPath);
        }

        console.log(`📄 Parsing food data from: ${foodFile}`);
        const foodContent = fs.readFileSync(path.join(folderPath, foodFile), 'utf-8');
        const foodItems = parseCSV(foodContent, 'food');
        console.log(`   Found ${foodItems.length} food items`);

        console.log(`📄 Parsing alcohol data from: ${alcoholFile}`);
        const alcoholContent = fs.readFileSync(path.join(folderPath, alcoholFile), 'utf-8');
        const alcoholItems = parseCSV(alcoholContent, 'alcohol');
        console.log(`   Found ${alcoholItems.length} alcohol items`);

        // Combine all items
        const allItems = [...foodItems, ...alcoholItems];
        console.log(`📊 Total items: ${allItems.length}`);

        // Generate and write the TypeScript file
        console.log('✍️  Generating data.ts...');
        const content = generateTypeScriptFile(allItems);
        fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');

        console.log(`✅ Successfully updated ${OUTPUT_FILE}`);
        console.log(`   Total unique items: ${content.split('\n').filter(l => l.includes('{ name:')).length}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
