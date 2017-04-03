function createResourceElement(resourceData) {
  var { id, title, url, description, topic, creator, date_created } = resourceData;
  var images = {
        science: `<a href="/resources/${id}"><i class="fa fa-flask" aria-hidden="true"></i></a>`,
        history: `<a href="/resources/${id}"><i class="fa fa-hourglass-end" aria-hidden="true"></i></a>`,
        math: `<a href="/resources/${id}"><i class="fa fa-superscript" aria-hidden="true"></i></a>`,
        geography: `<a href="/resources/${id}"><i class="fa fa-globe" aria-hidden="true"></i></a>`
      };

      console.log(images[topic]);

  var $resource = $('<article>').addClass('card box')
    .append($('<div>').addClass('card-image')
      .append($('<figure>').addClass('image is-4by3')
        .append($(images[topic]))))
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

console.log(($('#totalRating').text()));
  if (isNaN($('#totalRating').text())) {
    $('#totalRating').addClass('NaN');
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
        $('#totalRating').removeClass('NaN');
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
       if (results === 'No Cookie') {
         console.log('You need to log in to comment');
       } else {
         let newComment = $('<article>')
         .append($('<p>').text(commentBody))
         .append($('<h4>').text('Posted by: ' + results.username + ' at ' + results.date));
         $('#comments_container').prepend(newComment);
         $('#comment_form textarea').val('');
       }
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




