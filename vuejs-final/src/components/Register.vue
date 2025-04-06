<script>
import { API_ENDPOINTS } from "@/config";
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      email: "",
    };
  },
  methods: {
    async register() {
      try {
        const res = await axios.post(API_ENDPOINTS.register, {
          username: this.username,
          password: this.password,
          email: this.email,
        });

        console.log("Registration success:", res);
        alert("Registration successful! redirecting to login page...");
        this.$router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
      }
    },

  }
};
</script>

<template>
  <section>
    <div class="container">
      <h1>Sign up</h1>
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="inputUsername" class="form-label">Username</label>
              <input id="inputUsername" type="text" class="form-control" v-model="username" required/>
            </div>
            <div class="mb-3">
              <label for="inputEmail" class="form-label">Email</label>
              <input id="inputEmail" type="email" class="form-control" v-model="email" required/>
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
