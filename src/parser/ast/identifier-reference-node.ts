import type { BaseNode } from './base-node.js';

export type IdentifierReferenceNode = BaseNode & {
  kind: 'IdentifierReference';
  name: string;
};
