# NAFIS Dashboard User Guide

## Overview

Both dashboards (Freelancer & Business Owner) are now fully functional with interactive features, real-time data, and edit capabilities.

---

## 🎯 Freelancer Dashboard (`/dashboard/freelancer`)

### Features

#### 1. **Real-time Stats Section**
- **إجمالي الأرباح** (Total Earnings): Animated counter showing earnings from completed projects
- **العروض النشطة** (Active Bids): Count of pending bids you've submitted
- **المشاريع المكتملة** (Completed Projects): Total number of finished projects
- **التقييم العام** (Overall Rating): Your average rating from client reviews

**Interactive:** Hover over stat cards to see smooth scale animations and color transitions.

#### 2. **Active Projects Section (Main)**
Displays all in-progress projects where you're the assigned freelancer.

**Features:**
- Project title and status badge
- Client name
- Progress bar with percentage (color changes based on progress: orange < 40%, blue 40-70%, green > 70%)
- Budget information
- Delivery deadline

**Edit Functionality:**
- Hover over a project card to reveal the **Edit** button
- Click to view project details in a modal (view-only currently)
- See milestone progress and completion percentage

#### 3. **Active Bids Sidebar**
Shows all your pending bids for available projects.

**Information Display:**
- Project title
- Your bid amount
- Highest bid on the project
- Status badge: "أنت في المقدمة" (Winning) or "توجد منافسة قوية" (Strong Competition)

**Edit/Delete Functionality:**
- Hover over any bid to reveal **Edit** and **Delete** buttons
- **Edit:** Opens modal to adjust:
  - Bid amount
  - Proposal message
- **Delete:** Removes your bid (with confirmation)
- **View Project:** Navigate to full project details

#### 4. **Floating Action Button (Mobile)**
- Quick access to browse projects
- Appears on mobile screens
- Positioned at bottom-left

#### 5. **Floating Notifications**
- Real-time alerts for:
  - Bid updates
  - Project modifications
  - System messages
- Auto-dismiss after 3-5 seconds
- Positioned at bottom-right
- Supports action buttons

---

## 👔 Business Owner Dashboard (`/dashboard/client`)

### Features

#### 1. **Real-time Stats Section**
- **إجمالي الميزانيات** (Total Budget Spent): Animated counter for all active projects
- **المناقصات الجارية** (Active Auctions): Count of open/in-progress projects
- **المشاريع المكتملة** (Completed Projects): Total finished projects
- **موجز العمليات المباشر** (Live Operations Summary): Real-time activity feed with animated progress bar

**Interactive:** Stats cards have hover effects with color transitions and icon scaling.

#### 2. **Active Projects Section (Main)**
List of all your posted projects with real-time bid information.

**Project Card Shows:**
- Project title with status badge (Active/In Progress)
- Budget range (min - max)
- Number of bids received
- Days remaining
- Highest bid amount

**Edit/Delete Functionality:**
- Hover to reveal **Edit** and **Delete** buttons
- **Edit:** Open modal to modify:
  - Project title
  - Description
  - Budget (min & max)
  - Delivery deadline
- **Delete:** Remove project permanently (with option to delete related bids)
- Navigation arrow to view full project details

#### 3. **Featured Experts Section (Sidebar)**
Browse top-rated freelancers for future projects.

**Main Expert Card:**
- Profile picture with certification badge
- Name and title
- Rating (stars)
- Project count
- "View Full Profile" button

**Mini Expert Cards:**
- Quick preview of other skilled freelancers
- Name, title, and rating
- Click to view profile

#### 4. **Quick Actions**
- "Add New Project" button in header
- "Add New Project" ghost card at bottom of projects list
- Smart matching suggestion panel

#### 5. **Floating Elements**
- **FAB (Floating Action Button):** Quick "Add Project" access
- **Floating Notifications:** Real-time updates on bids, project changes, and system messages

---

## 📋 Common Workflows

### Freelancer: Submitting & Managing Bids

1. **Find Project**
   - Navigate to `/auctions`
   - Browse available projects

2. **Submit Bid**
   - Enter bid amount
   - Add proposal message
   - Submit

3. **Monitor Bids**
   - Go to `/dashboard/freelancer`
   - View all active bids in sidebar
   - Track winning/losing status

