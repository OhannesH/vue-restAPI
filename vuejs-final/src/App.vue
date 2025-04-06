<script>
export default {
  data() {
    return {
      isLoggedIn: false,  // Track if the user is logged in
    };
  },
  mounted() {
    this.checkLoginStatus();  // Check login status when the component is mounted
  },
  methods: {
    // Check if the user is logged in by looking for userId in localStorage
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem("userId") !== null;
    },
    // Log out the user by clearing the userId from localStorage
    logout() {
      localStorage.removeItem("userId");
      localStorage.removeItem("jwt"); 
      localStorage.removeItem("isAdmin"); 
      this.checkLoginStatus();
      this.$router.push("/login");
    }
  },
  watch: {
    // Watch for changes in localStorage to reactively update the login state
    '$route'() {
      this.checkLoginStatus();
    }
  }
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light ps-2">
    <RouterLink to="/" class="navbar-brand">Listings</RouterLink>
    <RouterLink class="navbar-brand" to="/listings">Make a listing</RouterLink>
    <RouterLink class="navbar-brand" to="/inbox">Inbox</RouterLink>
    
    <!-- Conditionally render Login/Logout button -->
    <div class="navbar-nav ms-auto">
      <RouterLink 
        v-if="!isLoggedIn" 
        class="navbar-brand" 
        to="/login"
      >
        Login
      </RouterLink>
      
      <button 
        v-if="isLoggedIn" 
        class="btn btn-link navbar-brand" 
        @click="logout"
      >
        Logout
      </button>
    </div>
  </nav>

  <div class="container">
    <main>
      <RouterView />
    </main>
  </div>
</template>
