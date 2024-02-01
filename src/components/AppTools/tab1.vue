<template>
  <div>
    <q-expansion-item
      label="Supporting Layers"
      default-opened
      dense
      :header-style="{ textAlign: 'center', fontWeight: 'bold' }"
    >
      <div v-for="option in supportingOptions" :key="option" class="q-mx-lg">
        <q-checkbox
          size="sm"
          v-model="this.supportingSelection"
          :val="option.value"
          :label="option.label"
          toggle-order="tf"
        ></q-checkbox>
      </div>
    </q-expansion-item>
  </div>
  <hr />
  <div>
    <q-expansion-item
      label="Climate Modeling"
      dense
      :header-style="{ textAlign: 'center', fontWeight: 'bold' }"
    >
      <p class="q-mx-lg q-my-sm" style="text-decoration: underline">Mangrove Data</p>
      <div v-for="option in layerOptions" :key="option" class="q-mx-lg">
        <q-radio
          size="sm"
          v-model="this.layerSelection"
          :val="option.value"
          :label="option.label"
        ></q-radio>
      </div>
      <p class="q-mx-lg q-my-sm" style="text-decoration: underline">Climatic Drivers</p>
      <div v-for="option in climaticOptions" :key="option" class="q-mx-lg">
        <q-radio
          size="sm"
          v-model="this.climaticSelection"
          :val="option.value"
          :label="option.label"
        ></q-radio>
      </div>
      <div v-if="this.layerSelection !== '' || this.climaticSelection !== 'None'">
        <p class="q-mx-lg q-my-sm" style="text-decoration: underline">
          Climate Change Intensity Over Time
        </p>
        <q-slider
          v-model="this.sliderValue"
          :min="0"
          :max="2"
          :step="1"
          dense
          :marker-labels="sliderLabels"
          style="width: 70%; margin: 15px auto; display: block"
        />
      </div>
    </q-expansion-item>
  </div>
  <hr />
  <div>
    <q-expansion-item
      label="Social Perspectives"
      dense
      :header-style="{ textAlign: 'center', fontWeight: 'bold' }"
    >
      <div v-for="option in socialOptions" :key="option" class="q-mx-lg">
        <q-radio
          size="sm"
          v-model="this.socialSelection"
          :val="option.value"
          :label="option.label"
        ></q-radio>
      </div>
    </q-expansion-item>
  </div>
</template>

<script>
import CreateTab from '../UI/CreateTab.vue'

export default {
  name: 'tab1',
  components: { CreateTab },
  data() {
    return {
      layerOptions: [
        {
          label: 'Mangrove Presence',
          value: 'Mangrove Presence',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Mangrove Relative Abundance',
          value: 'Mangrove Relative Abundance',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Wetland Vegetation Height',
          value: 'Wetland Vegetation Height',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Above Ground Biomass',
          value: 'Above Ground Biomass',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        }
      ],
      climaticOptions: [
        {
          label: 'None',
          value: 'None',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Temperature',
          value: 'Temperature',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Precipitation',
          value: 'Precipitation',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        }
      ],
      supportingOptions: [
        // {
        //   label: 'None',
        //   value: 'None',
        //   desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        //   showDesc: false
        // },
        {
          label: 'Mangrove Presence/Absence Grid',
          value: 'Mangrove Presence/Absence Grid',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Mangrove Protection Status',
          value: 'Mangrove Protection Status',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Tidal Wetland Complexes',
          value: 'Tidal Wetland Complexes',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Inland Wetland Migration Space',
          value: 'Inland Wetland Migration Space',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        }
      ],
      socialOptions: [
        {
          label: 'None',
          value: 'None',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          showDesc: false
        },
        {
          label: 'Social Survey Counties',
          value: 'Social Survey Counties',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
      ],
      sliderLabels: [
        { value: 0, label: 'Recent' },
        { value: 1, label: 'Moderate' },
        { value: 2, label: 'Severe' }
      ]
    }
  },
  computed: {
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
    sliderValue: {
      get() {
        return this.$store.state.sliderValue
      },
      set(value) {
        this.$store.commit('updateSliderValue', value)
      }
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#print-header {
  position: absolute;
  top: 0px;
  height: 30px;
}
#print-footer {
  position: absolute;
  bottom: 0px;
  height: 30px;
}
#print-map {
  position: absolute;
  top: 30px;
  height: 500px;
}
</style>
