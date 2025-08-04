import fs from 'fs/promises';
import path from 'path';

async function generateDataDictionary() {
  try {
    // Read the schema file
    const schemaPath = 'prisma/schema.prisma';
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    
    // Parse the schema manually
    const models = parsePrismaSchema(schemaContent);
    
    // Check if data-dictionary.md already exists
    const existingPath = 'docs/data-dictionary.md';
    let existingContent = '';
    let hasExisting = false;
    
    try {
      existingContent = await fs.readFile(existingPath, 'utf-8');
      hasExisting = true;
      console.log('📖 Found existing data-dictionary.md - will enhance it');
    } catch (error) {
      console.log('📝 No existing data-dictionary.md found - will create new one');
    }
    
    // Generate the models section
    let modelsSection = `## Models\n\n`;
    
    for (const model of models) {
      modelsSection += `### ${model.name}\n\n`;
      
      // Add model documentation if available
      if (model.documentation) {
        modelsSection += `${model.documentation}\n\n`;
      }
      
      modelsSection += `#### Fields\n\n`;
      modelsSection += `| Field | Type | Required | Description |\n`;
      modelsSection += `|-------|------|----------|-------------|\n`;
      
      for (const field of model.fields) {
        const required = field.isRequired ? 'Yes' : 'No';
        const description = field.documentation || '';
        modelsSection += `| \`${field.name}\` | \`${field.type}${field.isList ? '[]' : ''}\` | ${required} | ${description} |\n`;
      }
      
      modelsSection += '\n';
      
      // Add relationships section if there are relations
      const relationFields = model.fields.filter(f => f.relationName);
      if (relationFields.length > 0) {
        modelsSection += `#### Relationships\n\n`;
        for (const field of relationFields) {
          modelsSection += `- **${field.name}**: ${field.relationName || 'Relationship'} with \`${field.type}\`\n`;
        }
        modelsSection += '\n';
      }
      
      // Add indexes section if there are indexes
      if (model.indexes.length > 0) {
        modelsSection += `#### Indexes\n\n`;
        for (const index of model.indexes) {
          const indexName = index.name ? ` (${index.name})` : '';
          modelsSection += `- \`${index.fields.join(', ')}\`${indexName}\n`;
        }
        modelsSection += '\n';
      }
      
      modelsSection += '---\n\n';
    }
    
    // Generate relationships overview
    const relationshipsSection = `## Relationships Overview

### Scenario (Root Entity)
- **Scenario** is the root entity that contains all other data
- Each scenario represents a different financial planning scenario
- All other entities belong to a specific scenario

### Account Management
- **Account** represents financial accounts (checking, savings, investment, etc.)
- **AccountBalance** tracks historical balances for each account
- **AccountTransfer** handles internal transfers between accounts

### Transaction Tracking
- **IncomeEvent** records income transactions
- **ExpenseEvent** records expense transactions with categorization

### Data Flow
1. Create a **Scenario** for your financial planning
2. Add **Accounts** to the scenario
3. Record **IncomeEvent** and **ExpenseEvent** transactions
4. Track **AccountBalance** over time
5. Use **AccountTransfer** for internal account movements

## Data Types

- **String**: Text data, often UUIDs for IDs
- **DateTime**: Date and time values
- **Decimal**: Financial amounts (precise decimal arithmetic)
- **Boolean**: True/false values
- **UUID**: Unique identifiers generated automatically

## Constraints and Rules

- All entities cascade delete when their parent scenario is deleted
- Account transfers must have different source and destination accounts
- Balance tracking supports both actual and projected values
- Expense events include categorization for analysis
- Income events can be associated with specific owners

`;

    let finalContent = '';
    
    if (hasExisting) {
      // Enhance existing content by replacing the models section
      const modelsStart = existingContent.indexOf('## Models');
      if (modelsStart !== -1) {
        const beforeModels = existingContent.substring(0, modelsStart);
        finalContent = beforeModels + modelsSection + relationshipsSection;
      } else {
        // If no models section found, append to end
        finalContent = existingContent + '\n\n' + modelsSection + relationshipsSection;
      }
    } else {
      // Create new content
      finalContent = `# Family CFO Data Dictionary

This document describes the database schema for the Family CFO application, which helps families plan and track their financial scenarios.

## Overview

The application is built around the concept of **Scenarios** - different financial planning scenarios that can be compared and analyzed. Each scenario contains accounts, transactions, and balances.

${modelsSection}${relationshipsSection}`;
    }
    
    // Ensure docs directory exists
    await fs.mkdir('docs', { recursive: true });
    
    // Write the markdown file
    await fs.writeFile(existingPath, finalContent);
    
    console.log('✅ Data dictionary generated: docs/data-dictionary.md');
    console.log('📝 Next steps:');
    console.log('  - Review and enhance the generated content');
    console.log('  - Add any missing documentation');
    console.log('  - Run: pnpm run docs:sync');
    
  } catch (error) {
    console.error('❌ Error generating data dictionary:', error);
    process.exit(1);
  }
}

