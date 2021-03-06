{
  function makeList(initial, tail, num) {
    for (var i = 0; i < tail.length; i++) {
      initial.push(tail[i][num]);
    }
    return initial;
  }
  function makeBinary(head, tail) {
    var result = head;
    for (var i = 0; i < tail.length; i++) {
      result = {
        type:     "Binary",
        location: location(),
        operator: tail[i][1],
        left:     result,
        right:    tail[i][3]
      };
    }
    return result;
  }
}

start
  = __ program:DefinitionList __ { return program; }

SourceCharacter
  = .

/* Whitespaces and comments */

WhiteSpace "whitespace"
  = [\t\v\f ]

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028" // line separator
  / "\u2029" // paragraph separator

Comment "comment"
  = SingleLineComment

SingleLineComment
  = "#" (!LineTerminator SourceCharacter)*

/* Identifiers */

Identifier "identifier"
  = !ReservedWord name:IdentifierName { return name; }

IdentifierName "identifier"
  = start:IdentifierStart parts:IdentifierPart* {
      return start + parts.join("");
    }

IdentifierStart
  = [a-zA-Z]
  / "$"
  / "_"
  / "\\" sequence:UnicodeEscapeSequence { return sequence; }

IdentifierPart
  = IdentifierStart
  / [0-9]

ReservedWord
  = Keyword
  / BooleanLiteral

Keyword
  = (   "f"
      / "record"
      / "returns"
      / "repeat"
      / "for"
      / "while"
      / "if"
      / "of"
      / "let"
      / "in"
    )
    !IdentifierPart

/* Literals */

Literal
  = BooleanLiteral
  / NumericLiteral
  / value:StringLiteral {
      return {
        type:  "StringLiteral",
        location: location(),
        value: value
      };
    }

BooleanLiteral
  = TrueToken  { return { type: "BooleanLiteral", location: location(), value: true  }; }
  / FalseToken { return { type: "BooleanLiteral", location: location(), value: false }; }

NumericLiteral "number"
  = literal:(HexIntegerLiteral / DecimalLiteral) !IdentifierStart {
      return literal;
    }

DecimalLiteral
  = before:DecimalIntegerLiteral
    after:("." DecimalDigits)?
    exponent:ExponentPart? {
      if (after !== null || exponent !== null) {
        return {
          type: "FloatLiteral",
          location: location(),
          value: parseFloat(before + "." + (after !== null ? after[1] : "") +
                            (exponent !== null ? exponent : ""))
        };
      }
      return {
        type: "IntegerLiteral",
        location: location(),
        value: parseInt(before)
      };
    }
  / "." after:DecimalDigits exponent:ExponentPart? {
      return {
        type: "FloatLiteral",
        location: location(),
        value: parseFloat("." + after + exponent)
      };
    }
  / before:DecimalIntegerLiteral exponent:ExponentPart? {
      if (exponent !== null) {
        return {
          type: "FloatLiteral",
          location: location(),
          value: parseFloat(before + exponent)
        };
      }
      return {
        type: "IntegerLiteral",
        location: location(),
        value: parseInt(before)
      };
    }

DecimalIntegerLiteral
  = "0" / digit:NonZeroDigit digits:DecimalDigits? {
    return digit + (digits === null ? "" : digits);
  }

DecimalDigits
  = digits:DecimalDigit+ { return digits.join(""); }

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = indicator:ExponentIndicator integer:SignedInteger {
      return indicator + integer;
    }

ExponentIndicator
  = [eE]

SignedInteger
  = sign:[-+]? digits:DecimalDigits { return sign + digits; }

HexIntegerLiteral
  = "0" [xX] digits:HexDigit+ { return parseInt("0x" + digits.join("")); }

HexDigit
  = [0-9a-fA-F]

StringLiteral "string"
  = parts:('"' DoubleStringCharacters? '"' / "'" SingleStringCharacters? "'") {
      return parts[1];
    }

DoubleStringCharacters
  = chars:DoubleStringCharacter+ { return chars.join(""); }

SingleStringCharacters
  = chars:SingleStringCharacter+ { return chars.join(""); }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) char_:SourceCharacter { return char_;     }
  / "\\" sequence:EscapeSequence                         { return sequence;  }
  / LineContinuation

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) char_:SourceCharacter { return char_;     }
  / "\\" sequence:EscapeSequence                         { return sequence;  }
  / LineContinuation

LineContinuation
  = "\\" sequence:LineTerminatorSequence { return sequence; }

EscapeSequence
  = CharacterEscapeSequence
  / "0" !DecimalDigit { return "\0"; }
  / HexEscapeSequence
  / UnicodeEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = char_:['"\\bfnrtv] {
      return char_
        .replace("b", "\b")
        .replace("f", "\f")
        .replace("n", "\n")
        .replace("r", "\r")
        .replace("t", "\t")
        .replace("v", "\x0B") // IE does not recognize "\v".
    }

