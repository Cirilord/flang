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

  console.log('The compile command is not implemented yet.');
  console.log(
    JSON.stringify(
      {
        input,
        output: options.output,
        target: options.target,
        tool: options.tool,
        transpileOnly: options.transpileOnly ?? false,
      },
      null,
      2
    )
  );
}
