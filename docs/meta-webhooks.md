# Integración Meta Webhooks (Producción)

Esta guía detalla cómo conectar Growth Agent Suite con Meta (Facebook Developers) para recibir mensajes y eventos de Instagram y WhatsApp en tiempo real.

## 1. Variables de Entorno Requeridas en Vercel
Para que la integración funcione en producción, debes configurar las siguientes variables en tu panel de Vercel:

```env
# Token de Verificación (Tú lo inventas, Meta lo pide para asegurar que eres tú)
META_VERIFY_TOKEN=un_token_seguro_inventado_por_ti_123

# App Secret de Meta (Usado para validar las firmas HMAC de seguridad de cada webhook)
# Lo encuentras en Configuración de la App > Información Básica
META_APP_SECRET=tu_app_secret_aqui

# Token de Acceso Permanente a la API de Graph
# (Usado por los agentes para ENVIAR mensajes - Nunca lo expongas en el Frontend)
META_ACCESS_TOKEN=tu_access_token_permanente
```

*(Las IDs de las cuentas (`META_BUSINESS_ACCOUNT_ID`, etc.) se guardarán dinámicamente en la base de datos dentro de `WhatsAppConnection` e `InstagramConnection` conectadas a cada Cliente, por lo que no es estrictamente necesario quemarlas en el `.env` a menos que operes con un solo cliente fijo en tu MVP).*

## 2. Paso a Paso: Registro en Meta Developers
1. Ve a [developers.facebook.com](https://developers.facebook.com/) y entra a tu App.
2. Ve a **Configurar Webhooks** (o búscalo en Productos > Webhooks).
3. Selecciona **Instagram** o **WhatsApp Business Account** del menú desplegable.
4. Haz clic en **Suscribirse a este objeto**.
5. Te pedirá dos campos:
   - **URL de Devolución de llamada:** `https://growth-agent-suite.vercel.app/api/webhooks/meta`
   - **Token de Verificación:** *El mismo valor que pusiste en `META_VERIFY_TOKEN` en Vercel*.
6. Haz clic en **Verificar y Guardar**. Meta enviará un `GET` a esa URL con un `challenge` y tu endpoint responderá automáticamente si el token coincide.
7. En la lista de Webhooks de Meta, suscríbete a los eventos:
   - **Instagram:** `messages`
   - **WhatsApp:** `messages`

## 3. Estructura Exacta del Payload que envía Meta (Ejemplo Mensaje IG)
Cuando un usuario escribe a tu Instagram, Meta enviará un `POST` con la firma `x-hub-signature-256` en las cabeceras, y un Body JSON así:

```json
{
  "object": "instagram",
  "entry": [
    {
      "id": "178414XXXXXXX", // ID de tu cuenta de negocio IG
      "time": 1690000000000,
      "messaging": [
        {
          "sender": { "id": "9876543210" }, // ID del cliente
          "recipient": { "id": "178414XXXXXXX" },
          "message": {
            "mid": "m_1234567890",
            "text": "Hola, me interesa la suite de Growth"
          }
        }
      ]
    }
  ]
}
```

## 4. Pruebas Locales Manuales en Producción (cURL)
Si quieres probar que Vercel está validando correctamente las firmas y tokens:

**Prueba de Handshake GET (Rechazará si el token está mal):**
```bash
curl -X GET "https://growth-agent-suite.vercel.app/api/webhooks/meta?hub.mode=subscribe&hub.verify_token=un_token_seguro_inventado_por_ti_123&hub.challenge=CHALLENGE_ACCEPTED"
```
*(Si el token es correcto, la terminal devolverá `CHALLENGE_ACCEPTED` con código 200).*

**Prueba de Seguridad de Firma POST (Rechazará 401/403 si falla el HMAC, protegiéndote de bots):**
```bash
curl -X POST "https://growth-agent-suite.vercel.app/api/webhooks/meta" \
     -H "Content-Type: application/json" \
     -H "x-hub-signature-256: sha256=firma_falsa_123" \
     -d '{"object": "instagram", "entry": []}'
```
*(Debería devolver un error 403 Forbidden).*
