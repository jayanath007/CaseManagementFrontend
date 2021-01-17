const proxy = require('./proxy');

const v2BaseUrl = "https://spitfiretest.dpshosted.com/webService/api/";
const v2BaseUrl2 = "https://spitfiretest.dpshosted.com/webService2/api/";
const v3baseUrl = 'https://spttest.azurewebsites.net/apiv3/api/';
const v3ProxyBaseUrl = 'https://spttest0v3-apim.azure-api.net/api/';
const workflowStreamingUrl = "https://spttestworkflow.azurewebsites.net/";
const graphApiBase = "https://spitfiretest.dpshosted.com/GraphApi";


const PROXY_CONFIG = proxy(v2BaseUrl, v2BaseUrl2, v3baseUrl, v3ProxyBaseUrl, workflowStreamingUrl, graphApiBase)
console.log("PROXY_CONFIG");
console.log(PROXY_CONFIG);
module.exports = PROXY_CONFIG;
