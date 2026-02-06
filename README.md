# React Boilerplate - Project Summary

## ✅ What You Got

### 🎯 Complete Authentication System
- ✅ Login page with form validation
- ✅ Registration page
- ✅ Email verification page
- ✅ Password reset (forgot + reset)
- ✅ Profile page (protected)
- ✅ JWT token management
- ✅ Remember me functionality
- ✅ Logout
- ✅ AuthGuard HOC for protected routes
- ✅ Role-based access control

### 🔌 API Client Architecture
- ✅ BaseApiClient with automatic token injection
- ✅ Response caching with configurable timeout
- ✅ OData query filter support
- ✅ Centralized error handling
- ✅ AccountsClient ready to use
- ✅ Easy to extend for new endpoints

### 💾 Storage Service
- ✅ Encrypted localStorage (AES encryption)
- ✅ Encrypted sessionStorage
- ✅ Automatic encryption/decryption
- ✅ Remember me logic

### 🎨 UI Components
- ✅ Layout components (TopNav, Footer, Layout)
- ✅ Spinner/Loader
- ✅ Error Boundary
- ✅ Bootstrap 5 styling
- ✅ SweetAlert2 integration

### 🛠️ Services
- ✅ AccountService (auth operations)
- ✅ CommonService (alerts, toasts, loaders)
- ✅ NetworkService (connectivity monitoring)
- ✅ ThemeService (light/dark mode)
- ✅ LogHandlerService (error logging)
- ✅ StorageService (encrypted storage)

### 🎣 React Hooks & Contexts
- ✅ useAuth hook
- ✅ useTheme hook
- ✅ useNetwork hook
- ✅ useCommon hook
- ✅ useStorage hook
- ✅ All contexts set up

### 📄 Pages Created

**User/Public Pages:**
- ✅ `/` - Redirects to `/home`
- ✅ `/home` - Home page (public)
- ✅ `/about` - About page (public)
- ✅ `/contact` - Contact page (public)
- ✅ `/not-found` - 404 page

**Admin/Protected Pages:**
- ✅ `/admin/auth/login` - Admin login
- ✅ `/admin/auth/register` - Admin registration
- ✅ `/admin/auth/forgotpassword` - Forgot password
- ✅ `/admin/auth/resetpassword` - Reset password
- ✅ `/admin/auth/verifyemail` - Email verification
- ✅ `/admin/dashboard` - Admin dashboard (protected)
- ✅ `/admin/profile` - Admin profile (protected)

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   cd React
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
React/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   ├── (main)/            # Main app route group
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home redirect
│   ├── api/                    # API clients
│   │   ├── base/
│   │   ├── helpers/
│   │   └── accounts.client.ts
│   ├── components/             # React components
│   │   ├── common/
│   │   └── layout/
│   ├── contexts/               # React Context providers
│   ├── guards/                 # Route guards
│   ├── hooks/                  # Custom React hooks
│   ├── models/                 # TypeScript models
│   ├── services/               # Business logic services
│   ├── utils/                  # Utility functions
│   ├── constants/              # App constants
│   └── environments/           # Environment configs
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🔧 Key Features

### Authentication Flow
1. User logs in → Token stored (encrypted)
2. Token automatically injected in API calls
3. Protected routes check authentication
4. Role-based access control

### API Client Usage
```typescript
// Example: Create a new API client
import { BaseApiClient } from "@/api/base/base-api.client";
import { AdditionalRequestDetails, Authentication } from "@/models/...";

class MyClient extends BaseApiClient {
  async GetData() {
    return await this.GetResponseAsync(
      "api/endpoint",
      "GET",
      null,
      new AdditionalRequestDetails(false, Authentication.true)
    );
  }
}
```

### Protected Routes
```typescript
import { AuthGuard } from "@/guards/AuthGuard";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";

<AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin]}>
  <YourComponent />
</AuthGuard>
```

## 📖 How to Create a New Page

The application is structured into two main sections:

### 📍 Route Structure Overview

