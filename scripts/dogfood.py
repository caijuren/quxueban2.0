#!/usr/bin/env python3
"""Dogfood test for quxueban frontend."""
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
OUTPUT_DIR = Path(os.environ.get("OUTPUT_DIR", "/tmp/quxueban_dogfood"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = PROJECT_ROOT / ".env.local"
SERVER_COMMAND = ["node", str(PROJECT_ROOT / ".next" / "standalone" / "server.js")]

MARKETING_ROUTES = [
    ("home", "/"),
    ("plan", "/plan"),
    ("milestones", "/milestones"),
    ("progress", "/progress"),
    ("ai", "/ai"),
    ("login", "/login"),
    ("privacy", "/privacy"),
    ("terms", "/terms"),
]

DASHBOARD_ROUTES = [
    ("dashboard_home", "/dashboard"),
    ("dashboard_plan", "/dashboard/plan"),
    ("dashboard_weekly", "/dashboard/weekly"),
    ("dashboard_progress", "/dashboard/progress"),
    ("dashboard_milestones", "/dashboard/milestones"),
]

CONSOLE_ERRORS = []
CONSOLE_WARNINGS = []

# Known non-UI runtime warnings to report separately
KNOWN_RUNTIME_PATTERNS = [
    '[ChildrenContext] Failed to load data',
]


def load_env_file(path: Path) -> dict:
    """Load KEY=VALUE lines from a .env file into a dict."""
    env = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def wait_for_server(url: str, timeout: float = 30.0) -> bool:
    import urllib.request

    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2):
                return True
        except Exception:
            time.sleep(0.5)
    return False


def ensure_standalone_static():
    """Copy static assets into the standalone output so they are served correctly."""
    source = PROJECT_ROOT / ".next" / "static"
    target = PROJECT_ROOT / ".next" / "standalone" / ".next" / "static"
    if not source.exists():
        return
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(source, target)
    print(f"Copied static assets to {target}")


def ensure_standalone_bcrypt():
    """Copy bcrypt native prebuilds into the standalone output."""
    source = PROJECT_ROOT / "node_modules" / "bcrypt" / "prebuilds"
    target = (
        PROJECT_ROOT
        / ".next"
        / "standalone"
        / "node_modules"
        / ".pnpm"
        / "bcrypt@6.0.0"
        / "node_modules"
        / "bcrypt"
        / "prebuilds"
    )
    if not source.exists():
        return
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(source, target)
    print(f"Copied bcrypt prebuilds to {target}")


def start_server():
    """Start the standalone Next.js server if a server isn't already listening."""
    import urllib.request

    try:
        with urllib.request.urlopen(BASE_URL, timeout=2):
            print(f"Server already running at {BASE_URL}")
            return None
    except Exception:
        pass

    ensure_standalone_static()
    ensure_standalone_bcrypt()

    env = os.environ.copy()
    env.update(load_env_file(ENV_FILE))
    # Ensure NextAuth callbacks match the test base URL so login works correctly.
    env["NEXTAUTH_URL"] = BASE_URL
    # Derive port from BASE_URL so the standalone server listens on the same port.
    try:
        env["PORT"] = str(int(BASE_URL.split(":")[-1].split("/")[0]))
    except ValueError:
        env["PORT"] = "3000"
    print(f"Starting standalone server: {' '.join(SERVER_COMMAND)}")
    proc = subprocess.Popen(
        SERVER_COMMAND,
        cwd=str(PROJECT_ROOT),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    if not wait_for_server(BASE_URL, timeout=30):
        proc.terminate()
        raise RuntimeError("Server did not start in time")
    print(f"Server ready at {BASE_URL}")
    return proc


def stop_server(proc):
    if proc is None:
        return
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        proc.kill()


def scroll_to_bottom(page, step=500, delay=80):
    page.evaluate(
        """
        async ({ step, delay }) => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, step);
                    totalHeight += step;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, delay);
            });
        }
        """,
        {"step": step, "delay": delay},
    )
    page.wait_for_timeout(500)


def capture(page, name, full_page=True):
    path = OUTPUT_DIR / f"{name}.png"
    page.screenshot(path=str(path), full_page=full_page)
    print(f"  screenshot: {path}")


def route_console(msg):
    if msg.type == "error":
        text = msg.text
        # Ignore common non-actionable errors
        ignored = ["Failed to load resource", "net::ERR", "favicon"]
        if any(i in text for i in ignored):
            return
        if any(p in text for p in KNOWN_RUNTIME_PATTERNS):
            CONSOLE_WARNINGS.append(text)
            print(f"  console warning: {text}")
            return
        CONSOLE_ERRORS.append(text)
        print(f"  console error: {text}")


def test_marketing_pages(browser):
    print("\n[Marketing pages]")
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    page.on("console", route_console)

    for name, route in MARKETING_ROUTES:
        print(f"\n{route}")
        page.goto(f"{BASE_URL}{route}", wait_until="load")
        page.wait_for_timeout(600)
        scroll_to_bottom(page)
        capture(page, f"desktop_{name}")

    # Mobile viewport
    page.set_viewport_size({"width": 390, "height": 844})
    for name, route in [("home", "/"), ("plan", "/plan"), ("login", "/login")]:
        print(f"\nmobile {route}")
        page.goto(f"{BASE_URL}{route}", wait_until="load")
        page.wait_for_timeout(600)
        scroll_to_bottom(page, step=400, delay=100)
        capture(page, f"mobile_{name}")

    # Interactive: FAQ accordion
    print("\nFAQ interaction")
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(f"{BASE_URL}/", wait_until="load")
    page.wait_for_timeout(600)
    scroll_to_bottom(page)
    page.get_by_role("button", name="趣学伴适合几年级的孩子使用？").click()
    page.wait_for_timeout(400)
    capture(page, "desktop_home_faq_open")

    context.close()


def test_dashboard(browser):
    print("\n[Dashboard]")
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    page.on("console", route_console)

    print("\n/login")
    page.goto(f"{BASE_URL}/login", wait_until="load")
    page.wait_for_timeout(600)
    page.fill('input[type="text"]', "parent")
    page.fill('input[type="password"]', "parent123")
    page.click('button[type="submit"]')
    page.wait_for_url("**/dashboard**", timeout=10000)
    page.wait_for_timeout(1500)
    print("  logged in")

    for name, route in DASHBOARD_ROUTES:
        print(f"\n{route}")
        page.goto(f"{BASE_URL}{route}", wait_until="load")
        page.wait_for_timeout(1200)
        scroll_to_bottom(page)
        capture(page, f"desktop_{name}")

    context.close()


def main():
    print(f"Output directory: {OUTPUT_DIR}")
    proc = None
    try:
        proc = start_server()
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            test_marketing_pages(browser)
            test_dashboard(browser)
            browser.close()
    finally:
        stop_server(proc)

    if CONSOLE_WARNINGS:
        print(f"\n{len(CONSOLE_WARNINGS)} console warning(s) detected (non-UI runtime)")
        for err in CONSOLE_WARNINGS:
            print(f"  - {err}")

    if CONSOLE_ERRORS:
        print(f"\n{len(CONSOLE_ERRORS)} console error(s) detected")
        for err in CONSOLE_ERRORS:
            print(f"  - {err}")
        sys.exit(1)
    print("\nAll dogfood checks passed.")


if __name__ == "__main__":
    main()
