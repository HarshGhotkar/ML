file_path = "frontend/src/api/mockData.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ("gcp-vpc-ingress-proxy", "aws-vpc-ingress-proxy"),
    ("type: 'gcp_armor_security_policy'", "type: 'aws_waf_security_policy'"),
    ("gcloud compute security-policies rules create 1000 --security-policy=cloud-armor-adaptive-waf --src-ip-ranges=198.51.100.0/24,203.0.113.0/24 --action=rate-based-ban --rate-limit-threshold-count=100 --ban-duration-sec=3600",
     "aws wafv2 update-web-acl --name adaptivecloud-rate-limit --scope REGIONAL --default-action Block={}"),
    ("gcloud compute firewall-rules create deny-ddos-botnet --action=DENY --rules=tcp:80,tcp:443 --source-ranges=198.51.100.45/32",
     "aws ec2 authorize-security-group-ingress --group-id sg-028ebbd83cf143b23 --protocol tcp --port 80 --cidr 198.51.100.45/32"),
    ("gcloud compute security-policies rules create 2000 --expression=\"evaluatePreconfiguredExpr(\\'sqli-v33-stable\\')\" --action=deny-403",
     "aws wafv2 update-web-acl --name adaptivecloud-waf --scope REGIONAL --rules file://sqli-rule.json"),
    ("gcloud compute security-policies rules create 2001 --expression=\"evaluatePreconfiguredExpr(\\'cve-can-2021-44228\\')\" --action=deny-403",
     "aws wafv2 update-web-acl --name adaptivecloud-waf --scope REGIONAL --rules file://log4j-rule.json"),
    ("gcloud storage buckets update s3://adaptive-customer-records --uniform-bucket-level-access",
     "aws s3api put-public-access-block --bucket adaptive-customer-records --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"),
    ("if (cleanUrl.includes('/gcp/status')) {", "if (cleanUrl.includes('/aws/status') || cleanUrl.includes('/gcp/status') || cleanUrl.includes('/cloud/status')) {"),
    ("auth_method: 'GCP Service Account ADC (Active)'", "auth_method: 'AWS IAM Role (Instance Profile Active)'"),
    ("cloud_vectors: ['gcp_compute', 'gcp_vpc', 'gcp_iam', 'gcp_storage', 'gke', 'api_gateway']",
     "cloud_vectors: ['aws_ec2', 'aws_vpc', 'aws_iam', 'aws_s3', 'eks', 'api_gateway']"),
    ("STAGE 3: Injected GCP VPC firewall rule: DENY INGRESS 198.51.100.45/32 on port 3389.",
     "STAGE 3: Injected AWS Security Group rule: DENY INGRESS 198.51.100.45/32 on port 3389.")
]

for old, new in replacements:
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("[+] Cleaned all remaining occurrences in mockData.ts!")
