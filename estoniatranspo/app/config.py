ECOFLEET_BASE_URL = "https://app.ecofleet.com"
ECOFLEET_KEY = "KH-7cd18a48-89be-49d5"


ECOFLEET_ADD_TASK_ENDPOINT = "{base}/seeme/Api/Tasks/addXml?version={v}&key={key}"
ECOFLEET_UPDATE_TASK_ENDPOINT = "{base}/seeme/Api/Tasks/updateAsXml?version={v}&key={key}"

XML_PARAM = """
    <?xml version="1.0" encoding="utf-8"?>
    <task>
        <externalId>{order_id}</externalId>
        <name></name>
        <timestamp>{timestamp}</timestamp>
        <driver>{driver}</driver>
        <location>
            <address>{target_location_name}</address>
            <latitude>{target_location_lat}</latitude>
            <longitude>{target_location_lng}</longitude>
        </location>
        <description>{name} {target_location_name}</description>
        <timewindowbegin>{time_chosen}</timewindowbegin>
        <timewindowend>{time_chosen_end}</timewindowend>
        <customerName>{name}</customerName>
    </task>"""

XML_UPDATE_PARAM = """
    <?xml version="1.0" encoding="utf-8"?>
    <task>
        <id>{task_id}</id>
        <externalId>{order_id}</externalId>
        <name></name>
        <timestamp>{timestamp}</timestamp>
        <driver>{driver}</driver>
        <location>
            <address>{target_location_name}</address>
            <latitude>{target_location_lat}</latitude>
            <longitude>{target_location_lng}</longitude>
        </location>
        <description>{name} {target_location_name}</description>
        <timewindowbegin>{time_chosen}</timewindowbegin>
        <timewindowend>{time_chosen_end}</timewindowend>
        <customerName>{name}</customerName>
    </task>"""