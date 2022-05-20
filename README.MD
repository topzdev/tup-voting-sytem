##How to deploy updates on heroku

###Deploy Server Instruction

- update live database by migration or ormconfig auto migrate
- commit updates
- type 'heroku git:remote -a tup-voting-server-dev'
- deploy the subfolder you want to deploy, type 'git subtree push --prefix server heroku-server-dev master'

---

###Deploy Admin

- commit updates
- type 'heroku git:remote -a tup-voting-admin-dev'
- deploy the subfolder you want to deploy, type 'git subtree push --prefix admin heroku-admin-dev master'

---

###Deploy Voting Platform

- commit updates
- type 'heroku git:remote -a tup-voting-platform-dev'
- deploy the subfolder you want to deploy, type 'git subtree push --prefix web heroku-platform-dev master'
