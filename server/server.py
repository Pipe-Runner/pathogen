#!/usr/bin/python3
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from sqlalchemy import create_engine
import json
from flask_cors import CORS
import urllib2
import random

db_connect = create_engine('sqlite:///chinook.db')
app = Flask(__name__)
api = Api(app)
CORS(app)
GOOGLE = 'AIzaSyBiNfMAYS471tn8hxoNkoaK-dZAfYyU1Gs'
CAP_SIZE = 50

class NearBy(Resource):
    def get(self):
        dic = {}
        dic['dad'] = "bikram"
        return jsonify(dic)

    def cleanMe(self,data,meds):
        clean_shops = []

        if data["status"] == "ZERO_RESULTS":
            return []
        
        for m in data['results']:
            clean_shops.append({ "name":m["name"],"location": str(m["geometry"]["location"]["lat"])+","+str(m["geometry"]["location"]["lng"]) })

        print "****************CLEAN SHOPS",data,clean_shops
        
        for m in range(len(meds)):
            randi=list(set(random.sample(range(0,len(clean_shops)-1),random.randint( 0 ,len(clean_shops)-1))))
            randi.sort()
            meds[m]["avail"] = [clean_shops[i] for i in randi]
        return meds

    def post(self):
        print(request.json)
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        radius = str(request.json['radius']*1000)
        lat = str(request.json['lat'])
        lon = str(request.json['lon'])
        meds = request.json['meds']
        uri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius="+radius+"&type=pharmacy&key="+GOOGLE+"&location="+lat+","+lon
        req = urllib2.Request(uri, None, headers)
        data = urllib2.urlopen(req)
        data = json.load(data)
        return jsonify( self.cleanMe(data,meds) )

class Substitute(Resource):
    def cleanMe(self,data):
        cleaned_data = []
        for i in data["alternatives"]:
            cleaned_data.append( { "name":i["name"], "mrp":i["mrp"], "size":i["size"], "manufacturer":i["manufacturer"], "unitPrice":i['unitPrice'],"truemdId":i["truemdId"],"pForm":["pForm"] } )
        cleaned_data.sort(key=lambda x: x['unitPrice'])
        return cleaned_data[0:CAP_SIZE]

    def post(self):
        print(request.json)

        mdCode = request.json['mdCode']
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        uri = "http://www.truemd.in/api/v2/medicines/"+mdCode+"/alternatives.json"
        req = urllib2.Request(uri, None, headers)
        data = urllib2.urlopen(req)
        data = json.load(data)
        cleaned_data = self.cleanMe(data)
        return jsonify(cleaned_data)

class KeywordSearch(Resource):
    # Get Not needed
    def get(self):
        keywd="cro"  #get keyword from json request  request.json["mdCode"]
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        req = urllib2.Request('http://www.truemd.in/api/v2/medicines.json?search='+keywd, None, headers)
        data = urllib2.urlopen(req)
        data = json.load(data)
        return jsonify(data)

    def post(self):
        print(request.json)
        keywd= request.json["search"] #"cro"  #get keyword from json request  request.json["mdCode"]
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        req = urllib2.Request('http://www.truemd.in/api/v2/medicines.json?search='+keywd, None, headers)
        data = urllib2.urlopen(req)
        data = json.load(data)
        return jsonify(data)


class Employees(Resource):
    def get(self):
        conn = db_connect.connect() # connect to database
        query = conn.execute("select * from employees") # This line performs query and returns json result
        return {'employees': [i[0] for i in query.cursor.fetchall()]} # Fetches first column that is Employee ID
    
    def post(self):
        conn = db_connect.connect()
        print(request.json)
        LastName = request.json['LastName']
        FirstName = request.json['FirstName']
        Title = request.json['Title']
        ReportsTo = request.json['ReportsTo']
        BirthDate = request.json['BirthDate']
        HireDate = request.json['HireDate']
        Address = request.json['Address']
        City = request.json['City']
        State = request.json['State']
        Country = request.json['Country']
        PostalCode = request.json['PostalCode']
        Phone = request.json['Phone']
        Fax = request.json['Fax']
        Email = request.json['Email']
        query = conn.execute("insert into employees values(null,'{0}','{1}','{2}','{3}', \
                             '{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}', \
                             '{13}')".format(LastName,FirstName,Title,
                             ReportsTo, BirthDate, HireDate, Address,
                             City, State, Country, PostalCode, Phone, Fax,
                             Email))
        return {'status':'success'}

    
class Tracks(Resource):
    def get(self):
        conn = db_connect.connect()
        query = conn.execute("select trackid, name, composer, unitprice from tracks;")
        result = {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}
        return jsonify(result)

    
class Employees_Name(Resource):
    def get(self, employee_id):
        conn = db_connect.connect()
        query = conn.execute("select * from employees where EmployeeId =%d "  %int(employee_id))
        result = {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}
        return jsonify(result)



api.add_resource(KeywordSearch,'/search')
api.add_resource(Employees, '/employees') # Route_1
api.add_resource(Tracks, '/tracks') # Route_2
api.add_resource(Employees_Name, '/employees/<employee_id>') # Route_3
api.add_resource(Substitute, '/substitute') 
api.add_resource(NearBy, '/nearby')

if __name__ == '__main__':
     app.run(host="0.0.0.0",debug=True)
