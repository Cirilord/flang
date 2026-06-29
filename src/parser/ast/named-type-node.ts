import type { BaseNode } from './base-node.js';

export type NamedTypeNode = BaseNode & {
  kind: 'NamedType';
  name: string;
};
