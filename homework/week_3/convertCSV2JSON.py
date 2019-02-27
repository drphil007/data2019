"""
Name: Philine Wairata
Studentnumber: 10517863

Converts CSV to JSON
"""

import csv
import json
import pandas as pd 

# reads rows from csv and skips header
data = pd.read_csv("input.csv",skiprows=10)

# set variables for columns and clean data
datum_column = data['YYYYMMDD']
datum_column = datum_column.replace(',','.', regex=True).astype(float)

hoogste_windstoot_column = data['FXX']
hoogste_windstoot_column = hoogste_windstoot_column.replace(' ','', regex=True).astype(float)

# NOTE: below is not  the intended solution but a decision made due lack of time. Will be corrected next time.
# set dicionary for json
windstoot_per_datum = {}

# order each datum with hoogste windstoot per column
for index, row in data.iterrows():

    windstoot_per_datum[index] = {}

    try: 
        windstoot_per_datum[index].update({"datum: " : datum_column[index]})
    except ValueError:
        windstoot_per_datum[index].update({"datum: " : "TEST"})
    
    try: 
        windstoot_per_datum[index].update({"hoogeste_windstoot: " : hoogste_windstoot_column[index]})
    except ValueError:
        windstoot_per_datum[index].update({"hoogste_windstoot: " : "TEST"})

# write data to json file
with open('data_test.json', 'w') as outfile:
    json.dump(windstoot_per_datum, outfile, indent=4, separators=(',', ': '))