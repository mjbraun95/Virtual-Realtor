import os
from dotenv import load_dotenv
load_dotenv()

username = os.getenv('CLIENT')

if username is None:
   raise RuntimeError("USERNAME not set")
else:
   print(f"Username is {username}")