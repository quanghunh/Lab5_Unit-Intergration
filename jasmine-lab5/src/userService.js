class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.cache = {};
  }
 
  async getUser(id) {
    // Kiểm tra cache trước
    if (this.cache[id]) {
      return this.cache[id];
    }
 
    const user = await this.apiClient.get(
      `/api/users/${id}`
    );
    this.cache[id] = user;
    return user;
  }
 
  async createUser(userData) {
    if (!userData.name || !userData.email) {
      throw new Error('Name và email là bắt buộc');
    }
 
    const result = await this.apiClient.post(
      '/api/users', userData
    );
    this.cache[result.id] = result;
    return result;
  }
 
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
 
  clearCache() {
    this.cache = {};
  }
}
 
module.exports = UserService;
