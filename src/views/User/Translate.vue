<template>
  <div class="translate-page container mt-3">
    <div class="card">
      <div class="card-header">Translate with Symdict</div>
      <div class="card-body">
        <div class="form-group">
          <label for="originalLang" class="form-label">Select original language</label>
          <select v-model="originalLanguage" id="originalLang" class="form-select" @change="originalLanguageChanged()">
            <option :value="language.id" v-for="language in languages" :key="language.id">{{ language.name }}</option>
          </select>
        </div>
        <div class="form-group mt-2" v-if="originalLanguage">
          <label for="originalWord">Select original Word</label>
          <select v-model="originalWord" id="originalWord" class="form-select">
            <option :value="word.id" v-for="word in words" :key="word.id">{{ word.word }}</option>
          </select>
        </div>
        <div class="form-group mt-2" v-if="originalWord">
          <label for="translationLanguage" class="form-label">Select translation language</label>
          <select v-model="translationLanguage" id="translationLanguage" class="form-select">
            <option :value="language.id" v-for="language in languages" :key="language.id">{{ language.name }}</option>
          </select>
        </div>
        <div class="form-group mt-2" v-if="translationLanguage">
          <div class="btn btn-success" @click="translate()">Translate!</div>
        </div>
        <div class="alert alert-success mt-2" v-if="translationWord">
          SUCCESS. Translation is: <b>{{ translationWord }}</b>
        </div>
        <div class="alert alert-danger mt-2" v-if="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      originalLanguage: null,
      translationLanguage: null,
      languages: [],
      originalWord: null,
      words: [],
      translationWord: null,
      error: ""
    }
  },
  methods: {
    loadData() {
      axios.get(this.$apiUrl + 'language').then(res => {
        this.languages = res.data.languages;
      })
    },
    originalLanguageChanged() {
      axios.get(this.$apiUrl + 'word/by-language/' + this.originalLanguage).then(res => {
        this.words = res.data.words;
      });
    },
    translate() {
      this.error = "";
      this.translationWord = "";
      axios.post(this.$apiUrl + 'translation/translate', {
        original_language: this.originalLanguage,
        original_word: this.originalWord,
        translation_language: this.translationLanguage
      })
          .then(res => {
            this.translationWord = res.data.translation.translationWord.word;
          })
          .catch(() => {
            this.error = "Translation does not exist!";
          })
    }
  },
  mounted() {
    this.loadData();
  }
}
</script>