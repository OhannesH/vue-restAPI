<script>
import axios from "axios";
import { API_ENDPOINTS } from "@/config";

export default {
  data() {
    return {
      listings: [],
      isLoading: true, 
      error: null,
      isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false, 
      currentPage: 1,
      showMessageBox: false,
      messageContent: '',
      recipientId: null, // Variable to store the recipient user ID
    };
  },
  async mounted() {
      const token = localStorage.getItem('jwt');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          this.loadListings();  // Load listings after setting the token
        } else {
        this.$router.push('/login');  // Redirect to login if no token
        }
        await this.loadListings();
  },
  methods: {
    // Fetch listings from the API for the current page
    async loadListings() {
      try {
        this.isLoading = true;
        this.error = null;
        const results = await axios.get(`${API_ENDPOINTS.listings}`);
        if (!results.data || !Array.isArray(results.data)) {
          throw new Error("Invalid data format received from API");
        }
        this.listings = results.data;
      } catch (error) {
        console.error("Error loading listings:", error);
        this.error = error.message || "An error occurred while fetching listings";
      } finally {
        this.isLoading = false;
      }
    },

      openMessageBox(listing) {
      this.recipientId = listing.user.id;
      this.showMessageBox = true;
    },

    // Send the message to the selected listing's owner
    async sendMessage() {
      try {
        if (!this.recipientId || !this.messageContent) {
          alert("Please enter a message before sending.");
          return;
        }

        // Send the message via API (you can adjust API endpoint as per your backend)
        const response = await axios.post(API_ENDPOINTS.inbox, {
          sender_id: localStorage.getItem("userId"),
          receiver_id: this.recipientId,
          message: this.messageContent,
        });

        console.log("Message sent:", response.data);
        alert("Message sent!");

        // Hide the message box after sending
        this.showMessageBox = false;
        this.selectedListing = null;
        this.messageContent = "";
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Error sending message. Please try again.");
      }
    },
    async deleteListing(listingId) {
      try {
        await axios.delete(`${API_ENDPOINTS.listings}/${listingId}`);
        this.listings = this.listings.filter((listing) => listing.id !== listingId);
        alert("Listing deleted successfully.");
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Error deleting listing. Please try again.");
      }
    },

    // Pagination methods
    async loadNextPage() {
      this.currentPage++;
      await this.loadListings();
    },
    async loadPreviousPage() {
      this.currentPage--;
      await this.loadListings();
    },
  },
};
</script>

<template>
  <div v-if="error" class="alert alert-danger" role="alert">
    {{ error }}
  </div>
  <div v-if="isLoading">Loading...</div>
  <div v-else>
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Game</th>
          <th>Description</th>
          <th>Username</th>
          <th>Message</th>
          <!-- Conditionally render the 'Delete' column for admins -->
          <th v-if="isAdmin">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="listing in listings" :key="listing.id">
          <td>{{ listing.game_id }}</td>
          <td>{{ listing.game.name }}</td>
          <td>{{ listing.description }}</td>
          <td>{{ listing.username }}</td>
          <td>
            <button @click="openMessageBox(listing)" class="btn btn-primary">
              Message
            </button>
          </td>
          <!-- Conditionally render the 'Delete' button for admins -->
          <td v-if="isAdmin">
            <button @click="deleteListing(listing.id)" class="btn btn-danger">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showMessageBox" class="message-box">
      <div class="input-group mb-0">
        <div class="input-group-prepend">
          <button class="btn btn-primary" @click="sendMessage">
            <i class="fa fa-send"></i>
          </button>
        </div>
        <input
          type="text"
          id="messageContent"
          class="form-control"
          placeholder="Enter text here..."
          v-model="messageContent"
          required
        />
      </div>
      <button class="btn btn-secondary" @click="showMessageBox = false">Close</button>
    </div>

    <nav aria-label="...">
      <ul class="pagination">
        <li :class="{ 'page-item': true, disabled: currentPage === 1 }">
          <a @click="loadPreviousPage" class="page-link" href="#">Previous</a>
        </li>
        <li :class="{ 'page-item': true, disabled: listings.length < 10 }">
          <a @click="loadNextPage" class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="css" scoped></style>