**User/Public Pages** (No Authentication Required):
- Location: `src/app/(user)/`
- URL Pattern: `/your-page-name` (e.g., `/home`, `/about`, `/contact`)
- Examples: Home, About, Contact, Services, Blog, etc.
- **No** `<AuthGuard>` needed

**Admin/Protected Pages** (Authentication Required):
- Location: `src/app/admin/`
- URL Pattern: `/admin/your-page-name` (e.g., `/admin/dashboard`, `/admin/settings`)
- Examples: Dashboard, Profile, Settings, Analytics, Reports, etc.
- **Must** use `<AuthGuard>` for protection

---

Follow the appropriate guide below based on your page type:

---

## 🌐 Creating a User/Public Page

User pages are accessible to everyone without authentication (e.g., Home, About, Contact, Services, etc.).

### Step 1: Create the Page File

1. Navigate to the user route group folder:
   ```bash
   src/app/(user)/your-page-name/
   ```

2. Create a new file `page.tsx`:
   ```typescript
   "use client";

   import React from "react";
   import { Layout } from "@/components/layout/Layout";
   import Link from "next/link";

   export default function YourPageName() {
     return (
       <Layout>
         <div className="container mt-5">
           <h1>Your Page Title</h1>
           {/* Your page content here */}
         </div>
       </Layout>
     );
   }
   ```

**Example:** Creating a "Services" page at `/services`
- File location: `src/app/(user)/services/page.tsx`
- URL: `http://localhost:3000/services`

### Step 2: Add Route Constant (Optional but Recommended)

1. Open `src/constants/app-constants.ts`
2. Add your route to `WEB_ROUTES.USER`:
   ```typescript
   WEB_ROUTES: {
     USER: {
       HOME: "home",
       ABOUT: "about",
       CONTACT: "contact",
       SERVICES: "services", // Your new route
     },
   }
   ```

3. Use it in your code:
   ```typescript
   import { AppConstants } from "@/constants/app-constants";
   router.push(`/${AppConstants.WEB_ROUTES.USER.SERVICES}`);
   ```

### Step 3: Add Navigation Link (Optional)

1. Open `src/components/layout/TopNav.tsx`
2. Add navigation link in the User/Public Navigation section:
   ```typescript
   <li className="nav-item">
     <Link className="nav-link d-flex align-items-center" href="/services">
       <i className="bi bi-briefcase me-1"></i>
       <span>Services</span>
     </Link>
   </li>
   ```

**Notes for User Pages:**
- ✅ Always use `"use client"` directive
- ✅ Wrap with `<Layout>` component
- ❌ **DO NOT** use `<AuthGuard>` - these are public pages
- ✅ No authentication required

---

## 🔐 Creating an Admin/Protected Page

Admin pages require authentication and are only accessible to logged-in users (e.g., Dashboard, Profile, Settings, Analytics, etc.).

### Step 1: Create the Page File

1. Navigate to the admin folder:
   ```bash
   src/app/admin/your-page-name/
   ```

2. Create a new file `page.tsx`:
   ```typescript
   "use client";

   import React from "react";
   import { Layout } from "@/components/layout/Layout";
   import { AuthGuard } from "@/guards/AuthGuard";
   import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
   import Link from "next/link";

   export default function AdminYourPageName() {
     return (
       <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.ClientEmployee]}>
         <Layout>
           <div className="container mt-5">
             <h1>Your Admin Page Title</h1>
             {/* Your page content here */}
           </div>
         </Layout>
       </AuthGuard>
     );
   }
   ```

**Example:** Creating a "Settings" page at `/admin/settings`
- File location: `src/app/admin/settings/page.tsx`
- URL: `http://localhost:3000/admin/settings`

### Step 2: Add Route Constant (Optional but Recommended)

1. Open `src/constants/app-constants.ts`
2. Add your route to `WEB_ROUTES.ADMIN`:
   ```typescript
   WEB_ROUTES: {
     ADMIN: {
       DASHBOARD: "admin/dashboard",
       PROFILE: "admin/profile",
       SETTINGS: "admin/settings", // Your new route
     },
   }
   ```

