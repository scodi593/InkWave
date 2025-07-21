
# InkWave - Modern Blogging Platform

InkWave is a full-stack blogging platform built with React, Node.js, and MongoDB. It features a modern UI, Google OAuth authentication, and real-time interactions.

## Features

- 🔐 Google OAuth Authentication
- 📝 Create, Edit, Delete Posts
- 🏷️ Tag System
- 💬 Comment System
- ❤️ Like/Unlike Posts
- 🔖 Bookmark System
- 🌓 Dark/Light Mode
- 🔍 Search Posts
- 👤 User Profiles
- 📱 Responsive Design

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit (State Management)
- React Router v6
- Tailwind CSS
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (Google OAuth)
- JWT Authentication
- Cookie-based Sessions

## Project Structure

```
project/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
│
└── backend/              # Node.js backend
    ├── controllers/      # Route controllers
    ├── models/          # MongoDB models
    ├── routes/          # API routes
    ├── middleware/      # Custom middleware
    ├── utils/           # Utility functions
    ├── server.js        # Server entry point
    └── package.json     # Backend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials

### Environment Variables

#### Backend (.env)
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
\`\`\`

#### Frontend (.env)
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd project-name
   \`\`\`

2. **Backend Setup**
   \`\`\`bash
   cd backend
   npm install
   
   # Start the server
   npm run dev  # Development
   npm start    # Production
   \`\`\`

3. **Frontend Setup**
   \`\`\`bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   \`\`\`

## API Documentation

### Authentication Routes
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/logout` - Logout user

### Post Routes
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/search` - Search posts
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post

### Comment Routes
- `POST /api/posts/:id/comments` - Add comment
- `GET /api/posts/:id/comments` - Get post comments

### User Routes
- `GET /api/user/me` - Get current user
- `PUT /api/user/me` - Update user profile
- `POST /api/user/bookmarks/:id` - Bookmark post
- `DELETE /api/user/bookmarks/:id` - Remove bookmark

## Frontend Integration

### API Integration
- Axios instance with base URL and credentials
- JWT token handling via HTTP-only cookies
- Error handling and response interceptors

### State Management
- Redux store configuration
- Auth slice for user state
- Post slice for post data
- Async thunks for API calls

### Routing
- Protected routes with auth checks
- Dynamic route parameters
- Navigation guards

### Components
- Reusable UI components
- Form handling
- Error boundaries
- Loading states

## Styling

### Tailwind Configuration
- Custom color scheme
- Dark mode support
- Responsive breakpoints
- Custom animations

### Theme
- Light/Dark mode toggle
- Consistent color palette
- Responsive design
- Custom fonts

## Security Features

- JWT-based authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- XSS protection
- Rate limiting

## Development Workflow

1. **Starting the Development Environment**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Building for Production**
   ```bash
   # Backend
   cd backend
   npm run build

   # Frontend
   cd frontend
   npm run build
   ```

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to hosting service (e.g., Heroku, DigitalOcean)
4. Set up SSL certificate

### Frontend Deployment
1. Build the frontend
2. Deploy to static hosting (e.g., Vercel, Netlify)
3. Configure environment variables
4. Set up custom domain (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License 

## Support

For support, email [sathvikambekar593@gmail.com] or open an issue in the repository. 
>>>>>>> 2c52194 (Initial commit)
