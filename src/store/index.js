import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { axios } from '../main'

export default new Vuex.Store({
  state: {
    podiumItens:'',
  },
  getters: {
    podiumItens: state => state.podiumItens,
  },
  mutations: {
    setPodiumItems(state, data){
      state.podiumItens = data
    },
  },
  actions: {
    async getPodium(context){
      console.log('vuex methods called')
      const podium = await axios.get(process.env.VUE_APP_PROD_URL + '/podium')
      if(podium.data.success && podium.data !== undefined){
        context.commit('setPodiumItems', podium.data.message)
      }
    }
  },
  modules: {
  }
})