3. Use it in your code:
   ```typescript
   import { AppConstants } from "@/constants/app-constants";
   router.push(`/${AppConstants.WEB_ROUTES.ADMIN.SETTINGS}`);
   ```

### Step 3: Add Navigation Link (Optional)

1. Open `src/components/layout/TopNav.tsx`
2. Add navigation link in the Admin Navigation section:
   ```typescript
   <li className="nav-item">
     <Link className="nav-link d-flex align-items-center" href="/admin/settings">
       <i className="bi bi-gear me-1"></i>
       <span>Settings</span>
     </Link>
   </li>
   ```

**Notes for Admin Pages:**
- ✅ Always use `"use client"` directive
- ✅ Wrap with `<Layout>` component
- ✅ **MUST** use `<AuthGuard>` for protection
- ✅ Specify `allowedRoles` for role-based access control
- ✅ Requires authentication to access

---

## 📋 Common Steps (Apply to Both User and Admin Pages)

### Step 4: Create TypeScript Models (If Needed)

If your page needs to interact with API, create models:

1. Create model file: `src/models/service/app/v1/settings/settings-s-m.ts`
   ```typescript
   export class SettingsSM {
     id!: number;
     settingName!: string;
     settingValue!: string;
     // Add other properties
   }
   ```

2. Create request/response models if needed:
   - `settings-request-s-m.ts` - For API requests
   - `settings-response-s-m.ts` - For API responses

### Step 5: Create API Client (If Needed)

1. Create API client file: `src/api/settings.client.ts`
   ```typescript
   import { BaseApiClient } from "@/api/base/base-api.client";
   import { StorageService } from "@/services/storage.service";
   import { StorageCache } from "@/api/helpers/storage-cache.helper";
   import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
   import { AppConstants } from "@/constants/app-constants";
   import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
   import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
   import { AdditionalRequestDetails, Authentication } from "@/models/service/foundation/api-contracts/additional-request-details";
   import { SettingsSM } from "@/models/service/app/v1/settings/settings-s-m";

   export class SettingsClient extends BaseApiClient {
     constructor(
       storageService: StorageService,
       storageCache: StorageCache,
       commonResponseCodeHandler: CommonResponseCodeHandler
     ) {
       super(storageService, storageCache, commonResponseCodeHandler);
     }

     GetSettings = async (): Promise<ApiResponse<SettingsSM[]>> => {
       const resp = await this.GetResponseAsync<null, SettingsSM[]>(
         AppConstants.API_ENDPOINTS.SETTINGS,
         "GET",
         null,
         new AdditionalRequestDetails<SettingsSM[]>(false, Authentication.true)
       );
       return resp;
     };

     UpdateSettings = async (
       settingsRequest: ApiRequest<SettingsSM>
     ): Promise<ApiResponse<SettingsSM>> => {
       const resp = await this.GetResponseAsync<SettingsSM, SettingsSM>(
         AppConstants.API_ENDPOINTS.SETTINGS,
         "POST",
         settingsRequest,
         new AdditionalRequestDetails<SettingsSM>(false, Authentication.true)
       );
       return resp;
     };
   }
   ```

2. Add API endpoint to `src/constants/app-constants.ts`:
   ```typescript
   API_ENDPOINTS: {
     // ... existing endpoints
     SETTINGS: "api/v1/Settings",
   }
   ```

### Step 6: Create Service (If Needed)

1. Create service file: `src/services/settings.service.ts`
   ```typescript
   import { SettingsClient } from "@/api/settings.client";
   import { BaseService } from "./base.service";
   import { SettingsSM } from "@/models/service/app/v1/settings/settings-s-m";
   import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
   import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
   import { AppConstants } from "@/constants/app-constants";

   export class SettingsService extends BaseService {
     constructor(private settingsClient: SettingsClient) {
       super();
     }

     async getSettings(): Promise<ApiResponse<SettingsSM[]>> {
       const resp = await this.settingsClient.GetSettings();
       if (resp.isError) {
         throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error);
       }
       return resp;
     }

     async updateSettings(settings: SettingsSM): Promise<ApiResponse<SettingsSM>> {
       const apiRequest = new ApiRequest<SettingsSM>();
       apiRequest.reqData = settings;
       const resp = await this.settingsClient.UpdateSettings(apiRequest);
       if (resp.isError) {
         throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error);
       }
       return resp;
     }
   }
   ```

