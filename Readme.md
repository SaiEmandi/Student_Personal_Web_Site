Install Python 3.x Version

create a virtual env using below command
virtualenv <env name>
how to Activate : source <env name>/scripts/activate

pip packages:
flask==2.0.3
flask-sqlalchemy==2.5.1

To create the DB and Tables :
first we need to go to python console (i used git bash for python console)
winpty python(this command need to run in git bash for python console)

from app import db
db.create_all()


To start the server:

export FLASK_APP=app.py
flask run