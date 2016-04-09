var pages = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Practice Areas', path: '/practice' },
  { name: 'Maps & Directions', path: '/directions' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact Us', path: '/contact' },
];

Template.nav.pages = function () {
  return pages;
};

Template.footer.pages = function () {
  return pages;
};

Template.blog.posts = function() {
  return Posts.find({}, {sort: {'timestamp': 'desc'}, limit: Session.get('postLimit')}).fetch();
};

Template.blog.more = function() {
  return Posts.find({}).count() > Session.get('postLimit');
};

Template.blog.events = {
  'click #morePosts': function(e) {
    e.preventDefault();
    Session.set('postLimit', Session.get('postLimit') + 7);
  }
};

Template.contact_form.events = {
  'submit': function(e) {
    e.preventDefault();
    var $status = $('#status');
    $status.text('Sending...').animate({opacity: 1});
    var name = e.target[0].value;
    var email = e.target[1].value;
    var phone = e.target[2].value;
    var message = e.target[3].value;
    Meteor.call('emailMessage', name, email, phone, message, function() {
      $status.animate({opacity: 0}, function() {
        $status.text('Thanks for contacting us! We\'ll reach out to you shortly!')
               .animate({opacity: 1});
      });
      $('#contact-form')[0].reset();
    });
  }
};

Posts = new Meteor.Collection('posts');

Meteor.startup(function () {
  Meteor.call('refreshPosts');
  Session.set('postLimit', 7);
});
