import boto3
import os
from botocore.exceptions import ClientError

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)

def upload_file_to_s3(file_obj, bucket, object_name=None):
    if object_name is None:
        object_name = file_obj.filename
    try:
        s3_client.upload_fileobj(file_obj, bucket, object_name)
        return True
    except ClientError:
        return False

def download_file_from_s3(bucket, object_name, file_path):
    try:
        s3_client.download_file(bucket, object_name, file_path)
        return True
    except ClientError:
        return False

def list_files_in_s3(bucket, prefix=''):
    try:
        response = s3_client.list_objects_v2(Bucket=bucket, Prefix=prefix)
        return [obj['Key'] for obj in response.get('Contents', [])]
    except ClientError:
        return []

def delete_file_from_s3(bucket, object_name):
    try:
        s3_client.delete_object(Bucket=bucket, Key=object_name)
        return True
    except ClientError:
        return False