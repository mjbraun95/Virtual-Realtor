import asyncpg
import tornado.ioloop
import tornado.web
import json
from collections import namedtuple

class HomesHandler(tornado.web.RequestHandler):

    async def get(self):
        conn = await asyncpg.connect(user='virtualRealtor', password='.u~#QGCWA|X!W}Z!qnKJn3M.Xl{:', database='postgres', host='hackgpt-instance-1.cnxjxko2aofz.us-east-1.rds.amazonaws.com')
        
        rows = await conn.fetch('SELECT * FROM listings')
        
        dict_rows = list()
        for row in rows:
            print(row)
            print(type(row))
            dict_row = dict(row)
            dict_row["uuid"] = str(dict_row["uuid"])
            
            dict_rows.append(dict_row)
            
            
            # self.write(str(row))
            # self.write(row["full_address"])
        self.write(json.dumps(dict_rows))
        await conn.close()
