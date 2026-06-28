import type { BaseNode } from './base-node.js';
import type { IdentifierNode } from './identifier-node.js';
import type { NumberLiteralNode } from './number-literal-node.js';

export type VariableDeclarationNode = BaseNode & {
  initializer: NumberLiteralNode;
  kind: 'VariableDeclaration';
  mutability: 'const' | 'let';
  name: IdentifierNode;
};
