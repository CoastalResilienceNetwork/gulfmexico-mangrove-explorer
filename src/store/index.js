import { createStore } from 'vuex'
import esriRequest from '@arcgis/core/request'

export default createStore({
  state: {
    data: {
      // data retrieved from web services
      supportingLayers: '', //used to create the supportinglayer tree
      slReady: false
    },
    config: {
      // config info
      services: {
        vectorFeatureService:
          'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/Mangrove_Explorer_Private/FeatureServer',
        rasterMapService:
          'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer'
      },
      supportingSelectionLayerNames: [
        'Mangrove Presence and Absence (based on expert input 2023)',
        'Mangrove Expansion Zones',
        'Potential Change in Mangrove Presence by 2100'
      ],
      subSocialLayerNameGroups: {
        mangroveBetter: [
          'Providing nesting platforms for birds',
          'Recovering from freeze events',
          'Providing nectar flowers for honey production',
          'Stabilizing sediments and jumpstarting coastal restoration efforts',
          'Recovering from extreme flooding',
          'Improving water quality'
        ],
        marshBetter: [
          'Recovery from hurricanes',
          'Supporting coastal fisheries',
          'Providing desirable views of the coast',
          'Reducing wind speeds',
          'Providing access to fishing areas',
          'Responding to sea level rise'
        ],
        mixed: ['Preventing coastal erosion', 'Providing habitat for birds'],
        varyByLocation: ['Protecting the coast during storms']
      },
      supportingMapLayers: [
        {
          mapService:
            'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/Mangrove_Explorer_Private/FeatureServer',
          includeLayerNames: ['Tidal Wetland Complexes', 'Inland Wetland Migration Space'],
          title: 'Mangrove Explorer',
          popupTemplate: [
            {
              id: 9999,
              fields: [
                { fieldName: 'Subbasin', label: 'Sub Basin' },
                { fieldName: 'SubbasinR', label: 'Sub Basin R' },
                { fieldName: 'AreaC', label: 'Area(units)' }
              ]
            },
            // for now this placeholder is required.  I am not sure why but the last layer in this list will not display correctly.
            {
              id: 9999,
              fields: [{ fieldName: 'none', label: 'placeholder' }]
            }
          ]
        }
      ],
      forLayerDescriptions: [
        {
          mapService:
            'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/Mangrove_Explorer_Private/FeatureServer',
          skipLayers: [],
          title: 'Mangrove Explorer',
          popupTemplate: [
            {
              id: 9999,
              fields: [
                { fieldName: 'Subbasin', label: 'Sub Basin' },
                { fieldName: 'SubbasinR', label: 'Sub Basin R' },
                { fieldName: 'AreaC', label: 'Area(units)' }
              ]
            },
            {
              id: 9999,
              fields: [{ fieldName: 'none', label: 'placeholder' }]
            }
          ]
        },
        {
          mapService:
            'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer',
          skipLayers: [],
          title: 'Mangrove Explorer',
          popupTemplate: [
            {
              id: 9999,
              fields: [
                { fieldName: 'Subbasin', label: 'Sub Basin' },
                { fieldName: 'SubbasinR', label: 'Sub Basin R' },
                { fieldName: 'AreaC', label: 'Area(units)' }
              ]
            },
            // for now this placeholder is required.  I am not sure why but the last layer in this list will not display correctly.
            {
              id: 9999,
              fields: [{ fieldName: 'none', label: 'placeholder' }]
            }
          ]
        }
      ],

      supportingLayersTitle: 'Supporting Mangrove Layers',
      supportingLayersOnMap: true,
      supportingLayersInPanel: false,
      panelDisplayType: 'plain', //plain, tabsHorizontal, tabsVertical
      appDisplayType: 'webMap', //storyMap, webMap
      condensedTabs: false,
      containerWidth: ''
    },
    // app state info -- supporting layers
    tree: { ticked: [], expanded: [999], tickedObj: [] },
    selectedLayerList: [],
    supportingVisibleLayerOpacity: {},

    // app state info -- layout
    showControls: false,
    hideControls: true,
    mapPrintURI: '',
    layerOption: [],
    mangroveLayer: '',
    layerSelection: ['None'],
    climaticSelection: ['None'],
    supportingSelection: ['Mangrove Presence and Absence (based on expert input 2023)'],
    socialSelection: ['None'],
    subSocialSelection: ['None'],
    sliderValue: 0,
    supportOpacity: 0.8,
    tabSupLayers: [],
    selectedOption: [],
    supportingOptions: [],
    supportingOption: [],
    opacityLayerId: -1,
    layerDescriptions: [],
    descriptionsComplete: false,
    splashDiv: true,
    mapLoaded: false
  },
  mutations: {
    //data retrieved from web services
    updateSupportingLayers(state, obj) {
      state.data.supportingLayers = obj
    },
    updateSLReady(state, bool) {
      state.data.slReady = bool
    },
    updateSupportingSublayerList(state, obj) {
      state.data.supportingSublayerList = obj
    },

    //app state -- supporting layers
    updateTreeState(state, obj) {
      state.tree.ticked = obj.ticked
      state.tree.expanded = obj.expanded
      state.tree.tickedObj = obj.tickedObj
    },
    updateSupportingLayerVisibleOpacity(state, obj) {
      state.supportingVisibleLayerOpacity = obj
    },
    updateMapPrintURI(state, uri) {
      state.mapPrintURI = uri
    },
    updateCondensedTabs(state, bool) {
      state.condensedTabs = bool
    },
    updateContainerWidth(state, val) {
      state.containerWidth = val
    },
    updateLayerOption(state, val) {
      state.layerOption = val
    },
    updateMangroveLayer(state, val) {
      state.mangroveLayer = val
    },
    updateLayerSelection(state, val) {
      state.layerSelection = val
    },
    updateClimaticSelection(state, val) {
      state.climaticSelection = val
    },
    updateSupportingSelection(state, val) {
      state.supportingSelection = val
    },
    updateSocialSelection(state, val) {
      state.socialSelection = val
    },
    updateSubSocialSelection(state, val) {
      state.subSocialSelection = val
    },
    updateSliderValue(state, val) {
      state.sliderValue = val
    },
    updateTabSupLayers(state, val) {
      state.tabSupLayers = val
    },
    updateSelectedOption(state, val) {
      state.selectedOption = val
    },
    updateSupportingOptions(state, val) {
      state.supportingOptions = val
    },
    updateSupportingOption(state, val) {
      state.supportingOption = val
    },
    updateSupportOpacity(state, val) {
      state.supportOpacity = val
    },
    updateOpacityLayerId(state, val) {
      state.opacityLayerId = val
    },
    updateLayerDescriptions(state, val) {
      state.layerDescriptions = val
    },
    updateDescriptionsComplete(state, val) {
      state.descriptionsComplete = val
    },
    updateSplashDiv(state, val) {
      state.splashDiv = val
    },
    updateMapLoaded(state, val) {
      state.mapLoaded = val
    }
  },

  actions: {
    requestSupportingLayers(context) {
      //for each map service object in supporting map layers
      try {
        let obj = []
        let smnum = context.state.config.supportingMapLayers.length
        let smcount = 0
        context.state.config.supportingMapLayers.forEach((service, index) => {
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
            layerJson.forEach((l) => {
              let type = l.type == 'Feature Layer' ? 'Feature Layer' : 'Raster Layer'
              let normalizedName = (l.name || '').trim()
              if (context.state.config.supportingSelectionLayerNames.includes(normalizedName)) {
                let layLength = context.state.supportingOptions.length
                let o = {
                  id: normalizedName,
                  title: normalizedName,
                  value: normalizedName,
                  showDesc: false,
                  description: l.description
                    .replace('&lt;/a&gt;', '</a>')
                    .replace('&lt;a', '<a')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                    .replace('STYLE="text-align:Left;font-size:12pt"', '')
                }

                if (layLength < 3) {
                  context.state.supportingOptions.push(o)
                }
              }

              let includeLayer = true
              if (Array.isArray(service.includeLayerNames) && service.includeLayerNames.length > 0) {
                includeLayer = service.includeLayerNames.includes(normalizedName)
              } else if (Array.isArray(service.skipLayers) && service.skipLayers.length > 0) {
                includeLayer = service.skipLayers.indexOf(l.id) == -1
              }

              if (includeLayer) {
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
                  parentLoc.children.push({
                    label: normalizedName,
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
                    label: normalizedName,
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
            if (smcount == smnum) {
              context.commit('updateSupportingLayers', obj)
              context.commit('updateSLReady', true)
            }
          })
        })
      } catch (error) {
        context.commit('updateSupportingLayers', 'error')
      }
    }
  },

  modules: {}
})
