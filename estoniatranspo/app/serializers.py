from django.contrib.auth.models import User, Group
from models import RideOrder, Issue
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class RideOrderSerializer(serializers.HyperlinkedModelSerializer):
    # status = serializers.CharField(source='get_status_display')
    class Meta:
        model = RideOrder
        fields = ('id', 'name', 'payment_option', 'direction_option', 'day_chosen', 'time_chosen', 'day_chosen2', 'time_chosen2',
                  'roundtrip', 'current_location_lat', 'current_location_lng', 'current_location_name',
                  'target_location_name', 'target_location_lat', 'target_location_lng', 'status', 'created', 'updated')

class IssueSerializer(serializers.HyperlinkedModelSerializer):
    # status = serializers.CharField(source='get_status_display')
    class Meta:
        model = Issue
        fields = ('id', 'description', 'address', 'reporter', 'created', 'updated', 'status', 'attachments')
