<template>
  <div id="app_p">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed:{
    ...mapGetters({
      podiumItens: 'podiumItens'
    })
  },

  methods:{
    ...mapActions({
      getPodium: 'getPodium'
    })
  },

  created(){
    this.getPodium()
  },

}
</script>