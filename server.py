import psycopg2
from flask import Flask
from flask import render_template
from flask import url_for
from flask import jsonify
from flask import send_from_directory


app = Flask(__name__)

@app.route("/", methods=["GET"])
def root():
    return render_template("index.html")

@app.route("/test", methods=["GET"])
def test():
    return render_template("test.html")

@app.route("/api/static/<path:file>", methods=["GET"])
def get_static_file(file):
    return send_from_directory('static', file)

@app.route("/api/problems/<var_id>")
def gen_test(var_id):
    cursor.execute('select * from variants where id={}'.format(var_id))
    var_res = list(cursor.fetchone())
    problems_id_str = ''
    for i in var_res[2]:
        problems_id_str += ' id={} or'.format(i)
    problems_id_str = problems_id_str[:-3]
    cursor.execute('select * from problems where' + problems_id_str)
    problems = cursor.fetchall()
    var_res[2] = problems
    response = jsonify({"status": 200, "result": var_res[2]})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return response

if __name__ == "__main__":
    conn = psycopg2.connect(dbname='phystrain', user='newuser', password='password', host='localhost')
    cursor = conn.cursor()

    app.run(host="0.0.0.0", port=5000)

    cursor.close()
    conn.close()
