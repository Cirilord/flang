import type { BaseNode } from './base-node.js';
import type { IdentifierNode } from './identifier-node.js';
import type { NamedTypeNode } from './named-type-node.js';
import type { NumberLiteralNode } from './number-literal-node.js';

export type VariableDeclarationNode = BaseNode & {
  declaredType: NamedTypeNode;
  initializer: NumberLiteralNode;
  kind: 'VariableDeclaration';
  mutability: 'const' | 'let';
  name: IdentifierNode;
};
