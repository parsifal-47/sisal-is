/*
 * Sisal PEG grammar definitions by Idrisov Renat IIS SB RAS
 *
 */

start
  = __ program:Program __ { return program; }

/* ===== A.1 Lexical Grammar ===== */

SourceCharacter
  = .

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
  / FutureReservedWord
  / NullLiteral
  / BooleanLiteral

Keyword
  = (
        "f"
      / "array"
      / "record"
      / "returns"
      / "stream"
      / "reduction"
      / "for"
      / "while"
      / "if"
      / "of"
      / "let"
      / "in"
    )
    !IdentifierPart

FutureReservedWord
  = (
        "class"
      / "const"
      / "enum"
      / "export"
      / "extends"
      / "import"
      / "super"
    )
    !IdentifierPart

/*
 * This rule contains an error in the specification: |RegularExpressionLiteral|
 * is missing.
 */
Literal
  = NullLiteral
  / BooleanLiteral
  / value:NumericLiteral {
      return {
        type:  "NumericLiteral",
        value: value
      };
    }
  / value:StringLiteral {
      return {
        type:  "StringLiteral",
        value: value
      };
    }
  / RegularExpressionLiteral

NullLiteral
  = NullToken { return { type: "NullLiteral" }; }

BooleanLiteral
  = TrueToken  { return { type: "BooleanLiteral", value: true  }; }
  / FalseToken { return { type: "BooleanLiteral", value: false }; }

NumericLiteral "number"
  = literal:(HexIntegerLiteral / DecimalLiteral) !IdentifierStart {
      return literal;
    }

DecimalLiteral
  = before:DecimalIntegerLiteral
    "."
    after:DecimalDigits?
    exponent:ExponentPart? {
      return parseFloat(before + "." + after + exponent);
    }
  / "." after:DecimalDigits exponent:ExponentPart? {
      return parseFloat("." + after + exponent);
    }
  / before:DecimalIntegerLiteral exponent:ExponentPart? {
      return parseFloat(before + exponent);
    }

DecimalIntegerLiteral
  = "0" / digit:NonZeroDigit digits:DecimalDigits? { return digit + digits; }

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
ForToken        = "for"              !IdentifierPart
FunctionToken   = "f"                !IdentifierPart
OldToken        = "old"              !IdentifierPart
LetToken        = "let"              !IdentifierPart
OperationToken  = "operation"        !IdentifierPart
IfToken         = "if"               !IdentifierPart
ElseIfToken     = "elseif"           !IdentifierPart
ErrorToken      = "error"            !IdentifierPart
InToken         = "in"               !IdentifierPart
NullToken       = "null"             !IdentifierPart
ReturnsToken    = "returns"          !IdentifierPart
SetToken        = "set"              !IdentifierPart
TrueToken       = "true"             !IdentifierPart
WhileToken      = "while"            !IdentifierPart
RepeatToken     = "repeat"           !IdentifierPart
InitialToken    = "initial"          !IdentifierPart
AtToken         = "at"               !IdentifierPart
CrossToken      = "cross"            !IdentifierPart
DotToken        = "dot"              !IdentifierPart
OfToken         = "of"               !IdentifierPart
ArrayToken      = "array"            !IdentifierPart {return "array";}
RecordToken     = "record"           !IdentifierPart
StreamToken     = "stream"           !IdentifierPart
IndentToken     = "__INDENT__"       !IdentifierPart
DedentToken     = "__DEDENT__"       !IdentifierPart

/* Automatic Semicolon Insertion */

EOS
  = __ ";"
  / _ LineTerminatorSequence
  / _ &"}"
  / __ EOF

EOSNoLineTerminator
  = _ ";"
  / _ LineTerminatorSequence
  / _ &"}"
  / _ EOF

EOF
  = !.

/* Whitespace */

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator / SingleLineComment)*

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

/* ===== A.2 Number Conversions ===== */

/*
 * Rules from this section are either unused or merged into previous section of
 * the grammar.
 */

Program
  = head:SomeDefinition
    tail:(__ SomeDefinition)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
      return result;
    }

SomeDefinition
  = Expression


IdentifierList
  = head:Identifier
    tail:(__ "," __ Identifier)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][3]);
      }
      return result;
    }

FunctionItself
  = FunctionToken __ "(" __ t:FieldList __ )" __ IndentToken __ exp:ExpressionList __ DedentToken {return {type: "Function", params:t, expressions:exp}}
  / FunctionToken __ "(" __ ")" __ IndentToken __ exp:ExpressionList __ DedentToken {return {type: "Function", params:null, expressions:exp}}

