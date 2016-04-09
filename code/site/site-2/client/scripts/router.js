Router.configure({
  layoutTemplate: 'layout',
  yieldTemplates: {
    'header' : { to: 'header' },
    'footer' : { to: 'footer' }
  }
});

Router.map(function() {
  this.route('homepage', { path: '/' });
  this.route('about');
  this.route('practice');
  this.route('directions');
  this.route('blog');
  this.route('showPost', {
    path: '/blog/:_title',
    waitOn: function() { return Meteor.subscribe('posts'); },
    data: function()  {
      return Posts.findOne({'slug': this.params._title});
    },
    loadingTemplate: 'blogLoading',
    notFoundTemplate: 'postNotFound'
  });
  this.route('contact');
  this.route('notFound', {
    path: '*',
    action: function () {
      this.redirect('homepage');
    }
  });
});
