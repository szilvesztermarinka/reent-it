# Reent it
## The project now is Running on 213.181.206.85:3000

---

## How to Run

Follow the steps below to set up and run the project:

---

### 1. Installation

#### Backend
1. Open a terminal in the **root directory** (where `package.json` is located).
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

#### Frontend
1. From the `backend` folder, navigate back to the root directory, then move to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
   Alternatively, if you are already in the root directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

---

### 2. Environment Variables

#### Backend
1. In the **root directory**, create a `.env` file.
2. Add the following variables to the `.env` file:
   ```
   MONGO_URI=<your-mongo-uri>
   PORT=<your-port>
   JWT_SECRET=<your-jwt-secret>
   NODE_ENV=<development-or-production>
   MAILTRAP_TOKEN=<your-mailtrap-token>

   CLIENT_URL=<your-client-url>
   SUPABASE_PASSWORD=<your-supabase-password>
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ROLE_KEY=<your-supabase-anon-key>
   HERE_API=<your-here-api-key>
   ```

#### Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Create a `.env` file and add the following variables:
   ```
   REACT_APP_API_URL=<your-api-url>
   REACT_APP_MAPBOX_URL=<your-mapbox-url>
   ```

---

### 3. Running the Project

#### Backend
1. In the **backend** directory, start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend
1. In the **frontend** directory, start the frontend server:
   ```bash
   npm start
   ```

---

Now your project should be running! 🎉
