import type { BaseNode } from './base-node.js';
import type { ReturnStatementNode } from './return-statement-node.js';
import type { VariableDeclarationNode } from './variable-declaration-node.js';

export type BlockStatementNode = BaseNode & {
  body: Array<ReturnStatementNode | VariableDeclarationNode>;
  kind: 'BlockStatement';
};
