# ⚡ QUICK UI/UX TEST CHECKLIST - 30 MINUTES

**Fast-track testing for critical features**  
**Duration:** ~30 minutes  
**Dev Server:** http://localhost:3001

---

## 🚀 QUICK START (5 minutes)

```bash
# Terminal 1: Start dev server
cd /d/nafs/nafis-app
npm run dev

# Terminal 2: Open in browser
# http://localhost:3001
```

---

## 🧪 CRITICAL TEST FLOW (25 minutes)

### 1. HOME PAGE & NAVIGATION (2 minutes)
- [ ] Load http://localhost:3001
- [ ] Page displays without errors
- [ ] Navigation visible in header
- [ ] Language toggle works (click العربية and back)
- [ ] No console errors (F12 → Console)

**Status:** ✓ PASS / ✗ FAIL

---

### 2. REGISTRATION & LOGIN (5 minutes)

**Register:**
- [ ] Click "Sign Up" in header
- [ ] Fill registration form
  - Name: "Test User"
  - Email: "testuser[RANDOM]@test.com" (use unique email)
  - Password: "Test123!@"
  - Role: Select "Freelancer"
  - Accept terms
- [ ] Submit form succeeds
- [ ] Notification appears
- [ ] Redirects to login or dashboard

**Login:**
- [ ] Go to `/auth/login`
- [ ] Enter registered email and password
- [ ] Click Login
- [ ] Redirects to `/dashboard/freelancer` (for freelancer role)
- [ ] Dashboard shows name in header

**Status:** ✓ PASS / ✗ FAIL

---

### 3. FREELANCER DASHBOARD (5 minutes)

- [ ] Page loads at `/dashboard/freelancer`
- [ ] Header shows your name
- [ ] Stats section displays 4 animated counters
  - Counters animate smoothly from 0 to value
  - Hover effect works on cards
- [ ] Active Projects section displays (or empty state)
- [ ] Active Bids section displays (or empty state)
  - Hover over bid to reveal Edit/Delete buttons
- [ ] FAB button visible (bottom-right)
- [ ] No console errors

**If you have bids, test edit:**
- [ ] Hover over a bid card
- [ ] Click Edit button
- [ ] Modal opens with form
- [ ] Change bid amount (e.g., 500 → 750)
- [ ] Click Save
- [ ] Success notification appears
- [ ] Modal closes
- [ ] Bid amount updated in card

**If you have bids, test delete:**
- [ ] Hover over another bid
- [ ] Click Delete button
- [ ] Confirmation dialog appears
- [ ] Click Confirm
- [ ] Bid removed from list
- [ ] Success notification appears

**Status:** ✓ PASS / ✗ FAIL

---

### 4. CREATE PROJECT (5 minutes)

- [ ] Click FAB or "Add Project" button on dashboard
- [ ] Navigate to `/projects/create`
- [ ] Form displays with fields:
  - [ ] Title input
  - [ ] Description textarea
  - [ ] Category dropdown
  - [ ] Budget Min input
  - [ ] Budget Max input
  - [ ] Deadline date picker
- [ ] Fill form:
  - Title: "Mobile App Development"
  - Description: "I need a React Native app"
  - Category: Select any
  - Budget: $1000 - $5000
  - Deadline: Pick future date
- [ ] Try submitting with invalid data:
  - [ ] Empty title → Error appears
  - [ ] Min > Max → Error appears
  - [ ] Past deadline → Error appears
- [ ] Fill valid data and submit
- [ ] Loading indicator appears
- [ ] Success notification
- [ ] Project created and visible on dashboard or in list

**Status:** ✓ PASS / ✗ FAIL

---

### 5. BUSINESS DASHBOARD (3 minutes)

**Setup:** Register as "Business Owner" role instead

- [ ] Login as business owner
- [ ] Redirects to `/dashboard/client`
- [ ] Header shows business name
- [ ] Stats animated counters visible
- [ ] Projects section shows list (or empty)
- [ ] Featured Experts section visible
- [ ] FAB button visible

**If you created a project:**
- [ ] Project card displays with title, budget, bid count
- [ ] Hover reveals Edit/Delete buttons
- [ ] Edit: Change title and save (verify persists on refresh)
- [ ] Delete: Confirm deletion, project removed

**Status:** ✓ PASS / ✗ FAIL

---

### 6. RESPONSIVE DESIGN (3 minutes)

- [ ] Open DevTools (F12)
- [ ] Click toggle device toolbar (mobile icon or Ctrl+Shift+M)
- [ ] Select iPhone 12 (375x812)
  - [ ] Layout stacks in 1 column
  - [ ] Navigation collapses to hamburger
  - [ ] Buttons are tappable (large enough)
  - [ ] No horizontal scrolling
  - [ ] FAB visible in corner
  - [ ] Page scrolls smoothly
- [ ] Resize to tablet (768x1024)
  - [ ] 2 columns layout
  - [ ] Still readable
- [ ] Uncheck device toolbar (return to desktop)
  - [ ] Multi-column layout
  - [ ] Full width buttons visible

**Status:** ✓ PASS / ✗ FAIL

---

### 7. ARABIC SUPPORT (2 minutes)

- [ ] Click language toggle to "العربية"
- [ ] Page direction changes to RTL
- [ ] All text displays in Arabic
- [ ] Navigation flows right-to-left
- [ ] Form labels in Arabic
- [ ] Toggle back to English
- [ ] Page direction changes back to LTR
- [ ] All text in English

**Status:** ✓ PASS / ✗ FAIL

---

### 8. LOGOUT (1 minute)

- [ ] Find logout button (usually in header or user menu)
- [ ] Click Logout
- [ ] Redirects to home page
- [ ] Try accessing `/dashboard/freelancer`
- [ ] Redirected to login page

**Status:** ✓ PASS / ✗ FAIL

---

## 📊 RESULTS SUMMARY

| Test | Result | Notes |
|------|--------|-------|
| Home & Navigation | ✓/✗ | |
| Registration & Login | ✓/✗ | |
| Freelancer Dashboard | ✓/✗ | |
| Create Project | ✓/✗ | |
| Business Dashboard | ✓/✗ | |
| Responsive Design | ✓/✗ | |
| Arabic Support | ✓/✗ | |
| Logout | ✓/✗ | |
| **OVERALL** | ✓/✗ | |

---

## 🎯 CRITICAL ISSUES ONLY

(Record only if failing critical functionality)

### Issue #1
- **Component:** _______________
- **Error:** _______________
- **Expected:** _______________
- **Actual:** _______________

### Issue #2
- **Component:** _______________
- **Error:** _______________

---

## ✅ FINAL VERDICT

- [ ] **ALL TESTS PASSED** → Ready for production
- [ ] **SOME TESTS FAILED** → Fix issues before deploying
- [ ] **CRITICAL FAILURE** → Do not deploy

---

**Tester:** _______________  
**Date:** April 16, 2026  
**Time Spent:** _______ minutes  
**Recommendation:** _______________

---

## 📋 TESTING NOTES

Write any observations, bugs, or issues found:

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

---

## 🔗 REFERENCE LINKS

- **Full Testing Guide:** `UI_UX_TESTING_GUIDE.md`
- **Comprehensive Report:** `UI_UX_TEST_REPORT.md`
- **Dev Server:** http://localhost:3001
- **GitHub Issues:** [Your repo link]

---

**Duration:** 30 minutes
**Complexity:** Beginner-friendly
**Requirement:** Access to dev server only
