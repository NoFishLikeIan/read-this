// From the book - to mock a mockingbird

// ---- Identity, I := λ a.a <- returns the argument
// Haskell, id 5 == 5

const I = (a: any): typeof a => a; // trivial
console.log(I(2) === 2); // > true
console.log(I(I)); // > [Function: I]

// ---- Mockingbird, M := λf.ff <- returns a called function
const M = (fn: any) => fn(fn); // fn: typeof fn

// M I
// = (λf.ff)(λx.x)
//   = (λx.x)(λx.x) = I I
//     = λx.x = I
console.log(M(I) === I); // > [Function: I]

// M M
// = (λf.ff) (λf.ff)
// = (λf.ff) (λf.ff) ...

try {
  M(M);
} catch (err) {
  console.log(err);
} // > RangeError: Maximum call stack size exceeded

// -------- Booleans
// True := λab.a
// False := λab.b
const True = (first: any) => (second: any): typeof first => first;
const False = (first: any) => (second: any): typeof second => second;

// ---- Cardinal, C := λfab.fba <- flips argumentsl
type fnType = (a: any) => (b: any) => any;

const C = (fn: fnType) => a => b => fn(b)(a);

console.log(C(True)(1)(2) === False(1)(2)); // > True
console.log(C(True)(True)(False)(2)(3)); // > 3

// -------- Negation --- equivalent to the cardinal C
// NOT := λb.bFT
// NOT T
//     = (λb.bFT) T
//         = T F T = F
type booleanType = typeof True | typeof False;
const Not = (oneFn: booleanType): booleanType => oneFn(False)(True);

console.log(Not(True) === False); // > true ... fun
console.log(Not(True)(3)(2) === C(True)(3)(2)); // > true

// -------- Conjuction and disjuntion
// AND := λpq.pqF
// AND T F
//     = λpq.pqF T F
//        = T F F = F
// AND T T
//     = λpq.pqF T T
//        = T T F = T <- note that the only case in which true is selected is
//                       when both the two first intances are true

const And = (firstFn: booleanType) => (secondFn: booleanType) =>
  firstFn(secondFn)(False);

console.log(And(True)(True) === True); // > true

// OR := λpq.pTq
// OR F F
//    = λpq.pTq F F
//        = F T F = F
// OR F T
//    = λpq.pTq F T
//        = F T T = T
const Or = (firstFn: booleanType) => (secondFn: booleanType) =>
  firstFn(True)(secondFn);

console.log(Or(False)(False) === False); // > true

// Equivalence between Or and M
// OR = λpq.pTq = λpq.ppq
//    = ppq = M (for booleans)
console.log(Or(False)(False) === M(False)(False)); // > true

// -------- De Morgan's Law
// NOT(AND(p)(q)) === OR(NOT(p))(NOT(q))
// ------ REDUCTION
// NOT(AND(p)(q)) = λb.bFT λpq.pqF p q
//    = λpq.pTq p q F T = p T q F T
// OR(NOT(p))(NOT(q)) = λpq.pTq λb.bFT p λb.bFT q
//    = λpq.pTq (p F T) (q F T)
//    = p F T T q F T = p T q F T

const deMLaw = (p: booleanType) => (q: booleanType) =>
  Not(And(p)(q)) === Or(Not(p))(Not(q));

console.log(
  [[True, False], [False, False], [False, True], [True, True]].map(bPair => {
    console.log(deMLaw(bPair[0])(bPair[1]));
  })
); // > true, true, true, true

// -------- Boolean equality
// BEQ := λpq.p (q T F) (q F T)

const Beq = (p: booleanType) => (q: booleanType) =>
  p(q(True)(False))(q(False)(True));

// Inuitively:
// p | -> True -Select first   | q | -> True -Select first   | True
//   |                         |   | -> False -Select Second | False
//   | -> False -Select Second |   | -> True -Select first   | False
//   |                         |   | -> False -Select Second | True
