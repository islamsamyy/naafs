# 🧪 MANUAL UI/UX TESTING GUIDE

**Purpose:** Step-by-step instructions to test all features of the NAFIS app  
**Duration:** ~2-3 hours for complete testing  
**Date:** April 16, 2026  
**Server:** http://localhost:3001

---

## ⚡ QUICK START

### Prerequisites
1. Dev server running: `npm run dev` (should be on http://localhost:3001)
2. Open Chrome/Edge/Firefox
3. Open DevTools (F12) - set to mobile view (375x812px) for responsive testing
4. Have test accounts ready (or create during testing)

### Test Environment Setup
```bash
# In terminal, from nafis-app directory
cd /d/nafs/nafis-app
npm run dev

# Server will start on http://localhost:3001
# You can also test on mobile device by visiting:
# http://YOUR_MACHINE_IP:3001
```

---

## 📝 TESTING CHECKLIST - EXECUTE IN ORDER

### 1️⃣ MARKETING PAGE TESTS (No Login Required)

#### Test 1.1: Home Page (`/`)
```
URL: http://localhost:3001/
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ Page loads completely (no loading spinner stuck)
2. ✓ Header navigation visible with:
   - Logo/brand name
   - Language toggle (En/العربية)
   - Login button
3. ✓ Hero section displays with:
   - Main heading visible
   - Subheading readable
   - Call-to-action buttons clickable
4. ✓ Stats section shows counts (e.g., "١,٢٠٠+ Freelancers")
5. ✓ Featured/highlighted content visible
6. ✓ Footer contains links and info
7. ✓ Animations are smooth (no jank)
8. ✓ Colors match design (primary blue, proper spacing)

**Check for errors:**
- Open DevTools Console (F12 → Console tab)
- Look for any red errors or warnings
- Note any errors found: _______________

**Record Result:**
- [ ] PASS - All tests passed, no errors
- [ ] FAIL - Found issues: _______________

---

#### Test 1.2: Explore Page (`/explore`)
```
URL: http://localhost:3001/explore
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ Page loads with real freelancer data
2. ✓ Search bar present and functional:
   - Type in search box
   - Results filter/update
3. ✓ Category filters work:
   - Click different categories
   - Count updates for each category
   - Cards below filter by category
4. ✓ Freelancer cards display with:
   - Avatar image
   - Name
   - Title/specialization
   - Rating (stars) and review count
   - Hourly rate or price
   - Skills badges
5. ✓ Hover effects on cards:
   - Card slightly lifts/scales
   - Border or shadow changes
6. ✓ "View Profile" button navigates to freelancer detail page
7. ✓ Loading state appears while fetching (spinner)
8. ✓ Empty state message if no results after filtering

**Check for errors:**
- Open DevTools Console
- Note any errors: _______________

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 1.3: Freelancers Page (`/freelancers`)
```
URL: http://localhost:3001/freelancers
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ Page lists freelancers (should match /explore roughly)
2. ✓ Category tabs present at top
3. ✓ Category counts display (e.g., "Web Development (45)")
4. ✓ Click category tab:
   - Freelancers filter to that category
   - Only showing matching skills
5. ✓ Search bar filters freelancers by name/skills
6. ✓ Freelancer cards show:
   - Avatar
   - Name and title
   - Rating and review count
   - Hourly rate
   - Skills listed
7. ✓ Cards have hover effects (scale, shadow)
8. ✓ Profile link on card opens `/freelancers/[id]`
9. ✓ Responsive: On mobile, cards stack in 1 column; on tablet 2 columns; on desktop 3-4 columns

**Check for errors:**
- DevTools Console
- Note any issues: _______________

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 1.4: Auctions/Projects Page (`/auctions`)
```
URL: http://localhost:3001/auctions
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ Page loads with project auction cards
2. ✓ Each card shows:
   - Project title
   - Budget range (e.g., "$500 - $2000")
   - Number of bids received
   - Time remaining until deadline
   - Status badge (HOT, NEW, etc.)
3. ✓ Category filter tabs work:
   - Click category
   - Cards filter to show only that category
4. ✓ Search bar filters projects by title/description
5. ✓ Hover over card:
   - Shows "Place Bid" button or link
   - Card scales/lifts slightly
6. ✓ Click on project card:
   - Navigates to `/auctions/[id]` (project details)
   - Shows full project info, all bids, freelancers
7. ✓ Loading state visible while fetching
8. ✓ Responsive layout on different screen sizes

**Check for errors:**
- DevTools Console
- Note errors: _______________

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 1.5: Live Auctions Page (`/auctions/live`)
```
URL: http://localhost:3001/auctions/live
Time Limit: 3 minutes
```

**Tests to perform:**
1. ✓ Page loads activity feed
2. ✓ Activity items show:
   - Freelancer name
   - Bid amount
   - Project name
   - Time/timestamp (e.g., "2 minutes ago")
   - Freelancer avatar
3. ✓ Bids sorted by most recent first
4. ✓ Avatars load properly with correct images
5. ✓ Activity updates in real-time (if another user places bid in different browser)
6. ✓ No console errors
7. ✓ Responsive on mobile/tablet/desktop

**Check for errors:**
- DevTools Console
- Note any: _______________

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

### 2️⃣ AUTHENTICATION FLOW TESTS

#### Test 2.1: Registration Flow
```
URL: http://localhost:3001/auth/register
Time Limit: 10 minutes
```

**Tests to perform:**
1. ✓ Register page accessible
2. ✓ Form has required fields:
   - Full Name (text input)
   - Email (email input)
   - Password (password input, masked)
   - Confirm Password (password input)
   - Role selection (Radio or Select: Freelancer / Business Owner)
   - Terms & Conditions checkbox
3. ✓ Try submitting empty form:
   - Form doesn't submit
   - Error messages appear for each empty field
4. ✓ Try invalid email (e.g., "notanemail"):
   - Email validation error appears
5. ✓ Try mismatched passwords:
   - Error message: "Passwords don't match"
6. ✓ Fill in ALL valid fields:
   - Name: "Test User" (or any name)
   - Email: "testuser@example.com" (or unique email)
   - Password: "SecurePassword123!" (strong password)
   - Confirm: Same password
   - Role: Select "Freelancer" or "Business Owner"
   - Check Terms checkbox
7. ✓ Submit form:
   - Loading indicator appears (spinner/button disabled)
   - Account created successfully
   - Redirects to login page or dashboard
8. ✓ Check for success message/notification

**If account creation fails:**
- Note error message: _______________
- Check if email already exists
- Try another email

**Record Result:**
- [ ] PASS - Account created successfully
- [ ] FAIL - Issues: _______________
- **Test Email Used:** _______________

---

#### Test 2.2: Login Flow
```
URL: http://localhost:3001/auth/login
Time Limit: 8 minutes
```

**Tests to perform:**
1. ✓ Login page accessible
2. ✓ Form has:
   - Email input field
   - Password input field (masked)
   - "Remember me" checkbox (optional)
   - Login button
   - Forgot password link
   - Sign up link
3. ✓ Try login with empty fields:
   - Form doesn't submit
   - Error messages appear
4. ✓ Try login with wrong email:
   - Error: "User not found" or "Invalid email"
5. ✓ Try login with correct email but wrong password:
   - Error: "Invalid password" or "Invalid credentials"
6. ✓ Login with correct credentials (from registration):
   - Loading indicator appears
   - Redirects to appropriate dashboard:
     - If Freelancer → `/dashboard/freelancer`
     - If Business → `/dashboard/client`
7. ✓ Dashboard loads with your data:
   - Header shows your name
   - Your data displays (bids, projects, etc.)
8. ✓ No console errors

**Test Login Credentials:**
- Email: _______________
- Password: _______________

**Record Result:**
- [ ] PASS - Login successful
- [ ] FAIL - Issues: _______________

---

#### Test 2.3: Logout Flow
```
Time Limit: 2 minutes
```

**Tests to perform:**
1. ✓ While logged in, find logout button:
   - Usually in header or user menu
   - Click user avatar/profile icon if visible
2. ✓ Click "Logout" button:
   - Confirmation dialog may appear
   - Or directly logs out
3. ✓ After logout:
   - Redirected to home page (`/`)
   - Cannot access protected routes
4. ✓ Try accessing `/dashboard/freelancer` while logged out:
   - Should redirect to `/auth/login`
5. ✓ No errors in console

**Record Result:**
- [ ] PASS - Logout works correctly
- [ ] FAIL - Issues: _______________

---

### 3️⃣ FREELANCER DASHBOARD TESTS

#### Test 3.1: Dashboard Load & Basic UI
```
URL: http://localhost:3001/dashboard/freelancer (auto-redirect from /dashboard if freelancer)
Time Limit: 5 minutes
Prerequisites: Must be logged in as Freelancer
```

**Tests to perform:**
1. ✓ Dashboard loads only when logged in
   - If not logged in, redirects to login
2. ✓ Header section shows:
   - Freelancer's name
   - Avatar/profile picture
   - "Welcome" greeting
3. ✓ Stats section displays 4 animated counters:
   - **Earnings:** Shows total amount from completed projects
   - **Active Bids:** Count of pending bids
   - **Completed Projects:** Count of finished projects
   - **Rating:** Your average rating (e.g., "4.8 ⭐")
4. ✓ Stat counters animate smoothly from 0 to final value when page loads
5. ✓ Hover over any stat card:
   - Background color changes
   - Slight scale/lift effect
   - Returns to normal on unhover
6. ✓ Layout is responsive:
   - Desktop: 4 columns (1 stat per column)
   - Tablet: 2-3 columns
   - Mobile: 1 column (stack vertically)
7. ✓ No console errors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 3.2: Active Projects Section
```
Time Limit: 5 minutes
Prerequisites: Must have at least 1 in-progress project (or create one for testing)
```

**Tests to perform:**
1. ✓ Section titled "Active Projects" visible
2. ✓ If projects exist, each card shows:
   - Project title
   - Client name (from database)
   - Progress bar with percentage (0-100%)
   - Budget amount
   - Delivery deadline
   - Status badge (e.g., "In Progress")
3. ✓ Progress bar color-codes:
   - **Orange** if progress < 40%
   - **Blue** if 40% ≤ progress ≤ 70%
   - **Green** if progress > 70%
4. ✓ Hover over project card:
   - "Edit" button appears (or reveals)
   - Card lifts/scales slightly
5. ✓ Click "Edit" button:
   - Modal opens showing project details
   - Fields are READ-ONLY (can view but not edit)
   - Shows: title, description, budget, deadline, progress, client info
6. ✓ Modal has:
   - "View Full Details" button (navigates to project page)
   - "Close" or "X" button
7. ✓ Click Close or click outside modal:
   - Modal closes smoothly
8. ✓ If no projects, empty state shows:
   - Icon or message
   - "You don't have any projects" or similar
   - "Browse Projects" button/link
9. ✓ No console errors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 3.3: Active Bids Section
```
Time Limit: 10 minutes
Prerequisites: Must have at least 1 bid (or create one on /auctions first)
```

**Tests to perform:**

**A) View Bids:**
1. ✓ Section titled "Active Bids" or similar
2. ✓ Each bid card shows:
   - Project title
   - Your bid amount
   - Highest bid on project (for comparison)
   - Status badge:
     - **Green "Winning"** if your bid is the highest
     - **Red "Losing"** if someone bid higher
   - Time remaining (from project deadline)