function parsePrismaSchema(content) {
  const models = [];
  const lines = content.split('\n');
  let currentModel = null;
  let inModel = false;
  let inComment = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('//')) continue;
    
    // Check for model start
    if (line.startsWith('model ')) {
      const modelName = line.match(/model\s+(\w+)/)?.[1];
      if (modelName) {
        currentModel = {
          name: modelName,
          fields: [],
          indexes: [],
          documentation: ''
        };
        inModel = true;
        
        // Look for documentation comment above the model
        let j = i - 1;
        while (j >= 0 && lines[j].trim().startsWith('//')) {
          const comment = lines[j].trim().substring(2).trim();
          if (comment) {
            currentModel.documentation = comment;
            break;
          }
          j--;
        }
      }
      continue;
    }
    
    // Check for model end
    if (line === '}' && inModel) {
      if (currentModel) {
        models.push(currentModel);
      }
      inModel = false;
      currentModel = null;
      continue;
    }
    
    // Parse fields within a model
    if (inModel && currentModel && line.includes(' ')) {
      const fieldMatch = line.match(/^(\w+)\s+(\w+)(\[\])?(\?)?/);
      if (fieldMatch) {
        const [, fieldName, fieldType, isList, isOptional] = fieldMatch;
        
        // Look for documentation comment above the field
        let documentation = '';
        let j = i - 1;
        while (j >= 0 && lines[j].trim().startsWith('//')) {
          const comment = lines[j].trim().substring(2).trim();
          if (comment) {
            documentation = comment;
            break;
          }
          j--;
        }
        
        // Parse relation info
        let relationName = null;
        let relationFromFields = null;
        let relationToFields = null;
        
        if (line.includes('@relation')) {
          const relationMatch = line.match(/@relation\("([^"]+)"\)/);
          if (relationMatch) {
            relationName = relationMatch[1];
          }
          
          const fieldsMatch = line.match(/fields:\s*\[([^\]]+)\]/);
          const referencesMatch = line.match(/references:\s*\[([^\]]+)\]/);
          
          if (fieldsMatch) {
            relationFromFields = fieldsMatch[1].split(',').map(f => f.trim());
          }
          if (referencesMatch) {
            relationToFields = referencesMatch[1].split(',').map(f => f.trim());
          }
        }
        
        currentModel.fields.push({
          name: fieldName,
          type: fieldType,
          isList: !!isList,
          isRequired: !isOptional,
          documentation,
          relationName,
          relationFromFields,
          relationToFields
        });
      }
      
      // Parse indexes
      if (line.startsWith('@@index')) {
        const indexMatch = line.match(/@@index\(\[([^\]]+)\](?:,\s*name:\s*"([^"]+)")?\)/);
        if (indexMatch) {
          const fields = indexMatch[1].split(',').map(f => f.trim());
          const name = indexMatch[2] || null;
          currentModel.indexes.push({ fields, name });
        }
      }
    }
  }
  
  return models;
}

generateDataDictionary(); 