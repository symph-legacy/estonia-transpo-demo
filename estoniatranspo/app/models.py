# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Ride Order
class RideOrder(models.Model):
    name = models.CharField(max_length=50)
    payment_option = models.CharField(max_length=30, choices=(
            ('CHILD', 'Child'),
            ('SUBSIDISED', 'Subsidised'),
            ('REGULAR', 'Regular'),
        ),
        default='CHILD',
        blank=True
    )
    direction_option = models.CharField(max_length=30, choices=(
            ('ROUNDTRIP', 'Roundtrip'),
            ('ONEWAY', 'Oneway')
        ),
        default='ROUNDTRIP',
        blank=True
    )

    day_chosen = models.TextField(default='', blank=True)
    time_chosen = models.TextField(default='', blank=True)
    day_chosen2 = models.TextField(default='', blank=True)
    time_chosen2 = models.TextField(default='', blank=True)
    current_location_name = models.TextField()
    current_location_lat = models.TextField(default='', blank=True)
    current_location_lng = models.TextField(default='', blank=True)
    target_location_name = models.TextField()
    target_location_lat = models.TextField(default='', blank=True)
    target_location_lng = models.TextField(default='', blank=True)
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
