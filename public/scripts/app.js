function createResourceElement(resourceData) {
  const id = resourceData.id;
  const title = resourceData.title;
  const url = resourceData.url;
  const description = resourceData.description;
  const topic = resourceData.topic;
  const creator = resourceData.creator;
  const date = resourceData.date_created;

  let $resource = $('<article>').addClass('resource box')
    .append($('<span>').text(id))
    .append($('<h1>').text(title))
    .append($('<div>').text(url))
    .append($('<p>').text(description))
    .append($('<h4>').text(topic))
    .append($('<span>').text(date))
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

  function fetchFilteredResources (topic) {
    $.ajax({
      url: '/api/resources',
      method: 'GET',
      data: {topic: topic}
    }).done( function(results) {
      console.log(results);
      renderResources(results);
    }).fail(function(err) {
      console.log('Error:', err);
    });
  }

  function handleClick (ev) {
    var $el = $(ev.target);
    var topic = $el.data("topic");
    fetchFilteredResources(topic);
  }

  $('.test-topic').on('click', handleClick);

  $('select').on('change', function () {
    var topic = $(this).val();
    fetchFilteredResources(topic);
  })



});
