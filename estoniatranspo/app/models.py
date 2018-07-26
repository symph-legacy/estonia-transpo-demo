# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Ride Order
class RideOrder(models.Model):
    name = models.CharField(max_length=50)
    current_location_name = models.TextField()
    current_location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    current_location_lng = models.DecimalField(max_digits=9, decimal_places=6)
    target_location_name = models.TextField()
    target_location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    target_location_lng = models.DecimalField(max_digits=9, decimal_places=6)
    roundtrip = models.BooleanField()
    status = models.CharField(max_length=30, choices=(
        ('new', 'New'),
        ('directed', 'Directed')
    ))
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

# Issue
class Issue(models.Model):
    description = models.TextField()
    address = models.TextField()
    reporter = models.CharField(max_length=30)
    status = models.CharField(max_length=30, choices=(
        ('new', 'New'),
        ('in_progress', 'In Progress')
    ))
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
