import asyncio
import tornado

from .routes import ROUTES

async def main():
    application = tornado.web.Application(ROUTES)
    application.listen(8888)
    print("Listening on http://localhost:8888")
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())
