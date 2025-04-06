<script>
import { API_ENDPOINTS } from '@/config';
import axios from 'axios';
export default {
  name: "CreateListing",
  data() {
    return {
      games: [],
      userId: null,
      gameId: null,
      description: "",
    };
  },
  async mounted() {
    await this.loadGames();
  },
  methods: {

    async loadGames() {
      try {
        this.isLoading = true;
        this.error = null;
        const results = await axios.get(`${API_ENDPOINTS.games}`);
        console.log(results.data);
        this.games = results.data;
        return results.data;
      } catch (error) {
        console.error(error);
        this.error = error.message || "An error occurred";
      } finally {
        this.isLoading = false;
      }
    },
      async createListing() {
      try {
        const res = await axios.post(API_ENDPOINTS.listings, {
          user_id: localStorage.getItem("userId"),
          game_id: this.gameId,
          description: this.description,
        });

        console.log("Listing created:", res);
        alert("Listing created redirecting...");

        // Redirect to home or dashboard
        this.$router.push("/");
      } catch (error) {
        console.error("Listing creation failed failed:", error.response?.data || error.message);
        alert("Listing creation failed. Please check your information.");
      }
    },
  }
};
</script>

<template>
  <section>
    <div class="container">
      <h1>Make a listing</h1>
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="createListing">
            <div class="mb-3">
              <div>
                <label for="gameSelect">Choose your game</label>
                <select class="form-select" aria-label="Default select example" required v-model="gameId">
                  <option v-for="game in games" :key="game.id" :value="game.id">
                    <img :src="game.image" alt="game image" class="game-image" />
                    {{ game.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label for="inputDescription" class="form-label">Description</label>
              <input id="inputDescription" type="text" class="form-control" v-model="description" required/>
            </div>
            <button class="btn btn-primary">Find your teammates!</button>
          </form>
        </div>
      </div>
    </div>

  </section>


</template>



<style lang="css" scoped></style>