4. **Edit Bid**
   - Hover over bid in dashboard
   - Click Edit button
   - Adjust amount or message
   - Click "حفظ التغييرات" (Save Changes)

5. **Track Progress**
   - View active projects in main section
   - Monitor milestone completion
   - Check deadline

### Business Owner: Managing Projects

1. **Create Project**
   - Click "إطلاق مشروع جديد" (Launch New Project) button
   - Fill in project details
   - Set budget and deadline
   - Publish

2. **Review Bids**
   - Go to project detail page
   - Compare freelancer proposals
   - Accept best bid

3. **Edit Project**
   - Go to `/dashboard/client`
   - Hover over project card
   - Click Edit button
   - Modify details
   - Save changes

4. **Monitor Progress**
   - View project in dashboard
   - Track freelancer's milestone completion
   - See payment/escrow status

5. **Complete Project**
   - Review deliverables
   - Approve and release payment
   - Leave review for freelancer

---

## 🎨 UI/UX Features

### Animations & Interactions
- **Stat Counters:** Numbers animate from 0 to final value (1.5-2 seconds)
- **Hover Effects:** Cards lift up and shadows expand on hover
- **Progress Bars:** Smooth gradient transitions based on completion
- **Button Reveals:** Edit/Delete buttons slide in on hover
- **Notifications:** Slide up with fade-in animation

### Responsive Design
- Fully responsive for mobile, tablet, and desktop
- Touch-friendly buttons and spacing
- Floating buttons adjust position on mobile
- Grid layouts adapt to screen size

### Accessibility
- RTL (Right-to-Left) support for Arabic
- High contrast colors for readability
- Keyboard navigation support
- Clear status indicators and icons

---

## 🔧 Modal Dialogs

### Edit Bid Modal (Freelancer)
- Disabled: Project name (read-only)
- Editable:
  - Bid amount
  - Proposal message
- Action buttons: Cancel / Save Changes

### Edit Project Modal (Business Owner)
- Editable fields:
  - Project title
  - Description
  - Min budget
  - Max budget
  - Delivery deadline
- Action buttons: Cancel / Save Changes

### Project Details Modal (Freelancer)
- Read-only view of:
  - Project name
  - Description
  - Budget amount
  - Delivery date
  - Progress bar with percentage
- Action buttons: Close / View Full Details

---

## 🔔 Notification Types

| Type | Color | Purpose |
|------|-------|---------|
| `bid` | Teal | Bid-related updates |
| `message` | Teal | New messages |
| `project_update` | Green | Project changes |
| `alert` | Red | Errors or warnings |

---

## 📱 Mobile-First Features

- **Floating Action Button:** Visible only on mobile
- **Touch Targets:** Larger buttons and spacing
- **Simplified Views:** Stacked layouts on small screens
- **Quick Actions:** Common actions accessible via FAB

---

## ⚙️ Technical Stack

- **Frontend:** Next.js 16 (React) with App Router
- **Database:** Supabase PostgreSQL
- **Real-time:** Supabase subscriptions
- **Styling:** TailwindCSS with custom animations
- **Icons:** Lucide React
- **Authentication:** Supabase Auth with middleware protection

---

## 🚀 Performance Optimizations

- Animated counters use `requestAnimationFrame` (no external libraries)
- CSS-based animations for smooth 60fps performance
- Lazy loading of project images
- Optimized re-renders with React hooks
- Database queries optimized with Supabase

---

## 🆘 Troubleshooting

### Bids/Projects Not Showing
- **Solution:** Clear browser cache, refresh page
- **Check:** Ensure you're logged in as correct role (freelancer/business_owner)

### Notifications Not Appearing
- **Solution:** Check browser notification settings
- **Check:** Ensure floating notification panel is visible (bottom-right)

### Edit Modal Not Opening
- **Solution:** Try refreshing page
- **Check:** Browser console for errors

### Stats Not Updating
- **Solution:** Data refreshes on page load. Refresh browser.
- **Future:** Real-time updates coming soon with Supabase subscriptions

---

## 📞 Support

For issues or feature requests, contact support or report via GitHub issues.

---

**Last Updated:** April 16, 2026  
**Version:** 1.0 - Full Dashboard Implementation
