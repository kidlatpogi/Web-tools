import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_FILE = path.join(__dirname, '../src/data/tools.json');
const CATEGORIES_FILE = path.join(__dirname, '../src/data/categories.json');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  orange: '\x1b[38;2;196;73;0m',
  accent: '\x1b[38;2;232;103;17m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  white: '\x1b[37m'
};

function readData() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
  const categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
  return { tools, categories };
}

function saveData(tools) {
  fs.writeFileSync(TOOLS_FILE, JSON.stringify(tools, null, 2), 'utf8');
}

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function printBanner() {
  console.clear();
  console.log(colors.orange + colors.bold +
`
 ██╗    ██╗███████╗██████╗      ████████╗ ██████╗  ██████╗ ██╗     ███████╗
 ██║    ██║██╔════╝██╔══██╗     ╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝
 ██║ █╗ ██║█████╗  ██████╔╝█████╗  ██║   ██║   ██║██║   ██║██║     ███████╗
 ██║███╗██║██╔══╝  ██╔══██╗╚════╝  ██║   ██║   ██║██║   ██║██║     ╚════██║
 ╚███╔███╔╝███████╗██████╔╝        ██║   ╚██████╔╝╚██████╔╝███████╗███████║
  ╚══╝╚══╝ ╚══════╝╚═════╝         ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝` + colors.reset);
  console.log(colors.accent + ' ⚙️  ADMIN PANEL & DIRECTORY MANAGEMENT CLI  ' + colors.gray + '• v1.1.0' + colors.reset + '\n');
}

async function main() {
  const rl = readline.createInterface({ input, output });
  try {
    let running = true;
    while (running) {
      printBanner();
      const { tools, categories } = readData();
      console.log(colors.dim + 'Total Curated Tools:' + colors.reset + ' ' + colors.bold + colors.orange + tools.length + colors.reset + ' | ' + colors.dim + 'Categories:' + colors.reset + ' ' + colors.bold + categories.length + colors.reset + '\n');
      console.log(colors.bold + 'Select an operation:' + colors.reset);
      console.log(' ' + colors.orange + '[1]' + colors.reset + ' ➕ Add New Tool');
      console.log(' ' + colors.orange + '[2]' + colors.reset + ' 📋 List Tools by Category');
      console.log(' ' + colors.orange + '[3]' + colors.reset + ' 🔍 Search Tools');
      console.log(' ' + colors.orange + '[4]' + colors.reset + ' ✏️  Edit Existing Tool');
      console.log(' ' + colors.orange + '[5]' + colors.reset + ' 🗑️  Delete Tool');
      console.log(' ' + colors.orange + '[6]' + colors.reset + ' 📊 Category Statistics');
      console.log(' ' + colors.orange + '[7]' + colors.reset + ' 🧪 Validate Database Integrity');
      console.log(' ' + colors.orange + '[0]' + colors.reset + ' 🚪 Exit Admin Panel\n');

      const choice = (await rl.question(colors.cyan + 'Enter choice [0-7]: ' + colors.reset)).trim();
      switch (choice) {
        case '1': await handleAddTool(rl); break;
        case '2': await handleListTools(rl); break;
        case '3': await handleSearchTools(rl); break;
        case '4': await handleEditTool(rl); break;
        case '5': await handleDeleteTool(rl); break;
        case '6': await handleStats(rl); break;
        case '7': await handleValidation(rl); break;
        case '0':
          running = false;
          console.log('\n' + colors.green + '✓ Exiting Web-Tools Admin Panel.' + colors.reset + '\n');
          break;
        default:
          console.log('\n' + colors.red + 'Invalid choice. Press Enter to retry.' + colors.reset);
          await rl.question('');
      }
    }
  } finally {
    rl.close();
  }
}

