"""Check rendered SEO contracts against a running build or the public deployment."""

import json
import sys
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen
from xml.etree import ElementTree


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta, self.links, self.canonicals, self.headings, self.schemas = {}, [], [], [], []
        self.capture, self.text = None, ""
        self.in_head, self.title = False, ""
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "head":
            self.in_head = True
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))] = attrs.get("content", "")
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs["href"])
        if tag == "h1" or (tag == "title" and self.in_head) or (tag == "script" and attrs.get("type") == "application/ld+json"):
            self.capture, self.text = tag, ""

    def handle_data(self, text):
        if self.capture:
            self.text += text

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False
        if tag == self.capture:
            if tag == "script":
                data = json.loads(self.text)
                self.schemas.extend(data.get("@graph", [data]))
            elif tag == "title":
                self.title = self.text
            else:
                self.headings.append(self.text)
            self.capture = None


def check(base):
    origin = "https://www.vimzh.dev"
    with urlopen(urljoin(base, "/sitemap.xml"), timeout=30) as response:
        urls = [node.text for node in ElementTree.fromstring(response.read()).findall("{*}url/{*}loc")]
    assert len(urls) == len(set(urls)), "Duplicate sitemap entries"
    assert {origin + path for path in ("/", "/projects", "/blogs", "/about")} <= set(urls), "Missing canonical sitemap pages"

    for canonical in urls:
        assert urlsplit(canonical).netloc == "www.vimzh.dev", canonical
        requested = urljoin(base, urlsplit(canonical).path)
        with urlopen(requested, timeout=30) as response:
            assert response.status == 200 and response.url == requested, requested
            assert "noindex" not in response.headers.get("X-Robots-Tag", "").lower()
            page = Page(response.read().decode())
        # Next.js omits the optional trailing slash on the origin-only metadata URL.
        assert [url.rstrip("/") for url in page.canonicals] == [canonical.rstrip("/")], (requested, page.canonicals)
        assert page.meta["og:url"].rstrip("/") == canonical.rstrip("/"), requested
        assert page.meta["description"], requested
        assert "Vansh Gaur" in page.title and "Vimzh" in page.title, (requested, page.title)
        assert "noindex" not in page.meta.get("robots", "").lower(), requested
        assert len(page.headings) == 1, (requested, page.headings)
        assert page.meta["twitter:creator"] == "@vimzhtwt", requested
        assert page.meta["og:image"] == origin + "/social-preview.png", requested
        assert page.meta["twitter:image"] == page.meta["og:image"], requested
        person = next(item for item in page.schemas if item.get("@type") == "Person")
        assert person["name"] == "Vansh Gaur" and person["alternateName"] == "Vimzh"
        assert "/about" in page.links and "/llms.txt" in page.links, requested
        footer_index = page.links.index("/llms.txt")
        assert page.links[footer_index + 1] == "https://github.com/vimzh", requested
        if urlsplit(canonical).path == "/":
            assert "Vansh Gaur" in page.headings[0] and "Vimzh" in page.headings[0]
        elif urlsplit(canonical).path.startswith("/blogs/"):
            article = next(item for item in page.schemas if item.get("@type") == "BlogPosting")
            assert article["url"] == canonical and article["author"]["@id"] == person["@id"]
            assert page.meta["twitter:title"] == article["headline"]
        print("PASS", canonical)

    for path in ("/robots.txt", "/llms.txt", "/about.md", "/work.md", "/resume.pdf", "/social-preview.png"):
        with urlopen(urljoin(base, path), timeout=30) as response:
            assert response.status == 200, path
    try:
        urlopen(urljoin(base, "/seo-check-does-not-exist"), timeout=30)
    except HTTPError as error:
        assert error.code == 404, error.code
    else:
        raise AssertionError("Missing pages must return 404")
    print("PASS public assets and missing-page status")


if __name__ == "__main__":
    check(sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000")
