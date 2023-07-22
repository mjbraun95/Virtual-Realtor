#!/usr/bin/env python3

# use like ./import/main.py ./import/example.json

import json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("path")

args = parser.parse_args()

with open(args.path, "r") as file:
    listings = json.load(file)

print("Loaded %d listings" % len(listings))

class Lisiting:
    def __init__(self, listing):
        self.id = listing['Id']
        self.remarks = listing['PublicRemarks']
        self.bathrooms = listing['Building']['BathroomTotal']
        self.beds = listing['Building']['Bedrooms']
        self.size = listing['Building']['SizeInterior']
        self.building_type = listing['Building']['Apartment']
        self.price = listing['Property']['Price']
        self.property_type = listing['Property']['Type']
        self.address = listing['Property']['Address']['AddressText']
        self.lat = listing['Property']['Address']['Latitude']
        self.lng = listing['Property']['Address']['AddressText']
        self.photos = listing['Property']['Photo']
        self.ownership = listing['Property']['OwnershipType']
        self.ammenities_nearby = listing['Property']['AmmenitiesNearBy']

for i in range(len(listings)):
    listings[i] = Lisiting(listings[i])

