import requests

from lxml import etree
from config import (
    ECOFLEET_ADD_TASK_ENDPOINT,
    ECOFLEET_BASE_URL,
    ECOFLEET_KEY,
    ECOFLEET_UPDATE_TASK_ENDPOINT
)

class EcoFleetAPI():
    def __init__(self, xml, version="2"):
        self.xml = etree.fromstring(xml.strip())
        self.version = version
        self.result = None

    def get_task_id(self):
        task_id = 0
        if self.result is not None:
            task_id = self.result.find('response/tasks/task/id').text

        return task_id

    def send_request(self, url):
        task_id = None
        try:
            r = requests.get(url)
            self.result = etree.fromstring(r.text.encode('utf-8'), etree.XMLParser())
        except Exception, e:
            print "HTTP Request or Parsing Error"
            print e
        
        return task_id

    def add_task(self, xml=None):
        if xml:
            self.xml = etree.fromstring(xml.strip())

        url = ECOFLEET_ADD_TASK_ENDPOINT.format(
            base=ECOFLEET_BASE_URL,
            xml=etree.tostring(self.xml),
            v=self.version,
            key=ECOFLEET_KEY
        )

        self.send_request(url)
        return self.get_task_id()

    def update_task(self, xml=None):
        if xml:
            self.xml = etree.fromstring(xml.strip())

        url = ECOFLEET_UPDATE_TASK_ENDPOINT.format(
            base=ECOFLEET_BASE_URL,
            xml=etree.tostring(self.xml),
            v=self.version,
            key=ECOFLEET_KEY
        )

        self.send_request(url)
        return self.get_task_id()