/* support only simple [1, 2, 3, 4] array descriptions first
it would be good to support compartible Sisal 2.0 array definitions like [1; 2, 3, 4], [1..3: 2,3,4]
+ array comprehensions
*/

ArrayItself
  = "[" __ contents:ExpressionList __ "]"
/* ===== A.3 Expressions ===== */

Expression
  = LogicalAndString

LogicalOrStringOperator
  = "||"
  / "|" !"|"
  / "^"
  / "&"

LogicalAndString
  = head:Compare
    tail:(__ LogicalOrStringOperator __ Compare)* {
      var result = head;
      for (var i = 0; i < tail.length; i++) {
        result = {
          type:     "BinaryExpression",
          operator: tail[i][1],
          left:     result,
          right:    tail[i][3]
        };
      }
      return result;
    }

CompareOperator
  = "="
  / "~="
  / "<" !"="
  / ">" !"="
  / "<="
  / ">="

Compare
  = head:Priority1Operation
    tail:(__ CompareOperator __ Priority1Operation)* {
      var result = head;
      for (var i = 0; i < tail.length; i++) {
        result = {
          type:     "BinaryExpression",
          operator: tail[i][1],
          left:     result,
          right:    tail[i][3]
        };
      }
      return result;
    }

Priority1Operator
  = "+"
  / "-"

Priority1Operation
  = head:Priority2Operation
    tail:(__ Priority1Operator __ Priority2Operation)* {
      var result = head;
      for (var i = 0; i < tail.length; i++) {
        result = {
          type:     "BinaryExpression",
          operator: tail[i][1],
          left:     result,
          right:    tail[i][3]
        };
      }
      return result;
    }

Priority2Operator
  = "*"
  / "/"
  / "%"

Priority2Operation
  = head:ToPowerOperation
    tail:(__ Priority2Operator __ ToPowerOperation)* {
      var result = head;
      for (var i = 0; i < tail.length; i++) {
        result = {
          type:     "BinaryExpression",
          operator: tail[i][1],
          left:     result,
          right:    tail[i][3]
        };
      }
      return result;
    }

ToPowerOperation
  = head:UnaryOperation
    tail:(__ "**" __ UnaryOperation)* {
      var result = head;
      for (var i = 0; i < tail.length; i++) {
        result = {
          type:     "BinaryExpression",
          operator: tail[i][1],
          left:     result,
          right:    tail[i][3]
        };
      }
      return result;
    }

UnaryOperation
  = "-" __ op:UnaryOperation {return {type:"Unary", operation: "-", operand:op}}
  / "+" __ op:UnaryOperation {return {type:"Unary", operation: "+", operand:op}}
  / "~" __ op:UnaryOperation {return {type:"Unary", operation: "~", operand:op}}
  / PostfixOperation

PostfixOperation
  = base:Operand
    args:(
     __ "(" __ arguments:FunctionArgumentList? __ ")" { return {type:"()", exp: arguments}; }
     / __ "." __ name:IdentifierName    { return name; }
     / __ "[" __ expList:ExpressionList __ "]" { return {type:"[]", exp: expList}; }
     / __ ReplaceToken __ "{" __ definitions: DefinitionList __ "}"
     / __ TagToken __ name:Identifier
     / __ ":" __ ty:DataType
    )* {
    if (args.length==0) return base;

    var result = {
        type: "Postfix",
        base: base,
        opList: []
      };
    for (var i = 0; i < args.length; i++) {
      result.opList.push(args[i]);
    }
    return result;
    }
  / "(" __ exp:Expression __ ")" {return exp; }
  / Operand

FunctionArgumentList
  = head:Expression
    tail:(__ "," __ Expression)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][3]);
      }
      return result;
    }

ExpressionList
  = head:Expression
    tail:(__ "," __ Expression)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][3]);
      }
      return result;
    }

/*  Operands    */
Operand
  = ArrayItself
  / OldToken __ name:Identifier {return {type: "old", id:name}}
  / Identifier
  / Literal
  / LetExpression
  / IfExpression
/*  / CaseExpression
  / WhereExpression*/
  / LoopExpression
  / FunctionItself
/*  / StreamItself
  / RecordItself
  / UnionItself*/
  / IsToken __ ErrorToken __ "(" __ expr:Expression __ ")" {return {type:"Is error", expression:expr }}

