import http.server
import socketserver
import json

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/test':
            self.handle_multiply()
        else:
            super().do_GET()

    def handle_multiply(self):
        # Example function to multiply numbers
        result = 5 * 3  # Static multiplication for demonstration
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Handle CORS
        self.end_headers()
        self.wfile.write(json.dumps({'result': result}).encode())

httpd = socketserver.TCPServer(("", PORT), CustomHandler)
print("serving at port", PORT)
httpd.serve_forever()