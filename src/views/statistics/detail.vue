<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid" style="min-height: calc(100vh - 128px)">
      <div class="row justify-content-center" style="margin-top: 68px;min-height: calc(100vh - 128px)">
        <div class="col-3 _col-1 position-r">
          <div class="position-a" style="left: 0; top: 30%; width: 80%; max-width: 180px">
            <img src="https://learn.mochidemy.com/image/213202355_4534422609904130_3896387388468451408_n_1.png"
                 style="width: 100%">
          </div>
        </div>
        <div class="col-6 _col-2 main-center" style="min-height: 616px;">
          <div class="w-100 h-100">
            <div class="div-box h-100">
              <div class="div-box-card h-100">
                <div class="row">
                  <div class="col-2">
                    <img src="https://learn.mochidemy.com/image/57b6894cfec5a1aa4ab57f07d253d030.png"
                         style="width: 100%">
                  </div>
                  <div class="col-10">
                    <p class="title-box">
                      Chúc mừng bạn đã hoàn thành bài kiểm tra
                    </p>
                    <h4 class="note-title">
                      {{ result.testName }}
                    </h4>
                    <p class="title-box">
                      Thời gian nộp bài: {{ submitedTime_ }}
                    </p>
                    <p class="title-box">
                      Thời gian làm bài: {{ timeUsed }}
                    </p>
                    <div class="process-box">
                      <div :style="{width: percentage + '%'}" class="process-box-1 progress-count-proficiency"></div>
                    </div>
                    <p class="title-box" style="margin-top: 1rem">
                      Số câu đúng: {{ result.corrected }} / {{ result.resultDetails ? result.resultDetails.length : 0 }}
                      câu
                    </p>
                    <p class="title-box">
                      Điểm số: {{ Math.round(percentage * 100) / 100 }}
                    </p>
                    <p class="title-box">
                      Chi tiết kết quả:
                    </p>
                  </div>
                  <div class="col-8 offset-2">
                    <div class="row justify-content-center position-r">
                      <div class="w-100">
                        <div class="game-learn-2 game-learn-word">
                          <div class="text-center w-100">
                            <div class="title-game-2">
                              <i
                                  :class="currentQuestion.correctAnswer === currentQuestion.answered ? 'fa-check text-success' : 'fa-times text-danger'" aria-hidden="true" class="fa fa-check"
                                  style="margin-right: 20px">
                              </i>
                              <span v-html="currentQuestion.content"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="w-100">
                        <div class="box-answer-3">
                          <div class="text-center list-answer-3">
                            <div class="mb-0" style="font-size: 15px; font-weight: 550"
                                 v-html="currentQuestion.question">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-10">
                        <div class="div-answer-game" style="margin-top: 30px">
                          <div v-for="answerNo in [1,2,3,4]" :key="answerNo" class="bg-answer-item">
                            <div :class="{
                                  'answer-review-item-success': currentQuestion.correctAnswer === answerNo,
                                  'answer-review-item-error': currentQuestion.answered === answerNo && currentQuestion.correctAnswer !== answerNo,
                            }"
                                 class="answer-review-item item-game text-center">
                              <div class="mb-0" v-html="currentQuestion['answer' + answerNo]">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-3 _col-3 text-center position-r">
          <div class="position-a" style="right: 0; top: 0; width: 70%; max-width: 150px">
            <img src="https://learn.mochidemy.com/image/213202355_4534422609904130_3896387388468451408_n_2.png"
                 style="width: 100%">
          </div>
          <div class="position-a" style="right: 0; top: 50%; width: 80%">
            <img src="https://learn.mochidemy.com/image/213202355_4534422609904130_3896387388468451408_n.png.webp"
                 style="width: 100%">
          </div>
          <div v-if="result" class="result-questions">
            <h2 class="result-box-header result-box-title">Danh sách câu hỏi</h2>
            <div class="result-box-body">
              <div class="row g-0 result-box-list">
                <div v-for="(resultDetail, index) in result.resultDetails" :key="index"
                     :class="{
                        'correct': resultDetail.answered === resultDetail.correctAnswer,
                        'incorrect': resultDetail.answered !== resultDetail.correctAnswer,
                        'answering': index === currentQuestionIndex
                     }" class="result-box-span"
                     @click="goToQuestion(index)">
                  <div class="result-box-number">{{ index + 1 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BFormTags, BFormTag, BFormSelect } from 'bootstrap-vue'
import Modal from '@/components/Modal.vue'
import { store } from '@/store'

export default {
  name: 'statistic-detail',
  data () {
    return {
      store,
      result: {},
      currentQuestionIndex: 0,
    }
  },
  computed: {
    percentage () {
      if (!this.result.resultDetails) return 0
      return (this.result.corrected / this.result.resultDetails.length) * 100
    },
    timeUsed () {
      // convert string to date, then get the difference in seconds
      const diff = (new Date(this.result.submittedAt) - new Date(this.result.startedAt)) / 1000
      // convert seconds to minutes
      return Math.floor(diff / 60) + ' phút ' + Math.floor(diff % 60) + ' giây'
    },

    submitedTime_() {
      const date = new Date(this.result.submittedAt);
      let datePart = [
        date.getMonth() + 1,
        date.getDate(),
        date.getFullYear()
      ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
      let timePart = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ].map((n, i) => n.toString().padStart(2, "0")).join(":");
      return datePart + " " + timePart;
    },

    currentQuestion () {
      if (!this.result.resultDetails) return {}
      return this.result.resultDetails[this.currentQuestionIndex]
    }
  },
  async created () {
    await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/results/' + this.$route.params.id,
        {
          headers: {
            'Authorization': `Bearer ${store.token}`
          }
        })
        .then(response => {
          this.result = response.data.data
        })
  },
  methods: {
    goToQuestion (index) {
      this.currentQuestionIndex = index
    }
  }
}
</script>
<style>
</style>
