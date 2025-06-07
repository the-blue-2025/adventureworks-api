import { Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import { join } from 'path';

// Function to initialize all models
export function initializeModels(sequelize: Sequelize): void {
  // Get all model files in the current directory
  const modelFiles = readdirSync(__dirname)
    .filter(file => 
      file.indexOf('.') !== 0 && // Ignore hidden files
      file !== 'index.ts' && // Ignore this file
      file.slice(-3) === '.ts' && // Only .ts files
      file.indexOf('.test.ts') === -1 && // Ignore test files
      file.indexOf('.d.ts') === -1 // Ignore type declaration files
    );

  // Import and initialize each model
  for (const file of modelFiles) {
    const model = require(join(__dirname, file));
    const modelClass = Object.values(model)[0] as any;
    
    if (typeof modelClass.initialize === 'function') {
      modelClass.initialize(sequelize);
    }
  }

  // After all models are initialized, set up associations if they exist
  const models = sequelize.models;
  Object.values(models).forEach((model: any) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });
} 