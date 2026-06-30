import { TokenType } from './token-type.js';

export const KEYWORDS: ReadonlyMap<string, TokenType> = new Map<string, TokenType>([
  ['const', TokenType.Const],
  ['fn', TokenType.Fn],
  ['let', TokenType.Let],
  ['return', TokenType.Return],
]);
