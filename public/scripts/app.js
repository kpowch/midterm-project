function createResourceElement(resourceData) {
  var { id, title, url, description, topic, creator, date_created } = resourceData;

  var $resource = $('<article>').addClass('card box')
    .append($('<div>').addClass('card-image')
      .append($('<figure>').addClass('image is-4by3')
        .append($('<img>').attr('src', "http://placehold.it/300x225"))))
    .append($('<div>').addClass('card-content')
      .append($('<h1>').text(title))
      .append($('<div>').addClass('content')
        .append($('<span>').addClass('tag is-dark').text(topic))
        .append($('<strong>').addClass('timestamp').text(date_created)
        )
      )
    )

  return $resource;
}

function renderResources(resourceObjectofObjects) {
  $('.main-content-wrapper.resources').empty(); // deletes all resources on the page

  // then creates the resource object on the page and prepends it to the list
  // TODO will have to sort them by date/time
  for (var i in resourceObjectofObjects) {
    var $resource = createResourceElement(resourceObjectofObjects[i]);
    $('.main-content-wrapper.resources').append($resource);
  }
  $('.main-content-wrapper.resources').append(
    $('<article>').addClass('card box placeholder')
  );
  $('.main-content-wrapper.resources').append(
    $('<article>').addClass('card box placeholder')
  );
}

$(document).ready(function() {
  /*
  Sends ajax call depending on what page the user is on (All Resources or My Resources)
  and sends the array of topics that are checked.
  */




  function fetchFilteredResources (topicArray, url) {
    $.ajax({
      url: url,
      method: 'GET',
      data: {topic: topicArray}
    }).done(function(results) {
      renderResources(results);
    }).fail(function(err) {
      console.log('Error:', err);
    });
  }

  /*
  Gets an array of all the topics on the filter header that are checked, determines
  which page it's on (All Resources or User Resources) and then calls fetchFilteredResources.
  */
  function handleFilterButtonClick (event) {
    var topicArray = [];
    $.each($('input[name="topic"]:checked'), function() {
      topicArray.push($(this).val());
    });
    if(topicArray.length === 0) {
      topicArray = [null];
    }

    var currentWindow = $(location).attr('pathname');
    if (currentWindow === '/') {
      fetchFilteredResources(topicArray, '/api/resources/filter');
      return;
    } else {
      fetchFilteredResources(topicArray, `/api${currentWindow}/resources/filter`);
      return;
    }
  }

  /*
  Sends ajax call depending on what page the user is on (All Resources or My Resources)
  and sends the search string they entered into the search bar.
  */
  function fetchSearchedResources (searchString, url) {
    $.ajax({
      url: url,
      method: 'GET',
      data: {search: searchString}
    }).done( function(results) {
      renderResources(results);
    }).fail(function(err) {
      console.log('Error:', err);
    });
  }


  function handleRating (url, rating) {
    console.log('sending ajax request ', rating);
    $.ajax({
        url: url,
        method: 'POST',
        data: {rating: rating}
      }).done(function(results) {
        console.log('ajax recieved:', results);
        if (results === 'No Cookie'){
          //TODO update this to flash
          console.log('You need to log in to use this feature');
      } else {
        $('#totalRating').text(results);
      }
    });
  }

  $('#rating').children().on('click', function(event) {

    console.log('select!');
    var rating = $(this).text();
    var currentWindow = $(location).attr('pathname');
    handleRating(`/api${currentWindow}/rating`, rating);
  });

  function handleLike(url) {
    $.ajax({
        url: url,
        method: 'POST'
      }).done(function(results) {
        if (results === 'added') {
          var likesCount =  $('#like').nextAll("#likesCount");
          var currentCount = likesCount.text();
          var NewCount = (new Number(currentCount) + 1);
          $('#like').text('Unlike');
          likesCount.text(NewCount.toString());
        }
        if (results === 'removed'){
          var likesCount =  $('#like').nextAll("#likesCount");
          var currentCount = likesCount.text();
          var NewCount = (new Number(currentCount) - 1);
          $('#like').text('Like');
          likesCount.text(NewCount.toString());
        }
        if (results === 'No Cookie'){
          //TODO update this to flash
          console.log('You need to log in to use this feature');
      }
    });
  }

  $('#like').on('click', function() {
    var currentWindow = $(location).attr('pathname');
      handleLike(`/api${currentWindow}/like`);
  });

  function submitComment(url, commentBody) {
   if (commentBody.length === 0) {
     console.log('Too short!');
   } else if (commentBody.length > 255) {
     console.log('Too long!');
   } else if (commentBody == ' ') {
     console.log('No blank spaces allowed!');
   } else {
     $.ajax({
       url: url,
       method: 'POST',
       data: {
         text: commentBody
       }
     }).done(function(results) {
       console.log(results);
       var newComment = $('<article class="comment-content">')
       .append($('<p class="comment-words">').text(commentBody))
       .append($('<h4 class="commenter">').text(results.username))
       .append($('<h4 class="comment-time">').text(results.date));
       $('#comments-container').prepend(newComment);
       $('#comment_form textarea').val('');
     });
   }
 }


$('#comment_form').children('input').on('click', function(event) {
   let currentWindow = $(location).attr('pathname');
   let contents = $('#comment_form textarea').val();
   submitComment(`/api${currentWindow}/comment`, contents);
 });

  // when someone clicks the 'filter' button on the search bar
  /*
  Gets whatever the user typed in the search bar (string), determines which page
  it's on (All Resources or User Resources) and then calls fetchSearchedResources.
  */
  function handleSearchBarKeystroke (event) {
   // If we don't want to search with every keyup, change to 'keypress' and
   // call next function when event.which === 13 (enter key)
   $.each($('input[name="topic"]'), function() {
     $(this).prop('checked', true)
   });

   var searchString = $(this).find('input').val();

   var currentWindow = $(location).attr('pathname');
   if (currentWindow === '/') {
     fetchSearchedResources(searchString, '/api/resources/search');
     return;
   } else {
     fetchSearchedResources(searchString, `/api${currentWindow}/resources/search`);
     return;
   }
  }

  // TODO when filtering, clear search field
  // when someone clicks the 'filter' button on search header
  $('#search-bar').find('#filter-field .button.filter').on('click', handleFilterButtonClick);
  // when someone types in search field on search header
  $('#search-bar #search-field').on('keyup', handleSearchBarKeystroke);

  // when someone clicks the 'select all' button on the filter header
  $('#search-bar').find('#filter-field .button.select-all').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', true)
    });
  });

  // when someone clicks the 'deselect all' button on the filter header
  $('#search-bar').find('#filter-field .button.deselect-all').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', false)
    });
  });

  // shows/hides the filter header when someone clicks the 'filter by topic' button
  $('#topic-filter-button').on('click', function() {
    $('#search-bar').slideToggle();
  })

});
