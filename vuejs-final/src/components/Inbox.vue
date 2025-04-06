<script>
import { API_ENDPOINTS } from "@/config";
import axios from "axios";
export default {

    name: "Inbox",
  data() {
    return {
      messages: [],
      contacts: [],
      selectedContact: null,
      user_id: null,
      receiver_id: null,
      messageContent: "",
    };
  },
  async mounted() {
    const token = localStorage.getItem('jwt');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            this.user_id = localStorage.getItem("userId");
            await this.loadMessages();
            await this.processMessages();
            if (!this.selectedContact && this.contacts.length > 0) {
            this.selectedContact = this.contacts[0];
        } else {
        this.$router.push('/login');  // Redirect to login if no token
        }

  }

  // Set loading state to false after everything is processed
  this.isLoading = false;
  },
  methods: {

    async loadMessages() {
      try {
        this.isLoading = true;
        this.error = null;
        const results = await axios.get(`${API_ENDPOINTS.inbox}/${this.user_id}`);
        console.log(results.data);
        this.messages = results.data;
        
        return results.data;
      } catch (error) {
        console.error(error);
        this.error = error.message || "An error occurred";
      } finally {
        this.isLoading = false;
      }
    },
    async processMessages() {
        const groupedContacts = {};
        this.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        console.log("Messages:", this.messages);
        console.log("User ID:", this.user_id);
        // Go through each message and assign to contacts
        this.messages.forEach((message) => {
            let contactId;
            let contactUsername;

            if (message.sender_id === this.user_id) {
            contactId = message.receiver_id;
            contactUsername = message.receiver.username; // Receiver's username
            } else {
            contactId = message.sender_id;
            contactUsername = message.sender.username; // Sender's username
            }

            if (!groupedContacts[contactId]) {
            groupedContacts[contactId] = {
                contactId,
                contactUsername, // Store the username as well
                messages: [], // Store messages for the contact
            };
            }

            // Add message to the respective contact
            groupedContacts[contactId].messages.push(message);
        });

        // Convert grouped contacts into an array and assign to contacts data property
        this.contacts = Object.values(groupedContacts);
        console.log("Grouped Contacts:", this.contacts);
 },

    async sendMessage() {
    try {
        const newMessage = {
        sender_id: this.user_id,
        receiver_id: this.selectedContact.contactId,
        message: this.messageContent,
        created_at: new Date().toISOString(), // fake timestamp until backend returns real one
        id: Math.random().toString(36).substr(2, 9), // temp id (if needed for key)
        };

        const res = await axios.post(API_ENDPOINTS.inbox, {
        sender_id: this.user_id,
        receiver_id: this.selectedContact.contactId,
        message: this.messageContent,
        });

        // Optionally use real message from backend:
        // const newMessage = res.data;

        // Push message to the current selected contact
        this.selectedContact.messages.push(newMessage);

        // Clear the input field
        this.messageContent = "";

        console.log("Message sent:", res);
    } catch (error) {
        console.error("Message sending failed:", error.response?.data || error.message);
        alert("Message sending failed. Please check your information.");
    }
    },
  }
};


</script>

<template>
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />

<div class="container">
<div class="row clearfix">
    <div class="col-lg-12">
        <div class="card chat-app">
            <div id="plist" class="people-list">
                
                <ul class="list-unstyled chat-list mt-2 mb-0">
                    <li
                        class="clearfix"
                        v-for="contact in contacts"
                        :key="contact.contactId"
                        :class="{ active: selectedContact && selectedContact.contactId === contact.contactId }"
                        @click="selectedContact = contact"
                        >
                        <div class="about">
                            <div class="name">{{ contact.contactUsername }}</div>
                        </div>
                    </li>

                </ul>
            </div>
            <div class="chat">
                <div class="chat-header clearfix">
                    <div class="row">
                        <div class="col-lg-6">
                            <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                            </a>
                            <div class="chat-about" v-if="selectedContact">
                                <h6 class="m-b-0">{{selectedContact.contactUsername}}</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-history" v-if="user_id">
                    <ul class="m-b-0">
                        <!-- Loop through messages -->
                        <li class="clearfix" v-for="message in selectedContact.messages" :key="message.id" v-if="selectedContact">
                        <!-- Conditional message styling -->
                        <div :class="{
                            'message my-message': message.sender_id === user_id, 
                            'message other-message float-right': message.receiver_id === user_id
                        }">
                            {{ message.message }}
                        </div>
                        </li>
                    </ul>
                    </div>
                    <div class="chat-message clearfix">
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
                    </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>

<style lang="css" scoped></style>
