from influxdb import InfluxDBClient
import requests
import time

host = "influxdb"
port = 8086

# create the database ahead of time if you haven't, with create database environment
dbname = "pistock"
user = "root"
password = "root"

client = InfluxDBClient(host, port, user, password, dbname)

def get_stock(endpoint):
    code = 0
    level = 0
    burn = 10
    while True:
        r = requests.get("http://stockalert.alexellis.io/stock/"+ endpoint)
        code = r.status_code
        print(str(code) + " "+ endpoint)
        if(code==200):
            res_json = r.json()
            if(res_json["stock"] == True):
                level = res_json["totalAmount"]
            else:
                level = 0

            break
        else:
            time.sleep(0.1)
            burn = burn - 1
        if(burn <= 0):
            return 0

    return level

def push_stat(endpoint):
    stock_level = get_stock(endpoint)

    iso = time.ctime()
    json_body = [{
        "measurement": "stock_level",
        "tags": {"host": endpoint},
        "time": iso,
        "fields": {
            "value": stock_level,
            "host": endpoint
        }
    }]

    client.write_points(json_body)

while(True):
    endpoints = ["pimoroni", "pihut", "adafruit"]
    for endpoint in endpoints:
        push_stat(endpoint)
    time.sleep(5)
