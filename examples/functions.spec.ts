import { readFileSync } from 'node:fs';

import { Lexer } from '../src/lexer/index.js';
import { TokenType } from '../src/lexer/token-type.js';
import { Parser } from '../src/parser/index.js';

describe('functions example', (): void => {
  it('tokenizes the function-based example into the expected token sequence', (): void => {
    const source: string = readFileSync(new URL('./functions.f', import.meta.url), 'utf8');

    const tokens = new Lexer(source).tokenize();

    expect(tokens.map((token) => token.type)).toEqual([
      TokenType.Fn,
      TokenType.Identifier,
      TokenType.LeftParen,
      TokenType.Let,
      TokenType.Identifier,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.Comma,
      TokenType.Const,
      TokenType.Identifier,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.RightParen,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.LeftBrace,
      TokenType.Return,
      TokenType.Identifier,
      TokenType.Semicolon,
      TokenType.RightBrace,
      TokenType.Fn,
      TokenType.Identifier,
      TokenType.LeftParen,
      TokenType.Let,
      TokenType.Identifier,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.RightParen,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.LeftBrace,
      TokenType.Return,
      TokenType.Semicolon,
      TokenType.RightBrace,
      TokenType.Fn,
      TokenType.Identifier,
      TokenType.LeftParen,
      TokenType.RightParen,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.LeftBrace,
      TokenType.Const,
      TokenType.Identifier,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.Equal,
      TokenType.Identifier,
      TokenType.LeftParen,
      TokenType.NumberLiteral,
      TokenType.Comma,
      TokenType.NumberLiteral,
      TokenType.RightParen,
      TokenType.Semicolon,
      TokenType.Return,
      TokenType.Semicolon,
      TokenType.RightBrace,
      TokenType.EOF,
    ]);
  });

  it('parses the function-based example into the expected AST shape', (): void => {
    const source: string = readFileSync(new URL('./functions.f', import.meta.url), 'utf8');

    const tokens = new Lexer(source).tokenize();
    const program = new Parser(tokens).parseProgram();

    expect(program.kind).toBe('Program');
    expect(program.body).toHaveLength(3);
    expect(program.body.map((declaration) => declaration.name.name)).toEqual(['pickValue', 'logValue', 'main']);
    expect(program.body.map((declaration) => declaration.returnType.name)).toEqual(['i32', 'void', 'void']);

    const pickValueFunction = program.body[0]!;
    const logValueFunction = program.body[1]!;
    const mainFunction = program.body[2]!;

    expect(pickValueFunction.parameters.map((parameter) => parameter.mutability)).toEqual(['let', 'const']);
    expect(pickValueFunction.parameters.map((parameter) => parameter.name.name)).toEqual(['value', 'fallback']);
    expect(pickValueFunction.parameters.map((parameter) => parameter.declaredType.name)).toEqual(['i32', 'i32']);
    expect(pickValueFunction.body.body).toHaveLength(1);
    expect(pickValueFunction.body.body[0]).toMatchObject({
      argument: {
        kind: 'IdentifierReference',
        name: 'value',
      },
      kind: 'ReturnStatement',
    });

    expect(logValueFunction.parameters).toHaveLength(1);
    expect(logValueFunction.parameters[0]).toMatchObject({
      declaredType: {
        name: 'i32',
      },
      mutability: 'let',
      name: {
        name: 'value',
      },
    });
    expect(logValueFunction.body.body).toHaveLength(1);
    expect(logValueFunction.body.body[0]).toMatchObject({
      kind: 'ReturnStatement',
    });
    expect(logValueFunction.body.body[0]).not.toHaveProperty('argument');

    expect(mainFunction.parameters).toHaveLength(0);
    expect(mainFunction.body.body).toHaveLength(2);
    expect(mainFunction.body.body[0]).toMatchObject({
      declaredType: {
        name: 'i32',
      },
      initializer: {
        arguments: [{ value: '1' }, { value: '2' }],
        callee: {
          kind: 'IdentifierReference',
          name: 'pickValue',
        },
        kind: 'CallExpression',
      },
      kind: 'VariableDeclaration',
      name: {
        name: 'result',
      },
    });
    expect(mainFunction.body.body[1]).toMatchObject({
      kind: 'ReturnStatement',
    });
  });

  it('rejects unsupported type aliases in function signatures in this stage', (): void => {
    const source: string = 'fn invalid(let value: int): void { return; }';

    const tokens = new Lexer(source).tokenize();

    expect(() => new Parser(tokens).parseProgram()).toThrow('Unsupported type annotation "int".');
  });
});
