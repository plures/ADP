#!/usr/bin/env node
/**
 * @architectural-discipline/cli
 * 
 * Command-line interface for architectural discipline analysis
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ArchitecturalAnalyzer } from '@architectural-discipline/core';
import type { StatisticalAnalysis, FileMetrics } from '@architectural-discipline/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper functions for fs operations
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

const program = new Command();

program
  .name('architectural-discipline')
  .description('Intelligent Architectural Discipline System CLI')
  .version('1.0.0');

/**
 * Analyze command
 */
program
  .command('analyze')
  .description('Analyze project architecture and generate report')
  .option('-p, --path <path>', 'Path to analyze', 'src')
  .option('-o, --output <file>', 'Output file for report')
  .option('-f, --format <format>', 'Output format (json, text)', 'text')
  .option('--ignore <patterns>', 'Ignore patterns (comma-separated)')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔍 Analyzing project architecture...'));
      
      const analyzer = new ArchitecturalAnalyzer();
      const analysis = await performAnalysis(options.path, options.ignore);
      
      if (options.format === 'json') {
        const output = JSON.stringify(analysis, null, 2);
        if (options.output) {
          await fs.writeFile(options.output, output);
          console.log(chalk.green(`✅ Report saved to ${options.output}`));
        } else {
          console.log(output);
        }
      } else {
        printAnalysisReport(analysis);
      }
      
      // Exit with error code if critical issues found
      const criticalOutliers = analysis.outliers.filter(
        (o) => o.lines > o.fileType.expectedSizeRange[1] * 1.5 ||
               o.complexity > o.fileType.complexityThreshold * 2
      );
      
      if (criticalOutliers.length > 0) {
        console.log(chalk.red(`\n❌ ${criticalOutliers.length} critical outliers require immediate attention.`));
        process.exit(1);
      } else {
        console.log(chalk.green('\n✅ Analysis complete!'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Analysis failed:'), error);
      process.exit(1);
    }
  });

/**
 * Recommend command
 */
program
  .command('recommend')
  .description('Generate refactoring recommendations')
  .option('-p, --path <path>', 'Path to analyze', 'src')
  .option('--priority <level>', 'Filter by priority (high, medium, low)')
  .action(async (options) => {
    try {
      console.log(chalk.blue('💡 Generating refactoring recommendations...'));
      
      const analyzer = new ArchitecturalAnalyzer();
      const analysis = await performAnalysis(options.path);
      
      const recommendations = options.priority 
        ? analysis.recommendations.filter(r => r.priority === options.priority)
        : analysis.recommendations;
      
      printRecommendations(recommendations);
    } catch (error) {
      console.error(chalk.red('❌ Recommendation generation failed:'), error);
      process.exit(1);
    }
  });

/**
 * Create command for project templates
 */
program
  .command('create')
  .description('Create a new project with architectural discipline')
  .argument('<name>', 'Project name')
  .option('-t, --template <template>', 'Project template', 'web-app')
  .option('-d, --directory <dir>', 'Target directory')
  .option('--list-templates', 'List available templates')
  .action(async (name, options) => {
    try {
      if (options.listTemplates) {
        listTemplates();
        return;
      }
      
      console.log(chalk.blue(`🚀 Creating ${options.template} project: ${name}`));
      
      const targetDir = options.directory || name;
      await createProject(name, options.template, targetDir);
      
      console.log(chalk.green(`✅ Project created successfully in ${targetDir}`));
      console.log(chalk.yellow('📚 Next steps:'));
      
      // Language-specific next steps
      if (options.template.startsWith('powershell')) {
        console.log(`   cd ${targetDir}`);
        console.log('   Import-Module .\\{{name}}.psd1');
      } else if (options.template.startsWith('csharp')) {
        console.log(`   cd ${targetDir}`);
        console.log('   dotnet restore');
        console.log('   dotnet build');
      } else if (options.template.startsWith('rust')) {
        console.log(`   cd ${targetDir}`);
        console.log('   cargo build');
        console.log('   cargo test');
      } else {
        console.log(`   cd ${targetDir}`);
        console.log('   npm install');
        console.log('   npm run dev');
      }
    } catch (error) {
      console.error(chalk.red('❌ Project creation failed:'), error);
      process.exit(1);
    }
  });

