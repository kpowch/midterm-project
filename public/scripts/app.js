function createResourceElement(resourceData) {
  var { id, title, url, description, topic, creator, date_created } = resourceData;

  var $resource = $('<article>').addClass('resource box')
    .append($('<span>').text(id))
    .append($('<h1>').text(title))
    .append($('<div>').text(url))
    .append($('<p>').text(description))
    .append($('<h4>').text(topic))
    .append($('<span>').text(date_created))
    .append($('<span>').text(creator));

  return $resource;
}

function renderResources(resourceObjectofObjects){
  $('.resource-wrapper').empty(); // deletes all resources on the page

  // then creates the resource object on the page and prepends it to the list
  // TODO will have to sort them by date/time
  for (var i in resourceObjectofObjects) {
    var $resource = createResourceElement(resourceObjectofObjects[i]);
    $('.resource-wrapper').prepend($resource);
  }
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


  function submitInteraction(url) {
    $.ajax({
        url: url,
        method: 'POST',
      }).done(function(results) {
        if (results === 'added') {
          let likesCount =  $('#like').nextAll("#likesCount");
          let currentCount = likesCount.text();
          let NewCount = (new Number(currentCount) + 1);
          $('#like').text('Unlike');
          likesCount.text(NewCount.toString());
        }
        if (results === 'removed'){
          let likesCount =  $('#like').nextAll("#likesCount");
          let currentCount = likesCount.text();
          let NewCount = (new Number(currentCount) - 1);
          $('#like').text('Like');
          likesCount.text(NewCount.toString());
        }
        if (results === 'No Cookie'){
          //TODO update this to flash
          console.log('You need to log in to use this feature');
      }
    });
  }

  function submitComment(url, commentBody) {
    console.log(url);
    // let errorMessage = $('#comment_form h4');

    // if (input.length == 0){
    //   errorMessage.html('Too short!');
    // } else if (input.length > 255) {
    //   errorMessage.html('Too long!');
    // } else if (input == ' '){
    //   errorMessage.html('No blank spaces allowed!');
    // } else {
    //   errorMessage.html('');
    $.ajax({
      url: url,
      method: 'POST',
      data: {
        text: commentBody
      }
    }).done(function(results) {
      console.log('ajax recieved:', results.username, results.date);
      if (results === 'No Cookie') {
        console.log('You need to log in to comment');
      } else {
        console.log('ajax', commentBody);
        let newComment = $('<article>')
        .append($('<p>').text(commentBody))
        .append($('<h4>').text('Posted by: ' + results.username + ' at ' + results.date));
        $('#comments_container').prepend(newComment);
      }
    });
  }

  $('#comment_form').children('input').on('click', function(event) {
    let currentWindow = $(location).attr('pathname');
    let contents = $('#comment_form textarea').val();
    console.log('contents', contents);
    submitComment(`/api${currentWindow}/comment`, contents);
  });

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

  $('#like').on('click', function() {
    let currentWindow = $(location).attr('pathname');
      submitInteraction(`/api${currentWindow}/like`);
  });

  // when someone clicks the 'filter' button on the search bar
  /*
  Gets whatever the user typed in the search bar (string), determines which page
  it's on (All Resources or User Resources) and then calls fetchSearchedResources.
  */
  function handleSearchBarKeystroke (event) {
   // If we don't want to search with every keyup, change to 'keypress' and
   // call next function when event.which === 13 (enter key)
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

  // when someone clicks the 'filter' button on search header
  $('#search-bar').find('.filter-form .filter.button').on('click', handleFilterButtonClick);
  // when someone types in search field on search header
  $('#search-button').on('keyup', handleSearchBarKeystroke);

  // when someone clicks the 'select all' button on the filter header
  $('#search-bar').find('.filter-form .select-all.button').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', true)
    });
  });

  // when someone clicks the 'deselect all' button on the filter header
  $('#search-bar').find('.filter-form .deselect-all.button').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', false)
    });
  });

  // shows/hides the filter header when someone clicks the 'filter by topic' button
  $('#topic-filter-button').on('click', function() {
    $('#search-bar').slideToggle();
  })

});




