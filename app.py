from flask import Flask,render_template,request,redirect, jsonify
from flask_restful import Resource, Api
from models import db, ProjectDetails
from flask.views import MethodView
import datetime
from sqlalchemy import inspect

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db.init_app(app)

@app.before_first_request
def create_table():
    db.create_all()

class projectdetails(MethodView) :

    def row2dict(self,row):
        d = {}
        for column in row.__table__.columns:
            d[column.name] = str(getattr(row, column.name))

        return d

    def get(self, id=None) :
        plist = []
        if id :
            pdata = ProjectDetails.query.filter_by(id=id)
        else :
            pdata = ProjectDetails.query.all()
        for data in pdata :
            plist.append(self.row2dict(data))
        return {'data' : plist}

    def post(self):
        try :
            name = request.form.get('name', None)
            description = request.form.get('description', None)
            start_date = request.form.get('start_date', None)
            end_date = request.form.get('end_date', None)
            if start_date :
                sdate = datetime.datetime.strptime(start_date,'%Y-%m-%d')
            else :
                sdate = None
            if end_date :
                edate = datetime.datetime.strptime(end_date,'%Y-%m-%d')
            else :
                edate = None
            pdetails = ProjectDetails(name=name, description=description, start_date=sdate, end_date=edate)
            # Flask-SQLAlchemy magic adds record to database
            db.session.add(pdetails)
            db.session.commit()
            print(pdetails)
            return {'success' : True, 'data' : self.row2dict(pdetails)}
        except Exception as e :
            return {'success' : False}

    def put(self, id):
        try :
            name = request.form.get('name', None)
            description = request.form.get('description', None)
            start_date = request.form.get('start_date', None)
            end_date = request.form.get('end_date', None)
            if start_date :
                sdate = datetime.datetime.strptime(start_date,'%Y-%m-%d')
            else :
                sdate = None
            if end_date :
                edate = datetime.datetime.strptime(end_date,'%Y-%m-%d')
            pdetails = ProjectDetails.query.get(id)
            pdetails.name=name
            pdetails.description=description
            pdetails.start_date = sdate
            pdetails.end_date = edate
            db.session.commit()
            pdetails = ProjectDetails.query.get(id)
            return {'success': True, 'data': self.row2dict(pdetails)}
        except Exception as e :
            print(e)
            return {'success' : False}

    def delete(self, id):
        try :
            pdetails = ProjectDetails.query.filter_by(id=id).delete()
            return {'success' : True}
        except Exception as e :
            print(e)
            return {'success' : False}




project_view = projectdetails.as_view('projectdetails')
app.add_url_rule('/projectdetails/api/', defaults={'id': None},view_func=project_view, methods=['GET',])
app.add_url_rule('/projectdetails/api/', view_func=project_view, methods=['POST',])
app.add_url_rule('/projectdetails/api/<int:id>', view_func=project_view, methods=['GET', 'PUT', 'DELETE'])


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/skill')
def skill() :
    return render_template('skillset.html')

@app.route('/education')
def education() :
    return render_template('education.html')

@app.route('/project', methods=['POST','GET'])
def project():
    return render_template('project_details.html')

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

app.run(host='localhost', port=5000, debug=True)