<template>
  <div class="q-mt-md">
    <!-- <q-splitter style="overflow: hidden" v-model="splitterModel" unit="px" :limits="[60, 100]"> -->
    <!--Example with supporting layers in a vertical tab-->

    <!-- <template v-slot:before> -->
    <!-- <q-tabs
          dark
          v-model="tab"
          vertical
          class="text-primary"
          active-color="white"
          active-bg-color="primary"
          indicator-color="white"
          dense
          style="width: 0px !important"
        > -->
    <!--each tab has two presentations, full or condensed, based on the size of the screen-->

    <!-- <q-separator></q-separator>
          <q-route-tab
            v-if="!$store.state.condensedTabs && !smallScreen"
            style="padding: 10px"
            to="/tab1"
            name="tab1"
            @click="this.mangroveLayer = 'current'"
          >
            <q-icon name="bar_chart" size="sm"></q-icon>
            1981 - 2010
          </q-route-tab>
          <q-route-tab
            v-if="$store.state.condensedTabs || smallScreen"
            style="padding: 10px"
            to="/tab1"
            name="tab1"
            @click="this.mangroveLayer = 'current'"
          >
            <q-icon name="bar_chart" size="lg"></q-icon>
          </q-route-tab>
          <q-separator></q-separator>
          <q-route-tab
            v-if="!$store.state.condensedTabs && !smallScreen"
            style="padding: 10px"
            to="/tab2"
            name="tab2"
            @click="this.mangroveLayer = 'moderate'"
          >
            <q-icon name="bar_chart" size="sm"></q-icon>
            2071 - 2100 <br />
            SSP2 - 4.5
          </q-route-tab>
          <q-route-tab
            v-if="$store.state.condensedTabs || smallScreen"
            style="padding: 10px"
            to="/tab2"
            name="tab2"
            @click="this.mangroveLayer = 'moderate'"
          >
            <q-icon name="bar_chart" size="lg"></q-icon>
          </q-route-tab>
          <q-separator></q-separator>
          <q-route-tab
            v-if="!$store.state.condensedTabs && !smallScreen"
            style="padding: 10px"
            to="/tab3"
            name="tab3"
            @click="this.mangroveLayer = 'intense'"
          >
            <q-icon name="bar_chart" size="sm"></q-icon>
            2071 - 2100 <br />
            SSP5 - 8.5</q-route-tab
          >
          <q-route-tab
            v-if="$store.state.condensedTabs || smallScreen"
            style="padding: 10px"
            to="/tab3"
            name="tab3"
            @click="this.mangroveLayer = 'intense'"
          >
            <q-icon name="bar_chart" size="lg"></q-icon>
          </q-route-tab>
          <q-separator></q-separator>

          <q-route-tab
            v-if="!$store.state.condensedTabs && !smallScreen"
            style="padding: 10px"
            to="/layers"
            name="layers"
            @click="this.mangroveLayer = 'support'"
          >
            <q-icon name="public" size="sm"></q-icon>
            Supporting <br />
            Layers</q-route-tab
          >
          <q-route-tab
            v-if="$store.state.condensedTabs || smallScreen"
            style="padding: 10px"
            to="/layers"
            name="layers"
            @click="this.mangroveLayer = 'support'"
          >
            <q-icon name="public" size="lg"></q-icon>
          </q-route-tab>
          <q-separator></q-separator>
        </q-tabs>
      </template> -->

    <!-- <template v-slot:after> -->
    <!-- <q-tab-panels v-model="tab" animated vertical keep-alive> -->
    <q-tab-panel name="tab1" class="q-pa-none">
      <q-scroll-area id="" class="panel panelM" :thumb-style="{ display: 'none !important' }">
        <div class="">
          <keep-alive><tab1></tab1></keep-alive>
        </div>
      </q-scroll-area>
    </q-tab-panel>

    <!-- <q-tab-panel name="tab2" class="q-pr-none q-pl-lg q-pt-lg q-pb-lg">
        <q-scroll-area id="" class="panel panelM" :thumb-style="{ width: '7px' }">
          <div class="q-mr-lg">
            <keep-alive><tab2></tab2></keep-alive>
          </div>
        </q-scroll-area>
      </q-tab-panel>

      <q-tab-panel name="tab3" class="q-pr-none q-pl-lg q-pt-lg q-pb-lg">
        <q-scroll-area id="" class="panel panelM" :thumb-style="{ width: '7px' }">
          <div class="q-mr-lg">
            <keep-alive><tab3></tab3></keep-alive>
          </div>
        </q-scroll-area>
      </q-tab-panel>

      <q-tab-panel name="layers" class="q-pr-none q-pl-lg q-pt-lg q-pb-lg">
        <q-scroll-area id="" class="panel panelM" :thumb-style="{ width: '7px' }">
          <div class="q-mr-lg">
            <keep-alive><sup-layers></sup-layers></keep-alive>
          </div>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels> -->
    <!-- </template> -->
    <!-- </q-splitter> -->
  </div>
</template>

<script>
import tab3 from '../AppTools/tab3.vue'
import tab1 from '../AppTools/tab1.vue'
import tab2 from '../AppTools/tab2.vue'
import SupLayers from '../AppTools/Layers.vue'

export default {
  name: 'ThePanelTabsVertical',
  components: {
    tab1,
    tab2,
    tab3,
    SupLayers
  },
  data() {
    return {
      tab: 'supporting',
      splitterModel: this.$q.screen.lt.sm ? 55 : 100
    }
  },
  computed: {
    smallScreen() {
      return this.$q.screen.lt.sm
    },
    mangroveLayer: {
      get() {
        return this.$store.state.mangroveLayer
      },
      set(value) {
        this.$store.commit('updateMangroveLayer', value)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel {
  height: calc(100vh - 80px);
}

@media screen and (max-width: 700px) {
  .panel {
    height: 400px;
  }
}
</style>
