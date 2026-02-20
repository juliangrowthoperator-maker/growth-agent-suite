# Meta Webhooks (Instagram & WhatsApp)

## Configuration
This integration allows the Growth Agent Suite to listen for incoming messages from WhatsApp and Instagram and upsert them properly into the database (`Lead`, `Conversation`, `Message`).

Requires the following environment variables to be set in `.env`:
```env
META_VERIFY_TOKEN=your_secure_random_string_here
META_APP_SECRET=your_meta_app_secret_here
```

## How to Test Locally
1. Run `npm run dev` in your terminal to start the Next.js server.
2. Expose your local server using a tunneling service like [Ngrok](https://ngrok.com/): 
   ```bash
   ngrok http 3000
   ```
3. Go to your Meta Developer App > Webhooks.
4. Configure your webhook URL to: `https://<your-ngrok-url>.ngrok-free.app/api/webhooks/meta`.
5. Enter your `META_VERIFY_TOKEN`.
6. Click verify and save. Meta will send a `GET` request to verify the endpoint.

## Signature Validation (POST)
When a message arrives, Meta sends a `POST` request. The body is signed using `HMAC-SHA256` with your `META_APP_SECRET`. 

The `/api/webhooks/meta/route.ts` endpoint automatically calculates the buffer signature against `x-hub-signature-256` and strictly rejects any unauthorized or tampered traffic.

## cURL Minimum Example (Verification GET)
```bash
curl -X GET "http://localhost:3000/api/webhooks/meta?hub.mode=subscribe&hub.verify_token=your_secure_random_string_here&hub.challenge=CHALLENGE_ACCEPTED"
```
If the token matches your `.env`, it will reply with `CHALLENGE_ACCEPTED` (status 200).

## Pending for Production Phase 2
- **Message Delivery Statuses:** Expand webhook logic to intercept `messages` statuses (`read`, `delivered`) and update the `Message` model state.
- **Attachments / Media:** Add logic to download multimedia strings.
- **Outbound Message Tracking:** Match outgoing `Message` IDs with webhook delivery reports to reflect our own Agent replies.
- **Advanced Deduplication:** Move to robust Redis-level caching for high-volume message deduplication at scale.
