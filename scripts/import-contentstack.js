#!/usr/bin/env node

/**
 * Contentstack Content Type Import Script
 * 
 * Usage:
 *   node import-contentstack.js <json-file> [options]
 * 
 * Examples:
 *   node import-contentstack.js ../resources/content_types/header.json
 *   node import-contentstack.js ../resources/content_types/header.json --skip-entries
 *   node import-contentstack.js ../resources/content_types/header.json --force
 * 
 * Options:
 *   --force         Delete existing content type before creating
 *   --skip-entries  Only create content type, skip entry creation
 *   --region        API region: us, eu, azure-na, azure-eu (default: eu)
 * 
 * Environment Variables:
 *   CONTENTSTACK_API_KEY          Stack API Key
 *   CONTENTSTACK_MANAGEMENT_TOKEN Management Token
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration - can be overridden by environment variables
const config = {
  apiKey: process.env.CONTENTSTACK_API_KEY,
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
  region: 'us' // us, eu, azure-na, azure-eu
};

// Region to hostname mapping
const REGION_HOSTS = {
  'us': 'api.contentstack.io',
  'eu': 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com',
  'azure-eu': 'azure-eu-api.contentstack.com'
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    jsonFile: null,
    force: false,
    skipEntries: false,
    region: config.region
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--force') {
      options.force = true;
    } else if (arg === '--skip-entries') {
      options.skipEntries = true;
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
Contentstack Content Type Import Script

Usage:
  node import-contentstack.js <json-file> [options]

Arguments:
  json-file       Path to the content type JSON file

Options:
  --force         Delete existing content type before creating
  --skip-entries  Only create content type, skip entry creation
  --region        API region: us, eu, azure-na, azure-eu (default: eu)
  --help, -h      Show this help message

Environment Variables:
  CONTENTSTACK_API_KEY          Stack API Key
  CONTENTSTACK_MANAGEMENT_TOKEN Management Token

Examples:
  node import-contentstack.js ../resources/content_types/header.json
  node import-contentstack.js ../resources/content_types/footer.json --force
  node import-contentstack.js ./new_car.json --skip-entries --region us
`);
}

function makeRequest(method, path, data, hostname) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: hostname,
      port: 443,
      path: path,
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

async function checkContentTypeExists(uid, hostname) {
  try {
    await makeRequest('GET', `/v3/content_types/${uid}`, null, hostname);
    return true;
  } catch (err) {
    if (err.statusCode === 404) {
      return false;
    }
    throw err;
  }
}

async function deleteContentType(uid, hostname) {
  await makeRequest('DELETE', `/v3/content_types/${uid}?force=true`, null, hostname);
}

async function createContentType(contentType, hostname) {
  return await makeRequest('POST', '/v3/content_types', { content_type: contentType }, hostname);
}

async function createEntry(contentTypeUid, entry, hostname, locale = 'en-us') {
  return await makeRequest(
    'POST', 
    `/v3/content_types/${contentTypeUid}/entries?locale=${locale}`, 
    { entry }, 
    hostname
  );
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

  console.log('🚀 Contentstack Import Script');
  console.log('═'.repeat(50));
  console.log(`📁 File: ${options.jsonFile}`);
  console.log(`🌍 Region: ${options.region} (${hostname})`);
  console.log(`🔑 API Key: ${config.apiKey.substring(0, 10)}...`);
  console.log('═'.repeat(50) + '\n');

  // Load JSON file
  console.log('1. Loading JSON file...');
  const jsonData = loadJsonFile(options.jsonFile);
  
  // Extract content type and entries
  let contentType, entries = [];
  
  if (jsonData.content_type) {
    contentType = jsonData.content_type;
    entries = jsonData.entries || [];
  } else if (jsonData.uid && jsonData.schema) {
    // Direct content type format
    contentType = jsonData;
  } else {
    console.error('Error: Invalid JSON format. Expected "content_type" object with "uid" and "schema".');
    process.exit(1);
  }

  const contentTypeUid = contentType.uid;
  console.log(`   ✓ Loaded content type: "${contentType.title}" (uid: ${contentTypeUid})`);
  console.log(`   ✓ Found ${entries.length} entries to create\n`);

  // Check if content type exists
  console.log('2. Checking existing content type...');
  let exists = false;
  try {
    exists = await checkContentTypeExists(contentTypeUid, hostname);
    
    if (exists) {
      if (options.force) {
        console.log(`   Content type "${contentTypeUid}" exists, deleting (--force)...`);
        await deleteContentType(contentTypeUid, hostname);
        console.log('   ✓ Deleted existing content type\n');
      } else {
        console.log(`   ⚠️  Content type "${contentTypeUid}" already exists.`);
        console.log('   Use --force to delete and recreate.\n');
        
        // Skip to entry creation if content type exists
        if (!options.skipEntries && entries.length > 0) {
          console.log('3. Skipping content type creation, proceeding to entries...\n');
          await createEntries(contentTypeUid, entries, hostname);
        }
        return;
      }
    } else {
      console.log(`   Content type "${contentTypeUid}" does not exist, will create\n`);
    }
  } catch (err) {
    // If we get a "not found" error, the content type doesn't exist - which is fine
    const errorMsg = err.body?.error_message || err.message || '';
    if (errorMsg.toLowerCase().includes('not found') || err.statusCode === 404) {
      console.log(`   Content type "${contentTypeUid}" does not exist, will create\n`);
      exists = false;
    } else {
      console.error('   Error checking content type:', errorMsg);
      process.exit(1);
    }
  }

  // Create content type
  console.log('3. Creating content type...');
  try {
    const result = await createContentType(contentType, hostname);
    console.log(`   ✓ Content type "${contentTypeUid}" created successfully!`);
    if (result.content_type?.uid) {
      console.log(`   UID: ${result.content_type.uid}\n`);
    }
  } catch (err) {
    console.error('   ✗ Failed to create content type');
    console.error('   Status:', err.statusCode);
    console.error('   Error:', err.body?.error_message || err.message);
    if (err.body?.errors) {
      console.error('   Details:', JSON.stringify(err.body.errors, null, 2));
    }
    if (err.body) {
      console.error('   Full response:', JSON.stringify(err.body, null, 2));
    }
    process.exit(1);
  }

  // Create entries
  if (!options.skipEntries && entries.length > 0) {
    await createEntries(contentTypeUid, entries, hostname);
  } else if (options.skipEntries) {
    console.log('4. Skipping entry creation (--skip-entries)\n');
  } else {
    console.log('4. No entries to create\n');
  }

  console.log('═'.repeat(50));
  console.log('✅ Import completed successfully!');
  console.log('═'.repeat(50));
  console.log('\nNext steps:');
  console.log(`1. Go to your Contentstack dashboard`);
  console.log(`2. Navigate to Content → ${contentType.title}`);
  console.log('3. Publish the entries to make them available via Delivery API');
}

async function createEntries(contentTypeUid, entries, hostname) {
  console.log(`4. Creating ${entries.length} entries...`);
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entryTitle = entry.title || `Entry ${i + 1}`;
    
    try {
      const result = await createEntry(contentTypeUid, entry, hostname);
      console.log(`   ✓ [${i + 1}/${entries.length}] Created: "${entryTitle}" (uid: ${result.entry?.uid})`);
    } catch (err) {
      console.error(`   ✗ [${i + 1}/${entries.length}] Failed: "${entryTitle}"`);
      console.error(`     Error: ${err.body?.error_message || JSON.stringify(err.body)}`);
    }
  }
  console.log('');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
