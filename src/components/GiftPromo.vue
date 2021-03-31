<template>
  <div class="p20">

    <div class="alg-txt-c">
        <h1 class="mt-3 mb-3" v-if="selectedImage === 'spotify-logo.png'">Cartão promocional Spotify</h1>
        <h1 class="mt-3 mb-3" v-if="selectedImage === 'netflix-logo.svg'">Cartão promocional Netflix</h1>
        <h1 class="mt-3 mb-3" v-if="selectedImage === 'disney-plus-logo-1.png'">Cartão promocional Disney</h1>



        <img :src="'./promos/'+imageData[randomPromo]" alt="" class="image-size-promo">
        
        <div class="mt-5">
            <h3 v-if="selectedImage !== 'spotify-logo.png'" class="image-size-promo d-block ac">
                Parabén, você ganhou um cartão promocional de R$50 para desfrutar de filmes e séries, aproveite !
            </h3>

            <h3 v-if="selectedImage === 'spotify-logo.png'" class="image-size-promo d-block ac">
                Parabén, você ganhou um cartão promocional de R$50 para desfrutar de musicas e podcasts, aproveite !
            </h3>
            <h1 class="mt-4 mb-4">R$ 50,00</h1>

            <span class="clr-disabled"> Essa promoção é meramente illustrativa e não é válida, porém será adicionado na proxima versão do jogo</span>
        </div>

        

    </div>

  </div>
</template>

<script>
export default {
    data:() => ({
        imageData:['spotify-logo.png', 'netflix-logo.svg', 'disney-plus-logo-1.png'],
        randomPromo:0,
        selectedImage:'',
    }),
    
    created(){
        this.choosePromo()
    },

    methods:{
        async choosePromo(){
            const randomPromo = (Math.random() * this.imageData.length-1) + 1
            this.randomPromo = parseInt(randomPromo)
            this.selectedImage = this.imageData[this.randomPromo]
        }
    }
}
</script>

<style lang="scss">
    .image-size-promo{
        max-width: 100%;
        width: 40%;

        @media screen and (max-width: 700px){
            max-width: 100%;
            width: 100%;
        }
    }
</style>