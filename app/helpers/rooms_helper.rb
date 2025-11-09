module RoomsHelper
  def render_user(user)
    user || current_user
  end
end
