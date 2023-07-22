import scrapy
from testing1.items import RealEstateItem

class RealEstateSpider(scrapy.Spider):
    name = 'realestate'
    start_urls = ['https://www.reddit.com/r/Edmonton/']

    def parse(self, response):
        # extract data from the response
        for listing in response.css('div.listing-info'):
            item = RealEstateItem()
            item['title'] = listing.css('h1.title::text').get()
            item['price'] = listing.css('span.price::text').get()
            item['location'] = listing.css('span.location::text').get()
            yield item
