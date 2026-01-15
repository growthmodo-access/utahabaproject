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
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`Found ${data.length} rows in Excel file`);

  // Transform data
  const providers = data.map((row, index) => {
    const id = row.id || row.ID || `provider-${index + 1}`;
    
    return {
      id: String(id),
      name: row.name || row.Name || row['Provider Name'] || 'Unknown Provider',
      county: row.county || row.County || '',
      city: row.city || row.City || '',
      address: row.address || row.Address || '',
      phone: row.phone || row.Phone || row['Phone Number'] || '',
      email: row.email || row.Email || '',
      website: row.website || row.Website || row['Web Site'] || '',
      description: row.description || row.Description || '',
      services: row.services 
        ? (Array.isArray(row.services) 
            ? row.services 
            : String(row.services).split(',').map(s => s.trim()).filter(Boolean))
        : [],
      rating: row.rating || row.Rating 
        ? parseFloat(row.rating || row.Rating) 
        : undefined,
      rank: row.rank || row.Rank 
        ? parseInt(row.rank || row.Rank) 
        : undefined,
      yearsExperience: row.yearsExperience || row['Years Experience'] 
        ? parseInt(row.yearsExperience || row['Years Experience']) 
        : undefined,
      certifications: row.certifications 
        ? (Array.isArray(row.certifications) 
            ? row.certifications 
            : String(row.certifications).split(',').map(c => c.trim()).filter(Boolean))
        : [],
      insuranceAccepted: row.insuranceAccepted || row['Insurance Accepted']
        ? (Array.isArray(row.insuranceAccepted || row['Insurance Accepted'])
            ? row.insuranceAccepted || row['Insurance Accepted']
            : String(row.insuranceAccepted || row['Insurance Accepted']).split(',').map(i => i.trim()).filter(Boolean))
        : [],
      ageGroups: row.ageGroups || row['Age Groups']
        ? (Array.isArray(row.ageGroups || row['Age Groups'])
            ? row.ageGroups || row['Age Groups']
            : String(row.ageGroups || row['Age Groups']).split(',').map(a => a.trim()).filter(Boolean))
        : [],
    };
  });

  // Save to JSON file
  const outputPath = path.join(__dirname, '..', 'data', 'providers.json');
  const dataDir = path.dirname(outputPath);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2));
  
  console.log(`✅ Successfully imported ${providers.length} providers`);
  console.log(`📁 Data saved to: ${outputPath}`);
  console.log('\nNext steps:');
  console.log('1. Review the generated providers.json file');
  console.log('2. Use the /api/providers/import endpoint or load this JSON in your app');
  
} catch (error) {
  console.error('Error importing providers:', error);
  process.exit(1);
}