/**
 * List available templates
 */
function listTemplates(): void {
  console.log(chalk.blue('\n📦 Available Templates:\n'));
  
  console.log(chalk.yellow('TypeScript/JavaScript:'));
  console.log('  web-app              - Web application template');
  console.log('  library               - Library template');
  console.log('  cli-tool              - CLI tool template');
  console.log('  api-service           - API service template');
  console.log('  vscode-extension     - VS Code extension template');
  console.log('  mobile-app            - Mobile application template\n');
  
  console.log(chalk.yellow('PowerShell:'));
  console.log('  powershell-module     - PowerShell module template');
  console.log('  powershell-cli       - PowerShell CLI script template\n');
  
  console.log(chalk.yellow('C#:'));
  console.log('  csharp-library       - C# class library template');
  console.log('  csharp-console       - C# console application template\n');
  
  console.log(chalk.yellow('Rust:'));
  console.log('  rust-library         - Rust library template');
  console.log('  rust-cli             - Rust CLI binary template\n');
}

/**
 * Perform architectural analysis
 */
async function performAnalysis(srcPath: string, ignorePatterns?: string): Promise<StatisticalAnalysis> {
  const ignore = ignorePatterns ? ignorePatterns.split(',') : [
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/*.Tests.ps1',
    '**/*Tests.cs',
    '**/*test.rs',
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/bin/**',
    '**/obj/**',
    '**/target/**',
  ];

  // Support multiple file extensions
  const filePatterns = [
    `${srcPath}/**/*.ts`,
    `${srcPath}/**/*.tsx`,
    `${srcPath}/**/*.js`,
    `${srcPath}/**/*.jsx`,
    `${srcPath}/**/*.ps1`,
    `${srcPath}/**/*.psm1`,
    `${srcPath}/**/*.cs`,
    `${srcPath}/**/*.rs`,
  ];

  const allFiles: string[] = [];
  for (const pattern of filePatterns) {
    const files = await glob(pattern, { ignore });
    allFiles.push(...files);
  }

  const analyzer = new ArchitecturalAnalyzer();
  
  const metrics: FileMetrics[] = [];
  
  for (const file of allFiles) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const fileMetrics = analyzer.analyzeFile(file, content);
      metrics.push(fileMetrics);
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Skipping ${file}: ${error}`));
    }
  }
  
  const fileTypeStats = analyzer.calculateStatisticalThresholds(metrics);
  const outliers = analyzer.detectOutliers(metrics, fileTypeStats);
  const recommendations = analyzer.generateRecommendations(outliers);
  const projectHealth = analyzer.calculateProjectHealth(metrics, fileTypeStats);
  
  return {
    fileTypeStats,
    outliers,
    recommendations,
    projectHealth,
  };
}

/**
 * Print analysis report
 */
function printAnalysisReport(analysis: StatisticalAnalysis): void {
  console.log('\n' + chalk.blue('🧠 Intelligent Statistical Architecture Analysis'));
  console.log('='.repeat(60));

  // Project Health Overview
  console.log(`\n📊 Project Health Score: ${analysis.projectHealth.overall}/100`);
  console.log(`   Maintainability: ${analysis.projectHealth.maintainability}/100`);
  console.log(`   Testability: ${analysis.projectHealth.testability}/100`);
  console.log(`   Modularity: ${analysis.projectHealth.modularity}/100`);
  console.log(`   Complexity: ${analysis.projectHealth.complexity}/100`);

  // File Type Statistics
  console.log(`\n📈 File Type Statistics:`);
  analysis.fileTypeStats.forEach((stats, type) => {
    console.log(`   ${type}:`);
    console.log(`     Count: ${stats.count} files`);
    console.log(`     Mean: ${stats.meanLines} lines`);
    console.log(`     Median: ${stats.medianLines} lines`);
    console.log(`     Std Dev: ${stats.standardDeviation} lines`);
    console.log(`     95th Percentile: ${stats.percentile95} lines`);
    console.log(`     Outliers: ${stats.outliers.length} files`);
  });

  // Outliers Analysis
  if (analysis.outliers.length > 0) {
    console.log(`\n⚠️  Statistical Outliers Detected (${analysis.outliers.length} files):`);

    analysis.outliers.forEach((outlier) => {
      console.log(`\n   📁 ${outlier.file}`);
      console.log(`      Language: ${outlier.language}`);
      console.log(`      Type: ${outlier.fileType.category}-${outlier.fileType.subcategory}`);
      console.log(
        `      Lines: ${outlier.lines} (expected: ${outlier.fileType.expectedSizeRange[0]}-${outlier.fileType.expectedSizeRange[1]})`
      );
      console.log(
        `      Complexity: ${outlier.complexity} (threshold: ${outlier.fileType.complexityThreshold})`
      );
      console.log(`      Purity: ${Math.round(outlier.purity)}/100`);
      console.log(`      Functions: ${outlier.functions.length}`);
    });
  } else {
    console.log(`\n✅ No statistical outliers detected! Project follows healthy patterns.`);
  }

  console.log(`\n📚 Development Methodology Guidelines:`);
  console.log(`   1. Keep functions focused and pure when possible`);
  console.log(`   2. Extract modules when files exceed statistical thresholds`);
  console.log(`   3. Use composition over large monolithic structures`);
  console.log(`   4. Apply single responsibility principle`);
  console.log(`   5. Monitor complexity and purity scores`);
}

