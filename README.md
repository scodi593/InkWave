# InkWave - Modern Blogging Platform

## Project Overview

InkWave is a full-stack blogging platform designed for modern content creators. It features a sleek UI, Google OAuth authentication, real-time interactions, and a robust backend. Users can create, edit, and delete posts, comment, like, bookmark, and search content. The platform is built with React (Vite), Redux Toolkit, Tailwind CSS on the frontend, and Node.js, Express, MongoDB, and Passport.js on the backend.

---

## Demo

A short demo video of the app in action is available here:

[Watch Demo (local .mkv file)](C:/Users/SATHVIKA/Videos/2025-07-22%2000-34-54.mkv)

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd InkWave
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Start the server
   npm run dev  # Development
   npm start    # Production
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Start the development server
   npm run dev
   ```

---

## API Documentation

A summary of the main API endpoints is provided below. For full details and testing, see the included Postman collection (`InkWave.postman_collection.json`).

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

---

## Prompting Techniques & AI Tool Usage

During the development of InkWave, AI tools were leveraged to:
- **Generate Boilerplate Code:** Used AI to scaffold React components, Redux slices, and Express routes/controllers, accelerating initial setup.
- **Refactor and Optimize:** Prompted AI to suggest improvements for code readability, performance, and best practices (e.g., optimizing Redux logic, improving API error handling).
- **Debugging:** Asked AI for help in diagnosing and resolving bugs, especially in authentication flows and state management.
- **Prompting Techniques:**
  - Broke down complex requirements into smaller, specific prompts.
  - Used iterative prompting: started with a broad question, then refined based on AI responses.
  - Provided code snippets and context to get more accurate and relevant AI suggestions.

---

## Challenges Faced

- **Merge Conflicts:** Encountered and resolved merge conflicts in documentation and code, especially when integrating features in parallel branches.
- **Authentication Flow:** Integrating Google OAuth with JWT and cookies required careful handling of sessions and CORS.
- **State Management:** Ensuring Redux state stayed in sync with backend, especially for likes, bookmarks, and comments.
- **Responsive Design:** Achieving a seamless experience across devices required multiple iterations and Tailwind tweaks.
- **API Error Handling:** Standardizing error responses and handling edge cases in both frontend and backend.
- **AI Limitations:** Sometimes AI-generated code required manual adjustments for project-specific needs or to fix subtle bugs.

---

## Features
- Google OAuth Authentication
- Create, Edit, Delete Posts
- Tag System
- Comment System
- Like/Unlike Posts
- Bookmark System
- Dark/Light Mode
- Search Posts
- User Profiles
- Responsive Design

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [sathvikambekar593@gmail.com] or open an issue in the repository.
