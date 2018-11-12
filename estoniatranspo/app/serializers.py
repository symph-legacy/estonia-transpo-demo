from django.contrib.auth.models import User, Group
from django.contrib.auth.hashers import make_password
from models import RideOrder, Issue, UserProfile
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        read_only_fields = ('created_at', 'updated_at',)
        exclude = ('user',)

class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer(required=False)
    password = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        depth = 1
        fields = ('url', 'id', 'username', 'password', 'first_name', 'last_name',
                  'email', 'profile')

    def validate_password(self, value):
        return make_password(value)

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        UserProfile.objects.create(user=user, **profile_data)
        return user


    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')

        # Update User data
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)

        try:
            instance.profile.role = profile_data.get('role', instance.profile.role)
            instance.profile.save()
            instance.save()
        except User.profile.RelatedObjectDoesNotExist:
            UserProfile.objects.create(user=instance, **profile_data)

        return instance

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class RideOrderSerializer(serializers.HyperlinkedModelSerializer):
    # status = serializers.CharField(source='get_status_display')
    class Meta:
        model = RideOrder
        fields = ('id', 'name', 'payment_option', 'direction_option', 'first_trip_taskid', 'second_trip_taskid', 'day_chosen', 'time_chosen', 'day_chosen2', 'time_chosen2',
                  'roundtrip', 'current_location_lat', 'current_location_lng', 'current_location_name',
                  'target_location_name', 'target_location_lat', 'target_location_lng',
                  'second_current_location_name', 'second_current_location_lng', 'second_current_location_lat',
                  'second_target_location_name', 'second_target_location_lat', 'second_target_location_lng',
                  'status', 'created', 'updated')

class IssueSerializer(serializers.HyperlinkedModelSerializer):
    # status = serializers.CharField(source='get_status_display')
    class Meta:
        model = Issue
        fields = ('id', 'description', 'address', 'reporter', 'created', 'updated', 'status', 'attachments')

# class LatestRideOrderSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RideOrder
#         fields = [
#             'name'
#         ]
