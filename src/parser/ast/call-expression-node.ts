import type { BaseNode } from './base-node.js';
import type { ExpressionNode } from './expression-node.js';
import type { IdentifierReferenceNode } from './identifier-reference-node.js';

export type CallExpressionNode = BaseNode & {
  arguments: ExpressionNode[];
  callee: IdentifierReferenceNode;
  kind: 'CallExpression';
};
