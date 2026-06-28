import type { BaseNode } from './base-node.js';
import type { VariableDeclarationNode } from './variable-declaration-node.js';

export type ProgramNode = BaseNode & {
  body: VariableDeclarationNode[];
  kind: 'Program';
};
