import scrapy

class RealEstateItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    # add more fields as per your needs

