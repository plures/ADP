# Architectural Discipline Package - Usage Examples

This document provides comprehensive examples of how to use the Architectural Discipline Package in various scenarios.

## 📋 Table of Contents

1. [Basic Analysis](#basic-analysis)
2. [ESLint Integration](#eslint-integration)
3. [CLI Usage](#cli-usage)
4. [Project Templates](#project-templates)
5. [Migration Guide](#migration-guide)
6. [Advanced Configuration](#advanced-configuration)

## 🔍 Basic Analysis

### Programmatic Analysis

```typescript
import { ArchitecturalAnalyzer } from '@plures-adp/core';
import * as fs from 'fs';

const analyzer = new ArchitecturalAnalyzer();

// Analyze a single file
const content = fs.readFileSync('src/myFile.ts', 'utf-8');
const metrics = analyzer.analyzeFile('src/myFile.ts', content);

console.log('File metrics:', {
  lines: metrics.lines,
  complexity: metrics.complexity,
  purity: metrics.purity,
  functions: metrics.functions.length
});

// Analyze entire project
const files = ['src/file1.ts', 'src/file2.ts'];
const allMetrics = files.map(file => {
  const content = fs.readFileSync(file, 'utf-8');
  return analyzer.analyzeFile(file, content);
});

const stats = analyzer.calculateStatisticalThresholds(allMetrics);
const outliers = analyzer.detectOutliers(allMetrics, stats);
const recommendations = analyzer.generateRecommendations(outliers);
const health = analyzer.calculateProjectHealth(allMetrics, stats);

console.log('Project health:', health.overall);
console.log('Outliers found:', outliers.length);
console.log('Recommendations:', recommendations.length);
```

### Statistical Analysis

```typescript
import { performStatisticalAnalysis } from '@plures-adp/core';

async function analyzeProject() {
  const analysis = await performStatisticalAnalysis();
  
  // Project health overview
  console.log(`Health Score: ${analysis.projectHealth.overall}/100`);
  
  // File type statistics
  analysis.fileTypeStats.forEach((stats, type) => {
    console.log(`${type}: ${stats.count} files, avg ${stats.meanLines} lines`);
  });
  
  // Critical outliers
  const critical = analysis.outliers.filter(o => 
    o.lines > o.fileType.expectedSizeRange[1] * 1.5
  );
  
  if (critical.length > 0) {
    console.log(`⚠️ ${critical.length} critical files need attention`);
  }
}
```

## 🔧 ESLint Integration

### Basic Configuration

```javascript
// eslint.config.js
import architecturalDiscipline from '@plures-adp/eslint-plugin';

export default [
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@plures-adp': architecturalDiscipline,
    },
    rules: {
      '@plures-adp/max-lines': ['error', { 
        max: 300,
        enableStatisticalAnalysis: true 
      }],
      '@plures-adp/max-lines-per-function': ['error', { 
        max: 100 
      }],
      '@plures-adp/max-complexity': ['warn', { 
        max: 10 
      }],
    },
  },
];
```

### Recommended Configuration

```javascript
// eslint.config.js
import architecturalDiscipline from '@plures-adp/eslint-plugin';

export default [
  architecturalDiscipline.configs.recommended,
  {
    rules: {
      // Override specific rules if needed
      '@plures-adp/max-lines': ['error', { max: 250 }],
    },
  },
];
```

### Strict Configuration

```javascript
// eslint.config.js
import architecturalDiscipline from '@plures-adp/eslint-plugin';

export default [
  architecturalDiscipline.configs.strict,
  {
    rules: {
      // Additional strict rules
      '@plures-adp/max-lines': ['error', { max: 150 }],
      '@plures-adp/max-complexity': ['error', { max: 6 }],
    },
  },
];
```

### Custom File Type Rules

```javascript
// eslint.config.js
import architecturalDiscipline from '@plures-adp/eslint-plugin';

export default [
  {
    files: ['src/machines/**/*.ts'],
    plugins: {
      '@plures-adp': architecturalDiscipline,
    },
    rules: {
      // Stricter rules for state machines
      '@plures-adp/max-lines': ['error', { max: 200 }],
      '@plures-adp/max-complexity': ['error', { max: 8 }],
    },
  },
  {
    files: ['src/utils/**/*.ts'],
    plugins: {
      '@plures-adp': architecturalDiscipline,
    },
    rules: {
      // Stricter rules for utilities
      '@plures-adp/max-lines': ['error', { max: 100 }],
      '@plures-adp/max-complexity': ['error', { max: 5 }],
    },
  },
];
```

## 💻 CLI Usage

### Basic Commands

```bash
# Analyze current project
architectural-discipline analyze

# Analyze specific directory
architectural-discipline analyze --path src

# Generate JSON report
architectural-discipline analyze --format json --output report.json

# Get recommendations only
architectural-discipline recommend

# Filter by priority
architectural-discipline recommend --priority high
```

### Advanced Analysis

```bash
# Analyze with custom ignore patterns
architectural-discipline analyze --ignore "**/*.test.ts,**/node_modules/**"

# Analyze multiple directories
architectural-discipline analyze --path "src,lib,tests"

# Generate detailed report
architectural-discipline analyze --format json --output detailed-report.json
```

### Project Creation

```bash
# Create new VS Code extension
architectural-discipline create my-extension --template vscode-extension

# Create new web app
architectural-discipline create my-app --template web-app

# Create in specific directory
architectural-discipline create my-project --template library --directory ./projects
```

## 🏗️ Project Templates

### VS Code Extension Template

```bash
# Create new extension
architectural-discipline create my-extension --template vscode-extension

# Generated structure:
my-extension/
├── src/
│   ├── extension.ts          # Main activation (max 200 lines)
│   ├── commands/             # Command handlers (max 100 lines each)
│   ├── providers/            # Data providers (max 150 lines each)
│   └── utils/                # Utilities (max 100 lines each)
├── package.json              # Pre-configured with architectural rules
├── eslint.config.js          # Architectural discipline rules
└── README.md                 # Usage instructions
```

### Web App Template

```bash
# Create new web app
architectural-discipline create my-app --template web-app

# Generated structure:
my-app/
├── src/
│   ├── components/           # React/Vue components (max 150 lines each)
│   ├── pages/                # Page components (max 200 lines each)
│   ├── services/             # API services (max 200 lines each)
│   ├── utils/                # Utilities (max 100 lines each)
│   └── types/                # Type definitions (max 100 lines each)
├── package.json              # Pre-configured with architectural rules
├── eslint.config.js          # Architectural discipline rules
└── README.md                 # Usage instructions
```

## 🔄 Migration Guide

### Adding to Existing Project

1. **Install packages**:
```bash
npm install @plures-adp/core @plures-adp/eslint-plugin
```

2. **Update ESLint configuration**:
```javascript
// eslint.config.js
import architecturalDiscipline from '@plures-adp/eslint-plugin';

export default [
  // ... existing config
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@plures-adp': architecturalDiscipline,
    },
    rules: {
      '@plures-adp/max-lines': ['warn', { max: 300 }],
      '@plures-adp/max-lines-per-function': ['warn', { max: 100 }],
      '@plures-adp/max-complexity': ['warn', { max: 10 }],
    },
  },
];
```

3. **Add analysis script**:
```json
{
  "scripts": {
    "check:architecture": "architectural-discipline analyze",
    "recommend": "architectural-discipline recommend"
  }
}
```

4. **Gradual adoption**:
```bash
# Start with warnings only
npm run check:architecture

# Address high-priority issues first
architectural-discipline recommend --priority high

# Gradually tighten rules as issues are resolved
```

### Legacy Code Migration

```typescript
// Before: Large monolithic file (500+ lines)
// src/legacy-service.ts - 500 lines, complexity 25

// After: Modular structure
// src/services/
//   ├── service.ts           # Main service (150 lines)
//   ├── auth.ts              # Authentication (100 lines)
//   ├── api.ts               # API client (120 lines)
//   ├── cache.ts             # Caching logic (80 lines)
//   └── validation.ts        # Validation (50 lines)
```

## ⚙️ Advanced Configuration

### Custom File Type Patterns

```typescript
import { FILE_TYPE_PATTERNS } from '@plures-adp/core';

const customPatterns = {
  ...FILE_TYPE_PATTERNS,
  custom: {
    patterns: ['**/custom/**', '**/*Custom.ts'],
    expectedSizeRange: [50, 200] as [number, number],
    complexityThreshold: 7,
  },
};
```

### Custom Analysis Rules

```typescript
import { ArchitecturalAnalyzer } from '@plures-adp/core';

class CustomAnalyzer extends ArchitecturalAnalyzer {
  classifyFileType(filePath: string, content: string) {
    const baseType = super.classifyFileType(filePath, content);
    
    // Custom classification logic
    if (content.includes('@Component')) {
      return {
        ...baseType,
        category: 'component' as any,
        expectedSizeRange: [50, 150],
        complexityThreshold: 6,
      };
    }
    
    return baseType;
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/architecture-check.yml
name: Architecture Check

on: [push, pull_request]

jobs:
  architecture-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install architectural discipline CLI
        run: npm install -g @plures-adp/cli
      
      - name: Run architectural analysis
        run: architectural-discipline analyze --format json --output analysis.json
      
      - name: Check for critical issues
        run: |
          CRITICAL=$(jq '.outliers | map(select(.lines > .fileType.expectedSizeRange[1] * 1.5)) | length' analysis.json)
          if [ "$CRITICAL" -gt 0 ]; then
            echo "❌ $CRITICAL critical architectural issues found"
            exit 1
          fi
          echo "✅ No critical architectural issues found"
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run check:architecture && npm run lint"
    }
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "architectural-discipline analyze --path"
    ]
  }
}
```

## 📊 Monitoring and Metrics

### Health Score Tracking

```typescript
import { ArchitecturalAnalyzer } from '@plures-adp/core';

async function trackHealthScore() {
  const analyzer = new ArchitecturalAnalyzer();
  const analysis = await performAnalysis();
  
  // Track health score over time
  const healthData = {
    timestamp: new Date().toISOString(),
    overall: analysis.projectHealth.overall,
    maintainability: analysis.projectHealth.maintainability,
    testability: analysis.projectHealth.testability,
    modularity: analysis.projectHealth.modularity,
    complexity: analysis.projectHealth.complexity,
    outlierCount: analysis.outliers.length,
  };
  
  // Send to monitoring system
  await sendToMonitoring(healthData);
}
```

### Trend Analysis

```typescript
async function analyzeTrends() {
  const currentAnalysis = await performAnalysis();
  const previousAnalysis = await loadPreviousAnalysis();
  
  const trends = {
    healthChange: currentAnalysis.projectHealth.overall - previousAnalysis.projectHealth.overall,
    outlierChange: currentAnalysis.outliers.length - previousAnalysis.outliers.length,
    complexityTrend: currentAnalysis.projectHealth.complexity - previousAnalysis.projectHealth.complexity,
  };
  
  console.log('Architectural trends:', trends);
}
```

This comprehensive example guide shows how to integrate and use the Architectural Discipline Package across different scenarios, from basic analysis to advanced CI/CD integration and monitoring.
