# Generated by Django 4.1.7 on 2023-05-10 16:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('script', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScriptPage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='Name')),
                ('index', models.IntegerField(verbose_name='Index')),
                ('content', models.TextField(verbose_name='Text')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('script', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='script_pages', to='script.script')),
            ],
        ),
    ]
