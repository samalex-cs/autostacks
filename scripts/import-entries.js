#!/usr/bin/env node

/**
 * Contentstack Entry Import Script
 * 
 * Usage:
 *   node import-entries.js <json-file> [options]
 * 
 * Examples:
 *   node import-entries.js ../resources/entries/header.json
 *   node import-entries.js ../resources/entries/new_car.json --publish
 *   node import-entries.js ../resources/entries/footer.json --upsert
 * 
 * Options:
 *   --content-type  Override content type UID from JSON file
 *   --locale        Locale for entries (default: en-us)
 *   --publish       Publish entries after creation
 *   --upsert        Update if entry exists (matches by title), create if not
 *   --region        API region: us, eu, azure-na, azure-eu (default: us)
 * 
 * Environment Variables:
 *   CONTENTSTACK_API_KEY          Stack API Key
 *   CONTENTSTACK_MANAGEMENT_TOKEN Management Token
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  apiKey: process.env.CONTENTSTACK_API_KEY,
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
  region: 'us'
};

// Region to hostname mapping
const REGION_HOSTS = {
  'us': 'api.contentstack.io',
  'eu': 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com',
  'azure-eu': 'azure-eu-api.contentstack.com'
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    jsonFile: null,
    contentType: null,
    locale: 'en-us',
    publish: false,
    upsert: false,
    region: config.region
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--content-type' && args[i + 1]) {
      options.contentType = args[++i];
    } else if (arg === '--locale' && args[i + 1]) {
      options.locale = args[++i];
    } else if (arg === '--publish') {
      options.publish = true;
    } else if (arg === '--upsert') {
      options.upsert = true;
    } else if (arg === '--region' && args[i + 1]) {
      options.region = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('--') && !options.jsonFile) {
      options.jsonFile = arg;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Contentstack Entry Import Script

Usage:
  node import-entries.js <json-file> [options]

Arguments:
  json-file         Path to the entries JSON file

Options:
  --content-type    Override content type UID from JSON file
  --locale          Locale for entries (default: en-us)
  --publish         Publish entries after creation/update
  --upsert          Update existing entries (matches by title), create if not found
  --region          API region: us, eu, azure-na, azure-eu (default: us)
  --help, -h        Show this help message

Environment Variables:
  CONTENTSTACK_API_KEY          Stack API Key
  CONTENTSTACK_MANAGEMENT_TOKEN Management Token

JSON File Format:
  {
    "content_type": "header",
    "locale": "en-us",
    "entries": [
      { "title": "Entry 1", ... },
      { "title": "Entry 2", ... }
    ]
  }

Examples:
  node import-entries.js ../resources/entries/header.json
  node import-entries.js ../resources/entries/header.json --upsert --publish
  node import-entries.js ../resources/entries/new_car.json --publish
  node import-entries.js ../resources/entries/cars.json --content-type used_car
`);
}

function makeRequest(method, apiPath, data, hostname) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: hostname,
      port: 443,
      path: apiPath,
      method: method,
      headers: {
        'api_key': config.apiKey,
        'authorization': config.managementToken,
        'Content-Type': 'application/json',
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ statusCode: res.statusCode, body: parsed });
          }
        } catch (e) {
          reject({ statusCode: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function loadJsonFile(filePath) {
  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found: ${absolutePath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error: Failed to parse JSON file: ${err.message}`);
    process.exit(1);
  }
}

async function getExistingEntries(contentTypeUid, hostname, locale) {
  try {
    const result = await makeRequest(
      'GET', 
      `/v3/content_types/${contentTypeUid}/entries?locale=${locale}&include_count=true`, 
      null, 
      hostname
    );
    return result.entries || [];
  } catch (err) {
    return [];
  }
}

async function createEntry(contentTypeUid, entry, hostname, locale) {
  return await makeRequest(
    'POST', 
    `/v3/content_types/${contentTypeUid}/entries?locale=${locale}`, 
    { entry }, 
    hostname
  );
}

async function updateEntry(contentTypeUid, entryUid, entry, hostname, locale) {
  return await makeRequest(
    'PUT', 
    `/v3/content_types/${contentTypeUid}/entries/${entryUid}?locale=${locale}`, 
    { entry }, 
    hostname
  );
}

async function publishEntry(contentTypeUid, entryUid, hostname, locale, environments) {
  const publishData = {
    entry: {
      environments: environments,
      locales: [locale]
    }
  };
  
  return await makeRequest(
    'POST', 
    `/v3/content_types/${contentTypeUid}/entries/${entryUid}/publish`, 
    publishData, 
    hostname
  );
}

async function getEnvironments(hostname) {
  try {
    const result = await makeRequest('GET', '/v3/environments', null, hostname);
    return result.environments?.map(env => env.name) || ['development'];
  } catch (err) {
    return ['development'];
  }
}

async function main() {
  const options = parseArgs();

  if (!options.jsonFile) {
    console.error('Error: No JSON file specified\n');
    printHelp();
    process.exit(1);
  }

  const hostname = REGION_HOSTS[options.region];
  if (!hostname) {
    console.error(`Error: Invalid region "${options.region}". Valid options: us, eu, azure-na, azure-eu`);
    process.exit(1);
  }

  console.log('🚀 Contentstack Entry Import Script');
  console.log('═'.repeat(50));
  console.log(`📁 File: ${options.jsonFile}`);
  console.log(`🌍 Region: ${options.region} (${hostname})`);
  console.log(`🔑 API Key: ${config.apiKey.substring(0, 10)}...`);
  console.log('═'.repeat(50) + '\n');

  // Load JSON file
  console.log('1. Loading JSON file...');
  const jsonData = loadJsonFile(options.jsonFile);
  
  const contentTypeUid = options.contentType || jsonData.content_type;
  const locale = options.locale || jsonData.locale || 'en-us';
  const entries = jsonData.entries || [];

  if (!contentTypeUid) {
    console.error('Error: No content type specified.');
    process.exit(1);
  }

  if (entries.length === 0) {
    console.error('Error: No entries found in JSON file.');
    process.exit(1);
  }

  console.log(`   ✓ Content Type: ${contentTypeUid}`);
  console.log(`   ✓ Locale: ${locale}`);
  console.log(`   ✓ Found ${entries.length} entries`);
  console.log(`   ✓ Mode: ${options.upsert ? 'Upsert (create/update)' : 'Create only'}`);
  if (options.publish) {
    console.log(`   ✓ Auto-publish: enabled`);
  }
  console.log('');

  // Fetch existing entries if upsert mode
  let existingEntries = [];
  if (options.upsert) {
    console.log('2. Fetching existing entries...');
    existingEntries = await getExistingEntries(contentTypeUid, hostname, locale);
    console.log(`   ✓ Found ${existingEntries.length} existing entries\n`);
  }

  // Get environments for publishing
  let environments = ['development'];
  if (options.publish) {
    const step = options.upsert ? '3' : '2';
    console.log(`${step}. Fetching available environments...`);
    environments = await getEnvironments(hostname);
    console.log(`   ✓ Environments: ${environments.length > 0 ? environments.join(', ') : 'development'}\n`);
    if (environments.length === 0) environments = ['development'];
  }

  // Process entries
  const step = options.publish ? (options.upsert ? '4' : '3') : (options.upsert ? '3' : '2');
  console.log(`${step}. Processing entries...`);
  
  const results = { created: [], updated: [], failed: [] };

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entryTitle = entry.title || entry.name || `Entry ${i + 1}`;
    
    try {
      let result;
      let action;
      
      // Check if entry exists (by title) when upsert is enabled
      const existingEntry = options.upsert 
        ? existingEntries.find(e => e.title === entryTitle)
        : null;
      
      if (existingEntry) {
        // Update existing entry
        result = await updateEntry(contentTypeUid, existingEntry.uid, entry, hostname, locale);
        action = 'Updated';
        results.updated.push({ title: entryTitle, uid: result.entry?.uid });
      } else {
        // Create new entry
        result = await createEntry(contentTypeUid, entry, hostname, locale);
        action = 'Created';
        results.created.push({ title: entryTitle, uid: result.entry?.uid });
      }
      
      console.log(`   ✓ [${i + 1}/${entries.length}] ${action}: "${entryTitle}" (uid: ${result.entry?.uid})`);

      // Publish if requested
      const entryUid = result.entry?.uid;
      if (options.publish && entryUid) {
        try {
          await publishEntry(contentTypeUid, entryUid, hostname, locale, environments);
          console.log(`     📤 Published`);
        } catch (pubErr) {
          console.log(`     ⚠️  Publish failed: ${pubErr.body?.error_message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error(`   ✗ [${i + 1}/${entries.length}] Failed: "${entryTitle}"`);
      const errorDetail = err.body?.error_message || err.body?.errors || JSON.stringify(err.body);
      console.error(`     Error: ${typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail}`);
      results.failed.push({ title: entryTitle, error: errorDetail });
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Import Summary');
  console.log('═'.repeat(50));
  console.log(`✅ Created: ${results.created.length}`);
  console.log(`🔄 Updated: ${results.updated.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.created.length > 0) {
    console.log('\nCreated entries:');
    results.created.forEach(e => console.log(`  + ${e.title} (${e.uid})`));
  }
  
  if (results.updated.length > 0) {
    console.log('\nUpdated entries:');
    results.updated.forEach(e => console.log(`  ~ ${e.title} (${e.uid})`));
  }
  
  if (results.failed.length > 0) {
    console.log('\nFailed entries:');
    results.failed.forEach(e => console.log(`  ✗ ${e.title}`));
  }

  console.log('\n' + '═'.repeat(50));
  if (results.failed.length === 0) {
    console.log('✅ Import completed successfully!');
  } else {
    console.log('⚠️  Import completed with some errors');
  }
  console.log('═'.repeat(50));
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
