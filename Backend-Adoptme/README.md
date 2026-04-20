# 🐾 AdoptMe - Backend

Backend del proyecto AdoptMe, una plataforma para la adopción de mascotas.

## 🐳 Docker

Este proyecto está dockerizado y disponible públicamente en **Docker Hub**.

### 🔗 Enlace a la imagen
👉 [daybl/adoptme-backend en Docker Hub](https://hub.docker.com/r/daybl/adoptme-backend)

### ▶️ Cómo ejecutar

Para ejecutar la aplicación con Docker, usa el siguiente comando (reemplaza `<MONGO_URI>` con tu cadena de conexión real):

```bash
docker run -p 8080:8080 \
  -e MONGO_URI="mongodb+srv://<usuario>:<contraseña>@cluster0.abc123.mongodb.net/adoption?retryWrites=true&w=majority" \
  daybl/adoptme-backend
```