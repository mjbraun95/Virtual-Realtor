from .root import RootHandler
from .homes import HomesHandler

ROUTES = [
    (r"/", RootHandler),
    (r"/homes/", HomesHandler),
]
