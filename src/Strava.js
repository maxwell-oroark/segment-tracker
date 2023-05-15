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
      const response = await fetch(
        "https://us-central1-segment-tracker.cloudfunctions.net/refresh_token_proxy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: this.refreshToken,
          }),
        }
      ).then((res) => res.json());
      console.log(response);
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
      console.warn("do NOT call saveTokens() without valid token arguments");
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
    try {
      console.log("fetching full segments from strava...");
      const segments = await this.fetchSegmentsCompact();
      const segmentsDetail = await Promise.all(
        segments.map(async (segment) => {
          const segmentDetail = await this.fetchSegmentDetails(segment.id);
          return segmentDetail;
        })
      );
      return segmentsDetail;
    } catch (err) {
      console.warn("something went wrong while attempting to sync segments");
      console.error(err);
    }
  }

  async fetchSegmentsCompact() {
    const PER_PAGE = 100;
    const segments = [];
    // fetch maximum 1000 segments for now
    for (let i = 1; i < 10; i++) {
      let url = `https://www.strava.com/api/v3/segments/starred?page=${i}&per_page=${PER_PAGE}`;
      const chunk = await this.smartFetch(url);
      segments.push(...chunk);
      if (chunk.length < PER_PAGE) {
        // we have reached the last page of segments
        // so we stop querying
        break;
      }
    }
    return segments;
  }

  async fetchSegmentDetails(segmentId) {
    const url = `https://www.strava.com/api/v3/segments/${segmentId}`;
    return this.smartFetch(url);
  }
}

export default Strava;
