const core = require('@actions/core');
const publicIp = require('public-ip');

const config = require('./config');

async function run() {
  try {
    const result = await config.ec2.describeSecurityGroups({
      GroupIds: config.groupIds,
    }).promise();

    for (const group of result.SecurityGroups) {
      const ruleByPort = group.IpPermissions
        .find(permission => {
            if ( config.toPort !== false ) {
                return permission.FromPort === config.port
                    && permission.ToPort === config.toPort
                    && permission.IpProtocol === config.protocol;
            }

            return permission.FromPort === config.port && permission.IpProtocol === config.protocol;
        });

      if (ruleByPort) {
        const ipByDesc = ruleByPort.IpRanges
          .find(ip => ip.Description === config.description);

        if (ipByDesc) {
          await config.ec2.revokeSecurityGroupIngress({
            GroupId: group.GroupId,
            CidrIp: ipByDesc.CidrIp,
            IpProtocol: config.protocol,
            FromPort: config.port,
            ToPort: config.toPort !== false ? config.toPort : config.port,
          }).promise();
        }
      }

      const myPublicIp = await publicIp.v4();
      await config.ec2.authorizeSecurityGroupIngress({
        GroupId: group.GroupId,
        IpPermissions: [{
          IpProtocol: config.protocol,
          FromPort: config.port,
          ToPort: config.toPort !== false ? config.toPort : config.port,
          IpRanges: [{
            CidrIp: `${myPublicIp}/32`,
            Description: config.description,
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
