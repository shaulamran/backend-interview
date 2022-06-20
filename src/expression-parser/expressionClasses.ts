export abstract class Expression {
  abstract calc(): boolean;
}

abstract class AtomicExpression extends Expression {
  constructor(
    public operand1: string,
    public operand2: string,
    public obj: Record<string, string>
  ) {
    super();
  }
}

export class Equal extends AtomicExpression {
  calc() {
    return this.obj[this.operand1] == this.operand2;
  }
}

export class GreaterThan extends AtomicExpression {
  calc() {
    return this.obj[this.operand1] > this.operand2;
  }
}

export class LowerThan extends AtomicExpression {
  calc() {
    return this.obj[this.operand1] < this.operand2;
  }
}

abstract class ComplexExpression extends Expression {
  constructor(
    public leftExpression: ComplexExpression,
    public rightExpression: ComplexExpression
  ) {
    super();
  }
}

export class AndOperator extends ComplexExpression {
  calc() {
    return this.leftExpression.calc() && this.rightExpression.calc();
  }
}

export class OrOperator extends ComplexExpression {
  calc() {
    return this.leftExpression.calc() || this.rightExpression.calc();
  }
}

export class NotOperator extends ComplexExpression {
  constructor(public leftExpression: ComplexExpression) {
    super(leftExpression, null);
  }

  calc() {
    return !this.leftExpression.calc();
  }
}
