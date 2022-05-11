###How to deploy updates on heroku

- commit updates
- type 'heroku git:remote -a tup-voting-server-dev'
- deploy the subfolder you want to deploy, type 'git subtree push --prefix dev heroku-server-dev master'
