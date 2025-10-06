#!/usr/bin/env python3
"""
Cacheless Development Server for Uma Musume Hidden Factors Tracker

This script starts a Python HTTP server with cache-disabling headers
for development purposes. All files will be served with headers that
prevent browser caching, ensuring you see changes immediately.

Usage:
    python server.py [port]

Default port: 8000
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path


class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler that disables caching for all responses."""

    def end_headers(self):
        """Add cache-busting headers to every response."""
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        """Suppress server log messages for cleaner output."""
        pass


def main():
    """Start the cacheless development server."""

    # Get port from command line argument or use default
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}")
            print("Using default port 8000")
            port = 8000

    # Change to the script's directory (where index.html is located)
    script_dir = Path(__file__).parent
    os.chdir(script_dir)

    print(f"🚀 Starting cacheless development server...")
    print(f"📁 Serving directory: {script_dir}")
    print(f"🌐 Server URL: http://localhost:{port}/")
    print(f"📋 Press Ctrl+C to stop the server")
    print("=" * 50)

    try:
        # Create and start the server
        with socketserver.TCPServer(('', port), NoCacheHTTPRequestHandler) as httpd:
            print("✅ Server started successfully!")            
            print("🔄 Cache disabled - all files will be served fresh")
            print("💡 Tip: Open http://localhost:{port}/ in your browser")

            # Optionally open browser automatically
            try:
                webbrowser.open(f'http://localhost:{port}/')
                print("🌍 Browser opened automatically")
            except Exception:
                print("💡 Manually open http://localhost:{port}/ in your browser")

            print("=" * 50)
            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use.")
            print(f"💡 Try a different port: python server.py {port + 1}")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()