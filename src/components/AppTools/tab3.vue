<template>
  <create-tab
    v-for="option in layerOptions"
    :key="option"
    :option="option"
    type="intense"
  ></create-tab>
</template>

<script>
import CreateTab from '../UI/CreateTab.vue'

export default {
  name: 'tab3',
  components: { CreateTab },
  data() {
    return {
      layerOptions: [
        {
          label: 'Mangrove Presence (2071 - 2100) SSP5 - 8.5',
          value: 'Mangrove Presence (2071 - 2100) SSP5 - 8.5',
          desc: '',
          slider: false,
          id: 6,
          showDesc: false
        },
        {
          label: 'Mangrove Abundance (2071 - 2100) SSP5 - 8.5',
          value: 'Mangrove Abundance (2071 - 2100) SSP5 - 8.5',
          desc: '',
          slider: false,
          id: 9,
          showDesc: false
        },
        {
          label: 'Temperature (2071 - 2100) - 8.5',
          value: 'Temperature (2071 - 2100) - 8.5',
          desc: '',
          slider: false,
          id: 14,
          showDesc: false
        },
        {
          label: 'Precipitation (2071 - 2100) - 8.5',
          value: 'Precipitation (2071 - 2100) - 8.5',
          desc: '',
          slider: false,
          id: 18,
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
