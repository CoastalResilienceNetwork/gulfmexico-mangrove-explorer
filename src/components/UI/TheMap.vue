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
      <img
        v-if="
          this.socialSelection ==
          'What do people think about the benefits provided by mangroves versus marshes?'
        "
        src="../../assets/SurveyQ3.jpg"
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
  managedLayersByName: {},
  supportingLayerNames: [],
  climateLayerNames: [],
  modelLayerNames: [],
  socialQuestionLayerNames: [],
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
      previousMangroveLayer: '',
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
      Object.keys(esri.managedLayersByName).forEach((name) => {
        let layer = esri.managedLayersByName[name]
        if (layer.supportingSelection === true) {
          layer.visible = this.supportingOption.includes(layer.title) == true
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

  async mounted() {
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
      if (service.mapService.includes('/MapServer')) {
        let l = new MapImageLayer({
          url: service.mapService
        })
        esri.map.add(l)
        l.when(function () {
          let sublayerList = []
          l.allSublayers.items.forEach((sublayer) => {
            let popups = service.popupTemplate
            let layerConfig = popups.find(({ id }) => id == sublayer.id)
            if (layerConfig) {
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
            } else {
              sublayerList.push({
                id: sublayer.id,
                visible: false,
                opacity: 1
              })
            }
          })
          l.sublayers = sublayerList
        })
      }
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

    try {
      await this.initializeManagedLayers()
    } catch (error) {
      console.error(error)
      return
    }
  },

  methods: {
    normalizeLayerName(name) {
      return (name || '').trim()
    },

    getManagedLayerConfigs() {
      return [
        {
          name: 'Extreme Minimum Temperature (Recent Climate)',
          source: 'raster',
          intensity: 'Current',
          visible: false,
          opacity: 0.8
        },
        {
          name: 'Extreme Minimum Temperature (Future Moderate Climate)',
          source: 'raster',
          intensity: 'Moderate',
          visible: false,
          opacity: 0.8
        },
        {
          name: 'Extreme Minimum Temperature (Future Severe Climate)',
          source: 'raster',
          intensity: 'Intense',
          visible: false,
          opacity: 0.8
        },
        {
          name: 'Mean Annual Precipitation (Recent Climate)',
          source: 'raster',
          intensity: 'Current',
          visible: false,
          opacity: 0.8
        },
        {
          name: 'Mean Annual Precipitation (Future Moderate Climate)',
          source: 'raster',
          intensity: 'Moderate',
          visible: false,
          opacity: 0.8
        },
        {
          name: 'Mean Annual Precipitation (Future Severe Climate)',
          source: 'raster',
          intensity: 'Intense',
          visible: false,
          opacity: 0.8
        },
        {
          name: 'Mangrove Presence and Absence (based on expert input 2023)',
          source: 'vector',
          visible: true,
          opacity: 0.8,
          supportingSelection: true
        },
        {
          name: 'Mangrove Expansion Zones',
          source: 'vector',
          visible: false,
          opacity: 0.8,
          supportingSelection: true
        },
        {
          name: 'Potential Change in Mangrove Presence by 2100',
          source: 'vector',
          visible: false,
          opacity: 0.8,
          supportingSelection: true
        },
        { name: 'Mangrove Presence (Recent Climate)', source: 'vector', intensity: 'Current', visible: false, opacity: 0.8 },
        { name: 'Mangrove Presence (Future Moderate Climate)', source: 'vector', intensity: 'Moderate', visible: false, opacity: 0.8 },
        { name: 'Mangrove Presence (Future Severe Climate)', source: 'vector', intensity: 'Intense', visible: false, opacity: 0.8 },
        { name: 'Mangrove Relative Abundance (Recent Climate)', source: 'vector', intensity: 'Current', visible: false, opacity: 0.8 },
        { name: 'Mangrove Relative Abundance (Future Moderate Climate)', source: 'vector', intensity: 'Moderate', visible: false, opacity: 0.8 },
        { name: 'Mangrove Relative Abundance (Future Severe Climate)', source: 'vector', intensity: 'Intense', visible: false, opacity: 0.8 },
        { name: 'Aboveground Biomass (Recent Climate)', source: 'vector', intensity: 'Current', visible: false, opacity: 0.8 },
        { name: 'Aboveground Biomass (Future Moderate Climate)', source: 'vector', intensity: 'Moderate', visible: false, opacity: 0.8 },
        { name: 'Aboveground Biomass (Future Severe Climate)', source: 'vector', intensity: 'Intense', visible: false, opacity: 0.8 },
        { name: 'Wetland Vegetation Height (Recent Climate)', source: 'vector', intensity: 'Current', visible: false, opacity: 0.8 },
        { name: 'Wetland Vegetation Height (Future Moderate Climate)', source: 'vector', intensity: 'Moderate', visible: false, opacity: 0.8 },
        { name: 'Wetland Vegetation Height (Future Severe Climate)', source: 'vector', intensity: 'Intense', visible: false, opacity: 0.8 },
        {
          name: 'Where are mangroves protected by state law?',
          source: 'vector',
          visible: false,
          opacity: 0.8,
          question: 'Where are mangroves protected by state law?'
        },
        {
          name: 'What do people think is driving mangrove change in expansion areas?',
          source: 'vector',
          visible: false,
          opacity: 0.8,
          question: 'What do people think is driving mangrove change in expansion areas?'
        },
        {
          name: 'What actions do people think need to be taken for mangroves in expansion areas?',
          source: 'vector',
          visible: false,
          opacity: 0.8,
          question: 'What actions do people think need to be taken for mangroves in expansion areas?'
        },
        { name: 'Providing nesting platforms for birds', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Recovering from freeze events', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Providing nectar flowers for honey production', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Stabilizing sediments and jumpstarting coastal restoration efforts', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Recovering from extreme flooding', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Improving water quality', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Recovery from hurricanes', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Supporting coastal fisheries', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Providing desirable views of the coast', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Reducing wind speeds', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Providing access to fishing areas', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Responding to sea level rise', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Preventing coastal erosion', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Providing habitat for birds', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Protecting the coast during storms', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Tidal Wetland Complexes', source: 'vector', visible: false, opacity: 0.8 },
        { name: 'Inland Wetland Migration Space', source: 'vector', visible: false, opacity: 0.8 }
      ]
    },

    async getServiceNameLookup(url) {
      let response = await esriRequest(url + '?f=pjson', { responseType: 'json' })
      let lookup = {}
      response.data.layers.forEach((layer) => {
        lookup[this.normalizeLayerName(layer.name)] = layer.id
      })
      return lookup
    },

    getManagedLayer(name) {
      return esri.managedLayersByName[this.normalizeLayerName(name)]
    },

    async initializeManagedLayers() {
      let vectorUrl = this.$store.state.config.services.vectorFeatureService
      let rasterUrl = this.$store.state.config.services.rasterMapService
      let [vectorLookup, rasterLookup] = await Promise.all([
        this.getServiceNameLookup(vectorUrl),
        this.getServiceNameLookup(rasterUrl)
      ])

      let configs = this.getManagedLayerConfigs()
      let unmatched = configs.filter((config) => {
        let lookup = config.source == 'vector' ? vectorLookup : rasterLookup
        return lookup[this.normalizeLayerName(config.name)] === undefined
      })
      if (unmatched.length > 0) {
        throw new Error('Unmatched layers: ' + unmatched.map((layer) => layer.name).join(', '))
      }

      let rasterSublayers = configs
        .filter((config) => config.source == 'raster')
        .map((config) => ({
          id: rasterLookup[this.normalizeLayerName(config.name)],
          title: config.name,
          visible: config.visible,
          opacity: config.opacity
        }))

      esri.mapImageLayer = new MapImageLayer({
        url: rasterUrl,
        title: 'Mangrove Explorer',
        sublayers: rasterSublayers
      })
      esri.map.add(esri.mapImageLayer)

      configs
        .filter((config) => config.source == 'vector')
        .forEach((config) => {
          let layer = new FeatureLayer({
            url: vectorUrl + '/' + vectorLookup[this.normalizeLayerName(config.name)],
            title: config.name,
            visible: config.visible,
            opacity: config.opacity
          })
          layer.intensity = config.intensity
          layer.question = config.question
          layer.supportingSelection = config.supportingSelection
          esri.map.add(layer)
          esri.managedLayersByName[this.normalizeLayerName(config.name)] = layer
        })

      await esri.mapImageLayer.when()
      configs
        .filter((config) => config.source == 'raster')
        .forEach((config) => {
          let sublayer = esri.mapImageLayer.findSublayerById(
            rasterLookup[this.normalizeLayerName(config.name)]
          )
          sublayer.intensity = config.intensity
          esri.managedLayersByName[this.normalizeLayerName(config.name)] = sublayer
        })

      esri.supportingLayerNames = this.$store.state.config.supportingSelectionLayerNames.map(
        (name) => this.normalizeLayerName(name)
      )
      esri.climateLayerNames = configs
        .filter((config) => config.source == 'raster')
        .map((config) => this.normalizeLayerName(config.name))
      esri.modelLayerNames = configs
        .filter((config) => config.name.includes('(Recent Climate)') || config.name.includes('(Future'))
        .filter((config) => config.name.includes('Mangrove') || config.name.includes('Biomass') || config.name.includes('Wetland Vegetation Height'))
        .map((config) => this.normalizeLayerName(config.name))
      esri.socialQuestionLayerNames = [
        'Where are mangroves protected by state law?',
        'What do people think is driving mangrove change in expansion areas?',
        'What actions do people think need to be taken for mangroves in expansion areas?'
      ].map((name) => this.normalizeLayerName(name))
    },

    updateSupportingVisibility() {
      esri.supportingLayerNames.forEach((name) => {
        let layer = this.getManagedLayer(name)
        if (layer) {
          layer.visible = false
        }
      })
      this.supportingMapVisibleLayers.forEach((l) => {
        let layer = this.getManagedLayer(l.layerName)
        if (layer) {
          layer.visible = true
        }
      })
    },

    updateSupportingOpacity() {
      let l = this.supportingVisibleLayerOpacity
      let layer = this.getManagedLayer(l.layerName)
      if (layer) {
        layer.opacity = l.value
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
      Object.keys(esri.managedLayersByName).forEach((name) => {
        let layer = esri.managedLayersByName[name]
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
          Object.keys(esri.managedLayersByName).forEach((key) => {
            let layer = esri.managedLayersByName[key]
            if (layerLabel == layer.title) {
              if (this.mangroveLayer == 'Current') {
                let sl = this.getManagedLayer(layer.supLayers.Current)

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
              if (this.mangroveLayer == 'Moderate') {
                let sl = this.getManagedLayer(layer.supLayers.Moderate)

                layer.visible = false
                sl.visible = true

                newLayerOption.push(sl.title)
              }
              if (this.mangroveLayer == 'Intense') {
                let sl = this.getManagedLayer(layer.supLayers.Intense)

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
          Object.keys(esri.managedLayersByName).forEach((key) => {
            let layer = esri.managedLayersByName[key]
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
        let previousLayer = this.getManagedLayer(this.previousMangroveLayer)
        if (previousLayer) {
          previousLayer.visible = false
        }
      }

      esri.modelLayerNames.forEach((name) => {
        let layer = this.getManagedLayer(name)
        if (layer && layer.title) {
          if (
            layer.title.includes(type) == true &&
            layer.title !== 'Mangrove Presence and Absence (based on expert input 2023)'
          ) {
            if (layer.intensity == intensity) {
              this.previousMangroveLayer = layer.title
              layer.visible = true
            } else {
              layer.visible = false
            }
          }
        }
      })
    },

    updateSupportingLayerVis(array) {
      esri.supportingLayerNames.forEach((name) => {
        let layer = this.getManagedLayer(name)
        if (layer) {
          layer.visible = array.includes(layer.title) == true
        }
      })
    },

    updateClimaticLayerVis(title, intensity) {
      if (this.previousClimaticLayer !== '') {
        let previousLayer = this.getManagedLayer(this.previousClimaticLayer)
        if (previousLayer) {
          previousLayer.visible = false
        }
      }

      if (intensity == 0) {
        intensity = 'Current'
      } else if (intensity == 1) {
        intensity = 'Moderate'
      } else if (intensity == 2) {
        intensity = 'Intense'
      }

      esri.climateLayerNames.forEach((name) => {
        let layer = this.getManagedLayer(name)
        if (layer && layer.title) {
          if (layer.title.includes(title) == true) {
            if (layer.intensity == intensity) {
              this.previousClimaticLayer = layer.title
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

      esri.socialQuestionLayerNames.forEach((name) => {
        let layer = this.getManagedLayer(name)
        if (layer) {
          layer.visible = false
        }
      })
      this.lastSocial = ''

      if (title == '' || title == undefined) {
        this.zoomToLayer()
      } else {
        if (title == 'Where are mangroves protected by state law?') {
          let layer = this.getManagedLayer(title)
          if (layer) {
            layer.visible = true
            this.lastSocial = layer.title
          }
          this.zoomToLayer()
        } else if (
          title == 'What do people think is driving mangrove change in expansion areas?' ||
          title == 'What actions do people think need to be taken for mangroves in expansion areas?'
        ) {
          let layer = this.getManagedLayer(title)
          if (layer) {
            layer.visible = true
            this.lastSocial = layer.title
          }
          this.zoomToSocial()
        } else if (
          title == 'What do people think about the benefits provided by mangroves versus marshes?'
        ) {
          this.zoomToSocial()
        }
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

      let percepMang = this.$store.state.config.subSocialLayerNameGroups.mangroveBetter
      let percepMarsh = this.$store.state.config.subSocialLayerNameGroups.marshBetter
      let percepMixed = this.$store.state.config.subSocialLayerNameGroups.mixed
      let percepVary = this.$store.state.config.subSocialLayerNameGroups.varyByLocation
      let setVisible = (names, visible) => {
        names.forEach((name) => {
          let layer = this.getManagedLayer(name)
          if (layer) {
            layer.visible = visible
          }
        })
      }

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
          setVisible(percepMang, true)
          setVisible(percepMarsh, false)
          setVisible(percepMixed, false)
          setVisible(percepVary, false)

          // featureLayer.queryFeatures(query).then(function (results) {
          //   const features = results.features
          //   zoomToFeaturesExtent(features)
          // })
        } else if (question == 'Perceptions are consistent that marshes are better') {
          setVisible(percepMarsh, true)
          setVisible(percepMang, false)
          setVisible(percepMixed, false)
          setVisible(percepVary, false)
        } else if (
          question == 'Perceptions of whether marshes or mangroves are better is consistently mixed'
        ) {
          setVisible(percepMixed, true)
          setVisible(percepMang, false)
          setVisible(percepMarsh, false)
          setVisible(percepVary, false)
        } else if (
          question == 'Perceptions of whether marshes or mangroves are better vary by location'
        ) {
          setVisible(percepVary, true)
          setVisible(percepMang, false)
          setVisible(percepMarsh, false)
          setVisible(percepMixed, false)
        }
      } else if (question == undefined || question == '') {
        this.subLegendInfo = false

        esri.lgExpand.expand()
        esri.socialExpand.visible = false
        esri.socialExpand.collapse()

        setVisible(percepMang, false)
        setVisible(percepMarsh, false)
        setVisible(percepMixed, false)
        setVisible(percepVary, false)

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

    formatLayerDescription(description) {
      let formatted = description || ''
      formatted = formatted
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/STYLE="text-align:Left;font-size:12pt"/g, '')
      formatted = formatted.replace(
        /\(\s*Source:\s*(https?:\/\/[^\s)]+)\s*\)\.?/gi,
        '(<a href="$1" target="_blank">source</a>).'
      )
      formatted = formatted.replace(
        /(^|[\s>])Source:\s*(https?:\/\/[^\s<)]+)\.?/gi,
        '$1<a href="$2" target="_blank">source</a>.'
      )
      return formatted
    },

    getDescriptions() {
      let obj = []
      let layDesc = []
      let allowedDescriptionNames = this.getManagedLayerConfigs().map((layer) =>
        this.normalizeLayerName(layer.name)
      )
      // let suppOp = []
      let smnum = this.$store.state.config.forLayerDescriptions.length
      let smcount = 0
      this.$store.state.config.forLayerDescriptions.forEach((service, index) => {
        esriRequest(service.mapService + '/layers?f=pjson', {
          responseType: 'json'
        }).then((response) => {
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
          layerJson.forEach((l) => {
            let type = l.type == 'Feature Layer' ? 'Feature Layer' : 'Raster Layer'
            let normalizedName = this.normalizeLayerName(l.name)
            if (allowedDescriptionNames.includes(normalizedName) == false) {
              return
            }
            // add layer to layer viewer if it's id is not present in the skip array
            if (service.skipLayers.indexOf(l.id) == -1) {
              // Group Layer with no parent
              if (l.type == 'Group Layer' && !l.parentLayer) {
                //push the object to the list as child of main header

                obj[index].children.push({
                  label: normalizedName,
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
                  description: this.formatLayerDescription(l.description)
                })
              }
              // featurel layer with parent
              if (l.type !== 'Group Layer' && l.parentLayer) {
                //find the location of the parent in the node lookup
                let nodesIndex = storeNodes.findIndex(
                  (obj) => obj.parentId == l.parentLayer.id + '_' + index
                )
                if (nodesIndex >= 0) {
                  //set the location of the parent
                  let parentLoc = storeNodes[nodesIndex].parentLoc
                  //push the child to the parent
                  parentLoc.children.push({
                    label: normalizedName,
                    children: [],
                    body: 'toggle',
                    id: l.id + '_' + index,
                    description: this.formatLayerDescription(l.description),
                    type: type
                  })
                }

                layDesc.push({
                  id: l.id,
                  title: normalizedName,
                  description: this.formatLayerDescription(l.description)
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
                  label: normalizedName,
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
                  description: this.formatLayerDescription(l.description)
                })
              }
              // feature layer with no parent length = number of nodes
              if (l.type !== 'Group Layer' && !l.parentLayer) {
                obj[index].children.push({
                  label: normalizedName,
                  children: [],
                  body: 'toggle',
                  id: l.id + '_' + index,
                  description: this.formatLayerDescription(l.description),
                  type: type
                })
                layDesc.push({
                  id: l.id,
                  title: normalizedName,
                  description: this.formatLayerDescription(l.description)
                })
              }
            }
          })
          smcount = smcount + 1
          if (smcount == smnum) {
            this.layerDescriptions = layDesc
          }
        })
      })

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
