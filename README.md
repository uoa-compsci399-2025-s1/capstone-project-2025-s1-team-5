[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/4-04QCSZ)

## Environment Variables for Email Forwarding

Set these variables for the server when using the support and forgot password forms:

- `SMTP_HOST` – SMTP server hostname
- `SMTP_PORT` – SMTP port number
- `SMTP_USER` – SMTP username
- `SMTP_PASS` – SMTP password
- `SUPPORT_FROM` – email address used as the sender
- `CLIENT_EMAIL` – destination address for forwarded messages

Example `.env` configuration:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=user@example.com
SMTP_PASS=your_password
SUPPORT_FROM=support@example.com
CLIENT_EMAIL=client@example.com
```
