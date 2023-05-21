import React, { useEffect, useState, useMemo } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import {
  lineLayer,
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "./layers";
import { featureCollection } from "@turf/helpers";
import Segment from "./models/Segment";
import { useStoreDispatch } from "./store/StoreContext";

function MapComponent({ active, segments }) {
  const map = React.useRef();
  const dispatch = useStoreDispatch();

  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeFeature, setActiveFeature] = useState(active.data);
  const segmentsGeojson = useMemo(() => {
    if (segments.data) {
      console.log("recalc geojson feature collection");
      return featureCollection(
        segments.data.map((s) => new Segment(s).getCentroid())
      );
    } else {
      return null;
    }
  }, [segments.data]);

  useEffect(() => {
    if (map) {
      console.log("setting map ref...");
      dispatch({ type: "SET_MAP_REF", payload: map });
    }
  }, [map]);

  return (
    <div style={{ height: "450px" }}>
      <Map
        ref={map}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        style={{ width: "100%", height: "450px" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken="pk.eyJ1IjoibWF4d2VsbG8iLCJhIjoiY2xobWR0cXc3MWFsODNxbzNmZW1ycjl5YyJ9.wi7NOlHfj0CuevTx9FvEyg"
        interactiveLayerIds={["unclustered-point"]}
        onMouseMove={(event) => {
          if (event && event.features && event.features[0]) {
            setHoveredFeature({
              longitude: event.lngLat.lng,
              latitude: event.lngLat.lat,
              ...event.features[0],
            });
          } else {
            setHoveredFeature(null);
          }
        }}
        onClick={(event) => {
          if (event && event.features && event.features[0]) {
            const segment = segments.data.find(
              (s) => s.segment_id === event.features[0].properties.segment_id
            );
            dispatch({ type: "UPDATE_ACTIVE_SEGMENT", payload: segment });
          }
        }}
      >
        {active.data ? (
          <Source
            key={active.data.id}
            type="geojson"
            data={active.data.geojson}
          >
            <Layer id={active.data.id} {...lineLayer} />
          </Source>
        ) : (
          <Source
            id="segments"
            type="geojson"
            data={segmentsGeojson}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        )}
        {hoveredFeature && (
          <Popup
            latitude={hoveredFeature.latitude}
            longitude={hoveredFeature.longitude}
            onClose={() => setHoveredFeature(null)}
          >
            {hoveredFeature.properties.name}
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default MapComponent;
