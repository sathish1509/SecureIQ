"""
UCI Phishing Websites feature extraction for SecureIQ.

Group D neutral defaults: no free API in hackathon scope; model treats 0 as
suspicious/unknown per UCI encoding.
"""

from __future__ import annotations

import ipaddress
import re
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from datetime import datetime, timezone
from urllib.parse import urlparse

import requests
import tldextract
from bs4 import BeautifulSoup

WHOIS_TIMEOUT = 3
FETCH_TIMEOUT = (2, 3)
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

SHORTENERS = {
    "bit.ly", "t.co", "tinyurl.com", "goo.gl", "ow.ly", "is.gd", "buff.ly",
    "adf.ly", "cutt.ly", "rb.gy", "shorturl.at", "rebrand.ly", "bl.ink",
}

NEUTRAL_REPUTATION_FEATURES = (
    "WebsiteTraffic",
    "PageRank",
    "GoogleIndex",
    "LinksPointingToPage",
    "StatsReport",
)


def _is_ip_host(host: str) -> bool:
    try:
        ipaddress.ip_address(host.strip("[]"))
        return True
    except ValueError:
        return False


def _is_private_or_unreachable_host(host: str) -> bool:
    if _is_ip_host(host):
        try:
            ip = ipaddress.ip_address(host.strip("[]"))
            return ip.is_private or ip.is_loopback or ip.is_link_local
        except ValueError:
            return True
    return False


def extract_features(url: str) -> dict[str, int]:
    """Return all 30 UCI features as -1, 0, or 1. Never raises."""
    normalized = _normalize_url(url)
    parsed = urlparse(normalized)
    host = parsed.netloc.split("@")[-1].split(":")[0]
    extracted = tldextract.extract(normalized)
    registered_domain = f"{extracted.domain}.{extracted.suffix}" if extracted.suffix else extracted.domain

    features: dict[str, int] = {}
    features.update(_url_string_features(normalized, parsed, host, extracted))
    if not _is_ip_host(host) and registered_domain and "." in registered_domain:
        features.update(_whois_features(registered_domain))
    else:
        features.update({"DomainRegLen": 0, "AgeofDomain": 0, "DNSRecording": 0})
    features.update(_live_page_features(normalized, parsed, registered_domain, host))
    for name in NEUTRAL_REPUTATION_FEATURES:
        features[name] = _neutral_reputation(name)
    return features


def _normalize_url(url: str) -> str:
    clean = url.strip()
    if not clean.startswith(("http://", "https://")):
        clean = "https://" + clean
    return clean


def _url_string_features(
    url: str,
    parsed,
    host: str,
    extracted: tldextract.ExtractResult,
) -> dict[str, int]:
    return {
        "UsingIP": _using_ip(host),
        "LongURL": _long_url(url),
        "ShortURL": _short_url(extracted),
        "Symbol@": _symbol_at(url),
        "Redirecting//": _redirecting_double_slash(url),
        "PrefixSuffix-": _prefix_suffix_hyphen(extracted.domain),
        "SubDomains": _sub_domains(extracted),
        "HTTPS": _https(parsed.scheme),
        "HTTPSDomainURL": _https_domain_url(parsed),
    }


def _using_ip(host: str) -> int:
    """UCI: UsingIP — host uses a raw IP address instead of a domain name."""
    try:
        # REAL: IP literal in host is a known phishing indicator.
        ipaddress.ip_address(host.strip("[]"))
        return 1
    except ValueError:
        return -1


def _long_url(url: str) -> int:
    """UCI: LongURL — unusually long URLs may hide suspicious path segments."""
    length = len(url)
    if length > 75:
        return 1
    if length >= 54:
        return 0
    return -1


def _short_url(extracted: tldextract.ExtractResult) -> int:
    """UCI: ShortURL — URL shortening services obscure the final destination."""
    domain = extracted.registered_domain.lower()
    # REAL: Known shortener domains map to the UCI phishing indicator value.
    return 1 if domain in SHORTENERS else -1


