#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const changes = [];

function exactVersion(value) {
  return typeof value === 'string' ? value.replace(/^[~^]/, '') : value;
}

function majorVersion(value) {
  const match = String(exactVersion(value) ?? '').match(/^(\d+)/);
  return match ? Number(match[1]) : 0;
}

function pinDependency(section, name) {
  const current = pkg[section]?.[name];
  if (!current) return;
  const pinned = exactVersion(current);
  if (pinned !== current) {
    pkg[section][name] = pinned;
    changes.push(`Pinned ${name} to ${pinned}`);
  }
}

for (const name of ['@noble/hashes', '@noble/post-quantum']) {
  pinDependency('dependencies', name);
  pinDependency('devDependencies', name);
}

const scriptsUseTsx = Object.values(pkg.scripts ?? {}).some(
  (command) => typeof command === 'string' && /(^|\s)tsx(\s|$)/.test(command)
);

if (scriptsUseTsx && pkg.devDependencies?.tsx && !pkg.dependencies?.tsx) {
  pkg.dependencies ??= {};
  pkg.dependencies.tsx = exactVersion(pkg.devDependencies.tsx);
  delete pkg.devDependencies.tsx;
  if (Object.keys(pkg.devDependencies).length === 0) delete pkg.devDependencies;
  changes.push('Moved tsx to runtime dependencies because operational scripts invoke it');
} else if (pkg.dependencies?.tsx) {
  pinDependency('dependencies', 'tsx');
}

const nobleHashesVersion =
  pkg.dependencies?.['@noble/hashes'] ??
  pkg.devDependencies?.['@noble/hashes'] ??
  '0';

const sourceRoots = ['src', 'scripts', 'tests'];
const extensions = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts']);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

for (const relativeRoot of sourceRoots) {
  for (const file of walk(path.join(root, relativeRoot))) {
    const original = fs.readFileSync(file, 'utf8');
    let updated = original;

    if (majorVersion(nobleHashesVersion) >= 2) {
      updated = updated
        .replaceAll('@noble/hashes/sha256.js', '@noble/hashes/sha2.js')
        .replaceAll("@noble/hashes/sha256'", "@noble/hashes/sha2.js'")
        .replaceAll('@noble/hashes/sha256"', '@noble/hashes/sha2.js"');
    }

    if (path.relative(root, file).replaceAll('\\', '/') === 'scripts/generate-urs-certificate.ts') {
      updated = updated.replace(
        /node\s+[A-Za-z]:[\\/][^'"]*tsx[\\/]dist[\\/]cli\.mjs\s+scripts[\\/]reality-universal\.ts/g,
        'npx --no-install tsx scripts/reality-universal.ts'
      );
    }

    if (updated !== original) {
      fs.writeFileSync(file, updated);
      changes.push(`Updated ${path.relative(root, file).replaceAll('\\', '/')}`);
    }
  }
}

const normalizedPackage = JSON.stringify(pkg, null, 2) + '\n';
if (normalizedPackage !== fs.readFileSync(packagePath, 'utf8')) {
  fs.writeFileSync(packagePath, normalizedPackage);
  if (!changes.some((item) => item.startsWith('Pinned ') || item.startsWith('Moved tsx'))) {
    changes.push('Normalized package.json');
  }
}

if (changes.length === 0) {
  console.log('AUTO_REPAIR_NO_SOURCE_CHANGES');
} else {
  console.log('AUTO_REPAIR_CHANGES');
  for (const change of changes) console.log(`- ${change}`);
}
