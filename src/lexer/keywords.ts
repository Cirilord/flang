import { TokenType } from './token-type.js';

export const KEYWORDS: ReadonlyMap<string, TokenType> = new Map<string, TokenType>([
  ['const', TokenType.Const],
  ['let', TokenType.Let],
]);
