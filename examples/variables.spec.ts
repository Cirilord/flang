import { readFileSync } from 'node:fs';

import { Lexer } from '../src/lexer/index.js';
import { TokenType } from '../src/lexer/token-type.js';
import { Parser } from '../src/parser/index.js';

describe('variables example', (): void => {
  it('tokenizes the variable example into the expected token sequence', (): void => {
    const source: string = readFileSync(new URL('./variables.f', import.meta.url), 'utf8');

    const tokens = new Lexer(source).tokenize();

    expect(tokens.map((token) => token.type)).toEqual([
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
      TokenType.NumberLiteral,
      TokenType.Semicolon,
      TokenType.Const,
      TokenType.Identifier,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.Equal,
      TokenType.NumberLiteral,
      TokenType.Semicolon,
      TokenType.Let,
      TokenType.Identifier,
      TokenType.Colon,
      TokenType.Identifier,
      TokenType.Equal,
      TokenType.NumberLiteral,
      TokenType.Semicolon,
      TokenType.Return,
      TokenType.Semicolon,
      TokenType.RightBrace,
      TokenType.EOF,
    ]);

    expect(tokens.map((token) => token.lexeme)).toEqual([
      'fn',
      'main',
      '(',
      ')',
      ':',
      'void',
      '{',
      'const',
      'positive',
      ':',
      'i32',
      '=',
      '1',
      ';',
      'const',
      'zero',
      ':',
      'u32',
      '=',
      '0',
      ';',
      'let',
      'decimal',
      ':',
      'f64',
      '=',
      '3.14',
      ';',
      'return',
      ';',
      '}',
      '',
    ]);
  });

  it('parses the variable example into a main function with typed declarations', (): void => {
    const source: string = readFileSync(new URL('./variables.f', import.meta.url), 'utf8');

    const tokens = new Lexer(source).tokenize();
    const program = new Parser(tokens).parseProgram();

    expect(program.kind).toBe('Program');
    expect(program.body).toHaveLength(1);

    const mainFunction = program.body[0]!;

    expect(mainFunction.name.name).toBe('main');
    expect(mainFunction.returnType.name).toBe('void');
    expect(mainFunction.parameters).toHaveLength(0);
    expect(mainFunction.body.body).toHaveLength(4);
    expect(mainFunction.body.body[0]).toMatchObject({
      declaredType: {
        name: 'i32',
      },
      initializer: {
        kind: 'NumberLiteral',
        value: '1',
      },
      kind: 'VariableDeclaration',
      name: {
        name: 'positive',
      },
    });
    expect(mainFunction.body.body[1]).toMatchObject({
      declaredType: {
        name: 'u32',
      },
      initializer: {
        kind: 'NumberLiteral',
        value: '0',
      },
      kind: 'VariableDeclaration',
      name: {
        name: 'zero',
      },
    });
    expect(mainFunction.body.body[2]).toMatchObject({
      declaredType: {
        name: 'f64',
      },
      initializer: {
        kind: 'NumberLiteral',
        value: '3.14',
      },
      kind: 'VariableDeclaration',
      name: {
        name: 'decimal',
      },
    });
    expect(mainFunction.body.body[3]).toMatchObject({
      kind: 'ReturnStatement',
    });
  });
});
