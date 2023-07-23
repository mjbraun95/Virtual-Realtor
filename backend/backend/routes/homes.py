import asyncpg
import tornado.web
import json


class HomesHandler(tornado.web.RequestHandler):

    async def post(self):
        conn = await asyncpg.connect(user='virtualRealtor', password='.u~#QGCWA|X!W}Z!qnKJn3M.Xl{:', database='postgres', host='hackgpt-instance-1.cnxjxko2aofz.us-east-1.rds.amazonaws.com')

        args = json.loads(self.request.body)

        query = get_filter_query(args)
        rows = await conn.fetch(query)
        
        dict_rows = list()
        for row in rows:
            # print(row)
            # print(type(row))
            dict_row = dict(row)
            dict_row["uuid"] = str(dict_row["uuid"])
            
            dict_rows.append((dict_row))

        self.write(json.dumps(dict_rows))
        await conn.close()


def get_filter_query(args):

    q = ['SELECT * FROM listings']
    if not args:
        return q[0]
    else:
        print(q, 'where')
        q[0] + ' WHERE'

    if args.get('property_type'):
        q.append("""property_type in '{}'""".format(args.get('property_type')))
    if args.get('min_price', 0):
        q.append("""price < {}""".format(args.get('min_price', 0)))
    if args.get('max_price', 100000000):
        q.append("""price > {}""".format(args.get('max_price', 100000000)))
    if args.get('min_bedrooms', 0):
        q.append("""bedrooms < {}""".format(args.get('min_bedrooms', 0)))
    if args.get('max_bedrooms', 100):
        q.append("""bedrooms > {}""".format(args.get('max_bedrooms', 100)))
    if args.get('min_bathrooms', 0):
        q.append("""bathrooms < {}""".format(args.get('min_bathrooms', 0)))
    if args.get('max_bathrooms', 100):
        q.append("""bathrooms > {}""".format(args.get('max_bathrooms', 100)))
    if args.get('building_type'):
        q.append("""building_type in '{}'""".format(args.get('building_type')))
    if args.get('min_storeys', 0):
        q.append("""stories < {}""".format(args.get('min_storeys', 0)))
    if args.get('max_storeys', 100):
        q.append("""stories > {}""".format(args.get('max_storeys', 100)))
    if args.get('ownership'):
        q.append("""ownership == '{}'""".format(args.get('ownership')))
    if args.get('min_land_size', 0):
        q.append("""land_size < {}""".format(args.get('min_land_size', 0)))
    if args.get('max_land_size', 100):
        q.append("""land_size > {}""".format(args.get('max_land_size', 100)))
    for keyword in args.get('keywords', []):
        q.append("""ammenities like '%{}%'""".format(keyword))
        q.append("""ammenities_nearby like '%{}%'""".format(keyword))

    query = ' '.join(q[:2])
    if len(q) > 2:
        query = query + ' or ' + ' or '.join(q[2:])

    print(query)
    return query