### Step 7: Use Hooks and Services in Your Page

Update your page to use hooks and services:

```typescript
"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { AuthGuard } from "@/guards/AuthGuard";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { useCommon } from "@/hooks/useCommon";
import { SettingsService } from "@/services/settings.service";
import { SettingsClient } from "@/api/settings.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";

export default function SettingsPage() {
  const { commonService } = useCommon();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await commonService.presentLoading("Loading settings...");
        
        // Initialize services
        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const settingsClient = new SettingsClient(storageService, storageCache, commonResponseCodeHandler);
        const settingsService = new SettingsService(settingsClient);
        
        const response = await settingsService.getSettings();
        if (response.successData) {
          setSettings(response.successData);
        }
      } catch (error: any) {
        await commonService.showSweetAlertToast({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to load settings",
        });
      } finally {
        await commonService.dismissLoader();
        setLoading(false);
      }
    };

    loadSettings();
  }, [commonService]);

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.ClientEmployee]}>
      <Layout>
        <div className="container mt-5">
          <h1>Settings</h1>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {/* Render your settings here */}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
```

### Step 8: Testing Your Page

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to your page:**
   - **User pages:** `http://localhost:3000/your-page-name` (e.g., `/services`)
   - **Admin pages:** `http://localhost:3000/admin/your-page-name` (e.g., `/admin/settings`)
   - Or use navigation links if added

3. **Test authentication (Admin pages only):**
   - Try accessing without login (should redirect to `/admin/auth/login`)
   - Login and test with different roles
   - Verify role-based access works correctly
   - Test that unauthorized roles are redirected

4. **Test public access (User pages):**
   - Verify page is accessible without login
   - Test navigation and links work correctly

### Quick Reference Checklists

**For User/Public Pages:**
- [ ] Created `page.tsx` file in `src/app/(user)/your-page-name/`
- [ ] Added `"use client"` directive
- [ ] Wrapped with `<Layout>` component
- [ ] **Did NOT** add `<AuthGuard>` (public page)
- [ ] Added route constant in `WEB_ROUTES.USER` (optional)
- [ ] Added navigation link in TopNav user section (optional)
- [ ] Tested page is accessible without login
- [ ] Created TypeScript models if needed
- [ ] Created API client if needed (for public APIs)
- [ ] Tested API calls (if applicable)

**For Admin/Protected Pages:**
- [ ] Created `page.tsx` file in `src/app/admin/your-page-name/`
- [ ] Added `"use client"` directive
- [ ] Wrapped with `<Layout>` component
- [ ] **Added** `<AuthGuard>` with appropriate roles
- [ ] Added route constant in `WEB_ROUTES.ADMIN` (optional)
- [ ] Added navigation link in TopNav admin section (optional)
- [ ] Tested page redirects to login when not authenticated
- [ ] Tested role-based access control
- [ ] Created TypeScript models if needed
- [ ] Created API client if needed
- [ ] Added API endpoint to constants
- [ ] Created service if needed
- [ ] Tested API calls (if applicable)

### Common Patterns

**User/Public Page Pattern:**
```typescript
"use client";

import React from "react";
import { Layout } from "@/components/layout/Layout";

export default function ServicesPage() {
  return (
    <Layout>
      <div className="container mt-5">
        <h1>Our Services</h1>
        {/* Public content - no auth required */}
      </div>
    </Layout>
  );
}
```

