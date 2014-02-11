Simple chat application using node.js, socket.io, jade, and express.

Installation instructions

Debian/Ubuntu/Mint

First, install npm

sudo apt-get install npm

Now, install node

sudo apt-get install node

Download this project, and navigate to the directory you have installed it in. Run the following from the application directory to install socket.io, jade, and express:

npm install

If that doesn't work, attempt a manual install:

npm install socket.io
npm install express
npm install jade

Some of these installs may require root/no root. If the above three still don't work, attempt:

sudo npm install socket.io
sudo npm install express
sudo npm install jade

For the installations which failed. You'll know that it has installed correctly if all of the installer's GET requests return 200 or 304.

Now, adjust your server.js and client/chat.js files such that they point to the desired server or port. If you're testing locally, this should be localhost and 8080. These are already listed in the settings, so configuring these should be as easy as toggling those on if they're off, and toggling other locations off if they're on.

Let's start the server. From your application directory:

node ./server

Now, in a browser navigate to the address specified. If you're testing, that will probably be "http://localhost:8080/" without the quotes.
