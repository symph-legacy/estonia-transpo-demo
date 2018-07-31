# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-07-31 06:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_auto_20180731_0641'),
    ]

    operations = [
        migrations.AlterField(
            model_name='issue',
            name='status',
            field=models.CharField(choices=[('new', 'New'), ('in_progress', 'In Progress')], max_length=30),
        ),
        migrations.AlterField(
            model_name='rideorder',
            name='status',
            field=models.CharField(choices=[('new', 'New'), ('directed', 'Directed')], max_length=30),
        ),
    ]