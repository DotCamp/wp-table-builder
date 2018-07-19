# WP Table Builder

Table Builder Plugin for WordPress.

IN DEVELOPMENT. NOT READY TO USE YET.

### → Development: Installing NodeJS, NPM and Gulp

You need to have NodeJS & NPM installed. If it is installed, skip to installing Gulp. Otherwise, download [NodeJS](https://nodejs.org/en/download/) and install it. After installing NodeJS, you can verify the install of both NodeJS and Node Package Manager by typing the following commands. This step needs to be followed only once if you don't have NodeJS installed. No need to repeat it ever again.

```bash
node -v
# Results into v9.11.1

npm -v
# Results into 5.6.0
```

NodeJS and NPM are installed, now we need to install `Gulp` globally. To do that, run the following command

```bash
# Run the following command with super user.
sudo npm install --global gulp

# Or run the following command.
npm install --global gulp
```

### → STEP #4: Installing Node Dependencies

We are in the root folder of our WordPress plugin, let's install the Node Dependencies. In the terminal run this command and wait for it to download all the NodeJS dependencies. It's a one-time process and can take about 5 minutes depending on the internet speed of your connection.

```bash
# Run the following command with super user.
sudo npm install

# Or run the following command.
npm install
```

### → STEP #5: Just run `Gulp`

Once the NodeJS dependencies are downloaded just run the following command to combine the JavaScript Files.

```bash
# To start gulp
gulp

# To stop gulp press CTRL (⌃) + C
```
