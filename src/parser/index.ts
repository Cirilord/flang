import { ParserError } from './errors.js';
import { TokenType } from '../lexer/token-type.js';
import type { Token, TokenLocation } from '../lexer/token.js';
import type { IdentifierNode, NumberLiteralNode, ProgramNode, VariableDeclarationNode } from './ast/index.js';

export class Parser {
  private index: number;

  private readonly tokens: Token[];

  public constructor(tokens: Token[]) {
    this.index = 0;
    this.tokens = tokens;
  }

  public parseProgram(): ProgramNode {
    const startToken: Token = this.peek();
    const body: VariableDeclarationNode[] = [];

    while (!this.isAtEnd()) {
      body.push(this.parseVariableDeclaration());
    }

    const endToken: Token = this.consume(TokenType.EOF, 'Expected end of file.');

    return {
      body,
      kind: 'Program',
      location: this.mergeLocations(startToken.location, endToken.location),
    };
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.index += 1;
    }

    return this.previous();
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) {
      return type === TokenType.EOF;
    }

    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    throw new ParserError(message, this.peek().location);
  }

  private consumeDeclarationKeyword(): Token {
    if (this.check(TokenType.Const) || this.check(TokenType.Let)) {
      return this.advance();
    }

    throw new ParserError('Expected "const" or "let" at the start of a variable declaration.', this.peek().location);
  }

  private createIdentifierNode(token: Token): IdentifierNode {
    return {
      kind: 'Identifier',
      location: token.location,
      name: token.lexeme,
    };
  }

  private createNumberLiteralNode(token: Token): NumberLiteralNode {
    return {
      kind: 'NumberLiteral',
      location: token.location,
      value: token.lexeme,
    };
  }

  private createUnexpectedTokenError(): never {
    throw new Error('Parser requires at least one token.');
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private mergeLocations(start: TokenLocation, end: TokenLocation): TokenLocation {
    return {
      end: end.end,
      start: start.start,
    };
  }

  private parseVariableDeclaration(): VariableDeclarationNode {
    const mutabilityToken: Token = this.consumeDeclarationKeyword();
    const nameToken: Token = this.consume(
      TokenType.Identifier,
      'Expected an identifier after the declaration keyword.'
    );
    this.consume(TokenType.Equal, 'Expected "=" after the variable name.');
    const initializerToken: Token = this.consume(
      TokenType.NumberLiteral,
      'Expected a number literal as the initializer.'
    );
    const semicolonToken: Token = this.consume(TokenType.Semicolon, 'Expected ";" after the variable declaration.');

    return {
      initializer: this.createNumberLiteralNode(initializerToken),
      kind: 'VariableDeclaration',
      location: this.mergeLocations(mutabilityToken.location, semicolonToken.location),
      mutability: mutabilityToken.type === TokenType.Const ? 'const' : 'let',
      name: this.createIdentifierNode(nameToken),
    };
  }

  private peek(): Token {
    return this.tokens[this.index] ?? this.createUnexpectedTokenError();
  }

  private previous(): Token {
    return this.tokens[this.index - 1] ?? this.createUnexpectedTokenError();
  }
}
