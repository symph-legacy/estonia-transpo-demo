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
    class Meta:
        model = RideOrder
        fields = ('id', 'name', 'time', 'place', 'roundtrip', 'status', 'created', 'updated')

class IssueSerializer(serializers.HyperlinkedModelSerializer):
    status = serializers.CharField(source='get_status_display')
    class Meta:
        model = Issue
        fields = ('id', 'description', 'address', 'reporter', 'status', 'created', 'updated')
