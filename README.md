# Mis Gastos - Aplicación Móvil

Aplicación móvil para la gestión de gastos personales y planificación de ahorros, desarrollada con React Native, Expo y TypeScript.

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (para desarrollo en Android)
- [Xcode](https://developer.apple.com/xcode/) (para desarrollo en iOS, solo macOS)

## 📱 Configuración del Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd mis-gastos-mob
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear un archivo `.env` en la raíz del proyecto
   ```env
   AUTH0_DOMAIN=your-auth0-domain
   AUTH0_CLIENT_ID=your-auth0-client-id
   API_URL=your-api-url
   ```

4. **Configurar Auth0**
   - Crear una cuenta en [Auth0](https://auth0.com/)
   - Crear una aplicación nativa
   - Configurar las URLs de callback permitidas en Auth0:
     - Para desarrollo: `exp://localhost:19000`
   - Copiar el dominio y el client ID al archivo `.env`

## 🏃‍♂️ Ejecutar el Proyecto

1. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

2. **Ejecutar en Android**
   ```bash
   npm run android
   ```

3. **Ejecutar en iOS** (solo macOS)
   ```bash
   npm run ios
   ```

## 📱 Probar en dispositivo físico

1. Instalar la aplicación Expo Go:
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Escanear el código QR que aparece al ejecutar `npm start`

## 🛠️ Estructura del Proyecto

```
mis-gastos-mob/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── screens/        # Pantallas de la aplicación
│   ├── services/       # Servicios (API, autenticación)
│   └── types/          # Definiciones de tipos TypeScript
├── App.tsx            # Punto de entrada de la aplicación
└── package.json       # Dependencias y scripts
```

## 📦 Características Principales

- Autenticación con Auth0
- Registro y seguimiento de gastos
- Categorización de gastos
- Gestión de presupuestos
- Planificación de ahorros
- Interfaz intuitiva y fácil de usar

## 🔧 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run android`: Ejecuta la aplicación en Android
- `npm run ios`: Ejecuta la aplicación en iOS
- `npm run web`: Ejecuta la aplicación en el navegador

## 📝 Notas Adicionales

- Para desarrollo en iOS, asegúrate de tener instalado Xcode y CocoaPods
- Para desarrollo en Android, asegúrate de tener configurado correctamente el Android SDK
- La aplicación requiere conexión a internet para funcionar correctamente

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.