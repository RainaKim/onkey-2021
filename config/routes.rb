Rails.application.routes.draw do
  resources :tokens, only: [:create]
  resources :chats, only: [:create]
  delete '/chats' => 'chats#delete'
  root to: 'chats#show'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
