import os
import sys
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env.aws"
if not env_path.exists():
    print(f"Error: {env_path} not found.")
    sys.exit(1)

load_dotenv(env_path)

import boto3

try:
    sts = boto3.client(
        "sts",
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
        region_name=os.environ.get("AWS_DEFAULT_REGION", "ap-south-1"),
    )
    identity = sts.get_caller_identity()
    print("SUCCESS: Authenticated to AWS successfully!")
    print(f"  Account ID : {identity.get('Account')}")
    print(f"  User/Role  : {identity.get('Arn')}")
    print(f"  Region     : {os.environ.get('AWS_DEFAULT_REGION', 'ap-south-1')}")
except Exception as e:
    print(f"FAILED: Could not authenticate to AWS: {e}")
    sys.exit(1)
