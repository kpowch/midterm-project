function createResourceElement(resourceData) {
  const { id, title, url, description, topic, creator, date_created } = resourceData;

  let $resource = $('<article>').addClass('resource box')
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
    let $resource = createResourceElement(resourceObjectofObjects[i]);
    $('.resource-wrapper').prepend($resource);
  }
}

$(document).ready(function() {

  function fetchFilteredResources (topicArray, url) {
    $.ajax({
      url: url,
      method: 'GET',
      data: {topic: topicArray}
    }).done( function(results) {
      renderResources(results);
    }).fail(function(err) {
      console.log('Error:', err);
    });
  }

  function handleFilterButtonClick (event) {
    let topicArray = [];
    $.each($('input[name="topic"]:checked'), function() {
      topicArray.push($(this).val());
    });
    if(topicArray.length === 0) {
      topicArray = [null];
    }

    const currentWindow = $(location).attr('pathname');
    if (currentWindow === '/') {
      fetchFilteredResources(topicArray, '/api/resources');
      return;
    } else {
      fetchFilteredResources(topicArray, `/api${currentWindow}/resources`);
      return;
    }
  }

  // when someone clicks the 'filter' button on the search bar
  $('#search-bar').find('.filter-form .filter.button').on('click', handleFilterButtonClick);

  // when someone clicks the 'select all' button on the search bar
  $('#search-bar').find('.filter-form .select-all.button').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', true)
    });
  });

  // when someone clicks the 'deselect all' button on the search bar
  $('#search-bar').find('.filter-form .deselect-all.button').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', false)
    });
  });

});
