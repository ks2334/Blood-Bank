# Generated by Django 2.1.2 on 2019-02-23 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20190223_1208'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='likes',
            name='post',
        ),
        migrations.RemoveField(
            model_name='likes',
            name='user',
        ),
        migrations.AddField(
            model_name='profilepost',
            name='likes',
            field=models.IntegerField(default=0),
        ),
        migrations.DeleteModel(
            name='Likes',
        ),
    ]
