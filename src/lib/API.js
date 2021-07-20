import axios from 'axios';
import Config from '../config';

function API() { }

API.prototype = {
  $instance: null,
  $baseURL: undefined,
  $refreshTokenHandler: () => {
    return Promise.resolve(false);
  },

  get baseURL() {
    return this.$baseURL || Config.serviceURL
  },

  set baseURL(url) {
    this.$baseURL = url;
    this.$instance = null;
  },

  get instance() {
    if (this.$instance === null) {
      this.$instance = axios.create({
        baseURL: this.$baseURL || Config.serviceURL,
        // withCredentials: true,
      })
    }
    return this.$instance;
  },
  /**
  * HTTP Get 요청
  * @alias module:API
  * @param  {string} url
  * @param  {object} params
  * @return {Promise}
  */
  async get(url, params) {
    console.log('baseURL: ', this.$baseURL)
    return this.instance.get(url, params || undefined);
  },
  /**
   * HTTP Post 요청
   * @alias module:API
   * @param  {string} url
   * @param  {object} params
   * @param  {object} config
   * @return {Promise}
   */
  async post(url, params, config) {
    return this.instance.post(url, params || undefined, config || undefined);
  },
  /**
   * HTTP Put 요청
   * @alias module:API
   * @param  {string} url
   * @param  {object} params
   * @param  {object} config
   * @return {Promise}
   */
  async put(url, params, config) {
    return this.instance.put(url, params || undefined, config || undefined);
  },
  /**
   * HTTP Delete 요청
   * @alias module:API
   * @param  {string} url
   * @param  {object} params
   * @return {Promise}
   */
  async delete(url, params) {
    const data = params ? { data: params } : undefined;
    return this.instance.delete(url, data);
  },
}
export default new API();