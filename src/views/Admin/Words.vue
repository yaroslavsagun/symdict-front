<template>
  <div class="entity-page container mt-3">
    <h1>Words Management</h1>
    <div class="mb-2 mt-2">
      <RouterLink to="/admin/dashboard">Back to the dashboard</RouterLink>
    </div>
    <div class="btn btn-success mb-2" @click="createModal.show()">Create new</div>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Language</th>
        <th scope="col" colspan="3">Word</th>
        <th scope="col" style="width:200px">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="word in words" :key="word.id">
        <th>{{ word.id }}</th>
        <td>{{ word.language.name }}</td>
        <td colspan="3">{{ word.word }}</td>
        <td>
          <div class="d-flex justify-content-between">
            <div class="btn btn-primary" @click="openEdit(word.id)">Edit</div>
            <div class="btn btn-danger" @click="remove(word.id)">Delete</div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="modal fade" tabindex="-1" ref="createModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new word</h5>
          </div>
          <div class="modal-body">
            <div class="form-group mb-2">
              <label for="new_slug">Language</label>
              <select v-model="newWord.language" id="new_slug" class="form-select">
                <option :value="language.id" v-for="language in languages" :key="language.id">
                  {{ language.name }}
                </option>
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="new_name">Word</label>
              <input type="text" id="new_name" class="form-control" v-model="newWord.word" placeholder="Apple">
            </div>
            <div class="alert alert-danger" v-if="newWord.error">{{ newWord.error }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="createModal.hide()">Close</button>
            <button type="button" class="btn btn-success" @click="create()">Create</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" tabindex="-1" ref="editModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit word - {{ editWord.id }}</h5>
          </div>
          <div class="modal-body">
            <div class="form-group mb-2">
              <label for="new_slug">Language</label>
              <select v-model="editWord.language" id="new_slug" class="form-select">
                <option
                    :value="language.id"
                    v-for="language in languages"
                    :key="language.id"
                >
                  {{ language.name }}
                </option>
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="new_name">Word</label>
              <input type="text" id="new_name" class="form-control" v-model="editWord.word" placeholder="Apple">
            </div>
            <div class="alert alert-danger" v-if="editWord.error">{{ editWord.error }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="editModal.hide()">Close</button>
            <button type="button" class="btn btn-success" @click="edit()">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {Modal} from 'bootstrap';

export default {
  data() {
    return {
      words: [],
      languages: [],
      newWord: {
        language: null,
        word: "",
        error: ""
      },
      editWord: {
        id: null,
        language: "",
        name: "",
        word: "",
        error: ""
      },
      createModal: null,
      editModal: null
    }
  },
  methods: {
    loadData() {
      axios.get(this.$apiUrl + 'language').then(res => {
        this.languages = res.data.languages;
      })
      axios.get(this.$apiUrl + 'word').then(res => {
        this.words = res.data.words;
      })
    },
    create() {
      axios.post(this.$apiUrl + 'word/create', {language_id: this.newWord.language, word: this.newWord.word})
          .then(() => {
            this.newWord = {slug: "", name: "", error: ""};
            this.createModal.hide();
            this.loadData();
          })
          .catch(() => {
            this.newWord.error = "Unable to create word";
          })
    },
    openEdit(id) {
      this.words.forEach(word => {
        if (word.id === id) {
          this.editWord = word;
        }
      });
      this.editModal.show();
    },
    edit() {
      axios.post(this.$apiUrl + 'word/' + this.editWord.id + '/update', {
        language_id: this.editWord.language,
        word: this.editWord.word
      })
          .then(() => {
            this.editWord = {id: null, slug: "", name: "", error: ""};
            this.editModal.hide();
            this.loadData();
          })
          .catch(() => {
            this.editWord.error = "Unable to edit word";
          });
    },
    remove(id) {
      axios.post(this.$apiUrl + 'word/' + id + '/delete')
          .then(() => {
            this.loadData();
          })
    }
  },
  mounted() {
    this.loadData();
    this.createModal = new Modal(this.$refs.createModal);
    this.editModal = new Modal(this.$refs.editModal);
  }
}
</script>