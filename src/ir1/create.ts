import * as AST from "../ast";
import * as ASTTypes from "../ast/types";
import { ArrayValue } from "./array";
import { BinaryExpression } from "./binary";
import { Identifier } from "./identifier";
import { Literal } from "./literal";
import { LiteralType } from "./literalType";
import { Node } from "./node";
import { Scope } from "./scope";
import { StreamValue } from "./stream";

function nodeFromPostfix(postfix: AST.Postfix, scope: Scope): Node {
  // TODO: add operationList
  return nodeFromExpression(postfix.base, scope);
}

function nodeFromTypeValue(node: ASTTypes.TypeValue, scope: Scope): Node {
  if (ASTTypes.isIntegerType(node) || ASTTypes.isFloatType(node) ||
      ASTTypes.isBooleanType(node) || ASTTypes.isStringType(node)) {
    return new LiteralType(node);
  }
  if (ASTTypes.isArrayType(node)) {
    return new ArrayType(node);
  }
  if (ASTTypes.isFunctionType(node)) {
    return new FunctionType(node);
  }
  if (ASTTypes.isRecordType(node)) {
    return new RecordType(node);
  }
  if (ASTTypes.isStreamType(node)) {
    return new StreamType(node);
  }
  throw new Error("Unexpected expression type value " + JSON.stringify(node));
}

export function nodeFromExpression(expression: AST.Expression, scope: Scope): Node {
  if (typeof expression === "string") {
    return new Identifier(expression, scope);
  }
  if (AST.isLiteral(expression)) {
    return new Literal(expression);
  }
  if (AST.isArrayValue(expression)) {
    return new ArrayValue(expression, scope);
  }
  if (AST.isStreamValue(expression)) {
    return new StreamValue(expression, scope);
  }
  if (AST.isRecordValue(expression)) {
    return new RecordValue(expression, scope);
  }
  if (ASTTypes.isTypeValue(expression)) {
    return nodeFromTypeValue(expression, scope);
  }
  if (AST.isBinaryExpression(expression)) {
    return new BinaryExpression(expression, scope);
  }
  if (AST.isUnaryExpression(expression)) {
    return new UnaryExpression(expression, scope);
  }
  if (AST.isPostfix(expression)) {
    return nodeFromPostfix(expression, scope);
  }
  if (AST.isOldValue(expression)) {
    return new OldValue(expression, scope);
  }
  if (AST.isLetExpression(expression)) {
    return new LetExpression(expression, scope);
  }
  if (AST.isLoopExpression(expression)) {
    return new LoopExpression(expression, scope);
  }
  if (AST.isIfExpression(expression)) {
    return new IfExpression(expression, scope);
  }
  throw new Error("Unexpected expression type in create " + JSON.stringify(expression));
}
