from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from flask import jsonify

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes

from .component.operation import call_for_output
from .component.data_process import uploadFile

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def postMethod(request):
    file = request.FILES.get('file')
    data = request.data.get("text", "")  # default to empty string if not provided

    if file:  
        text = uploadFile(file)
        if text!="":
            # print(text)
            output = call_for_output(text)
            return Response({"message": output}, status=200)
        else:
            return Response({"message": "file empty"}, status=200)

    elif data!="":
        # print('your>>',data)
        output = call_for_output(data)
        return Response({"message": output}, status=200)

    else:
        return Response({"error": "No file or text provided."}, status=400)








# @api_view(['PUT'])
# def putMethod(request):
#     return Response({"message": "welcome to put calling"})

# @api_view(['DELETE'])
# def deleteMethod(request,id):
#     # print(id)
#     return Response({"message": f"welcome to DELETE calling , {id}"})

# @api_view(['GET'])
# def GetMethod(request):
#     return Response({"message": "welcome to get calling++++++++++++++++++"})