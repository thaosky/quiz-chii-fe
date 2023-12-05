<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Danh sách câu hỏi
        </Title>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="container">
            <div class="d-flex justify-content-center my-3">
              <SearchCustom :tags="tagList" @submit="searchByTag"></SearchCustom>
            </div>
            <div v-if="store.isAdmin()" class="row mb-3" style="justify-content: end">
              <button class="btn btn-success" @click="createModal.show = true">Thêm câu hỏi</button>
            </div>
            <div class="row justify-content-center bg-white">
              <table v-if="questions.length" class="table table-striped">
                <thead>
                <tr>
                  <th scope="col">Nội dung</th>
                  <th scope="col">Câu hỏi</th>
                  <th v-if="store.isAdmin()" scope="col" style="min-width: 60px">
                    Đáp án
                  </th>
                  <th scope="col" style="min-width: 130px">Tags</th>
                  <th scope="col" style="min-width: 130px"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="question in questions" :key="question.id">
                  <td :title="question.content" data-toggle="tooltip" v-html="question.content">
                  </td>
                  <td :title="question.question" data-toggle="tooltip" v-html="question.question">
                  </td>
                  <td v-if="store.isAdmin()" v-html="convertAnswer(question)"></td>
                  <td>
                    <span v-for="tag in question.tagList" :key="tag.id" class="badge badge-primary">{{
                        tag.name
                      }}</span>
                  </td>
                  <td>
                    <template v-if="store.isAdmin()">
                      <button
                          class="btn btn-sm btn-success"
                          @click="showCopyQuestionModal(question)">COPY
                      </button>
                      <button
                          class="btn btn-sm btn-primary"
                          @click="showEditQuestionModal(question)">Sửa
                      </button>
                      <button class="btn btn-sm btn-danger" @click="showDeleteQuestionModal(question)">Xóa</button>
                    </template>
                  </td>
                </tr>
                </tbody>
              </table>
              <SearchNoData v-else></SearchNoData>
              <div v-if="totalPage === 0" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-if="totalPage > 1">
                <base-pagination v-model="pageNo" :page-count="totalPage" :per-page="pageSize"
                                 :total="total"></base-pagination>
              </div>
            </div>
          </div>
        </section>
        <modal :show="createModal.show" modal-classes="modal-xl" @close="createModal.show = false">
          <template v-slot:header>
            <h4>Thêm câu hỏi</h4>
          </template>
          <template>
            <form>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="content">Nội dung câu hỏi</label>
                  <wysiwyg v-model="createModal.content" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="question">Dữ kiện cho câu hỏi</label>
                  <wysiwyg v-model="createModal.question" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="answer1">Đáp án A</label>
                  <wysiwyg v-model="createModal.answer1" class="form-control" required style="min-height: 150px;"/>
                </div>
                <div class="form-group col-md-6">
                  <label for="answer2">Đáp án B</label>
                  <wysiwyg v-model="createModal.answer2" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="answer3">Đáp án C</label>
                  <wysiwyg v-model="createModal.answer3" class="form-control" required style="min-height: 150px;"/>
                </div>
                <div class="form-group col-md-6">
                  <label for="answer4">Đáp án D</label>
                  <wysiwyg v-model="createModal.answer4" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="correctAnswer">Đáp án đúng</label>
                  <select v-model="createModal.correctAnswer" class="form-control" required>
                    <option value="1">A</option>
                    <option value="2">B</option>
                    <option value="3">C</option>
                    <option value="4">D</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="tags">Tags</label>
                  <b-form-tags
                      id="tags-component-select"
                      v-model="createModal.selectedTags"
                      add-on-change
                      class="mb-2"
                      no-outer-focus
                  >
                    <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                      <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                        <li v-for="tag in tags" :key="tag" class="list-inline-item">
                          <b-form-tag
                              :disabled="disabled"
                              :title="tag"
                              @remove="removeTag(tag)"
                          >{{ tag }}
                          </b-form-tag>
                        </li>
                      </ul>
                      <b-form-select
                          :disabled="disabled || availableCreateTags.length === 0"
                          :options="availableCreateTags"
                          v-bind="inputAttrs"
                          v-on="inputHandlers"
                      >
                        <template #first>
                          <!-- This is required to prevent bugs with Safari -->
                          <option disabled value="">Chọn tag</option>
                        </template>
                      </b-form-select>
                    </template>
                  </b-form-tags>
                </div>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="createModal.show = false">Đóng</button>
            <button v-if="createFormValid" class="btn btn-success" type="button" @click="storeQuestion">Lưu</button>
            <button v-else class="btn btn-dark" disabled type="button">Lưu</button>
          </template>
        </modal>
        <modal :show="updateModal.show" modal-classes="modal-xl" @close="updateModal.show = false" >
          <template v-slot:header>
            <h4>Thêm câu hỏi</h4>
          </template>
          <template>
            <form>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="content">Nội dung câu hỏi</label>
                  <wysiwyg v-model="updateModal.content" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="question">Dữ kiện cho câu hỏi</label>
                  <wysiwyg v-model="updateModal.question" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="answer1">Đáp án A</label>
                  <wysiwyg v-model="updateModal.answer1" class="form-control" required style="min-height: 150px;"/>
                </div>
                <div class="form-group col-md-6">
                  <label for="answer2">Đáp án B</label>
                  <wysiwyg v-model="updateModal.answer2" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="answer3">Đáp án C</label>
                  <wysiwyg v-model="updateModal.answer3" class="form-control" required style="min-height: 150px;"/>
                </div>
                <div class="form-group col-md-6">
                  <label for="answer4">Đáp án D</label>
                  <wysiwyg v-model="updateModal.answer4" class="form-control" required style="min-height: 150px;"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="correctAnswer">Đáp án đúng</label>
                  <select v-model="updateModal.correctAnswer" class="form-control" required>
                    <option value="1">A</option>
                    <option value="2">B</option>
                    <option value="3">C</option>
                    <option value="4">D</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label for="tags">Tags</label>
                  <b-form-tags
                      id="tags-component-select"
                      v-model="updateModal.selectedTags"
                      add-on-change
                      class="mb-2"
                      no-outer-focus
                  >
                    <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                      <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                        <li v-for="tag in tags" :key="tag" class="list-inline-item">
                          <b-form-tag
                              :disabled="disabled"
                              :title="tag"
                              @remove="removeTag(tag)"
                          >{{ tag }}
                          </b-form-tag>
                        </li>
                      </ul>
                      <b-form-select
                          :disabled="disabled || availableCreateTags.length === 0"
                          :options="availableCreateTags"
                          v-bind="inputAttrs"
                          v-on="inputHandlers"
                      >
                        <template #first>
                          <!-- This is required to prevent bugs with Safari -->
                          <option disabled value="">Chọn tag</option>
                        </template>
                      </b-form-select>
                    </template>
                  </b-form-tags>
                </div>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="updateModal.show = false">Đóng</button>
            <button v-if="updateFormValid" class="btn btn-primary" type="button" @click="updateQuestion">Lưu</button>
            <button v-else class="btn btn-dark" disabled type="button">Lưu</button>
          </template>
        </modal>
        <modal :show="deleteModal.show" @close="deleteModal.show = false">
          <template v-slot:header>
            <h4>Xoá câu hỏi</h4>
          </template>
          <template>
            <p>Bạn có chắc chắn muốn xoá câu hỏi này?</p>
          </template>
          <template v-slot:footer>
            <button class="btn btn-secondary" type="button" @click="deleteModal.show = false">Đóng</button>
            <button class="btn btn-danger" type="button" @click="deleteQuestion">Xoá</button>
          </template>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { store } from '@/store'
