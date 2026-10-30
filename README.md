# API de Biblioteca

## 1. Descripción

Esta API permite administrar los autores, libros y préstamos de una biblioteca. Está desarrollada con Node.js, Express y MySQL.

## 2. Requisitos

- Node.js.
- MySQL, por ejemplo, mediante XAMPP.
- Una base de datos llamada `biblioteca`.

## 3. Instalación

Abre una terminal en la carpeta del proyecto y ejecuta:


npm install


## 4. Configuración de la base de datos

Crea el archivo `.env` en la carpeta principal con esta configuración:

env
PUERTO=3000
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASS=123456
DB_NAME=biblioteca


Ajusta el puerto y la contraseña si tu configuración de MySQL es diferente.

## 5. Ejecutar el servidor

Inicia MySQL desde XAMPP y ejecuta el servidor desde la carpeta del proyecto:

node app.js


Si utilizas el ejecutable portátil de Node.js, ejecuta:


..\node.exe app.js


El servidor estará disponible en:

http://localhost:3000

## 6. Endpoints disponibles

### Autores

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/autores` | Consultar todos los autores |
| GET | `/api/autores/:id` | Consultar un autor por ID |
| GET | `/api/autores/nacionalidad/:nacionalidad` | Filtrar por nacionalidad |
| POST | `/api/autores` | Registrar un autor |
| PUT | `/api/autores/:id` | Actualizar un autor |
| DELETE | `/api/autores/:id` | Eliminar un autor |

### Libros

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/libros` | Consultar todos los libros |
| GET | `/api/libros/:id` | Consultar un libro por ID |
| POST | `/api/libros` | Registrar un libro |
| PUT | `/api/libros/:id` | Actualizar un libro |
| DELETE | `/api/libros/:id` | Eliminar un libro |

### Préstamos

| Método | Ruta | Función |
|---|---|---|
| POST | `/api/prestamos/devolucion` | Registrar la devolución de un libro |

## 7. Ejemplos de solicitudes

### Registrar un autor

Método: POST

Ruta: `http://localhost:3000/api/autores`

```json
{
  "nombre": "Gabriel García Márquez",
  "nacionalidad": "Colombiana"
}
```

### Registrar un libro

Método: POST

Ruta: `http://localhost:3000/api/libros`

```json
{
  "titulo": "Libro de prueba",
  "anio": 2024,
  "autor_id": 1
}
```

### Registrar una devolución

Método: POST

Ruta: `http://localhost:3000/api/prestamos/devolucion`

```json
{
  "prestamo_id": 1
}
```

## 8. Estructura del proyecto


api_biblioteca/
├── config/
│   └── db.js
├── controllers/
│   ├── autoresController.js
│   ├── librosController.js
│   └── prestamosController.js
├── routes/
│   ├── autores.js
│   ├── libros.js
│   └── prestamos.js
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
├── probar.html
└── README.md

## 9. Seguridad

El archivo `.env` contiene las credenciales de la base de datos y no debe compartirse ni publicarse. El archivo `.gitignore` debe excluirlo del control de versiones.