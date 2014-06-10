What is dfiltr?
===============

dfiltr is a discussion platform created with the aim of breaking down filter bubbles using the same class of algorithm which is used to create them. By rewarding users for challenging the views of other users in constructive ways, we hope to open minds and generate productive dialectics.

Style Guide
===========

* Use tabs for indentation.
* In general, use the [One True Brace Style](http://en.wikipedia.org/wiki/Indent_style#Variant:_1TBS). Occasionally reducing a block to a single line is okay, if it improves the readability of the code.
* Always brace statements, even single line statements.
* Place a space between nested braces/parentheses, except on lines containing nothing but braces/parentheses.
* In general, place variables at the top of functions, as JavaScript does not have block scope. Break this rule for iterators in loops, but remember to give iterators in nested loops unique names (i, j, k, ii, jj, kk, etc...).
* Use varName += 1 instead of varName++.
* Use camelcase starting with lowercase for variable names.
* Use camelcase starting with uppercase for names of database collections.
* Use lowercase separated with dashes for CSS ids and classes.
* Use uppercase with underscores for constants. 
* Don't rely on semicolon insertion! It was a horrible idea that shouldn't have made it into the language spec.
* The reserved word in a statement (if, for, while, etc...) should touch the opening parenthesis of the expression, and the closing parenthesis of the expression should touch the opening brace of the statement body.
* In general, place a space between any parentheses/braces and their contents. Don't do this if there aren't any contents (e.g., dumb parens) and use discretion for mathematical expressions.
* Try to keep functions small. Any function that's over 30 lines is too long, unless it contains repeated code which isn't trivially reduced with loops. Even 30 lines is pushing it.
* Keep code modular and in separate files. A file that grows beyond 300 lines is getting bulky, and needs to be split up. (Unless doing so would significantly compromise the readability of the code.)
* Use [jshint.com](http://jshint.com) to check your code.
* When in doubt, consult the existing code.
* When still in doubt, consult lectures/texts by Douglas Crockford.
* When *still* in doubt, go ahead and send me an email or [a message on reddit](http://www.reddit.com/u/the8thbit). I don't bite!

Installation
============

Debian/Ubuntu/Mint/Elementary (Debian downstream)
-------------------------------------------------

Install mongodb, node.js and dependencies:
    
    sudo apt-get install mongodb python-software-properties python g++ make git
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs

Navigate to the directory you want to install to. So, for example, if you would like to install to your home directory, run the following command:

    cd ~

Pull down the dfiltr repository from github:

    git clone https://github.com/the8thbit/dfiltr.git

Navigate into the dfiltr repository you just created:

    cd ./dfiltr
    
Install the node packages that dfiltr is dependent on:

    npm install
    
Open your .profile config in a text editor. So, for example, to open .profile in gedit, run the following command:

    gedit ~/.profile
    
Add the following environment variables to your .profile config:

    export DFILTR_NODEJS_IP=localhost
    export DFILTR_NODEJS_PORT=8080

    export DFILTR_COOKIE_SECRET=changethisforaproductionserver

    export DFILTR_MONGO_DB_USER=null
    export DFILTR_MONGO_DB_PASS=null
    export DFILTR_MONGO_DB_IP=localhost
    export DFILTR_MONGO_DB_PORT=27017
    export DFILTR_MONGO_DB_NAME=435

    export DFILTR_PIO_API_KEY=null
    export DFILTR_PIO_API_IP=null
    export DFILTR_PIO_API_PORT=8000

Modify these as appropriate for your setup. These are currently configured for local testing with prediction turned off. To turn prediction on, supply a valid PredictionIO API key and route to the associated PredictionIO server.

Reload your .profile configuration:

    . ~/.profile
    
Start the server from the directory you installed to:

    node ./server.js
    
And finally, navigate to http://localhost:8080 in a web browser. If you'd prefer to route through a different address (e.g. if you want to use this installation remotely) alter the CLIENT CONFIGURATION section in the config.js file in the root directory of the dfiltr repository you just cloned.

Other GNU/Linux or UNIX
-----------------------

Follow the same procedure as above, but instead of pulling down packages from apt-get, build them from source, or install them from your distribution's package manager. The node.js source can be found at [nodejs.org](http://nodejs.org/). Once you've unzipped it run the following commands from the directory you've unzipped it to:

    ./configure
    make
    make install
    
Windows
-------

Install GNU/Linux and then follow one of the two procedures above. If you're looking for a distribution to install, I recommend choosing one of the distros listed on [DistroWatch's top list.](http://distrowatch.com/dwres.php?resource=major) The one's near the top of that list tend to be more user friendly. You can then replace your Windows install with your chosen GNU/Linux distribution by creating a LiveCD/DVD/USB, or, if you'd like to keep Windows installed, you can install GNU/Linux to a virtual machine, such as [VirtualBox](https://www.virtualbox.org/).

License
=======

This project is licensed under the GNU AGPL v3. More information can be found [here.](https://github.com/the8thbit/dfiltr/blob/master/LICENSE.md) If you're unfamiliar with the GNU AGPL, it's basically the same as the GNU GPL, except that the AGPL considers serving output of code remotely (such as from a web server) to be a form of distribution. A human readable description of the AGPL can be found [here.](https://www.gnu.org/licenses/why-affero-gpl.html)
