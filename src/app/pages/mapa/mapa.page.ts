import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var mapboxgl:any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit , AfterViewInit{

    lat:number;
    lng:number;

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
      
      let geo = this.route.snapshot.paramMap.get('geo');

      geo=geo.substr(4);

      let geoo = geo.split(',');

      this.lat= Number(geoo[0]);
      this.lng=Number( geoo[1]);
      console.log(this.lat +' '+ this.lng);
      
  }

  ngAfterViewInit(){
    
     mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybHMwNiIsImEiOiJja2NqbGt4M2wwMjQ5MnR0ODh5NDNxeXhhIn0.CDdw78V0jJjzBNwkduTe7Q';
     var map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        center: [this.lng, this.lat],
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
        container: 'map',
        antialias: true
    });
    //marcador
    var marker = new mapboxgl.Marker()
    .setLngLat([this.lng, this.lat])
    .addTo(map);
//cargar los edificios
    map.on('load', ()=> {
        map.resize();
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        map.addLayer(
            {
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#aaa',

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            },
            labelLayerId
        );
    });

    
  }

}
