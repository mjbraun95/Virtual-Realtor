import asyncio
import tornado

class RootHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

