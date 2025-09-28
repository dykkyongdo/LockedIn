export type ResumeSummary = {
    name: string;
    email: string;
    short_description: string;
    skills: string[];
    university: string;
    yearOfStudy: number;
    yearsExperience: number;
};

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: 'applicant' | 'employer';
    profile_picture?: string;
    description?: string;
    university?: string;
    year_of_study?: number;
    graduated?: boolean;
    major?: 'BUS' | 'CMPT';
    interests?: Array<{ id: number; name: string }>;
    tags?: Array<{ id: number; name: string }>;
};

export type Job = {
    id: number;
    company_name: string;
    job_name: string;
    description: string;
    company_photo?: string;
    location: string;
    interests: string[];
    employer_first_name?: string;
    employer_last_name?: string;
    created_at: string;
};

export type InterestCategory = {
    id: number;
    name: string;
    major: 'BUS' | 'CMPT';
};

export type ProfileTag = {
    id: number;
    name: string;
    major: 'BUS' | 'CMPT';
};

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Resume parsing
export async function summarizeResume(file: File): Promise<ResumeSummary> {
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch(`${BASE}/api/ai/summarize-resume`, { method: 'POST', body: fd });
    if (!r.ok) {
        let msg = r.statusText; 
        try { const j = await r.json(); msg = j.error ?? msg; } catch {}
        throw new Error(msg);
    }
    return r.json();
}

// Authentication
export async function register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: 'applicant' | 'employer';
    university?: string;
    year_of_study?: number;
    graduated?: boolean;
    major?: 'BUS' | 'CMPT';
    description?: string;
    profile_picture?: string;
}): Promise<{ token: string; user: User }> {
    const r = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Registration failed');
    }
    return r.json();
}

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
    const r = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Login failed');
    }
    return r.json();
}

// Logout function (client-side only)
export function logout(): void {
    // Clear authentication token
    localStorage.removeItem('token');
    // Clear user profile data
    localStorage.removeItem('userProfile');
    // Redirect to home page
    window.location.href = '/';
}

// Profile management
export async function getProfile(): Promise<User> {
    const r = await fetch(`${BASE}/api/profile`, {
        headers: getAuthHeaders()
    });
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to fetch profile');
    }
    return r.json();
}

export async function updateProfile(profileData: Partial<User>): Promise<void> {
    const r = await fetch(`${BASE}/api/profile`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(profileData)
    });
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to update profile');
    }
}

export async function updateInterests(interests: number[]): Promise<void> {
    const r = await fetch(`${BASE}/api/profile/interests`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ interests })
    });
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to update interests');
    }
}

export async function updateTags(tags: number[]): Promise<void> {
    const r = await fetch(`${BASE}/api/profile/tags`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ tags })
    });
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to update tags');
    }
}

// Job discovery
export async function getJobs(): Promise<Job[]> {
    const r = await fetch(`${BASE}/api/jobs/discover`);
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to fetch jobs');
    }
    return r.json();
}

export async function swipeJob(jobId: number, direction: 'left' | 'right'): Promise<{ matched: boolean }> {
    const r = await fetch(`${BASE}/api/jobs/${jobId}/swipe`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ direction })
    });
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to swipe job');
    }
    return r.json();
}

// Reference data
export async function getInterestCategories(major: 'BUS' | 'CMPT'): Promise<InterestCategory[]> {
    const r = await fetch(`${BASE}/api/reference/interest-categories/${major}`);
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to fetch interest categories');
    }
    return r.json();
}

export async function getProfileTags(major: 'BUS' | 'CMPT'): Promise<ProfileTag[]> {
    const r = await fetch(`${BASE}/api/reference/profile-tags/${major}`);
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to fetch profile tags');
    }
    return r.json();
}

// Photo upload (for profile creation - no auth required)
export async function uploadProfilePhoto(file: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    
    const r = await fetch(`${BASE}/api/profile/photo-temp`, {
        method: 'POST',
        body: formData
    });
    
    if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || 'Failed to upload photo');
    }
    return r.json();
}