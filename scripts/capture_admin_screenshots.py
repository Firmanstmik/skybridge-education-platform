#!/usr/bin/env python3
"""Capture admin UI screenshots from production for the user manual."""

import base64
import json
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import TimeoutError as PlaywrightTimeout
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "manual-assets"
SCREENSHOTS = ASSETS / "screenshots"
LOGO_SRC = ROOT / "client" / "src" / "assets" / "img" / "SKYBRIDGE_LOGO.webp"
LOGO_PNG = ASSETS / "logo.png"
BASE_URL = os.environ.get("MANUAL_BASE_URL", "https://www.snischool.com")
TOKEN = os.environ.get("ADMIN_SCREENSHOT_TOKEN", "")
USERNAME = os.environ.get("ADMIN_SCREENSHOT_USER", "")
PASSWORD = os.environ.get("ADMIN_SCREENSHOT_PASS", "")

VIEWPORT = {"width": 1440, "height": 900}


def ensure_dirs():
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)


def export_logo():
    if not LOGO_SRC.exists():
        raise FileNotFoundError(f"Logo not found: {LOGO_SRC}")
    img = Image.open(LOGO_SRC).convert("RGBA")
    img.save(LOGO_PNG, "PNG")
    print(f"Logo exported: {LOGO_PNG}")


def fetch_token_from_vps():
    cmd = [
        "ssh",
        "root@snischool.com",
        "cd /var/www/skybridge-education-platform && node scripts/gen_screenshot_token.js admin.rama > /tmp/skybridge_manual.token 2>/dev/null",
    ]
    result = subprocess.run(cmd, capture_output=True, check=False)
    if result.returncode != 0:
        stderr = (result.stderr or b"").decode("utf-8", errors="ignore")
        raise RuntimeError(f"Failed to generate screenshot token from VPS: {stderr.strip()}")

    token_path = ROOT / "docs" / "manual-assets" / ".screenshot-token.tmp"
    scp = subprocess.run(
        ["scp", "root@snischool.com:/tmp/skybridge_manual.token", str(token_path)],
        capture_output=True,
        check=False,
    )
    if scp.returncode != 0 or not token_path.exists():
        raise RuntimeError("Failed to download screenshot token from VPS.")

    token = token_path.read_text(encoding="utf-8", errors="ignore").strip()
    token_path.unlink(missing_ok=True)
    for line in token.splitlines():
        line = line.strip()
        if line.count(".") == 2 and len(line) > 80:
            return line
    if token.count(".") == 2 and len(token) > 80:
        return token
    raise RuntimeError("Invalid screenshot token format.")


def parse_token_payload(token):
    payload_part = token.split(".")[1]
    padding = "=" * (-len(payload_part) % 4)
    decoded = base64.urlsafe_b64decode(payload_part + padding)
    return json.loads(decoded.decode("utf-8"))


def inject_session(page, token):
    payload = parse_token_payload(token)
    role = str(payload.get("role", "SUPER_ADMIN")).upper()
    if role == "SUPERADMIN":
        role = "SUPER_ADMIN"
    user_id = str(payload.get("id"))
    sessions = {
        user_id: {
            "token": token,
            "role": role,
            "userId": payload.get("id"),
            "username": payload.get("username"),
            "updatedAt": int(__import__("time").time() * 1000),
        }
    }
    role_index = {role: user_id}
    page.goto(f"{BASE_URL}/admin/login", wait_until="domcontentloaded")
    page.evaluate(
        """([sessions, roleIndex]) => {
            localStorage.setItem('skybridge_admin_sessions', JSON.stringify(sessions));
            localStorage.setItem('skybridge_admin_role_index', JSON.stringify(roleIndex));
            localStorage.removeItem('token');
        }""",
        [sessions, role_index],
    )


def shot(page, name, full_page=False):
    path = SCREENSHOTS / name
    page.screenshot(path=str(path), full_page=full_page)
    print(f"Saved: {path.name}")


def wait(page, ms=900):
    page.wait_for_timeout(ms)


