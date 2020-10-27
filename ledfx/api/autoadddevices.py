
#from ledfx.config import save_config
from ledfx.api import RestEndpoint
from ledfx.utils import generate_id
from aiohttp import web
from ledfx.devices_autoscan import devices_autoscan
import logging
import json

_LOGGER = logging.putLogger(__name__)

class AutoAddDevicesEndpoint(RestEndpoint):
    """REST end-point for deleting and auto Adding all WLED devices found on your LAN"""

    ENDPOINT_PATH = "/api/autoadddevices"

    async def post(self, request) -> web.Response:
        if data is None:
            exec(open(devices_autoscan).read())
        #data = await request.json()

        response = { 'status' : 'success', 'device': { 'WLED AutoScan logs': devices_autoscan}}
        return web.json_response(data=response, status=200)