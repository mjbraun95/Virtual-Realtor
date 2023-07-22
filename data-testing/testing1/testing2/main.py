import praw
import json


reddit = praw.Reddit(
    client_id="DPSvphjITqmL4VeaoI2BEg",
    client_secret="Jn0FFel_3y-HxL8EIdfRFdBQajqkqQ",
    user_agent="edm-scrape/1.0 by Complex_Goal_1407",
)

# Search all of Reddit
results = reddit.subreddit("all").search("Edmonton real estate", limit=100)
# for result in results:
#     print('TITLE: ',result.title)
# data = ''
# # Search within a specific subreddit
# results = reddit.subreddit("alberta").search("Downtown", limit=100)
# for result in results:
#     if 'edmonton' in result.title.lower():
#         # print(result.title)
#         with open('data-dump.txt', 'w', encoding='utf-8') as f:
#             f.write(result.title)


# Open the file in write mode
with open('titles_and_comments.jsonl', 'w') as f:
    for result in results:
        # Print the title for debugging purposes
        print(result.title)

        # Fetch the comments for this post
        result.comments.replace_more(limit=None)
        comments = [comment.body for comment in result.comments.list()]
        
        # Write the title and comments as a separate line in the JSONL file
        json.dump({'title': result.title, 'comments': comments}, f)
        f.write('\n')



