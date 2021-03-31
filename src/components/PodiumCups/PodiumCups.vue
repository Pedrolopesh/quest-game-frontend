<template>
  <div>

    <v-card class="p20 ac" max-width="800">
      <div v-if="podiumItems" class="d-flex container-cup-podiums">

        <div class="alg-txt-c mt-2 mb-5">
          <h2> 2ª Lugar </h2>
          <img class="home-img-size" src="../../assets/img/cup_2.png" alt="Winner 1">
          <div class="alg-txt-c">
            <v-chip color="orange" outlined class="mb-2" v-if="podiumItems[1].playerScore">{{ podiumItems[1].playerScore }} Pontos</v-chip>

            <span class="cup-title cup-title-theme-2">
              <h3 class="mb-0" v-if="podiumItems[1].playerNickname">{{ podiumItems[1].playerNickname }}</h3>
            </span>
          </div>
        </div>

        <div class="alg-txt-c mt-2 mb-5">
          <h2> 1ª Lugar </h2>
          <img class="home-img-size" src="../../assets/img/cup_1.png" alt="Winner 1">
          <div class="alg-txt-c">
            <v-chip color="orange" outlined class="mb-2" v-if="podiumItems[0].playerScore">{{ podiumItems[0].playerScore }} Pontos</v-chip>

            <span class="cup-title cup-title-theme-1">
              <h3 class="mb-0" v-if="podiumItems[0].playerNickname">{{ podiumItems[0].playerNickname }}</h3>
            </span>
          </div>
        </div>

        <div class="alg-txt-c mt-2 mb-5">
          <h2> 3ª Lugar </h2>
          <img class="home-img-size" src="../../assets/img/cup_3.png" alt="Winner 1">
          <div class="alg-txt-c">
            <v-chip color="orange" outlined class="mb-2" v-if="podiumItems[2].playerScore">{{ podiumItems[2].playerScore }} Pontos</v-chip>

            <span class="cup-title cup-title-theme-3">
              <h3 class="mb-0" v-if="podiumItems[2].playerNickname">{{ podiumItems[2].playerNickname }}</h3>
            </span>
          </div>
        </div>

      </div>
    </v-card>
    
  </div>
</template>
<script>
import svg from '../../assets/svgs'
export default {
    props:['podiumItems'],
    data:() => ({
        svg
    })
}
</script>

<style lang="scss">
    .icon-size-30{
        svg{
            max-width: 100%;
            width: 100px !important;
        }
    }
</style>