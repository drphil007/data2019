
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


# LOAD in csv data in pandas dataframe
data = pd.read_csv("input.csv")
print(pd.DataFrame)

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


''' COMPUTE and print the mean, median and mode of the GDP data '''

meand_GDP = GDP_dollars_column.mean()
median_GDP = GDP_dollars_column.median()
mode_GDP = GDP_dollars_column.mode()
std_GDP = GDP_dollars_column.std()

''' PRODUCE a histogram of the GDP data '''




''' COMPUTE and print the Five Number Summary of the Infant Mortality data '''

''' PRODUCE a box plot of the infant mortality data '''

''' WRITE a .json file in the correct format '''