/**
 * Print recommendations
 */
function printRecommendations(recommendations: any[]): void {
  if (recommendations.length === 0) {
    console.log(chalk.green('✅ No recommendations needed!'));
    return;
  }

  console.log(`\n🔧 Intelligent Refactoring Recommendations (${recommendations.length}):`);

  const highPriority = recommendations.filter((r) => r.priority === 'high');
  const mediumPriority = recommendations.filter((r) => r.priority === 'medium');
  const lowPriority = recommendations.filter((r) => r.priority === 'low');

  if (highPriority.length > 0) {
    console.log(`\n   ${chalk.red('🔴 High Priority')} (${highPriority.length}):`);
    highPriority.forEach((rec) => {
      console.log(`      ${chalk.bold(rec.file)}: ${rec.reason}`);
      console.log(`         Actions: ${rec.suggestedActions.join(', ')}`);
    });
  }

  if (mediumPriority.length > 0) {
    console.log(`\n   ${chalk.yellow('🟡 Medium Priority')} (${mediumPriority.length}):`);
    mediumPriority.forEach((rec) => {
      console.log(`      ${rec.file}: ${rec.reason}`);
    });
  }

  if (lowPriority.length > 0) {
    console.log(`\n   ${chalk.green('🟢 Low Priority')} (${lowPriority.length}):`);
    lowPriority.forEach((rec) => {
      console.log(`      ${rec.file}: ${rec.reason}`);
    });
  }
}

/**
 * Create project from template
 */
async function createProject(name: string, template: string, targetDir: string): Promise<void> {
  console.log(chalk.yellow(`📋 Template: ${template}`));
  console.log(chalk.yellow(`📁 Directory: ${targetDir}`));
  
  // Check if template exists
  // Templates are in packages/templates relative to the monorepo root
  // When CLI is installed, we'll need to use a different approach
  // For now, try relative to CLI package or use process.cwd() for monorepo development
  const possiblePaths = [
    path.join(__dirname, '../../templates', template),
    path.join(process.cwd(), 'packages/templates', template),
    path.resolve('./packages/templates', template),
  ];
  
  let templatePath = '';
  let templateExists = false;
  for (const possiblePath of possiblePaths) {
    if (await pathExists(possiblePath)) {
      templatePath = possiblePath;
      templateExists = true;
      break;
    }
  }
  
  if (templateExists) {
    // Copy template files
    const templateDir = path.join(templatePath, 'template');
    if (await pathExists(templateDir)) {
      await copyDir(templateDir, targetDir);
      console.log(chalk.green('✅ Template files copied'));
      
      // Replace template variables
      await replaceTemplateVariables(targetDir, name, template);
    }
  } else {
    // Create basic structure for unsupported templates
    await ensureDir(targetDir);
    console.log(chalk.yellow('⚠️  Template not found, creating basic structure'));
    
    // Create basic package.json or project file based on language
    if (template.startsWith('powershell')) {
      await createPowerShellProject(name, targetDir, template);
    } else if (template.startsWith('csharp')) {
      await createCSharpProject(name, targetDir, template);
    } else if (template.startsWith('rust')) {
      await createRustProject(name, targetDir, template);
    } else {
      await createTypeScriptProject(name, targetDir, template);
    }
  }
  
  // Create .adp-config.json if it doesn't exist
  const configPath = path.join(targetDir, '.adp-config.json');
  if (!(await pathExists(configPath))) {
    await fs.writeFile(configPath, JSON.stringify({
      'architectural-discipline': {
        languages: {
          typescript: { maxLines: 300, maxComplexity: 10 },
          powershell: { maxLines: 400, maxComplexity: 12 },
          csharp: { maxLines: 500, maxComplexity: 15 },
          rust: { maxLines: 500, maxComplexity: 10 },
        },
      },
    }, null, 2));
  }
  
  console.log(chalk.green('📦 Project structure created'));
}

