require 'twilio-ruby'
class ChatsController < ApplicationController
  before_action :require_login
  @webhook_sid = nil


  def show
  end

  def create
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    @client = Twilio::REST::Client.new(account_sid, auth_token)

    webhook = @client.chat.services('IS0b14bd0b76df4de79e3b91c51193466a')
                          .channels('CH23ddafdbdf7b485985e607207d1f9aea')
                          .webhooks
                          .create(
                            configuration_filters: ['onMessageSent'],
                            configuration_method: 'POST',
                            configuration_url: 'https://channels.autopilot.twilio.com/v1/AC2884a9308aaaae0f9ad6ef3f366a740b/UA5685dfacef2589db2628d088d5a5f0d8/twilio-chat',
                            type: 'webhook'
                          )
    @webhook_sid = webhook.sid
    session[:webhook_sid] = @webhook_sid
  end

  def delete
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    @client = Twilio::REST::Client.new(account_sid, auth_token)
    puts "webhook_sid!!!"
    puts session[:webhook_sid]
    @client.chat.services('IS0b14bd0b76df4de79e3b91c51193466a')
            .channels('CH23ddafdbdf7b485985e607207d1f9aea')
            .webhooks(session[:webhook_sid])
            .delete
  end
end
