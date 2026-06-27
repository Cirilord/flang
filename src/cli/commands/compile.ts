import { readFileSync } from 'node:fs';

import { LexerError } from '../../lexer/errors.js';
import { Lexer } from '../../lexer/index.js';

export type CompileCommandOptions = {
  output?: string;
  target?: string;
  tool?: string;
  transpileOnly?: boolean;
};

export function runCompileCommand(input: string | undefined, options: CompileCommandOptions): void {
  if (input === undefined) {
    throw new Error('The <input> argument is required.');
  }

  if (options.target === undefined) {
    throw new Error('The --target option is required.');
  }

  if (options.output === undefined) {
    throw new Error('The --output option is required.');
  }

  if (options.transpileOnly !== true && options.tool === undefined) {
    throw new Error('The --tool option is required unless --transpile-only is used.');
  }

  const source: string = readFileSync(input, 'utf8');

  try {
    const tokens = new Lexer(source).tokenize();

    console.log('The compile command is not implemented beyond lexical analysis yet.');
    console.log(
      JSON.stringify(
        {
          input,
          output: options.output,
          target: options.target,
          tokens,
          tokenCount: tokens.length,
          tool: options.tool,
          transpileOnly: options.transpileOnly ?? false,
        },
        null,
        2
      )
    );
  } catch (error: unknown) {
    if (error instanceof LexerError) {
      throw new Error(
        `Lexical analysis failed at line ${error.location.start.line}, column ${error.location.start.column}: ${error.message}`
      );
    }

    throw error;
  }
}
