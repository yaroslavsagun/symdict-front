<template>
  <div class="entity-page container mt-3">
    <h1>Languages Management</h1>
    <div class="mb-2 mt-2">
      <RouterLink to="/admin/dashboard">Back to the dashboard</RouterLink>
    </div>
    <div class="btn btn-success mb-2" @click="createModal.show()">Create new</div>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Slug</th>
        <th scope="col" colspan="3">Name</th>
        <th scope="col" style="width:200px">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="language in languages" :key="language.id">
        <th>{{ language.id }}</th>
        <td>{{ language.slug }}</td>
        <td colspan="3">{{ language.name }}</td>
        <td>
          <div class="d-flex justify-content-between">
            <div class="btn btn-primary" @click="openEdit(language.id)">Edit</div>
            <div class="btn btn-danger" @click="remove(language.id)">Delete</div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="modal fade" tabindex="-1" ref="createModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new language</h5>
          </div>
          <div class="modal-body">
            <div class="form-group mb-2">
              <label for="new_slug">Slug</label>
              <input type="text" id="new_slug" class="form-control" v-model="newLanguage.slug" placeholder="en">
            </div>
            <div class="form-group mb-2">
              <label for="new_name">Name</label>
              <input type="text" id="new_name" class="form-control" v-model="newLanguage.name" placeholder="English">
            </div>
            <div class="alert alert-danger" v-if="newLanguage.error">{{ newLanguage.error }}</div>
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
            <h5 class="modal-title">Edit language - {{ editLanguage.id }}</h5>
          </div>
          <div class="modal-body">
            <div class="form-group mb-2">
              <label for="new_slug">Slug</label>
              <input type="text" id="new_slug" class="form-control" v-model="editLanguage.slug" placeholder="en">
            </div>
            <div class="form-group mb-2">
              <label for="new_name">Name</label>
              <input type="text" id="new_name" class="form-control" v-model="editLanguage.name" placeholder="English">
            </div>
            <div class="alert alert-danger" v-if="editLanguage.error">{{ editLanguage.error }}</div>
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
      languages: [],
      newLanguage: {
        slug: "",
        name: "",
        error: ""
      },
      editLanguage: {
        id: null,
        slug: "",
        name: "",
        error: ""
      },
      error: "",
      createModal: null,
      editModal: null
    }
  },
  methods: {
    loadData() {
      axios.get(this.$apiUrl + 'language').then(res => {
        this.languages = res.data.languages;
      })
    },
    create() {
      axios.post(this.$apiUrl + 'language/create', {slug: this.newLanguage.slug, name: this.newLanguage.name})
          .then(() => {
            this.newLanguage = {slug: "", name: "", error: ""};
            this.createModal.hide();
            this.loadData();
          })
          .catch(() => {
            this.newLanguage.error = "Unable to create language";
          })
    },
    openEdit(id) {
      this.languages.forEach(language => {
        if (language.id === id) {
          this.editLanguage = language;
        }
      });
      this.editModal.show();
    },
    edit() {
      axios.post(this.$apiUrl + 'language/' + this.editLanguage.id + '/update', {
        slug: this.editLanguage.slug,
        name: this.editLanguage.name
      })
          .then(() => {
            this.editLanguage = {id: null, slug: "", name: "", error: ""};
            this.editModal.hide();
            this.loadData();
          })
          .catch(() => {
            this.editLanguage.error = "Unable to edit language";
          });
    },
    remove(id) {
      axios.post(this.$apiUrl + 'language/' + id + '/delete')
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