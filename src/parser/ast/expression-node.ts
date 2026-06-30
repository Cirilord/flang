import type { CallExpressionNode } from './call-expression-node.js';
import type { IdentifierReferenceNode } from './identifier-reference-node.js';
import type { NumberLiteralNode } from './number-literal-node.js';

export type ExpressionNode = CallExpressionNode | IdentifierReferenceNode | NumberLiteralNode;
