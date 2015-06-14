import json

def cao_error(msg, code=255):
    return json.dumps({'type': 'response', 'content': {'status': code, 'info': msg}})

def cao_success(obj):
    return json.dumps({'type': 'response', 'content': {'status': 0, 'result': obj}})
