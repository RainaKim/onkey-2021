// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
Turbolinks.start()
ActiveStorage.start()

class Chat {
    constructor() {
      this.channel = null;
      this.client = null;
      this.identity = null;
      this.messages = ["Connecting..."];
      this.initialize();
    }
  
    initialize() {
        this.renderMessages();

        Rails.ajax({
            url: "/tokens",
            type: "POST",
            success: data => {
            this.identity = data.identity;
    
            Twilio.Chat.Client
                .create(data.token)
                .then(client => this.setupClient(client));
            }
        });
    }
  
    joinChannel() {
      if (this.channel.state.status !== "joined") {
        this.channel.join().then(function(channel) {
          console.log("Joined General Channel");
         });
      }
    }
  
    setupChannel(channel) {
      this.channel = channel;
      this.joinChannel();
      this.addMessage({ body: `Joined general channel as ${this.identity}` });
      this.channel.on("messageAdded", message => this.addMessage(message));
      this.setupForm();
    }

    setupForm() {
        const form = document.querySelector(".chat form");
        const input = document.querySelector(".chat form input");
    
        form.addEventListener("submit", event => {
          event.preventDefault();
          this.channel.sendMessage(input.value);
          input.value = "";
          return false;
        });
    }
    
    setupClient(client) {
      this.client = client;
      this.client.getChannelByUniqueName("general")
        .then((channel) => this.setupChannel(channel))
        .catch((error) => {
          this.client.createChannel({
            uniqueName: "general",
            friendlyName: "General Chat Channel"
          }).then((channel) => this.setupChannel(channel));
        });
    }

    renderMessages() {
        let messageContainer = document.querySelector(".chat .messages");
        messageContainer.innerHTML = this.messages
            .map(message => `<div class="message">${message}</div>`)
            .join("");
    }

    addMessage(message) {
        let html = "";
    
        if (message.author) {
          const className = message.author == this.identity ? "user me" : "user";
          html += `<span class="${className}">${message.author}: </span>`;
        }
    
        html += message.body;
        this.messages.push(html);
        this.renderMessages();
    }
    
  };

Rails.ajax({
    url: "/tokens",
    type: "POST",
    success: function(data) {
        Twilio.Chat.Client
            .create(data.token)
            .then(function(chatClient) {
                chatClient.getChannelByUniqueName("general")
                    .then(function(channel){
                        // general channel exists
                    })
                    .catch(function(){
                        // general channel does not exist
                        chatClient.createChannel({
                            uniqueName: "general",
                            friendlyName: "General Chat Channel"
                        }).then(function(channel) {
                            if (channel.state.status !== "joined") {
                              channel.join().then(function(channel) {
                                console.log("Joined General Channel");
                              })
                            }
                          });
                    })
                });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".chat")) {
      window.chat = new Chat();
    }
});