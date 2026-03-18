import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

let embeddedAssets = null;
try {
  const mod = await import('./assets.generated.mjs');
  embeddedAssets = mod.ASSETS || null;
} catch {
  embeddedAssets = null;
}

const WORKFLOW_FILES = {
  '01': '01-documentation-lifecycle.md',
  '02': '02-change-request.md',
  '03': '03-resolve-technical-debt.md',
  '04': '04-review-deliverables.md',
  '05': '05-solution-landscape.md'
};

const WORKFLOW_ALIASES = {
  '01-documentation-lifecycle': '01',
  'documentation-lifecycle': '01',
  '01': '01',
  '02-change-request': '02',
  'change-request': '02',
  '02': '02',
  '03-resolve-technical-debt': '03',
  'resolve-technical-debt': '03',
  '03': '03',
  '04-review-deliverables': '04',
  'review-deliverables': '04',
  '04': '04',
  '05-solution-landscape': '05',
  'solution-landscape': '05',
  '05': '05'
};

const TYPE_MAP = {
  workflow: 'workflows',
  workflows: 'workflows',
  prompt: 'prompts',
  prompts: 'prompts',
  template: 'templates',
  templates: 'templates'
};

const DEFAULT_CONFIG = {
  agentName: 'architecture-agent',
  agentLocation: 'installed npm package @santagar/architecture-agent',
  defaultUpdateGitScope: 'origin/main~1..origin/main',
  defaultOutputLanguage: null,
  copyOnLaunch: true
};

export function runCli(argv) {
  const args = argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return 0;
  }

  if (command === 'help') {
    return runHelp(args.slice(1));
  }

  if (command === 'list') {
    return runList(args.slice(1));
  }

  if (command === 'show') {
    return runShow(args.slice(1));
  }

  if (command === 'launch') {
    return runLaunch(args.slice(1));
  }

  if (command === 'init') {
    return runInit(args.slice(1));
  }

  stderr(`Unknown command: ${command}`);
  printHelp();
  return 1;
}

function runHelp(args) {
  const topic = args[0];
  if (!topic) {
    printHelp();
    return 0;
  }

  if (topic === 'launch') {
    printLaunchHelp();
    return 0;
  }
  if (topic === 'start') {
    printStartHelp();
    return 0;
  }

  stderr(`Unknown help topic: ${topic}`);
  printHelp();
  return 1;
}

function runList(args) {
  const parsed = parseFlags(args);
  const type = parsed.positionals[0] || 'all';
  const asJson = Boolean(parsed.flags.json);

  const payload = {};

  if (type === 'all') {
    payload.workflows = listDisplayEntries('workflows');
    payload.prompts = listDisplayEntries('prompts');
    payload.templates = listDisplayEntries('templates');
  } else {
    const mapped = TYPE_MAP[type];
    if (!mapped) {
      stderr(`Invalid list type: ${type}`);
      return 1;
    }
    payload[mapped] = listDisplayEntries(mapped);
  }

  if (asJson) {
    stdout(JSON.stringify(payload, null, 2));
    return 0;
  }

  for (const [key, value] of Object.entries(payload)) {
    stdout(`${key}:`);
    for (const file of value) {
      stdout(`- ${file}`);
    }
  }

  return 0;
}

function listDisplayEntries(dirName) {
  return readDir(dirName).map((file) => {
    if (file.endsWith('.md')) {
      return file.slice(0, -3);
    }
    return file;
  });
}

function runShow(args) {
  const parsed = parseFlags(args);
  const type = parsed.positionals[0];
  const name = parsed.positionals[1];

  if (!type || !name) {
    stderr('Usage: architecture-agent show <workflows|prompts|templates> <name>');
    return 1;
  }

  const mapped = TYPE_MAP[type];
  if (!mapped) {
    stderr(`Invalid type: ${type}`);
    return 1;
  }

  const content = readAsset(mapped, name);
  if (content == null) {
    stderr(`Not found: ${name} in ${mapped}`);
    return 1;
  }

  stdout(content);
  return 0;
}

