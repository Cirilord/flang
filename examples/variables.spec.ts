import { readFileSync } from 'node:fs';

import { Lexer } from '../src/lexer/index.js';
import { TokenType } from '../src/lexer/token-type.js';

describe('variables example lexer', (): void => {
  it('tokenizes the variables example into the expected token sequence', (): void => {
    const source: string = readFileSync(new URL('./variables.f', import.meta.url), 'utf8');

    const tokens = new Lexer(source).tokenize();

    expect(tokens.map((token) => token.type)).toEqual([
      TokenType.Const,
      TokenType.Identifier,
      TokenType.Equal,
      TokenType.NumberLiteral,
      TokenType.Semicolon,
      TokenType.Const,
      TokenType.Identifier,
      TokenType.Equal,
      TokenType.NumberLiteral,
      TokenType.Semicolon,
      TokenType.Let,
      TokenType.Identifier,
      TokenType.Equal,
      TokenType.NumberLiteral,
      TokenType.Semicolon,
      TokenType.EOF,
    ]);

    expect(tokens.map((token) => token.lexeme)).toEqual([
      'const',
      'positive',
      '=',
      '1',
      ';',
      'const',
      'zero',
      '=',
      '0',
      ';',
      'let',
      'decimal',
      '=',
      '3.14',
      ';',
      '',
    ]);
  });
});
