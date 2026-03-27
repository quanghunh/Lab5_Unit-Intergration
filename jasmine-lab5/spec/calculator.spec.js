const Calculator = require('../src/calculator');
 
describe('Calculator', () => {
  let calc;
 
  // beforeEach: khởi tạo lại trước mỗi test
  beforeEach(() => {
    calc = new Calculator();
  });
 
  // ========================
  // EQUALITY MATCHERS
  // ========================
  describe('add()', () => {
    it('should add two positive numbers', () => {
      // toBe: so sánh nghiêm ngặt (===)
      expect(calc.add(2, 3)).toBe(5);
    });
 
    it('should add negative numbers', () => {
      expect(calc.add(-1, -2)).toBe(-3);
    });
 
    it('should add decimal numbers', () => {
      // toBeCloseTo: so sánh số thập phân
      expect(calc.add(0.1, 0.2)).toBeCloseTo(0.3);
    });
 
    it('should throw error for non-numbers', () => {
      // toThrow / toThrowError: kiểm tra exception
      expect(() => calc.add('a', 2))
        .toThrowError('Các tham số phải là số');
    });
  });
 
  // ========================
  // COMPARISON MATCHERS
  // ========================
  describe('divide()', () => {
    it('should divide correctly', () => {
      expect(calc.divide(10, 2)).toBe(5);
    });
 
    it('should return decimal result', () => {
      // toBeGreaterThan / toBeLessThan
      expect(calc.divide(10, 3))
        .toBeGreaterThan(3.33);
      expect(calc.divide(10, 3))
        .toBeLessThan(3.34);
    });
 
    it('should throw error when dividing by zero',
      () => {
      expect(() => calc.divide(10, 0))
        .toThrowError('Không thể chia cho 0');
    });
  });
 
  // ========================
  // TRUTHINESS MATCHERS
  // ========================
  describe('isEven()', () => {
    it('should return true for even numbers', () => {
      // toBeTruthy / toBeFalsy
      expect(calc.isEven(4)).toBeTruthy();
      expect(calc.isEven(4)).toBe(true);
    });
 
    it('should return false for odd numbers', () => {
      expect(calc.isEven(3)).toBeFalsy();
    });
 
    // toBeNull, toBeUndefined, toBeDefined, toBeNaN
    it('should demonstrate null/undefined matchers',
      () => {
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
      expect(calc.add).toBeDefined();
      expect(NaN).toBeNaN();
    });
  });
 
  // ========================
  // OBJECT / ARRAY MATCHERS
  // ========================
  describe('Advanced Matchers', () => {
    it('toEqual: deep equality for objects', () => {
      const result = {
        sum: calc.add(1, 2), product: calc.multiply(3, 4)
      };
      // toEqual: so sánh sâu (deep equal)
      expect(result)
        .toEqual({ sum: 3, product: 12 });
    });
 
    it('toContain: check array/string content',
      () => {
      const evens = [2, 4, 6, 8, 10];
      expect(evens).toContain(6);
      expect('Calculator').toContain('Calc');
    });
 
    it('toMatch: regex matching', () => {
      const msg = 'Error: Không thể chia cho 0';
      expect(msg).toMatch(/Error/);
      expect(msg).toMatch(/chia cho 0/);
    });
 
    it('jasmine.any: type checking', () => {
      expect(calc.add(1, 2))
        .toEqual(jasmine.any(Number));
      expect('hello')
        .toEqual(jasmine.any(String));
    });
 
    it('jasmine.objectContaining: partial match',
      () => {
      const stats = { total: 100, passed: 95,
        failed: 5, duration: '2s' };
      expect(stats).toEqual(
        jasmine.objectContaining({
          total: 100, passed: 95
        })
      );
    });
  });
 
  // ========================
  // NEGATION: .not
  // ========================
  describe('Negation with .not', () => {
    it('should negate matchers', () => {
      expect(calc.add(2, 3)).not.toBe(6);
      expect(calc.isEven(3)).not.toBeTruthy();
      expect([1, 2, 3]).not.toContain(4);
    });
  });
});