3. ✓ Bids are sorted logically (by date, amount, or status)
4. ✓ Bid card displays properly on all screen sizes
5. ✓ Empty state if no bids

**B) Edit Bid:**
6. ✓ Hover over a bid card:
   - "Edit" button appears/reveals
   - "Delete" button appears/reveals
7. ✓ Click "Edit" button:
   - Modal opens with fields:
     - Project name (disabled, read-only)
     - Bid amount (editable number input)
     - Proposal message (editable textarea)
     - Cancel and Save buttons
8. ✓ Modal form validation:
   - Try saving with empty amount: Error appears
   - Try saving with text in amount field: Error appears
   - Enter valid number: Form accepts it
9. ✓ Change bid amount (e.g., increase from $500 to $750)
10. ✓ Change proposal message (optional)
11. ✓ Click "Save" button:
    - Loading indicator appears
    - Modal closes
    - **Success notification** appears with message like "Bid updated successfully"
12. ✓ Notification auto-dismisses after 3-5 seconds
13. ✓ Check bid card updated:
    - New amount displayed
    - Page data reloaded (or optimistic update)
14. ✓ **Refresh page (Ctrl+R) and verify changes persisted:**
    - Login again if session expired
    - Check bid amount is still the new value
    - Proves data saved to database ✓
