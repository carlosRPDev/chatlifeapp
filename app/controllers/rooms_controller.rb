class RoomsController < ApplicationController
  def index
    @current_user = current_user
    redirect_to "/signin" unless @current_user
    @rooms = Room.public_rooms
    @users = User.all_except(@current_user)

    @room = Room.new
  end

  def show
    @current_user = current_user
    @single_room = Room.find(params[:id])
    @messages = @single_room.messages

    User.set_active_room(current_user.id, @single_room.id)

    @single_room.messages.each do |message|
      # next if message.user == @current_user
      # MessageRead.find_or_create_by(user: @current_user, message: message).update(read_at: Time.current)

      next if message.user_id == current_user.id
      message.message_reads.find_or_create_by(user: current_user).update(read_at: Time.current)
    end

    @rooms = Room.public_rooms
    @users = User.all_except(@current_user)

    @room = Room.new
    @message = Message.new

    Turbo::StreamsChannel.broadcast_replace_to(
      "unreads_#{@current_user.id}",
      target: "room_#{@single_room.id}_unread_count_user_#{@current_user.id}",
      partial: "rooms/unread_count",
      locals: { room: @single_room, user: @current_user }
    )

    render "index"
  end

  def create
    @room = Room.create(name: params["room"]["name"])

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.append(
          "rooms",
          partial: "rooms/room",
          locals: { room: @room, current_user: current_user }
        )
      end
      format.html { redirect_to rooms_path }
    end
  end
end
