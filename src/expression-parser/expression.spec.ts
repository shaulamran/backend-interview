import expressionToTree from './expressionToTree';

test('Equal', () => {
  generateTest({
    EXPRESSION: 'EQUAL(id,first-post)',
    TO_BE_FOUND: [{ id: 'first-post' }],
    TO_NOT_BE_FOUND: [{ id: 'second-post' }],
  });
});

test('Greater than', () => {
  generateTest({
    EXPRESSION: 'GREATER_THAN(views,6)',
    TO_BE_FOUND: [{ views: 10 }],
    TO_NOT_BE_FOUND: [{ views: 2 }],
  });
});

test('Lower than', () => {
  generateTest({
    EXPRESSION: 'LOWER_THAN(views,6)',
    TO_BE_FOUND: [{ views: 2 }],
    TO_NOT_BE_FOUND: [{ views: 10 }],
  });
});

test('AND', () => {
  generateTest({
    EXPRESSION: 'AND(EQUAL(id,first-post),EQUAL(views,100))',
    TO_BE_FOUND: [{ id: 'first-post', views: 100 }],
    TO_NOT_BE_FOUND: [{ id: 'first-post' }],
  });
});

test('OR', () => {
  generateTest({
    EXPRESSION: 'OR(EQUAL(id,first-post),EQUAL(views,100))',
    TO_BE_FOUND: [{ id: 'first-post' }, { views: 100 }],
    TO_NOT_BE_FOUND: [{ id: 'second-post', views: 6 }],
  });
});

test('NOT', () => {
  generateTest({
    EXPRESSION: 'NOT(EQUAL(id,second-post))',
    TO_BE_FOUND: [{ id: 'first-post' }],
    TO_NOT_BE_FOUND: [{ id: 'second-post' }],
  });
});

test('Big complex on the left side', () => {
  generateTest({
    EXPRESSION:
      'AND(AND(EQUAL(id,first-post),GREATER_THAN(likes,50)),EQUAL(views,100))',
    TO_BE_FOUND: [{ id: 'first-post', views: 100, likes: 51 }],
    TO_NOT_BE_FOUND: [{ id: 'first-post', views: 100, likes: 49 }],
  });
});

test('Big complex on the right side', () => {
  generateTest({
    EXPRESSION:
      'AND(EQUAL(views,100),AND(EQUAL(id,first-post),GREATER_THAN(likes,50)))',
    TO_BE_FOUND: [{ id: 'first-post', views: 100, likes: 51 }],
    TO_NOT_BE_FOUND: [{ id: 'first-post', views: 100, likes: 49 }],
  });
});

test('Expression with spaces', () => {
  generateTest({
    EXPRESSION: 'EQUAL( id , first-post )',
    TO_BE_FOUND: [{ id: 'first-post' }],
    TO_NOT_BE_FOUND: [{ id: 'second-post' }],
  });
});

test('Expression with single quotation marks', () => {
  generateTest({
    EXPRESSION: `EQUAL( id , 'first-post' )`,
    TO_BE_FOUND: [{ id: 'first-post' }],
    TO_NOT_BE_FOUND: [{ id: 'second-post' }],
  });
});

test('Expression with double quotation marks', () => {
  generateTest({
    EXPRESSION: `EQUAL( id , "first-post" )`,
    TO_BE_FOUND: [{ id: 'first-post' }],
    TO_NOT_BE_FOUND: [{ id: 'second-post' }],
  });
});

function generateTest(data) {
  const { EXPRESSION, TO_BE_FOUND, TO_NOT_BE_FOUND } = data;
  const store = [...TO_BE_FOUND, ...TO_NOT_BE_FOUND];

  const result = store.filter((obj) =>
    expressionToTree(EXPRESSION, obj).calc()
  );
  expect(result).toEqual(expect.arrayContaining([...TO_BE_FOUND]));
  expect(result).toEqual(expect.not.arrayContaining([...TO_NOT_BE_FOUND]));
}
