import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // HTTPS ports of each service's "https" launch profile. The services call UseHttpsRedirection(),
  // so plain HTTP would answer 307 -> https and the browser would hit CORS; going straight to
  // HTTPS avoids that. secure: false accepts the local ASP.NET Core dev certificate.
  const target = (url: string) => ({ target: url, changeOrigin: true, secure: false })

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      // The three ASP.NET Core services have no CORS policy, so in development the React app
      // calls relative /api/... paths and Vite forwards each prefix to its service.
      // Override the targets in a .env.local file (see .env.example).
      proxy: {
        '/api/Auth': target(env.AUTH_API_URL || 'https://localhost:7113'), // Auth1
        '/api/employee': target(env.EMPLOYEE_API_URL || 'https://localhost:7181'), // EmployeeLeave
        '/api/leave': target(env.LEAVE_API_URL || 'https://localhost:7299') // LeaveSer
      }
    }
  }
})