function runLaunch(args) {
  const parsed = parseFlags(args);
  if (parsed.flags.help === true) {
    printLaunchHelp();
    return 0;
  }
  const launchType = normalizeLaunchType(parsed.positionals[0]);
  const selector = parsed.positionals[1];

  if (!launchType || !selector) {
    stderr('Usage: architecture-agent launch <workflow|prompt> <selector> [options]');
    stderr('Examples:');
    stderr('  architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main');
    stderr('  architecture-agent launch prompt repository-analysis');
    return 1;
  }

  const config = loadConfig(process.cwd());
  const language = parsed.flags.language || config.defaultOutputLanguage;
  const agentName = parsed.flags['agent-name'] || config.agentName;
  const agentLocation = parsed.flags['agent-location'] || config.agentLocation;

  const lines = [];
  lines.push(`Agent: ${agentName} (${agentLocation})`);

  if (launchType === 'workflow') {
    const workflowId = resolveWorkflowId(selector);
    if (!workflowId) {
      stderr(`Unknown workflow: ${selector}`);
      return 1;
    }

    const workflowFile = WORKFLOW_FILES[workflowId];
    const mode = parsed.flags.mode;
    const gitScope = parsed.flags['git-scope'] || config.defaultUpdateGitScope;
    lines.push('Retrieve workflow instructions from package:');
    lines.push(`- \`npx architecture-agent show workflows ${workflowId}\``);

    if (workflowId === '01') {
      if (mode === 'update') {
        lines.push(`Then execute workflow \`${workflowFile}\` with \`mode=update\` to refresh documentation from recent repository changes.`);
        lines.push(`Git scope: ${gitScope}.`);
      } else if (mode === 'baseline') {
        lines.push(`Then execute workflow \`${workflowFile}\` with \`mode=baseline\` fully in the current repository.`);
      } else {
        lines.push(`Then execute workflow \`${workflowFile}\` fully in the current repository.`);
      }
    } else {
      lines.push(`Then execute workflow \`${workflowFile}\` in the current repository.`);
      if (workflowId === '02') {
        lines.push(`Change request: "${parsed.flags['change-request'] || '<your free-text request>'}".`);
      }
      if (workflowId === '03') {
        lines.push('Execute the next safe debt-reduction slice including quality/security baseline.');
      }
      if (workflowId === '04') {
        lines.push('Validate documentation and review artifacts before release.');
      }
      if (workflowId === '05') {
        lines.push(`System scope: "${parsed.flags['system-scope'] || '<system-or-domain-name>'}".`);
        const relatedRepoFlags = arrayValue(parsed.flags['related-repo']);
        if (relatedRepoFlags.length > 0) {
          lines.push('Related repositories:');
          for (const repo of relatedRepoFlags) {
            lines.push(`- ${repo}`);
          }
        } else {
          lines.push('Related repositories: <repo-a>, <repo-b>.');
        }
      }
    }
  } else if (launchType === 'prompt') {
    const promptFile = resolvePromptName(selector);
    if (!promptFile) {
      stderr(`Unknown prompt: ${selector}`);
      return 1;
    }

    const promptSelector = promptFile.replace(/\.md$/u, '');
    lines.push('Retrieve prompt instructions from package:');
    lines.push(`- \`npx architecture-agent show prompts ${promptSelector}\``);
    lines.push(`Then execute prompt \`${promptFile}\` in the current repository.`);
  }

  if (language) {
    lines.push(`Output language: ${language}.`);
  }

  const output = lines.join('\n');
  stdout(output);

  const shouldCopy = resolveCopyPreference(parsed.flags, config);
  if (shouldCopy) {
    if (tryCopyToClipboard(output)) {
      stderr('Launch output copied to clipboard.');
    } else {
      stderr('Could not copy launch output to clipboard automatically.');
    }
  }

  return 0;
}

function runInit(args) {
  const parsed = parseFlags(args);
  const configPath = path.join(process.cwd(), '.architecture-agent.json');

  if (fs.existsSync(configPath) && !parsed.flags.force) {
    stderr('Config already exists: .architecture-agent.json (use --force to overwrite)');
    return 1;
  }

  fs.writeFileSync(configPath, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, 'utf8');
  stdout('Created .architecture-agent.json');
  return 0;
}

function parseFlags(args) {
  const positionals = [];
  const flags = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];

    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) {
      flags[key] = true;
      continue;
    }

    if (flags[key] === undefined) {
      flags[key] = next;
    } else if (Array.isArray(flags[key])) {
      flags[key].push(next);
    } else {
      flags[key] = [flags[key], next];
    }

    i += 1;
  }

  return { positionals, flags };
}

function readDir(dirName) {
  const bucket = embeddedAssets?.[dirName];
  if (bucket && typeof bucket === 'object') {
    return Object.keys(bucket).sort();
  }

  const abs = path.join(packageRoot, dirName);
  return fs.readdirSync(abs).sort();
}

function readAsset(dirName, name) {
  const bucket = embeddedAssets?.[dirName];
  if (bucket && typeof bucket === 'object') {
    const key = resolveAssetName(Object.keys(bucket), name);
    if (!key) {
      return null;
    }
    return bucket[key] ?? null;
  }

  const abs = path.join(packageRoot, dirName);
  const files = fs.readdirSync(abs);
  const resolved = resolveAssetName(files, name);
  if (!resolved) {
    return null;
  }

  return fs.readFileSync(path.join(abs, resolved), 'utf8');
}

function resolveAssetName(files, name) {
  const normalized = name.endsWith('.md') || name.endsWith('.json') || name.endsWith('.yaml')
    ? name
    : `${name}.md`;

  const exact = files.find((f) => f === normalized);
  if (exact) {
    return exact;
  }

  const startsWith = files.find((f) => f.startsWith(name));
  if (startsWith) {
    return startsWith;
  }

  return null;
}

