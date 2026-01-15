/**
 * Utility script to import providers from Excel file
 * Usage: node scripts/import-providers.js <path-to-excel-file>
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = process.argv[2];

if (!excelFilePath) {
  console.error('Please provide the path to the Excel file');
  console.error('Usage: node scripts/import-providers.js <path-to-excel-file>');
  process.exit(1);
}

if (!fs.existsSync(excelFilePath)) {
  console.error(`File not found: ${excelFilePath}`);
  process.exit(1);
}

try {
  // Read Excel file
  const workbook = XLSX.readFile(excelFilePath);
  
  // Try to find "All Providers" sheet, otherwise use first sheet
  let sheetName = workbook.SheetNames.find(name => 
    name.toLowerCase().includes('provider') || 
    name.toLowerCase().includes('all')
  ) || workbook.SheetNames[0];
  
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`Found ${data.length} rows in Excel file (sheet: ${sheetName})`);

  // Transform data
  const providers = data.map((row, index) => {
    // Generate ID
    const id = row.id || row.ID || `provider-${index + 1}`;
    
    // Extract provider name (handle various column name formats)
    const name = row['Provider Name'] || row['provider name'] || row.name || row.Name || 'Unknown Provider';
    
    // Extract counties served (can be comma-separated)
    const countiesServed = row['Counties Served'] || row['counties served'] || row.county || row.County || '';
    const counties = countiesServed ? 
      String(countiesServed).split(',').map(c => c.trim()).filter(Boolean) : [];
    
    // Use first county as primary county, or extract from address
    const primaryCounty = counties.length > 0 ? counties[0] : '';
    
    // Extract address and try to parse city/county from it
    const address = row.Address || row.address || '';
    let city = row.City || row.city || '';
    let county = primaryCounty || row.County || row.county || '';
    
    // Try to extract city from address if not provided
    if (!city && address) {
      // Common Utah city patterns
      const cityMatch = address.match(/(\w+),?\s+UT/i);
      if (cityMatch) {
        city = cityMatch[1];
      }
    }
    
    // Extract phone
    const phone = row.Phone || row.phone || '';
    
    // Extract email
    const email = row.Email || row.email || '';
    
    // Extract website (add https:// if missing)
    let website = row.Website || row.website || '';
    if (website && !website.startsWith('http')) {
      website = 'https://' + website;
    }
    
    // Extract insurance accepted (comma-separated)
    const insuranceStr = row['Insurance Accepted'] || row['insurance accepted'] || row.insuranceAccepted || '';
    const insuranceAccepted = insuranceStr ? 
      String(insuranceStr).split(',').map(i => i.trim()).filter(Boolean) : [];
    
    // Extract ages served
    const agesServed = row['Ages Served'] || row['ages served'] || row.ageGroups || '';
    const ageGroups = agesServed ? 
      [String(agesServed).trim()] : [];
    
    // Extract other fields
    const waitlist = row.Waitlist || row.waitlist || '';
    const telehealth = row.Telehealth || row.telehealth || '';
    const spanishSpeakers = row['Spanish Speakers'] || row['spanish speakers'] || '';
    
    // Build description from available info
    const descriptionParts = [];
    if (telehealth === 'Yes') descriptionParts.push('Offers telehealth services');
    if (spanishSpeakers === 'Yes') descriptionParts.push('Spanish-speaking staff available');
    if (waitlist) descriptionParts.push(`Waitlist: ${waitlist}`);
    const description = descriptionParts.join('. ') || undefined;
    
    // Build services array
    const services = [];
    if (telehealth === 'Yes') services.push('Telehealth');
    if (spanishSpeakers === 'Yes') services.push('Spanish Language Support');
    
    return {
      id: String(id),
      name: name.trim(),
      county: county.trim() || (counties.length > 0 ? counties[0] : ''),
      city: city.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      description: description,
      services: services.length > 0 ? services : undefined,
      insuranceAccepted: insuranceAccepted.length > 0 ? insuranceAccepted : undefined,
      ageGroups: ageGroups.length > 0 ? ageGroups : undefined,
      countiesServed: counties.length > 0 ? counties : undefined, // Store all counties
      waitlist: waitlist || undefined,
      telehealth: telehealth === 'Yes' || undefined,
      spanishSpeakers: spanishSpeakers === 'Yes' || undefined,
    };
  }).filter(p => p.name && p.name !== 'Unknown Provider'); // Filter out empty rows

  // Save to JSON file
  const outputPath = path.join(__dirname, '..', 'data', 'providers.json');
  const dataDir = path.dirname(outputPath);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2));
  
  console.log(`✅ Successfully imported ${providers.length} providers`);
  console.log(`📁 Data saved to: ${outputPath}`);
  console.log('\nSummary:');
  console.log(`- Total providers: ${providers.length}`);
  const counties = [...new Set(providers.map(p => p.county).filter(Boolean))];
  console.log(`- Counties: ${counties.length} (${counties.join(', ')})`);
  console.log('\nNext steps:');
  console.log('1. Review the generated providers.json file');
  console.log('2. Restart your dev server to see the providers');
  
} catch (error) {
  console.error('Error importing providers:', error);
  process.exit(1);
}
