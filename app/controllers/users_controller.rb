class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @current_user = current_user
    @rooms = Room.public_rooms
    @users = User.all_except(@current_user)

    @room = Room.new
    @message = Message.new

    @single_room = Room.private_room_for(@user, @current_user)

    # @room_name = get_name(@user, @current_user)
    # @single_room = Room.where(name: @room_name).first || Room.create_private_room([ @user, @current_user ], @room_name)

    @messages = @single_room.messages

    @single_room.messages.each do |message|
      next if message.user == @current_user
      MessageRead.find_or_create_by(user: @current_user, message: message).update(read_at: Time.current)
    end

    User.set_active_room(@current_user.id, @single_room.id)

    Turbo::StreamsChannel.broadcast_replace_to(
      "unreads_#{@user.id}",
      target: "room_#{@single_room.id}_unread_count_user_#{@user.id}",
      partial: "rooms/unread_count",
      locals: { room: @single_room, user: @user }
    )

    render "rooms/index"
  end

  private

  def get_name(user1, user2)
    users = [ user1, user2 ].sort
    "private_#{users[0].id}_#{users[1].id}"
  end
end