/**
 * Replace template variables in files
 */
async function replaceTemplateVariables(dir: string, name: string, template: string): Promise<void> {
  const files = await glob(`${dir}/**/*`, { nodir: true });
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8');
    content = content.replace(/\{\{name\}\}/g, name);
    content = content.replace(/\{\{Name\}\}/g, pascalName);
    content = content.replace(/\{\{guid\}\}/g, guid);
    content = content.replace(/\{\{author\}\}/g, process.env.USER || 'User');
    await fs.writeFile(file, content);
  }
  
  // Rename files with template variables
  const filesToRename = await glob(`${dir}/**/*{{name}}*`, { nodir: true });
  for (const file of filesToRename) {
    const newPath = file.replace(/\{\{name\}\}/g, name);
    await fs.rename(file, newPath);
  }
}

/**
 * Create basic PowerShell project
 */
async function createPowerShellProject(name: string, targetDir: string, template: string): Promise<void> {
  if (template === 'powershell-module') {
    await fs.writeFile(path.join(targetDir, `${name}.psm1`), `# ${name} PowerShell Module\n`);
    await fs.writeFile(path.join(targetDir, `${name}.psd1`), `# Module manifest for ${name}\n`);
  } else {
    await fs.writeFile(path.join(targetDir, `${name}.ps1`), `# ${name} PowerShell CLI Script\n`);
  }
}

/**
 * Create basic C# project
 */
async function createCSharpProject(name: string, targetDir: string, template: string): Promise<void> {
  const projectContent = template === 'csharp-library' 
    ? `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup></Project>`
    : `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework></PropertyGroup></Project>`;
  
  await fs.writeFile(path.join(targetDir, `${name}.csproj`), projectContent);
  
  if (template === 'csharp-console') {
    await fs.writeFile(path.join(targetDir, 'Program.cs'), 'class Program { static void Main() { } }');
  }
}

/**
 * Create basic Rust project
 */
async function createRustProject(name: string, targetDir: string, template: string): Promise<void> {
  const cargoToml = template === 'rust-library'
    ? `[package]\nname = "${name}"\nversion = "1.0.0"\nedition = "2021"\n[lib]\npath = "src/lib.rs"`
    : `[package]\nname = "${name}"\nversion = "1.0.0"\nedition = "2021"\n[[bin]]\nname = "${name}"\npath = "src/main.rs"`;
  
  await ensureDir(path.join(targetDir, 'src'));
  await fs.writeFile(path.join(targetDir, 'Cargo.toml'), cargoToml);
  
  if (template === 'rust-library') {
    await fs.writeFile(path.join(targetDir, 'src/lib.rs'), `// ${name} library\n`);
  } else {
    await fs.writeFile(path.join(targetDir, 'src/main.rs'), `fn main() {\n    println!("Hello, world!");\n}\n`);
  }
}

/**
 * Create basic TypeScript project
 */
async function createTypeScriptProject(name: string, targetDir: string, template: string): Promise<void> {
  const packageJson = {
    name,
    version: '1.0.0',
    description: `Project created with architectural discipline (${template} template)`,
    scripts: {
      'check:architecture': 'architectural-discipline analyze',
      'recommend': 'architectural-discipline recommend',
    },
    devDependencies: {
      '@architectural-discipline/eslint-plugin': '^1.0.0',
    },
  };
  
  await fs.writeFile(
    path.join(targetDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

// Parse command line arguments
program.parse();
