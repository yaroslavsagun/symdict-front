<template>
  <div class="entity-page container mt-3">
    <h1>Translations Management</h1>
    <div class="mb-2 mt-2">
      <RouterLink to="/admin/dashboard">Back to the dashboard</RouterLink>
    </div>
    <div class="btn btn-success mb-2" @click="createModal.show()">Create new</div>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Original</th>
        <th scope="col" colspan="3">Translation</th>
        <th scope="col" style="width:200px">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="translation in translations" :key="translation.id">
        <th>{{ translation.id }}</th>
        <td>{{ translation.originalWord.word }} - {{ translation.originalWord.language.name }}</td>
        <td colspan="3">{{ translation.translationWord.word }} - {{ translation.translationWord.language.name }}</td>
        <td>
          <div class="d-flex justify-content-between">
            <div class="btn btn-primary" @click="openEdit(translation.id)">Edit</div>
            <div class="btn btn-danger" @click="remove(translation.id)">Delete</div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="modal fade" tabindex="-1" ref="createModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new translation</h5>
          </div>
          <div class="modal-body">
            <div class="form-group mb-2">
              <label for="new_slug">Choose original language</label>
              <select v-model="newT.originalLanguage" id="new_slug" class="form-select" @change="langSelected()">
                <option :value="language.id" v-for="language in languages" :key="language.id">
                  {{ language.name }}
                </option>
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="new_slug">Choose translation language</label>
              <select v-model="newT.translationLanguage" id="new_slug" class="form-select" @change="langSelected()">
                <option :value="language.id" v-for="language in languages" :key="language.id">
                  {{ language.name }}
                </option>
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="new_slug">Choose original word</label>
              <select v-model="newT.originalWord" id="new_slug" class="form-select" v-if="originalWords">
                <option :value="word.id" v-for="word in originalWords" :key="word.id">
                  {{ word.word }}
                </option>
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="new_slug">Choose translation word</label>
              <select v-model="newT.translationWord" id="new_slug" class="form-select" v-if="translationWords">
                <option :value="word.id" v-for="word in translationWords" :key="word.id">
                  {{ word.word }}
                </option>
              </select>
            </div>
            <div class="alert alert-danger" v-if="newT.error">{{ newT.error }}</div>
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
            <h5 class="modal-title">Edit translation - {{ editT.id }}</h5>
          </div>
          <div class="modal-body">
            <div class="modal-body">
              <div class="form-group mb-2">
                <label for="new_slug">Choose original language</label>
                <select v-model="editT.originalLanguage" id="new_slug" class="form-select" @change="langSelected(1)">
                  <option :value="language.id" v-for="language in languages" :key="language.id">
                    {{ language.name }}
                  </option>
                </select>
              </div>
              <div class="form-group mb-2">
                <label for="new_slug">Choose translation language</label>
                <select v-model="editT.translationLanguage" id="new_slug" class="form-select" @change="langSelected(1)">
                  <option :value="language.id" v-for="language in languages" :key="language.id">
                    {{ language.name }}
                  </option>
                </select>
              </div>
              <div class="form-group mb-2">
                <label for="new_slug">Choose original word</label>
                <select v-model="editT.originalWord" id="new_slug" class="form-select" v-if="originalWords">
                  <option :value="word.id" v-for="word in originalWords" :key="word.id">
                    {{ word.word }}
                  </option>
                </select>
              </div>
              <div class="form-group mb-2">
                <label for="new_slug">Choose translation word</label>
                <select v-model="editT.translationWord" id="new_slug" class="form-select" v-if="translationWords">
                  <option :value="word.id" v-for="word in translationWords" :key="word.id">
                    {{ word.word }}
                  </option>
                </select>
              </div>
              <div class="alert alert-danger" v-if="editT.error">{{ editT.error }}</div>
            </div>
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
      translations: [],
      newT: {
        originalLanguage: null,
        translationLanguage: null,
        originalWord: null,
        translationWord: null,
        error: ""
      },
      originalWords: [],
      translationWords: [],
      editT: {
        id: null,
        originalLanguage: null,
        translationLanguage: null,
        originalWord: null,
        translationWord: null,
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
      axios.get(this.$apiUrl + 'translation').then(res => {
        this.translations = res.data.translations;
      })
    },
    create() {
      axios.post(this.$apiUrl + 'translation/create', {
        original_word_id: this.newT.originalWord,
        translation_word_id: this.newT.translationWord
      })
          .then(() => {
            this.newWord = {slug: "", name: "", error: ""};
            this.createModal.hide();
            this.loadData();
          })
          .catch(() => {
            this.newT.error = "Unable to create translation";
          })
    },
    openEdit(id) {
      this.translations.forEach(translation => {
        if (translation.id === id) {
          this.editT = {
            id: translation.id,
            originalLanguage: translation.originalLanguage.id,
            translationLanguage: translation.translationLanguage.id,
            originalWord: translation.originalWord.id,
            translationWord: translation.translationWord.id,
            error: ""
          };
        }
      });
      this.editModal.show();
    },
    edit() {
      axios.post(this.$apiUrl + 'translation/' + this.editT.id + '/update', {
        original_word_id: this.editT.originalWord,
        translation_word_id: this.editT.translationWord
      })
          .then(() => {
            this.editT = {slug: "", name: "", error: ""};
            this.editModal.hide();
            this.loadData();
          })
          .catch(() => {
            this.editT.error = "Unable to edit translation";
          })
    },
    remove(id) {
      axios.post(this.$apiUrl + 'translation/' + id + '/delete')
          .then(() => {
            this.loadData();
          })
    },
    langSelected(edit = 0) {
      let obj;
      if (!edit) {
        obj = this.newT;
      } else {
        obj = this.editT;
      }
      if (obj.originalLanguage === null || obj.translationLanguage === null) {
        return;
      }
      axios.get(this.$apiUrl + 'word/by-language/' + obj.originalLanguage).then(res => {
        this.originalWords = res.data.words;
      });
      axios.get(this.$apiUrl + 'word/by-language/' + obj.translationLanguage).then(res => {
        this.translationWords = res.data.words;
      });
    }
  },
  mounted() {
    this.loadData();
    this.createModal = new Modal(this.$refs.createModal);
    this.editModal = new Modal(this.$refs.editModal);
  }
}
</script>