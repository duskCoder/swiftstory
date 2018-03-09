import json

def error(msg, code=255):
    return json.dumps({'type': 'response', 'content': {'status': code, 'info': msg}})

def success(obj):
    return json.dumps({'type': 'response', 'content': {'status': 0, 'result': obj}})