**Admin/Protected Page Pattern:**
```typescript
"use client";

import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AuthGuard } from "@/guards/AuthGuard";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";

export default function AdminSettingsPage() {
  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.ClientEmployee]}>
      <Layout>
        <div className="container mt-5">
          <h1>Settings</h1>
          {/* Protected content - auth required */}
        </div>
      </Layout>
    </AuthGuard>
  );
}
```

**Admin Page - Admin Only:**
```typescript
<AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin]}>
  <Layout>
    <div>Admin Only Content</div>
  </Layout>
</AuthGuard>
```

**Admin Page - All Authenticated Users:**
```typescript
<AuthGuard>
  <Layout>
    <div>Any authenticated user can access</div>
  </Layout>
</AuthGuard>
```

**Form with Validation:**
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## 🎯 Next Steps

1. **Update environment variables** in `.env.local`
2. **Configure your API base URL** in `src/environments/environment.ts`
3. **Update company code** in environment files
4. **Add more API clients** as needed
5. **Customize UI components** to match your brand
6. **Add more pages** following the steps above

## 🚀 Enabling Server-Side Rendering (SSR)

Next.js 13+ App Router supports SSR by default, but currently all pages use `"use client"` for client-side rendering. Here's how to enable SSR:

### Understanding SSR vs Client-Side Rendering

**Current State:**
- All pages have `"use client"` directive → Client-Side Rendering (CSR)
- Pages render in the browser
- Good for: Interactive pages, real-time data, browser APIs

**SSR Benefits:**
- Better SEO (search engines can crawl content)
- Faster initial page load
- Better performance scores
- Content visible before JavaScript loads

### When to Use SSR vs Client-Side

**Use SSR for:**
- ✅ Static content pages (About, Home, Blog posts)
- ✅ Public pages that don't need interactivity
- ✅ Pages that benefit from SEO
- ✅ Pages that fetch data on the server

**Keep Client-Side for:**
- ❌ Pages using React hooks (`useState`, `useEffect`, etc.)
- ❌ Pages using Context providers (Auth, Theme, etc.)
- ❌ Pages accessing browser APIs (`localStorage`, `window`, etc.)
- ❌ Pages with forms and user interactions
- ❌ Admin pages (require authentication state)

### Step 1: Enable SSR for Static Pages

For pages with static content (like About page), remove `"use client"`:

**Before (Client-Side):**
```typescript
"use client";

import React from "react";
import { Layout } from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mt-5">
        <h1>About Us</h1>
        {/* Static content */}
      </div>
    </Layout>
  );
}
```

**After (SSR):**
```typescript
// Remove "use client" - this enables SSR
import React from "react";
import { Layout } from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mt-5">
        <h1>About Us</h1>
        {/* Static content - rendered on server */}
      </div>
    </Layout>
  );
}
```

### Step 2: Handle Client Components in SSR Pages

If your SSR page needs some client-side functionality, create separate client components:

**Example: SSR Page with Client Component**

1. Create the SSR page (no `"use client"`):
```typescript
// src/app/(user)/about/page.tsx
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { InteractiveButton } from "./InteractiveButton"; // Client component

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mt-5">
        <h1>About Us</h1>
        <p>This content is server-rendered for SEO.</p>
        <InteractiveButton /> {/* Client component for interactivity */}
      </div>
    </Layout>
  );
}
```

2. Create the client component:
```typescript
// src/app/(user)/about/InteractiveButton.tsx
"use client";

import React, { useState } from "react";

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

### Step 3: Server-Side Data Fetching

For pages that need data, use Next.js server components with `async/await`:

```typescript
// src/app/(user)/blog/page.tsx
import React from "react";
import { Layout } from "@/components/layout/Layout";

// This runs on the server
async function getBlogPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // or 'force-cache' for static generation
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts(); // Server-side fetch
  
  return (
    <Layout>
      <div className="container mt-5">
        <h1>Blog</h1>
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </article>
        ))}
      </div>
    </Layout>
  );
}
```

### Step 4: Update Next.js Configuration

The current `next.config.js` is already configured for SSR. No changes needed, but you can optimize:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // For production deployment
  
  // Optional: Enable static generation for better performance
  // generateStaticParams: true,
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
```