async function handleAddTool(rl) {
  const { tools, categories } = readData();
  console.log('\n' + colors.bold + colors.orange + '═══ ADD NEW CURATED TOOL ═══' + colors.reset + '\n');
  let name = '';
  while (!name) {
    name = (await rl.question(colors.cyan + 'Tool Name: ' + colors.reset)).trim();
    if (!name) console.log(colors.red + 'Name cannot be empty.' + colors.reset);
  }
  const defaultSlug = slugify(name);
  const customId = (await rl.question(colors.cyan + 'Unique Slug/ID [' + defaultSlug + ']: ' + colors.reset)).trim();
  const id = customId || defaultSlug;
  if (tools.some((t) => t.id === id)) {
    console.log(colors.red + 'Error: A tool with ID "' + id + '" already exists.' + colors.reset);
    await rl.question('Press Enter to return...');
    return;
  }
  let url = '';
  while (!url) {
    url = (await rl.question(colors.cyan + 'Website URL (https://...): ' + colors.reset)).trim();
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      console.log(colors.red + 'Please provide a valid URL starting with http:// or https://' + colors.reset);
      url = '';
    }
  }
  console.log('\n' + colors.bold + 'Available Categories:' + colors.reset);
  categories.forEach((cat, idx) => {
    console.log('  ' + colors.orange + '[' + (idx + 1) + ']' + colors.reset + ' ' + cat.name + ' (' + cat.id + ')');
  });
  let catIndex = -1;
  while (catIndex < 0 || catIndex >= categories.length) {
    const raw = (await rl.question(colors.cyan + 'Select Category [1-' + categories.length + ']: ' + colors.reset)).trim();
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= categories.length) catIndex = parsed - 1;
    else console.log(colors.red + 'Invalid category number.' + colors.reset);
  }
  const selectedCategory = categories[catIndex];
  const pricingOptions = ['Free', 'Freemium', 'Paid', 'Open Source', 'Free with Student ID'];
  console.log('\n' + colors.bold + 'Pricing Models:' + colors.reset);
  pricingOptions.forEach((opt, idx) => {
    console.log('  ' + colors.orange + '[' + (idx + 1) + ']' + colors.reset + ' ' + opt);
  });
  let priceIndex = 0;
  const rawPrice = (await rl.question(colors.cyan + 'Select Pricing [1-5, default 1: Free]: ' + colors.reset)).trim();
  const parsedPrice = parseInt(rawPrice, 10);
  if (!isNaN(parsedPrice) && parsedPrice >= 1 && parsedPrice <= pricingOptions.length) priceIndex = parsedPrice - 1;
  const selectedPricing = pricingOptions[priceIndex];
  let description = '';
  while (!description) {
    description = (await rl.question(colors.cyan + 'Short Description: ' + colors.reset)).trim();
    if (!description) console.log(colors.red + 'Description cannot be empty.' + colors.reset);
  }
  const rawTags = (await rl.question(colors.cyan + 'Tags (comma-separated, e.g. AI, React, Editor): ' + colors.reset)).trim();
  const tags = rawTags ? rawTags.split(',').map((t) => t.trim()).filter(Boolean) : ['Developer Tool'];
  console.log(colors.dim + 'Enter 2-4 key features (press enter on empty to finish):' + colors.reset);
  const keyFeatures = [];
  for (let i = 1; i <= 4; i++) {
    const feat = (await rl.question('  Feature ' + i + ' (optional): ')).trim();
    if (feat) keyFeatures.push(feat);
    else if (i > 2) break;
  }
  const studentPerk = (await rl.question(colors.cyan + 'Student Perk/Discount info (optional): ' + colors.reset)).trim();
  const isFeatured = (await rl.question(colors.cyan + 'Feature on homepage? (y/N): ' + colors.reset)).trim().toLowerCase() === 'y';
  const previewImage = (await rl.question(colors.cyan + 'Preview Image URL (optional, press Enter for default): ' + colors.reset)).trim() ||
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
  const newTool = {
    id,
    name,
    url,
    description,
    category: selectedCategory.id,
    categoryName: selectedCategory.name,
    pricing: selectedPricing,
    tags,
    featured: isFeatured,
    previewImage,
    ...(keyFeatures.length > 0 ? { keyFeatures } : {}),
    ...(studentPerk ? { studentPerk } : {}),
    createdAt: new Date().toISOString().split('T')[0]
  };
  tools.push(newTool);
  saveData(tools);
  console.log('\n' + colors.green + '✓ Successfully added "' + name + '" to ' + selectedCategory.name + '!' + colors.reset + '\n');
  await rl.question('Press Enter to continue...');
}

