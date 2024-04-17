import http.server
import socketserver
import json
from model.export_model import run_model

PORT = 8001

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        # content_length = int(self.headers['Content-Length'])  # Get the size of data
        # post_data = self.rfile.read(content_length)  # Gets the data itself
        # self.handle_request(post_data.decode('utf-8'))  # Decode it to string
        print(self.headers['content'])
        print(self.headers)

    def do_GET(self):
        if self.path == '/test':
            self.test()
        else:
            self.do_GET()
    def do_POST(self):
        # print("post headers:")
        # print(self.headers)
        content_length = int(self.headers['Content-Length'])  # Get the size of data
        post_data = self.rfile.read(content_length)  # Gets the data itself
        self.handle_request(post_data.decode('utf-8'))  # Decode it to string
    def handle_request(self, input_data):
        try:
            data = json.loads(input_data)  # Try to parse the data as JSON
        except json.JSONDecodeError:
            data = {'error': 'Invalid JSON'}
            self.send_response(400)
        else:
            self.send_response(200)
            p = run_model(data)
            # p = 0.01
            result = {'result': data, 'prob': p[0]}  # Process the data here
            
        
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Handle CORS
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def test(self):
        # Example function 
        result = "test"  
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Handle CORS
        self.end_headers()
        self.wfile.write(json.dumps({'result': result}).encode())

httpd = socketserver.TCPServer(("", PORT), CustomHandler)
print("serving at port", PORT)
httpd.serve_forever()