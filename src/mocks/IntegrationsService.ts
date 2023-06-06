const cachedServices = {} as any;

// mock credentials service
const IntegrationService = {
  getCredentials: (token?: string) => {
    return new Promise((res) => setTimeout(res, 2000)).then(() => {
      const res = {
        username: "mjweaver01",
        email: "michael@triplewhale.com",
        key: "1234567890",
        token: token ?? Math.random().toString().replace(".", ""),
      };

      cachedServices[res.token] = res;

      return res;
    });
  },
};

export default IntegrationService;
