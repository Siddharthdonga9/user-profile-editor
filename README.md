# Profile Editor App

A modern Next.js application for managing user profiles with public viewing and private editing capabilities.

## Features

- **Public Profile View**: Server-side rendered profile page accessible to everyone
- **Private Profile Editor**: Client-side form with real-time validation
- **Form Validation**: Comprehensive validation using Zod schema
- **State Management**: Global state management with Zustand
- **Data Fetching**: Efficient data fetching with React Query
- **Modern UI**: Beautiful components using shadcn/ui
- **Toast Notifications**: Success and error notifications
- **Loading States**: Proper loading and error handling
- **Responsive Design**: Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Data Fetching**: React Query (TanStack Query)
- **State Management**: Zustand
- **Icons**: Lucide React

## Project Structure

\`\`\`
app/
├── (public)/
│ └── profile/
│ └── page.tsx # Public profile view
├── (private)/
│ └── edit-profile/
│ └── page.tsx # Profile editor
├── api/
│ └── profile/
│ └── route.ts # API route handlers
├── layout.tsx # Root layout
├── page.tsx # Home page
└── globals.css # Global styles

components/
└── toast.tsx # Toast notification component

lib/
├── store.ts # Zustand store
├── validations.ts # Zod schemas
└── react-query.ts # React Query provider
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

### Viewing Profile

1. Navigate to `/profile` or click "View Profile" from the navigation
2. View the public profile with all information displayed in a clean layout

### Editing Profile

1. Navigate to `/edit-profile` or click "Edit Profile" from the navigation
2. Fill out the form with the following required fields:
   - **Name**: 2-50 characters
   - **Bio**: 10-500 characters
   - **Email**: Valid email format
   - **Phone**: Valid phone number format
   - **Location**: 2-100 characters
3. Click "Save Changes" to update the profile
4. Use "Preview Profile" to see how the profile will appear publicly

## Architecture

### Server vs Client Components

- **Server Components**: Used for the public profile view to leverage server-side rendering
- **Client Components**: Used for the profile editor to handle form interactions and state

### Data Flow

1. **Profile View**: Client Component uses React Query to fetch from API routes
2. **Profile Editor**: Client Component uses React Query to fetch and update data
3. **State Management**: Zustand manages global UI state (toast notifications)
4. **Form Handling**: React Hook Form with Zod validation for type-safe forms
5. **Data Service**: Shared service layer used by API routes

### API Routes

- **GET /api/profile**: Fetches current profile data
- **PUT /api/profile**: Updates profile data
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

## UI Components

Built with shadcn/ui components:

- Card, CardContent, CardHeader, CardTitle
- Button, Input, Textarea, Label
- Alert, AlertDescription
- Badge

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
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

1. **Route Groups**: Used `(public)` and `(private)` route groups for organization
2. **Client Components**: Both pages use client-side rendering for React Query integration
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Loading States**: Proper loading indicators throughout the application
5. **Form Validation**: Real-time validation with clear error messages
6. **Toast Notifications**: Global toast system using Zustand

### Performance Optimizations

- React Query caching for efficient data fetching
- Optimistic updates for better UX
- Proper loading states and error boundaries
