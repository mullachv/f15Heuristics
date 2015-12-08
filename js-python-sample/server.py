import time
import BaseHTTPServer

HOST_NAME = 'linserv2'
PORT_NUMBER = 19234


class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    access_test = 0
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.send_header("Access-Control-Allow-Origin", "*")
        s.end_headers()
        if s.path == '/':
            s.wfile.write("<html><head><title>Title goes here.</title></head>")
            s.wfile.write("<body><p>This is a test.</p>")
            s.wfile.write("</body></html>")
        else:
            MyHandler.access_test += 1
            s.wfile.write("<p>Prometheus test success: " + str(MyHandler.access_test) + "</p>")

if __name__ == '__main__':
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)
