let resourceData = {
  "title": "Generic",
  "url": "www.example.com",
  "description": "This is a test.",
  "topic": "Math",
  "creator": 4,
  "date_created": 03/30/2017
};

let resources = [];

//a function that takes data and appends it to elements on /:resource_id

function createResourceElement(resourceData) {
  const title = resourceData.title;
  const url = resourceData.url;
  const description = resourceData.description;
  const topic = resourceData.topic;
  const creator = resourceData.creator;
  const date = resourceData.date_created;

  let $resource = $('<article>').addClass('resources')
    .append($('<h1>').text(title))
    .append($('<div>').text(url))
    .append($('<p>').text(description))
    .append($('<h4>').text(topic))
    .append($('<span>').text(date));

  let renderedResource = $('<resource-container>').append($resource);
  return renderedResource;
}



$(document).ready(function() {

  // function loadResources() {
  //   $.ajax({
  //     url: '/:resource_id',
  //     method: 'GET'
  //   }).success(function(resources){
  //     createResourceElement(resources);
  //   })
  // }

  // loadResources();

  //createResourceElement(resourceData);

});
