# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from models import RideOrder, Issue
from rest_framework import viewsets
from estoniatranspo.app.serializers import UserSerializer, GroupSerializer, RideOrderSerializer, IssueSerializer
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers
from django.http import HttpResponse

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class RideOrderViewSet(viewsets.ModelViewSet):
    queryset = RideOrder.objects.all()
    serializer_class = RideOrderSerializer

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all().order_by('-created')
    serializer_class = IssueSerializer

    def pre_save(self, obj):
        obj.attachments = self.request.FILES.get('file')


class LatestRideOrderView(APIView):
    def get(self, request, format=None):
        try:
            obj = RideOrder.objects.latest("id")
        except Exception, e:
            obj = None
            print(e)

        data = {}
        if not obj:
            return Response(data)

        latest = serializers.serialize('json', [obj,])
        if not latest:
            return Response(data)

        try:
            data = json.loads(latest)[0]
        except Exception, e:
            data = {}
            print(e)
        
        return Response(data)
