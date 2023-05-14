import os
import json
import requests
import logging
import http.client as http_client
from flask import escape
import functions_framework
from dotenv import load_dotenv

http_client.HTTPConnection.debuglevel = 1
# You must initialize logging, otherwise you'll not see debug output.
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger("requests.packages.urllib3")
requests_log.setLevel(logging.DEBUG)
requests_log.propagate = True

load_dotenv()

url = "https://www.strava.com/oauth/token"


@functions_framework.http
def refresh_token_proxy(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    print("entering cloud function")
    print(request)
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)
    headers = {"Access-Control-Allow-Origin": "*"}
    try:
        request_json = request.get_json(silent=True)

        if request_json and "refresh_token" in request_json:
            refresh_token = request_json["refresh_token"]
            print("arguments: ")
            print(refresh_token)
            print(os.environ.get("CLIENT_ID"))
            print(os.environ.get("CLIENT_SECRET"))
            body = {
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": int(os.environ.get("CLIENT_ID")),
                "client_secret": str(os.environ.get("CLIENT_SECRET")),
            }
            response = requests.post(url, json=body)
            data = response.json()

            print("data:")
            print(data)

            return data, 200, headers
    except Exception as e:
        print("something went wrong")
        print(e)
        return "bad request", 400
