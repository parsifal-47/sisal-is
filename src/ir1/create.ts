import * as AST from "../ast";
import * as ASTTypes from "../ast/types";
import * as Nodes from "./nodes";
import * as TypeNodes from "./nodes/types";
import { Scope } from "./scope";

function nodeFromPostfix(postfix: AST.Postfix, scope: Scope): Nodes.Node {
  // TODO: add operationList
  return nodeFromExpression(postfix.base, scope);
}

function nodeFromTypeValue(node: ASTTypes.TypeValue, scope: Scope): Nodes.Node {
  if (ASTTypes.isIntegerType(node) || ASTTypes.isFloatType(node) ||
      ASTTypes.isBooleanType(node) || ASTTypes.isStringType(node)) {
    return new TypeNodes.LiteralType(node);
  }
  if (ASTTypes.isArrayType(node)) {
    return new TypeNodes.ArrayType(node, scope);
  }
  if (ASTTypes.isFunctionType(node)) {
    return new TypeNodes.FunctionType(node, scope);
  }
  if (ASTTypes.isRecordType(node)) {
    return new TypeNodes.RecordType(node, scope);
  }
  if (ASTTypes.isStreamType(node)) {
    return new TypeNodes.StreamType(node, scope);
  }
  throw new Error("Unexpected expression type value " + JSON.stringify(node));
}

export function nodeFromExpression(expression: AST.Expression, scope: Scope): Nodes.Node {
  if (typeof expression === "string") {
    return new Nodes.Identifier(expression, scope);
  }
  if (AST.isLiteral(expression)) {
    return new Nodes.Literal(expression);
  }
  if (AST.isArrayValue(expression)) {
    return new Nodes.ArrayValue(expression, scope);
  }
  if (AST.isStreamValue(expression)) {
    return new Nodes.StreamValue(expression, scope);
  }
  if (AST.isRecordValue(expression)) {
    return new Nodes.RecordValue(expression, scope);
  }
  if (ASTTypes.isTypeValue(expression)) {
    return nodeFromTypeValue(expression, scope);
  }
  if (AST.isBinaryExpression(expression)) {
    return new Nodes.BinaryExpression(expression, scope);
  }
  if (AST.isUnaryExpression(expression)) {
    return new Nodes.UnaryExpression(expression, scope);
  }
  if (AST.isPostfix(expression)) {
    return nodeFromPostfix(expression, scope);
  }
  if (AST.isOldValue(expression)) {
    return new Nodes.OldValue(expression, scope);
  }
  if (AST.isLetExpression(expression)) {
    return new Nodes.LetExpression(expression, scope);
  }
  if (AST.isLoopExpression(expression)) {
    return new Nodes.LoopExpression(expression, scope);
  }
  if (AST.isIfExpression(expression)) {
    return new Nodes.IfExpression(expression, scope);
  }
  if (AST.isFunctionValue(expression)) {
    return new Nodes.FunctionValue(expression, scope);
  }
  throw new Error("Unexpected expression type in create " + JSON.stringify(expression));
}
