import requests

Body = '''
{
	"action": "activate",
	"id": preset_id
}
'''

# Do the HTTP put request for the preset
response = requests.put('http://127.0.0.1:8888/api/presets', Body)
    
# Check for HTTP codes other than 200 (LedFx Deployed)
if response.status_code != 200:
    print('Status:', response.status_code, 'Problem with the request. Exiting.')
    exit()

# Report success
print('200 OK-Successfully Deployed Preset: {id}')