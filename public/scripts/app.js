function createResourceElement(resourceData) {
  const id = resourceData.id;
  const title = resourceData.title;
  const url = resourceData.url;
  const description = resourceData.description;
  const topic = resourceData.topic;
  const creator = resourceData.creator;
  const date_created = resourceData.date_created;
  // const { id, title, url, description, topic, creator, date_created } = resourceData;

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
  // first delete all resources listed in the container
  $('.resource-wrapper').empty();
  for (var i in resourceObjectofObjects) {
    let $resource = createResourceElement(resourceObjectofObjects[i]);
    $('.resource-wrapper').prepend($resource); // appends it to front
  }
}

$(document).ready(function() {

  function fetchFilteredResources (topicArray, url) {
    $.ajax({
      url: url,
      method: 'GET',
      data: {topic: topicArray}
    }).done( function(results) {
      // console.log(results);
      renderResources(results);
    }).fail(function(err) {
      console.log('Error:', err);
    });
  }

  function handleClick (event) {
    var topicArray = [];
    $.each($('input[name="topic"]:checked'), function() {
      topicArray.push($(this).val());
    });
    if(topicArray.length === 0) {
      topicArray = [null];
    }
    // console.log(topicArray);
    // console.log('location', $(location).attr('pathname'));

    const currentWindow = $(location).attr('pathname');
    if (currentWindow === '/') {
      fetchFilteredResources(topicArray, '/api/resources');
      return;
    } else {
      fetchFilteredResources(topicArray, `/api${currentWindow}resources`);
      return;
    }
  }

  $('#search-bar').find('.filter-form .filter.button').on('click', handleClick);

  $('#search-bar').find('.filter-form .select-all.button').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', true)
    });
  });

  $('#search-bar').find('.filter-form .deselect-all.button').on('click', function() {
    $.each($('input[name="topic"]'), function() {
      $(this).prop('checked', false)
    });
  });

});
