const proxy = require('./proxy');

const v2BaseUrl = "https://sptdev.azurewebsites.net/webService/api/";
const v2BaseUrl2 = "https://sptdev.azurewebsites.net/webService/api/";
const v3baseUrl = 'https://sptdev.azurewebsites.net/apiv3/api/';
const v3ProxyBaseUrl = 'https://sptdev3-apim.azure-api.net/api/';
const workflowStreamingUrl = "https://sptdevworkflow.azurewebsites.net/";
const graphApiBase = "https://sptdev.azurewebsites.net/GraphApi";

const PROXY_CONFIG = proxy(v2BaseUrl, v2BaseUrl2, v3baseUrl, v3ProxyBaseUrl, workflowStreamingUrl, graphApiBase)
console.log("PROXY_CONFIG");
console.log(PROXY_CONFIG);
module.exports = PROXY_CONFIG;
