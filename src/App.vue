<template>
  <div id="print" class="print-only">
    <the-print></the-print>
  </div>
  <the-header></the-header>

  <div>
    <div v-if="splashDiv == true">
      <div id="splash-screen" v-if="smallScreen && splashDiv == true">
        <div style="height: fit-content !important; width: auto">
          <q-img src="MangroveMap.jpg" style="height: 100vh; width: 100%; overflow-y: scroll">
            <div class="absolute-full text-subtitle2" style="height: fit-content; width: auto">
              <!-- <div class="text-h3 text-center" style="margin: 15px">About Mangrove Explorer</div> -->
              <div style="font-weight: 300; font-size: large; padding: 25px; line-height: normal">
                Welcome to the Mangrove Explorer Mapping Tool. The Mangrove Explorer was created by
                a multidisciplinary team of scientists and researchers to share cutting edge
                research related to the future distribution of mangroves in the continental United
                States. The northern limit of mangroves in this region is typically limited by the
                frequency and intensity of freeze events that damage or kill mangroves. However, as
                climate change reduces the number of freeze events, mangroves are establishing in
                areas north of their historic range. <br /><br />
                The Mangrove Explorer depicts the most current (2021) distribution of mangroves as
                well as the projections of the future distribution and characteristics of mangroves
                under future temperature and precipitation conditions. Other factors that will
                influence the future distribution, such as policy and coastal management, are also
                explored on the tool. It is extremely important to note that these projections only
                depict where mangroves could expand with warming temperatures and do NOT consider
                the impacts of sea level rise on all coastal wetlands (including mangroves). Sea
                level rise is expected to lead to wetland loss in some places and also landward
                migration of coastal wetlands into adjacent upland and upriver ecosystems. Future
                work is needed to address this impact in the Mangrove Explorer. For now, the maps
                provide the user with a glimpse into the future where mangroves will likely expand
                across the majority of the upper Gulf of Mexico and up the east coast into South
                Carolina by the Year 2100. To view the data behind this project please visit:
                <a
                  target="_blank"
                  href="https://www.sciencebase.gov/catalog/item/6515c966d34e469cabfcdc88"
                  >Sciencebase.gov</a
                ><br /><br />
                For more information about The Nature Conservancy and partner efforts in the region
                please visit:
                <a
                  target="_blank"
                  href="https://www.nature.org/en-us/what-we-do/our-priorities/protect-water-and-land/land-and-water-stories/us-mangroves-conservation/?vu=usmangroves"
                  >TNC | Ensuring a Future for Mangroves in the U.S.</a
                >
              </div>
              <div>
                <q-btn
                  @click="this.showMap()"
                  color="primary"
                  style="margin: 5px auto 25px auto; display: block"
                  size="18px"
                  >Enter</q-btn
                >
              </div>
              <div
                class="row justify-around items-end"
                style="padding: 10%; background-color: white"
              >
                <q-img src="TNCLogoPrimary_RGB.jpg" style="width: 250px" fit="contain" />
                <q-img src="NE_University.jpg" style="width: 250px" fit="contain" />
                <q-img src="USGS_logo_green.png" style="width: 250px" fit="contain" />
                <q-img src="UofA_Stokes.jpg" style="width: 250px" fit="contain" />
              </div>
            </div>
          </q-img>
        </div>
      </div>
    </div>
    <div id="mobile" v-if="smallScreen && splashDiv == false" class="print-hide">
      <q-splitter
        v-model="splitterModelMobile"
        unit="px"
        separator-class="bg-primary"
        horizontal
        @update:model-value="updateScrollContainerHeight($event)"
      >
        <template v-slot:after v-if="smallScreen">
          <!--PANEL COMPONENT-->

          <router-view></router-view>
        </template>
        <template v-slot:separator>
          <q-avatar
            draggable="false"
            color="primary"
            text-color="white"
            size="20px"
            icon="drag_indicator"
          />
        </template>
        <template v-slot:before>
          <!--MAP COMPONENT-->
          <the-map></the-map>
        </template>
      </q-splitter>
    </div>
    <div id="desktop" v-if="!smallScreen" class="print-hide">
      <q-dialog v-model="splashDiv" v-if="splashDiv == true">
        <q-card
          style="
            background-image: url(MangroveMap.jpg);
            background-position: center;
            height: auto;
            width: 100vw;
            background-size: cover;
            background-repeat: no-repeat;
          "
        >
          <q-card-section
            class="column items-center justify-between"
            style="height: auto; width: 80vw; display: block !important"
          >
            <div
              style="
                font-weight: 400;
                font-size: x-large;
                padding: 25px;
                line-height: normal;
                text-shadow: 0 0 black;
              "
            >
              Welcome to the Mangrove Explorer Mapping Tool. The Mangrove Explorer was created by a
              multidisciplinary team of scientists and researchers to share cutting edge research
              related to the future distribution of mangroves in the continental United States. The
              northern limit of mangroves in this region is typically limited by the frequency and
              intensity of freeze events that damage or kill mangroves. However, as climate change
              reduces the number of freeze events, mangroves are establishing in areas north of
              their historic range. <br /><br />
              The Mangrove Explorer depicts the most current (2021) distribution of mangroves as
              well as the projections of the future distribution and characteristics of mangroves
              under future temperature and precipitation conditions. Other factors that will
              influence the future distribution, such as policy and coastal management, are also
              explored on the tool. It is extremely important to note that these projections only
              depict where mangroves could expand with warming temperatures and do NOT consider the
              impacts of sea level rise on all coastal wetlands (including mangroves). Sea level
              rise is expected to lead to wetland loss in some places and also landward migration of
              coastal wetlands into adjacent upland and upriver ecosystems. Future work is needed to
              address this impact in the Mangrove Explorer. For now, the maps provide the user with
              a glimpse into the future where mangroves will likely expand across the majority of
              the upper Gulf of Mexico and up the east coast into South Carolina by the Year 2100.
              To view the data behind this project please visit:
              <a
                target="_blank"
                href="https://www.sciencebase.gov/catalog/item/6515c966d34e469cabfcdc88"
                >Sciencebase.gov</a
              ><br /><br />
              For more information about The Nature Conservancy and partner efforts in the region
              please visit:
              <a
                target="_blank"
                href="https://www.nature.org/en-us/what-we-do/our-priorities/protect-water-and-land/land-and-water-stories/us-mangroves-conservation/?vu=usmangroves"
                >TNC | Ensuring a Future for Mangroves in the U.S.</a
              >
            </div>
            <q-btn
              label="Enter"
              color="primary"
              @click="splashDiv = false"
              style="
                margin: auto auto 25px auto;
                width: fit-content;
                display: block;
                padding-bottom: 0px;
              "
              size="lg"
            ></q-btn>
            <div
              class="justify-between items-center"
              style="
                display: block;
                padding-left: 25px;
                width: fit-content;
                background-color: white !important;
                margin: auto;
              "
            >
              <q-img
                src="TNCLogoPrimary_RGB.jpg"
                style="width: 250px; margin-right: 30px"
                fit="contain"
              />
              <q-img
                src="NE_University.jpg"
                style="width: 250px; margin-right: 20px"
                fit="contain"
              />
              <q-img
                src="USGS_logo_green.png"
                style="width: 250px; margin-right: 20px"
                fit="contain"
              />
              <q-img src="UofA_Stokes.jpg" style="width: 250px; margin-right: 20px" fit="contain" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-splitter
        v-model="splitterModel"
        unit="px"
        separator-class="bg-primary"
        :limits="[600, Infinity]"
        @update:model-value="updateCondensedTabs($event)"
      >
        <template v-slot:before>
          <!--PANEL COMPONENT-->
          <router-view></router-view>
        </template>
        <template v-slot:separator>
          <q-avatar
            draggable="false"
            color="primary"
            text-color="white"
            size="0px"
            icon="drag_indicator"
          />
        </template>
        <template v-slot:after>
          <!--MAP COMPONENT-->
          <!-- <div id="splash-screen" v-if="splashDiv == true">
            <div>
              <q-img src="bg_image.jpg" style="height: 100vh; width: 100%; overflow-y: scroll">
                <div class="absolute-full text-subtitle2">
                  <div class="text-h3 text-center" style="margin: 15px">
                    About Mangrove Explorer
                  </div>
                  <div
                    style="font-weight: 300; font-size: x-large; padding: 25px; line-height: normal"
                  >
                    Welcome to the Mangrove Explorer Mapping Tool. The Mangrove Explorer was created
                    by a multidisciplinary team of scientists and researchers to share cutting edge
                    research related to the future distribution of mangroves in the continental
                    United States. The northern limit of mangroves in this region is typically
                    limited by the frequency and intensity of freeze events that damage or kill
                    mangroves. However, as climate change reduces the number of freeze events,
                    mangroves are establishing in areas north of their historic range. <br /><br />
                    The Mangrove Explorer depicts the most current (2021) distribution of mangroves
                    as well as the projections of the future distribution and characteristics of
                    mangroves under future temperature and precipitation conditions. Other factors
                    that will influence the future distribution, such as policy and coastal
                    management, are also explored on the tool. It is extremely important to note
                    that these projections only depict where mangroves could expand with warming
                    temperatures and do NOT consider the devastating impacts of sea level rise on
                    all coastal wetlands (including mangroves). Future work is needed to address
                    this impact in the Mangrove Explorer. For now, the maps provide the user with a
                    glimpse into the future where mangroves will likely expand across the majority
                    of the upper Gulf of Mexico and up the east coast into the Carolinas by the Year
                    2100.
                  </div>
                  <div style="margin: 30px">
                    <q-btn
                      @click="this.showMap()"
                      color="primary"
                      style="margin: 15px auto 15px auto; display: block"
                      size="18px"
                      >Enter</q-btn
                    >
                  </div>
                  <div class="row justify-around items-end">
                    <q-img src="UofA_Stokes.jpg" style="width: 250px" fit="contain" />
                    <q-img src="NE_University.jpg" style="width: 250px" fit="contain" />
                    <q-img src="TNCLogoPrimary_RGB.jpg" style="width: 250px" fit="contain" />
                  </div>
                </div>
              </q-img>
            </div>
          </div> -->
          <the-map></the-map>
        </template>
      </q-splitter>
    </div>
  </div>
