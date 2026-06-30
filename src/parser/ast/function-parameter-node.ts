import type { BaseNode } from './base-node.js';
import type { IdentifierNode } from './identifier-node.js';
import type { NamedTypeNode } from './named-type-node.js';

export type FunctionParameterNode = BaseNode & {
  declaredType: NamedTypeNode;
  kind: 'FunctionParameter';
  mutability: 'const' | 'let';
  name: IdentifierNode;
};