def _symbol_at(url: str) -> int:
    """UCI: Symbol@ — '@' in the URL can mislead users about the true host."""
    # REAL: '@' before the path often indicates a deceptive URL structure.
    scheme_end = url.find("://")
    rest = url[scheme_end + 3:] if scheme_end != -1 else url
    path_start = rest.find("/")
    authority = rest if path_start == -1 else rest[:path_start]
    return 1 if "@" in authority else -1


def _redirecting_double_slash(url: str) -> int:
    """UCI: Redirecting// — '//' after the scheme may indicate HTTP redirect tricks."""
    # REAL: Extra '//' beyond the scheme delimiter is suspicious in UCI rules.
    idx = url.find("//")
    return 1 if idx != -1 and "//" in url[idx + 2:] else -1


def _prefix_suffix_hyphen(domain_label: str) -> int:
    """UCI: PrefixSuffix- — hyphens in the domain label mimic brand names."""
    # REAL: Hyphenated domain labels are a lexical phishing signal.
    return 1 if "-" in domain_label else -1


def _sub_domains(extracted: tldextract.ExtractResult) -> int:
    """UCI: SubDomains — excessive subdomain depth can indicate deception."""
    if not extracted.subdomain:
        return -1
    dots = extracted.subdomain.count(".")
    if dots >= 1:
        return 1
    return 0


def _https(scheme: str) -> int:
    """UCI: HTTPS — pages served over HTTP lack transport encryption."""
    # REAL: Scheme inspection is deterministic.
    if scheme == "https":
        return -1
    if scheme == "http":
        return 1
    return 0


def _https_domain_url(parsed) -> int:
    """UCI: HTTPSDomainURL — 'https' token incorrectly embedded in the domain part."""
    host = parsed.netloc.lower()
    # REAL: 'https' should not appear inside the hostname.
    return 1 if "https" in host else -1


def _whois_features(registered_domain: str) -> dict[str, int]:
    try:
        import whois
    except ImportError:
        return {
            "DomainRegLen": 0,
            "AgeofDomain": 0,
            "DNSRecording": 0,
        }

    try:
        executor = ThreadPoolExecutor(max_workers=1)
        try:
            future = executor.submit(whois.whois, registered_domain)
            record = future.result(timeout=WHOIS_TIMEOUT)
        finally:
            executor.shutdown(wait=False, cancel_futures=True)
        if not record:
            return {"DomainRegLen": 0, "AgeofDomain": 0, "DNSRecording": 0}

        creation = _coerce_datetime(record.creation_date)
        expiration = _coerce_datetime(record.expiration_date)
        now = datetime.now(timezone.utc)

        domain_reg_len = 0
        if creation and expiration:
            reg_days = (expiration - creation).days
            if reg_days > 365:
                domain_reg_len = -1
            elif reg_days < 365:
                domain_reg_len = 1

        age_of_domain = 0
        if creation:
            age_days = (now - creation).days
            if age_days > 180:
                age_of_domain = -1
            elif age_days < 180:
                age_of_domain = 1

        dns_recording = -1 if record.domain_name else 1
        return {
            "DomainRegLen": domain_reg_len,
            "AgeofDomain": age_of_domain,
            "DNSRecording": dns_recording,
        }
    except FuturesTimeoutError:
        return {"DomainRegLen": 0, "AgeofDomain": 0, "DNSRecording": 0}
    except Exception:
        return {"DomainRegLen": 0, "AgeofDomain": 0, "DNSRecording": 0}


