<template>
  <div class="content position-r w-100" style="background: #F2F2F2; min-height: calc(100vh - 128px)">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <Title>
          Thêm quiz
        </Title>
        <modal :show.sync="addQuestionModal.show">
          <h6 id="modal-title-default" slot="header" class="modal-title">Thêm câu hỏi vào đề thi</h6>

          <select v-model="addQuestionModal.selectingTagId" class="form-control col-6" @change="getQuestionsForModal">
            <option value="">Chọn tag</option>
            <option v-for="tag in tagList" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
          </select>

          <table v-if="addQuestionModal.questions.length" class="table table-striped">
            <thead>
            <tr>
              <th scope="col">Chọn</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Tags</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="question in addQuestionModal.questions" :key="question.id">
              <td>
                <input v-model="addQuestionModal.selectingQuestionIds" :value="question.id" type="checkbox">
              </td>
              <td>{{ question.content }}</td>
              <td>
                <span v-for="tag in question.tagList" :key="tag.id" class="badge badge-primary mr-1">{{
                    tag.name
                  }}</span>
              </td>
            </tr>
            </tbody>
          </table>

          <template slot="footer">
            <base-button type="primary" @click="saveModalChanges">Save changes</base-button>
            <base-button class="ml-auto" type="link" @click="discardModalChanges">
              Close
            </base-button>
          </template>
        </modal>
        <section class="section section-lg pt-lg-0 w-100" style="margin-top: 200px">
          <div class="py-5 bg-secondary">
            <div class="container">
              <form @submit.prevent="storeTest">
                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="content">Tên quiz</label>
                    <input v-model="name" class="form-control" required/>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="content">Mô tả</label>
                    <textarea v-model="description" class="form-control" required rows="5"></textarea>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="content">Thời gian làm bài</label>
                    <input v-model="availableTime" class="form-control" required type="number"/>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="tags">Tags</label>
                    <b-form-tags
                        v-if="tagNameList.length > 0"
                        id="tags-component-select"
                        v-model="selectedTags"
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
                            :disabled="disabled || availableTags.length === 0"
                            :options="availableTags"
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
                <button class="btn btn-success" type="submit">Cập nhật</button>
                <button class="btn btn-primary" type="button" @click="showModal">Thêm câu hỏi</button>
              </form>

              <h4 v-if="addQuestionModal.selectedQuestionIds.length" class="mt-5">
                Các câu hỏi đã chọn
              </h4>
              <h4 v-else class="mt-5">
                Chưa có câu hỏi nào được chọn
              </h4>
              <table v-if="addQuestionModal.selectedQuestionIds.length" class="table table-striped">
                <thead>
                <tr>
                  <th scope="col">Nội dung</th>
                  <th scope="col">Tags</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="question in questions">
                  <tr v-if="addQuestionModal.selectedQuestionIds.includes(question.id)">
                    <td v-html="question.content"></td>
                    <td>
                      <span v-for="tag in question.tagList" :key="tag.id" class="badge badge-primary mr-1">{{
                          tag.name
                        }}</span>
                    </td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>
          </div>
        </section>
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
  name: 'tests-edit',
  components: {
    Modal,
    BFormTags,
    BFormTag,
    BFormSelect
  },
  data () {
    return {
      addQuestionModal: {
        show: false,
        selectingTagId: null,
        questions: [],
        selectingQuestionIds: [],
        selectedQuestionIds: []
      },
      tagList: [],
      questions: [],
      store,
      name: '',
      description: '',
      availableTime: '',
      selectedTags: [],
    }
  },
  computed: {
    tagNameList () {
      return this.tagList.map(tag => tag.name)
    },
    availableTags () {
      return this.tagNameList.filter(tag => !this.selectedTags.includes(tag))
    },
  },
  async created () {
    await this.getTags()
    await this.getQuestions()
    await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tests/' + this.$route.params.id)
        .then(response => {
          this.name = response.data.data.name
          this.description = response.data.data.description
          this.availableTime = response.data.data.availableTime
          this.selectedTags = response.data.data.tagList ? response.data.data.tagList.map(tag => tag.name) : []
          this.addQuestionModal.selectedQuestionIds = response.data.data.questionList ? response.data.data.questionList.map(question => question.id) : []
        })
  },
  methods: {
    showModal () {
      this.addQuestionModal.show = true
      this.addQuestionModal.selectingTagId = null
      this.addQuestionModal.questions = []
      this.addQuestionModal.selectingQuestionIds = this.addQuestionModal.selectedQuestionIds
    },
    discardModalChanges () {
      this.addQuestionModal.show = false
      this.addQuestionModal.selectingTagId = null
      this.addQuestionModal.questions = []
      this.addQuestionModal.selectingQuestionIds = this.addQuestionModal.selectedQuestionIds
    },
    saveModalChanges () {
      this.addQuestionModal.show = false
      this.addQuestionModal.selectingTagId = null
      this.addQuestionModal.questions = []
      this.addQuestionModal.selectedQuestionIds = this.addQuestionModal.selectingQuestionIds
      this.getQuestions()
    },
    async storeTest () {
      if (!this.name || !this.availableTime) {
        store.displayError('Vui lòng nhập đầy đủ thông tin')
        return
      }

      if (this.availableTime < 1) {
        store.displayError('Thời gian làm bài không hợp lệ')
        return
      }

      const questionIds = []
      for (let questionId of this.addQuestionModal.selectedQuestionIds) {
        questionIds.push({ id: questionId })
      }

      const tagIds = []
      for (let tagName of this.selectedTags) {
        const tag = this.tagList.find(tag => tag.name === tagName)
        tagIds.push({ id: tag.id })
      }

      await axios.put(this.$appConfig.apiBaseUrl + '/quiz/api/tests/' + this.$route.params.id, {
        id: this.$route.params.id,
        name: this.name,
        description: this.description,
        availableTime: this.availableTime,
        questionList: questionIds,
        tagList: tagIds
      }, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      })
          .then(res => {
            store.displaySuccess('Cập nhật thành công')
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    async getQuestionsForModal () {
      if (!this.addQuestionModal.selectingTagId) {
        this.addQuestionModal.questions = []
        return
      }
      await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/questions?pageSize=100000&pageNo=0&tagId=' + this.addQuestionModal.selectingTagId)
          .then(res => {
            this.addQuestionModal.questions = res.data.data.items
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    async getTags () {
      await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/tags?pageSize=100000&pageNo=0')
          .then(res => {
            if (res.data.data.items.length === 0) {
              return
            }
            this.tagList = res.data.data.items
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    },
    async getQuestions () {
      await axios.get(this.$appConfig.apiBaseUrl + '/quiz/api/questions?pageSize=100000&pageNo=0')
          .then(res => {
            this.questions = res.data.data.items
          })
          .catch(err => {
            store.displayError('Có lỗi xảy ra. Vui lòng thử lại')
          })
    }
  }
}
</script>
