#!/usr/bin/env python3

# use like ./import/main.py ./import/example.json

import json
import argparse
import uuid

parser = argparse.ArgumentParser()
parser.add_argument("path")

args = parser.parse_args()

with open(args.path, "r") as file:
    listings = json.load(file)

print("Loaded %d listings" % len(listings))


class Listing:
    def __init__(self, listing):
        self.uuid = uuid.uuid4()
        self.r_id = listing['Id']
        self.bathrooms = listing['Building']['BathroomTotal']
        self.bedrooms = listing['Building']['Bedrooms']
        self.size_interior = listing['Building']['SizeInterior']
        self.building_type = listing['Building']['Type']
        self.price = listing['Property']['PriceUnformattedValue']
        self.property_type = listing['Property']['Type']
        self.full_address = listing['Property']['Address']['AddressText']
        self.latitude = listing['Property']['Address']['Latitude']
        self.longitude = listing['Property']['Address']['AddressText']
        self.photo = listing.get('Photo', '')
        self.ownership_type = listing['Property']['OwnershipType']
        self.ammenities_nearby = listing['Property']['AmmenitiesNearBy']
        self.url = listing['RelativeDetailsURL']
        self.land_size = listing['Land'].get('SizeTotal', 0)
        self.stories = listing['Building']['StoriesTotal']
        self.parking_type = listing.get('ParkingType', '')
        self.ammenities = listing['Building'].get('Ammenities', '')
        self.postal_code = listing['PostalCode']
        self.province_name = listing['ProvinceName']

    def generate_sql_insert(self):
        return "INSERT INTO listings (uuid, r_id, bathrooms, bedrooms, size_interior, building_type, price, property_type, full_address, latitude, longitude, photo, ownership_type, ammenities_nearby, url, land_size, stories, parking_type, ammenities, postal_code, province_name) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}');\n".format(
            self.uuid,
            self.r_id,
            self.bathrooms,
            self.bedrooms,
            self.size_interior,
            self.building_type,
            self.price,
            self.property_type,
            self.full_address,
            self.latitude,
            self.longitude,
            self.photo,
            self.ownership_type,
            self.ammenities_nearby,
            self.url,
            self.land_size,
            self.stories,
            self.parking_type,
            self.ammenities,
            self.postal_code,
            self.province_name
        )

for listing in listings:
    listing_obj = Listing(listing)

    f = open("sql_listings.txt", "a")
    f.write(listing_obj.generate_sql_insert())
    f.close()