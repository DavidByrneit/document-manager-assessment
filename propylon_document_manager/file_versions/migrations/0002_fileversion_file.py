# Generated by Django 4.1.9 on 2023-12-19 20:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("file_versions", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="fileversion",
            name="file",
            field=models.FileField(default=None, upload_to="uploads/",null=True),
        ),
    ]
