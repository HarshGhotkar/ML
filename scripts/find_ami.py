import os
from pathlib import Path
from dotenv import load_dotenv
import boto3

load_dotenv(Path(__file__).resolve().parent.parent / ".env.aws")

ec2 = boto3.client(
    "ec2",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_DEFAULT_REGION", "ap-south-1"),
)

# Find latest official Ubuntu 24.04 LTS AMI in ap-south-1
res = ec2.describe_images(
    Filters=[
        {"Name": "name", "Values": ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]},
        {"Name": "state", "Values": ["available"]},
    ],
    Owners=["099720109477"],  # Canonical
)

images = sorted(res["Images"], key=lambda x: x["CreationDate"], reverse=True)
if images:
    latest = images[0]
    print(f"Latest Ubuntu AMI: {latest['ImageId']} ({latest['Name']})")
else:
    print("No Ubuntu AMI found, falling back...")
