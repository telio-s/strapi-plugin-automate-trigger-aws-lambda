# Strapi Plugin: Automate Trigger AWS Lambda
A Strapi plugin to automate triggering AWS Lambda functions based on specific events in your Strapi application. This plugin enables seamless integration between Strapi and AWS Lambda, making it easy to trigger serverless functions when certain content types are modified.

## ✨ Requirements
* Strapi: Version 5.x
* AWS Lambda: Ensure your Lambda function is configured to handle incoming payloads.
* AWS IAM Credentials: The access key and secret key must have the necessary permissions to invoke the specified Lambda function.


## 🚀 Features
* Event Triggers Configuration:
  Define custom event triggers by specifying:
    * Trigger name
    * AWS Access Key
    * AWS Secret Key
    * AWS Lambda ARN (Amazon Resource Name)
    * Content type (e.g., Animals)
    * Event type (currently supports afterCreate and beforeCreate)
* Automatic AWS Lambda Invocation:
  Once an event trigger is created, the plugin automatically invokes the specified AWS Lambda function whenever the selected content type is modified as per the defined event type.
* Dynamic Payload Handling:
  The plugin sends the newly created entry as the payload to the AWS Lambda function, enabling dynamic and custom processing in your serverless functions.


## Overview
This plugin simplifies the integration of Strapi with AWS Lambda by automating the process of invoking Lambda functions based on events in your content types
#### How It Works
1. Create an Event Trigger:
   In the plugin's settings, define a new event trigger by providing:
   * A name for the trigger (not unique)
   * AWS IAM credentials (Access Key and Secret Key)
   * The Lambda function's ARN
   * The target content type (e.g., Animals)
   * The event type (e.g., afterCreate)
2. Automated Subscription:
  Once the event trigger is created, the plugin subscribes to the specified event (afterCreate) for the selected content type.
3. Trigger AWS Lambda:
  Whenever a new entry is created in the defined content type (e.g., adding an Animal), the plugin:
  * Collects the newly created entry as a payload
  * Sends the payload to the specified AWS Lambda function

### Usage
1. Install
```
npm i strapi-plugin-automate-trigger-aws-lambda
```
2. Create .env file
```
ENCRYPTION_KEY="Your Key"
```
Required to use ENCRYPTION_KEY variable as a key to encrypt your AWS Access Key

## Screenshots
  <p align="center">
    <img src="./docs/Screenshot 2567-11-27 at 4.35.11 PM.png" alt="UI" width="500" />
  </p>
  <p align="center">
    <img src="./docs/Screenshot 2567-11-27 at 5.23.08 PM.png" alt="UI" width="500" />
  </p>
