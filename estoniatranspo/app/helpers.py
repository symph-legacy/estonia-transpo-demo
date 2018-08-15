from datetime import datetime, timedelta

def get_begin_end_time(begin):
    try:
        time_chosen = datetime.strptime(begin, '%H.%M')
        time_chosen_end = time_chosen + timedelta(minutes=15)
    except Exception, e:
        time_chosen = datetime.strptime('08.00', '%H.%M')
        time_chosen_end = time_chosen + timedelta(minutes=15)
        print e

    return (time_chosen.strftime('%H.%M'), time_chosen_end.strftime('%H.%M'))