</template>

<script>
import TheMap from './components/UI/TheMap.vue'
import TheHeader from './components/UI/TheHeader.vue'
import ThePanel from './components/UI/ThePanel.vue'
import ThePrint from './components/AppTools/ThePrint.vue'
import esriRequest from '@arcgis/core/request'

export default {
  name: 'App',
  components: {
    TheMap,
    TheHeader,
    ThePanel,
    ThePrint
    //TheMapToggle, TheSideNav
  },
  data() {
    return {
      splitterModel: this.$store.state.config.panelDisplayType == 'plain' ? 550 : 750,
      splitterModelMobile: this.$store.state.config.panelDisplayType == 'tabsVertical' ? 300 : 400,
      panelScreenSize: 'v-slot:before',
      //for the service worker (pwa update)
      registration: null,
      updateExists: false
    }
  },
  created() {
    document.addEventListener('swUpdated', this.updateAvailable, {
      once: true
    })
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // We'll also need to add 'refreshing' to our data originally set to false.
      if (this.refreshing) return
      this.refreshing = true
      // Here the actual reload of the page occurs
      window.location.reload()
    })
  },
  computed: {
    smallScreen() {
      return this.$q.screen.lt.sm
    },
    splashDiv: {
      get() {
        return this.$store.state.splashDiv
      },
      set(value) {
        this.$store.commit('updateSplashDiv', value)
      }
    }
  },
  mounted() {
    // create data store for the app
    this.$store.dispatch('requestSupportingLayers')
    this.$q.screen.setSizes({ sm: 700 })
  },
  methods: {
    updateCondensedTabs(value) {
      //this function updates the tab state (condensed true/false) to show icon only
      if (value < 150 && !this.$store.state.condensedTabs) {
        this.$store.commit('updateCondensedTabs', true)
      } else if (value > 150 && this.$store.state.condensedTabs) {
        this.$store.commit('updateCondensedTabs', false)
      }
      this.$store.commit('updateContainerWidth', value)
    },
    updateScrollContainerHeight(value) {
      //this function updates the height of the scroll container (tab panels) in mobile view

      //todo: notate what does the 150 control
      let newVal = value
      //document.getElementById('panelM').style.height = 'calc(100vh - ' + newVal  + 'px)'
      document.getElementsByClassName('panelM').forEach((elem) => {
        elem.style.height = 'calc(100vh - ' + newVal + 'px)'
      })
    },
    showMap() {
      this.splashDiv = false
    }
  },
  updateAvailable(event) {
    this.registration = event.detail
    this.updateExists = true
  },
  refreshApp() {
    this.updateExists = false
    // Make sure we only send a 'skip waiting' message if the SW is waiting
    if (!this.registration || !this.registration.waiting) return
    // Send message to SW to skip the waiting and activate the new SW
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }
}
</script>

<style>
@media screen and (max-width: 700px) {
  .q-splitter__before,
  .q-splitter__after {
    overflow: hidden !important;
  }
  .esri-view-width-xsmall .esri-expand--auto .esri-expand__mask--expanded {
    display: none;
  }
  .esri-view-width-xsmall .esri-expand--auto .esri-expand__container--expanded {
    top: 100px;
  }
  .esri-view-width-xsmall .esri-expand--auto .esri-expand__container--expanded .esri-expand__panel {
    padding: 2px;
  }
  .absolute-full .text-subtitle2 {
    padding: 0px !important;
  }
}
.q-dialog__inner--minimized > div {
  max-width: 80vw !important;
}
</style>
