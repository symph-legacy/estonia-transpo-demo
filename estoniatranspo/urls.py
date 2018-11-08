"""estoniatranspo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from estoniatranspo.app import views

class OptionalSlashRouter(DefaultRouter):
    def __init__(self, *args, **kwargs):
        super(DefaultRouter, self).__init__(*args, **kwargs)
        self.trailing_slash = '/?'

router = OptionalSlashRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'ride_orders', views.RideOrderViewSet)

router.register(r'issues', views.IssueViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/ride_order/latest', views.LatestRideOrderView.as_view()),
    # url(r'^django/', admin.site.urls),
    url(r'^logout/?$', views.LogoutView.as_view()),
    url(r'^login/$', auth_views.login),
    # url(r'^admin.*$', views.ProtectedTemplateView.as_view(template_name='index.html')),
    url('.*', views.ProtectedTemplateView.as_view(template_name='index.html'))
]
