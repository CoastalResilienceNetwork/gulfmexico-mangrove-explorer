<template>
  <div>
    <q-expansion-item
      label="Mangrove Distribution in the SE United States"
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

        <icon-button
          v-if="!option.showDesc"
          type="info"
          method="show-resource"
          @show-resource="option.showDesc = true"
          style="margin: 5px"
        ></icon-button>
        <icon-button
          v-if="option.showDesc"
          type="close"
          method="hide-resource"
          @hide-resource="option.showDesc = false"
          style="margin: 5px"
        ></icon-button>
        <div v-for="desc in this.layerDescriptions" :key="desc">
          <div v-if="option.showDesc == true">
            <div v-if="desc.title.includes(option.value) == true || desc.title == option.label">
              <div v-html="desc.description" style="font-size: small"></div>
            </div>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </div>
  <hr />
  <div>
    <q-expansion-item
      label="Modeling Current and Future Mangroves"
      default-opened
      dense
      :header-style="{ textAlign: 'center', fontWeight: 'bold' }"
    >
      <div
        v-if="this.layerSelection !== '' || this.climaticSelection !== 'None'"
        style="background-color: rgb(25, 25, 25, 0.1); border-radius: 3px"
      >
        <div class="q-mx-lg q-my-sm">
          <div style="display: flex; margin: auto; width: fit-content">
            <p style="text-decoration: underline">
              <i>Climate change intensity over time</i>
            </p>
            <icon-button
              v-if="!this.showInfo"
              type="info"
              method="show-resource"
              @show-resource="this.showInfo = true"
              style="margin: 5px"
            ></icon-button>
            <icon-button
              v-if="this.showInfo"
              type="close"
              method="hide-resource"
              @hide-resource="this.showInfo = false"
              style="margin: 5px"
            ></icon-button>
          </div>
          <div v-if="this.showInfo == true">
            <p style="font-size: small">
              Warming winter temperatures due to global climate change are expected to enable the
              range expansion of freeze-sensitive mangrove plants at the expense of freeze-tolerant
              salt marsh plants. The transition from grass-dominated marshes to woody-plant
              dominated mangrove forests has the potential to impact some of the ecosystem goods and
              services provided by coastal wetlands.<br />
              Here, we estimated changes in mangrove distribution and coastal wetland vegetation
              structure in the southeastern United States using known climate-ecological
              relationships, recent climate data for the period 1981-2010, and future projected
              climate data for the period 2071-2100. We quantified potential changes in mangrove
              presence, mangrove relative abundance, coastal wetland vegetation height, and coastal
              wetland vegetation aboveground biomass under two
              <a
                href="https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Chapter04.pdf"
                target="_blank"
                >Shared Socio-economic Pathway scenarios:</a
              >
              a future with moderate climate change (SSP2-4.5) and a future with severe climate
              change (SSP5-8.5), which correspond to intermediate and high greenhouse gas emissions
              scenarios, respectively.
            </p>
          </div>
        </div>

        <q-slider
          v-model="this.sliderValue"
          :min="0"
          :max="2"
          :step="1"
          :marker-labels="sliderLabels"
          style="
            width: 70%;
            margin: 15px auto;
            padding-left: 0px;
            padding-right: 0px;
            display: block;
          "
        />
      </div>
      <p class="q-mx-lg q-my-sm" style="text-decoration: underline">
        Climatic Drivers of Mangrove Change
      </p>
      <div v-for="option in climaticOptions" :key="option" class="q-mx-lg">
        <q-checkbox
          size="sm"
          v-model="this.climaticSelection"
          :val="option.value"
          :label="option.label"
          toggle-order="tf"
          @update:model-value="this.climaticSelection = this.climaticSelection.slice(-1)"
        ></q-checkbox>

        <icon-button
          v-if="!option.showDesc"
          type="info"
          method="show-resource"
          @show-resource="option.showDesc = true"
          style="margin: 5px"
        ></icon-button>
        <icon-button
          v-if="option.showDesc"
          type="close"
          method="hide-resource"
          @hide-resource="option.showDesc = false"
          style="margin: 5px"
        ></icon-button>
        <div v-for="desc in this.layerDescriptions" :key="desc">
          <div v-if="option.showDesc == true">
            <div
              v-if="
                desc.title.includes(option.value + ' ' + this.intensity) == true ||
                desc.title == option.label
              "
            >
              <div v-html="desc.description" style="font-size: small"></div>
            </div>
          </div>
        </div>
      </div>
      <p class="q-mx-lg q-my-sm" style="text-decoration: underline">Current and Future Mangroves</p>
      <div v-for="option in layerOptions" :key="option" class="q-mx-lg">
        <q-checkbox
          size="sm"
          v-model="this.layerSelection"
          :val="option.value"
          :label="option.label"
          toggle-order="tf"
          @update:model-value="this.layerSelection = this.layerSelection.slice(-1)"
        ></q-checkbox>

        <icon-button
          v-if="!option.showDesc"
          type="info"
          method="show-resource"
          @show-resource="option.showDesc = true"
          style="margin: 5px"
        ></icon-button>
        <icon-button
          v-if="option.showDesc"
          type="close"
          method="hide-resource"
          @hide-resource="option.showDesc = false"
          style="margin: 5px"
        ></icon-button>
        <div v-if="option.showDesc == true">
          <div v-for="desc in this.layerDescriptions" :key="desc">
            <div v-if="desc.title.includes(option.value + ' ' + this.intensity) == true">
              <p v-html="desc.description" style="font-size: small"></p>
            </div>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </div>
  <hr />
  <div>
    <q-expansion-item
      label="Policy and Social Context"
      default-opened
      dense
      :header-style="{ textAlign: 'center', fontWeight: 'bold' }"
    >
      <div class="q-mx-lg q-my-sm">
        <div>
          We researched mangrove specific policies in each state to determine which Gulf of Mexico
          and Southeast US States explicitly protect mangroves from being destroyed or removed.
        </div>
      </div>
      <div v-for="option in stateLawLayer" :key="option" class="q-mx-lg">
        <q-checkbox
          size="sm"
          v-model="this.socialSelection"
          :val="option.value"
          :label="option.label"
          toggle-order="tf"
          @update:model-value="this.socialSelection = this.socialSelection.slice(-1)"
        ></q-checkbox>

        <icon-button
          v-if="!option.showDesc"
          type="info"
          method="show-resource"
          @show-resource="option.showDesc = true"
          style="margin: 5px"
        ></icon-button>
        <icon-button
          v-if="option.showDesc"
          type="close"
          method="hide-resource"
          @hide-resource="option.showDesc = false"
          style="margin: 5px"
        ></icon-button>
        <div v-if="option.showDesc == true">
          <div v-for="desc in this.layerDescriptions" :key="desc">
            <div v-if="desc.title.includes(option.value) == true">
              <p v-html="desc.description" style="font-size: small"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="q-mx-lg q-my-sm">
        <div style="display: flex">
          <!-- <icon-button
            v-if="!this.showInfo"
            type="info"
            method="show-resource"
            @show-resource="this.showInfo = true"
            style="margin: 5px"
          ></icon-button>
          <icon-button
            v-if="this.showInfo"
            type="close"
            method="hide-resource"
            @hide-resource="this.showInfo = false"
            style="margin: 5px"
          ></icon-button> -->
        </div>
        <div>
          We surveyed four communities in mangrove expansion areas (Corpus Christi, Galveston,
          Panama City Beach, and Cedar Key) to explore how people in these communities perceive
          mangroves changing and how they think the change should be managed.
        </div>
      </div>
      <div v-for="option in socialOptions" :key="option" class="q-mx-lg">
        <q-checkbox
          size="sm"
          v-model="this.socialSelection"
          :val="option.value"
          :label="option.label"
          toggle-order="tf"
          @update:model-value="this.socialSelection = this.socialSelection.slice(-1)"
        ></q-checkbox>
      </div>
      <!-- <div
        v-if="
          this.socialSelection ==
          'How do people in mangrove expansion areas perceive the benefits provided by marshes versus mangroves?'
        "
        class="q-my-sm"
      >
        <div v-for="option in subSocialOptions" :key="option" class="q-mx-xl">
          <q-checkbox
            size="sm"
            v-model="this.subSocialSelection"
            :val="option.value"
            :label="option.label"
            toggle-order="tf"
            @update:model-value="this.subSocialSelection = this.subSocialSelection.slice(-1)"
          ></q-checkbox>
        </div>
      </div> -->
    </q-expansion-item>
  </div>