### Step 5: Handle Browser-Only APIs

If you need browser APIs in SSR pages, use dynamic imports with `ssr: false`:

```typescript
// src/app/(user)/analytics/page.tsx
import dynamic from 'next/dynamic';

// Load this component only on client-side
const ClientOnlyChart = dynamic(
  () => import('./ChartComponent'),
  { ssr: false }
);

export default function AnalyticsPage() {
  return (
    <Layout>
      <div className="container mt-5">
        <h1>Analytics</h1>
        <ClientOnlyChart /> {/* Only renders on client */}
      </div>
    </Layout>
  );
}
```

### Step 6: Update Layout for SSR Compatibility

The root layout (`src/app/layout.tsx`) can stay as-is, but note:
- Context providers (AuthProvider, ThemeProvider) will still work
- They hydrate on the client after SSR
- For full SSR, you may need to handle auth differently

### Migration Strategy

**Recommended Approach:**

1. **Start with static pages:**
   - Convert `/about` page to SSR (remove `"use client"`)
   - Test and verify it works

2. **Keep interactive pages client-side:**
   - Admin pages should stay client-side (they need auth state)
   - Pages with forms should stay client-side
   - Pages using hooks should stay client-side

3. **Use hybrid approach:**
   - SSR for initial content
   - Client components for interactivity
   - Best of both worlds

### Example: Converting Home Page to SSR

**Current (Client-Side):**
```typescript
"use client";
// ... client-side code
```

**SSR Version:**
```typescript
// Remove "use client"
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { ClientCTAButtons } from "./ClientCTAButtons"; // Extract interactive parts

export default function HomePage() {
  // Static data can be here or fetched server-side
  const features = [/* ... */];
  
  return (
    <Layout>
      {/* Static content rendered on server */}
      <div className="container mt-5">
        <h1>Welcome to Boilerplate</h1>
        {/* Static features list */}
        <ClientCTAButtons /> {/* Interactive buttons as client component */}
      </div>
    </Layout>
  );
}
```

### Testing SSR

1. **Build and test:**
   ```bash
   npm run build
   npm start
   ```

2. **Verify SSR:**
   - View page source (right-click → View Page Source)
   - Content should be in HTML (not just `<div id="root">`)
   - Check Network tab - initial HTML should contain content

3. **Check SEO:**
   - Use tools like Google Search Console
   - Verify meta tags are in HTML source

### Important Notes

⚠️ **Keep Client-Side:**
- All admin pages (`/admin/*`) - need auth state
- Pages with forms - need React Hook Form
- Pages using contexts - need client-side hydration
- Pages accessing localStorage/sessionStorage

✅ **Can Use SSR:**
- Static content pages (About, Home, Services)
- Blog posts, articles
- Public information pages
- Pages that don't need real-time data

### Troubleshooting SSR

**Issue: "window is not defined"**
- Solution: Use `typeof window !== 'undefined'` checks
- Or use dynamic imports with `ssr: false`

**Issue: "localStorage is not defined"**
- Solution: Keep page client-side or use dynamic imports
- Or check `typeof window !== 'undefined'` before accessing

**Issue: Context not working**
- Solution: Contexts need client-side hydration
- Keep pages using contexts as client components
- Or create wrapper client components

## 📝 Notes

- All storage is encrypted using AES encryption
- API responses are cached (configurable timeout)
- Error handling is centralized
- TypeScript throughout for type safety
- SSR can be enabled selectively per page by removing `"use client"` directive

## 🐛 Troubleshooting

- **Bootstrap not working?** Make sure Bootstrap JS is loaded (check `layout.tsx`)
- **SweetAlert2 not working?** Check if script is loaded in `layout.tsx`
- **API calls failing?** Check your `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- **Token issues?** Check browser console and network tab

## 📚 Documentation

- Next.js: https://nextjs.org/docs
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- Bootstrap 5: https://getbootstrap.com/docs/5.3/
