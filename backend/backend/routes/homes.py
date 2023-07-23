import asyncpg
import tornado.web
import json


class HomesHandler(tornado.web.RequestHandler):

    async def post(self):
        conn = await asyncpg.connect(user='virtualRealtor', password='.u~#QGCWA|X!W}Z!qnKJn3M.Xl{:', database='postgres', host='hackgpt-instance-1.cnxjxko2aofz.us-east-1.rds.amazonaws.com')

        try:
            args = json.loads(self.request.body)
        except json.decoder.JSONDecodeError:
            args = {}

        query = get_filter_query(args)
        rows = await conn.fetch(query)
        print(len(rows), 'LEN')
        
        dict_rows = []
        for row in rows:
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
        q[0] = q[0] + ' WHERE'

    if args.get('min_price'):
        q.append("""price >= {}""".format(args.get('min_price', 0)))
    if args.get('max_price'):
        q.append("""price <= {}""".format(args.get('max_price', 100000000)))
    if args.get('min_bedrooms'):
        q.append("""bedrooms >= {}""".format(args.get('min_bedrooms', 0)))
    if args.get('max_bedrooms'):
        q.append("""bedrooms <= {}""".format(args.get('max_bedrooms', 100)))
    if args.get('min_bathrooms'):
        q.append("""bathrooms >= {}""".format(args.get('min_bathrooms', 0)))
    if args.get('max_bathrooms'):
        q.append("""bathrooms <= {}""".format(args.get('max_bathrooms', 100)))
    if args.get('min_storeys'):
        q.append("""stories >= {}""".format(args.get('min_storeys', 0)))
    if args.get('max_storeys'):
        q.append("""stories <= {}""".format(args.get('max_storeys', 100)))
    if args.get('min_land_size'):
        q.append("""land_size >= {}""".format(args.get('min_land_size', 0)))
    if args.get('max_land_size'):
        q.append("""land_size <= {}""".format(args.get('max_land_size', 100)))

    if args.get('property_type'):
        types = tuple(args.get('property_type'))
        if len(types) == 1:
            types = str(types).replace(',', '')
        q.append("""property_type in {}""".format(types))
    if args.get('building_type'):
        types = tuple(args.get('building_type'))
        if len(types) == 1:
            types = str(types).replace(',', '')
        q.append("""building_type in {}""".format(types))
    if args.get('ownership'):
        types = tuple(args.get('ownership'))
        if len(types) == 1:
            types = str(types).replace(',', '')
        q.append("""ownership_type in {}""".format(types))

    print(q, 'q list')
    query = ' '.join(q[:2])
    if len(q) >= 2:
        query = query + ' and ' + ' and '.join(q[2:])

    if args.get('keywords', []):
        if len(q) >= 2:
            query = query + ' and ('
        keywords_q = []
        for keyword in args.get('keywords', []):
            print(keyword, 'KEYWORD')
            keywords_q.append("""ammenities like '%{}%'""".format(keyword))
            keywords_q.append("""ammenities_nearby like '%{}%'""".format(keyword))
        query = query + ' or '.join(keywords_q) + ')'

    print(query)
    return query
