function proxy(v2BaseUrl, v2BaseUrl2, v3baseUrl, v3ProxyBaseUrl, workflowStreamingUrl, graphApiBase) {
  return {

    "/v2serviceBase": {
      "target": v2BaseUrl,
      "logLevel": "debug",
      "secure": false,
      "changeOrigin": true,
      "pathRewrite": {
        "^/v2serviceBase": ""
      }
    },


    "/v2secondServiceBase": {
      "target": v2BaseUrl2,
      "logLevel": "debug",
      "secure": false,
      "changeOrigin": true,
      "pathRewrite": {
        "^/v2secondServiceBase": ""
      }
    },

    "/GraphApi": {
      "target": graphApiBase,
      "logLevel": "debug",
      "secure": false,
      "changeOrigin": true,
      "pathRewrite": {
        "^/GraphApi": ""
      }
    },

    "/hubs/workflow-streaming": {
      "target": workflowStreamingUrl,
      "logLevel": "debug",
      "secure": false,
      "changeOrigin": true,
    },

    "/crime/v1/": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/storageProxy/v1/": {
      "target": v3ProxyBaseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/teamTalk/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/workflow/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/diary/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/document-handler/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/inbox/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/opportunity/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/fileserver/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/precidentH/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/safebox/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/probate/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },

    "/document-handler-proxy/v1": {
      "target": v3baseUrl,
      "secure": false,
      "pathRewrite": {
        "document-handler-proxy/v1": "document-handler/v1"
      }
    },
    "/durable-proxy/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/storage-proxy/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
    },
    "/civil/v1": {
      "target": v3baseUrl,
      "secure": false,
      "changeOrigin": true,
  }
}

}
module.exports = proxy;


