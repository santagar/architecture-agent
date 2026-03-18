import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

function runCli(args) {
  return spawnSync('node', ['bin/architecture-agent.mjs', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
}

test('help launch is available', () => {
  const result = runCli(['help', 'launch']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Launch guide/);
  assert.match(result.stdout, /architecture-agent launch <workflow\|prompt>/);
});

test('launch --help is available', () => {
  const result = runCli(['launch', '--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Workflow selectors/);
});

test('list workflows hides .md extension', () => {
  const result = runCli(['list', 'workflows']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /01-documentation-lifecycle/);
  assert.doesNotMatch(result.stdout, /\.md/);
});

test('launch workflow 01 includes retrieval command', () => {
  const result = runCli(['launch', 'workflow', '01', '--no-copy']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /npx architecture-agent show workflows 01/);
  assert.match(result.stdout, /Then execute workflow `01-documentation-lifecycle\.md`/);
});

test('invalid launch type fails with usage hint', () => {
  const result = runCli(['launch', 'invalid', '01']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage: architecture-agent launch/);
});
