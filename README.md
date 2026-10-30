# 🌾 Agri-Tech — Smart Farming Management System (MERN)

Full-stack farm management platform: weather forecasts with farm advisories, soil health analysis, pest alerts, resource marketplace with order tracking, expert consultation, community forum, and an admin dashboard. Multilingual (English / हिन्दी / मराठी) and responsive.

## Stack
- **Backend:** Node.js (v16+), Express, MongoDB (Mongoose), JWT, bcrypt (`bcryptjs`), express-validator, helmet, rate limiting
- **Frontend:** React 18 (Create React App), React Router, Axios, Bootstrap 5, react-i18next, Recharts
- **Weather:** [Open-Meteo](https://open-meteo.com/) (free, no API key), cached in MongoDB

## Project structure
```
agri-tech/
├── server/
│   ├── server.js              # app entry, middleware, route mounting
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # User, Farm, Crop, WeatherData, PestAlert, Resource, Order, Consultation, Post
│   ├── controllers/           # business logic per module
│   ├── routes/                # REST routes + validation
│   ├── middleware/            # auth (JWT + roles + validation), error handling
│   └── utils/                 # soil analysis, weather service, seed script
└── client/
    └── src/
        ├── pages/             # lazy-loaded pages (code splitting)
        ├── components/        # Navbar, ProtectedRoute, shared UI
        ├── context/           # AuthContext (JWT session)
        ├── i18n.js            # en / hi / mr translations
        └── api.js             # Axios instance with auth interceptor
```

## Setup
1. Install Node.js 16+, npm, and MongoDB (local) or create a MongoDB Atlas cluster.
2. **Backend**
   ```bash
   cd server
   cp .env.example .env      # edit MONGO_URI and JWT_SECRET
   npm install
   npm run seed              # demo users, resources, pest alerts
   npm run dev               # http://localhost:5000
   ```
3. **Frontend** (new terminal)
   ```bash
   cd client
   npm install
   npm start                 # http://localhost:3000 (proxies /api to :5000)
   ```

### Demo accounts (after `npm run seed`)
| Role   | Email                | Password   |
|--------|----------------------|------------|
| Admin  | admin@agritech.com   | admin123   |
| Expert | expert@agritech.com  | expert123  |
| Farmer | farmer@agritech.com  | farmer123  |

## Modules
| Module | What it does |
|---|---|
| Auth | Register/login, JWT, bcrypt hashing, profile & password change, language preference |
| Farms | CRUD for farm profiles (location, area, soil, irrigation); "use my location" |
| Crops | CRUD, activity log, soil readings with rule-based health score and recommendations, analytics charts |
| Weather | 7-day forecast per farm + advisories (heavy rain, heatwave, frost, wind, fungal risk) |
| Pest alerts | Alerts filtered by farmer's district and active crops; admin/expert manage alerts |
| Marketplace & orders | Browse/search approved resources, cart, stock-safe checkout, order tracking, cancel |
| Consultation | Farmers ask; experts/admins answer |
| Forum | Posts, tags, comments; admin moderation (hide/delete) |
| Admin | Stats & charts, user/role management, resource approval, order status, alerts, moderation |

## API overview (all under `/api`, JWT required except auth)
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/profile`, `PUT /auth/password`
- `/farms`, `/crops` (+ `/crops/:id/soil`, `/crops/:id/activities`, `/crops/analytics/summary`)
- `GET /weather/farm/:farmId`
- `/alerts` (`GET /alerts/mine` for farmers), `/resources`, `/orders`, `/consultations`, `/forum`
- `/admin/*` — admin role only

## Security
- Passwords hashed with bcrypt (12 rounds); JWT in `Authorization: Bearer` header
- Roles `farmer`, `expert`, `admin` enforced by `authorize()` middleware; public sign-up always creates farmers
- Ownership checks on farms, crops, orders; admin-only for resource approval, order status, user management, moderation
- helmet, CORS restricted to `CLIENT_URL`, rate-limit on auth routes, request validation, centralized error handler

## Testing with Postman
1. `POST /api/auth/login` → copy `token`.
2. Add header `Authorization: Bearer <token>` to other requests.
3. Walk through: create farm → create crop → add soil reading → `GET /weather/farm/:id` → place an order.

## Production build
```bash
cd client && npm run build      # serve client/build with any static host or from Express
```
Set `REACT_APP_API_URL` if the API is on another origin, and set `CLIENT_URL`/`JWT_SECRET`/`NODE_ENV=production` on the server.

## Notes
- Soil thresholds in `server/utils/soilAnalysis.js` are general guidance values; adjust for local agronomy.
- The weather provider needs internet access from the server.
- Performance: MongoDB indexes on owner/farm fields, text index on resources, weather cache (30 min) with TTL purge, React lazy loading/code-splitting.
