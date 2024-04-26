<template>
  <header class="print-hide">
    <!-- <q-btn flat icon="menu" color="dark" padding="none" class="q-mr-md">
      <q-menu>
        <q-list style="min-width: 100px" dense>
          <q-item
            clickable
            v-close-popup
            tag="a"
            target="_blank"
            href="https://www.nature.org/en-us/what-we-do/our-priorities/protect-water-and-land/land-and-water-stories/protecting-our-ocean/?vu=r.v_marine"
          >
            <q-item-section>Link</q-item-section>
            <q-item-section side>
              <q-icon name="link" size="xs"></q-icon>
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-item clickable v-close-popup tag="a" target="_blank" href="">
            <q-item-section>Link</q-item-section>
            <q-item-section side>
              <q-icon name="link" size="xs"></q-icon>
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-item clickable v-close-popup tag="a" target="_blank" href="">
            <q-item-section>Link</q-item-section>
            <q-item-section side>
              <q-icon name="link" size="xs"></q-icon>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn> -->
    <span class="">
      <span class="text-dark text-bold">Coastal Resilience</span>
      <span class="text-bold text-subtitle1"> Mangrove Explorer</span>
    </span>
    <div @click="splashDiv = true" v-if="splashDiv == false">
      <a
        style="text-color: white; border: none !important; font-size: 20px; cursor: pointer"
        label="About"
        >About</a
      >
    </div>
  </header>

  <!-- INTRO DIALOG -->
  <!-- <q-dialog v-model="showHelp" :persistent="persistent" maximized> -->
  <!-- <div class="row">
      <div class="col-6 overlaydiv">
        <q-img src="mangrove.jpg" style="height: 100%"></q-img>
        <div
          class="absolute-left q-pa-xl text-h6 text-bold"
          style="width: 50%; background-color: rgb(250, 250, 250, 0.5)"
        >
          <span class="text-h4 text-dark text-bold">About Mangrove Explorer</span>
          <q-separator></q-separator>
          Welcome to the Mangrove Explorer Mapping Tool. The Mangrove Explorer was created by a
          multidisciplinary team of scientists and researchers to share cutting edge research
          related to the future distribution of mangroves in the continental United States. The
          northern limit of mangroves in this region is typically limited by the frequency and
          intensity of freeze events that damage or kill mangroves. However, as climate change
          reduces the number of freeze events, mangroves are establishing in areas north of their
          historic range. The Mangrove Explorer depicts the most current (2021) distribution of
          mangroves as well as the projections of the future distribution and characteristics of
          mangroves under future temperature and precipitation conditions. Other factors that will
          influence the future distribution, such as policy and coastal management, are also
          explored on the tool. It is extremely important to note that these projections only depict
          where mangroves could expand with warming temperatures and do NOT consider the devastating
          impacts of sea level rise on all coastal wetlands (including mangroves). Future work is
          needed to address this impact in the Mangrove Explorer. For now, the maps provide the user
          with a glimpse into the future where mangroves will likely expand across the majority of
          the upper Gulf of Mexico and up the east coast into the Carolinas by the Year 2100.
        </div>
      </div>
      <div class="col-6 bg-white text-left q-pa-xl" style="height: 100%">
        <p class="text-dark text-h6 q-mt-xl">LOGIN TO VIEW SITE:</p>
        <q-input
          v-model="password"
          filled
          :type="isPwd ? 'password' : 'text'"
          class=""
          @keydown.enter.prevent="loginUser"
          hint="Enter password"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn color="dark" @click="loginUser" class="q-mt-md">LOGIN</q-btn>
      </div>
    </div> -->
  <!-- <q-dialog v-model="showHelp" :persistent="persistent">
    <q-card style="height: 100vh; max-width: 100vw; display: block; position: fixed; right: 0px">
      <q-toolbar class="bg-white">
        <q-toolbar-title>
          <span class="text-primary text-center"
            ><strong>About Mangrove Explorer</strong>
          </span></q-toolbar-title
        >
      </q-toolbar>
      <div>
        <q-img src="bg_image.jpg" style="height: 90vh; width: 60vw">
          <div
            class="absolute-full text-subtitle2 flex flex-center"
            style="background-color: rgb(220, 220, 220, 0.5)"
          >
            <div style="font-weight: 450; font-size: x-large; padding: 25px">
              Welcome to the Mangrove Explorer Mapping Tool. The Mangrove Explorer was created by a
              multidisciplinary team of scientists and researchers to share cutting edge research
              related to the future distribution of mangroves in the continental United States. The
              northern limit of mangroves in this region is typically limited by the frequency and
              intensity of freeze events that damage or kill mangroves. However, as climate change
              reduces the number of freeze events, mangroves are establishing in areas north of
              their historic range. <br />
              The Mangrove Explorer depicts the most current (2021) distribution of mangroves as
              well as the projections of the future distribution and characteristics of mangroves
              under future temperature and precipitation conditions. Other factors that will
              influence the future distribution, such as policy and coastal management, are also
              explored on the tool. It is extremely important to note that these projections only
              depict where mangroves could expand with warming temperatures and do NOT consider the
              devastating impacts of sea level rise on all coastal wetlands (including mangroves).
              Future work is needed to address this impact in the Mangrove Explorer. For now, the
              maps provide the user with a glimpse into the future where mangroves will likely
              expand across the majority of the upper Gulf of Mexico and up the east coast into the
              Carolinas by the Year 2100.
            </div>
          </div>
        </q-img>
      </div>
      <q-card-actions class="q-pb-none">
        <q-checkbox
          v-if="showUserOption"
          v-model="userHideDialogOptionMeramac"
          label="Do not show again"
        />
        <q-space />
        <q-btn flat label="OK" color="primary" @click="setUserChoice" v-close-popup />
      </q-card-actions>
      <div v-if="showUserOption" class="text-caption q-ml-md text-grey-7">
        *This dialog can be rerieved at any time by clicking the help button at the top of the
        screen
      </div>
    </q-card>
  </q-dialog> -->
  <!-- <q-card-actions class="q-pb-none">
    <q-checkbox
      v-if="showUserOption"
      v-model="userHideDialogOptionMeramac"
      label="Do not show again"
    />
    <q-space />
    <q-btn flat label="OK" color="primary" @click="setUserChoice" v-close-popup />
  </q-card-actions> -->
  <!-- <div v-if="showUserOption" class="text-caption q-ml-md text-grey-7">
    *This dialog can be rerieved at any time by clicking the help button at the top of the screen
  </div> -->
  <!-- </q-dialog> -->
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      showHelp: true,
      userHideDialogOptionMeramac: false,
      showUserOption: true,
      persistent: true,
      password: '',
      isPwd: true
    }
  },
  mounted() {
    //localStorage.userHideDialogOptionMeramac = '';
    if (localStorage.userHideDialogOptionMeramac == 'true') {
      this.showHelp = false
      this.showUserOption = false
      this.persistent = false
    }
  },

  methods: {
    loginUser() {
      if (this.password == 'Mangrove') {
        this.showHelp = false
        this.descriptionsComplete = true
      }
    },
    setUserChoice() {
      if (this.userHideDialogOptionMeramac == true) {
        localStorage.userHideDialogOptionMeramac = 'true'
        this.showUserOption = false
        this.persistent = false
        this.showHelp = false
        this.descriptionsComplete = true
      }
    }
  },

  computed: {
    descriptionsComplete: {
      get() {
        return this.$store.state.descriptionsComplete
      },
      set(value) {
        this.$store.commit('updateDescriptionsComplete', value)
      }
    },
    splashDiv: {
      get() {
        return this.$store.state.splashDiv
      },
      set(value) {
        this.$store.commit('updateSplashDiv', value)
      }
    }
  }
}
// removed from .header //
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Are+You+Serious&family=Carattere&family=Cookie&family=Merienda&display=swap');
header {
  background: var(--q-primary);
  height: 50px;
  color: white;
  font-size: 22px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--q-primary);
  position: relative;
  z-index: 10;
  display: flex;
}

.storymap {
  background: #fff;
  height: 50px;
  color: #000000;
  font-size: 25px;
  padding: 10px 20px;
  box-shadow: 0px 8px 8px -2px rgb(51 51 51 / 42%);
  position: relative;
  z-index: 10;
  display: flex;
  font-family: 'Merienda', cursive;
}

.q-img__content {
  background-color: rgba(255, 255, 255, 0.8);
}

header span {
  flex: 1;
  width: 700px;
  overflow: hidden;
  white-space: wrap;
  text-overflow: ellipsis;
}

header button {
  font-size: 15px;
}

@media screen and (max-width: 700px) {
  header {
    background: var(--q-primary);
    height: 30px;
    color: #fff;
    font-size: 14px;
    padding: 5px 10px;
    box-shadow: 0px 8px 8px -2px rgb(51 51 51 / 42%);
    position: relative;
    z-index: 10;
    display: flex;
  }
  header button {
    font-size: 12px;
  }
}
</style>
