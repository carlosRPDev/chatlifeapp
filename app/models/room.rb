class Room < ApplicationRecord
  validates_uniqueness_of :name

  scope :public_rooms, -> { where(is_private: false) }
  after_create_commit { broadcast_append_to "rooms" }
  after_create_commit { broadcast_if_public }

  has_many :messages
  has_many :participants, dependent: :destroy
  has_many :users, through: :participants

  def broadcast_if_public
    broadcast_append_to "rooms" unless self.is_private
  end

  def self.create_private_room(users, room_name)
    single_room = Room.create(name: room_name, is_private: true)
    users.each do |user|
      Participant.create(user_id: user.id, room_id: single_room.id)
    end
    single_room
  end

  def self.private_room_for(user1, user2)
    users = [ user1, user2 ].sort_by(&:id)
    room_name = "private_#{users[0].id}_#{users[1].id}"

    room = Room.find_by(name: room_name)

    unless room
      room = create_private_room(users, room_name)
    end

    # Asegura que ambos estén como participantes (por si acaso)
    users.each do |user|
      Participant.find_or_create_by!(user_id: user.id, room_id: room.id)
    end

    room
  end

  def unread_count_for(user)
    return 0 unless user

    Message
      .joins("LEFT JOIN message_reads mr ON mr.message_id = messages.id AND mr.user_id = #{user.id}")
      .where(room_id: id)
      .where.not(user_id: user.id)
      .where("mr.id IS NULL")
      .count
  end
end