NonEscapeCharacter
  = (!EscapeCharacter / LineTerminator) char_:SourceCharacter { return char_; }

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence
  = "x" h1:HexDigit h2:HexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2));
    }

UnicodeEscapeSequence
  = "u" h1:HexDigit h2:HexDigit h3:HexDigit h4:HexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
    }

/* Tokens */

DoToken         = "do"               !IdentifierPart
ElseToken       = "else"             !IdentifierPart
FalseToken      = "false"            !IdentifierPart
LoopToken       = "for"              !IdentifierPart
FunctionToken   = "f"                !IdentifierPart
OldToken        = "old"              !IdentifierPart
LetToken        = "let"              !IdentifierPart
IfToken         = "if"               !IdentifierPart
ElseIfToken     = "elseif"           !IdentifierPart
ErrorToken      = "error"            !IdentifierPart
InToken         = "in"               !IdentifierPart
ReturnsToken    = "returns"          !IdentifierPart
TrueToken       = "true"             !IdentifierPart
WhileToken      = "while"            !IdentifierPart
RepeatToken     = "repeat"           !IdentifierPart
InitialToken    = "initial"          !IdentifierPart
OfToken         = "of"               !IdentifierPart

IntegerToken    = "integer"
FloatToken      = "float"
StringToken     = "string"
BooleanToken    = "boolean"

StreamToken     = "stream"
ArrayToken      = "array"
RecordToken     = "record"
FunctionTypeToken = "function"

IndentToken     = "{"
DedentToken     = "}"

EOS
  = __ ";"
  / _ LineTerminatorSequence
  / _ &"}"
  / __ EOF

EOF
  = !.

/* Underscore */

_
  = (WhiteSpace / SingleLineComment)*

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

/* Composite Type Values */

CompositeValue
  = RecordValue
  / ArrayValue
  / StreamValue
  / FunctionValue
  / TypeValue

ArrayValue
  = "[" __ contents:ExpressionList __ "]" {
  return {type: "Array", location: location(), contents: contents};
  }

RecordValue
  = "[" __ contents:DefinitionList __ "]" {
    return {type: "Record", location: location(), contents: contents};
  }

StreamValue
  = "[" __ lowerBound:Expression __ ".." __ upperBound:Expression? __ "]"  {
    return {type: "Stream", location: location(), lowerBound: lowerBound, upperBound: upperBound };
  }

FunctionValue
  = FunctionToken __
    "(" __ params:IdsWithOptionalTypes? __
          returns:FunctionReturns? ")" __ body:FunctionBody {
    return {
      type: "Lambda",
      location: location(),
      params: params ? params : [],
      returns: returns ? returns : [],
      body: body
    };
  }

FunctionBody
  = IndentToken __ expressions:ExpressionList __ DedentToken {
    return expressions;
  }

FunctionReturns
  = ReturnsToken __ returns:ExpressionList __ {
    return returns;
  }

TypeValue
  = PrimitiveType
  / StreamType
  / ArrayType
  / RecordType
  / FunctionType

PrimitiveType
  = name:(IntegerToken / BooleanToken / FloatToken / StringToken) {
    return {type: "Type", location: location(), name: name };
  }

StreamType
  = StreamToken __ "[" __ type:Expression __ "]" {
    return {type: "Type", location: location(), name: "Stream", elementType: type };
  }

ArrayType
  = ArrayToken __ "[" __ type:Expression __ "]" {
    return {type: "Type", location: location(), name: "Array", elementType: type };
  }

RecordType
  = RecordToken __ "[" __ fields:IdsWithOptionalTypes __ "]" {
    return {type: "Type", location: location(), name: "Record", fields: fields };
  }

FunctionType
  = FunctionTypeToken __
    "[" __ params: ExpressionList __ returns:FunctionReturns? "]" {
    return {type: "Type", location: location(), name: "Function", params: params, returns: returns };
  }

IdsWithOptionalTypes
  = head:IdWithOptionalType
    tail:(__ "," __ IdWithOptionalType)* {
      return makeList([head], tail, 3);
    }

IdWithOptionalType
  = id:Identifier __ type:(":" __ Expression __)? {
    return {type: "WeaklyTypedIdentifier", location: location(), name: id, dataType: (type ? type[2]: null) };
  }

/* Expressions */

Expression
  = LogicalOperation

LogicalOperator
  = "||" { return "|"; }
  / "|" !"|" { return "|"; }
  / "^"
  / "&"

LogicalOperation
  = head:Compare
    tail:(__ LogicalOperator __ Compare)* {
      return makeBinary(head, tail);
    }

