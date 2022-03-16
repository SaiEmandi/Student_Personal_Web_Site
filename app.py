from flask import Flask, redirect, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
## Initial the database

db = SQLAlchemy(app)


##Create a model
class ProjectList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    # startDate = db.Column(db.String(1000), nullable=False)
    # endDate = db.Column(db.String(1000), nullable=False)

    # Create a function to return string
    def __repr__(self):
        return '<Name  %r>' % self.id


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/skill')
def skill():
    return render_template('skillset.html')


@app.route('/education')
def education():
    return render_template('education.html')


@app.route('/project', methods=['POST', 'GET'])
def project():
    if request.method == 'POST':
        id = request.form['id']
        name = request.form['name']
        desc = request.form['desc']
        print(id)
        print(name)
        print(desc)
        proj = ProjectList(id=id, name=name, description=desc)
        try:
            db.session.add(proj)
            db.session.commit()
            return redirect('/project')
        except Exception as e:
            print(e)
    projects = ProjectList.query.all()
    print(projects)
    return render_template('project_details_v1.html', project=projects)


@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)
