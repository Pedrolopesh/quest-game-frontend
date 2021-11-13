<template>
  <div class="home">

        <!-- <AppBar/> -->

        <v-card class="form-container p20 ac mt-20">
          <div v-if="!confirmPinCode">

            <h2 class="alg-txt-c mb-5">Informações Do Jogador</h2>

            <v-text-field
              v-model="nickname"
              :counter="50"
              label="nickname"
              outlined
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              label="e-mail"
              outlined
              required
            ></v-text-field>

            <div align="center">
                <v-btn :disabled="!nickname || !email" dark color="orange" outlined @click="registerPlayer()">Jogar</v-btn>
            </div>


          </div>

          <div v-else>
            <v-text-field
              v-model="pinCode"
              label="PIN"
              :counter="6"
              color="orange"
              outlined
              required
            ></v-text-field>

            <div align="center">
                <v-btn :disabled="!nickname || !email" dark color="orange" outlined @click="confirmPin()">Confirmar</v-btn>
            </div>
          </div>

            <InfoPlayRulesDialog />
        </v-card>



  </div>
</template>

<script>
// @ is an alias to /src
import AppBar from '../../components/AppBar.vue'
import InfoPlayRulesDialog from '../../components/InfoPlayRulesDialog.vue'

export default {
  name: 'Home',
  components: {
    AppBar,
    InfoPlayRulesDialog
  },

  data:() => ({
    nickname:'',
    email:'',
    pinCode:'',
    dialogStateProps:false,
    SavedPlayer: JSON.parse(localStorage.getItem('player')),
    confirmPinCode:false
  }),

  created(){
    this.setInputs();
  },

  methods:{
    async registerPlayer(){

      let body = {
        nickname:this.nickname,
        email:this.email
      }

      const player = await this.$http.post(this.$url + '/player/create', body)

        if(!player.data || player.status != 201){
          this.$vs.notification({ duration: 9000, progress: 'auto', color:'success', title: 'Seu usuário foi encontrado, seja bem vindo de volta!',})
          localStorage.setItem('player', JSON.stringify(player.data));
          this.$router.push('/SelectSubject')
          // this.requestPinCode()
          // this.confirmPinCode = true
        }
        else{
          localStorage.setItem('player', JSON.stringify(player.data));
          this.$vs.notification({ duration: 9000, progress: 'auto', color:'success', title: 'Sucesso ao cadastrar, Bem vindo Jogador: ' + player.data.nickname})
          this.$router.push('/SelectSubject')
          // this.requestPinCode()
          // this.confirmPinCode = true
        }

    },

    async requestPinCode() {
      let body = {
        nickname:this.nickname,
        email:this.email
      }

      const playerMail = await this.$http.post(this.$url + '/player/request/confirm', body)

      if(!playerMail.data.success && !playerMail.data.info){
        return this.$vs.notification({ duration: 9000, progress: 'auto', color:'danger', title: 'Error ao confirmar pin, tente novamente!'})
      }else {
        this.$vs.notification({ duration: 9000, progress: 'auto', color:'success', title: 'Entre no seu email para confirmar sua conta'})
      }
    },

    showInfoDialog(){
      this.dialogStateProps = true;
    },

    changeDialogStateProps(){
      this.dialogStateProps = false;
    },

    setInputs(){
      if(this.SavedPlayer){
        this.nickname = this.SavedPlayer.player.nickname
        this.email = this.SavedPlayer.player.email
      }
    },

    async confirmPin(){
      let body = {
        email:this.email,
        code:this.pinCode
      }
      const resp = await this.$http.post(this.$url+'/player/confirm', body).catch(err => {
        console.log(err)
        return this.$vs.notification({ duration: 9000, progress: 'auto', color:'danger', title: 'Error ao confirmar pin, tente novamente!'})
      })


      if(resp.data.success && resp.data.message === 'corrent_pin'){
        this.$vs.notification({ duration: 9000, progress: 'auto', color:'success', title: 'sucesso ao confirmar jogador, Bem vindo ' + resp.data.player.nickname,})
        this.$router.push('/SelectSubject')
      }
    }
  }
}
</script>

<style lang="scss">
  .form-container{
    max-width: 25% !important;
    width: 100%;
  }
</style>