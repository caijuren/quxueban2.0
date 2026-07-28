from playwright.sync_api import sync_playwright

BASE = "http://localhost:3003"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(f"{BASE}/login")
    page.wait_for_selector("#username", timeout=15000)

    # Login as demo parent
    page.locator("#username").fill("parent")
    page.locator("#password").fill("parent123")
    page.locator('button[type="submit"]').click()
    try:
        page.wait_for_url("**/dashboard/**", wait_until="networkidle", timeout=10000)
    except Exception:
        page.screenshot(path="/tmp/login_failed.png", full_page=True)
        print("Current URL:", page.url)
        print("Page content:", page.content()[:2000])
        raise

    # Go to settings
    page.goto(f"{BASE}/dashboard/settings")
    page.wait_for_load_state("networkidle")

    # Read initial primary CSS variable
    initial_primary = page.evaluate('getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()')
    print(f"Initial primary color: {initial_primary}")

    # Open category dropdown and select appearance
    page.locator("#settings-category-dropdown").click()
    page.get_by_role("button", name="界面偏好").click()
    page.wait_for_timeout(500)

    # Select rose-pink theme
    page.locator("button:has-text('玫瑰粉')").click()
    page.wait_for_timeout(200)

    # Save
    page.locator("text=保存界面偏好").click()
    page.wait_for_timeout(800)

    # Read updated primary CSS variable
    updated_primary = page.evaluate('getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()')
    print(f"After rose-pink primary color: {updated_primary}")

    assert updated_primary.lower() == "#ec4899", f"Expected #ec4899, got {updated_primary}"

    # Refresh and verify persistence
    page.reload()
    page.wait_for_load_state("networkidle")
    page.locator("#settings-category-dropdown").click()
    page.get_by_role("button", name="界面偏好").click()
    page.wait_for_timeout(500)

    persisted_primary = page.evaluate('getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()')
    print(f"After refresh primary color: {persisted_primary}")
    assert persisted_primary.lower() == "#ec4899", f"Expected persisted #ec4899, got {persisted_primary}"

    # Switch back to dark-tech
    page.locator("button:has-text('暗黑科技')").click()
    page.locator("text=保存界面偏好").click()
    page.wait_for_timeout(800)

    final_primary = page.evaluate('getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()')
    print(f"After dark-tech primary color: {final_primary}")
    assert final_primary.lower() == "#ff2d6a", f"Expected #ff2d6a, got {final_primary}"

    print("Theme switch test passed!")
    browser.close()
