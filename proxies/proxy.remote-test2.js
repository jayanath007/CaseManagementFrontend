const proxy = require('./proxy');

const v2BaseUrl = "https://spttest2.azurewebsites.net/webService/api/";
const v2BaseUrl2 = "https://spttest2.azurewebsites.net/webService2/api/ ";
const v3baseUrl = 'https://spttest2.azurewebsites.net/apiv3/api/';
const v3ProxyBaseUrl = 'https://spttest2v3-apim.azure-api.net/api/';
const workflowStreamingUrl = 'https://spttest2workflow.azurewebsites.net/';
const graphApiBase = "https://spttest2.azurewebsites.net/GraphApi";

const PROXY_CONFIG = proxy(v2BaseUrl, v2BaseUrl2, v3baseUrl, v3ProxyBaseUrl, workflowStreamingUrl, graphApiBase)
console.log("PROXY_CONFIG");
console.log(PROXY_CONFIG);
module.exports = PROXY_CONFIG;