import SearchCustom from '@/components/SearchCustom.vue'
import Modal from '@/components/Modal.vue'
import { BFormSelect, BFormTag, BFormTags } from 'bootstrap-vue'

export default {
  name: 'questions',
  components: { BFormTags, BFormSelect, BFormTag, Modal, SearchCustom },
  data () {
    return {
      store,
      questions: [],
      pageNo: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 5,
      sortDir: this.$route.query.sortDir || 'DESC',
      sortName: this.$route.query.sortName || 'id',
      keyword: this.$route.query.keyword || '',
      tagId: this.$route.query.tagId || '',
      totalPage: 0,
      total: 0,
      tagList: [],
      createModal: {
        show: false,
        content: '',
        question: '',
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        correctAnswer: '',
        selectedTags: [],
      },
      updateModal: {
        show: false,
        id: '',
        content: '',
        question: '',
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        correctAnswer: '',
        selectedTags: [],
      },
      deleteModal: {
        show: false,
        id: '',
      },
    }
  },
  computed: {
    tagNameList () {
      return this.tagList.map(tag => tag.name)
    },
    availableCreateTags () {
      return this.tagNameList.filter(tag => !this.createModal.selectedTags.includes(tag))
    },
    createFormValid () {
      return this.createModal.content && this.createModal.question && this.createModal.answer1 &&
          this.createModal.answer2 && this.createModal.answer3 && this.createModal.answer4 &&
          this.createModal.correctAnswer && this.createModal.selectedTags.length > 0
    },
    availableUpdateTags () {
      return this.tagNameList.filter(tag => !this.updateModal.selectedTags.includes(tag))
    },
    updateFormValid () {
      return this.updateModal.content && this.updateModal.question && this.updateModal.answer1 &&
          this.updateModal.answer2 && this.updateModal.answer3 && this.updateModal.answer4 &&
          this.updateModal.correctAnswer && this.updateModal.selectedTags.length > 0
    },
  },
  async created () {
    await axios.get(`http://localhost:8080/quiz/api/questions?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`)
        .then(res => {
          this.questions = res.data.data.items
          this.totalPage = res.data.data.totalPage
          this.total = res.data.data.totalElements
        })
        .catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
    await axios.get('http://localhost:8080/quiz/api/tags?pageSize=100000&pageNo=0')
        .then(res => {
          this.tagList = res.data.data.items
        })
        .catch(err => {
          store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
        })
  },
  methods: {
    convertAnswer (question) {
      if (question.correctAnswer) {
        question.correctAnswer = parseInt(question.correctAnswer)
      } else {
        return ''
      }
      return question['answer' + question.correctAnswer]
    },
    async searchByTag (tagId, keyword) {
      this.tagId = tagId
      this.keyword = keyword
      await this.getQuestions()
    },
    async getQuestions () {
      let url = `http://localhost:8080/quiz/api/questions?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}&sortDir=${this.sortDir}&sortName=${this.sortName}`
      if (this.tagId) {
        url += `&tagId=${this.tagId}`
      }
      if (this.keyword) {
        url += `&content=${this.keyword}`
      }
      await axios.get(url)
          .then(res => {
            this.questions = res.data.data.items
            this.totalPage = res.data.data.totalPage
            this.total = res.data.data.totalElements
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    showDeleteQuestionModal (question) {
      this.deleteModal.id = question.id
      this.deleteModal.show = true
    },
    async deleteQuestion () {
      await axios.delete(`http://localhost:8080/quiz/api/questions/${this.deleteModal.id}`, {
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      })
          .then(res => {
            if (res.status === 200 || res.status === 204) {
              store.displaySuccess('Xóa câu hỏi thành công!')
              this.deleteModal.show = false
              this.getQuestions()
            }
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    async storeQuestion () {
      if (!this.createFormValid) {
        alert('Vui lòng nhập đầy đủ thông tin')
        return
      }
      const tagIds = []
      for (let tagName of this.createModal.selectedTags) {
        const tag = this.tagList.find(tag => tag.name === tagName)
        tagIds.push({ id: tag.id })
      }

      await axios.post('http://localhost:8080/quiz/api/questions',
          {
            content: this.createModal.content,
            question: this.createModal.question,
            answer1: this.createModal.answer1,
            answer2: this.createModal.answer2,
            answer3: this.createModal.answer3,
            answer4: this.createModal.answer4,
            correctAnswer: parseInt(this.createModal.correctAnswer),
            tagList: tagIds
          },
          {
            headers: {
              Authorization: `Bearer ${store.token}`
            }
          }
      )
          .then(res => {
            store.displaySuccess('Thêm câu hỏi thành công')
            this.getQuestions()
            this.resetCreateModal()
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    resetCreateModal () {
      this.createModal.show = false
      this.createModal.content = ''
      this.createModal.question = ''
      this.createModal.answer1 = ''
      this.createModal.answer2 = ''
      this.createModal.answer3 = ''
      this.createModal.answer4 = ''
      this.createModal.correctAnswer = ''
      this.createModal.selectedTags = []
    },
    showEditQuestionModal (question) {
      this.updateModal.id = question.id
      this.updateModal.content = question.content
      this.updateModal.question = question.question
      this.updateModal.answer1 = question.answer1
      this.updateModal.answer2 = question.answer2
      this.updateModal.answer3 = question.answer3
      this.updateModal.answer4 = question.answer4
      this.updateModal.correctAnswer = question.correctAnswer
      this.updateModal.selectedTags = question.tagList.map(tag => tag.name)
      this.updateModal.show = true
    },
    showCopyQuestionModal (question) {
      this.createModal.content = question.content
      this.createModal.question = question.question
      this.createModal.answer1 = question.answer1
      this.createModal.answer2 = question.answer2
      this.createModal.answer3 = question.answer3
      this.createModal.answer4 = question.answer4
      this.createModal.correctAnswer = question.correctAnswer
      this.createModal.selectedTags = question.tagList.map(tag => tag.name)
      this.createModal.show = true
    },
    async updateQuestion () {
      if (!this.updateFormValid) {
        alert('Vui lòng nhập đầy đủ thông tin')
        return
      }
      const tagIds = []
      for (let tagName of this.updateModal.selectedTags) {
        const tag = this.tagList.find(tag => tag.name === tagName)
        tagIds.push({ id: tag.id })
      }

      await axios.put('http://localhost:8080/quiz/api/questions/' + this.updateModal.id,
          {
            id: this.updateModal.id,
            content: this.updateModal.content,
            question: this.updateModal.question,
            answer1: this.updateModal.answer1,
            answer2: this.updateModal.answer2,
            answer3: this.updateModal.answer3,
            answer4: this.updateModal.answer4,
            correctAnswer: parseInt(this.updateModal.correctAnswer),
            tagList: tagIds
          },
          {
            headers: {
              Authorization: `Bearer ${store.token}`
            }
          }
      )
          .then(res => {
            store.displaySuccess('Cập nhật câu hỏi thành công')
            this.getQuestions()
            this.resetUpdateModal()
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    resetUpdateModal () {
      this.updateModal.show = false
      this.updateModal.content = ''
      this.updateModal.question = ''
      this.updateModal.answer1 = ''
      this.updateModal.answer2 = ''
      this.updateModal.answer3 = ''
      this.updateModal.answer4 = ''
      this.updateModal.correctAnswer = ''
      this.updateModal.selectedTags = []
    },
  },
  watch: {
    pageNo() {
      this.getQuestions()
    },
  }
}
</script>
<style>
.modal-xl {
  min-width: 1024px
}

.editr--content {
  min-height: 100px;
  height: 100px;
}
</style>
