<template>
    <div class="d-block mt-15">


        <v-card class="p20 ac" max-width="800">
        <div align="end" class="mt-5">
            <v-btn color="orange" outlined @click="dialog = true">PLACAR DE LIDERES</v-btn>
        </div>
        <div>
            <h1 class="alg-txt-c mt-2">Parabéns <span class="clr-red">{{ currentPlayer.player.nickname }}</span>, Missão cumprida!</h1>
        </div>

        <div v-if="positionPodium !== 0">
            <h2 class="alg-txt-c mt-5">{{ positionPodium }}ª Lugar no ranking de lideres</h2>
            <div class="container-podium mt-1 mb-5">
                <img v-if="positionPodium !== 0" class="medal-size" :src="'./medal_' + positionPodium + '.png'" alt="">
                <v-chip outlined color="orange">{{ currentPlayer.player.nickname }}</v-chip>
            </div>
        </div>

        <div class="mb-10 mt-5">
            <h2 class="alg-txt-c">pontuação do jogo atual: <v-chip>{{ toatalPoints }}</v-chip></h2>
            <h2 class="alg-txt-c mt-3" v-if="playerTotalScore !== ''">Pontuação total: <v-chip color="orange" outlined>{{ playerTotalScore }}</v-chip></h2>
        </div>

        <div align="center">
            <v-btn color="orange" outlined @click="redirectAndCleanGame">Retornar</v-btn>
        </div>

        </v-card>

    <v-dialog v-model="dialog" max-width="600">
        <v-card class="card-modal">

            <v-toolbar dark color="orange" class="dialog-toolbar">
                <v-toolbar-title>Informações gerais</v-toolbar-title>
                <v-spacer/>
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
            </v-toolbar>
                <PodiumCups />
          </v-card>
    </v-dialog>

    </div>
</template>
<script>
import svgs from '../../assets/svgs';
import PodiumCups from '../../components/PodiumCups/PodiumCups';

export default {
    components:{PodiumCups},
    data:() => ({
        svgs,
        currentPlayer: JSON.parse(localStorage.getItem('player')),
        toatalPoints: JSON.parse(localStorage.getItem('totalPoints')),
        positionPodium: 1,
        playerTotalScore:'',
        dialog: false,
    }),
    created(){
        this.getPodium()
    },
    methods:{
        async getPodium(){
            const podium = await this.$http.get(this.$url + '/podium')
            if(!podium.data || podium.status !== 200) console.log(podium)
            this.podiumItems = podium.data.message
            this.getPlayerPoints()
        },

        redirectAndCleanGame(){
            localStorage.removeItem('selectedMatter');
            localStorage.removeItem('stepQuestionForm');
            localStorage.removeItem('answeredForm1');
            localStorage.removeItem('answeredForm2');
            localStorage.removeItem('answeredForm3');
            this.$router.push('/Home')
        },

        async getPlayerPoints(){
            const playerId = this.currentPlayer.player._id
            const player = await this.$http.get(this.$url + `/player/${playerId}`).catch(err => { return err })
            if(!player) this.playerTotalScore = ''
            this.playerTotalScore = player.data.player.totalScore
            this.getPlayerPodium(player.data.player)
        },

        async getPlayerPodium(playerData){
            const playerPodium = await this.podiumItems.find((item) => { return item.playerNickname  === playerData.nickname})
            if(!playerPodium || playerPodium.length === '') this.positionPodium = 0
            console.log(playerPodium)

            // console.log(this.podiumItems[0].playerNickname)
            if(this.podiumItems[0].playerNickname === playerPodium.playerNickname) this.positionPodium = 1
            if(this.podiumItems[1].playerNickname === playerPodium.playerNickname) this.positionPodium = 2
            if(this.podiumItems[2].playerNickname === playerPodium.playerNickname) this.positionPodium = 3
        },

    }
}
</script>
<style lang="scss">

.medal-size{
    max-width: 100%;
    width: 2%;
}

.gameover{
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: 868px;
    width: 100%;
    max-width: 100%;
}
.return{
    border: 4px solid rgb(78, 26, 78);
    border-radius: 15px;
    width: 100px;
    padding: 10px;
    background: rgb(78, 26, 78);
    max-width: 100%;
    font-family: Arial, Helvetica, sans-serif;
    margin-left: 886px;
    margin-right: 100px;
    margin-top: auto;
    margin-bottom: auto;
    display: block;
    font-family:cursive;
    font-weight: lighter;
}
    
</style>