async function handleListTools(rl) {
  const { tools, categories } = readData();
  console.log('\n' + colors.bold + 'Select category to list:' + colors.reset);
  console.log('  ' + colors.orange + '[0]' + colors.reset + ' ALL Categories (' + tools.length + ' tools)');
  categories.forEach((c, idx) => {
    const count = tools.filter((t) => t.category === c.id).length;
    console.log('  ' + colors.orange + '[' + (idx + 1) + ']' + colors.reset + ' ' + c.name + ' (' + count + ' tools)');
  });
  const raw = (await rl.question(colors.cyan + 'Choice [0-' + categories.length + ']: ' + colors.reset)).trim();
  const parsed = parseInt(raw, 10);
  let filtered = tools;
  let title = 'ALL TOOLS';
  if (!isNaN(parsed) && parsed >= 1 && parsed <= categories.length) {
    const cat = categories[parsed - 1];
    filtered = tools.filter((t) => t.category === cat.id);
    title = cat.name.toUpperCase();
  }
  console.log('\n' + colors.bold + colors.orange + '═══ ' + title + ' (' + filtered.length + ') ═══' + colors.reset + '\n');
  filtered.forEach((tool, i) => {
    const featuredBadge = tool.featured ? ' ' + colors.yellow + '[★ Featured]' + colors.reset : '';
    const priceBadge = colors.accent + '[' + tool.pricing + ']' + colors.reset;
    console.log(colors.dim + (i + 1).toString().padStart(2, ' ') + '.' + colors.reset + ' ' + colors.bold + tool.name + colors.reset + ' ' + priceBadge + featuredBadge);
    console.log('    ' + colors.cyan + tool.url + colors.reset);
    console.log('    ' + colors.dim + tool.description + colors.reset);
    console.log('    ' + colors.gray + 'Tags: ' + tool.tags.join(', ') + colors.reset + '\n');
  });
  await rl.question('Press Enter to continue...');
}

async function handleSearchTools(rl) {
  const { tools } = readData();
  const query = (await rl.question('\n' + colors.cyan + 'Search query: ' + colors.reset)).trim().toLowerCase();
  if (!query) return;
  const results = tools.filter((t) =>
    t.name.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query) ||
    t.tags.some((tag) => tag.toLowerCase().includes(query)) ||
    t.categoryName.toLowerCase().includes(query)
  );
  console.log('\n' + colors.bold + colors.orange + 'Found ' + results.length + ' result(s) for "' + query + '":' + colors.reset + '\n');
  results.forEach((tool, i) => {
    console.log(colors.dim + (i + 1) + '.' + colors.reset + ' ' + colors.bold + tool.name + colors.reset + ' (' + tool.categoryName + ') - ' + colors.accent + tool.pricing + colors.reset);
    console.log('   ' + colors.cyan + tool.url + colors.reset);
    console.log('   ' + colors.dim + tool.description + colors.reset + '\n');
  });
  await rl.question('Press Enter to continue...');
}

async function handleEditTool(rl) {
  const { tools, categories } = readData();
  const idOrName = (await rl.question('\n' + colors.cyan + 'Enter Tool ID or Name to edit: ' + colors.reset)).trim().toLowerCase();
  const index = tools.findIndex((t) => t.id.toLowerCase() === idOrName || t.name.toLowerCase() === idOrName);
  if (index === -1) {
    console.log(colors.red + 'Tool not found.' + colors.reset);
    await rl.question('Press Enter to continue...');
    return;
  }
  const tool = tools[index];
  console.log('\n' + colors.bold + colors.orange + 'Editing: ' + tool.name + ' (' + tool.id + ')' + colors.reset);
  console.log(colors.dim + 'Press Enter on any field to keep existing value.\n' + colors.reset);
  const name = (await rl.question('Name [' + tool.name + ']: ')).trim() || tool.name;
  const url = (await rl.question('URL [' + tool.url + ']: ')).trim() || tool.url;
  const description = (await rl.question('Description [' + tool.description + ']: ')).trim() || tool.description;
  const rawTags = (await rl.question('Tags [' + tool.tags.join(', ') + ']: ')).trim();
  const tags = rawTags ? rawTags.split(',').map((t) => t.trim()).filter(Boolean) : tool.tags;
  const featChoice = (await rl.question('Featured [' + (tool.featured ? 'Yes' : 'No') + '] (y/n/enter): ')).trim().toLowerCase();
  const featured = featChoice === 'y' ? true : featChoice === 'n' ? false : tool.featured;
  tools[index] = { ...tool, name, url, description, tags, featured };
  saveData(tools);
  console.log('\n' + colors.green + '✓ Updated "' + tool.name + '" successfully!' + colors.reset + '\n');
  await rl.question('Press Enter to continue...');
}

