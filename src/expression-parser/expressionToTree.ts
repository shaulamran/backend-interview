import {Equal, GreaterThan, LowerThan, AndOperator, OrOperator, NotOperator, Expression} from './expressionClasses';

function expressionToTree(expression: string, obj: Record<string, string>) : Expression {
  // Removing whitespaces and quotation marks
  expression = expression
    .replace(/\s/g, '')
    .replace(/'/g, '')
    .replace(/"/g, '');

  var operator = expression.substring(0, expression.indexOf('('));

  const { className, parsingFunc } = operatorToClassMap[operator];
  return parsingFunc(expression, className, obj);
}

const operatorToClassMap = {
  EQUAL: { className: Equal, parsingFunc: parseAtomicExpression },
  GREATER_THAN: { className: GreaterThan, parsingFunc: parseAtomicExpression },
  LOWER_THAN: { className: LowerThan, parsingFunc: parseAtomicExpression },
  AND: { className: AndOperator, parsingFunc: parseComplexExpression },
  OR: { className: OrOperator, parsingFunc: parseComplexExpression },
  NOT: { className: NotOperator, parsingFunc: parseNotExpression },
};

function parseComplexExpression(
  expression: string,
  className,
  obj: Record<string, string>
) {
  const { expressionOne, expressionTwo } = extractTwoSubExpressions(expression);
  const expressionOneTree = expressionToTree(expressionOne, obj);
  const expressionTwoTree = expressionToTree(expressionTwo, obj);
  const andTree = new className(expressionOneTree, expressionTwoTree);
  return andTree;
}

function parseNotExpression(
  expression: string,
  className,
  obj: Record<string, string>
) {
  const subExpression = expression.substring(4, expression.length - 1);
  const notTree = new className(expressionToTree(subExpression, obj));
  return notTree;
}

function parseAtomicExpression(
  expression: string,
  className,
  obj: Record<string, string>
) {
  const { operand1, operand2 } = extractOperands(expression);
  const expressionTree = new className(operand1, operand2, obj);
  return expressionTree;
}

function extractOperands(expression: string) {
  var operandsRegex = new RegExp(/([^(]+),([^\)]+)\)/gim);
  var match = operandsRegex.exec(expression);
  const operand1 = match[1];
  const operand2 = match[2];
  return { operand1, operand2 };
}

function extractTwoSubExpressions(expression: string) {
  let parenthesisCounter = 0;
  let i = 0;
  let beginningOfFirstExpression = -1;
  let endOfFirstExpression = -1;
  let beginningOfSecondExpression = -1;
  let endOfSecondExpression = -1;

  let STAGES = {
    FIRST_EXPRESSION_BEGINNING: 1,
    FIRST_EXPRESSION_END: 2,
    SECOND_EXPRESSION_BEGINNING: 3,
    SECOND_EXPRESSION_END: 4,
  };

  let stage = STAGES.FIRST_EXPRESSION_BEGINNING;

  while (i < expression.length) {
    if (expression[i] == '(') {
      parenthesisCounter++;

      if (
        stage == STAGES.FIRST_EXPRESSION_BEGINNING &&
        parenthesisCounter == 1
      ) {
        beginningOfFirstExpression = i + 1;
        stage = STAGES.FIRST_EXPRESSION_END;
      }
    }

    if (expression[i] == ')') {
      parenthesisCounter--;

      if (stage == STAGES.FIRST_EXPRESSION_END && parenthesisCounter == 1) {
        endOfFirstExpression = i + 1;
        beginningOfSecondExpression = i + 2; // skipping comma between the two expressions
        stage = STAGES.SECOND_EXPRESSION_END;
      }

      if (stage == STAGES.SECOND_EXPRESSION_END && parenthesisCounter == 1) {
        endOfSecondExpression = i + 1;
      }
    }

    i++;
  }
  const expressionOne = expression.substring(
    beginningOfFirstExpression,
    endOfFirstExpression
  );
  const expressionTwo = expression.substring(
    beginningOfSecondExpression,
    endOfSecondExpression
  );

  return { expressionOne, expressionTwo };
}

export default expressionToTree;
