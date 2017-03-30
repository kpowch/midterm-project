
exports.seed = function(knex, Promise) {
  return knex('resources').del()
    .then(function () {
      return Promise.all([
        knex('resources').insert({title: 'Numbers for Kids, Counting 1 to 10, Fun Math Game, Learning Videos for Children, Preschoolers',
                                  url: 'https://www.youtube.com/watch?v=pIlIxin6F2M',
                                  description: 'ames Harris Simons has been described as "the world''s smartest billionaire", amassing a fortune through the clever use of mathematics and computers. He is now a renowned philanthropist.',
                                  topic: 'math',
                                  creator: 1,
                                  date_created: 2016-12-17 12:45:02}),

        knex('resources').insert({title: 'Billionaire Mathematician - Numberphile',
                                  url: 'https://www.youtube.com/watch?v=gjVDqfUhXOY',
                                  description: 'James Harris Simons has been described as "the world''s smartest billionaire", amassing a fortune through the clever use of mathematics and computers. He is now a renowned philanthropist.',
                                  topic: 'math',
                                  creator: 1,
                                  date_created: 2016-12-16 12:45:02}),

        knex('resources').insert({title: 'The World''s Best Mathematician (*) - Numberphile',
                                  url: 'https://www.youtube.com/watch?v=MXJ-zpJeY3E',
                                  description: 'Among current mathematicians, many people regard Professor Tao as the world''s finest... Opinions on such things vary, of course. Professor Tao kindly fielded some of our questions, including many submitted by Numberphile viewers.',
                                  topic: 'math',
                                  creator: 2,
                                  date_created: 2016-12-18 12:45:02}),

        knex('resources').insert({title: 'How to embarrass your math teacher',
                                  url: 'https://www.youtube.com/watch?v=jrQwgNxnvS0',
                                  description: 'This is an amazing Math Magic Trick, no preparation needed, can be performed anywhere any time. is very effective but easy. I am loving this trick and I am sure you are gona love it too.',
                                  topic: 'math',
                                  creator: 3,
                                  date_created: 2016-12-18 14:45:02}),

        knex('resources').insert({title: 'The Extraordinary Genius of Albert Einstein',
                                  url: 'https://www.youtube.com/watch?v=Uvpw6Jh1WGQ',
                                  description: 'The core of the video is a workshop pedagogical on the Theory of Special Relativity as part of the educational process conducted by our youth leadership, not for the sake of understanding the theory itself, but using Einstein''s particular discovery as a case study to demonstrate and walk people through real human thinking, as being something above sense perceptions or opinions. We end with reflecting on the principle of relativity in terms of social relations and individual identities or thought processes, asking the question --how was Einstein able to make his breakthrough?',
                                  topic: 'history',
                                  creator: 4,
                                  date_created: 2016-12-18 14:30:02}),

        knex('resources').insert({title: 'Last week Tonight - Lessons in geography',
                                  url: 'https://www.youtube.com/watch?v=Pu1PRyGKggI',
                                  description: 'Last week Tonight - Lessons in geography',
                                  topic: 'geography',
                                  creator: 5,
                                  date_created: 2016-11-18 14:30:02}),

        knex('resources').insert({title: 'Astronomy 150',
                                  url: 'http://web.mit.edu/asf/www/Images/CheatSheetScans/AY150_1.jpg',
                                  description: 'Radiative processes in astrophysics',
                                  topic: 'science',
                                  creator: 1,
                                  date_created: 2016-12-22 14:30:02}),

        knex('resources').insert({title: 'Geometry Cheatsheet',
                                  url: 'http://www.math-salamanders.com/image-files/5th-grade-geometry-geometry-cheat-sheet-1-angles.gif',
                                  description: 'Quickguide for dealing with geometric 2D shapes',
                                  topic: 'math',
                                  creator: 2,
                                  date_created: 2016-12-23 14:30:02}),

        knex('resources').insert({title: 'Royal Society of Biology Blog',
                                  url: 'https://blog.rsb.org.uk/',
                                  description: 'One of the best blog sites from the Royal Society in the UK',
                                  topic: 'science',
                                  creator: 4,
                                  date_created: 2016-12-05 14:30:02}),

        knex('resources').insert({title: 'This Week in Microbiology (TWiM)',
                                  url: 'https://player.fm/series/this-week-in-microbiology-with-vincent-racaniello',
                                  description: 'A podcast about unseen life on Earth hosted by Vincent Racaniello and friends. Following in the path of his successful shows ''This Week in Virology'' (TWiV) and ''This Week in Parasitism'' (TWiP), Racaniello and guests produce an informal yet informative conversation about microbes which is accessible to everyone, no matter what their science background.',
                                  topic: 'science',
                                  creator: 3,
                                  date_created: 2016-12-02 14:30:02}),

        knex('resources').insert({title: 'Top 5 most influential living people who shaped the geo industry of the 21 century',
                                  url: 'http://geoawesomeness.com/top-5-most-influential-living-people-shaping-the-geo-industry-of-the-21-century/',
                                  description: 'Great article on some of the people who influenced me and my career in GIS.',
                                  topic: 'geography',
                                  creator: 3,
                                  date_created: 2016-12-02 20:30:02}),

        knex('resources').insert({title: 'Biology: Cell Structure',
                                  url: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
                                  description: 'This animation shows you the function of plant and animal cells for middle school and high school biology, including organelles like the nucleus, nucleolus, DNA (chromosomes), ribosomes, mitochondria, etc. Also included are ATP molecules, cytoskeleton, cytoplasm, microtubules, proteins, chloroplasts, chlorophyll, cell walls, cell membrane, cilia, flagellae, etc.',
                                  topic: 'science',
                                  creator: 5,
                                  date_created: 2016-12-25 20:30:02})
      ]);
    });
};
