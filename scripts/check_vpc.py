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

vpcs = ec2.describe_vpcs(Filters=[{"Name": "isDefault", "Values": ["true"]}])["Vpcs"]
if vpcs:
    default_vpc = vpcs[0]["VpcId"]
    print(f"Default VPC: {default_vpc}")
    subnets = ec2.describe_subnets(Filters=[{"Name": "vpc-id", "Values": [default_vpc]}])["Subnets"]
    for s in subnets:
        print(f"  Subnet: {s['SubnetId']} ({s['AvailabilityZone']})")
else:
    print("No default VPC found!")
