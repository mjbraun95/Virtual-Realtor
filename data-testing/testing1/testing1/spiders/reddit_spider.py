import scrapy

class RedditSpider(scrapy.Spider):
    name = "reddit"
    start_urls = ['https://www.reddit.com/r/Edmonton/']

    def parse(self, response):
        for post in response.css('div.Post'):
            yield {
                'title': post.css('h3._eYtD2XCVieq6emjKBH3m::text').get(),
                'upvotes': post.css('div._1rZYMD_4xY3gRcSS3p8ODO::text').get(),
            }
        next_page = response.css('a._1LAmcxBaaqShJsi8RNT-Vp::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
