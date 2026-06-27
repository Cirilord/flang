import type { TokenLocation } from './token.js';

export class LexerError extends Error {
  public readonly location: TokenLocation;

  public constructor(message: string, location: TokenLocation) {
    super(message);
    this.location = location;
    this.name = 'LexerError';
  }
}
