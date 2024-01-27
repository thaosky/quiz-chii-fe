<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          {{ result ? result.testName : 'Thống kê' }}
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container">
            <div class="row justify-content-center bg-white">
              <a-spin :spinning="loading" class="w-100" size="large">
                <table v-if="result.list && result.list.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Tên</th>
                    <th scope="col">Thời điểm bắt đầu</th>
                    <th scope="col">Thời gian làm bài</th>
                    <th scope="col">Kết quả</th>
                    <th scope="col">Điểm</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="detail in result.list" :key="result.list.userId">
                    <td :title="detail.username" data-toggle="tooltip">
                      {{ detail.username }}
                    </td>
                    <td :title="detail.startedAt.substr(0, 19)" data-toggle="tooltip">
                      {{ detail.startedAt.substr(0, 19) }}
                    </td>
                    <td :title="calcTimeUsed(detail.startedAt, detail.submittedAt)" data-toggle="tooltip">
                      {{ calcTimeUsed(detail.startedAt, detail.submittedAt) }}
                    </td>
                    <td>
                      {{ detail.corrected }} / {{ detail.totalQuestion }}
                    </td>
                    <td :title="detail.corrected" data-toggle="tooltip">
                      {{ Math.round(detail.corrected * 100 / detail.totalQuestion) }}
                    </td>
                  </tr>
                  </tbody>
                </table>
                <SearchNoData v-else></SearchNoData>
              </a-spin>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import axios from 'axios'

export default {
  name: 'statistics-by-test',
  data () {
    return {
      store,
      result: {},
      loading: false
    }
  },
  async created () {
    this.loading = true
    await axios.get(`http://localhost:8080/quiz/api/results/test/${this.$route.params.id}`, {
      headers: {
        Authorization: `Bearer ${store.token}`
      }
    }).then(res => {
      this.result = res.data.data
    }).catch(err => {
      store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    calcTimeUsed (started, submitted) {
      const start = new Date(started)
      const submit = new Date(submitted)
      const diff = submit.getTime() - start.getTime()
      const minutes = Math.floor(diff / 1000 / 60)
      const seconds = Math.floor(diff / 1000) - minutes * 60
      return `${minutes < 10 ? '0' + minutes : minutes}m:${seconds < 10 ? '0' + seconds : seconds}s`
    },
  }
}
</script>
