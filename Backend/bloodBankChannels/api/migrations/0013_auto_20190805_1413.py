# Generated by Django 2.2.1 on 2019-08-05 14:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20190727_1522'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isGroup', models.BooleanField(default=False)),
                ('message', models.CharField(max_length=5000)),
                ('time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Logs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('log', models.CharField(max_length=300)),
                ('time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='WSTokens',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='comments',
            name='post',
        ),
        migrations.RemoveField(
            model_name='comments',
            name='user',
        ),
        migrations.DeleteModel(
            name='Notifications',
        ),
        migrations.RenameField(
            model_name='formpost',
            old_name='timestamp',
            new_name='time',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='adhaarNo',
        ),
        migrations.AddField(
            model_name='customuser',
            name='channelName',
            field=models.CharField(blank=True, default=None, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='donationDate',
            field=models.DateField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='address',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='group',
            name='title',
            field=models.CharField(max_length=150),
        ),
        migrations.DeleteModel(
            name='Comments',
        ),
        migrations.AddField(
            model_name='wstokens',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chatdata',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.Group'),
        ),
        migrations.AddField(
            model_name='chatdata',
            name='user1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='User1', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chatdata',
            name='user2',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='User2', to=settings.AUTH_USER_MODEL),
        ),
    ]
