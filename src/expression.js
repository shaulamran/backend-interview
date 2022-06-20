class AtomicExpression {
  constructor(operand1, operand2, obj) {
    this.operand1 = operand1;
    this.operand2 = operand2;
    this.obj = obj;
  }
}

class Equal extends AtomicExpression {
  calc() {
    return this.obj[this.operand1] == this.operand2;
  }
}

class GreaterThan extends AtomicExpression {
  calc() {
    return this.obj[this.operand1] > this.operand2;
  }
}

class LowerThan extends AtomicExpression {
  calc() {
    return this.obj[this.operand1] < this.operand2;
  }
}

class ComplexExpression {
  constructor(leftExpression, rightExpression) {
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
}

class AndOperator extends ComplexExpression {
  calc() {
    return this.leftExpression.calc() && this.rightExpression.calc();
  }
}

class OrOperator extends ComplexExpression {
  calc() {
    return this.leftExpression.calc() || this.rightExpression.calc();
  }
}

class NotOperator extends ComplexExpression {
  calc() {
    return !this.leftExpression.calc();
  }
}

const operatorToClassMap = {
  EQUAL: Equal,
  GREATER_THAN: GreaterThan,
  LOWER_THAN: LowerThan,
  AND: AndOperator,
  OR: OrOperator,
  NOT: NotOperator,
};

function expressionToTree(expression, obj) {
  expression = expression
    .replace(/\s/g, '')
    .replace(/'/g, '')
    .replace(/"/g, '');
  var operator = extractOperator(expression);

  if (operator == 'AND') {
    const { expressionOne, expressionTwo } =
      extractTwoSubExpressions(expression);
    const expressionOneTree = expressionToTree(expressionOne, obj);
    const expressionTwoTree = expressionToTree(expressionTwo, obj);
    const andTree = new AndOperator(expressionOneTree, expressionTwoTree);
    return andTree;
  } else if (operator == 'OR') {
    const { expressionOne, expressionTwo } =
      extractTwoSubExpressions(expression);
    const expressionOneTree = expressionToTree(expressionOne, obj);
    const expressionTwoTree = expressionToTree(expressionTwo, obj);
    const orTree = new OrOperator(expressionOneTree, expressionTwoTree);
    return orTree;
  } else if (operator == 'NOT') {
    const subExpression = expression.substring(4, expression.length - 1);
    const notTree = new NotOperator(expressionToTree(subExpression, obj));
    return notTree;
  } else if (
    operator == 'EQUAL' ||
    operator == 'GREATER_THAN' ||
    operator == 'LOWER_THAN'
  ) {
    const { operand1, operand2 } = extractOperands(expression);
    const operatorClass = operatorToClassMap[operator];
    const expressionTree = new operatorClass(operand1, operand2, obj);
    return expressionTree;
  }
}

function extractTwoSubExpressions(expression) {
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

function extractOperands(expression) {
  var operandsRegex = new RegExp(/([^(]+),([^\)]+)\)/gim);
  var match = operandsRegex.exec(expression);
  const operand1 = match[1];
  const operand2 = match[2];
  return { operand1, operand2 };
}

function extractOperator(expression) {
  if (expression.startsWith('AND')) {
    return 'AND';
  } else if (expression.startsWith('OR')) {
    return 'OR';
  } else if (expression.startsWith('NOT')) {
    return 'NOT';
  } else if (expression.startsWith('EQUAL')) {
    return 'EQUAL';
  } else if (expression.startsWith('GREATER_THAN')) {
    return 'GREATER_THAN';
  } else if ('LOWER_THAN') {
    return 'LOWER_THAN';
  }
}

export default expressionToTree;
