#!/bin/bash
aws s3api create-bucket --bucket video-upload-bucket --region us-east-1
aws s3api put-bucket-cors --bucket video-upload-bucket --cors-configuration file://cors.json
