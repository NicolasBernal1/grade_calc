# Calculadora De Notas

Extensión de Chrome que permite calcular la nota necesaria para aprobar una asignatura a partir de las calificaciones y porcentajes de las evaluaciones realizadas.

## Características

- Registrar calificaciones y sus respectivos porcentajes.
- Agregar y eliminar evaluaciones.
- Establecer una nota objetivo para aprobar.
- Calcular la nota necesaria en las evaluaciones restantes.
- Guardar automáticamente las evaluaciones utilizando Chrome Storage.
- Interfaz disponible en inglés y español.

## Tecnologías

- React
- TypeScript
- CSS
- Chrome Extension API (Manifest V3)
- ChatGPT (Hizo el css, no me gusta css)

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Construir el proyecto:

   ```bash
   npm run build
   ```

4. Abrir `chrome://extensions/` en Google Chrome.
5. Activar el **Modo de desarrollador**.
6. Seleccionar **Cargar extensión sin empaquetar**.
7. Seleccionar la carpeta generada por el proceso de construcción (normalmente `dist`).

## Uso

1. Establecer la nota objetivo.
2. Ingresar las calificaciones obtenidas y sus respectivos porcentajes.
3. Agregar o eliminar evaluaciones según sea necesario.
4. Presionar el botón de calcular.
5. Consultar la nota necesaria para alcanzar el objetivo.

Las evaluaciones se guardan automáticamente en el almacenamiento local de Chrome.