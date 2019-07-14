import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import Thermometer from "react-thermometer-component";
import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import ReactDOM from 'react-dom';
import LiquidFillGauge from 'react-liquid-gauge';
import on from '../images/acceso.png';
import off from '../images/spento.png';
import grafana from '../images/grafana-logo.png';
var request = require('request');


const imagesPath = {
  minus: off,
  plus: on
}

class SensorPage extends Component {
    constructor() {
        super();
        this.state = {
            open: true,
            response: 0,
            endpoint: "http://127.0.0.1:8080",
            value: 50,
            fruit_color: null
        };
    }

    toggleImage = () => {

      this.setState(state => ({ open: !state.open }))

      var options = {
          url: 'http://localhost:4000/api/assets/pump',
          method: 'GET',
      };

      function callback(error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log(body);
          }
      }

      request(options, callback);

    }

    getImageName = () => this.state.open ? 'plus' : 'minus'

    componentDidMount() {
      this.temperatureReceiver();
      this.soilMoistureReceiver();
    }

    temperatureReceiver() {
      const { endpoint } = this.state;
      //Very simply connect to the socket
      const socket = socketIOClient(endpoint);
      //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
      socket.on("outgoing data", data => this.setState({response: data}));
    }

    soilMoistureReceiver() {
      const { endpoint } = this.state;
      //Very simply connect to the socket
      const socket = socketIOClient(endpoint);
      //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
      socket.on("outgoing data soil", data => this.setState({value: data}));
    }

    render() {
        const imageName = this.getImageName();
        const radius = 200;
        const interpolate = interpolateRgb(this.startColor, this.endColor);
        var startColor = '#6495ed'; // cornflowerblue
        var endColor = '#dc143c'; // crimson
        const gradientStops = [
            {
                key: '0%',
                stopColor: color(startColor).darker(0.5).toString(),
                stopOpacity: 1,
                offset: '0%'
            },
            {
                key: '50%',
                stopColor: startColor,
                stopOpacity: 0.75,
                offset: '50%'
            },
            {
                key: '100%',
                stopColor: color(startColor).brighter(0.5).toString(),
                stopOpacity: 0.5,
                offset: '100%'
            }
        ];

        return (
          <div className="container">
            <div className="row">
              <div className="col-sm-6 mb-3 mb-md-0">
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title">Temperature Sensor</h2>
                    <center>
                    <Thermometer
                      theme="dark"
                      value={this.state.response}
                      max="100"
                      steps="0"
                      format=""
                      size="small"
                      height="200"
                    />
                    </center>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 mb-md-0">
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title">Water Pump</h2>
                      <center>
                      <img width="104" height="104" src={imagesPath[imageName]} onClick={this.toggleImage} />
                      </center>
                      <br/>
                      <div className="alert alert-info" role="alert">
                        Click on the icon to turn on/off the water pump!
                      </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 mb-md-0">
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title">Soil Moisture</h2>
                    <LiquidFillGauge
                        style={{ margin: '0 auto' }}
                        width={180}
                        height={180}
                        value={this.state.value}
                        percent="%"
                        textSize={1}
                        textOffsetX={0}
                        textOffsetY={0}
                        textRenderer={(props) => {
                            const value = Math.round(props.value);
                            const radius = Math.min(props.height / 2, props.width / 2);
                            const textPixels = (props.textSize * radius / 2);
                            const valueStyle = {
                                fontSize: textPixels
                            };
                            const percentStyle = {
                                fontSize: textPixels * 0.6
                            };

                            return (
                                <tspan>
                                    <tspan className="value" style={valueStyle}>{value}</tspan>
                                    <tspan style={percentStyle}>{props.percent}</tspan>
                                </tspan>
                            );
                        }}
                        riseAnimation
                        waveAnimation
                        waveFrequency={2}
                        waveAmplitude={1}
                        gradient
                        gradientStops={gradientStops}
                        circleStyle={{
                            fill: startColor
                        }}
                        waveStyle={{
                            fill: startColor
                        }}
                        textStyle={{
                            fill: color('#444').toString(),
                            fontFamily: 'Arial'
                        }}
                        waveTextStyle={{
                            fill: color('#fff').toString(),
                            fontFamily: 'Arial'
                        }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 mb-md-0">
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title">Graphs and Predictions</h2>
                    <center>
                    <img width="" height="80" src={grafana} />
                    <br />
                    <br />
                    <div>
                    <a href="http://localhost:3000/d/3QnAfZWWz/holt-winters?orgId=1" className="btn btn-primary">Display</a>
                    </div>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default SensorPage;
