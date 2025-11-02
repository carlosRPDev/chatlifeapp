class Message < ApplicationRecord
  before_create :confirm_participant
  after_create_commit { broadcast_append_to self.room }
  after_create_commit :mark_as_read_for_sender
  after_create_commit :broadcast_unread_counts

  belongs_to :user
  belongs_to :room
  has_many :message_reads, dependent: :destroy

  private

  def confirm_participant
    if self.room.is_private
      is_participant = Participant.where(user_id: self.user.id, room_id: self.room.id).first
      throw :abort unless is_participant
    end
  end

  def mark_as_read_for_sender
    message_reads.create(user: user, read_at: Time.current)
  end

  def broadcast_unread_counts
    recipients =
      if room.name.start_with?("private_")
        room.users.where.not(id: user.id)
      else
        User.where.not(id: user.id)
      end

    recipients.find_each do |recipient|
      active_room_id = User.active_room_for(recipient.id)
      active_room = Room.find_by(id: active_room_id)

      same_room =
        active_room.present? &&
        (active_room.id == room.id ||
        (room.name.start_with?("private_") && active_room.name == room.name))

      if same_room
        message_reads.find_or_create_by(user: recipient) do |mr|
          mr.read_at = Time.current
        end
      else
        Turbo::StreamsChannel.broadcast_replace_to(
          "unreads_#{recipient.id}",
          target: "room_#{room.id}_unread_count_user_#{recipient.id}",
          partial: "rooms/unread_count",
          locals: { room: room, user: recipient }
        )
      end
    end
  end
end
