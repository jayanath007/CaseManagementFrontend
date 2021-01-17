const v2BaseUrl = "http://localhost:8000/api/";
const v2BaseUrl2 = v2BaseUrl;
const graphApiBase = 'https://spitfiretest2.dpshosted.com/';
const crime = "https://spttest.azurewebsites.net/apiv3/api/";
const solicitor = "http://localhost:7071/api/";
const teamTalk = "http://localhost:7071/api/";
const workflow = "http://localhost:7071/api/";
const diary = "https://spttest.azurewebsites.net/apiv3/api/";
const documentHandler = "https://sptdevv3-apim.azure-api.net/api/";
const inbox = "http://localhost:7071/api/";
const opportunity = "http://localhost:7071/api/";
const fileserver = "http://localhost:7071/api/";
const precidentH = "http://localhost:7071/api/";
const safebox = "http://localhost:7071/api/";
const documentHandlerProxy = "http://localhost:7071/api/";
const durableProxy = "http://localhost:7071/api/";
const storageProxy = "https://sptdevv3-apim.azure-api.net/api/";
const workflowStreamingUrl = 'https://spttest2workflow.azurewebsites.net/';
const probate = "http://localhost:7071/api/";
const loginUser = "Demo@dpssoftware.onmicrosoft.com";
const civil = "https://spttest.azurewebsites.net/apiv3/api/";


const tenantId = "ae771e34-6384-4a82-8de8-3ad0ed23e56e";
const databaseId = "9fd3e9a3-44ab-4448-85ff-52797232e7b5"; // dev 6914311b-f0bc-4978-b123-213938dd83b1 // test 5cb0c9a3-4daf-4cd4-8ca9-0f88ec80b04c

const PROXY_CONFIG = {

  "/v2serviceBase": {
    "target": v2BaseUrl,
    "logLevel": "debug",
    "secure": false,
    "changeOrigin": !v2BaseUrl.match("localhost"),
    "pathRewrite": {
      "^/v2serviceBase": ""
    }
  },


  "/v2serviceBase2": {
    "target": v2BaseUrl2,
    "logLevel": "debug",
    "secure": false,
    "changeOrigin": !v2BaseUrl2.match("localhost"),
    "pathRewrite": {
      "^/v2serviceBase2": ""
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
    "changeOrigin": !workflowStreamingUrl.match("localhost"),
  },

  "/crime/v1/": {
    "target": crime,
    "secure": false,
    "changeOrigin": !crime.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/crime/v1/": ""
    }
  },
  "/probate/v1/": {
    "target": probate,
    "secure": false,
    "changeOrigin": !probate.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/probate/v1/": ""
    }
  },
  "/solicitor/v1/": {
    "target": solicitor,
    "secure": false,
    "changeOrigin": !solicitor.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/solicitor/v1/": !solicitor.match("localhost") ? "/solicitor/v1/" : ""
    }
  },
  "/teamTalk/v1": {
    "target": teamTalk,
    "secure": false,
    "changeOrigin": !teamTalk.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      req.headers["X-DPS-LoginUser"] = loginUser;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/teamTalk/v1": !teamTalk.match("localhost") ? "/teamTalk/v1" : ""
    }
  },
  "/workflow/v1": {
    "target": workflow,
    "secure": false,
    "changeOrigin": !workflow.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/workflow/v1": !workflow.match("localhost") ? "/workflow/v1" : ""
    }
  },
  "/diary/v1": {
    "target": diary,
    "secure": false,
    "changeOrigin": !diary.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/diary/v1": !diary.match("localhost") ? "/diary/v1" : ""
    }
  },
  "/document-handler/v1": {
    "target": documentHandler,
    "secure": false,
    "changeOrigin": !documentHandler.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/document-handler/v1": !documentHandler.match("localhost") ? "document-handler/v1" : ""
    }
  },
  "/inbox/v1": {
    "target": inbox,
    "secure": false,
    "changeOrigin": !inbox.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/inbox/v1": !crime.match("localhost") ? "/inbox/v1" : ""
    }
  },
  "/opportunity/v1": {
    "target": opportunity,
    "secure": false,
    "changeOrigin": !opportunity.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      req.headers["X-DPS-LoginUser"] = loginUser;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/opportunity/v1": !crime.match("localhost") ? "/opportunity/v1" : ""
    }
  },
  "/fileserver/v1": {
    "target": fileserver,
    "secure": false,
    "changeOrigin": !fileserver.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/fileserver/v1": !crime.match("localhost") ? "/fileserver/v1" : ""
    }
  },
  "/precidentH/v1": {
    "target": precidentH,
    "secure": false,
    "changeOrigin": !precidentH.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/precidentH/v1": !crime.match("localhost") ? "/precidentH/v1" : ""
    }
  },
  "/safebox/v1": {
    "target": safebox,
    "secure": false,
    "changeOrigin": !safebox.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/safebox/v1": !crime.match("localhost") ? "/safebox/v1" : ""
    }
  },


  "/documentHandler-proxy/v1": {
    "target": documentHandlerProxy,
    "secure": false,
    "changeOrigin": !documentHandlerProxy.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "documentHandler-proxy/v1": "document-handler/v1"
    }
  },
  "/durable-proxy/v1": {
    "target": durableProxy,
    "secure": false,
    "changeOrigin": !durableProxy.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/durable-proxy/v1": !durableProxy.match("localhost") ? "/durable-proxy/v1" : ""
    }
  },
  "/storage-proxy/v1": {
    "target": storageProxy,
    "secure": false,
    "changeOrigin": !storageProxy.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/storage-proxy/v1": !storageProxy.match("localhost") ? "/storage-proxy/v1" : ""
    }
  },
  "/civil/v1": {
    "target": civil,
    "secure": false,
    "changeOrigin": !civil.match("localhost"),
    "bypass": function (req, res, proxyOptions) {
      req.headers["X-DPS-TenantId"] = tenantId;
      req.headers["X-DPS-LoginUser"] = loginUser;
      if (!req.headers["X-DPS-DatabaseId"]) {
        req.headers["X-DPS-DatabaseId"] = databaseId;
      }
    },
    "pathRewrite": {
      "^/civil/v1": !civil.match("localhost") ? "/civil/v1" : ""
    }
  },

};

console.log("PROXY_CONFIG");
console.log(PROXY_CONFIG);

module.exports = PROXY_CONFIG;
