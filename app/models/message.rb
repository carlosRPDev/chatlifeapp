class Message < ApplicationRecord
  after_create_commit { broadcast_append_to self.room }
  belongs_to :user
  belongs_to :room
end
