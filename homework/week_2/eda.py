
"""
Student: Philine Wairata
Number: 10517863
Course: Data Processing Uva 2019

Exploroatory Data Analysis 

"""
import sys
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json

from numpy import percentile


# LOAD in csv data in pandas dataframe
data = pd.read_csv("input.csv")


''' CLEAN and precprocess data '''
# convert Infant column to float and replace missing values 

infant_mortailty_column =  data['Infant mortality (per 1000 births)']
infant_mortailty_column =  infant_mortailty_column.replace(',','.', regex=True).astype(float)
infant_mortailty_column =  infant_mortailty_column.replace(np.nan, 0)

# convert GDP column and replace missing values
GDP_dollars_column = data['GDP ($ per capita) dollars']
GDP_dollars_column = GDP_dollars_column.replace('unknown', '0', regex=True)
GDP_dollars_column = GDP_dollars_column.replace(np.nan, 0)
GDP_dollars_column = GDP_dollars_column.replace('dollars','', regex=True).astype(float)

# set names for other clean columns
country = data['Country']
region = data['Region']
population = data['Pop. Density (per sq. mi.)']



''' COMPUTE and print the mean, median and mode of the GDP data '''

meand_GDP = GDP_dollars_column.mean()
median_GDP = GDP_dollars_column.median()
mode_GDP = GDP_dollars_column.mode()
std_GDP = GDP_dollars_column.std()

print("GDP data, mean , median and mode")
print("mean:   ", meand_GDP)
print("median: ", median_GDP)
print("mode:   ", mode_GDP)
print('\n')



''' PRODUCE a histogram of the GDP data '''

# set bins for gdp value and mean, median, mode and std
bin_gdp = np.arange(start=0, stop=30000, step=1000)
bin_gdp_other = np.arange(start=0, stop=30000, step=1000)

# set details for plot histogram
# plt.hist([GDP_dollars_column], bins=bin_gdp, color='lightblue', label='GDP', ec='black')
# plt.hist(meand_GDP, bins=bin_gdp_other, color='red', label='mean')
# plt.hist(median_GDP, bins=bin_gdp_other, color='purple', label='median')
# plt.hist(mode_GDP, bins=bin_gdp_other, color='blue', label='mode')
# plt.hist(std_GDP, bins=bin_gdp_other, color='green', label='std')
# plt.title('GDP ($ per capita) dollars')
# plt.xlabel('dollars')
# plt.ylabel('per capita')
# plt.legend(loc='upper right')
# plt.show()



''' COMPUTE and print the Five Number Summary of the Infant Mortality data '''

minimum_infant_mortality = infant_mortailty_column.min()
first_quartile_infant_mortality = percentile(infant_mortailty_column, 25)
median_infant_mortality = infant_mortailty_column.median()
third_quartile_infant_mortality = percentile(infant_mortailty_column, 75)
maximum_infant_mortailty = infant_mortailty_column.max()

print("Five Number Summary of Infant Mortality Data")
print("min:            ",minimum_infant_mortality)
print("first quartile: ",first_quartile_infant_mortality)
print("median:         ",median_infant_mortality)
print("third quartile: ",third_quartile_infant_mortality)
print("max:            ",maximum_infant_mortailty)
print("\n")

inf_mortality_data = [minimum_infant_mortality, first_quartile_infant_mortality, median_infant_mortality, third_quartile_infant_mortality, maximum_infant_mortailty]



''' PRODUCE a box plot of the infant mortality data '''

bin_ifm = np.arange(start=0, stop=200, step=25)
plt.boxplot(inf_mortality_data)
plt.show()



''' WRITE a .json file in the correct format '''

# set diciontaries for json file 
dictionary_all = {}
dict_details = {}
default = {}

# add details per country to dictionary per row in dataframe
for index,row in data.iterrows():

    dict_details[index] = {}

    # write country per data row to dictionary
    try:
        dict_details[index].update({"Region" : region[index]})
    except: 
        dict_details[index].update({"Region" : "Default"})

    # write pop density per row to dictionary
    try:
        dict_details[index].update({"Pop. Density (per sq. mi.) " : population[index]})
    except:
        dict_details[index].update({"Pop. Density (per sq. mi.) " : 0.0})

    # write infant mortality per row to dictionary
    try:
        dict_details[index].update({"Infant mortaility (per 1000 births)": infant_mortailty_column[index]})
    except:
        dict_details[index].update({"Infant mortaility (per 1000 births)": 0.0})
    
    # write GDP per row to dictionary
    try:
        dict_details[index].update({"GDP ($ per capita) dollars": GDP_dollars_column[index]})
    except: 
        dict_details[index].update({"GDP ($ per capita) dollars": 0.0})
    
    # write details per country to dictionary
    try:
        dictionary_all.update({country[index] : dict_details[index]})
    except: 
        dictionary_all.update({country[index] : default})
print("\n")

# write dictionary to json file
with open('data.json', 'w') as outfile:
    json.dump(dictionary_all, outfile, indent=4, separators=(',', ': '))