import React, { Component } from 'react';
import axios from 'axios';
import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import LayerGroup from 'ol/layer/Group';
import LayerTile from 'ol/layer/Tile';
import SourceOSM from 'ol/source/OSM';
import SourceStamen from 'ol/source/Stamen';
import GeoJSON from 'ol/format/GeoJSON';
import {fromLonLat} from 'ol/proj'
import LayerSwitcher from 'ol-layerswitcher';
import {MultiPoint, Point} from 'ol/geom.js'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

const position = [44.49381, 11.33875]
const bolognaLonLat = [8.63238, 39.7475];
const bolognaWebMercator = fromLonLat(bolognaLonLat);

class MapPage extends Component {
  constructor() {
    super();
    // Initialize the state, in which fetched data will be saved
    this.state = {
      item: null
    }
  }

  addJSON(jsonItem) {
    //console.log(response)
    this.setState({ item: jsonItem })
  }

  async componentDidMount() {
    var fetchedJSON
    // Retrieve JWT Token from Local Storage
    var jwtToken = localStorage.getItem('jwt-token');
    // Printing JWT Token to console
    console.log(jwtToken);
    // Concat the JWT Token to use it in the Authorization header
    const AuthStr = 'Token '.concat(jwtToken);
    // Axios get request
    fetchedJSON = await axios.get('http://localhost:4000/api/assets/json',
      // Authentication header with JWT Token
      { headers: { Authorization: AuthStr }
    });

    // Add the fetched JSON to the state
    this.addJSON(fetchedJSON.data)

    // Creating a new map
    var map = new Map({
        target: 'map',
        layers: [
            new LayerGroup({
                'title': 'Base maps',
                layers: [
                    new LayerGroup({
                        title: 'Water color with labels',
                        type: 'base',
                        combine: true,
                        visible: false,
                        layers: [
                            new LayerTile({
                                source: new SourceStamen({
                                    layer: 'watercolor'
                                })
                            }),
                            new LayerTile({
                                source: new SourceStamen({
                                    layer: 'terrain-labels'
                                })
                            })
                        ]
                    }),
                    new LayerTile({
                        title: 'Water color',
                        type: 'base',
                        visible: false,
                        source: new SourceStamen({
                            layer: 'watercolor'
                        })
                    }),
                    new LayerTile({
                        title: 'OSM',
                        type: 'base',
                        visible: true,
                        source: new SourceOSM()
                    })
                ]
            }),
        ],
        view: new View({
            center: bolognaWebMercator,
            zoom: 15
        })
    });

    // Adding the fetched json to a source layer
    var sourceLayer = new VectorSource({
      // reading all the GeoJSON features
      features: (new GeoJSON()).readFeatures(
        this.state.item, {
           // Change the default projection
           featureProjection: 'EPSG:3857'
         }),
    });

    // Adding the source layer to a vector layer
    var vectorLayer = new VectorLayer({
      title: 'Vineyard Sensors',
      source: sourceLayer,
      params: {'LAYERS': 'show:0'}
    });

    // Adding the vector layer to the map
    map.addLayer(vectorLayer);

    // Adding the layer switcher
    var layerSwitcher = new LayerSwitcher();
    map.addControl(layerSwitcher);

    // Retrieves the user position
    navigator.geolocation.getCurrentPosition(function(pos) {
      // Saving fetched coordinates
      const coords = fromLonLat([
        pos.coords.longitude,
        pos.coords.latitude
      ]);
      // Setting the center with the user coordinates
      map.getView().animate({center: coords, zoom: 15});
    });
  }

  render() {
    return(
      // Map div
      <div id="map">
      </div>
    );
  }
}

export default MapPage;