15. ✓ No console errors

**Record Edit Test Result:**
- [ ] PASS - Bid edited and persisted
- [ ] FAIL - Issues: _______________

**C) Delete Bid:**
16. ✓ Hover over a different bid card
17. ✓ Click "Delete" button:
    - Confirmation dialog appears
    - Message: "Are you sure?" or similar
    - Two options: Cancel, Confirm Delete
18. ✓ Click "Cancel":
    - Dialog closes
    - Bid remains in list
19. ✓ Hover over same bid, click "Delete" again
20. ✓ Click "Confirm Delete":
    - Loading indicator appears
    - Modal/dialog closes
    - **Success notification** appears
    - Bid is removed from list
21. ✓ Refresh page and verify deletion persisted:
    - Bid should be gone from database
    - Proves persistent deletion ✓
22. ✓ No console errors

**Record Delete Test Result:**
- [ ] PASS - Bid deleted and persisted
- [ ] FAIL - Issues: _______________

---

#### Test 3.4: Floating Elements
```
Time Limit: 3 minutes
```

**Tests to perform:**
1. ✓ **Floating Action Button (FAB):**
   - Visible in bottom-right corner (or mobile-specific position)
   - Shows label "عرض جديد" (Arabic) or "New Bid" (English)
   - Has icon (usually star or plus)
   - On desktop: might be visible or only on mobile
