# Admin vs. Node DID Demo (using Recon)
This repository goes hand-in-hand with our YouTube video walk-through on the differences between your node DID (the identifier your node uses to authenticate to the anchor service) and your admin DID (used to authenticate to the Ceramic node itself for admin operations, including deploying models).

This demo uses the rust implementation of Ceramic.

The major themes we will cover are:

1. Guided Ceramic node setup (using Ceramic-One, i.e. our Rust implementation)
2. Where your admin DID vs node DID live in your server configurations
3. How to access mainnet

## Getting Started

We will be using this repository for the demo to automate some parts of the process. To get started:

```bash
git clone https://github.com/ceramicstudio/did-demo && cd did-demo && npm install
```

## Node Setup
This workshop will use our [rust-ceramic](https://github.com/ceramicnetwork/rust-ceramic) implementation

You can find our external Rust-Ceramic instructions [here](https://threebox.notion.site/Ceramic-Recon-instructions-EXTERNAL-c2b93b2648d64cf0af0f4d2489d20399).

Assuming we will all be operating on macs, open a new terminal and:

1. Install nvm (if not already installed)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

2. Select node v20:

```bash
nvm install v20
nvm use 20
```

3. Install js-ceramic (with nighly builds):

```bash
npm install --location=global @ceramicnetwork/cli@nightly
```

4. Download Rust-Ceramic from binary distribution:

#### MacOS

```bash
curl -LO https://github.com/ceramicnetwork/rust-ceramic/releases/download/v0.13.0/ceramic-one_aarch64-apple-darwin.tar.gz
tar zxvf ceramic-one_aarch64-apple-darwin.tar.gz
```

Open Finder, double click the `ceramic-one.pkg` file to start the install

 After installation, copy the binary:

```bash
sudo cp /Applications/ceramic-one /usr/local/bin/
```

#### Linux

```bash
curl -LO https://github.com/ceramicnetwork/rust-ceramic/releases/download/v0.13.0/ceramic-one_x86_64-unknown-linux-gnu.tar.gz
tar zxvf ceramic-one_x86_64-unknown-linux-gnu.tar.gz
dpkg -i ceramic-one.deb
```

5. Generate your server configuration and admin/node DID credentials:

```bash
npm run generate
```

This uses the [commands script](commands.mjs) I've created for you to set up your server configuration found at daemon.config.json, as well as two txt files containing credentials we'll use later on.

6. Start up a Postgres instance in Docker (needed when accessing mainnet):

```bash
npm run postgres
```

7. Start Ceramic-One (the Rust implementation) first before your js-Ceramic process:

```bash
npm run ceramic-one
```

8. Verify your email address and register your node did (found in node_did.txt) so your js-Ceramic process can access the anchor service:

```bash
# a. Verifying email address
curl --request POST \
  --url https://cas.3boxlabs.com/api/v0/auth/verification \
  --header 'Content-Type: application/json' \
  --data '{"email": "youremailaddress"}'

# b. Registering your node DID
curl --request POST \
  --url https://cas.3boxlabs.com/api/v0/auth/did \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "youremailaddress",
	  "otp": "youronetimepasscode",
	  "dids": [
		  "yourdid"
	  ]
  }'
```

9. Finally, you can start your js-Ceramic process:

```bash
npm run ceramic
```

10. In a new terminal, store the value found in admin_seed.txt in an environment variable (this is the same seed that instatiated the did:key found in the admin-dids array in your server configuration).

```bash
read -s DID_PRIVATE_KEY #paste in the key from the previous command and hit enter
export DID_PRIVATE_KEY
```

Check to make sure your admin seed has been saved in that terminal instance as an environment variable:

```bash
printenv DID_PRIVATE_KEY
```

11. Finally, you can deploy your composites onto your node: 

```bash
composedb composite:deploy composites.json
```

## Learn More

To learn more about Ceramic please visit the following links

- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.

You can check out the [Create Ceramic App repo](https://github.com/ceramicstudio/create-ceramic-app) and provide us with your feedback or contributions!
