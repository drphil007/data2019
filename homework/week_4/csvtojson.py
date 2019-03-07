'''
Student: Philine Wairata
Number: 10517863

Converts csv file to json
'''

import csv
import json

csv_file = open("data_week4.csv", 'r')
json_file = open("data_week4.json", 'w')

column_names = ("Location","INDICATOR","SUBJECT","MEASURE", "FREQUENCY", "TIME", "Value", "Flag Codes")
reader = csv.DictReader( csv_file, column_names)

json_file.write('[')
for row in reader:

    json.dump(row, json_file)
    json_file.write(',')
    json_file.write('\n')

json_file.write(']')
