class ApiClient {
  async get(url) {
    // Giả lập gọi API thực tế
    const response = await fetch(url);
    return response.json();
  }
 
  async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
 
module.exports = ApiClient;
