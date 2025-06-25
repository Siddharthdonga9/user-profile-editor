# Profile Editor App

A modern Next.js application for managing user profiles with authentication, public viewing, and private editing capabilities.

## Features

- ** Authentication System**: Simple login system with session management
- ** Public Profile View**: Server-side rendered profile page accessible to everyone
- ** Private Profile Editor**: Protected client-side form with real-time validation
- ** Route Protection**: Edit page requires authentication
- ** Form Validation**: Comprehensive validation using Zod schema
- ** State Management**: Global state management with Zustand
- ** Data Fetching**: Efficient data fetching with React Query
- ** Modern UI**: Beautiful components using shadcn/ui
- ** Toast Notifications**: Success and error notifications
- ** Loading States**: Proper loading and error handling
- ** Responsive Design**: Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Data Fetching**: React Query (TanStack Query)
- **State Management**: Zustand (with persistence)
- **Authentication**: Custom session-based auth
- **Icons**: Lucide React

## Project Structure

\`\`\`
app/
├── (public)/
│ └── profile/
│ └── page.tsx # Public profile view (Server Component)
├── (private)/
│ └── edit-profile/
│ └── page.tsx # Protected profile editor (Client Component)
├── login/
│ └── page.tsx # Login page
├── api/
│ └── profile/
│ └── route.ts # API route handlers
├── layout.tsx # Root layout with navigation
├── page.tsx # Home page
└── globals.css # Global styles

components/
├── auth-guard.tsx # Route protection component
├── navigation.tsx # Dynamic navigation with auth state
├── profile-refresh-button.tsx # Profile refresh functionality
└── toast.tsx # Toast notification component

lib/
├── auth.ts # Authentication store and logic
├── store.ts # Zustand store for UI state
├── validations.ts # Zod schemas
├── react-query.ts # React Query provider
└── profile-service.ts # Data service layer
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd profile-editor-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 🏠 Home Page

- Navigate to `/` to see the landing page
- Overview of features and technology stack
- Quick access to profile view and login

### 👀 Viewing Profile (Public Access)

1. Navigate to `/profile` or click "View Profile" from navigation
2. **No authentication required** - anyone can view the public profile
3. View the profile with all information displayed in a clean layout
4. See last updated timestamp and profile statistics

### 🔐 Authentication Flow

#### Logging In

1. Navigate to `/login` or click "Login" from navigation
2. **Demo Access**: Use any email and password (minimum 3 characters)
3. **Quick Demo**: Click "Use Demo Credentials" for instant access
   - Email: `demo@example.com`
   - Password: `demo123`
4. Click "Sign In" to authenticate
5. Automatically redirected to edit profile page

#### Session Management

- Login state persists across browser refreshes
- Session stored securely in localStorage
- Automatic logout after closing browser (optional)

### ✏️ Editing Profile (Protected Route)

1. **Authentication Required**: Must be logged in to access `/edit-profile`
2. If not authenticated, automatically redirected to login page
3. After login, redirected back to edit profile
4. Fill out the form with required fields:
   - **Name**: 2-50 characters
   - **Bio**: 10-500 characters
   - **Email**: Valid email format
   - **Phone**: Valid phone number format
   - **Location**: 2-100 characters
5. Click "Save Changes" to update the profile
6. Use "Preview Profile" to see how the profile appears publicly
7. Click "Logout" to end session and return to public access

### 🔄 Navigation Features

- **Dynamic Navigation**: Shows different options based on authentication state
- **Not Logged In**: Shows "Login" button
- **Logged In**: Shows user info, "Edit Profile", and "Logout" buttons
- **User Indicator**: Green badge showing current user when authenticated

## Authentication System

### How It Works

1. **Simple Validation**: Accept any email + password (3+ characters minimum)
2. **Session Creation**: Creates user session with basic info
3. **Route Protection**: `AuthGuard` component protects private routes
4. **Persistent State**: Uses Zustand with localStorage persistence
5. **Automatic Redirects**: Seamless flow between protected and public pages

### Security Notes

- This is a **demo authentication system** for development/testing
- **Not suitable for production** without proper backend authentication
- Passwords are not encrypted or validated against a database
- Sessions are stored in browser localStorage

## Architecture

### Authentication Flow

\`\`\`

1. User visits /edit-profile
2. AuthGuard checks authentication status
3. If not authenticated → Redirect to /login
4. User logs in with any credentials
5. Session created and stored
6. Redirect back to /edit-profile
7. Access granted to protected content
   \`\`\`

### Component Architecture

- **Server Components**: Used for public profile view (SEO optimized)
- **Client Components**: Used for forms, authentication, and interactive features
- **Route Groups**: `(public)` and `(private)` for organization
- **Protected Routes**: Wrapped with `AuthGuard` component

### Data Flow

1. **Public Profile**: Server Component fetches data directly from service
2. **Private Editor**: Client Component uses React Query for data management
3. **Authentication**: Zustand store manages auth state with persistence
4. **Form Handling**: React Hook Form with Zod validation
5. **API Layer**: Next.js API routes handle data operations

## API Routes

- **GET /api/profile**: Fetches current profile data
- **PUT /api/profile**: Updates profile data with validation
- **Profile Service**: Shared data layer used by API routes

## Validation Schema

The profile form validates the following fields:

\`\`\`typescript
{
name: string (2-50 chars),
bio: string (10-500 chars),
email: string (valid email),
phone: string (valid phone format),
location: string (2-100 chars)
}
\`\`\`

### Supported Phone Formats

- `+1 (555) 123-4567`
- `555-123-4567`
- `555.123.4567`
- `555 123 4567`
- `+44 20 7946 0958`
- `1234567890`

## UI Components

Built with shadcn/ui components:

- Card, CardContent, CardHeader, CardTitle
- Button, Input, Textarea, Label
- Navigation with dynamic auth state
- Toast notifications
- Loading spinners and error states

## Development Features

### Debug Information

- Form state tracking in development mode
- React Query DevTools integration
- Console logging for data flow
- Authentication state visibility

### Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms for failed requests
- Graceful fallbacks for missing data

## Testing the Application

### Quick Test Checklist

- [ ] Home page loads correctly
- [ ] Public profile accessible without login
- [ ] Edit profile redirects to login when not authenticated
- [ ] Login works with any email/password (3+ chars)
- [ ] Edit profile accessible after login
- [ ] Form validation works correctly
- [ ] Profile updates save and persist
- [ ] Logout clears session
- [ ] Navigation updates based on auth state
- [ ] Mobile responsive design works

### Test Scenarios

#### Authentication Flow

1. **Access Protection**: Try accessing `/edit-profile` without login
2. **Login Process**: Use demo credentials or custom ones
3. **Session Persistence**: Refresh browser and verify still logged in
4. **Logout Process**: Ensure session clears and redirects properly

#### Profile Management

1. **View Profile**: Check public profile displays correctly
2. **Edit Profile**: Test form validation and submission
3. **Data Persistence**: Verify changes appear on profile view
4. **Error Handling**: Test with invalid data and network issues

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Add authentication system"
   git push origin main
   \`\`\`

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

### Environment Variables

For production deployment, you may need to set:
\`\`\`
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

## Development Notes

### Key Implementation Details

1. **Route Protection**: Uses `AuthGuard` wrapper component
2. **Session Management**: Zustand store with localStorage persistence
3. **Form State**: React Hook Form with optimistic updates
4. **Data Synchronization**: React Query with aggressive cache invalidation
5. **Error Boundaries**: Comprehensive error handling throughout
6. **Loading States**: Proper loading indicators and skeleton screens

### Performance Optimizations

- Server-side rendering for public profile (SEO)
- React Query caching for efficient data fetching
- Optimistic updates for better UX
- Code splitting with route groups
- Lazy loading of non-critical components

### Security Considerations

⚠️ **Important**: This authentication system is for **development/demo purposes only**

For production use, implement:

- Proper backend authentication (JWT, OAuth, etc.)
- Password hashing and validation
- CSRF protection
- Rate limiting
- Secure session management
- Input sanitization
- SQL injection prevention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

## 🚀 Quick Start Commands

\`\`\`bash

# Install dependencies

npm install

# Start development server

npm run dev

# Build for production

npm run build

# Start production server

npm start

# Run linting

npm run lint
\`\`\`
