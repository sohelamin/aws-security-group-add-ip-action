const core = require('@actions/core');
const AWS = require('aws-sdk/global');
const EC2 = require('aws-sdk/clients/ec2');

const region = core.getInput('aws-region', { required: true });
const accessKeyId = core.getInput('aws-access-key-id', { required: true });
const secretAccessKey = core.getInput('aws-secret-access-key', { required: true });
const groupIds = core
  .getInput('aws-security-group-id', { required: true })
  .split(',')
  .map(item => item.trim());
const port = parseInt(core.getInput('port', { required: false }));
const description = core.getInput('description', { required: false });

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});
const ec2 = new EC2();

module.exports = {
  region,
  accessKeyId,
  secretAccessKey,
  groupIds,
  port,
  description,
  ec2,
};
