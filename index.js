const core = require('@actions/core');
const publicIp = require('public-ip');
const AWS = require('aws-sdk/global');
const EC2 = require('aws-sdk/clients/ec2');

async function run() {
  try {
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

    const result = await ec2.describeSecurityGroups({
      GroupIds: groupIds,
    }).promise();

    for (const group of result.SecurityGroups) {
      const ruleByPort = group.IpPermissions
        .find(permission => permission.FromPort === port);
      
      if (ruleByPort) {
        const ipByDesc = ruleByPort.IpRanges
          .find(ip => ip.Description === description);

        if (ipByDesc) {    
          await ec2.revokeSecurityGroupIngress({
            GroupId: group.GroupId,
            CidrIp: ipByDesc.CidrIp,
            IpProtocol: 'tcp',
            FromPort: port,
            ToPort: port,
          }).promise();
        }
      }

      const myPublicIp = await publicIp.v4();
      await ec2.authorizeSecurityGroupIngress({
        GroupId: group.GroupId,
        IpPermissions: [{
          IpProtocol: 'tcp', 
          FromPort: port, 
          ToPort: port,
          IpRanges: [{
            CidrIp: `${myPublicIp}/32`, 
            Description: description,
          }], 
        }] 
      }).promise();

      console.log(`The IP ${myPublicIp} is added`);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
