#!/usr/bin/env python
# Name: Philine Wairata
# Student number: 10517863
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'

# variables needed for extraction and saving
titel = []
ratings = []
release = []
actor = []
runtime = []

movies = []

def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # extract movie title
    movieTitel = dom.findAll('h3',attrs={"class":"lister-item-header"})
    for i in movieTitel:
        for j in i.find_all('a'):
            # print(j.text)
            if j.text is not None:
                titel.append(j.text)
            else:
                titel.append("The Default title")
   
    #print(titel)

    # extract movie rating
    movieRating = dom.findAll('div',attrs={"class":"inline-block ratings-imdb-rating"})
    rating = [x['data-value'] for x in movieRating]
    for i in rating:
        # print(i)
        if i is not None:
            ratings.append(float(i))
        else:
            ratings.append(10)

    # extract year of release
    movieRelease = dom.findAll('span',attrs={"class":"lister-item-year text-muted unbold"})
    for i in movieRelease:
        # print(i.text)
        year = i.text
        if year is not None:
            # make sure to remove unicode or other 
            year = re.sub('[()I]', '', year)
            #print(year)
            release.append(int(year))
        else:
            release.append(2017)
      
    # extract actor/actresses 
    movieStars = dom.findAll('p', attrs={"class":""})
    for i in movieStars:
        for j in i.find_all('a',href=re.compile("st")):
            # print(j.text)
            if j.text is not None:
                actor.append(j.text)
            else:
                actor.append("P.Wairata")

    #print(actor)

    # extract runtime 
    movieRuntime = dom.findAll('span',attrs={"class":"runtime"})
    for i in movieRuntime:
            # print(i.text)
            if i.text is not None:
                runtime.append(i.text)
            else:
                runtime.append(120)

    return titel, ratings, release, actor, runtime


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # get returns from extract_movies
    movies = extract_movies(dom)
    #print(movies)

    # counter for writing actos to csv
    n = 0
    
    # writes data to correct columns and rows in csv
    for i in range(len(titel)):
        
        # makes sure all four actors from html get in one row
        try:
            actor_1 = actor[i+n]
            actor_2 = actor[i+1+n]
            actor_3 = actor[i+2+n]
            actor_4 = actor[i+3+n]
        except:
            print("actor test")

        # all actors for one movie
        actors_movie = actor_1, actor_2, actor_3, actor_4
        
        # puts all details of one movie on one row
        row = ([titel[i], ratings[i], release[i], actors_movie, runtime[i]])
        writer.writerow(row)
        
        # counter for actors
        try:
            n = n + 3
        except:
            print("no more actors")

    
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)