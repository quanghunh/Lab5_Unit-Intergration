const UserService = require('../src/userService');
 
describe('UserService', () => {
  let service;
  let mockApiClient;
 
  beforeEach(() => {
    // Tạo mock object với jasmine.createSpyObj
    mockApiClient = jasmine.createSpyObj(
      'ApiClient', ['get', 'post']
    );
    service = new UserService(mockApiClient);
  });
 
  // ─── spyOn + returnValue ───
  describe('getUser()', () => {
    it('should call API and return user', async () => {
      const fakeUser = {
        id: 1, name: 'Nguyễn Văn A',
        email: 'a@test.com'
      };
 
      // Cấu hình spy trả về giá trị giả
      mockApiClient.get.and.resolveTo(fakeUser);
 
      const result = await service.getUser(1);
 
      // Kiểm tra spy được gọi
      expect(mockApiClient.get)
        .toHaveBeenCalledWith('/api/users/1');
      expect(mockApiClient.get)
        .toHaveBeenCalledTimes(1);
 
      // Kiểm tra kết quả
      expect(result).toEqual(fakeUser);
    });
 
    // ─── Test cache behavior ───
    it('should return cached user on 2nd call',
      async () => {
      const fakeUser = {
        id: 1, name: 'Test', email: 'test@mail.com'
      };
      mockApiClient.get.and.resolveTo(fakeUser);
 
      // Gọi lần 1: API được gọi
      await service.getUser(1);
 
      // Gọi lần 2: trả từ cache
      const result = await service.getUser(1);
 
      // API chỉ được gọi 1 lần (lần 2 lấy cache)
      expect(mockApiClient.get)
        .toHaveBeenCalledTimes(1);
      expect(result).toEqual(fakeUser);
    });
  });
 
  // ─── spyOn + callFake ───
  describe('createUser()', () => {
    it('should validate and create user', async () => {
      const newUser = {
        name: 'Trần Văn B', email: 'b@test.com'
      };
      const savedUser = { id: 42, ...newUser };
 
      // callFake: thay thế hành vi
      mockApiClient.post.and.callFake(
        async (url, data) => {
          return { id: 42, ...data };
        }
      );
 
      const result = await service.createUser(newUser);
 
      expect(mockApiClient.post)
        .toHaveBeenCalledOnceWith(
          '/api/users', newUser
        );
      expect(result.id).toBe(42);
      expect(result.name).toBe('Trần Văn B');
    });
 
    it('should throw if name is missing', async () => {
      await expectAsync(
        service.createUser({ email: 'x@test.com' })
      ).toBeRejectedWithError(
        'Name và email là bắt buộc'
      );
 
      // API không được gọi khi validation fail
      expect(mockApiClient.post)
        .not.toHaveBeenCalled();
    });
  });
 
  // ─── Test hàm thuần (không cần spy) ───
  describe('isValidEmail()', () => {
    it('should validate correct emails', () => {
      expect(service.isValidEmail('a@b.com'))
        .toBe(true);
      expect(service.isValidEmail('user@domain.vn'))
        .toBe(true);
    });
 
    it('should reject invalid emails', () => {
      expect(service.isValidEmail('invalid'))
        .toBe(false);
      expect(service.isValidEmail('@no-user.com'))
        .toBe(false);
      expect(service.isValidEmail('no@domain'))
        .toBe(false);
    });
  });
});
