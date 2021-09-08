Rails.application.routes.draw do
  resources :tokens, only: [:create]
  resources :chats, only: [:create]
  post '/chats' => 'chats#create'
  delete '/chats' => 'chats#delete'
  get '/chats/show' => 'chats#show'
  root to: 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
