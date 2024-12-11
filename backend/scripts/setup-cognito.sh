#!/bin/bash
aws cognito-idp create-user-pool --pool-name VideoAppUsers --auto-verified-attributes email
