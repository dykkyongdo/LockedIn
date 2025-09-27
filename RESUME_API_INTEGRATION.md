# Resume API Integration

This document explains how the OpenAI resume summarization API has been integrated into the LockedIn application.

## Overview

The application now uses the OpenAI API to automatically parse uploaded resumes and extract key information including:
- Name and email
- Skills and experience level
- University and year of study
- Short description/summary

## How It Works

### 1. Resume Upload
- Users can upload PDF, PNG, or JPG resume files
- The file is sent to the server's `/api/ai/summarize-resume` endpoint
- The server uses OpenAI's API to extract structured data from the resume

### 2. Data Mapping
The API response is mapped to the client's profile data structure:
- `name` → Profile name
- `email` → Profile email
- `skills` → Used to determine major (CS vs Business) and focus areas
- `yearOfStudy` → Student year (-1 for alumni)
- `yearsExperience` → Years of experience
- `short_description` → Profile summary

### 3. Error Handling
- Network errors are caught and displayed to the user
- Invalid file types are rejected
- API errors show descriptive messages

## Files Modified

### Client Side
- `src/lib/api.ts` - API client with `summarizeResume` function
- `src/pages/CreateProfile.tsx` - Updated to use real API instead of mock data
- `src/pages/UserProfile.tsx` - Added resume re-upload functionality

### Server Side
- `src/ai.routes.ts` - OpenAI integration (already implemented)
- `src/server.ts` - Express server setup (already implemented)

## Usage

### For New Users (CreateProfile)
1. Go to `/create-profile`
2. Click "Upload Resume" or drag & drop a resume file
3. The form will automatically populate with extracted data
4. Review and edit the information as needed
5. Add personality tags and submit

### For Existing Users (UserProfile)
1. Go to `/profile`
2. Click "Reupload Resume"
3. Select a new resume file
4. The profile will be updated with new information

## Environment Setup

The client expects the server to be running on `http://localhost:3001` by default. You can override this by setting the `VITE_API_URL` environment variable.

## API Response Format

```typescript
interface ResumeSummary {
  name: string;
  email: string;
  short_description: string;
  skills: string[];
  university: string;
  yearOfStudy: number; // -1 for alumni, 1-8 for students
  yearsExperience: number;
}
```

## Testing

1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Navigate to `http://localhost:8080/create-profile`
4. Upload a resume file and verify the form populates correctly
