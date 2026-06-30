import type { BaseNode } from './base-node.js';
import type { FunctionDeclarationNode } from './function-declaration-node.js';

export type ProgramNode = BaseNode & {
  body: FunctionDeclarationNode[];
  kind: 'Program';
};
