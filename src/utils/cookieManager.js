class CookieManager {
  constructor() {
    this.cookie = null;
  }
  setCookie(cookie) {
    this.cookie = cookie;
  }
  getCookie() {
    return this.cookie;
  }
  clearCookie() {
    this.cookie = null;
  }
}
export default new CookieManager();