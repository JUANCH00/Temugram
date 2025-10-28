# Consistencia Causal - Demo Interactiva

Una aplicación interactiva en React que demuestra el concepto de **consistencia causal** en sistemas distribuidos mediante un sistema de comentarios distribuido en múltiples servidores.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)
![License](https://img.shields.io/badge/License-MIT-green.svg)

##  Descripción

Este proyecto simula un sistema distribuido de comentarios con tres servidores independientes que mantienen consistencia causal. Demuestra cómo los eventos (comentarios y respuestas) se propagan entre servidores respetando las relaciones de causalidad, asegurando que las respuestas nunca aparezcan antes que sus comentarios padre.

### Características Principales

-  **Tres servidores distribuidos** que simulan réplicas independientes
-  **Latencias de red variables** entre servidores
-  **Preservación de causalidad** usando vector clocks
-  **Sistema de comentarios con respuestas anidadas**
-  **Sincronización automática** entre servidores
-  **Cola de eventos pendientes** para eventos que esperan sus dependencias
-  **Visualización en tiempo real** del estado de cada servidor

##  Conceptos Demostrados

### Consistencia Causal

La consistencia causal garantiza que:
- Si un evento A causa un evento B, entonces todos los servidores verán A antes que B
- Las respuestas siempre aparecen después de sus comentarios padre
- Los eventos sin relación causal pueden aparecer en diferente orden en distintos servidores

### Vector Clocks

Cada evento mantiene un vector clock que rastrea el estado lógico del sistema, permitiendo determinar relaciones de causalidad entre eventos distribuidos.

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/causal-consistency-demo.git

# Entrar al directorio
cd causal-consistency-demo

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Uso

1. **Seleccionar un servidor**: Haz clic en uno de los tres botones de servidor (Server-A, Server-B, Server-C)

2. **Crear un comentario**: Escribe un mensaje en el campo de texto y presiona "Publicar"

3. **Responder a un comentario**: Haz clic en el botón de respuesta junto a cualquier comentario y escribe tu respuesta

4. **Observar la sincronización**: Cambia entre servidores para ver cómo los eventos se propagan con diferentes latencias

5. **Eventos pendientes**: Observa cómo las respuestas esperan en cola si su comentario padre aún no ha llegado


### Componentes Clave

#### `CausalServer`
Clase que simula un servidor individual con:
- Gestión de eventos locales
- Vector clock para tracking de causalidad
- Cola de eventos pendientes
- Lógica de inserción ordenada

#### `CausalConsistencyDemo`
Componente React principal que maneja:
- Estado de los tres servidores
- Interfaz de usuario
- Sincronización entre servidores
- Renderizado de eventos

## 🔧 Configuración

### Latencias de Red

Las latencias entre servidores se configuran en el método `syncServers`:

```javascript
const serverLatencies = [
  3000 + Math.random() * 2000,  // 3-5 segundos
  5000 + Math.random() * 3000,  // 5-8 segundos
  7000 + Math.random() * 3000   // 7-10 segundos
];
```

Las respuestas tienen un multiplicador de latencia de 0.6x para simular prioridad.

## 🎨 Personalización

### Estilos

Los estilos están centralizados en `src/styles.css` y utilizan:
- Variables CSS para colores consistentes
- Diseño responsive con media queries
- Gradientes y sombras modernas

### Colores Principales

- Azul primario: `#2563eb`
- Fondo: Gradiente azul claro
- Texto: `#1f2937`

## 📚 Aprendizaje

Este proyecto es ideal para entender:
- Sistemas distribuidos
- Modelos de consistencia
- Relojes vectoriales
- Propagación de eventos
- Ordenamiento causal
- React y gestión de estado

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHu
