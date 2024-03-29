<template>
  <div class="w-100 welcome full-height" style="background: #FFCB08; position: relative; height: 100vh; display: block">
    <div class="hello" style="height: 100%">
      <div class="container-full">
        <div class="logo">
          <img alt="mochimochi" src="img/theme/quizchii_yellow.png">
        </div>
        <div class="row ">
          <div class="content-wrapper text-start">
            <img id="hand-wave-static" alt="" src="img/theme/mochi_new.png">
            <div id="choose-start" style="align-self: center">
              <p id="memorize-title" style="color: rgba(91, 45, 17, 1); font-weight: bold; margin-bottom: 20px">
                Học tiếng Anh cùng QuizChii
              </p>
              <div class="div-submit-success mb-3">
                <button id="btn-start" class="btn-submit-success" @click="redirectToTests">Bắt đầu ngay</button>
              </div>
              <div class="div-submit-white" style="width: 320px">
                <button id="btn-has-account" class="btn-submit-white" style="width: 320px" @click="redirectToLogin">Mình
                  đã có tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style="position:absolute; left: -130px; top: 60%; width: 80%; max-width: 300px">
          <img src="img/theme/cloud8.png"
               style="width: 100%; opacity: 0.4">
        </div>
        <div style="position:absolute; right: -100px; top: 10px; width: 80%; max-width: 300px">
          <img src="img/theme/cloud8.png"
               style="width: 100%; opacity: 0.4">
        </div>
        <div style="position:absolute; right: -50px; bottom: 0; width: 80%; max-width: 300px">
          <img src="img/theme/cloud8.png"
               style="width: 100%; opacity: 0.4">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {store} from '@/store'
import SearchCustom from '@/components/SearchCustom.vue'

export default {
  name: 'Home',
  components: {SearchCustom},
  data() {
    return {
      store
    }
  },
  created() {
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login')
    },
    redirectToTests() {
      this.$router.push('/tests')
    }
  }
}
</script>
<style scoped>
.logo {
  position: absolute;
  top: 30px;
  left: 30px;

  img {
    height: 100px;
  }
}

.container-full {
  padding-top: 250px;
  height: 100%;
  position: relative;
  overflow: hidden
}

.content-wrapper {
  position: relative;
  display: inline-flex;
  height: 314px;
  width: 100%;
  gap: 50px;
  justify-content: center;
}

#choose-start {
  z-index: 1;
  margin: 0;
}

#hand-wave-static {
  width: 272px;
  height: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .container-full {
    padding-top: 100px;
  }

  .content-wrapper {
    flex-direction: column-reverse;
    justify-content: start;
    align-items: center;
  }

  #hand-wave-static {
    width: 140px;
  }

  .logo {
    top: 20px;
    left: 20px;

    img {
      height: 60px;
    }
  }
}
</style>
