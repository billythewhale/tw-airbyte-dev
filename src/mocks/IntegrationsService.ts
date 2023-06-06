// mock credentials database
const IntegrationDatabase = {
  "2efc0892-627e-453e-84bc-352cf26cc69f": {
    credentials: {
      username: "mjweaver01",
      password: "password",
      oauth_access_token: "ada5c21f-cbba-49c1-9308-f817762fc200",
    },
  },

  "a1de967f-ce2a-4c87-9ff2-2f5a126a8693": {
    credentials: {
      username: "afiles01",
      password: "drowssap",
      oauth_access_token: "496ea5c2-e461-4608-a30a-d02289fe1a19",
    },
  },
};

// mock credentials service
const IntegrationService = {
  getCredentials: (token?: string) => {
    return new Promise((res) => setTimeout(res, 2000)).then(() => {
      const res = IntegrationDatabase[token];
      if (!res) {
        throw new Error("Invalid token");
      }

      return res;
    });
  },
};

export default IntegrationService;
