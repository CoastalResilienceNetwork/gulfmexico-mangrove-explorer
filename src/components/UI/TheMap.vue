<template>
  <div id="map">
    <div id="supportingLayers" v-if="$store.state.config.supportingLayersOnMap">
      <SupportingLayers displayClass="supportingLayersMap" />
    </div>
    <div id="legendContainer" style="width: 20vw; display: flex; margin: 0px !important"></div>
    <div
      id="socialContainer"
      style="width: 68%; height: 40%; border: 5px grey solid; border-radius: 2px"
    >
      <img
        v-if="
          this.socialSelection ==
          'What do people think is driving mangrove change in expansion areas?'
        "
        src="../../assets/surveyQ1.jpg"
        height="100%"
        width="100%"
        style="margin-top: auto; margin-bottom: auto; display: block"
      />
      <img
        v-if="
          this.socialSelection ==
          'What actions do people think need to be taken for mangroves in expansion areas?'
        "
        src="../../assets/SurveyQ2.jpg"
        height="100%"
        width="100%"
        style="margin-top: auto; margin-bottom: auto; display: block"
      />
      <!-- <q-btn
        width="100px"
        height="100px"
        color="red"
        style="float: right; position: absolute; bottom: 5px; right: 5px; border-radius: 0px"
        icon-right="fas fa-arrow-right"
        label="1 of 5"
      > -->
      <!-- </q-btn> -->
    </div>
  </div>
</template>

<script>
import SupportingLayers from '../AppTools/SupportingLayers.vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import Legend from '@arcgis/core/widgets/Legend'
import Measurement from '@arcgis/core/widgets/Measurement'
import Expand from '@arcgis/core/widgets/Expand'
//import PortalSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
import Portal from '@arcgis/core/portal/Portal'
import PortalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource'
import esriRequest from '@arcgis/core/request'

//global in order to have access to the maplayer
let esri = {
  mapView: '',
  modelLayer: '',
  supportingMapLayer: '',
  legend: '',
  map: '',
  measurement: '',
  lgExpand: '',
  mapImageLayer: '',
  socialExpand: '',
  socialContent: {
    title: '',
    imageSrc: '',
    description: ''
  }
}

