const OrderService = require('../src/orderService');
 
describe('OrderService - Integration Tests', () => {
  let orderService;
  let mockApi;
  let mockEmail;
 
  // Fake data
  const fakeUser = {
    id: 1, name: 'Nguyễn Văn A',
    email: 'a@shop.com'
  };
  const sampleItems = [
    { name: 'Áo', price: 200000, quantity: 2 },
    { name: 'Quần', price: 350000, quantity: 1 },
  ];
 
  beforeEach(() => {
    // Mock dependencies
    mockApi = jasmine.createSpyObj(
      'ApiClient', ['get', 'post']
    );
    mockEmail = jasmine.createSpyObj(
      'EmailService', ['sendEmail']
    );
 
    orderService = new OrderService(
      mockApi, mockEmail
    );
  });
 
  // ─────────────────────────────────────
  // UNIT TESTS (các hàm thuần logic)
  // ─────────────────────────────────────
  describe('calculateTotal() [Unit]', () => {
    it('should calculate total correctly', () => {
      const total =
        orderService.calculateTotal(sampleItems);
      // 200000*2 + 350000*1 = 750000
      expect(total).toBe(750000);
    });
 
    it('should return 0 for empty items', () => {
      expect(orderService.calculateTotal([]))
        .toBe(0);
    });
  });
 
  describe('applyDiscount() [Unit]', () => {
    it('should apply 10% discount', () => {
      expect(orderService.applyDiscount(100000, 10))
        .toBe(90000);
    });
 
    it('should throw for invalid discount', () => {
      expect(() =>
        orderService.applyDiscount(100000, 150)
      ).toThrowError('Discount phải từ 0–100%');
    });
  });
 
  // ─────────────────────────────────────
  // INTEGRATION TEST (kiểm tra luồng)
  // ─────────────────────────────────────
  describe('createOrder() [Integration]', () => {
 
    it('should create order with full flow',
      async () => {
      // Setup mocks
      const fakeOrder = {
        id: 'ORD-001',
        userId: 1,
        total: 675000
      };
      mockApi.post.and.resolveTo(fakeOrder);
      mockApi.get.and.resolveTo(fakeUser);
      mockEmail.sendEmail.and.resolveTo({
        success: true
      });
 
      // Execute: tạo đơn với 10% giảm giá
      const order = await orderService.createOrder(
        1, sampleItems, 10
      );
 
      // ===== VERIFY TƮNG BƯỚC =====
 
      // Bước 2: API post được gọi để lưu order
      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/orders',
        jasmine.objectContaining({
          userId: 1,
          subtotal: 750000,
          total: 675000,   // 750000 * 0.9
          discount: 10,
        })
      );
 
      // Bước 3: API get được gọi để lấy user
      expect(mockApi.get)
        .toHaveBeenCalledWith('/api/users/1');
 
      // Bước 4: Email được gửi
      expect(mockEmail.sendEmail)
        .toHaveBeenCalledWith(
          'a@shop.com',
          jasmine.stringMatching(/ORD-001/),
          jasmine.stringMatching(/675000/)
        );
 
      // Kiểm tra thứ tự gọi
      expect(mockApi.post)
        .toHaveBeenCalledBefore(mockApi.get);
      expect(mockApi.get)
        .toHaveBeenCalledBefore(
          mockEmail.sendEmail
        );
 
      // Kiểm tra kết quả cuối cùng
      expect(order.id).toBe('ORD-001');
    });
 
    it('should handle API failure gracefully',
      async () => {
      mockApi.post.and.rejectWith(
        new Error('Server error')
      );
 
      await expectAsync(
        orderService.createOrder(1, sampleItems)
      ).toBeRejectedWithError('Server error');
 
      // Email không được gửi khi API fail
      expect(mockEmail.sendEmail)
        .not.toHaveBeenCalled();
    });
  });
});
