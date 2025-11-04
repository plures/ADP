/**
 * Project type detection
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export type ProjectType = 
  | 'nodejs'
  | 'typescript'
  | 'deno'
  | 'powershell'
  | 'csharp'
  | 'rust'
  | 'python'
  | 'go'
  | 'unknown';

/**
 * Detect project type from directory contents
 */
export async function detectProjectType(projectPath: string): Promise<ProjectType> {
  // Check for specific files
  const files = await fs.readdir(projectPath);
  
  // Node.js/TypeScript
  if (files.includes('package.json')) {
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));
    
    // Check if it's a TypeScript project
    if (
      files.includes('tsconfig.json') ||
      packageJson.devDependencies?.typescript ||
      packageJson.dependencies?.typescript
    ) {
      return 'typescript';
    }
    
    return 'nodejs';
  }
  
  // Deno
  if (files.includes('deno.json') || files.includes('deno.jsonc')) {
    return 'deno';
  }
  
  // C#
  if (files.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) {
    return 'csharp';
  }
  
  // Rust
  if (files.includes('Cargo.toml')) {
    return 'rust';
  }
  
  // PowerShell
  if (files.some(f => f.endsWith('.psd1') || f.endsWith('.psm1'))) {
    return 'powershell';
  }
  
  // Python
  if (
    files.includes('setup.py') ||
    files.includes('pyproject.toml') ||
    files.includes('requirements.txt')
  ) {
    return 'python';
  }
  
  // Go
  if (files.includes('go.mod')) {
    return 'go';
  }
  
  // Fallback: check file extensions
  const allFiles = await getAllFiles(projectPath, 2); // Max depth 2
  
  if (allFiles.some(f => f.endsWith('.ts'))) {
    return 'typescript';
  }
  
  if (allFiles.some(f => f.endsWith('.ps1') || f.endsWith('.psm1'))) {
    return 'powershell';
  }
  
  if (allFiles.some(f => f.endsWith('.cs'))) {
    return 'csharp';
  }
  
  if (allFiles.some(f => f.endsWith('.rs'))) {
    return 'rust';
  }
  
  if (allFiles.some(f => f.endsWith('.js'))) {
    return 'nodejs';
  }
  
  return 'unknown';
}

/**
 * Get all files recursively up to a certain depth
 */
async function getAllFiles(
  dir: string,
  maxDepth: number,
  currentDepth = 0
): Promise<string[]> {
  if (currentDepth >= maxDepth) {
    return [];
  }
  
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules, .git, etc.
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === 'target' ||
      entry.name === 'dist' ||
      entry.name === 'build'
    ) {
      continue;
    }
    
    if (entry.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, maxDepth, currentDepth + 1);
      files.push(...subFiles);
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}
