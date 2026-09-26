# SAHER &bull; Escuela para Guardias de Seguridad
### Plataforma Oficial de Certificación de Confianza e Idoneidad Psicológica (DERS-16, PSS-14, COPE-28)

Este sistema permite evaluar aspirantes y guardias de seguridad bajo la normativa legal y estándares del departamento de psicología:
- **Bloque 1 &bull; DERS-16:** Escala de Regulación Emocional y Control de Impulsos (16 reactivos).
- **Bloque 2 &bull; PSS-14:** Escala de Estrés Percibido (14 reactivos, 7 directos y 7 inversos).
- **Bloque 3 &bull; COPE-28:** Estrategias de Afrontamiento Adaptativas vs No Adaptativas (28 reactivos).
- **Expediente PDF y Auditoría:** Generación de informe clínico individual con todas las opciones de respuesta y casilleros de calificación manual.
- **Acceso Temporal:** Generación de usuario y contraseña de un solo uso con cronómetro de 20 minutos.
- **Control de Supervisión:** Eliminación protegida de expedientes con credenciales de supervisor (`angel001` / `saher002`).

---

## Despliegue sin Vercel

### Opción 1: GitHub Pages (Gratuito en GitHub)
El repositorio incluye el flujo automático en `.github/workflows/deploy.yml`.
1. Sube el código a tu repositorio en GitHub.
2. En GitHub ve a **Settings > Pages**.
3. En **Build and deployment > Source**, selecciona **GitHub Actions**.
4. La plataforma se compilará y publicará automáticamente en tu URL de GitHub Pages (`https://<tu-usuario>.github.io/<tu-repo>/`).
5. Puedes añadir tu propio dominio en **Custom domain**.

### Opción 2: Hosting Tradicional (cPanel / Apache / Nginx / Hostinger)
1. Los archivos listos para subir se encuentran en la carpeta `ANGEL/` o el archivo comprimido `ANGEL.zip`.
2. Sube el contenido a la carpeta `public_html` de tu hosting (o al subdominio configurado).
3. Descomprime `ANGEL.zip` (incluye `.htaccess` para soporte de SPA, compresión GZIP y caché).
4. Asigna tu dominio o subdominio y activa el certificado SSL.

---

## Comandos de Desarrollo Local
```bash
npm install     # Instalar dependencias
npm run dev     # Iniciar servidor de desarrollo local
npm run build   # Compilar para producción (carpeta dist/)
npm run preview # Previsualizar compilación de producción
```
