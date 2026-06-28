import type { TokenLocation } from '../lexer/token.js';

export class ParserError extends Error {
  public readonly location: TokenLocation;

  public constructor(message: string, location: TokenLocation) {
    super(message);
    this.location = location;
    this.name = 'ParserError';
  }
}
