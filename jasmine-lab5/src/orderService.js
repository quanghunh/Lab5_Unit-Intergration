class OrderService {
  constructor(apiClient, emailService) {
    this.apiClient = apiClient;
    this.emailService = emailService;
  }
 
  calculateTotal(items) {
    return items.reduce((sum, item) =>
      sum + item.price * item.quantity, 0
    );
  }
 
  applyDiscount(total, discountPercent) {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount phải từ 0–100%');
    }
    return total * (1 - discountPercent / 100);
  }
 
  async createOrder(userId, items, discount = 0) {
    // 1. Tính tổng
    const subtotal = this.calculateTotal(items);
    const total = this.applyDiscount(
      subtotal, discount
    );
 
    // 2. Gọi API lưu đơn hàng
    const order = await this.apiClient.post(
      '/api/orders',
      { userId, items, subtotal, total, discount }
    );
 
    // 3. Lấy thông tin user để gửi email
    const user = await this.apiClient.get(
      `/api/users/${userId}`
    );
 
    // 4. Gửi email xác nhận
    await this.emailService.sendEmail(
      user.email,
      `Xác nhận đơn hàng #${order.id}`,
      `Đơn hàng của bạn: ${total}đ`
    );
 
    return order;
  }
}
 
module.exports = OrderService;
