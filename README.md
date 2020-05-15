# AWS Security Group Add IP action

This action will add your public ip address to your given aws security group(s) with a description.
If any ip address already exists with the description then it will update the address.

## Inputs

### `aws-access-key-id`

**Required** AWS Access Key ID.

### `aws-secret-access-key`

**Required** AWS Secret Access Key.

### `aws-region`

**Required** AWS Region.

### `aws-security-group-id`

**Required** AWS Security Group (comma separated if multiple).

### `port`

The port which you want to allow. Default `"22"`.

### `description`

The descriptipn of your IP permission. Default `"GitHub Action"`.

## Example usage
```
uses: actions/aws-security-group-add-ip@master
with:
  aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
  aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  aws-region: ${{ secrets.AWS_REGION }}
  aws-security-group-id: ${{ secrets.AWS_SECURITY_GROUP_ID }}
  port: '22'
  description: 'GitHub Action'
```
