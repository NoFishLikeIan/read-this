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

// -------- Numbers

const once = (f: (n: any) => any) => a => f(a); // This is equivalent to Identity*!
const twice = (f: (n: any) => any) => a => f(f(a));
const thrice = (f: (n: any) => any) => a => f(f(f(a)));
// .... etc

const zero = (f: (n: any) => any) => a => a; // This is equivalent to False!

// ---------- Dinamically defining these functions -> Succession number: Succ(n) => n+1
const succ = n => f => a => f(n(f))(a); // it takes a function n and applies the original function but with an extra f
const jsnum = n => n(x => x + 1)(0); // <--- this is just a visual rapresentation in javascript of church numbers.
const [n0, n1, n2, n3] = [zero, once, twice, thrice]; // etc...

console.log(jsnum(succ(n0)) === n1);

// ---------- Bluebird!

const B = f => g => a => f(g(a)); // right to left composition

console.log(B(Not)(Not)(True) === True); // indipendent of the direction
// What about direction dipendency?

console.log(B(jsnum)(succ)(n1) === n2); // right to left! in haskell this is the . -> odd = not . even

// Note that the succ is SUCC := λnf.Bf(nf)
const succPrime = n => f => B(f)(n(f));

// Binary addition! Two numbers addition
// ADD := λnk.n SUCC k

const add = n => k => n(succ)(k);
const [n4, n5, n6, n7, n8] = [
  add(n2)(n2),
  add(n2)(n3),
  add(n3)(n3),
  add(add(n3)(n3))(n1),
  add(add(n3)(n3))(n2)
];
// crazy

// Multiplication
// MULT := λnk.n(kf) = λnk.B n k ---> MULT = B alpha equivalence

const mult = B;

// Power
// POW := λnk.kn = Thrust

const T = n => k => k(n);
const pow = T;

console.log(jsnum(pow(n3)(n2)) === jsnum(n8)); // > true

// IsZero -> checking if it is zero mate
// is0 := λn.n K F T -> if n == 0 it skips the first function and return true, else it does K F (a) = F for all a

const K = a => b => a;
const is0 = n => n(K(False))(True);

// Subtraction
// PRED :=

// ------- Basic data Strucutre
// Vireo/Closures -> V := λ a b f . f a b
// This pairs two numbers together, a and b, and waits for a function to extract those values.

const V = a => b => f => f(a)(b);
// e.g. V I M
// V I M (K) = K(I)(M) = I
