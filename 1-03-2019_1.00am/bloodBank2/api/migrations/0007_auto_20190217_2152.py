# Generated by Django 2.1.5 on 2019-02-17 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20190211_2150'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='adhaarNo',
            field=models.CharField(default='', max_length=16, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='education',
            field=models.CharField(default='', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='officeAddress',
            field=models.CharField(default='', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='profession',
            field=models.CharField(default='', max_length=30, null=True),
        ),
    ]
