import fs from 'fs/promises';
import path from 'path';

async function updateDocsStatus() {
  try {
    console.log('🔄 Updating documentation status...');
    
    // Read the current status template from the source docs directory
    const statusPath = 'docs/development/current-status.md';
    let content = await fs.readFile(statusPath, 'utf-8');
    
    // Update the last updated date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Check if there's already a last updated section
    if (content.includes('*Last updated:')) {
      // Update existing last updated line
      content = content.replace(
        /\*Last updated:.*?\*/,
        `*Last updated: ${currentDate}*`
      );
    } else {
      // Add last updated section after the title
      const titleEnd = content.indexOf('\n', content.indexOf('# Current Development Status'));
      if (titleEnd !== -1) {
        const beforeTitle = content.substring(0, titleEnd + 1);
        const afterTitle = content.substring(titleEnd + 1);
        content = `${beforeTitle}*Last updated: ${currentDate}*\n\n${afterTitle}`;
      }
    }
    
    // Write the updated content back to source
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