def _coerce_datetime(value):
    if value is None:
        return None
    if isinstance(value, list):
        value = value[0] if value else None
    if value is None:
        return None
    if getattr(value, "tzinfo", None) is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _live_page_features(url: str, parsed, registered_domain: str, host: str) -> dict[str, int]:
    defaults = {
        "Favicon": 0,
        "NonStdPort": 0,
        "RequestURL": 0,
        "AnchorURL": 0,
        "LinksInScriptTags": 0,
        "ServerFormHandler": 0,
        "InfoEmail": 0,
        "AbnormalURL": 0,
        "WebsiteForwarding": 0,
        "StatusBarCust": 0,
        "DisableRightClick": 0,
        "UsingPopupWindow": 0,
        "IframeRedirection": 0,
    }
    if _is_ip_host(host) or _is_private_or_unreachable_host(host):
        defaults["NonStdPort"] = _non_std_port(parsed.port, parsed.scheme)
        return defaults
    try:
        response = requests.get(
            url,
            timeout=FETCH_TIMEOUT,
            headers={"User-Agent": USER_AGENT},
            allow_redirects=True,
        )
        final_url = response.url
        html = response.text or ""
        soup = BeautifulSoup(html, "html.parser")
        page_domain = tldextract.extract(final_url).registered_domain.lower()
        reg_domain = registered_domain.lower()

        defaults["Favicon"] = _favicon(soup, final_url, page_domain, reg_domain)
        defaults["NonStdPort"] = _non_std_port(urlparse(final_url).port, parsed.scheme)
        defaults["RequestURL"] = _external_resource_ratio(soup, final_url, page_domain, reg_domain, tag="link", attr="href")
        defaults["AnchorURL"] = _external_resource_ratio(soup, final_url, page_domain, reg_domain, tag="a", attr="href")
        defaults["LinksInScriptTags"] = _links_in_script_tags(soup)
        defaults["ServerFormHandler"] = _server_form_handler(soup, page_domain, reg_domain)
        defaults["InfoEmail"] = _info_email(soup, html)
        defaults["AbnormalURL"] = _abnormal_url(final_url, reg_domain)
        defaults["WebsiteForwarding"] = _website_forwarding(url, final_url, reg_domain)
        defaults["StatusBarCust"] = _status_bar_customization(html)
        defaults["DisableRightClick"] = _disable_right_click(html)
        defaults["UsingPopupWindow"] = _using_popup_window(html)
        defaults["IframeRedirection"] = _iframe_redirection(soup, page_domain, reg_domain)
    except Exception:
        pass
    return defaults


def _favicon(soup, page_url: str, page_domain: str, reg_domain: str) -> int:
    """UCI: Favicon — favicon loaded from a different domain is suspicious."""
    # APPROX: Compare favicon host to page domain via HTML link tags.
    for link in soup.find_all("link", rel=True):
        rel = " ".join(link.get("rel", [])).lower()
        if "icon" not in rel:
            continue
        href = link.get("href")
        if not href:
            continue
        favicon_domain = tldextract.extract(urlparse(page_url).join(href)).registered_domain.lower()
        if favicon_domain and favicon_domain not in {page_domain, reg_domain}:
            return 1
        return -1
    return 0


def _non_std_port(port, scheme: str) -> int:
    """UCI: NonStdPort — non-standard HTTP/HTTPS ports may indicate evasion."""
    # REAL: Port numbers outside 80/443 are flagged.
    if port is None:
        return -1
    if scheme == "https" and port == 443:
        return -1
    if scheme == "http" and port == 80:
        return -1
    return 1 if port not in (80, 443) else -1


def _external_resource_ratio(soup, page_url: str, page_domain: str, reg_domain: str, tag: str, attr: str) -> int:
    """UCI: RequestURL / AnchorURL — external resource ratio in page links."""
    # APPROX: Compare linked resource domains to the page's registered domain.
    total = 0
    external = 0
    for element in soup.find_all(tag):
        href = element.get(attr)
        if not href or href.startswith(("#", "javascript:", "mailto:")):
            continue
        total += 1
        linked_domain = tldextract.extract(urlparse(page_url).join(href)).registered_domain.lower()
        if linked_domain and linked_domain not in {page_domain, reg_domain}:
            external += 1
    if total == 0:
        return 0
    ratio = external / total
    if ratio >= 0.6:
        return 1
    if ratio <= 0.2:
        return -1
    return 0


