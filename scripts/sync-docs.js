import fs from 'fs/promises';
import path from 'path';

async function syncDocs() {
  try {
    const sourceDir = 'docs';
    const targetDir = 'docs-site/docs';
    
    console.log('🔄 Syncing documentation from docs/ to docs-site/docs/...');
    
    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });
    
    // Read all files from source directory
    const files = await fs.readdir(sourceDir);
    
    // Filter for markdown files
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
                    // Copy each markdown file
                for (const file of markdownFiles) {
                  const sourcePath = path.join(sourceDir, file);
                  const targetPath = path.join(targetDir, file);

                  await fs.copyFile(sourcePath, targetPath);
                  console.log(`  ✅ Copied: ${file}`);
                }

                // Handle subdirectories (like development/)
                const items = await fs.readdir(sourceDir, { withFileTypes: true });
                for (const item of items) {
                  if (item.isDirectory()) {
                    const subSourceDir = path.join(sourceDir, item.name);
                    const subTargetDir = path.join(targetDir, item.name);
                    
                    // Ensure target subdirectory exists
                    await fs.mkdir(subTargetDir, { recursive: true });
                    
                    // Read subdirectory files
                    const subFiles = await fs.readdir(subSourceDir);
                    const subMarkdownFiles = subFiles.filter(file => file.endsWith('.md'));
                    
                    for (const file of subMarkdownFiles) {
                      const sourcePath = path.join(subSourceDir, file);
                      const targetPath = path.join(subTargetDir, file);
                      
                      await fs.copyFile(sourcePath, targetPath);
                      console.log(`  ✅ Copied: ${item.name}/${file}`);
                    }
                  }
                }
    
    // Also copy any SVG files (like ERD)
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    for (const file of svgFiles) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      await fs.copyFile(sourcePath, targetPath);
      console.log(`  ✅ Copied: ${file}`);
    }
    
    console.log(`✅ Documentation sync complete! ${markdownFiles.length + svgFiles.length} files synced.`);
    
  } catch (error) {
    console.error('❌ Error syncing documentation:', error);
    process.exit(1);
  }
}

syncDocs(); 