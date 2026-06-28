import type { BaseNode } from './base-node.js';

export type NumberLiteralNode = BaseNode & {
  kind: 'NumberLiteral';
  value: string;
};