async function handleDeleteTool(rl) {
  const { tools } = readData();
  const idOrName = (await rl.question('\n' + colors.cyan + 'Enter Tool ID or Name to DELETE: ' + colors.reset)).trim().toLowerCase();
  const index = tools.findIndex((t) => t.id.toLowerCase() === idOrName || t.name.toLowerCase() === idOrName);
  if (index === -1) {
    console.log(colors.red + 'Tool not found.' + colors.reset);
    await rl.question('Press Enter to continue...');
    return;
  }
  const tool = tools[index];
  const confirm = (await rl.question(colors.red + 'Are you sure you want to delete "' + tool.name + '"? (y/N): ' + colors.reset)).trim().toLowerCase();
  if (confirm === 'y') {
    tools.splice(index, 1);
    saveData(tools);
    console.log('\n' + colors.green + '✓ Deleted "' + tool.name + '". Remaining: ' + tools.length + colors.reset + '\n');
  } else {
    console.log('\n' + colors.yellow + 'Deletion cancelled.' + colors.reset + '\n');
  }
  await rl.question('Press Enter to continue...');
}

async function handleStats(rl) {
  const { tools, categories } = readData();
  console.log('\n' + colors.bold + colors.orange + '═══ DIRECTORY METRICS & BREAKDOWN ═══' + colors.reset + '\n');
  console.log(colors.bold + 'Category Counts:' + colors.reset);
  categories.forEach((cat) => {
    const count = tools.filter((t) => t.category === cat.id).length;
    const bar = '█'.repeat(Math.round(count * 1.2));
    console.log('  ' + cat.name.padEnd(32) + ' ' + colors.orange + bar + colors.reset + ' ' + count);
  });
  const pricingStats = {};
  tools.forEach((t) => {
    pricingStats[t.pricing] = (pricingStats[t.pricing] || 0) + 1;
  });
  console.log('\n' + colors.bold + 'Pricing Distribution:' + colors.reset);
  Object.entries(pricingStats).forEach(([price, count]) => {
    console.log('  ' + price.padEnd(25) + ' : ' + colors.cyan + count + ' tools' + colors.reset);
  });
  const featuredCount = tools.filter((t) => t.featured).length;
  console.log('\n' + colors.bold + 'Featured Showcases:' + colors.reset + ' ' + colors.yellow + featuredCount + colors.reset + ' / ' + tools.length);
  await rl.question('\nPress Enter to continue...');
}

async function handleValidation(rl) {
  const { tools, categories } = readData();
  console.log('\n' + colors.bold + colors.orange + '═══ DATABASE INTEGRITY CHECK ═══' + colors.reset + '\n');
  let errors = 0;
  let warnings = 0;
  const ids = new Set();
  const validCategories = new Set(categories.map((c) => c.id));
  tools.forEach((tool, idx) => {
    const loc = 'Tool #' + (idx + 1) + ' (' + (tool.name || 'Unnamed') + ')';
    if (!tool.id) { console.log(' ' + colors.red + '✗ [ERROR] Missing ID at ' + loc + colors.reset); errors++; }
    else if (ids.has(tool.id)) { console.log(' ' + colors.red + '✗ [ERROR] Duplicate ID "' + tool.id + '" at ' + loc + colors.reset); errors++; }
    else ids.add(tool.id);
    if (!validCategories.has(tool.category)) { console.log(' ' + colors.red + '✗ [ERROR] Invalid category "' + tool.category + '" at ' + loc + colors.reset); errors++; }
    if (!tool.url || (!tool.url.startsWith('http://') && !tool.url.startsWith('https://'))) { console.log(' ' + colors.red + '✗ [ERROR] Invalid URL at ' + loc + colors.reset); errors++; }
    if (!tool.description || tool.description.length < 10) { console.log(' ' + colors.yellow + '⚠ [WARN] Short description at ' + loc + colors.reset); warnings++; }
    if (!tool.tags || !Array.isArray(tool.tags) || tool.tags.length === 0) { console.log(' ' + colors.yellow + '⚠ [WARN] Missing tags at ' + loc + colors.reset); warnings++; }
  });
  if (errors === 0) console.log(' ' + colors.green + '✓ All ' + tools.length + ' entries valid! (0 errors, ' + warnings + ' warnings)' + colors.reset);
  else console.log(' ' + colors.red + '✗ Found ' + errors + ' error(s).' + colors.reset);
  await rl.question('\nPress Enter to continue...');
}

main().catch(console.error);
