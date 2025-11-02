class User < ApplicationRecord
  cattr_accessor :active_rooms
  validates_uniqueness_of :username

  scope :all_except, ->(user) { where.not(id: user) }
  after_create_commit { broadcast_append_to "users" }

  has_many :messages
  has_many :rooms, through: :room_users

  self.active_rooms = {}

  def self.set_active_room(user_id, room_id)
    self.active_rooms[user_id.to_i] = room_id.to_i
  end

  def self.clear_active_room(user_id)
    self.active_rooms.delete(user_id.to_i)
  end

  def self.active_room_for(user_id)
    self.active_rooms[user_id.to_i]
  end
end
