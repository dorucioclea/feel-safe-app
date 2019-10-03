#!/bin/bash

JOB_URL=$1
PROJECT_NAME=$2

OUTPUT=$(npm audit)

if [[ $OUTPUT == *"high"* ]]; then
curl -s -X POST \
  https://hooks.slack.com/services/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 \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d "{
    \"channel\": \"i_npm-audit\",
    \"username\": \"npm audit bot\",
    \"icon_emoji\": \":rotating_light:\",
    \"attachments\": [
      {
        \"title\": \"Found security issues in $PROJECT_NAME\",
        \"title_link\": \"$JOB_URL\",
        \"text\": \"Severity: high\",
        \"color\": \"warning\"
      }
    ]
  }" > /dev/null
fi

if [[ $OUTPUT == *"critical"* ]]; then
curl -s -X POST \
  https://hooks.slack.com/services/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 \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d "{
    \"channel\": \"i_npm-audit\",
    \"username\": \"npm audit bot\",
    \"icon_emoji\": \":rotating_light:\",
    \"attachments\": [
    	{
    		\"title\": \"Found security issues in $PROJECT_NAME\",
    		\"title_link\": \"$JOB_URL\",
    		\"text\": \"Severity: critical\",
    		\"color\": \"danger\"
    	}
    ]
  }" > /dev/null
fi