export default {
  name: 'TheMap',
  components: {
    SupportingLayers
  },
  data() {
    return {
      active: true,
      previousMangroveLayer: 6,
      previousClimaticLayer: '',
      intensity: '',
      subLegendInfo: false,
      lastSocial: '',
      testwords: false
    }
  },
  computed: {
    supportingMapVisibleLayers() {
      //returns list of all ticked objects [{mapService: index in config, id: layerid, type: type}, ...]
      return this.$store.state.tree.tickedObj
    },
    supportingVisibleLayerOpacity() {
      //returns object {value: OpacVal, id: Layerid}
      return this.$store.state.supportingVisibleLayerOpacity
    },
    mangroveLayer: {
      get() {
        return this.$store.state.mangroveLayer
      },
      set(value) {
        this.$store.commit('updateMangroveLayer', value)
      }
    },
    layerOption: {
      get() {
        return this.$store.state.layerOption
      },
      set(value) {
        this.$store.commit('updateLayerOption', value)
      }
    },
    layerSelection: {
      get() {
        return this.$store.state.layerSelection
      },
      set(value) {
        this.$store.commit('updateLayerSelection', value)
      }
    },
    climaticSelection: {
      get() {
        return this.$store.state.climaticSelection
      },
      set(value) {
        this.$store.commit('updateClimaticSelection', value)
      }
    },
    supportingSelection: {
      get() {
        return this.$store.state.supportingSelection
      },
      set(value) {
        this.$store.commit('updateSupportingSelection', value)
      }
    },
    socialSelection: {
      get() {
        return this.$store.state.socialSelection
      },
      set(value) {
        this.$store.commit('updateSocialSelection', value)
      }
    },
    subSocialSelection: {
      get() {
        return this.$store.state.subSocialSelection
      },
      set(value) {
        this.$store.commit('updateSubSocialSelection', value)
      }
    },
    sliderValue: {
      get() {
        return this.$store.state.sliderValue
      },
      set(value) {
        this.$store.commit('updateSliderValue', value)
      }
    },
    tabSupLayers: {
      get() {
        return this.$store.state.tabSupLayers
      },
      set(value) {
        this.$store.commit('updateTabSupLayers', value)
      }
    },
    selectedOption: {
      get() {
        return this.$store.state.selectedOption
      },
      set(value) {
        this.$store.commit('updateSelectedOption', value)
      }
    },
    supportingOption: {
      get() {
        return this.$store.state.supportingOption
      },
      set(value) {
        this.$store.commit('updateSupportingOption', value)
      }
    },
    supportingOptions: {
      get() {
        return this.$store.state.supportingOptions
      },
      set(value) {
        this.$store.commit('updateSupportingOptions', value)
      }
    },
    supportOpacity: {
      get() {
        return this.$store.state.supportOpacity
      },
      set(value) {
        this.$store.commit('updateSupportOpacity', value)
      }
    },
    opacityLayerId() {
      return this.$store.state.opacityLayerId
    },
    layerDescriptions: {
      get() {
        return this.$store.state.layerDescriptions
      },
      set(value) {
        this.$store.commit('updateLayerDescriptions', value)
      }
    },
    descriptionsComplete() {
      return this.$store.state.descriptionsComplete
    },
    mapLoaded: {
      get() {
        return this.$store.state.mapLoaded
      },
      set(value) {
        this.$store.commit('updateMapLoaded', value)
      }
    }
  },
  watch: {
    supportingMapVisibleLayers() {
      this.updateSupportingVisibility()
    },
    supportingVisibleLayerOpacity() {
      this.updateSupportingOpacity()
    },
    layerOption() {
      this.changeMangroveLayers()
    },
    supportingOption() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.slider == 'support') {
          if (this.supportingOption.includes(layer.title) == true) {
            layer.visible = true
          } else {
            layer.visible = false
          }
        }
      })
    },
    // mangroveLayer() {
    //   if (this.mangroveLayer == 'Current') {
    //     if (this.layerOption !== []) {
    //       this.manageLayerVis(this.layerOption, this.supportingOption)
    //     }
    //   } else if (this.mangroveLayer == 'Moderate') {
    //     if (this.layerOption !== []) {
    //       this.manageLayerVis(this.layerOption, this.supportingOption)
    //     }
    //   } else if (this.mangroveLayer == 'Intense') {
    //     if (this.layerOption !== []) {
    //       this.manageLayerVis(this.layerOption, this.supportingOption)
    //     }
    //   } else if (this.mangroveLayer == 'support') {
    //     this.mangroveLayer = this.mangroveLayer
    //   }
    // },
    layerSelection() {
      this.updateIntensity(this.sliderValue)
      this.updateMangroveLayerVis(this.layerSelection[0], this.intensity)
    },
    sliderValue() {
      this.updateIntensity(this.sliderValue)
      this.updateMangroveLayerVis(this.layerSelection[0], this.intensity)
      this.updateClimaticLayerVis(this.climaticSelection[0], this.intensity)
    },
    supportingSelection() {
      this.updateSupportingLayerVis(this.supportingSelection)
    },
    climaticSelection() {
      this.updateClimaticLayerVis(this.climaticSelection[0], this.sliderValue)
    },
    socialSelection() {
      this.updateSocialLayerVis(this.socialSelection[0])
    },
    subSocialSelection() {
      this.updateSubSocialLayerVis(this.subSocialSelection[0])
    }
  },

  mounted() {
    // Get info button descriptions

    this.getDescriptions()

    // Portal IDs for TNC Basemaps. Use any id to set the map's basemap.

    // const tncHillshadeMapId = 'd22aed9a4acb4bc8ae8f2141732af496'
    const tncDarkMapId = '1f48b2b2456c44ad9c58d6741378c2ba'
    // const oceansMapId = '67ab7f7c535c4687b6518e6d2343e8a2';
    // const hybridMapId = '86265e5a4bbb4187a59719cf134e0018';

    //select a basemap
    esri.map = new Map({
      basemap: {
        portalItem: {
          id: tncDarkMapId
        }
      }
    })
    //create the map view
    esri.mapView = new MapView({
      map: esri.map,
      center: [-88.900345, 29.222555],
      zoom: 5,
      container: this.$el
    })

    //add supporting map layers listed in config
    this.$store.state.config.supportingMapLayers.forEach((service) => {
      let l = new MapImageLayer({
        url: service.mapService
      })
      esri.map.add(l)
      l.when(function () {
        //create sublayer list
        let sublayerList = []
        let layer = esri.map.layers.items.find((layer) => {
          return layer.type == 'map-image' && layer.url == service.mapService
        })
        // console.log(layer) //todo figure out why layer.sublayers is not working

        l.allSublayers.items.forEach((sublayer) => {
          //see if popup template recrod exists...
          let popups = service.popupTemplate
          let layerConfig = popups.find(({ id }) => id == sublayer.id)
          //if the template is configured
          if (layerConfig) {
            //create template
            let fieldInfos = layerConfig.fields
            let template = {
              actions: [],
              content: [
                {
                  type: 'fields',
                  fieldInfos: fieldInfos
                }
              ]
            }
            sublayerList.push({
              id: sublayer.id,
              visible: false,
              opacity: 1,
              popupTemplate: template
            })
            console.log(sublayer.id, layerConfig.fields)
          }
          //if there is no popup push without a template
          else {
            sublayerList.push({
              id: sublayer.id,
              visible: false,
              opacity: 1
            })
          }
        })
        l.sublayers = sublayerList
      })
    })

    //code to add highlight feature for map image layer
    // esri.mapView.popup.watch('selectedFeature', function (gra) {
    //   if (gra) {
    //     esri.mapView.graphics.removeAll()
    //     var h = esri.mapView.highlightOptions
    //     gra.symbol = {
    //       type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    //       color: [h.color.r, h.color.g, h.color.b, 0],
    //       outline: {
    //         // autocasts as new SimpleLineSymbol()
    //         color: [h.color.r, h.color.g, h.color.b, h.color.a],
    //         width: 1
    //       }
    //     }
    //     esri.mapView.graphics.add(gra)
    //   } else {
    //     esri.mapView.graphics.removeAll()
    //   }
    // })

    // esri.mapView.popup.watch('visible', function (vis) {
    //   if (!vis) {
    //     esri.mapView.graphics.removeAll()
    //   }
    // })

    //add supporting layers widget to map if true
    if (this.$store.state.config.supportingLayersOnMap) {
      let supportingLayersExpand = new Expand({
        expandIconClass: 'esri-icon-layer-list',
        expandTooltip: 'Supporting Layers',
        view: esri.mapView,
        content: document.getElementById('supportingLayers')
      })
      esri.mapView.ui.add(supportingLayersExpand, 'top-left')
    }

    //add scalebar widget
    let scaleBar = new ScaleBar({
      view: esri.mapView,
      unit: 'dual'
    })
    // esri.mapView.ui.add(scaleBar, {
    //   position: 'bottom-right'
    // })

    //add measure tools
    esri.measurement = new Measurement({
      view: esri.mapView
    })
    esri.mapView.ui.add(esri.measurement, 'top-left')

    // create legend widget
    esri.legend = new Legend({
      view: esri.mapView,
      container: legendContainer
      // style: {
      //   type: 'card'
      //   // layout: 'side-by-side'
      // }
    })

    esri.mapView.ui.add(esri.legend, {
      position: 'bottom-left'
    })

    // create expand widget to hide and show legend
    esri.lgExpand = new Expand({
      view: esri.mapView,
      content: legendContainer
    })

    // add expand to map
    esri.mapView.ui.add(esri.lgExpand, 'bottom-left')
    // show expanded legend on desktop, collapse on mobile
    this.$q.screen.lt.sm || this.$q.screen.lt.md ? true : esri.lgExpand.expand()

    //watch size of map view and adjust legend to close if map gets too small
    esri.mapView.on('resize', function (event) {
      if (event.width < 546) {
        esri.lgExpand.collapse()
      }
      if (event.width > 546) {
        esri.lgExpand.expand()
      }
    })

    // create expand widget for policy and social context
    esri.socialExpand = new Expand({
      id: 'expand-widget-id',
      view: esri.mapView,
      container: socialContainer,
      expandIcon: 'apply-changes',
      collapseIcon: 'apply-changes',
      visible: false
    })

    esri.mapView.ui.add(esri.socialExpand, 'bottom-right')

    // Create portal. Used for PortalBasemapSource below
    const portal = new Portal()

    // Titles of TNC Basemaps to include in Basemap Gallery Widget
    const allowedBasemapTitles = [
      'Imagery Hybrid',
      'Ocean Basemap',
      'TNC Light with Hillshade',
      'TNC Dark Gray Map'
    ]

    // Define Basemap Gallery Wideget source using ID from TNC Basemap
    //  Gallery ArcGIS Online Group. By default, all maps from group will
    //  be added to the Basemap Gallery Widget. The filterFunction only
    //  brings in maps from the group whose titles match those in the
    //  allowedBasemapTitles array above.
    const source = new PortalBasemapsSource({
      portal,
      query: {
        id: 'defa1b2287604d069c70af515331e30f'
      },
      filterFunction: (basemap) => allowedBasemapTitles.indexOf(basemap.portalItem.title) > -1
    })

    // Create an expand widget to house the Basemap Gallery Widget. Also
    //  create the Basemap Gallery Widget using the source and view created
    //  above.

    let view = esri.mapView

    const bgExpand = new Expand({
      view,
      content: new BasemapGallery({ source, view }),
      expandIconClass: 'esri-icon-basemap'
    })

    esri.mapView.ui.add(bgExpand, 'top-right')
    // close expand when basemap is changed
    esri.map.watch('basemap.title', function () {
      bgExpand.collapse()
    })

    // move zoom controls to top right
    esri.mapView.ui.move(['zoom'], 'top-right')

    // add mapimagelayer and sublayer
    esri.mapImageLayer = new MapImageLayer({
      url: 'https://cirrus.tnc.org/arcgis/rest/services/Mangrove_Explorer/Mangrove_Explorer_Private/MapServer',
      title: 'Mangrove Explorer',
      sublayers: [
        {
          id: 19,
          title: 'Extreme Minimum Temperature (Recent Climate)',
          visible: false,
          intensity: 'Current',
          opacity: 0.8
        },
        {
          id: 20,
          title: 'Extreme Minimum Temperature (Future Moderate Climate)',
          visible: false,
          intensity: 'Moderate',
          opacity: 0.8
        },
        {
          id: 21,
          title: 'Extreme Minimum Temperature (Future Severe Climate)',
          visible: false,
          intensity: 'Intense',
          opacity: 0.8
        },
        {
          id: 22,
          title: 'Mean Annual Precipitation (Recent Climate)',
          visible: false,
          intensity: 'Current',
          opacity: 0.8
        },
        {
          id: 23,
          title: 'Mean Annual Precipitation (Future Moderate Climate)',
          visible: false,
          intensity: 'Moderate',
          opacity: 0.8
        },
        {
          id: 24,
          title: 'Mean Annual Precipitation (Future Severe Climate)',
          visible: false,
          intensity: 'Intense',
          opacity: 0.8
        },
        {
          id: 0,
          title: 'Mangrove Distribution in the SE United States',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 1,
          // title: 'Mangrove Presence and Absence (based on expert input 2023)',
          visible: true,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 2,
          // title: 'Mangrove Expansion Zones',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 3,
          // title: 'Potential Change in Mangrove Presence by 2100',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 4,
          title: 'Modeling Current and Future Mangroves',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 5,
          title: 'Current and Future Mangroves',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 18,
          title: 'Climatic Drivers of Mangrove Change',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 25,
          title: 'Policy and Social Context',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 26,
          title: 'Where are mangroves protected by state law?',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          question: 'Where are mangroves protected by state law?'
        },
        {
          id: 27,
          title: 'Community Survey Locations',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          question: 'What do people think is driving mangrove change in expansion areas?'
        },
        {
          id: 28,
          title: 'Community Survey Locations',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          question:
            'What actions do people think need to be taken for mangroves in expansion areas?'
        },
        {
          id: 29,
          title:
            'How do people in mangrove expansion areas perceive the benefits provided by marshes versus mangroves?',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 30,
          title: 'Perceptions are consistent that mangroves are better',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 31,
          title: 'Providing nesting platforms for birds',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 32,
          title: 'Recovering from freeze events',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 33,
          title: 'Providing nectar flowers for honey production',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 34,
          title: 'Stabilizing sediments and jumpstarting coastal restoration efforts',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 35,
          title: 'Recovering from extreme flooding',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 36,
          title: 'Improving water quality',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 37,
          title: 'Perceptions are consistent that marshes are better',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 38,
          title: 'Recovery from hurricanes',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 39,
          title: 'Supporting coastal fisheries',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 40,
          title: 'Providing desirable views of the coast',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 41,
          title: 'Reducing wind speeds',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 42,
          title: 'Providing access to fishing areas',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 43,
          title: 'Responding to sea level rise',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 44,
          title: 'Perceptions of whether marshes or mangroves are better is consistently mixed',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 45,
          title: 'Preventing coastal erosion',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 46,
          title: 'Providing habitat for birds',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 47,
          title: 'Perceptions of whether marshes or mangroves are better vary by location',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 48,
          title: 'Protecting the coast during storms',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 49,
          title: 'Supporting Layers',
          visible: false,
          intensity: undefined,
          opacity: 0.8,
          legendEnabled: false
        },
        {
          id: 50,
          title: 'Tidal Wetland Complexes',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 51,
          title: 'Inland Wetland Migration Space',
          visible: false,
          intensity: undefined,
          opacity: 0.8
        },
        {
          id: 6,
          title: 'Mangrove Presence (Recent Climate)',
          visible: false,
          intensity: 'Current',
          opacity: 0.8
        },
        {
          id: 7,
          title: 'Mangrove Presence (Future Moderate Climate)',
          visible: false,
          intensity: 'Moderate',
          opacity: 0.8
        },
        {
          id: 8,
          title: 'Mangrove Presence (Future Severe Climate)',
          visible: false,
          intensity: 'Intense',
          opacity: 0.8
        },
        {
          id: 9,
          title: 'Mangrove Relative Abundance (Recent Climate)',
          visible: false,
          intensity: 'Current',
          opacity: 0.8
        },
        {
          id: 10,
          title: 'Mangrove Relative Abundance (Future Moderate Climate)',
          visible: false,
          intensity: 'Moderate',
          opacity: 0.8
        },
        {
          id: 11,
          title: 'Mangrove Relative Abundance (Future Severe Climate)',
          visible: false,
          intensity: 'Intense',
          opacity: 0.8
        },
        {
          id: 12,
          title: 'Aboveground Biomass (Recent Climate)',
          visible: false,
          intensity: 'Current',
          opacity: 0.8
        },
        {
          id: 13,
          title: 'Aboveground Biomass (Future Moderate Climate)',
          visible: false,
          intensity: 'Moderate',
          opacity: 0.8
        },
        {
          id: 14,
          title: 'Aboveground Biomass (Future Severe Climate)',
          visible: false,
          intensity: 'Intense',
          opacity: 0.8
        },
        {
          id: 15,
          title: 'Wetland Vegetation Height (Recent Climate)',
          visible: false,
          intensity: 'Current',
          opacity: 0.8
        },
        {
          id: 16,
          title: 'Wetland Vegetation Height (Future Moderate Climate)',
          visible: false,
          intensity: 'Moderate',
          opacity: 0.8
        },
        {
          id: 17,
          title: 'Wetland Vegetation Height (Future Severe Climate)',
          visible: false,
          intensity: 'Intense',
          opacity: 0.8
        }
      ]
    })
    esri.map.add(esri.mapImageLayer)
  },

  methods: {
    updateSupportingVisibility() {
      // turn off all raster layer visibility
      esri.map.layers.items.forEach((fl) => {
        if (fl.type === 'feature') {
          if (fl.id == 30 || fl.id == 31) {
            fl.visible = false
          }
        }
        if (fl.type == 'map-image') {
          fl.allSublayers.items.forEach((sl) => {
            if (sl.layer.type == 'map-image') {
              if (sl.id == 30 || sl.id == 31) {
                sl.visible = false
              }
            }
          })
        }
      })
      // turn on all sublayers that are checked in the TOC
      this.supportingMapVisibleLayers.forEach((l) => {
        //if type is raster layer - find the sublayer and make visible
        if (l.type === 'Raster Layer') {
          let layer = esri.map.layers.items.find((layer) => {
            return (
              layer.type == 'map-image' &&
              layer.url ==
                this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
            )
          })
          let sublayer = layer.allSublayers.items.find((sublayer) => {
            return sublayer.id == l.id
          })
          sublayer.visible = true
        }
        if (l.type === 'Feature Layer') {
          //check to see if feature layer exists.  if it does make it visible, if not create it.
          let i = esri.map.layers.items.findIndex(
            (layer) =>
              layer.layerId == l.id &&
              layer.url ==
                this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
          )

          if (i >= 0) {
            console.log('finds feature layer')
            esri.map.layers.items[i].visible = true
          } else {
            //check to see if fl has a popup template defined
            console.log('creates feature layer')
            let layerList =
              this.$store.state.config.supportingMapLayers[l.mapServiceIndex].popupTemplate
            let i = layerList.findIndex((layer) => layer.id == l.id)
            if (i >= 0) {
              let template = {
                title: layerList[i].title,
                content: [
                  {
                    type: 'text',
                    text: layerList[i].label + ':  <b>{ ' + layerList[i].field + '}</b>'
                  }
                ]
              }
              //get index of map server
              esri.map.add(
                new FeatureLayer({
                  url:
                    this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                    '/' +
                    l.id,
                  popupTemplate: template
                })
              )
            }
            //if no popup defined create the feature layer without popup
            else {
              esri.map.add(
                new FeatureLayer({
                  url:
                    this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                    '/' +
                    l.id
                })
              )
            }
          }
        }
      })
    },

    updateSupportingOpacity() {
      let l = this.supportingVisibleLayerOpacity
      // if it is a raster find the sublayer and set the opacity
      if (l.type === 'Raster Layer') {
        let layer = esri.map.layers.items.find((layer) => {
          return (
            layer.type == 'map-image' &&
            layer.url == this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
          )
        })
        let sublayer = layer.allSublayers.items.find((sublayer) => {
          return sublayer.id == l.id
        })
        sublayer.opacity = l.value
      }
      //if it is a feature layers, create it if it does not exist but make visibility false.  then set its opacity so that
      //when the user turns it on, it will find the layer and match the ui opacity dial.
      if (l.type == 'Feature Layer') {
        let i = esri.map.layers.items.findIndex(
          (layer) =>
            layer.layerId == l.id &&
            layer.url == this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService
        )

        if (i >= 0) {
          console.log('finds feature layer')
          esri.map.layers.items[i].opacity = l.value
        } else {
          //check to see if fl has a popup template defined
          console.log('creates feature layer')
          let layerList =
            this.$store.state.config.supportingMapLayers[l.mapServiceIndex].popupTemplate
          let i = layerList.findIndex((layer) => layer.id == l.id)
          if (i >= 0) {
            let template = {
              title: layerList[i].title,
              content: [
                {
                  type: 'text',
                  text: layerList[i].label + ':  <b>{ ' + layerList[i].field + '}</b>'
                }
              ]
            }
            //get index of map server
            esri.map.add(
              new FeatureLayer({
                url:
                  this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                  '/' +
                  l.id,
                popupTemplate: template,
                visible: false,
                opacity: l.value
              })
            )
          }
          //if no popup defined create the feature layer without popup
          else {
            esri.map.add(
              new FeatureLayer({
                url:
                  this.$store.state.config.supportingMapLayers[l.mapServiceIndex].mapService +
                  '/' +
                  l.id,
                visible: false,
                opacity: l.value
              })
            )
          }
        }
      }
    },

    getMapPrint() {
      esri.mapView.takeScreenshot({ width: 1000, height: 700 }).then((screenshot) => {
        let image = screenshot.dataUrl
        this.$store.commit('updateMapPrintURI', image)
        setTimeout(function () {
          // wait until all resources loaded
          window.print()
        }, 250)
      })
    },

    activateAreaMeasurement() {
      const distanceButton = document.getElementById('distance')
      const areaButton = document.getElementById('area')
      esri.measurement.activeTool = 'area'
      distanceButton.classList.remove('active')
      areaButton.classList.add('active')
    },

    activateLineMeasurement() {
      const distanceButton = document.getElementById('distance')
      const areaButton = document.getElementById('area')
      esri.measurement.activeTool = 'distance'
      distanceButton.classList.add('active')
      areaButton.classList.remove('active')
    },

    // Clears all measurements
    clearMeasurements() {
      const distanceButton = document.getElementById('distance')
      const areaButton = document.getElementById('area')
      distanceButton.classList.remove('active')
      areaButton.classList.remove('active')
      esri.measurement.clear()
    },

    changeMangroveLayers() {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (this.layerOption.includes(layer.title) == true) {
          layer.visible = true
        } else if (this.supportingOption.includes(layer.title)) {
          layer.visible = true
        } else {
          layer.visible = false
        }
      })
    },

    manageLayerVis(array, supportArray) {
      let newLayerOption = []
      if (array !== []) {
        array.forEach((layerLabel) => {
          esri.mapImageLayer.sublayers.forEach((layer) => {
            if (layerLabel == layer.title) {
              if (this.mangroveLayer == 'Current') {
                let sl = esri.mapImageLayer.findSublayerById(parseInt(layer.supLayers.Current))

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
              if (this.mangroveLayer == 'Moderate') {
                let sl = esri.mapImageLayer.findSublayerById(parseInt(layer.supLayers.Moderate))

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
              if (this.mangroveLayer == 'Intense') {
                let sl = esri.mapImageLayer.findSublayerById(parseInt(layer.supLayers.Intense))

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
            }
          })
        })
      }

      if (supportArray !== []) {
        supportArray.forEach((layerLabel) => {
          esri.mapImageLayer.sublayers.forEach((layer) => {
            if (layerLabel == layer.title) {
              layer.visible = true
            }
          })
        })
      }

      this.layerOption = newLayerOption
    },

    updateMangroveLayerVis(type, intensity) {
      if (this.previousMangroveLayer !== '') {
        esri.mapImageLayer.findSublayerById(this.previousMangroveLayer).visible = false
      }

      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.title) {
          if (layer.title.includes(type) == true && layer.id !== 1) {
            if (layer.intensity == intensity) {
              this.previousMangroveLayer = layer.id
              layer.visible = true
            } else {
              layer.visible = false
            }
          }
        }
      })
    },

    updateSupportingLayerVis(array) {
      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.id == 1 || layer.id == 2 || layer.id == 3 || layer.id == 4) {
          if (array.includes(layer.id) == true) {
            layer.visible = true
          } else {
            layer.visible = false
          }
        }
      })
    },

    updateClimaticLayerVis(title, intensity) {
      if (this.previousClimaticLayer !== '') {
        esri.mapImageLayer.findSublayerById(this.previousClimaticLayer).visible = false
      }

      if (intensity == 0) {
        intensity = 'Current'
      } else if (intensity == 1) {
        intensity = 'Moderate'
      } else if (intensity == 2) {
        intensity = 'Intense'
      }

      esri.mapImageLayer.sublayers.forEach((layer) => {
        if (layer.title) {
          if (layer.title.includes(title) == true) {
            if (layer.intensity == intensity) {
              this.previousClimaticLayer = layer.id
              layer.visible = true
            } else {
              layer.visible = false
            }
          }
        }
      })
    },

    updateSocialLayerVis(title) {
      // title ==
      //     'How do people in mangrove expansion areas perceive the benefits provided by marshes versus mangroves?'

      if (this.lastSocial !== '') {
        esri.mapImageLayer.findSublayerById(this.lastSocial).visible = false
      }

      if (title == '' || title == undefined) {
        this.zoomToLayer()
      } else {
        esri.mapImageLayer.sublayers.forEach((layer) => {
          if (layer.question && layer.question == title) {
            if (title == 'Where are mangroves protected by state law?') {
              layer.visible = true
              this.lastSocial = layer.id
              this.zoomToLayer()
            } else if (
              title == 'What do people think is driving mangrove change in expansion areas?'
            ) {
              this.zoomToSocial()
              if (layer.question == title) {
                layer.visible = true
                this.lastSocial = layer.id
              }
            } else if (
              title ==
              'What actions do people think need to be taken for mangroves in expansion areas?'
            ) {
              this.zoomToSocial()
              if (layer.question == title) {
                layer.visible = true
                this.lastSocial = layer.id
              }
            }
          } else if (layer.question && layer.question !== title) {
            layer.visible = false
          }
        })
      }
    },

    zoomToSocial() {
      esri.lgExpand.collapse()
      esri.socialExpand.visible = true
      esri.socialExpand.expand()
      esri.mapView.goTo({
        center: [-90.273655, 24.654709],
        zoom: 5
      })
    },

    zoomToLayer() {
      esri.lgExpand.expand()
      esri.socialExpand.visible = false
      esri.socialExpand.collapse()
      esri.mapView.goTo({
        center: [-88.900345, 29.222555],
        zoom: 5
      })
    },

    updateSubSocialLayerVis(question) {
      function zoomToFeaturesExtent(features) {
        var combinedExtent = geometryEngine.union(features.map((feature) => feature.geometry))
        view.goTo(combinedExtent)
      }

      let percepMang = [31, 32, 33, 34, 35, 36]
      let percepMarsh = [38, 39, 40, 41, 42, 43]
      let percepMixed = [45, 46]
      let percepVary = [48]

      if (question !== undefined) {
        esri.lgExpand.collapse()
        esri.socialExpand.visible = true
        esri.socialExpand.expand()

        esri.mapView.goTo({
          center: [-90.213542, 26.58333],
          zoom: 6
        })

        this.subLegendInfo = true
        // Insert queries for these layers
        // for feature layer queries, use dynamic solution. esri.socialContent = esri.findsublayerbyid(questionSublayerID) & esri.socialContent.queryFeatures
        if (question == 'Perceptions are consistent that mangroves are better') {
          percepMang.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = true
          })
          percepMarsh.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepMixed.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepVary.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })

          // featureLayer.queryFeatures(query).then(function (results) {
          //   const features = results.features
          //   zoomToFeaturesExtent(features)
          // })
        } else if (question == 'Perceptions are consistent that marshes are better') {
          percepMarsh.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = true
          })
          percepMang.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepMixed.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepVary.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
        } else if (
          question == 'Perceptions of whether marshes or mangroves are better is consistently mixed'
        ) {
          percepMixed.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = true
          })
          percepMang.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepMarsh.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepVary.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
        } else if (
          question == 'Perceptions of whether marshes or mangroves are better vary by location'
        ) {
          percepVary.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = true
          })
          percepMang.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepMarsh.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
          percepMixed.forEach((layer) => {
            esri.mapImageLayer.findSublayerById(layer).visible = false
          })
        }
      } else if (question == undefined || question == '') {
        this.subLegendInfo = false

        esri.lgExpand.expand()
        esri.socialExpand.visible = false
        esri.socialExpand.collapse()

        percepMang.forEach((layer) => {
          esri.mapImageLayer.findSublayerById(layer).visible = false
        })
        percepMarsh.forEach((layer) => {
          esri.mapImageLayer.findSublayerById(layer).visible = false
        })
        percepMixed.forEach((layer) => {
          esri.mapImageLayer.findSublayerById(layer).visible = false
        })
        percepVary.forEach((layer) => {
          esri.mapImageLayer.findSublayerById(layer).visible = false
        })

        esri.mapView.goTo({
          center: [-88.900345, 29.222555],
          zoom: 5
        })
      }
    },

    updateIntensity(sliderVal) {
      if (sliderVal == 0) {
        this.intensity = 'Current'
      } else if (sliderVal == 1) {
        this.intensity = 'Moderate'
      } else if (sliderVal == 2) {
        this.intensity = 'Intense'
      }
    },

    getDescriptions() {
      let obj = []
      let layDesc = []
      // let suppOp = []
      let smnum = this.$store.state.config.forLayerDescriptions.length
      let smcount = 0
      this.$store.state.config.forLayerDescriptions.forEach((service, index) => {
        esriRequest(service.mapService + '/layers?f=pjson', {
          responseType: 'json'
        }).then(function (response) {
          let layerJson = response.data.layers
          //push main header to the object

          obj.push({
            label: service.title,
            children: [],
            id: 999 + index,
            noTick: true,
            type: 'header'
          })

          let storeNodes = []
          let type = ''
          layerJson.forEach((l) => {
            service.popupTemplate.forEach((popup) => {
              if (l.id == popup.id) {
                type = 'Featue Layer'
              } else type = 'Raster Layer'
            })
            // add layer to layer viewer if it's id is not present in the skip array
            if (service.skipLayers.indexOf(l.id) == -1) {
              // Group Layer with no parent
              if (l.type == 'Group Layer' && !l.parentLayer) {
                //push the object to the list as child of main header

                obj[index].children.push({
                  label: l.name,
                  children: [],
                  id: l.id + '_' + index,
                  noTick: true,
                  type: type
                })

                //find the index of the object we just pushed, saves the reference to the location
                let parentIndex = obj[index].children.findIndex(
                  (obj) => obj.id == l.id + '_' + index
                )
                //save the parent node to the store with reference to its location in the object
                storeNodes.push({
                  parentIndex: parentIndex,
                  parentLoc: obj[index].children[parentIndex],
                  parentId: l.id + '_' + index,
                  description: l.description
                    .replace('&lt;/a&gt;', '</a>')
                    .replace('&lt;a', '<a')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                })
              }
              // featurel layer with parent
              if (l.type !== 'Group Layer' && l.parentLayer) {
                //find the location of the parent in the node lookup
                let nodesIndex = storeNodes.findIndex(
                  (obj) => obj.parentId == l.parentLayer.id + '_' + index
                )
                //set the location of the parent
                let parentLoc = storeNodes[nodesIndex].parentLoc
                //push the child to the parent

                // if (l.id == 1 || l.id == 2 || l.id == 3) {
                // suppOp.push({
                //   id: l.id,
                //   title: l.name,
                //   showDesc: false,
                //   description: l.description
                //     .replace('&lt;/a&gt;', '</a>')
                //     .replace('&lt;a', '<a')
                //     .replace('&lt;', '<')
                //     .replace('&gt;', '>')
                //     .replace('STYLE="text-align:Left;font-size:12pt"', '')
                // })
                // }

                parentLoc.children.push({
                  label: l.name,
                  children: [],
                  body: 'toggle',
                  id: l.id + '_' + index,
                  description: l.description
                    .replace('&lt;/a&gt;', '</a>')
                    .replace('&lt;a', '<a')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>'),
                  type: type
                })

                layDesc.push({
                  id: l.id,
                  title: l.name,
                  description: l.description
                    .replace('&lt;/a&gt;', '</a>')
                    .replace('&lt;a', '<a')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                    .replace('STYLE="text-align:Left;font-size:12pt"', '')
                })
              }
              // group layer with parent
              if (l.type == 'Group Layer' && l.parentLayer) {
                //find the location of the parent in the node lookup
                let nodesIndex = storeNodes.findIndex(
                  (obj) => obj.parentId == l.parentLayer.id + '_' + index
                )
                //set the location of the parent
                let parentLoc = storeNodes[nodesIndex].parentLoc
                //push the new parent into the found parent as child

                parentLoc.children.push({
                  label: l.name,
                  children: [],
                  id: l.id + '_' + index,
                  noTick: true,
                  type: type
                })

                //find the index of the child we just pushed
                let parentIndex = parentLoc.children.findIndex(
                  (obj) => obj.id == l.id + '_' + index
                )
                //save the reference to the location
                parentLoc = parentLoc.children[parentIndex]
                //save the parent node to the store with reference to its location in the object
                storeNodes.push({
                  parentIndex: parentIndex,
                  parentLoc: parentLoc,
                  parentId: l.id + '_' + index,
                  description: l.description
                    .replace('&lt;/a&gt;', '</a>')
                    .replace('&lt;a', '<a')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                })
              }
              // feature layer with no parent length = number of nodes
              if (l.type !== 'Group Layer' && !l.parentLayer) {
                obj[index].children.push({
                  label: l.name,
                  children: [],
                  body: 'toggle',
                  id: l.id + '_' + index,
                  description: l.description
                    .replace('&lt;/a&gt;', '</a>')
                    .replace('&lt;a', '<a')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>'),
                  type: type
                })
              }
            }
          })
          smcount = smcount + 1
          // console.log(smcount)
          // console.log(smnum)
        })
      })
      this.layerDescriptions = layDesc

      // this.supportingOptions = suppOp
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import 'https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/light/main.css';

#map {
  flex: 1;
  min-height: calc(100vh - 49px);
  height: 100%;
  width: 100%;
  position: relative;
  border-bottom: #999 solid 1pt;
}
#mapStory {
  flex: 1;
  height: calc(100vh - 200px);
  height: 100%;
  width: 100%;
  position: relative;
  border-bottom: #999 solid 1pt;
}
.esri-legend__layer-cell.esri-legend__layer-cell--info {
  width: 300px !important;
  max-width: 300px !important;
}

