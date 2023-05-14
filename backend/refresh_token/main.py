import os
import json
import requests
import logging
import http.client as http_client
from flask import escape
import functions_framework
from dotenv import load_dotenv

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
            body = {
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": int(os.environ.get("CLIENT_ID")),
                "client_secret": str(os.environ.get("CLIENT_SECRET")),
            }
            response = requests.post(url, json=body)
            data = response.json()

            return data, 200, headers
    except Exception as e:
        print("something went wrong")
        print(e)
        return "something went wrong", 500
