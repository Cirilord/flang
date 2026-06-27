import { cac, type CAC } from 'cac';

import { runCompileCommand, type CompileCommandOptions } from './commands/compile.js';

const CLI_NAME = 'f';
const COMPILE_COMMAND = 'compile';
const OPTIONS_WITH_VALUES = new Set(['--output', '--target', '--tool']);

export function createCli(): CAC {
  const cli = cac(CLI_NAME);

  cli
    .command('compile <input>', 'Compile a flang source file')
    .option('--target <target>', 'Set the transpilation target backend')
    .option('--tool <tool>', 'Use a specific compiler or interpreter command')
    .option('--output <output>', 'Set the output path for the command result')
    .option('--transpileOnly, --transpile-only', 'Generate the target output without invoking the tool')
    .action((input: string, options: CompileCommandOptions): void => {
      runCompileCommand(input, options);
    });

  cli.help();

  return cli;
}

export function runCli(argv: string[] = process.argv): void {
  const cli = createCli();
  const normalizedArgv = normalizeCliArgv(argv);

  if (shouldRunCompileCommand(normalizedArgv)) {
    const { input, options } = parseCompileArgv(normalizedArgv);

    runCompileCommand(input, options);
    return;
  }

  cli.parse(normalizedArgv);
}

function normalizeCliArgv(argv: string[]): string[] {
  const [nodePath, scriptPath, commandName, ...rest] = argv;

  if (nodePath === undefined || scriptPath === undefined || commandName !== COMPILE_COMMAND) {
    return argv;
  }

  const reorderedArgs: string[] = [];
  const positionalArgs: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const currentArg = rest[index];

    if (currentArg === undefined) {
      continue;
    }

    if (currentArg.startsWith('--') && OPTIONS_WITH_VALUES.has(currentArg)) {
      reorderedArgs.push(currentArg);

      const nextArg = rest[index + 1];

      if (nextArg !== undefined) {
        reorderedArgs.push(nextArg);
        index += 1;
      }

      continue;
    }

    if (currentArg === '--transpile-only') {
      reorderedArgs.push(currentArg);
      continue;
    }

    positionalArgs.push(currentArg);
  }

  return [nodePath, scriptPath, commandName, ...reorderedArgs, ...positionalArgs];
}

function parseCompileArgv(argv: string[]): { input: string | undefined; options: CompileCommandOptions } {
  const [, , , ...rest] = argv;
  const options: CompileCommandOptions = {};
  let input: string | undefined;

  for (let index = 0; index < rest.length; index += 1) {
    const currentArg = rest[index];

    if (currentArg === undefined) {
      continue;
    }

    if (currentArg === '--transpile-only' || currentArg === '--transpileOnly') {
      options.transpileOnly = true;
      continue;
    }

    if (currentArg === '--target' || currentArg === '--tool' || currentArg === '--output') {
      const nextArg = rest[index + 1];

      if (nextArg === undefined) {
        throw new Error(`The ${currentArg} option requires a value.`);
      }

      if (currentArg === '--target') {
        options.target = nextArg;
      } else if (currentArg === '--tool') {
        options.tool = nextArg;
      } else {
        options.output = nextArg;
      }

      index += 1;
      continue;
    }

    if (currentArg.startsWith('--')) {
      throw new Error(`Unknown option ${currentArg}.`);
    }

    if (input === undefined) {
      input = currentArg;
      continue;
    }

    throw new Error(`Unexpected argument ${currentArg}.`);
  }

  return {
    input,
    options,
  };
}

function shouldRunCompileCommand(argv: string[]): boolean {
  const commandName = argv[2];

  if (commandName !== COMPILE_COMMAND) {
    return false;
  }

  return argv.includes('--help') === false && argv.includes('-h') === false;
}