2. ✓ Hover over FAB:
   - Color changes or lifts
3. ✓ Click FAB:
   - Navigates to `/auctions` page
   - Shows available projects to bid on
4. ✓ **Floating Notification Panel:**
   - Visible in bottom-right area
   - Shows notifications from operations
   - Examples: "Bid saved!", "Bid deleted!"
5. ✓ Notification styling:
   - Background color differs by type (green for success, red for error)
   - Has icon and text message
   - Shows close button or auto-dismisses
6. ✓ Multiple notifications:
   - If multiple operations happen, notifications stack
   - All visible without overlap
7. ✓ Auto-dismiss behavior:
   - Notifications disappear after 3-5 seconds
   - Can manually close by clicking X
8. ✓ No console errors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

### 4️⃣ BUSINESS DASHBOARD TESTS

#### Test 4.1: Dashboard Load & Basic UI
```
URL: http://localhost:3001/dashboard/client
Time Limit: 5 minutes
Prerequisites: Must be logged in as Business Owner
```

**Tests to perform:**
1. ✓ Dashboard loads only when logged in as business owner
2. ✓ Header shows:
   - Business owner's name
   - Company/avatar image
   - Greeting or welcome message
3. ✓ Stats section displays 4 animated counters:
   - **Total Spent:** Sum of all accepted bid amounts
   - **Active Auctions:** Count of open projects
   - **Completed Projects:** Count of finished projects
   - **Live Operations:** Activity indicator (usually pulse effect)
4. ✓ Stat counters animate smoothly from 0 to final value on page load
5. ✓ Hover effects work on stat cards
6. ✓ Responsive layout:
   - Desktop: 4 columns
   - Tablet: 2-3 columns
   - Mobile: 1 column stacked
7. ✓ No console errors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 4.2: Active Projects Section
```
Time Limit: 10 minutes
Prerequisites: Must have at least 1 project posted
```

**Tests to perform:**

**A) View Projects:**
1. ✓ Section titled "My Projects" or similar
2. ✓ Each project card shows:
   - Project title
   - Status badge: "Active" or "In Progress"
   - Budget range: "$500 - $2000" format
   - Number of bids received: "5 bids"
   - Days remaining: "3 days left"
   - Highest bid received: "$750"
3. ✓ Cards have visual hierarchy:
   - Title prominent (large, bold)
   - Details in smaller text
   - Budget and bids highlighted
4. ✓ Responsive layout:
   - Desktop: Cards in grid (3+ per row)
   - Tablet: 2 per row
   - Mobile: 1 per column
5. ✓ "Add New Project" ghost card at bottom
   - Lighter styling than regular cards
   - "+" icon and text "Add New Project"
   - Clickable to create project
6. ✓ Empty state if no projects
   - Icon and message
   - "Create your first project" CTA
   - Link to `/projects/create`

**B) Edit Project:**
7. ✓ Hover over a project card:
   - "Edit" button appears/reveals
   - "Delete" button appears/reveals
8. ✓ Click "Edit" button:
   - Modal opens with editable fields:
     - Title (text input)
     - Description (textarea)
     - Budget Min (number input)
     - Budget Max (number input)
     - Deadline (date input)
     - Cancel and Save buttons
9. ✓ Modal form validation:
   - Try saving empty title: Error
   - Try saving with invalid budget (min > max): Error
   - Try saving with past deadline: Error or warning
   - All validations provide clear error messages
10. ✓ Modify project details:
    - Change title to something different
    - Update description
    - Change budget min/max
    - Update deadline to a future date
11. ✓ Click "Save":
    - Loading indicator
    - Modal closes
    - **Success notification** appears
12. ✓ Verify changes applied:
    - New title visible in card
    - New budget range displayed
    - New deadline reflected
13. ✓ **Refresh page and verify persisted:**
    - New title still shows
    - Proves database save ✓
14. ✓ No console errors

**Record Edit Test Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

**C) Delete Project:**
15. ✓ Hover over a different project card
16. ✓ Click "Delete" button:
    - Confirmation dialog
    - "Are you sure?" message
    - Warning that this cannot be undone
    - Cancel and Confirm Delete buttons
