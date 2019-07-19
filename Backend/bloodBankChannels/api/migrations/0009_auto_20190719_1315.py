# Generated by Django 2.2.3 on 2019-07-19 13:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20190223_1345'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='hasChatPrivilege',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='customuser',
            name='privilgeLevel',
            field=models.IntegerField(default=2),
        ),
        migrations.AddField(
            model_name='group',
            name='admin',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subadmin_user', to=settings.AUTH_USER_MODEL),
        ),
    ]