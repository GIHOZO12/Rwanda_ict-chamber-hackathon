# Generated by Django 5.2.1 on 2025-05-17 11:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managementsystem', '0002_governmentagency_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='governmentagency',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='government_agency', to=settings.AUTH_USER_MODEL),
        ),
    ]
