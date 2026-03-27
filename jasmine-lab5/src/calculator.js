class Calculator {
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Các tham số phải là số');
    }
    return a + b;
  }
 
  subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Các tham số phải là số');
    }
    return a - b;
  }
 
  multiply(a, b) {
    return a * b;
  }
divide(a, b) {
    if (b === 0) {
      throw new Error('Không thể chia cho 0');
    }
    return a / b;
  }
 
  isEven(n) {
    return n % 2 === 0;
  }
 
  factorial(n) {
    if (n < 0) throw new Error('Không hỗ trợ số âm');
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  }
 
  fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
 
module.exports = Calculator;
