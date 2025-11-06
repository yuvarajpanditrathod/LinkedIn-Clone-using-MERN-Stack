# LinkedIn Clone (MERN)

![Landing screenshot](https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4)

A professional, full-stack LinkedIn clone built with the MERN stack (MongoDB, Express, React, Node.js). This project reproduces core social and professional networking features — feed, profiles, connections, messaging scaffold, posting with images, onboarding, and notifications — with clean, modular code suitable for learning and extension.

Live repository: https://github.com/yuvarajpanditrathod/LinkedIn-Clone-using-MERN-Stack.git

---

## Highlights & Screenshots

- Clean React frontend with contextual auth and post state management
- Express API with JWT auth, user/profile management, file uploads and connection requests
- Mobile responsive layout with focused breakpoints
- Simple notification and connection workflow

Landing (hero) preview:

![Landing preview](https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4)

Dashboard / Feed preview:

![Dashboard preview](https://static.licdn.com/aero-v1/sc/h/43h6n82li4xu0q23s8jqizk6j)

---

## Tech stack

- Frontend: React, React Router, Bootstrap, Axios, React Icons
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JWT (JSON Web Tokens)
- File uploads: Multer (server-side) and support for static / cloud storage (optional)
- Dev tooling: Nodemon, Concurrently

---

## What we implemented

- Global header/navbar that adapts for the landing and authenticated pages
- Landing page with hero, topics, CTA and footer
- Sign up / Login flows with token-based authentication
- Onboarding flow (skills, job interests, education, resume upload)
- Feed with create post (image upload) and post interactions
- User profiles with banner & avatar, skills, education and resume link
- Connections: send, withdraw, accept, reject, remove; connection status endpoints
- Notifications scaffold (server-side model and basic endpoints)
- Responsive utilities and mobile adjustments
- Clean, componentized code structure ready for enhancement

---

## Quick start — clone & run

Recommended: Node 18+, npm 8+ (or use nvm to manage Node versions)

1. Clone the repo

```bash
git clone https://github.com/yuvarajpanditrathod/LinkedIn-Clone-using-MERN-Stack.git
cd LinkedIn-Clone-using-MERN-Stack
```

2. Install dependencies

This repository contains both the server and client. Use the helper script or install manually.

```bash
# from project root
npm run install:all
```

3. Environment variables

Create a `.env` file in the `server/` folder with the following variables (example):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/linkedin_clone
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
# Optional (if you use cloudinary or other storage services):
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...
```

4. Run development servers

Run both backend and frontend concurrently from the root:

```powershell
npm run dev:all
```

Or run them separately in two terminals:

```powershell
# Terminal 1 — server
cd server
npm run dev

# Terminal 2 — client
cd client
npm start
```

By default the client runs on http://localhost:3000 and the server on http://localhost:5000.

5. Open the app

Visit http://localhost:3000 in your browser. Create an account, finish onboarding and explore the feed and profiles.

---

## Useful npm scripts

- `npm run dev` — run backend with nodemon (from repo root runs server only)
- `npm run client` — run frontend (alias to `cd client && npm start`)
- `npm run dev:all` — run both server and client concurrently
- `npm run install:all` — install dependencies for server and client

---

## API overview (selected endpoints)

- POST /api/auth/register — register new user
- POST /api/auth/login — authenticate and receive JWT
- GET /api/auth/me — get current user (requires Authorization header)
- PUT /api/users/profile — update authenticated user's profile (multipart/form-data)
- GET /api/users/:id — fetch a user's profile and posts
- POST /api/connections/request/:userId — send connection request
- DELETE /api/connections/request/:userId — withdraw pending request
- PUT /api/connections/accept/:requestId — accept incoming request
- PUT /api/connections/reject/:requestId — reject incoming request
- DELETE /api/connections/:userId — remove existing connection

---

## Notes & troubleshooting

- If you see `MONGODB_URI not set` in the server logs, create `server/.env` with `MONGODB_URI` or set your environment variable.
- If images aren't uploading, check server console for multer errors and verify your environment variables for any external storage.
- If the client cannot reach the server, confirm the `proxy` in `client/package.json` (defaults to `http://localhost:5000`) or set `CLIENT_URL` accordingly.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-new-feature`
3. Commit changes and open a pull request

Please include clear descriptions and test steps for UI and API changes.

---

## License

This project is provided as-is for educational purposes. Check the repository for a license file or ask the author for reuse permissions.

---

If you'd like, I can also:
- Add a small `.env.example` file to the `server/` folder
- Add a contribution section with lint/test setup
- Generate a set of Postman or OpenAPI snippets for the main endpoints

Happy building! 🚀
# LinkedIn Clone - Professional Social Media Platform

A full-stack social media application inspired by LinkedIn, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Secure signup/login with JWT
- ✅ **Create Posts** - Share text and image posts
- ✅ **News Feed** - View all posts from users
- ✅ **Like Posts** - Engage with content
- ✅ **Comment System** - Add comments on posts
- ✅ **Edit/Delete Posts** - Manage your own content
- ✅ **User Profiles** - View user information
- ✅ **Image Uploads** - Upload profile pictures and post images
- ✅ **Responsive Design** - Works on all devices

### Additional Features
- 🔐 Protected routes and authentication
- 📱 Modern, clean UI/UX
- 🎨 Professional LinkedIn-inspired design
- ⚡ Real-time updates
- 🔍 User search functionality
- 📊 Post analytics (likes, comments count)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Styling with modern techniques

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image hosting (optional)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas Account** (free tier is sufficient)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd LinkedIn
```

### 2. Install Dependencies

#### Install server dependencies
```bash
npm install
```

#### Install client dependencies
```bash
cd client
npm install
cd ..
```

Or use the shortcut:
```bash
npm run install:all
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 4. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Paste it into your `.env` file as `MONGODB_URI`

### 5. Running the Application

#### Development Mode (Both servers)
```bash
npm run dev:all
```

#### Or run separately:

**Backend (Port 5000):**
```bash
npm run dev
```

**Frontend (Port 3000):**
```bash
npm run client
```

#### Production Mode
```bash
npm start
```

## 📁 Project Structure

```
LinkedIn/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
├── .env                  # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## 🎨 Features Walkthrough

### 1. User Registration & Login
- Users can create an account with email and password
- Passwords are securely hashed using bcrypt
- JWT tokens are used for authentication

### 2. Creating Posts
- Authenticated users can create text posts
- Optional image upload with posts
- Posts display user information and timestamp

### 3. News Feed
- View all posts from all users
- Posts sorted by newest first
- Like and comment on any post

### 4. User Interaction
- Like/unlike posts
- Add comments
- Edit your own posts
- Delete your own posts

### 5. User Profile
- View user profiles
- Display user's posts
- Profile picture upload

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Create account on Render/Heroku
2. Create new Web Service
3. Connect your GitHub repository
4. Add environment variables
5. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Create account on Vercel/Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `client/build`
5. Add environment variables
6. Deploy

## 🧪 Testing

Test the application:
1. Register a new account
2. Login with credentials
3. Create a post with text and image
4. Like and comment on posts
5. Edit/delete your posts
6. View other user profiles
7. Test on mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Your Name - Full Stack Developer Intern

## 🙏 Acknowledgments

- LinkedIn for design inspiration
- MongoDB Atlas for cloud database
- React and Node.js communities

## 📞 Support

For any questions or issues, please open an issue in the repository.

---

**Happy Coding! 🎉**
