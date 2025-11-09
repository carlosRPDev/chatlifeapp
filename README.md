# ChatLifeApp

## Descripción

**ChatLifeApp** es una aplicación de chat en tiempo real que permite crear salas públicas y privadas, enviar y recibir mensajes instantáneos, y ver notificaciones de mensajes no leídos. La aplicación está construida con **Ruby on Rails**, **Turbo/Hotwire**, y un frontend responsive que funciona en desktop y dispositivos móviles.

### Características principales

- Creación de salas públicas y privadas.
- Mensajería en tiempo real.
- Notificaciones y badges de mensajes no leídos.
- Soporte para múltiples usuarios y gestión de participantes.
- Responsive: funciona en laptops y dispositivos móviles.
- Sistema de autenticación con `current_user`.

---

## Tecnologías utilizadas

- **Backend:** Ruby on Rails 8.x  
- **Frontend:** Turbo/Hotwire, HTML, CSS, Bootstrap
- **Base de datos:** sqlite3  
- **Autenticación:** Sistema propio con `current_user`  
- **Websockets / Real-time:** Action Cable para Turbo Streams  
- **Control de versiones:** Git / GitHub  

---

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/tu_usuario/chatlifeapp.git
cd chatlifeapp
```

Instala dependencias

```bash
bundle install
```

Prepara la base de datos

```bash
rails db:create
rails db:migrate
rails db:seed  # opcional
```

Inicia la aplicación

```bash
rails server
```

Visita la aplicación en tu navegador: <http://localhost:3000>

---

## Uso

- Crear usuario desde la consola

```bash
rails console # Esperar que cargue la consola
# ejecutar
User.create(username: 'name_user')
```

- Crear una nueva sala desde el formulario de “Create Room”.
- Seleccionar una sala para abrir el chat.
- Los mensajes se actualizan en tiempo real y las notificaciones de mensajes no leídos se muestran como badges.
- Funciona tanto en desktop como en dispositivos móviles (con Turbo Streams y reconexión automática en móviles).

---

## Estructura del proyecto

- `app/controllers` → Controladores de salas, mensajes, usuarios.
- `app/models` → Modelos de Room, Message, User, Participant.
- `app/views` → Vistas con partials `_room.html.erb`, `_new_room_form.html.erb`, etc.
- `app/javascript/controllers` → Controladores Stimulus para interacción en tiempo real.
- `config/routes.rb` → Rutas para salas, mensajes y autenticación.

---

## Contribución

Si deseas contribuir:

1. Haz un fork del repositorio.
2. Crea una rama nueva (git checkout -b feature/nueva-funcionalidad).
3. Haz tus cambios y commitea (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request en GitHub.
