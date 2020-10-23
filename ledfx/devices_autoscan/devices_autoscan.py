from zeroconf import ServiceBrowser, Zeroconf
from time import sleep
import socket
import requests
import json

# DMX universe_size
c = 510
d = 512

hostname = socket.gethostbyname(socket.gethostname())

# ------------------------------------------------------------------------------- #
#Delete all LedFx current devices
# ------------------------------------------------------------------------------- #
hostnameurl = "http://" + hostname + ":8888/api/devices"

response = requests.get(hostnameurl)
payload = response.json().get('devices', {})
for i in payload:
    deviceID = payload[i]['id']

    response = requests.delete(
        f"{hostnameurl}/{deviceID}"
    )
    print(f"Deleted: {deviceID} -> {response.status_code}")

# ------------------------------------------------------------------------------- #
#Scan the LAN network that match WLED using zeroconf - Multicast DNS Service Discovery Library
# ------------------------------------------------------------------------------- #

class MyListener:

    def remove_service(self, zeroconf, type, name):
        print(f"Service {name} removed")

    def add_service(self, zeroconf, type, name):
        info = zeroconf.get_service_info(type, name)
        if info:
            #print(info.addresses)
            address = socket.inet_ntoa(info.addresses[0])
            url = f"http://{address}/json/info"
# ------------------------------------------------------------------------------- #
#For each WLED device found, based on the WLED IPv4 address, do a GET requests
# ------------------------------------------------------------------------------- #
            response = requests.get(url)
            b = response.json()
# ------------------------------------------------------------------------------- #
#For each WLED json response, format from WLED payload to LedFx payload.
#Note, set universe_size to 510 if LED 170 or less, If you have more than 170 LED, set universe_size to 510
# ------------------------------------------------------------------------------- #
            wledled = b["leds"]
            wledname = b["name"]
            wledcount = wledled["count"]
            
            if wledcount > 170:
                unisize = c
            else:
                unisize = d
            
            data = {
                "type": "e131",
                "config": {
                    "max_brightness": 1,
                    "refresh_rate": 60,
                    "universe": 1,
                    "universe_size": unisize,
                    "name": wledname,
                    "pixel_count": wledcount,
                    "ip_address": address
                }
            }
# ------------------------------------------------------------------------------- #
#For each WLED device, do a POST to the local machine
# ------------------------------------------------------------------------------- #   
            response = requests.post(
                hostnameurl,
                json=data
            )
            print(f"Successfully added Device [{wledname}] {address} -> {response.status_code}")


zeroconf = Zeroconf()
listener = MyListener()
browser = ServiceBrowser(zeroconf, "_wled._tcp.local.", listener)

# ------------------------------------------------------------------------------- #   

try:
    sleep(7)
finally:
    zeroconf.close()

    