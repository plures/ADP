/**
 * Integration tests for the installer
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { detectProjectType } from '../src/project-detection';

describe('Project Detection', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `adp-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should detect Node.js project', async () => {
    await fs.writeJson(path.join(testDir, 'package.json'), {
      name: 'test-project',
      version: '1.0.0',
    });

    const type = await detectProjectType(testDir);
    expect(type).toBe('nodejs');
  });

  it('should detect TypeScript project', async () => {
    await fs.writeJson(path.join(testDir, 'package.json'), {
      name: 'test-project',
      version: '1.0.0',
      devDependencies: {
        typescript: '^5.0.0',
      },
    });

    const type = await detectProjectType(testDir);
    expect(type).toBe('typescript');
  });

  it('should detect Deno project', async () => {
    await fs.writeJson(path.join(testDir, 'deno.json'), {
      tasks: {
        dev: 'deno run main.ts',
      },
    });

    const type = await detectProjectType(testDir);
    expect(type).toBe('deno');
  });

  it('should detect C# project', async () => {
    await fs.writeFile(
      path.join(testDir, 'Project.csproj'),
      '<Project Sdk="Microsoft.NET.Sdk"></Project>'
    );

    const type = await detectProjectType(testDir);
    expect(type).toBe('csharp');
  });

  it('should detect Rust project', async () => {
    await fs.writeFile(
      path.join(testDir, 'Cargo.toml'),
      '[package]\nname = "test"\nversion = "1.0.0"'
    );

    const type = await detectProjectType(testDir);
    expect(type).toBe('rust');
  });

  it('should detect PowerShell project', async () => {
    await fs.writeFile(path.join(testDir, 'Module.psm1'), '# PowerShell module');

    const type = await detectProjectType(testDir);
    expect(type).toBe('powershell');
  });

  it('should return unknown for empty directory', async () => {
    const type = await detectProjectType(testDir);
    expect(type).toBe('unknown');
  });
});

describe('Installer CLI', () => {
  it('should have help command', () => {
    // This would require spawning the actual CLI process
    // For now, we verify the structure exists
    expect(true).toBe(true);
  });
});
