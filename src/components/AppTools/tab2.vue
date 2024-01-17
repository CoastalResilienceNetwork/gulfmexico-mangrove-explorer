<template>
  <create-tab
    v-for="option in layerOptions"
    :key="option"
    :option="option"
    type="current"
  ></create-tab>
</template>

<script>
import CreateTab from '../UI/CreateTab.vue'

export default {
  name: 'tab2',
  components: { CreateTab },
  data() {
    return {
      layerOptions: [
        {
          label: 'Mangrove Presence (2071 - 2100) SSP2 - 4.5',
          value: 'Mangrove Presence (2071 - 2100) SSP2 - 4.5',
          desc: '',
          slider: false,
          id: 5,
          showDesc: false
        },
        {
          label: 'Mangrove Abundance (2071 - 2100) SSP2 - 4.5',
          value: 'Mangrove Abundance (2071 - 2100) SSP2 - 4.5',
          desc: '',
          slider: false,
          id: 8,
          showDesc: false
        },
        {
          label: 'Temperature (2071 - 2100) - 4.5',
          value: 'Temperature (2071 - 2100) - 4.5',
          desc: '',
          slider: false,
          id: 13,
          showDesc: false
        },
        {
          label: 'Precipitation (2071 - 2100) - 4.5',
          value: 'Precipitation (2071 - 2100) - 4.5',
          desc: '',
          slider: false,
          id: 17,
          showDesc: false
        }
      ]
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
