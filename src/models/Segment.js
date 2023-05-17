import mapboxgl from "mapbox-gl";
import polyline from "@mapbox/polyline";
import { latLngToCell } from "h3-js";
import { point } from "@turf/helpers";
import bearing from "@turf/bearing";

// 5 = very fuzzy, 6 = fuzzy, 7 very precise 1:1 with rtma pixel resolution
const SPATIAL_RESOLUTION = 5;

class Segment {
  constructor(segment, userId) {
    this.segment_id = segment.id;
    this.user_id = userId;
    this.name = segment.name;
    this.bearing = segment.bearing;
    this.activity_type = segment.activity_type;
    this.start_latlng = segment.start_latlng;
    this.end_latlng = segment.end_latlng;
    this.star_count = segment.star_count;
    this.distance = segment.distance;
    this.city = segment.city;
    this.state = segment.state;
    this.country = segment.country;
    this.effort_count = segment.effort_count;
    this.athlete_count = segment.athlete_count;
    this.attempts =
      segment.attempts || segment?.athlete_segment_stats?.effort_count;
    this.pr = segment.pr || segment?.athlete_segment_stats?.pr_elapsed_time;
    this.pr_date = segment.pr_date || segment?.athlete_segment_stats?.pr_date;
    this.polyline = segment.polyline || segment.map.polyline;
    this.geojson = segment.geojson || null;
    this.centroid = segment.centroid || null;
    this.bbox = segment.bbox || null;
    this.h3 = segment.h3 || null;
  }

  computeBbox(start, end) {
    // need to flip coordinates for mapbox/turfJS methods
    const [lat1, lng1] = start;
    const [lat2, lng2] = end;
    try {
      return new mapboxgl.LngLatBounds([lng1, lat1], [lng2, lat2]).toArray();
    } catch (err) {
      console.warn("could not calculate bbox for segment");
      console.error(err);
      return null;
    }
  }

  computeBearing(start, end) {
    // need to flip coordinates for mapbox/turfJS methods
    const [lat1, lng1] = start;
    const [lat2, lng2] = end;
    try {
      const pointA = point([lng1, lat1]);
      const pointB = point([lng2, lat2]);
      return bearing(pointA, pointB);
    } catch (err) {
      console.warn("could not calculate bearing for segment");
      console.error(err);
      return null;
    }
  }

  computeCentroid(start, end) {
    const [lat1, lng1] = start;
    const [lat2, lng2] = end;
    try {
      return new mapboxgl.LngLatBounds([lng1, lat1], [lng2, lat2])
        .getCenter()
        .toArray();
    } catch (err) {
      console.warn("could not calculate centroid from bbox");
      console.error(err);
      return null;
    }
  }

  computeGeojson(pl) {
    try {
      return polyline.toGeoJSON(pl);
    } catch (err) {
      console.warn("could not derive geojson from polyline for segment");
      console.error(err);
      return null;
    }
  }

  computeH3(latlng) {
    try {
      return latLngToCell(latlng[0], latlng[1], SPATIAL_RESOLUTION);
    } catch (err) {
      console.warn("could not derive h3 hex from lat/lng");
      console.error(err);
      return null;
    }
  }

  getCentroid() {
    if (this.centroid) {
      return point(this.centroid);
    } else {
      console.warn("no centroid exists on this segment");
      return null;
    }
  }

  serialize() {
    const obj = {
      segment_id: this.segment_id,
      user_id: this.user_id,
      name: this.name,
      start_latlng: this.start_latlng,
      end_latlng: this.end_latlng,
      star_count: this.star_count,
      distance: this.distance,
      activity_type: this.activity_type,
      city: this.city,
      state: this.state,
      country: this.country,
      effort_count: this.effort_count,
      athlete_count: this.athlete_count,
      attempts: this.attempts,
      pr: this.pr,
      pr_date: this.pr_date,
      polyline: this.polyline,
      centroid: this.centroid,
    };
    if (this.start_latlng && this.end_latlng && !this.bbox) {
      obj["bbox"] = this.computeBbox(this.start_latlng, this.end_latlng);
    }
    if (this.start_latlng && this.end_latlng && !this.bearing) {
      obj["bearing"] = this.computeBearing(this.start_latlng, this.end_latlng);
    }
    if (this.polyline && !this.geojson) {
      obj["geojson"] = this.computeGeojson(this.polyline);
    }
    if (this.start_latlng && this.end_latlng && !this.centroid) {
      obj["centroid"] = this.computeCentroid(
        this.start_latlng,
        this.end_latlng
      );
    }
    if (obj.centroid && !this.h3) {
      obj["h3"] = this.computeH3(obj.centroid);
    }

    return obj;
  }
}

export default Segment;
