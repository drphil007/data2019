#!/usr/bin/env python
# Name: Philine Wairata
# Student number: 10517863
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import itertools

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":
    # print(data_dict)
 
    x = []
    y = []

    with open('movies.csv','r') as csvfile:
        reader = csv.reader(csvfile)

        # skips header content
        next(reader, None)

        # read only top 50 movies
        for row in itertools.islice(reader, 50):

            rating = row[1]
            year = row[2]

            # converts string data to float and int
            try:
                rating = float(row[1])
                print("true")
            except:
                print(rating)

            try: 
                year = int(row[2])
                print("true")
            except:
                print(year)

            # swith below x and y to see a line-graph, current graph is scatter.
            y.append(rating)
            x.append(year)

    plt.plot(x,y, 'ro')
    # this shows a scatterplot, comment out the above line to see a line-graph
    plt.axis([2007, 2018, 7, 10])

    plt.title('Average Rating IMDB movies 2008-2017')
    plt.xlabel('Year')
    plt.ylabel('Rating')
    plt.show()