def blur_password_field(image_path):
    img = Image.open(image_path).convert("RGB")
    w, h = img.size
    left = int(w * 0.54)
    top = int(h * 0.58)
    right = int(w * 0.92)
    bottom = int(h * 0.66)
    region = img.crop((left, top, right, bottom))
    region = region.resize((max(1, (right - left) // 12), max(1, (bottom - top) // 12)), Image.Resampling.BILINEAR)
    region = region.resize((right - left, bottom - top), Image.Resampling.NEAREST)
    img.paste(region, (left, top))
    img.save(image_path, "PNG")


def click_tab(page, label):
    button = page.locator(f'button:has-text("{label}")').first
    button.scroll_into_view_if_needed()
    button.click(timeout=10000)
    wait(page)


def capture_login_screens(page):
    page.goto(f"{BASE_URL}/admin/login", wait_until="networkidle")
    wait(page, 1200)
    shot(page, "01-login.png")

    page.fill('input[type="text"]', USERNAME or "admin.rama")
    wait(page, 300)
    shot(page, "02-login-filled.png")
    blur_password_field(SCREENSHOTS / "02-login-filled.png")


def capture_authenticated(page):
    page.goto(f"{BASE_URL}/admin/dashboard", wait_until="networkidle")
    page.wait_for_selector("text=Dashboard", timeout=25000)
    wait(page, 1500)
    shot(page, "03-dashboard.png", full_page=False)

    page.set_viewport_size({"width": 1440, "height": 1200})
    wait(page, 500)
    shot(page, "04-dashboard-sidebar.png", full_page=False)
    page.set_viewport_size(VIEWPORT)

    page.goto(f"{BASE_URL}/admin/content", wait_until="networkidle")
    page.wait_for_selector("text=Kelola Konten Halaman dan Blog", timeout=25000)
    wait(page, 1000)
    click_tab(page, "Halaman Program")
    wait(page, 600)
    shot(page, "05-cms-program.png", full_page=True)

    click_tab(page, "Pembayaran")
    page.wait_for_selector("text=Informasi Pembayaran", timeout=20000)
    wait(page, 800)
    shot(page, "06-cms-payment.png", full_page=True)

    page.goto(f"{BASE_URL}/admin/students", wait_until="networkidle")
    page.wait_for_selector("text=Data Pendaftar", timeout=25000)
    wait(page, 1500)
    shot(page, "07-students-list.png", full_page=True)

    detail_href = page.locator('a[href*="/admin/student/"]').first.get_attribute("href")
    if detail_href:
        page.goto(f"{BASE_URL}{detail_href}", wait_until="networkidle")
        page.wait_for_selector("text=Detail Pendaftar", timeout=20000)
        wait(page, 1500)
        shot(page, "08-student-detail.png", full_page=True)
    else:
        print("No student detail URL found; skipping 08-student-detail.png")

    page.goto(f"{BASE_URL}/admin/users", wait_until="networkidle")
    page.wait_for_selector("text=Manajemen User", timeout=25000)
    wait(page, 1500)
    shot(page, "09-user-management.png", full_page=True)

    page.evaluate(
        """() => {
            localStorage.removeItem('skybridge_admin_sessions');
            localStorage.removeItem('skybridge_admin_role_index');
            localStorage.removeItem('token');
        }"""
    )
    page.goto(f"{BASE_URL}/admin/login", wait_until="networkidle")
    wait(page, 1000)
    shot(page, "10-logout-login.png")


def main():
    global TOKEN
    ensure_dirs()
    export_logo()

    if not TOKEN or TOKEN.count(".") != 2:
        print("Fetching screenshot token from VPS...")
        TOKEN = fetch_token_from_vps()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport=VIEWPORT,
            device_scale_factor=2,
            locale="id-ID",
        )
        page = context.new_page()
        try:
            capture_login_screens(page)
            inject_session(page, TOKEN)
            capture_authenticated(page)
        finally:
            context.close()
            browser.close()

    print("Screenshot capture complete.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