CompareOperator
  = "="
  / "/="
  / "<" !"=" { return "<"; }
  / ">" !"=" { return ">"; }
  / "<="
  / ">="

Compare
  = head:LowPriorityOperation
    tail:(__ CompareOperator __ LowPriorityOperation)* {
      return makeBinary(head, tail);
    }

LowPriorityOperator
  = "+"
  / "-"

LowPriorityOperation
  = head:HighPriorityOperation
    tail:(__ LowPriorityOperator __ HighPriorityOperation)* {
      return makeBinary(head, tail);
    }

HighPriorityOperator
  = "*"
  / "/"
  / "%"

HighPriorityOperation
  = head:UnaryOperation
    tail:(__ HighPriorityOperator __ UnaryOperation)* {
      return makeBinary(head, tail);
    }

UnaryOperator
  = "-"
  / "+"
  / "!"

UnaryOperation
  = operation:UnaryOperator __ operand:UnaryOperation {
    return {type: "Unary", location: location(), operator: operation, right: operand};
  }
  / PostfixOperation

PostfixOperation
  = base:Operand
    args:(
     __ "(" __ expressions:ExpressionList? __ ")" {
       return {type: "FunctionCall", location: location(), arguments: expressions };
     }
     / __ "." __ name:Identifier {
       return {type: "RecordAccess", location: location(), field: name };
     }
     / __ "[" __ expression:Expression __ "]" {
       return {type: "ArrayAccess", location: location(), index: expression};
     }
     / __ "of" __ expression:Expression {
       return {type: "FunctionCall", location: location(), arguments: [expression]};
     }
    )* {
      if (args.length==0) return base;

      var result = {
          type: "Postfix",
          location: location(),
          base: base,
          operationList: []
        };
      for (var i = 0; i < args.length; i++) {
        result.operationList.push(args[i]);
      }
      return result;
    }
  / "(" __ exp:Expression __ ")" {
      return exp;
    }
  / Operand

ExpressionList
  = head:Expression
    tail:(__ "," __ Expression)* {
      return makeList([head], tail, 3);
    }

/*  Operands    */

Operand
  = LetExpression
  / LoopExpression
  / IfExpression
  / OldToken __ name:Identifier {return {type: "Old", location: location(), id: name}}
  / CompositeValue
  / Identifier
  / Literal

/* Compound expressions */

LetExpression
  = LetToken __ definitions:WrappedDefintions InToken __ expressions:WrappedExpressions {
      return {type: "Let", location: location(), definitions: definitions, expressions: expressions };
    }

WrappedDefintions
  = IndentToken __ definitions:DefinitionList __ DedentToken __ {
    return definitions;
  }

WrappedExpressions
  = IndentToken __ expressions:ExpressionList __ DedentToken __ {
    return expressions;
  }

DefinitionList
  = head:Definition
    tail:(__ Definition)* {
      return makeList([head], tail, 1);
    }

Definition
  = left:LValue __ "=" __ right:ExpressionList {
    return {type: "Definition", location: location(), left: left, right: right};
  }

LValue
  = head:Identifier
    tail:(__ "," __ Identifier)* {
      return makeList([head], tail, 3);
    }

IfExpression
  = IfToken __ condition:Expression __ thenBranch:WrappedExpressions
    elseIfs:(ElseIfs)? __ ElseToken __ elseBranch:WrappedExpressions {
    return {
      type: "If",
      location: location(),
      condition: condition,
      thenBranch: thenBranch,
      elseIfs: elseIfs ? elseIfs : [],
      elseBranch: elseBranch
    };
  }

ElseIfs
  = head:ElseIf
    tail:(__ ElseIf)* {
      return makeList([head], tail, 1);
    }

ElseIf
  = ElseIfToken __ condition:Expression __ branch:WrappedExpressions {
    return {
      type: "ElseIf",
      location: location(),
      condition: condition,
      branch: branch
    };
  }

LoopExpression
  = LoopToken __
    range:RangeGenerator?
    init:LoopInit?
    preCondition:LoopCondition?
    (RepeatToken __)?
    body:WrappedDefintions?
    postCondition:LoopCondition? __
    ReturnsToken __ returns:ExpressionList __ {
    return {
      type: "Loop",
      location: location(),
      range: range,
      init: init ? init : [],
      preCondition: preCondition,
      postCondition: postCondition,
      body: body ? body : [],
      returns: returns
    };
  }

LoopCondition
  = WhileToken __ expression:Expression __ {
    return expression;
  }

LoopInit
  = InitialToken __ definitions:WrappedDefintions {
    return definitions;
  }

RangeGenerator
  = names:LValue __ InToken __ ranges:ExpressionList __ {
    return {type: "RangeList", location: location(), names: names, ranges: ranges };
  }
