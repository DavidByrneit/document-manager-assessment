import hashlib
from django.db import models
from django.conf import settings

class FileVersion(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file_name = models.fields.CharField(max_length=512)
    version_number = models.fields.IntegerField()
    file = models.FileField(default=None, upload_to="uploads/",null=True)
    url = models.fields.CharField(default=None,max_length=512,null=True)
    hash_value = models.CharField(max_length=64, editable=False,null=True,default=None)

    def save(self, *args, **kwargs):
        # Open the file in binary mode
        with self.file.open('rb') as f:
            # Compute the hash of the file content
            file_hash = hashlib.sha256()
            if f.multiple_chunks():
                for chunk in f.chunks():
                    file_hash.update(chunk)
            else:
                file_hash.update(f.read())
            self.hash_value = file_hash.hexdigest()
            super().save(*args, **kwargs)