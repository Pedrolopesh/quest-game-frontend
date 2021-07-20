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
    setPodiumItens(state, data){
      state.podiumItens = data
    },
  },
  actions: {
    async getPodium(context){
      console.log('vuex methods called')
      const podium = await axios.get(process.env.VUE_APP_PROD_URL + '/podium')
      console.log(podium)
      // context.setPodiumItens(podium)
    }
  },
  modules: {
  }
})
