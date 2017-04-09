# Chalkboard

## Templates

Main templates
<ul>
<li> `/login` login (not required for demo)
<li> `/register` register (not required for demo)
<li> `/` main template (all resources, with filtering)
<li> `/resources/new` create new resource (title, description, topic, url)
<li> `/users/:user_id` user's resources template (including likes/follows)
<li> `/resources/:resource_id` individual item page (with comments, likes, ratings)
<li> `/users/:user_id/editprofile` update profile
</ul>

On navbar (fixed), have 
<ul>
<li> logo
<li> `topics` and `types` to filter by one category to start (later multiple categories?)
<li> `search` (by title to start) 
<li> `login`/`register` or `logout`/`edit profile`/`add url`(with title and description) (if logged in)
</ul>

Make a new resource as a partial pop-down

## Routes
 blah
<ul>
<li> `/resource/new` create new resource (title, description, topic, url)
<li> `/` main template (all resources, with filtering)
<li> `/user/:user_id` user's resources template (including likes/follows)
<li> `/resource/:resource_id` individual item page (with comments, likes, ratings)
<li> `/login` login (not required for demo)
<li> `/register` register (not required for demo)
<li> `/user/:user_id/editprofile` update profile
</ul>


### `GET /`
<ul>
<li> render home page (list of all resources regardless of log-in, with filtering by topic)
</ul>

### `GET /login`
<ul>
<li> render login page if user is not logged in
<li> 
</ul>

### `POST /login`
<ul>
<li> checks if user in db and credentials match
<li> sets cookie
<li> redirect to `/`
</ul>

### `GET /register`
<ul>
<li> renders registration page if user not logged in
</ul>

### `POST /register`
<ul>
<li> create new user if email and username unique
<li> sets cookie
<li> redirect to `/`
</ul>

### `GET /resources/new`
<ul>
<li> if logged in, renders `/resource/new` page with form to create new resource (url, title, desc., topic, media-type)
<li> if not logged in, redirect to login page
</ul>

### `POST /resources/new`
<ul>
<li> if not logged in, redirect to login page
<li> creates new resource and saves to db (extend: if url not taken)
<li> redirect to `/resource/:resource_id`
</ul>

### `GET /resources/:resource_id`
<ul>
<li> can access if not logged in
<li> renders `/resource/:resource_id` which has all individual resource data including likes, comments, ratings, creator
<li> if not logged in, cannot like, rate, or comment
<li> link to actual url (open in new tab)
</ul>

### `POST /resources/:resource_id/comment`
<ul>
<li> only if logged in, otherwise warns you to log in first
<li> checks resource id and gets user id from cookie
<li> updates table including date_created
</ul>

### `POST /resources/:resource_id/rating`
<ul>
<li> only if logged in, otherwise warns you to log in first
<li> checks resource id and gets user id from cookie
<li> updates table (if already rated, update table with new value; if not rated, adds value)
</ul>

### `POST /resources/:resource_id/like`
<ul>
<li> only if logged in, otherwise warns you to log in first
<li> checks resource id and gets user id from cookie
<li> updates table (if already liked, removes from like table; if not liked, adds them)
</ul>

### `GET /users/:user_id`
<ul>
<li> render `user/:user_id` that shows all the resources owned/liked by a user
</ul>

### `GET /users/:user_id/editprofile`
<ul>
<li> renders `user/:user_id/editprofile` page which shows use data (username, email and buttons to update, and option to change password)
</ul>

### `PUT /users/:user_id/editprofile`
<ul>
<li> updates password as they want 
<li> (potential extend: update username, email, picture, fav. categories, etc.)
</ul>

## User Stories

*"As a ____, I want to ____ because ____."*

User Scenarios

*Given ___ when ___ then___.*

E.g. for Medium.com  
**As a** user **I want to** save a story I'm reading **because** I found it useful.
**Given** that I'm reading a story **when** I tap the icon to save a story, **then** save it to my 'saved stories' **and** alter the icon to indicate success.
> Icon = bookmark icon  
> Design - [url for design/assets]

<dl>
<dt> As a user I want to make a resource because I want to share it and save it for later.
<dd> Given a field where I can add a resource, when I fill it out with all the required data, then it should show on the all resource page and on my resources page. 
</dl>


<dl>
<dt> As a user, I want to view all resources because I want to see what's new to learn.
<dd> Given when I log in/go to home page, when I first see the page with no filtering then I should see the most recent resources regardless of category. 
</dl>

<dl>
<dt> As a user, I want to filter all resources because I want to see what's new to learn under a topic I'm interested in.
<dd> Given a filter bar, when I click on a filter button and associated topic, then resources with that filtered topic should show. 
</dl>

<dl>
<dt>As a user, I want to be able to link my posts under a category because I want it to be easy for myself and others to find resources relating to a specific topic.
<dd> Given a linked resource page, when categorized then it should group with resources under the same category.
</dl>

<dl>
<dt> As a user, I want to be able to like, rate, and comment on a resource so I can remember how I feel about it and help others find quality resources.
<dd> Given the option to like/rate/comment when I do that then I should see some kind of feedback that that has been stored (e.g. icons change color, show in my resources). 
</dl>

<dl>
<dt>As a user, I want to view my resources and my liked resources because I want to refer to them in the future.
<dd> Given my page of resources, when I load the page, then I should see all the resources that I have liked or created.
</dl>

<dl>
<dt>As a user, I want to be able to login/register to this site because I want to save resources for myself and others.
<dd> Given and login/register page, when I create/login to my account, then it should show a validation that I'm logged in (i.e. show username in nav bar and a logout and edit profile button instead of login/register button) and I should be redirected to the main page. Also my resources and likes should be tied to my account.
</dl>




## Questions
<ul>
<li> can user put a resource under their own topic? or are they forced to put it under the original poster's topic?
> leaning towards a set of topics (that we choose) 
<li> tags? 
<li> how should search work? tags? categories? description? 
<li> deletions not in requirements? 
<li> should a person liking an existing resource be able to change the resource?
</ul>









Login/register -> all 'pins' with filters ->



## other notes for future
<ul>
<li> seed database with our own categories
<li> for showing, have 4 incognito windows where each is a different user
<li> tags within categories
<li> non logged in users can see site but not to full features - can only see main page
<li> could show likes/ratings on main page not on just the individual page
<li> on my resources page, could filter by 'my resources' and 'liked resources'
<li> when adding a new link, could select 'type' (video, tutorial, etc) and then someone can filter by that as well
<li> original user can edit their resource (only their owned resources - not just liked) 
<li> filtered by likes, rating, newness
<li> convert ratings to A+, B, etc.
<li> like symbol as A+
</ul>