def _links_in_script_tags(soup) -> int:
    """UCI: LinksInScriptTags — URLs embedded inside script blocks."""
    # APPROX: Count anchor-like strings inside script contents.
    pattern = re.compile(r"https?://[^\s\"']+", re.I)
    for script in soup.find_all("script"):
        text = script.string or script.get_text()
        if text and pattern.search(text):
            return 1
    return -1


def _server_form_handler(soup, page_domain: str, reg_domain: str) -> int:
    """UCI: ServerFormHandler — form action points away from the page domain."""
    # APPROX: Inspect form action targets.
    for form in soup.find_all("form"):
        action = form.get("action", "").strip()
        if not action or action == "#":
            return 1
        action_domain = tldextract.extract(action).registered_domain.lower()
        if action_domain and action_domain not in {page_domain, reg_domain}:
            return 1
    return -1


def _info_email(soup, html: str) -> int:
    """UCI: InfoEmail — form submits sensitive info to an email handler."""
    # APPROX: Detect mailto: handlers in forms or pages.
    for form in soup.find_all("form"):
        action = (form.get("action") or "").lower()
        if action.startswith("mailto:"):
            return 1
    if "mailto:" in html.lower():
        return 1
    return -1


def _abnormal_url(final_url: str, reg_domain: str) -> int:
    """UCI: AbnormalURL — final URL domain differs from the expected host."""
    # APPROX: Compare registered domain of the resolved URL to the input domain.
    final_domain = tldextract.extract(final_url).registered_domain.lower()
    if not final_domain or not reg_domain:
        return 0
    return 1 if final_domain != reg_domain else -1


def _website_forwarding(original_url: str, final_url: str, reg_domain: str) -> int:
    """UCI: WebsiteForwarding — excessive redirects or cross-domain forwarding."""
    # APPROX: Different registered domain after redirect implies forwarding.
    original_domain = tldextract.extract(original_url).registered_domain.lower()
    final_domain = tldextract.extract(final_url).registered_domain.lower()
    if original_domain and final_domain and original_domain != final_domain:
        return 1
    return -1


def _status_bar_customization(html: str) -> int:
    """UCI: StatusBarCust — JavaScript attempts to alter the browser status bar."""
    # APPROX: Weak HTML/JS keyword heuristic.
    lowered = html.lower()
    if "window.status" in lowered or "onmouseover" in lowered and "status" in lowered:
        return 1
    return -1


def _disable_right_click(html: str) -> int:
    """UCI: DisableRightClick — scripts block context menu/right-click actions."""
    # APPROX: Search for common right-click blocking patterns.
    lowered = html.lower()
    if "oncontextmenu" in lowered and ("return false" in lowered or "preventdefault" in lowered):
        return 1
    return -1


def _using_popup_window(html: str) -> int:
    """UCI: UsingPopupWindow — JavaScript opens pop-up windows."""
    # APPROX: Detect popup-related JS APIs.
    lowered = html.lower()
    if "window.open(" in lowered or "alert(" in lowered:
        return 1
    return -1


def _iframe_redirection(soup, page_domain: str, reg_domain: str) -> int:
    """UCI: IframeRedirection — hidden or cross-domain iframes redirect users."""
    # APPROX: Flag cross-domain iframes.
    for iframe in soup.find_all("iframe"):
        src = iframe.get("src")
        if not src:
            continue
        iframe_domain = tldextract.extract(src).registered_domain.lower()
        if iframe_domain and iframe_domain not in {page_domain, reg_domain}:
            return 1
    return -1


def _neutral_reputation(feature_name: str) -> int:
    """UCI reputation features without a free live data source in hackathon scope."""
    # APPROX: UCI feature requires external reputation data; neutral 0 per dataset encoding.
    return 0
