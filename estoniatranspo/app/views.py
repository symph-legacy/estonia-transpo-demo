# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import requests

from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User, Group
from django.contrib.auth import logout as auth_logout
from django.core import serializers
from django.views.generic import TemplateView, RedirectView

from estoniatranspo.app.serializers import (
    UserSerializer,
    GroupSerializer,
    RideOrderSerializer,
    IssueSerializer
)
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from lxml import etree
from models import RideOrder, Issue, UserProfile
from datetime import datetime, timedelta
from config import XML_PARAM, XML_UPDATE_PARAM

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import BasicAuthentication, TokenAuthentication
from helpers import get_begin_end_time, CustomIsAuthenticatedOrReadOnly, IsCustomReadOrWriteOnly
from api import EcoFleetAPI


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    authentication_classes = (BasicAuthentication,)


class GroupViewSet(viewsets.ModelViewSet):
    """

    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class RideOrderViewSet(viewsets.ModelViewSet):
    queryset = RideOrder.objects.all()
    serializer_class = RideOrderSerializer
    permission_classes = (CustomIsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        r = serializer.save()
        time_chosen, time_chosen_end = get_begin_end_time(r.time_chosen)

        timestamp = '{} {}'.format(r.day_chosen, time_chosen)
        elem = {
            "order_id": r.id,
            "name": r.name.encode('utf-8'),
            "timestamp": datetime.strptime(timestamp, '%d.%m.%Y %H.%M'),
            "driver": "aarelaponin@gmail.com",
            "target_location_name": r.target_location_name.encode('utf-8'),
            "target_location_lat": r.target_location_lat,
            "target_location_lng": r.target_location_lng,
            "time_chosen": time_chosen,
            "time_chosen_end": time_chosen_end
        }

        xml = XML_PARAM.format(**elem)
        ecofleet = EcoFleetAPI(xml=xml)
        first_task_id = ecofleet.add_task()

        task_ids = {}
        task_ids["first_trip_taskid"] = first_task_id

        if r.direction_option.lower() == "roundtrip":
            time_chosen, time_chosen_end = get_begin_end_time(r.time_chosen2)
            location_name = r.second_target_location_name or r.current_location_name
            location_lat = r.second_target_location_lat or r.current_location_lat
            location_lng = r.second_target_location_lng or r.current_location_lng

            elem["target_location_name"] = location_name.encode('utf-8')
            elem["target_location_lat"] = location_lat
            elem["target_location_lng"] = location_lng
            elem["time_chosen"] = time_chosen
            elem["time_chosen_end"] = time_chosen_end

            timestamp = '{} {}'.format(r.day_chosen2, time_chosen)
            elem["timestamp"] = datetime.strptime(timestamp, '%d.%m.%Y %H.%M')

            xml = XML_PARAM.format(**elem)
            second_task_id = ecofleet.add_task(xml)
            task_ids["second_trip_taskid"] = second_task_id

        serializer.save(**task_ids)


    def perform_update(self, serializer):
        r = serializer.save()
        time_chosen, time_chosen_end = get_begin_end_time(r.time_chosen)

        timestamp = '{} {}'.format(r.day_chosen, time_chosen)
        elem = {
            "task_id": r.first_trip_taskid,
            "order_id": r.id,
            "name": r.name.encode('utf-8'),
            "timestamp": datetime.strptime(timestamp, '%d.%m.%Y %H.%M'),
            "driver": "aarelaponin@gmail.com",
            "target_location_name": r.target_location_name.encode('utf-8'),
            "target_location_lat": r.target_location_lat,
            "target_location_lng": r.target_location_lng,
            "time_chosen": time_chosen,
            "time_chosen_end": time_chosen_end
        }

        xml = XML_UPDATE_PARAM.format(**elem)
        ecofleet = EcoFleetAPI(xml=xml)
        ecofleet.update_task()

        if r.direction_option.lower() == "roundtrip":
            time_chosen, time_chosen_end = get_begin_end_time(r.time_chosen2)
            location_name = r.second_target_location_name or r.current_location_name
            location_lat = r.second_target_location_lat or r.current_location_lat
            location_lng = r.second_target_location_lng or r.current_location_lng

            elem["task_id"] = r.second_trip_taskid
            elem["target_location_name"] = location_name.encode('utf-8')
            elem["target_location_lat"] = location_lat
            elem["target_location_lng"] = location_lng
            elem["time_chosen"] = time_chosen
            elem["time_chosen_end"] = time_chosen_end

            timestamp = '{} {}'.format(r.day_chosen2, time_chosen)
            elem["timestamp"] = datetime.strptime(timestamp, '%d.%m.%Y %H.%M'),

            xml = XML_UPDATE_PARAM.format(**elem)

            ecofleet.update_task(xml)


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all().order_by('-created')
    serializer_class = IssueSerializer
    permission_classes = (IsCustomReadOrWriteOnly,)

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


class ProtectedTemplateView(LoginRequiredMixin, TemplateView):
    pass

class LogoutView(RedirectView):
    """
    Provides users the ability to logout
    """
    url = '/login/'

    def get(self, request, *args, **kwargs):
        auth_logout(request)
        return super(LogoutView, self).get(request, *args, **kwargs)