function resolveWorkflowId(input) {
  const cleaned = input.replace(/\.md$/u, '');
  return WORKFLOW_ALIASES[cleaned] || null;
}

function resolvePromptName(input) {
  const files = readDir('prompts');
  return resolveAssetName(files, input);
}

function normalizeLaunchType(input) {
  if (!input) {
    return null;
  }

  const lower = String(input).toLowerCase();
  if (lower === 'workflow' || lower === 'workflows' || lower === 'wf') {
    return 'workflow';
  }
  if (lower === 'prompt' || lower === 'prompts' || lower === 'pr') {
    return 'prompt';
  }

  return null;
}

function resolveCopyPreference(flags, config) {
  if (flags['no-copy'] === true) {
    return false;
  }
  if (flags.copy === true) {
    return true;
  }
  return config.copyOnLaunch === true;
}

function tryCopyToClipboard(text) {
  const commands = clipboardCommandsForPlatform(process.platform);
  for (const command of commands) {
    try {
      const result = spawnSync(command.cmd, command.args, {
        input: text,
        encoding: 'utf8'
      });
      if (!result.error && result.status === 0) {
        return true;
      }
    } catch {
      // Try next clipboard command.
    }
  }

  return false;
}

function clipboardCommandsForPlatform(platform) {
  if (platform === 'darwin') {
    return [{ cmd: 'pbcopy', args: [] }];
  }
  if (platform === 'win32') {
    return [{ cmd: 'cmd', args: ['/c', 'clip'] }];
  }

  return [
    { cmd: 'wl-copy', args: [] },
    { cmd: 'xclip', args: ['-selection', 'clipboard'] },
    { cmd: 'xsel', args: ['--clipboard', '--input'] }
  ];
}

function loadConfig(cwd) {
  const configPath = path.join(cwd, '.architecture-agent.json');

  if (!fs.existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function arrayValue(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
}

function printHelp() {
  const help = [
    'architecture-agent',
    '',
    'Commands:',
    '  help [launch|start]',
    '  list [workflows|prompts|templates|all] [--json]',
    '  show <workflows|prompts|templates> <name>',
    '  launch <workflow|prompt> <selector> [--mode update|baseline] [--git-scope <range>] [--copy|--no-copy]',
    '         [--change-request "..."] [--system-scope "..."] [--related-repo <repo>] [--language <lang>]',
    '  init [--force]    # creates .architecture-agent.json in current repo',
    '',
    'Examples:',
    '  architecture-agent help start',
    '  architecture-agent help launch',
    '  architecture-agent list workflows',
    '  architecture-agent show workflows 01',
    '  architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main',
    '  architecture-agent launch prompt repository-analysis',
    '  architecture-agent launch workflow 02 --change-request "Extract currency helper"',
    '  architecture-agent launch workflow 05 --system-scope checkout --related-repo service-a --related-repo service-b'
  ].join('\n');

  stdout(help);
}

function printStartHelp() {
  const help = [
    'Start guide',
    '',
    '1) Install package in target repository:',
    '   npm i -D @santagar/architecture-agent',
    '',
    '2) Explore available workflows:',
    '   npx architecture-agent list workflows',
    '',
    '3) Generate first launch instruction:',
    '   npx architecture-agent launch workflow 01 --mode baseline',
    '',
    '4) Paste launch output into your AI assistant and execute.',
    '',
    'Tip:',
    '  Use `npx architecture-agent init` to create local defaults (.architecture-agent.json).'
  ].join('\n');

  stdout(help);
}

function printLaunchHelp() {
  const help = [
    'Launch guide',
    '',
    'Usage:',
    '  architecture-agent launch <workflow|prompt> <selector> [options]',
    '',
    'Workflow selectors:',
    '  01 | documentation-lifecycle',
    '  02 | change-request',
    '  03 | resolve-technical-debt',
    '  04 | review-deliverables',
    '  05 | solution-landscape',
    '',
    'Prompt selector:',
    '  any prompt file name without .md (for example: repository-analysis)',
    '',
    'Most common options:',
    '  --mode baseline|update',
    '  --git-scope <range>',
    '  --change-request "<text>"',
    '  --system-scope "<name>" --related-repo "<repo>"',
    '  --copy | --no-copy',
    '',
    'Examples:',
    '  architecture-agent launch workflow 01 --mode baseline',
    '  architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main',
    '  architecture-agent launch workflow 02 --change-request "Extract currency helper"',
    '  architecture-agent launch workflow 03',
    '  architecture-agent launch workflow 04',
    '  architecture-agent launch workflow 05 --system-scope checkout --related-repo service-a --related-repo service-b',
    '  architecture-agent launch prompt repository-analysis',
    '',
    'Tip:',
    '  Use `architecture-agent init` to create .architecture-agent.json with local defaults.'
  ].join('\n');

  stdout(help);
}

function stdout(message) {
  process.stdout.write(`${message}\n`);
}

function stderr(message) {
  process.stderr.write(`${message}\n`);
}
