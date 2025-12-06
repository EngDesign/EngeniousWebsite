import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import csv
import time
import sys

class SiteAuditor:
    def __init__(self, start_url, max_pages=50):
        self.start_url = start_url
        self.domain = urlparse(start_url).netloc
        self.max_pages = max_pages
        
        # Tracking
        self.visited_pages = set()
        self.pages_to_visit = [start_url]
        self.broken_links = []  # List of dicts
        self.hash_links = []    # List of dicts
        
        # Network setup
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Python Site Auditor) based on requests'
        })

    def is_internal(self, url):
        """Check if link belongs to the target domain."""
        return urlparse(url).netloc == self.domain

    def check_url_status(self, url):
        """
        Head request first (lighter), then GET if needed.
        Returns status code or 0 if connection failed.
        """
        try:
            # Try HEAD first to save bandwidth
            response = self.session.head(url, allow_redirects=True, timeout=5)
            
            # Some servers block HEAD, retry with GET if we get 405 (Method Not Allowed)
            # or 403/404 just to be sure it's not a server quirk
            if response.status_code >= 400:
                response = self.session.get(url, allow_redirects=True, timeout=5, stream=True)
                response.close() # Close stream immediately
            
            return response.status_code
        except requests.RequestException:
            return 0 # Connection error

    def crawl(self):
        print(f"🚀 Starting audit for: {self.start_url}")
        print(f"Output will be saved to 'crawl_report.csv'\n")

        while self.pages_to_visit and len(self.visited_pages) < self.max_pages:
            current_url = self.pages_to_visit.pop(0)
            
            if current_url in self.visited_pages:
                continue
            
            self.visited_pages.add(current_url)
            print(f"Scanning ({len(self.visited_pages)}/{self.max_pages}): {current_url}")

            try:
                response = self.session.get(current_url, timeout=10)
                if response.status_code != 200:
                    print(f"  Skipping - Status {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, "html.parser")
                links = soup.find_all("a")

                for link in links:
                    href = link.get("href")
                    
                    if href is None:
                        continue

                    # Extract link text for identification (default to [Image/Icon] if empty)
                    link_text = link.get_text(strip=True)[:50] or "[Image/Icon]"

                    # 1. Catch exact '#' links
                    if href.strip() == "#":
                        self.hash_links.append({
                            'source_page': current_url,
                            'link_text': link_text,
                            'type': 'Empty Hash (#)'
                        })
                        continue

                    # Skip javascript, mailto, tel
                    if any(href.startswith(p) for p in ['javascript:', 'mailto:', 'tel:']):
                        continue

                    # Normalize URL
                    full_url = urljoin(current_url, href)

                    # Skip LinkedIn to avoid false positives (bot protection)
                    if "linkedin.com" in full_url:
                        continue

                    # 2. Check Link Health (if not checked implicitly by being visited)
                    # We don't check every single link every time to save time, 
                    # but for a strict audit, we check validity.
                    status = self.check_url_status(full_url)
                    
                    if status >= 400 or status == 0:
                        self.broken_links.append({
                            'source_page': current_url,
                            'broken_url': full_url,
                            'link_text': link_text,
                            'status_code': status if status > 0 else "Connection Error"
                        })
                        print(f"  [!] Broken link found: {status} - {full_url}")

                    # 3. Add to queue if internal and not visited
                    if self.is_internal(full_url) and full_url not in self.visited_pages and full_url not in self.pages_to_visit:
                        # Avoid adding duplicates to queue
                        self.pages_to_visit.append(full_url)

                # Be polite to the server
                time.sleep(0.5)

            except Exception as e:
                print(f"  Error crawling {current_url}: {e}")

        self.save_report()

    def save_report(self):
        print("\n📝 Saving report to crawl_report.csv...")
        
        with open('crawl_report.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Write Summary
            writer.writerow(['--- AUDIT SUMMARY ---'])
            writer.writerow(['Target', self.start_url])
            writer.writerow(['Pages Scanned', len(self.visited_pages)])
            writer.writerow(['Broken Links Found', len(self.broken_links)])
            writer.writerow(['Empty Hash Links Found', len(self.hash_links)])
            writer.writerow([]) # Empty line
            
            # Write Hash Links
            if self.hash_links:
                writer.writerow(['--- EMPTY HASH (#) LINKS ---'])
                writer.writerow(['Source Page', 'Link Text', 'Issue Type'])
                for item in self.hash_links:
                    writer.writerow([item['source_page'], item['link_text'], item['type']])
                writer.writerow([])
            
            # Write Broken Links
            if self.broken_links:
                writer.writerow(['--- BROKEN LINKS ---'])
                writer.writerow(['Source Page', 'Link Text', 'Broken URL', 'Status Code'])
                for item in self.broken_links:
                    writer.writerow([item['source_page'], item['link_text'], item['broken_url'], item['status_code']])
            else:
                writer.writerow(['No broken links found!'])
                
        print("Done!")

if __name__ == "__main__":
    # Configuration
    TARGET = "https://engenious-design-website.webflow.io"
    
    auditor = SiteAuditor(TARGET, max_pages=100)
    auditor.crawl()