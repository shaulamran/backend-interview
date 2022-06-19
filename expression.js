class Node {
  constructor(data) {
    this.data = data;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

class Expression {
  constructor(expression) {
    this.calc = function calc(obj) {
      var isOperatorRegExp = new RegExp(/^EQUAL\(|^AND\(|^OR\(/im);
      let topTree;
      let tree;

      while (expression) {
        const isOperator = isOperatorRegExp.test(expression);

        if (isOperator) {
          const indexOfFirstParenthesis = expression.indexOf('(');
          const operator = expression.substring(0, indexOfFirstParenthesis);

          if (tree == undefined) {
            tree = new Node(operator);
            topTree = tree;
          } else if (!tree.left) {
            tree.left = new Node(operator);
            tree.left.parent = tree;
            tree = tree.left;
          } else if (!tree.right) {
            tree.right = new Node(operator);
            tree.right.parent = tree;
            tree = tree.right;
          } else {
            while (tree.right) {
              tree = tree.parent;
            }
            tree.right = new Node(operator);
            tree.right.parent = tree;
            tree = tree.right;
          }

          expression = expression.substring(indexOfFirstParenthesis + 1);
        } else {
          var operandsRegex = new RegExp(/([^,]+),([^\)]+)\)?,?(.*)/gim);
          var match = operandsRegex.exec(expression);
          const operand1 = match[1];
          const operand2 = match[2];
          console.log(match);
          expression = match[3];
          expression = removeClosingParenthesis(expression);
          tree.left = new Node(operand1);
          tree.right = new Node(operand2);
        }
        console.log(expression);
      }
      console.log("finished with expression");

      return evalTree(topTree, obj);
    };
  }

}

function evalTree(tree, obj) {
  if (tree.data == 'EQUAL') {
    return obj[tree.left.data] == tree.right.data;
  } else if (tree.data == 'OR') {
    return evalTree(tree.left, obj) || evalTree(tree.right, obj);
  } else if (tree.data == 'AND') {
    return evalTree(tree.left, obj) && evalTree(tree.right, obj);
  }
}

function removeClosingParenthesis(string) {
  while (string.indexOf(')') === 0) {
    string = string.substring(1, string.length);
  }

  return string;
}


//AND(EQUAL(id,"first-post"),EQUAL(views,100))
var expression = new Expression(
  "AND(EQUAL(id,first-post),EQUAL(views,100))"
);

var store = [
  { id: 'first-post', title: 'alphabet', views: 100 },
  //{ id: 'first-post', views: 200 },
];

console.log(store.filter((obj) => expression.calc(obj)));
