import json

def cao_error(msg, code=255):
    return json.dumps({'status': code, 'info': msg})

def cao_success(obj):
    return json.dumps({'status': 0, 'result': obj})