17. ✓ Click "Cancel":
    - Dialog closes
    - Project remains
18. ✓ Click "Delete" again, confirm deletion:
    - Loading indicator
    - Dialog closes
    - **Success notification**
    - Project removed from list
19. ✓ **Refresh page and verify deletion persisted:**
    - Project should be gone
    - Proves database delete ✓
20. ✓ No console errors

**Record Delete Test Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 4.3: Featured Experts Section
```
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ Section titled "Featured Experts" or "Top Freelancers"
2. ✓ Displays freelancer cards with:
   - Avatar image (profile picture)
   - Name
   - Title/specialization
   - Rating (stars): e.g., "4.8 ⭐"
   - Number of projects completed: "145 projects"
3. ✓ Main featured expert card (larger):
   - More prominent styling
   - All above info
   - "Certification" badge if applicable
   - "View Profile" button
4. ✓ Click "View Profile":
   - Navigates to `/freelancers/[id]`
   - Shows full freelancer profile with portfolio, reviews, etc.
5. ✓ Mini expert cards:
   - Smaller cards showing multiple experts
   - Hover effect (scale, lift)
   - Quick view or profile link
6. ✓ "View All Experts" link if more available
7. ✓ Responsive:
   - Desktop: Main + mini cards visible
   - Mobile: Main card only or scrollable row
8. ✓ No console errors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 4.4: Floating Elements
```
Time Limit: 3 minutes
```

**Tests to perform:**
1. ✓ **Floating Action Button (FAB):**
   - Visible in bottom-left corner (or configurable position)
   - Shows label "إضافة مشروع" (Arabic) or "Add Project" (English)
   - Has "+" icon
   - Visible on all device sizes
2. ✓ Hover over FAB:
   - Color changes or animation
3. ✓ Click FAB:
   - Navigates to `/projects/create`
   - Project creation form opens
4. ✓ **Floating Notification Panel:**
   - Visible in bottom-right
   - Shows operation notifications
   - Different colors for different types
5. ✓ Notifications from edit/delete operations appear and auto-dismiss
6. ✓ No console errors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

### 5️⃣ PROJECT MANAGEMENT TESTS

#### Test 5.1: Create Project Flow
```
URL: http://localhost:3001/projects/create
Time Limit: 10 minutes
Prerequisites: Logged in as Business Owner
```

**Tests to perform:**
1. ✓ Create project page accessible via:
   - FAB button on dashboard
   - "Add New Project" button
   - Direct URL `/projects/create`
2. ✓ Form has all required fields:
   - Title (text input)
   - Description (textarea)
   - Category (dropdown)
   - Budget Min (number input)
   - Budget Max (number input)
   - Deadline (date picker)
   - Skills required (tags or checkboxes)
3. ✓ Form validation:
   - Cannot submit with empty required fields
   - Budget validation: min must be ≤ max
   - Budget must be positive numbers
   - Deadline must be future date
   - Clear error messages for each validation
4. ✓ Fill out form with sample data:
   - Title: "Mobile App Development"
   - Description: "I need a React Native app for iOS/Android"
   - Category: Select from dropdown
   - Budget: $1000 - $5000
   - Deadline: Pick future date (30 days out)
   - Skills: Select relevant skills
5. ✓ Submit form:
   - Loading indicator appears
   - Form disabled while processing
6. ✓ On success:
   - Project created in database
   - **Success notification** appears
   - Redirects to dashboard or project details
   - New project visible in "My Projects" section
7. ✓ Check database persistence:
   - Refresh page
   - New project still there
   - All details correct ✓
8. ✓ No console errors

**Record Result:**
- [ ] PASS - Project created successfully
- [ ] FAIL - Issues: _______________

---

#### Test 5.2: Project Details Page
```
URL: http://localhost:3001/projects/[id] (click on any project)
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ Page loads project data from database
2. ✓ Displays complete project info:
   - Large title
   - Full description
   - Budget range
   - Category
   - Deadline (with "X days remaining")
   - Status (Open/Awarded/In Progress)
   - Skills required
   - Client info (avatar, name, rating)
3. ✓ Bids section shows:
   - Count: "5 bids received"
   - List of all bids with: freelancer name, bid amount, proposal, date
   - Bids sortable by amount or date
4. ✓ If logged in as project owner:
   - "Manage Bids" button visible
   - Can accept bids
   - Edit/delete project buttons
5. ✓ If logged in as freelancer:
   - "Place Bid" button visible
   - Can navigate to bidding form
