import fs from 'fs/promises';
import path from 'path';

async function updateDocsStatus() {
  try {
    console.log('🔄 Updating documentation status...');
    
    // Read the current status template
    const statusPath = 'docs-site/docs/development/current-status.md';
    let content = await fs.readFile(statusPath, 'utf-8');
    
    // Update the last updated date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    content = content.replace(
      /\*Last updated: \[Current Date\]\*/,
      `*Last updated: ${currentDate}*`
    );
    
    // Write the updated content
    await fs.writeFile(statusPath, content);
    
    console.log('✅ Documentation status updated');
    console.log('📝 Remember to:');
    console.log('  - Update issue statuses as you work');
    console.log('  - Add recent activity notes');
    console.log('  - Update progress percentages');
    console.log('  - Run: pnpm run docs:sync');
    
  } catch (error) {
    console.error('❌ Error updating documentation status:', error);
    process.exit(1);
  }
}

updateDocsStatus(); 