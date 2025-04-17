# 🍔 Goikounter – Extensión para Chrome

**Goikounter** es una extensión de Chrome desarrollada para optimizar el flujo de cocina en restaurantes que utilizan **Waitry** u otras plataformas similares. Esta herramienta ayuda a contar automáticamente tipos de panes, patatas, y a detectar pedidos manuales evitando duplicaciones en momentos de alto volumen.

---

## ✨ Funcionalidades principales

- 🥖 **Cuenta panes grandes (G), pequeños (P) y veganos (VG)**
- 🍟 **Cuenta patatas finas por variaciones del pedido**
- 🧾 **Muestra un orden visual (ej: `Grx2-Pqx1-VGx1`)**
- 🚨 **Detecta pedidos manuales y reproduce un sonido de alerta**
- 📦 **Muestra datos en tiempo real en una ventana flotante fija**
- ⚙️ **Completamente configurable vía `config.json`**

---
## 📸 Vista previa


---
## 🧑‍🍳 ¿Para qué sirve?

- Evitar cocinar pedidos duplicados
- Tener un conteo en tiempo real de panes y patatas
- Organizar mejor el servicio de cocina según tipo de pedido: **Sala** o **Delivery**
- Confirmar alertas manuales entregadas por camareros

---
## ⚙️ Instalación

1. Clona o descarga este repositorio.
2. En Chrome, abre `chrome://extensions/`
3. Activá el **Modo de desarrollador** (arriba a la derecha).
4. Haz clic en **"Cargar descomprimida"** y seleccioná la carpeta del proyecto.
5. Asegúrate de que la extensión esté habilitada ✅

---
🧩 Requisitos
Chrome versión 102+ (o cualquier navegador Chromium)

Acceso a la página donde se cargan los pedidos (por ejemplo: app.waitry.net)

Tener habilitada la extensión


---

## 🧩 Configuración inicial

-burgerPanMap: Mapa entre el nombre de la burger y el tipo de pan (G, P)

-keywordsPatatas: Palabras clave para detectar patatas finas

-pollingIntervalMs: Intervalo en milisegundos para actualizar el conteo

Todo es personalizable desde el archivo `config.json`:

```json
{
  "burgerPanMap": {
    "kevin bacon": "G",
    "don vito": "P",
    "basic onion smash": "P"
  },
  "keywordsPatatas": ["patatas finas", "house fries"],
  "pollingIntervalMs": 3000
}
]

