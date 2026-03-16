# Despliegue en AWS (S3 + CloudFront)

Esta guía asume dominio propio y despliegue de sitio estático desde `public/`.

## 1) Limpieza inicial de Git

```bash
git checkout -b chore/aws-readiness
git rm -r --cached node_modules
git add .gitignore
git commit -m "chore: stop tracking node_modules and improve gitignore"
```

Opcional para limpiar artefactos locales:

```bash
rm -rf node_modules
npm install
```

## 2) Crear infraestructura base

1. Crear bucket S3 para sitio (ejemplo: `www.geotrends.co`).
2. Bloquear acceso publico al bucket (recomendado).
3. Crear distribucion CloudFront con Origin Access Control (OAC).
4. Asociar certificado TLS (ACM) en `us-east-1`.
5. Configurar DNS en Route53 apuntando al dominio CloudFront.

## 3) Funcion de CloudFront para rutas limpias

El proyecto tiene HTML en `public/html`. Esta funcion resuelve:
- `/` -> `/html/index.html`
- `/nosotros` -> `/html/nosotros.html`
- `/nosotros.html` -> `/html/nosotros.html`

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri || "/";

  if (uri === "/") {
    request.uri = "/html/index.html";
    return request;
  }

  if (uri.endsWith(".html")) {
    request.uri = "/html" + uri;
    return request;
  }

  if (!uri.includes(".")) {
    request.uri = "/html" + uri + ".html";
    return request;
  }

  return request;
}
```

Asociala en CloudFront a `Viewer request`.

## 4) GitHub Actions (CI/CD)

Ya existe workflow en:

- `.github/workflows/deploy-aws-static.yml`

Configura estos secrets en GitHub:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (ejemplo `us-east-1`)
- `S3_BUCKET_NAME` (ejemplo `www.geotrends.co`)
- `CLOUDFRONT_DISTRIBUTION_ID` (ejemplo `E1234567890ABC`)

Con eso, cada push a `main` sincroniza `public/` al bucket e invalida cache.

## 5) Verificaciones antes de publicar

```bash
npm start
```

Validar manualmente:

1. Navegacion de todas las paginas.
2. Videos e imagenes de fondo.
3. Links externos, mapas, WhatsApp y correo.
4. Que no existan rutas a archivos faltantes.

Busqueda rapida de referencia rota conocida:

```bash
rg -n "VID_20240912_071126_00_025\\.mp4" public/html
```

## 6) Endurecimiento recomendado

1. Agregar `robots.txt` y `sitemap.xml`.
2. Mover assets multimedia muy pesados a un bucket de media dedicado.
3. Si activas formulario de contacto: API Gateway + Lambda + SES + CAPTCHA.
4. Activar monitoreo de uptime y alertas.
