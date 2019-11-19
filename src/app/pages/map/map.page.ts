// Components, functions, plugins
import { Component, NgModule, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet/dist';
import { RouterEvent, Router } from '@angular/router';

import * as L from "leaflet";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPage {

	// Leaflet mapping variables
	// Currently supports up to 10 maps
	myMap2: any;
	myMap3: any;
	myMap4: any;
	myMap5: any;
	myMap6: any;
	myMap7: any;
	myMap8: any;
	myMap9: any;
	myMap10: any;
	router: any;
	SelectedPath: string;
	
	// Accordian expansion IDs
	Level1: boolean = false;
	Level2: boolean = false;
	Level3: boolean = false;
	Level4: boolean = false;
	Level5: boolean = false;
	Level6: boolean = false;
	Level7: boolean = false;
	

	constructor(public navCtrl: NavController, 
				public platform: Platform, 
				) {
			
	}


	ngOnInit() {
		
	}

	expandItem(MapLevel) {
		
		// Determine what to do with click event

		// If accordian is already open
		if (this[MapLevel] == true) {

			// Hide current, already open map
			this[MapLevel] = false;

		} else {
			
			// Otherwise
			
			// Set all accordians to false (closed)
			this.Level1 = false;
			this.Level2 = false;
			this.Level3 = false;
			this.Level4 = false;
			this.Level5 = false;
			this.Level6 = false;
			this.Level7 = false;
			
			// Open and load selected map
			this.LoadMapData(MapLevel);
		
		}		
	}	

	LoadMapData(MapLevel) {
		
		// -----------------
		// Map 1
		// -----------------
		if (MapLevel == 'Level1') {
			
			// Remove map if previously initialized
			// to prevent duplicate error
			if (this.myMap3 && this.myMap3.remove) {
				this.myMap3.off();
				this.myMap3.remove();
			}

			// Load map data
			this.myMap3 = L.map('mapLevel3', {
				crs: L.CRS.Simple,
				minZoom: -1,
				maxZoom: 1,
				zoomControl: true
			});

			var bounds3 = L.latLngBounds([0, 0], [1500, 1000]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
			var image3 = L.imageOverlay('assets/img/level1m.png', bounds3, {
				attribution: 'Convergence'
			}).addTo(this.myMap3);

			this.myMap3.fitBounds(bounds3);
			this.myMap3.setMaxBounds(bounds3);
			
			// Expand window
			this.Level1 = true;

			// Set timeout to recenter map (Ionic 4 issue workaround)
			setTimeout(() => {
				this.myMap3.invalidateSize();
			}, 400);
			
		}

		// -----------------
		// Map 2
		// -----------------
		if (MapLevel == 'Level2') {
			
			// Remove map if previously initialized
			// to prevent duplicate error
			if (this.myMap4 && this.myMap4.remove) {
				this.myMap4.off();
				this.myMap4.remove();
			}

			// Load map data
			this.myMap4 = L.map('mapLevel4', {
				crs: L.CRS.Simple,
				minZoom: -1,
				maxZoom: 1,
				zoomControl: true
			});

			var bounds4 = L.latLngBounds([0, 0], [1000, 1000]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
			var image4 = L.imageOverlay('assets/img/level2.png', bounds4, {
				attribution: 'Convergence'
			}).addTo(this.myMap4);

			this.myMap4.fitBounds(bounds4);
			this.myMap4.setMaxBounds(bounds4);

			// Expand window
			this.Level2 = true;

			// Set timeout to recenter map (Ionic 4 issue workaround)
			setTimeout(() => {
				this.myMap4.invalidateSize();
			}, 400);
			
		}


		// -----------------
		// Map 3
		// -----------------
		if (MapLevel == 'Level3') {

			// Remove map if previously initialized
			// to prevent duplicate error
			if (this.myMap2 && this.myMap2.remove) {
				this.myMap2.off();
				this.myMap2.remove();
			}

			// Load map data
			this.myMap2 = L.map('mapLevel2', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 2,
			zoomControl: true
		});

		var bounds2 = L.latLngBounds([0, 0], [1000, 1400]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image2 = L.imageOverlay('assets/img/level3.png', bounds2, {
			attribution: 'Convergence'
		}).addTo(this.myMap2);

		this.myMap2.fitBounds(bounds2);
		this.myMap2.setMaxBounds(bounds2);

			// Expand window
			this.Level3 = true;

			// Set timeout to recenter map (Ionic 4 issue workaround)
			setTimeout(() => {
				this.myMap2.invalidateSize();
			}, 400);
			
		}


		// -----------------
		// Map 4
		// -----------------
		if (MapLevel == 'Level4') {

				// Remove map if previously initialized
			// to prevent duplicate error
			if (this.myMap6 && this.myMap6.remove) {
				this.myMap6.off();
				this.myMap6.remove();
			}

			// Load map data
		this.myMap6 = L.map('mapLevel6', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 1,
			zoomControl: true
		});

		var bounds6 = L.latLngBounds([0, 0], [1500, 1200]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image6 = L.imageOverlay('assets/img/level4.png', bounds6, {
			attribution: 'Convergence'
		}).addTo(this.myMap6);

		this.myMap6.fitBounds(bounds6);
		this.myMap6.setMaxBounds(bounds6);

		// Expand window
		this.Level4 = true;

		// Set timeout to recenter map (Ionic 4 issue workaround)
		setTimeout(() => {
			this.myMap6.invalidateSize();
		}, 400);
		
	}


		// -----------------
		// Map 5
		// -----------------
		if (MapLevel == 'Level5') {

				// Remove map if previously initialized
			// to prevent duplicate error
			if (this.myMap5 && this.myMap5.remove) {
				this.myMap5.off();
				this.myMap5.remove();
			}

			// Load map data
		this.myMap5 = L.map('mapLevel5', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 1,
			zoomControl: true
		});

		var bounds5 = L.latLngBounds([0, 0], [1400, 1000]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image5 = L.imageOverlay('assets/img/level3m.png', bounds5, {
			attribution: 'Convergence'
		}).addTo(this.myMap5);

		this.myMap5.fitBounds(bounds5);
		this.myMap5.setMaxBounds(bounds5);

		// Expand window
		this.Level5 = true;

		// Set timeout to recenter map (Ionic 4 issue workaround)
		setTimeout(() => {
			this.myMap5.invalidateSize();
		}, 400);
		
	}

		// -----------------
		// Map 6
		// -----------------
		if (MapLevel == 'Level6') {

					// Remove map if previously initialized
			// to prevent duplicate error
			if (this.myMap7 && this.myMap7.remove) {
				this.myMap7.off();
				this.myMap7.remove();
			}

			// Load map data
		this.myMap7 = L.map('mapLevel7', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 1,
			zoomControl: true
		});

		var bounds7 = L.latLngBounds([0, 0], [1500, 1200]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image7 = L.imageOverlay('assets/img/floorplanall.png', bounds7, {
			attribution: 'Convergence'
		}).addTo(this.myMap7);

		this.myMap7.fitBounds(bounds7);
		this.myMap7.setMaxBounds(bounds7);

				// Expand window
				this.Level6 = true;

				// Set timeout to recenter map (Ionic 4 issue workaround)
				setTimeout(() => {
					this.myMap7.invalidateSize();
				}, 400);
				
			}
		

		// -----------------
		// Map 7
		// -----------------
		if (MapLevel == 'Level7') {

					// Remove map if previously initialized
			// to prevent duplicate error
			if (this.myMap8 && this.myMap8.remove) {
				this.myMap8.off();
				this.myMap8.remove();
			}

			// Load map data
		this.myMap8 = L.map('mapLevel8', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 1,
			zoomControl: true
		});

		var bounds8 = L.latLngBounds([0, 0], [1500, 1200]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image8 = L.imageOverlay('assets/img/hotels.png', bounds8, {
			attribution: 'Convergence'
		}).addTo(this.myMap8);

		this.myMap8.fitBounds(bounds8);
		this.myMap8.setMaxBounds(bounds8);

				// Expand window
				this.Level7 = true;

				// Set timeout to recenter map (Ionic 4 issue workaround)
				setTimeout(() => {
					this.myMap8.invalidateSize();
				}, 400);
				
			}


	/*
		// -----------------
		// Map 8
		// -----------------
		this.myMap9 = L.map('mapLevel9', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 1,
			zoomControl: true
		});

		var bounds9 = L.latLngBounds([0, 0], [1500, 1200]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image9 = L.imageOverlay('assets/img/level4.png', bounds9, {
			attribution: 'Convergence'
		}).addTo(this.myMap9);

		this.myMap9.fitBounds(bounds9);
		this.myMap9.setMaxBounds(bounds9);

		*/

	}
}
