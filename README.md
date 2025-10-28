# **Nano-Router**
---
## **Descripción General**
**Nano-Router** es un enrutador minimalista para aplicaciones web de una sola página (SPA). Permite la navegación entre vistas sin recargar la página, manejando el historial del navegador y la carga dinámica de contenido HTML. Está diseñado para ser **ligero**, **fácil de integrar** y **reactivo**, ideal para proyectos pequeños o medianos que no requieren un framework completo como React Router o Vue Router.

**Novedad:** Ahora soporta **rutas con parámetros** (ej: `/user/:id`), lo que permite crear aplicaciones más dinámicas y flexibles.

---
## **Características Principales**
- **Navegación sin recarga**: Cambia entre vistas sin recargar la página.
- **Soporte para historial del navegador**: Usa `pushState` y `popstate` para manejar el historial.
- **Carga dinámica de HTML**: Permite cargar contenido HTML desde archivos externos.
- **Inicialización de vistas**: Ejecuta funciones de inicialización al cargar una vista.
- **Limpieza automática**: Ejecuta funciones de limpieza al salir de una vista.
- **Manejo de enlaces internos**: Intercepta clics en enlaces internos para evitar recargas.
- **Soporte para rutas con parámetros**: Permite definir rutas dinámicas como `/user/:id`.

---
## **API de Nano-Router**
### **1. Instanciación**
#### **`new Router(mountPoint)`**
Crea una nueva instancia del enrutador.
- **`mountPoint`**: Selector CSS del elemento del DOM donde se renderizarán las vistas.
**Ejemplo:**
```javascript
const router = new Router("#app");
```
---
### **2. Registro de Rutas**
#### **`register(path, page)`**
Registra una ruta y su vista asociada. Ahora soporta rutas con parámetros (ej: `/user/:id`).
- **`path`**: Ruta (ej: `/`, `/about`, `/user/:id`).
- **`page`**: Objeto que describe la vista. Puede contener:
  - **`html`**: Ruta al archivo HTML que se cargará.
  - **`init(container, params)`**: Función que se ejecutará al cargar la vista. Recibe el contenedor y los parámetros de la ruta. Puede devolver una función de limpieza.
**Ejemplo:**
```javascript
router.register("/user/:id", {
  html: "/views/user.html",
  init: (container, params) => {
    console.log(`Vista de usuario cargada para el ID: ${params.id}`);
    container.querySelector("h1").textContent = `Usuario ${params.id}`;
    return () => console.log(`Saliendo de la vista de usuario ${params.id}`);
  }
});
```
---
### **3. Navegación**
#### **`navigate(path)`**
Navega a una ruta específica.
- **`path`**: Ruta a la que se desea navegar.
**Ejemplo:**
```javascript
router.navigate("/user/123");
```
---
### **4. Inicialización del Enrutador**
#### **`init()`**
Inicializa el enrutador y configura los escuchas de eventos para la navegación.
**Ejemplo:**
```javascript
router.init();
```
---
## **Ejemplo Completo**
### **1. Estructura del Proyecto**
```
/public/
  ├── index.html
  ├── /views/
  │   ├── home.html
  │   ├── about.html
  │   ├── contact.html
  │   └── user.html
  └── app.js
```
### **2. Archivo `index.html`**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nano-Router</title>
  <style>
    nav a.active {
      font-weight: bold;
      color: blue;
    }
  </style>
</head>
<body>
  <nav>
    <a href="/">Inicio</a>
    <a href="/about">Acerca de</a>
    <a href="/contact">Contacto</a>
    <a href="/user/123">Usuario 123</a>
  </nav>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>
```
### **3. Archivo `app.js`**
```javascript
import { Router } from './nano-router.js';
// Crea una instancia del enrutador
const router = new Router("#app");
// Registra las rutas
router.register("/", {
  html: "/views/home.html",
  init: (container) => {
    console.log("Vista de inicio cargada");
    return () => console.log("Saliendo de la vista de inicio");
  }
});
router.register("/about", {
  html: "/views/about.html",
  init: (container) => {
    console.log("Vista 'Acerca de' cargada");
    return () => console.log("Saliendo de la vista 'Acerca de'");
  }
});
router.register("/contact", {
  html: "/views/contact.html",
  init: (container) => {
    console.log("Vista de contacto cargada");
    return () => console.log("Saliendo de la vista de contacto");
  }
});
// Ruta con parámetro
router.register("/user/:id", {
  html: "/views/user.html",
  init: (container, params) => {
    console.log(`Vista de usuario cargada para el ID: ${params.id}`);
    container.querySelector("h1").textContent = `Usuario ${params.id}`;
    return () => console.log(`Saliendo de la vista de usuario ${params.id}`);
  }
});
// Inicializa el enrutador
router.init();
```
### **4. Archivo `views/user.html`**
```html
<h1>Perfil de Usuario</h1>
<p>Detalles del usuario.</p>
```
---
## **Casos de Uso**
- **Aplicaciones SPA simples**: Ideal para proyectos pequeños que no requieren un framework completo.
- **Prototipado rápido**: Permite crear prototipos funcionales de navegación en minutos.
- **Integración con bibliotecas de UI**: Puede usarse junto con bibliotecas como Nano-Signals para crear aplicaciones reactivas completas.
- **Aplicaciones con contenido dinámico**: Ideal para mostrar contenido basado en parámetros de ruta (ej: perfiles de usuario, productos, etc.).

---
## **Ventajas**
- **Ligero**: Solo unas pocas líneas de código.
- **Fácil de usar**: API minimalista y clara.
- **Sin dependencias**: No requiere frameworks adicionales.
- **Reactivo**: Permite inicializar y limpiar vistas de forma dinámica.
- **Soporte para rutas con parámetros**: Permite crear aplicaciones más dinámicas.

---
## **Limitaciones**
- **No soporta rutas anidadas complejas**: No maneja jerarquías profundas de rutas.
- **Sin manejo avanzado de errores**: No incluye manejo de errores para rutas no encontradas (aunque se puede implementar manualmente).
- **Sin soporte para hash routing**: Solo funciona con rutas basadas en `pathname`.

---
## **Posibles Mejoras**
- Añadir soporte para **rutas anidadas**.
- Implementar **métodos para redirigir** automáticamente a una ruta en caso de error.
- Implementar **guards de navegación** para validar antes de cambiar de ruta.
- Añadir soporte para **hash routing** como alternativa.

---
