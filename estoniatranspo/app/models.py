# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Ride Order
class RideOrder(models.Model):
    name = models.CharField(max_length=30)
    time = models.DateTimeField()
    place = models.CharField(max_length=30)
    roundtrip = models.BooleanField()
    status = models.CharField(max_length=30)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

# Issue
class Issue(models.Model):
    description = models.TextField()
    address = models.TextField()
    reporter = models.CharField(max_length=30)
    status = models.CharField(max_length=30)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
