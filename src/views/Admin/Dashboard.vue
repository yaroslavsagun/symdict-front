<template>
  <div class="dashboard-page container mt-3">
    <h1>Dashboard</h1>
    <div class="row">
      <div class="col-4">
        <div class="card entity-summary">
          <div class="card-header">
            <div>
              Languages: <b>{{ languagesCount }}</b>
            </div>
            <RouterLink to="/admin/languages">
              <div class="btn btn-success">Manage</div>
            </RouterLink>
          </div>
          <div class="card-body">
            Latest added languages:
            <ul>
              <li v-for="(lang, key) in languages" :key="key">{{ lang.slug }} - {{ lang.name }}</li>
            </ul>

          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card entity-summary">
          <div class="card-header">
            <div>
              Words: <b>{{ wordsCount }}</b>
            </div>
            <RouterLink to="/admin/words">
              <div class="btn btn-success">Manage</div>
            </RouterLink>
          </div>
          <div class="card-body">
            Latest added words:
            <ul>
              <li v-for="(word, key) in words" :key="key">{{ word.word }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card entity-summary">
          <div class="card-header">
            <div>
              Translations: <b>{{ translationsCount }}</b>
            </div>
            <RouterLink to="/admin/translations">
              <div class="btn btn-success">Manage</div>
            </RouterLink>
          </div>
          <div class="card-body">
            Latest added translations:
            <ul>
              <li v-for="(translation, key) in translations" :key="key">
                {{ translation.originalWord.word }} - {{ translation.translationWord.word }}
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
    <div class="btn btn-secondary mt-2" @click="logout()">Log out</div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      languagesCount: 0,
      wordsCount: 0,
      translationsCount: 0,
      languages: [],
      words: [],
      translations: []
    }
  },
  methods: {
    loadData() {
      axios.get(this.$apiUrl + 'admin/summary').then(res => {
        this.languagesCount = res.data.languages.length;
        this.wordsCount = res.data.words.length;
        this.translationsCount = res.data.translations.length;
        this.languages = res.data.languages.slice(0, 5);
        this.words = res.data.words.slice(0, 5);
        this.translations = res.data.translations.slice(0, 5);
      });
    },
    logout() {
      axios.post(this.$apiUrl + 'auth/logout').then(res => {
        this.$router.push({path: '/login'});
      })
    }
  },
  mounted: function () {
    this.loadData();
  }
}
</script>