</template>

<script>
import CreateTab from '../UI/CreateTab.vue'
import IconButton from '../UI/IconButton.vue'

export default {
  name: 'tab1',
  components: { CreateTab, IconButton },
  data() {
    return {
      layerOptions: [
        {
          label: 'Mangrove Presence',
          value: 'Mangrove Presence',
          showDesc: false
        },
        {
          label: 'Mangrove Relative Abundance',
          value: 'Mangrove Relative Abundance',
          showDesc: false
        },
        {
          label: 'Wetland Vegetation Height',
          value: 'Wetland Vegetation Height',
          showDesc: false
        },
        {
          label: 'Aboveground Biomass',
          value: 'Aboveground Biomass',
          showDesc: false
        }
      ],
      climaticOptions: [
        {
          label: 'Temperature',
          value: 'Temperature',
          showDesc: false
        },
        {
          label: 'Precipitation',
          value: 'Precipitation',
          showDesc: false
        }
      ],
      supportingOptions: [
        {
          label: 'Mangrove Presence and Absence (based on expert input 2023)',
          value: 'Mangrove Presence and Absence (based on expert input 2023)',
          showDesc: false
        },
        {
          label: 'Mangrove Expansion Zones',
          value: 'Mangrove Expansion Zones',
          showDesc: false
        },
        {
          label: 'Potential Change in Mangrove Presence by 2100',
          value: 'Potential Change in Mangrove Presence by 2100',
          showDesc: false
        }
      ],
      socialOptions: [
        // {
        //   label: 'Where are mangroves protected by state law?',
        //   value: 'Where are mangroves protected by state law?',
        // },
        {
          label: 'What do people think is driving mangrove change in expansion areas?',
          value: 'What do people think is driving mangrove change in expansion areas?',
          id: 27
        },
        {
          label: 'What actions do people think need to be taken for mangroves in expansion areas?',
          value: 'What actions do people think need to be taken for mangroves in expansion areas?',
          id: 28
        }
        // {
        //   label:
        //     'How do people in mangrove expansion areas perceive the benefits provided by marshes versus mangroves?',
        //   value:
        //     'How do people in mangrove expansion areas perceive the benefits provided by marshes versus mangroves?'
        // }
      ],
      stateLawLayer: [
        {
          label: 'Where are mangroves protected by state law?',
          value: 'Where are mangroves protected by state law?',
          showDesc: false
        }
      ],
      subSocialOptions: [
        {
          label: 'Perceptions are consistent that mangroves are better',
          value: 'Perceptions are consistent that mangroves are better'
        },
        {
          label: 'Perceptions are consistent that marshes are better',
          value: 'Perceptions are consistent that marshes are better'
        },
        {
          label: 'Perceptions of whether marshes or mangroves are better is consistently mixed',
          value: 'Perceptions of whether marshes or mangroves are better is consistently mixed'
        },
        {
          label: 'Perceptions of whether marshes or mangroves are better vary by location',
          value: 'Perceptions of whether marshes or mangroves are better vary by location'
        }
      ],
      sliderLabels: [
        { value: 0, label: 'Recent' },
        { value: 1, label: 'Future Moderate' },
        { value: 2, label: 'Future Severe', style: { width: '30%' } }
      ],
      showInfo: false,
      intensity: '(Recent Climate)'
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
    layerDescriptions() {
      return this.$store.state.layerDescriptions
    }
  },
  methods: {
    changeIntensity(value) {
      if (value == 0) {
        this.intensity = '(Recent Climate)'
      } else if (value == 1) {
        this.intensity = '(Future Moderate Climate)'
      } else if (value == 2) {
        this.intensity = '(Future Severe Climate)'
      }
    }
  },
  watch: {
    sliderValue() {
      this.changeIntensity(this.sliderValue)
    }
  }
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
