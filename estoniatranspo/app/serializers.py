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
        fields = ('name', 'time', 'place', 'roundtrip', 'status')

class IssueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Issue
        fields = ('description', 'address', 'reporter', 'status')
