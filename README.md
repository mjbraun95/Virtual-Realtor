# Virtual-Realtor Backend

This directory contains the backend code for the Virtual-Realtor project, a real estate platform designed to streamline the property search process. Utilizing `asyncio` and `Tornado`, the backend serves real-time data to the frontend, allowing users to filter and find properties according to their preferences.

## Setup Instructions

### Requirements
- Python 3.6+
- pip

### Environment Setup

1. **Create a virtual environment:**
```bash
python3 -m venv venv
```
2. **Activate the virtual environment:**
On MacOS/Linux/*NIX:
```bash
source ./venv/bin/activate
```
On Windows (Powershell):
```bash
./venv/Scripts/Activate.ps1
```
3. **Install dependencies:**
```bash
pip install -r requirements.txt
```
4. **Running the Server**
Execute the following command to start the backend server:
```bash
python -m backend
```
The server will start listening on http://localhost:8888. Ensure the frontend is configured to communicate with this endpoint.
**Dependencies**
asyncpg==0.28.0: An asynchronous PostgreSQL client library.
tornado==6.3.2: A Python web framework and asynchronous networking library.