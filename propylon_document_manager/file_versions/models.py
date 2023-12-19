from django.db import models

class FileVersion(models.Model):
    file_name = models.fields.CharField(max_length=512)
    version_number = models.fields.IntegerField()
    file = models.FileField(default=None, upload_to="uploads/",null=True)
    url = models.fields.CharField(default=None,max_length=512,null=True)
    