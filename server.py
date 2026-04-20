"""
Simple HTTP server for ATS Resume Dashboard.
Serves the HTML/CSS/JS files and handles .docx file downloads.
Run: python3 server.py
Visit: http://localhost:8080
"""

import http.server
import os
import urllib.parse

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ATSHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Handle download requests
        if path.startswith("/download/"):
            filename = os.path.basename(path)
            filepath = os.path.join(DIRECTORY, filename)

            if os.path.exists(filepath) and filename.endswith(".docx"):
                self.send_response(200)
                self.send_header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
                self.send_header("Content-Length", str(os.path.getsize(filepath)))
                self.end_headers()

                with open(filepath, "rb") as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, f"File not found: {filename}")
                return

        # Serve static files normally
        super().do_GET()

if __name__ == "__main__":
    print(f"\n  🚀 ATS Resume Dashboard running at:")
    print(f"     http://localhost:{PORT}\n")
    server = http.server.HTTPServer(("", PORT), ATSHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
        server.server_close()
