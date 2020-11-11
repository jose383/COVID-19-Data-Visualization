# COVID-19 Data

COVID-19 Data Visualization using D3 Library

## Getting Started

1) Clone the github repository to a local folder

2) Create a new branch with any name followed by your name and use that branch, for example dev-jose, graphs-jose, query-jose, etc. This line is shortcut to create and use the branch ```git checkout -b graphs-jose```

3) code, fix, or whatever you want to do. Don't hesitate to commit to the created branch, it is yours and no one will mess with your files and you won't affect the main branch.

**Remember** We never work on the Main Branch even if it is our own repository. Branches get merged later once it is done and working fine. Once the branch is merged to Main, it is recommended to delete the branch and create new one from Main to work on another feature. DON'T create a Branch from your previous branch, otherwise it will cause conflicts because the Main branch is the one with the updates from other people and you would be working on an very outdated version.[Learn more about Branches here!](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

## Running the Web App

For D3 to work:

If using [Visual Studio Code](https://code.visualstudio.com/), download the Live Server Package and use it to run the ```index.html``` file

If using [Webstorm](https://www.jetbrains.com/webstorm/), run the ```index.html``` file from the browser icons (Chrome, Firefox, etc) inside Webstorm. This will automatically create a server for you, no need of installing anything else.

For Node.js no need of anything else since it already works as a server. But for now I recommend not using the JavaScript with Node so you don't have to spend more time debbuging your code.

If using another text editor without server features. One simple way to create a server is to use Python

Simpy run this command where the ```index.html``` file is located:

- For Python 2 - ```python -m SimpleHTTPServer 8000```

- For Python 3 - ```python -m http.server 8000```

Then open a web browser at [http://localhost:8000/](http://localhost:8000/).

