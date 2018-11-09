from datetime import datetime, timedelta
from rest_framework.permissions import IsAuthenticatedOrReadOnly

def get_begin_end_time(begin):
    try:
        time_chosen = datetime.strptime(begin, '%H.%M')
        time_chosen_end = time_chosen + timedelta(minutes=15)
    except Exception, e:
        time_chosen = datetime.strptime('08.00', '%H.%M')
        time_chosen_end = time_chosen + timedelta(minutes=15)
        print e

    return (time_chosen.strftime('%H.%M'), time_chosen_end.strftime('%H.%M'))


class CustomIsAuthenticatedOrReadOnly(IsAuthenticatedOrReadOnly):
    def has_permission(self, request, view):
        if (request.method in ['POST', 'DELETE'] or
            request.user and
            request.user.is_authenticated()):
            return True
        return False

class IsCustomReadOrWriteOnly(IsAuthenticatedOrReadOnly):
    def has_permission(self, request, view):
        if (request.method in ['GET', 'POST'] or
            request.user and
            request.user.is_authenticated()):
            return True
        return False

