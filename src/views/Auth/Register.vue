<template>
  <div class="register-page">
    <div class="card">
      <div class="card-header">Registration</div>
      <div class="card-body">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" class="form-control" v-model="name" id="name">
          <div class="error-message mt-1" v-if="errors.name">{{ errors.name }}</div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" class="form-control" v-model="email" id="email">
          <div class="error-message mt-1" v-if="errors.email">{{ errors.email }}</div>
        </div>
        <div class="form-group mt-2">
          <label for="password">Password</label>
          <input type="password" class="form-control" v-model="password" id="password">
          <div class="error-message mt-1" v-if="errors.password">{{ errors.password }}</div>
        </div>
        <div class="form-group mt-2">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" class="form-control" v-model="confirmPassword" id="confirmPassword">
        </div>
        <div class="form-group mt-2">
          <button type="button" class="btn btn-success" @click="doRegister">Register</button>
        </div>
        <div class="mt-2">
          Already have an account?
          <RouterLink to="/login">Login</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {
        name: "",
        email: "",
        password: ""
      }
    }
  },
  methods: {
    doRegister() {
      localStorage.clear('auth_token');
      if (!this.name || !this.email || !this.password) {
        this.error = "Some fields are empty";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords does not match";
        return;
      }
      this.errors = [];
      axios.post(this.$apiUrl + "auth/register", {
        name: this.name,
        email: this.email,
        password: this.password
      }).then(res => {
        let token = res.data.token;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('role', res.data.role);
        if (res.data.role === 'ROLE_ADMIN') {
          this.$router.push({path: '/admin/dashboard'});
        } else {
          this.$router.push({path: '/profile'});
        }
      }).catch(error => {
        let errors = error.response.data.errors;
        errors.forEach(error => {
          if (typeof error == 'string') {
            this.errors['email'] = error;
          } else {
            this.errors[error.property] = error.message;
          }
        });
      });
    }
  }
}
</script>