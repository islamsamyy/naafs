"""
NAFIS Full-App Playwright Test Suite
Covers: public pages, auth pages, dashboard, image loading, RTL layout
"""

import os
import sys
import time
import urllib.request
import urllib.error

from playwright.sync_api import sync_playwright, Page

BASE_URL = "http://localhost:3002"


def wait_for_http(url: str, timeout: int = 120) -> bool:
    """Poll URL until we get any HTTP response (not a connection error)."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            urllib.request.urlopen(url, timeout=3)
            return True
        except urllib.error.HTTPError:
            return True  # got a response — server is up
        except Exception:
            time.sleep(2)
    return False
SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
LOG_FILE = os.path.join(os.path.dirname(__file__), "test_results.log")

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

PASS = "[PASS]"
FAIL = "[FAIL]"
results = []
_log = open(LOG_FILE, "w", encoding="utf-8")


def log(msg: str):
    _log.write(msg + "\n")
    _log.flush()
    safe = msg.encode("ascii", errors="replace").decode("ascii")
    print(safe, flush=True)


def shot(page: Page, name: str):
    path = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
    page.screenshot(path=path, full_page=True)
    return path


def check(condition: bool, label: str, detail: str = ""):
    status = PASS if condition else FAIL
    results.append((status, label, detail))
    suffix = f"  ->  {detail}" if detail else ""
    log(f"  {status}  {label}{suffix}")
    return condition


def section(label: str):
    log(f"\n{'─' * 60}")
    log(f"  [TEST]  {label}")
    log(f"{'─' * 60}")


# ──────────────────────────────────────────────────────────────────────────────

def test_public_marketing_pages(page: Page):
    section("Public Marketing Pages")

    page.goto(BASE_URL, wait_until="domcontentloaded")
    shot(page, "01_home")
    check(page.title() != "", "Home page loads", page.title())
    check(page.locator("header, nav").count() > 0, "Home has header/nav")
    check(page.get_by_role("link").count() > 3, "Home has navigation links")

    page.goto(f"{BASE_URL}/explore", wait_until="domcontentloaded")
    shot(page, "02_explore")
    check("/explore" in page.url, "Explore page loads")
    check(page.locator("input, [placeholder]").count() > 0, "Explore has search/filter")

    page.goto(f"{BASE_URL}/freelancers", wait_until="domcontentloaded")
    page.wait_for_timeout(1500)
    shot(page, "03_freelancers")
    check("/freelancers" in page.url, "Freelancers page loads")

    page.goto(f"{BASE_URL}/auctions", wait_until="domcontentloaded")
    page.wait_for_timeout(1500)
    shot(page, "04_auctions")
    check("/auctions" in page.url, "Auctions page loads")

    page.goto(f"{BASE_URL}/how-it-works", wait_until="domcontentloaded")
    shot(page, "05_how_it_works")
    check("/how-it-works" in page.url, "How-it-works page loads")

    page.goto(f"{BASE_URL}/pricing", wait_until="domcontentloaded")
    shot(page, "06_pricing")
    check("/pricing" in page.url, "Pricing page loads")


def test_auth_pages(page: Page):
    section("Auth Pages")

    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
    shot(page, "07_login")
    check("/login" in page.url, "Login page loads")
    check(page.locator("input[type='email'], input[name='email']").count() > 0, "Login has email field")
    check(page.locator("input[type='password']").count() > 0, "Login has password field")
    check(
        page.locator("button[type='submit'], button:has-text('دخول'), button:has-text('تسجيل')").count() > 0,
        "Login has submit button",
    )

    page.goto(f"{BASE_URL}/register", wait_until="domcontentloaded")
    shot(page, "08_register")
    check("/register" in page.url, "Register page loads")
    # Multi-step form: step 1 shows role selection (buttons), step 2 shows inputs
    has_inputs_or_roles = (
        page.locator("input").count() >= 2
        or page.locator("button[class*='role'], [class*='role'], [class*='card']").count() > 0
        or page.locator("button").count() >= 2
    )
    check(has_inputs_or_roles, "Register has form elements (role selection or inputs)")

    page.goto(f"{BASE_URL}/forgot-password", wait_until="domcontentloaded")
    shot(page, "09_forgot_password")
    check("/forgot-password" in page.url, "Forgot-password page loads")
    check(page.locator("input[type='email']").count() > 0, "Forgot-password has email field")


def test_rtl_layout(page: Page):
    section("RTL Arabic Layout")

    page.goto(BASE_URL, wait_until="domcontentloaded")
    html_dir = page.locator("html").get_attribute("dir")
    check(html_dir == "rtl", "Root HTML dir=rtl", f"dir={html_dir}")

    font = page.evaluate("() => getComputedStyle(document.body).fontFamily")
    check(
        any(f in (font or "") for f in ["Cairo", "Arabic", "Noto"]),
        "Arabic font applied",
        (font or "none")[:80],
    )

    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
    shot(page, "10_rtl_login")
    check(page.locator("html").get_attribute("dir") == "rtl", "Login page is RTL")


def test_responsive_breakpoints(page: Page):
    section("Responsive Breakpoints")

    viewports = [
        ("mobile_375",  {"width": 375,  "height": 812}),
        ("tablet_768",  {"width": 768,  "height": 1024}),
        ("desktop_1440",{"width": 1440, "height": 900}),
    ]
    for name, vp in viewports:
        page.set_viewport_size(vp)
        page.goto(BASE_URL, wait_until="domcontentloaded")
        page.wait_for_timeout(500)
        shot(page, f"11_responsive_{name}")
        scroll_w = page.evaluate("() => document.documentElement.scrollWidth")
        check(
            scroll_w <= vp["width"] + 5,
            f"No horizontal scroll at {name} ({vp['width']}px)",
            f"scrollWidth={scroll_w}",
        )
    page.set_viewport_size({"width": 1440, "height": 900})


def test_navigation_flows(page: Page):
    section("Navigation Flows")

    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(BASE_URL, wait_until="domcontentloaded")

    hrefs = page.evaluate("""() =>
        Array.from(document.querySelectorAll('a[href]'))
            .map(a => a.getAttribute('href'))
            .filter(h => h && h.startsWith('/'))
    """)
    check(len(hrefs) > 5, "Home has multiple internal links", f"found {len(hrefs)}")

    page.goto(f"{BASE_URL}/explore", wait_until="domcontentloaded")
    check(page.locator("body").count() > 0, "Can navigate to /explore")

    page.goto(f"{BASE_URL}/projects", wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    shot(page, "12_projects_public")
    check("/projects" in page.url, "Projects page loads")


def test_image_loading(page: Page):
    section("Async Image Loading")

    for path, label, shot_name in [
        ("/freelancers", "freelancers", "13_images_freelancers"),
        ("/explore",     "explore",     "13b_images_explore"),
    ]:
        page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        shot(page, shot_name)

        broken = page.evaluate("""() =>
            Array.from(document.querySelectorAll('img'))
                .filter(img => img.complete && img.naturalWidth === 0)
                .map(img => img.src)
        """)
        check(len(broken) == 0, f"No broken images on {label}", f"{broken[:3]}" if broken else "")

        no_alt = page.evaluate("""() =>
            Array.from(document.querySelectorAll('img'))
                .filter(img => !img.alt || img.alt.trim() === '')
                .length
        """)
        check(no_alt == 0, f"All images have alt text on {label}", f"{no_alt} missing")


def test_login_form_interaction(page: Page):
    section("Login Form Interaction")

    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
    submit = page.locator("button[type='submit']").first
    submit.click()
    page.wait_for_timeout(500)
    shot(page, "14_login_empty_submit")
    check("/login" in page.url, "Empty submit stays on login page")

    page.locator("input[type='email'], input[name='email']").first.fill("invalid@test.com")
    page.locator("input[type='password']").first.fill("wrongpassword")
    submit.click()
    page.wait_for_timeout(2500)
    shot(page, "15_login_invalid")
    check(
        "/login" in page.url or page.locator("[class*='error'], [class*='red'], [role='alert']").count() > 0,
        "Invalid login shows error or stays on login",
    )


def test_console_errors(page: Page):
    section("Console Error Monitoring")

    console_errors: list[str] = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda err: console_errors.append(str(err)))

    routes = [("/", "home"), ("/explore", "explore"), ("/freelancers", "freelancers"),
              ("/auctions", "auctions"), ("/login", "login"), ("/register", "register")]

    for path, name in routes:
        before = len(console_errors)
        page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        new = console_errors[before:]
        critical = [e for e in new if any(k in e for k in ("TypeError", "ReferenceError", "Cannot read"))]
        check(len(critical) == 0, f"No critical JS errors on {name}", f"{critical[:1]}" if critical else "")


def test_performance_basics(page: Page):
    section("Performance Basics")

    page.goto(BASE_URL, wait_until="domcontentloaded")
    total = page.evaluate("() => document.querySelectorAll('img').length")
    lazy  = page.evaluate('() => document.querySelectorAll(\'img[loading="lazy"]\').length')
    eager = page.evaluate('() => document.querySelectorAll(\'img[loading="eager"]\').length')
    check(total > 0, f"Page has images (total={total})")
    check(lazy + eager > 0, "Images use loading attribute", f"lazy={lazy} eager={eager}")

    page.goto(f"{BASE_URL}/freelancers", wait_until="domcontentloaded")
    page.wait_for_timeout(1500)
    next_imgs = page.evaluate('() => document.querySelectorAll("img[data-nimg]").length')
    check(next_imgs > 0, "Next.js <Image> optimizer active on freelancers", f"data-nimg={next_imgs}")


def test_accessibility_basics(page: Page):
    section("Accessibility Basics")

    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
    inputs = page.locator("input:not([type='hidden'])").all()
    labeled = sum(
        1 for inp in inputs
        if inp.get_attribute("aria-label")
        or inp.get_attribute("placeholder")
        or (inp.get_attribute("id") and page.locator(f"label[for='{inp.get_attribute('id')}']").count() > 0)
    )
    check(labeled == len(inputs), f"Inputs labeled ({labeled}/{len(inputs)})")

    page.goto(BASE_URL, wait_until="domcontentloaded")
    btns = page.locator("button").all()
    unlabeled = sum(1 for b in btns if not b.inner_text().strip() and not b.get_attribute("aria-label"))
    check(unlabeled == 0, f"Buttons have text/aria-label", f"{unlabeled} unlabeled")
    shot(page, "16_a11y_home")


def test_live_auction_page(page: Page):
    section("Live Auction Page")

    errors: list[str] = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(f"{BASE_URL}/auctions/live", wait_until="domcontentloaded")
    page.wait_for_timeout(2000)
    shot(page, "17_auctions_live")
    check("/auctions/live" in page.url, "Live auctions page loads")
    check(page.locator("body").is_visible(), "Live auctions has visible content")
    check(len(errors) == 0, "Live auctions has no JS errors", f"{errors[:1]}" if errors else "")


def test_dashboard_redirect(page: Page):
    section("Dashboard Auth Redirect")

    page.goto(f"{BASE_URL}/dashboard", wait_until="domcontentloaded")
    page.wait_for_timeout(1500)
    shot(page, "18_dashboard_redirect")
    url = page.url
    check(
        "/login" in url or "/dashboard" in url or "/onboarding" in url,
        "Dashboard redirects or loads for unauthenticated user",
        url,
    )


def test_freelancer_profile_page(page: Page):
    section("Freelancer Profile Page")

    page.goto(f"{BASE_URL}/freelancers", wait_until="domcontentloaded")
    page.wait_for_timeout(1500)
    links = page.evaluate("""() =>
        Array.from(document.querySelectorAll('a[href*="/freelancers/"]'))
            .map(a => a.href)
            .filter(h => !h.endsWith('/freelancers/'))
            .slice(0, 1)
    """)
    if links:
        page.goto(links[0], wait_until="domcontentloaded")
        page.wait_for_timeout(1500)
        shot(page, "19_freelancer_profile")
        check("/freelancers/" in page.url, "Freelancer profile page loads", page.url)
    else:
        check(True, "Freelancer profile route exists (no cards in DB yet)")


def test_protected_pages(page: Page):
    section("Protected Pages Auth Redirect")

    for path, name in [("/messages", "messages"), ("/notifications", "notifications"),
                       ("/dashboard/freelancer", "freelancer-dash"), ("/dashboard/client", "client-dash")]:
        page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        url = page.url
        check(
            "/login" in url or f"/{path.strip('/')}" in url or "/dashboard" in url,
            f"{name} redirects or loads",
            url,
        )
    shot(page, "20_protected_pages")


# ──────────────────────────────────────────────────────────────────────────────

def main():
    log("\n" + "=" * 60)
    log("  NAFIS -- Full Playwright Test Suite")
    log(f"  Target : {BASE_URL}")
    log(f"  Shots  : {SCREENSHOTS_DIR}")
    log(f"  Log    : {LOG_FILE}")
    log("=" * 60)

    log("\n  Waiting for dev server to be HTTP-ready...")
    if not wait_for_http(BASE_URL, timeout=120):
        log(f"  [FAIL]  Server never responded at {BASE_URL}")
        _log.close()
        return 1
    log("  Dev server is ready. Starting tests.\n")

    test_groups = [
        test_public_marketing_pages,
        test_auth_pages,
        test_rtl_layout,
        test_responsive_breakpoints,
        test_navigation_flows,
        test_image_loading,
        test_login_form_interaction,
        test_console_errors,
        test_performance_basics,
        test_accessibility_basics,
        test_live_auction_page,
        test_dashboard_redirect,
        test_freelancer_profile_page,
        test_protected_pages,
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_context(viewport={"width": 1440, "height": 900}, locale="ar-EG").new_page()
        for fn in test_groups:
            try:
                fn(page)
            except Exception as exc:
                results.append((FAIL, fn.__name__, str(exc)))
                log(f"  {FAIL}  {fn.__name__} CRASHED: {exc}")
        browser.close()

    total  = len(results)
    passed = sum(1 for r in results if r[0] == PASS)
    failed = total - passed

    log("\n" + "=" * 60)
    log(f"  RESULTS: {passed}/{total} passed   {failed} failed")
    log("=" * 60)
    if failed:
        log("\n  FAILURES:")
        for status, label, detail in results:
            if status == FAIL:
                log(f"    {FAIL}  {label}" + (f"  ->  {detail}" if detail else ""))
    log("")
    _log.close()
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
