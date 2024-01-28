<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Danh sách quiz
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container">
            <div class="d-flex justify-content-center my-3">
              <SearchCustom :tags="tagList" @submit="searchByTag"></SearchCustom>
            </div>
            <div v-if="store.isAdmin()" class="row mb-3" style="justify-content: flex-end">
              <router-link class="btn btn-success" to="/tests/create">Thêm quiz</router-link>
            </div>
            <div class="row justify-content-center bg-white">
              <a-spin :spinning="loading" class="w-100" size="large">
                <table v-if="tests.length" class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Tên quiz</th>
                    <th scope="col">Mô tả</th>
                    <th scope="col">Ngày thi</th>
                    <th scope="col">Thời lượng</th>
                    <th scope="col">Tags</th>
                    <th scope="col"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="test in tests" :key="test.id">
                    <td :title="test.name" data-toggle="tooltip">
                      {{ shortenContent(test.name) }}
                    </td>
                    <td :title="test.description" data-toggle="tooltip">
                      {{ shortenContent(test.description) }}
                    </td>
                    <td :title="test.startTime" data-toggle="tooltip">
                      {{ test.startTime }}
                    </td>
                    <td :title="test.availableTime" data-toggle="tooltip">
                      {{ shortenContent(test.availableTime) + ' phút' }}
                    </td>
                    <td>
                      <span v-for="tag in test.tagList" :key="tag.id" class="badge badge-primary">{{ tag.name }}</span>
                    </td>
                    <td style="display: flex; justify-content: center">
                      <template v-if="!store.isLoggedIn()">
                        <router-link
                            :to="{ name: 'tests.detail', params: { id: test.id } }"
                            class="btn btn-sm btn-neutral">Xem
                        </router-link>
                      </template>
                      <template v-if="store.isLoggedIn()">
                        <router-link
                            :to="{ name: 'tests.start', params: { id: test.id } }"
                            class="btn btn-sm btn-success">
                          Thi
                        </router-link>
                        <template v-if="store.isAdmin()">
                          <router-link
                              :to="{ name: 'tests.edit', params: { id: test.id } }"
                              class="btn btn-sm btn-primary">Sửa
                          </router-link>
                          <button class="btn btn-sm btn-danger" @click="showDeleteModal(test)">Xóa</button>
                        </template>
                      </template>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <SearchNoData v-else></SearchNoData>
              </a-spin>
              <div v-if="totalPage > 1">
                <base-pagination v-model="pageNo" :page-count="totalPage" :per-page="pageSize"
                                 :total="total"></base-pagination>
              </div>
            </div>
          </div>
        </section>
        <modal :show="deleteModal.show" @close="deleteModal.show = false">
          <template v-slot:header>
            Xóa bài kiểm tra
          </template>
          <template>
            <p>Bạn có chắc chắn muốn xóa bài kiểm tra này?</p>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" @click="deleteModal.show = false">Hủy</button>
            <button class="btn btn-danger" @click="deleteTest">Xóa</button>
          </template>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { store } from '@/store'
import ButtonSubmitSuccess from '@/components/ButtonSubmitSuccess.vue'
import SearchCustom from '@/components/SearchCustom.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'tests',
  components: { Modal, SearchCustom, ButtonSubmitSuccess },
  data () {
    return {
      store,
      tests: [],
      pageNo: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 5,
      sortDir: this.$route.query.sortDir || 'DESC',
      sortName: this.$route.query.sortName || 'id',
      keyword: this.$route.query.keyword || '',
      tagId: this.$route.query.tagId || '',
      testType: this.$route.query.testType || (store.isLoggedIn() ? '' : 'PRACTICE'),
      totalPage: 0,
      total: 0,
      selectedTagId: '',
      deleteModal: {
        show: false,
        id: null,
      },
      tagList: [],
      loading: false,
    }
  },
  async created () {
    this.getTests()
    await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tags?pageSize=100000&pageNo=0')
        .then(res => {
          this.tagList = res.data.data.items
        })
        .catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
  },
  methods: {
    shortenContent (content) {
      if (content.length > 30) {
        return content.substring(0, 30) + '...'
      }
      return content
    },
    async getTests () {
      let url = this.$appConfig.apiBaseUrl + `/quiz/api/tests?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`
      if (this.tagId) {
        url += `&tagId=${this.tagId}`
      }
      if (this.keyword) {
        url += `&name=${this.keyword}`
      }
      if (this.testType) {
        url += `&testType=${this.testType}`
      }
      this.loading = true
      await axios.get(url).then(res => {
        this.tests = res.data.data.items
        this.totalPage = res.data.data.totalPage
        this.total = res.data.data.totalElements
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      }).finally(() => {
        this.loading = false
      })
    },
    async searchByTag (tagId, keyword) {
      this.tagId = tagId
      this.keyword = keyword
      await this.getTests()
    },
    showDeleteModal (test) {
      this.deleteModal.show = true
      this.deleteModal.id = test.id
    },
    deleteTest () {
      axios.delete(this.$appConfig.apiBaseUrl + `/quiz/api/tests/${id}`, {
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      }).then(res => {
        if (res.status === 200) {
          this.getTests()
          this.deleteModal.show = false
          store.displayError('Xóa bài kiểm tra thành công!')
        }
      }).catch(err => {
        store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
      })
    }
  },
  watch: {
    pageNo() {
      this.getTests()
    },
  }
}
</script>
