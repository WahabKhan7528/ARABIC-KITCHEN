# Arabic Kitchen — Backend API

Production-ready Node.js + Express.js + MongoDB backend for the **Arabic Kitchen – The Royal Table** restaurant management system.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (single-token, 7-day expiry)
- **File Uploads:** Multer (Memory Storage)
- **Validation:** express-validator
- **Password Hashing:** bcryptjs

## Getting Started

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable                | Description                         |
|-------------------------|-------------------------------------|
| `PORT`                  | Server port (default: 5000)         |
| `MONGO_URI`             | MongoDB Atlas connection string     |
| `JWT_SECRET`            | Secret for signing JWTs             |
| `JWT_EXPIRES_IN`        | Token expiry (default: `7d`)        |
| `FRONTEND_URL`          | Vercel frontend URL (for CORS)      |


### 3. Seed the Admin Account

```bash
npm run seed
```

Default credentials:
- **Employee ID:** `ADMIN001`
- **Password:** `admin123456`

> ⚠️ Change the password after first login.

### 4. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
| Method | Route             | Description     |
|--------|-------------------|-----------------|
| POST   | `/api/auth/login` | Staff/admin login |

### Menu Items (staff + admin)
| Method | Route            | Description                  |
|--------|------------------|------------------------------|
| GET    | `/api/items`     | Get all items (?category=)   |
| GET    | `/api/items/:id` | Get single item              |
| POST   | `/api/items`     | Create item (+ image upload) |
| PUT    | `/api/items/:id` | Update item                  |
| DELETE | `/api/items/:id` | Delete item                  |

### Registrations — Walk-in (staff + admin)
| Method | Route                    | Description            |
|--------|--------------------------|------------------------|
| GET    | `/api/registrations`     | Get all (?status=)     |
| GET    | `/api/registrations/:id` | Get single             |
| POST   | `/api/registrations`     | Create walk-in record  |
| PUT    | `/api/registrations/:id` | Update                 |
| DELETE | `/api/registrations/:id` | Delete                 |

### Reservations — Advance Bookings (staff + admin)
| Method | Route                           | Description                |
|--------|---------------------------------|----------------------------|
| GET    | `/api/reservations`             | Get all (?status=, ?date=) |
| GET    | `/api/reservations/:id`         | Get single                 |
| POST   | `/api/reservations`             | Create reservation         |
| PUT    | `/api/reservations/:id`         | Update reservation         |
| DELETE | `/api/reservations/:id`         | Delete reservation         |
| PATCH  | `/api/reservations/:id/status`  | Update status only         |

### Staff Management (admin only)
| Method | Route            | Description          |
|--------|------------------|----------------------|
| GET    | `/api/staff`     | Get all staff        |
| GET    | `/api/staff/:id` | Get single staff     |
| POST   | `/api/staff`     | Create staff account |
| PUT    | `/api/staff/:id` | Update staff         |
| DELETE | `/api/staff/:id` | Delete staff account |

## Reservation Status Transitions

```
pending → confirmed | cancelled
confirmed → seated | cancelled
seated → completed | no-show
completed → (terminal)
cancelled → (terminal)
no-show → (terminal)
```

## Deployment (Render)

1. Create a new **Web Service** on Render
2. Set **Root Directory** to `server`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `node server.js`
5. Add all `.env` variables in Render's environment dashboard
6. Set `FRONTEND_URL` to your exact Vercel domain

## Folder Structure

```
server/
├── src/
│   ├── config/           # DB configuration
│   ├── models/           # Mongoose schemas
│   ├── middleware/        # Auth, role, upload middleware
│   ├── controllers/      # Business logic (MVC)
│   ├── routes/           # Express route definitions
│   ├── scripts/          # Seed scripts
│   └── app.js            # Express app setup
├── server.js             # Entry point
├── .env.example
├── package.json
└── README.md
```
