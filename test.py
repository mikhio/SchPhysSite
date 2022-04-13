import psycopg2
conn = psycopg2.connect(dbname='phystrain', user='newuser', 
                        password='password', host='localhost')
cursor = conn.cursor()

cursor.execute('select * from variants where id=1')
result = list(cursor.fetchone());
print(result)
cursor.close()
conn.close()

