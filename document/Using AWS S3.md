# Using AWS S3

## Create AWS S3 bucket

create s3 bucket as cs732-uoa-230326 through AWS console or CLI

```sh
aws s3api create-bucket \
    --bucket cs732-uoa-230326 \
    --region ap-southeast-2 \
    --create-bucket-configuration LocationConstraint=ap-southeast-2
```

## Create AWS user and configure the user with S3 permission

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::cs732-uoa-230326",
        "arn:aws:s3:::cs732-uoa-230326/*"
      ]
    }
  ]
}
```

## Allow Pubic Read for S3 bucket

set the Bucket policy to the following

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cs732-uoa-230326/*"
    }
  ]
}
```

## Create accessKey and Secrets

create accesskey and secrets for the user allowing access from code and configure the credentials in .dev

```js
#Configure AWS S3 Secrets
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

```

## install s3client in nodejs

```sh
npm install @aws-sdk/client-s3 --workspace backend
npm install @aws-sdk/s3-request-presigner --workspace backend
```