6. ✓ Timeline/milestones if applicable
7. ✓ Related projects section at bottom
8. ✓ Responsive layout on all devices
9. ✓ No console errors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

### 6️⃣ RESPONSIVE DESIGN TESTS

#### Test 6.1: Mobile Layout (375x812px)
```
Time Limit: 10 minutes
Method: Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M) → Select iPhone 12/13
```

**Tests to perform:**
1. ✓ **Navigation:**
   - Menu collapses into hamburger icon
   - Hamburger clickable, opens/closes menu
   - Menu items clickable and navigate correctly
   - Menu closes after navigation

2. ✓ **Dashboard Page:**
   - Stats cards stack in 1 column
   - All text readable (not too small)
   - Buttons easy to tap (min 44px height)
   - Active Projects scrollable vertically
   - Active Bids scrollable vertically

3. ✓ **Form Pages:**
   - Input fields stack vertically
   - Labels above inputs
   - Keyboard appears for text inputs
   - Keyboard doesn't cover form fields
   - Submit button at bottom, easy to tap

4. ✓ **Cards & Lists:**
   - Cards full width with padding
   - Single column layout
   - Hover effects work on touch (or adapt to tap)
   - No horizontal scrolling

5. ✓ **Modals:**
   - Modal full-screen or near full-screen
   - Close button accessible
   - Form fields visible without excessive scrolling
   - Submit button at bottom

