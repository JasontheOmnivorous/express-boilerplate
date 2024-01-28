# Boilerplate template for Node Express applications

After writing the same lines code again and again, I felt fraustrated and decided to make this.
This is rather a basic implementation for an Express app. There's no Kubernetes or Docker configs
covered yet, but I'll upgrade to these overtime.

## Features

- Minimal secure middleware setup.
- JWT authentication.
- Password reset gmail.
- User model and route system.
- Error handling.

### Installation

1. Clone the repository:

```bash
git clone http://github.com/JasontheOmnivorous/express-boilerplate.git
```

2. Navigate to your project directory:

```bash
cd express-boilerplate
```

3. Install dependencies:

```bash
npm i
```

### Usage

Development script:

```bash
npm run dev
```

Start script:

```bash
npm start
```

Build script:

```bash
npm run build
```

### Environment Variables

```bash
PORT=8000
DB=<Your-MongoDB-cluster-connection-string>
NODE_ENV=development # switch dev and prod environment
JWT_SECRET=cdjhebwyfgo837guowfaljbksdflieurpf982bkjskcjbuwbkeefib2u3uif # generate random bullshits
JWT_EXPIRES=90d # config to your liking
ADMIN_EMAIL=<Your-admin-email>
EMAIL_USER=<Your-email-account-to-send-password-reset-token>
EMAIL_PASSWORD=<Your-gmail-app-password>
```

EMAIL_PASSWORD is not your normal gmail account password. It's an app password and
you can obtain it by enabling two step verification in your google account.

### Contributing

I don't care bro, do whatever you want.😂
