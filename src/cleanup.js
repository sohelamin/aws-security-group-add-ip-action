const publicIp = require('public-ip');

const config = require('./config');

async function run() {
  try {
    const myPublicIp = await publicIp.v4();

    for (const groupId of config.groupIds) {
      await config.ec2.revokeSecurityGroupIngress({
        GroupId: groupId,
        CidrIp: `${myPublicIp}/32`,
        IpProtocol: config.protocol,
        FromPort: config.port,
        ToPort: config.toPort !== false ? config.toPort : config.port,
      }).promise();
    }

    console.log(`The IP ${myPublicIp} is removed`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
