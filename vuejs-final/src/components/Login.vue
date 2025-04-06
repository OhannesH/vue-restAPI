<script>
import { API_ENDPOINTS } from '@/config';
import axios from 'axios';
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
      async login() {
      try {
        const res = await axios.post(API_ENDPOINTS.login, {
          username: this.username,
          password: this.password,
        });

        console.log("Login success:", res);
        alert("Login successful! redirecting...");

        // Store token and user info
        localStorage.setItem("jwt", res.data.jwt);
        localStorage.setItem("userId", JSON.stringify(res.data.userId));
        localStorage.setItem("isAdmin", JSON.stringify(res.data.isAdmin));

        // Set default auth header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.jwt}`;

        // Redirect to home or dashboard
        this.$router.push("/");
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        alert("Login failed. Please check your credentials.");
      }
    },
  }
};
</script>

<template>
  <section>
    <div class="container">
      <h1>Login</h1>
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="inputUsername" class="form-label">Username</label>
              <input id="inputUsername" type="text" class="form-control" v-model="username" required/>
            </div>
            <div class="mb-3">
              <label for="inputPassword" class="form-label">Password</label>
              <input id="inputPassword" type="password" class="form-control" v-model="password" required/>
            </div>
            <button class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
      <div class="col-md-6">
        <p>Don't have an account? <a href="/register">Sign up</a></p>
      </div>
    </div>

  </section>
</template>



<style lang="css" scoped></style>