/* Complex Expressions */
LetExpression
  = LetToken __ IndentToken __ dl:DefinitionList __ DedentToken __ InToken __ IndentToken __ exp:ExpressionList __ DedentToken __ LetToken {
    return {type:"Let", deflist:dl, body:exp }}

DefinitionList
  = head:Definition
    tail:(__ ";" __ Definition)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][3]);
      }
      return result;
    }

Definition
  = left:LValue __ ":=" __ exp:Expression {return {type:"Definition", left:left, right:exp}}

LValue
  = head:Identifier
    tail:(__ "," __ Identifier)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][3]);
      }
      return result;
    }

IfExpression
  = IfToken __ exp:Expression __ IndentToken __ th:ExpressionList __ elif:(ElseIfs)? __ DedentToken __ ElseToken __ IndentToken __ el:ExpressionList __ DedentToken {return {type:"If", condition: exp, then:th, elseif:elif, else:el }}

ElseIfs
  = head:ElseIf
    tail:(__ ElseIf)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
      return result;
    }

ElseIf
  = ElseIfToken __ exp:Expression __ IndentToken __ th:ExpressionList __ DedentToken

LoopExpression
  = ForToken __ r:RangeGen dl:( __ RepeatToken __ DefinitionList)? __ ReturnsToken __ ret:ReturnExpression __
  /  ForToken __ r:RangeGen __ IndentToken dl:( __ DedentToken __ RepeatToken __ IndentToken __ DefinitionList)? __ DedentToken __ ReturnsToken __ IndentToken __ ret:ReturnExpression __ DedentToken __
    {return {type: "For", range:r, body:(dl!==null?dl[3]:""), returns:ret}}
  / ForToken __ InitialToken __ IndentToken __ init:DefinitionList expr:( __ DedentToken __ WhileToken __ IndentToken __ Expression)? body:( __ DedentToken __ RepeatToken __ IndentToken __ DefinitionList )? postcond:( __ DedentToken __ WhileToken __ IndentToken __ Expression)? __ DedentToken __ ReturnsToken __ IndentToken __ ret:ReturnExpression __ DedentToken
    {return {type: "For", init:init, condition:(expr!==null?expr[3]:""), postcondition:(postcond!==null?postcond[3]:""), body:(body!==null?body[3]:""), returns:ret }}
  / ForToken __ WhileToken __ expr:Expression body:( __ RepeatToken __ DefinitionList )? __ ReturnsToken __ ret:ReturnExpression
    {return {type: "For", init:null, condition:expr, body:(body!==null?body[3]:""), returns:ret }}
  / ForToken __ RepeatToken __ body:DefinitionList __ WhileToken __ expr:Expression __ ReturnsToken __ ret:ReturnExpression {return {type: "For", init:null, condition:expr, body:body, returns:ret }}

RangeGen
  = range:ForIndexRange gen:( (__ CrossToken / __ DotToken ) __ RangeGen)? { if (gen!==null) return {type:gen[0][1][0], left:range, right:gen[2] }; else return range;}

ForIndexRange
  = name:Identifier __ InToken __ range:ForIndexRangeTriplet {return {type: "Range", name:name, range:range }}

ForIndexRangeTriplet
  = exp:Expression exp2:(__ "," __ Expression )? exp3:(__ "," __ Expression )?  { return {type:"RangeTriplet", exp:exp, exp2:exp2!==null ? exp2[3] : "", exp3:exp3!==null?exp3[3]:"" }}

ReturnExpression
  = r:ReductionWithInitial __ OfToken __ el:ExpressionList el2:(__ WhenToken __ ExpressionList )? rt:(__ ";" __ ReturnExpression)?
  { return {type:"Return Expression", reduction:r, expressions:el, whenex: el2!==null?el2[3]:"", retexp:rt!==null?rt[3]:""}}

ReductionWithInitial
  = name:ReductionName exp:(__ "(" __ ExpressionList __ ")")? {return {type:"Reduction", name:name, expressions: exp!==null?exp[3]:"" }}

ReductionName
  = Identifier
  / ArrayToken

/* ===== A.5 Functions and Programs ===== */

/* ===== A.6 Universal Resource Identifier Character Classes ===== */

/* Irrelevant. */

/* ===== A.7 Regular Expressions ===== */

/*
 * We treat regular expressions as opaque character sequences and we do not use
 * rules from this part of the grammar to parse them further.
 */

/* ===== A.8 JSON ===== */

/* Irrelevant. */
