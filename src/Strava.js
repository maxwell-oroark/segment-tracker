class Strava {
  constructor() {
    this.token = localStorage.getItem("strava_access_token");
    this.refreshToken = localStorage.getItem("strava_refresh_token");
    this.expiredAt = localStorage.getItem("expires_at");
  }

  async getCurrentToken() {
    if (this.expiredAt > Date.now()) {
      console.log("not expired - fetching out of local storage");
      return this.token;
    } else {
      console.log("fetching new token");
      const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
          client_id: "<client_id>",
          client_secret: "<client_secret>",
        }),
      }).then((res) => res.json());
      this.saveTokens(response.access_token, response.refresh_token);
      return response.access_token;
    }
  }

  async smartFetch(url, options) {
    const token = await this.getCurrentToken();
    return fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  }

  saveTokens(accessToken, refreshToken) {
    if (!accessToken || !refreshToken) {
      console.warn("do NOT call saveTokens() without token arguments");
    } else {
      const expiration = Date.now() + 5 * 60 * 60 * 1000; // 5 hours
      localStorage.setItem("expires_at", expiration);
      localStorage.setItem("strava_access_token", accessToken);
      localStorage.setItem("strava_refresh_token", refreshToken);
    }
  }

  async fetchAthlete() {
    return this.smartFetch("https://www.strava.com/api/v3/athlete", {
      method: "GET",
    });
  }

  async fetchSegments() {
    return this.smartFetchfetch(
      "https://www.strava.com/api/v3/segments/starred",
      {
        method: "GET",
      }
    );
  }
}

export default Strava;
