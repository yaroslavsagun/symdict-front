<template>
  <div class="login-page">
    <div class="card">
      <div class="card-header">Authorization</div>
      <div class="card-body">
        <div class="form-group">
          <label for="login">Login</label>
          <input type="text" class="form-control" v-model="login" id="login">
        </div>
        <div class="form-group mt-2">
          <label for="password">Password</label>
          <input type="password" class="form-control" v-model="password" id="password">
        </div>
        <div class="alert alert-danger mt-2" v-if="error">{{ error }}</div>
        <div class="form-group mt-2">
          <button type="button" class="btn btn-success" @click="doLogin">Login</button>
        </div>
        <div class="mt-2">
          Don't have an account?
          <RouterLink to="/register">Register</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      login: "",
      password: "",
      error: ""
    }
  },
  methods: {
    doLogin() {
      localStorage.clear('auth_token');
      axios.post(this.$apiUrl + "auth/login", {
        login: this.login,
        password: this.password
      }).then(res => {
        let token = res.data.token;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('role', res.data.role);
        if (res.data.role === 'ROLE_ADMIN') {
          this.$router.push({path: '/admin/dashboard'});
        } else {
          this.$router.push({path: '/translate'});
        }
      }).catch(() => {
        this.error = "Credentials are incorrect"
      });
    }
  }
}
</script>