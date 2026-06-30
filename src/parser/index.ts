import { ParserError } from './errors.js';
import { SUPPORTED_TYPE_NAMES } from './type-names.js';
import { TokenType } from '../lexer/token-type.js';
import type { Token, TokenLocation } from '../lexer/token.js';
import type {
  BlockStatementNode,
  CallExpressionNode,
  ExpressionNode,
  FunctionDeclarationNode,
  FunctionParameterNode,
  IdentifierNode,
  IdentifierReferenceNode,
  NamedTypeNode,
  NumberLiteralNode,
  ProgramNode,
  ReturnStatementNode,
  VariableDeclarationNode,
} from './ast/index.js';

export class Parser {
  private index: number;

  private readonly tokens: Token[];

  public constructor(tokens: Token[]) {
    this.index = 0;
    this.tokens = tokens;
  }

  public parseProgram(): ProgramNode {
    const startToken: Token = this.peek();
    const body: FunctionDeclarationNode[] = [];

    while (!this.isAtEnd()) {
      body.push(this.parseFunctionDeclaration());
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

    throw new ParserError('Expected "const" or "let" at the start of a declaration.', this.peek().location);
  }

  private createCallExpressionNode(
    callee: IdentifierReferenceNode,
    argumentsList: ExpressionNode[],
    rightParenToken: Token
  ): CallExpressionNode {
    return {
      arguments: argumentsList,
      callee,
      kind: 'CallExpression',
      location: this.mergeLocations(callee.location, rightParenToken.location),
    };
  }

  private createIdentifierNode(token: Token): IdentifierNode {
    return {
      kind: 'Identifier',
      location: token.location,
      name: token.lexeme,
    };
  }

  private createIdentifierReferenceNode(token: Token): IdentifierReferenceNode {
    return {
      kind: 'IdentifierReference',
      location: token.location,
      name: token.lexeme,
    };
  }

  private createNamedTypeNode(token: Token): NamedTypeNode {
    return {
      kind: 'NamedType',
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

  private parseArgumentList(): ExpressionNode[] {
    const argumentsList: ExpressionNode[] = [];

    if (this.check(TokenType.RightParen)) {
      return argumentsList;
    }

    argumentsList.push(this.parseExpression());

    while (this.check(TokenType.Comma)) {
      this.advance();
      argumentsList.push(this.parseExpression());
    }

    return argumentsList;
  }

  private parseBlockStatement(): BlockStatementNode {
    const leftBraceToken: Token = this.consume(TokenType.LeftBrace, 'Expected "{" to start the function body.');
    const body: Array<ReturnStatementNode | VariableDeclarationNode> = [];

    while (!this.check(TokenType.RightBrace)) {
      body.push(this.parseStatement());
    }

    const rightBraceToken: Token = this.consume(TokenType.RightBrace, 'Expected "}" after the function body.');

    return {
      body,
      kind: 'BlockStatement',
      location: this.mergeLocations(leftBraceToken.location, rightBraceToken.location),
    };
  }

  private parseCallExpression(): ExpressionNode {
    let expression: ExpressionNode = this.parsePrimaryExpression();

    while (this.check(TokenType.LeftParen)) {
      if (expression.kind !== 'IdentifierReference') {
        throw new ParserError('Only identifier references can be called in this stage.', this.peek().location);
      }

      this.advance();
      const argumentsList: ExpressionNode[] = this.parseArgumentList();
      const rightParenToken: Token = this.consume(TokenType.RightParen, 'Expected ")" after function arguments.');

      expression = this.createCallExpressionNode(expression, argumentsList, rightParenToken);
    }

    return expression;
  }

  private parseExpression(): ExpressionNode {
    return this.parseCallExpression();
  }

  private parseFunctionDeclaration(): FunctionDeclarationNode {
    const fnToken: Token = this.consume(TokenType.Fn, 'Expected "fn" at the start of a function declaration.');
    const nameToken: Token = this.consume(TokenType.Identifier, 'Expected a function name after "fn".');
    this.consume(TokenType.LeftParen, 'Expected "(" after the function name.');
    const parameters: FunctionParameterNode[] = this.parseParameterList();
    this.consume(TokenType.RightParen, 'Expected ")" after the parameter list.');
    this.consume(TokenType.Colon, 'Expected ":" before the function return type.');
    const returnTypeToken: Token = this.consume(TokenType.Identifier, 'Expected a return type after ":".');
    this.validateReturnTypeName(returnTypeToken);
    const body: BlockStatementNode = this.parseBlockStatement();

    return {
      body,
      kind: 'FunctionDeclaration',
      location: this.mergeLocations(fnToken.location, body.location),
      name: this.createIdentifierNode(nameToken),
      parameters,
      returnType: this.createNamedTypeNode(returnTypeToken),
    };
  }

  private parseParameterDeclaration(): FunctionParameterNode {
    const mutabilityToken: Token = this.consumeDeclarationKeyword();
    const nameToken: Token = this.consume(
      TokenType.Identifier,
      'Expected a parameter name after the declaration keyword.'
    );
    this.consume(TokenType.Colon, 'Expected ":" after the parameter name.');
    const declaredTypeToken: Token = this.consume(TokenType.Identifier, 'Expected a type name after ":".');
    this.validateTypeName(declaredTypeToken);

    return {
      declaredType: this.createNamedTypeNode(declaredTypeToken),
      kind: 'FunctionParameter',
      location: this.mergeLocations(mutabilityToken.location, declaredTypeToken.location),
      mutability: mutabilityToken.type === TokenType.Const ? 'const' : 'let',
      name: this.createIdentifierNode(nameToken),
    };
  }

  private parseParameterList(): FunctionParameterNode[] {
    const parameters: FunctionParameterNode[] = [];

    if (this.check(TokenType.RightParen)) {
      return parameters;
    }

    parameters.push(this.parseParameterDeclaration());

    while (this.check(TokenType.Comma)) {
      this.advance();
      parameters.push(this.parseParameterDeclaration());
    }

    return parameters;
  }

  private parsePrimaryExpression(): ExpressionNode {
    if (this.check(TokenType.Identifier)) {
      return this.createIdentifierReferenceNode(this.advance());
    }

    if (this.check(TokenType.NumberLiteral)) {
      return this.createNumberLiteralNode(this.advance());
    }

    throw new ParserError('Expected an expression.', this.peek().location);
  }

  private parseReturnStatement(): ReturnStatementNode {
    const returnToken: Token = this.consume(TokenType.Return, 'Expected "return" at the start of a return statement.');

    if (this.check(TokenType.Semicolon)) {
      const semicolonToken: Token = this.advance();

      return {
        kind: 'ReturnStatement',
        location: this.mergeLocations(returnToken.location, semicolonToken.location),
      };
    }

    const argument: ExpressionNode = this.parseExpression();
    const semicolonToken: Token = this.consume(TokenType.Semicolon, 'Expected ";" after the return statement.');

    return {
      argument,
      kind: 'ReturnStatement',
      location: this.mergeLocations(returnToken.location, semicolonToken.location),
    };
  }

  private parseStatement(): ReturnStatementNode | VariableDeclarationNode {
    if (this.check(TokenType.Const) || this.check(TokenType.Let)) {
      return this.parseVariableDeclaration();
    }

    if (this.check(TokenType.Return)) {
      return this.parseReturnStatement();
    }

    throw new ParserError(
      'Expected a variable declaration or return statement inside the function body.',
      this.peek().location
    );
  }

  private parseVariableDeclaration(): VariableDeclarationNode {
    const mutabilityToken: Token = this.consumeDeclarationKeyword();
    const nameToken: Token = this.consume(
      TokenType.Identifier,
      'Expected an identifier after the declaration keyword.'
    );
    this.consume(TokenType.Colon, 'Expected ":" after the variable name.');
    const declaredTypeToken: Token = this.consume(TokenType.Identifier, 'Expected a type name after ":".');
    this.validateTypeName(declaredTypeToken);
    this.consume(TokenType.Equal, 'Expected "=" after the type annotation.');
    const initializer: ExpressionNode = this.parseExpression();
    const semicolonToken: Token = this.consume(TokenType.Semicolon, 'Expected ";" after the variable declaration.');

    return {
      declaredType: this.createNamedTypeNode(declaredTypeToken),
      initializer,
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

  private validateReturnTypeName(token: Token): void {
    if (token.lexeme === 'void') {
      return;
    }

    this.validateTypeName(token);
  }

  private validateTypeName(token: Token): void {
    if (SUPPORTED_TYPE_NAMES.has(token.lexeme)) {
      return;
    }

    throw new ParserError(`Unsupported type annotation "${token.lexeme}".`, token.location);
  }
}
