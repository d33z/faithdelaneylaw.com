import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { HTTP } from 'meteor/http';
import { Mongo } from 'meteor/mongo';

Posts = new Mongo.Collection('posts');

Meteor.publish('posts', function() {
  return Posts.find({});
});

Meteor.startup(function () {
  var mailgunPassword = '9tundgmu2f03';
  process.env.MAIL_URL = 'smtp://postmaster%40faithdelaneylaw.mailgun.org:'+mailgunPassword+'@smtp.mailgun.org:587/';

  Meteor.call('refreshPosts', function(err, results) {
    if (err) console.log(err);
  });

});

Meteor.methods({
  emailMessage: function(name, email, phone, message) {
    check([name, email, message], [String]);
    this.unblock();
    if (phone) {
      message = message + '\n\nPhone: ' + phone;
    }
    return Email.send({
      to: 'contact@faithdelaneylaw.com',
      from: email,
      subject: 'Inquiry on faithdelaneylaw.com from ' + name,
      text: message
    });
  },
  refreshPosts: function() {
    var tumblrAPI = 'lbHbmRoD39g6tsOXfpeqZuP4FMfYPXVrT9otSmNqFK5Gy3uah3';
    console.log('getting blog posts...');
    var currentPosts = Posts.find({}).fetch();
    console.log('currentPosts:', _(currentPosts).pluck('title'));
    HTTP.get('http://api.tumblr.com/v2/blog/faithdelaneylaw.tumblr.com/posts?api_key=' + tumblrAPI, function(err, results) {
      if (err) {console.log(err);}
      var deleteDiff = _(_(currentPosts).pluck('id')).difference(_(results.data.response.posts).pluck('id'));
      if (deleteDiff.length) {
        _(deleteDiff).each(function(postId) {
          Posts.remove({ id: postId });
        });
      }
      _(results.data.response.posts).each(function(post) {
        if (!Posts.findOne({ id : post.id })) {
          Posts.insert(post);
        }
      });
    });
  }
});
