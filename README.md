# Chalkboard
Chalkboard is a place to categorize, share, search for, and reference back to your learning resources like tutorials, blogs, and videos - essentially, a `Pinterest for Learners`. Post your own resources, or _like_ other's. Search for resources via the search bar (by title and description) or by filtering by topic. This app makes it easier to keep everything in one central, publically available place, at your fingertips.

## Getting Started
These instructors will get you a copy of the project up and running on your local machine for development and testing purposes.

### Dependencies
Dependencies for this project include:
* Node 5.10.x or above
* NPM 3.8.x or above

### Installing 
1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the `.env` file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
6. Check the migrations folder to see what gets created in the DB
7. Run the seed: `npm run knex seed:run`
8. Check the seeds file to see what gets seeded in the DB

### Running the App
To start the app, run the server: `npm run local` and then visit `http://localhost:8080/`. Hope it works! 

## Project Details
The following sections describe the project details - goals, stack, requirements, user stories, etc. This knowledge is not necessary to run the app. 

### Goal
* Build a web app from start to finish using the tech and approaches learned to date
* Turn requirements into a working product
* Practice architecting an app in terms of UI/UX, Routes/API and Database
* Manage a multi-developer project with git
* Simulate the working world where you do not always get to completely cherry pick your team, stack or product features
* Practice demoing an app to help prepare for the final project and employer interviews

### Stack Requirements
The purpose of this project was to include the following stack:
* ES6 for server-side (Node) code
* ES5 for front-end code
* Node
* Express (including RESTful routes. Note: using AJAX or complete SPA approach is optional)
* One of the following two CSS grid and UI frameworks: Bootstrap 3 or Zurb Foundation 5
* jQuery
* SASS for styling
* PostgreSQL for DB
* Knex.js for querying and migrations
* git for version control
* heroku for hosting (hosting is optional)

### Project Requirements
Users should be able to do the following in the app:
* Save an external URL along with a title and description
* Search for already-saved resources created by any user
* Categorize any resource under a topic
* Comment on any resource
* Rate any resource
* Like any resource
* View all their own and all liked resources on one page ("My resources")
* Register, log in, log out and update their profile

#### Optional Extensions to Project Requirements
The following requirements are optional if there is extra time to implement:
* Instead of categorizing the resources manually, the service will scan the contents of the resource and try to categorize it automatically. It can also use this information to set the title and description automatically. In this scenario, the user has to only add the URL.
*  When creating a resource, if it finds the same URL already in the database (by another user), allow them to simply like theirs instead.
* Ability to follow certain users.
* Users receive an email if their resource receives a like or comment.
* Users receive an email if they are followed.
* Facebook-like timeline of resources based on your own activity as well as activity from users that you are following.

### Brainstorming/Plans
Based on the requirements and initial plan, the following RESTful routes were determined necessary:
* `/login` login (not required for demo)
* `/register` register (not required for demo)
* `/` main template (all resources, with filtering)
* `/resources/new` create new resource (title, description, topic, url)
* `/users/:user_id` user's resources template (including likes/follows)
* `/resources/:resource_id` individual item page (with comments, likes, ratings)
* `/users/:user_id/editprofile` update profile

On navbar (fixed), have 
* logo
* `topics` to filter by category
* `search` by title and description
* if logged in, `logout`/`edit profile`/`add url`; otherwise `login`/`register` 


`GET /`
* render home page (list of all resources regardless of log-in, with filtering by topic)

`GET /login`
* render login page if user is not logged in

`POST /login`
* checks if user in db and credentials match
* sets cookie
* redirect to `/`

`GET /register`
* renders registration page if user not logged in

`POST /register`
* create new user if email and username unique
* sets cookie
* redirect to `/`

`GET /resources/new`
* if logged in, renders `/resource/new` page with form to create new resource (url, title, description, topic)
* if not logged in, redirect to `/login`

`POST /resources/new`
* if not logged in, redirect to `/login`
* creates new resource and saves to db (extend: if url not taken)
* redirect to `/resource/:resource_id`

`GET /resources/:resource_id`
* can access if not logged in
* renders `/resource/:resource_id` which has all individual resource data including likes, comments, ratings, creator
* if not logged in, cannot like, rate, or comment
* link to actual url (open in new tab)

`POST /resources/:resource_id/comment`
* only if logged in, otherwise warns you to log in first
* checks resource id and gets user id from cookie
* updates table including date_created

`POST /resources/:resource_id/rating`
* only if logged in, otherwise warns you to log in first
* checks resource id and gets user id from cookie
* updates table (if already rated, update table with new value; if not rated, adds value)

`POST /resources/:resource_id/like`
* only if logged in, otherwise warns you to log in first
* checks resource id and gets user id from cookie
* updates table (if already liked, removes from like table; if not liked, adds them)

`GET /users/:user_id`
* render `user/:user_id` that shows all the resources owned/liked by a user

`GET /users/:user_id/editprofile`
* renders `user/:user_id/editprofile` page which shows use data (username, email and buttons to update, and option to change password)

`PUT /users/:user_id/editprofile`
* updates password as they want 
* (potential extend: update username, email, picture, fav. categories, etc.)

#### User Stories
User stories and scenarios were also created to determine the routes and functionality of the app. These user stores are in the form of "As a _ _ _ _, I want to _ _ _ _ because _ _ _ _." and "Given _ _ _ _ when _ _ _ _ then_ _ _ _."

*As a user I want to make a resource because I want to share it and save it for later.*
Given a field where I can add a resource, when I fill it out with all the required data, then it should show on the all resource page and on my resources page. 

*As a user, I want to view all resources because I want to see what's new to learn.*
Given when I log in/go to home page, when I first see the page with no filtering then I should see the most recent resources regardless of category. 

*As a user, I want to filter all resources because I want to see what's new to learn under a topic I'm interested in.*
Given a filter bar, when I click on a filter button and associated topic, then resources with that filtered topic should show. 

*As a user, I want to be able to link my posts under a category because I want it to be easy for myself and others to find resources relating to a specific topic.*
Given a linked resource page, when categorized then it should group with resources under the same category.

*As a user, I want to be able to like, rate, and comment on a resource so I can remember how I feel about it and help others find quality resources.*
Given the option to like/rate/comment when I do that then I should see some kind of feedback that that has been stored (e.g. icons change color, show in my resources). 

*As a user, I want to view my resources and my liked resources because I want to refer to them in the future.*
Given my page of resources, when I load the page, then I should see all the resources that I have liked or created.

*As a user, I want to be able to login/register to this site because I want to save resources for myself and others.*
Given and login/register page, when I create/login to my account, then it should show a validation that I'm logged in (i.e. show username in nav bar and a logout and edit profile button instead of login/register button) and I should be redirected to the main page. Also my resources and likes should be tied to my account.