6. ✓ **Floating Elements:**
   - FAB positioned corner (doesn't overlap content)
   - FAB touches are easy and don't miss
   - Notifications visible and readable
   - No content hidden behind FAB or notifications

7. ✓ **Images:**
   - Avatar images display at appropriate size
   - No stretched/distorted images
   - Load smoothly without freezing UI

8. ✓ **Performance:**
   - No lag when scrolling
   - Smooth 60fps animations
   - Transitions are smooth

**Record Result:**
- [ ] PASS - Mobile responsive works
- [ ] FAIL - Issues: _______________

---

#### Test 6.2: Tablet Layout (768x1024px)
```
Time Limit: 5 minutes
Method: DevTools → Select iPad Air or similar
```

**Tests to perform:**
1. ✓ Stats cards display in 2 columns
2. ✓ Project cards display in 2 columns
3. ✓ Navigation bar visible (doesn't collapse to hamburger)
4. ✓ All content properly spaced
5. ✓ Modals not full-screen, centered on screen
6. ✓ Tables show properly formatted
7. ✓ Responsive text sizing (not too large or small)
8. ✓ No horizontal scrolling
9. ✓ FAB positioning appropriate
10. ✓ Smooth performance

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 6.3: Desktop Layout (1920x1080px)
```
Time Limit: 5 minutes
Method: DevTools → Uncheck device toolbar, or browser window full width
```

**Tests to perform:**
1. ✓ Stats cards display in 4 columns
2. ✓ Project cards display in 3-4 columns per row
3. ✓ Navigation bar fully visible with all options
4. ✓ Multiple columns properly aligned
5. ✓ Proper spacing and margins
6. ✓ Modal centered with good spacing around
7. ✓ No excessive white space
8. ✓ Hover effects work (cards lift, buttons highlight)
9. ✓ No horizontal scrolling
10. ✓ Performance smooth

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

### 7️⃣ ARABIC & LOCALIZATION TESTS

#### Test 7.1: Arabic Language Toggle
```
Time Limit: 10 minutes
```

**Tests to perform:**
1. ✓ Home page visible in English by default
2. ✓ Language toggle button in header:
   - Shows "EN" and "العربية" options
   - Toggle between English and Arabic
3. ✓ Click "العربية":
   - Page direction changes to RTL (right-to-left)
   - All text displays in Arabic
   - Layout mirrors (navigation right-aligned instead of left)
   - Page reloads with Arabic content
4. ✓ All sections display in Arabic:
   - Headers: "الرئيسية", "المشاريع", "المستقلون"
   - Buttons: "تسجيل الدخول", "إنشاء حساب"
   - Field labels: "البريد الإلكتروني", "كلمة المرور"
   - Notifications and messages all in Arabic
5. ✓ RTL layout applied correctly:
   - Text right-aligned
   - Icons positioned appropriately for RTL
   - Navigation flows right-to-left
   - Form labels right of inputs
   - Buttons maintain proper alignment
6. ✓ Numbers display correctly:
   - Still display left-to-right (standard)
   - Currency symbols in correct position
   - Dates formatted appropriately
7. ✓ Forms work in Arabic:
   - Can fill form inputs in Arabic mode
   - Validation messages in Arabic
   - Submit works and saves correctly
8. ✓ Toggle back to English:
   - Page reverts to LTR
   - All English text displays
   - Layout mirrors back
9. ✓ Language preference persists:
   - If cookie/localStorage set: should remember preference
10. ✓ No console errors during language switch

**Record Result:**
- [ ] PASS - Arabic support works correctly
- [ ] FAIL - Issues: _______________

---

#### Test 7.2: Arabic Content Display
```
Time Limit: 5 minutes
Prerequisites: Switched to Arabic mode
```

**Tests to perform:**
1. ✓ Dashboard header in Arabic:
   - Greeting: "مرحبا [Name]" or similar
   - Labels in Arabic
2. ✓ Navigation items all in Arabic
3. ✓ Form labels in Arabic:
   - "عنوان المشروع" (Project Title)
   - "الميزانية" (Budget)
   - "الموعد النهائي" (Deadline)
4. ✓ Buttons in Arabic:
   - "حفظ" (Save)
   - "إلغاء" (Cancel)
   - "حذف" (Delete)
5. ✓ Status badges in Arabic:
   - "نشط" (Active)
   - "قيد التقدم" (In Progress)
6. ✓ Notifications in Arabic:
   - "تم الحفظ بنجاح" (Saved successfully)
   - "تم الحذف" (Deleted)
7. ✓ All headings in Arabic
8. ✓ Proper Arabic typography:
   - Text renders clearly
   - Diacritics (if any) display correctly
   - Font supports Arabic characters

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

### 8️⃣ ERROR HANDLING & EDGE CASES

#### Test 8.1: Form Validation
```
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ **Login form errors:**
   - Empty email: Error message
   - Invalid email format: Error message
   - Empty password: Error message
   - Wrong credentials: "Invalid email or password"

2. ✓ **Registration form errors:**
   - Empty name: Error
   - Invalid email: Error
   - Weak password: Error (if strength check)
   - Passwords don't match: Error
   - Terms not accepted: Cannot submit

3. ✓ **Project form errors:**
   - Empty title: Error
   - Budget min > max: Error
   - Past deadline: Error or warning
   - Empty description: Error (if required)

4. ✓ **Bid form errors:**
   - Empty bid amount: Error
   - Non-numeric amount: Error
   - Negative amount: Error or warning

5. ✓ All error messages:
   - Clear and helpful
   - In correct language (English or Arabic)
   - Associated with correct field

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 8.2: Empty States
```
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ **Dashboard with no projects:**
   - "You don't have any active projects" message
   - CTA button to create/browse projects
   - Icon or illustration
   - Clear and helpful

2. ✓ **Dashboard with no bids:**
   - "No active bids yet" message
   - "Browse projects" button
   - Link to `/auctions`

3. ✓ **Projects page with no search results:**
   - "No projects found" message
   - Suggestion to try different search/filters
   - Clear call-to-action

4. ✓ **Freelancers page with no results:**
   - Similar empty state
   - Filter/search suggestions

5. ✓ **Notifications page with no notifications:**
   - Empty message
   - Description of what notifications are

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 8.3: Loading States
```
Time Limit: 3 minutes
```

**Tests to perform:**
1. ✓ **Page loading:**
   - Spinner or skeleton screens visible
   - Loading text or progress indicator
   - Not stuck indefinitely
   - Clears when content loads

2. ✓ **Form submission:**
   - Button shows loading state (disabled, spinner)
   - Cannot double-submit
   - Clears when complete

3. ✓ **Data fetching:**
   - Loading indicator while fetching data
   - Content appears smoothly after loading
   - No abrupt transitions

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

### 9️⃣ PERFORMANCE TESTS

#### Test 9.1: Page Load Speed
```
Time Limit: 5 minutes
Method: DevTools → Network tab
```

**Tests to perform:**
1. ✓ Navigate to different pages and note load times:
   - Home page: _______ seconds
   - Dashboard: _______ seconds
   - Projects list: _______ seconds
   - Project details: _______ seconds
   - Freelancer profile: _______ seconds

2. ✓ All pages load within 3 seconds on good connection
3. ✓ No blank/white screen lasting >500ms
4. ✓ Content renders progressively (not all at once)
5. ✓ Images load after text/layout (progressive enhancement)

**Record Result:**
- [ ] PASS - Fast load times
- [ ] FAIL - Slow pages: _______________

---

#### Test 9.2: Animation Performance
```
Time Limit: 5 minutes
Method: DevTools → Performance tab → Record
```

**Tests to perform:**
1. ✓ Dashboard stat counters animate smoothly:
   - No stuttering/jank
   - Smooth from 0 to final value
   - Complete in ~2 seconds
2. ✓ Card hover effects smooth (no lag)
3. ✓ Modal transitions smooth (no jank)
4. ✓ Page scrolling smooth (60fps):
   - No frame drops
   - Smooth scrolling experience
5. ✓ FAB animations smooth
6. ✓ All transitions smooth (no abrupt changes)

**Record Result:**
- [ ] PASS - 60fps, smooth animations
- [ ] FAIL - Issues: _______________

---

### 🔟 SECURITY & ACCESSIBILITY

#### Test 10.1: Authentication & Authorization
```
Time Limit: 5 minutes
```

**Tests to perform:**
1. ✓ Cannot access `/dashboard/freelancer` without login:
   - Redirects to `/auth/login`
2. ✓ Cannot access `/dashboard/client` without login
3. ✓ Cannot access `/projects/create` without login
4. ✓ Logged-in freelancer cannot access business dashboard:
   - Either redirects or shows error
   - Cannot edit/delete other users' projects
5. ✓ Logged-in business owner cannot access freelancer dashboard
6. ✓ Cannot view other users' private data:
   - Bids, projects, messages, etc.
7. ✓ Session expires properly (if timeout set)
8. ✓ Logout clears authentication

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

#### Test 10.2: Keyboard Navigation
```
Time Limit: 5 minutes
Method: Navigate using only Tab and Enter keys (no mouse)
```

**Tests to perform:**
1. ✓ Tab through all interactive elements in order:
   - Navigation links
   - Buttons
   - Form inputs
   - Links
2. ✓ Tab order makes logical sense (left-to-right, top-to-bottom)
3. ✓ Focus indicator visible on all interactive elements
4. ✓ Can activate buttons with Enter key
5. ✓ Can submit forms with Enter key
6. ✓ Can close modals with Escape key
7. ✓ Links and buttons clearly distinguishable
8. ✓ Skip links if available (skip to main content)

**Record Result:**
- [ ] PASS - Full keyboard navigation works
- [ ] FAIL - Issues: _______________

---

#### Test 10.3: Color Contrast & Readability
```
Time Limit: 3 minutes
Method: Visual inspection + browser color contrast checker
```

**Tests to perform:**
1. ✓ Text contrast ratio meets WCAG AA (4.5:1 for normal text)
2. ✓ All buttons clearly visible
3. ✓ Error messages stand out (usually red or distinct color)
4. ✓ Status badges clear (can distinguish "Winning" from "Losing")
5. ✓ Links underlined or clearly styled (not just color)
6. ✓ Form labels associated with inputs
7. ✓ No information conveyed by color alone
   - Icons or text accompany colors

**Record Result:**
- [ ] PASS
- [ ] FAIL - Issues: _______________

---

## 📊 TEST SUMMARY

### Overall Results

| Category | Result |
|----------|--------|
| Marketing Pages | [ ] PASS [ ] FAIL |
| Authentication | [ ] PASS [ ] FAIL |
| Freelancer Dashboard | [ ] PASS [ ] FAIL |
| Business Dashboard | [ ] PASS [ ] FAIL |
| Project Management | [ ] PASS [ ] FAIL |
| Responsive Design | [ ] PASS [ ] FAIL |
| Arabic Support | [ ] PASS [ ] FAIL |
| Error Handling | [ ] PASS [ ] FAIL |
| Performance | [ ] PASS [ ] FAIL |
| Security | [ ] PASS [ ] FAIL |

### Critical Issues Found

**Issue #1:** _______________
- **Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low
- **Component:** _______________
- **Steps:** _______________
- **Expected:** _______________
- **Actual:** _______________
- **Screenshot:** [Attach if possible]

**Issue #2:** _______________

---

### Recommendations

1. **Must Fix (Critical):** _______________
2. **Should Fix (High):** _______________
3. **Nice to Have (Low):** _______________

---

**Test Date:** April 16, 2026  
**Tester Name:** _______________  
**Test Duration:** _______ hours  
**Build Tested:** NAFIS App v1.0  
**Overall Status:** [ ] PASS [ ] FAIL - Ready for Production: [ ] YES [ ] NO

---

**How to Use This Guide:**
1. Print this document or open in split-screen
2. Work through each test scenario in order
3. Check boxes as you complete tests
4. Note any failures or issues in detail
5. Take screenshots of any bugs
6. Fill out summary at end
7. Share results with development team

**Duration Estimate:** 2-3 hours for thorough testing of all scenarios
