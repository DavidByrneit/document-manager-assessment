# Generated by Django 4.1.9 on 2023-12-19 21:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("file_versions", "0002_fileversion_file"),
    ]

    operations = [
        migrations.AddField(
            model_name="fileversion",
            name="url",
            field=models.CharField(default=None, max_length=512, null=True),
        ),
    ]