@media screen and (max-width: 700px) {
  #map {
    min-height: 20vh;
    height: 100%;
    width: 100%;
    position: relative;
    border-bottom: #999 solid 1pt;
  }
  #legendContainer {
    width: fit-content !important;
    height: fit-content !important;
  }
  .esri-view-width-xsmall .esri-expand--auto .esri-expand__container--expanded {
    height: fit-content;
  }
}
#printBtn {
  position: absolute;
  z-index: 100;
  right: 15px;
  top: 175px;
  border: none;
  box-shadow: 1.5px 1.5px 1px 0px rgb(0 0 0 / 40%);
}
#toolbarDiv {
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  box-shadow: 0 1px 2px rgb(0 0 0 / 60%);
}

esri-expand__content esri-expand__content--expanded div {
  background-color: white;
}
#toolbarDiv button {
  border: unset;
}
#area {
  border-right: solid 1px rgba(110, 110, 110, 0.3) !important;
  border-left: solid 1px rgba(110, 110, 110, 0.3) !important;
}

.esri-widget--button.active,
.esri-widget--button.active:hover,
.esri-widget--button.active:focus {
  cursor: default;
  background-color: lightgrey;
}
.esri-widget--button.active path,
.esri-widget--button.active:hover path,
.esri-widget--button.active:focus path {
  fill: #e4e4e4;
}

.esri-widget *:focus-visible,
.esri-widget *:focus {
  outline: none;
}
</style>
<style>
.esri-legend__service h3 {
  line-height: unset;
}
.esri-legend__layer-cell {
  padding-top: 0;
  padding-bottom: 0;
}
.esri-measurement {
  margin: 40px 0 0 -4px;
}
.esri-ui-corner .esri-component,
.esri-expand__content {
  box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
}

.esri-scale-bar__line {
  background-color: white !important;
}

#socialContainer .esri-expand-panel {
  display: none;
}

div[title='Supporting Layers' i] {
  width: 140px;
  height: 35px;
}

div[title='Supporting Layers' i] .esri-collapse__icon {
  display: none;
}

div[title='Supporting Layers' i] .esri-icon-font-fallback-text {
  width: auto;
  height: 13px;
  clip: auto;
  font-size: 13px;
  font-family: arial !important;
}
#expand-widget-id {
  display: none !important;
  background-color: red;
}
#socialContainer .esri-widget--button {
  display: none !important;
}
</style>
